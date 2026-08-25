import React from "react";
import { Metadata } from "next";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";

export const metadata: Metadata = {
  title: "YouTube Script Generator — Turn Any Video Into YouTube, Shorts & Voiceover Scripts",
  description:
    "Generate production-ready YouTube video scripts, viral Shorts scripts (30s, 60s, 90s), and voice-over scripts from any YouTube video.",
  alternates: { canonical: "https://tubemind.ai/youtube-script-generator" },
};

export default function YouTubeScriptGeneratorLanding() {
  return (
    <SeoLandingTemplate
      h1="AI YouTube Script Generator Studio"
      badge="Script Studio"
      subheading="Repurpose video knowledge into high-retention video and Shorts scripts."
      introContent="TubeMind AI helps video creators, podcast editors, and educators turn spoken knowledge into high-engagement scripts. Generate hook-driven YouTube scripts, voiceover narration, and viral Shorts with visual cue directions."
      benefits={[
        {
          title: "Viral Shorts & Reels (30s / 60s / 90s)",
          desc: "Targeted scripts formatted with pattern interrupts, visual hook cues, and loop CTAs.",
        },
        {
          title: "Full YouTube Script Blueprint",
          desc: "Hook (0:00-0:30), introduction, core value sections with retention loops, and strong outro CTAs.",
        },
        {
          title: "Voice-over Narration Script",
          desc: "Paced for audio recording with tone and emphasis directions.",
        },
        {
          title: "Clean & Rewritten Versions",
          desc: "Compare exact spoken words with freshly rewritten modern prose.",
        },
      ]}
    />
  );
}
