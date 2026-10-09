import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { CloudUpload, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandLockup } from "@/components/site/logo";
import {
  adminLoginFn,
  adminLogoutFn,
  getSitePayload,
  listBookingsFn,
  parseSiteContent,
  publishSiteFn,
  removeBookingFn,
  removeServiceFn,
  saveContactsFn,
  saveInstructorsFn,
  saveReviewsFn,
  saveServiceFn,
  saveTextsFn,
} from "@/lib/site-api";
import {
  contentFromPayload,
  saveLocalContent,
  toPrettyJson,
  useSiteContent,
} from "@/lib/site-content";
import { mapGithubError } from "@/lib/github-errors";
import { cn, waLink } from "@/lib/utils";
import type { ContactInfo, Instructor, Review, Service, SiteMedia, SitePayload } from "@/lib/site-types";

const TOKEN_KEY = "ae-admin-token";
type Tab = "texts" | "services" | "contacts" | "bookings" | "team" | "json";

export function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToken(sessionStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-dvh bg-bg" />;
  if (!token) return <Login onToken={(t) => { sessionStorage.setItem(TOKEN_KEY, t); setToken(t); }} />;

  return (
    <AdminShell
      token={token}
      onLogout={() => {
        sessionStorage.removeItem(TOKEN_KEY);
        void adminLogoutFn({ data: { token } });
        setToken(null);
      }}
    />
  );
}

function Login({ onToken }: { onToken: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await adminLoginFn({ data: { password: password.trim() } });
      onToken(res.token);
    } catch {
      setError("Неверный пароль");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4 text-fg">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6"
      >
        <BrandLockup />
        <h1 className="mt-6 font-display text-xl">Кабинет школы</h1>
        <p className="mt-2 text-sm text-muted">Пароль, чтобы править тексты, цены и заявки.</p>
        <label className="mt-6 grid gap-1.5">
          <Label>Пароль</Label>
          <Input
            type="password"
            name="ae-school-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="mt-5 w-full" disabled={pending}>
          Войти
        </Button>
        <Link to="/" className="mt-4 block text-center text-sm text-muted hover:text-fg">
          На сайт
        </Link>
      </form>
    </div>
  );
}

function AdminShell({ token, onLogout }: { token: string; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("texts");
  const site = useQuery({
    queryKey: ["site"],
    queryFn: () => getSitePayload(),
  });
  const bookings = useQuery({
    queryKey: ["bookings", token],
    queryFn: () => listBookingsFn({ data: { token } }),
    refetchInterval: 6000,
  });

  const live = useSiteContent(site.data);
  const payload = live;

  const tabs: { id: Tab; label: string }[] = [
    { id: "texts", label: "Тексты" },
    { id: "services", label: "Цены" },
    { id: "contacts", label: "Контакты" },
    { id: "team", label: "Команда и фото" },
    { id: "bookings", label: `Заявки (${bookings.data?.length ?? 0})` },
    { id: "json", label: "JSON / Резервная копия" },
  ];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <BrandLockup />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Сайт</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Выйти
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-sm",
                tab === item.id ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === "texts" ? (
          <TextsEditor
            key={Object.keys(payload.texts).length}
            payload={payload}
            token={token}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["site"] })}
          />
        ) : null}
        {tab === "services" ? (
          <ServicesEditor
            key={payload.services.map((s) => s.id).join("-")}
            payload={payload}
            token={token}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["site"] })}
          />
        ) : null}
        {tab === "contacts" ? (
          <ContactsEditor
            key={payload.contacts.phone}
            payload={payload}
            token={token}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["site"] })}
          />
        ) : null}
        {tab === "team" ? (
          <TeamEditor
            key={payload.instructors.map((i) => i.id).join("-")}
            payload={payload}
            token={token}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["site"] })}
          />
        ) : null}
        {tab === "bookings" ? (
          <BookingsList
            token={token}
            items={bookings.data ?? []}
            onChanged={() => queryClient.invalidateQueries({ queryKey: ["bookings"] })}
          />
        ) : null}
        {tab === "json" ? (
          <JsonBackup
            payload={payload}
            token={token}
            onApplied={() => queryClient.invalidateQueries({ queryKey: ["site"] })}
          />
        ) : null}
      </main>
    </div>
  );
}

