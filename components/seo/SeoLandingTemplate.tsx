import React from "react";
import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { FAQSection } from "@/components/home/FAQSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CheckCircle2, Shield, Zap, Sparkles } from "lucide-react";

export interface SeoLandingProps {
  h1: string;
  badge: string;
  subheading: string;
  introContent: string;
  benefits: Array<{ title: string; desc: string }>;
  faqs?: Array<{ q: string; a: string }>;
  structuredSchema?: object;
}

export function SeoLandingTemplate({
  h1,
  badge,
  subheading,
  introContent,
  benefits,
  faqs,
  structuredSchema,
}: SeoLandingProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD Schema */}
      {structuredSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
      )}

      {/* Hero Header with URL Analyzer */}
      <HeroSection />

      {/* Content & Benefits Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {h1}
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">{introContent}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-card border border-border hover:border-brand-500/30 transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FeatureGrid />
      <FAQSection />
    </div>
  );
}
