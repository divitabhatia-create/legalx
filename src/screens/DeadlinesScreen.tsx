import { useApp } from "@/state/AppContext";
import { DEADLINES } from "@/data/cases";
import { cn } from "@/lib/utils";

export function DeadlinesScreen() {
  const { navigate } = useApp();
  const sorted = [...DEADLINES].sort((a, b) => a.daysOffset - b.daysOffset);

  const overdue = sorted.filter(d => d.daysOffset < 0);
  const week = sorted.filter(d => d.daysOffset >= 0 && d.daysOffset <= 7);
  const upcoming = sorted.filter(d => d.daysOffset > 7);

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="grid grid-cols-3 gap-4">
        <Summary count={overdue.length} label="Overdue" tone="red" />
        <Summary count={week.length} label="Due This Week" tone="amber" />
        <Summary count={upcoming.length} label="Upcoming" tone="green" />
      </div>

      <div className="bg-card border border-line-card rounded-[11px] card-shadow p-4">
        <h3 className="font-serif font-bold text-[16px] text-ink-body mb-3">All Deadlines</h3>
        <ul className="space-y-1.5">
          {sorted.map((d, i) => {
            const tone = d.daysOffset < 0 ? "red" : d.daysOffset <= 7 ? "amber" : "green";
            const dot = tone === "red" ? "bg-brand-red" : tone === "amber" ? "bg-brand-amber" : "bg-brand-green";
            const dateColor = tone === "red" ? "text-brand-red" : tone === "amber" ? "text-brand-amber" : "text-brand-green";
            return (
              <li key={i} onClick={() => navigate({ name: "case", id: d.caseId })}
                  className="bg-surface-input border border-line-card rounded-md px-3 py-3 flex items-center gap-3 cursor-pointer transition hover:translate-x-[3px] hover:shadow-md">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", dot)} />
                <span className="font-bold text-brand-blue text-[12.5px] w-[120px]">{d.caseId}</span>
                <span className="flex-1 text-[12.5px] text-ink-body">{d.step}</span>
                <span className="w-[140px] text-[12px] text-ink-muted">{d.party}</span>
                <span className={cn("w-[60px] text-[12px] font-semibold", dateColor)}>{d.date}</span>
                <span className="w-[80px] text-right text-[11.5px] text-ink-muted">
                  {d.daysOffset < 0 ? `${Math.abs(d.daysOffset)}d overdue` : `in ${d.daysOffset}d`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Summary({ count, label, tone }: { count: number; label: string; tone: "red" | "amber" | "green" }) {
  const map = {
    red:   { bg: "bg-brand-red-light", text: "text-brand-red-dark" },
    amber: { bg: "bg-brand-amber-light", text: "text-brand-amber-dark" },
    green: { bg: "bg-brand-green-light", text: "text-brand-green-dark" },
  }[tone];
  return (
    <div className={cn("rounded-[11px] border border-line-card p-5", map.bg)}>
      <div className={cn("font-serif font-light text-[44px] leading-none", map.text)}>{count}</div>
      <div className={cn("mt-2 text-[12.5px] font-semibold uppercase tracking-wide", map.text)}>{label}</div>
    </div>
  );
}
