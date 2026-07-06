import { useEffect } from "react";
import { X, TrendingUp, TrendingDown, Award, Users, Scale, Clock, CheckCircle2, MessageSquare } from "lucide-react";

interface Vendor {
  id: string; name: string; avatar: string; color: string;
  sec17: number; award: number; contested: number; exparte: number;
  engagement: number; settlement: number;
}

const PURPLE = "#5c1f9e";

export function VendorDetailModal({ vendor, onClose }: { vendor: Vendor | null; onClose: () => void }) {
  useEffect(() => {
    if (!vendor) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [vendor, onClose]);

  if (!vendor) return null;
  const v = vendor;

  // Derived breakdown (deterministic mock)
  const total = 40 + (v.sec17 * 3);
  const resolved = Math.round((total * v.settlement) / 100 + total * 0.15);
  const pending = total - resolved;
  const inHearing = Math.round(total * 0.35);
  const inNotice = total - inHearing - pending;

  const stats = [
    { label: "Sec 17 TAT", value: `${v.sec17} days`, icon: Clock, tone: "#1a4d8c", best: v.sec17 <= 8 },
    { label: "Award TAT", value: `${v.award} days`, icon: Award, tone: "#c0392b", best: v.award <= 40 },
    { label: "Borrower Engagement", value: `${v.engagement}%`, icon: MessageSquare, tone: PURPLE, best: v.engagement >= 75 },
    { label: "Settlement Rate", value: `${v.settlement}%`, icon: CheckCircle2, tone: "#0d6e6e", best: v.settlement >= 30 },
    { label: "Contested Awards", value: `${v.contested}%`, icon: Scale, tone: "#5a3a1b" },
    { label: "Ex-parte Awards", value: `${v.exparte}%`, icon: Users, tone: "#78350f" },
  ];

  const monthly = [12, 18, 22, 19, 26, 31, 28, 34, 30, 36, 41, 45];

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-[12px] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-line-card sticky top-0 bg-card z-10">
          <div className="w-11 h-11 rounded-[10px] grid place-items-center text-white font-bold text-[13px]" style={{ background: v.color }}>{v.avatar}</div>
          <div className="flex-1">
            <div className="font-serif font-bold text-[18px] text-ink-body">{v.name}</div>
            <div className="text-[11.5px] text-ink-muted">ODR Institution · Full performance breakdown</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded hover:bg-surface-input text-ink-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map(s => (
              <div key={s.label} className="border border-line-card rounded-[10px] p-3 bg-surface-input">
                <div className="flex items-center gap-2">
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.tone }} />
                  <div className="text-[10.5px] uppercase tracking-wide text-ink-muted font-semibold">{s.label}</div>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <div className="font-serif font-bold text-[20px] text-ink-body">{s.value}</div>
                  {s.best && <span className="px-1.5 py-0.5 rounded bg-brand-green-light text-brand-green-dark text-[9.5px] font-bold">BEST</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio breakdown */}
          <div className="border border-line-card rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-bold text-ink-body">Case Portfolio</div>
              <div className="text-[11px] text-ink-muted">{total} cases assigned</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Chip label="Resolved" value={resolved} color="#166534" />
              <Chip label="In Hearing" value={inHearing} color="#1a4d8c" />
              <Chip label="In Notice" value={Math.max(inNotice, 0)} color="#92400e" />
            </div>
          </div>

          {/* Monthly resolution sparkline */}
          <div className="border border-line-card rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[13px] font-bold text-ink-body">Monthly Resolutions</div>
              <div className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#166534" }}>
                <TrendingUp className="w-3.5 h-3.5" /> +18% QoQ
              </div>
            </div>
            <Sparkline data={monthly} color={v.color} />
            <div className="flex justify-between mt-2 text-[10px] text-ink-muted">
              <span>Apr</span><span>Jul</span><span>Oct</span><span>Mar</span>
            </div>
          </div>

          {/* Contested vs exparte bar */}
          <div className="border border-line-card rounded-[10px] p-4">
            <div className="text-[13px] font-bold text-ink-body mb-2">Award Composition</div>
            <div className="flex h-3 rounded-full overflow-hidden bg-surface-input">
              <div style={{ width: `${v.contested}%`, background: "#1a4d8c" }} />
              <div style={{ width: `${v.exparte}%`, background: "#cbc7be" }} />
            </div>
            <div className="flex justify-between mt-2 text-[11px]">
              <span style={{ color: "#1a4d8c" }} className="font-semibold">{v.contested}% contested</span>
              <span className="text-ink-muted font-semibold">{v.exparte}% ex-parte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md p-3" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
      <div className="font-serif font-bold text-[22px]" style={{ color }}>{value}</div>
      <div className="text-[10.5px] uppercase tracking-wide text-ink-muted font-semibold mt-0.5">{label}</div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 480, h = 60, pad = 4;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const [lx, ly] = pts.split(" ").pop()!.split(",").map(Number);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3.5" fill={color} />
    </svg>
  );
}
