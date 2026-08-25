import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";
import { NormalizedTranscript } from "@/types/transcript";
import { ScriptType } from "@/types/ai";

const scriptSchema = z.object({
  transcript: z.any(),
  scriptType: z.enum([
    "original",
    "clean",
    "rewritten",
    "youtube",
    "voiceover",
    "shorts_30s",
    "shorts_60s",
    "shorts_90s",
  ]),
  metadata: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = scriptSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: true,
          message: parseResult.error.errors[0]?.message || "Invalid script request parameters.",
        },
        { status: 400 }
      );
    }

    const { transcript, scriptType, metadata } = parseResult.data;
    const ai = getAIProvider();
    const script = await ai.generateScript(
      transcript as NormalizedTranscript,
      scriptType as ScriptType,
      metadata
    );

    return NextResponse.json({
      success: true,
      script,
    });
  } catch (err: any) {
    console.error("AI Script API Error:", err);
    return NextResponse.json(
      {
        error: true,
        message: err.message || "Failed to generate script",
      },
      { status: 500 }
    );
  }
}
