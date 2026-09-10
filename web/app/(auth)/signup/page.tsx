import Link from "next/link";
import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirectIfAuthenticated } from "@/lib/auth/session";

import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "회원가입" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  await redirectIfAuthenticated();
  const { role } = await searchParams;
  const initialRole = role === "brand" ? "brand" : "influencer";

  return (
    <Card>
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          역할을 선택하고 계정을 만드세요. 가입 후 프로필을 입력합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignupForm initialRole={initialRole} />
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="underline underline-offset-4">
            로그인
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
