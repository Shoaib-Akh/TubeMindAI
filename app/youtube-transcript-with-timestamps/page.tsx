import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube Transcript with Timestamps — Clickable Timestamps & Chapter Navigation",
  description:
    "Extract YouTube transcripts with clickable timestamps. Jump to video moments, search dialogue, and export timestamped text.",
  alternates: { canonical: "https://tubemind.ai/youtube-transcript-with-timestamps" },
};

export default function YouTubeTranscriptWithTimestampsLanding() {
  return (
    <SeoLandingTemplate
      h1="YouTube Transcripts with Clickable Timestamps"
      badge="Timestamp Synchronization"
      subheading="Navigate video dialogue with interactive timestamps linked to the player."
      introContent="Find exact moments in long YouTube videos effortlessly. TubeMind AI aligns every spoken phrase with its video start time, allowing you to search text and seek the video player immediately."
      benefits={[
        {
          title: "Click-to-Seek Video Player",
          desc: "Click any timestamp badge in the transcript to jump the video player to that exact second.",
        },
        {
          title: "Timestamped Text Export",
          desc: "Copy or download transcripts with [01:24] timestamps included before each segment.",
        },
        {
          title: "Timeline Chapters",
          desc: "Generate topic-based chapters with titles, summaries, and clickable jump links.",
        },
        {
          title: "Keyboard Shortcuts",
          desc: "Use Cmd+F / Ctrl+F to search within timestamped transcripts instantly.",
        },
      ]}
    />
  );
}
