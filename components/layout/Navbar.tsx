"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Video, FileText, Bot, Sun, Moon, Laptop, Menu, X, BookOpen, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const toolsList = [
    { name: "YouTube Transcript", href: "/youtube-transcript" },
    { name: "Transcript Generator", href: "/youtube-transcript-generator" },
    { name: "Transcript Downloader", href: "/youtube-transcript-downloader" },
    { name: "Video to Text", href: "/youtube-video-to-text" },
    { name: "Transcript Summary", href: "/youtube-transcript-summary" },
    { name: "Script Generator", href: "/youtube-script-generator" },
    { name: "Subtitle Downloader", href: "/youtube-subtitle-downloader" },
    { name: "SRT Downloader", href: "/youtube-srt-downloader" },
    { name: "Transcript with Timestamps", href: "/youtube-transcript-with-timestamps" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight text-foreground">
              <span>TubeMind</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wider font-medium -mt-1 uppercase">
              Video Intelligence
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === "/" ? "text-brand-600 dark:text-brand-400 bg-brand-500/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            Studio
          </Link>

          {/* Tools Dropdown */}
          <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onMouseEnter={() => setToolsOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <span>Tools</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {toolsOpen && (
              <div
                className="absolute top-full left-0 w-64 p-2 bg-card rounded-xl border border-border shadow-xl grid gap-1 animate-in fade-in-50 zoom-in-95 duration-150"
                onMouseEnter={() => setToolsOpen(true)}
              >
                {toolsList.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsOpen(false)}
                    className="px-3 py-2 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname.startsWith("/blog") ? "text-brand-600 dark:text-brand-400 bg-brand-500/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            Blog
          </Link>

          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard" ? "text-brand-600 dark:text-brand-400 bg-brand-500/5 font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme switcher */}
          <div className="flex items-center p-1 bg-secondary/80 rounded-xl border border-border">
            <button
              onClick={() => setTheme("light")}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-all ${
                theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-all ${
                theme === "dark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme("system")}
              title="System Default"
              className={`p-1.5 rounded-lg transition-all ${
                theme === "system" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Laptop className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary/80 rounded-xl border border-border transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:opacity-95 shadow-md shadow-brand-500/20 rounded-xl transition-all active:scale-95"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-lg bg-secondary text-foreground"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-secondary text-foreground"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
          >
            Studio
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
          >
            Blog
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-foreground hover:bg-secondary"
          >
            Dashboard
          </Link>
          <div className="pt-2 border-t border-border space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-border"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-brand-600 rounded-xl"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
