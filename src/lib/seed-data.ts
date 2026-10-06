import appData from "@/lib/app-data/app-data.json";
import type { ContactInfo } from "@/lib/site-types";

export const CONTACTS: ContactInfo = appData.contacts;

export const TEXTS = Object.entries(appData.texts).map(([key, value]) => ({
  key,
  ru: value.ru,
  kz: value.kz,
}));

export const SERVICES = appData.services.map((item) => ({
  code: item.code,
  titleRu: item.titleRu,
  titleKz: item.titleKz,
  descRu: item.descRu,
  descKz: item.descKz,
  price: item.price,
  durationRu: item.durationRu,
  durationKz: item.durationKz,
  hours: item.hours,
  featured: item.featured,
  sortOrder: item.sortOrder,
}));

export const INSTRUCTORS = appData.instructors.map((item) => ({
  initials: item.initials,
  nameRu: item.nameRu,
  nameKz: item.nameKz,
  roleRu: item.roleRu,
  roleKz: item.roleKz,
  sortOrder: item.sortOrder,
}));

export const REVIEWS = appData.reviews.map((item) => ({
  nameRu: item.nameRu,
  nameKz: item.nameKz,
  bodyRu: item.bodyRu,
  bodyKz: item.bodyKz,
  rating: item.rating,
  sortOrder: item.sortOrder,
}));
