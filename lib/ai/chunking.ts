import { TranscriptSegment } from "@/types/transcript";

export interface TranscriptChunk {
  chunkIndex: number;
  totalChunks: number;
  startTime: number;
  endTime: number;
  startFormatted: string;
  endFormatted: string;
  segments: TranscriptSegment[];
  text: string;
  wordCount: number;
}

/**
 * Splits transcript segments into semantic, token/word-aware chunks for long video processing
 */
export function chunkTranscript(
  segments: TranscriptSegment[],
  maxWordsPerChunk: number = 2500,
  overlapSegments: number = 2
): TranscriptChunk[] {
  if (!segments || segments.length === 0) return [];

  const chunks: TranscriptChunk[] = [];
  let currentSegments: TranscriptSegment[] = [];
  let currentWordCount = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segWords = seg.text.split(/\s+/).filter(Boolean).length;

    if (currentWordCount + segWords > maxWordsPerChunk && currentSegments.length > 0) {
      // Finalize current chunk
      const startSeg = currentSegments[0];
      const endSeg = currentSegments[currentSegments.length - 1];

      chunks.push({
        chunkIndex: chunks.length + 1,
        totalChunks: 0, // updated later
        startTime: startSeg.startTime,
        endTime: endSeg.endTime,
        startFormatted: startSeg.startFormatted,
        endFormatted: endSeg.endFormatted,
        segments: [...currentSegments],
        text: currentSegments.map((s) => `[${s.startFormatted}] ${s.text}`).join(" "),
        wordCount: currentWordCount,
      });

      // Prepare next chunk with slight overlap for conversational continuity
      const overlapStart = Math.max(0, currentSegments.length - overlapSegments);
      const overlap = currentSegments.slice(overlapStart);
      currentSegments = [...overlap, seg];
      currentWordCount = currentSegments.reduce(
        (acc, s) => acc + s.text.split(/\s+/).filter(Boolean).length,
        0
      );
    } else {
      currentSegments.push(seg);
      currentWordCount += segWords;
    }
  }

  // Add final remaining chunk
  if (currentSegments.length > 0) {
    const startSeg = currentSegments[0];
    const endSeg = currentSegments[currentSegments.length - 1];
    chunks.push({
      chunkIndex: chunks.length + 1,
      totalChunks: 0,
      startTime: startSeg.startTime,
      endTime: endSeg.endTime,
      startFormatted: startSeg.startFormatted,
      endFormatted: endSeg.endFormatted,
      segments: [...currentSegments],
      text: currentSegments.map((s) => `[${s.startFormatted}] ${s.text}`).join(" "),
      wordCount: currentWordCount,
    });
  }

  // Set totalChunks
  chunks.forEach((c) => {
    c.totalChunks = chunks.length;
  });

  return chunks;
}
