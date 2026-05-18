import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/nav/mobile-nav";
import { Sidebar } from "@/components/nav/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8">
          {children}
        </main>
        <SiteFooter constrained />
      </div>
      <MobileNav />
    </div>
  );
}
