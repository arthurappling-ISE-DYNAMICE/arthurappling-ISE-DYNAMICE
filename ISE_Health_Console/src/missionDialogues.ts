// src/missionDialogues.ts
// Status classifiers and mission-intelligence dialogue text.
// Gold = On Target · White = Neutral · Red = Needs Calibration

export type MetricStatus = 'gold' | 'white' | 'red';

// ── Status classifiers ────────────────────────────────────────────────────────
export function glucoseStatus(v: number): MetricStatus {
  if (v <= 175) return 'gold';
  if (v <= 200) return 'white';
  return 'red';
}

export function bpStatus(sys: number, dia: number): MetricStatus {
  if (sys < 120 && dia < 80) return 'gold';
  if (sys < 130 && dia < 85) return 'white';
  return 'red';
}

export function weightStatus(v: number): MetricStatus {
  if (v <= 207) return 'gold';
  if (v <= 215) return 'white';
  return 'red';
}

export function a1cStatus(pct: number): MetricStatus {
  if (pct <= 6.0) return 'gold';
  if (pct <= 7.5) return 'white';
  return 'red';
}

// ── Status display maps ───────────────────────────────────────────────────────
export const STATUS_COLOR: Record<MetricStatus, string> = {
  gold:  '#C9A84C',
  white: 'rgba(255,255,255,0.80)',
  red:   '#EF4444',
};

export const STATUS_LABEL: Record<MetricStatus, string> = {
  gold:  'ON TARGET',
  white: 'NEUTRAL',
  red:   'NEEDS CALIBRATION',
};

// ── Dialogue types ────────────────────────────────────────────────────────────
export interface MissionDialogue {
  headline: string;
  body: string;
}

// ── Glucose Dialogues (anchored to 175 mg/dL threshold and 5.6 A1C mission) ──
export const GLUCOSE_DIALOGUE: Record<MetricStatus, (v: number) => MissionDialogue> = {
  gold: (v) => ({
    headline: 'Glucose — On Target',
    body: `At ${v} mg/dL, your metabolic engine is calibrated for sustained output. The 5.6 A1C mission is active — this reading keeps you on trajectory. Maintain this discipline through the 1.5-year automation build and the compound effect registers at your next lab. The Sovereign Fortress metabolic system is holding.`,
  }),
  white: (v) => ({
    headline: 'Glucose — Operational Drift',
    body: `At ${v} mg/dL, you are above the 175 mg/dL operational threshold — Operational Drift is active. The 5.6 A1C mission requires consistent reads below this line. Avoid known triggers (Hot Cocoa, Rice/Beans). Drift at this level is recoverable today. Left unaddressed, it becomes structural across the week and compounds the mission risk.`,
  }),
  red: (v) => ({
    headline: 'Glucose — Mission Risk',
    body: `At ${v} mg/dL, this reading represents critical Operational Drift. Sustained spikes above 200 mg/dL accelerate vascular damage, cognitive degradation, and neuropathy risk — direct threats to the 20-year Sovereign Fortress and the high-ticket leadership capability it demands. Identify the trigger and recalibrate immediately. The 5.6 mission does not tolerate sustained reads at this level.`,
  }),
};

// ── Blood Pressure Dialogues ──────────────────────────────────────────────────
export const BP_DIALOGUE: Record<MetricStatus, (sys: number, dia: number) => MissionDialogue> = {
  gold: (sys, dia) => ({
    headline: 'Blood Pressure — Optimal',
    body: `At ${sys}/${dia} mmHg, your cardiovascular system is primed for high-performance leadership. Clear cognition, sustained executive focus, and the physiological foundation for a 20-year empire are all online. This is the operational standard. Hold it through the 1.5-year automation sprint — every session at this level is a deposit into the Sovereign Fortress.`,
  }),
  white: (sys, dia) => ({
    headline: 'Blood Pressure — Operational Drift',
    body: `At ${sys}/${dia} mmHg, you are in the pre-hypertension range — Operational Drift in the cardiovascular system. The Sovereign Empire demands steady systems. Monitor sodium intake, stress response, and sleep quality. The 1.5-year automation sprint is a high-load phase; unresolved cardiovascular drift now becomes a compounding liability across the decade.`,
  }),
  red: (sys, dia) => ({
    headline: 'Blood Pressure — Mission Risk',
    body: `At ${sys}/${dia} mmHg, sustained elevation is a direct threat to the 20-year Sovereign Fortress. High blood pressure accelerates cognitive decline, cardiovascular damage, and stroke risk — all mission-critical liabilities for a high-ticket leader operating on a 20-year timeline. This is not a maintenance issue. Escalate to your care team. The mission requires you operational for the long run.`,
  }),
};

// ── Weight Dialogues (target: 185 lbs, anchor: 207 lbs) ──────────────────────
export const WEIGHT_DIALOGUE: Record<MetricStatus, (v: number) => MissionDialogue> = {
  gold: (v) => ({
    headline: 'Weight — On Track',
    body: `At ${v.toFixed(1)} lbs, you are holding the line toward the 185 lb Sovereign target. Physical calibration at this level directly supports executive presence, sustained energy management, and the metabolic efficiency the 20-year mission requires. Every reading here is progress compounding toward the Fortress standard. The system is aligned.`,
  }),
  white: (v) => ({
    headline: 'Weight — Operational Drift',
    body: `At ${v.toFixed(1)} lbs, you are above the 207 lb anchor baseline — Operational Drift in body composition. The 185 lb Sovereign target requires consistent daily discipline through the 1.5-year build phase. Excess mass at this level elevates glucose load and blood pressure — two metrics already under active management. Address the drift before it becomes structural.`,
  }),
  red: (v) => ({
    headline: 'Weight — Mission Risk',
    body: `At ${v.toFixed(1)} lbs, you are trending away from the 185 lb Sovereign target. Excess body mass elevates glucose, blood pressure, and systemic inflammatory load — three compounding threats to the Fortress that accelerate across a 20-year timeline. This is not cosmetic; it is a mission-critical systems failure. Recalibrate nutrition and movement protocols immediately. The empire requires a calibrated operator.`,
  }),
};

// ── A1C Projection Dialogues ──────────────────────────────────────────────────
export const A1C_DIALOGUE: Record<MetricStatus, (pct: string) => MissionDialogue> = {
  gold: (pct) => ({
    headline: 'A1C Projection — On Mission',
    body: `Projected A1C of ${pct}% puts the 5.6 target within striking range. Your 14-day glucose average is calibrated for metabolic health at the executive level. The compound effect of consistent sub-175 readings will register at your next lab. The Sovereign Fortress metabolic engine is operational. Maintain trajectory.`,
  }),
  white: (pct) => ({
    headline: 'A1C Projection — Operational Drift',
    body: `Projected A1C of ${pct}% indicates Operational Drift from the 5.6 mission target. The gap is closable — this is a calibration issue, not a failure. Each glucose reading below 175 mg/dL moves the projection down. The 1.5-year automation timeline demands you resolve this metabolic variable now before it becomes a structural constraint on the mission.`,
  }),
  red: (pct) => ({
    headline: 'A1C Projection — Mission Risk',
    body: `Projected A1C of ${pct}% represents a significant threat to the 20-year Sovereign Fortress. At this level, the risk of neuropathy, cardiovascular damage, and cognitive decline compounds annually — all liabilities that undermine long-duration high-performance leadership. The 5.6 target is non-negotiable for the Fortress standard. Activate your full intervention protocol immediately.`,
  }),
};
