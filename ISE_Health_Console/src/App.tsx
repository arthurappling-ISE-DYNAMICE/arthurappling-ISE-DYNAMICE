import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Activity, AlertTriangle, CheckCircle, FileText, LayoutDashboard,
  BarChart3, Settings, Plus, X,
} from 'lucide-react';

// ── Ground Truth Anchor ───────────────────────────────────────────────────────
const ANCHOR_GLUCOSE = [181, 173, 202, 199, 185, 179, 181, 204, 179, 177, 223, 231, 178, 163];

const ANCHOR_VITALS = ANCHOR_GLUCOSE.map((val, i) => ({
  day: `Mar ${25 + i > 31 ? `Apr ${25 + i - 31}` : 25 + i}`,
  glucose: val,
  target: 140,
}));

const COMMAND_LOG = [
  { id: 1, action: 'Last Reading: 163 mg/dL', time: 'Apr 7', status: 'Improving', color: '#10B981' },
  { id: 2, action: 'A1C Projected: 8.23%',    time: 'Apr 7', status: 'Elevated',  color: '#F59E0B' },
  { id: 3, action: 'Trigger: Hot Cocoa + Rice/Beans', time: 'Spike Log', status: 'Sabotage', color: '#EF4444' },
];

const VULNERABILITY = [
  { label: 'Post-Meal Spike Risk', value: 68, color: '#EF4444' },
  { label: 'Fasting Stability',    value: 55, color: '#F59E0B' },
  { label: 'In-Range (70–180)',    value: 43, color: '#10B981' },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface GlucoseEntry {
  id: number;
  date: string;
  time: string;
  value: number;
  type: string;
  notes: string;
}

interface HealthData {
  glucose: GlucoseEntry[];
  bloodPressure: unknown[];
  last_lab_a1c?: number;
  projected_a1c?: number;
  lastUpdated: string | null;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  title, value, sub, icon: Icon, accent,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-[#111111] border border-white/5 p-6 rounded-2xl hover:border-[#C9A84C]/30 transition-all shadow-xl">
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
    </div>
  );
}

// ── Add Reading Modal ─────────────────────────────────────────────────────────
function AddReadingModal({ onSave, onClose }: { onSave: (v: number, type: string, notes: string) => void; onClose: () => void }) {
  const [value, setValue] = useState('');
  const [type, setType] = useState('fasting');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = parseInt(value);
    if (v >= 40 && v <= 600) { onSave(v, type, notes); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[#C9A84C] italic">Add Glucose Reading</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/40 block mb-1">Reading (mg/dL)</label>
            <input
              type="number" min={40} max={600} required
              value={value} onChange={e => setValue(e.target.value)}
              placeholder="e.g. 163"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/40 block mb-1">Type</label>
            <select
              value={type} onChange={e => setType(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C9A84C]/50"
            >
              <option value="fasting">Fasting</option>
              <option value="post-meal">Post-Meal</option>
              <option value="bedtime">Bedtime</option>
              <option value="random">Random</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/40 block mb-1">Notes</label>
            <input
              type="text" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. after breakfast"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-black transition-all"
            style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 20px rgba(201,168,76,0.4)' }}
          >
            Save Reading
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function GlucoseTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const color = v > 180 ? '#EF4444' : v < 70 ? '#F59E0B' : '#10B981';
  return (
    <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color }}>{v} <span className="text-xs font-normal text-white/40">mg/dL</span></p>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function MedicalDashboard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [showModal, setShowModal] = useState(false);

  // Load from server
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({
        glucose: ANCHOR_GLUCOSE.map((v, i) => ({
          id: i + 1, date: '2026-04-07', time: '07:00',
          value: v, type: 'fasting', notes: 'Anchor data',
        })),
        bloodPressure: [],
        last_lab_a1c: 8.6,
        projected_a1c: 8.23,
        lastUpdated: null,
      }));
  }, []);

  // Derived stats from loaded data
  const glucoseVals = data?.glucose.map(r => r.value) ?? ANCHOR_GLUCOSE;
  const avg14 = glucoseVals.length > 0
    ? (glucoseVals.slice(-14).reduce((a, b) => a + b, 0) / Math.min(glucoseVals.length, 14)).toFixed(1)
    : '189.6';
  const projA1C = (( parseFloat(avg14) + 46.7) / 28.7).toFixed(2);
  const lastLab = data?.last_lab_a1c?.toFixed(1) ?? '8.6';
  const latestReading = glucoseVals.length > 0 ? glucoseVals[glucoseVals.length - 1] : 163;

  // Build chart data — last 14 readings
  const chartData = glucoseVals.slice(-14).map((val, i) => ({
    day: `D${i + 1}`,
    glucose: val,
    target: 140,
  }));

  // Save new reading
  async function handleSave(value: number, type: string, notes: string) {
    if (!data) return;
    const entry: GlucoseEntry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      value, type, notes,
    };
    const updated: HealthData = { ...data, glucose: [...data.glucose, entry] };
    setData(updated);
    setShowModal(false);
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #8B7232)' }}
            >
              A
            </div>
            <span className="font-bold text-lg tracking-tighter">PRIME PATHWY</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/20 mt-1 ml-11">Health Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNav(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeNav === item.name
                  ? 'bg-white/5 text-[#C9A84C] border border-white/5'
                  : 'text-white/40 hover:bg-white/5 hover:text-white/70'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer — trigger alert */}
        <div className="p-4 m-4 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-[#EF4444]" />
            <span className="text-xs font-bold text-[#EF4444] uppercase tracking-widest">Sabotage Alert</span>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">Hot Cocoa + Rice/Beans = Primary spike trigger</p>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 ml-64 p-8 min-h-screen">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold italic" style={{
              background: 'linear-gradient(135deg, #F5D98A, #C9A84C, #E2C06A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Sovereign Monitoring
            </h1>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Architect Health Command Center</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-black transition-all"
              style={{ background: 'linear-gradient(135deg, #E2C06A, #C9A84C)', boxShadow: '0 0 16px rgba(201,168,76,0.35)' }}
            >
              <Plus size={14} /> Add Reading
            </button>
            <div className="flex items-center gap-3 bg-white/5 p-2 pr-4 rounded-full border border-white/10">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-xs"
                style={{ background: '#C9A84C' }}
              >
                AF
              </div>
              <span className="text-sm font-medium">Arthur A.</span>
            </div>
          </div>
        </header>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="14-Day Avg"
            value={`${avg14}`}
            sub="mg/dL"
            icon={Activity}
            accent="#F59E0B"
          />
          <StatCard
            title="Projected A1C"
            value={`${projA1C}%`}
            sub={`Goal: 5.6%`}
            icon={BarChart3}
            accent="#EF4444"
          />
          <StatCard
            title="Baseline Lab"
            value={`${lastLab}%`}
            sub="Last recorded"
            icon={FileText}
            accent="#94A3B8"
          />
          <StatCard
            title="Goal A1C"
            value="5.6%"
            sub={`↓ ${(parseFloat(projA1C) - 5.6).toFixed(2)}% to go`}
            icon={CheckCircle}
            accent="#10B981"
          />
        </div>

        {/* ── Charts + Panels ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Glucose Area Chart */}
          <div className="lg:col-span-2 bg-[#0A0A0A] p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px" style={{
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
            }} />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold italic" style={{ color: '#C9A84C' }}>
                Glucose Trajectory — Last 14 Readings
              </h2>
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-px bg-[#C9A84C]" /> Glucose
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-px bg-white/20 border-dashed border-t" /> Target 140
                </span>
              </div>
            </div>
            <div className="h-[320px] w-full">
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
                  <ReferenceLine y={140} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
                  <ReferenceLine y={180} stroke="rgba(239,68,68,0.2)" strokeDasharray="4 4" />
                  <Area
                    type="monotone"
                    dataKey="glucose"
                    stroke="#C9A84C"
                    strokeWidth={2.5}
                    fill="url(#glucoseGrad)"
                    dot={{ fill: '#C9A84C', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#F5D98A' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-white/30">
              <span>Latest: <strong className="text-white">{latestReading} mg/dL</strong></span>
              <span>14d Avg: <strong className="text-[#C9A84C]">{avg14} mg/dL</strong></span>
              <span>A1C Est: <strong className="text-[#EF4444]">{projA1C}%</strong></span>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            {/* Vulnerability Status */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-sm font-bold italic mb-5 text-white/80">Vulnerability Status</h2>
              <div className="space-y-5">
                {VULNERABILITY.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-2 font-medium">
                      <span className="text-white/60">{item.label}</span>
                      <span style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.value}%`,
                          background: item.color,
                          boxShadow: `0 0 8px ${item.color}60`,
                          transition: 'width 1s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Command Log */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-sm font-bold italic mb-5 text-white/80">Command Log</h2>
              <div className="space-y-4">
                {COMMAND_LOG.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 items-start pl-3 py-1 rounded-lg hover:bg-white/3 transition-colors"
                    style={{ borderLeft: `2px solid ${item.color}40` }}
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white/80">{item.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-white/25 uppercase tracking-widest">{item.time}</span>
                        <span
                          className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                          style={{ color: item.color, background: `${item.color}15` }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* A1C Progress */}
            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-sm font-bold italic mb-4 text-white/80">A1C Reduction Path</h2>
              <div className="space-y-2">
                {[
                  { label: 'Last Lab',  val: 8.6,  color: '#EF4444' },
                  { label: 'Current',   val: parseFloat(projA1C), color: '#F59E0B' },
                  { label: 'Goal',      val: 5.6,  color: '#10B981' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-white/40 uppercase tracking-widest">{row.label}</span>
                    <span className="text-lg font-bold" style={{ color: row.color }}>{row.val.toFixed(1)}%</span>
                  </div>
                ))}
                <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, ((8.6 - parseFloat(projA1C)) / (8.6 - 5.6)) * 100))}%`,
                      background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981)',
                    }}
                  />
                </div>
                <p className="text-[10px] text-white/25 text-center mt-2 uppercase tracking-widest">
                  {((8.6 - parseFloat(projA1C)) / (8.6 - 5.6) * 100).toFixed(0)}% progress toward goal
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Add Reading Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <AddReadingModal
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
