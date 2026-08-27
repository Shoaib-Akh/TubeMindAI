import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseYouTubeUrl } from "@/lib/youtube/url-parser";
import { getTranscriptProvider, TranscriptError } from "@/lib/transcript";

const requestSchema = z.object({
  url: z.string().min(1, "YouTube URL or Video ID is required"),
  language: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: true,
          code: "INVALID_URL",
          message: parseResult.error.errors[0]?.message || "Invalid input",
        },
        { status: 400 }
      );
    }

    const { url, language } = parseResult.data;
    const parsed = parseYouTubeUrl(url);

    if (!parsed.isValid || !parsed.videoId) {
      return NextResponse.json(
        {
          error: true,
          code: "INVALID_URL",
          message: "Please enter a valid YouTube video URL or 11-character Video ID.",
          suggestion: "Examples: https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ",
        },
        { status: 400 }
      );
    }

    const provider = getTranscriptProvider();

    // 1. Get video metadata
    const metadata = await provider.getVideoMetadata(parsed.videoId);

    // 2. Get normalized transcript
    const transcript = await provider.getTranscript(parsed.videoId, language);

    // Update metadata with actual transcript duration
    if (transcript.totalDurationSeconds > 0) {
      metadata.durationSeconds = transcript.totalDurationSeconds;
      const { formatDuration } = await import("@/lib/utils");
      metadata.durationFormatted = formatDuration(transcript.totalDurationSeconds);
    }

    return NextResponse.json({
      success: true,
      metadata,
      transcript,
    });
  } catch (err: any) {
    if (err instanceof TranscriptError) {
      return NextResponse.json(
        {
          error: true,
          code: err.code,
          message: err.message,
          suggestion: err.suggestion,
          debug: err.debug,
        },
        { status: 422 }
      );
    }

    console.error("Transcript API Error:", err);
    return NextResponse.json(
      {
        error: true,
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while processing the transcript. Please try again.",
      },
      { status: 500 }
    );
  }
}
