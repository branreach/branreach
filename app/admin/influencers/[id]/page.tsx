import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/session";
import { formatDate, formatFollowers } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

import { EntityStatusSelect } from "../../admin-controls";

export const metadata: Metadata = { title: "인플루언서 상세" };

export default async function AdminInfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;

  const supabase = await createClient();
  const { data: influencer } = await supabase
    .from("influencers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!influencer) notFound();

  // 운영자는 RLS is_admin() 로 비공개 연락처 접근 가능
  const { data: contact } = await supabase
    .from("influencer_contacts")
    .select("wechat_id, email, phone")
    .eq("influencer_id", id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/admin/influencers"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 인플루언서 목록
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {influencer.nickname ?? "인플루언서"}
          </h1>
          <p className="text-sm text-muted-foreground">
            팔로워 {formatFollowers(influencer.follower_count)} ·{" "}
            {formatDate(influencer.created_at)} 가입
          </p>
        </div>
        <EntityStatusSelect
          kind="influencer"
          id={id}
          status={influencer.status}
        />
      </div>

      <section className="rounded-xl border">
        <dl className="divide-y px-5 text-sm">
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">샤오홍슈 ID</dt>
            <dd>{influencer.xiaohongshu_id ?? "-"}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">샤오홍슈 URL</dt>
            <dd className="break-all">{influencer.xiaohongshu_url ?? "-"}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">카테고리</dt>
            <dd className="flex flex-wrap gap-1.5">
              {influencer.categories.map((c: string) => (
                <Badge key={c} variant="outline">
                  {c}
                </Badge>
              ))}
            </dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">협업 유형</dt>
            <dd className="flex flex-wrap gap-1.5">
              {influencer.collaboration_types.map((t: string) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">자기소개</dt>
            <dd className="whitespace-pre-wrap">{influencer.bio ?? "-"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
        <div className="border-b border-amber-500/20 px-5 py-2.5 text-sm font-semibold text-amber-700 dark:text-amber-400">
          비공개 연락처 (운영자 전용)
        </div>
        <dl className="divide-y divide-amber-500/10 px-5 text-sm">
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">WeChat</dt>
            <dd>{contact?.wechat_id ?? "-"}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">이메일</dt>
            <dd>{contact?.email ?? "-"}</dd>
          </div>
          <div className="grid grid-cols-[8rem_1fr] gap-3 py-2.5">
            <dt className="text-muted-foreground">전화번호</dt>
            <dd>{contact?.phone ?? "-"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
