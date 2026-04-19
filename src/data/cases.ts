export type Stage = "lrn" | "sec21" | "claim" | "ref" | "sec17" | "active";
export type Status = "active" | "overdue" | "hold" | "urgent";
export type HearingMode = "VIRTUAL" | "IN-PERSON" | "URGENT";

export interface Person {
  name: string;
  role: string;
  email: string;
  phone: string;
  address?: string;
}
export interface Doc { name: string; type: string; }
export interface TimelineEvent { event: string; ts: string; detail?: string; }
export interface Hearing {
  id: string;
  caseId: string;
  date: string;     // YYYY-MM-DD
  time: string;     // "10:00 AM"
  hours: number;
  type: string;
  mode: HearingMode;
  past?: boolean;
  notes?: string;
  parties: string;
  location: string;
}

export interface CaseRecord {
  id: string;
  lan: string;
  campaign: string;
  claimant: string;
  respondent: string;
  respondentFull: string;
  lender: string;
  disputeAmt: string;
  claimType: string;
  jurisdiction: string;
  value: string;
  arbitrator: string;
  filed: string;
  stage: Stage;
  status: Status;
  phone: string;
  claimants: Person[];
  respondents: (Person & { bankDetails?: boolean })[];
  officers: Person[];
  documents: Doc[];
  timeline: TimelineEvent[];
  hearings: Hearing[];
}

export const STAGE_LABEL: Record<Stage, string> = {
  lrn: "LRN Sent",
  sec21: "Sec 21 Notice",
  claim: "Stmt of Claim",
  ref: "Ref Letter",
  sec17: "Sec 17 Order",
  active: "Arb Active",
};

export const STAGE_FUNNEL: { key: Stage; label: string; count: number; color: string }[] = [
  { key: "lrn", label: "LRN SENT", count: 42, color: "#1a5276" },
  { key: "sec21", label: "SEC 21 NOTICE", count: 35, color: "#2471a3" },
  { key: "claim", label: "STMT OF CLAIM", count: 31, color: "#0e7490" },
  { key: "ref", label: "REF LETTER", count: 24, color: "#0a7d6e" },
  { key: "sec17", label: "SEC 17 ORDER", count: 28, color: "#6b3fa0" },
  { key: "active", label: "ARB ACTIVE", count: 55, color: "#1a7a4a" },
];

export const ARBITRATORS = [
  { name: "Justice R. Kapoor", load: 24 },
  { name: "Justice S. Mehta", load: 18 },
  { name: "Justice P. Nair", load: 14 },
  { name: "Adv. A. Bhatt", load: 9 },
  { name: "Justice D. Singh", load: 21 },
];

import { REAL_CASES } from "./realCases";

export const initialCases: CaseRecord[] = REAL_CASES;

