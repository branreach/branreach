import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">지금 시작하세요</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          가입은 무료입니다. 역할을 선택하고 프로필을 등록하면 바로 시작할 수 있습니다.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="sm:min-w-52">
            <Link href="/signup?role=influencer">인플루언서로 시작하기</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="sm:min-w-52">
            <Link href="/signup?role=brand">브랜드로 시작하기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row">
        <span>© {new Date().getFullYear()} Branreach</span>
        <span>한국 브랜드 × 중국 인플루언서 크로스보더 매칭</span>
      </div>
    </footer>
  );
}
