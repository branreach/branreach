import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/session";
import { APPLICATION_STATUS_LABEL, formatDate } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/database";

export const metadata: Metadata = { title: "지원서 관리" };

export default async function AdminApplicationsPage() {
  await requireRole("admin");

  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select(
      "id, status, created_at, message, campaigns(title, brands(brand_name)), influencers(nickname)",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">지원서 관리</h1>
        <p className="text-sm text-muted-foreground">
          {applications?.length ?? 0}건 · 매칭은{" "}
          <a href="/admin/matches" className="underline">
            매칭 관리
          </a>
          에서 진행합니다.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">인플루언서</th>
              <th className="px-4 py-2.5 font-medium">캠페인</th>
              <th className="px-4 py-2.5 font-medium">브랜드</th>
              <th className="px-4 py-2.5 font-medium">지원일</th>
              <th className="px-4 py-2.5 font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(applications ?? []).map((a) => {
              const campaign = Array.isArray(a.campaigns)
                ? a.campaigns[0]
                : a.campaigns;
              const brand = campaign
                ? Array.isArray(campaign.brands)
                  ? campaign.brands[0]
                  : campaign.brands
                : null;
              const influencer = Array.isArray(a.influencers)
                ? a.influencers[0]
                : a.influencers;
              const status = a.status as ApplicationStatus;
              return (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium">
                    {influencer?.nickname ?? "-"}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3">
                    {campaign?.title ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {brand?.brand_name ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(a.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        status === "matched" || status === "accepted"
                          ? "default"
                          : status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {APPLICATION_STATUS_LABEL[status]}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
