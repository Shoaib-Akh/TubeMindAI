import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "Convert YouTube Video to Text Online — Free YouTube to Text Converter",
  description:
    "Convert any YouTube video to accurate text online. Transcribe speech to text, generate summaries, and download notes.",
  alternates: { canonical: "https://tubemind.ai/youtube-video-to-text" },
};

export default function YouTubeVideoToTextLanding() {
  return (
    <SeoLandingTemplate
      h1="Convert YouTube Video to Text Online"
      badge="Video to Text Converter"
      subheading="Transform hours of YouTube video audio into structured, readable text."
      introContent="Converting YouTube videos to text is ideal for students, content creators, researchers, and professionals. Paste your video URL to turn spoken dialogues into readable notes in seconds."
      benefits={[
        {
          title: "Instant Speech-to-Text",
          desc: "No waiting for hours-long audio rendering. Transcripts are fetched and parsed in under 3 seconds.",
        },
        {
          title: "Clean Reading Experience",
          desc: "Transforms fragmented spoken captions into cohesive paragraphs with correct capitalization.",
        },
        {
          title: "Timestamp Navigation",
          desc: "Click any sentence to jump directly to that exact moment in the video.",
        },
        {
          title: "AI Note Extraction",
          desc: "Automatically summarize key takeaways, action items, facts, and conclusions.",
        },
      ]}
    />
  );
}
