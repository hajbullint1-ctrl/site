import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandLockup } from "@/components/site/logo";
import {
  CMS_DATA_KEY,
  exportSiteData,
  importSiteData,
  isAdminSessionActive,
  loadSiteData,
  loadSitePayload,
  loginAdmin,
  logoutAdmin,
  resetSiteData,
  saveSiteData,
  type SiteData,
} from "@/lib/local-cms";
import { cn } from "@/lib/utils";
import type { ContactInfo, Service, SitePayload } from "@/lib/site-types";

type Tab = "texts" | "services" | "contacts" | "tools";

export function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAdminSessionActive());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-dvh bg-bg" />;
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return (
    <AdminShell
      onLogout={() => {
        logoutAdmin();
        setAuthed(false);
      }}
    />
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (loginAdmin(password)) {
      setPassword("");
      setError("");
      onSuccess();
      return;
    }

    setError("Неверный пароль");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-4 text-fg">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6"
      >
        <BrandLockup />

        <h1 className="mt-6 font-display text-xl">Вход для студентов</h1>

        <p className="mt-2 text-sm leading-relaxed text-muted">
          Скрытая страница для изменения текстов, цен и контактов сайта.
        </p>

        <label className="mt-6 grid gap-1.5">
          <Label>Пароль</Label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-danger">{error}</p>
        ) : null}

        <Button type="submit" className="mt-5 w-full">
          Войти
        </Button>

        <Link
          to="/"
          className="mt-4 block text-center text-sm text-muted hover:text-fg"
        >
          На сайт
        </Link>
      </form>
    </div>
  );
}

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("texts");
  const [revision, setRevision] = useState(0);
  const [updatedAt, setUpdatedAt] = useState("");
  const [payload, setPayload] = useState<SitePayload>(() => loadSitePayload());

  useEffect(() => {
    const refresh = () => {
      setPayload(loadSitePayload());
      setRevision((value) => value + 1);
    };

    refresh();

    const onStorage = (event: StorageEvent) => {
      if (event.key === CMS_DATA_KEY || event.key === null) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function saveData(patch: Partial<SiteData>) {
    const next = {
      ...loadSiteData(),
      ...patch,
    };

    saveSiteData(next);

    setPayload((current) => ({
      ...next,
      bookingCount: current.bookingCount,
    }));

    setRevision((value) => value + 1);
    setUpdatedAt(
      new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    toast.success("Сохранено. Изменения не пропадут после перезагрузки.");
  }

  function reload() {
    setPayload(loadSitePayload());
    setRevision((value) => value + 1);
  }

  function resetAll() {
    const data = resetSiteData();

    setPayload({
      ...data,
      bookingCount: 0,
    });

    setRevision((value) => value + 1);
    setUpdatedAt("");
    toast.success("Возвращены исходные данные сайта.");
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "texts", label: "Тексты" },
    { id: "services", label: "Цены" },
    { id: "contacts", label: "Контакты" },
    { id: "tools", label: "JSON" },
  ];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <BrandLockup />
            <p className="mt-1 text-xs text-muted">
              Изменения хранятся в этом браузере
              {updatedAt ? ` · сохранено ${updatedAt}` : ""}
            </p>
          </div>

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
                tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:text-fg",
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
            key={`texts-${revision}`}
            payload={payload}
            onSave={(texts) => saveData({ texts })}
          />
        ) : null}

        {tab === "services" ? (
          <ServicesEditor
            key={`services-${revision}`}
            payload={payload}
            onSave={(services) => saveData({ services })}
          />
        ) : null}

        {tab === "contacts" ? (
          <ContactsEditor
            key={`contacts-${revision}`}
            payload={payload}
            onSave={(contacts) => saveData({ contacts })}
          />
        ) : null}

        {tab === "tools" ? (
          <ToolsPanel onChanged={reload} onReset={resetAll} />
        ) : null}
      </main>
    </div>
  );
}

const TEXT_GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "Шапка и первый экран",
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
      "trust.rating",
      "trust.categories",
      "trust.languages",
      "trust.autodrome",
    ],
  },
  {
    title: "Услуги и блок о школе",
    keys: [
      "services.kicker",
      "services.title",
      "services.lead",
      "services.duration",
      "services.hours",
      "services.book",
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
    title: "Шаги, команда и отзывы",
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
      "team.kicker",
      "team.title",
      "reviews.kicker",
      "reviews.title",
    ],
  },
  {
    title: "Запись, контакты и подвал",
    keys: [
      "booking.kicker",
      "booking.title",
      "booking.lead",
      "booking.name",
      "booking.phone",
      "booking.category",
      "booking.date",
      "booking.comment",
      "booking.submit",
      "booking.whatsapp",
      "booking.telegram",
      "booking.success",
      "booking.error",
      "booking.name.ph",
      "booking.phone.ph",
      "booking.comment.ph",
      "contacts.kicker",
      "contacts.title",
      "contacts.phone",
      "contacts.address",
      "contacts.hours",
      "contacts.map",
      "footer.rights",
      "footer.admin",
      "wa.prefill",
    ],
  },
];