const _LEGACY_CASES_UNUSED: CaseRecord[] = [
  {
    id: "ARB-2024-089", lan: "CRFLAN100015091", campaign: "CMPCRIGHT_J75jwlXW",
    claimant: "M/s Reliance", respondent: "Shaik Pasha", respondentFull: "MAHESHWARAM NAGARAJU",
    lender: "CREDRIGHT", disputeAmt: "₹5,20,000", claimType: "LOAN DEFAULT", jurisdiction: "Delhi",
    value: "₹5.2 Cr", arbitrator: "Justice S. Mehta", filed: "Mar 2024", stage: "sec21", status: "overdue",
    phone: "9248069996",
    claimants: [{ name: "Sathish", role: "applicant", email: "sathish@credright.com", phone: "9885771440" }],
    respondents: [{ name: "MAHESHWARAM NAGARAJU", role: "applicant", email: "—", phone: "9248069996", address: "H.no 12-3-402, Nasarpura, Siddipet, Telangana 502103", bankDetails: true }],
    officers: [{ name: "Justice S. Mehta", role: "Arbitrator", email: "smehta@arb.in", phone: "9800001111" }],
    documents: [
      { name: "CRFLAN100015091_LDCRIGHT_loan_application", type: "loan_application" },
      { name: "CRFLAN100015091_LDCRIGHT_loan_agreement", type: "loan_agreement" },
      { name: "CRFLAN100015091_LDCRIGHT_soa", type: "soa" },
    ],
    timeline: [
      { event: "Generate Nta", ts: "10 Apr 2026 10:10" },
      { event: "Temp", ts: "13 Apr 2026 10:10" },
      { event: "Generate Nta", ts: "13 Apr 2026 12:06" },
      { event: "Send Nta Communication", ts: "13 Apr 2026 12:08", detail: "recipient: MAHESHWARAM NAGARAJU, +919248069996, sms" },
      { event: "Temp", ts: "13 Apr 2026 12:33" },
    ],
    hearings: [
      { id: "h1", caseId: "ARB-2024-089", date: "2026-03-06", time: "10:00 AM", hours: 2, type: "Cross-examination", mode: "VIRTUAL", parties: "Credright vs Shaik Pasha", location: "Virtual Hearing (Zoom)", notes: "Jurisdictional objection raised. Next date fixed." },
      { id: "h2", caseId: "ARB-2024-089", date: "2026-03-20", time: "11:00 AM", hours: 2, type: "Statement of Defence", mode: "VIRTUAL", parties: "Credright vs Shaik Pasha", location: "Virtual Hearing (Zoom)" },
      { id: "h3", caseId: "ARB-2024-089", date: "2026-04-04", time: "2:00 PM", hours: 2, type: "Evidence Hearing", mode: "IN-PERSON", parties: "Credright vs Shaik Pasha", location: "Chamber 4, IHC" },
    ],
  },
  {
    id: "ARB-2024-331", lan: "CRFLAN100028441", campaign: "CMPCRIGHT_R22mxKP",
    claimant: "ONGC Ltd", respondent: "Petro Contractors", respondentFull: "RAJESH KUMAR VERMA",
    lender: "ONGC", disputeAmt: "₹38,10,000", claimType: "CONTRACT DISPUTE", jurisdiction: "Mumbai",
    value: "₹38.1 Cr", arbitrator: "Justice R. Kapoor", filed: "Nov 2024", stage: "active", status: "active",
    phone: "9100002222",
    claimants: [{ name: "ONGC Legal Cell", role: "applicant", email: "legal@ongc.in", phone: "9100002222" }],
    respondents: [{ name: "RAJESH KUMAR VERMA", role: "applicant", email: "—", phone: "9100003333", address: "Plot 44, MIDC, Andheri East, Mumbai 400093", bankDetails: true }],
    officers: [{ name: "Justice R. Kapoor", role: "Arbitrator", email: "rkapoor@arb.in", phone: "9800002222" }],
    documents: [
      { name: "CRFLAN100028441_contract_agreement", type: "contract" },
      { name: "CRFLAN100028441_statement_of_claim", type: "soc" },
      { name: "CRFLAN100028441_expert_report", type: "expert" },
      { name: "CRFLAN100028441_final_arguments", type: "arguments" },
    ],
    timeline: [
      { event: "Case Filed", ts: "Nov 5 2024 09:00" },
      { event: "Sec 21 Notice Served", ts: "Nov 12 2024 11:30", detail: "Notice sent to respondent" },
      { event: "Tribunal Constituted", ts: "Dec 1 2024 10:00", detail: "Justice R. Kapoor appointed" },
      { event: "Statement of Claim Filed", ts: "Jan 10 2025 14:00", detail: "47 pages digitally signed" },
      { event: "Award Reserved", ts: "Jan 28 2026 11:00", detail: "Final arguments concluded" },
    ],
    hearings: [
      { id: "h4", caseId: "ARB-2024-331", date: "2026-03-18", time: "10:30 AM", hours: 2, type: "Award Delivery", mode: "IN-PERSON", parties: "ONGC vs Petro Contractors", location: "Chamber 4, IHC", notes: "Final award to be pronounced." },
      { id: "h5", caseId: "ARB-2024-331", date: "2024-11-05", time: "10:00 AM", hours: 2, type: "Preliminary Hearing", mode: "IN-PERSON", past: true, parties: "ONGC vs Petro Contractors", location: "Chamber 4, IHC", notes: "Reference letter issued. Arbitrator appointed by consent." },
      { id: "h6", caseId: "ARB-2024-331", date: "2024-12-12", time: "2:00 PM", hours: 2, type: "Evidence Hearing", mode: "IN-PERSON", past: true, parties: "ONGC vs Petro Contractors", location: "Chamber 4, IHC", notes: "Documents tendered. Expert witness examined." },
      { id: "h7", caseId: "ARB-2024-331", date: "2026-01-28", time: "11:00 AM", hours: 3, type: "Final Arguments", mode: "IN-PERSON", past: true, parties: "ONGC vs Petro Contractors", location: "Chamber 4, IHC", notes: "Arguments concluded. Award reserved." },
    ],
  },
  {
    id: "ARB-2025-017", lan: "CRFLAN100031009", campaign: "CMPCRIGHT_T88yzWQ",
    claimant: "IREDA", respondent: "M/s Infra Corp", respondentFull: "SURESH BABU REDDY",
    lender: "IREDA", disputeAmt: "₹12,40,000", claimType: "PROJECT FINANCE", jurisdiction: "Hyderabad",
    value: "₹12.4 Cr", arbitrator: "Justice P. Nair", filed: "Jan 2025", stage: "sec17", status: "urgent",
    phone: "9300004444",
    claimants: [{ name: "IREDA Finance", role: "applicant", email: "legal@ireda.in", phone: "9300004444" }],
    respondents: [{ name: "SURESH BABU REDDY", role: "applicant", email: "—", phone: "9300005555", address: "Flat 7B, Jubilee Hills, Hyderabad 500033", bankDetails: true }],
    officers: [{ name: "Justice P. Nair", role: "Arbitrator", email: "pnair@arb.in", phone: "9800003333" }],
    documents: [
      { name: "CRFLAN100031009_project_agreement", type: "agreement" },
      { name: "CRFLAN100031009_sec17_application", type: "sec17" },
      { name: "CRFLAN100031009_interim_order", type: "order" },
    ],
    timeline: [
      { event: "Case Initiated", ts: "Jan 15 2026 10:00" },
      { event: "Sec 21 Notice Issued", ts: "Jan 22 2026 11:00" },
      { event: "Urgent Interim Relief Filed", ts: "Feb 25 2026 09:00", detail: "Application u/s 17" },
      { event: "Ex-parte Interim Order", ts: "Feb 28 2026 15:00", detail: "Status quo granted" },
    ],
    hearings: [
      { id: "h8", caseId: "ARB-2025-017", date: "2026-03-13", time: "4:00 PM", hours: 1, type: "Interim Order Hearing", mode: "URGENT", parties: "IREDA vs M/s Infra Corp", location: "High Court Annexe, Rm 7", notes: "Respondent's reply to be heard." },
      { id: "h9", caseId: "ARB-2025-017", date: "2026-02-28", time: "3:00 PM", hours: 2, type: "Urgent Interim Relief", mode: "URGENT", past: true, parties: "IREDA vs M/s Infra Corp", location: "High Court Annexe, Rm 7", notes: "Ex-parte order passed. Respondent to reply in 2 weeks." },
    ],
  },
  {
    id: "ARB-2023-445", lan: "CRFLAN100019876", campaign: "CMPCRIGHT_N44abCD",
    claimant: "NHAI", respondent: "Road Corp", respondentFull: "ROAD CORP PVT LTD",
    lender: "NHAI", disputeAmt: "₹94,30,000", claimType: "CONSTRUCTION DISPUTE", jurisdiction: "Delhi",
    value: "₹94.3 Cr", arbitrator: "Justice S. Mehta", filed: "Dec 2023", stage: "active", status: "active",
    phone: "9400006666",
    claimants: [{ name: "NHAI Legal", role: "applicant", email: "legal@nhai.in", phone: "9400006666" }],
    respondents: [{ name: "ROAD CORP PVT LTD", role: "applicant", email: "—", phone: "9400007777", address: "NHAI HQ, Sector 44, Gurugram", bankDetails: true }],
    officers: [{ name: "Justice S. Mehta", role: "Arbitrator", email: "smehta@arb.in", phone: "9800001111" }],
    documents: [
      { name: "CRFLAN100019876_construction_contract", type: "contract" },
      { name: "CRFLAN100019876_statement_of_claim", type: "soc" },
    ],
    timeline: [
      { event: "Case Filed", ts: "Dec 10 2023 10:00" },
      { event: "Sec 17 Order Passed", ts: "Jan 10 2026 10:30", detail: "Status quo maintained" },
    ],
    hearings: [
      { id: "h10", caseId: "ARB-2023-445", date: "2026-03-06", time: "2:30 PM", hours: 4, type: "Cross-examination", mode: "IN-PERSON", parties: "Estate of H. Sharma vs Union Bank", location: "Chamber 4, IHC" },
      { id: "h11", caseId: "ARB-2023-445", date: "2026-04-22", time: "10:00 AM", hours: 3, type: "Final Arguments", mode: "IN-PERSON", parties: "NHAI vs Road Corp", location: "Chamber 4, IHC" },
      { id: "h12", caseId: "ARB-2023-445", date: "2026-01-10", time: "10:30 AM", hours: 2, type: "Preliminary Hearing", mode: "IN-PERSON", past: true, parties: "NHAI vs Road Corp", location: "Chamber 4, IHC", notes: "Interim order passed under Sec 17. Status quo maintained." },
      { id: "h13", caseId: "ARB-2023-445", date: "2026-02-18", time: "2:30 PM", hours: 2, type: "Evidence Hearing", mode: "IN-PERSON", past: true, parties: "NHAI vs Road Corp", location: "Chamber 4, IHC", notes: "Witness examination concluded. Documents admitted." },
    ],
  },
  {
    id: "ARB-2024-102", lan: "CRFLAN100022001", campaign: "CMPCRIGHT_P66cdEF",
    claimant: "Tata Power", respondent: "DISCOMs", respondentFull: "DELHI DISCOMS LTD",
    lender: "TATA", disputeAmt: "₹22,50,000", claimType: "POWER PURCHASE", jurisdiction: "Delhi",
    value: "₹22.5 Cr", arbitrator: "Justice R. Kapoor", filed: "Apr 2024", stage: "sec21", status: "overdue",
    phone: "9500008888",
    claimants: [{ name: "Tata Power Legal", role: "applicant", email: "legal@tatapower.in", phone: "9500008888" }],
    respondents: [{ name: "DELHI DISCOMS LTD", role: "applicant", email: "—", phone: "9500009999", address: "Shakti Sadan, Delhi", bankDetails: true }],
    officers: [{ name: "Justice R. Kapoor", role: "Arbitrator", email: "rkapoor@arb.in", phone: "9800002222" }],
    documents: [
      { name: "CRFLAN100022001_ppa_agreement", type: "agreement" },
      { name: "CRFLAN100022001_sec21_notice", type: "notice" },
    ],
    timeline: [
      { event: "Case Filed", ts: "Apr 5 2024 10:00" },
      { event: "Sec 21 Notice Issued", ts: "Apr 12 2024 11:00" },
    ],
    hearings: [
      { id: "h14", caseId: "ARB-2024-102", date: "2026-03-07", time: "11:00 AM", hours: 2, type: "Statement Reading", mode: "VIRTUAL", parties: "Tata Power vs DISCOMs", location: "Virtual Hearing (Zoom)", notes: "Claimant to file amended statement before hearing." },
      { id: "h15", caseId: "ARB-2024-102", date: "2026-02-14", time: "11:00 AM", hours: 2, type: "Preliminary Hearing", mode: "VIRTUAL", past: true, parties: "Tata Power vs DISCOMs", location: "Virtual Hearing (Zoom)", notes: "Tribunal constituted. Statement of claim admitted." },
    ],
  },
  {
    id: "ARB-2023-288", lan: "CRFLAN100017543", campaign: "CMPCRIGHT_Q55ghGH",
    claimant: "Siemens India", respondent: "PSU Board", respondentFull: "PSU BOARD OF INDIA",
    lender: "SIEMENS", disputeAmt: "₹18,70,000", claimType: "EQUIPMENT SUPPLY", jurisdiction: "Bengaluru",
    value: "₹18.7 Cr", arbitrator: "Justice D. Singh", filed: "Sep 2023", stage: "ref", status: "hold",
    phone: "9600001010",
    claimants: [{ name: "Siemens Legal", role: "applicant", email: "legal@siemens.in", phone: "9600001010" }],
    respondents: [{ name: "PSU BOARD OF INDIA", role: "applicant", email: "—", phone: "9600002020", address: "PSU Bhavan, Janpath, Delhi", bankDetails: true }],
    officers: [{ name: "Justice D. Singh", role: "Arbitrator", email: "dsingh@arb.in", phone: "9800004444" }],
    documents: [{ name: "CRFLAN100017543_supply_agreement", type: "contract" }],
    timeline: [
      { event: "Case Filed", ts: "Sep 1 2023 10:00" },
      { event: "Hold — Mediation Attempt", ts: "Oct 3 2025 10:00", detail: "Parties agreed to mediation" },
    ],
    hearings: [
      { id: "h16", caseId: "ARB-2023-288", date: "2025-10-03", time: "10:00 AM", hours: 2, type: "Preliminary Hearing", mode: "VIRTUAL", past: true, parties: "Siemens vs PSU Board", location: "Virtual Hearing (Zoom)", notes: "Parties agreed to attempt mediation. Case placed on hold." },
    ],
  },
  {
    id: "ARB-2023-192", lan: "CRFLAN100015999", campaign: "CMPCRIGHT_R77ijIJ",
    claimant: "BHEL", respondent: "State Govt", respondentFull: "GOVT OF ANDHRA PRADESH",
    lender: "BHEL", disputeAmt: "₹44,00,000", claimType: "WORKS CONTRACT", jurisdiction: "Hyderabad",
    value: "₹44.0 Cr", arbitrator: "Justice D. Singh", filed: "Jul 2023", stage: "active", status: "active",
    phone: "9700003030",
    claimants: [{ name: "BHEL Legal", role: "applicant", email: "legal@bhel.in", phone: "9700003030" }],
    respondents: [{ name: "GOVT OF ANDHRA PRADESH", role: "applicant", email: "—", phone: "9700004040", address: "AP Secretariat, Amaravati", bankDetails: true }],
    officers: [{ name: "Justice D. Singh", role: "Arbitrator", email: "dsingh@arb.in", phone: "9800004444" }],
    documents: [
      { name: "CRFLAN100015999_works_contract", type: "contract" },
      { name: "CRFLAN100015999_soc", type: "soc" },
      { name: "CRFLAN100015999_evidence", type: "evidence" },
    ],
    timeline: [
      { event: "Case Filed", ts: "Jul 15 2023 10:00" },
      { event: "Sec 21 Issued", ts: "Jul 22 2023 11:00" },
    ],
    hearings: [
      { id: "h17", caseId: "ARB-2023-192", date: "2026-03-20", time: "10:30 AM", hours: 3, type: "Final Arguments", mode: "IN-PERSON", parties: "BHEL vs State Govt", location: "Chamber 4, IHC" },
      { id: "h18", caseId: "ARB-2023-192", date: "2025-09-15", time: "11:00 AM", hours: 2, type: "Preliminary Hearing", mode: "IN-PERSON", past: true, parties: "BHEL vs State Govt", location: "Chamber 4, IHC", notes: "Pleadings complete. Schedule fixed." },
      { id: "h19", caseId: "ARB-2023-192", date: "2025-11-20", time: "2:00 PM", hours: 2, type: "Evidence Hearing", mode: "IN-PERSON", past: true, parties: "BHEL vs State Govt", location: "Chamber 4, IHC", notes: "Claimant's witnesses examined." },
      { id: "h20", caseId: "ARB-2023-192", date: "2026-03-05", time: "2:00 PM", hours: 2, type: "Cross-examination", mode: "IN-PERSON", past: true, parties: "BHEL vs State Govt", location: "Chamber 4, IHC", notes: "Respondent's cross completed." },
    ],
  },
  {
    id: "ARB-2024-208", lan: "CRFLAN100025678", campaign: "CMPCRIGHT_S88klKL",
    claimant: "L&T Infra", respondent: "NHAI", respondentFull: "NATIONAL HIGHWAYS AUTHORITY",
    lender: "LNT", disputeAmt: "₹7,90,000", claimType: "INFRA CONTRACT", jurisdiction: "Chennai",
    value: "₹7.9 Cr", arbitrator: "Adv. A. Bhatt", filed: "Aug 2024", stage: "claim", status: "active",
    phone: "9800005050",
    claimants: [{ name: "L&T Legal", role: "applicant", email: "legal@larsen.in", phone: "9800005050" }],
    respondents: [{ name: "NATIONAL HIGHWAYS AUTHORITY", role: "applicant", email: "—", phone: "9800006060", address: "NHAI HQ, Sector 44, Gurugram", bankDetails: true }],
    officers: [{ name: "Adv. A. Bhatt", role: "Arbitrator", email: "abhatt@arb.in", phone: "9800005555" }],
    documents: [
      { name: "CRFLAN100025678_infra_contract", type: "contract" },
      { name: "CRFLAN100025678_expert_report", type: "expert" },
    ],
    timeline: [
      { event: "Case Filed", ts: "Aug 20 2024 10:00" },
      { event: "Statement of Claim Filed", ts: "Dec 4 2025 11:30" },
    ],
    hearings: [
      { id: "h21", caseId: "ARB-2024-208", date: "2026-03-15", time: "3:00 PM", hours: 3, type: "Final Arguments", mode: "IN-PERSON", parties: "L&T Infra vs NHAI", location: "Chamber 4, IHC" },
      { id: "h22", caseId: "ARB-2024-208", date: "2026-03-09", time: "3:00 PM", hours: 3, type: "Final Arguments", mode: "IN-PERSON", parties: "L&T Infra vs NHAI", location: "Chamber 4, IHC" },
      { id: "h23", caseId: "ARB-2024-208", date: "2025-12-04", time: "11:30 AM", hours: 2, type: "Preliminary Hearing", mode: "VIRTUAL", past: true, parties: "L&T Infra vs NHAI", location: "Virtual Hearing (Zoom)", notes: "Statement of claim filed and admitted." },
      { id: "h24", caseId: "ARB-2024-208", date: "2026-02-06", time: "2:00 PM", hours: 2, type: "Evidence Hearing", mode: "IN-PERSON", past: true, parties: "L&T Infra vs NHAI", location: "Chamber 4, IHC", notes: "Site visit conducted. Expert report submitted." },
    ],
  },
];

