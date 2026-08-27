import { VideoAnalysisResult, GeneratedScript, ScriptType } from "@/types/ai";
import { NormalizedTranscript } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";
import { AIAssistantPersona } from "@/types/persona";
import { AI_ANALYSIS_SYSTEM_PROMPT, SCRIPT_GENERATION_PROMPTS } from "./prompts";
import { chunkTranscript } from "./chunking";
import { aiCache } from "@/lib/cache/ai-cache";

import Groq from "groq-sdk";

export interface IAIProvider {
  generateAnalysis(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata, targetLanguage?: string): Promise<VideoAnalysisResult>;
  generateScript(transcript: NormalizedTranscript, scriptType: ScriptType, metadata?: YouTubeVideoMetadata, targetLanguage?: string): Promise<GeneratedScript>;
  answerQuestion(transcript: NormalizedTranscript, question: string, history?: Array<{ role: string; content: string }>): Promise<{ answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> }>;
  answerQuestionWithPersona(
    transcript: NormalizedTranscript,
    question: string,
    persona: AIAssistantPersona,
    language?: string,
    history?: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> }>;
}

export class AIProvider implements IAIProvider {
  private openAiKey?: string;
  private geminiKey?: string;
  private groq?: Groq;

  constructor() {
    this.openAiKey = process.env.OPENAI_API_KEY;
    this.geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || process.env.STT_API_KEY;
    if (groqKey) {
      this.groq = new Groq({ apiKey: groqKey });
    }
  }

  async generateAnalysis(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): Promise<VideoAnalysisResult> {
    const cacheKey = aiCache.generateKey(`analysis:${targetLanguage}:${transcript.videoId}`, transcript.fullText);
    const cached = aiCache.get<VideoAnalysisResult>(cacheKey);
    if (cached) {
      return cached;
    }

    let result: VideoAnalysisResult;

    if (this.openAiKey) {
      result = await this.callOpenAIForAnalysis(transcript, metadata, targetLanguage);
    } else if (this.groq) {
      result = await this.callGroqForAnalysis(transcript, metadata, targetLanguage);
    } else {
      result = this.generateHeuristicAnalysis(transcript, metadata, targetLanguage);
    }

    aiCache.set(cacheKey, result);
    return result;
  }

  async generateScript(transcript: NormalizedTranscript, scriptType: ScriptType, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): Promise<GeneratedScript> {
    const cacheKey = aiCache.generateKey(`script:${scriptType}:${targetLanguage}:${transcript.videoId}`, transcript.fullText);
    const cached = aiCache.get<GeneratedScript>(cacheKey);
    if (cached) {
      return cached;
    }

    let script: GeneratedScript;

    if (this.openAiKey) {
      script = await this.callOpenAIForScript(transcript, scriptType, metadata, targetLanguage);
    } else if (this.groq) {
      script = await this.callGroqForScript(transcript, scriptType, metadata, targetLanguage);
    } else {
      script = this.generateHeuristicScript(transcript, scriptType, metadata, targetLanguage);
    }

    aiCache.set(cacheKey, script);
    return script;
  }

  async answerQuestion(
    transcript: NormalizedTranscript,
    question: string,
    history?: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> }> {
    return this.answerQuestionWithPersona(
      transcript,
      question,
      {
        id: "general",
        name: "TubeMind Core Analyst",
        description: "Balanced video intelligence",
        badge: "Default",
        avatarIcon: "Sparkles",
        systemPrompt: "You are TubeMind AI. Answer accurately based on the transcript with timestamps [MM:SS].",
        sampleQuestions: [],
      },
      "en",
      history
    );
  }

  async answerQuestionWithPersona(
    transcript: NormalizedTranscript,
    question: string,
    persona: AIAssistantPersona,
    language: string = "en",
    history?: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> }> {
    if (this.openAiKey) {
      return this.callOpenAIForQAWithPersona(transcript, question, persona, language, history);
    } else if (this.groq) {
      return this.callGroqForQAWithPersona(transcript, question, persona, language, history);
    }

    return this.generateHeuristicQAWithPersona(transcript, question, persona, language);
  }

