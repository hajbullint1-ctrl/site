import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppProviders } from "@/components/providers";
import appCss from "../styles.css?url";

const APP_NAME = "Авто-Эмир";
const APP_DESC =
  "Автошкола «Авто-Эмир» в Туркестане: категории A, B, C, свой автодром, обучение на русском и казахском.";
const SITE_URL = "https://avtoemir.autos";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0b0c0e" },
      { name: "description", content: APP_DESC },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: APP_DESC },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "ru_RU" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: APP_NAME },
      { name: "twitter:description", content: APP_DESC },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
    ],
    links: [
      // Google prefers PNG favicons that are multiples of 48px
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon-512.png" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DrivingSchool",
              name: APP_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/favicon-512.png`,
              image: `${SITE_URL}/og.jpg`,
              description: APP_DESC,
              telephone: "+77083425171",
              address: {
                "@type": "PostalAddress",
                streetAddress: "проспект Тауке хана, 287",
                addressLocality: "Туркестан",
                addressCountry: "KZ",
              },
              sameAs: ["https://www.instagram.com/avtoshkola_turkestan_avtoemir"],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <AppProviders>
            <Outlet />
          </AppProviders>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
