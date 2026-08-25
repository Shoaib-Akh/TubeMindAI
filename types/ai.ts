export interface VideoDNA {
  mainSubject: string;
  purpose: string;
  targetAudience: string;
  speakerObjective: string;
  tone: string;
}

export interface TopicItem {
  topic: string;
  subtopics: string[];
  relevance: "high" | "medium" | "low";
}

export interface TimelineChapter {
  startTime: number;
  timestamp: string; // e.g. "02:35"
  title: string;
  summary: string;
}

export interface FactNumberClaim {
  metric: string;
  context: string;
  claimType: "statistic" | "date" | "measurement" | "cost" | "fact";
  isVerifiedClaim: boolean; // default false ("Claim mentioned in video")
  timestamp?: string;
}

export interface EntityMentions {
  people: Array<{ name: string; roleOrContext?: string }>;
  companies: Array<{ name: string; context?: string }>;
  toolsAndWebsites: Array<{ name: string; category: "software" | "website" | "api" | "hardware" | "book" | "other"; context?: string }>;
}

export interface ActionItem {
  task: string;
  priority: "essential" | "recommended" | "optional";
  context?: string;
}

export interface OpinionAndRecommendation {
  statement: string;
  speakerStance: "advocating" | "cautioning" | "neutral" | "speculative";
  category: "recommendation" | "personal_opinion" | "risk_warning";
}

export interface VideoAnalysisResult {
  videoId: string;
  analyzedAt: string;
  quickSummary: string; // 2-5 impactful sentences
  detailedSummary: string; // structured multi-paragraph explanation
  videoDna: VideoDNA;
  mainTopics: TopicItem[];
  keyTakeaways: string[];
  importantPoints: string[];
  timelineChapters: TimelineChapter[];
  factsAndNumbers: FactNumberClaim[];
  entities: EntityMentions;
  actionItems: ActionItem[];
  opinionsAndRecommendations: OpinionAndRecommendation[];
  risksAndLimitations: string[];
  conclusion: string;
}

export type ScriptType =
  | "original"
  | "clean"
  | "rewritten"
  | "youtube"
  | "voiceover"
  | "shorts_30s"
  | "shorts_60s"
  | "shorts_90s";

export interface GeneratedScript {
  type: ScriptType;
  title: string;
  estimatedReadTime: string;
  wordCount: number;
  content: string;
  sections?: Array<{
    heading: string;
    text: string;
    directionNotes?: string;
  }>;
  visualCues?: Array<{
    timestamp?: string;
    cue: string;
  }>;
}

export interface QAMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestampCitations?: Array<{
    timestamp: string;
    seconds: number;
    text: string;
  }>;
  createdAt: string;
}
