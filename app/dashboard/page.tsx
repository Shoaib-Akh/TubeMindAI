"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  History,
  Bookmark,
  Search,
  Trash2,
  ExternalLink,
  Play,
  ArrowRight,
  Video,
  Clock,
  Layers,
} from "lucide-react";

interface HistoryItem {
  videoId: string;
  title: string;
  channelName?: string;
  duration?: string;
  date: string;
  thumbnailUrl?: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"history" | "saved">("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [savedItems, setSavedItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load stored history and bookmarks
    try {
      const saved = JSON.parse(localStorage.getItem("tubemind_saved_videos") || "[]");
      setSavedItems(saved);

      // Default sample items if fresh
      if (saved.length === 0) {
        setHistoryItems([
          {
            videoId: "UF8uR6Z6KLc",
            title: "Steve Jobs' 2005 Stanford Commencement Address",
            channelName: "Stanford",
            duration: "15:04",
            date: new Date().toLocaleDateString(),
            thumbnailUrl: "https://img.youtube.com/vi/UF8uR6Z6KLc/mqdefault.jpg",
          },
          {
            videoId: "g_IaVepNDT4",
            title: "How Quantum Computers Work",
            channelName: "Veritasium",
            duration: "21:30",
            date: new Date(Date.now() - 86400000).toLocaleDateString(),
            thumbnailUrl: "https://img.youtube.com/vi/g_IaVepNDT4/mqdefault.jpg",
          },
        ]);
      } else {
        setHistoryItems(saved);
      }
    } catch (e) {}
  }, []);

  const handleDelete = (videoId: string) => {
    if (activeTab === "saved") {
      const updated = savedItems.filter((i) => i.videoId !== videoId);
      setSavedItems(updated);
      localStorage.setItem("tubemind_saved_videos", JSON.stringify(updated));
    } else {
      setHistoryItems(historyItems.filter((i) => i.videoId !== videoId));
    }
  };

  const currentList = activeTab === "history" ? historyItems : savedItems;
  const filteredList = currentList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.channelName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your analyzed videos, saved transcripts, and generated scripts.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Analyze New Video</span>
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Analyzed Videos</span>
            <p className="text-2xl font-bold text-foreground">{historyItems.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Saved Bookmarks</span>
            <p className="text-2xl font-bold text-foreground">{savedItems.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">AI Script Formats</span>
            <p className="text-2xl font-bold text-foreground">6 Formats</p>
          </div>
        </div>
      </div>

      {/* Main Table / Grid Area */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden space-y-4 p-6">
        {/* Controls: Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-secondary/80 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "history"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Recent History</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "saved"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Videos ({savedItems.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-background text-foreground rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Video List */}
        {filteredList.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Video className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No videos found</p>
            <p className="text-xs text-muted-foreground">
              Paste a YouTube URL on the homepage to start analyzing videos.
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Analyze Video
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredList.map((item) => (
              <div
                key={item.videoId}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-secondary/30 -mx-6 px-6 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.thumbnailUrl ||
                        `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.duration && (
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 text-white text-[9px] font-mono rounded">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/transcript/${item.videoId}`}
                      className="text-sm font-bold text-foreground hover:text-brand-600 dark:hover:text-brand-400 truncate block transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{item.channelName || "YouTube"}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href={`/transcript/${item.videoId}`}
                    className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-brand-600 hover:text-white text-foreground rounded-lg transition-all flex items-center gap-1"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleDelete(item.videoId)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
