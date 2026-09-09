import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CampaignDetail } from "@/components/campaign-detail";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { getCampaign, myApplicationStatus } from "@/lib/campaigns";
import { APPLICATION_STATUS_LABEL } from "@/lib/constants";
import type { ApplicationStatus } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaign(id);
  return { title: campaign?.title ?? "캠페인" };
}

export default async function InfluencerCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("influencer");
  const { id } = await params;

  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const applied = await myApplicationStatus(id);

  return (
    <div className="space-y-6">
      <Link
        href="/influencer/campaigns"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 캠페인 목록
      </Link>

      <CampaignDetail campaign={campaign} />

      <div className="rounded-xl border bg-card p-4">
        {applied ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              이미 지원한 캠페인입니다
            </span>
            <span className="text-sm font-semibold">
              {APPLICATION_STATUS_LABEL[applied as ApplicationStatus] ?? applied}
            </span>
          </div>
        ) : campaign.status !== "recruiting" ? (
          <p className="text-center text-sm text-muted-foreground">
            모집이 마감된 캠페인입니다
          </p>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href={`/influencer/campaigns/${id}/apply`}>
              캠페인 지원하기
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
