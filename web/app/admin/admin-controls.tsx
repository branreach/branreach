"use client";

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
import {
  CAMPAIGN_STATUS_LABEL,
  MATCH_STATUS_LABEL,
} from "@/lib/constants";
import type {
  CampaignStatus,
  EntityStatus,
  MatchStatus,
} from "@/types/database";

import {
  adminDeleteCampaign,
  adminSetCampaignStatus,
  setBrandStatus,
  setInfluencerStatus,
  setMatchStatus,
  type AdminResult,
} from "./actions";

const ENTITY_STATUS: Record<EntityStatus, string> = {
  active: "활성",
  inactive: "비활성",
  pending: "대기",
};

function useRun() {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<AdminResult>, ok: string) =>
    start(async () => {
      const r = await fn();
      if (r.error) toast.error(r.error);
      else toast.success(ok);
    });
  return { pending, run };
}

export function EntityStatusSelect({
  kind,
  id,
  status,
}: {
  kind: "influencer" | "brand";
  id: string;
  status: EntityStatus;
}) {
  const { pending, run } = useRun();
  const fn = kind === "influencer" ? setInfluencerStatus : setBrandStatus;
  return (
    <Select
      value={status}
      onValueChange={(v) =>
        run(() => fn(id, v as EntityStatus), "상태를 변경했습니다.")
      }
      disabled={pending}
    >
      <SelectTrigger size="sm" className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ENTITY_STATUS).map(([k, label]) => (
          <SelectItem key={k} value={k}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CampaignStatusSelect({
  id,
  status,
}: {
  id: string;
  status: CampaignStatus;
}) {
  const { pending, run } = useRun();
  return (
    <Select
      value={status}
      onValueChange={(v) =>
        run(
          () => adminSetCampaignStatus(id, v as CampaignStatus),
          "상태를 변경했습니다.",
        )
      }
      disabled={pending}
    >
      <SelectTrigger size="sm" className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CAMPAIGN_STATUS_LABEL).map(([k, label]) => (
          <SelectItem key={k} value={k}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MatchStatusSelect({
  id,
  status,
}: {
  id: string;
  status: MatchStatus;
}) {
  const { pending, run } = useRun();
  return (
    <Select
      value={status}
      onValueChange={(v) =>
        run(() => setMatchStatus(id, v as MatchStatus), "매칭 상태를 변경했습니다.")
      }
      disabled={pending}
    >
      <SelectTrigger size="sm" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MATCH_STATUS_LABEL).map(([k, label]) => (
          <SelectItem key={k} value={k}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DeleteCampaignButton({ id }: { id: string }) {
  const { pending, run } = useRun();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive"
      disabled={pending}
      onClick={() => {
        if (confirm("이 캠페인을 삭제합니다. 되돌릴 수 없습니다.")) {
          run(() => adminDeleteCampaign(id), "캠페인을 삭제했습니다.");
        }
      }}
    >
      삭제
    </Button>
  );
}
