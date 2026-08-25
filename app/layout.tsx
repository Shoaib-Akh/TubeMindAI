import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://tubemind.ai"),
  title: "TubeMind AI — YouTube Video Intelligence, Transcripts & Script Studio",
  description:
    "Transform any YouTube video into verified transcripts, deep AI summaries, timestamped chapters, viral scripts (Shorts, YouTube, Voiceover), and interactive grounded Q&A.",
  keywords: [
    "YouTube Transcript Generator",
    "YouTube Video Summary",
    "YouTube Script Generator",
    "YouTube to Text Converter",
    "SRT Subtitle Downloader",
    "Video Intelligence",
    "YouTube Shorts Script",
  ],
  authors: [{ name: "TubeMind AI" }],
  openGraph: {
    title: "TubeMind AI — YouTube Video Intelligence & Script Studio",
    description:
      "Understand any YouTube video in seconds with verified transcripts, AI summaries, timeline chapters, and multi-format script generators.",
    url: "https://tubemind.ai",
    siteName: "TubeMind AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TubeMind AI — YouTube Video Intelligence",
    description: "Understand any YouTube video in seconds with AI transcripts and scripts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased flex flex-col min-h-screen selection:bg-brand-500 selection:text-white font-sans">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
