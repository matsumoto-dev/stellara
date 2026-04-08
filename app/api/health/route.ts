import { NextResponse } from "next/server";

export function GET(): NextResponse {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabaseStatus = supabaseUrl && supabaseKey ? "configured" : "not_configured";

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    supabase: supabaseStatus,
  });
}
