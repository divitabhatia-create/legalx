import { useMemo, useState } from "react";
import { useApp } from "@/state/AppContext";
import { Hearing } from "@/data/cases";
import { cn } from "@/lib/utils";

const DAYS = [
  { date: "2026-03-03", label: "Tue 3" },
  { date: "2026-03-04", label: "Wed 4" },
  { date: "2026-03-05", label: "Thu 5" },
  { date: "2026-03-06", label: "Fri 6" },
  { date: "2026-03-07", label: "Sat 7" },
  { date: "2026-03-08", label: "Sun 8" },
  { date: "2026-03-09", label: "Mon 9" },
];

// Seeded hearings for the visible week so calendar is populated even when
// real case data has none. Case IDs point to real records in realCases.ts.
const SEEDED_HEARINGS: Hearing[] = [
  { id: "sh1", caseId: "CR//1//2026", date: "2026-03-03", time: "10:30 AM", hours: 1, type: "First Hearing",       mode: "VIRTUAL",   parties: "CredRight vs PESINGU KISHORE",       location: "Zoom · Meeting ID 823-1104-556" },
  { id: "sh2", caseId: "CR//4//2026", date: "2026-03-03", time: "3:00 PM",  hours: 1, type: "Sec 17 Application",  mode: "IN-PERSON", parties: "CredRight vs MERLA SRINIVAS",        location: "Delhi Arb Centre, Rm 3" },
  { id: "sh3", caseId: "CR//2//2026", date: "2026-03-04", time: "11:00 AM", hours: 2, type: "Cross-examination",   mode: "VIRTUAL",   parties: "CredRight vs MERLA SRINIVAS",        location: "Zoom · Meeting ID 940-2231-887" },
  { id: "sh4", caseId: "CR//5//2026", date: "2026-03-05", time: "2:30 PM",  hours: 1, type: "Statement Reading",   mode: "VIRTUAL",   parties: "CredRight vs Respondent",            location: "Zoom · Meeting ID 118-9034-221" },
  { id: "sh5", caseId: "CR//3//2026", date: "2026-03-06", time: "10:00 AM", hours: 2, type: "Cross-examination",   mode: "VIRTUAL",   parties: "CredRight vs Respondent",            location: "Zoom · Meeting ID 552-4488-013", notes: "Jurisdictional objection to be argued." },
  { id: "sh6", caseId: "CR//6//2026", date: "2026-03-06", time: "3:30 PM",  hours: 1, type: "Interim Order",       mode: "URGENT",    parties: "CredRight vs Respondent",            location: "High Court Annexe, Rm 7" },
  { id: "sh7", caseId: "CR//7//2026", date: "2026-03-07", time: "11:30 AM", hours: 1, type: "Final Arguments",     mode: "IN-PERSON", parties: "CredRight vs Respondent",            location: "Chamber 4, IHC" },
  { id: "sh8", caseId: "CR//9//2026", date: "2026-03-09", time: "10:00 AM", hours: 2, type: "Preliminary Hearing", mode: "VIRTUAL",   parties: "CredRight vs Respondent",            location: "Zoom · Meeting ID 671-8801-994" },
  { id: "sh9", caseId: "CR//8//2026", date: "2026-03-09", time: "2:00 PM",  hours: 1, type: "Award Delivery",      mode: "IN-PERSON", parties: "CredRight vs Respondent",            location: "Chamber 4, IHC" },
];

