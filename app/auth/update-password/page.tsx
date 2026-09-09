import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";

import { UpdatePasswordForm } from "./update-password-form";

export const metadata: Metadata = { title: "비밀번호 변경" };

export default async function UpdatePasswordPage() {
  // 재설정 링크로 들어오면 콜백에서 세션이 생성된 상태다.
  await requireUser();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
            <CardDescription>새 비밀번호를 입력하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
