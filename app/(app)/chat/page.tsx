import { redirect } from "next/navigation";
import { ProGate } from "@/components/settings/pro-gate";
import { createClient } from "@/lib/db/server";
import type { PlanType } from "@/lib/db/types";
import { ChatClient } from "./chat-client";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan as PlanType) ?? "free";

  if (plan !== "pro") {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ProGate feature="chat" />
      </div>
    );
  }

  return <ChatClient />;
}
