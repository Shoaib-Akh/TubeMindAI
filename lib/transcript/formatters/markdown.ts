import { NormalizedTranscript } from "@/types/transcript";
import { YouTubeVideoMetadata } from "@/types/youtube";

export function generateTranscriptMarkdown(transcript: NormalizedTranscript, metadata?: YouTubeVideoMetadata): string {
  const title = metadata?.title || `YouTube Video Transcript (${transcript.videoId})`;
  const channel = metadata?.channelName ? `**Channel:** ${metadata.channelName}\n` : "";
  const duration = metadata?.durationFormatted ? `**Duration:** ${metadata.durationFormatted}\n` : "";
  const url = metadata?.url ? `**Video URL:** [${metadata.url}](${metadata.url})\n` : "";

  let md = `# ${title}\n\n`;
  if (channel || duration || url) {
    md += `${channel}${duration}${url}\n---\n\n`;
  }

  md += `## Transcript (${transcript.languageName || transcript.language})\n\n`;

  transcript.segments.forEach((seg) => {
    md += `**[${seg.startFormatted}]** ${seg.text.trim()}\n\n`;
  });

  md += `\n---\n*Exported from [TubeMind AI](https://tubemind.ai)*\n`;
  return md;
}
