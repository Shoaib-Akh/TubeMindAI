"use client";

import React, { useState } from "react";
import {
  MessageSquareText,
  Send,
  Sparkles,
  Bot,
  User,
  Play,
  Loader2,
  Globe,
  Briefcase,
  GraduationCap,
  Video,
  Languages,
  Check,
  ChevronDown,
} from "lucide-react";
import { NormalizedTranscript } from "@/types/transcript";
import { QAMessage } from "@/types/ai";
import { AI_PERSONAS, TOP_LANGUAGES, AIAssistantPersona } from "@/types/persona";

interface VideoQAChatProps {
  transcript: NormalizedTranscript;
  onSeek: (seconds: number) => void;
}

export function VideoQAChat({ transcript, onSeek }: VideoQAChatProps) {
  const [selectedPersona, setSelectedPersona] = useState<AIAssistantPersona>(AI_PERSONAS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [messages, setMessages] = useState<QAMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your TubeMind AI Assistant. Ask me anything about what was spoken in this video, and I will answer with verified timestamp citations.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPersonaIcon = (iconName: string) => {
    switch (iconName) {
      case "Languages":
        return <Languages className="w-4 h-4 text-emerald-500" />;
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-amber-500" />;
      case "Video":
        return <Video className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-500" />;
    }
  };

  const handlePersonaChange = (persona: AIAssistantPersona) => {
    setSelectedPersona(persona);
    setIsPersonaOpen(false);

    if (persona.id === "urdu_advisor") {
      setSelectedLanguage("ur");
      setMessages((prev) => [
        ...prev,
        {
          id: `persona-switch-${Date.now()}`,
          role: "assistant",
          content:
            "خوش آمدید! میں آپ کا اردو اے آئی مشیر ہوں۔ آپ اس ویڈیو کے بارے میں کوئی بھی سوال اردو یا رومن اردو میں پوچھ سکتے ہیں۔",
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `persona-switch-${Date.now()}`,
          role: "assistant",
          content: `Switched mode to **${persona.name}** (${persona.badge}). How can I assist you with this video?`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isLoading) return;

    const userMsg: QAMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: q,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          question: q,
          personaId: selectedPersona.id,
          language: selectedLanguage,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: QAMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          timestampCitations: data.timestampCitations,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-md overflow-hidden flex flex-col h-[560px]">
      {/* Header with AI Persona Selector and Language Switcher */}
      <div className="p-3.5 border-b border-border bg-secondary/40 flex flex-wrap items-center justify-between gap-3">
        {/* Persona Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border hover:bg-secondary/80 text-foreground transition-all text-xs font-semibold shadow-sm"
          >
            {getPersonaIcon(selectedPersona.avatarIcon)}
            <span>{selectedPersona.name}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
              {selectedPersona.badge}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Persona Menu */}
          {isPersonaOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 p-2 bg-card rounded-2xl border border-border shadow-2xl z-20 space-y-1 animate-in fade-in-50 zoom-in-95 duration-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 block">
                Choose AI Persona
              </span>
              {AI_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    selectedPersona.id === p.id
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <div className="mt-0.5">{getPersonaIcon(p.avatarIcon)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{p.name}</span>
                      <span className="text-[9px] px-1 rounded bg-secondary text-muted-foreground">
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                      {p.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Response Language Selector */}
        <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-transparent text-foreground text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {TOP_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-card text-foreground">
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                msg.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-secondary text-foreground border border-border"
              }`}
            >
              {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : getPersonaIcon(selectedPersona.avatarIcon)}
            </div>

            <div
              className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-600 text-white rounded-tr-none"
                  : "bg-secondary/70 text-foreground border border-border/80 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Timestamp citations if available */}
              {msg.timestampCitations && msg.timestampCitations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                    Cited Moments:
                  </span>
                  {msg.timestampCitations.map((cite, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSeek(cite.seconds)}
                      className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-background text-brand-600 dark:text-brand-400 hover:bg-brand-600 hover:text-white border border-border transition-colors flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{cite.timestamp}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
            <span>Generating verified answer in {TOP_LANGUAGES.find((l) => l.code === selectedLanguage)?.name}...</span>
          </div>
        )}
      </div>

      {/* Suggested Starter Questions for Selected Persona */}
      {selectedPersona.sampleQuestions && selectedPersona.sampleQuestions.length > 0 && (
        <div className="px-4 py-2 bg-secondary/30 border-t border-border/50 flex flex-wrap gap-1.5">
          {selectedPersona.sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-background hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all truncate max-w-xs"
            >
              {sq}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedLanguage === "ur" || selectedPersona.id === "urdu_advisor"
                ? "اس ویڈیو کے بارے میں کوئی بھی سوال اردو میں لکھیں..."
                : `Ask ${selectedPersona.name} anything about this video...`
            }
            className="flex-1 px-3.5 py-2 text-xs bg-background rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all text-foreground"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
