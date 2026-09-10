import type { Metadata } from "next";

import { StatCard } from "@/components/stat-card";
import { requireRole } from "@/lib/auth/session";
import { getAdminStats } from "@/lib/admin";

export const metadata: Metadata = { title: "운영자 대시보드" };

export default async function AdminDashboardPage() {
  await requireRole("admin");
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">운영자 대시보드</h1>
        <p className="text-sm text-muted-foreground">
          전체 현황은 실제 DB 기준입니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="총 인플루언서"
          value={stats.influencers}
          href="/admin/influencers"
        />
        <StatCard
          label="총 브랜드"
          value={stats.brands}
          href="/admin/brands"
        />
        <StatCard
          label="총 캠페인"
          value={stats.campaigns}
          href="/admin/campaigns"
        />
        <StatCard
          label="총 지원"
          value={stats.applications}
          href="/admin/applications"
        />
        <StatCard
          label="총 매칭"
          value={stats.matches}
          href="/admin/matches"
        />
      </div>
    </div>
  );
}
