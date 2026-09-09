import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { getCampaign } from "@/lib/campaigns";

import { updateCampaign } from "../../actions";
import { CampaignForm } from "../../campaign-form";

export const metadata: Metadata = { title: "캠페인 수정" };

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("brand");
  const { id } = await params;

  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const action = updateCampaign.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/brand/campaigns/${id}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 캠페인 상세
      </Link>
      <h1 className="text-xl font-bold">캠페인 수정</h1>
      <CampaignForm action={action} campaign={campaign} />
    </div>
  );
}
