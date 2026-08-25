import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "TubeMind AI Blog — Video Intelligence, YouTube Transcripts & Scriptwriting Guides",
  description:
    "Guides, tutorials, and deep dives on extracting YouTube transcripts, AI video summarization, subtitle downloading, and YouTube script generation.",
  alternates: { canonical: "https://tubemind.ai/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Blog Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge & Tutorials</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
          TubeMind AI Blog & Guides
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Actionable strategies and workflows for extracting transcripts, summarizing video content, and writing high-retention video scripts.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="bg-card rounded-2xl border border-border hover:border-brand-500/30 overflow-hidden hover:shadow-xl hover:shadow-brand-500/5 transition-all flex flex-col justify-between group p-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[10px] bg-brand-500/10 px-2 py-0.5 rounded">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg font-bold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{post.date}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
