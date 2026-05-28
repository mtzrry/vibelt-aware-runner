import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Hazard = {
  id: number;
  time: string;
  type: string;
  direction: string;
  severity: "high" | "low";
  kind: "visual" | "audio";
};

type BeltCtx = {
  // connection
  isConnected: boolean;
  isScanning: boolean;
  showConnectModal: boolean;
  connectedDeviceName: string;
  openScan: () => void;
  closeModal: () => void;
  rescan: () => void;
  connectTo: (name: string) => void;
  disconnect: () => void;

  // live data
  distance: number;
  pace: string;
  calories: number;

  // hazards
  hazardLogs: Hazard[];

  // settings
  sensitivity: "city" | "park";
  setSensitivity: (s: "city" | "park") => void;
  audioLevel: number;
  setAudioLevel: (n: number) => void;
  visualLevel: number;
  setVisualLevel: (n: number) => void;

  // calibration
  activeNodes: string[];
  runTest: (side: "left" | "right" | "rear") => void;
};

const Ctx = createContext<BeltCtx | null>(null);

const HAZARD_POOL: Omit<Hazard, "id" | "time">[] = [
  { type: "Car", direction: "Rear Right", severity: "high", kind: "visual" },
  { type: "Siren", direction: "Front Left", severity: "high", kind: "audio" },
  { type: "Cyclist", direction: "Rear Left", severity: "low", kind: "visual" },
  { type: "Horn", direction: "Front Right", severity: "high", kind: "audio" },
  { type: "Pedestrian", direction: "Front", severity: "low", kind: "visual" },
  { type: "Dog Bark", direction: "Mid Right", severity: "low", kind: "audio" },
];

const NODES = [
  { id: "FL", side: "left" },
  { id: "FR", side: "right" },
  { id: "ML", side: "left" },
  { id: "MR", side: "right" },
  { id: "RL", side: "rear" },
  { id: "RR", side: "rear" },
];

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function BeltProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState("");

  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState("6:15");
  const [calories, setCalories] = useState(0);

  const [hazardLogs, setHazardLogs] = useState<Hazard[]>([]);
  const hazardId = useRef(0);

  const [sensitivity, setSensitivity] = useState<"city" | "park">("city");
  const [audioLevel, setAudioLevel] = useState(70);
  const [visualLevel, setVisualLevel] = useState(55);

  const [activeNodes, setActiveNodes] = useState<string[]>([]);

  useEffect(() => {
    if (!isConnected) return;
    const id = setInterval(() => {
      setDistance((d) => +(d + 0.01).toFixed(2));
      setCalories((c) => c + 1);
      const base = 375;
      const fluct = base + Math.floor((Math.random() - 0.5) * 16);
      const m = Math.floor(fluct / 60);
      const s = String(fluct % 60).padStart(2, "0");
      setPace(`${m}:${s}`);
    }, 3000);
    return () => clearInterval(id);
  }, [isConnected]);

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

  useEffect(() => {
    if (!showConnectModal || !isScanning) return;
    const t = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(t);
  }, [showConnectModal, isScanning]);

  const openScan = () => {
    setShowConnectModal(true);
    setIsScanning(true);
  };
  const closeModal = () => setShowConnectModal(false);
  const rescan = () => setIsScanning(true);

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
    <Ctx.Provider
      value={{
        isConnected,
        isScanning,
        showConnectModal,
        connectedDeviceName,
        openScan,
        closeModal,
        rescan,
        connectTo,
        disconnect,
        distance,
        pace,
        calories,
        hazardLogs,
        sensitivity,
        setSensitivity,
        audioLevel,
        setAudioLevel,
        visualLevel,
        setVisualLevel,
        activeNodes,
        runTest,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useBelt() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBelt must be used within BeltProvider");
  return v;
}
