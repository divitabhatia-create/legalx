import { useMemo, useState, useRef } from "react";
import { X, Check, Upload, Download, TrendingUp, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/CountUp";
import { cn } from "@/lib/utils";

const PURPLE = "#5c1f9e";

type MetricKey = "sec17" | "award" | "engagement" | "resolution";

interface Vendor {
  id: string;
  initials: string;
  name: string;
  type: string;
  location: string;
  est: string;
  used: number;
  capacity: number;
  badge: { label: string; color: string };
  color: string;
  note: string;
  sec17: number;
  award: number;
  engagement: number;
  resolution: number;
  contested: number;
  exparte: number;
  trends: Record<MetricKey, number[]>;
}

const VENDORS: Vendor[] = [
  {
    id: "AM", initials: "AM", name: "Akshai Mani & Associates", type: "Arbitration Firm",
    location: "Delhi / Hyderabad / Mumbai", est: "Est. 2011",
    used: 320, capacity: 420, badge: { label: "Top Performer", color: "#16a34a" }, color: "#1a4d8c",
    note: "Strong on enforcement and Section 17 turnaround across metro benches.",
    sec17: 7, award: 38, engagement: 74, resolution: 82, contested: 31, exparte: 69,
    trends: {
      sec17: [10, 9, 8, 7, 7, 7], award: [52, 48, 44, 41, 39, 38],
      engagement: [61, 65, 68, 71, 73, 74], resolution: [70, 73, 76, 79, 81, 82],
    },
  },
  {
    id: "BK", initials: "BK", name: "B M Kushalappa Legal", type: "Independent Arbitrator",
    location: "Bengaluru / Chennai", est: "Est. 2008",
    used: 320, capacity: 380, badge: { label: "Experienced", color: "#2563eb" }, color: "#0d6e6e",
    note: "Deep south-India experience; balanced contested vs ex-parte mix.",
    sec17: 11, award: 51, engagement: 62, resolution: 76, contested: 44, exparte: 56,
    trends: {
      sec17: [14, 13, 12, 12, 11, 11], award: [60, 57, 55, 53, 52, 51],
      engagement: [54, 56, 58, 60, 61, 62], resolution: [68, 70, 72, 74, 75, 76],
    },
  },
  {
    id: "TJ", initials: "TJ", name: "Tejavathi J Law Chambers", type: "Arbitration Firm",
    location: "Hyderabad / Vijayawada", est: "Est. 2015",
    used: 220, capacity: 300, badge: { label: "Fast TAT", color: "#d97706" }, color: "#8a4e00",
    note: "Fastest interim relief disposal; ideal for time-critical recoveries.",
    sec17: 6, award: 34, engagement: 58, resolution: 71, contested: 27, exparte: 73,
    trends: {
      sec17: [9, 8, 7, 6, 6, 6], award: [48, 44, 40, 37, 35, 34],
      engagement: [50, 52, 54, 56, 57, 58], resolution: [62, 64, 66, 68, 70, 71],
    },
  },
  {
    id: "MD", initials: "MD", name: "Meridian Dispute Resolution", type: "ADR Institution",
    location: "Mumbai / Delhi / Pune", est: "Est. 2006",
    used: 180, capacity: 500, badge: { label: "Premium", color: PURPLE }, color: PURPLE,
    note: "Highest resolution rate with institutional governance and audit trail.",
    sec17: 13, award: 58, engagement: 83, resolution: 91, contested: 61, exparte: 39,
    trends: {
      sec17: [18, 16, 15, 14, 13, 13], award: [70, 66, 63, 61, 59, 58],
      engagement: [72, 75, 77, 79, 81, 83], resolution: [82, 84, 86, 88, 90, 91],
    },
  },
];

const METRIC_META: Record<MetricKey, { label: string; short: string; unit: string; better: "lower" | "higher"; color: string; tint: string; desc: string }> = {
  sec17: { label: "Section 17 TAT", short: "Sec 17 TAT", unit: "days", better: "lower", color: "#0d9488", tint: "#ccfbf1", desc: "Avg days to interim relief order" },
  award: { label: "Award TAT", short: "Award TAT", unit: "days", better: "lower", color: "#1d4ed8", tint: "#dbeafe", desc: "Avg days to final award" },
  engagement: { label: "Borrower Engagement", short: "Engagement", unit: "%", better: "higher", color: "#d97706", tint: "#fef3c7", desc: "Borrowers responding to notice" },
  resolution: { label: "Resolution Rate", short: "Resolution", unit: "%", better: "higher", color: "#16a34a", tint: "#dcfce7", desc: "Cases ending in recovery / settlement" },
};

const bestVendorFor = (k: MetricKey, vendors: Vendor[]) => {
  const vals = vendors.map(v => v[k] as number);
  return METRIC_META[k].better === "lower" ? Math.min(...vals) : Math.max(...vals);
};

function Sparkline({ data, color, width = 90, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = pts[pts.length - 1].split(",");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.join(" ")} />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

function FillBar({ value, max, color, better }: { value: number; max: number; color: string; better: "lower" | "higher" }) {
  const pct = better === "lower" ? Math.max(8, 100 - (value / max) * 100) : (value / max) * 100;
  return (
    <div className="h-1 rounded-full bg-surface-input overflow-hidden mt-1.5">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Avatar({ initials, color, size = 40 }: { initials: string; color: string; size?: number }) {
  return (
    <div className="rounded-md grid place-items-center text-white font-serif font-bold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}>
      {initials}
    </div>
  );
}

interface ResolutionRecord { name: string; lan: string; amount: number; type: "settlement" | "withdrawal" | "award_executed" }

export function VendorsScreen() {
  const [sortBy, setSortBy] = useState<MetricKey>("resolution");
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [records, setRecords] = useState<ResolutionRecord[]>([]);
  const [resOverrides, setResOverrides] = useState<Record<string, number>>({});

  const vendors = useMemo(() => {
    const list = VENDORS.map(v => ({ ...v, resolution: resOverrides[v.id] ?? v.resolution }));
    const m = METRIC_META[sortBy];
    return [...list].sort((a, b) => m.better === "lower" ? (a[sortBy] - b[sortBy]) : (b[sortBy] - a[sortBy]));
  }, [sortBy, resOverrides]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 3 ? prev : [...prev, id]);
  };

  const totalCases = 215;
  const hasUpload = records.length > 0;

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif font-bold text-[28px] text-ink-body leading-tight">Vendor Orchestration</h1>
          <p className="text-[13px] text-ink-muted mt-1">Compare arbitration vendors · Assign cases · Track performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setUploadOpen(true)}
            className="h-9 px-4 rounded-md text-white text-[12.5px] font-semibold flex items-center gap-1.5 hover:brightness-110 transition"
            style={{ background: PURPLE }}>
            <Upload className="w-3.5 h-3.5" /> Upload Resolution Data
          </button>
          {hasUpload && (
            <button onClick={() => setLedgerOpen(true)}
              className="h-9 px-4 rounded-md bg-brand-green text-white text-[12.5px] font-semibold hover:brightness-110 transition">
              Settlement Ledger
            </button>
          )}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        <Kpi label="Active Vendors" value={4} top={PURPLE} />
        <Kpi label="Avg Section 17 TAT" value={9} suffix=" days" top="#0d9488" />
        <Kpi label="Avg Award TAT" value={45} suffix=" days" top="#1d4ed8" />
        <Kpi label="Platform Resolution" value={80} suffix="%" top="#16a34a" />
      </div>

      {/* Sort tabs + compare button */}
      <div className="flex items-center justify-between bg-card border border-line-card rounded-[11px] card-shadow px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] uppercase tracking-wide text-ink-muted font-semibold mr-1">Sort by</span>
          {(Object.keys(METRIC_META) as MetricKey[]).map(k => {
            const m = METRIC_META[k];
            const active = sortBy === k;
            return (
              <button key={k} onClick={() => setSortBy(k)}
                className={cn("h-8 px-3 rounded-full text-[12px] font-semibold transition border")}
                style={active
                  ? { background: m.color, color: "white", borderColor: m.color }
                  : { background: "transparent", color: "hsl(var(--text-light))", borderColor: "hsl(var(--border-card))" }}>
                {m.short}
              </button>
            );
          })}
        </div>
        {selected.length >= 2 && (
          <button onClick={() => setCompareOpen(true)}
            className="h-9 px-4 rounded-md text-white text-[12.5px] font-semibold hover:brightness-110 transition"
            style={{ background: PURPLE }}>
            Compare {selected.length} Vendors →
          </button>
        )}
      </div>

      {/* Vendor cards 2-col grid */}
      <div className="grid grid-cols-2 gap-4">
        {vendors.map(v => (
          <VendorCard key={v.id} vendor={v} allVendors={vendors} sortBy={sortBy}
            selected={selected.includes(v.id)} onToggle={() => toggleSelect(v.id)} />
        ))}
      </div>

      {compareOpen && (
        <CompareModal vendors={vendors.filter(v => selected.includes(v.id))}
          onClose={() => setCompareOpen(false)}
          onAssign={() => { setCompareOpen(false); setAssignOpen(true); }} />
      )}
      {assignOpen && (
        <AssignModal vendors={vendors.filter(v => selected.includes(v.id))} totalCases={totalCases}
          onClose={() => setAssignOpen(false)} />
      )}
      {uploadOpen && (
        <UploadModal onClose={() => setUploadOpen(false)}
          onConfirm={(recs) => {
            setRecords(prev => [...prev, ...recs]);
            // bump resolution rates slightly across vendors
            const bump: Record<string, number> = {};
            VENDORS.forEach((v, i) => { bump[v.id] = Math.min(99, (resOverrides[v.id] ?? v.resolution) + 1 + (i % 2)); });
            setResOverrides(bump);
            setUploadOpen(false);
          }} />
      )}
      {ledgerOpen && (
        <LedgerModal records={records} onClose={() => setLedgerOpen(false)} />
      )}
    </div>
  );
}

function Kpi({ label, value, suffix, top }: { label: string; value: number; suffix?: string; top: string }) {
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow overflow-hidden">
      <div className="h-[3px]" style={{ background: top }} />
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-wide text-ink-muted font-semibold">{label}</div>
        <div className="mt-2 font-serif text-[28px] font-bold text-ink-body leading-none">
          <CountUp to={value} suffix={suffix} />
        </div>
      </div>
    </div>
  );
}

