from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi
import os
import uvicorn

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

def get_transcript_list_universal(video_id: str):
    """Compatible with both youtube-transcript-api 0.6.x and 1.x"""
    if hasattr(YouTubeTranscriptApi, 'list_transcripts'):
        return YouTubeTranscriptApi.list_transcripts(video_id)
    api = YouTubeTranscriptApi() if callable(YouTubeTranscriptApi) else YouTubeTranscriptApi
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

    try:
        # 1. List all available transcripts (manual & auto-generated)
        transcript_list = get_transcript_list_universal(videoId)
        
        selected_transcript = None
        detected_lang = "en"
        
        # If a specific language is requested and not 'auto'
        if lang and lang != "auto":
            try:
                selected_transcript = transcript_list.find_transcript([lang])
                detected_lang = lang
            except Exception:
                pass

        # If not found or auto requested, pick the best available
        if not selected_transcript:
            preferred_langs = ['en', 'hi', 'ur', 'es', 'fr', 'de', 'ar', 'pt', 'ru', 'ja', 'zh-Hans']
            try:
                selected_transcript = transcript_list.find_transcript(preferred_langs)
                detected_lang = getattr(selected_transcript, 'language_code', 'en')
            except Exception:
                # Fallback: grab the first available transcript
                for t in transcript_list:
                    selected_transcript = t
                    detected_lang = getattr(t, 'language_code', 'en')
                    break

        if not selected_transcript:
            raise HTTPException(status_code=404, detail="No transcripts or captions available for this video.")

        # 2. Fetch raw transcript items
        raw_items = selected_transcript.fetch()
        
        # 3. Format segments
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
                "text": text,
                "start": start,
                "duration": duration,
                "offset": int(start * 1000),
                "dur": int(duration * 1000)
            })
            full_text_list.append(text)

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

    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "TranscriptsDisabled" in err_msg or "Subtitles are disabled" in err_msg:
            raise HTTPException(status_code=422, detail="Subtitles and transcripts are disabled for this video.")
        if "NoTranscriptFound" in err_msg:
            raise HTTPException(status_code=404, detail="No transcript found matching the requested criteria.")
        if "VideoUnavailable" in err_msg:
            raise HTTPException(status_code=404, detail="This YouTube video is unavailable or private.")
        raise HTTPException(status_code=500, detail=f"Transcript extraction error: {err_msg}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
