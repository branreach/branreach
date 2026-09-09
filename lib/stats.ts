import { createClient } from "@/lib/supabase/server";

export type LandingStats = {
  influencers: number;
  brands: number;
  campaigns: number;
};

const EMPTY: LandingStats = { influencers: 0, brands: 0, campaigns: 0 };

/**
 * 랜딩 통계. `landing_stats` RPC(SECURITY DEFINER)로 실제 DB 집계를 가져온다.
 * 마이그레이션 미적용 등으로 실패하면 0을 반환한다 (하드코딩 금지, PRD §22).
 */
export async function getLandingStats(): Promise<LandingStats> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("landing_stats");
    if (error || !data || typeof data !== "object") return EMPTY;
    const d = data as Record<string, unknown>;
    return {
      influencers: Number(d.influencers) || 0,
      brands: Number(d.brands) || 0,
      campaigns: Number(d.campaigns) || 0,
    };
  } catch {
    return EMPTY;
  }
}
