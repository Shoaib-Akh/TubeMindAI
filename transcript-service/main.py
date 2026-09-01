from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
import os
import requests
import xml.etree.ElementTree as ET
import uvicorn
import html

app = FastAPI(
    title="TubeMind YouTube Transcript Microservice",
    description="High-performance self-hosted transcript extraction API for YouTube videos",
    version="1.0.0"
)

# Enable CORS for Next.js app and client requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_proxy_dict():
    proxy_url = os.environ.get("YOUTUBE_PROXY") or os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY") or os.environ.get("PROXY_URL")
    if proxy_url:
        return {"http": proxy_url, "https": proxy_url}
    return None

def fetch_innertube_captions(video_id: str, lang_req: str = "auto"):
    """
    Direct InnerTube Android Client request.
    Works seamlessly and bypasses typical cloud web-client blocks.
    """
    clients = [
        {
            "clientName": "ANDROID",
            "clientVersion": "20.10.38",
            "userAgent": "com.google.android.youtube/20.10.38 (Linux; U; Android 14)",
        },
        {
            "clientName": "IOS",
            "clientVersion": "19.45.4",
            "userAgent": "com.google.ios.youtube/19.45.4 (iPhone16,2; U; CPU OS 17_5_1 like Mac OS X)",
        }
    ]
    
    proxies = get_proxy_dict()

    for client in clients:
        try:
            url = "https://www.youtube.com/youtubei/v1/player?prettyPrint=false"
            headers = {
                "Content-Type": "application/json",
                "User-Agent": client["userAgent"],
            }
            payload = {
                "context": {
                    "client": {
                        "clientName": client["clientName"],
                        "clientVersion": client["clientVersion"],
                        "hl": lang_req if lang_req and lang_req != "auto" else "en",
                        "gl": "US",
                    }
                },
                "videoId": video_id
            }
            
            r = requests.post(url, json=payload, headers=headers, proxies=proxies, timeout=8)
            if r.status_code != 200:
                continue
                
            data = r.json()
            caption_tracks = data.get("captions", {}).get("playerCaptionsTracklistRenderer", {}).get("captionTracks", [])
            if not caption_tracks:
                continue
                
            # Pick requested language or first available
            selected_track = caption_tracks[0]
            if lang_req and lang_req != "auto":
                for t in caption_tracks:
                    if t.get("languageCode") == lang_req:
                        selected_track = t
                        break
                        
            base_url = selected_track.get("baseUrl")
            if not base_url:
                continue
                
            detected_lang = selected_track.get("languageCode", "en")
            
            # Fetch timedtext XML
            res = requests.get(base_url, headers={"User-Agent": "Mozilla/5.0"}, proxies=proxies, timeout=8)
            if res.status_code != 200 or not res.text:
                continue
                
            root = ET.fromstring(res.text)
            segments = []
            full_text = []
            
            # Format 1: srv3 (<p t="ms" d="ms"><s>word</s></p>)
            p_elements = root.findall(".//p")
            if p_elements:
                for p in p_elements:
                    t = p.attrib.get("t")
                    d = p.attrib.get("d", "2500")
                    if t is None:
                        continue
                    start = float(t) / 1000.0
                    duration = float(d) / 1000.0
                    
                    text_pieces = []
                    for s in p.findall("s"):
                        if s.text:
                            text_pieces.append(s.text)
                    if not text_pieces and p.text:
                        text_pieces.append(p.text)
                        
                    line = html.unescape("".join(text_pieces)).strip()
                    if line:
                        segments.append({
                            "text": line,
                            "start": start,
                            "duration": duration,
                            "offset": int(t),
                            "dur": int(d)
                        })
                        full_text.append(line)
            else:
                # Format 2: classic (<text start="s" dur="s">word</text>)
                for text_el in root.findall(".//text"):
                    start_str = text_el.attrib.get("start", "0.0")
                    dur_str = text_el.attrib.get("dur", "2.5")
                    start = float(start_str)
                    duration = float(dur_str)
                    raw_text = text_el.text or ""
                    line = html.unescape(raw_text).strip()
                    if line:
                        segments.append({
                            "text": line,
                            "start": start,
                            "duration": duration,
                            "offset": int(start * 1000),
                            "dur": int(duration * 1000)
                        })
                        full_text.append(line)
                        
            if segments:
                return {
                    "success": True,
                    "videoId": video_id,
                    "language": detected_lang,
                    "isGenerated": True,
                    "totalSegments": len(segments),
                    "segments": segments,
                    "fullText": " ".join(full_text)
                }
        except Exception:
            continue
            
    return None

