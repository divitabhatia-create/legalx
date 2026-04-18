import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { CountUp } from "@/components/CountUp";
import { STAGE_FUNNEL, DEADLINES } from "@/data/cases";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { navigate } = useApp();
  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <div className="space-y-5 animate-fade-up">
      {bannerOpen && (
        <div className="bg-[#fffbeb] border border-[#fde68a] border-l-4 border-l-[#d97706] rounded-[11px] px-4 py-3 flex items-center gap-3">
          <span className="text-[13px] text-[#78350f]"><b>7 cases</b> are overdue for procedural steps.</span>
          <button onClick={() => navigate({ name: "deadlines" })} className="text-brand-blue text-[12.5px] font-semibold hover:underline">Review now →</button>
          <div className="flex-1" />
          <button onClick={() => setBannerOpen(false)} className="w-6 h-6 grid place-items-center rounded hover:bg-amber-100">
            <X className="w-3.5 h-3.5 text-[#92400e]" />
          </button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Kpi label="Total Active Cases" value={179} top="#1e4d8c" delta="▲ 8.3% vs last year" deltaTone="green" />
        <Kpi label="Avg Resolution" value={47} suffix=" days" top="#92400e" delta="▼ 3 days slower" deltaTone="red" />
        <Kpi label="Settlement Rate" value={23} suffix="%" top="#166534" delta="▲ 2.1% this quarter" deltaTone="green" />
        <Kpi label="Total Claim Value" value={842} prefix="₹" suffix=" Cr" top="#c0392b" delta="— Steady" deltaTone="grey" />
      </div>

      {/* Pipeline + Deadlines */}
      <div className="grid grid-cols-5 gap-4">
        <PipelineCard className="col-span-3" />
        <DeadlinesCard className="col-span-2" />
      </div>

      <HearingCalendarCard />

      <div className="grid grid-cols-2 gap-4">
        <AwardOutcomes />
        <RecentActivity />
      </div>
    </div>
  );
}

function Kpi({ label, value, prefix, suffix, top, delta, deltaTone }: { label: string; value: number; prefix?: string; suffix?: string; top: string; delta: string; deltaTone: "green" | "red" | "grey" }) {
  const tone = deltaTone === "green" ? "bg-brand-green-light text-brand-green-dark"
    : deltaTone === "red" ? "bg-brand-red-light text-brand-red-dark"
    : "bg-surface-subtle text-ink-muted";
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow overflow-hidden">
      <div className="h-[3px]" style={{ background: top }} />
      <div className="p-4">
        <div className="text-[11px] uppercase tracking-wide text-ink-muted font-semibold">{label}</div>
        <div className="mt-2 font-serif text-[28px] font-bold text-ink-body leading-none">
          <CountUp to={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className={cn("mt-3 inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold", tone)}>{delta}</div>
      </div>
    </div>
  );
}

