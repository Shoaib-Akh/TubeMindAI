"use client";

import React, { useState } from "react";
import { Download, Copy, Check, FileCode, FileText, X } from "lucide-react";
import { NormalizedTranscript, SubtitleFormat } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";
import { VideoAnalysisResult } from "@/types/ai";
import {
  generateSrt,
  generateVtt,
  generatePlainText,
  generateTranscriptJson,
  generateTranscriptMarkdown,
} from "@/lib/transcript/formatters";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transcript: NormalizedTranscript;
  metadata?: YouTubeVideoMetadata;
  analysis?: VideoAnalysisResult | null;
}

export function ExportModal({
  isOpen,
  onClose,
  transcript,
  metadata,
  analysis,
}: ExportModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = (format: SubtitleFormat) => {
    const baseName = `${transcript.videoId}-${format}`;

    switch (format) {
      case "srt":
        triggerDownload(`${baseName}.srt`, generateSrt(transcript.segments), "text/plain;charset=utf-8");
        break;
      case "vtt":
        triggerDownload(`${baseName}.vtt`, generateVtt(transcript.segments), "text/vtt;charset=utf-8");
        break;
      case "txt":
        triggerDownload(`${baseName}.txt`, generatePlainText(transcript.segments, true), "text/plain;charset=utf-8");
        break;
      case "json":
        triggerDownload(`${baseName}.json`, generateTranscriptJson(transcript, metadata), "application/json;charset=utf-8");
        break;
      case "markdown":
        triggerDownload(`${baseName}.md`, generateTranscriptMarkdown(transcript, metadata), "text/markdown;charset=utf-8");
        break;
    }
  };

  const handleCopy = async (type: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(type);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden p-6 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-500" />
            <h3 className="text-base font-bold text-foreground">Export & Download Subtitles</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Download File Types */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
            Download File
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { format: "srt" as SubtitleFormat, label: "SRT Subtitles (.srt)", desc: "Standard video subtitles" },
              { format: "vtt" as SubtitleFormat, label: "WebVTT (.vtt)", desc: "Web video captions" },
              { format: "txt" as SubtitleFormat, label: "Plain Text (.txt)", desc: "With timestamps" },
              { format: "json" as SubtitleFormat, label: "JSON Data (.json)", desc: "Structured segments" },
              { format: "markdown" as SubtitleFormat, label: "Markdown (.md)", desc: "Formatted document" },
            ].map((item) => (
              <button
                key={item.format}
                onClick={() => handleDownload(item.format)}
                className="flex flex-col text-left p-3 rounded-xl bg-secondary/40 hover:bg-secondary border border-border/80 hover:border-brand-500/40 transition-all group"
              >
                <span className="text-xs font-bold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {item.label}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1-Click Clipboard Copies */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
            Copy to Clipboard
          </label>
          <div className="space-y-2">
            {[
              { id: "clean_txt", label: "Clean Spoken Text", getText: () => transcript.cleanText },
              { id: "raw_ts", label: "Timestamped Transcript", getText: () => generatePlainText(transcript.segments, true) },
              { id: "srt_raw", label: "SRT Subtitle Code", getText: () => generateSrt(transcript.segments) },
              { id: "md_raw", label: "Markdown Document", getText: () => generateTranscriptMarkdown(transcript, metadata) },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleCopy(btn.id, btn.getText())}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-background hover:bg-secondary border border-border text-xs font-medium text-foreground transition-all"
              >
                <span>{btn.label}</span>
                {copiedFormat === btn.id ? (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
