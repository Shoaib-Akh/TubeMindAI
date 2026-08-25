import { TranscriptSegment } from "@/types/transcript";

/**
 * Formats seconds into standard WebVTT timestamp: HH:MM:SS.mmm
 * Example: 00:01:24.500
 */
export function formatVttTimestamp(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const hh = hrs.toString().padStart(2, "0");
  const mm = mins.toString().padStart(2, "0");
  const ss = secs.toString().padStart(2, "0");
  const mmm = millis.toString().padStart(3, "0");

  return `${hh}:${mm}:${ss}.${mmm}`;
}

/**
 * Converts TranscriptSegments to valid WebVTT (.vtt) format
 */
export function generateVtt(segments: TranscriptSegment[]): string {
  if (!segments || segments.length === 0) return "WEBVTT\n\n";

  const lines = ["WEBVTT", ""];

  segments.forEach((seg, i) => {
    const startTime = formatVttTimestamp(seg.startTime);
    const endTime = formatVttTimestamp(seg.endTime);
    const text = seg.text.trim();
    lines.push(`${i + 1}`);
    lines.push(`${startTime} --> ${endTime}`);
    lines.push(text);
    lines.push("");
  });

  return lines.join("\n");
}
