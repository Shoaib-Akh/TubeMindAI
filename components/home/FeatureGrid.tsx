import React from "react";
import {
  FileText,
  Sparkles,
  ListOrdered,
  Clock,
  Video,
  MessageSquareText,
  Download,
  Search,
  Layers,
} from "lucide-react";

export function FeatureGrid() {
  const features = [
    {
      title: "Clean & Raw Transcripts",
      description: "Extract original spoken captions with millisecond timestamps, or generate clean, punctuation-perfect readable transcripts.",
      icon: FileText,
      badge: "High Accuracy",
    },
    {
      title: "Structured AI Summaries",
      description: "Quick 2-5 sentence elevator pitches, comprehensive multi-paragraph explanations, and Video DNA (purpose, audience, objective).",
      icon: Sparkles,
      badge: "Zero Fluff",
    },
    {
      title: "Timeline & Chapter Seeking",
      description: "Get timestamped chapters mapped directly to transcript segments with one-click video player seeking.",
      icon: Clock,
      badge: "Interactive",
    },
    {
      title: "Script Studio (6 Formats)",
      description: "Generate YouTube video scripts, Voiceover audio scripts, and 30s/60s/90s viral Shorts/Reels scripts with visual cues.",
      icon: Video,
      badge: "Creator Favorite",
    },
    {
      title: "Grounded Video Q&A",
      description: "Ask anything about the video and get precise answers strictly verified by the transcript with timestamp citations.",
      icon: MessageSquareText,
      badge: "No Hallucinations",
    },
    {
      title: "Export & Subtitles Suite",
      description: "Download verified SRT, WebVTT, Plain Text, JSON, and Markdown files with one-click clipboard copy actions.",
      icon: Download,
      badge: "Production Ready",
    },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
          Enterprise Capabilities
        </h2>
        <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
          Everything You Need to Master Video Content
        </p>
        <p className="text-base text-muted-foreground">
          Built for creators, researchers, students, marketers, and executive teams looking to unlock the spoken knowledge inside YouTube.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-card rounded-2xl p-6 border border-border hover:border-brand-500/30 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-foreground group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-400 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
