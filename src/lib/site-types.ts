export type Lang = "ru" | "kz";

export type SiteText = { key: string; ru: string; kz: string };

export type Service = {
  id: number;
  code: string;
  titleRu: string;
  titleKz: string;
  descRu: string;
  descKz: string;
  price: number;
  durationRu: string;
  durationKz: string;
  hours: number | null;
  featured: boolean;
  sortOrder: number;
};

export type ContactInfo = {
  phone: string;
  whatsapp: string;
  telegram: string;
  addressRu: string;
  addressKz: string;
  hoursRu: string;
  hoursKz: string;
  instagram: string;
  lat: string;
  lng: string;
  enrolledBase: number;
};

export type Instructor = {
  id: number;
  initials: string;
  nameRu: string;
  nameKz: string;
  roleRu: string;
  roleKz: string;
  sortOrder: number;
};

export type Review = {
  id: number;
  nameRu: string;
  nameKz: string;
  bodyRu: string;
  bodyKz: string;
  rating: number;
  sortOrder: number;
};

export type Booking = {
  id: number;
  name: string;
  phone: string;
  category: string;
  preferredDate: string;
  comment: string;
  createdAt: string;
};

/** Published site copy: texts, prices, contacts. Lives in app-data.json. */
export type SiteContent = {
  texts: Record<string, { ru: string; kz: string }>;
  services: Service[];
  contacts: ContactInfo;
  instructors: Instructor[];
  reviews: Review[];
};

export type SitePayload = SiteContent & {
  bookingCount: number;
};
