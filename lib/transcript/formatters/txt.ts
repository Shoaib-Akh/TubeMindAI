import { TranscriptSegment } from "@/types/transcript";

/**
 * Generates clean plain text from transcript
 */
export function generatePlainText(segments: TranscriptSegment[], includeTimestamps: boolean = false): string {
  if (!segments || segments.length === 0) return "";

  if (includeTimestamps) {
    return segments
      .map((seg) => `[${seg.startFormatted}] ${seg.text.trim()}`)
      .join("\n");
  }

  // Combine into clean readable paragraphs
  return segments.map((s) => s.text.trim()).join(" ");
}
