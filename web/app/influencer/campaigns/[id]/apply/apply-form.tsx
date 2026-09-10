"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { applyToCampaign, type ApplyFormState } from "./actions";

export function ApplyForm({ campaignId }: { campaignId: string }) {
  const action = applyToCampaign.bind(null, campaignId);
  const [state, formAction, pending] = useActionState<ApplyFormState, FormData>(
    action,
    {},
  );
  const [links, setLinks] = useState<string[]>([""]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="message">지원 메시지 *</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="이 캠페인에 지원하는 이유, 어떻게 콘텐츠를 만들지 등을 간단히 적어주세요."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="strengths">나의 강점 / 협업 경험 (선택)</Label>
        <Textarea
          id="strengths"
          name="strengths"
          rows={3}
          placeholder="주력 콘텐츠, 팔로워 반응, 협업 스타일 등"
        />
      </div>

      <section className="space-y-4 rounded-lg border border-dashed p-5">
        <div>
          <h2 className="text-sm font-semibold">과거 협업 성과 / 레퍼런스</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            브랜드가 예산 대비 기대 성과를 판단하는 데 참고합니다. 본인이 입력한
            정보이며 <strong>Branreach가 검증하지 않았습니다.</strong>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="past_collaboration">과거 협업 브랜드 / 제품</Label>
          <Textarea
            id="past_collaboration"
            name="past_collaboration"
            rows={2}
            placeholder="예: A화장품 세럼 협찬, B브랜드 공동구매 진행"
          />
        </div>

        <div className="space-y-2">
          <Label>대표 콘텐츠 링크</Label>
          {links.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Input
                name="portfolio_links"
                type="url"
                inputMode="url"
                placeholder="https://www.xiaohongshu.com/explore/..."
                value={link}
                onChange={(e) =>
                  setLinks((prev) =>
                    prev.map((l, idx) => (idx === i ? e.target.value : l)),
                  )
                }
              />
              {links.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setLinks((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  aria-label="링크 삭제"
                >
                  ×
                </Button>
              ) : null}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLinks((prev) => [...prev, ""])}
          >
            링크 추가
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="performance_summary">성과 지표 (자율 입력)</Label>
          <Textarea
            id="performance_summary"
            name="performance_summary"
            rows={2}
            placeholder="예: 평균 조회수 5만, 좋아요 3천, 지난 공동구매 판매 200건"
          />
        </div>
      </section>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "지원 중…" : "지원 제출"}
        </Button>
      </div>
    </form>
  );
}
