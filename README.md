# ⚡ TubeMind AI — Production-Ready YouTube Video Intelligence & Script Studio

**TubeMind AI** is an enterprise-grade web application that converts any YouTube video into structured intelligence, verified transcripts, topic timelines, data matrices, multi-format creator scripts, and grounded Q&A with live timestamp seeking.

---

## 🌟 Key Features

1. **Robust Transcript Engine**:
   - Multi-tier extraction (Innertube + oEmbed + ASR parsing) without fake APIs.
   - Intelligent text normalizer (fixes duplicate fragments, whitespace, capitalization).
   - Precision timestamps formatted for subtitles.
2. **AI Video Intelligence Pipeline**:
   - **Quick Summary**: 2-5 sentence elevator pitch.
   - **Detailed Summary**: Multi-paragraph structured breakdown.
   - **Video DNA**: Main topic, target audience, tone, speaker objective.
   - **Timeline Chapters**: Clickable timestamps linked to the embedded video player.
   - **Facts & Numbers Matrix**: Identified metrics, dates, and claims with disclaimers.
   - **Entity Mentions**: People, organizations, tools, websites.
   - **Action Items & Opinions**: Practical takeaways and warnings.
3. **Script Studio (6 Formats)**:
   - Original Transcript
   - Clean Spoken Script
   - AI Rewritten Script
   - YouTube Video Script (Hook, Intro, Core Sections, Retention Loops, Outro CTA)
   - Voiceover Narration Script (with audio pacing directions)
   - Shorts & Reels Scripts (30s, 60s, 90s with visual hooks)
4. **Grounded Video Q&A**:
   - Strict transcript-grounded RAG assistant.
   - Answers cite exact clickable timestamps (`[02:30]`) that seek the embedded player.
   - Zero hallucinations ("This information is not mentioned in the transcript").
5. **Export & Subtitles Suite**:
   - SubRip (`.srt`)
   - WebVTT (`.vtt`)
   - Plain Text (`.txt`)
   - Structured JSON (`.json`)
   - Formatted Markdown (`.md`)
6. **Supabase Integration**:
   - PostgreSQL migrations with Row Level Security (RLS).
   - Supabase Auth (`/login`, `/signup`, `/forgot-password`, `/reset-password`).
   - Personal dashboard with search, saved bookmarks, and history.
7. **Complete SEO Suite**:
   - 8 High-Intent Programmatic Landing Pages (`/youtube-transcript`, `/youtube-video-to-text`, etc.).
   - Full 7-article SEO blog engine (`/blog`, `/blog/[slug]`).
   - Dynamic `sitemap.ts`, `robots.ts`, JSON-LD schemas (`SoftwareApplication`, `FAQPage`, `WebSite`).

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Dark/Light Theme System
- **Icons**: Lucide React
- **Validation**: Zod
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **AI Models**: OpenAI (`gpt-4o-mini`), Gemini, Anthropic (with heuristic fallback)

---

## 🚀 Quick Start

### 1. Installation
\`\`\`bash
cd tubemind-ai
npm install
\`\`\`

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`
*(Note: TubeMind AI is equipped with intelligent NLP fallbacks so you can test all features immediately even before adding API keys!)*

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase)

To enable persistent user history and authentication:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste and run the SQL migration script located at:
   \`supabase/migrations/001_initial_schema.sql\`
4. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

---

## 🧪 Testing & Verification

Run typechecking:
\`\`\`bash
npm run typecheck
\`\`\`

Build production bundle:
\`\`\`bash
npm run build
\`\`\`

---

## 📄 License
MIT License. Built for creators, researchers, and developers.
# TubeMindAI
