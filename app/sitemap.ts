import { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tubemind.ai";

  const staticRoutes = [
    "",
    "/youtube-transcript",
    "/youtube-transcript-generator",
    "/youtube-transcript-downloader",
    "/youtube-video-to-text",
    "/youtube-transcript-summary",
    "/youtube-script-generator",
    "/youtube-subtitle-downloader",
    "/youtube-srt-downloader",
    "/youtube-transcript-with-timestamps",
    "/blog",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/contact",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : route.startsWith("/youtube") ? 0.9 : 0.7,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
