import { createClient } from "@/lib/supabase/server";

/**
 * Admin 페이지는 요청 사용자의 세션(RLS is_admin() 통과)으로 조회한다.
 * service_role 키는 사용하지 않는다 — RLS 정책이 admin 에게 전체 접근을 허용한다.
 */

export type AdminStats = {
  influencers: number;
  brands: number;
  campaigns: number;
  applications: number;
  matches: number;
};

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();
  const tables = [
    "influencers",
    "brands",
    "campaigns",
    "applications",
    "matches",
  ] as const;

  const results = await Promise.all(
    tables.map((t) =>
      supabase.from(t).select("id", { count: "exact", head: true }),
    ),
  );

  return {
    influencers: results[0].count ?? 0,
    brands: results[1].count ?? 0,
    campaigns: results[2].count ?? 0,
    applications: results[3].count ?? 0,
    matches: results[4].count ?? 0,
  };
}
