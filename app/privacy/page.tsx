import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TubeMind AI",
  description: "Learn how TubeMind AI respects your privacy, handles data securely, and processes public caption streams.",
  alternates: { canonical: "https://tubemind.ai/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Privacy Policy</h1>
      <p className="text-xs text-muted-foreground">Last updated: August 2026</p>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Overview</h2>
          <p>
            TubeMind AI ("we", "our", or "us") respects your privacy. This Privacy Policy outlines how we collect, process, and protect your information when you use our video intelligence platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Information We Process</h2>
          <p>
            When you enter a YouTube URL, our service retrieves public caption metadata and transcripts to perform on-demand analysis. We do not store private video files or download unauthorized video streams.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. User Accounts & History</h2>
          <p>
            For authenticated users, we store your profile email, saved videos, and analysis logs securely in PostgreSQL with strict Row Level Security (RLS). You can delete your history at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Analytics & Telemetry</h2>
          <p>
            We collect anonymized operational metrics (e.g. error codes, export types) to improve service reliability. We never send personal transcript text to external advertising networks.
          </p>
        </section>
      </div>
    </div>
  );
}
