import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { brandProfileCompletion, getMyBrand } from "@/lib/brand";

import { createCampaign } from "../actions";
import { CampaignForm } from "../campaign-form";

export const metadata: Metadata = { title: "캠페인 등록" };

export default async function NewCampaignPage() {
  await requireRole("brand");
  const me = await getMyBrand();
  if (!me) redirect("/login");

  const { percent } = brandProfileCompletion(me);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold">캠페인 등록</h1>
        <p className="text-sm text-muted-foreground">
          중국 인플루언서와의 협업 캠페인을 등록합니다.
        </p>
      </div>

      {percent < 60 ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          브랜드 정보가 부족합니다.{" "}
          <Link
            href="/brand/profile"
            className="font-medium underline underline-offset-4"
          >
            브랜드 정보 채우기
          </Link>
          {" "}— 인플루언서가 브랜드를 신뢰할 수 있도록 먼저 채워주세요.
        </div>
      ) : null}

      <CampaignForm action={createCampaign} />
    </div>
  );
}
