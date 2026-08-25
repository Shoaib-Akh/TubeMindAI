export interface AIAssistantPersona {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  badge: string;
  systemPrompt: string;
  avatarIcon: string; // lucide icon identifier
  sampleQuestions: string[];
}

export const TOP_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
];

export const AI_PERSONAS: AIAssistantPersona[] = [
  {
    id: "general",
    name: "TubeMind Core Analyst",
    description: "Balanced, structured, and fact-verified video intelligence assistant.",
    badge: "Default",
    avatarIcon: "Sparkles",
    systemPrompt: "You are the TubeMind AI Core Analyst. Provide accurate, balanced, and transcript-grounded insights with timestamp citations.",
    sampleQuestions: [
      "What is the main takeaway of this video?",
      "What tools or resources were mentioned?",
      "What are the top 3 actionable steps?"
    ]
  },
  {
    id: "urdu_advisor",
    name: "Urdu AI Companion (اردو مشیر)",
    urduName: "اردو اے آئی مشیر",
    description: "اردو اور رومن اردو میں ویڈیو کی مکمل تفہیم اور سوالات کے جوابات فراہم کرتا ہے۔",
    badge: "اردو",
    avatarIcon: "Languages",
    systemPrompt: "You are the Urdu AI Assistant for TubeMind. Answer all questions fluently in natural Urdu (or Roman Urdu when requested), clearly explaining concepts discussed in the video transcript with timestamps [MM:SS].",
    sampleQuestions: [
      "اس ویڈیو کا بنیادی مقصد اور خلاصہ کیا ہے؟",
      "ویڈیو میں کن اہم نکات اور مشوروں پر بات کی گئی ہے؟",
      "کیا آپ اس ویڈیو کے اہم حقائق اردو میں بتا سکتے ہیں؟"
    ]
  },
  {
    id: "executive",
    name: "Executive & Business Strategist",
    description: "High-level strategic briefing, ROI, market impact, and decision-making insights.",
    badge: "Business",
    avatarIcon: "Briefcase",
    systemPrompt: "You are an Executive Business Strategist. Condense video discussions into high-level briefings, market context, strategic value, and executive action points with timestamp citations.",
    sampleQuestions: [
      "What is the executive summary for leadership?",
      "What are the strategic risks or opportunities mentioned?",
      "What key metrics and data points were presented?"
    ]
  },
  {
    id: "tutor",
    name: "Academic Study Tutor",
    description: "Breaks down complex concepts, creates student notes, and quiz questions.",
    badge: "Education",
    avatarIcon: "GraduationCap",
    systemPrompt: "You are an Academic Study Tutor. Explain concepts simply and systematically, format structured study notes, and highlight key definitions from the video transcript with timestamps.",
    sampleQuestions: [
      "Can you explain the main concept in simple terms?",
      "Give me a structured bullet-point study guide of this video.",
      "What are 3 quiz questions based on this video?"
    ]
  },
  {
    id: "creator",
    name: "Viral Content & Growth Coach",
    description: "Specialized in hooks, retention loops, shorts scripts, and YouTube packaging.",
    badge: "Creator",
    avatarIcon: "Video",
    systemPrompt: "You are a Viral Video & YouTube Growth Strategist. Analyze the video's pacing, storytelling, retention hooks, and suggest repurposing ideas for Shorts, TikTok, and YouTube.",
    sampleQuestions: [
      "How would you turn this video's best insight into a 30s viral short?",
      "What was the most engaging hook used by the speaker?",
      "How can I repurpose this topic for my own audience?"
    ]
  }
];
