import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { ArrowLeft, Clock, Calendar, User, Sparkles, Share2 } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: "Blog Post Not Found — TubeMind AI" };

  return {
    title: `${post.title} — TubeMind AI Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://tubemind.ai/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blog & Guides
      </Link>

      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {post.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>
      </header>

      {/* Body Content */}
      <div className="prose dark:prose-invert max-w-none text-foreground text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
        {post.content}
      </div>

      {/* Embedded Try Analyzer Callout */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-brand-600/10 via-card to-rose-500/10 border border-brand-500/20 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-brand-500 mx-auto" />
        <h3 className="text-xl font-bold text-foreground">
          Ready to Analyze Any YouTube Video?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Extract verified transcripts, get instant AI summaries, and generate viral scripts in seconds with TubeMind AI.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 transition-all"
        >
          Try TubeMind AI Free
        </Link>
      </div>
    </article>
  );
}
