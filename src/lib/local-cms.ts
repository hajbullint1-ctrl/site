import {
  CONTACTS,
  INSTRUCTORS,
  REVIEWS,
  SERVICES,
  TEXTS,
} from "@/lib/seed-data";
import type {
  ContactInfo,
  Instructor,
  Review,
  Service,
  SitePayload,
} from "@/lib/site-types";

export const CMS_PASSWORD = "student2026";
export const CMS_DATA_KEY = "auto-emir-site-data";
export const CMS_SESSION_KEY = "auto-emir-admin-session";

const CMS_SESSION_VALUE = "student-access";

export type SiteData = Pick<
  SitePayload,
  "texts" | "services" | "contacts" | "instructors" | "reviews"
>;

export function defaultSiteData(): SiteData {
  const texts: SitePayload["texts"] = {};

  for (const item of TEXTS) {
    texts[item.key] = {
      ru: item.ru,
      kz: item.kz,
    };
  }

  return {
    texts,
    services: SERVICES.map((service, index) => ({
      ...service,
      id: index + 1,
    })),
    contacts: { ...CONTACTS },
    instructors: INSTRUCTORS.map((person, index) => ({
      ...person,
      id: index + 1,
    })),
    reviews: REVIEWS.map((review, index) => ({
      ...review,
      id: index + 1,
    })),
  };
}

export function loadSiteData(): SiteData {
  if (!hasLocalStorage()) return defaultSiteData();

  try {
    const raw = window.localStorage.getItem(CMS_DATA_KEY);
    if (!raw) return defaultSiteData();
    return normalizeSiteData(JSON.parse(raw));
  } catch {
    return defaultSiteData();
  }
}

export function loadSitePayload(): SitePayload {
  return {
    ...loadSiteData(),
    bookingCount: 0,
  };
}

export function saveSiteData(data: SiteData): void {
  if (!hasLocalStorage()) {
    throw new Error("localStorage недоступен");
  }

  window.localStorage.setItem(
    CMS_DATA_KEY,
    JSON.stringify(normalizeSiteData(data)),
  );
}

export function resetSiteData(): SiteData {
  const data = defaultSiteData();

  if (hasLocalStorage()) {
    window.localStorage.removeItem(CMS_DATA_KEY);
  }

  return data;
}

export function exportSiteData(): string {
  return JSON.stringify(loadSiteData(), null, 2);
}

export function importSiteData(json: string): SiteData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Некорректный JSON");
  }

  const data = normalizeSiteData(parsed);
  saveSiteData(data);
  return data;
}

export function loginAdmin(password: string): boolean {
  if (password !== CMS_PASSWORD) return false;

  if (hasSessionStorage()) {
    window.sessionStorage.setItem(CMS_SESSION_KEY, CMS_SESSION_VALUE);
  }

  return true;
}

export function logoutAdmin(): void {
  if (hasSessionStorage()) {
    window.sessionStorage.removeItem(CMS_SESSION_KEY);
  }
}

export function isAdminSessionActive(): boolean {
  if (!hasSessionStorage()) return false;

  try {
    return window.sessionStorage.getItem(CMS_SESSION_KEY) === CMS_SESSION_VALUE;
  } catch {
    return false;
  }
}

function normalizeSiteData(value: unknown): SiteData {
  const fallback = defaultSiteData();

  if (!isRecord(value)) return fallback;

  const input = value as Partial<SiteData>;

  return {
    texts: isRecord(input.texts)
      ? {
          ...fallback.texts,
          ...(input.texts as SitePayload["texts"]),
        }
      : fallback.texts,

    services: Array.isArray(input.services)
      ? (input.services as Service[])
      : fallback.services,

    contacts: isRecord(input.contacts)
      ? {
          ...fallback.contacts,
          ...(input.contacts as Partial<ContactInfo>),
        }
      : fallback.contacts,

    instructors: Array.isArray(input.instructors)
      ? (input.instructors as Instructor[])
      : fallback.instructors,

    reviews: Array.isArray(input.reviews)
      ? (input.reviews as Review[])
      : fallback.reviews,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasLocalStorage(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const key = "__auto_emir_local_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function hasSessionStorage(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const key = "__auto_emir_session_test__";
    window.sessionStorage.setItem(key, "1");
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
