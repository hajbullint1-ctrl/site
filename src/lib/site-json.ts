import type { SiteContent, SitePayload } from "@/lib/site-types";

export function contentFromPayload(payload: SitePayload): SiteContent {
  return {
    texts: payload.texts,
    services: payload.services,
    contacts: payload.contacts,
    media: payload.media,
    instructors: payload.instructors,
    reviews: payload.reviews,
  };
}

export function toPrettyJson(content: SiteContent): string {
  return `${JSON.stringify(
    {
      version: 1,
      updatedAt: new Date().toISOString(),
      texts: content.texts,
      services: content.services,
      contacts: content.contacts,
      media: content.media,
      instructors: content.instructors,
      reviews: content.reviews,
    },
    null,
    2,
  )}\n`;
}
