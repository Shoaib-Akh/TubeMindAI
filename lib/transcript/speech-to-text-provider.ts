import Groq from "groq-sdk";
import ytdl from "@distube/ytdl-core";
import { NormalizedTranscript, RawTranscriptItem } from "@/types/transcript";
import { normalizeTranscript } from "./normalizer";

/**
 * Speech-to-Text Fallback Provider using Groq Whisper Large V3
 * Runs when YouTube video creator has disabled captions/subtitles or direct scraping fails.
 */
export class SpeechToTextFallbackProvider {
  private groq: Groq;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GROQ_API_KEY || process.env.STT_API_KEY || "";
    if (!key) {
      throw new Error("GROQ_API_KEY or STT_API_KEY is missing. Please set it in environment variables.");
    }
    this.groq = new Groq({ apiKey: key });
  }

  async transcribeVideo(videoId: string, language?: string): Promise<NormalizedTranscript> {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const proxyUrl =
      process.env.YOUTUBE_PROXY ||
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY ||
      process.env.PROXY_URL;

    let agent: any = undefined;
    if (proxyUrl) {
      try {
        agent = ytdl.createProxyAgent({ uri: proxyUrl });
      } catch (e) {
        console.warn("[STT] Failed to create ytdl proxy agent:", e);
      }
    }

    // 1. Download lowest audio stream to stay well below payload limits
    const audioStream = ytdl(videoUrl, {
      quality: "lowestaudio",
      filter: "audioonly",
      agent,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    if (chunks.length === 0) {
      throw new Error("Failed to extract audio stream from YouTube video.");
    }

    const audioBuffer = Buffer.concat(chunks);
    const file = new File([audioBuffer], `${videoId}.m4a`, { type: "audio/m4a" });

    // 2. Transcribe via Groq Whisper Large V3
    const response = await this.groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "verbose_json",
      language: language && language !== "auto" && language.length === 2 ? language : undefined,
    });

    // 3. Convert Groq verbose_json segments to RawTranscriptItems
    const rawItems: RawTranscriptItem[] = (response as any).segments?.map((seg: any) => ({
      text: seg.text?.trim() || "",
      duration: Math.max(1, Math.round((seg.end - seg.start) * 1000)),
      offset: Math.round(seg.start * 1000),
      lang: (response as any).language || language || "en",
    })) || [
      {
        text: response.text || "",
        duration: 5000,
        offset: 0,
        lang: (response as any).language || language || "en",
      },
    ];

    const detectedLang = (response as any).language || language || "en";

    return normalizeTranscript(
      rawItems,
      videoId,
      detectedLang,
      `AI Whisper (${detectedLang})`,
      true
    );
  }
}
