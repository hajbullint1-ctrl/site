import { useEffect, useState } from "react";
import { formatClock } from "@/lib/utils";

const START_KEY = "ae-visit-start";

function hourBase(hour: number): number {
  if (hour >= 9 && hour < 18) return 16;
  if (hour >= 18 && hour < 22) return 9;
  return 4;
}

export function useOnlineCount(): number {
  const [n, setN] = useState(() => hourBase(new Date().getHours()) + 3);

  useEffect(() => {
    const boot = hourBase(new Date().getHours()) + Math.floor(Math.random() * 5);
    setN(boot);
    const tick = () => {
      setN((v) => {
        const drift = Math.random() < 0.55 ? 1 : -1;
        const next = v + drift;
        const min = hourBase(new Date().getHours());
        return Math.min(min + 14, Math.max(min, next));
      });
    };
    const id = window.setInterval(tick, 3800);
    return () => window.clearInterval(id);
  }, []);

  return n;
}

export function useEnrolledCount(base: number, bookings: number): number {
  const [jitter, setJitter] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setJitter(Math.floor(Math.random() * 3) - 1);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);
  return Math.max(0, base + bookings + jitter);
}

export function useVisitTimer(): string {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const existing = sessionStorage.getItem(START_KEY);
    const start = existing ? Number(existing) : Date.now();
    if (!existing) sessionStorage.setItem(START_KEY, String(start));
    const tick = () => setSeconds(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return formatClock(seconds);
}

export function LiveStat({
  label,
  value,
  pulse,
}: {
  label: string;
  value: string | number;
  pulse?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      {pulse ? (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-online opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-online" />
        </span>
      ) : null}
      <div className="min-w-0">
        <div className="font-display text-sm tabular-nums tracking-tight text-fg">{value}</div>
        <div className="truncate text-[10px] uppercase tracking-[0.16em] text-muted">{label}</div>
      </div>
    </div>
  );
}
