import { createHash, randomBytes } from "node:crypto";
import { getSql, type Sql } from "@/lib/db";
import type {
  Booking,
  ContactInfo,
  Instructor,
  Review,
  Service,
  SitePayload,
} from "@/lib/site-types";
import { TEXTS, SERVICES, INSTRUCTORS, REVIEWS, CONTACTS } from "@/lib/seed-data";

const ADMIN_HASH =
  "a3bff63d72c4c15ea3b386b58ae2a42fdf31915dbb9e0fcecabca62e7b9d774c";

function hashPassword(password: string): string {
  return createHash("sha256").update(`auto-emir::${password}`).digest("hex");
}

let seedLock: Promise<void> | null = null;

async function ensureSeeded(sql: Sql): Promise<void> {
  if (!seedLock) {
    seedLock = (async () => {
      const rows = await sql<{ n: number }>`select count(*)::int as n from site_texts`;
      if ((rows[0]?.n ?? 0) > 0) return;

      for (const item of TEXTS) {
        await sql`insert into site_texts (key, ru, kz) values (${item.key}, ${item.ru}, ${item.kz}) on conflict (key) do nothing`;
      }
      for (const s of SERVICES) {
        await sql`insert into services (code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order)
          values (${s.code}, ${s.titleRu}, ${s.titleKz}, ${s.descRu}, ${s.descKz}, ${s.price}, ${s.durationRu}, ${s.durationKz}, ${s.hours}, ${s.featured}, ${s.sortOrder})
          on conflict (code) do nothing`;
      }
      await sql`insert into contacts (id, phone, whatsapp, telegram, address_ru, address_kz, hours_ru, hours_kz, instagram, lat, lng, enrolled_base)
        values (1, ${CONTACTS.phone}, ${CONTACTS.whatsapp}, ${CONTACTS.telegram}, ${CONTACTS.addressRu}, ${CONTACTS.addressKz}, ${CONTACTS.hoursRu}, ${CONTACTS.hoursKz}, ${CONTACTS.instagram}, ${CONTACTS.lat}, ${CONTACTS.lng}, ${CONTACTS.enrolledBase})
        on conflict (id) do nothing`;
      for (const i of INSTRUCTORS) {
        await sql`insert into instructors (initials, name_ru, name_kz, role_ru, role_kz, sort_order)
          values (${i.initials}, ${i.nameRu}, ${i.nameKz}, ${i.roleRu}, ${i.roleKz}, ${i.sortOrder})`;
      }
      for (const r of REVIEWS) {
        await sql`insert into reviews (name_ru, name_kz, body_ru, body_kz, rating, sort_order)
          values (${r.nameRu}, ${r.nameKz}, ${r.bodyRu}, ${r.bodyKz}, ${r.rating}, ${r.sortOrder})`;
      }
      await sql`insert into admin_auth (id, password_hash) values (1, ${ADMIN_HASH}) on conflict (id) do nothing`;
    })().finally(() => {
      seedLock = null;
    });
  }
  await seedLock;
}

function mapService(row: {
  id: number;
  code: string;
  title_ru: string;
  title_kz: string;
  desc_ru: string;
  desc_kz: string;
  price: number;
  duration_ru: string;
  duration_kz: string;
  hours: number | null;
  featured: boolean;
  sort_order: number;
}): Service {
  return {
    id: row.id,
    code: row.code,
    titleRu: row.title_ru,
    titleKz: row.title_kz,
    descRu: row.desc_ru,
    descKz: row.desc_kz,
    price: Number(row.price),
    durationRu: row.duration_ru,
    durationKz: row.duration_kz,
    hours: row.hours == null ? null : Number(row.hours),
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order),
  };
}

