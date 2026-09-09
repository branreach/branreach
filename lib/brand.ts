import { createClient } from "@/lib/supabase/server";
import type { Brand, BrandContact, Profile } from "@/types/database";

export type MyBrand = {
  profile: Profile;
  brand: Brand;
  contact: BrandContact | null;
};

/** 현재 로그인한 브랜드의 profile + brand + contact. */
export async function getMyBrand(): Promise<MyBrand | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile || profile.role !== "brand") return null;

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!brand) return null;

  const { data: contact } = await supabase
    .from("brand_contacts")
    .select("*")
    .eq("brand_id", brand.id)
    .maybeSingle();

  return { profile, brand, contact };
}

const FIELDS: { label: string; filled: (m: MyBrand) => boolean }[] = [
  { label: "브랜드명", filled: (m) => !!m.brand.brand_name },
  { label: "로고", filled: (m) => !!m.brand.logo_url },
  { label: "브랜드 설명", filled: (m) => !!m.brand.description },
  { label: "카테고리", filled: (m) => !!m.brand.category },
  { label: "웹사이트", filled: (m) => !!m.brand.website },
  { label: "담당자명", filled: (m) => !!m.contact?.contact_name },
  {
    label: "담당자 연락처",
    filled: (m) =>
      !!(m.contact?.contact_wechat || m.contact?.contact_phone),
  },
];

export function brandProfileCompletion(m: MyBrand): {
  percent: number;
  missing: string[];
} {
  const done = FIELDS.filter((f) => f.filled(m));
  return {
    percent: Math.round((done.length / FIELDS.length) * 100),
    missing: FIELDS.filter((f) => !f.filled(m)).map((f) => f.label),
  };
}
