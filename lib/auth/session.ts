import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

/** 현재 로그인한 auth 사용자 (없으면 null). */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** 현재 사용자의 profiles 행 (없으면 null). */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

/** 로그인 필수. 아니면 /login 으로 리다이렉트. */
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * 특정 역할 필수. 로그인 안 했으면 /login,
 * 역할이 다르면 본인 역할의 대시보드로 리다이렉트.
 */
export async function requireRole(role: UserRole): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== role) redirect(`/${profile.role}/dashboard`);
  return profile;
}

/** 로그인 상태면 역할별 대시보드로 보낸다 (로그인/가입 페이지에서 사용). */
export async function redirectIfAuthenticated(): Promise<void> {
  const profile = await getProfile();
  if (profile) redirect(`/${profile.role}/dashboard`);
}
