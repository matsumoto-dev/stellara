"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReadingFormProps {
  onSubmit: (question: string) => void;
  loading: boolean;
  placeholder?: string;
  buttonText?: string;
}

export function ReadingForm({
  onSubmit,
  loading,
  placeholder = "聞いてみたいことを入力（任意）",
  buttonText = "鑑定する",
}: ReadingFormProps) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(question);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        id="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        disabled={loading}
      />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        {buttonText}
      </Button>
    </form>
  );
}
