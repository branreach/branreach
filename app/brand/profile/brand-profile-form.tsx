"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/constants";
import type { MyBrand } from "@/lib/brand";

import { updateBrandProfile, type BrandProfileState } from "./actions";

export function BrandProfileForm({ data }: { data: MyBrand }) {
  const { brand, contact } = data;
  const [state, formAction, pending] = useActionState<
    BrandProfileState,
    FormData
  >(updateBrandProfile, {});

  const [logo, setLogo] = useState<string | null>(brand.logo_url);
  const [category, setCategory] = useState(brand.category ?? "");

  useEffect(() => {
    if (state.success) toast.success("브랜드 정보가 저장되었습니다.");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold">브랜드 정보</h2>
          <p className="text-xs text-muted-foreground">
            인플루언서가 캠페인에서 보게 되는 정보입니다.
          </p>
        </div>

        <div className="space-y-2">
          <Label>로고</Label>
          <ImageUpload
            bucket="brand-logos"
            name="logo_url"
            value={logo}
            onChange={setLogo}
            shape="square"
            label="로고"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand_name">브랜드명 *</Label>
            <Input
              id="brand_name"
              name="brand_name"
              defaultValue={brand.brand_name ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <input type="hidden" name="category" value={category} />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="website">웹사이트</Label>
            <Input
              id="website"
              name="website"
              type="url"
              inputMode="url"
              placeholder="https://"
              defaultValue={brand.website ?? ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">브랜드 설명</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={brand.description ?? ""}
            placeholder="브랜드 소개, 주요 제품, 중국 시장에서 이루고 싶은 목표 등"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-lg border border-dashed p-5">
        <div>
          <h2 className="text-sm font-semibold">담당자 연락처 (비공개)</h2>
          <p className="text-xs text-muted-foreground">
            본인과 운영자만 볼 수 있습니다.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="contact_name">담당자명</Label>
            <Input
              id="contact_name"
              name="contact_name"
              defaultValue={contact?.contact_name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_wechat">WeChat</Label>
            <Input
              id="contact_wechat"
              name="contact_wechat"
              defaultValue={contact?.contact_wechat ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">전화번호</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              defaultValue={contact?.contact_phone ?? ""}
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
