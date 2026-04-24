import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
  ComposedChart, Line,
} from 'recharts';
import {
  glucoseStatus, bpStatus, weightStatus, a1cStatus,
  STATUS_COLOR, STATUS_LABEL,
  GLUCOSE_DIALOGUE, BP_DIALOGUE, WEIGHT_DIALOGUE, A1C_DIALOGUE,
} from './missionDialogues';
import type { MetricStatus } from './missionDialogues';
import {
  Activity, AlertTriangle, CheckCircle, FileText, LayoutDashboard,
  BarChart3, Settings, Plus, X, Heart, Weight,
} from 'lucide-react';

// ── Ground Truth Anchors ──────────────────────────────────────────────────────
const ANCHOR_GLUCOSE   = [181, 173, 202, 199, 185, 179, 181, 204, 179, 177, 223, 231, 178, 163];
const GLUCOSE_TARGET   = 175;
const WEIGHT_TARGET    = 207.0;
const GLUCOSE_A1C_GOAL = 114; // mg/dL equivalent of A1C 5.6% (formula: 5.6 × 28.7 − 46.7)

// ── Types ─────────────────────────────────────────────────────────────────────
interface GlucoseEntry {
  id: number;
  date: string;
  time: string;
  value: number;
  type: string;
  notes: string;
}
interface BPEntry {
  id: number;
  date: string;
  time: string;
  sys: number;
  dia: number;
  notes: string;
}
interface WeightEntry {
  id: number;
  date: string;
  time: string;
  value: number;
  notes: string;
}
interface HealthData {
  glucose:       GlucoseEntry[];
  bloodPressure: BPEntry[];
  weightLog:     WeightEntry[];
  weight_goal?:  number;
  last_lab_a1c?: number;
  projected_a1c?: number;
  lastUpdated:   string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().slice(0, 10); }
