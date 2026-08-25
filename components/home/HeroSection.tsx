"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Youtube, CheckCircle2, Loader2, AlertCircle, PlayCircle, Zap } from "lucide-react";
import { parseYouTubeUrl } from "@/lib/youtube/url-parser";

interface HeroSectionProps {
  initialUrl?: string;
}

const SAMPLE_VIDEOS = [
  {
    title: "Steve Jobs 2005 Stanford Speech",
    url: "https://www.youtube.com/watch?v=UF8uR6Z6KLc",
    videoId: "UF8uR6Z6KLc",
    tag: "Inspirational",
  },
  {
    title: "Veritasium: How Quantum Computers Work",
    url: "https://www.youtube.com/watch?v=g_IaVepNDT4",
    videoId: "g_IaVepNDT4",
    tag: "Science",
  },
  {
    title: "MKBHD: The Future of AI Devices",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    tag: "Technology",
  },
];

const ANALYSIS_STEPS = [
  { id: 1, text: "Validating YouTube URL" },
  { id: 2, text: "Reading video information & metadata" },
  { id: 3, text: "Locating available transcript & captions" },
  { id: 4, text: "Normalizing timestamps & cleaning text" },
  { id: 5, text: "Synthesizing AI video intelligence report" },
  { id: 6, text: "Preparing scripts & interactive studio" },
];

export function HeroSection({ initialUrl = "" }: HeroSectionProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorSuggestion, setErrorSuggestion] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setErrorMsg(null);
    setErrorSuggestion(null);

    const parsed = parseYouTubeUrl(url);
    if (!parsed.isValid || !parsed.videoId) {
      setErrorMsg("Please enter a valid YouTube video URL or Video ID.");
      setErrorSuggestion("Example: https://www.youtube.com/watch?v=UF8uR6Z6KLc or https://youtu.be/UF8uR6Z6KLc");
      return;
    }

    setIsLoading(true);
    setCurrentStep(1);

    try {
      // Step 2: Fetch metadata & transcript
      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStep(3);

      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsed.normalizedUrl }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || "Failed to retrieve transcript for this video.");
      }

      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStep(5);
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStep(6);
      await new Promise((r) => setTimeout(r, 300));

      // Redirect to full transcript & intelligence studio page
      router.push(`/transcript/${parsed.videoId}`);
    } catch (err: any) {
      setIsLoading(false);
      setCurrentStep(0);
      setErrorMsg(err.message || "Could not process this video transcript.");
      setErrorSuggestion(
        "Make sure the video is public and has captions or spoken audio enabled."
      );
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/15 via-rose-500/10 to-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Gen YouTube Video Intelligence & Script Generator</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1] mb-6">
          Understand Any YouTube Video{" "}
          <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            in Seconds
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Paste a YouTube URL and immediately extract verified transcripts, AI summaries, timeline chapters, key points, multi-format viral scripts, and ask grounded questions.
        </p>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto bg-card rounded-2xl p-2.5 sm:p-3 border border-border shadow-2xl shadow-brand-500/5 mb-6 transition-all">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full flex-1 flex items-center">
              <div className="absolute left-3.5 text-red-500 pointer-events-none">
                <Youtube className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video link (e.g. https://www.youtube.com/watch?v=...)"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3.5 bg-background text-foreground text-sm sm:text-base rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all placeholder:text-muted-foreground/60"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-600 to-rose-500 text-white font-bold text-sm sm:text-base rounded-xl hover:opacity-95 shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Video</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sample Video Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
          <span className="font-medium flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 text-brand-500" /> Or try an example:
          </span>
          {SAMPLE_VIDEOS.map((sample) => (
            <button
              key={sample.videoId}
              type="button"
              onClick={() => handleSampleClick(sample.url)}
              className="px-3 py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-foreground hover:border-brand-500/30 border border-border transition-all flex items-center gap-1.5"
            >
              <span className="font-medium">{sample.title}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                {sample.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Real-time Progress Stepper */}
        {isLoading && (
          <div className="max-w-xl mx-auto bg-card rounded-2xl p-6 border border-border shadow-xl text-left animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                Processing Video Intelligence
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Step {currentStep} of {ANALYSIS_STEPS.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {ANALYSIS_STEPS.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 text-xs sm:text-sm transition-colors ${
                      isCompleted
                        ? "text-emerald-600 dark:text-emerald-400 font-medium"
                        : isCurrent
                        ? "text-brand-600 dark:text-brand-400 font-bold"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin text-brand-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border flex-shrink-0 flex items-center justify-center text-[10px]" />
                    )}
                    <span>{step.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl p-4 text-left flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">{errorMsg}</p>
              {errorSuggestion && (
                <p className="text-xs text-muted-foreground mt-1">{errorSuggestion}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
