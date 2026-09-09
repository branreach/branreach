import { getLandingStats } from "@/lib/stats";

const ITEMS = [
  { key: "influencers", label: "등록 인플루언서" },
  { key: "brands", label: "등록 브랜드" },
  { key: "campaigns", label: "진행 중 캠페인" },
] as const;

export async function NetworkStats() {
  const stats = await getLandingStats();

  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-border/60 px-5">
        {ITEMS.map((item) => (
          <div key={item.key} className="px-3 py-8 text-center sm:py-10">
            <div className="text-2xl font-bold tabular-nums sm:text-4xl">
              {stats[item.key].toLocaleString("ko-KR")}
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
