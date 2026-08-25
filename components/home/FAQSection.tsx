"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const faqs = [
    {
      q: "Does TubeMind AI work for any YouTube video?",
      a: "TubeMind AI works for any public YouTube video that has available spoken audio, auto-generated captions, or manual subtitles. If captions are disabled by the video owner or the video is marked private, our engine clearly notifies you.",
    },
    {
      q: "What is the difference between Clean Script, Rewritten Script, and Summary?",
      a: "Original Transcript contains exact spoken text with timestamps. Clean Script keeps 100% of the exact spoken content but polishes grammar and formatting. AI Rewritten Script structures the information into fresh, high-engagement content for creators. Summary condenses the key points into concise, scannable paragraphs.",
    },
    {
      q: "Can I download subtitles in SRT and WebVTT format?",
      a: "Yes! TubeMind AI generates standards-compliant .srt (with comma millisecond separators) and .vtt subtitle files, as well as plain text (.txt), structured JSON, and formatted Markdown.",
    },
    {
      q: "How does the Grounded Video Q&A prevent hallucinations?",
      a: "Our Q&A engine performs strict transcript grounding. It searches the actual spoken segments and provides clickable timestamp citations. If an answer cannot be found in the video, it truthfully states that the information is not present.",
    },
    {
      q: "Do I need an account to use TubeMind AI?",
      a: "No account is required for instant transcript extraction, summaries, and downloads. Signing up for a free account allows you to save video bookmarks, access personal analysis history, and customize export formats.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-3xl font-extrabold text-foreground tracking-tight">
          Everything You Need to Know
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-card rounded-xl border border-border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-secondary/40 transition-colors"
              >
                <span className="font-bold text-base text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
