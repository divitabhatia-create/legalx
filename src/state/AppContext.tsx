import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CaseRecord, initialCases, Stage } from "@/data/cases";

export type View =
  | { name: "dashboard" }
  | { name: "cases"; stageFilter?: Stage }
  | { name: "deadlines" }
  | { name: "calendar" }
  | { name: "vendors" }
  | { name: "case"; id: string };

interface AppCtx {
  view: View;
  navigate: (v: View) => void;
  cases: CaseRecord[];
  addCase: (c: CaseRecord) => void;
  notifOpen: boolean;
  setNotifOpen: (b: boolean) => void;
  notifSeen: boolean;
  markNotifSeen: () => void;
  createOpen: boolean;
  setCreateOpen: (b: boolean) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>({ name: "dashboard" });
  const [cases, setCases] = useState<CaseRecord[]>(initialCases);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const navigate = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const addCase = useCallback((c: CaseRecord) => setCases(prev => [c, ...prev]), []);
  const markNotifSeen = useCallback(() => setNotifSeen(true), []);

  return (
    <Ctx.Provider value={{ view, navigate, cases, addCase, notifOpen, setNotifOpen, notifSeen, markNotifSeen, createOpen, setCreateOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
