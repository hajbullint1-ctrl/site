import type { Lang, SitePayload } from "@/lib/site-types";

export const LANG_KEY = "ae-lang";

export function t(
  texts: SitePayload["texts"],
  key: string,
  lang: Lang,
  fallback = "",
): string {
  const row = texts[key];
  if (!row) return fallback;
  const value = lang === "kz" ? row.kz : row.ru;
  return value || row.ru || row.kz || fallback;
}

export function field<T extends Record<string, unknown>>(
  row: T,
  lang: Lang,
  ruKey: keyof T,
  kzKey: keyof T,
): string {
  const primary = lang === "kz" ? row[kzKey] : row[ruKey];
  const secondary = lang === "kz" ? row[ruKey] : row[kzKey];
  return String(primary || secondary || "");
}
