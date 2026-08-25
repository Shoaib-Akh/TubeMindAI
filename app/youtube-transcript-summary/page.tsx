import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube Video Summary AI — Instant Key Points, Timeline & Summaries",
  description:
    "Summarize any YouTube video using AI. Get quick 2-5 sentence summaries, detailed takeaways, chapter timestamps, and key insights.",
  alternates: { canonical: "https://tubemind.ai/youtube-transcript-summary" },
};

export default function YouTubeTranscriptSummaryLanding() {
  return (
    <SeoLandingTemplate
      h1="AI-Powered YouTube Video Summary"
      badge="AI Video Intelligence"
      subheading="Get key insights, elevator pitches, and detailed breakdowns without watching the full video."
      introContent="Save hours of watching time. TubeMind AI analyzes the entire spoken transcript, extracts the core arguments, and generates structured summaries categorized by topics, statistics, and action items."
      benefits={[
        {
          title: "Quick 2-5 Sentence Summary",
          desc: "Understand the core premise and big takeaway in less than 30 seconds of reading.",
        },
        {
          title: "Structured Detailed Breakdown",
          desc: "Read a multi-paragraph narrative explaining background, arguments, and conclusions.",
        },
        {
          title: "Facts & Numbers Extraction",
          desc: "Identify mentioned metrics, statistics, dates, and claims with exact context.",
        },
        {
          title: "Interactive Video Q&A",
          desc: "Ask specific questions to the AI and receive verified answers with timestamp citations.",
        },
      ]}
    />
  );
}
