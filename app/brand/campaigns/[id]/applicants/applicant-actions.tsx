"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { setApplicationStatus } from "./actions";

export function ApplicantActions({
  applicationId,
  campaignId,
  status,
}: {
  applicationId: string;
  campaignId: string;
  status: string;
}) {
  const [pending, start] = useTransition();

  const set = (
    next: "pending" | "accepted" | "rejected",
    label: string,
  ) => {
    start(async () => {
      const res = await setApplicationStatus(applicationId, campaignId, next);
      if (res.error) toast.error(res.error);
      else toast.success(label);
    });
  };

  if (status === "matched") {
    return (
      <span className="text-sm font-medium text-emerald-600">매칭 완료</span>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={status === "accepted" ? "default" : "outline"}
        disabled={pending}
        onClick={() => set("accepted", "선정 처리했습니다.")}
      >
        선정
      </Button>
      <Button
        size="sm"
        variant={status === "rejected" ? "destructive" : "outline"}
        disabled={pending}
        onClick={() => set("rejected", "미선정 처리했습니다.")}
      >
        미선정
      </Button>
      {status !== "pending" ? (
        <Button
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => set("pending", "검토 중으로 되돌렸습니다.")}
        >
          되돌리기
        </Button>
      ) : null}
    </div>
  );
}
