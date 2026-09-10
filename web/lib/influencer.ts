import { createClient } from "@/lib/supabase/server";
import type { Influencer, InfluencerContact, Profile } from "@/types/database";

export type MyInfluencer = {
  profile: Profile;
  influencer: Influencer;
  contact: InfluencerContact | null;
};

/** 현재 로그인한 인플루언서의 profile + influencer + contact 를 한 번에 가져온다. */
export async function getMyInfluencer(): Promise<MyInfluencer | null> {
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
  if (!profile || profile.role !== "influencer") return null;

  const { data: influencer } = await supabase
    .from("influencers")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!influencer) return null;

  const { data: contact } = await supabase
    .from("influencer_contacts")
    .select("*")
    .eq("influencer_id", influencer.id)
    .maybeSingle();

  return { profile, influencer, contact };
}

const PROFILE_FIELDS: {
  label: string;
  filled: (m: MyInfluencer) => boolean;
}[] = [
  { label: "닉네임", filled: (m) => !!m.influencer.nickname },
  { label: "프로필 이미지", filled: (m) => !!m.influencer.avatar_url },
  { label: "샤오홍슈 ID", filled: (m) => !!m.influencer.xiaohongshu_id },
  { label: "샤오홍슈 URL", filled: (m) => !!m.influencer.xiaohongshu_url },
  { label: "팔로워 수", filled: (m) => m.influencer.follower_count > 0 },
  { label: "카테고리", filled: (m) => m.influencer.categories.length > 0 },
  {
    label: "협업 유형",
    filled: (m) => m.influencer.collaboration_types.length > 0,
  },
  { label: "자기소개", filled: (m) => !!m.influencer.bio },
  {
    label: "연락처",
    filled: (m) =>
      !!(m.contact?.wechat_id || m.contact?.email || m.contact?.phone),
  },
];

/** 프로필 완성도 (0–100) + 미완성 항목 목록. */
export function profileCompletion(m: MyInfluencer): {
  percent: number;
  missing: string[];
} {
  const done = PROFILE_FIELDS.filter((f) => f.filled(m));
  const missing = PROFILE_FIELDS.filter((f) => !f.filled(m)).map(
    (f) => f.label,
  );
  return {
    percent: Math.round((done.length / PROFILE_FIELDS.length) * 100),
    missing,
  };
}
