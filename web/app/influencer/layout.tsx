import Link from "next/link";

import { AppNav, type NavItem } from "@/components/app-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { requireRole } from "@/lib/auth/session";

const NAV: NavItem[] = [
  { href: "/influencer/dashboard", label: "대시보드" },
  { href: "/influencer/campaigns", label: "캠페인 찾기" },
  { href: "/influencer/applications", label: "지원 내역" },
  { href: "/influencer/profile", label: "프로필" },
];

export default async function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole("influencer");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/influencer/dashboard" className="font-bold">
              Branreach
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                인플루언서
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {profile.name}
              </span>
              <SignOutButton />
            </div>
          </div>
          <AppNav items={NAV} />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
