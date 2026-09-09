import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/session";
import { getCampaign } from "@/lib/campaigns";
import {
  APPLICATION_STATUS_LABEL,
  formatDate,
  formatFollowers,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/database";

import { ApplicantActions } from "./applicant-actions";

export const metadata: Metadata = { title: "지원자 관리" };

type ApplicantRow = {
  id: string;
  status: ApplicationStatus;
  message: string | null;
  strengths: string | null;
  past_collaboration: string | null;
  portfolio_links: string[];
  performance_summary: string | null;
  created_at: string;
  influencers: {
    id: string;
    nickname: string | null;
    avatar_url: string | null;
    follower_count: number;
    categories: string[];
  } | null;
};

export default async function ApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("brand");
  const { id } = await params;

  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select(
      "id, status, message, strengths, past_collaboration, portfolio_links, performance_summary, created_at, influencers(id, nickname, avatar_url, follower_count, categories)",
    )
    .eq("campaign_id", id)
    .order("created_at", { ascending: false });

  const applicants = (data ?? []) as unknown as ApplicantRow[];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/brand/campaigns/${id}`}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 캠페인 상세
      </Link>

      <div>
        <h1 className="text-xl font-bold">지원자 관리</h1>
        <p className="text-sm text-muted-foreground">
          {campaign.title} · 지원 {applicants.length}명 / 모집{" "}
          {campaign.recruitment_count}명
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          아직 지원자가 없습니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {applicants.map((a) => {
            const inf = a.influencers;
            return (
              <li key={a.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={inf?.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>
                        {inf?.nickname?.[0] ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {inf ? (
                        <Link
                          href={`/brand/influencers/${inf.id}`}
                          className="font-semibold hover:underline"
                        >
                          {inf.nickname ?? "인플루언서"}
                        </Link>
                      ) : (
                        <span className="font-semibold">인플루언서</span>
                      )}
                      <p className="text-xs text-muted-foreground">
                        팔로워 {formatFollowers(inf?.follower_count ?? 0)} ·{" "}
                        {formatDate(a.created_at)} 지원
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      a.status === "accepted" || a.status === "matched"
                        ? "default"
                        : a.status === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {APPLICATION_STATUS_LABEL[a.status]}
                  </Badge>
                </div>

                {inf && inf.categories.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {inf.categories.map((c) => (
                      <Badge key={c} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                <dl className="mt-4 space-y-3 text-sm">
                  {a.message ? (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        지원 메시지
                      </dt>
                      <dd className="mt-0.5 whitespace-pre-wrap">
                        {a.message}
                      </dd>
                    </div>
                  ) : null}
                  {a.strengths ? (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        강점 / 협업 경험
                      </dt>
                      <dd className="mt-0.5 whitespace-pre-wrap">
                        {a.strengths}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {(a.past_collaboration ||
                  a.portfolio_links.length > 0 ||
                  a.performance_summary) && (
                  <div className="mt-4 rounded-lg border border-dashed p-4 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">
                      과거 협업 성과 / 레퍼런스 — 인플루언서 자율 입력,{" "}
                      <span className="font-semibold">
                        Branreach 미검증
                      </span>
                    </p>
                    <div className="mt-2 space-y-2">
                      {a.past_collaboration ? (
                        <p className="whitespace-pre-wrap">
                          <span className="text-muted-foreground">
                            과거 협업:{" "}
                          </span>
                          {a.past_collaboration}
                        </p>
                      ) : null}
                      {a.portfolio_links.length > 0 ? (
                        <ul className="space-y-1">
                          {a.portfolio_links.map((link) => (
                            <li key={link} className="break-all">
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-primary underline underline-offset-4"
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {a.performance_summary ? (
                        <p className="whitespace-pre-wrap">
                          <span className="text-muted-foreground">
                            성과 지표:{" "}
                          </span>
                          {a.performance_summary}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="mt-4 border-t pt-4">
                  <ApplicantActions
                    applicationId={a.id}
                    campaignId={id}
                    status={a.status}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