def get_transcript_list_universal(video_id: str, proxies=None):
    """Compatible with both youtube-transcript-api 0.6.x and 1.x"""
    if hasattr(YouTubeTranscriptApi, 'list_transcripts'):
        return YouTubeTranscriptApi.list_transcripts(video_id, proxies=proxies)
    api = YouTubeTranscriptApi(proxies=proxies) if callable(YouTubeTranscriptApi) else YouTubeTranscriptApi
    if hasattr(api, 'list'):
        return api.list(video_id)
    raise Exception("Could not find list_transcripts method on YouTubeTranscriptApi")

@app.get("/")
def health_check():
    return {
        "status": "healthy",
        "service": "TubeMind Transcript Microservice",
        "version": "1.0.0"
    }

@app.get("/api/transcript")
def get_transcript(
    videoId: str = Query(..., description="YouTube Video ID (11 characters)"),
    lang: str = Query("auto", description="Language code (e.g. en, hi, ur, auto)")
):
    """
    Extracts transcript for a YouTube video.
    Supports auto-detection, multi-language fallbacks, and auto-generated captions.
    """
    if not videoId or len(videoId) < 5:
        raise HTTPException(status_code=400, detail="Invalid YouTube Video ID")

    # Tier 1: InnerTube Direct (Android/iOS)
    innertube_result = fetch_innertube_captions(videoId, lang)
    if innertube_result:
        return innertube_result

    # Tier 2: YouTubeTranscriptApi (with optional proxy)
    proxies = get_proxy_dict()
    try:
        transcript_list = get_transcript_list_universal(videoId, proxies=proxies)
        
        selected_transcript = None
        detected_lang = "en"
        
        if lang and lang != "auto":
            try:
                selected_transcript = transcript_list.find_transcript([lang])
                detected_lang = lang
            except Exception:
                pass

        if not selected_transcript:
            preferred_langs = ['en', 'hi', 'ur', 'es', 'fr', 'de', 'ar', 'pt', 'ru', 'ja', 'zh-Hans']
            try:
                selected_transcript = transcript_list.find_transcript(preferred_langs)
                detected_lang = getattr(selected_transcript, 'language_code', 'en')
            except Exception:
                for t in transcript_list:
                    selected_transcript = t
                    detected_lang = getattr(t, 'language_code', 'en')
                    break

        if selected_transcript:
            raw_items = selected_transcript.fetch()
            segments = []
            full_text_list = []
            
            for item in raw_items:
                if isinstance(item, dict):
                    text = item.get("text", "").strip()
                    start = float(item.get("start", 0.0))
                    duration = float(item.get("duration", 2.5))
                else:
                    text = getattr(item, "text", "").strip()
                    start = float(getattr(item, "start", 0.0))
                    duration = float(getattr(item, "duration", 2.5))

                if not text:
                    continue
                    
                segments.append({
                    "text": html.unescape(text),
                    "start": start,
                    "duration": duration,
                    "offset": int(start * 1000),
                    "dur": int(duration * 1000)
                })
                full_text_list.append(html.unescape(text))

            is_gen = getattr(selected_transcript, 'is_generated', True)

            return {
                "success": True,
                "videoId": videoId,
                "language": detected_lang,
                "isGenerated": is_gen,
                "totalSegments": len(segments),
                "segments": segments,
                "fullText": " ".join(full_text_list)
            }

    except Exception:
        pass

    raise HTTPException(status_code=404, detail="No transcript found for this video.")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
