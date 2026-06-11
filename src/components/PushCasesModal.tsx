import { useMemo, useState } from "react";
import { X, Upload, Search, Pin, Check, AlertTriangle, Sparkles, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const PURPLE = "#5c1f9e";

export const VENDORS = [
  { id: "wv", name: "WeVaad",       avatar: "WV", color: "#185FA5", sec17: 9,  award: 42, contested: 35, exparte: 65 },
  { id: "cd", name: "Cadre",        avatar: "CD", color: "#0F6E56", sec17: 7,  award: 38, contested: 48, exparte: 52 },
  { id: "wn", name: "Webnyay",      avatar: "WN", color: "#534AB7", sec17: 11, award: 51, contested: 28, exparte: 72 },
  { id: "pc", name: "PrivateCourt", avatar: "PC", color: "#993C1D", sec17: 8,  award: 45, contested: 41, exparte: 59 },
];

interface Row {
  lan: string; borrower: string; product: string; ticket: number; dpd: number; jurisdiction: string;
  earmarked?: string | null;
}

const PRODUCTS = ["Personal Loan", "Business Loan", "Vehicle Loan", "Home Loan", "Gold Loan"];
const JUR = ["Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Pune"];
const NAMES = ["RAJESH KUMAR","ANITA SHARMA","SURESH BABU","PRIYA NAIR","MOHAN RAO","DEEPIKA REDDY","ARUN MEHTA","KAVITA SINGH","RAVI VERMA","NEHA GUPTA","VIKRAM JOSHI","POOJA IYER"];

function genCases(n: number): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      lan: `LAN${(100000 + i).toString()}`,
      borrower: NAMES[i % NAMES.length] + " " + String.fromCharCode(65 + (i % 26)),
      product: PRODUCTS[i % PRODUCTS.length],
      ticket: 50000 + ((i * 7919) % 950000),
      dpd: 30 + ((i * 13) % 270),
      jurisdiction: JUR[i % JUR.length],
      earmarked: null,
    });
  }
  return rows;
}

type Step = 1 | 2 | 3 | 4;

