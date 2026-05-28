import { createFileRoute } from "@tanstack/react-router";
import { Activity, Flame, MapPin, Timer } from "lucide-react";
import { AppShell } from "@/components/belt/AppShell";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Vibelt Config" },
      {
        name: "description",
        content: "Browse past running sessions logged by your Vibelt smart belt.",
      },
    ],
  }),
  component: HistoryPage,
});

const SESSIONS = [
  { date: "Wed, May 28", route: "Riverside Loop", distance: 7.4, pace: "6:08", calories: 512, hazards: 9 },
  { date: "Mon, May 26", route: "Downtown Sprint", distance: 4.2, pace: "5:42", calories: 298, hazards: 14 },
  { date: "Sat, May 24", route: "Parkway Trail", distance: 10.1, pace: "6:31", calories: 720, hazards: 3 },
  { date: "Thu, May 22", route: "Harbor Run", distance: 5.8, pace: "6:15", calories: 410, hazards: 7 },
  { date: "Tue, May 20", route: "Hillside Climb", distance: 6.3, pace: "6:48", calories: 488, hazards: 5 },
];

function HistoryPage() {
  const total = SESSIONS.reduce((s, x) => s + x.distance, 0);
  const totalCal = SESSIONS.reduce((s, x) => s + x.calories, 0);
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Kpi icon={Activity} label="Total Distance" value={total.toFixed(1)} unit="km" />
          <Kpi icon={Timer} label="Sessions" value={String(SESSIONS.length)} unit="runs" />
          <Kpi icon={Flame} label="Calories" value={totalCal.toLocaleString()} unit="kcal" />
          <Kpi icon={MapPin} label="Hazards Avoided" value={String(SESSIONS.reduce((s, x) => s + x.hazards, 0))} unit="alerts" />
        </div>

        <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent Sessions
            </h2>
          </div>
          <ul className="divide-y divide-slate-800">
            {SESSIONS.map((s, i) => (
              <li
                key={i}
                className="px-5 py-4 flex items-center gap-4 hover:bg-slate-800/30 transition"
              >
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 grid place-items-center shrink-0">
                  <Activity size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-100 truncate">{s.route}</div>
                  <div className="text-xs text-slate-500">{s.date}</div>
                </div>
                <div className="hidden sm:flex items-center gap-5 text-xs text-slate-400">
                  <div>
                    <div className="font-mono font-semibold text-slate-200">{s.distance} km</div>
                    <div className="text-[10px] uppercase tracking-wider">Distance</div>
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-slate-200">{s.pace}/km</div>
                    <div className="text-[10px] uppercase tracking-wider">Pace</div>
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-rose-400">{s.hazards}</div>
                    <div className="text-[10px] uppercase tracking-wider">Hazards</div>
                  </div>
                </div>
                <div className="sm:hidden text-right">
                  <div className="text-sm font-mono font-semibold text-slate-200">{s.distance} km</div>
                  <div className="text-[10px] text-slate-500">{s.pace}/km</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: any;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        <Icon size={12} />
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="text-xl md:text-2xl font-bold tabular-nums text-slate-100">{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{unit}</div>
    </div>
  );
}
