import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  CAMPAIGN_STATUS_LABEL,
  COMPENSATION_TYPE_LABEL,
  formatDateRange,
  formatFollowers,
} from "@/lib/constants";
import type { CampaignWithBrand } from "@/lib/campaigns";

export function CampaignCard({
  campaign,
  href,
}: {
  campaign: CampaignWithBrand;
  href: string;
}) {
  const c = campaign;
  return (
    <Link
      href={href}
      className="flex flex-col rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {c.brands?.brand_name ?? "브랜드"}
        </span>
        <Badge variant={c.status === "recruiting" ? "default" : "secondary"}>
          {CAMPAIGN_STATUS_LABEL[c.status]}
        </Badge>
      </div>

      <h3 className="mt-2 line-clamp-2 font-semibold">{c.title}</h3>
      {c.product_name ? (
        <p className="mt-0.5 text-sm text-muted-foreground">{c.product_name}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.category ? <Badge variant="outline">{c.category}</Badge> : null}
        {c.compensation_type ? (
          <Badge variant="outline">
            {COMPENSATION_TYPE_LABEL[c.compensation_type]}
          </Badge>
        ) : null}
        {c.platform ? <Badge variant="outline">{c.platform}</Badge> : null}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">모집 인원</dt>
          <dd className="tabular-nums">{c.recruitment_count}명</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">최소 팔로워</dt>
          <dd className="tabular-nums">
            {c.minimum_followers > 0
              ? formatFollowers(c.minimum_followers)
              : "제한 없음"}
          </dd>
        </div>
        <div className="col-span-2 flex justify-between">
          <dt className="text-muted-foreground">모집 기간</dt>
          <dd>{formatDateRange(c.recruit_start_date, c.recruit_end_date)}</dd>
        </div>
      </dl>
    </Link>
  );
}
