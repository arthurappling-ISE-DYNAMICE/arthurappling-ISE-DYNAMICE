/**
 * SYS_OS — Neural Core Canvas Engine
 *
 * Production-safe rendering architecture (Audit F-12, F-14, F-15, F-16, F-18, F-23):
 *  - Explicit pause()/resume() API — capture tools and tests can freeze the frame.
 *  - Auto-pauses on visibilitychange; resumes when the tab returns.
 *  - Frame-rate capped at CONFIG.CANVAS.TARGET_FPS; motion is time-normalized,
 *    so drift speed is identical to v2.6 regardless of refresh rate.
 *  - Squared-distance link test (no sqrt in the O(n²) pass).
 *  - devicePixelRatio-aware backing store (sharp on HiDPI, capped at MAX_DPR).
 *  - Honors prefers-reduced-motion: renders one static frame, no loop.
 */
(function () {
    'use strict';
    const SYSOS = window.SYSOS;

    const state = {
        canvas: null,
        ctx: null,
        points: [],
        rafId: null,
        running: false,
        lastTs: 0,
        reduced: false,
        pausedBy: null
    };

    function cfg() { return SYSOS.CONFIG.CANVAS; }

    function size() {
        const dpr = Math.min(window.devicePixelRatio || 1, cfg().MAX_DPR);
        state.canvas.width = window.innerWidth * dpr;
        state.canvas.height = window.innerHeight * dpr;
        state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function buildPoints() {
        const c = cfg();
        const pts = [];
        for (let i = 0; i < c.MAX_POINTS; i++) {
            pts.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * c.DRIFT_SPEED,
                vy: (Math.random() - 0.5) * c.DRIFT_SPEED,
                radius: Math.random() * 2 + 1
            });
        }
        state.points = pts;
    }

    /** dtFactor: 1.0 = one 60fps-equivalent step. 0 = static redraw (no motion). */
    function drawFrame(dtFactor) {
        const c = cfg();
        const ctx = state.ctx;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const linkSq = c.LINK_DISTANCE * c.LINK_DISTANCE;
        const pts = state.points;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = c.POINT_COLOR;
        ctx.strokeStyle = c.LINK_COLOR;
        ctx.lineWidth = c.LINE_WIDTH;

        for (let i = 0; i < pts.length; i++) {
            const p1 = pts[i];
            p1.x += p1.vx * dtFactor;
            p1.y += p1.vy * dtFactor;
            if (p1.x < 0 || p1.x > w) p1.vx *= -1;
            if (p1.y < 0 || p1.y > h) p1.vy *= -1;

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < pts.length; j++) {
                const p2 = pts[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                if (dx * dx + dy * dy < linkSq) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop(ts) {
        if (!state.running) return;
        const interval = 1000 / cfg().TARGET_FPS;
        if (!state.lastTs) state.lastTs = ts;
        const elapsed = ts - state.lastTs;
        if (elapsed >= interval) {
            state.lastTs = ts;
            // Normalize to 60fps steps; clamp so background tabs don't teleport points.
            drawFrame(Math.min(elapsed / (1000 / 60), 4));
        }
        state.rafId = requestAnimationFrame(loop);
    }

    const api = {
        init() {
            state.canvas = document.getElementById('neuralCoreCanvas');
            if (!state.canvas) return;
            state.ctx = state.canvas.getContext('2d');
            state.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            size();
            buildPoints();

            window.addEventListener('resize', SYSOS.utils.debounce(function () {
                size();
                // Keep points inside the new bounds, then repaint.
                state.points.forEach(function (p) {
                    p.x = Math.min(p.x, window.innerWidth);
                    p.y = Math.min(p.y, window.innerHeight);
                });
                if (!state.running) drawFrame(0);
            }, 150));

            document.addEventListener('visibilitychange', function () {
                if (document.hidden) api.pause('visibility');
                else if (state.pausedBy === 'visibility') api.resume();
            });

            if (state.reduced) {
                drawFrame(0); // single static frame — motion suppressed by user preference
            } else {
                api.resume();
            }
        },

        pause(reason) {
            if (!state.running) return false;
            state.running = false;
            if (state.rafId !== null) cancelAnimationFrame(state.rafId);
            state.rafId = null;
            state.pausedBy = reason || 'api';
            return true;
        },

        resume() {
            if (state.running || state.reduced) return false;
            state.running = true;
            state.pausedBy = null;
            state.lastTs = 0;
            state.rafId = requestAnimationFrame(loop);
            return true;
        },

        /** Stable single frame for capture tooling, regardless of run state. */
        freezeFrame() {
            api.pause('freeze');
            drawFrame(0);
        },

        status() {
            return {
                running: state.running,
                reducedMotion: state.reduced,
                pausedBy: state.pausedBy,
                points: state.points.length,
                targetFps: cfg().TARGET_FPS
            };
        }
    };

    SYSOS.canvas = api;
})();
