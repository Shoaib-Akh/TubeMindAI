import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";
import { NormalizedTranscript } from "@/types/transcript";
import { AI_PERSONAS } from "@/types/persona";

const questionSchema = z.object({
  transcript: z.any(),
  question: z.string().min(1, "Question is required."),
  personaId: z.string().optional(),
  language: z.string().optional(),
  history: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = questionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: true,
          message: parseResult.error.errors[0]?.message || "Invalid question parameters.",
        },
        { status: 400 }
      );
    }

    const { transcript, question, personaId = "general", language = "en", history } = parseResult.data;
    const persona = AI_PERSONAS.find((p) => p.id === personaId) || AI_PERSONAS[0];

    const ai = getAIProvider();
    
    // In question answering, pass persona system prompt and target language
    const result = await (ai as any).answerQuestionWithPersona
      ? (ai as any).answerQuestionWithPersona(transcript, question, persona, language, history)
      : ai.answerQuestion(transcript as NormalizedTranscript, question, history);

    return NextResponse.json({
      success: true,
      personaId: persona.id,
      personaName: persona.name,
      ...result,
    });
  } catch (err: any) {
    console.error("AI QA API Error:", err);
    return NextResponse.json(
      {
        error: true,
        message: err.message || "Failed to generate answer",
      },
      { status: 500 }
    );
  }
}
