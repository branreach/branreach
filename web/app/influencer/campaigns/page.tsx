import type { Metadata } from "next";

import { CampaignCard } from "@/components/campaign-card";
import { requireRole } from "@/lib/auth/session";
import { listCampaigns, type CampaignFilters } from "@/lib/campaigns";
import type { CompensationType } from "@/types/database";

import { CampaignFilters as FilterBar } from "./campaign-filters";

export const metadata: Metadata = { title: "캠페인 찾기" };

const COMPENSATION_KEYS = [
  "paid",
  "free_product",
  "commission",
  "mixed",
] as const;

export default async function InfluencerCampaignsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole("influencer");
  const sp = await searchParams;

  const filters: CampaignFilters = {
    category: sp.category || undefined,
    compensation: COMPENSATION_KEYS.includes(
      sp.compensation as CompensationType,
    )
      ? (sp.compensation as CompensationType)
      : undefined,
    maxMinFollowers: sp.followers ? Number(sp.followers) || undefined : undefined,
    status:
      sp.status === "closed" || sp.status === "all" ? sp.status : "recruiting",
    sort: sp.sort === "deadline" ? "deadline" : "latest",
  };

  const campaigns = await listCampaigns(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">캠페인 찾기</h1>
        <p className="text-sm text-muted-foreground">
          지원할 수 있는 한국 브랜드 캠페인을 확인하세요.
        </p>
      </div>

      <FilterBar />

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          조건에 맞는 캠페인이 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              href={`/influencer/campaigns/${c.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
