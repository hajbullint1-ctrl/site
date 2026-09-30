import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLockup } from "@/components/site/logo";
import { useLang } from "@/components/site/lang";
import { t } from "@/lib/i18n";
import { telLink } from "@/lib/utils";
import type { SitePayload } from "@/lib/site-types";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#services", key: "nav.services" },
  { href: "#about", key: "nav.about" },
  { href: "#booking", key: "nav.booking" },
  { href: "#contacts", key: "nav.contacts" },
] as const;

export function SiteHeader({ payload }: { payload: SitePayload }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const texts = payload.texts;
  const phone = payload.contacts.phone;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandLockup />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
            >
              {t(texts, link.key, lang)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} setLang={setLang} />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href={telLink(phone)}>
              <Phone />
              {t(texts, "hero.call", lang)}
            </a>
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg md:hidden"
            aria-label={open ? "Close" : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex h-12 items-center text-base text-fg"
                onClick={() => setOpen(false)}
              >
                {t(texts, link.key, lang)}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function LangSwitch({
  lang,
  setLang,
}: {
  lang: "ru" | "kz";
  setLang: (l: "ru" | "kz") => void;
}) {
  return (
    <div className="flex rounded-full border border-border p-0.5">
      {(["ru", "kz"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          className={cn(
            "h-9 min-w-11 rounded-full px-2.5 text-xs font-medium tracking-wide transition-colors duration-150",
            lang === code ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg",
          )}
        >
          {code === "ru" ? "RU" : "KZ"}
        </button>
      ))}
    </div>
  );
}
