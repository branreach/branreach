import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
      <p className="text-sm font-medium tracking-[0.12em] text-muted-foreground uppercase">
        Korean Brands × Chinese Influencers
      </p>
      <h1 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold leading-tight sm:text-5xl">
        한국 브랜드와 중국 인플루언서를
        <br className="hidden sm:block" /> 연결합니다
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
        한국 브랜드가 중국 시장 진출에 필요한 인플루언서 협업을 찾고,
        중국 인플루언서는 한국 브랜드의 캠페인을 발견해 직접 지원합니다.
      </p>

      <div className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="sm:min-w-52">
          <Link href="/signup?role=influencer">인플루언서로 시작하기</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="sm:min-w-52">
          <Link href="/signup?role=brand">브랜드로 시작하기</Link>
        </Button>
      </div>
    </section>
  );
}
