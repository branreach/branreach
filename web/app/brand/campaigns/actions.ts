"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { CampaignStatus, CompensationType } from "@/types/database";

export type CampaignFormState = { error?: string };

const COMPENSATION_KEYS: CompensationType[] = [
  "paid",
  "free_product",
  "commission",
  "mixed",
];

function text(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function dateOrNull(fd: FormData, key: string): string | null {
  const v = text(fd, key);
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}
function intOrNull(fd: FormData, key: string): number | null {
  const raw = text(fd, key);
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

async function getBrandId(): Promise<
  { brandId: string } | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "brand") return { error: "권한이 없습니다." };

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!brand) return { error: "브랜드 정보를 찾을 수 없습니다." };
  return { brandId: brand.id };
}

function buildPayload(fd: FormData) {
  const title = text(fd, "title");
  if (!title) return { error: "캠페인 제목을 입력해주세요." as const };

  const compRaw = text(fd, "compensation_type");
  const compensation_type = COMPENSATION_KEYS.includes(
    compRaw as CompensationType,
  )
    ? (compRaw as CompensationType)
    : null;

  const statusRaw = text(fd, "status");
  const status: CampaignStatus =
    statusRaw === "recruiting" ? "recruiting" : "draft";

  return {
    payload: {
      title,
      cover_image_url: text(fd, "cover_image_url") || null,
      product_name: text(fd, "product_name") || null,
      category: text(fd, "category") || null,
      description: text(fd, "description") || null,
      platform: text(fd, "platform") || null,
      recruitment_count: intOrNull(fd, "recruitment_count") ?? 1,
      minimum_followers: intOrNull(fd, "minimum_followers") ?? 0,
      creator_categories: fd.getAll("creator_categories").map(String),
      compensation_type,
      compensation_detail: text(fd, "compensation_detail") || null,
      budget: intOrNull(fd, "budget"),
      product_provided: fd.get("product_provided") === "on",
      content_requirements: text(fd, "content_requirements") || null,
      recruit_start_date: dateOrNull(fd, "recruit_start_date"),
      recruit_end_date: dateOrNull(fd, "recruit_end_date"),
      collab_start_date: dateOrNull(fd, "collab_start_date"),
      collab_end_date: dateOrNull(fd, "collab_end_date"),
      status,
    },
  };
}

export async function createCampaign(
  _prev: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const brand = await getBrandId();
  if ("error" in brand) return brand;

  const built = buildPayload(formData);
  if ("error" in built) return { error: built.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert({ ...built.payload, brand_id: brand.brandId })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/brand/campaigns");
  redirect(`/brand/campaigns/${data.id}`);
}

export async function updateCampaign(
  campaignId: string,
  _prev: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const brand = await getBrandId();
  if ("error" in brand) return brand;

  const built = buildPayload(formData);
  if ("error" in built) return { error: built.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update(built.payload)
    .eq("id", campaignId)
    .eq("brand_id", brand.brandId);

  if (error) return { error: error.message };

  revalidatePath("/brand/campaigns");
  revalidatePath(`/brand/campaigns/${campaignId}`);
  redirect(`/brand/campaigns/${campaignId}`);
}

/** 모집 종료 / 재개 / 완료 등 상태만 변경. */
export async function setCampaignStatus(
  campaignId: string,
  status: CampaignStatus,
): Promise<void> {
  const brand = await getBrandId();
  if ("error" in brand) return;

  const supabase = await createClient();
  await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", campaignId)
    .eq("brand_id", brand.brandId);

  revalidatePath("/brand/campaigns");
  revalidatePath(`/brand/campaigns/${campaignId}`);
}
