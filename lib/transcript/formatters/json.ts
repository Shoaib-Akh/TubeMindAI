import { NormalizedTranscript } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";

export function generateTranscriptJson(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata): string {
  return JSON.stringify(
    {
      version: "1.0",
      generatedBy: "TubeMind AI (https://tubemind.ai)",
      metadata: metadata || null,
      transcript: {
        language: transcript.language,
        languageName: transcript.languageName,
        totalSegments: transcript.totalSegments,
        totalWords: transcript.totalWords,
        totalDurationSeconds: transcript.totalDurationSeconds,
        segments: transcript.segments,
      },
    },
    null,
    2
  );
}
