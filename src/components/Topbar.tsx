import { useEffect, useRef, useState } from "react";
import { Bell, Search, User, Plus, Upload } from "lucide-react";
import { useApp, View } from "@/state/AppContext";
import { cn } from "@/lib/utils";
import { UploadMisModal } from "@/components/UploadMisModal";

const NAV: { label: string; view: View }[] = [
  { label: "Dashboard", view: { name: "dashboard" } },
  { label: "Cases", view: { name: "cases" } },
  { label: "Deadlines", view: { name: "deadlines" } },
  { label: "Calendar", view: { name: "calendar" } },
];

const NOTIFICATIONS = [
  { icon: "⚠️", text: "ARB-2024-089 is 2 days overdue", time: "2h ago" },
  { icon: "🏆", text: "Final Award passed on ARB-2024-331", time: "5h ago" },
  { icon: "📅", text: "Hearing tomorrow: ARB-2025-017 at 4 PM", time: "1d ago" },
];

export function Topbar() {
  const { view, navigate, notifOpen, setNotifOpen, notifSeen, markNotifSeen, setCreateOpen } = useApp();
  const [misOpen, setMisOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen, setNotifOpen]);

  const isActive = (v: View) => {
    if (v.name === "cases") return view.name === "cases" || view.name === "case";
    return view.name === v.name;
  };

  return (
    <header className="sticky top-0 z-40 h-[52px] bg-card border-b border-line-card">
      <div className="h-full px-6 flex items-center gap-6">
        {/* Logo */}
        <button onClick={() => navigate({ name: "dashboard" })} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-brand-red text-white grid place-items-center font-serif font-bold text-sm">L</div>
          <span className="font-serif font-bold text-[17px] text-ink-body">LegalX</span>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-1 ml-2">
          {NAV.map(n => (
            <button
              key={n.label}
              onClick={() => navigate(n.view)}
              className={cn(
                "h-[52px] px-3 text-[13.5px] font-medium relative transition-colors",
                isActive(n.view) ? "text-ink-body" : "text-ink-light hover:text-ink-body"
              )}
            >
              {n.label}
              {isActive(n.view) && <span className="absolute left-3 right-3 bottom-0 h-[2.5px] bg-brand-red rounded-t" />}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <input
            placeholder="Search cases, parties..."
            className="w-[200px] h-9 pl-9 pr-3 rounded-md bg-surface-input text-[12.5px] text-ink-body placeholder:text-ink-muted outline-none border border-transparent focus:border-line-dark"
          />
        </div>

        <button
          onClick={() => setMisOpen(true)}
          className="h-9 px-3 rounded-md border border-line-card text-[12.5px] font-semibold text-ink-body flex items-center gap-1.5 hover:bg-surface-input transition"
        >
          <Upload className="w-3.5 h-3.5" /> Upload MIS Report
        </button>

        <button
          onClick={() => setCreateOpen(true)}
          className="h-9 px-4 rounded-md bg-brand-red text-white text-[12.5px] font-semibold flex items-center gap-1.5 hover:brightness-110 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Case
        </button>

        {/* Bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); markNotifSeen(); }}
            className="w-9 h-9 grid place-items-center rounded-md hover:bg-surface-input relative"
          >
            <Bell className="w-4 h-4 text-ink-light" />
            {!notifSeen && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-red" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 w-[340px] bg-card border border-line-card rounded-[11px] card-shadow overflow-hidden animate-fade-up z-50">
              <div className="px-4 py-3 border-b border-line-card text-[12px] font-semibold text-ink-body">Notifications</div>
              <ul className="divide-y divide-line-card">
                {NOTIFICATIONS.map((n, i) => (
                  <li key={i} className="px-4 py-3 hover:bg-surface-input cursor-pointer">
                    <div className="text-[13px] text-ink-body">{n.icon} {n.text}</div>
                    <div className="text-[11px] text-ink-muted mt-0.5">{n.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button className="w-9 h-9 grid place-items-center rounded-md hover:bg-surface-input">
          <User className="w-4 h-4 text-ink-light" />
        </button>
      </div>
    </header>
  );
}
