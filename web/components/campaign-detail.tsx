import { Badge } from "@/components/ui/badge";
import { campaignApplicantCount } from "@/lib/campaigns";
import {
  CAMPAIGN_STATUS_LABEL,
  COMPENSATION_TYPE_LABEL,
  formatBudget,
  formatDateRange,
  formatFollowers,
} from "@/lib/constants";
import type { CampaignWithBrand } from "@/lib/campaigns";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[9rem_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}

export function CampaignDetail({ campaign }: { campaign: CampaignWithBrand }) {
  const c = campaign;

  const tags = [
    c.category,
    c.compensation_type ? COMPENSATION_TYPE_LABEL[c.compensation_type] : null,
    c.platform,
    c.product_provided ? "제품 제공" : null,
  ].filter((v): v is string => Boolean(v));

  const hasReward = Boolean(
    c.compensation_type || c.compensation_detail || c.budget != null,
  );
  const hasSchedule = Boolean(
    c.recruit_start_date ||
      c.recruit_end_date ||
      c.collab_start_date ||
      c.collab_end_date,
  );

  return (
    <div className="space-y-7">
      {c.cover_image_url ? (
        <div className="overflow-hidden rounded-xl border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.cover_image_url}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}

      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {c.brands?.brand_name ?? "브랜드"}
          </span>
          <Badge variant={c.status === "recruiting" ? "default" : "secondary"}>
            {CAMPAIGN_STATUS_LABEL[c.status]}
          </Badge>
        </div>
        <h1 className="mt-1.5 text-2xl font-bold">{c.title}</h1>
        {c.product_name ? (
          <p className="mt-1 text-muted-foreground">{c.product_name}</p>
        ) : null}

        {tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge key={t} variant="outline">
                #{t}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      {/* 모집 현황 — 항상 표시되는 핵심 정보 */}
      <section className="grid grid-cols-3 gap-4 rounded-xl border bg-muted/30 p-4">
        <Stat
          label="지원 현황"
          value={`${campaignApplicantCount(c)}/${c.recruitment_count}명`}
        />
        <Stat
          label="최소 팔로워"
          value={
            c.minimum_followers > 0
              ? formatFollowers(c.minimum_followers)
              : "제한 없음"
          }
        />
        <Stat
          label="모집 기간"
          value={
            c.recruit_start_date || c.recruit_end_date
              ? formatDateRange(c.recruit_start_date, c.recruit_end_date)
              : "상시 모집"
          }
        />
      </section>

      {c.description ? (
        <section>
          <h2 className="text-sm font-semibold">캠페인 설명</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {c.description}
          </p>
        </section>
      ) : null}

      {c.content_requirements ? (
        <section>
          <h2 className="text-sm font-semibold">콘텐츠 요구사항</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {c.content_requirements}
          </p>
        </section>
      ) : null}

      {c.creator_categories.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">원하는 인플루언서</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.creator_categories.map((cat) => (
              <Badge key={cat} variant="outline">
                {cat}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      {hasReward ? (
        <section className="rounded-xl border">
          <h2 className="px-5 pt-4 text-sm font-semibold">보상</h2>
          <dl className="divide-y px-5">
            {c.compensation_type ? (
              <Row label="보상 방식">
                {COMPENSATION_TYPE_LABEL[c.compensation_type]}
              </Row>
            ) : null}
            {c.compensation_detail ? (
              <Row label="보상 상세">
                <span className="whitespace-pre-wrap">
                  {c.compensation_detail}
                </span>
              </Row>
            ) : null}
            {c.budget != null ? (
              <Row label="예산">{formatBudget(c.budget)}</Row>
            ) : null}
          </dl>
        </section>
      ) : null}

      {hasSchedule ? (
        <section className="rounded-xl border">
          <dl className="divide-y px-5">
            {c.recruit_start_date || c.recruit_end_date ? (
              <Row label="모집 기간">
                {formatDateRange(c.recruit_start_date, c.recruit_end_date)}
              </Row>
            ) : null}
            {c.collab_start_date || c.collab_end_date ? (
              <Row label="활동 기간">
                {formatDateRange(c.collab_start_date, c.collab_end_date)}
              </Row>
            ) : null}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
