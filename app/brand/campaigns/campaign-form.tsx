"use client";

import { useActionState, useState } from "react";

import { ChipToggleGroup } from "@/components/chip-toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES,
  COMPENSATION_TYPE_LABEL,
  PLATFORMS,
} from "@/lib/constants";
import type { Campaign } from "@/types/database";

import type { CampaignFormState } from "./actions";

type Action = (
  prev: CampaignFormState,
  formData: FormData,
) => Promise<CampaignFormState>;

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "space-y-2"}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function CampaignForm({
  action,
  campaign,
}: {
  action: Action;
  campaign?: Campaign;
}) {
  const [state, formAction, pending] = useActionState<
    CampaignFormState,
    FormData
  >(action, {});

  const [category, setCategory] = useState(campaign?.category ?? "");
  const [platform, setPlatform] = useState(campaign?.platform ?? "");
  const [compensation, setCompensation] = useState(
    campaign?.compensation_type ?? "",
  );
  const [creatorCategories, setCreatorCategories] = useState<string[]>(
    campaign?.creator_categories ?? [],
  );
  const [publish, setPublish] = useState(
    campaign ? campaign.status === "recruiting" : true,
  );

  return (
    <form action={formAction} className="space-y-8">
      <input
        type="hidden"
        name="status"
        value={publish ? "recruiting" : "draft"}
      />

      <section className="space-y-5">
        <h2 className="text-sm font-semibold">기본 정보</h2>
        <Field label="캠페인 제목 *" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            defaultValue={campaign?.title ?? ""}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="제품명" htmlFor="product_name">
            <Input
              id="product_name"
              name="product_name"
              defaultValue={campaign?.product_name ?? ""}
            />
          </Field>
          <Field label="카테고리">
            <input type="hidden" name="category" value={category} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="캠페인 설명" htmlFor="description">
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={campaign?.description ?? ""}
          />
        </Field>
        <Field label="콘텐츠 요구사항" htmlFor="content_requirements">
          <Textarea
            id="content_requirements"
            name="content_requirements"
            rows={3}
            defaultValue={campaign?.content_requirements ?? ""}
            placeholder="게시물 형식, 개수, 필수 해시태그, 업로드 기한 등"
          />
        </Field>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold">모집 조건</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="모집 인원" htmlFor="recruitment_count">
            <Input
              id="recruitment_count"
              name="recruitment_count"
              type="number"
              min={1}
              defaultValue={campaign?.recruitment_count ?? 1}
            />
          </Field>
          <Field label="최소 팔로워" htmlFor="minimum_followers">
            <Input
              id="minimum_followers"
              name="minimum_followers"
              type="number"
              min={0}
              defaultValue={campaign?.minimum_followers ?? 0}
            />
          </Field>
          <Field label="플랫폼">
            <input type="hidden" name="platform" value={platform} />
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="원하는 인플루언서 카테고리">
          <ChipToggleGroup
            name="creator_categories"
            options={CATEGORIES}
            value={creatorCategories}
            onChange={setCreatorCategories}
          />
        </Field>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold">보상</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="보상 방식">
            <input
              type="hidden"
              name="compensation_type"
              value={compensation}
            />
            <Select value={compensation} onValueChange={setCompensation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COMPENSATION_TYPE_LABEL).map(([k, label]) => (
                  <SelectItem key={k} value={k}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="예산 (원)" htmlFor="budget">
            <Input
              id="budget"
              name="budget"
              type="number"
              min={0}
              defaultValue={campaign?.budget ?? ""}
            />
          </Field>
        </div>
        <Field label="보상 상세" htmlFor="compensation_detail">
          <Textarea
            id="compensation_detail"
            name="compensation_detail"
            rows={2}
            defaultValue={campaign?.compensation_detail ?? ""}
            placeholder="예: 제품 제공 + 게시물당 30만원 + 판매 수수료 5%"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="product_provided"
            defaultChecked={campaign?.product_provided ?? false}
            className="size-4 rounded border-input"
          />
          제품을 제공합니다
        </label>
      </section>

      <section className="space-y-5">
        <h2 className="text-sm font-semibold">일정</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="모집 시작일" htmlFor="recruit_start_date">
            <Input
              id="recruit_start_date"
              name="recruit_start_date"
              type="date"
              defaultValue={campaign?.recruit_start_date ?? ""}
            />
          </Field>
          <Field label="모집 종료일" htmlFor="recruit_end_date">
            <Input
              id="recruit_end_date"
              name="recruit_end_date"
              type="date"
              defaultValue={campaign?.recruit_end_date ?? ""}
            />
          </Field>
          <Field label="협업 시작일" htmlFor="collab_start_date">
            <Input
              id="collab_start_date"
              name="collab_start_date"
              type="date"
              defaultValue={campaign?.collab_start_date ?? ""}
            />
          </Field>
          <Field label="협업 종료일" htmlFor="collab_end_date">
            <Input
              id="collab_end_date"
              name="collab_end_date"
              type="date"
              defaultValue={campaign?.collab_end_date ?? ""}
            />
          </Field>
        </div>
      </section>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
            className="size-4 rounded border-input"
          />
          지금 모집 시작 (체크 해제 시 임시저장)
        </label>
        <Button type="submit" size="lg" disabled={pending}>
          {pending
            ? "저장 중…"
            : campaign
              ? "수정 저장"
              : publish
                ? "캠페인 등록"
                : "임시저장"}
        </Button>
      </div>
    </form>
  );
}
