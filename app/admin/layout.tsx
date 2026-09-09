import Link from "next/link";

import { AppNav, type NavItem } from "@/components/app-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { requireRole } from "@/lib/auth/session";

const NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "대시보드" },
  { href: "/admin/influencers", label: "인플루언서" },
  { href: "/admin/brands", label: "브랜드" },
  { href: "/admin/campaigns", label: "캠페인" },
  { href: "/admin/applications", label: "지원서" },
  { href: "/admin/matches", label: "매칭" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b bg-neutral-900 text-neutral-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="font-bold">
              Branreach
              <span className="ml-1.5 text-xs font-normal text-neutral-400">
                운영자
              </span>
            </Link>
            <div className="[&_a]:text-neutral-400 [&_a:hover]:text-neutral-100">
              <AppNav items={NAV} />
            </div>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
