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
-- Таблица авторизации админа
CREATE TABLE IF NOT EXISTS admin_auth (
  id INT PRIMARY KEY DEFAULT 1,
  password_hash TEXT NOT NULL
);

DELETE FROM admin_auth WHERE id = 1;
INSERT INTO admin_auth (id, password_hash) VALUES (1, 'student2026');

-- Таблица категорий и цен
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, price, description)
VALUES 
  ('Категория B', '45 000-50 000 ₸', 'Полный курс обучения вождению'),
  ('Категория C', '55 000-60 000 ₸', 'Грузовые автомобили')
ON CONFLICT DO NOTHING;
