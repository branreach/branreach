import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

import { CampaignStatusSelect, DeleteCampaignButton } from "../admin-controls";

export const metadata: Metadata = { title: "캠페인 관리" };

export default async function AdminCampaignsPage() {
  await requireRole("admin");

  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select(
      "id, title, status, recruitment_count, created_at, brands(brand_name), applications(count)",
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">캠페인 관리</h1>
        <p className="text-sm text-muted-foreground">
          {campaigns?.length ?? 0}개
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">캠페인</th>
              <th className="px-4 py-2.5 font-medium">브랜드</th>
              <th className="px-4 py-2.5 font-medium">지원/모집</th>
              <th className="px-4 py-2.5 font-medium">등록일</th>
              <th className="px-4 py-2.5 font-medium">상태</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(campaigns ?? []).map((c) => {
              const brand = Array.isArray(c.brands) ? c.brands[0] : c.brands;
              const apps = Array.isArray(c.applications)
                ? c.applications[0]?.count ?? 0
                : 0;
              return (
                <tr key={c.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium">
                    {c.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {brand?.brand_name ?? "-"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {apps}/{c.recruitment_count}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <CampaignStatusSelect id={c.id} status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteCampaignButton id={c.id} />
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