function VendorCard({ vendor: v, allVendors, sortBy, selected, onToggle }: {
  vendor: Vendor; allVendors: Vendor[]; sortBy: MetricKey; selected: boolean; onToggle: () => void;
}) {
  const [trendsOpen, setTrendsOpen] = useState(false);
  const capPct = (v.used / v.capacity) * 100;
  const capColor = capPct <= 60 ? "#16a34a" : capPct <= 70 ? "#d97706" : capPct > 85 ? "#dc2626" : "#d97706";
  const metricKeys: MetricKey[] = ["sec17", "award", "engagement", "resolution"];

  return (
    <div className={cn("bg-card border rounded-[11px] card-shadow p-5 transition", selected ? "border-2" : "border-line-card")}
      style={selected ? { borderColor: PURPLE } : undefined}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar initials={v.initials} color={v.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-bold text-[15px] text-ink-body">{v.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-white"
              style={{ background: v.badge.color }}>{v.badge.label}</span>
          </div>
          <div className="text-[11.5px] text-ink-muted mt-0.5">{v.type} · {v.location} · {v.est}</div>
        </div>
        <button onClick={onToggle}
          className={cn("w-5 h-5 rounded border-2 grid place-items-center transition shrink-0",
            selected ? "text-white" : "bg-card")}
          style={{ borderColor: selected ? PURPLE : "hsl(var(--border-dark))", background: selected ? PURPLE : undefined }}>
          {selected && <Check className="w-3 h-3" />}
        </button>
      </div>

      {/* Capacity */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11.5px] mb-1">
          <span className="text-ink-muted font-semibold uppercase tracking-wide text-[10.5px]">Capacity</span>
          <span className="text-ink-body font-semibold">{v.used}/{v.capacity} cases</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-input overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${capPct}%`, background: capColor }} />
        </div>
      </div>

      {/* Metrics grid 2x2 */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {metricKeys.map(k => {
          const m = METRIC_META[k];
          const best = bestVendorFor(k, allVendors);
          const isBest = v[k] === best;
          const isSorted = sortBy === k;
          const maxVal = Math.max(...allVendors.map(x => x[k] as number));
          return (
            <div key={k} className="rounded-md p-3 border border-line-card"
              style={isSorted ? { background: m.tint + "60" } : undefined}>
              <div className="flex items-start justify-between gap-1">
                <div className="text-[9.5px] uppercase tracking-wide text-ink-muted font-bold leading-tight">{m.short}</div>
                {isBest && (
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold text-white" style={{ background: "#16a34a" }}>BEST</span>
                )}
              </div>
              {k === "resolution" && (
                <div className="text-[9.5px] mt-0.5 font-semibold flex items-center gap-1" style={{ color: PURPLE }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} /> Lender verified
                </div>
              )}
              <div className="flex items-end justify-between mt-1">
                <div className="font-serif text-[22px] font-light text-ink-body leading-none">
                  {v[k]}<span className="text-[11px] text-ink-muted ml-0.5">{m.unit}</span>
                </div>
                <Sparkline data={v.trends[k]} color={m.color} width={60} height={22} />
              </div>
              <FillBar value={v[k] as number} max={maxVal} color={m.color} better={m.better} />
            </div>
          );
        })}
      </div>

      {/* Contested vs Ex-parte */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-ink-muted font-semibold uppercase tracking-wide text-[10.5px]">Contested vs Ex-parte</span>
          <span>
            <span className="font-bold" style={{ color: "#1d4ed8" }}>{v.contested}%</span>
            <span className="text-ink-muted"> / </span>
            <span className="font-bold text-ink-muted">{v.exparte}%</span>
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex">
          <div style={{ width: `${v.contested}%`, background: "#1d4ed8" }} />
          <div style={{ width: `${v.exparte}%`, background: "#cbd5e1" }} />
        </div>
        <p className="text-[11px] text-ink-muted mt-2">
          {v.contested >= 50
            ? "High respondent engagement. Lower Section 34 risk."
            : "High ex-parte rate. Monitor for Section 34 challenges."}
        </p>
      </div>

      {/* Footer note + trends */}
      <div className="mt-4 pt-3 border-t border-line-card">
        <p className="text-[11.5px] text-ink-muted italic">{v.note}</p>
        <button onClick={() => setTrendsOpen(o => !o)}
          className="mt-2 text-[12px] font-semibold hover:underline" style={{ color: PURPLE }}>
          Trends {trendsOpen ? "↑" : "↓"}
        </button>
        {trendsOpen && (
          <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-up">
            {metricKeys.map(k => {
              const m = METRIC_META[k];
              const arr = v.trends[k];
              const delta = arr[arr.length - 1] - arr[0];
              const improved = m.better === "lower" ? delta < 0 : delta > 0;
              return (
                <div key={k} className="rounded-md bg-surface-input p-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wide text-ink-muted font-bold">
                    <span>{m.short}</span>
                    <span className={cn("flex items-center gap-0.5 font-bold", improved ? "text-brand-green" : "text-brand-red")}>
                      {improved ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(delta)}{m.unit}
                    </span>
                  </div>
                  <div className="mt-1"><Sparkline data={arr} color={m.color} width={140} height={32} /></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Compare Modal ---------- */

function CompareModal({ vendors, onClose, onAssign }: { vendors: Vendor[]; onClose: () => void; onAssign: () => void }) {
  const metricKeys: MetricKey[] = ["sec17", "award", "engagement", "resolution"];
  return (
    <ModalShell onClose={onClose} maxWidth={860}>
      <div className="p-5 border-b border-line-card flex items-start gap-4">
        <RadarChart vendors={vendors} />
        <div className="flex-1">
          <h2 className="font-serif font-bold text-[20px] text-ink-body">Vendor Comparison</h2>
          <p className="text-[12px] text-ink-muted mt-0.5">Side-by-side performance across {vendors.length} vendors</p>
          <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${vendors.length}, 1fr)` }}>
            {vendors.map(v => (
              <div key={v.id} className="flex items-center gap-2">
                <Avatar initials={v.initials} color={v.color} size={32} />
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-ink-body truncate">{v.name}</div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-white" style={{ background: v.badge.color }}>{v.badge.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto">
        {metricKeys.map(k => {
          const m = METRIC_META[k];
          const best = bestVendorFor(k, vendors);
          const maxVal = Math.max(...vendors.map(x => x[k] as number));
          return (
            <div key={k} className="grid gap-3 items-center" style={{ gridTemplateColumns: `220px repeat(${vendors.length}, 1fr)` }}>
              <div>
                <div className="text-[13px] font-semibold text-ink-body">{m.label}</div>
                <div className="text-[11px] text-ink-muted">{m.desc}</div>
                {k === "resolution" && (
                  <div className="text-[10.5px] font-semibold mt-0.5 flex items-center gap-1" style={{ color: PURPLE }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} /> Lender-verified
                  </div>
                )}
              </div>
              {vendors.map(v => {
                const isBest = v[k] === best;
                return (
                  <div key={v.id}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-[22px] font-light text-ink-body leading-none">{v[k]}<span className="text-[11px] text-ink-muted">{m.unit}</span></span>
                      {isBest && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ background: "#16a34a" }}>BEST</span>}
                    </div>
                    <FillBar value={v[k] as number} max={maxVal} color={m.color} better={m.better} />
                    <div className="mt-1"><Sparkline data={v.trends[k]} color={m.color} width={120} height={24} /></div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="grid gap-3 items-start pt-3 border-t border-line-card" style={{ gridTemplateColumns: `220px repeat(${vendors.length}, 1fr)` }}>
          <div>
            <div className="text-[13px] font-semibold text-ink-body">Contested vs Ex-parte</div>
            <div className="text-[11px] text-ink-muted">Borrower participation mix</div>
          </div>
          {vendors.map(v => (
            <div key={v.id}>
              <div className="text-[12px]">
                <span className="font-bold" style={{ color: "#1d4ed8" }}>{v.contested}%</span>
                <span className="text-ink-muted"> / {v.exparte}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex mt-1">
                <div style={{ width: `${v.contested}%`, background: "#1d4ed8" }} />
                <div style={{ width: `${v.exparte}%`, background: "#cbd5e1" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-line-card flex items-center gap-3">
        <p className="text-[11px] text-ink-muted italic flex-1">Resolution rate sourced from lender-uploaded data only.</p>
        <button onClick={onClose} className="h-9 px-4 rounded-md text-[12.5px] font-semibold text-ink-light hover:bg-surface-input">Close</button>
        <button onClick={onAssign} className="h-9 px-4 rounded-md text-white text-[12.5px] font-semibold hover:brightness-110" style={{ background: PURPLE }}>
          Assign Cases →
        </button>
      </div>
    </ModalShell>
  );
}

function RadarChart({ vendors }: { vendors: Vendor[] }) {
  const metricKeys: MetricKey[] = ["sec17", "award", "engagement", "resolution"];
  const axes = [...metricKeys, "contested" as const];
  const size = 160, cx = size / 2, cy = size / 2, R = 60;
  const norm = (k: typeof axes[number], v: Vendor) => {
    if (k === "sec17") return 1 - Math.min(1, v.sec17 / 20);
    if (k === "award") return 1 - Math.min(1, v.award / 70);
    if (k === "engagement") return v.engagement / 100;
    if (k === "resolution") return v.resolution / 100;
    return v.contested / 100;
  };
  const angle = (i: number) => -Math.PI / 2 + (i / axes.length) * Math.PI * 2;
  const point = (i: number, r: number) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r];
  return (
    <svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} fill="none" stroke="hsl(var(--border-card))" strokeWidth="1"
          points={axes.map((_, i) => point(i, R * s).join(",")).join(" ")} />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="hsl(var(--border-card))" strokeWidth="1" />;
      })}
      {vendors.map(v => {
        const pts = axes.map((k, i) => point(i, R * norm(k, v)).join(","));
        return <polygon key={v.id} points={pts.join(" ")} fill={v.color} fillOpacity={0.18} stroke={v.color} strokeWidth="1.5" />;
      })}
    </svg>
  );
}

/* ---------- Assign Modal ---------- */

function AssignModal({ vendors, totalCases, onClose }: { vendors: Vendor[]; totalCases: number; onClose: () => void }) {
  const [mode, setMode] = useState<"equal" | "custom" | "perf">("equal");
  const [custom, setCustom] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    const per = Math.floor(totalCases / vendors.length);
    vendors.forEach((v, i) => o[v.id] = i === vendors.length - 1 ? totalCases - per * (vendors.length - 1) : per);
    return o;
  });
  const [done, setDone] = useState(false);

  const counts = useMemo(() => {
    if (mode === "equal") {
      const per = Math.floor(totalCases / vendors.length);
      const rem = totalCases - per * vendors.length;
      return vendors.reduce((acc, v, i) => ({ ...acc, [v.id]: per + (i < rem ? 1 : 0) }), {} as Record<string, number>);
    }
    if (mode === "perf") {
      const sum = vendors.reduce((s, v) => s + v.resolution, 0);
      const raw = vendors.map(v => Math.floor((v.resolution / sum) * totalCases));
      const rem = totalCases - raw.reduce((a, b) => a + b, 0);
      raw[0] += rem;
      return vendors.reduce((acc, v, i) => ({ ...acc, [v.id]: raw[i] }), {} as Record<string, number>);
    }
    return custom;
  }, [mode, vendors, totalCases, custom]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const valid = total === totalCases;

  if (done) {
    return (
      <ModalShell onClose={onClose} maxWidth={520}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-green-light grid place-items-center mx-auto">
            <Check className="w-8 h-8 text-brand-green-dark" />
          </div>
          <h2 className="font-serif font-bold text-[22px] text-ink-body mt-4">Cases Assigned Successfully</h2>
          <p className="text-[13px] text-ink-muted mt-2">
            {totalCases} cases distributed across {vendors.length} vendors. Each vendor will receive a notification.
          </p>
          <button onClick={onClose} className="mt-6 h-10 px-6 rounded-md text-white text-[13px] font-semibold hover:brightness-110" style={{ background: PURPLE }}>Done</button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose} maxWidth={620}>
      <div className="p-5 border-b border-line-card">
        <h2 className="font-serif font-bold text-[20px] text-ink-body">Assign Cases</h2>
        <p className="text-[12px] text-ink-muted mt-0.5">Distribute {totalCases} cases across {vendors.length} vendors</p>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          {(["equal", "custom", "perf"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={cn("h-9 px-4 rounded-md text-[12.5px] font-semibold transition border")}
              style={mode === m
                ? { background: PURPLE, color: "white", borderColor: PURPLE }
                : { borderColor: "hsl(var(--border-card))", color: "hsl(var(--text-light))" }}>
              {m === "equal" ? "Equal Split" : m === "custom" ? "Custom Split" : "By Performance"}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {vendors.map(v => (
            <div key={v.id} className="flex items-center gap-3 p-3 rounded-md border border-line-card">
              <Avatar initials={v.initials} color={v.color} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink-body truncate">{v.name}</div>
                <div className="text-[11px] text-ink-muted">Capacity: {v.used}/{v.capacity}</div>
              </div>
              {mode === "custom" ? (
                <input type="number" min={0} value={custom[v.id]}
                  onChange={(e) => setCustom(prev => ({ ...prev, [v.id]: Number(e.target.value) || 0 }))}
                  className="w-24 h-9 px-3 rounded-md bg-surface-input text-[13px] text-ink-body text-right outline-none border border-line-card focus:border-line-dark" />
              ) : (
                <div className="font-serif text-[20px] font-bold text-ink-body">{counts[v.id]}<span className="text-[11px] text-ink-muted ml-1">cases</span></div>
              )}
            </div>
          ))}
        </div>
        {mode === "custom" && !valid && (
          <p className="text-[12px] text-brand-red-dark">Total must equal {totalCases} (currently {total}).</p>
        )}
      </div>
      <div className="p-4 border-t border-line-card flex justify-end gap-3">
        <button onClick={onClose} className="h-9 px-4 rounded-md text-[12.5px] font-semibold text-ink-light hover:bg-surface-input">Cancel</button>
        <button disabled={!valid} onClick={() => setDone(true)}
          className="h-9 px-4 rounded-md text-white text-[12.5px] font-semibold hover:brightness-110 disabled:opacity-50"
          style={{ background: PURPLE }}>Confirm Assignment →</button>
      </div>
    </ModalShell>
  );
}

/* ---------- Upload Modal ---------- */

function UploadModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (recs: ResolutionRecord[]) => void }) {
  const [step, setStep] = useState<"upload" | "preview" | "processing" | "success">("upload");
  const [parsed, setParsed] = useState<ResolutionRecord[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const COLUMNS = [
    { name: "name", desc: "Full borrower name", example: "RAMESH KUMAR" },
    { name: "lan", desc: "Loan account number", example: "CRFLAN100015091" },
    { name: "amount_paid", desc: "Amount recovered (₹)", example: "245000" },
    { name: "type", desc: "settlement / withdrawal / award_executed", example: "settlement" },
  ];

  const parseCSV = (text: string) => {
    const lines = text.trim().split(/\r?\n/);
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const idx = { name: header.indexOf("name"), lan: header.indexOf("lan"), amount: header.indexOf("amount_paid"), type: header.indexOf("type") };
    const recs: ResolutionRecord[] = [];
    const errs: string[] = [];
    lines.slice(1).forEach((line, i) => {
      if (!line.trim()) return;
      const cols = line.split(",").map(c => c.trim());
      const name = cols[idx.name], lan = cols[idx.lan], amt = Number(cols[idx.amount]), type = cols[idx.type] as ResolutionRecord["type"];
      if (!name || !lan) { errs.push(`Row ${i + 2}: missing name or LAN`); return; }
      if (!amt || isNaN(amt)) { errs.push(`Row ${i + 2}: invalid amount_paid`); return; }
      if (!["settlement", "withdrawal", "award_executed"].includes(type)) { errs.push(`Row ${i + 2}: invalid type "${type}"`); return; }
      recs.push({ name, lan, amount: amt, type });
    });
    setParsed(recs); setErrors(errs); setStep("preview");
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => parseCSV(String(e.target?.result || ""));
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv = "name,lan,amount_paid,type\nRAMESH KUMAR,CRFLAN100015091,245000,settlement\nANITA SHARMA,CRFLAN100015092,180000,withdrawal\nVIJAY MEHTA,CRFLAN100015093,420000,award_executed\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "resolution_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const typeCounts = useMemo(() => ({
    settlement: parsed.filter(r => r.type === "settlement").length,
    withdrawal: parsed.filter(r => r.type === "withdrawal").length,
    award_executed: parsed.filter(r => r.type === "award_executed").length,
  }), [parsed]);
  const total = parsed.reduce((s, r) => s + r.amount, 0);

  const confirm = () => {
    setStep("processing");
    setTimeout(() => setStep("success"), 1400);
  };

  return (
    <ModalShell onClose={onClose} maxWidth={760}>
      <div className="p-5 border-b border-line-card">
        <h2 className="font-serif font-bold text-[20px] text-ink-body">Upload Resolution Data</h2>
        <p className="text-[12px] text-ink-muted mt-0.5">Upload CSV to refresh vendor resolution rates</p>
      </div>

      <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[12px] uppercase tracking-wide font-bold text-ink-muted">Required CSV Format</h3>
            <button onClick={downloadTemplate}
              className="text-[12px] font-semibold flex items-center gap-1 hover:underline" style={{ color: PURPLE }}>
              <Download className="w-3.5 h-3.5" /> Download Template
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {COLUMNS.map(c => (
              <div key={c.name} className="rounded-md border border-line-card p-3 bg-surface-input">
                <div className="font-mono text-[12px] font-bold text-ink-body">{c.name}</div>
                <div className="text-[11px] text-ink-muted mt-1">{c.desc}</div>
                <div className="text-[10.5px] text-ink-light mt-1 italic">e.g. {c.example}</div>
              </div>
            ))}
          </div>
        </div>

        {step === "upload" && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed rounded-[11px] p-10 text-center cursor-pointer hover:bg-surface-input transition"
            style={{ borderColor: PURPLE }}>
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: PURPLE }} />
            <div className="text-[14px] font-semibold text-ink-body">Drop your CSV here or click to browse</div>
            <div className="text-[11.5px] text-ink-muted mt-1">Supports .csv files</div>
            <input ref={inputRef} type="file" accept=".csv" hidden
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Chip color="#16a34a" bg="#dcfce7" label={`Valid rows: ${parsed.length}`} />
              {errors.length > 0 && <Chip color="#dc2626" bg="#fee2e2" label={`Errors: ${errors.length}`} />}
              <Chip color={PURPLE} bg="#f3e8ff" label={`Total: ₹${total.toLocaleString("en-IN")}`} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Chip color="#16a34a" bg="#dcfce7" label={`Settlement: ${typeCounts.settlement}`} />
              <Chip color="#d97706" bg="#fef3c7" label={`Withdrawal: ${typeCounts.withdrawal}`} />
              <Chip color="#1d4ed8" bg="#dbeafe" label={`Award Executed: ${typeCounts.award_executed}`} />
            </div>
            {errors.length > 0 && (
              <div className="rounded-md border border-brand-red/30 bg-brand-red-light p-3">
                <div className="text-[12px] font-bold text-brand-red-dark mb-1">Errors</div>
                <ul className="text-[11.5px] text-brand-red-dark space-y-0.5">
                  {errors.slice(0, 5).map((e, i) => <li key={i}>· {e}</li>)}
                </ul>
              </div>
            )}
            <div className="rounded-md border border-line-card overflow-hidden">
              <table className="w-full text-[12px]">
                <thead className="bg-surface-input">
                  <tr className="text-left text-[10.5px] uppercase tracking-wide text-ink-muted">
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">LAN</th>
                    <th className="px-3 py-2 font-semibold">Amount Paid</th>
                    <th className="px-3 py-2 font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.slice(0, 8).map((r, i) => (
                    <tr key={i} className="border-t border-line-card">
                      <td className="px-3 py-2 text-ink-body">{r.name}</td>
                      <td className="px-3 py-2 font-mono text-[11px] text-ink-light">{r.lan}</td>
                      <td className="px-3 py-2 font-bold text-brand-green-dark">₹{r.amount.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-2"><TypePill type={r.type} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-8 text-center space-y-3">
            <div className="text-[14px] font-semibold text-ink-body">Matching LANs · Calculating resolution rates · Updating vendor metrics...</div>
            <div className="w-full h-2 rounded-full bg-surface-input overflow-hidden">
              <div className="h-full rounded-full animate-pulse" style={{ width: "75%", background: PURPLE }} />
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-green-light grid place-items-center mx-auto">
              <Check className="w-8 h-8 text-brand-green-dark" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[20px] text-ink-body">Upload Complete</h3>
              <p className="text-[12px] text-ink-muted mt-1">Resolution rates have been updated across all vendor cards</p>
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              <Chip color="#16a34a" bg="#dcfce7" label={`Settlement: ${typeCounts.settlement}`} />
              <Chip color="#d97706" bg="#fef3c7" label={`Withdrawal: ${typeCounts.withdrawal}`} />
              <Chip color="#1d4ed8" bg="#dbeafe" label={`Award Exec: ${typeCounts.award_executed}`} />
            </div>
            <div className="font-serif text-[24px] font-bold" style={{ color: PURPLE }}>₹{total.toLocaleString("en-IN")}</div>
            <div className="text-[11px] text-ink-muted">Total amount recovered</div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-line-card flex justify-end gap-3">
        {step === "preview" && (
          <>
            <button onClick={() => setStep("upload")} className="h-9 px-4 rounded-md text-[12.5px] font-semibold text-ink-light hover:bg-surface-input">← Re-upload</button>
            <button onClick={confirm} disabled={parsed.length === 0}
              className="h-9 px-4 rounded-md text-white text-[12.5px] font-semibold hover:brightness-110 disabled:opacity-50"
              style={{ background: PURPLE }}>
              Confirm &amp; Update Resolution Rates ({parsed.length} records) →
            </button>
          </>
        )}
        {step === "success" && (
          <button onClick={() => onConfirm(parsed)}
            className="h-9 px-4 rounded-md text-white text-[12.5px] font-semibold hover:brightness-110"
            style={{ background: PURPLE }}>View Updated Metrics →</button>
        )}
        {(step === "upload" || step === "processing") && (
          <button onClick={onClose} className="h-9 px-4 rounded-md text-[12.5px] font-semibold text-ink-light hover:bg-surface-input">Cancel</button>
        )}
      </div>
    </ModalShell>
  );
}

function Chip({ label, color, bg }: { label: string; color: string; bg: string }) {
  return <span className="px-3 py-1 rounded-full text-[12px] font-semibold" style={{ color, background: bg }}>{label}</span>;
}
function TypePill({ type }: { type: ResolutionRecord["type"] }) {
  const m = {
    settlement: { c: "#16a34a", bg: "#dcfce7", l: "Settlement" },
    withdrawal: { c: "#d97706", bg: "#fef3c7", l: "Withdrawal" },
    award_executed: { c: "#1d4ed8", bg: "#dbeafe", l: "Award Executed" },
  }[type];
  return <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wide" style={{ color: m.c, background: m.bg }}>{m.l}</span>;
}

/* ---------- Settlement Ledger Modal ---------- */

function LedgerModal({ records, onClose }: { records: ResolutionRecord[]; onClose: () => void }) {
  const [filter, setFilter] = useState<"all" | ResolutionRecord["type"]>("all");
  const filtered = filter === "all" ? records : records.filter(r => r.type === filter);
  const total = records.reduce((s, r) => s + r.amount, 0);
  const settle = records.filter(r => r.type === "settlement").length;
  const withd = records.filter(r => r.type === "withdrawal").length;

  return (
    <ModalShell onClose={onClose} maxWidth={860}>
      <div className="p-5 border-b border-line-card">
        <h2 className="font-serif font-bold text-[20px] text-ink-body">Settlement Ledger</h2>
        <p className="text-[12px] text-ink-muted mt-0.5">All lender-verified resolution records</p>
      </div>
      <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          <MiniStat label="Total Records" value={records.length.toString()} />
          <MiniStat label="Total Recovered" value={`₹${total.toLocaleString("en-IN")}`} color={PURPLE} />
          <MiniStat label="Settlements" value={settle.toString()} color="#16a34a" />
          <MiniStat label="Withdrawals" value={withd.toString()} color="#d97706" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "settlement", "withdrawal", "award_executed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("h-8 px-3 rounded-full text-[12px] font-semibold border transition")}
              style={filter === f
                ? { background: PURPLE, color: "white", borderColor: PURPLE }
                : { borderColor: "hsl(var(--border-card))", color: "hsl(var(--text-light))" }}>
              {f === "all" ? "All Records" : f === "award_executed" ? "Award Executed" : f === "settlement" ? "Settlement" : "Withdrawal"}
            </button>
          ))}
        </div>
        <div className="rounded-md border border-line-card overflow-hidden">
          <table className="w-full text-[12.5px]">
            <thead className="bg-surface-input">
              <tr className="text-left text-[10.5px] uppercase tracking-wide text-ink-muted">
                <th className="px-3 py-2 font-semibold">Borrower Name</th>
                <th className="px-3 py-2 font-semibold">LAN</th>
                <th className="px-3 py-2 font-semibold">Amount Paid</th>
                <th className="px-3 py-2 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="border-t border-line-card">
                  <td className="px-3 py-2 text-ink-body">{r.name}</td>
                  <td className="px-3 py-2 font-mono text-[11.5px] text-ink-light">{r.lan}</td>
                  <td className="px-3 py-2 font-bold text-brand-green-dark">₹{r.amount.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2"><TypePill type={r.type} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-ink-muted text-[12px]">No records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 border-t border-line-card flex justify-end">
        <button onClick={onClose} className="h-9 px-4 rounded-md text-[12.5px] font-semibold text-ink-light hover:bg-surface-input">Close</button>
      </div>
    </ModalShell>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-md border border-line-card p-3 bg-surface-input">
      <div className="text-[10px] uppercase tracking-wide text-ink-muted font-bold">{label}</div>
      <div className="font-serif text-[20px] font-bold mt-1" style={{ color: color || "hsl(var(--text-body))" }}>{value}</div>
    </div>
  );
}

/* ---------- Modal shell ---------- */

function ModalShell({ children, onClose, maxWidth = 720 }: { children: React.ReactNode; onClose: () => void; maxWidth?: number }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 animate-fade-up" onClick={onClose}>
      <div className="bg-card rounded-[14px] card-shadow w-full overflow-hidden relative" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-md hover:bg-surface-input z-10">
          <X className="w-4 h-4 text-ink-light" />
        </button>
        {children}
      </div>
    </div>
  );
}
