import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — TubeMind AI",
  description: "Terms of service and user agreements for TubeMind AI.",
  alternates: { canonical: "https://tubemind.ai/terms" },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Terms of Service</h1>
      <p className="text-xs text-muted-foreground">Effective Date: August 2026</p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing TubeMind AI, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Permitted Use</h2>
          <p>
            TubeMind AI is designed for research, educational summarization, transcription, accessibility, and content workflow planning. You agree to use the service in compliance with YouTube terms and applicable copyright laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Intellectual Property</h2>
          <p>
            TubeMind AI does not claim ownership of YouTube videos or original transcripts processed by the engine. All video rights remain with their respective creators.
          </p>
        </section>
      </div>
    </div>
  );
}
