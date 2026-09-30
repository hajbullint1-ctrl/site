import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTenge(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₸`;
}

export function digitsPhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function waLink(phone: string, text: string): string {
  const n = digitsPhone(phone).replace(/^8/, "7");
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string): string {
  const n = digitsPhone(phone);
  return `tel:+${n.replace(/^8/, "7")}`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (hh > 0) return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  return `${pad(mm)}:${pad(ss)}`;
}
