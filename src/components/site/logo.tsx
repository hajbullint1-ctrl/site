import { cn } from "@/lib/utils";

const LOGO_SRC =
  "data:image/jpeg;base64,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";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img src={LOGO_SRC} alt="" className={cn("size-9 rounded-full object-cover", className)} width={36} height={36} aria-hidden="true" />
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-fg", className)}>
      <img src={LOGO_SRC} alt="Авто-Эмир" className="size-9 shrink-0 rounded-full object-cover" width={36} height={36} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-medium tracking-tight">Авто-Эмир</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">автошкола</span>
      </span>
    </span>
  );
}
