import { useState } from "react";
import { ArrowLeft, Copy, Check, ChevronRight, Download, FileText, User2, Phone, Mail,
  FileSignature, ScrollText, Receipt, Gavel, ClipboardList, Landmark, FileCheck2, Eye,
  UserPlus, Video, Users, Award as AwardIcon, RefreshCw, Bell, Paperclip } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { CaseRecord, Stage, TimelineEvent } from "@/data/cases";
import { StatusBadge } from "@/components/StatusBadge";
import { DocumentPreviewModal } from "@/components/DocumentPreviewModal";
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

      {/* Next Hearings */}
      <div>
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
/* ---------- DOCUMENTS ---------- */
const DOC_TYPE_STYLE: Record<string, { bg: string; fg: string; badge: string; icon: any; label: string }> = {
  loan_application: { bg: "bg-brand-blue-light/50",  fg: "text-brand-blue-dark",  badge: "bg-brand-blue-light text-brand-blue-dark",  icon: FileSignature, label: "Loan Application" },
  loan_agreement:   { bg: "bg-brand-purple-light/40", fg: "text-brand-purple",    badge: "bg-brand-purple-light text-brand-purple",   icon: ScrollText,    label: "Loan Agreement" },
  agreement:        { bg: "bg-brand-purple-light/40", fg: "text-brand-purple",    badge: "bg-brand-purple-light text-brand-purple",   icon: ScrollText,    label: "Agreement" },
  contract:         { bg: "bg-brand-purple-light/40", fg: "text-brand-purple",    badge: "bg-brand-purple-light text-brand-purple",   icon: ScrollText,    label: "Contract" },
  soa:              { bg: "bg-brand-amber-light/40",  fg: "text-brand-amber-dark", badge: "bg-brand-amber-light text-brand-amber-dark", icon: Receipt,      label: "Statement of Account" },
  lrn:              { bg: "bg-brand-green-light/40",  fg: "text-brand-green-dark", badge: "bg-brand-green-light text-brand-green-dark", icon: Bell,         label: "LRN" },
  notice:           { bg: "bg-brand-green-light/40",  fg: "text-brand-green-dark", badge: "bg-brand-green-light text-brand-green-dark", icon: Bell,         label: "Notice" },
  soc:              { bg: "bg-brand-red-light/40",    fg: "text-brand-red-dark",   badge: "bg-brand-red-light text-brand-red-dark",     icon: ClipboardList, label: "Statement of Claim" },
  sec17:            { bg: "bg-brand-red-light/40",    fg: "text-brand-red-dark",   badge: "bg-brand-red-light text-brand-red-dark",     icon: Gavel,        label: "Sec 17 Application" },
  order:            { bg: "bg-brand-red-light/40",    fg: "text-brand-red-dark",   badge: "bg-brand-red-light text-brand-red-dark",     icon: Gavel,        label: "Order" },
  expert:           { bg: "bg-brand-blue-light/40",   fg: "text-brand-blue-dark",  badge: "bg-brand-blue-light text-brand-blue-dark",   icon: FileText,     label: "Expert Report" },
  evidence:         { bg: "bg-brand-blue-light/40",   fg: "text-brand-blue-dark",  badge: "bg-brand-blue-light text-brand-blue-dark",   icon: FileText,     label: "Evidence" },
  arguments:        { bg: "bg-brand-amber-light/40",  fg: "text-brand-amber-dark", badge: "bg-brand-amber-light text-brand-amber-dark", icon: FileCheck2,   label: "Final Arguments" },
};
const DOC_FALLBACK = { bg: "bg-surface-input", fg: "text-ink-light", badge: "bg-surface-subtle text-ink-light", icon: FileText, label: "Document" };

function cleanDocName(raw: string, type: string) {
  // Strip leading LAN-like id + _LDCRIGHT_ or campaign prefix, replace underscores.
  let n = raw.replace(/^CRFLAN\d+_?/i, "").replace(/^LDCRIGHT_/i, "");
  n = n.replace(/_/g, " ").trim();
  if (!n || n.toLowerCase() === type.replace(/_/g, " ")) {
    n = (DOC_TYPE_STYLE[type]?.label || "Document");
  }
  return n.replace(/\b\w/g, s => s.toUpperCase());
}

