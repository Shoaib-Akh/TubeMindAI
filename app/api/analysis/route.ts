import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";
import { NormalizedTranscript } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";

const requestSchema = z.object({
  transcript: z.object({
    videoId: z.string(),
    language: z.string(),
    segments: z.array(z.any()),
    fullText: z.string(),
    cleanText: z.string(),
    totalDurationSeconds: z.number(),
    totalWords: z.number(),
  }),
  metadata: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: true,
          message: "Valid transcript data is required for video analysis.",
        },
        { status: 400 }
      );
    }

    const { transcript, metadata } = parseResult.data;
    const ai = getAIProvider();
    const analysis = await ai.generateAnalysis(
      transcript as unknown as NormalizedTranscript,
      metadata as unknown as YouTubeVideoMetadata
    );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    console.error("AI Analysis API Error:", err);
    return NextResponse.json(
      {
        error: true,
        message: err.message || "Failed to generate video analysis",
      },
      { status: 500 }
    );
  }
}
