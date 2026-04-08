interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? "bg-accent/20 text-text rounded-br-md"
            : "bg-bg-card border border-text-muted/10 text-text/90 rounded-bl-md"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
