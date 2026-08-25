import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — TubeMind AI",
  description: "Legal disclaimer regarding YouTube captions, AI summarization, and transcription accuracy.",
  alternates: { canonical: "https://tubemind.ai/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Disclaimer</h1>
      <p className="text-xs text-muted-foreground">Last updated: August 2026</p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Independent Platform</h2>
          <p>
            TubeMind AI is an independent software application and is not affiliated, endorsed, or partnered with YouTube, LLC, Google LLC, or Alphabet Inc.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. AI-Generated Summaries & Claims</h2>
          <p>
            The summaries, key points, and rewritten scripts produced by TubeMind AI reflect the spoken dialogue contained in the source video. TubeMind AI does not independent fact-check third-party creator claims. Extracted facts and statistics should be independently evaluated by users before making business, legal, financial, or medical decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. No Video Downloading</h2>
          <p>
            TubeMind AI does not host, store, copy, or redistribute underlying YouTube audio or video files. It processes publicly exposed text caption tracks provided by the video platform.
          </p>
        </section>
      </div>
    </div>
  );
}
