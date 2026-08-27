import Groq from "groq-sdk";
import ytdl from "@distube/ytdl-core";
import { NormalizedTranscript, RawTranscriptItem } from "@/types/transcript";
import { normalizeTranscript } from "./normalizer";

/**
 * Speech-to-Text Fallback Provider using Groq Whisper Large V3
 * Runs when YouTube video creator has disabled captions/subtitles.
 */
export class SpeechToTextFallbackProvider {
  private groq: Groq;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GROQ_API_KEY || process.env.STT_API_KEY || "";
    this.groq = new Groq({ apiKey: key });
  }

  async transcribeVideo(videoId: string, language?: string): Promise<NormalizedTranscript> {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 1. Download lowest audio stream to stay well below payload limits
    const audioStream = ytdl(videoUrl, {
      quality: "lowestaudio",
      filter: "audioonly",
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
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