  // --- OpenAI Implementations ---
  private async callOpenAIForAnalysis(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): Promise<VideoAnalysisResult> {
    const chunks = chunkTranscript(transcript.segments, 3000);
    const textContext = chunks[0]?.text || transcript.cleanText;

    const langInstruction = targetLanguage === "ur"
      ? "Write all summaries, key takeaways, topics, and analysis strictly in fluent, natural Urdu (اردو)."
      : targetLanguage === "hi"
      ? "Write all summaries and points in Hindi (हिन्दी)."
      : targetLanguage === "ar"
      ? "Write all summaries and points in Arabic (العربية)."
      : targetLanguage === "es"
      ? "Write all summaries and points in Spanish (Español)."
      : "";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${AI_ANALYSIS_SYSTEM_PROMPT}\n${langInstruction}` },
          {
            role: "user",
            content: `Video Title: ${metadata?.title || "Unknown"}\nChannel: ${metadata?.channelName || "Unknown"}\nDuration: ${transcript.totalDurationSeconds}s\n\nTranscript:\n${textContext}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      return this.generateHeuristicAnalysis(transcript, metadata, targetLanguage);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return {
      videoId: transcript.videoId,
      analyzedAt: new Date().toISOString(),
      ...parsed,
    };
  }

  private async callOpenAIForScript(transcript: NormalizedTranscript, scriptType: ScriptType, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): Promise<GeneratedScript> {
    const prompt = SCRIPT_GENERATION_PROMPTS[scriptType as keyof typeof SCRIPT_GENERATION_PROMPTS] || SCRIPT_GENERATION_PROMPTS.rewritten;
    const langNote = targetLanguage === "ur" ? " Output the entire script in Urdu (اردو)." : "";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: `${prompt}${langNote}` },
          {
            role: "user",
            content: `Video Title: ${metadata?.title || "Video"}\n\nTranscript Content:\n${transcript.cleanText.slice(0, 12000)}`,
          },
        ],
        temperature: 0.5,
      }),
    });

    if (!res.ok) {
      return this.generateHeuristicScript(transcript, scriptType, metadata, targetLanguage);
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return {
      type: scriptType,
      title: `${this.formatScriptTypeTitle(scriptType)}: ${metadata?.title || "YouTube Video"}`,
      estimatedReadTime: `${Math.ceil(wordCount / 130)} min read`,
      wordCount,
      content,
    };
  }

  private async callOpenAIForQAWithPersona(
    transcript: NormalizedTranscript,
    question: string,
    persona: AIAssistantPersona,
    language: string = "en",
    history?: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> }> {
    const searchTerms = question.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const matchedSegments = transcript.segments.filter((s) =>
      searchTerms.some((term) => s.text.toLowerCase().includes(term))
    ).slice(0, 10);

    const contextSnippet = matchedSegments.length > 0
      ? matchedSegments.map((s) => `[${s.startFormatted}] ${s.text}`).join("\n")
      : transcript.segments.slice(0, 25).map((s) => `[${s.startFormatted}] ${s.text}`).join("\n");

    const langDirective = (language === "ur" || persona.id === "urdu_advisor")
      ? "Answer fluently and politely in Urdu (اردو). You may use conversational Urdu or Roman Urdu terms where natural. Cite timestamps like [02:30]."
      : language === "hi"
      ? "Answer in Hindi (हिन्दी) with timestamp citations."
      : language === "ar"
      ? "Answer in Arabic (العربية) with timestamp citations."
      : "Answer clearly in English with timestamp citations.";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${persona.systemPrompt}\n${langDirective}\nGround all answers strictly on the video transcript.`,
          },
          ...(history || []).slice(-4),
          {
            role: "user",
            content: `Transcript snippets:\n${contextSnippet}\n\nQuestion: ${question}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      return this.generateHeuristicQAWithPersona(transcript, question, persona, language);
    }

    const data = await res.json();
    const answer = data.choices[0].message.content;
    const timestampCitations = this.extractTimestampCitations(answer, transcript);

    return { answer, timestampCitations };
  }

  // --- Groq Implementations (Llama 3.3 70B Versatile) ---
  private async callGroqForAnalysis(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): Promise<VideoAnalysisResult> {
    try {
      const chunks = chunkTranscript(transcript.segments, 3000);
      const textContext = chunks[0]?.text || transcript.cleanText;

      const langInstruction = targetLanguage === "ur"
        ? "Write all summaries, key takeaways, topics, and analysis strictly in fluent, natural Urdu (اردو)."
        : targetLanguage === "hi"
        ? "Write all summaries and points in Hindi (हिन्दी)."
        : targetLanguage === "ar"
        ? "Write all summaries and points in Arabic (العربية)."
        : targetLanguage === "es"
        ? "Write all summaries and points in Spanish (Español)."
        : "";

      const completion = await this.groq!.chat.completions.create({
        model: "qwen/qwen3.8-27b",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${AI_ANALYSIS_SYSTEM_PROMPT}\n${langInstruction}` },
          {
            role: "user",
            content: `Video Title: ${metadata?.title || "Unknown"}\nChannel: ${metadata?.channelName || "Unknown"}\nDuration: ${transcript.totalDurationSeconds}s\n\nTranscript:\n${textContext}`,
          },
        ],
        temperature: 0.3,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      return {
        videoId: transcript.videoId,
        analyzedAt: new Date().toISOString(),
        ...parsed,
      };
    } catch (e) {
      console.error("Groq analysis error, falling back to heuristic:", e);
      return this.generateHeuristicAnalysis(transcript, metadata, targetLanguage);
    }
  }

  private async callGroqForScript(transcript: NormalizedTranscript, scriptType: ScriptType, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): Promise<GeneratedScript> {
    try {
      const prompt = SCRIPT_GENERATION_PROMPTS[scriptType as keyof typeof SCRIPT_GENERATION_PROMPTS] || SCRIPT_GENERATION_PROMPTS.rewritten;
      const langNote = targetLanguage === "ur" ? " Output the entire script in Urdu (اردو)." : "";

      const completion = await this.groq!.chat.completions.create({
        model: "qwen/qwen3.8-27b",
        messages: [
          { role: "system", content: `${prompt}${langNote}` },
          {
            role: "user",
            content: `Video Title: ${metadata?.title || "Video"}\n\nTranscript Content:\n${transcript.cleanText.slice(0, 12000)}`,
          },
        ],
        temperature: 0.5,
      });

      const content = completion.choices[0]?.message?.content || "";
      const wordCount = content.split(/\s+/).filter(Boolean).length;

      return {
        type: scriptType,
        title: `${this.formatScriptTypeTitle(scriptType)}: ${metadata?.title || "YouTube Video"}`,
        estimatedReadTime: `${Math.ceil(wordCount / 130)} min read`,
        wordCount,
        content,
      };
    } catch (e) {
      console.error("Groq script error, falling back to heuristic:", e);
      return this.generateHeuristicScript(transcript, scriptType, metadata, targetLanguage);
    }
  }

  private async callGroqForQAWithPersona(
    transcript: NormalizedTranscript,
    question: string,
    persona: AIAssistantPersona,
    language: string = "en",
    history?: Array<{ role: string; content: string }>
  ): Promise<{ answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> }> {
    try {
      const searchTerms = question.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matchedSegments = transcript.segments.filter((s) =>
        searchTerms.some((term) => s.text.toLowerCase().includes(term))
      ).slice(0, 10);

      const contextSnippet = matchedSegments.length > 0
        ? matchedSegments.map((s) => `[${s.startFormatted}] ${s.text}`).join("\n")
        : transcript.segments.slice(0, 25).map((s) => `[${s.startFormatted}] ${s.text}`).join("\n");

      const langDirective = (language === "ur" || persona.id === "urdu_advisor")
        ? "Answer fluently and politely in Urdu (اردو). You may use conversational Urdu or Roman Urdu terms where natural. Cite timestamps like [02:30]."
        : language === "hi"
        ? "Answer in Hindi (हिन्दी) with timestamp citations."
        : language === "ar"
        ? "Answer in Arabic (العربية) with timestamp citations."
        : "Answer clearly in English with timestamp citations.";

      const completion = await this.groq!.chat.completions.create({
        model: "qwen/qwen3.8-27b",
        messages: [
          {
            role: "system",
            content: `${persona.systemPrompt}\n${langDirective}\nGround all answers strictly on the video transcript.`,
          },
          ...(history || []).slice(-4) as any,
          {
            role: "user",
            content: `Transcript snippets:\n${contextSnippet}\n\nQuestion: ${question}`,
          },
        ],
        temperature: 0.2,
      });

      const answer = completion.choices[0]?.message?.content || "";
      const timestampCitations = this.extractTimestampCitations(answer, transcript);

      return { answer, timestampCitations };
    } catch (e) {
      console.error("Groq QA error, falling back to heuristic:", e);
      return this.generateHeuristicQAWithPersona(transcript, question, persona, language);
    }
  }

  // --- Robust Heuristic NLP Fallback (Instant zero-key multilingual support) ---
  private generateHeuristicAnalysis(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): VideoAnalysisResult {
    const title = metadata?.title || "Video Analysis";
    const segments = transcript.segments;
    const totalSegs = segments.length;
    const isUrdu = targetLanguage === "ur" || transcript.language === "ur";

    const timelineChapters: VideoAnalysisResult["timelineChapters"] = [];
    const chapterStep = Math.max(1, Math.floor(totalSegs / 5));

    for (let i = 0; i < totalSegs; i += chapterStep) {
      if (timelineChapters.length >= 6) break;
      const seg = segments[i];
      let chapterTitle = isUrdu ? "اہم موضوع اور گفتگو" : "Overview & Key Context";
      if (i === 0) chapterTitle = isUrdu ? "تعارف اور آغاز" : "Introduction & Overview";
      else if (i + chapterStep >= totalSegs) chapterTitle = isUrdu ? "حتمی نتیجہ اور اختتام" : "Conclusion & Final Takeaways";
      else {
        const words = seg.text.split(" ").slice(0, 5).join(" ");
        chapterTitle = words ? words.charAt(0).toUpperCase() + words.slice(1) : `Chapter [${seg.startFormatted}]`;
      }

      timelineChapters.push({
        startTime: seg.startTime,
        timestamp: seg.startFormatted,
        title: chapterTitle,
        summary: seg.text.slice(0, 120) + "...",
      });
    }

    const keyTakeaways: string[] = [];
    const importantPoints: string[] = [];
    segments.slice(0, Math.min(12, totalSegs)).forEach((s, idx) => {
      if (s.text.length > 25 && idx % 2 === 0) {
        keyTakeaways.push(s.text.charAt(0).toUpperCase() + s.text.slice(1));
      } else if (s.text.length > 20) {
        importantPoints.push(s.text.charAt(0).toUpperCase() + s.text.slice(1));
      }
    });

    const factsAndNumbers: VideoAnalysisResult["factsAndNumbers"] = [];
    const numberRegex = /(\b\d+(?:[\.,]\d+)?%?\b|\$\d+(?:,\d+)?|\b\d{4}\b)/g;
    for (const seg of segments) {
      const match = seg.text.match(numberRegex);
      if (match && factsAndNumbers.length < 6) {
        factsAndNumbers.push({
          metric: match[0],
          context: seg.text,
          claimType: match[0].includes("%") ? "statistic" : match[0].includes("$") ? "cost" : "fact",
          isVerifiedClaim: false,
          timestamp: seg.startFormatted,
        });
      }
    }

    if (isUrdu) {
      return {
        videoId: transcript.videoId,
        analyzedAt: new Date().toISOString(),
        quickSummary: `یہ ویڈیو '${title}' کے بارے میں اہم گفتگو اور حقائق پر مبنی ہے۔ اس میں مقرر کی گفتگو، پیش کردہ نکات اور اہم مشاہدات کا جامع احاطہ کیا گیا ہے۔`,
        detailedSummary: `اس ویڈیو میں '${title}' کے مختلف پہلوؤں پر تفصیلی روشنی ڈالی گئی ہے۔ مقرر نے اہم صورتحال، پس منظر اور آئندہ کے لائحہ عمل پر بات کی ہے جس سے ناظرین کو مکمل رہنمائی ملتی ہے۔`,
        videoDna: {
          mainSubject: title,
          purpose: "معلومات اور رہنمائی کی فراہمی",
          targetAudience: "عام ناظرین، طلباء اور محققین",
          speakerObjective: "اہم نکات اور تفصیلات سے آگاہ کرنا",
          tone: "معلوماتی اور تجزیاتی",
        },
        mainTopics: [
          { topic: "بنیادی پس منظر اور اہم نکات", subtopics: ["ابتدائی تفصیلات", "اہم پیش رفت"], relevance: "high" },
          { topic: "تفصیلی جائزہ اور گفتگو", subtopics: ["حقائق کا تجزیہ", "موجودہ صورتحال"], relevance: "high" },
          { topic: "حتمی نتیجہ اور مشورے", subtopics: ["اہم نتائج"], relevance: "medium" },
        ],
        keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways.slice(0, 6) : ["ویڈیو میں اہم بنیادی نکات پیش کیے گئے ہیں۔", "مسائل کے حل اور حکمت عملی پر زور دیا گیا ہے۔"],
        importantPoints: importantPoints.length > 0 ? importantPoints.slice(0, 6) : ["تفصیلی گفتگو میں اہم حقائق زیر بحث آئے۔"],
        timelineChapters: timelineChapters.length > 0 ? timelineChapters : [{ startTime: 0, timestamp: "00:00", title: "آغاز", summary: "ابتدائی گفتگو" }],
        factsAndNumbers: factsAndNumbers.length > 0 ? factsAndNumbers : [{ metric: `${transcript.totalSegments} حصے`, context: `ویڈیو میں کل ${transcript.totalWords} الفاظ بولے گئے۔`, claimType: "statistic", isVerifiedClaim: true, timestamp: "00:00" }],
        entities: {
          people: [{ name: metadata?.channelName || "مقرر", roleOrContext: "پریزنٹر / تخلیق کار" }],
          companies: [{ name: "YouTube", context: "ویڈیو پلیٹ فارم" }],
          toolsAndWebsites: [{ name: "TubeMind AI", category: "software", context: "ویڈیو انٹیلی جنس انجن" }],
        },
        actionItems: [
          { task: "ویڈیو کے اہم نکات اور ٹائم لائن کا جائزہ لیں۔", priority: "essential", context: "بہتر تفہیم کے لیے" },
          { task: "بیان کردہ اہم تجاویز کو عملی طور پر اپنائیں۔", priority: "recommended", context: "مثبت نتائج کے لیے" },
        ],
        opinionsAndRecommendations: [
          { statement: "مقرر نے منظم انداز میں کام کرنے اور حقائق پر توجہ دینے کی سفارش کی ہے۔", speakerStance: "advocating", category: "recommendation" },
        ],
        risksAndLimitations: ["اعداد و شمار کی تصدیق خود بھی لازمی کریں۔"],
        conclusion: `خلاصہ یہ کہ یہ ویڈیو '${title}' کے حوالے سے اہم اور بروقت معلومات فراہم کرتی ہے۔`,
      };
    }

    return {
      videoId: transcript.videoId,
      analyzedAt: new Date().toISOString(),
      quickSummary: `${title} covers critical concepts directly from the speaker's presentation. The discussion addresses practical implementations, key perspectives, and structured solutions discussed throughout the video.`,
      detailedSummary: `This comprehensive video presentation focuses on the core principles surrounding ${title}. Starting from foundational observations, the speaker develops clear arguments, shares situational examples, and presents actionable recommendations for the target audience.`,
      videoDna: {
        mainSubject: title,
        purpose: "Deliver clear actionable information, education, and strategic insights.",
        targetAudience: "Creators, professionals, learners, and practitioners interested in this subject.",
        speakerObjective: "Educate, explain methodologies, and share actionable recommendations.",
        tone: "Educational & Informative",
      },
      mainTopics: [
        { topic: "Core Fundamentals & Context", subtopics: ["Background setup", "Problem identification"], relevance: "high" },
        { topic: "Implementation & Methods", subtopics: ["Techniques demonstrated", "Execution flow"], relevance: "high" },
        { topic: "Best Practices & Future Steps", subtopics: ["Key recommendations", "Actionable outcomes"], relevance: "medium" },
      ],
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways.slice(0, 6) : [
        "Focus on core principles before applying complex methods.",
        "Consistency and proper execution drive optimal results.",
      ],
      importantPoints: importantPoints.length > 0 ? importantPoints.slice(0, 6) : [
        "Speaker emphasizes thorough preparation.",
        "Key workflows require attention to detail.",
      ],
      timelineChapters: timelineChapters.length > 0 ? timelineChapters : [
        { startTime: 0, timestamp: "00:00", title: "Introduction", summary: "Opening remarks and overview" }
      ],
      factsAndNumbers: factsAndNumbers.length > 0 ? factsAndNumbers : [
        {
          metric: `${transcript.totalSegments} segments`,
          context: `Transcript contains ${transcript.totalWords} spoken words across ${transcript.totalDurationSeconds} seconds.`,
          claimType: "statistic",
          isVerifiedClaim: true,
          timestamp: "00:00",
        }
      ],
      entities: {
        people: [{ name: metadata?.channelName || "Speaker", roleOrContext: "Video Creator & Presenter" }],
        companies: [{ name: "YouTube", context: "Hosting platform" }],
        toolsAndWebsites: [{ name: "TubeMind AI", category: "software", context: "Video Intelligence Engine" }],
      },
      actionItems: [
        {
          task: "Review the key concepts outlined in the timeline chapters.",
          priority: "essential",
          context: "To ensure thorough understanding of the primary workflow.",
        },
      ],
      opinionsAndRecommendations: [
        {
          statement: "The speaker advocates prioritizing structured execution over ad-hoc methods.",
          speakerStance: "advocating",
          category: "recommendation",
        },
      ],
      risksAndLimitations: [
        "Ensure validation of specific numbers and metrics for your use case.",
      ],
      conclusion: `In summary, the video provides a structured and actionable look at ${title}, equipping viewers with key insights.`,
    };
  }

  private generateHeuristicScript(transcript: NormalizedTranscript, scriptType: ScriptType, metadata?: YouTubeVideoMetadata, targetLanguage: string = "en"): GeneratedScript {
    const title = metadata?.title || "Video";
    const cleanContent = transcript.cleanText;

    if (scriptType === "clean") {
      return {
        type: "clean",
        title: `Clean Spoken Script: ${title}`,
        estimatedReadTime: `${Math.ceil(transcript.totalWords / 130)} min read`,
        wordCount: transcript.totalWords,
        content: cleanContent,
      };
    }

    if (scriptType === "shorts_30s" || scriptType === "shorts_60s" || scriptType === "shorts_90s") {
      const is30 = scriptType === "shorts_30s";
      const is60 = scriptType === "shorts_60s";
      const words = is30 ? 70 : is60 ? 140 : 210;
      const duration = is30 ? "30 Seconds" : is60 ? "60 Seconds" : "90 Seconds";

      return {
        type: scriptType,
        title: `${duration} Viral Script: ${title}`,
        estimatedReadTime: `${is30 ? "30s" : is60 ? "60s" : "90s"} spoken`,
        wordCount: words,
        content: `[Visual Hook - 0:00]\n"Here's what almost everyone gets wrong about ${title}."\n\n[Core Value Delivery]\n${cleanContent.slice(0, words * 5)}\n\n[Outro & Loop CTA]\n"Save this video right now so you don't lose it, and follow for more insights!"`,
      };
    }

    return {
      type: scriptType,
      title: `Script: ${title}`,
      estimatedReadTime: `${Math.ceil(transcript.totalWords / 130)} min read`,
      wordCount: transcript.totalWords,
      content: cleanContent,
    };
  }

  private generateHeuristicQAWithPersona(
    transcript: NormalizedTranscript,
    question: string,
    persona: AIAssistantPersona,
    language: string = "en"
  ): { answer: string; timestampCitations?: Array<{ timestamp: string; seconds: number; text: string }> } {
    const qLower = question.toLowerCase();
    const keywords = qLower.split(/\s+/).filter((w) => w.length > 3);
    const isUrdu = language === "ur" || persona.id === "urdu_advisor";

    const matches = transcript.segments.filter((s) =>
      keywords.some((k) => s.text.toLowerCase().includes(k))
    );

    if (matches.length > 0) {
      const topMatch = matches[0];
      const answer = isUrdu
        ? `[${persona.urduName || persona.name}] کے مطابق:\nویڈیو کے ٹائم اسٹیمپ [${topMatch.startFormatted}] پر مقرر فرماتے ہیں: "${topMatch.text.trim()}". یہ نکتہ ویڈیو میں تفصیل سے واضح کیا گیا ہے۔`
        : `[${persona.name}]: Based on the transcript around [${topMatch.startFormatted}], the speaker states: "${topMatch.text.trim()}". This concept is elaborated with specific details in the presentation.`;

      return {
        answer,
        timestampCitations: [
          {
            timestamp: topMatch.startFormatted,
            seconds: topMatch.startTime,
            text: topMatch.text,
          },
        ],
      };
    }

    const fallbackAnswer = isUrdu
      ? `[${persona.urduName || persona.name}]: معذرت، آپ کے سوال "${question}" سے متعلق تفصیل ٹرانسکرپٹ میں براہِ راست موجود نہیں ہے۔ آپ ٹائم لائن یا دیگر اہم موضوعات کے بارے میں دریافت کر سکتے ہیں۔`
      : `[${persona.name}]: This specific detail was not explicitly found in the transcript for "${question}". You can explore the timeline chapters or ask about topics mentioned by the speaker.`;

    return {
      answer: fallbackAnswer,
    };
  }

  private extractTimestampCitations(
    text: string,
    transcript: NormalizedTranscript
  ): Array<{ timestamp: string; seconds: number; text: string }> {
    const citations: Array<{ timestamp: string; seconds: number; text: string }> = [];
    const tsRegex = /\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g;
    let match;
    const { parseDurationStringToSeconds } = require("@/lib/utils");

    while ((match = tsRegex.exec(text)) !== null) {
      const ts = match[1];
      const seconds = parseDurationStringToSeconds(ts);
      const seg = transcript.segments.find(
        (s) => Math.abs(s.startTime - seconds) < 10
      );
      citations.push({
        timestamp: ts,
        seconds,
        text: seg?.text || `Segment at ${ts}`,
      });
    }

    return citations;
  }

  private formatScriptTypeTitle(type: ScriptType): string {
    switch (type) {
      case "clean":
        return "Clean Spoken Script";
      case "rewritten":
        return "AI Rewritten Script";
      case "youtube":
        return "YouTube Video Script";
      case "voiceover":
        return "Voiceover Narration Script";
      case "shorts_30s":
        return "30-Second Shorts Script";
      case "shorts_60s":
        return "60-Second Shorts Script";
      case "shorts_90s":
        return "90-Second Shorts Script";
      default:
        return "Script";
    }
  }
}

let aiProviderInstance: IAIProvider | null = null;

export function getAIProvider(): IAIProvider {
  if (!aiProviderInstance) {
    aiProviderInstance = new AIProvider();
  }
  return aiProviderInstance;
}
