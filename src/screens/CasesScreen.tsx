import { useMemo, useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { STAGE_LABEL, Status } from "@/data/cases";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

const FILTERS: ("All" | Status)[] = ["All", "active", "overdue", "hold", "urgent"];

export function CasesScreen() {
  const { cases, view, navigate, setCreateOpen } = useApp();
  const stageFilter = view.name === "cases" ? view.stageFilter : undefined;
  const [pill, setPill] = useState<typeof FILTERS[number]>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => cases.filter(c => {
    if (stageFilter && c.stage !== stageFilter) return false;
    if (pill !== "All" && c.status !== pill) return false;
    if (q && !`${c.id} ${c.claimant} ${c.respondent}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [cases, stageFilter, pill, q]);

  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow p-5 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-serif font-bold text-[18px] text-ink-body">All Cases</h2>
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
                 className="w-[220px] h-9 pl-9 pr-3 rounded-md bg-surface-input text-[12.5px] outline-none border border-transparent focus:border-line-dark" />
        </div>
        <button onClick={() => setCreateOpen(true)} className="h-9 px-3 rounded-md bg-brand-red text-white text-[12.5px] font-semibold flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Case
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setPill(f)}
                  className={cn("h-7 px-3 rounded-full text-[11.5px] font-semibold capitalize transition",
                    pill === f ? "bg-ink-body text-white" : "bg-surface-input text-ink-light hover:bg-surface-subtle")}>
            {f}
          </button>
        ))}
        {stageFilter && (
          <span className="ml-2 inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-brand-red-light text-brand-red-dark text-[11.5px] font-semibold">
            Stage: {STAGE_LABEL[stageFilter]}
            <button onClick={() => navigate({ name: "cases" })}><X className="w-3 h-3" /></button>
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-md border border-line-card">
        <table className="w-full text-[12.5px]">
          <thead className="bg-surface-input">
            <tr className="text-[10.5px] uppercase tracking-wide text-ink-muted">
              {["Case ID", "Claimant", "Respondent", "Stage", "Claim Value", "Arbitrator", "Status"].map(h => (
                <th key={h} className="text-left px-3 py-2.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-card bg-card">
            {filtered.map(c => (
              <tr key={c.id} onClick={() => navigate({ name: "case", id: c.id })} className="cursor-pointer row-hover transition-colors">
                <td className="px-3 py-2.5 font-bold text-brand-blue">{c.id}</td>
                <td className="px-3 py-2.5 text-ink-body">{c.claimant}</td>
                <td className="px-3 py-2.5 text-ink-body">{c.respondent}</td>
                <td className="px-3 py-2.5 text-ink-light">{STAGE_LABEL[c.stage]}</td>
                <td className="px-3 py-2.5 font-semibold text-ink-body">{c.value}</td>
                <td className="px-3 py-2.5 text-ink-light">{c.arbitrator}</td>
                <td className="px-3 py-2.5"><StatusBadge status={c.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-ink-muted text-[12px]">No cases match.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-[11px] text-ink-muted">Showing {filtered.length} of {cases.length} cases</div>
    </div>
  );
}
