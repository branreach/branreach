"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  COLLABORATION_TYPES,
  FOLLOWER_TIERS,
} from "@/lib/constants";

const ALL = "all";

export function InfluencerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === ALL) next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`);
  };

  const hasFilters =
    params.has("category") ||
    params.has("collab") ||
    params.has("followers");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={params.get("category") ?? ALL}
        onValueChange={(v) => setParam("category", v)}
      >
        <SelectTrigger className="w-36" size="sm">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>전체 카테고리</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("collab") ?? ALL}
        onValueChange={(v) => setParam("collab", v)}
      >
        <SelectTrigger className="w-40" size="sm">
          <SelectValue placeholder="협업 유형" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>전체 협업 유형</SelectItem>
          {COLLABORATION_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("followers") ?? ALL}
        onValueChange={(v) => setParam("followers", v)}
      >
        <SelectTrigger className="w-36" size="sm">
          <SelectValue placeholder="팔로워 수" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>팔로워 전체</SelectItem>
          {FOLLOWER_TIERS.map((t) => (
            <SelectItem key={t.value} value={String(t.value)}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.replace(pathname)}
        >
          초기화
        </Button>
      ) : null}
    </div>
  );
}
