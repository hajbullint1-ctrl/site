import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M20 2.2v6.2M20 31.6v6.2M2.2 20h6.2M31.6 20h6.2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M13.2 30.2 20 11.5l6.8 18.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M15.8 23.6h8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-fg", className)}>
      <LogoMark className="size-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-medium tracking-tight">Авто-Эмир</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">
          автошкола
        </span>
      </span>
    </span>
  );
}
