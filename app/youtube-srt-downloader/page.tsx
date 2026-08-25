import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube SRT Downloader — Extract SRT Subtitle Files from YouTube",
  description:
    "Free YouTube SRT downloader. Extract and export SubRip (.srt) subtitle files with valid timestamps from any YouTube video.",
  alternates: { canonical: "https://tubemind.ai/youtube-srt-downloader" },
};

export default function YouTubeSrtDownloaderLanding() {
  return (
    <SeoLandingTemplate
      h1="Download YouTube Subtitles as SRT Files"
      badge="SRT Converter"
      subheading="Get valid SubRip (.srt) subtitle files ready for editing software."
      introContent="Convert YouTube video speech directly into standard SubRip (.srt) format with sequence numbers and millisecond comma timestamps (00:01:23,450 --> 00:01:27,800). Ideal for Premiere Pro, Final Cut, and VLC."
      benefits={[
        {
          title: "Standard SRT Formatting",
          desc: "Valid syntax with numbered blocks, comma-separated milliseconds, and clean text lines.",
        },
        {
          title: "Direct Video Editor Import",
          desc: "Drop the downloaded .srt file straight onto your timeline in Premiere, DaVinci Resolve, or CapCut.",
        },
        {
          title: "Multi-Language Support",
          desc: "Download SRT subtitles in any available language track for the video.",
        },
        {
          title: "Instant One-Click Download",
          desc: "Save the .srt file directly to your device in seconds.",
        },
      ]}
    />
  );
}
