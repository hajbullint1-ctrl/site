import { useEffect, useState } from "react";
import appData from "@/lib/app-data/app-data.json";
import type { SiteContent, SitePayload } from "@/lib/site-types";

export { contentFromPayload, toPrettyJson } from "@/lib/site-json";

export const SITE_CONTENT_KEY = "ae-site-content";
export const SITE_CONTENT_EVENT = "ae-site-content-change";

function asContent(raw: typeof appData): SiteContent {
  return {
    texts: raw.texts,
    services: [...raw.services].sort((a, b) => a.sortOrder - b.sortOrder),
    contacts: raw.contacts,
    instructors: [...raw.instructors].sort((a, b) => a.sortOrder - b.sortOrder),
    reviews: [...raw.reviews].sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

/** Canonical copy from src/lib/app-data/app-data.json */
export const siteContent: SiteContent = asContent(appData);

export function readLocalContent(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    if (!parsed.texts || !parsed.services || !parsed.contacts) return null;
    return {
      texts: parsed.texts,
      services: parsed.services ?? siteContent.services,
      contacts: parsed.contacts ?? siteContent.contacts,
      instructors: parsed.instructors ?? siteContent.instructors,
      reviews: parsed.reviews ?? siteContent.reviews,
    };
  } catch {
    return null;
  }
}

export function saveLocalContent(content: SiteContent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(SITE_CONTENT_EVENT));
}

export function payloadFromContent(
  content: SiteContent,
  bookingCount: number,
): SitePayload {
  return { ...content, bookingCount };
}

/** JSON file + unpublished admin edits from this browser. */
export function useSiteContent(server?: SitePayload | null): SitePayload {
  const fallback = server ?? payloadFromContent(siteContent, 0);
  const [overlay, setOverlay] = useState<SiteContent | null>(null);

  useEffect(() => {
    const sync = () => setOverlay(readLocalContent());
    sync();
    window.addEventListener(SITE_CONTENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SITE_CONTENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!overlay) {
    return {
      ...siteContent,
      ...fallback,
      texts: fallback.texts ?? siteContent.texts,
      services: fallback.services?.length ? fallback.services : siteContent.services,
      contacts: fallback.contacts ?? siteContent.contacts,
      instructors: fallback.instructors?.length ? fallback.instructors : siteContent.instructors,
      reviews: fallback.reviews?.length ? fallback.reviews : siteContent.reviews,
      bookingCount: fallback.bookingCount,
    };
  }

  return payloadFromContent(overlay, fallback.bookingCount);
}
