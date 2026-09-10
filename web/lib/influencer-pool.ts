import { createClient } from "@/lib/supabase/server";

/**
 * 브랜드에게 노출되는 인플루언서 공개 정보. 연락처 컬럼(influencer_contacts)은
 * 절대 select 하지 않는다. (RLS 로도 차단되지만 방어적으로 컬럼을 명시)
 */
export type PublicInfluencer = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  xiaohongshu_id: string | null;
  xiaohongshu_url: string | null;
  follower_count: number;
  categories: string[];
  collaboration_types: string[];
  bio: string | null;
};

const PUBLIC_COLUMNS =
  "id, nickname, avatar_url, xiaohongshu_id, xiaohongshu_url, follower_count, categories, collaboration_types, bio";

export type InfluencerFilters = {
  category?: string;
  collaborationType?: string;
  minFollowers?: number;
};

export async function listInfluencers(
  filters: InfluencerFilters = {},
): Promise<PublicInfluencer[]> {
  const supabase = await createClient();
  let query = supabase
    .from("influencers")
    .select(PUBLIC_COLUMNS)
    .eq("status", "active")
    .order("follower_count", { ascending: false });

  if (filters.category)
    query = query.contains("categories", [filters.category]);
  if (filters.collaborationType)
    query = query.contains("collaboration_types", [filters.collaborationType]);
  if (filters.minFollowers)
    query = query.gte("follower_count", filters.minFollowers);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PublicInfluencer[];
}

export async function getPublicInfluencer(
  id: string,
): Promise<PublicInfluencer | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("influencers")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();
  return (data as PublicInfluencer | null) ?? null;
}
