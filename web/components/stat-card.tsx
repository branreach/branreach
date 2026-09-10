import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  className?: string;
};

export function StatCard({ label, value, hint, href, className }: Props) {
  const inner = (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 sm:p-5",
        href && "transition-colors hover:bg-muted/50",
        className,
      )}
    >
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
