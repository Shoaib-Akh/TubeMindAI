import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "Download YouTube Transcripts in TXT, SRT, VTT & JSON — TubeMind AI",
  description:
    "Fast and free YouTube transcript downloader. Save video subtitles in .srt, .vtt, .txt, .json, or Markdown with accurate timestamps.",
  alternates: { canonical: "https://tubemind.ai/youtube-transcript-downloader" },
};

export default function YouTubeTranscriptDownloaderLanding() {
  return (
    <SeoLandingTemplate
      h1="Download YouTube Transcripts (TXT, SRT, VTT)"
      badge="Export Suite"
      subheading="Download complete subtitles and captions with verified formatting."
      introContent="TubeMind AI makes downloading YouTube transcripts effortless. Select from standard subtitle formats like SRT and WebVTT, or save clean text files for study notes and article writing."
      benefits={[
        {
          title: "SubRip (.srt) Subtitles",
          desc: "Valid format with millisecond timing for seamless importing into video editors and media players.",
        },
        {
          title: "WebVTT (.vtt) Captions",
          desc: "Optimized for HTML5 video players, web applications, and browser-based captions.",
        },
        {
          title: "Plain Text & Markdown",
          desc: "Clean, human-readable text documents formatted with headings, bullet points, and metadata.",
        },
        {
          title: "Structured JSON",
          desc: "Developer-friendly JSON format containing start times, durations, and indexed segments.",
        },
      ]}
    />
  );
}
