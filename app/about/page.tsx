import React from "react";
import { Metadata } from "next";
import { Sparkles, Shield, Cpu, Zap, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About TubeMind AI — Mission, Architecture & Technology",
  description:
    "Learn about TubeMind AI, the mission to unlock video knowledge, and our responsible approach to transcript processing and AI analysis.",
  alternates: { canonical: "https://tubemind.ai/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          Unlocking the World's Spoken Knowledge
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Billions of hours of educational, scientific, and cultural knowledge are stored in YouTube video streams. TubeMind AI converts spoken audio into structured intelligence, high-retention scripts, and permanent notes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <Cpu className="w-8 h-8 text-brand-500" />
          <h3 className="text-lg font-bold text-foreground">Next-Gen Intelligence</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Beyond simple transcript downloading, our engine extracts video DNA, timeline chapters, entity mentions, and verified factual claims.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <Zap className="w-8 h-8 text-amber-500" />
          <h3 className="text-lg font-bold text-foreground">Creator Script Studio</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Instantly turn existing video insights into high-retention viral Shorts scripts (30s, 60s, 90s), YouTube outlines, and voice-overs.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <Shield className="w-8 h-8 text-emerald-500" />
          <h3 className="text-lg font-bold text-foreground">Zero Hallucination</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our grounded Q&A is strictly verified against the transcript. If information is absent, the system states it truthfully without guessing.
          </p>
        </div>
      </div>
    </div>
  );
}
