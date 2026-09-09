import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import {
  APPLICATION_STATUS_LABEL,
  formatDate,
  formatFollowers,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus, MatchStatus } from "@/types/database";

import { MatchStatusSelect } from "../admin-controls";
import { CampaignPicker, MatchButton } from "./match-builder";

export const metadata: Metadata = { title: "매칭 관리" };

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ campaign?: string }>;
}) {
  await requireRole("admin");
  const { campaign: selectedCampaign } = await searchParams;

  const supabase = await createClient();

  const [{ data: matches }, { data: campaigns }] = await Promise.all([
    supabase
      .from("matches")
      .select(
        "id, status, matched_at, campaigns(title, brands(brand_name)), influencers(nickname)",
      )
      .order("matched_at", { ascending: false }),
    supabase
      .from("campaigns")
      .select("id, title, brands(brand_name)")
      .order("created_at", { ascending: false }),
  ]);

  const campaignOptions = (campaigns ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    brand:
      (Array.isArray(c.brands) ? c.brands[0]?.brand_name : c.brands?.brand_name) ??
      "브랜드",
  }));

  let applicants: {
    influencer_id: string;
    status: ApplicationStatus;
    nickname: string | null;
    follower_count: number;
    matched: boolean;
  }[] = [];

  if (selectedCampaign) {
    const { data: apps } = await supabase
      .from("applications")
      .select(
        "influencer_id, status, influencers(nickname, follower_count)",
      )
      .eq("campaign_id", selectedCampaign)
      .order("created_at", { ascending: false });

    const { data: existing } = await supabase
      .from("matches")
      .select("influencer_id")
      .eq("campaign_id", selectedCampaign);
    const matchedIds = new Set((existing ?? []).map((m) => m.influencer_id));

    applicants = (apps ?? []).map((a) => {
      const inf = Array.isArray(a.influencers)
        ? a.influencers[0]
        : a.influencers;
      return {
        influencer_id: a.influencer_id,
        status: a.status as ApplicationStatus,
        nickname: inf?.nickname ?? null,
        follower_count: inf?.follower_count ?? 0,
        matched: matchedIds.has(a.influencer_id),
      };
    });
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold">매칭 관리</h1>
        <p className="text-sm text-muted-foreground">
          MVP에서는 운영자가 수동으로 매칭합니다.
        </p>
      </div>

      {/* 새 매칭 */}
      <section className="space-y-4 rounded-xl border p-5">
        <h2 className="text-sm font-semibold">새 매칭 만들기</h2>
        <CampaignPicker
          campaigns={campaignOptions}
          selected={selectedCampaign}
        />

        {selectedCampaign ? (
          applicants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              이 캠페인에 지원자가 없습니다.
            </p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {applicants.map((a) => (
                <li
                  key={a.influencer_id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{a.nickname ?? "인플루언서"}</p>
                    <p className="text-xs text-muted-foreground">
                      팔로워 {formatFollowers(a.follower_count)} ·{" "}
                      {APPLICATION_STATUS_LABEL[a.status]}
                    </p>
                  </div>
                  <MatchButton
                    campaignId={selectedCampaign}
                    influencerId={a.influencer_id}
                    disabled={a.matched}
                  />
                </li>
              ))}
            </ul>
          )
        ) : null}
      </section>

      {/* 기존 매칭 */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">
          매칭 목록 ({matches?.length ?? 0})
        </h2>
        {matches && matches.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">인플루언서</th>
                  <th className="px-4 py-2.5 font-medium">캠페인</th>
                  <th className="px-4 py-2.5 font-medium">브랜드</th>
                  <th className="px-4 py-2.5 font-medium">매칭일</th>
                  <th className="px-4 py-2.5 font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {matches.map((m) => {
                  const campaign = Array.isArray(m.campaigns)
                    ? m.campaigns[0]
                    : m.campaigns;
                  const brand = campaign
                    ? Array.isArray(campaign.brands)
                      ? campaign.brands[0]
                      : campaign.brands
                    : null;
                  const inf = Array.isArray(m.influencers)
                    ? m.influencers[0]
                    : m.influencers;
                  return (
                    <tr key={m.id}>
                      <td className="px-4 py-3 font-medium">
                        {inf?.nickname ?? "-"}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3">
                        {campaign?.title ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {brand?.brand_name ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(m.matched_at)}
                      </td>
                      <td className="px-4 py-3">
                        <MatchStatusSelect
                          id={m.id}
                          status={m.status as MatchStatus}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            아직 매칭이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
