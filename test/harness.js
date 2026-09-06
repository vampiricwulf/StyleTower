/* jsdom harness: loads the processed script (tmp/StyleTower.test.js, made
   by `grunt testbuild`) into a vichan-shaped page and exposes the closure
   internals on window.__ST. Browser APIs jsdom lacks are shimmed minimally. */
"use strict";
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const SCRIPT_PATH = path.join(ROOT, "tmp", "StyleTower.test.js");
const NAMESPACE = "StyleTower.";

let exposedScript = null;
function script() {
    if (exposedScript) return exposedScript;
    const src = fs.readFileSync(SCRIPT_PATH, "utf8");
    const tail = /\n(\s*)\$SS\.init\(\);\s*\n\}\)\(\);\s*$/;
    if (!tail.test(src)) throw new Error("harness: script tail not found in " + SCRIPT_PATH);
    exposedScript = src.replace(tail, "\n$1window.__ST = { $SS: $SS, $: $, defaultConfig: defaultConfig };\n$1if (!window.__ST_NOINIT) $SS.init();\n})();\n");
    return exposedScript;
}

function fixture(name) {
    return fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

function shim(w, opts) {
    w.matchMedia = w.matchMedia || function (q) {
        return {
            matches: !!opts.dark, media: q,
            addEventListener() {}, removeEventListener() {},
            addListener() {}, removeListener() {}
        };
    };
    w.IntersectionObserver = class {
        constructor(cb) { this.cb = cb; w.__io = this; }
        observe() {} unobserve() {} disconnect() {}
    };
    w.scrollTo = function () { (w.__scrollCalls = w.__scrollCalls || []).push([].slice.call(arguments)); };
    w.DataTransfer = class {
        constructor() { const f = []; this._files = f; this.items = { add(file) { f.push(file); } }; }
        get files() { return this._files; }
    };
    w.Element.prototype.scrollIntoView = function () {};
    w.HTMLMediaElement.prototype.play = function () { this.__played = (this.__played || 0) + 1; return Promise.resolve(); };
    w.HTMLMediaElement.prototype.pause = function () { this.__paused = (this.__paused || 0) + 1; };
    w.alert = function (m) { (w.__alerts = w.__alerts || []).push(String(m)); };
    w.confirm = function () { return true; };
}

/* opts: { html, fixture, url, storage: {key: value}, site: {key: rawString},
   gm: bool (seed GM_* shims), dark, noinit, setup(window) } */
async function load(opts) {
    opts = opts || {};
    const html = opts.html || fixture(opts.fixture || "thread.html");
    const errors = [];
    const vc = new VirtualConsole();
    vc.on("jsdomError", function (e) {
        // jsdom's CSS parser rejects some modern selectors; that is noise here
        if (/Could not parse CSS/.test(e.message)) return;
        errors.push(e);
    });
    vc.on("error", function (m) { errors.push(new Error(String(m))); });
    const dom = new JSDOM(html, {
        url: opts.url || "https://holotower.org/hlgg/res/100.html",
        runScripts: "outside-only",
        pretendToBeVisual: true,
        virtualConsole: vc
    });
    const w = dom.window;
    w.__errors = errors;
    shim(w, opts);
    if (opts.gm) {
        const store = w.__gmStore = Object.assign({}, opts.gmStore || {});
        w.GM_getValue = function (k, d) { return k in store ? store[k] : d; };
        w.GM_setValue = function (k, v) { store[k] = v; };
        w.GM_deleteValue = function (k) { delete store[k]; };
        w.GM_listValues = function () { return Object.keys(store); };
    }
    const storage = opts.storage || {};
    Object.keys(storage).forEach(function (k) {
        const v = storage[k];
        const raw = typeof v === "number" ? String(v) : JSON.stringify(v);
        if (opts.gm) w.__gmStore[NAMESPACE + k] = typeof v === "number" ? v : raw;
        else w.localStorage.setItem(NAMESPACE + k, raw);
    });
    const site = opts.site || {};
    Object.keys(site).forEach(function (k) { w.localStorage.setItem(k, site[k]); });
    if (opts.noinit) w.__ST_NOINIT = true;
    if (opts.setup) opts.setup(w);
    w.eval(script());
    openWindows.push(w);
    if (!opts.noinit) await until(() => w.__ST && w.__ST.$SS._initDone, 2000);
    return w;
}

// Pages start long timers (the index control row's "N min ago" label), which
// keep a jsdom window's loop alive and a test process from exiting: close
// every window this file opened once its tests are done
const openWindows = [];
try {
    require("node:test").after(() => {
        openWindows.forEach(w => { try { w.close(); } catch (e) {} });
    });
} catch (e) { /* not running under node:test */ }

function until(test, ms) {
    return new Promise(function (resolve, reject) {
        const start = Date.now();
        (function poll() {
            if (test()) return resolve();
            if (Date.now() - start > ms) return reject(new Error("harness: timed out waiting"));
            setTimeout(poll, 5);
        })();
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = { load, until, sleep, fixture, NAMESPACE, ROOT };
