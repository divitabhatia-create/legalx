import { useState } from "react";
import { ArrowLeft, Copy, Check, ChevronRight, Download, FileText, User2, Phone, Mail } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { CaseRecord, Stage } from "@/data/cases";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Claimants", "Respondents", "Officers", "Documents", "Timeline"] as const;
type Tab = typeof TABS[number];

const PROC_NODES = ["Initiation", "Pleadings", "Discovery", "Hearing", "Award"];
const STAGE_TO_PROC: Record<Stage, number> = {
  lrn: 0, sec21: 1, claim: 2, ref: 2, sec17: 3, active: 3,
};
const STAGE_NODES: { key: Stage; label: string }[] = [
  { key: "lrn", label: "LRN Sent" },
  { key: "sec21", label: "Sec 21 Notice" },
  { key: "claim", label: "Statement of Claim" },
  { key: "ref", label: "Reference Letter" },
  { key: "sec17", label: "Sec 17 Order" },
  { key: "active", label: "Arbitration Active" },
];
const STAGE_ORDER: Stage[] = ["lrn", "sec21", "claim", "ref", "sec17", "active"];

export function CaseDetailScreen({ id }: { id: string }) {
  const { cases, navigate } = useApp();
  const c = cases.find(x => x.id === id);
  const [tab, setTab] = useState<Tab>("Overview");

  if (!c) {
    return (
      <div className="bg-card border border-line-card rounded-[11px] p-8 text-center">
        <p className="text-ink-muted">Case not found.</p>
        <button onClick={() => navigate({ name: "cases" })} className="mt-3 text-brand-blue font-semibold">← Back to Cases</button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <button onClick={() => navigate({ name: "cases" })} className="text-brand-blue text-[12.5px] font-semibold flex items-center gap-1 hover:underline">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
      </button>

      <CaseHeader c={c} />

      <div className="bg-card border border-line-card rounded-[11px] card-shadow">
        <div className="flex items-center gap-1 px-5 border-b border-line-card">
          {TABS.map(t => {
            const count = t === "Claimants" ? c.claimants.length
              : t === "Respondents" ? c.respondents.length
              : t === "Officers" ? c.officers.length
              : t === "Documents" ? c.documents.length
              : null;
            return (
              <button key={t} onClick={() => setTab(t)}
                      className={cn("relative h-11 px-3 text-[12.5px] font-medium transition-colors",
                        tab === t ? "text-ink-body font-bold" : "text-ink-muted hover:text-ink-body")}>
                {t}{count !== null ? ` ${count}` : ""}
                {tab === t && <span className="absolute left-2 right-2 bottom-0 h-[2.5px] bg-brand-purple rounded-t" />}
              </button>
            );
          })}
        </div>
        <div className="p-5">
          {tab === "Overview" && <OverviewTab c={c} />}
          {tab === "Claimants" && <ClaimantsTab c={c} />}
          {tab === "Respondents" && <RespondentsTab c={c} />}
          {tab === "Officers" && <OfficersTab c={c} />}
          {tab === "Documents" && <DocumentsTab c={c} />}
          {tab === "Timeline" && <TimelineTab c={c} />}
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }}
            className="w-5 h-5 grid place-items-center rounded hover:bg-surface-input text-ink-muted">
      {done ? <Check className="w-3 h-3 text-brand-green" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function CaseHeader({ c }: { c: CaseRecord }) {
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow p-5">
      <div className="flex items-start gap-3">
        <h1 className="font-serif font-bold text-[20px] text-brand-blue">{c.id}</h1>
        <CopyBtn text={c.id} />
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full bg-brand-amber-light text-brand-amber-dark text-[10.5px] font-bold">
          ● Generate Nta
        </span>
        <StatusBadge status={c.status} />
        <div className="flex-1" />
        <div className="text-[11px] text-ink-muted">📅 Created 02 Apr 2026, 4:10 PM</div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-[12px] text-ink-light">
        <span>👤 Customer: <b className="text-ink-body">{c.respondentFull}</b></span>
        <span>📞 {c.phone}</span>
      </div>

      <div className="mt-5 grid grid-cols-6 gap-3">
        <Meta icon="#" label="LAN" value={c.lan} copy />
        <Meta icon="📣" label="CAMPAIGN CODE" value={c.campaign} copy />
        <Meta icon="🏦" label="LENDER" value={c.lender} tint="amber" />
        <Meta icon="💰" label="DISPUTE AMOUNT" value={c.disputeAmt} tint="blue" />
        <Meta icon="⚖" label="CLAIM TYPE" value={c.claimType} />
        <Meta icon="📍" label="JURISDICTION" value={c.jurisdiction} />
      </div>
    </div>
  );
}

function Meta({ icon, label, value, copy, tint }: { icon: string; label: string; value: string; copy?: boolean; tint?: "amber" | "blue" }) {
  const tintClass = tint === "amber" ? "bg-brand-amber-light/40" : tint === "blue" ? "bg-brand-blue-light/50" : "bg-surface-input";
  const valueClass = tint === "blue" ? "text-brand-blue font-bold" : "text-ink-body font-semibold";
  return (
    <div className={cn("rounded-md p-2.5 border border-line-card", tintClass)}>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-ink-muted font-semibold">
        <span>{icon}</span> {label}
      </div>
      <div className="mt-1 flex items-center gap-1">
        <span className={cn("text-[12px] truncate", valueClass)}>{value}</span>
        {copy && <CopyBtn text={value} />}
      </div>
    </div>
  );
}

/* ---------- OVERVIEW ---------- */
function OverviewTab({ c }: { c: CaseRecord }) {
  const { navigate } = useApp();
  const procIdx = STAGE_TO_PROC[c.stage];
  const stageIdx = STAGE_ORDER.indexOf(c.stage);
  const latest = c.timeline[c.timeline.length - 1];

  // Find related deadline
  const dl = c.id === "ARB-2024-089"
    ? { title: "Sec 21 Response Due", desc: "Respondent must reply within 30 days.", days: -2 }
    : c.id === "ARB-2024-102" ? { title: "Statement of Claim", desc: "Claimant to file amended SOC.", days: -1 }
    : c.id === "ARB-2025-017" ? { title: "Interim Order Hearing", desc: "Reply to ex-parte order.", days: 5 }
    : { title: "Next procedural step", desc: "Awaiting party action.", days: 14 };

  const dlBadge = dl.days < 0
    ? { cls: "bg-brand-red text-white", text: `${Math.abs(dl.days)} Days Overdue` }
    : dl.days <= 3 ? { cls: "bg-brand-red text-white", text: `${dl.days} Days Left` }
    : dl.days <= 7 ? { cls: "bg-brand-amber-light text-brand-amber-dark", text: `${dl.days} Days Left` }
    : { cls: "bg-brand-green-light text-brand-green-dark", text: `${dl.days} Days Left` };

  const upcomingHearings = c.hearings.filter(h => !h.past);

  return (
    <div className="space-y-5">
      {/* Procedural Timeline */}
      <div>
        <div className="text-[10px] uppercase tracking-wide text-ink-muted font-semibold mb-3">PROCEDURAL TIMELINE</div>
        <div className="flex items-center">
          {PROC_NODES.map((label, i) => {
            const completed = i < procIdx;
            const active = i === procIdx;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={cn("w-7 h-7 rounded-full grid place-items-center transition",
                    completed ? "bg-brand-blue" : active ? "bg-card border-2 border-brand-blue" : "bg-surface-subtle border border-line-dark"
                  )}
                       style={active ? { boxShadow: "0 0 0 4px hsl(var(--brand-blue-light))" } : undefined}>
                    {completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    {active && <span className="w-2 h-2 rounded-full bg-brand-blue" />}
                    {!completed && !active && <span className="w-1.5 h-1.5 rounded-full bg-ink-xmuted" />}
                  </div>
                  <div className={cn("mt-2 text-[11px] font-semibold",
                    completed || active ? "text-brand-blue" : "text-ink-muted")}>{label}</div>
                </div>
                {i < PROC_NODES.length - 1 && (
                  <div className={cn("flex-1 h-[2px] mx-1 -mt-5", completed ? "bg-brand-blue" : "bg-line-dark")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Update */}
      <div className="border-l-[3px] border-brand-blue pl-3 py-1">
        <div className="text-[9.5px] uppercase tracking-wide text-ink-muted font-semibold">● LATEST UPDATE · {latest?.ts || "—"}</div>
        <p className="italic text-[13px] text-ink-light mt-1">"{latest?.detail || latest?.event || `Case is currently at ${STAGE_NODES[stageIdx]?.label} stage.`}"</p>
      </div>

      {/* Upcoming Deadline */}
      <div className="bg-surface-input border border-line-card rounded-[10px] p-4">
        <div className="flex items-center justify-between">
          <div className="text-[9.5px] uppercase tracking-wide text-ink-muted font-semibold">UPCOMING DEADLINE</div>
          <span className={cn("px-2 py-0.5 rounded-full text-[10.5px] font-bold", dlBadge.cls)}>{dlBadge.text}</span>
        </div>
        <div className="mt-2 font-bold text-[13px] text-ink-body">{dl.title}</div>
        <div className="text-[11.5px] text-ink-muted mt-0.5">{dl.desc}</div>
      </div>

      {/* Stage Tracker + Next Hearings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-ink-muted font-semibold mb-3">STAGE TRACKER</div>
          <div className="space-y-3">
            {STAGE_NODES.map((s, i) => {
              const completed = i < stageIdx;
              const active = i === stageIdx;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div className={cn("w-6 h-6 rounded-full grid place-items-center shrink-0",
                    completed ? "bg-brand-green" : active ? "bg-card border-2 border-brand-green" : "bg-surface-subtle border border-line-dark"
                  )}
                       style={active ? { boxShadow: "0 0 0 4px hsl(var(--brand-green-light))" } : undefined}>
                    {completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
                  </div>
                  <div className={cn("text-[12.5px]", completed || active ? "text-ink-body font-semibold" : "text-ink-muted")}>{s.label}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="h-8 px-3 rounded-md bg-brand-red text-white text-[11.5px] font-semibold">Update Stage</button>
            <button className="h-8 px-3 rounded-md text-ink-light text-[11.5px] font-semibold hover:bg-surface-input">Add Document</button>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wide text-ink-muted font-semibold mb-3">NEXT HEARINGS</div>
          <div className="space-y-2">
            {upcomingHearings.length === 0 && <div className="text-[12px] text-ink-muted">No upcoming hearings.</div>}
            {upcomingHearings.map(h => {
              const borderColor = h.mode === "VIRTUAL" ? "border-l-brand-blue"
                : h.mode === "URGENT" ? "border-l-brand-red" : "border-l-brand-green";
              return (
                <div key={h.id} className={cn("bg-surface-input border border-line-card border-l-[3px] rounded-md p-3", borderColor)}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-[12.5px] text-ink-body">{h.type}</div>
                    <span className="px-1.5 py-0.5 rounded bg-card text-ink-light text-[9.5px] font-semibold uppercase">{h.mode}</span>
                  </div>
                  <div className="text-[11.5px] text-ink-muted mt-1">📅 {h.date} 🕐 {h.time}</div>
                  {h.mode === "VIRTUAL" && (
                    <a href={`https://meet.google.com/mock-${h.caseId}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-brand-blue text-[11.5px] font-semibold hover:underline">📹 Join Meeting →</a>
                  )}
                  {h.mode === "IN-PERSON" && <div className="mt-1 text-[11px] text-ink-muted">📍 Delhi Arb Centre, Rm 3</div>}
                  {h.mode === "URGENT" && <div className="mt-1 text-[11px] text-ink-muted">📍 High Court Annexe, Rm 7</div>}
                  {h.notes && <div className="mt-1.5 inline-block bg-surface-subtle px-2 py-1 rounded text-[10.5px] text-ink-muted">{h.notes}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-line-card">
        <button onClick={() => navigate({ name: "cases" })} className="h-9 px-4 rounded-md text-ink-light text-[12.5px] font-semibold hover:bg-surface-input">Close</button>
        <button className="h-9 px-4 rounded-md bg-brand-blue text-white text-[12.5px] font-semibold">📋 View Full Dossier</button>
      </div>
    </div>
  );
}

/* ---------- PARTIES ---------- */
function PartyCard({ p, tone, role }: { p: any; tone: "green" | "purple" | "blue"; role?: string }) {
  const map = {
    green: { bg: "bg-brand-green-light/30", border: "border-brand-green/20", pill: "bg-brand-green-light text-brand-green-dark", avatar: "bg-brand-green-light text-brand-green-dark" },
    purple: { bg: "bg-brand-purple-light/40", border: "border-brand-purple/20", pill: "bg-brand-purple-light text-brand-purple", avatar: "bg-brand-purple-light text-brand-purple" },
    blue: { bg: "bg-brand-blue-light/40", border: "border-brand-blue/20", pill: "bg-brand-blue-light text-brand-blue-dark", avatar: "bg-brand-blue text-white" },
  }[tone];
  const initials = p.name.split(" ").slice(0, 2).map((s: string) => s[0]).join("");
  return (
    <div className={cn("rounded-[11px] border p-4", map.bg, map.border)}>
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-full grid place-items-center font-bold text-[13px]", map.avatar)}>
          {tone === "blue" ? initials : <User2 className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[13.5px] text-ink-body">{p.name}</span>
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", map.pill)}>{role || p.role}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium", map.pill)}>
              <Mail className="w-3 h-3" /> {p.email}
            </span>
            <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium", map.pill)}>
              <Phone className="w-3 h-3" /> {p.phone}
            </span>
          </div>
          {p.address && <div className="mt-2 text-[11.5px] text-ink-light">📍 {p.address}</div>}
          {p.bankDetails && (
            <button className="mt-2 flex items-center gap-1 text-[11.5px] text-ink-light font-semibold hover:text-ink-body">
              🏦 Bank Details <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
function ClaimantsTab({ c }: { c: CaseRecord }) {
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-3">👥 Claimants {c.claimants.length}</h3>
      <div className="space-y-3">{c.claimants.map((p, i) => <PartyCard key={i} p={p} tone="green" />)}</div>
    </div>
  );
}
function RespondentsTab({ c }: { c: CaseRecord }) {
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-3">👥 Respondents {c.respondents.length}</h3>
      <div className="space-y-3">{c.respondents.map((p, i) => <PartyCard key={i} p={p} tone="purple" />)}</div>
    </div>
  );
}
function OfficersTab({ c }: { c: CaseRecord }) {
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-3">⚖️ Officers {c.officers.length}</h3>
      <div className="space-y-3">{c.officers.map((p, i) => <PartyCard key={i} p={p} tone="blue" role={p.role} />)}</div>
    </div>
  );
}

/* ---------- DOCUMENTS ---------- */
function DocumentsTab({ c }: { c: CaseRecord }) {
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-3">📁 Case Documents {c.documents.length}</h3>
      <ul className="rounded-md border border-line-card overflow-hidden">
        {c.documents.map((d, i) => (
          <li key={i} className={cn("flex items-center gap-3 px-3 py-2.5", i % 2 === 0 ? "bg-card" : "bg-surface-input")}>
            <div className="w-8 h-8 rounded bg-brand-red-light grid place-items-center">
              <FileText className="w-4 h-4 text-brand-red-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[12.5px] text-ink-body truncate">{d.name}</div>
              <div className="text-[11px] text-ink-muted">{d.type} · N/A · N/A</div>
            </div>
            <button className="w-7 h-7 grid place-items-center rounded hover:bg-surface-subtle text-ink-muted">
              <Download className="w-4 h-4" />
            </button>
          </li>
        ))}
        {c.documents.length === 0 && <li className="px-4 py-6 text-center text-ink-muted text-[12px]">No documents.</li>}
      </ul>
    </div>
  );
}

/* ---------- TIMELINE ---------- */
function TimelineTab({ c }: { c: CaseRecord }) {
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-3">🕐 Case Timeline</h3>
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-[2px] bg-brand-purple/40" />
        <ul className="space-y-3">
          {c.timeline.map((t, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[18px] top-3 w-3 h-3 rounded-full border-2 border-brand-purple bg-card grid place-items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
              </span>
              <div className="bg-card border border-line-card rounded-md p-3">
                <div className="flex items-start gap-3">
                  <div className="font-bold text-[12.5px] text-ink-body flex-1">{t.event}</div>
                  <div className="text-[11px] text-ink-muted shrink-0">{t.ts}</div>
                </div>
                {t.detail && <div className="mt-1 text-[11.5px] text-ink-light">{t.detail}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
