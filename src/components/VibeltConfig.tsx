import { useEffect, useState, useRef } from "react";
import {
  Menu,
  X,
  Cpu,
  Bluetooth,
  Car,
  Bell,
  AlertTriangle,
  Activity,
  Flame,
  Timer,
  Volume2,
  Eye,
  Trees,
  Building2,
  Zap,
  LayoutDashboard,
  Sliders,
  History,
  Settings,
} from "lucide-react";

type Hazard = {
  id: number;
  time: string;
  type: string;
  direction: string;
  severity: "high" | "low";
  kind: "visual" | "audio";
};

const MOCK_DEVICES = [
  { id: "1", name: "Vibelt Pro-Belt v5", rssi: -42 },
  { id: "2", name: "Vibelt Band Lite", rssi: -67 },
  { id: "3", name: "Vibelt Runner X2", rssi: -78 },
];

const NAV_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Calibration", icon: Sliders },
  { label: "History", icon: History },
  { label: "Settings", icon: Settings },
];

const HAZARD_POOL: Omit<Hazard, "id" | "time">[] = [
  { type: "Car", direction: "Rear Right", severity: "high", kind: "visual" },
  { type: "Siren", direction: "Front Left", severity: "high", kind: "audio" },
  { type: "Cyclist", direction: "Rear Left", severity: "low", kind: "visual" },
  { type: "Horn", direction: "Front Right", severity: "high", kind: "audio" },
  { type: "Pedestrian", direction: "Front", severity: "low", kind: "visual" },
  { type: "Dog Bark", direction: "Mid Right", severity: "low", kind: "audio" },
];

