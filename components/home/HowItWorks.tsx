import React from "react";
import { Link2, Cpu, FileCheck2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Paste YouTube Video Link",
      description: "Drop any YouTube URL, Shorts link, or Video ID into the input bar. Works for educational videos, podcasts, lectures, and interviews.",
      icon: Link2,
    },
    {
      number: "02",
      title: "Deep Audio & Transcript Extraction",
      description: "Our engine retrieves the multi-language captions, cleans up broken punctuation and duplicate segments, and prepares normalized timestamps.",
      icon: Cpu,
    },
    {
      number: "03",
      title: "Instant Intelligence & Multi-Format Scripts",
      description: "Get structured summaries, key takeaways, verified facts, viral Shorts scripts, YouTube breakdowns, and ask grounded Q&A with real video seeking.",
      icon: FileCheck2,
    },
  ];

  return (
    <section className="py-16 md:py-24 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
            Seamless 3-Step Flow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How TubeMind AI Works
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-card rounded-2xl p-8 border border-border hover:border-brand-500/30 transition-all group hover:shadow-xl hover:shadow-brand-500/5"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-muted-foreground/30 group-hover:text-brand-500/40 transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
