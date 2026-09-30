import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/site.server-DYS-IUCi.js
var _0002_auto_emir_default = "create table if not exists site_texts (\n  key text primary key,\n  ru text not null default '',\n  kz text not null default ''\n);\n\ncreate table if not exists services (\n  id serial primary key,\n  code text not null unique,\n  title_ru text not null,\n  title_kz text not null,\n  desc_ru text not null default '',\n  desc_kz text not null default '',\n  price integer not null,\n  duration_ru text not null default '',\n  duration_kz text not null default '',\n  hours integer,\n  featured boolean not null default false,\n  sort_order integer not null default 0\n);\n\ncreate table if not exists contacts (\n  id integer primary key default 1,\n  phone text not null default '',\n  whatsapp text not null default '',\n  telegram text not null default '',\n  address_ru text not null default '',\n  address_kz text not null default '',\n  hours_ru text not null default '',\n  hours_kz text not null default '',\n  instagram text not null default '',\n  lat text not null default '43.301926',\n  lng text not null default '68.25492',\n  enrolled_base integer not null default 186\n);\n\ncreate table if not exists bookings (\n  id serial primary key,\n  name text not null,\n  phone text not null,\n  category text not null,\n  preferred_date text not null default '',\n  comment text not null default '',\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists instructors (\n  id serial primary key,\n  initials text not null,\n  name_ru text not null,\n  name_kz text not null,\n  role_ru text not null,\n  role_kz text not null,\n  sort_order integer not null default 0\n);\n\ncreate table if not exists reviews (\n  id serial primary key,\n  name_ru text not null,\n  name_kz text not null,\n  body_ru text not null,\n  body_kz text not null,\n  rating integer not null default 5,\n  sort_order integer not null default 0\n);\n\ncreate table if not exists admin_auth (\n  id integer primary key default 1,\n  password_hash text not null,\n  token text,\n  token_expires timestamptz\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_auto_emir.sql": _0002_auto_emir_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var CONTACTS = {
	phone: "+7 708 342 51 71",
	whatsapp: "+7 708 342 51 71",
	telegram: "",
	addressRu: "Туркестан, проспект Тауке хана, 287, 1 этаж",
	addressKz: "Түркістан, Тәуке хан даңғылы, 287, 1 қабат",
	hoursRu: "Пн–Сб 09:00–17:30",
	hoursKz: "Дс–Сб 09:00–17:30",
	instagram: "",
	lat: "43.301926",
	lng: "68.25492",
	enrolledBase: 186
};
var TEXTS = [
	{
		key: "meta.title",
		ru: "Авто-Эмир — автошкола в Туркестане",
		kz: "Авто-Эмир — Түркістандағы автомектеп"
	},
	{
		key: "meta.description",
		ru: "Автошкола «Авто-Эмир» в Туркестане: категории A, B, C, свой автодром, обучение на русском и казахском.",
		kz: "«Авто-Эмир» автомектебі, Түркістан: A, B, C санаттары, өз автодромы, қазақ және орыс тілдерінде оқыту."
	},
	{
		key: "nav.services",
		ru: "Цены",
		kz: "Бағалар"
	},
	{
		key: "nav.about",
		ru: "О школе",
		kz: "Мектеп жайлы"
	},
	{
		key: "nav.booking",
		ru: "Запись",
		kz: "Жазылу"
	},
	{
		key: "nav.contacts",
		ru: "Контакты",
		kz: "Байланыс"
	},
	{
		key: "ticker.online",
		ru: "на сайте",
		kz: "сайтта"
	},
	{
		key: "ticker.authorized",
		ru: "учеников",
		kz: "оқушы"
	},
	{
		key: "ticker.time",
		ru: "ваше время",
		kz: "сіздің уақытыңыз"
	},
	{
		key: "hero.kicker",
		ru: "Автошкола в Туркестане",
		kz: "Түркістандағы автомектеп"
	},
	{
		key: "hero.title",
		ru: "Водить — уверенно. С первого дня.",
		kz: "Жүргізуді сенімді үйрен. Алғашқы күннен."
	},
	{
		key: "hero.lead",
		ru: "Категории A, B и C, свой автодром, занятия на русском и казахском. Спокойно объясняем, терпеливо водим, готовим к СпецЦОНу.",
		kz: "A, B және C санаттары, өз автодромымыз, қазақ және орыс тілдерінде сабақ. Сабырмен түсіндіреміз, емтиханға дайындаймыз."
	},
	{
		key: "hero.cta",
		ru: "Записаться на вождение",
		kz: "Жүргізуге жазылу"
	},
	{
		key: "hero.call",
		ru: "Позвонить",
		kz: "Қоңырау шалу"
	},
	{
		key: "trust.rating",
		ru: "оценка на 2ГИС",
		kz: "2ГИС бағасы"
	},
	{
		key: "trust.languages",
		ru: "русский и қазақ тілі",
		kz: "қазақ және орыс тілі"
	},
	{
		key: "trust.autodrome",
		ru: "свой автодром",
		kz: "өз автодромы"
	},
	{
		key: "trust.categories",
		ru: "категории A · B · C",
		kz: "A · B · C санаттары"
	},
	{
		key: "services.kicker",
		ru: "Программы",
		kz: "Бағдарламалар"
	},
	{
		key: "services.title",
		ru: "Категории и цены",
		kz: "Санаттар мен бағалар"
	},
	{
		key: "services.lead",
		ru: "Теория, автодром и город. Стоимость и сроки можно уточнить при записи — ниже актуальные пакеты.",
		kz: "Теория, автодром және қала. Баға мен мерзімді жазылу кезінде нақтылаймыз."
	},
	{
		key: "services.duration",
		ru: "срок",
		kz: "мерзімі"
	},
	{
		key: "services.hours",
		ru: "часов практики",
		kz: "сағат практика"
	},
	{
		key: "services.book",
		ru: "Выбрать",
		kz: "Таңдау"
	},
	{
		key: "about.kicker",
		ru: "Почему мы",
		kz: "Неге біз"
	},
	{
		key: "about.title",
		ru: "Школа, в которой не торопят и не кричат.",
		kz: "Асықтырмайтын, дауыс көтермейтін мектеп."
	},
	{
		key: "about.body",
		ru: "«Авто-Эмир» работает в Туркестане: офис на проспекте Тауке хана и собственный автодром. Учим с нуля — от ПДД до уверенного города. Преподаватели говорят на двух языках, поэтому можно учиться так, как вам комфортно.",
		kz: "«Авто-Эмир» Түркістанда жұмыс істейді: офис Тәуке хан даңғылында, өз автодромы бар. Нөлден үйретеміз — ЖҚЕ-ден бастап қалаға дейін. Оқытушылар екі тілде сөйлейді."
	},
	{
		key: "about.p1.title",
		ru: "Свой автодром",
		kz: "Өз автодромы"
	},
	{
		key: "about.p1.body",
		ru: "Эстокада, змейка, парковка — отрабатываем площадку до автоматизма, без очереди «на чужом дворе».",
		kz: "Эстакада, жылан, тұрақ — алаңды өз жерімізде, кезексіз пысықтаймыз."
	},
	{
		key: "about.p2.title",
		ru: "Два языка",
		kz: "Екі тіл"
	},
	{
		key: "about.p2.body",
		ru: "Теория и практика на русском и казахском. Можно переключаться — главное, чтобы было понятно.",
		kz: "Теория мен практика қазақ және орыс тілінде. Түсінікті болса болды."
	},
	{
		key: "about.p3.title",
		ru: "До СпецЦОНа",
		kz: "АрнайыХҚКО-ға дейін"
	},
	{
		key: "about.p3.body",
		ru: "Готовим к внутреннему зачёту и экзамену. Подсказываем по документам и записи в СпецЦОН.",
		kz: "Ішкі сынақ пен емтиханға дайындаймыз. Құжат пен жазылу бойынша көмектесеміз."
	},
	{
		key: "steps.kicker",
		ru: "Как проходит обучение",
		kz: "Оқу қалай өтеді"
	},
	{
		key: "steps.title",
		ru: "Четыре шага до прав",
		kz: "Куәлікке төрт қадам"
	},
	{
		key: "steps.1.title",
		ru: "Заявка",
		kz: "Өтінім"
	},
	{
		key: "steps.1.body",
		ru: "Оставляете имя и телефон — перезваниваем в рабочее время, подбираем группу и категорию.",
		kz: "Атыңыз бен телефон қалдырасыз — жұмыс уақытында қоңырау шалып, топ пен санатты таңдаймыз."
	},
	{
		key: "steps.2.title",
		ru: "Теория ПДД",
		kz: "ЖҚЕ теориясы"
	},
	{
		key: "steps.2.body",
		ru: "Занятия в классе: знаки, разметка, экзаменационные билеты. Можно на казахском или русском.",
		kz: "Сыныпта: белгілер, таңбалау, емтихан билеттері. Қазақ немесе орыс тілінде."
	},
	{
		key: "steps.3.title",
		ru: "Автодром и город",
		kz: "Автодром және қала"
	},
	{
		key: "steps.3.body",
		ru: "Площадка, затем улицы Туркестана с инструктором. Темп — ваш, не «успеть программу».",
		kz: "Алаң, сосын нұсқаушымен Түркістан көшелері. Темп — сіздікі."
	},
	{
		key: "steps.4.title",
		ru: "Экзамен",
		kz: "Емтихан"
	},
	{
		key: "steps.4.body",
		ru: "Внутренний зачёт, затем СпецЦОН. Мы рядом, пока не будет удостоверения.",
		kz: "Ішкі сынақ, сосын АрнайыХҚКО. Куәлік алғанша жаныңыздамыз."
	},
	{
		key: "team.kicker",
		ru: "Команда",
		kz: "Команда"
	},
	{
		key: "team.title",
		ru: "Кто ведёт занятия",
		kz: "Сабақты кім жүргізеді"
	},
	{
		key: "reviews.kicker",
		ru: "Отзывы",
		kz: "Пікірлер"
	},
	{
		key: "reviews.title",
		ru: "Ученики — своими словами",
		kz: "Оқушылар өз сөзімен"
	},
	{
		key: "booking.kicker",
		ru: "Запись",
		kz: "Жазылу"
	},
	{
		key: "booking.title",
		ru: "Оставьте заявку — перезвоним",
		kz: "Өтінім қалдырыңыз — қоңырау шаламыз"
	},
	{
		key: "booking.lead",
		ru: "Заявка приходит в школу. Можно сразу написать в WhatsApp — ответим быстрее.",
		kz: "Өтінім мектепке келеді. WhatsApp-қа жазсаңыз, жылдамырақ жауап береміз."
	},
	{
		key: "booking.name",
		ru: "Имя",
		kz: "Аты-жөні"
	},
	{
		key: "booking.phone",
		ru: "Телефон",
		kz: "Телефон"
	},
	{
		key: "booking.category",
		ru: "Категория",
		kz: "Санат"
	},
	{
		key: "booking.date",
		ru: "Удобная дата",
		kz: "Қолайлы күн"
	},
	{
		key: "booking.comment",
		ru: "Комментарий",
		kz: "Пікір"
	},
	{
		key: "booking.submit",
		ru: "Отправить заявку",
		kz: "Өтінім жіберу"
	},
	{
		key: "booking.whatsapp",
		ru: "Написать в WhatsApp",
		kz: "WhatsApp-қа жазу"
	},
	{
		key: "booking.telegram",
		ru: "Telegram",
		kz: "Telegram"
	},
	{
		key: "booking.success",
		ru: "Заявка принята. Мы перезвоним в рабочие часы.",
		kz: "Өтінім қабылданды. Жұмыс уақытында қоңырау шаламыз."
	},
	{
		key: "booking.error",
		ru: "Не удалось отправить. Позвоните или напишите в WhatsApp.",
		kz: "Жіберілмеді. Қоңырау шалыңыз немесе WhatsApp-қа жазыңыз."
	},
	{
		key: "booking.name.ph",
		ru: "Как к вам обращаться",
		kz: "Қалай ұндеуге болады"
	},
	{
		key: "booking.phone.ph",
		ru: "+7 7xx xxx xx xx",
		kz: "+7 7xx xxx xx xx"
	},
	{
		key: "booking.comment.ph",
		ru: "Удобное время, опыт вождения, вопросы",
		kz: "Қолайлы уақыт, тәжірибе, сұрақтар"
	},
	{
		key: "contacts.kicker",
		ru: "Контакты",
		kz: "Байланыс"
	},
	{
		key: "contacts.title",
		ru: "Приезжайте в офис или напишите",
		kz: "Офиске келіңіз немесе жазыңыз"
	},
	{
		key: "contacts.phone",
		ru: "Телефон",
		kz: "Телефон"
	},
	{
		key: "contacts.address",
		ru: "Адрес",
		kz: "Мекенжай"
	},
	{
		key: "contacts.hours",
		ru: "Часы работы",
		kz: "Жұмыс уақыты"
	},
	{
		key: "contacts.map",
		ru: "Карта",
		kz: "Карта"
	},
	{
		key: "footer.rights",
		ru: "Автошкола «Авто-Эмир», Туркестан",
		kz: "«Авто-Эмир» автомектебі, Түркістан"
	},
	{
		key: "footer.admin",
		ru: "Для школы",
		kz: "Мектепке"
	},
	{
		key: "wa.prefill",
		ru: "Здравствуйте! Хочу записаться в автошколу Авто-Эмир.",
		kz: "Сәлеметсіз бе! Авто-Эмир автомектебіне жазылғым келеді."
	}
];
var SERVICES = [
	{
		code: "A1",
		titleRu: "Категория A1",
		titleKz: "A1 санаты",
		descRu: "Лёгкие мотоциклы до 125 см³. Теория + площадка.",
		descKz: "125 см³ дейінгі жеңіл мотоцикл. Теория + алаң.",
		price: 5e4,
		durationRu: "3 недели",
		durationKz: "3 апта",
		hours: 10,
		featured: false,
		sortOrder: 10
	},
	{
		code: "A",
		titleRu: "Категория A",
		titleKz: "A санаты",
		descRu: "Мотоциклы. Посадка, баланс, городской поток.",
		descKz: "Мотоцикл. Отырыс, тепе-теңдік, қала ағыны.",
		price: 65e3,
		durationRu: "1 месяц",
		durationKz: "1 ай",
		hours: 12,
		featured: false,
		sortOrder: 20
	},
	{
		code: "B",
		titleRu: "Категория B",
		titleKz: "B санаты",
		descRu: "Легковые авто. Полный курс: ПДД, автодром, город.",
		descKz: "Жеңіл авто. Толық курс: ЖҚЕ, автодром, қала.",
		price: 11e4,
		durationRu: "2,5 месяца",
		durationKz: "2,5 ай",
		hours: 20,
		featured: true,
		sortOrder: 30
	},
	{
		code: "B1",
		titleRu: "Категория B1",
		titleKz: "B1 санаты",
		descRu: "Трициклы и квадрициклы. Компактная программа.",
		descKz: "Трицикл мен квадрицикл. Шағын бағдарлама.",
		price: 85e3,
		durationRu: "2 месяца",
		durationKz: "2 ай",
		hours: 14,
		featured: false,
		sortOrder: 40
	},
	{
		code: "BE",
		titleRu: "Категория BE",
		titleKz: "BE санаты",
		descRu: "Легковой автомобиль с прицепом. Для тех, у кого уже есть B.",
		descKz: "Тіркемелі жеңіл авто. B санаты барларға.",
		price: 6e4,
		durationRu: "3 недели",
		durationKz: "3 апта",
		hours: 10,
		featured: false,
		sortOrder: 50
	},
	{
		code: "C",
		titleRu: "Категория C",
		titleKz: "C санаты",
		descRu: "Грузовые автомобили. Площадка и маршрут по городу.",
		descKz: "Жүк автомобилі. Алаң және қала бағыты.",
		price: 145e3,
		durationRu: "2,5 месяца",
		durationKz: "2,5 ай",
		hours: 22,
		featured: false,
		sortOrder: 60
	},
	{
		code: "C1",
		titleRu: "Категория C1",
		titleKz: "C1 санаты",
		descRu: "Средние грузовики. Отдельная программа без полной C.",
		descKz: "Орта жүк көліктері. Толық C-сіз жеке бағдарлама.",
		price: 13e4,
		durationRu: "2 месяца",
		durationKz: "2 ай",
		hours: 18,
		featured: false,
		sortOrder: 70
	}
];
var INSTRUCTORS = [
	{
		initials: "ЕС",
		nameRu: "Ерлан Сейтов",
		nameKz: "Ерлан Сейтов",
		roleRu: "Инструктор категории B, город",
		roleKz: "B санатының нұсқаушысы, қала",
		sortOrder: 1
	},
	{
		initials: "АН",
		nameRu: "Айгуль Нуртазина",
		nameKz: "Айгүл Нұртазина",
		roleRu: "Преподаватель ПДД, казахский и русский",
		roleKz: "ЖҚЕ оқытушысы, қазақ және орыс",
		sortOrder: 2
	},
	{
		initials: "МЖ",
		nameRu: "Марат Жунусов",
		nameKz: "Марат Жүнісов",
		roleRu: "Автодром, категории C и C1",
		roleKz: "Автодром, C және C1 санаттары",
		sortOrder: 3
	}
];
var REVIEWS = [
	{
		nameRu: "Зарина О.",
		nameKz: "Зарина О.",
		bodyRu: "Учусь второй день — всё нравится. Объясняют спокойно, без спешки. Можно на казахском.",
		bodyKz: "Екінші күн оқып жатырмын — бәрі ұнайды. Асықпай, сабырмен түсіндіреді. Қазақша да болады.",
		rating: 5,
		sortOrder: 1
	},
	{
		nameRu: "Эмиль А.",
		nameKz: "Эмиль А.",
		bodyRu: "Хорошая автошкола и свой автодром. Уроки на русском и казахском, преподаватели доброжелательные.",
		bodyKz: "Жақсы автомектеп, өз автодромы бар. Сабақ орысша және қазақша, мұғалімдер жайдарлы.",
		rating: 5,
		sortOrder: 2
	},
	{
		nameRu: "Bella R.",
		nameKz: "Bella R.",
		bodyRu: "Всё понятно, спокойно и с терпением. Инструкторы — профессионалы. После занятий появилась уверенность за рулём.",
		bodyKz: "Бәрі түсінікті, сабырлы. Нұсқаушылар — өз ісінің шебері. Сабақтан кейін рульде сенім пайда болды.",
		rating: 5,
		sortOrder: 3
	}
];
var ADMIN_HASH = "a3bff63d72c4c15ea3b386b58ae2a42fdf31915dbb9e0fcecabca62e7b9d774c";
function hashPassword(password) {
	return createHash("sha256").update(`auto-emir::${password}`).digest("hex");
}
var seedLock = null;
async function ensureSeeded(sql) {
	if (!seedLock) seedLock = (async () => {
		if (((await sql`select count(*)::int as n from site_texts`)[0]?.n ?? 0) > 0) return;
		for (const item of TEXTS) await sql`insert into site_texts (key, ru, kz) values (${item.key}, ${item.ru}, ${item.kz}) on conflict (key) do nothing`;
		for (const s of SERVICES) await sql`insert into services (code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order)
          values (${s.code}, ${s.titleRu}, ${s.titleKz}, ${s.descRu}, ${s.descKz}, ${s.price}, ${s.durationRu}, ${s.durationKz}, ${s.hours}, ${s.featured}, ${s.sortOrder})
          on conflict (code) do nothing`;
		await sql`insert into contacts (id, phone, whatsapp, telegram, address_ru, address_kz, hours_ru, hours_kz, instagram, lat, lng, enrolled_base)
        values (1, ${CONTACTS.phone}, ${CONTACTS.whatsapp}, ${CONTACTS.telegram}, ${CONTACTS.addressRu}, ${CONTACTS.addressKz}, ${CONTACTS.hoursRu}, ${CONTACTS.hoursKz}, ${CONTACTS.instagram}, ${CONTACTS.lat}, ${CONTACTS.lng}, ${CONTACTS.enrolledBase})
        on conflict (id) do nothing`;
		for (const i of INSTRUCTORS) await sql`insert into instructors (initials, name_ru, name_kz, role_ru, role_kz, sort_order)
          values (${i.initials}, ${i.nameRu}, ${i.nameKz}, ${i.roleRu}, ${i.roleKz}, ${i.sortOrder})`;
		for (const r of REVIEWS) await sql`insert into reviews (name_ru, name_kz, body_ru, body_kz, rating, sort_order)
          values (${r.nameRu}, ${r.nameKz}, ${r.bodyRu}, ${r.bodyKz}, ${r.rating}, ${r.sortOrder})`;
		await sql`insert into admin_auth (id, password_hash) values (1, ${ADMIN_HASH}) on conflict (id) do nothing`;
	})().finally(() => {
		seedLock = null;
	});
	await seedLock;
}
function mapService(row) {
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
		sortOrder: Number(row.sort_order)
	};
}
async function loadSite() {
	const sql = await getSql();
	await ensureSeeded(sql);
	const textRows = await sql`
    select key, ru, kz from site_texts`;
	const texts = {};
	for (const row of textRows) texts[row.key] = {
		ru: row.ru,
		kz: row.kz
	};
	const serviceRows = await sql`select id, code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order from services order by sort_order, id`;
	const contactRows = await sql`select phone, whatsapp, telegram, address_ru, address_kz, hours_ru, hours_kz, instagram, lat, lng, enrolled_base from contacts where id = 1`;
	const instructorRows = await sql`select id, initials, name_ru, name_kz, role_ru, role_kz, sort_order from instructors order by sort_order, id`;
	const reviewRows = await sql`select id, name_ru, name_kz, body_ru, body_kz, rating, sort_order from reviews order by sort_order, id`;
	const countRows = await sql`select count(*)::int as n from bookings`;
	const c = contactRows[0];
	const contacts = c ? {
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
		enrolledBase: Number(c.enrolled_base)
	} : CONTACTS;
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
			sortOrder: Number(i.sort_order)
		})),
		reviews: reviewRows.map((r) => ({
			id: r.id,
			nameRu: r.name_ru,
			nameKz: r.name_kz,
			bodyRu: r.body_ru,
			bodyKz: r.body_kz,
			rating: Number(r.rating),
			sortOrder: Number(r.sort_order)
		})),
		bookingCount: Number(countRows[0]?.n ?? 0)
	};
}
async function createBooking(input) {
	const sql = await getSql();
	await ensureSeeded(sql);
	const id = (await sql`
    insert into bookings (name, phone, category, preferred_date, comment)
    values (${input.name}, ${input.phone}, ${input.category}, ${input.preferredDate}, ${input.comment})
    returning id`)[0]?.id;
	if (!id) throw new Error("booking_failed");
	return { id };
}
async function requireAdmin(token) {
	const sql = await getSql();
	await ensureSeeded(sql);
	const row = (await sql`
    select token, token_expires from admin_auth where id = 1`)[0];
	if (!row?.token || row.token !== token) throw new Error("unauthorized");
	if (row.token_expires && new Date(row.token_expires).getTime() < Date.now()) throw new Error("unauthorized");
	return sql;
}
async function adminLogin(password) {
	const sql = await getSql();
	await ensureSeeded(sql);
	const hash = (await sql`select password_hash from admin_auth where id = 1`)[0]?.password_hash ?? ADMIN_HASH;
	if (hashPassword(password) !== hash) throw new Error("invalid_password");
	const token = randomBytes(24).toString("hex");
	await sql`update admin_auth set token = ${token}, token_expires = ${new Date(Date.now() + 432e5).toISOString()}::timestamptz where id = 1`;
	return { token };
}
async function adminLogout(token) {
	try {
		await (await requireAdmin(token))`update admin_auth set token = null, token_expires = null where id = 1`;
	} catch {}
}
async function saveTexts(token, items) {
	const sql = await requireAdmin(token);
	for (const item of items) await sql`insert into site_texts (key, ru, kz) values (${item.key}, ${item.ru}, ${item.kz})
      on conflict (key) do update set ru = excluded.ru, kz = excluded.kz`;
}
async function saveContacts(token, data) {
	await (await requireAdmin(token))`update contacts set
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
async function saveService(token, data) {
	const sql = await requireAdmin(token);
	if (data.id) {
		const row = (await sql`update services set
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
      returning id, code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order`)[0];
		if (!row) throw new Error("not_found");
		return mapService(row);
	}
	const row = (await sql`insert into services (code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order)
    values (${data.code}, ${data.titleRu}, ${data.titleKz}, ${data.descRu}, ${data.descKz}, ${data.price}, ${data.durationRu}, ${data.durationKz}, ${data.hours}, ${data.featured}, ${data.sortOrder})
    returning id, code, title_ru, title_kz, desc_ru, desc_kz, price, duration_ru, duration_kz, hours, featured, sort_order`)[0];
	if (!row) throw new Error("insert_failed");
	return mapService(row);
}
async function removeService(token, id) {
	await (await requireAdmin(token))`delete from services where id = ${id}`;
}
async function listBookings(token) {
	return (await (await requireAdmin(token))`select id, name, phone, category, preferred_date, comment, created_at from bookings order by created_at desc`).map((r) => ({
		id: r.id,
		name: r.name,
		phone: r.phone,
		category: r.category,
		preferredDate: r.preferred_date,
		comment: r.comment,
		createdAt: String(r.created_at)
	}));
}
async function removeBooking(token, id) {
	await (await requireAdmin(token))`delete from bookings where id = ${id}`;
}
async function saveInstructors(token, items) {
	const sql = await requireAdmin(token);
	for (const i of items) await sql`update instructors set
      initials = ${i.initials},
      name_ru = ${i.nameRu},
      name_kz = ${i.nameKz},
      role_ru = ${i.roleRu},
      role_kz = ${i.roleKz},
      sort_order = ${i.sortOrder}
      where id = ${i.id}`;
}
async function saveReviews(token, items) {
	const sql = await requireAdmin(token);
	for (const r of items) await sql`update reviews set
      name_ru = ${r.nameRu},
      name_kz = ${r.nameKz},
      body_ru = ${r.bodyRu},
      body_kz = ${r.bodyKz},
      rating = ${r.rating},
      sort_order = ${r.sortOrder}
      where id = ${r.id}`;
}
//#endregion
export { adminLogin, adminLogout, createBooking, listBookings, loadSite, removeBooking, removeService, saveContacts, saveInstructors, saveReviews, saveService, saveTexts };