function DocumentsTab({ c }: { c: CaseRecord }) {
  const [preview, setPreview] = useState<{ name: string; type: string } | null>(null);
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-3">📁 Case Documents {c.documents.length}</h3>
      {c.documents.length === 0 && (
        <div className="border border-dashed border-line-card rounded-[11px] p-8 text-center text-ink-muted text-[12.5px]">
          No documents uploaded for this case yet.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {c.documents.map((d, i) => {
          const style = DOC_TYPE_STYLE[d.type] || DOC_FALLBACK;
          const Icon = style.icon;
          const displayName = cleanDocName(d.name, d.type);
          return (
            <div key={i} className={cn("rounded-[11px] border border-line-card p-3.5 flex items-center gap-3", style.bg)}>
              <div className={cn("w-10 h-10 rounded-[9px] grid place-items-center bg-card border border-line-card", style.fg)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[13px] text-ink-body truncate">{displayName}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={cn("px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wide", style.badge)}>{style.label}</span>
                  <span className="text-[10.5px] text-ink-muted">PDF</span>
                </div>
              </div>
              <button
                onClick={() => setPreview({ name: displayName, type: style.label })}
                className="h-8 px-2.5 rounded-md bg-card border border-line-card text-ink-light text-[11.5px] font-semibold hover:bg-surface-subtle flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <a
                href="/sample-document.pdf" download={`${displayName}.pdf`}
                className="h-8 w-8 grid place-items-center rounded-md bg-card border border-line-card text-ink-light hover:bg-surface-subtle">
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
      <DocumentPreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        name={preview?.name || ""}
        type={preview?.type || ""}
      />
    </div>
  );
}

/* ---------- TIMELINE ---------- */
type EventKind = "assignment" | "order" | "hearing" | "award" | "status" | "notice" | "note";

function classifyEvent(t: TimelineEvent): EventKind {
  const e = (t.event + " " + (t.detail || "")).toLowerCase();
  if (/allocat|assign|appoint|arbitrator|officer/.test(e)) return "assignment";
  if (/award/.test(e)) return "award";
  if (/hearing|cross|argument|evidence/.test(e)) return "hearing";
  if (/order|sec\s?17|interim/.test(e)) return "order";
  if (/status|withdraw|hold|close|reopen/.test(e)) return "status";
  if (/notice|nta|sec\s?21|communication|sms|email/.test(e)) return "notice";
  return "note";
}

const KIND_META: Record<EventKind, { icon: any; color: string; bg: string; label: string }> = {
  assignment: { icon: UserPlus,    color: "#1a4d8c", bg: "#1a4d8c14", label: "Assignment" },
  order:      { icon: Gavel,       color: "#5c1f9e", bg: "#5c1f9e14", label: "Order / Document" },
  hearing:    { icon: Video,       color: "#0d6e6e", bg: "#0d6e6e14", label: "Hearing" },
  award:      { icon: AwardIcon,   color: "#166534", bg: "#16653414", label: "Award" },
  status:     { icon: RefreshCw,   color: "#92400e", bg: "#92400e14", label: "Status Change" },
  notice:     { icon: Bell,        color: "#c0392b", bg: "#c0392b14", label: "Notice" },
  note:       { icon: FileText,    color: "#5a3a1b", bg: "#5a3a1b14", label: "Note" },
};

// Detect an attached filename referenced in the event/detail
function extractAttachment(t: TimelineEvent): string | null {
  const src = `${t.event} ${t.detail || ""}`;
  const m = src.match(/([A-Za-z0-9_\-]+\.(pdf|docx?|jpg|png))/i);
  if (m) return m[1];
  const e = t.event.toLowerCase();
  if (/first order|interim award|final award|award|order/.test(e)) {
    return `${t.event.replace(/\s+/g, "_")}.pdf`;
  }
  return null;
}

// Detect meeting info in a hearing detail
function extractMeeting(t: TimelineEvent) {
  const src = `${t.event} ${t.detail || ""}`;
  const mode = /zoom|virtual|google meet|webex/i.test(src) ? "Zoom"
             : /in[-\s]?person|chamber|court|centre/i.test(src) ? "In-person" : null;
  const id = src.match(/(?:meeting\s*id[:\s]*)?(\d{3}[-\s]?\d{3,4}[-\s]?\d{3,4})/i);
  const client = src.match(/client[:\s]+([A-Z][A-Z\s]+)/);
  return { mode, meetingId: id?.[1] || null, client: client?.[1] || null };
}

function TimelineTab({ c }: { c: CaseRecord }) {
  const [preview, setPreview] = useState<{ name: string; type: string } | null>(null);
  return (
    <div>
      <h3 className="font-serif font-bold text-[15px] text-ink-body mb-4">🕐 Case Timeline</h3>
      {c.timeline.length === 0 && (
        <div className="border border-dashed border-line-card rounded-[11px] p-8 text-center text-ink-muted text-[12.5px]">
          No timeline events recorded.
        </div>
      )}
      <div className="relative pl-8">
        <div className="absolute left-[13px] top-2 bottom-2 w-[2px] bg-line-card" />
        <ul className="space-y-4">
          {c.timeline.map((t, i) => {
            const kind = classifyEvent(t);
            const meta = KIND_META[kind];
            const Icon = meta.icon;
            const isStatus = kind === "status";
            const attachment = !isStatus ? extractAttachment(t) : null;
            const meeting = kind === "hearing" ? extractMeeting(t) : null;

            return (
              <li key={i} className="relative">
                <span
                  className="absolute -left-[26px] top-2 w-7 h-7 rounded-full grid place-items-center border-2 border-card"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>

                {isStatus ? (
                  <div className="flex items-center gap-3 bg-card border border-line-card rounded-md px-3 py-2">
                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold" style={{ background: meta.bg, color: meta.color }}>
                      {meta.label}
                    </span>
                    <div className="text-[12.5px] font-semibold text-ink-body flex-1">{t.event}</div>
                    <div className="text-[11px] text-ink-muted">{t.ts}</div>
                  </div>
                ) : (
                  <div className="bg-card border border-line-card rounded-[10px] p-3.5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[13px] text-ink-body">{t.event}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold uppercase tracking-wide"
                                style={{ background: meta.bg, color: meta.color }}>
                            {meta.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-[11px] text-ink-muted shrink-0">{t.ts}</div>
                    </div>

                    {t.detail && (
                      <p className="mt-2 text-[12px] leading-relaxed text-ink-light whitespace-pre-wrap break-words">
                        {t.detail}
                      </p>
                    )}

                    {meeting && (meeting.mode || meeting.meetingId || meeting.client) && (
                      <div className="mt-2.5 grid grid-cols-3 gap-2">
                        {meeting.client && <Field icon={Users} label="Client" value={meeting.client} />}
                        {meeting.mode && <Field icon={Video} label="Mode" value={meeting.mode} />}
                        {meeting.meetingId && <Field icon={Video} label="Meeting ID" value={meeting.meetingId} />}
                      </div>
                    )}

                    {attachment && (
                      <button
                        onClick={() => setPreview({ name: attachment, type: meta.label })}
                        className="mt-2.5 inline-flex items-center gap-2 h-8 px-2.5 rounded-md border border-line-card bg-surface-input text-ink-body text-[11.5px] font-semibold hover:bg-surface-subtle"
                      >
                        <Paperclip className="w-3.5 h-3.5" style={{ color: meta.color }} />
                        <span className="truncate max-w-[240px]">{attachment}</span>
                        <Eye className="w-3.5 h-3.5 text-ink-muted" />
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <DocumentPreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        name={preview?.name || ""}
        type={preview?.type || ""}
      />
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-surface-input border border-line-card rounded-md px-2.5 py-1.5">
      <div className="flex items-center gap-1 text-[9.5px] uppercase tracking-wide text-ink-muted font-semibold">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="text-[12px] font-semibold text-ink-body truncate">{value}</div>
    </div>
  );
}
