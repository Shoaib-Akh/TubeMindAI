import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube Transcript Generator — Free Online Video to Text & AI Analysis",
  description:
    "Extract accurate transcripts from any YouTube video instantly. Download in TXT, SRT, VTT, or JSON, get AI summaries, and generate scripts.",
  alternates: { canonical: "https://tubemind.ai/youtube-transcript" },
};

export default function YouTubeTranscriptLanding() {
  return (
    <SeoLandingTemplate
      h1="Instant YouTube Transcript Generator"
      badge="Online Transcript Engine"
      subheading="Get the spoken content of any YouTube video in seconds with timestamps."
      introContent="TubeMind AI reads public YouTube closed captions and automatic speech streams to produce verified, readable transcripts. Whether you are conducting research, creating video summaries, or building scripts, extract and export text without registration."
      benefits={[
        {
          title: "Accurate Caption Extraction",
          desc: "Supports both manual creator captions and YouTube automatic speech recognition (ASR) across dozens of languages.",
        },
        {
          title: "Exact Timestamp Synchronization",
          desc: "Every sentence is tied to its exact start and duration timestamps, allowing you to seek video moments in one click.",
        },
        {
          title: "Multiple Export Formats",
          desc: "Download clean plain text, SubRip (.srt), WebVTT (.vtt), structured JSON, or formatted Markdown.",
        },
        {
          title: "Integrated AI Studio",
          desc: "Generate concise summaries, chapter breakdowns, grounded answers, and viral Shorts scripts instantly.",
        },
      ]}
      structuredSchema={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "TubeMind YouTube Transcript Generator",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0" },
      }}
    />
  );
}
