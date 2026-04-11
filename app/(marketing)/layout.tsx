import { SiteFooter } from "@/components/layout/site-footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
