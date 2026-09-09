"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type {
  CampaignStatus,
  EntityStatus,
  MatchStatus,
} from "@/types/database";

export type AdminResult = { error?: string; ok?: boolean };

export async function setInfluencerStatus(
  id: string,
  status: EntityStatus,
): Promise<AdminResult> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("influencers")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/influencers");
  revalidatePath(`/admin/influencers/${id}`);
  return { ok: true };
}

export async function setBrandStatus(
  id: string,
  status: EntityStatus,
): Promise<AdminResult> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("brands")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  revalidatePath(`/admin/brands/${id}`);
  return { ok: true };
}

export async function adminSetCampaignStatus(
  id: string,
  status: CampaignStatus,
): Promise<AdminResult> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return { ok: true };
}

export async function adminDeleteCampaign(id: string): Promise<AdminResult> {
  await requireRole("admin");
  const supabase = await createClient();
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/campaigns");
  return { ok: true };
}

export async function createMatch(
  campaignId: string,
  influencerId: string,
): Promise<AdminResult> {
  await requireRole("admin");
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("applications")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("influencer_id", influencerId)
    .maybeSingle();

  const { error } = await supabase.from("matches").insert({
    campaign_id: campaignId,
    influencer_id: influencerId,
    application_id: application?.id ?? null,
  });

  if (error) {
    if (error.code === "23505") return { error: "이미 매칭된 조합입니다." };
    return { error: error.message };
  }

  revalidatePath("/admin/matches");
  revalidatePath("/admin/applications");
  return { ok: true };
}

export async function setMatchStatus(
  id: string,
  status: MatchStatus,
): Promise<AdminResult> {
  await requireRole("admin");
  const supabase = await createClient();
  const patch: { status: MatchStatus; completed_at?: string | null } = {
    status,
  };
  if (status === "completed") patch.completed_at = new Date().toISOString();
  if (status === "cancelled" || status === "matched" || status === "in_progress")
    patch.completed_at = null;

  const { error } = await supabase.from("matches").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/matches");
  return { ok: true };
}