export function HearingCalendar({ standalone = false }: { standalone?: boolean }) {
  const { cases } = useApp();
  const allHearings = useMemo(() => cases.flatMap(c => c.hearings), [cases]);
  const [active, setActive] = useState("2026-03-06");

  const hearingsForDay = (d: string) => allHearings.filter(h => h.date === d);
  const dayHas = (d: string) => hearingsForDay(d).length > 0;

  const todays = hearingsForDay(active);
  const upcoming = todays.filter(h => !h.past);
  const past = todays.filter(h => h.past);

  return (
    <div>
      {standalone && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-bold text-[18px] text-ink-body">Hearing Calendar — Mar 3–9, 2026</h2>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 grid place-items-center rounded-md hover:bg-surface-input text-ink-muted">‹</button>
            <button className="w-8 h-8 grid place-items-center rounded-md hover:bg-surface-input text-ink-muted">›</button>
          </div>
        </div>
      )}
      {!standalone && (
        <div className="flex items-center gap-2 mb-3 text-[12px] text-ink-muted">
          <button className="px-1.5 hover:text-ink-body">‹</button>
          <span>Mar 3–9</span>
          <button className="px-1.5 hover:text-ink-body">›</button>
        </div>
      )}

      <div className="flex items-center gap-1 border-b border-line-card">
        {DAYS.map(d => (
          <button
            key={d.date}
            onClick={() => setActive(d.date)}
            className={cn(
              "relative px-3 h-9 text-[12.5px] font-medium transition-colors",
              active === d.date ? "text-ink-body" : "text-ink-muted hover:text-ink-body"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {d.label}
              {dayHas(d.date) && <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
            </span>
            {active === d.date && <span className="absolute left-2 right-2 bottom-0 h-[2.5px] bg-brand-red rounded-t" />}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-5">
        <Section label="UPCOMING HEARINGS" hearings={upcoming} />
        {past.length > 0 && <Section label="PAST HEARINGS" hearings={past} muted />}
        {todays.length === 0 && <div className="text-[12px] text-ink-muted py-6 text-center">No hearings scheduled.</div>}
      </div>
    </div>
  );
}

function Section({ label, hearings, muted }: { label: string; hearings: Hearing[]; muted?: boolean }) {
  if (hearings.length === 0) return null;
  return (
    <div className={cn(muted && "opacity-85")}>
      <div className="text-[10.5px] uppercase tracking-wide text-ink-muted font-semibold mb-2">{label}</div>
      <div className="space-y-2">{hearings.map(h => <HearingRow key={h.id} h={h} muted={muted} />)}</div>
    </div>
  );
}

function HearingRow({ h, muted }: { h: Hearing; muted?: boolean }) {
  const { navigate } = useApp();
  const isVirtual = h.mode === "VIRTUAL";
  return (
    <div className="bg-surface-input border border-line-card rounded-md p-3 flex items-center gap-4">
      <div className="w-16 text-center">
        <div className="font-serif text-[20px] font-light text-ink-light leading-none">{h.time.replace(" AM", "").replace(" PM", "")}</div>
        <div className="text-[10px] text-ink-muted mt-1">{h.hours} hr{h.hours > 1 ? "s" : ""}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate({ name: "case", id: h.caseId })} className="text-[12.5px] font-bold text-brand-blue hover:underline">{h.caseId}</button>
          <span className="text-[12px] text-ink-body truncate">{h.parties}</span>
          {muted && <span className="ml-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-brand-green-light text-brand-green-dark">✓ Done</span>}
        </div>
        <div className="text-[11px] text-ink-muted mt-0.5">
          {isVirtual ? "📹" : "📍"} {h.location}
          <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-surface-subtle text-ink-light text-[9.5px] font-semibold uppercase tracking-wide">{h.type}</span>
        </div>
      </div>
      {isVirtual ? (
        <a href={`https://meet.google.com/mock-${h.caseId}`} target="_blank" rel="noopener noreferrer"
           className="h-8 px-3 rounded-md bg-brand-blue text-white text-[12px] font-semibold flex items-center gap-1 hover:brightness-110">
          📹 Join
        </a>
      ) : (
        <button onClick={() => navigate({ name: "case", id: h.caseId })}
                className="h-8 px-3 rounded-md bg-surface-subtle text-ink-light text-[12px] font-semibold hover:bg-line-dark/40">
          👁 View
        </button>
      )}
    </div>
  );
}
