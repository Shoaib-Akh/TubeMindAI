import { YouTubeVideoMetadata } from "./youtube";
import { NormalizedTranscript } from "./transcript";
import { VideoAnalysisResult, GeneratedScript } from "./ai";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string; // video_id
          url: string;
          title: string;
          channel_name: string;
          duration_seconds: number;
          thumbnail_url: string;
          metadata: YouTubeVideoMetadata;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          url: string;
          title: string;
          channel_name: string;
          duration_seconds: number;
          thumbnail_url: string;
          metadata: YouTubeVideoMetadata;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          title?: string;
          channel_name?: string;
          duration_seconds?: number;
          thumbnail_url?: string;
          metadata?: YouTubeVideoMetadata;
          updated_at?: string;
        };
      };
      transcripts: {
        Row: {
          id: string;
          video_id: string;
          language: string;
          is_auto_generated: boolean;
          data: NormalizedTranscript;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          language: string;
          is_auto_generated?: boolean;
          data: NormalizedTranscript;
          created_at?: string;
        };
        Update: {
          data?: NormalizedTranscript;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          video_id: string;
          user_id: string | null;
          type: "analysis" | "script" | "qa";
          data: VideoAnalysisResult | GeneratedScript | any;
          created_at: string;
        };
        Insert: {
          id?: string;
          video_id: string;
          user_id?: string | null;
          type: "analysis" | "script" | "qa";
          data: VideoAnalysisResult | GeneratedScript | any;
          created_at?: string;
        };
        Update: {
          data?: any;
        };
      };
      user_history: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          created_at?: string;
        };
        Update: {
          created_at?: string;
        };
      };
      saved_videos: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          notes?: string | null;
        };
      };
    };
  };
}
