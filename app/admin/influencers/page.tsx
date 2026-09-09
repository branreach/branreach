import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { requireRole } from "@/lib/auth/session";
import { formatDate, formatFollowers } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

import { EntityStatusSelect } from "../admin-controls";

export const metadata: Metadata = { title: "인플루언서 관리" };

export default async function AdminInfluencersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole("admin");
  const { q } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("influencers")
    .select("id, nickname, follower_count, categories, status, created_at")
    .order("created_at", { ascending: false });
  if (q) query = query.ilike("nickname", `%${q}%`);
  const { data: influencers } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">인플루언서 관리</h1>
        <p className="text-sm text-muted-foreground">
          {influencers?.length ?? 0}명
        </p>
      </div>

      <form className="max-w-xs">
        <Input name="q" placeholder="닉네임 검색" defaultValue={q ?? ""} />
      </form>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">닉네임</th>
              <th className="px-4 py-2.5 font-medium">팔로워</th>
              <th className="px-4 py-2.5 font-medium">카테고리</th>
              <th className="px-4 py-2.5 font-medium">가입일</th>
              <th className="px-4 py-2.5 font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(influencers ?? []).map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/influencers/${i.id}`}
                    className="font-medium hover:underline"
                  >
                    {i.nickname ?? "-"}
                  </Link>
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatFollowers(i.follower_count)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {i.categories.slice(0, 3).map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(i.created_at)}
                </td>
                <td className="px-4 py-3">
                  <EntityStatusSelect
                    kind="influencer"
                    id={i.id}
                    status={i.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
