"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  COMPENSATION_TYPE_LABEL,
  FOLLOWER_TIERS,
} from "@/lib/constants";

const ALL = "all";

export function CampaignFilters() {
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
    params.has("compensation") ||
    params.has("followers") ||
    params.has("status");

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
        value={params.get("compensation") ?? ALL}
        onValueChange={(v) => setParam("compensation", v)}
      >
        <SelectTrigger className="w-40" size="sm">
          <SelectValue placeholder="보상 방식" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>전체 보상 방식</SelectItem>
          {Object.entries(COMPENSATION_TYPE_LABEL).map(([k, label]) => (
            <SelectItem key={k} value={k}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("followers") ?? ALL}
        onValueChange={(v) => setParam("followers", v)}
      >
        <SelectTrigger className="w-40" size="sm">
          <SelectValue placeholder="최소 팔로워 조건" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>팔로워 조건 전체</SelectItem>
          {FOLLOWER_TIERS.map((t) => (
            <SelectItem key={t.value} value={String(t.value)}>
              {t.label} 이하 조건
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("status") ?? "recruiting"}
        onValueChange={(v) => setParam("status", v === "recruiting" ? "" : v)}
      >
        <SelectTrigger className="w-32" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recruiting">모집 중</SelectItem>
          <SelectItem value="closed">모집 마감</SelectItem>
          <SelectItem value="all">전체</SelectItem>
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
