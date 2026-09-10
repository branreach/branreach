"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ApplyFormState = { error?: string };

export async function applyToCampaign(
  campaignId: string,
  _prev: ApplyFormState,
  formData: FormData,
): Promise<ApplyFormState> {
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
    return { error: "인플루언서만 지원할 수 있습니다." };
  }

  const { data: influencer } = await supabase
    .from("influencers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();
  if (!influencer) return { error: "인플루언서 정보를 찾을 수 없습니다." };

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("status")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) return { error: "캠페인을 찾을 수 없습니다." };
  if (campaign.status !== "recruiting") {
    return { error: "모집이 마감된 캠페인입니다." };
  }

  const message = String(formData.get("message") ?? "").trim();
  if (!message) return { error: "지원 메시지를 입력해주세요." };

  const portfolio_links = formData
    .getAll("portfolio_links")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const { error } = await supabase.from("applications").insert({
    campaign_id: campaignId,
    influencer_id: influencer.id,
    message,
    strengths: String(formData.get("strengths") ?? "").trim() || null,
    past_collaboration:
      String(formData.get("past_collaboration") ?? "").trim() || null,
    portfolio_links,
    performance_summary:
      String(formData.get("performance_summary") ?? "").trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 지원한 캠페인입니다." };
    }
    return { error: error.message };
  }

  revalidatePath("/influencer/applications");
  revalidatePath(`/influencer/campaigns/${campaignId}`);
  redirect("/influencer/applications?applied=1");
}
