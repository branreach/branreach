import { createClient } from "@/lib/supabase/server";
import type {
  Application,
  Campaign,
  CompensationType,
} from "@/types/database";

export type CampaignBrand = {
  id: string;
  brand_name: string | null;
  logo_url: string | null;
};

export type CampaignWithBrand = Campaign & { brands: CampaignBrand | null };

export type CampaignFilters = {
  category?: string;
  compensation?: CompensationType;
  maxMinFollowers?: number;
  status?: "recruiting" | "closed" | "all";
};

const SELECT = "*, brands(id, brand_name, logo_url)";

/** 인플루언서용 캠페인 목록. RLS 로 draft 는 자동 제외된다. */
export async function listCampaigns(
  filters: CampaignFilters = {},
): Promise<CampaignWithBrand[]> {
  const supabase = await createClient();
  let query = supabase
    .from("campaigns")
    .select(SELECT)
    .order("created_at", { ascending: false });

  const status = filters.status ?? "recruiting";
  if (status === "recruiting") query = query.eq("status", "recruiting");
  else if (status === "closed") query = query.eq("status", "closed");
  else query = query.in("status", ["recruiting", "closed", "completed"]);

  if (filters.category) query = query.contains("creator_categories", [
    filters.category,
  ]);
  if (filters.compensation)
    query = query.eq("compensation_type", filters.compensation);
  if (filters.maxMinFollowers)
    query = query.lte("minimum_followers", filters.maxMinFollowers);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CampaignWithBrand[];
}

export async function getCampaign(
  id: string,
): Promise<CampaignWithBrand | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  return (data as CampaignWithBrand | null) ?? null;
}

/**
 * 현재 인플루언서가 이 캠페인에 이미 지원했는지 (지원서 상태 반환).
 * RLS 로 applications 는 본인 것만 조회되므로 campaign_id 만으로 충분하다.
 */
export async function myApplicationStatus(
  campaignId: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select("status")
    .eq("campaign_id", campaignId)
    .maybeSingle();

  return data?.status ?? null;
}

export type ApplicationWithCampaign = Application & {
  campaigns:
    | (Pick<Campaign, "id" | "title" | "product_name" | "status"> & {
        brands: Pick<CampaignBrand, "brand_name"> | null;
      })
    | null;
};

/** 현재 인플루언서의 지원 내역 (캠페인 + 브랜드 포함). RLS 로 본인 것만. */
export async function listMyApplications(): Promise<ApplicationWithCampaign[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select(
      "*, campaigns(id, title, product_name, status, brands(brand_name))",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ApplicationWithCampaign[];
}
