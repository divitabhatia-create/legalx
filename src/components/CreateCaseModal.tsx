import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { ARBITRATORS, CaseRecord } from "@/data/cases";

export function CreateCaseModal() {
  const { createOpen, setCreateOpen, addCase, cases, navigate } = useApp();
  const nextNum = String(cases.filter(c => c.id.startsWith("ARB-2026")).length + 1).padStart(3, "0");
  const generatedId = `ARB-2026-${nextNum}`;
  const [claimant, setC] = useState("");
  const [respondent, setR] = useState("");
  const [value, setV] = useState("");
  const [arb, setArb] = useState(ARBITRATORS[0].name);

  if (!createOpen) return null;

  const reset = () => { setC(""); setR(""); setV(""); setArb(ARBITRATORS[0].name); };

  const submit = () => {
    if (!claimant || !respondent || !value) return;
    const newCase: CaseRecord = {
      id: generatedId,
      lan: `CRFLAN${Math.floor(100000000 + Math.random() * 9e8)}`,
      campaign: `CMPCRIGHT_NEW${nextNum}`,
      claimant, respondent, respondentFull: respondent.toUpperCase(),
      lender: "CREDRIGHT", disputeAmt: `₹${value},00,000`,
      claimType: "GENERAL", jurisdiction: "Delhi",
      value: `₹${value} Cr`, arbitrator: arb, filed: "Mar 2026",
      stage: "lrn", status: "active", phone: "9000000000",
      claimants: [{ name: claimant, role: "applicant", email: "—", phone: "9000000000" }],
      respondents: [{ name: respondent.toUpperCase(), role: "applicant", email: "—", phone: "9000000001", address: "—", bankDetails: true }],
      officers: [{ name: arb, role: "Arbitrator", email: "—", phone: "9800000000" }],
      documents: [],
      timeline: [{ event: "Case Filed", ts: "Mar 2026" }],
      hearings: [],
    };
    addCase(newCase);
    setCreateOpen(false);
    reset();
    navigate({ name: "case", id: generatedId });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 animate-fade-up" onClick={() => setCreateOpen(false)}>
      <div className="bg-card rounded-[11px] card-shadow w-[460px] p-6 border border-line-card" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-ink-body">Create New Case</h2>
          <button onClick={() => setCreateOpen(false)} className="w-7 h-7 grid place-items-center rounded hover:bg-surface-input">
            <X className="w-4 h-4 text-ink-muted" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Case ID (auto)">
            <input value={generatedId} disabled className="w-full h-9 px-3 rounded-md bg-surface-subtle text-[12.5px] text-ink-muted border border-line-card" />
          </Field>
          <Field label="Claimant Name">
            <input value={claimant} onChange={e => setC(e.target.value)} className="w-full h-9 px-3 rounded-md bg-surface-input text-[12.5px] outline-none border border-transparent focus:border-brand-red" />
          </Field>
          <Field label="Respondent Name">
            <input value={respondent} onChange={e => setR(e.target.value)} className="w-full h-9 px-3 rounded-md bg-surface-input text-[12.5px] outline-none border border-transparent focus:border-brand-red" />
          </Field>
          <Field label="Claim Value (₹ Cr)">
            <input value={value} onChange={e => setV(e.target.value)} type="number" className="w-full h-9 px-3 rounded-md bg-surface-input text-[12.5px] outline-none border border-transparent focus:border-brand-red" />
          </Field>
          <Field label="Assign Arbitrator">
            <select value={arb} onChange={e => setArb(e.target.value)} className="w-full h-9 px-3 rounded-md bg-surface-input text-[12.5px] outline-none border border-transparent focus:border-brand-red">
              {ARBITRATORS.map(a => <option key={a.name} value={a.name}>{a.name} ({a.load}/25 cases)</option>)}
            </select>
          </Field>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button onClick={submit} className="w-full h-10 rounded-md bg-brand-red text-white text-[13px] font-semibold hover:brightness-110">Register Case</button>
          <button onClick={() => setCreateOpen(false)} className="w-full h-9 rounded-md text-ink-muted text-[12.5px] hover:bg-surface-input">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10.5px] uppercase tracking-wide text-ink-muted font-semibold mb-1">{label}</span>
      {children}
    </label>
  );
}
