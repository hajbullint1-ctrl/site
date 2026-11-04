import { cn } from "@/lib/utils";

const LOGO_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAvXklEQVR42sW7Z5QV1bY2/Ky1q";

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
