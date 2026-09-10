import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { brandProfileCompletion, getMyBrand } from "@/lib/brand";

import { BrandProfileForm } from "./brand-profile-form";

export const metadata: Metadata = { title: "브랜드 정보" };

export default async function BrandProfilePage() {
  await requireRole("brand");
  const data = await getMyBrand();
  if (!data) redirect("/login");

  const { percent, missing } = brandProfileCompletion(data);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold">브랜드 정보</h1>
        <p className="text-sm text-muted-foreground">
          캠페인을 등록하기 전에 브랜드 정보를 채워주세요.
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">정보 완성도</span>
          <span className="tabular-nums text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-2" />
        {missing.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            남은 항목: {missing.join(", ")}
          </p>
        ) : null}
      </div>

      <BrandProfileForm data={data} />
    </div>
  );
}
