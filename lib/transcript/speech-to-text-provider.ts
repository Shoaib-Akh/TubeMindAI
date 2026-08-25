import { ISpeechToTextProvider } from "./types";
import { NormalizedTranscript } from "@/types/transcript";

/**
 * Speech-to-Text Fallback Provider Architecture
 * Ready for future Whisper / Deepgram / AssemblyAI integration
 */
export class SpeechToTextFallbackProvider implements ISpeechToTextProvider {
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.STT_API_KEY;
  }

  async transcribeAudio(
    audioUrlOrStream: string | Buffer,
    language?: string
  ): Promise<NormalizedTranscript> {
    if (!this.apiKey) {
      throw new Error(
        "Speech-to-Text fallback is currently disabled or unconfigured in this deployment."
      );
    }

    // Extensible hook for Whisper API / Deepgram
    throw new Error(
      "STT fallback processing is queued behind a feature flag for long audio."
    );
  }
}
