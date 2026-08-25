import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube Subtitle Downloader — Download Captions in Multiple Languages",
  description:
    "Download closed captions and subtitles from YouTube videos in SRT, VTT, or TXT format. Fast, free, and accurate.",
  alternates: { canonical: "https://tubemind.ai/youtube-subtitle-downloader" },
};

export default function YouTubeSubtitleDownloaderLanding() {
  return (
    <SeoLandingTemplate
      h1="Download YouTube Subtitles & Captions"
      badge="Caption Extractor"
      subheading="Extract official and auto-generated subtitles from YouTube videos."
      introContent="Easily extract subtitle files from any YouTube video. Whether you need multilingual subtitle tracks or time-coded WebVTT files, download them with a single click."
      benefits={[
        {
          title: "All Caption Tracks",
          desc: "Supports both creator-provided manual subtitles and automatic speech recognition captions.",
        },
        {
          title: "Standard Formats",
          desc: "Output formatted perfectly for video players, caption editors, and web frameworks.",
        },
        {
          title: "Timestamp Precision",
          desc: "Precise millisecond synchronization ensures zero subtitle drift.",
        },
        {
          title: "Free & Instant",
          desc: "No registration required for downloading subtitles.",
        },
      ]}
    />
  );
}
