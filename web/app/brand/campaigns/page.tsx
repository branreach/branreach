import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { applicantCount, listBrandCampaigns } from "@/lib/campaigns";
import { CAMPAIGN_STATUS_LABEL, formatDate } from "@/lib/constants";

export const metadata: Metadata = { title: "내 캠페인" };

export default async function BrandCampaignsPage() {
  await requireRole("brand");
  const campaigns = await listBrandCampaigns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">내 캠페인</h1>
          <p className="text-sm text-muted-foreground">
            등록한 캠페인과 지원 현황을 관리하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/brand/campaigns/new">캠페인 등록</Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          아직 등록한 캠페인이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {campaigns.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border bg-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        c.status === "recruiting" ? "default" : "secondary"
                      }
                    >
                      {CAMPAIGN_STATUS_LABEL[c.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(c.created_at)} 등록
                    </span>
                  </div>
                  <Link
                    href={`/brand/campaigns/${c.id}`}
                    className="mt-1.5 block truncate font-semibold hover:underline"
                  >
                    {c.title}
                  </Link>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-lg font-bold tabular-nums">
                    {applicantCount(c)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{c.recruitment_count}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    지원 / 모집
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/brand/campaigns/${c.id}/applicants`}>
                    지원자 보기
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/brand/campaigns/${c.id}`}>상세</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/brand/campaigns/${c.id}/edit`}>수정</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
