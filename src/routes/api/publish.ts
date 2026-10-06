import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/publish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { publishFromRequest } = await import("@/lib/site.server.ts");
        return publishFromRequest(request);
      },
    },
  },
});
