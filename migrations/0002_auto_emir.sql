create table if not exists site_texts (
  key text primary key,
  ru text not null default '',
  kz text not null default ''
);

create table if not exists services (
  id serial primary key,
  code text not null unique,
  title_ru text not null,
  title_kz text not null,
  desc_ru text not null default '',
  desc_kz text not null default '',
  price integer not null,
  duration_ru text not null default '',
  duration_kz text not null default '',
  hours integer,
  featured boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists contacts (
  id integer primary key default 1,
  phone text not null default '',
  whatsapp text not null default '',
  telegram text not null default '',
  address_ru text not null default '',
  address_kz text not null default '',
  hours_ru text not null default '',
  hours_kz text not null default '',
  instagram text not null default '',
  lat text not null default '43.301926',
  lng text not null default '68.25492',
  enrolled_base integer not null default 186
);

create table if not exists bookings (
  id serial primary key,
  name text not null,
  phone text not null,
  category text not null,
  preferred_date text not null default '',
  comment text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists instructors (
  id serial primary key,
  initials text not null,
  name_ru text not null,
  name_kz text not null,
  role_ru text not null,
  role_kz text not null,
  sort_order integer not null default 0
);

create table if not exists reviews (
  id serial primary key,
  name_ru text not null,
  name_kz text not null,
  body_ru text not null,
  body_kz text not null,
  rating integer not null default 5,
  sort_order integer not null default 0
);

create table if not exists admin_auth (
  id integer primary key default 1,
  password_hash text not null,
  token text,
  token_expires timestamptz
);
-- Наполнение таблицы услуг (категорий и цен)
INSERT INTO services (code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order)
VALUES
  ('A', 'Категория A (Мотоциклы)', 'A категориясы', 'Полный курс подготовки водителей мотоциклов', 'Толық мотоцикл жүргізу курсы', 30000, '1.5 месяца', '1.5 ай', 20, false, 1),
  ('B', 'Категория B (Легковые авто)', 'B категориясы', 'Полный теоретический и практический курс', 'Толық теориялық және практикалық курс', 45000, '2.5 месяца', '2.5 ай', 40, true, 2),
  ('BC1', 'Категория BC1 (Грузовые)', 'BC1 категориясы', 'Подготовка водителей грузовых автомобилей', 'Жүк көліктерін жүргізушілерді даярлау', 65000, '3 месяца', '3 ай', 50, false, 3)
ON CONFLICT (code) DO UPDATE SET price = EXCLUDED.price;

-- Базовые контакты (чтобы не было ошибок на сайте)
INSERT INTO contacts (id, phone, whatsapp, address_ru, address_kz)
VALUES (1, '+7 (700) 000-00-00', '+7 (700) 000-00-00', 'г. Кентау', 'Кентау қ.')
ON CONFLICT (id) DO NOTHING;
