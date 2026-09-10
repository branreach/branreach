"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  /** Storage 버킷 이름 (avatars | brand-logos) */
  bucket: string;
  /** 현재 이미지 URL */
  value: string | null;
  /** 업로드 완료 시 public URL 전달 */
  onChange: (url: string) => void;
  /** hidden input 이름 (폼 전송용) */
  name: string;
  shape?: "circle" | "square";
  label?: string;
};

const MAX_BYTES = 3 * 1024 * 1024;

export function ImageUpload({
  bucket,
  value,
  onChange,
  name,
  shape = "circle",
  label = "이미지",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("파일 크기는 3MB 이하여야 합니다.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("로그인이 필요합니다.");
        return;
      }

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(`업로드 실패: ${uploadError.message}`);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(publicUrl);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name={name} value={value ?? ""} />
      <div
        className={cn(
          "flex size-20 shrink-0 items-center justify-center overflow-hidden border bg-muted text-xs text-muted-foreground",
          shape === "circle" ? "rounded-full" : "rounded-lg",
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="size-full object-cover"
          />
        ) : (
          <span>없음</span>
        )}
      </div>

      <div className="space-y-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "업로드 중…" : value ? "이미지 변경" : `${label} 업로드`}
        </Button>
        <p className="text-xs text-muted-foreground">JPG/PNG, 3MB 이하</p>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
