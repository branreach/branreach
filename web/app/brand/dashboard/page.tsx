import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { brandProfileCompletion, getMyBrand } from "@/lib/brand";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "브랜드 대시보드" };

export default async function BrandDashboardPage() {
  await requireRole("brand");
  const me = await getMyBrand();
  if (!me) redirect("/login");

  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, status")
    .eq("brand_id", me.brand.id);

  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const recruiting = (campaigns ?? []).filter(
    (c) => c.status === "recruiting",
  ).length;

  const [{ count: applicantCount }, { count: matchCount }] = await Promise.all([
    campaignIds.length
      ? supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("campaign_id", campaignIds)
      : Promise.resolve({ count: 0 }),
    campaignIds.length
      ? supabase
          .from("matches")
          .select("id", { count: "exact", head: true })
          .in("campaign_id", campaignIds)
      : Promise.resolve({ count: 0 }),
  ]);

  const { percent, missing } = brandProfileCompletion(me);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">
          {me.brand.brand_name ?? "브랜드"} 대시보드
        </h1>
        <p className="text-sm text-muted-foreground">
          캠페인을 등록하고 지원자를 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="등록한 캠페인"
          value={campaigns?.length ?? 0}
          href="/brand/campaigns"
        />
        <StatCard label="모집 중" value={recruiting} href="/brand/campaigns" />
        <StatCard label="총 지원자" value={applicantCount ?? 0} />
        <StatCard label="매칭된 인플루언서" value={matchCount ?? 0} />
      </div>

      {percent < 100 ? (
        <div className="rounded-xl border p-4 sm:p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">브랜드 정보 완성도</span>
            <span className="tabular-nums text-muted-foreground">
              {percent}%
            </span>
          </div>
          <Progress value={percent} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            남은 항목: {missing.join(", ")}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/brand/campaigns/new">캠페인 등록하기</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/brand/influencers">인플루언서 찾아보기</Link>
        </Button>
      </div>
    </div>
  );
}
