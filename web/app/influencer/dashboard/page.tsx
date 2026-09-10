import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { APPLICATION_STATUS_LABEL } from "@/lib/constants";
import { getMyInfluencer, profileCompletion } from "@/lib/influencer";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/database";

export const metadata: Metadata = { title: "인플루언서 대시보드" };

export default async function InfluencerDashboardPage() {
  await requireRole("influencer");
  const me = await getMyInfluencer();
  if (!me) redirect("/login");

  const supabase = await createClient();
  const [{ count: openCampaigns }, { data: applications }, { count: matchCount }] =
    await Promise.all([
      supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("status", "recruiting"),
      supabase
        .from("applications")
        .select("status")
        .eq("influencer_id", me.influencer.id),
      supabase
        .from("matches")
        .select("id", { count: "exact", head: true })
        .eq("influencer_id", me.influencer.id),
    ]);

  const apps = applications ?? [];
  const byStatus = (s: ApplicationStatus) =>
    apps.filter((a) => a.status === s).length;

  const { percent, missing } = profileCompletion(me);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold">
          안녕하세요, {me.influencer.nickname ?? "인플루언서"}님
        </h1>
        <p className="text-sm text-muted-foreground">
          새로운 캠페인을 확인하고 지원해보세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="모집 중 캠페인"
          value={openCampaigns ?? 0}
          href="/influencer/campaigns"
        />
        <StatCard
          label="지원한 캠페인"
          value={apps.length}
          href="/influencer/applications"
        />
        <StatCard label="검토 중" value={byStatus("pending")} />
        <StatCard label="매칭 완료" value={matchCount ?? 0} />
      </div>

      {apps.length > 0 ? (
        <div className="rounded-xl border p-4 sm:p-5">
          <h2 className="text-sm font-semibold">지원 상태</h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            {(
              ["pending", "accepted", "rejected", "matched"] as ApplicationStatus[]
            ).map((s) => (
              <div key={s} className="flex items-center justify-between">
                <dt className="text-muted-foreground">
                  {APPLICATION_STATUS_LABEL[s]}
                </dt>
                <dd className="font-medium tabular-nums">{byStatus(s)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div className="rounded-xl border p-4 sm:p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">프로필 완성도</span>
          <span className="tabular-nums text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-2" />
        {missing.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            남은 항목: {missing.join(", ")}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            프로필을 모두 채웠습니다.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/influencer/campaigns">캠페인 찾아보기</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/influencer/profile">프로필 수정</Link>
        </Button>
      </div>
    </div>
  );
}