const NODES = [
  { id: "FL", label: "Front L", side: "left" },
  { id: "FR", label: "Front R", side: "right" },
  { id: "ML", label: "Mid L", side: "left" },
  { id: "MR", label: "Mid R", side: "right" },
  { id: "RL", label: "Rear L", side: "rear" },
  { id: "RR", label: "Rear R", side: "rear" },
];

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function VibeltConfig() {
  // Connection
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState("");

  // Running stats
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState("6:15");
  const [calories, setCalories] = useState(0);

  // Hazards
  const [hazardLogs, setHazardLogs] = useState<Hazard[]>([]);
  const hazardId = useRef(0);

  // Settings
  const [sensitivity, setSensitivity] = useState<"city" | "park">("city");
  const [audioLevel, setAudioLevel] = useState(70);
  const [visualLevel, setVisualLevel] = useState(55);

  // Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calibration tests
  const [activeNodes, setActiveNodes] = useState<string[]>([]);

  // Live data
  useEffect(() => {
    if (!isConnected) return;
    const id = setInterval(() => {
      setDistance((d) => +(d + 0.01).toFixed(2));
      setCalories((c) => c + 1);
      const base = 375; // 6:15 in seconds
      const fluct = base + Math.floor((Math.random() - 0.5) * 16);
      const m = Math.floor(fluct / 60);
      const s = String(fluct % 60).padStart(2, "0");
      setPace(`${m}:${s}`);
    }, 3000);
    return () => clearInterval(id);
  }, [isConnected]);

  // Hazards
  useEffect(() => {
    if (!isConnected) return;
    const id = setInterval(() => {
      const pick = HAZARD_POOL[Math.floor(Math.random() * HAZARD_POOL.length)];
      hazardId.current += 1;
      const next: Hazard = { ...pick, id: hazardId.current, time: nowHHMM() };
      setHazardLogs((prev) => [next, ...prev].slice(0, 4));
    }, 10000);
    return () => clearInterval(id);
  }, [isConnected]);

  // Scan handling
  useEffect(() => {
    if (!showConnectModal || !isScanning) return;
    const t = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(t);
  }, [showConnectModal, isScanning]);

  const openScan = () => {
    setShowConnectModal(true);
    setIsScanning(true);
  };

  const connectTo = (name: string) => {
    setConnectedDeviceName(name);
    setIsConnected(true);
    setShowConnectModal(false);
    setIsScanning(false);
  };

  const disconnect = () => {
    setIsConnected(false);
    setConnectedDeviceName("");
    setDistance(0);
    setCalories(0);
    setHazardLogs([]);
  };

  const runTest = (side: "left" | "right" | "rear") => {
    const ids = NODES.filter((n) => n.side === side).map((n) => n.id);
    setActiveNodes((prev) => Array.from(new Set([...prev, ...ids])));
    setTimeout(() => {
      setActiveNodes((prev) => prev.filter((id) => !ids.includes(id)));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-md mx-auto px-4 pb-12 pt-4 relative">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Open menu"
              className="h-11 w-11 grid place-items-center rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-95 transition"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-bold tracking-tight">
              Vibelt <span className="text-cyan-400">Config</span>
            </h1>
          </div>

          {!isConnected ? (
            <button
              onClick={openScan}
              className="flex items-center gap-2 h-11 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm active:scale-95 transition shadow-lg shadow-cyan-500/20"
            >
              <Cpu size={18} />
              Connect Belt
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 h-11 px-3 rounded-full bg-slate-900 border border-slate-800">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
                <span className="text-xs font-medium text-slate-200 max-w-[110px] truncate">
                  {connectedDeviceName}
                </span>
              </div>
              <button
                onClick={disconnect}
                className="text-xs font-semibold text-rose-500 hover:text-rose-400 px-2 h-11"
              >
                Disconnect
              </button>
            </div>
          )}
        </header>

        {/* MENU DROPDOWN */}
        {isMenuOpen && (
          <div className="mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            {NAV_LINKS.map((l, i) => (
              <button
                key={l.label}
                onClick={() => setIsMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 h-12 text-sm font-medium text-slate-200 hover:bg-slate-800/60 transition ${
                  i > 0 ? "border-t border-slate-800" : ""
                }`}
              >
                <l.icon size={18} className="text-cyan-400" />
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* LIVE STATS BENTO */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Run
            </h2>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                isConnected
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {isConnected ? "Active" : "Idle"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Activity} label="Distance" value={distance.toFixed(2)} unit="km" />
            <Stat icon={Timer} label="Pace" value={pace} unit="/km" />
            <Stat icon={Flame} label="Calories" value={String(calories)} unit="kcal" />
          </div>
        </section>

        {/* SENSOR & HAPTIC */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Environment & Haptics
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <EnvButton
              active={sensitivity === "city"}
              onClick={() => setSensitivity("city")}
              icon={Building2}
              title="City"
              sub="High Sens"
            />
            <EnvButton
              active={sensitivity === "park"}
              onClick={() => setSensitivity("park")}
              icon={Trees}
              title="Park"
              sub="Low Sens"
            />
          </div>

          <div className="space-y-4">
            <SliderRow
              icon={Volume2}
              label="Audio Threats"
              value={audioLevel}
              onChange={setAudioLevel}
            />
            <SliderRow
              icon={Eye}
              label="Visual Threats"
              value={visualLevel}
              onChange={setVisualLevel}
            />
          </div>
        </section>

        {/* CALIBRATION */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Belt Calibration
            </h2>
            <span className="text-[10px] text-slate-500">Top-down view</span>
          </div>

          <div className="relative rounded-xl bg-slate-950/60 border border-slate-800 p-5 mb-4">
            {/* Belt shape */}
            <div className="relative h-36 mx-auto max-w-[260px]">
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-16 rounded-full border-2 border-dashed border-slate-700" />
              {/* Front row */}
              <NodeDot pos="top-2 left-6" id="FL" label="FL" active={activeNodes.includes("FL")} />
              <NodeDot pos="top-2 right-6" id="FR" label="FR" active={activeNodes.includes("FR")} />
              {/* Mid */}
              <NodeDot pos="top-1/2 -translate-y-1/2 left-0" id="ML" label="ML" active={activeNodes.includes("ML")} />
              <NodeDot pos="top-1/2 -translate-y-1/2 right-0" id="MR" label="MR" active={activeNodes.includes("MR")} />
              {/* Rear */}
              <NodeDot pos="bottom-2 left-6" id="RL" label="RL" active={activeNodes.includes("RL")} />
              <NodeDot pos="bottom-2 right-6" id="RR" label="RR" active={activeNodes.includes("RR")} />
              <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Front
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                Rear
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <TestBtn label="Test Left" onClick={() => runTest("left")} />
            <TestBtn label="Test Right" onClick={() => runTest("right")} />
            <TestBtn label="Test Rear" onClick={() => runTest("rear")} />
          </div>
        </section>

        {/* HAZARD LOG */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Real-time Hazard Log
            </h2>
            <span className="text-[10px] text-slate-500">{hazardLogs.length}/4</span>
          </div>

          {hazardLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <AlertTriangle size={28} className="mx-auto mb-2 opacity-40" />
              {isConnected
                ? "No hazards detected. All clear."
                : "Connect your belt to start monitoring."}
            </div>
          ) : (
            <ul className="space-y-2">
              {hazardLogs.map((h) => {
                const Icon = h.kind === "audio" ? Bell : Car;
                const isHigh = h.severity === "high";
                return (
                  <li
                    key={h.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      isHigh
                        ? "bg-rose-500/10 border-rose-500/30"
                        : "bg-slate-800/40 border-slate-800"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 grid place-items-center rounded-lg shrink-0 ${
                        isHigh ? "bg-rose-500/20 text-rose-500" : "bg-slate-700/50 text-cyan-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">{h.type}</span>
                        {isHigh && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500 text-white">
                            High
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{h.direction}</div>
                    </div>
                    <div className="text-xs font-mono text-slate-500">{h.time}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* CONNECT MODAL */}
      {showConnectModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setShowConnectModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100">Pair Vibelt</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="h-9 w-9 grid place-items-center rounded-lg hover:bg-slate-800 text-slate-400"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {isScanning ? (
              <div className="py-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                  <div className="relative h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 grid place-items-center">
                    <Bluetooth size={28} className="text-cyan-400 animate-spin" style={{ animationDuration: "2s" }} />
                  </div>
                </div>
                <p className="text-sm text-slate-300 font-medium">
                  Scanning for nearby Vibelt devices…
                </p>
                <p className="text-xs text-slate-500 mt-1">Make sure your belt is powered on.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-2">Available devices</p>
                {MOCK_DEVICES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => connectTo(d.name)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition text-left"
                  >
                    <div className="h-10 w-10 grid place-items-center rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Bluetooth size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-100">{d.name}</div>
                      <div className="text-xs text-slate-500">Signal {d.rssi} dBm</div>
                    </div>
                    <Zap size={16} className="text-slate-500" />
                  </button>
                ))}
                <button
                  onClick={() => setIsScanning(true)}
                  className="w-full mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 py-2"
                >
                  Rescan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
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
    <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-3">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        <Icon size={12} />
        <span className="text-[10px] uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums text-slate-100 leading-tight">
        {value}
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5">{unit}</div>
    </div>
  );
}

function EnvButton({
  active,
  onClick,
  icon: Icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  title: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition active:scale-[0.98] ${
        active
          ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
          : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
      }`}
    >
      <Icon size={20} />
      <div className="text-sm font-bold leading-none">{title}</div>
      <div className={`text-[10px] ${active ? "text-slate-900/80" : "text-slate-500"}`}>
        {sub}
      </div>
    </button>
  );
}

function SliderRow({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Icon size={14} className="text-cyan-400" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-semibold">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-slate-800 accent-cyan-500 cursor-pointer"
        style={{
          background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${value}%, rgb(30 41 59) ${value}%, rgb(30 41 59) 100%)`,
        }}
      />
    </div>
  );
}

function NodeDot({
  pos,
  label,
  active,
}: {
  pos: string;
  id: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className={`absolute ${pos} flex flex-col items-center gap-1`}>
      <div
        className={`h-9 w-9 rounded-full border-2 grid place-items-center transition-all duration-200 ${
          active
            ? "bg-cyan-500 border-cyan-300 shadow-lg shadow-cyan-500/50 scale-110"
            : "bg-slate-800 border-slate-700"
        }`}
      >
        <div
          className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-slate-600"}`}
        />
      </div>
      <span className="text-[9px] font-mono text-slate-500">{label}</span>
    </div>
  );
}

function TestBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 active:scale-95 transition"
    >
      {label}
    </button>
  );
}
