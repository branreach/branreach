"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { error?: string; success?: boolean };

function text(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export async function updateInfluencerProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
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
  if (!profile || profile.role !== "influencer") {
    return { error: "권한이 없습니다." };
  }

  const { data: influencer } = await supabase
    .from("influencers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!influencer) return { error: "인플루언서 정보를 찾을 수 없습니다." };

  const nickname = text(formData, "nickname");
  if (!nickname) return { error: "닉네임을 입력해주세요." };

  const followerRaw = Number(formData.get("follower_count") ?? 0);
  const follower_count =
    Number.isFinite(followerRaw) && followerRaw > 0
      ? Math.floor(followerRaw)
      : 0;

  const xiaohongshu_url = text(formData, "xiaohongshu_url");
  if (xiaohongshu_url && !/^https?:\/\//i.test(xiaohongshu_url)) {
    return { error: "샤오홍슈 URL은 http(s):// 로 시작해야 합니다." };
  }

  const avatar_url = text(formData, "avatar_url") || null;
  const categories = formData.getAll("categories").map(String);
  const collaboration_types = formData
    .getAll("collaboration_types")
    .map(String);

  const [{ error: e1 }, { error: e2 }, { error: e3 }] = await Promise.all([
    supabase
      .from("profiles")
      .update({ name: nickname, avatar_url })
      .eq("id", profile.id),
    supabase
      .from("influencers")
      .update({
        nickname,
        avatar_url,
        xiaohongshu_id: text(formData, "xiaohongshu_id") || null,
        xiaohongshu_url: xiaohongshu_url || null,
        follower_count,
        categories,
        collaboration_types,
        bio: text(formData, "bio") || null,
      })
      .eq("id", influencer.id),
    supabase
      .from("influencer_contacts")
      .update({
        wechat_id: text(formData, "wechat_id") || null,
        email: text(formData, "email") || null,
        phone: text(formData, "phone") || null,
      })
      .eq("influencer_id", influencer.id),
  ]);

  const err = e1 || e2 || e3;
  if (err) return { error: err.message };

  revalidatePath("/influencer/profile");
  revalidatePath("/influencer/dashboard");
  return { success: true };
}
