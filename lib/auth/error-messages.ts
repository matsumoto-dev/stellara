/**
 * Translate Supabase auth error messages to user-friendly Japanese.
 * Falls back to a generic message for unknown errors.
 *
 * Supabase returns errors with `.message` (English) and sometimes `.code`.
 * We pattern-match the message text since not all errors have stable codes.
 */

interface SupabaseLikeError {
  readonly message?: string;
  readonly code?: string;
  readonly status?: number;
}

const FALLBACK = "認証エラーが発生しました。しばらくしてからもう一度お試しください。";

/**
 * Map Supabase error to a Japanese user-facing message.
 */
export function translateAuthError(error: unknown): string {
  if (!error) return FALLBACK;

  const e = error as SupabaseLikeError;
  const message = e.message ?? "";
  const code = e.code ?? "";

  // Rate limit errors — extract the wait seconds if present
  const securityRateLimit = message.match(
    /For security purposes, you can only request this after (\d+) seconds?/i,
  );
  if (securityRateLimit) {
    return `セキュリティのため、${securityRateLimit[1]}秒後に再度お試しください。`;
  }

  if (/email rate limit exceeded/i.test(message)) {
    return "メール送信の上限に達しました。しばらくしてからもう一度お試しください。";
  }

  // User already exists
  if (
    code === "user_already_exists" ||
    /user already registered|already exists/i.test(message)
  ) {
    return "このメールアドレスは既に登録されています。ログインしてください。";
  }

  // Invalid credentials
  if (
    code === "invalid_credentials" ||
    /invalid login credentials|invalid email or password/i.test(message)
  ) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }

  // Email not confirmed
  if (code === "email_not_confirmed" || /email not confirmed/i.test(message)) {
    return "メールアドレスの確認が完了していません。受信ボックスをご確認ください。";
  }

  // Weak password
  if (
    code === "weak_password" ||
    /password should be at least|password is too weak/i.test(message)
  ) {
    return "パスワードが弱すぎます。8文字以上で設定してください。";
  }

  // Signup disabled
  if (/signup is disabled|signups not allowed/i.test(message)) {
    return "現在、新規登録は受け付けていません。";
  }

  // Captcha
  if (/captcha/i.test(message)) {
    return "Captcha検証に失敗しました。もう一度お試しください。";
  }

  // Email format
  if (/invalid email/i.test(message)) {
    return "メールアドレスの形式が正しくありません。";
  }

  // Network / timeout
  if (/network|fetch|timeout/i.test(message)) {
    return "ネットワークエラーが発生しました。接続を確認してください。";
  }

  // Default fallback
  return FALLBACK;
}