export function PushCasesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [uploaded, setUploaded] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState<string | null>(null);
  const [mode, setMode] = useState<"equal" | "custom" | "rec">("equal");
  const [custom, setCustom] = useState<Record<string, number>>({ wv: 0, cd: 0, wn: 0, pc: 0 });
  const [extras, setExtras] = useState<Record<string, number>>({ wv: 0, cd: 0, wn: 0, pc: 0 });
  const [pushed, setPushed] = useState<Record<string, number> | null>(null);

  

  const total = rows.length;
  const earmarkedRows = rows.filter(r => r.earmarked);
  const remaining = total - earmarkedRows.length;

  const earmarkCount: Record<string, number> = { wv: 0, cd: 0, wn: 0, pc: 0 };
  earmarkedRows.forEach(r => { if (r.earmarked) earmarkCount[r.earmarked]++; });

  const filtered = rows.filter(r => {
    if (search && !r.lan.toLowerCase().includes(search.toLowerCase()) && !r.borrower.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProduct && r.product !== filterProduct) return false;
    return true;
  });

  const handleUpload = () => {
    setRows(genCases(235));
    setUploaded(true);
  };

  const toggleRow = (lan: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(lan) ? n.delete(lan) : n.add(lan);
      return n;
    });
  };

  const earmarkTo = (vid: string) => {
    setRows(prev => prev.map(r => selected.has(r.lan) ? { ...r, earmarked: vid } : r));
    setSelected(new Set());
  };

  // equal split
  const baseEqual = Math.floor(remaining / 4);
  const extraTotal = remaining - baseEqual * 4;
  const extrasAssigned = Object.values(extras).reduce((a, b) => a + b, 0);

  // custom
  const customTotal = Object.values(custom).reduce((a, b) => a + b, 0);

  // recommendation: weighted by inverse award TAT
  const rec = useMemo(() => {
    const weights = VENDORS.map(v => ({ id: v.id, w: 1 / v.award }));
    const sum = weights.reduce((a, b) => a + b.w, 0);
    const raw = weights.map(w => ({ id: w.id, n: Math.floor((w.w / sum) * remaining) }));
    let assigned = raw.reduce((a, b) => a + b.n, 0);
    let i = 0;
    while (assigned < remaining) { raw[i % 4].n++; assigned++; i++; }
    return Object.fromEntries(raw.map(r => [r.id, r.n]));
  }, [remaining]);

  const handlePush = () => {
    let dist: Record<string, number>;
    if (mode === "equal") {
      dist = { wv: baseEqual + extras.wv, cd: baseEqual + extras.cd, wn: baseEqual + extras.wn, pc: baseEqual + extras.pc };
    } else if (mode === "custom") {
      dist = { ...custom };
    } else {
      dist = rec;
    }
    const totalDist: Record<string, number> = {};
    VENDORS.forEach(v => { totalDist[v.id] = (earmarkCount[v.id] || 0) + (dist[v.id] || 0); });
    setPushed(totalDist);
    setStep(4);
  };

  const reset = () => {
    setStep(1); setRows([]); setUploaded(false); setSelected(new Set());
    setSearch(""); setFilterProduct(null); setMode("equal");
    setCustom({ wv: 0, cd: 0, wn: 0, pc: 0 }); setExtras({ wv: 0, cd: 0, wn: 0, pc: 0 });
    setPushed(null);
  };
  const close = () => { reset(); onClose(); };

  const canContinueStep3 = mode === "equal" ? extrasAssigned === extraTotal : mode === "custom" ? customTotal === remaining : true;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-stretch overflow-y-auto">
      <div className="bg-background w-full min-h-screen animate-fade-up">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-line-card px-6 py-3 flex items-center gap-4">
          <div className="w-7 h-7 rounded-md grid place-items-center text-white font-bold text-[13px]" style={{ background: PURPLE }}>P</div>
          <div>
            <div className="font-serif font-bold text-[16px] text-ink-body">Push Cases to Vendors</div>
            <div className="text-[11.5px] text-ink-muted">Upload · Earmark · Distribute</div>
          </div>
          <div className="flex-1" />
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className={cn("w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold",
                  step >= n ? "text-white" : "bg-surface-input text-ink-muted")}
                  style={step >= n ? { background: PURPLE } : {}}>{n}</div>
                {n < 3 && <div className={cn("w-8 h-0.5", step > n ? "" : "bg-line-card")} style={step > n ? { background: PURPLE } : {}} />}
              </div>
            ))}
          </div>
          <button onClick={close} className="ml-4 w-8 h-8 grid place-items-center rounded-md hover:bg-surface-input">
            <X className="w-4 h-4 text-ink-light" />
          </button>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-[20px] text-ink-body">Step 1 · Upload Allocation</h2>
              <p className="text-[13px] text-ink-muted">Drop a CSV with columns: LAN, Borrower Name, Product, Ticket, DPD, Jurisdiction.</p>
              <div className="border-2 border-dashed border-line-dark rounded-[12px] bg-card p-12 text-center">
                <Upload className="w-10 h-10 mx-auto text-ink-muted mb-3" />
                <div className="font-serif font-bold text-[15px] text-ink-body mb-1">Drag & drop CSV here</div>
                <div className="text-[12px] text-ink-muted mb-4">or</div>
                <button onClick={handleUpload} className="px-5 h-10 rounded-md text-white text-[12.5px] font-semibold" style={{ background: PURPLE }}>
                  Browse files
                </button>
                {uploaded && (
                  <div className="mt-5 inline-flex items-center gap-2 bg-brand-green-light text-[#145c38] px-3 py-1.5 rounded-md text-[12.5px] font-semibold">
                    <Check className="w-4 h-4" /> 235 cases validated
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button disabled={!uploaded} onClick={() => setStep(2)}
                  className="px-5 h-10 rounded-md text-white text-[12.5px] font-semibold disabled:opacity-40"
                  style={{ background: PURPLE }}>
                  Continue to earmarking →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-serif font-bold text-[20px] text-ink-body">Step 2 · Earmark Crucial Cases</h2>
                  <p className="text-[13px] text-ink-muted">Select cases and assign them to a specific vendor before bulk distribution.</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-2 rounded-md bg-surface-input text-[12px]">
                    <span className="text-ink-muted">EARMARKED:</span> <b style={{ color: PURPLE }}>{earmarkedRows.length}</b>
                  </div>
                  <div className="px-3 py-2 rounded-md bg-surface-input text-[12px]">
                    <span className="text-ink-muted">REMAINING:</span> <b className="text-ink-body">{remaining}</b>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-card border border-line-card rounded-[12px] p-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wide text-ink-muted font-semibold mr-1">Product:</span>
                  <button onClick={() => setFilterProduct(null)}
                    className={cn("px-2.5 py-1 rounded-full text-[11.5px] border", !filterProduct ? "border-transparent text-white" : "border-line-card text-ink-light")}
                    style={!filterProduct ? { background: PURPLE } : {}}>All</button>
                  {PRODUCTS.map(p => (
                    <button key={p} onClick={() => setFilterProduct(p)}
                      className={cn("px-2.5 py-1 rounded-full text-[11.5px] border", filterProduct === p ? "border-transparent text-white" : "border-line-card text-ink-light hover:bg-surface-input")}
                      style={filterProduct === p ? { background: PURPLE } : {}}>{p}</button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by LAN or borrower name…"
                    className="w-full h-9 pl-9 pr-3 rounded-md bg-surface-input text-[12.5px] outline-none border border-transparent focus:border-line-dark" />
                </div>
              </div>

              {/* Table */}
              <div className="bg-card border border-line-card rounded-[12px] overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-[12px]">
                    <thead className="bg-surface-input sticky top-0">
                      <tr className="text-left text-[10.5px] uppercase tracking-wide text-ink-muted">
                        <th className="px-3 py-2 w-8"></th>
                        <th className="px-3 py-2 font-semibold">LAN</th>
                        <th className="px-3 py-2 font-semibold">Borrower</th>
                        <th className="px-3 py-2 font-semibold">Product</th>
                        <th className="px-3 py-2 font-semibold">Ticket</th>
                        <th className="px-3 py-2 font-semibold">DPD</th>
                        <th className="px-3 py-2 font-semibold">Jurisdiction</th>
                        <th className="px-3 py-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 100).map((r, i) => {
                        const v = VENDORS.find(x => x.id === r.earmarked);
                        return (
                          <tr key={r.lan} className={cn("border-t border-line-card", i % 2 === 1 && "bg-surface-input/30")}>
                            <td className="px-3 py-2">
                              <input type="checkbox" checked={selected.has(r.lan)} onChange={() => toggleRow(r.lan)} />
                            </td>
                            <td className="px-3 py-2 font-mono text-[11.5px]">{r.lan}</td>
                            <td className="px-3 py-2 text-ink-body">{r.borrower}</td>
                            <td className="px-3 py-2 text-ink-light">{r.product}</td>
                            <td className="px-3 py-2 text-ink-body">₹{r.ticket.toLocaleString("en-IN")}</td>
                            <td className="px-3 py-2 text-ink-light">{r.dpd}</td>
                            <td className="px-3 py-2 text-ink-light">{r.jurisdiction}</td>
                            <td className="px-3 py-2">
                              {v ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: PURPLE }}>
                                  <Pin className="w-3 h-3" /> Earmarked → {v.name}
                                </span>
                              ) : <span className="text-ink-muted text-[11px]">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-3 py-2 border-t border-line-card text-[11px] text-ink-muted bg-surface-input">
                  Showing {Math.min(100, filtered.length)} of {filtered.length} cases
                </div>
              </div>

              {/* Sticky earmark panel */}
              {selected.size > 0 && (
                <div className="sticky bottom-4 bg-card border-2 rounded-[12px] p-4 shadow-lg animate-fade-up" style={{ borderColor: PURPLE }}>
                  <div className="text-[12px] font-semibold text-ink-body mb-3">
                    Earmark <span style={{ color: PURPLE }}>{selected.size}</span> selected cases to:
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {VENDORS.map(v => (
                      <button key={v.id} onClick={() => earmarkTo(v.id)}
                        className="flex items-center gap-2 p-3 rounded-md border border-line-card hover:border-[color:var(--p)] hover:bg-surface-input transition"
                        style={{ ["--p" as any]: PURPLE }}>
                        <div className="w-9 h-9 rounded-md grid place-items-center text-white font-bold text-[12px]" style={{ background: v.color }}>{v.avatar}</div>
                        <div className="text-left">
                          <div className="text-[12.5px] font-semibold text-ink-body">{v.name}</div>
                          <div className="text-[10.5px] text-ink-muted">Earmarked: {earmarkCount[v.id]}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-4 h-10 rounded-md border border-line-card text-[12.5px]">← Back</button>
                <button onClick={() => setStep(3)} className="px-5 h-10 rounded-md text-white text-[12.5px] font-semibold" style={{ background: PURPLE }}>
                  Continue to bulk distribution →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-[20px] text-ink-body">Step 3 · Bulk Distribute Remaining ({remaining})</h2>
              <p className="text-[13px] text-ink-muted">Choose a distribution mode for the {remaining} non-earmarked cases.</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "equal" as const, label: "Equal Split", desc: "Divide evenly across vendors" },
                  { id: "custom" as const, label: "Custom Split", desc: "Set per-vendor counts" },
                  { id: "rec" as const, label: "Recommendation", desc: "AI weighted by performance" },
                ].map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={cn("p-4 rounded-[12px] border text-left transition",
                      mode === m.id ? "border-2 bg-surface-input" : "border-line-card hover:border-line-dark")}
                    style={mode === m.id ? { borderColor: PURPLE } : {}}>
                    <div className="text-[13px] font-semibold text-ink-body">{m.label}</div>
                    <div className="text-[11.5px] text-ink-muted mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>

              <div className="bg-card border border-line-card rounded-[12px] p-5">
                {mode === "equal" && (
                  <div className="space-y-4">
                    <div className="text-[13px] text-ink-body">
                      Base: <b>{baseEqual}</b> cases each. {extraTotal > 0 && <>Who gets the <b style={{ color: PURPLE }}>{extraTotal}</b> extra?</>}
                    </div>
                    {extraTotal > 0 && (
                      <>
                        <div className="grid grid-cols-4 gap-3">
                          {VENDORS.map(v => (
                            <div key={v.id} className="border border-line-card rounded-md p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-md grid place-items-center text-white font-bold text-[11px]" style={{ background: v.color }}>{v.avatar}</div>
                                <div className="text-[12.5px] font-semibold">{v.name}</div>
                              </div>
                              <div className="text-[11px] text-ink-muted mb-2">Base {baseEqual} + extra</div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => setExtras(p => ({ ...p, [v.id]: Math.max(0, p[v.id] - 1) }))}
                                  className="w-7 h-7 grid place-items-center rounded border border-line-card"><Minus className="w-3 h-3" /></button>
                                <div className="flex-1 text-center font-serif font-bold text-[16px]" style={{ color: PURPLE }}>{extras[v.id]}</div>
                                <button onClick={() => setExtras(p => extrasAssigned < extraTotal ? ({ ...p, [v.id]: p[v.id] + 1 }) : p)}
                                  className="w-7 h-7 grid place-items-center rounded border border-line-card"><Plus className="w-3 h-3" /></button>
                              </div>
                              <div className="mt-2 text-center text-[12.5px] font-semibold">= {baseEqual + extras[v.id]}</div>
                            </div>
                          ))}
                        </div>
                        <div className={cn("text-[12.5px] font-semibold", extrasAssigned === extraTotal ? "text-[#145c38]" : "text-[#92400e]")}>
                          {extrasAssigned} / {extraTotal} extras assigned {extrasAssigned === extraTotal && "✓"}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {mode === "custom" && (
                  <div className="space-y-4">
                    <div className={cn("text-[13px] font-semibold",
                      customTotal === remaining ? "text-[#145c38]" : customTotal < remaining ? "text-[#92400e]" : "text-brand-red")}>
                      {customTotal} / {remaining} assigned {customTotal === remaining && "✓"}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {VENDORS.map(v => (
                        <div key={v.id} className="border border-line-card rounded-md p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-md grid place-items-center text-white font-bold text-[11px]" style={{ background: v.color }}>{v.avatar}</div>
                            <div className="text-[12.5px] font-semibold">{v.name}</div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => setCustom(p => ({ ...p, [v.id]: Math.max(0, p[v.id] - 1) }))}
                              className="w-7 h-7 grid place-items-center rounded border border-line-card"><Minus className="w-3 h-3" /></button>
                            <input type="number" value={custom[v.id]}
                              onChange={e => setCustom(p => ({ ...p, [v.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                              className="flex-1 text-center font-serif font-bold text-[16px] bg-transparent outline-none" style={{ color: PURPLE }} />
                            <button onClick={() => setCustom(p => ({ ...p, [v.id]: p[v.id] + 1 }))}
                              className="w-7 h-7 grid place-items-center rounded border border-line-card"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mode === "rec" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[12.5px] text-ink-body">
                      <Sparkles className="w-4 h-4" style={{ color: PURPLE }} /> AI recommended split based on award TAT and resolution rate.
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {VENDORS.map(v => (
                        <div key={v.id} className="border border-line-card rounded-md p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-md grid place-items-center text-white font-bold text-[11px]" style={{ background: v.color }}>{v.avatar}</div>
                            <div className="text-[12.5px] font-semibold">{v.name}</div>
                          </div>
                          <div className="font-serif font-bold text-[22px]" style={{ color: PURPLE }}>{rec[v.id]}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-input text-ink-light">Award {v.award}d</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-input text-ink-light">Sec17 {v.sec17}d</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11.5px] text-ink-muted bg-surface-input rounded-md p-3">
                      <b>Why this split?</b> Vendors with faster award turnaround receive proportionally more cases to optimize total cycle time.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-4 h-10 rounded-md border border-line-card text-[12.5px]">← Back</button>
                <button disabled={!canContinueStep3} onClick={handlePush}
                  className="px-5 h-10 rounded-md text-white text-[12.5px] font-semibold disabled:opacity-40"
                  style={{ background: PURPLE }}>
                  Push {remaining} Cases
                </button>
              </div>
            </div>
          )}

          {step === 4 && pushed && (
            <div className="space-y-5 max-w-2xl mx-auto text-center py-10">
              <div className="w-16 h-16 rounded-full mx-auto grid place-items-center" style={{ background: "#145c3820" }}>
                <Check className="w-8 h-8 text-[#145c38]" />
              </div>
              <h2 className="font-serif font-bold text-[24px] text-ink-body">Cases Pushed Successfully</h2>
              <p className="text-[13px] text-ink-muted">{total} cases distributed across 4 vendors.</p>

              <div className="grid grid-cols-2 gap-3 text-left">
                {VENDORS.map(v => (
                  <div key={v.id} className="bg-card border border-line-card rounded-[12px] p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md grid place-items-center text-white font-bold text-[13px]" style={{ background: v.color }}>{v.avatar}</div>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-ink-body">{v.name}</div>
                      <div className="text-[11px] text-ink-muted">Earmarked {earmarkCount[v.id]} + bulk {(pushed[v.id] || 0) - (earmarkCount[v.id] || 0)}</div>
                    </div>
                    <div className="font-serif font-bold text-[22px]" style={{ color: PURPLE }}>{pushed[v.id]}</div>
                  </div>
                ))}
              </div>

              <button onClick={close} className="px-5 h-10 rounded-md text-white text-[12.5px] font-semibold" style={{ background: PURPLE }}>
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
