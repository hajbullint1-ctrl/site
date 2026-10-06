import appData from "@/lib/app-data/app-data.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/site/lang";
import { field, t } from "@/lib/i18n";
import { useSiteContent } from "@/lib/site-content";
import { formatTenge } from "@/lib/utils";

/**
 * Prices and categories.
 * Source of truth: src/lib/app-data/app-data.json
 * (plus unpublished admin edits stored in this browser).
 */
export function ServicesSection() {
  const { lang } = useLang();
  const live = useSiteContent();
  const texts = Object.keys(live.texts).length ? live.texts : appData.texts;
  const services = (live.services.length ? live.services : appData.services)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="services" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
            {t(texts, "services.kicker", lang)}
          </p>
          <h2 className="mt-3 text-2xl text-fg">{t(texts, "services.title", lang)}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {t(texts, "services.lead", lang)}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.id ?? s.code}
              className="flex flex-col rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xs tracking-[0.2em] text-muted">{s.code}</p>
                  <h3 className="mt-1 text-lg font-medium">
                    {field(s, lang, "titleRu", "titleKz")}
                  </h3>
                </div>
                {s.featured ? <Badge className="border-primary/30 text-fg">курс</Badge> : null}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {field(s, lang, "descRu", "descKz")}
              </p>
              <p className="mt-5 font-display text-xl tabular-nums tracking-tight">
                {formatTenge(s.price)}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>
                  {t(texts, "services.duration", lang)}: {field(s, lang, "durationRu", "durationKz")}
                </span>
                {s.hours ? (
                  <span>
                    {s.hours} {t(texts, "services.hours", lang)}
                  </span>
                ) : null}
              </div>
              <Button asChild variant="secondary" className="mt-5 w-full">
                <a href="#booking">
                  {t(texts, "services.book", lang)}
                </a>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