const TEXT_GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Шапка и герой",
    keys: [
      "meta.title",
      "meta.description",
      "nav.services",
      "nav.about",
      "nav.booking",
      "nav.contacts",
      "ticker.online",
      "ticker.authorized",
      "ticker.time",
      "hero.kicker",
      "hero.title",
      "hero.lead",
      "hero.cta",
      "hero.call",
    ],
  },
  {
    title: "Услуги и о школе",
    keys: [
      "services.kicker",
      "services.title",
      "services.lead",
      "about.kicker",
      "about.title",
      "about.body",
      "about.p1.title",
      "about.p1.body",
      "about.p2.title",
      "about.p2.body",
      "about.p3.title",
      "about.p3.body",
    ],
  },
  {
    title: "Шаги, запись, подвал",
    keys: [
      "steps.kicker",
      "steps.title",
      "steps.1.title",
      "steps.1.body",
      "steps.2.title",
      "steps.2.body",
      "steps.3.title",
      "steps.3.body",
      "steps.4.title",
      "steps.4.body",
      "booking.kicker",
      "booking.title",
      "booking.lead",
      "booking.submit",
      "booking.success",
      "contacts.kicker",
      "contacts.title",
      "footer.rights",
    ],
  },
];

function TextsEditor({
  payload,
  token,
  onSaved,
}: {
  payload: SitePayload;
  token: string;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(payload.texts);
  const [pending, setPending] = useState(false);

  const items = useMemo(
    () => Object.entries(draft).map(([key, v]) => ({ key, ru: v.ru, kz: v.kz })),
    [draft],
  );

  async function save() {
    setPending(true);
    try {
      await saveTextsFn({ data: { token, items } });
      saveLocalContent({ ...contentFromPayload(payload), texts: draft });
      toast.success("Тексты сохранены — сайт обновится сразу");
      onSaved();
    } catch {
      toast.error("Не удалось сохранить");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Тексты RU / KZ</h1>
        <Button onClick={() => void save()} disabled={pending}>
          Сохранить
        </Button>
      </div>
      <div className="mt-8 space-y-10">
        {TEXT_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">{group.title}</h2>
            <div className="mt-4 space-y-4">
              {group.keys.map((key) => (
                <div key={key} className="rounded-lg border border-border bg-surface p-4">
                  <p className="mb-3 font-mono text-xs text-subtle">{key}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1.5">
                      <Label>RU</Label>
                      <Textarea
                        rows={2}
                        value={draft[key]?.ru ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            [key]: { ru: e.target.value, kz: d[key]?.kz ?? "" },
                          }))
                        }
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <Label>KZ</Label>
                      <Textarea
                        rows={2}
                        value={draft[key]?.kz ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            [key]: { ru: d[key]?.ru ?? "", kz: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ServicesEditor({
  payload,
  token,
  onSaved,
}: {
  payload: SitePayload;
  token: string;
  onSaved: () => void;
}) {
  const [rows, setRows] = useState(payload.services);

  function patch(id: number, next: Partial<Service>) {
    setRows((list) => list.map((s) => (s.id === id ? { ...s, ...next } : s)));
  }

  async function saveOne(s: Service) {
    try {
      await saveServiceFn({
        data: {
          token,
          service: {
            id: s.id,
            code: s.code,
            titleRu: s.titleRu,
            titleKz: s.titleKz,
            descRu: s.descRu,
            descKz: s.descKz,
            price: Number(s.price),
            durationRu: s.durationRu,
            durationKz: s.durationKz,
            hours: s.hours,
            featured: s.featured,
            sortOrder: s.sortOrder,
          },
        },
      });
      saveLocalContent({
        ...contentFromPayload(payload),
        services: rows.map((row) => (row.id === s.id ? s : row)),
      });
      toast.success(`Категория ${s.code} сохранена`);
      onSaved();
    } catch {
      toast.error("Ошибка сохранения");
    }
  }

  async function addNew() {
    try {
      const created = await saveServiceFn({
        data: {
          token,
          service: {
            code: "D",
            titleRu: "Новая категория",
            titleKz: "Жаңа санат",
            descRu: "",
            descKz: "",
            price: 0,
            durationRu: "",
            durationKz: "",
            hours: 10,
            featured: false,
            sortOrder: 90,
          },
        },
      });
      saveLocalContent({
        ...contentFromPayload(payload),
        services: [...rows, created],
      });
      toast.success("Категория добавлена");
      onSaved();
    } catch {
      toast.error("Не удалось добавить");
    }
  }

  async function remove(id: number) {
    try {
      await removeServiceFn({ data: { token, id } });
      saveLocalContent({
        ...contentFromPayload(payload),
        services: rows.filter((s) => s.id !== id),
      });
      toast.success("Удалено");
      onSaved();
    } catch {
      toast.error("Не удалось удалить");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Цены и категории</h1>
        <Button onClick={() => void addNew()}>Добавить</Button>
      </div>
      <div className="mt-6 space-y-4">
        {rows.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Код">
                <Input value={s.code} onChange={(e) => patch(s.id, { code: e.target.value })} />
              </Field>
              <Field label="Цена, ₸">
                <Input
                  type="number"
                  value={s.price}
                  onChange={(e) => patch(s.id, { price: Number(e.target.value) })}
                />
              </Field>
              <Field label="Часы">
                <Input
                  type="number"
                  value={s.hours ?? 0}
                  onChange={(e) => patch(s.id, { hours: Number(e.target.value) })}
                />
              </Field>
              <Field label="Порядок">
                <Input
                  type="number"
                  value={s.sortOrder}
                  onChange={(e) => patch(s.id, { sortOrder: Number(e.target.value) })}
                />
              </Field>
              <Field label="Название RU">
                <Input value={s.titleRu} onChange={(e) => patch(s.id, { titleRu: e.target.value })} />
              </Field>
              <Field label="Название KZ">
                <Input value={s.titleKz} onChange={(e) => patch(s.id, { titleKz: e.target.value })} />
              </Field>
              <Field label="Срок RU">
                <Input
                  value={s.durationRu}
                  onChange={(e) => patch(s.id, { durationRu: e.target.value })}
                />
              </Field>
              <Field label="Срок KZ">
                <Input
                  value={s.durationKz}
                  onChange={(e) => patch(s.id, { durationKz: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Описание RU">
                <Textarea
                  rows={2}
                  value={s.descRu}
                  onChange={(e) => patch(s.id, { descRu: e.target.value })}
                />
              </Field>
              <Field label="Описание KZ">
                <Textarea
                  rows={2}
                  value={s.descKz}
                  onChange={(e) => patch(s.id, { descKz: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="flex h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={s.featured}
                  onChange={(e) => patch(s.id, { featured: e.target.checked })}
                />
                Популярный пакет
              </label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => void remove(s.id)}>
                  Удалить
                </Button>
                <Button onClick={() => void saveOne(s)}>Сохранить</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsEditor({
  payload,
  token,
  onSaved,
}: {
  payload: SitePayload;
  token: string;
  onSaved: () => void;
}) {
  const [c, setC] = useState<ContactInfo>(payload.contacts);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    try {
      await saveContactsFn({ data: { token, contacts: { ...c, enrolledBase: Number(c.enrolledBase) } } });
      saveLocalContent({ ...contentFromPayload(payload), contacts: { ...c, enrolledBase: Number(c.enrolledBase) } });
      toast.success("Контакты обновлены");
      onSaved();
    } catch {
      toast.error("Ошибка");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Контакты</h1>
        <Button onClick={() => void save()} disabled={pending}>
          Сохранить
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Телефон">
          <Input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
        </Field>
        <Field label="WhatsApp">
          <Input value={c.whatsapp} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} />
        </Field>
        <Field label="Telegram (@username)">
          <Input value={c.telegram} onChange={(e) => setC({ ...c, telegram: e.target.value })} />
        </Field>
        <Field label="Instagram">
          <Input value={c.instagram} onChange={(e) => setC({ ...c, instagram: e.target.value })} />
        </Field>
        <Field label="Адрес RU">
          <Input value={c.addressRu} onChange={(e) => setC({ ...c, addressRu: e.target.value })} />
        </Field>
        <Field label="Адрес KZ">
          <Input value={c.addressKz} onChange={(e) => setC({ ...c, addressKz: e.target.value })} />
        </Field>
        <Field label="Часы RU">
          <Input value={c.hoursRu} onChange={(e) => setC({ ...c, hoursRu: e.target.value })} />
        </Field>
        <Field label="Часы KZ">
          <Input value={c.hoursKz} onChange={(e) => setC({ ...c, hoursKz: e.target.value })} />
        </Field>
        <Field label="Широта">
          <Input value={c.lat} onChange={(e) => setC({ ...c, lat: e.target.value })} />
        </Field>
        <Field label="Долгота">
          <Input value={c.lng} onChange={(e) => setC({ ...c, lng: e.target.value })} />
        </Field>
        <Field label="База учеников (счётчик)">
          <Input
            type="number"
            value={c.enrolledBase}
            onChange={(e) => setC({ ...c, enrolledBase: Number(e.target.value) })}
          />
        </Field>
      </div>
    </div>
  );
}

function TeamEditor({
  payload,
  token,
  onSaved,
}: {
  payload: SitePayload;
  token: string;
  onSaved: () => void;
}) {
  const [instructors, setInstructors] = useState<Instructor[]>(payload.instructors);
  const [reviews, setReviews] = useState<Review[]>(payload.reviews);
  const [media, setMedia] = useState<SiteMedia>(payload.media);
  const [pending, setPending] = useState(false);

  function nextId(items: { id: number }[]) {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  }

  async function persist(publish: boolean) {
    setPending(true);
    const content = {
      ...contentFromPayload(payload),
      instructors,
      reviews,
      media,
    };
    saveLocalContent(content);
    try {
      await saveInstructorsFn({ data: { token, items: instructors } });
      await saveReviewsFn({ data: { token, items: reviews } });
      if (publish) {
        await publishSiteFn({ data: { token, content } });
        toast.success("Сохранено и отправлено в app-data.json. Сайт обновится после сборки.");
      } else {
        toast.success("Сохранено");
      }
      onSaved();
    } catch (err) {
      toast.error(publish ? mapGithubError(err) : "Ошибка сохранения");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-2xl">Фото и дизайн</h1>
        <p className="mt-2 text-sm text-muted">
          Ссылка на картинку: адрес в интернете или путь вроде /images/lesson.jpg
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Field label="Автодром">
            <Input
              value={media.autodrome}
              onChange={(e) => setMedia({ ...media, autodrome: e.target.value })}
              placeholder="https://..."
            />
          </Field>
          <Field label="Практика">
            <Input
              value={media.lesson}
              onChange={(e) => setMedia({ ...media, lesson: e.target.value })}
              placeholder="https://..."
            />
          </Field>
          <Field label="Теория">
            <Input
              value={media.theory}
              onChange={(e) => setMedia({ ...media, theory: e.target.value })}
              placeholder="https://..."
            />
          </Field>
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Инструкторы</h2>
        </div>
        <div className="mt-4 space-y-3">
          {instructors.map((p, idx) => (
            <div key={p.id} className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-5">
              <Field label="Инициалы">
                <Input
                  value={p.initials}
                  onChange={(e) =>
                    setInstructors((list) =>
                      list.map((x, i) => (i === idx ? { ...x, initials: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Имя RU">
                <Input
                  value={p.nameRu}
                  onChange={(e) =>
                    setInstructors((list) =>
                      list.map((x, i) => (i === idx ? { ...x, nameRu: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Имя KZ">
                <Input
                  value={p.nameKz}
                  onChange={(e) =>
                    setInstructors((list) =>
                      list.map((x, i) => (i === idx ? { ...x, nameKz: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Роль RU" className="sm:col-span-2">
                <Input
                  value={p.roleRu}
                  onChange={(e) =>
                    setInstructors((list) =>
                      list.map((x, i) => (i === idx ? { ...x, roleRu: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Роль KZ" className="sm:col-span-3">
                <Input
                  value={p.roleKz}
                  onChange={(e) =>
                    setInstructors((list) =>
                      list.map((x, i) => (i === idx ? { ...x, roleKz: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Фото (ссылка)" className="sm:col-span-2">
                <Input
                  value={p.photo}
                  placeholder="https://..."
                  onChange={(e) =>
                    setInstructors((list) =>
                      list.map((x, i) => (i === idx ? { ...x, photo: e.target.value } : x)),
                    )
                  }
                />
              </Field>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Отзывы</h2>
          <Button
            variant="outline"
            onClick={() =>
              setReviews((list) => [
                ...list,
                {
                  id: nextId(list),
                  nameRu: "Новый отзыв",
                  nameKz: "Жаңа пікір",
                  bodyRu: "",
                  bodyKz: "",
                  rating: 5,
                  avatar: "",
                  sortOrder: list.length + 1,
                },
              ])
            }
          >
            Добавить отзыв
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {reviews.map((r, idx) => (
            <div key={`${r.id}-${idx}`} className="grid gap-3 rounded-lg border border-border bg-surface p-4 md:grid-cols-2">
              <Field label="Имя RU">
                <Input
                  value={r.nameRu}
                  onChange={(e) =>
                    setReviews((list) =>
                      list.map((x, i) => (i === idx ? { ...x, nameRu: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Имя KZ">
                <Input
                  value={r.nameKz}
                  onChange={(e) =>
                    setReviews((list) =>
                      list.map((x, i) => (i === idx ? { ...x, nameKz: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Текст RU">
                <Textarea
                  rows={3}
                  value={r.bodyRu}
                  onChange={(e) =>
                    setReviews((list) =>
                      list.map((x, i) => (i === idx ? { ...x, bodyRu: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Текст KZ">
                <Textarea
                  rows={3}
                  value={r.bodyKz}
                  onChange={(e) =>
                    setReviews((list) =>
                      list.map((x, i) => (i === idx ? { ...x, bodyKz: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <Field label="Аватар (ссылка)" className="md:col-span-2">
                <Input
                  value={r.avatar}
                  placeholder="https://..."
                  onChange={(e) =>
                    setReviews((list) =>
                      list.map((x, i) => (i === idx ? { ...x, avatar: e.target.value } : x)),
                    )
                  }
                />
              </Field>
              <div className="md:col-span-2">
                <Button
                  variant="outline"
                  onClick={() => setReviews((list) => list.filter((_, i) => i !== idx))}
                >
                  Удалить отзыв
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="flex flex-wrap gap-2">
        <Button disabled={pending} onClick={() => void persist(false)}>
          Сохранить
        </Button>
        <Button disabled={pending} variant="secondary" onClick={() => void persist(true)}>
          Сохранить и опубликовать
        </Button>
      </div>
    </div>
  );
}

function BookingsList({
  token,
  items,
  onChanged,
}: {
  token: string;
  items: { id: number; name: string; phone: string; category: string; preferredDate: string; comment: string; createdAt: string }[];
  onChanged: () => void;
}) {
  if (!items.length) {
    return <p className="text-muted">Заявок пока нет. Они появятся после формы на сайте.</p>;
  }
  return (
    <div className="space-y-3">
      <h1 className="font-display text-2xl">Заявки</h1>
      {items.map((b) => (
        <article key={b.id} className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{b.name}</p>
              <a href={`tel:${b.phone}`} className="text-sm text-muted hover:text-fg">
                {b.phone}
              </a>
            </div>
            <p className="font-display text-sm">{b.category}</p>
          </div>
          <p className="mt-2 text-sm text-muted">
            {b.preferredDate ? `Дата: ${b.preferredDate}` : "Дата не указана"}
            {b.comment ? ` · ${b.comment}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <a href={waLink(b.phone, `Здравствуйте, ${b.name}! Авто-Эмир.`)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                await removeBookingFn({ data: { token, id: b.id } });
                onChanged();
              }}
            >
              Убрать
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function JsonBackup({
  payload,
  token,
  onApplied,
}: {
  payload: SitePayload;
  token: string;
  onApplied: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(() => toPrettyJson(contentFromPayload(payload)));
  const [pending, setPending] = useState(false);

  function applyLocal(raw: string) {
    const parsed = parseSiteContent(JSON.parse(raw) as unknown);
    saveLocalContent(parsed);
    setDraft(toPrettyJson(parsed));
    onApplied();
    return parsed;
  }

  async function publish() {
    setPending(true);
    try {
      const parsed = applyLocal(draft);
      await publishSiteFn({ data: { token, content: parsed } });
      toast.success("Опубликовано. На живом сайте цены обновятся после выкладки.");
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.error("JSON с ошибкой. Проверьте запятые и кавычки.");
      } else {
        toast.error(mapGithubError(err));
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl">JSON / Резервная копия</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Цены, тексты и контакты живут в файле app-data.json. Кнопка публикации
            записывает этот JSON в репозиторий GitHub — после выкладки сайт берёт
            новые данные оттуда.
          </p>
        </div>
        <Button onClick={() => void publish()} disabled={pending} className="shrink-0">
          <CloudUpload className="size-4" />
          Сохранить и опубликовать на сайт
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            try {
              applyLocal(draft);
              toast.success("Применено на этом устройстве");
            } catch {
              toast.error("JSON с ошибкой");
            }
          }}
        >
          Применить здесь
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const blob = new Blob([draft], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "app-data.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="size-4" />
          Скачать JSON
        </Button>
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" />
          Загрузить JSON
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            void file.text().then((text) => {
              setDraft(text);
              try {
                applyLocal(text);
                toast.success("Файл загружен и применён");
              } catch {
                toast.error("Файл не похож на app-data.json");
              }
            });
            e.target.value = "";
          }}
        />
      </div>

      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={22}
        className="mt-5 font-mono text-xs leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}
