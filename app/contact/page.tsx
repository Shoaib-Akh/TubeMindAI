import React from "react";
import { Metadata } from "next";
import { Mail, MessageSquare, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Support — TubeMind AI",
  description: "Get in touch with the TubeMind AI engineering and support team.",
  alternates: { canonical: "https://tubemind.ai/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Contact Support</h1>
        <p className="text-sm text-muted-foreground">
          Have a question, feedback, or enterprise feature request? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-8 shadow-md space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
          <Mail className="w-6 h-6 text-brand-500 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Email Inquiries</h3>
            <p className="text-xs text-muted-foreground">support@tubemind.ai</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Your Name</label>
            <input
              type="text"
              required
              placeholder="Alex Morgan"
              className="w-full px-4 py-2.5 bg-background text-foreground text-sm rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              className="w-full px-4 py-2.5 bg-background text-foreground text-sm rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Message</label>
            <textarea
              rows={4}
              required
              placeholder="How can we help you?"
              className="w-full px-4 py-2.5 bg-background text-foreground text-sm rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
