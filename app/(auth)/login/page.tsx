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

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  await redirectIfAuthenticated();
  const { redirect } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>Branreach 계정으로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm redirectTo={redirect} />
        <div className="flex justify-between text-sm text-muted-foreground">
          <Link
            href="/reset-password"
            className="underline underline-offset-4"
          >
            비밀번호 찾기
          </Link>
          <Link href="/signup" className="underline underline-offset-4">
            회원가입
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
