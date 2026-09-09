import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CampaignDetail } from "@/components/campaign-detail";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { getCampaign } from "@/lib/campaigns";
import { createClient } from "@/lib/supabase/server";

import { CampaignStatusControls } from "./campaign-status-controls";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getCampaign(id);
  return { title: c?.title ?? "캠페인" };
}

export default async function BrandCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("brand");
  const { id } = await params;

  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const supabase = await createClient();
  const { count } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/brand/campaigns"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 내 캠페인
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
        <div className="text-sm">
          지원자 <span className="font-bold">{count ?? 0}</span>명 / 모집{" "}
          {campaign.recruitment_count}명
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/brand/campaigns/${id}/applicants`}>지원자 관리</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/brand/campaigns/${id}/edit`}>수정</Link>
          </Button>
        </div>
      </div>

      <CampaignStatusControls campaignId={id} status={campaign.status} />

      <CampaignDetail campaign={campaign} />
    </div>
  );
}
