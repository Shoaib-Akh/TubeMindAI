import { TranscriptSegment } from "@/types/transcript";

/**
 * Formats seconds into standard SRT timestamp: HH:MM:SS,mmm
 * Example: 00:01:24,500
 */
export function formatSrtTimestamp(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const hh = hrs.toString().padStart(2, "0");
  const mm = mins.toString().padStart(2, "0");
  const ss = secs.toString().padStart(2, "0");
  const mmm = millis.toString().padStart(3, "0");

  return `${hh}:${mm}:${ss},${mmm}`;
}

/**
 * Converts TranscriptSegments to valid SubRip (.srt) format
 */
export function generateSrt(segments: TranscriptSegment[]): string {
  if (!segments || segments.length === 0) return "";

  return segments
    .map((seg, i) => {
      const startTime = formatSrtTimestamp(seg.startTime);
      const endTime = formatSrtTimestamp(seg.endTime);
      const text = seg.text.trim();
      return `${i + 1}\n${startTime} --> ${endTime}\n${text}\n`;
    })
    .join("\n");
}