export async function loadSite(): Promise<SitePayload> {
  const sql = await getSql();
  await ensureSeeded(sql);

  const textRows = await sql<{ key: string; ru: string; kz: string }>`
    select key, ru, kz from site_texts`;
  const texts: SitePayload["texts"] = {};
  for (const row of textRows) texts[row.key] = { ru: row.ru, kz: row.kz };

  const serviceRows = await sql<{
    id: number;
    code: string;
    title_ru: string;
    title_kz: string;
    desc_ru: string;
    desc_kz: string;
    price: number;
    duration_ru: string;
    duration_kz: string;
    hours: number | null;
    featured: boolean;
    sort_order: number;
  }>`select id, code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order from services order by sort_order, id`;

  const contactRows = await sql<{
    phone: string;
    whatsapp: string;
    telegram: string;
    address_ru: string;
    address_kz: string;
    hours_ru: string;
    hours_kz: string;
    instagram: string;
    lat: string;
    lng: string;
    enrolled_base: number;
  }>`select phone, whatsapp, telegram, address_ru, address_kz, hours_ru, hours_kz, instagram, lat, lng, enrolled_base from contacts where id = 1`;

  const instructorRows = await sql<{
    id: number;
    initials: string;
    name_ru: string;
    name_kz: string;
    role_ru: string;
    role_kz: string;
    sort_order: number;
  }>`select id, initials, name_ru, name_kz, role_ru, role_kz, sort_order from instructors order by sort_order, id`;

  const reviewRows = await sql<{
    id: number;
    name_ru: string;
    name_kz: string;
    body_ru: string;
    body_kz: string;
    rating: number;
    sort_order: number;
  }>`select id, name_ru, name_kz, body_ru, body_kz, rating, sort_order from reviews order by sort_order, id`;

  const countRows = await sql<{ n: number }>`select count(*)::int as n from bookings`;

  const c = contactRows[0];
  const contacts: ContactInfo = c
    ? {
        phone: c.phone,
        whatsapp: c.whatsapp,
        telegram: c.telegram,
        addressRu: c.address_ru,
        addressKz: c.address_kz,
        hoursRu: c.hours_ru,
        hoursKz: c.hours_kz,
        instagram: c.instagram,
        lat: c.lat,
        lng: c.lng,
        enrolledBase: Number(c.enrolled_base),
      }
    : CONTACTS;

  return {
    texts,
    services: serviceRows.map(mapService),
    contacts,
    instructors: instructorRows.map((i) => ({
      id: i.id,
      initials: i.initials,
      nameRu: i.name_ru,
      nameKz: i.name_kz,
      roleRu: i.role_ru,
      roleKz: i.role_kz,
      sortOrder: Number(i.sort_order),
    })),
    reviews: reviewRows.map((r) => ({
      id: r.id,
      nameRu: r.name_ru,
      nameKz: r.name_kz,
      bodyRu: r.body_ru,
      bodyKz: r.body_kz,
      rating: Number(r.rating),
      sortOrder: Number(r.sort_order),
    })),
    bookingCount: Number(countRows[0]?.n ?? 0),
  };
}

export async function createBooking(input: {
  name: string;
  phone: string;
  category: string;
  preferredDate: string;
  comment: string;
}): Promise<{ id: number }> {
  const sql = await getSql();
  await ensureSeeded(sql);
  const rows = await sql<{ id: number }>`
    insert into bookings (name, phone, category, preferred_date, comment)
    values (${input.name}, ${input.phone}, ${input.category}, ${input.preferredDate}, ${input.comment})
    returning id`;
  const id = rows[0]?.id;
  if (!id) throw new Error("booking_failed");
  return { id };
}

async function requireAdmin(token: string): Promise<Sql> {
  const sql = await getSql();
  await ensureSeeded(sql);
  const rows = await sql<{ token: string | null; token_expires: string | null }>`
    select token, token_expires from admin_auth where id = 1`;
  const row = rows[0];
  if (!row?.token || row.token !== token) throw new Error("unauthorized");
  if (row.token_expires && new Date(row.token_expires).getTime() < Date.now()) {
    throw new Error("unauthorized");
  }
  return sql;
}

export async function adminLogin(password: string): Promise<{ token: string }> {
  const sql = await getSql();
  await ensureSeeded(sql);
  const rows = await sql<{ password_hash: string }>`select password_hash from admin_auth where id = 1`;
  const hash = rows[0]?.password_hash ?? ADMIN_HASH;
  if (hashPassword(password) !== hash) throw new Error("invalid_password");
  const token = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString();
  await sql`update admin_auth set token = ${token}, token_expires = ${expires}::timestamptz where id = 1`;
  return { token };
}

export async function adminLogout(token: string): Promise<void> {
  try {
    const sql = await requireAdmin(token);
    await sql`update admin_auth set token = null, token_expires = null where id = 1`;
  } catch {
    // already logged out
  }
}

