import { ITranscriptProvider } from "./types";
import { YouTubeTranscriptProvider } from "./youtube-provider";

let defaultProvider: ITranscriptProvider | null = null;

export function getTranscriptProvider(): ITranscriptProvider {
  if (!defaultProvider) {
    defaultProvider = new YouTubeTranscriptProvider();
  }
  return defaultProvider!;
}

export * from "./types";
export * from "./youtube-provider";
export * from "./normalizer";
export * from "./formatters";
