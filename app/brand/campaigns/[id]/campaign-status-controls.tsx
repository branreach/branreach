"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { CampaignStatus } from "@/types/database";

import { setCampaignStatus } from "../actions";

export function CampaignStatusControls({
  campaignId,
  status,
}: {
  campaignId: string;
  status: CampaignStatus;
}) {
  const [pending, start] = useTransition();

  const change = (next: CampaignStatus, label: string) => {
    start(async () => {
      await setCampaignStatus(campaignId, next);
      toast.success(label);
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" ? (
        <Button
          size="sm"
          disabled={pending}
          onClick={() => change("recruiting", "모집을 시작했습니다.")}
        >
          모집 시작
        </Button>
      ) : null}
      {status === "recruiting" ? (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => change("closed", "모집을 종료했습니다.")}
        >
          모집 종료
        </Button>
      ) : null}
      {status === "closed" ? (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => change("recruiting", "모집을 재개했습니다.")}
          >
            모집 재개
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => change("completed", "캠페인을 완료 처리했습니다.")}
          >
            완료 처리
          </Button>
        </>
      ) : null}
    </div>
  );
}
