"use client";

import { cn } from "@/lib/utils";

type Props = {
  name: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

/**
 * 다중 선택 칩. 선택값을 name 으로 여러 개의 hidden input 에 담아 폼 전송한다.
 */
export function ChipToggleGroup({
  name,
  options,
  value,
  onChange,
  className,
}: Props) {
  const toggle = (opt: string) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt],
    );
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {value.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
