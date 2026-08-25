"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building,
  Wrench,
  ListTodo,
  TrendingUp,
  ShieldAlert,
  Play,
  Copy,
  Check,
} from "lucide-react";
import { VideoAnalysisResult } from "@/types/ai";

interface VideoIntelligenceReportProps {
  analysis: VideoAnalysisResult;
  onSeek: (seconds: number) => void;
}

export function VideoIntelligenceReport({ analysis, onSeek }: VideoIntelligenceReportProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (sectionName: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Summary Banner */}
      <section className="bg-gradient-to-br from-brand-500/10 via-card to-card rounded-2xl p-6 sm:p-8 border border-brand-500/20 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-wide">
              Quick Summary
            </h3>
          </div>
          <button
            onClick={() => handleCopy("quick", analysis.quickSummary)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-background hover:bg-secondary border border-border rounded-lg text-foreground transition-colors"
          >
            {copiedSection === "quick" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "quick" ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
          {analysis.quickSummary}
        </p>
      </section>

      {/* Video DNA Grid */}
      <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-500" />
          Video DNA & Purpose
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-xs text-muted-foreground font-medium">Main Subject</span>
            <p className="text-sm font-bold text-foreground mt-1">{analysis.videoDna?.mainSubject || "General Discussion"}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-xs text-muted-foreground font-medium">Target Audience</span>
            <p className="text-sm font-bold text-foreground mt-1">{analysis.videoDna?.targetAudience || "General Public"}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-xs text-muted-foreground font-medium">Speaker Objective</span>
            <p className="text-sm font-bold text-foreground mt-1">{analysis.videoDna?.speakerObjective || "Information Sharing"}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-border/60">
            <span className="text-xs text-muted-foreground font-medium">Tone & Style</span>
            <p className="text-sm font-bold text-foreground mt-1">{analysis.videoDna?.tone || "Informative"}</p>
          </div>
        </div>
      </section>

      {/* Detailed Summary */}
      <section className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Detailed Summary</h3>
          <button
            onClick={() => handleCopy("detailed", analysis.detailedSummary)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-foreground transition-colors"
          >
            {copiedSection === "detailed" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "detailed" ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <div className="text-sm sm:text-base text-muted-foreground leading-relaxed space-y-3 whitespace-pre-line">
          {analysis.detailedSummary}
        </div>
      </section>

      {/* Timeline Chapters with Player Seek */}
      {analysis.timelineChapters && analysis.timelineChapters.length > 0 && (
        <section className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            Timeline & Chapters
          </h3>
          <div className="space-y-3">
            {analysis.timelineChapters.map((ch, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-secondary/40 hover:bg-secondary border border-border/60 transition-all group gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => onSeek(ch.startTime)}
                    className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-all flex items-center gap-1 flex-shrink-0"
                    title="Jump to chapter"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{ch.timestamp}</span>
                  </button>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{ch.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{ch.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Takeaways & Meaningful Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Key Takeaways
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {analysis.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Important Points
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {analysis.importantPoints.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Facts, Numbers & Claims Matrix */}
      {analysis.factsAndNumbers && analysis.factsAndNumbers.length > 0 && (
        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Important Facts & Numbers
            </h3>
            <span className="text-[11px] text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full border border-border">
              Claim mentioned in video
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analysis.factsAndNumbers.map((fact, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-secondary/40 border border-border/60">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-sm font-extrabold text-brand-600 dark:text-brand-400">
                    {fact.metric}
                  </span>
                  {fact.timestamp && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      @{fact.timestamp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-snug">{fact.context}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Entities Extraction (People, Companies, Tools) */}
      <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="text-base font-bold text-foreground mb-4">
          People, Companies & Tools Mentioned
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* People */}
          <div className="p-4 rounded-xl bg-secondary/40 border border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Users className="w-3.5 h-3.5 text-blue-500" /> People
            </h4>
            <div className="space-y-2">
              {analysis.entities?.people?.length > 0 ? (
                analysis.entities.people.map((p, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-bold text-foreground">{p.name}</span>
                    {p.roleOrContext && (
                      <span className="text-muted-foreground"> — {p.roleOrContext}</span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No specific individuals cited.</span>
              )}
            </div>
          </div>

          {/* Companies */}
          <div className="p-4 rounded-xl bg-secondary/40 border border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Building className="w-3.5 h-3.5 text-amber-500" /> Organizations & Brands
            </h4>
            <div className="space-y-2">
              {analysis.entities?.companies?.length > 0 ? (
                analysis.entities.companies.map((c, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-bold text-foreground">{c.name}</span>
                    {c.context && <span className="text-muted-foreground"> — {c.context}</span>}
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">None identified.</span>
              )}
            </div>
          </div>

          {/* Tools & Websites */}
          <div className="p-4 rounded-xl bg-secondary/40 border border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Wrench className="w-3.5 h-3.5 text-emerald-500" /> Tools & Websites
            </h4>
            <div className="space-y-2">
              {analysis.entities?.toolsAndWebsites?.length > 0 ? (
                analysis.entities.toolsAndWebsites.map((t, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-bold text-foreground">{t.name}</span>
                    {t.context && <span className="text-muted-foreground"> — {t.context}</span>}
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No specific tools mentioned.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Action Items */}
      {analysis.actionItems && analysis.actionItems.length > 0 && (
        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-brand-500" />
            Action Items & Next Steps
          </h3>
          <div className="space-y-2.5">
            {analysis.actionItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50"
              >
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.priority === "essential"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {item.priority}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.task}</p>
                  {item.context && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.context}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Warnings & Conclusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.risksAndLimitations && analysis.risksAndLimitations.length > 0 && (
          <section className="bg-card rounded-2xl p-6 border border-amber-500/20 shadow-sm">
            <h3 className="text-base font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Risks, Warnings & Caveats
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              {analysis.risksAndLimitations.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground mb-2">Final Conclusion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.conclusion}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
