import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ContactInfo, Instructor, Review, SitePayload } from "@/lib/site-types";

export const getSitePayload = createServerFn({ method: "GET" }).handler(
  async (): Promise<SitePayload> => {
    const { loadSite } = await import("./site.server.ts");
    return loadSite();
  },
);

export const submitBooking = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().trim().min(2).max(80),
      phone: z.string().trim().min(10).max(24),
      category: z.string().trim().min(1).max(8),
      preferredDate: z.string().trim().max(32).optional(),
      comment: z.string().trim().max(500).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { createBooking } = await import("./site.server.ts");
    return createBooking({
      name: data.name,
      phone: data.phone,
      category: data.category,
      preferredDate: data.preferredDate ?? "",
      comment: data.comment ?? "",
    });
  });

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1).max(80) }))
  .handler(async ({ data }) => {
    const { adminLogin } = await import("./site.server.ts");
    return adminLogin(data.password);
  });

export const adminLogoutFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { adminLogout } = await import("./site.server.ts");
    await adminLogout(data.token);
    return { ok: true };
  });

export const saveTextsFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(8),
      items: z.array(
        z.object({
          key: z.string().min(1).max(80),
          ru: z.string().max(4000),
          kz: z.string().max(4000),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    const { saveTexts } = await import("./site.server.ts");
    await saveTexts(data.token, data.items);
    return { ok: true };
  });

export const saveContactsFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(8),
      contacts: z.object({
        phone: z.string().max(40),
        whatsapp: z.string().max(40),
        telegram: z.string().max(80),
        addressRu: z.string().max(240),
        addressKz: z.string().max(240),
        hoursRu: z.string().max(80),
        hoursKz: z.string().max(80),
        instagram: z.string().max(80),
        lat: z.string().max(24),
        lng: z.string().max(24),
        enrolledBase: z.number().int().min(0).max(100000),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const { saveContacts } = await import("./site.server.ts");
    await saveContacts(data.token, data.contacts as ContactInfo);
    return { ok: true };
  });

export const saveServiceFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(8),
      service: z.object({
        id: z.number().int().optional(),
        code: z.string().min(1).max(8),
        titleRu: z.string().min(1).max(80),
        titleKz: z.string().min(1).max(80),
        descRu: z.string().max(400),
        descKz: z.string().max(400),
        price: z.number().int().min(0).max(10000000),
        durationRu: z.string().max(40),
        durationKz: z.string().max(40),
        hours: z.number().int().min(0).max(200).nullable(),
        featured: z.boolean(),
        sortOrder: z.number().int(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const { saveService } = await import("./site.server.ts");
    return saveService(data.token, data.service);
  });

export const removeServiceFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(8), id: z.number().int() }))
  .handler(async ({ data }) => {
    const { removeService } = await import("./site.server.ts");
    await removeService(data.token, data.id);
    return { ok: true };
  });

export const listBookingsFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(8) }))
  .handler(async ({ data }) => {
    const { listBookings } = await import("./site.server.ts");
    return listBookings(data.token);
  });

export const removeBookingFn = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(8), id: z.number().int() }))
  .handler(async ({ data }) => {
    const { removeBooking } = await import("./site.server.ts");
    await removeBooking(data.token, data.id);
    return { ok: true };
  });

export const saveInstructorsFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(8),
      items: z.array(
        z.object({
          id: z.number().int(),
          initials: z.string().max(4),
          nameRu: z.string().max(80),
          nameKz: z.string().max(80),
          roleRu: z.string().max(120),
          roleKz: z.string().max(120),
          sortOrder: z.number().int(),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    const { saveInstructors } = await import("./site.server.ts");
    await saveInstructors(data.token, data.items as Instructor[]);
    return { ok: true };
  });

export const saveReviewsFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().min(8),
      items: z.array(
        z.object({
          id: z.number().int(),
          nameRu: z.string().max(80),
          nameKz: z.string().max(80),
          bodyRu: z.string().max(800),
          bodyKz: z.string().max(800),
          rating: z.number().int().min(1).max(5),
          sortOrder: z.number().int(),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    const { saveReviews } = await import("./site.server.ts");
    await saveReviews(data.token, data.items as Review[]);
    return { ok: true };
  });
