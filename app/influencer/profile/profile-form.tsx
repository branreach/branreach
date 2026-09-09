"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { ChipToggleGroup } from "@/components/chip-toggle-group";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, COLLABORATION_TYPES } from "@/lib/constants";
import type { MyInfluencer } from "@/lib/influencer";

import { updateInfluencerProfile, type ProfileFormState } from "./actions";

export function ProfileForm({ data }: { data: MyInfluencer }) {
  const { influencer, contact } = data;
  const [state, formAction, pending] = useActionState<
    ProfileFormState,
    FormData
  >(updateInfluencerProfile, {});

  const [avatar, setAvatar] = useState<string | null>(influencer.avatar_url);
  const [categories, setCategories] = useState<string[]>(
    influencer.categories,
  );
  const [collabTypes, setCollabTypes] = useState<string[]>(
    influencer.collaboration_types,
  );

  useEffect(() => {
    if (state.success) toast.success("프로필이 저장되었습니다.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      {/* 공개 정보 */}
      <section className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold">공개 정보</h2>
          <p className="text-xs text-muted-foreground">
            브랜드가 인플루언서 풀에서 볼 수 있는 정보입니다.
          </p>
        </div>

        <div className="space-y-2">
          <Label>프로필 이미지</Label>
          <ImageUpload
            bucket="avatars"
            name="avatar_url"
            value={avatar}
            onChange={setAvatar}
            label="프로필 이미지"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임 *</Label>
            <Input
              id="nickname"
              name="nickname"
              defaultValue={influencer.nickname ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="follower_count">팔로워 수</Label>
            <Input
              id="follower_count"
              name="follower_count"
              type="number"
              min={0}
              defaultValue={influencer.follower_count || ""}
              placeholder="예: 50000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xiaohongshu_id">샤오홍슈 ID</Label>
            <Input
              id="xiaohongshu_id"
              name="xiaohongshu_id"
              defaultValue={influencer.xiaohongshu_id ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="xiaohongshu_url">샤오홍슈 URL</Label>
            <Input
              id="xiaohongshu_url"
              name="xiaohongshu_url"
              type="url"
              inputMode="url"
              placeholder="https://www.xiaohongshu.com/user/..."
              defaultValue={influencer.xiaohongshu_url ?? ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>콘텐츠 카테고리</Label>
          <ChipToggleGroup
            name="categories"
            options={CATEGORIES}
            value={categories}
            onChange={setCategories}
          />
        </div>

        <div className="space-y-2">
          <Label>협업 유형</Label>
          <ChipToggleGroup
            name="collaboration_types"
            options={COLLABORATION_TYPES}
            value={collabTypes}
            onChange={setCollabTypes}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">자기소개</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={influencer.bio ?? ""}
            placeholder="어떤 콘텐츠를 주로 만드는지, 어떤 브랜드와 협업하고 싶은지 소개해주세요."
          />
        </div>
      </section>

      {/* 비공개 연락처 */}
      <section className="space-y-5 rounded-lg border border-dashed p-5">
        <div>
          <h2 className="text-sm font-semibold">비공개 연락처</h2>
          <p className="text-xs text-muted-foreground">
            본인과 운영자만 볼 수 있습니다. 브랜드에게는 매칭이 확정된 후에만
            공개됩니다.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="wechat_id">WeChat ID</Label>
            <Input
              id="wechat_id"
              name="wechat_id"
              defaultValue={contact?.wechat_id ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={contact?.email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={contact?.phone ?? ""}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중…" : "저장"}
        </Button>
      </div>
    </form>
  );
}
