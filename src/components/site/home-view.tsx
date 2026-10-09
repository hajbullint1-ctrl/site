import { Clock3, GraduationCap, MapPin, Phone, Shield, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/header";
import { WhatsAppIcon } from "@/components/site/icons";
import { useLang } from "@/components/site/lang";
import {
  LiveStat,
  useEnrolledCount,
  useOnlineCount,
  useVisitTimer,
} from "@/components/site/live-stats";
import { BookingForm } from "@/components/site/booking-form";
import { ServicesSection } from "@/components/site/services";
import { field, t } from "@/lib/i18n";
import { useSiteContent } from "@/lib/site-content";
import { telLink, waLink } from "@/lib/utils";
import type { SitePayload } from "@/lib/site-types";

export function HomeView({ payload }: { payload: SitePayload }) {
  const { lang } = useLang();
  const live = useSiteContent(payload);
  const texts = live.texts;
  const online = useOnlineCount();
  const enrolled = useEnrolledCount(live.contacts.enrolledBase, live.bookingCount);
  const timer = useVisitTimer();
  const phone = live.contacts.phone;
  const wa = live.contacts.whatsapp || phone;
  const prefill = t(texts, "wa.prefill", lang);

  return (
    <div id="top" className="min-h-dvh bg-bg text-fg">
      <SiteHeader payload={live} />

      <div className="border-b border-border bg-surface/80">
        <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-3 sm:px-6">
          <LiveStat pulse label={t(texts, "ticker.online", lang)} value={online} />
          <span className="h-6 w-px shrink-0 bg-border" />
          <LiveStat label={t(texts, "ticker.authorized", lang)} value={enrolled} />
          <span className="h-6 w-px shrink-0 bg-border" />
          <LiveStat label={t(texts, "ticker.time", lang)} value={timer} />
        </div>
      </div>

      <section className="asphalt-grid relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p
              className="stagger-in text-xs font-medium uppercase tracking-[0.22em] text-muted"
              style={{ animationDelay: "40ms" }}
            >
              {t(texts, "hero.kicker", lang)}
            </p>
            <h1
              className="stagger-in mt-4 max-w-xl text-3xl text-fg"
              style={{ animationDelay: "80ms" }}
            >
              {t(texts, "hero.title", lang)}
            </h1>
            <p
              className="stagger-in mt-5 max-w-lg text-base leading-relaxed text-muted"
              style={{ animationDelay: "140ms" }}
            >
              {t(texts, "hero.lead", lang)}
            </p>
            <div
              className="stagger-in mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "200ms" }}
            >
              <Button asChild size="lg">
                <a href="#booking">{t(texts, "hero.cta", lang)}</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={telLink(phone)}>
                  <Phone />
                  {phone}
                </a>
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Trust label="5.0" value={t(texts, "trust.rating", lang)} />
              <Trust label="A B C" value={t(texts, "trust.categories", lang)} />
              <Trust label="2" value={t(texts, "trust.languages", lang)} />
              <Trust label="У" value={t(texts, "trust.autodrome", lang)} />
            </dl>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface">
              <img
                src="/images/hero.jpg"
                alt=""
                className="aspect-video h-full w-full object-cover brightness-125 contrast-110"
              />
            </div>
            <div className="absolute -bottom-4 left-4 right-4 hidden items-center justify-between rounded-xl border border-border bg-elevated/95 px-4 py-3 sm:flex">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Timer className="size-4" />
                {field(live.contacts, lang, "hoursRu", "hoursKz")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin className="size-4" />
                Туркестан
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />

      <section id="about" className="scroll-mt-20 border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHead
              kicker={t(texts, "about.kicker", lang)}
              title={t(texts, "about.title", lang)}
              lead={t(texts, "about.body", lang)}
            />
            <ul className="mt-8 space-y-5">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex gap-3">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted">
                    {n === 1 ? (
                      <Shield className="size-4" />
                    ) : n === 2 ? (
                      <GraduationCap className="size-4" />
                    ) : (
                      <Clock3 className="size-4" />
                    )}
                  </span>
                  <div>
                    <p className="font-medium">{t(texts, `about.p${n}.title`, lang)}</p>
                    <p className="mt-1 text-sm text-muted">{t(texts, `about.p${n}.body`, lang)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <img
              src={live.media.autodrome || "/images/autodrome.jpg"}
              alt=""
              className="h-56 w-full rounded-xl object-cover sm:h-full"
            />
            <div className="grid gap-3">
              <img
                src={live.media.lesson || "/images/lesson.jpg"}
                alt=""
                className="h-40 w-full rounded-xl object-cover"
              />
              <img
                src={live.media.theory || "/images/theory.jpg"}
                alt=""
                className="h-40 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            kicker={t(texts, "steps.kicker", lang)}
            title={t(texts, "steps.title", lang)}
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="rounded-xl border border-border bg-surface p-5">
                <p className="font-display text-sm tabular-nums text-muted">0{n}</p>
                <h3 className="mt-3 text-base font-medium">{t(texts, `steps.${n}.title`, lang)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(texts, `steps.${n}.body`, lang)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead kicker={t(texts, "team.kicker", lang)} title={t(texts, "team.title", lang)} />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {live.instructors.map((person) => (
              <article key={person.id} className="rounded-xl border border-border bg-bg p-5">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt=""
                    className="size-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-lg border border-border font-display text-sm tracking-wide">
                    {person.initials}
                  </div>
                )}
                <h3 className="mt-4 text-base font-medium">
                  {field(person, lang, "nameRu", "nameKz")}
                </h3>
                <p className="mt-1 text-sm text-muted">{field(person, lang, "roleRu", "roleKz")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionHead
            kicker={t(texts, "reviews.kicker", lang)}
            title={t(texts, "reviews.title", lang)}
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {live.reviews.map((review) => (
              <blockquote
                key={review.id}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-sm leading-relaxed text-fg">
                  {field(review, lang, "bodyRu", "bodyKz")}
                </p>
                <footer className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted">
                  {review.avatar ? (
                    <img src={review.avatar} alt="" className="size-8 rounded-full object-cover" />
                  ) : null}
                  {field(review, lang, "nameRu", "nameKz")}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="scroll-mt-20 border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHead
              kicker={t(texts, "booking.kicker", lang)}
              title={t(texts, "booking.title", lang)}
              lead={t(texts, "booking.lead", lang)}
            />
            <div className="mt-8 flex flex-col gap-3">
              <Button asChild variant="secondary" size="lg">
                <a href={waLink(wa, prefill)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-4" />
                  {t(texts, "booking.whatsapp", lang)}
                </a>
              </Button>
              {live.contacts.telegram ? (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={`https://t.me/${live.contacts.telegram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(texts, "booking.telegram", lang)}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
          <BookingForm payload={live} lang={lang} />
        </div>
      </section>

      <section id="contacts" className="scroll-mt-20 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHead
              kicker={t(texts, "contacts.kicker", lang)}
              title={t(texts, "contacts.title", lang)}
            />
            <dl className="mt-8 space-y-5">
              <ContactRow
                label={t(texts, "contacts.phone", lang)}
                value={phone}
                href={telLink(phone)}
              />
              <ContactRow
                label={t(texts, "contacts.address", lang)}
                value={field(live.contacts, lang, "addressRu", "addressKz")}
              />
              <ContactRow
                label={t(texts, "contacts.hours", lang)}
                value={field(live.contacts, lang, "hoursRu", "hoursKz")}
              />
            </dl>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <iframe
              title={t(texts, "contacts.map", lang)}
              className="h-72 w-full grayscale contrast-125 lg:h-full min-h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(live.contacts.lng) - 0.01}%2C${Number(live.contacts.lat) - 0.008}%2C${Number(live.contacts.lng) + 0.01}%2C${Number(live.contacts.lat) + 0.008}&layer=mapnik&marker=${live.contacts.lat}%2C${live.contacts.lng}`}
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t(texts, "footer.rights", lang)}</p>
          <a href="/admin" className="text-subtle hover:text-fg">
            {t(texts, "footer.admin", lang)}
          </a>
        </div>
      </footer>

      <a
        href={waLink(wa, prefill)}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95"
        aria-label={t(texts, "booking.whatsapp", lang)}
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}

function Trust({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-lg tracking-tight">{label}</dt>
      <dd className="mt-1 text-[11px] leading-snug text-muted">{value}</dd>
    </div>
  );
}

function SectionHead({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">{kicker}</p>
      <h2 className="mt-3 text-2xl text-fg">{title}</h2>
      {lead ? <p className="mt-4 text-base leading-relaxed text-muted">{lead}</p> : null}
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd className="mt-1 text-base">
        {href ? (
          <a href={href} className="hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
