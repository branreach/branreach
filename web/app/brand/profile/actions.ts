"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type BrandProfileState = { error?: string; success?: boolean };

function text(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export async function updateBrandProfile(
  _prev: BrandProfileState,
  formData: FormData,
): Promise<BrandProfileState> {
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

  const brand_name = text(formData, "brand_name");
  if (!brand_name) return { error: "브랜드명을 입력해주세요." };

  const website = text(formData, "website");
  if (website && !/^https?:\/\//i.test(website)) {
    return { error: "웹사이트는 http(s):// 로 시작해야 합니다." };
  }

  const logo_url = text(formData, "logo_url") || null;

  const [{ error: e1 }, { error: e2 }, { error: e3 }] = await Promise.all([
    supabase
      .from("profiles")
      .update({ name: brand_name, avatar_url: logo_url })
      .eq("id", profile.id),
    supabase
      .from("brands")
      .update({
        brand_name,
        logo_url,
        description: text(formData, "description") || null,
        category: text(formData, "category") || null,
        website: website || null,
      })
      .eq("id", brand.id),
    supabase
      .from("brand_contacts")
      .update({
        contact_name: text(formData, "contact_name") || null,
        contact_wechat: text(formData, "contact_wechat") || null,
        contact_phone: text(formData, "contact_phone") || null,
      })
      .eq("brand_id", brand.id),
  ]);

  const err = e1 || e2 || e3;
  if (err) return { error: err.message };

  revalidatePath("/brand/profile");
  revalidatePath("/brand/dashboard");
  return { success: true };
}
