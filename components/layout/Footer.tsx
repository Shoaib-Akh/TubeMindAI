import React from "react";
import Link from "next/link";
import { Sparkles, Youtube, Shield, FileText, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">TubeMind AI </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              The next-generation YouTube Video Intelligence platform. Convert video spoken content into timestamped insights, structured summaries, viral shorts scripts, and grounded Q&A.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              <span>Processes public caption & transcript streams responsibly.</span>
            </div>
          </div>

          {/* Product Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Transcript Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/youtube-transcript" className="hover:text-foreground transition-colors">
                  YouTube Transcript
                </Link>
              </li>
              <li>
                <Link href="/youtube-transcript-generator" className="hover:text-foreground transition-colors">
                  Transcript Generator
                </Link>
              </li>
              <li>
                <Link href="/youtube-transcript-downloader" className="hover:text-foreground transition-colors">
                  Transcript Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-video-to-text" className="hover:text-foreground transition-colors">
                  Video to Text
                </Link>
              </li>
              <li>
                <Link href="/youtube-transcript-summary" className="hover:text-foreground transition-colors">
                  Video Summary AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Script & Subtitles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Scripts & Captions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/youtube-script-generator" className="hover:text-foreground transition-colors">
                  Script Generator
                </Link>
              </li>
              <li>
                <Link href="/youtube-subtitle-downloader" className="hover:text-foreground transition-colors">
                  Subtitle Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-srt-downloader" className="hover:text-foreground transition-colors">
                  SRT Downloader
                </Link>
              </li>
              <li>
                <Link href="/youtube-transcript-with-timestamps" className="hover:text-foreground transition-colors">
                  Timestamps Extractor
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Guides & Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About TubeMind
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-foreground transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 mt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} TubeMind AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern AI & web technology for creators, learners, and analysts.
          </p>
        </div>
      </div>
    </footer>
  );
}