export async function saveTexts(
  token: string,
  items: { key: string; ru: string; kz: string }[],
): Promise<void> {
  const sql = await requireAdmin(token);
  for (const item of items) {
    await sql`insert into site_texts (key, ru, kz) values (${item.key}, ${item.ru}, ${item.kz})
      on conflict (key) do update set ru = excluded.ru, kz = excluded.kz`;
  }
}

export async function saveContacts(token: string, data: ContactInfo): Promise<void> {
  const sql = await requireAdmin(token);
  await sql`update contacts set
    phone = ${data.phone},
    whatsapp = ${data.whatsapp},
    telegram = ${data.telegram},
    address_ru = ${data.addressRu},
    address_kz = ${data.addressKz},
    hours_ru = ${data.hoursRu},
    hours_kz = ${data.hoursKz},
    instagram = ${data.instagram},
    lat = ${data.lat},
    lng = ${data.lng},
    enrolled_base = ${data.enrolledBase}
    where id = 1`;
}

export async function saveService(
  token: string,
  data: Omit<Service, "id"> & { id?: number },
): Promise<Service> {
  const sql = await requireAdmin(token);
  if (data.id) {
    const rows = await sql<{
      id: number;
      code: string;
      title_ru: string;
      title_kz: string;
      desc_ru: string;
      desc_kz: string;
      price: number;
      duration_ru: string;
      duration_kz: string;
      hours: number | null;
      featured: boolean;
      sort_order: number;
    }>`update services set
        code = ${data.code},
        title_ru = ${data.titleRu},
        title_kz = ${data.titleKz},
        desc_ru = ${data.descRu},
        desc_kz = ${data.descKz},
        price = ${data.price},
        duration_ru = ${data.durationRu},
        duration_kz = ${data.durationKz},
        hours = ${data.hours},
        featured = ${data.featured},
        sort_order = ${data.sortOrder}
      where id = ${data.id}
      returning id, code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order`;
    const row = rows[0];
    if (!row) throw new Error("not_found");
    return mapService(row);
  }
  const rows = await sql<{
    id: number;
    code: string;
    title_ru: string;
    title_kz: string;
    desc_ru: string;
    desc_kz: string;
    price: number;
    duration_ru: string;
    duration_kz: string;
    hours: number | null;
    featured: boolean;
    sort_order: number;
  }>`insert into services (code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order)
    values (${data.code}, ${data.titleRu}, ${data.titleKz}, ${data.descRu}, ${data.descKz}, ${data.price}, ${data.durationRu}, ${data.durationKz}, ${data.hours}, ${data.featured}, ${data.sortOrder})
    returning id, code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order`;
  const row = rows[0];
  if (!row) throw new Error("insert_failed");
  return mapService(row);
}

export async function removeService(token: string, id: number): Promise<void> {
  const sql = await requireAdmin(token);
  await sql`delete from services where id = ${id}`;
}

export async function listBookings(token: string): Promise<Booking[]> {
  const sql = await requireAdmin(token);
  const rows = await sql<{
    id: number;
    name: string;
    phone: string;
    category: string;
    preferred_date: string;
    comment: string;
    created_at: string;
  }>`select id, name, phone, category, preferred_date, comment, created_at from bookings order by created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    category: r.category,
    preferredDate: r.preferred_date,
    comment: r.comment,
    createdAt: String(r.created_at),
  }));
}

export async function removeBooking(token: string, id: number): Promise<void> {
  const sql = await requireAdmin(token);
  await sql`delete from bookings where id = ${id}`;
}

export async function saveInstructors(token: string, items: Instructor[]): Promise<void> {
  const sql = await requireAdmin(token);
  for (const i of items) {
    await sql`update instructors set
      initials = ${i.initials},
      name_ru = ${i.nameRu},
      name_kz = ${i.nameKz},
      role_ru = ${i.roleRu},
      role_kz = ${i.roleKz},
      sort_order = ${i.sortOrder}
      where id = ${i.id}`;
  }
}

export async function saveReviews(token: string, items: Review[]): Promise<void> {
  const sql = await requireAdmin(token);
  for (const r of items) {
    await sql`update reviews set
      name_ru = ${r.nameRu},
      name_kz = ${r.nameKz},
      body_ru = ${r.bodyRu},
      body_kz = ${r.bodyKz},
      rating = ${r.rating},
      sort_order = ${r.sortOrder}
      where id = ${r.id}`;
  }
}

export type { Instructor, Review };
