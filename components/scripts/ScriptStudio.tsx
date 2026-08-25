"use client";

import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Video,
  Mic,
  Smartphone,
  Copy,
  Check,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { NormalizedTranscript } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";
import { ScriptType, GeneratedScript } from "@/types/ai";

interface ScriptStudioProps {
  transcript: NormalizedTranscript;
  metadata?: YouTubeVideoMetadata;
}

export function ScriptStudio({ transcript, metadata }: ScriptStudioProps) {
  const [activeTab, setActiveTab] = useState<ScriptType>("clean");
  const [shortsDuration, setShortsDuration] = useState<"shorts_30s" | "shorts_60s" | "shorts_90s">("shorts_60s");
  const [scriptCache, setScriptCache] = useState<Record<string, GeneratedScript>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tabs: Array<{ id: ScriptType; label: string; icon: any; isAi: boolean }> = [
    { id: "original", label: "Original Transcript", icon: FileText, isAi: false },
    { id: "clean", label: "Clean Script", icon: FileText, isAi: false },
    { id: "rewritten", label: "AI Rewritten Script", icon: Sparkles, isAi: true },
    { id: "youtube", label: "YouTube Script", icon: Video, isAi: true },
    { id: "voiceover", label: "Voiceover Script", icon: Mic, isAi: true },
    { id: "shorts_60s", label: "Shorts / Reels Script", icon: Smartphone, isAi: true },
  ];

  const currentTabEffective = activeTab.startsWith("shorts") ? shortsDuration : activeTab;

  const fetchScript = async (type: ScriptType) => {
    if (scriptCache[type]) return;

    if (type === "original") {
      setScriptCache((prev) => ({
        ...prev,
        original: {
          type: "original",
          title: `Original Spoken Transcript: ${metadata?.title || "Video"}`,
          estimatedReadTime: `${Math.ceil(transcript.totalWords / 130)} min read`,
          wordCount: transcript.totalWords,
          content: transcript.fullText,
        },
      }));
      return;
    }

    if (type === "clean") {
      setScriptCache((prev) => ({
        ...prev,
        clean: {
          type: "clean",
          title: `Clean Spoken Script: ${metadata?.title || "Video"}`,
          estimatedReadTime: `${Math.ceil(transcript.totalWords / 130)} min read`,
          wordCount: transcript.totalWords,
          content: transcript.cleanText,
        },
      }));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          scriptType: type,
          metadata,
        }),
      });

      const data = await res.json();
      if (data.success && data.script) {
        setScriptCache((prev) => ({ ...prev, [type]: data.script }));
      }
    } catch (err) {
      console.error("Failed to generate script:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tabId: ScriptType) => {
    setActiveTab(tabId);
    const targetType = tabId === "shorts_60s" ? shortsDuration : tabId;
    fetchScript(targetType);
  };

  const handleShortsDurationChange = (dur: "shorts_30s" | "shorts_60s" | "shorts_90s") => {
    setShortsDuration(dur);
    fetchScript(dur);
  };

  // Get current displayed content
  const currentScript = scriptCache[currentTabEffective] || (
    currentTabEffective === "clean"
      ? {
          type: "clean",
          title: `Clean Spoken Script: ${metadata?.title || "Video"}`,
          estimatedReadTime: `${Math.ceil(transcript.totalWords / 130)} min read`,
          wordCount: transcript.totalWords,
          content: transcript.cleanText,
        }
      : currentTabEffective === "original"
      ? {
          type: "original",
          title: `Original Spoken Transcript: ${metadata?.title || "Video"}`,
          estimatedReadTime: `${Math.ceil(transcript.totalWords / 130)} min read`,
          wordCount: transcript.totalWords,
          content: transcript.fullText,
        }
      : null
  );

  const handleCopy = async () => {
    if (!currentScript?.content) return;
    try {
      await navigator.clipboard.writeText(currentScript.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!currentScript?.content) return;
    const blob = new Blob([currentScript.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transcript.videoId}-${currentTabEffective}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden">
      {/* Studio Header & Tab Navigation */}
      <div className="p-4 border-b border-border bg-secondary/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Script Studio
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Original speech, cleaned transcripts, and AI-adapted production scripts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background hover:bg-secondary border border-border rounded-xl text-foreground transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              <span>{copied ? "Copied" : "Copy Script"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background hover:bg-secondary border border-border rounded-xl text-foreground transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  isSelected
                    ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20"
                    : "bg-card text-muted-foreground hover:text-foreground border-border hover:bg-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.isAi && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      isSelected ? "bg-white/20 text-white" : "bg-brand-500/10 text-brand-500"
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Shorts Duration Sub-bar */}
        {activeTab === "shorts_60s" && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
            <span className="text-xs text-muted-foreground font-medium">Target Duration:</span>
            {(["shorts_30s", "shorts_60s", "shorts_90s"] as const).map((dur) => (
              <button
                key={dur}
                onClick={() => handleShortsDurationChange(dur)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  shortsDuration === dur
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {dur === "shorts_30s" ? "30 Seconds" : dur === "shorts_60s" ? "60 Seconds" : "90 Seconds"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Script Content Area */}
      <div className="p-6">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <p className="text-xs font-medium">Generating formatted script from transcript...</p>
          </div>
        ) : currentScript ? (
          <div className="space-y-4">
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60 text-xs text-muted-foreground">
              <span className="font-bold text-foreground">{currentScript.title}</span>
              <div className="flex items-center gap-3">
                <span>{currentScript.wordCount} words</span>
                <span>•</span>
                <span>{currentScript.estimatedReadTime}</span>
              </div>
            </div>

            {/* Content Display */}
            <div className="bg-background rounded-xl p-5 border border-border text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {currentScript.content}
            </div>

            {/* AI Disclaimer */}
            {activeTab !== "original" && activeTab !== "clean" && (
              <p className="text-[11px] text-muted-foreground italic">
                * Note: This script was re-written by AI based solely on the spoken transcript of this video.
              </p>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <button
              onClick={() => fetchScript(currentTabEffective)}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Generate {tabs.find((t) => t.id === activeTab)?.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
