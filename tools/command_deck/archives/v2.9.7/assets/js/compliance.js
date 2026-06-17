/**
 * SYS_OS v2.9 — Compliance Scheduler
 *
 * Adds a scheduling layer ON TOP of the preserved v2.8 Compliance Registry.
 * Scheduling metadata (due dates, reminders, escalation) lives in its own
 * store keyed by compliance-record id — the registry schema is never mutated.
 *
 * Derived status (computed from dueDate vs now):
 *   CLEAR      no due date, or due far out
 *   DUE_SOON   within DUE_SOON_DAYS
 *   ESCALATED  within ESCALATE_DAYS or overdue
 *   COMPLETED  operator-marked done
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    function cfg() { return SYSOS.CONFIG.COMPLIANCE_SCHED; }
    const DAY = 86400000;

    const scheduler = {
        schedules: new Map(),   // complianceId -> { dueDate, reminderDays, completed, completedAt, notes }

        // ---------- scheduling ----------

        schedule(complianceId, opts) {
            opts = opts || {};
            if (!SYSOS.stores.all.compliance.get(complianceId)) {
                throw new Error('unknown compliance record: ' + complianceId);
            }
            const rec = {
                complianceId: complianceId,
                dueDate: opts.dueDate || null,                 // ISO date string
                reminderDays: opts.reminderDays != null ? opts.reminderDays : cfg().DUE_SOON_DAYS,
                completed: !!opts.completed,
                completedAt: opts.completedAt || null,
                notes: opts.notes || '',
                updatedAt: new Date().toISOString()
            };
            this.schedules.set(complianceId, rec);
            this.persist();
            SYSOS.activity.log('COMPLIANCE', 'Scheduled ' + complianceId +
                (rec.dueDate ? ' due ' + rec.dueDate.slice(0, 10) : ' (no date)'));
            this.emit();
            return rec;
        },

        complete(complianceId) {
            const rec = this.schedules.get(complianceId);
            if (!rec) return null;
            rec.completed = true;
            rec.completedAt = new Date().toISOString();
            rec.updatedAt = rec.completedAt;
            this.persist();
            SYSOS.activity.log('COMPLIANCE', 'Completed ' + complianceId);
            this.emit();
            return rec;
        },

        /** Derived escalation state — measured against the current clock. */
        statusOf(complianceId) {
            const rec = this.schedules.get(complianceId);
            if (!rec) return { state: 'UNSCHEDULED', daysLeft: null };
            if (rec.completed) return { state: 'COMPLETED', daysLeft: null };
            if (!rec.dueDate) return { state: 'CLEAR', daysLeft: null };
            const daysLeft = Math.floor((new Date(rec.dueDate).getTime() - Date.now()) / DAY);
            let state = 'CLEAR';
            if (daysLeft <= cfg().ESCALATE_DAYS) state = 'ESCALATED';
            else if (daysLeft <= cfg().DUE_SOON_DAYS) state = 'DUE_SOON';
            return { state: state, daysLeft: daysLeft };
        },

        /** Records whose reminder window is open (and not completed). */
        reminders() {
            const out = [];
            const self = this;
            this.schedules.forEach(function (rec, id) {
                const st = self.statusOf(id);
                if (!rec.completed && (st.state === 'DUE_SOON' || st.state === 'ESCALATED')) {
                    const reg = SYSOS.stores.all.compliance.get(id);
                    out.push({ id: id, name: reg ? reg.name : id, dueDate: rec.dueDate,
                        daysLeft: st.daysLeft, state: st.state });
                }
            });
            return out.sort(function (a, b) { return (a.daysLeft || 0) - (b.daysLeft || 0); });
        },

        list() {
            const out = [];
            const self = this;
            SYSOS.stores.all.compliance.entries.forEach(function (reg) {
                const st = self.statusOf(reg.id);
                const sched = self.schedules.get(reg.id) || null;
                out.push({ id: reg.id, name: reg.name, registryStatus: reg.status,
                    dueDate: sched ? sched.dueDate : null, state: st.state, daysLeft: st.daysLeft });
            });
            return out;
        },

        summary() {
            const list = this.list();
            return {
                scheduled: this.schedules.size,
                escalated: list.filter(function (r) { return r.state === 'ESCALATED'; }).length,
                dueSoon: list.filter(function (r) { return r.state === 'DUE_SOON'; }).length
            };
        },

        // ---------- seed + persistence ----------

        seedIfEmpty() {
            if (this.schedules.size) return;
            const now = Date.now();
            // Real obligations from the compliance registry, given working dates.
            if (SYSOS.stores.all.compliance.get('uei_registration')) {
                this.schedule('uei_registration', {
                    dueDate: new Date(now + 9 * DAY).toISOString(),   // inside DUE_SOON window
                    notes: 'Required before fleet voucher submission (HVIP/Carl Moyer).'
                });
            }
            if (SYSOS.stores.all.compliance.get('cert_rehab_petition')) {
                this.schedule('cert_rehab_petition', {
                    dueDate: new Date(now + 2 * DAY).toISOString(),   // inside ESCALATE window
                    notes: 'Petition readiness checkpoint — CA Penal Code §4852.01 track.'
                });
            }
            if (SYSOS.stores.all.compliance.get('sbdc_pitch')) {
                this.schedule('sbdc_pitch', { completed: true, notes: 'SBDC pitch 2026-04-24 delivered.' });
            }
        },

        persist() {
            try {
                localStorage.setItem(cfg().STORAGE_KEY, JSON.stringify({
                    v: 1, schedules: Array.from(this.schedules.values())
                }));
            } catch (e) { console.warn('[SYS_OS:compliance] persistence unavailable', e); }
        },

        restore() {
            try {
                const raw = localStorage.getItem(cfg().STORAGE_KEY);
                if (!raw) return false;
                this.schedules = new Map(JSON.parse(raw).schedules.map(function (s) {
                    return [s.complianceId, s];
                }));
                return this.schedules.size > 0;
            } catch (e) { return false; }
        },

        emit() { document.dispatchEvent(new CustomEvent('sysos:compliance')); },

        init() {
            if (!this.restore()) this.seedIfEmpty();
        }
    };

    SYSOS.compliance = scheduler;
})();
