import Link from "next/link";

import { AppNav, type NavItem } from "@/components/app-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { requireRole } from "@/lib/auth/session";

const NAV: NavItem[] = [
  { href: "/brand/dashboard", label: "대시보드" },
  { href: "/brand/influencers", label: "인플루언서 찾기" },
  { href: "/brand/campaigns", label: "내 캠페인" },
  { href: "/brand/campaigns/new", label: "캠페인 등록" },
  { href: "/brand/profile", label: "브랜드 정보" },
];

export default async function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole("brand");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/brand/dashboard" className="font-bold">
              Branreach
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                브랜드
              </span>
            </Link>
            <AppNav items={NAV} />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground md:inline">
              {profile.name}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
