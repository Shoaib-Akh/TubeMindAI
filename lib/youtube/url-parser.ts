import { ParsedYouTubeUrl } from "@/types/youtube";

/**
 * Robust YouTube URL Parser & Video ID Extractor
 */
export function parseYouTubeUrl(input: string): ParsedYouTubeUrl {
  if (!input || typeof input !== "string") {
    return {
      isValid: false,
      videoId: null,
      timestamp: null,
      normalizedUrl: null,
      sourceType: "unknown",
    };
  }

  const trimmed = input.trim();

  // Check if user directly passed an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      isValid: true,
      videoId: trimmed,
      timestamp: null,
      normalizedUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      sourceType: "standard",
    };
  }

  try {
    // Add protocol if missing
    let urlString = trimmed;
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = `https://${urlString}`;
    }

    const url = new URL(urlString);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let videoId: string | null = null;
    let sourceType: ParsedYouTubeUrl["sourceType"] = "unknown";
    let timestamp: number | null = null;

    // Parse time offset if present (t=120, t=2m15s, etc.)
    const tParam = url.searchParams.get("t") || url.searchParams.get("time_continue");
    if (tParam) {
      timestamp = parseTimeString(tParam);
    }

    // Match YouTube hosts
    if (host === "youtu.be") {
      sourceType = "shortlink";
      const pathParts = url.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0 && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[0])) {
        videoId = pathParts[0];
      }
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        sourceType = "standard";
        const v = url.searchParams.get("v");
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
          videoId = v;
        }
      } else if (url.pathname.startsWith("/shorts/")) {
        sourceType = "shorts";
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[1])) {
          videoId = pathParts[1];
        }
      } else if (url.pathname.startsWith("/embed/")) {
        sourceType = "embed";
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[1])) {
          videoId = pathParts[1];
        }
      } else if (url.pathname.startsWith("/v/")) {
        sourceType = "embed";
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[1])) {
          videoId = pathParts[1];
        }
      } else if (url.pathname.startsWith("/live/")) {
        sourceType = "standard";
        const pathParts = url.pathname.split("/").filter(Boolean);
        if (pathParts.length >= 2 && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[1])) {
          videoId = pathParts[1];
        }
      }
    }

    if (videoId) {
      return {
        isValid: true,
        videoId,
        timestamp,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
        sourceType,
      };
    }
  } catch {
    // Malformed URL
  }

  return {
    isValid: false,
    videoId: null,
    timestamp: null,
    normalizedUrl: null,
    sourceType: "unknown",
  };
}

function parseTimeString(t: string): number {
  if (/^\d+$/.test(t)) {
    return parseInt(t, 10);
  }
  let total = 0;
  const hours = t.match(/(\d+)h/i);
  const minutes = t.match(/(\d+)m/i);
  const seconds = t.match(/(\d+)s/i);

  if (hours) total += parseInt(hours[1], 10) * 3600;
  if (minutes) total += parseInt(minutes[1], 10) * 60;
  if (seconds) total += parseInt(seconds[1], 10);

  return total > 0 ? total : 0;
}
