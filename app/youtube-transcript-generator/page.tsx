import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube Transcript Generator Online — Free & Fast Transcript Studio",
  description:
    "Generate complete YouTube transcripts with timestamps. AI-powered punctuation correction, sentence formatting, and multi-format downloads.",
  alternates: { canonical: "https://tubemind.ai/youtube-transcript-generator" },
};

export default function YouTubeTranscriptGeneratorLanding() {
  return (
    <SeoLandingTemplate
      h1="Free Online YouTube Transcript Generator"
      badge="Fast Video Transcription"
      subheading="Convert YouTube spoken words into crystal-clear text documents."
      introContent="Need a transcript for a lecture, podcast episode, or technical tutorial? TubeMind AI automatically cleans up duplicated words, fixes broken punctuation, and renders speech into high-clarity paragraphs."
      benefits={[
        {
          title: "Intelligent Text Cleaning",
          desc: "Removes filler words and cleans punctuation without altering the author's original meaning.",
        },
        {
          title: "Multi-Language Auto-Detection",
          desc: "Dynamically retrieves all available subtitles and auto-translated tracks provided by YouTube.",
        },
        {
          title: "In-Transcript Search (Cmd+F)",
          desc: "Instantly search across hours of video dialogue with live text highlights and cycling.",
        },
        {
          title: "One-Click Subtitle Downloads",
          desc: "Export standard .srt or .vtt subtitle files for video editing software like Premiere, DaVinci, or CapCut.",
        },
      ]}
    />
  );
}
