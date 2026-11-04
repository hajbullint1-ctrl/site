import { cn } from "@/lib/utils";

const LOGO_SRC =
  "data:image/jpeg;base64,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";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt=""
      className={cn("size-9 rounded-full object-cover", className)}
      width={36}
      height={36}
      aria-hidden="true"
    />
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-fg", className)}>
      <img
        src={LOGO_SRC}
        alt="Авто-Эмир"
        className="size-9 shrink-0 rounded-full object-cover"
        width={36}
        height={36}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-medium tracking-tight">Авто-Эмир</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">
          автошкола
        </span>
      </span>
    </span>
  );
}
