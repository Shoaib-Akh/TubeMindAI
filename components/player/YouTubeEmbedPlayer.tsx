"use client";

import React, { useEffect, useRef } from "react";

interface YouTubeEmbedPlayerProps {
  videoId: string;
  seekTime?: number | null;
  onTimeUpdate?: (seconds: number) => void;
}

export function YouTubeEmbedPlayer({ videoId, seekTime }: YouTubeEmbedPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && iframeRef.current) {
      // Send postMessage to YouTube iframe API to seek
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seekTime, true],
        }),
        "*"
      );
      // Also trigger play
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo",
          args: [],
        }),
        "*"
      );
    }
  }, [seekTime]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-xl">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}&rel=0`}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
