interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] px-5 py-3.5 text-sm whitespace-pre-line ${
          isUser
            ? "bg-gold-leaf/12 border border-gold-leaf/25 text-text rounded-2xl rounded-br-sm leading-relaxed"
            : "bg-night-veil/70 backdrop-blur-sm border border-ink-shadow/40 text-text/95 rounded-2xl rounded-bl-sm font-reading leading-[1.85] text-[14.5px]"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
