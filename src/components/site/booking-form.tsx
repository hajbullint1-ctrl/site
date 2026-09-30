import { useState, type FormEvent, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitBooking } from "@/lib/site-api";
import { t } from "@/lib/i18n";
import { waLink } from "@/lib/utils";
import type { Lang, SitePayload } from "@/lib/site-types";
import { WhatsAppIcon } from "@/components/site/icons";

export function BookingForm({ payload, lang }: { payload: SitePayload; lang: Lang }) {
  const texts = payload.texts;
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(payload.services.find((s) => s.featured)?.code ?? "B");
  const [preferredDate, setPreferredDate] = useState("");
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const wa = payload.contacts.whatsapp || payload.contacts.phone;
  const prefill = [
    t(texts, "wa.prefill", lang),
    name && (lang === "kz" ? `Аты: ${name}` : `Имя: ${name}`),
    phone && `Tel: ${phone}`,
    category && (lang === "kz" ? `Санат: ${category}` : `Категория: ${category}`),
    preferredDate && (lang === "kz" ? `Күн: ${preferredDate}` : `Дата: ${preferredDate}`),
  ]
    .filter(Boolean)
    .join("\n");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await submitBooking({
        data: { name, phone, category, preferredDate, comment },
      });
      setDone(true);
      toast.success(t(texts, "booking.success", lang));
      void queryClient.invalidateQueries({ queryKey: ["site"] });
    } catch {
      toast.error(t(texts, "booking.error", lang));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border bg-bg p-6 sm:p-8">
        <p className="font-display text-xl">{t(texts, "booking.success", lang)}</p>
        <Button asChild size="lg" className="mt-6">
          <a href={waLink(wa, prefill)} target="_blank" rel="noreferrer">
            <WhatsAppIcon className="size-4" />
            {t(texts, "booking.whatsapp", lang)}
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-bg p-5 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t(texts, "booking.name", lang)}>
          <Input
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t(texts, "booking.name.ph", lang)}
            autoComplete="name"
          />
        </Field>
        <Field label={t(texts, "booking.phone", lang)}>
          <Input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t(texts, "booking.phone.ph", lang)}
            autoComplete="tel"
          />
        </Field>
        <Field label={t(texts, "booking.category", lang)}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            {payload.services.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} — {lang === "kz" ? s.titleKz : s.titleRu}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t(texts, "booking.date", lang)}>
          <Input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
          />
        </Field>
      </div>
      <Field label={t(texts, "booking.comment", lang)} className="mt-4">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t(texts, "booking.comment.ph", lang)}
          rows={4}
        />
      </Field>
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
        {t(texts, "booking.submit", lang)}
      </Button>
    </form>
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
    <label className={className ? `grid gap-1.5 ${className}` : "grid gap-1.5"}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}
