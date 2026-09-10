import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/session";
import { listMyApplications } from "@/lib/campaigns";
import { APPLICATION_STATUS_LABEL, formatDate } from "@/lib/constants";
import type { ApplicationStatus } from "@/types/database";

export const metadata: Metadata = { title: "지원 내역" };

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "outline",
  accepted: "default",
  rejected: "destructive",
  matched: "default",
};

export default async function MyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ applied?: string }>;
}) {
  await requireRole("influencer");
  const { applied } = await searchParams;
  const applications = await listMyApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">지원 내역</h1>
        <p className="text-sm text-muted-foreground">
          지원한 캠페인과 진행 상태를 확인하세요.
        </p>
      </div>

      {applied ? (
        <div className="rounded-lg border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
          지원이 완료되었습니다. 브랜드 검토 결과는 이 페이지에서 확인할 수
          있습니다.
        </div>
      ) : null}

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          아직 지원한 캠페인이 없습니다.{" "}
          <Link
            href="/influencer/campaigns"
            className="font-medium underline underline-offset-4"
          >
            캠페인 찾아보기
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => {
            const campaign = app.campaigns;
            const status = app.status as ApplicationStatus;
            return (
              <li key={app.id}>
                <Link
                  href={
                    campaign
                      ? `/influencer/campaigns/${campaign.id}`
                      : "/influencer/applications"
                  }
                  className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {campaign?.brands?.brand_name ?? "브랜드"}
                    </p>
                    <p className="truncate font-medium">
                      {campaign?.title ?? "삭제된 캠페인"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(app.created_at)} 지원
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[status]}>
                    {APPLICATION_STATUS_LABEL[status]}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
