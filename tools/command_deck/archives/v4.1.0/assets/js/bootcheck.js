/**
 * SYS_OS v2.9.7 — Pre-Boot Validation Gate
 *
 * Runs before SYSOS.main boots the platform. Validates that every expected
 * module registered and exposes its critical functions. If config.js (or any
 * module) failed to parse, its namespace is absent — the gate detects that,
 * halts startup, and renders a visible failure panel instead of a silent blank
 * page. This is the direct countermeasure to the v2.9.6 missing-comma incident.
 *
 * The gate itself is defensive: it never assumes window.SYSOS exists.
 */
(function () {
    'use strict';

    // Manifest: namespace -> required member functions/objects.
    var MANIFEST = {
        CONFIG: [],
        utils: ['el', 'notify', 'hash', 'hexToken', 'dateStamp'],
        money: ['toCents', 'toDollars', 'weightCents', 'format'],
        storage: ['get', 'set', 'remove', 'keys', 'query', 'registerBackend', 'transaction'],
        sqlite: ['migrateAndActivate', 'rollbackToLocal', 'migrate'],
        auth: ['can', 'attribute', 'setOperator', 'permissionsFor'],
        audit: ['record', 'query', 'export', 'restore', 'init', 'reportText', 'flush'],
        authUI: ['login', 'logout', 'init', 'validate', 'restore', 'lock', 'unlock'],
        DataStore: [],
        stores: ['define', 'restore', 'totals', 'beginBatch', 'commitBatch', 'rollbackBatch', 'persistDomain'],
        activity: ['log', 'recent', 'restore'],
        relations: ['find', 'resolve', 'backlinks', 'integrity', 'linkStats', 'buildIndex', 'backlinksFast', 'linkStatsFast', 'invalidateIndex'],
        canvas: ['init', 'pause', 'resume', 'status'],
        router: ['init', 'switch', 'register'],
        mountTerminals: null,
        vault: ['ingest', 'verifyChain', 'init', 'hashMode', 'restoreStatus'],
        registriesData: null,
        registriesInit: null,
        exec: ['init'],
        telemetry: ['init', 'probe', 'probeAll'],
        opsQueue: ['enqueue', 'run', 'retry', 'init'],
        routing: ['buildFromRegistry', 'dispatch', 'init'],
        compliance: ['schedule', 'statusOf', 'init'],
        ocr: ['upload', 'process', 'init'],
        liveOpsInit: null,
        client: ['workspace', 'metrics', 'dashboard', 'report'],
        clientInit: null,
        clientStation: ['init', 'mount', 'unmount', 'refresh', 'validate'],
        healthCache: ['getHealth', 'setHealth', 'bumpClient', 'bumpGlobal', 'getDist', 'getMetrics', 'stats'],
        commercial: ['setStage', 'forecast', 'health', '_computeHealth', 'proposalAutomation', 'contractMonitoring', 'portfolio'],
        commercialUI: ['mount', 'unmount', 'refresh', 'validate'],
        smoketest: ['run', 'failureDrills'],
        maintenance: ['run'],
        executive: ['metrics', 'systemHealth', 'operatorWorkspace', 'timeline'],
        executiveUI: ['init', 'validate'],
        demo: ['enter', 'exit', 'toggle', 'status']
    };

    function validate() {
        var missing = [];
        if (typeof window.SYSOS === 'undefined') {
            return { ok: false, missing: ['SYSOS (root namespace — config.js failed to parse/load)'] };
        }
        var S = window.SYSOS;
        Object.keys(MANIFEST).forEach(function (ns) {
            var ref = S[ns];
            if (ref === undefined || ref === null) {
                missing.push(ns + ' (module not registered)');
                return;
            }
            var fns = MANIFEST[ns];
            if (Array.isArray(fns)) {
                fns.forEach(function (fn) {
                    if (typeof ref[fn] !== 'function') missing.push(ns + '.' + fn + ' (function missing)');
                });
            } else if (fns === null && typeof ref !== 'function' && typeof ref !== 'object') {
                missing.push(ns + ' (expected function/object)');
            }
        });
        return { ok: missing.length === 0, missing: missing, checked: Object.keys(MANIFEST).length };
    }

    /** Render a visible halt panel and stop startup. */
    function halt(result) {
        try {
            var panel = document.createElement('div');
            panel.setAttribute('role', 'alert');
            panel.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0a0205;color:#fca5a5;' +
                'font-family:monospace;padding:40px;overflow:auto';
            var h = document.createElement('div');
            h.style.cssText = 'color:#f87171;font-size:16px;font-weight:bold;letter-spacing:2px;margin-bottom:16px';
            h.textContent = 'SYS_OS BOOT HALTED — PRE-BOOT VALIDATION FAILED';
            panel.appendChild(h);
            var sub = document.createElement('div');
            sub.style.cssText = 'color:#94a3b8;font-size:12px;margin-bottom:16px';
            sub.textContent = result.missing.length + ' critical failure(s). Platform start aborted to prevent a partial/corrupt session.';
            panel.appendChild(sub);
            result.missing.forEach(function (m) {
                var row = document.createElement('div');
                row.style.cssText = 'font-size:12px;margin:4px 0';
                row.textContent = '  ✗ ' + m;
                panel.appendChild(row);
            });
            document.body.appendChild(panel);
        } catch (e) { /* DOM unavailable — console only */ }
        console.error('[SYS_OS:bootcheck] HALT —', result.missing);
    }

    window.SYSOS = window.SYSOS || {};
    window.SYSOS.bootcheck = { validate: validate, halt: halt, manifest: MANIFEST };
})();
