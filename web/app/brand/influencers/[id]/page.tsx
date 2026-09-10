import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { formatFollowers } from "@/lib/constants";
import { getPublicInfluencer } from "@/lib/influencer-pool";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const inf = await getPublicInfluencer(id);
  return { title: inf?.nickname ?? "인플루언서" };
}

export default async function InfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("brand");
  const { id } = await params;

  const inf = await getPublicInfluencer(id);
  if (!inf) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/brand/influencers"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 인플루언서 목록
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={inf.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="text-lg">
            {inf.nickname?.[0] ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{inf.nickname ?? "인플루언서"}</h1>
          <p className="text-muted-foreground">
            팔로워 {formatFollowers(inf.follower_count)}
          </p>
        </div>
      </div>

      <section className="rounded-xl border">
        <dl className="divide-y px-5">
          <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 text-sm">
            <dt className="text-muted-foreground">샤오홍슈 ID</dt>
            <dd>{inf.xiaohongshu_id ?? "-"}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 text-sm">
            <dt className="text-muted-foreground">샤오홍슈</dt>
            <dd className="min-w-0 break-all">
              {inf.xiaohongshu_url ? (
                <a
                  href={inf.xiaohongshu_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline underline-offset-4"
                >
                  {inf.xiaohongshu_url}
                </a>
              ) : (
                "-"
              )}
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 text-sm">
            <dt className="text-muted-foreground">카테고리</dt>
            <dd className="flex flex-wrap gap-1.5">
              {inf.categories.length ? (
                inf.categories.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))
              ) : (
                <span>-</span>
              )}
            </dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 text-sm">
            <dt className="text-muted-foreground">협업 유형</dt>
            <dd className="flex flex-wrap gap-1.5">
              {inf.collaboration_types.length ? (
                inf.collaboration_types.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))
              ) : (
                <span>-</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {inf.bio ? (
        <section>
          <h2 className="text-sm font-semibold">자기소개</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {inf.bio}
          </p>
        </section>
      ) : null}

      <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
        WeChat · 이메일 · 전화번호 등 직접 연락처는 매칭이 확정된 후에만
        공개됩니다.
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          이 인플루언서와 협업하려면 캠페인을 등록하고 지원을 받으세요.
        </p>
        <Button asChild size="lg" className="mt-3 w-full sm:w-auto">
          <Link href="/brand/campaigns/new">캠페인 등록하기</Link>
        </Button>
      </div>
    </div>
  );
}
