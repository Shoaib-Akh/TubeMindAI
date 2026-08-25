import React from "react";
import { Metadata } from "next";
import { TranscriptClient } from "./TranscriptClient";

interface PageProps {
  params: {
    videoId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { videoId } = params;
  return {
    title: `YouTube Video Transcript & Intelligence (${videoId}) — TubeMind AI`,
    description: `Read the full transcript, AI summary, timeline chapters, and generate scripts for YouTube video ID ${videoId}.`,
    robots: {
      index: false, // Prevent search engines from indexing individual user query IDs by default
      follow: true,
    },
  };
}

export default function TranscriptPage({ params }: PageProps) {
  return <TranscriptClient videoId={params.videoId} />;
}
