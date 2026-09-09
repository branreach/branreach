import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { requireRole } from "@/lib/auth/session";
import { getMyInfluencer, profileCompletion } from "@/lib/influencer";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "프로필" };

export default async function InfluencerProfilePage() {
  await requireRole("influencer");
  const data = await getMyInfluencer();
  if (!data) redirect("/login");

  const { percent, missing } = profileCompletion(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">프로필</h1>
        <p className="text-sm text-muted-foreground">
          프로필이 충실할수록 브랜드에게 더 잘 노출됩니다.
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">프로필 완성도</span>
          <span className="tabular-nums text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-2" />
        {missing.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            남은 항목: {missing.join(", ")}
          </p>
        ) : null}
      </div>

      <ProfileForm data={data} />
    </div>
  );
}
