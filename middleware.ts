import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Exact match paths (no subpath matching)
const PUBLIC_EXACT = [
  "/",
  "/login",
  "/signup",
  "/reset-password",
  "/terms",
  "/privacy",
  "/faq",
];

// Prefix match paths (path and all subpaths are public)
const PUBLIC_PREFIX = [
  "/api/auth",
  "/api/health",
  "/api/stripe/webhook",
  "/api/og", // OGP image generation for SNS crawlers
  "/api/share/track", // Share event tracking (auth optional)
  "/compatibility", // SEO pages: /compatibility/aries-taurus etc.
];

// Pattern match: /tarot/[card] is public (SEO), but /tarot alone is the app (protected)
const PUBLIC_PATTERNS = [
  /^\/tarot\/[a-z0-9-]+$/, // /tarot/the-fool etc.
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  if (PUBLIC_PREFIX.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  if (PUBLIC_PATTERNS.some((r) => r.test(pathname))) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users from protected routes to login
  if (!user && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|xml)$).*)"],
};
