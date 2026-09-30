import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LangProvider } from "@/components/site/lang";
import { HomeView } from "@/components/site/home-view";
import {
  CMS_DATA_KEY,
  loadSitePayload,
} from "@/lib/local-cms";
import type { SitePayload } from "@/lib/site-types";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [payload, setPayload] = useState<SitePayload | null>(null);

  useEffect(() => {
    const refresh = () => {
      const data = loadSitePayload();
      setPayload(data);
      applyMeta(data);
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

  if (!payload) {
    return <div className="min-h-dvh bg-bg" />;
  }

  return (
    <LangProvider>
      <HomeView payload={payload} />
    </LangProvider>
  );
}

function applyMeta(payload: SitePayload) {
  const title = payload.texts["meta.title"]?.ru;
  const description = payload.texts["meta.description"]?.ru;

  if (title) {
    document.title = title;
  }

  if (description) {
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }
}
