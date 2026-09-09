import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { getCampaign, myApplicationStatus } from "@/lib/campaigns";

import { ApplyForm } from "./apply-form";

export const metadata: Metadata = { title: "캠페인 지원" };

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("influencer");
  const { id } = await params;

  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  if (campaign.status !== "recruiting") {
    redirect(`/influencer/campaigns/${id}`);
  }

  const applied = await myApplicationStatus(id);
  if (applied) redirect(`/influencer/campaigns/${id}`);

  return (
    <div className="space-y-6">
      <Link
        href={`/influencer/campaigns/${id}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 캠페인 상세
      </Link>

      <div>
        <h1 className="text-xl font-bold">캠페인 지원하기</h1>
        <p className="text-sm text-muted-foreground">
          {campaign.brands?.brand_name} · {campaign.title}
        </p>
      </div>

      <ApplyForm campaignId={id} />
    </div>
  );
}
