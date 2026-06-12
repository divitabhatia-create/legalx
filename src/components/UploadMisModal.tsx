import { useState } from "react";
import { X, Upload, Download, Check, FileText } from "lucide-react";

const PURPLE = "#5c1f9e";

const COLUMNS = [
  { name: "lan", desc: "Loan Account Number", example: "CRFCLAFDSLAP10017431" },
  { name: "borrower_name", desc: "Borrower full name", example: "PESINGU KISHORE" },
  { name: "vendor", desc: "ODR vendor (WeVaad / Cadre / Webnyay / PrivateCourt)", example: "Cadre" },
  { name: "case_stage", desc: "Current stage code", example: "lrn / sec17 / award / settled" },
  { name: "engagement_status", desc: "Engaged / Not Engaged / Partial", example: "Engaged" },
  { name: "outcome", desc: "Settled / Award / Pending / Withdrawn", example: "Settled" },
  { name: "settlement_amount", desc: "Amount recovered in INR (blank if not settled)", example: "182500" },
  { name: "principal_outstanding", desc: "POS in INR at month-end", example: "243127" },
  { name: "last_action_date", desc: "DD/MM/YYYY", example: "06/01/2026" },
];

export function UploadMisModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [uploaded, setUploaded] = useState(false);

  if (!open) return null;

  const downloadTemplate = () => {
    const header = COLUMNS.map(c => c.name).join(",");
    const sample = COLUMNS.map(c => c.example).join(",");
    const csv = `${header}\n${sample}\n`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "MIS_Report_Template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-card w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-[12px] card-shadow animate-fade-up">
        <div className="sticky top-0 bg-card border-b border-line-card px-5 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-md grid place-items-center text-white font-bold text-[13px]" style={{ background: PURPLE }}>
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-serif font-bold text-[15px] text-ink-body">Upload MIS Report</div>
            <div className="text-[11px] text-ink-muted">Populates RoR &amp; Settlement Rate metrics</div>
          </div>
          <div className="flex-1" />
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-md hover:bg-surface-input">
            <X className="w-4 h-4 text-ink-light" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#fffbeb] border border-[#fde68a] border-l-4 border-l-[#d97706] rounded-md px-3 py-2 text-[12px] text-[#78350f]">
            The MIS report drives the <b>Rate of Resolution (RoR)</b> and <b>Settlement Rate (%)</b> on the dashboard. Upload monthly for accurate vendor scoring.
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif font-bold text-[13.5px] text-ink-body">Standard CSV Format</h4>
              <button onClick={downloadTemplate}
                className="h-8 px-3 rounded-md border border-line-card text-[11.5px] font-semibold flex items-center gap-1.5 hover:bg-surface-input">
                <Download className="w-3.5 h-3.5" /> Download template
              </button>
            </div>
            <div className="border border-line-card rounded-md overflow-hidden">
              <table className="w-full text-[11.5px]">
                <thead className="bg-surface-input text-[10.5px] uppercase tracking-wide text-ink-muted">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold">Column</th>
                    <th className="px-3 py-2 font-semibold">Description</th>
                    <th className="px-3 py-2 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {COLUMNS.map((c, i) => (
                    <tr key={c.name} className={i % 2 === 1 ? "bg-surface-input/30" : ""}>
                      <td className="px-3 py-1.5 font-mono text-[11px] text-ink-body">{c.name}</td>
                      <td className="px-3 py-1.5 text-ink-light">{c.desc}</td>
                      <td className="px-3 py-1.5 font-mono text-[11px] text-ink-muted">{c.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-2 border-dashed border-line-dark rounded-[12px] p-8 text-center">
            <Upload className="w-8 h-8 mx-auto text-ink-muted mb-2" />
            <div className="font-serif font-bold text-[13.5px] text-ink-body mb-1">Drag &amp; drop MIS CSV</div>
            <div className="text-[11.5px] text-ink-muted mb-3">or</div>
            <button onClick={() => setUploaded(true)}
              className="px-4 h-9 rounded-md text-white text-[12px] font-semibold" style={{ background: PURPLE }}>
              Browse files
            </button>
            {uploaded && (
              <div className="mt-4 inline-flex items-center gap-2 bg-brand-green-light text-[#145c38] px-3 py-1.5 rounded-md text-[12px] font-semibold">
                <Check className="w-4 h-4" /> MIS_Report.csv processed · RoR &amp; Settlement Rate updated
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 h-9 rounded-md border border-line-card text-[12px] font-semibold">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
