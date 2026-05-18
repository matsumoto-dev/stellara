"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TurnCounter } from "@/components/chat/turn-counter";
import { Loading } from "@/components/ui/loading";

interface ChatMessage {
  readonly role: "user" | "assistant";
  readonly content: string;
}

const MAX_TURNS = 5;

export function ChatClient() {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  });

  async function handleSend(message: string) {
    if (turnCount >= MAX_TURNS) return;

    const userMsg: ChatMessage = { role: "user", content: message };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const historyStr = updatedMessages.map((m) => `${m.role}: ${m.content}`).join("\n");

      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          variables: {
            user_message: message,
            conversation_history: historyStr,
          },
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? t("error"));
        return;
      }
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: json.data.content,
      };
      setMessages([...updatedMessages, assistantMsg]);
      setTurnCount((c) => c + 1);
    } catch {
      setError(tCommon("error.serverConnection"));
    } finally {
      setLoading(false);
    }
  }

  const atLimit = turnCount >= MAX_TURNS;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-gold-leaf/70 text-xs tracking-[0.3em] uppercase mb-2">
            <span>☁</span>
            <span>Chat</span>
          </div>
          <h1
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-moonlight tracking-tight"
            style={{ wordBreak: "keep-all" }}
          >
            {t("title")}
          </h1>
          <p className="text-xs text-text-muted mt-1">{t("subtitle")}</p>
        </div>
        <TurnCounter current={turnCount} limit={MAX_TURNS} />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 && !loading && (
          <div className="text-center text-text-muted py-16">
            <p className="text-3xl mb-3">{"\u2728"}</p>
            <p className="text-sm whitespace-pre-line">{t("emptyState")}</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={`${msg.role}-${msg.content.slice(0, 20)}`}
            role={msg.role}
            content={msg.content}
          />
        ))}
        {loading && <Loading text={t("loading")} size="sm" />}
      </div>

      {error && <div className="text-red-400 text-xs mb-2">{error}</div>}

      {atLimit ? (
        <div className="text-center text-text-muted text-sm py-4 border-t border-text-muted/10">
          {t("limitReached")}
          <br />
          {t("upgradePrompt")}
        </div>
      ) : (
        <ChatInput onSend={handleSend} disabled={loading} />
      )}
    </div>
  );
}