function nowTime() { return new Date().toTimeString().slice(0, 5); }
function sortByDateTime<T extends { date: string; time: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) =>
    `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
  );
}

function bpColor(sys: number, dia: number) {
  if (sys >= 140 || dia >= 90) return '#EF4444';
  if (sys >= 130 || dia >= 80) return '#F59E0B';
  return '#10B981';
}
function glucoseColor(v: number) {
  if (v > 180) return '#EF4444';
  if (v > GLUCOSE_TARGET) return '#F59E0B';
  return '#10B981';
}
function weightColor(v: number) {
  return v <= WEIGHT_TARGET ? '#10B981' : '#F59E0B';
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, accent, onClick }: {
  title: string; value: string; sub?: string; icon: React.ElementType; accent: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#111111] border border-white/5 p-6 rounded-2xl transition-all shadow-xl ${
        onClick ? 'cursor-pointer hover:border-white/20 active:scale-[0.98] select-none' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
          {sub && <p className="text-xs mt-1" style={{ color: accent }}>{sub}</p>}
        </div>
        <div className="p-3 rounded-xl" style={{ background: `${accent}18` }}>
          <Icon size={22} style={{ color: accent }} />
        </div>
      </div>
      {onClick && (
        <p className="text-[9px] text-white/20 uppercase tracking-widest mt-3">Click for mission intelligence</p>
      )}
    </div>
  );
}

// ── Metric Dialogue Modal ─────────────────────────────────────────────────────
function MetricDialogueModal({ status, headline, body, onClose }: {
  status: MetricStatus; headline: string; body: string; onClose: () => void;
}) {
  const color = STATUS_COLOR[status];
  const label = STATUS_LABEL[status];
  return (
    <Modal title="Mission Intelligence" onClose={onClose}>
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
          {label}
        </span>
        <h3 className="text-lg font-bold text-white leading-tight">{headline}</h3>
        <p className="text-sm text-white/60 leading-relaxed">{body}</p>
        <button onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-black transition-all"
          style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}>
          Return to Mission
        </button>
      </div>
    </Modal>
  );
}

// ── Glucose Modal ─────────────────────────────────────────────────────────────
function AddGlucoseModal({ onSave, onClose }: {
  onSave: (v: number, type: string, notes: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState('');
  const [type,  setType]  = useState('fasting');
  const [notes, setNotes] = useState('');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = parseInt(value);
    if (v >= 40 && v <= 600) onSave(v, type, notes);
  }
  return (
    <Modal title="Log Blood Glucose" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Reading (mg/dL)">
          <input type="number" min={40} max={600} required value={value}
            onChange={e => setValue(e.target.value)} placeholder="e.g. 149"
            className={INPUT} />
        </Field>
        <Field label="Type">
          <select value={type} onChange={e => setType(e.target.value)} className={INPUT}>
            <option value="fasting">Fasting</option>
            <option value="post-meal">Post-Meal</option>
            <option value="bedtime">Bedtime</option>
            <option value="random">Random</option>
          </select>
        </Field>
        <Field label="Notes">
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="e.g. after breakfast" className={INPUT} />
        </Field>
        <GoldBtn>Save Glucose</GoldBtn>
      </form>
    </Modal>
  );
}

// ── Blood Pressure Modal ──────────────────────────────────────────────────────
function AddBPModal({ onSave, onClose }: {
  onSave: (sys: number, dia: number, notes: string) => void;
  onClose: () => void;
}) {
  const [sys,   setSys]   = useState('');
  const [dia,   setDia]   = useState('');
  const [notes, setNotes] = useState('');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = parseInt(sys), d = parseInt(dia);
    if (s >= 60 && s <= 250 && d >= 40 && d <= 160) onSave(s, d, notes);
  }
  return (
    <Modal title="Log Blood Pressure" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Systolic (SYS)">
            <input type="number" min={60} max={250} required value={sys}
              onChange={e => setSys(e.target.value)} placeholder="e.g. 128"
              className={INPUT} />
          </Field>
          <Field label="Diastolic (DIA)">
            <input type="number" min={40} max={160} required value={dia}
              onChange={e => setDia(e.target.value)} placeholder="e.g. 82"
              className={INPUT} />
          </Field>
        </div>
        {sys && dia && (
          <p className="text-center text-2xl font-bold" style={{ color: bpColor(+sys, +dia) }}>
            {sys} / {dia} <span className="text-xs font-normal text-white/30">mmHg</span>
          </p>
        )}
        <Field label="Notes">
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="e.g. after rest" className={INPUT} />
        </Field>
        <GoldBtn>Save Blood Pressure</GoldBtn>
      </form>
    </Modal>
  );
}

// ── Weight Modal ──────────────────────────────────────────────────────────────
function AddWeightModal({ onSave, onClose }: {
  onSave: (v: number, notes: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = parseFloat(value);
    if (v >= 50 && v <= 600) onSave(v, notes);
  }
  return (
    <Modal title="Log Body Weight" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Weight (lbs)">
          <input type="number" step="0.1" min={50} max={600} required value={value}
            onChange={e => setValue(e.target.value)} placeholder="e.g. 207.0"
            className={INPUT} />
        </Field>
        {value && (
          <p className="text-center text-2xl font-bold" style={{ color: weightColor(+value) }}>
            {(+value).toFixed(1)} <span className="text-xs font-normal text-white/30">lbs</span>
            <span className="ml-3 text-sm font-normal text-white/40">
              Target: {WEIGHT_TARGET}
            </span>
          </p>
        )}
        <Field label="Notes">
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="e.g. morning weigh-in" className={INPUT} />
        </Field>
        <GoldBtn>Save Weight</GoldBtn>
      </form>
    </Modal>
  );
}

// ── Daily Morning Log Modal (3-step wizard) ───────────────────────────────────
function DailyMorningLogModal({ onSave, onClose }: {
  onSave: (
    g: { value: string; type: string; notes: string },
    b: { sys: string; dia: string; notes: string },
    w: { value: string; notes: string }
  ) => void;
  onClose: () => void;
}) {
  const [step,    setStep]   = useState<1 | 2 | 3>(1);
  const [glucose, setGlucose] = useState({ value: '', type: 'fasting', notes: '' });
  const [bp,      setBP]     = useState({ sys: '', dia: '', notes: '' });
  const [weight,  setWeight] = useState({ value: '', notes: '' });

  const STEP_LABELS = ['Glucose', 'Blood Pressure', 'Weight'];

  function handleGlucoseNext(e: React.FormEvent) {
    e.preventDefault();
    const v = parseInt(glucose.value);
    if (v >= 40 && v <= 600) setStep(2);
  }
  function handleBPNext(e: React.FormEvent) {
    e.preventDefault();
    const s = parseInt(bp.sys), d = parseInt(bp.dia);
    if (s >= 60 && s <= 250 && d >= 40 && d <= 160) setStep(3);
  }
  function handleWeightDone(e: React.FormEvent) {
    e.preventDefault();
    const v = parseFloat(weight.value);
    if (v >= 50 && v <= 600) onSave(glucose, bp, weight);
  }

  return (
    <Modal title={`Morning Log — Step ${step} of 3: ${STEP_LABELS[step - 1]}`} onClose={onClose}>
      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {STEP_LABELS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i < step ? '#C9A84C' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleGlucoseNext} className="space-y-4">
          <Field label="Reading (mg/dL)">
            <input type="number" min={40} max={600} required value={glucose.value}
              onChange={e => setGlucose(g => ({ ...g, value: e.target.value }))}
              placeholder="e.g. 149" className={INPUT} autoFocus />
          </Field>
          <Field label="Type">
            <select value={glucose.type} onChange={e => setGlucose(g => ({ ...g, type: e.target.value }))} className={INPUT}>
              <option value="fasting">Fasting</option>
              <option value="post-meal">Post-Meal</option>
              <option value="bedtime">Bedtime</option>
              <option value="random">Random</option>
            </select>
          </Field>
          <Field label="Notes">
            <input type="text" value={glucose.notes}
              onChange={e => setGlucose(g => ({ ...g, notes: e.target.value }))}
              placeholder="e.g. after breakfast" className={INPUT} />
          </Field>
          <GoldBtn>Next: Blood Pressure →</GoldBtn>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleBPNext} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Systolic (SYS)">
              <input type="number" min={60} max={250} required value={bp.sys}
                onChange={e => setBP(b => ({ ...b, sys: e.target.value }))}
                placeholder="e.g. 128" className={INPUT} autoFocus />
            </Field>
            <Field label="Diastolic (DIA)">
              <input type="number" min={40} max={160} required value={bp.dia}
                onChange={e => setBP(b => ({ ...b, dia: e.target.value }))}
                placeholder="e.g. 82" className={INPUT} />
            </Field>
          </div>
          {bp.sys && bp.dia && (
            <p className="text-center text-2xl font-bold" style={{ color: bpColor(+bp.sys, +bp.dia) }}>
              {bp.sys} / {bp.dia} <span className="text-xs font-normal text-white/30">mmHg</span>
            </p>
          )}
          <Field label="Notes">
            <input type="text" value={bp.notes}
              onChange={e => setBP(b => ({ ...b, notes: e.target.value }))}
              placeholder="e.g. after rest" className={INPUT} />
          </Field>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-white/40 border border-white/10 hover:border-white/20 transition-all">
              ← Back
            </button>
            <button type="submit"
              className="flex-[2] py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-black transition-all"
              style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}>
              Next: Weight →
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleWeightDone} className="space-y-4">
          <Field label="Weight (lbs)">
            <input type="number" step="0.1" min={50} max={600} required value={weight.value}
              onChange={e => setWeight(w => ({ ...w, value: e.target.value }))}
              placeholder="e.g. 207.0" className={INPUT} autoFocus />
          </Field>
          {weight.value && (
            <p className="text-center text-2xl font-bold" style={{ color: weightColor(+weight.value) }}>
              {(+weight.value).toFixed(1)} <span className="text-xs font-normal text-white/30">lbs</span>
              <span className="ml-3 text-sm font-normal text-white/40">Target: {WEIGHT_TARGET}</span>
            </p>
          )}
          <Field label="Notes">
            <input type="text" value={weight.notes}
              onChange={e => setWeight(w => ({ ...w, notes: e.target.value }))}
              placeholder="e.g. morning weigh-in" className={INPUT} />
          </Field>
          {/* Trinity summary */}
          <div className="bg-white/5 rounded-xl px-4 py-3 text-xs space-y-1 border border-white/5">
            <p className="text-white/40 uppercase tracking-widest mb-2">Trinity Summary</p>
            <p><span className="text-white/40">Glucose:</span> <span className="font-bold" style={{ color: glucoseColor(+glucose.value) }}>{glucose.value} mg/dL ({glucose.type})</span></p>
            <p><span className="text-white/40">BP:</span> <span className="font-bold" style={{ color: bpColor(+bp.sys, +bp.dia) }}>{bp.sys}/{bp.dia} mmHg</span></p>
            {weight.value && <p><span className="text-white/40">Weight:</span> <span className="font-bold" style={{ color: weightColor(+weight.value) }}>{(+weight.value).toFixed(1)} lbs</span></p>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-white/40 border border-white/10 hover:border-white/20 transition-all">
              ← Back
            </button>
            <button type="submit"
              className="flex-[2] py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-black transition-all"
              style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}>
              Seal the Trinity
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

// ── Shared UI primitives ──────────────────────────────────────────────────────
const INPUT = 'w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none focus:border-[#C9A84C]/50';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[#C9A84C] italic">{title}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/40 block mb-1">{label}</label>
      {children}
    </div>
  );
}
function GoldBtn({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-black transition-all"
      style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}>
      {children}
    </button>
  );
}

// ── Glucose Tooltip ───────────────────────────────────────────────────────────
function GlucoseTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color: glucoseColor(v) }}>
        {v} <span className="text-xs font-normal text-white/40">mg/dL</span>
      </p>
    </div>
  );
}

// ── Log Table ─────────────────────────────────────────────────────────────────
function LogTable({ title, rows, accent }: {
  title: string;
  rows: { label: string; value: string; color: string; sub: string }[];
  accent: string;
}) {
  return (
    <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
      <h2 className="text-sm font-bold italic mb-4" style={{ color: accent }}>{title}</h2>
      {rows.length === 0 ? (
        <p className="text-xs text-white/25 text-center py-6 uppercase tracking-widest">No entries yet</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest">{r.label}</p>
                <p className="text-[10px] text-white/25">{r.sub}</p>
              </div>
              <span className="text-lg font-bold" style={{ color: r.color }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function MedicalDashboard() {
  const [data,            setData]           = useState<HealthData | null>(null);
  const [activeNav,       setActiveNav]      = useState('Dashboard');
  const [showGlucose,     setShowGlucose]    = useState(false);
  const [showBP,          setShowBP]         = useState(false);
  const [showWeight,      setShowWeight]     = useState(false);
  const [showMorningLog,  setShowMorningLog] = useState(false);
  const [dialogueMetric,  setDialogueMetric] = useState<'glucose' | 'bp' | 'weight' | 'a1c' | null>(null);
  const [timeWindow,      setTimeWindow]     = useState<7 | 14 | 30>(14);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({
        glucose: ANCHOR_GLUCOSE.map((v, i) => ({
          id: i + 1, date: '2026-04-10', time: '07:00',
          value: v, type: 'fasting', notes: 'Anchor data',
        })),
        bloodPressure: [],
        weightLog: [{ id: 1, date: '2026-04-09', time: '00:00', value: 207, notes: 'Anchor' }],
        last_lab_a1c: 8.6,
        projected_a1c: 8.23,
        lastUpdated: null,
      }));
  }, []);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const sortedGlucose = sortByDateTime(data?.glucose ?? []);
  const sortedBP      = sortByDateTime(data?.bloodPressure ?? []);
  const sortedWeight  = sortByDateTime(data?.weightLog ?? []);

  const last14Glucose = sortedGlucose.slice(-14);
  const glucoseVals   = last14Glucose.length > 0
    ? last14Glucose.map(r => r.value)
    : ANCHOR_GLUCOSE;

  const avg14 = glucoseVals.length > 0
    ? (glucoseVals.reduce((a, b) => a + b, 0) / glucoseVals.length).toFixed(1)
    : '189.6';
  const projA1C   = ((parseFloat(avg14) + 46.7) / 28.7).toFixed(2);
  const lastLab   = data?.last_lab_a1c?.toFixed(1) ?? '8.6';
  const latestGlucose = sortedGlucose.length > 0
    ? sortedGlucose[sortedGlucose.length - 1].value
    : 149;

  const bpEntries = sortedBP;
  const latestBP  = bpEntries.length > 0 ? bpEntries[bpEntries.length - 1] : null;

  const weightEntries = sortedWeight;
  const latestWeight  = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null;

  const chartData = last14Glucose.length > 0
    ? last14Glucose.map(entry => ({
        day: entry.date.slice(5).replace('-', '/'),
        glucose: entry.value,
      }))
    : ANCHOR_GLUCOSE.map((v, i) => ({ day: `D${i + 1}`, glucose: v }));

  // ── Time-window filtered data (Analytics page) ─────────────────────────────
  const cutoffDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - timeWindow);
    return d.toISOString().slice(0, 10);
  })();
  const windowGlucose      = sortedGlucose.filter(e => e.date >= cutoffDate);
  const windowBP           = sortedBP.filter(e => e.date >= cutoffDate);
  const windowWeight       = sortedWeight.filter(e => e.date >= cutoffDate);
  const windowGlucoseChart = windowGlucose.map(e => ({
    day: e.date.slice(5).replace('-', '/'), glucose: e.value,
  }));
  const bpChartData = windowBP.map(e => ({
    day: e.date.slice(5).replace('-', '/'), sys: e.sys, dia: e.dia,
  }));
  const weightChartData = windowWeight.map(e => ({
    day: e.date.slice(5).replace('-', '/'), weight: e.value,
  }));

  // ── Mission dialogue resolver ───────────────────────────────────────────────
  function getDialogue(metric: 'glucose' | 'bp' | 'weight' | 'a1c') {
    switch (metric) {
      case 'glucose': {
        const s = glucoseStatus(latestGlucose);
        return { status: s, ...GLUCOSE_DIALOGUE[s](latestGlucose) };
      }
      case 'bp': {
        if (!latestBP) return { status: 'white' as MetricStatus, headline: 'Blood Pressure — No Data', body: 'No blood pressure readings logged yet. Log your first reading via Morning Log to activate mission intelligence for this metric.' };
        const s = bpStatus(latestBP.sys, latestBP.dia);
        return { status: s, ...BP_DIALOGUE[s](latestBP.sys, latestBP.dia) };
      }
      case 'weight': {
        const wv = latestWeight?.value ?? WEIGHT_TARGET;
        const s  = weightStatus(wv);
        return { status: s, ...WEIGHT_DIALOGUE[s](wv) };
      }
      case 'a1c': {
        const s = a1cStatus(parseFloat(projA1C));
        return { status: s, ...A1C_DIALOGUE[s](projA1C) };
      }
    }
  }

  // ── Save handlers ───────────────────────────────────────────────────────────
  async function persist(updated: HealthData) {
    setData(updated);
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  }

  async function handleGlucose(value: number, type: string, notes: string) {
    if (!data) return;
    const entry: GlucoseEntry = { id: Date.now(), date: today(), time: nowTime(), value, type, notes };
    setShowGlucose(false);
    await persist({ ...data, glucose: [...data.glucose, entry] });
  }

  async function handleBP(sys: number, dia: number, notes: string) {
    if (!data) return;
    const entry: BPEntry = { id: Date.now(), date: today(), time: nowTime(), sys, dia, notes };
    setShowBP(false);
    await persist({ ...data, bloodPressure: [...data.bloodPressure, entry] });
  }

  async function handleWeight(value: number, notes: string) {
    if (!data) return;
    const entry: WeightEntry = { id: Date.now(), date: today(), time: nowTime(), value, notes };
    setShowWeight(false);
    await persist({ ...data, weightLog: [...data.weightLog, entry] });
  }

  async function handleMorningLog(
    g: { value: string; type: string; notes: string },
    b: { sys: string; dia: string; notes: string },
    w: { value: string; notes: string }
  ) {
    if (!data) return;
    const ts = Date.now();
    const t  = nowTime();
    const d  = today();
    const glucoseEntry: GlucoseEntry = { id: ts,     date: d, time: t, value: parseInt(g.value),   type: g.type,       notes: g.notes };
    const bpEntry: BPEntry           = { id: ts + 1, date: d, time: t, sys:  parseInt(b.sys),       dia: parseInt(b.dia), notes: b.notes };
    const weightEntry: WeightEntry   = { id: ts + 2, date: d, time: t, value: parseFloat(w.value), notes: w.notes };
    setShowMorningLog(false);
    await persist({
      ...data,
      glucose:       [...data.glucose, glucoseEntry],
      bloodPressure: [...data.bloodPressure, bpEntry],
      weightLog:     [...data.weightLog, weightEntry],
    });
  }

  // ── Nav ─────────────────────────────────────────────────────────────────────
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings',  icon: Settings },
  ];

  // ── Recent log rows ─────────────────────────────────────────────────────────
  const bpRows = [...bpEntries].reverse().slice(0, 5).map(e => ({
    label: `${e.date} ${e.time}`,
    value: `${e.sys}/${e.dia}`,
    color: bpColor(e.sys, e.dia),
    sub: e.notes || '—',
  }));

  const weightRows = [...weightEntries].reverse().slice(0, 5).map(e => ({
    label: `${e.date} ${e.time}`,
    value: `${e.value.toFixed(1)} lbs`,
    color: weightColor(e.value),
    sub: e.notes || '—',
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #8B7232)' }}>A</div>
            <span className="font-bold text-lg tracking-tighter">PRIME PATHWY</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/20 mt-1 ml-11">Health Console V4</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.name} onClick={() => setActiveNav(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeNav === item.name
                  ? 'bg-white/5 text-[#C9A84C] border border-white/5'
                  : 'text-white/40 hover:bg-white/5 hover:text-white/70'
              }`}>
              <item.icon size={18} />
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Vitals quick-log buttons */}
        <div className="p-4 space-y-2">
          <p className="text-[9px] uppercase tracking-widest text-white/20 mb-3 px-1">Quick Log</p>
          {[
            { label: 'Glucose',        action: () => setShowGlucose(true), color: '#C9A84C' },
            { label: 'Blood Pressure', action: () => setShowBP(true),      color: '#94A3B8' },
            { label: 'Weight',         action: () => setShowWeight(true),   color: '#10B981' },
          ].map(b => (
            <button key={b.label} onClick={b.action}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:opacity-90"
              style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}30` }}>
              <Plus size={12} /> {b.label}
            </button>
          ))}
        </div>

        <div className="p-4 m-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-[#EF4444]" />
            <span className="text-xs font-bold text-[#EF4444] uppercase tracking-widest">Spike Alert</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">Hot Cocoa + Rice/Beans = Primary trigger</p>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="flex-1 ml-64 p-8 min-h-screen">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold italic" style={{
              background: 'linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              TRI-VITALS V4
            </h1>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
              Glucose · Blood Pressure · Weight · JARVIS ENGINE V3
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowMorningLog(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.30)', boxShadow: '0 0 12px rgba(201,168,76,0.15)' }}>
              <FileText size={14} /> Morning Log
            </button>
            <button onClick={() => setShowGlucose(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-black transition-all"
              style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 16px rgba(201,168,76,0.35)' }}>
              <Plus size={14} /> Glucose
            </button>
            <button onClick={() => setShowBP(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white/80 transition-all hover:bg-white/10 border border-white/10">
              <Heart size={14} /> BP
            </button>
            <button onClick={() => setShowWeight(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
              style={{ background: '#10B98118', color: '#10B981', border: '1px solid #10B98130' }}>
              <Weight size={14} /> Weight
            </button>
            <div className="flex items-center gap-3 bg-white/5 p-2 pr-4 rounded-full border border-white/10 ml-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-xs"
                style={{ background: '#C9A84C' }}>AF</div>
              <span className="text-sm font-medium">Arthur A.</span>
            </div>
          </div>
        </header>

        {activeNav === 'Analytics' && (
          <div>
            {/* ── Time-window toggle ────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold italic" style={{
                  background: 'linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Analytics Engine</h1>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Trend Audit · JARVIS ENGINE V3</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                {([7, 14, 30] as const).map(w => (
                  <button key={w} onClick={() => setTimeWindow(w)}
                    className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                    style={timeWindow === w
                      ? { background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', color: '#000' }
                      : { color: 'rgba(255,255,255,0.40)' }}>
                    {w}d
                  </button>
                ))}
              </div>
            </div>

            {/* ── Glucose trajectory ────────────────────────────────────────── */}
            <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl mb-8">
              <h2 className="text-lg font-bold italic text-[#C9A84C] mb-6">
                Glucose Trajectory — {timeWindow}-Day
              </h2>
              {windowGlucoseChart.length === 0 ? (
                <p className="text-xs text-white/25 text-center py-12 uppercase tracking-widest">No glucose entries in this window</p>
              ) : (
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={windowGlucoseChart} margin={{ top: 10, right: 80, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="glucoseGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[80, 260]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<GlucoseTooltip />} />
                      <ReferenceLine y={GLUCOSE_A1C_GOAL} stroke="rgba(16,185,129,0.5)" strokeDasharray="3 3"
                        label={{ value: 'A1C 5.6 Goal', fill: 'rgba(16,185,129,0.7)', fontSize: 9, position: 'insideTopRight' }} />
                      <ReferenceLine y={GLUCOSE_TARGET} stroke="rgba(201,168,76,0.4)" strokeDasharray="4 4"
                        label={{ value: `Target ${GLUCOSE_TARGET}`, fill: 'rgba(201,168,76,0.65)', fontSize: 9, position: 'insideTopRight' }} />
                      <ReferenceLine y={180} stroke="rgba(239,68,68,0.25)" strokeDasharray="4 4"
                        label={{ value: 'Alert 180', fill: 'rgba(239,68,68,0.5)', fontSize: 9, position: 'insideTopRight' }} />
                      <Area type="monotone" dataKey="glucose" stroke="#C9A84C" strokeWidth={2.5}
                        fill="url(#glucoseGrad2)"
                        dot={{ fill: '#C9A84C', r: 3, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: '#F5D98A' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* ── BP + Weight charts ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Blood Pressure */}
              <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-sm font-bold italic text-[#94A3B8] mb-4">
                  Blood Pressure — {timeWindow}-Day
                </h2>
                {bpChartData.length === 0 ? (
                  <p className="text-xs text-white/25 text-center py-12 uppercase tracking-widest">No BP entries in this window</p>
                ) : (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={bpChartData} margin={{ top: 10, right: 60, left: -20, bottom: 0 }}>
                        <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[40, 200]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                          labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                          itemStyle={{ color: '#94A3B8', fontWeight: 700 }}
                        />
                        <ReferenceLine y={120} stroke="rgba(16,185,129,0.4)" strokeDasharray="4 4"
                          label={{ value: 'SYS 120', fill: 'rgba(16,185,129,0.6)', fontSize: 9, position: 'insideTopRight' }} />
                        <ReferenceLine y={80} stroke="rgba(148,163,184,0.3)" strokeDasharray="4 4"
                          label={{ value: 'DIA 80', fill: 'rgba(148,163,184,0.5)', fontSize: 9, position: 'insideTopRight' }} />
                        <Line type="monotone" dataKey="sys" stroke="#94A3B8" strokeWidth={2.5}
                          dot={{ fill: '#94A3B8', r: 3, strokeWidth: 0 }} name="Systolic" />
                        <Line type="monotone" dataKey="dia" stroke="rgba(148,163,184,0.5)" strokeWidth={2}
                          dot={{ fill: 'rgba(148,163,184,0.5)', r: 3, strokeWidth: 0 }} name="Diastolic" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-sm font-bold italic text-[#10B981] mb-4">
                  Weight — {timeWindow}-Day
                </h2>
                {weightChartData.length === 0 ? (
                  <p className="text-xs text-white/25 text-center py-12 uppercase tracking-widest">No weight entries in this window</p>
                ) : (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightChartData} margin={{ top: 10, right: 60, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[170, 230]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                          labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                          itemStyle={{ color: '#10B981', fontWeight: 700 }}
                        />
                        <ReferenceLine y={185} stroke="rgba(16,185,129,0.5)" strokeDasharray="4 4"
                          label={{ value: 'Goal 185', fill: 'rgba(16,185,129,0.7)', fontSize: 9, position: 'insideTopRight' }} />
                        <ReferenceLine y={207} stroke="rgba(201,168,76,0.3)" strokeDasharray="4 4"
                          label={{ value: 'Anchor 207', fill: 'rgba(201,168,76,0.5)', fontSize: 9, position: 'insideTopRight' }} />
                        <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2.5}
                          fill="url(#weightGrad)"
                          dot={{ fill: '#10B981', r: 3, strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: '#6EE7B7' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeNav === 'Settings' && (
          <div className="max-w-lg">
            <h1 className="text-2xl font-bold italic text-[#C9A84C] mb-2">Settings</h1>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Console Configuration · Prime Pathwy</p>
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Analytics Time Window</p>
              <div className="flex gap-2">
                {([7, 14, 30] as const).map(w => (
                  <button key={w} onClick={() => setTimeWindow(w)}
                    className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border"
                    style={timeWindow === w
                      ? { background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', color: '#000', border: 'none' }
                      : { color: 'rgba(255,255,255,0.40)', borderColor: 'rgba(255,255,255,0.08)' }}>
                    {w}-Day
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/25 leading-relaxed">
                Controls the default trend window across all Analytics charts. Current: {timeWindow}-day view.
              </p>
            </div>
          </div>
        )}

        {activeNav === 'Dashboard' && (<>
        {/* ── Tri-Vitals Stat Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Latest Glucose"
            value={`${latestGlucose}`}
            sub={`Target: ${GLUCOSE_TARGET} mg/dL`}
            icon={Activity}
            accent={STATUS_COLOR[glucoseStatus(latestGlucose)]}
            onClick={() => setDialogueMetric('glucose')}
          />
          <StatCard
            title="Blood Pressure"
            value={latestBP ? `${latestBP.sys}/${latestBP.dia}` : '— / —'}
            sub={latestBP ? 'mmHg' : '[ SERVER OFFLINE ]'}
            icon={Heart}
            accent={latestBP ? STATUS_COLOR[bpStatus(latestBP.sys, latestBP.dia)] : '#F59E0B'}
            onClick={() => setDialogueMetric('bp')}
          />
          <StatCard
            title="Body Weight"
            value={latestWeight ? `${latestWeight.value.toFixed(1)}` : '207.0'}
            sub={`Target: 185 lbs`}
            icon={Weight}
            accent={STATUS_COLOR[weightStatus(latestWeight?.value ?? WEIGHT_TARGET)]}
            onClick={() => setDialogueMetric('weight')}
          />
          <StatCard
            title="Projected A1C"
            value={`${projA1C}%`}
            sub={`Lab: ${lastLab}% · Goal: 5.6%`}
            icon={BarChart3}
            accent={STATUS_COLOR[a1cStatus(parseFloat(projA1C))]}
            onClick={() => setDialogueMetric('a1c')}
          />
        </div>

        {/* ── Glucose Chart + Right Panels ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Glucose Area Chart */}
          <div className="lg:col-span-2 bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold italic" style={{ color: '#C9A84C' }}>
                Glucose Trajectory — Last 14 Readings
              </h2>
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-px bg-[#C9A84C]" /> Glucose
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-px bg-white/20 border-dashed border-t" /> Target {GLUCOSE_TARGET}
                </span>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 260]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<GlucoseTooltip />} />
                  <ReferenceLine y={GLUCOSE_A1C_GOAL} stroke="rgba(16,185,129,0.45)" strokeDasharray="3 3" label={{ value: 'A1C 5.6 Goal', fill: 'rgba(16,185,129,0.65)', fontSize: 9, position: 'insideTopRight' }} />
                  <ReferenceLine y={GLUCOSE_TARGET} stroke="rgba(201,168,76,0.3)" strokeDasharray="4 4" />
                  <ReferenceLine y={180} stroke="rgba(239,68,68,0.2)" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="glucose" stroke="#C9A84C" strokeWidth={2.5}
                    fill="url(#glucoseGrad)"
                    dot={{ fill: '#C9A84C', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#F5D98A' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-white/30">
              <span>Latest: <strong className="text-white">{latestGlucose} mg/dL</strong></span>
              <span>14d Avg: <strong className="text-[#C9A84C]">{avg14} mg/dL</strong></span>
              <span>A1C Est: <strong className="text-[#EF4444]">{projA1C}%</strong></span>
            </div>
          </div>

          {/* A1C Path */}
          <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-sm font-bold italic mb-4 text-white/80">A1C Reduction Path</h2>
            <div className="space-y-2">
              {[
                { label: 'Last Lab', val: 8.6,                  color: '#EF4444' },
                { label: 'Current',  val: parseFloat(projA1C),  color: '#F59E0B' },
                { label: 'Goal',     val: 5.6,                  color: '#10B981' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-white/40 uppercase tracking-widest">{row.label}</span>
                  <span className="text-lg font-bold" style={{ color: row.color }}>{row.val.toFixed(1)}%</span>
                </div>
              ))}
              <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${Math.max(0, Math.min(100, ((8.6 - parseFloat(projA1C)) / (8.6 - 5.6)) * 100))}%`,
                  background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981)',
                }} />
              </div>
              <p className="text-[10px] text-white/25 text-center mt-2 uppercase tracking-widest">
                {((8.6 - parseFloat(projA1C)) / (8.6 - 5.6) * 100).toFixed(0)}% toward goal
              </p>
            </div>

            {/* Weight progress */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <h2 className="text-sm font-bold italic mb-4 text-white/80">Weight Path</h2>
              <div className="space-y-2">
                {[
                  { label: 'Anchor',  val: `207.0 lbs`, color: '#F59E0B' },
                  { label: 'Current', val: latestWeight ? `${latestWeight.value.toFixed(1)} lbs` : '207.0 lbs', color: '#C9A84C' },
                  { label: 'Goal',    val: `185.0 lbs`, color: '#10B981' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/40 uppercase tracking-widest">{row.label}</span>
                    <span className="text-sm font-bold" style={{ color: row.color }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BP + Weight Logs ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LogTable title="Blood Pressure Log" rows={bpRows}  accent="#94A3B8" />
          <LogTable title="Weight Log"          rows={weightRows} accent="#10B981" />
        </div>
        </>)}

      </main>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      {showGlucose    && <AddGlucoseModal      onSave={handleGlucose}    onClose={() => setShowGlucose(false)} />}
      {showBP         && <AddBPModal           onSave={handleBP}         onClose={() => setShowBP(false)} />}
      {showWeight     && <AddWeightModal        onSave={handleWeight}     onClose={() => setShowWeight(false)} />}
      {showMorningLog && <DailyMorningLogModal  onSave={handleMorningLog} onClose={() => setShowMorningLog(false)} />}
      {dialogueMetric && (() => {
        const d = getDialogue(dialogueMetric);
        return <MetricDialogueModal status={d.status} headline={d.headline} body={d.body} onClose={() => setDialogueMetric(null)} />;
      })()}
    </div>
  );
}
