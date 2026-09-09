import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "인플루언서 대시보드" };

export default async function InfluencerDashboardPage() {
  const profile = await requireRole("influencer");

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">
        안녕하세요, {profile.name ?? "인플루언서"}님
      </h1>
      <p className="text-sm text-muted-foreground">
        인플루언서 대시보드는 Phase 3에서 구현됩니다 (새 캠페인 · 지원 현황 ·
        매칭 · 프로필 완성도).
      </p>
    </div>
  );
}
