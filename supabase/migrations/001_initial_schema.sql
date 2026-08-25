-- ==============================================================================
-- TubeMind AI — Production Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. VIDEOS TABLE (Global Cache)
create table if not exists public.videos (
  id text primary key, -- YouTube Video ID (e.g. dQw4w9WgXcQ)
  url text not null,
  title text not null,
  channel_name text not null,
  channel_url text,
  duration_seconds integer default 0,
  thumbnail_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.videos enable row level security;

create policy "Videos are readable by all authenticated and anon users"
  on public.videos for select
  using (true);

create policy "Anyone can insert or update cached video metadata"
  on public.videos for insert
  with check (true);

-- 3. TRANSCRIPTS TABLE
create table if not exists public.transcripts (
  id uuid default uuid_generate_v4() primary key,
  video_id text references public.videos(id) on delete cascade not null,
  language text default 'en' not null,
  is_auto_generated boolean default false,
  data jsonb not null, -- NormalizedTranscript object
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_video_language unique (video_id, language)
);

alter table public.transcripts enable row level security;

create policy "Transcripts are viewable by all users"
  on public.transcripts for select
  using (true);

create policy "Anyone can insert transcript cache"
  on public.transcripts for insert
  with check (true);

-- 4. AI_GENERATIONS TABLE
create table if not exists public.ai_generations (
  id uuid default uuid_generate_v4() primary key,
  video_id text references public.videos(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  type text not null, -- 'analysis', 'script', 'qa'
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_generations enable row level security;

create policy "Public generations are viewable by all"
  on public.ai_generations for select
  using (true);

create policy "Authenticated users can store generations"
  on public.ai_generations for insert
  with check (auth.uid() = user_id or user_id is null);

-- 5. USER_HISTORY TABLE
create table if not exists public.user_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  video_id text references public.videos(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_history enable row level security;

create policy "Users can view their own history"
  on public.user_history for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own history"
  on public.user_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own history"
  on public.user_history for delete
  using (auth.uid() = user_id);

-- 6. SAVED_VIDEOS (Bookmarks)
create table if not exists public.saved_videos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  video_id text references public.videos(id) on delete cascade not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_video_bookmark unique (user_id, video_id)
);

alter table public.saved_videos enable row level security;

create policy "Users can view their own saved videos"
  on public.saved_videos for select
  using (auth.uid() = user_id);

create policy "Users can insert saved videos"
  on public.saved_videos for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their saved videos"
  on public.saved_videos for delete
  using (auth.uid() = user_id);

-- 7. USAGE_LOGS
create table if not exists public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text,
  action text not null, -- 'transcript_fetch', 'ai_analysis', 'script_gen', 'qa_ask'
  video_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.usage_logs enable row level security;

create policy "Usage logs insertable"
  on public.usage_logs for insert
  with check (true);

-- Indexes for lightning fast queries
create index if not exists idx_transcripts_video_id on public.transcripts(video_id);
create index if not exists idx_user_history_user_id on public.user_history(user_id);
create index if not exists idx_saved_videos_user_id on public.saved_videos(user_id);
create index if not exists idx_ai_generations_video_id on public.ai_generations(video_id);
