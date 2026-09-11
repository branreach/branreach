import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { campaignApplicantCount } from "@/lib/campaigns";
import {
  COMPENSATION_TYPE_LABEL,
  formatFollowers,
  recruitDeadlineLabel,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CampaignWithBrand } from "@/lib/campaigns";

// 대표 이미지가 없을 때 쓰는 은은한 플레이스홀더 (카테고리 대신 캠페인 id 기반 고정 배정).
const PLACEHOLDER_GRADIENTS = [
  "from-rose-100 to-orange-50",
  "from-sky-100 to-indigo-50",
  "from-emerald-100 to-teal-50",
  "from-amber-100 to-yellow-50",
  "from-violet-100 to-fuchsia-50",
  "from-slate-100 to-zinc-50",
];

function placeholderGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}

export function CampaignCard({
  campaign,
  href,
}: {
  campaign: CampaignWithBrand;
  href: string;
}) {
  const c = campaign;
  const applied = campaignApplicantCount(c);
  const deadline =
    c.status === "recruiting" ? recruitDeadlineLabel(c.recruit_end_date) : null;
  const full = c.recruitment_count > 0 && applied >= c.recruitment_count;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
    >
      {/* 대표 이미지 / 플레이스홀더 */}
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden",
          !c.cover_image_url &&
            `bg-gradient-to-br ${placeholderGradient(c.id)}`,
        )}
      >
        {c.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.cover_image_url}
            alt=""
            className="size-full object-cover transition-transform group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="px-6 text-center text-sm font-medium text-black/35">
              {c.category ?? "Branreach"}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          {deadline ? (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                deadline.urgent
                  ? "bg-red-600 text-white"
                  : "bg-black/70 text-white backdrop-blur-sm",
              )}
            >
              {deadline.label}
            </span>
          ) : (
            <span />
          )}
          {c.status !== "recruiting" ? (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {c.status === "closed" ? "모집 마감" : "완료"}
            </span>
          ) : full ? (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              모집 완료
            </span>
          ) : null}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-muted-foreground">
          {c.brands?.brand_name ?? "브랜드"}
        </span>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug">
          {c.title}
        </h3>
        {c.product_name ? (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {c.product_name}
          </p>
        ) : null}

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.category ? (
            <Badge variant="outline" className="text-xs">
              #{c.category}
            </Badge>
          ) : null}
          {c.compensation_type ? (
            <Badge variant="outline" className="text-xs">
              #{COMPENSATION_TYPE_LABEL[c.compensation_type]}
            </Badge>
          ) : null}
          {c.platform ? (
            <Badge variant="outline" className="text-xs">
              #{c.platform}
            </Badge>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span>
            최소 팔로워{" "}
            {c.minimum_followers > 0
              ? formatFollowers(c.minimum_followers)
              : "제한 없음"}
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {applied}/{c.recruitment_count}명 지원
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground/70"
            style={{
              width: `${Math.min(
                100,
                c.recruitment_count > 0
                  ? (applied / c.recruitment_count) * 100
                  : 0,
              )}%`,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
