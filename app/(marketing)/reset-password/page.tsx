import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Stellara account password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>
      <p className="text-text-muted text-sm mb-6 max-w-sm text-center">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>
      <form action="/api/auth/reset-password" method="POST" className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-text-muted mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 bg-bg-card border border-text-muted/20 rounded-lg text-text"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-accent text-bg font-semibold rounded-lg hover:bg-accent-light transition"
        >
          Send Reset Link
        </button>
      </form>
      <p className="mt-4 text-text-muted text-sm">
        <a href="/login" className="text-accent hover:underline">
          Back to Log In
        </a>
      </p>
    </div>
  );
}
