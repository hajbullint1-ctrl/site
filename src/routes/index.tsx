import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LangProvider } from "@/components/site/lang";
import { HomeView } from "@/components/site/home-view";
import { getSitePayload } from "@/lib/site-api";

export const Route = createFileRoute("/")({
  loader: () => getSitePayload(),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const { data } = useQuery({
    queryKey: ["site"],
    queryFn: () => getSitePayload(),
    initialData: initial,
    refetchInterval: 8000,
  });

  return (
    <LangProvider>
      <HomeView payload={data} />
    </LangProvider>
  );
}
