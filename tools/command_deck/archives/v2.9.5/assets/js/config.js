/**
 * SYS_OS — Central Configuration Registry
 * Single source of truth for every constant in the platform.
 * No other module may declare magic numbers. (Audit F-32 remediation)
 */
(function () {
    'use strict';
    window.SYSOS = window.SYSOS || {};

    SYSOS.CONFIG = Object.freeze({
        VERSION: '2.9.5',
        CODENAME: 'COMMERCIAL_READINESS',
        PREVIOUS_VERSION: '2.9.0',

        IDENTITY: Object.freeze({
            NAME: 'A. FITZGERALD APPLING SR.',
            ROLE: 'Lead Technical Architect',
            INITIALS: 'AF',
            ENTITY: 'AA Capital INC dba Prime Pathwy'
        }),

        // Headline telemetry (Architect Core metric row)
        METRICS: Object.freeze({
            DSCR: '7.42×',
            DSCR_BAR_PCT: 74.2,
            CAPITAL_ALLOCATION: '$130,000',
            CONSULTING_PIPELINE: '$5,000+',
            TIMELINE_HORIZON: '1.5 YRS'
        }),

        CANVAS: Object.freeze({
            MAX_POINTS: 45,
            LINK_DISTANCE: 140,        // px — connections drawn under this distance
            TARGET_FPS: 30,            // halves render work vs v2.6 with no visible change
            POINT_COLOR: '#D4AF37',
            LINK_COLOR: 'rgba(212, 175, 55, 0.04)',
            LINE_WIDTH: 0.8,
            DRIFT_SPEED: 0.4,          // px per 60fps-normalized frame (matches v2.6 speed)
            MAX_DPR: 2                 // cap backing-store scale on 3x+ displays
        }),

        TERMINAL: Object.freeze({
            MAX_LOG_ENTRIES: 60,       // rolling cap — oldest entries pruned (Audit F-10)
            RESPONSE_DELAY_MS: 800,
            CUSTOM_DELAY_MS: 500
        }),

        TIMINGS: Object.freeze({
            PING_MS: 500,
            AUDIT_MS: 600,
            TOAST_MS: 6000,
            INGEST_PULSE_MS: 2500      // pulse animation is removed after this (Audit F-11)
        }),

        VAULT: Object.freeze({
            STORAGE_KEY: 'sysos.vault.v1',
            LEGACY_BASELINE_ROWS: 35,  // pre-engine rows counted in the v2.6 "38" display
            HASH_PREVIEW_CHARS: 9,
            MIN_SEARCH_CHARS: 2
        }),

        STORE: Object.freeze({
            STORAGE_KEY: 'sysos.registry.v1',
            ACTIVITY_KEY: 'sysos.activity.v1',
            SEED_VERSION: 3,        // v2.9.5: clients domain added — bump forces reseed
            ACTIVITY_CAP: 50
        }),

        // v2.9 LIVE OPERATIONS ----------------------------------------------

        TELEMETRY: Object.freeze({
            PROBE_TIMEOUT_MS: 3000,    // AbortController cutoff per health probe
            DEGRADED_MS: 800,          // RTT above this = DEGRADED (still up)
            AUTO_INTERVAL_MS: 30000,   // background sweep cadence when enabled
            // Real probe targets. A probe is a measured fetch with timing —
            // reachable => ONLINE/DEGRADED by RTT, unreachable/timeout => OFFLINE.
            NODES: Object.freeze([
                Object.freeze({ id: 'command_deck', label: 'Command Deck (self)', url: 'index.html', port: 4173 }),
                Object.freeze({ id: 'betting_engine', label: 'Sports Betting Analytics Engine', url: 'http://localhost:3132/', port: 3132 }),
                Object.freeze({ id: 'hyperframes', label: 'Hyperframes Core Workspace', url: 'http://localhost:4173/', port: 4173 })
            ])
        }),

        OPSQUEUE: Object.freeze({
            STORAGE_KEY: 'sysos.opsqueue.v1',
            MAX_RETRIES: 3,
            CAP: 100,                  // rolling cap on retained operations
            RUN_LATENCY_MS: 600        // simulated execution window for routed ops
        }),

        COMPLIANCE_SCHED: Object.freeze({
            STORAGE_KEY: 'sysos.compliance.sched.v1',
            DUE_SOON_DAYS: 14,         // within this window => DUE_SOON
            ESCALATE_DAYS: 3           // within this (or overdue) => ESCALATED
        }),

        OCR: Object.freeze({
            STORAGE_KEY: 'sysos.ocr.v1',
            MAX_FILE_KB: 8192,
            ACCEPT: '.png,.jpg,.jpeg,.pdf,.tiff,.tif,.heic'
        })
    });

    /**
     * UI state-class tokens. Base classes live in markup; only these
     * state deltas are toggled by JS. Defined once — HTML and JS can no
     * longer diverge silently. (Audit F-06 remediation)
     */
    SYSOS.UI = Object.freeze({
        NAV_ACTIVE: Object.freeze([
            'bg-gold-500/5', 'border-gold-500/30', 'text-gold-400',
            'shadow-[0_0_15px_rgba(212,175,55,0.05)]'
        ]),
        NAV_INACTIVE: Object.freeze([
            'text-slate-500', 'border-transparent',
            'hover:bg-white/5', 'hover:text-slate-300'
        ]),
        PING_BUSY: 'text-[10px] font-mono bg-amber-500/20 border border-amber-500 px-3 py-1 rounded text-amber-400 tracking-widest transition-all'
    });

    /**
     * Agent communication protocols. All terminal copy and routing rules
     * live here — the terminal engine is content-agnostic. (Audit F-33)
     */
    SYSOS.PROTOCOLS = Object.freeze({
        ceo: Object.freeze({
            id: 'ceo',
            title: 'CEO Strategic Intelligence Interface',
            subtitle: 'Protocol Matrix: Jeremy Miner NEPQ Communication Framework',
            badge: 'ROUTING SYSTEM: ACTIVE',
            banner: 'SECURE CONSOLE LINK OPEN // ENCRYPTED DECK CHANNELS',
            boot: 'Sovereign planning environment confirmed. Ready to execute corporate framework transformations and pipeline operations. Awaiting architectural instruction sequence...',
            placeholder: 'Inject localized strategic processing command sequence...',
            presets: Object.freeze([
                Object.freeze({ label: '> Run Capital Stack Verification', payload: 'Verify Capital Stack Positions' }),
                Object.freeze({ label: '> Generate NEPQ Pipeline Framework', payload: 'Deploy NEPQ Conversion Architecture' }),
                Object.freeze({ label: '> Run Consulting Delivery Evaluation', payload: 'Audit High-Ticket Consulting SOP' })
            ]),
            responses: Object.freeze([
                Object.freeze({ match: 'Capital Stack', reply: 'Capital stack metrics compiled. Operational cash reserves isolated under AA Capital configurations. No drift dependencies found.' }),
                Object.freeze({ match: 'NEPQ', reply: "NEPQ Sequencing Protocol Engaged: 'What are the main organizational challenges preventing you from shifting from manual labor tasks to automated sovereign systems?'" })
            ]),
            fallback: 'High-ticket delivery structures validated against Prime Pathwy consulting models. Framework deployment protocols ready.'
        }),
        coo: Object.freeze({
            id: 'coo',
            title: 'COO Operational Optimization Terminal',
            subtitle: 'Core Metrics: Property Turnover Pipelines & Supply Chain Distribution Nodes',
            badge: 'MONITOR MODES: ACTIVE',
            banner: 'SECURE OPERATION LINK SECURED // NO MANUAL BYPASS DETECTED',
            boot: 'Operational framework online. Ground Truth monitoring algorithms engaged. Ready to process compliance routing sequences...',
            placeholder: 'Inject localized operational deployment sequence payload...',
            presets: Object.freeze([
                Object.freeze({ label: '> Launch Asset Turnover System', payload: 'Deploy Turnover Pipeline Asset' }),
                Object.freeze({ label: '> Link Richmond RPDC Anchor Grid', payload: 'Sync Richmond RPDC Infrastructure Log' }),
                Object.freeze({ label: '> Audit Local Environment Health', payload: 'Run Workspace Ground Truth Verification' })
            ]),
            responses: Object.freeze([
                Object.freeze({ match: 'Turnover', reply: 'Turnover system manifest synchronized. Tracking logs indicate audit-readiness across target clean-out workflows.' }),
                Object.freeze({ match: 'Richmond', reply: 'Richmond RPDC network alignment verified. Telemetry parameters operating under baseline standards.' })
            ]),
            fallback: 'Ground Truth verification engine scans completed. Local operational environment directories are verified, secure, and clean.'
        })
    });
})();
