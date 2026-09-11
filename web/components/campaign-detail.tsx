import { Badge } from "@/components/ui/badge";
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

export function CampaignDetail({ campaign }: { campaign: CampaignWithBrand }) {
  const c = campaign;

  return (
    <div className="space-y-6">
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
      </div>

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

      <section className="rounded-xl border">
        <dl className="divide-y px-5">
          <Row label="카테고리">{c.category ?? "-"}</Row>
          <Row label="플랫폼">{c.platform ?? "-"}</Row>
          <Row label="모집 인원">{c.recruitment_count}명</Row>
          <Row label="최소 팔로워">
            {c.minimum_followers > 0
              ? formatFollowers(c.minimum_followers)
              : "제한 없음"}
          </Row>
          <Row label="원하는 인플루언서">
            {c.creator_categories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {c.creator_categories.map((cat) => (
                  <Badge key={cat} variant="outline">
                    {cat}
                  </Badge>
                ))}
              </div>
            ) : (
              "제한 없음"
            )}
          </Row>
          <Row label="보상 방식">
            {c.compensation_type
              ? COMPENSATION_TYPE_LABEL[c.compensation_type]
              : "-"}
          </Row>
          {c.compensation_detail ? (
            <Row label="보상 상세">
              <span className="whitespace-pre-wrap">
                {c.compensation_detail}
              </span>
            </Row>
          ) : null}
          <Row label="예산">{formatBudget(c.budget)}</Row>
          <Row label="제품 제공">{c.product_provided ? "제공" : "미제공"}</Row>
          <Row label="모집 기간">
            {formatDateRange(c.recruit_start_date, c.recruit_end_date)}
          </Row>
          <Row label="활동 기간">
            {formatDateRange(c.collab_start_date, c.collab_end_date)}
          </Row>
        </dl>
      </section>
    </div>
  );
}
