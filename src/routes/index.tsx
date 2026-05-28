import { createFileRoute } from "@tanstack/react-router";
import VibeltConfig from "@/components/VibeltConfig";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vibelt Config — Smart Running Belt for DHH Runners" },
      {
        name: "description",
        content:
          "Configure your Vibelt AI-powered smart running belt: pair via Bluetooth, tune haptic sensitivity, and monitor real-time hazards.",
      },
      { property: "og:title", content: "Vibelt Config" },
      {
        property: "og:description",
        content:
          "Pair, calibrate, and monitor your AI smart running belt designed for Deaf and Hard of Hearing runners.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <VibeltConfig />;
}
