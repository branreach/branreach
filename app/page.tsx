import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

type Stats = { influencers: number; brands: number; campaigns: number };

async function getStats(): Promise<Stats | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("landing_stats");
    if (error || !data) return null;
    return data as unknown as Stats;
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const stats = await getStats();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium tracking-wide text-muted-foreground">
          Korean Brands × Chinese Influencers
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          한국 브랜드와 중국 인플루언서를 연결합니다
        </h1>
        <p className="text-muted-foreground">
          한국 브랜드의 캠페인을 중국 인플루언서가 발견하고 직접 지원합니다.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/signup?role=influencer">인플루언서로 시작하기</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/signup?role=brand">브랜드로 시작하기</Link>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium underline underline-offset-4">
          로그인
        </Link>
      </p>

      {stats ? (
        <dl className="grid grid-cols-3 gap-6 border-t pt-8 text-sm">
          <div>
            <dt className="text-muted-foreground">등록 인플루언서</dt>
            <dd className="text-xl font-semibold">{stats.influencers}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">등록 브랜드</dt>
            <dd className="text-xl font-semibold">{stats.brands}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">진행 캠페인</dt>
            <dd className="text-xl font-semibold">{stats.campaigns}</dd>
          </div>
        </dl>
      ) : (
        <p className="border-t pt-8 text-xs text-muted-foreground">
          (통계는 DB 마이그레이션 적용 후 표시됩니다 — Phase 2에서 정식 구현)
        </p>
      )}
    </main>
  );
}
