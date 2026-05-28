import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/belt/AppShell";
import { LiveStats, HazardLogCard, HapticSettings } from "@/components/belt/widgets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vibelt Config" },
      {
        name: "description",
        content:
          "Live run stats and real-time hazard log for your Vibelt AI smart running belt.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="lg:col-span-2 space-y-4 md:space-y-5">
          <LiveStats />
          <HazardLogCard />
        </div>
        <div className="space-y-4 md:space-y-5">
          <HapticSettings />
        </div>
      </div>
    </AppShell>
  );
}