function TextsEditor({
  payload,
  onSave,
}: {
  payload: SitePayload;
  onSave: (texts: SitePayload["texts"]) => void;
}) {
  const [draft, setDraft] = useState(payload.texts);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Тексты RU / KZ</h1>
          <p className="mt-1 text-sm text-muted">
            Здесь можно менять заголовки, кнопки, описания и подписи.
          </p>
        </div>

        <Button onClick={() => onSave(draft)}>Сохранить</Button>
      </div>

      <div className="mt-8 space-y-10">
        {TEXT_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-sm uppercase tracking-[0.16em] text-muted">
              {group.title}
            </h2>

            <div className="mt-4 space-y-4">
              {group.keys.map((key) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <p className="mb-3 font-mono text-xs text-subtle">{key}</p>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1.5">
                      <Label>RU</Label>
                      <Textarea
                        rows={2}
                        value={draft[key]?.ru ?? ""}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            [key]: {
                              ru: event.target.value,
                              kz: current[key]?.kz ?? "",
                            },
                          }))
                        }
                      />
                    </label>

                    <label className="grid gap-1.5">
                      <Label>KZ</Label>
                      <Textarea
                        rows={2}
                        value={draft[key]?.kz ?? ""}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            [key]: {
                              ru: current[key]?.ru ?? "",
                              kz: event.target.value,
                            },
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
  onSave,
}: {
  payload: SitePayload;
  onSave: (services: Service[]) => void;
}) {
  const [rows, setRows] = useState<Service[]>(payload.services);

  function patch(id: number, value: Partial<Service>) {
    setRows((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...value,
            }
          : item,
      ),
    );
  }

  function addService() {
    const nextId = Math.max(0, ...rows.map((item) => item.id)) + 1;

    setRows((current) => [
      ...current,
      {
        id: nextId,
        code: "NEW",
        titleRu: "Новая категория",
        titleKz: "Жаңа санат",
        descRu: "",
        descKz: "",
        price: 0,
        durationRu: "",
        durationKz: "",
        hours: 10,
        featured: false,
        sortOrder: Math.max(0, ...current.map((item) => item.sortOrder)) + 10,
      },
    ]);
  }

  function removeService(id: number) {
    setRows((current) => current.filter((item) => item.id !== id));
  }

  function save() {
    if (rows.some((item) => !item.code.trim() || !item.titleRu.trim())) {
      toast.error("Заполните код и название RU у всех категорий.");
      return;
    }

    onSave(
      [...rows].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      ),
    );
  }

  const sortedRows = [...rows].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Цены и категории</h1>
          <p className="mt-1 text-sm text-muted">
            Каждую карточку можно изменить или удалить.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={addService}>
            Добавить
          </Button>
          <Button onClick={save}>Сохранить все</Button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {sortedRows.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-border bg-surface p-4"
          >
            <div className="grid gap-3 sm:grid-cols-4">
              <Field label="Код">
                <Input
                  value={service.code}
                  onChange={(event) =>
                    patch(service.id, { code: event.target.value })
                  }
                />
              </Field>

              <Field label="Цена, ₸">
                <Input
                  type="number"
                  value={service.price}
                  onChange={(event) =>
                    patch(service.id, {
                      price: Number(event.target.value || 0),
                    })
                  }
                />
              </Field>

              <Field label="Часы">
                <Input
                  type="number"
                  value={service.hours ?? 0}
                  onChange={(event) =>
                    patch(service.id, {
                      hours: Number(event.target.value || 0),
                    })
                  }
                />
              </Field>

              <Field label="Порядок">
                <Input
                  type="number"
                  value={service.sortOrder}
                  onChange={(event) =>
                    patch(service.id, {
                      sortOrder: Number(event.target.value || 0),
                    })
                  }
                />
              </Field>

              <Field label="Название RU">
                <Input
                  value={service.titleRu}
                  onChange={(event) =>
                    patch(service.id, { titleRu: event.target.value })
                  }
                />
              </Field>

              <Field label="Название KZ">
                <Input
                  value={service.titleKz}
                  onChange={(event) =>
                    patch(service.id, { titleKz: event.target.value })
                  }
                />
              </Field>

              <Field label="Срок RU">
                <Input
                  value={service.durationRu}
                  onChange={(event) =>
                    patch(service.id, { durationRu: event.target.value })
                  }
                />
              </Field>

              <Field label="Срок KZ">
                <Input
                  value={service.durationKz}
                  onChange={(event) =>
                    patch(service.id, { durationKz: event.target.value })
                  }
                />
              </Field>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Описание RU">
                <Textarea
                  rows={2}
                  value={service.descRu}
                  onChange={(event) =>
                    patch(service.id, { descRu: event.target.value })
                  }
                />
              </Field>

              <Field label="Описание KZ">
                <Textarea
                  rows={2}
                  value={service.descKz}
                  onChange={(event) =>
                    patch(service.id, { descKz: event.target.value })
                  }
                />
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="flex h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={service.featured}
                  onChange={(event) =>
                    patch(service.id, { featured: event.target.checked })
                  }
                />
                Популярный пакет
              </label>

              <Button
                variant="outline"
                onClick={() => removeService(service.id)}
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsEditor({
  payload,
  onSave,
}: {
  payload: SitePayload;
  onSave: (contacts: ContactInfo) => void;
}) {
  const [contacts, setContacts] = useState<ContactInfo>(payload.contacts);

  function save() {
    onSave({
      ...contacts,
      enrolledBase: Number(contacts.enrolledBase || 0),
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Контакты</h1>
          <p className="mt-1 text-sm text-muted">
            Телефоны, мессенджеры, адрес и режим работы.
          </p>
        </div>

        <Button onClick={save}>Сохранить</Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Field label="Телефон">
          <Input
            value={contacts.phone}
            onChange={(event) =>
              setContacts({ ...contacts, phone: event.target.value })
            }
          />
        </Field>

        <Field label="WhatsApp">
          <Input
            value={contacts.whatsapp}
            onChange={(event) =>
              setContacts({ ...contacts, whatsapp: event.target.value })
            }
          />
        </Field>

        <Field label="Telegram (@username)">
          <Input
            value={contacts.telegram}
            onChange={(event) =>
              setContacts({ ...contacts, telegram: event.target.value })
            }
          />
        </Field>

        <Field label="Instagram">
          <Input
            value={contacts.instagram}
            onChange={(event) =>
              setContacts({ ...contacts, instagram: event.target.value })
            }
          />
        </Field>

        <Field label="Адрес RU">
          <Input
            value={contacts.addressRu}
            onChange={(event) =>
              setContacts({ ...contacts, addressRu: event.target.value })
            }
          />
        </Field>

        <Field label="Адрес KZ">
          <Input
            value={contacts.addressKz}
            onChange={(event) =>
              setContacts({ ...contacts, addressKz: event.target.value })
            }
          />
        </Field>

        <Field label="Часы RU">
          <Input
            value={contacts.hoursRu}
            onChange={(event) =>
              setContacts({ ...contacts, hoursRu: event.target.value })
            }
          />
        </Field>

        <Field label="Часы KZ">
          <Input
            value={contacts.hoursKz}
            onChange={(event) =>
              setContacts({ ...contacts, hoursKz: event.target.value })
            }
          />
        </Field>

        <Field label="Адрес ссылки на карту">
          <Input
            value={contacts.mapUrl}
            onChange={(event) =>
              setContacts({ ...contacts, mapUrl: event.target.value })
            }
          />
        </Field>

        <Field label="Базовое число учеников">
          <Input
            type="number"
            value={contacts.enrolledBase}
            onChange={(event) =>
              setContacts({
                ...contacts,
                enrolledBase: Number(event.target.value || 0),
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}

function ToolsPanel({
  onChanged,
  onReset,
}: {
  onChanged: () => void;
  onReset: () => void;
}) {
  const [jsonText, setJsonText] = useState("");

  function exportJson() {
    setJsonText(JSON.stringify(exportSiteData(), null, 2));
    toast.success("Данные экспортированы в JSON.");
  }

  function importJson() {
    try {
      importSiteData(JSON.parse(jsonText));
      onChanged();
      toast.success("Данные успешно импортированы!");
    } catch {
      toast.error("Ошибка в формате JSON. Проверьте синтаксис.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl">Резервная копия и JSON</h1>
        <p className="mt-1 text-sm text-muted">
          Вы можете выгрузить все данные сайта или загрузить их обратно.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={exportJson}>Экспортировать JSON</Button>
        <Button variant="outline" onClick={importJson}>
          Импортировать из поля ниже
        </Button>
        <Button variant="outline" onClick={onReset}>
          Сбросить всё к дефолту
        </Button>
      </div>

      <label className="grid gap-1.5">
        <Label>Содержимое JSON</Label>
        <Textarea
          rows={12}
          value={jsonText}
          onChange={(event) => setJsonText(event.target.value)}
          placeholder="Нажмите «Экспортировать JSON», чтобы увидеть данные..."
          className="font-mono text-xs"
        />
      </label>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
