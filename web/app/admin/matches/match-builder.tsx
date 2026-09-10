"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createMatch } from "../actions";

export function CampaignPicker({
  campaigns,
  selected,
}: {
  campaigns: { id: string; title: string; brand: string }[];
  selected?: string;
}) {
  const router = useRouter();
  return (
    <Select
      value={selected ?? ""}
      onValueChange={(v) => router.replace(`/admin/matches?campaign=${v}`)}
    >
      <SelectTrigger className="w-full max-w-md">
        <SelectValue placeholder="캠페인을 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        {campaigns.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.brand} · {c.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MatchButton({
  campaignId,
  influencerId,
  disabled,
}: {
  campaignId: string;
  influencerId: string;
  disabled?: boolean;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  if (disabled) {
    return <span className="text-sm text-muted-foreground">매칭됨</span>;
  }

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await createMatch(campaignId, influencerId);
          if (r.error) toast.error(r.error);
          else {
            toast.success("매칭을 생성했습니다.");
            router.refresh();
          }
        })
      }
    >
      매칭
    </Button>
  );
}
