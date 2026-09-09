import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "브랜드 대시보드" };

export default async function BrandDashboardPage() {
  const profile = await requireRole("brand");

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">{profile.name ?? "브랜드"} 대시보드</h1>
      <p className="text-sm text-muted-foreground">
        브랜드 대시보드는 Phase 4에서 구현됩니다 (등록 캠페인 · 모집 중 · 지원자
        수 · 매칭된 인플루언서).
      </p>
    </div>
  );
}
