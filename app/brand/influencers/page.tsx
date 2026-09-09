import type { Metadata } from "next";

import { InfluencerCard } from "@/components/influencer-card";
import { requireRole } from "@/lib/auth/session";
import { listInfluencers, type InfluencerFilters } from "@/lib/influencer-pool";

import { InfluencerFilters as FilterBar } from "./influencer-filters";

export const metadata: Metadata = { title: "인플루언서 찾기" };

export default async function InfluencerPoolPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireRole("brand");
  const sp = await searchParams;

  const filters: InfluencerFilters = {
    category: sp.category || undefined,
    collaborationType: sp.collab || undefined,
    minFollowers: sp.followers ? Number(sp.followers) || undefined : undefined,
  };

  const influencers = await listInfluencers(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">인플루언서 찾기</h1>
        <p className="text-sm text-muted-foreground">
          공개된 인플루언서 정보를 확인하세요. 연락처는 매칭 확정 후 공개됩니다.
        </p>
      </div>

      <FilterBar />

      {influencers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          조건에 맞는 인플루언서가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {influencers.map((i) => (
            <InfluencerCard
              key={i.id}
              influencer={i}
              href={`/brand/influencers/${i.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
