"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Download,
  Share2,
  Bookmark,
  Clock,
  Layers,
  FileText,
  Video,
  MessageSquareText,
  Loader2,
  AlertCircle,
  ExternalLink,
  Check,
} from "lucide-react";
import { NormalizedTranscript } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";
import { VideoAnalysisResult } from "@/types/ai";
import { YouTubeEmbedPlayer } from "@/components/player/YouTubeEmbedPlayer";
import { TranscriptViewer } from "@/components/transcript/TranscriptViewer";
import { VideoIntelligenceReport } from "@/components/intelligence/VideoIntelligenceReport";
import { ScriptStudio } from "@/components/scripts/ScriptStudio";
import { VideoQAChat } from "@/components/qa/VideoQAChat";
import { ExportModal } from "@/components/export/ExportModal";

interface TranscriptClientProps {
  videoId: string;
}

export function TranscriptClient({ videoId }: TranscriptClientProps) {
  const [metadata, setMetadata] = useState<YouTubeVideoMetadata | null>(null);
  const [transcript, setTranscript] = useState<NormalizedTranscript | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"intelligence" | "scripts" | "qa" | "transcript">("intelligence");
  const [isSaved, setIsSaved] = useState(false);

  // 1. Initial Load: Transcript & Metadata
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetch("/api/transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}`, language: currentLanguage }),
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.message || "Failed to load video transcript");
        }

        if (isMounted) {
          setMetadata(data.metadata);
          setTranscript(data.transcript);
          setIsLoading(false);

          // 2. Automatically generate or fetch AI Video Intelligence Report
          fetchAnalysis(data.transcript, data.metadata);
        }
      } catch (err: any) {
        if (isMounted) {
          setIsLoading(false);
          setErrorMsg(err.message || "Transcript unavailable for this video.");
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [videoId, currentLanguage]);

  const fetchAnalysis = async (t: NormalizedTranscript, m: YouTubeVideoMetadata) => {
    setIsAiLoading(true);
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: t, metadata: m }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("AI Analysis fetch error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSeek = (seconds: number) => {
    setSeekTime(seconds);
    // Smooth scroll to top player on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveVideo = () => {
    setIsSaved(!isSaved);
    // Persist bookmark in localStorage / Supabase
    try {
      const existing = JSON.parse(localStorage.getItem("tubemind_saved_videos") || "[]");
      if (!isSaved) {
        localStorage.setItem("tubemind_saved_videos", JSON.stringify([...existing, { videoId, title: metadata?.title, date: new Date().toISOString() }]));
      } else {
        localStorage.setItem("tubemind_saved_videos", JSON.stringify(existing.filter((v: any) => v.videoId !== videoId)));
      }
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-lg animate-pulse">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Reading Video Spoken Content...</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Extracting and normalizing timestamps, captions, and speech segments.
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Transcript Not Available</h2>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
        <Link
          href="/"
          className="mt-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Try Another YouTube Video
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analyzer
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSaveVideo}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              isSaved
                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30"
                : "bg-card text-foreground hover:bg-secondary border-border"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "Saved" : "Save Video"}</span>
          </button>

          {transcript && (
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-brand-600 to-rose-500 text-white rounded-xl hover:opacity-95 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export & Subtitles</span>
            </button>
          )}
        </div>
      </div>

      {/* Video Title Header */}
      {metadata && (
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
            {metadata.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{metadata.channelName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {metadata.durationFormatted} ({transcript?.totalWords} spoken words)
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-secondary text-foreground font-medium">
              Captions: {metadata.captionType === "manual" ? "Verified Manual" : "Auto ASR"}
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-500 inline-flex items-center gap-1 ml-auto"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Grid: Player (Left) + Synced Transcript Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Player & View Content */}
        <div className="lg:col-span-7 space-y-6">
          <YouTubeEmbedPlayer videoId={videoId} seekTime={seekTime} />

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-secondary/60 rounded-2xl border border-border">
            {[
              { id: "intelligence" as const, label: "AI Intelligence", icon: Sparkles },
              { id: "scripts" as const, label: "Script Studio", icon: Video },
              { id: "qa" as const, label: "Ask Video AI", icon: MessageSquareText },
              { id: "transcript" as const, label: "Full Transcript", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    isSelected
                      ? "bg-card text-foreground shadow-sm border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active View Container */}
          <div>
            {activeView === "intelligence" && (
              isAiLoading ? (
                <div className="bg-card rounded-2xl p-12 border border-border text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
                  <p className="text-sm font-bold text-foreground">Synthesizing Video Intelligence...</p>
                  <p className="text-xs text-muted-foreground">Extracting DNA, timeline chapters, and facts matrix.</p>
                </div>
              ) : analysis ? (
                <VideoIntelligenceReport analysis={analysis} onSeek={handleSeek} />
              ) : null
            )}

            {activeView === "scripts" && transcript && (
              <ScriptStudio transcript={transcript} metadata={metadata || undefined} />
            )}

            {activeView === "qa" && transcript && (
              <VideoQAChat transcript={transcript} onSeek={handleSeek} />
            )}

            {activeView === "transcript" && transcript && (
              <div className="block lg:hidden">
                <TranscriptViewer
                  transcript={transcript}
                  availableLanguages={metadata?.availableLanguages}
                  currentLanguage={currentLanguage}
                  onLanguageChange={setCurrentLanguage}
                  onSeek={handleSeek}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Synced Transcript Drawer on Desktop */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24 h-[calc(100vh-8rem)]">
          {transcript && (
            <TranscriptViewer
              transcript={transcript}
              availableLanguages={metadata?.availableLanguages}
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              onSeek={handleSeek}
            />
          )}
        </div>
      </div>

      {/* Export Subtitles Modal */}
      {transcript && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          transcript={transcript}
          metadata={metadata || undefined}
          analysis={analysis}
        />
      )}
    </div>
  );
}
