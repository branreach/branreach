import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "운영자 대시보드" };

export default async function AdminDashboardPage() {
  await requireRole("admin");

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">운영자 대시보드</h1>
      <p className="text-sm text-muted-foreground">
        운영자 대시보드는 Phase 5에서 구현됩니다 (총 인플루언서 · 브랜드 · 캠페인
        · 지원 · 매칭, 수동 매칭 관리).
      </p>
    </div>
  );
}
