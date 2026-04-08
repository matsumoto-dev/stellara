import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-heading text-5xl text-accent">404</h1>
      <p className="text-xl text-text-muted">Page not found</p>
      <p className="max-w-md text-text-muted">The stars could not align to find this page.</p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-6 py-3 font-medium text-bg transition-colors hover:bg-accent-light"
      >
        Return home
      </Link>
    </div>
  );
}