export interface DeadlineItem {
  caseId: string;
  step: string;
  party: string;
  lender: string;
  date: string;
  daysOffset: number; // negative = overdue, positive = upcoming
}
export const DEADLINES: DeadlineItem[] = [
  { caseId: "CR//12//2026", step: "Sec 21 Response Due", party: "PESINGU KISHORE", lender: "CredRight", date: "Mar 5", daysOffset: -4 },
  { caseId: "CR//28//2026", step: "Statement of Claim", party: "RAMESH NAIR", lender: "CSB Bank", date: "Mar 6", daysOffset: -3 },
  { caseId: "CR//44//2026", step: "Reply to LRN", party: "ANIL VERMA", lender: "DCB Bank", date: "Mar 7", daysOffset: -2 },
  { caseId: "CR//61//2026", step: "Document Submission", party: "MEENA SHARMA", lender: "Equitas", date: "Mar 8", daysOffset: -1 },
  { caseId: "CR//77//2026", step: "Counter-claim Filing", party: "VIKAS GUPTA", lender: "CredRight", date: "Mar 11", daysOffset: 2 },
  { caseId: "CR//94//2026", step: "Sec 17 Application", party: "PRIYA IYER", lender: "CSB Bank", date: "Mar 12", daysOffset: 3 },
  { caseId: "CR//108//2026", step: "Interim Order Hearing", party: "SURESH BABU", lender: "DCB Bank", date: "Mar 13", daysOffset: 4 },
  { caseId: "CR//125//2026", step: "Reference Letter Reply", party: "KAVITA RAO", lender: "Equitas", date: "Mar 14", daysOffset: 5 },
  { caseId: "CR//141//2026", step: "Statement of Defence", party: "RAJESH KUMAR", lender: "CredRight", date: "Mar 15", daysOffset: 6 },
  { caseId: "CR//156//2026", step: "Evidence Filing", party: "SUNIL MEHTA", lender: "CSB Bank", date: "Mar 16", daysOffset: 7 },
  { caseId: "CR//170//2026", step: "Cross-examination", party: "DEEPAK JOSHI", lender: "DCB Bank", date: "Mar 18", daysOffset: 9 },
  { caseId: "CR//184//2026", step: "Final Arguments", party: "NEHA KAPOOR", lender: "Equitas", date: "Mar 20", daysOffset: 11 },
  { caseId: "CR//197//2026", step: "Award Pronouncement", party: "ARJUN PATEL", lender: "CredRight", date: "Mar 22", daysOffset: 13 },
  { caseId: "CR//205//2026", step: "Sec 21 Notice Service", party: "POOJA SINGH", lender: "CSB Bank", date: "Mar 25", daysOffset: 16 },
  { caseId: "CR//212//2026", step: "Tribunal Constitution", party: "MANOJ TIWARI", lender: "DCB Bank", date: "Mar 28", daysOffset: 19 },
  { caseId: "CR//215//2026", step: "Preliminary Hearing", party: "SHALINI DAS", lender: "Equitas", date: "Apr 2", daysOffset: 24 },
];