function PipelineCard({ className }: { className?: string }) {
  const { navigate } = useApp();
  return (
    <div className={cn("bg-card border border-line-card rounded-[11px] card-shadow p-5", className)}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif font-bold text-[16px] text-ink-body">Case Pipeline</h3>
        <button onClick={() => navigate({ name: "cases" })} className="text-brand-blue text-[12px] font-semibold hover:underline">View all →</button>
      </div>
      <div className="text-[12px] text-ink-muted mb-4">Click any stage to filter cases</div>

      <div className="flex items-stretch -ml-1">
        {STAGE_FUNNEL.map((s, i) => (
          <button
            key={s.key}
            onClick={() => navigate({ name: "cases", stageFilter: s.key })}
            style={{
              background: s.color,
              clipPath: i === STAGE_FUNNEL.length - 1
                ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)"
                : "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
              marginLeft: i === 0 ? 0 : -8,
            }}
            className="flex-1 h-[78px] flex flex-col items-center justify-center text-white hover:brightness-110 transition cursor-pointer"
          >
            <div className="font-serif text-[22px] font-bold leading-none">{s.count}</div>
            <div className="text-[9.5px] font-semibold tracking-wide mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {STAGE_FUNNEL.map(s => (
          <div key={s.key} className="flex items-center gap-1.5 text-[11px] text-ink-light">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DeadlinesCard({ className }: { className?: string }) {
  const { navigate } = useApp();
  const items = DEADLINES.slice(0, 4);
  return (
    <div className={cn("bg-card border border-line-card rounded-[11px] card-shadow p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-bold text-[16px] text-ink-body">Upcoming Deadlines</h3>
        <button onClick={() => navigate({ name: "deadlines" })} className="text-brand-blue text-[12px] font-semibold hover:underline">View All</button>
      </div>
      <ul className="space-y-2">
        {items.map((d, i) => {
          const badge = d.daysOffset <= 0 && d.date === "Mar 7" ? "TODAY" : d.date === "Mar 8" ? "TOMORROW" : null;
          return (
            <li key={i} onClick={() => navigate({ name: "case", id: d.caseId })}
              className="bg-surface-input border border-line-card rounded-md p-3 cursor-pointer hover:bg-surface-subtle transition">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-brand-blue">{d.caseId}</span>
                {badge && <span className={cn("px-1.5 py-0.5 rounded text-[9.5px] font-bold",
                  badge === "TODAY" ? "bg-brand-red text-white" : "bg-brand-amber-light text-brand-amber-dark")}>{badge}</span>}
              </div>
              <div className="text-[12.5px] text-ink-body font-medium mt-0.5">{d.step}</div>
              <div className="text-[11px] text-ink-muted mt-0.5">{d.date} · {d.party}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { HearingCalendar } from "@/components/HearingCalendar";
function HearingCalendarCard() {
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow p-5">
      <h3 className="font-serif font-bold text-[16px] text-ink-body mb-3">Hearing Calendar</h3>
      <HearingCalendar />
    </div>
  );
}

function AwardOutcomes() {
  const segs = [
    { label: "Passed", value: 142, pct: 58.4, color: "#166534" },
    { label: "Reserved", value: 89, pct: 36.6, color: "#92400e" },
    { label: "Ex-parte", value: 12, pct: 4.9, color: "#c0392b" },
  ];
  const C = 2 * Math.PI * 60;
  let acc = 0;
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow p-5">
      <h3 className="font-serif font-bold text-[16px] text-ink-body">🏆 Award Outcomes</h3>
      <div className="text-[11.5px] text-ink-muted mb-4">FY 2025-26 · 243 awards</div>
      <div className="flex items-center gap-6">
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#eceae3" strokeWidth="22" />
          {segs.map(s => {
            const len = (s.pct / 100) * C;
            const dash = `${len} ${C - len}`;
            const off = -acc;
            acc += len;
            return <circle key={s.label} cx="80" cy="80" r="60" fill="none" stroke={s.color} strokeWidth="22" strokeDasharray={dash} strokeDashoffset={off} />;
          })}
          <text x="80" y="76" textAnchor="middle" className="fill-ink-body font-serif font-bold" fontSize="18" transform="rotate(90 80 80)">243</text>
          <text x="80" y="92" textAnchor="middle" className="fill-ink-muted" fontSize="10" transform="rotate(90 80 80)">Awards</text>
        </svg>
        <div className="flex-1 space-y-2">
          {segs.map(s => (
            <div key={s.label} className="flex items-center gap-2 text-[12.5px]">
              <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
              <span className="text-ink-body font-medium">{s.label}</span>
              <span className="text-ink-muted ml-auto">{s.value} ({s.pct}%)</span>
            </div>
          ))}
          <div className="mt-3 bg-brand-red-light border border-brand-red/20 rounded-md px-3 py-2 text-[12px] text-brand-red-dark">
            Challenged post-award: <b>31 cases (12.8%)</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  const items = [
    { icon: "📄", tone: "blue",  text: "Claimant filed SOC", caseId: "ARB-2024-044", time: "10 mins ago" },
    { icon: "✅", tone: "green", text: "Award Signed by J. Sharma", caseId: "ARB-2022-101", time: "2h ago" },
    { icon: "✉️", tone: "red",   text: "Notice issued under Sec 21", caseId: "ARB-2024-056", time: "Yesterday" },
    { icon: "📨", tone: "blue",  text: "Section 21 Notice served to M/s Infra Corp", caseId: "ARB-2025-017", time: "2h ago" },
    { icon: "🏆", tone: "green", text: "Final Award passed · ₹4.2 Cr", caseId: "ARB-2024-331", time: "5h ago" },
    { icon: "⚠️", tone: "red",   text: "Response to Sec 21 overdue by 2 days", caseId: "ARB-2024-089", time: "Yesterday" },
  ];
  const { navigate, cases } = useApp();
  const exists = (id: string) => cases.some(c => c.id === id);
  const tones: Record<string, string> = {
    blue: "bg-brand-blue-light", green: "bg-brand-green-light", red: "bg-brand-red-light",
  };
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow p-5">
      <h3 className="font-serif font-bold text-[16px] text-ink-body mb-3">Recent Activity</h3>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={cn("w-8 h-8 rounded-md grid place-items-center text-[14px]", tones[it.tone])}>{it.icon}</div>
            <div className="flex-1 min-w-0 text-[12.5px] text-ink-body">
              {it.text} ·{" "}
              <button
                disabled={!exists(it.caseId)}
                onClick={() => exists(it.caseId) && navigate({ name: "case", id: it.caseId })}
                className={cn("font-semibold", exists(it.caseId) ? "text-brand-blue hover:underline" : "text-ink-muted")}>
                {it.caseId}
              </button>
              <div className="text-[11px] text-ink-muted">{it.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
