"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ApplicantActionResult = { error?: string; ok?: boolean };

/** 브랜드가 지원서 상태를 변경 (pending / accepted / rejected). */
export async function setApplicationStatus(
  applicationId: string,
  campaignId: string,
  status: "pending" | "accepted" | "rejected",
): Promise<ApplicantActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) return { error: error.message };

  revalidatePath(`/brand/campaigns/${campaignId}/applicants`);
  return { ok: true };
}
