import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/belt/AppShell";
import { CalibrationPanel, HapticSettings } from "@/components/belt/widgets";

export const Route = createFileRoute("/calibration")({
  head: () => ({
    meta: [
      { title: "Calibration — Vibelt Config" },
      {
        name: "description",
        content: "Test individual haptic nodes and tune threat sensitivity for your Vibelt belt.",
      },
    ],
  }),
  component: CalibrationPage,
});

function CalibrationPage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        <CalibrationPanel />
        <HapticSettings />
      </div>
    </AppShell>
  );
}
