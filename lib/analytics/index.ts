export type AnalyticsEvent =
  | "page_view"
  | "transcript_request"
  | "transcript_success"
  | "transcript_error"
  | "ai_analysis_generated"
  | "script_generated"
  | "qa_question_asked"
  | "copy_action"
  | "download_action"
  | "user_signup"
  | "user_login";

interface EventPayload {
  videoId?: string;
  format?: string;
  scriptType?: string;
  language?: string;
  errorType?: string;
  [key: string]: any;
}

/**
 * Privacy-friendly Analytics abstraction.
 * Note: Never sends raw transcript or speech text to analytics providers.
 */
export function trackEvent(event: AnalyticsEvent, payload?: EventPayload) {
  if (typeof window === "undefined") return;

  const eventData = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // 1. Console in development
  if (process.env.NODE_ENV === "development") {
    // console.log("[Analytics Event]", eventData);
  }

  // 2. Custom analytics hook (Google Analytics / Plausible / PostHog)
  if ((window as any).gtag) {
    (window as any).gtag("event", event, payload);
  }
}
