"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, until, sleep } = require("./harness");

test("$lib.val() parses negative integers like positive ones", async () => {
    const w = await load();
    const { $ } = w.__ST;
    const el = w.document.createElement("input");
    el.type = "text";
    el.value = "-2";
    assert.equal($(el).val(), -2);
    el.value = "15";
    assert.equal($(el).val(), 15);
    el.value = "13px";
    assert.equal($(el).val(), "13px");
});

test("$.waitFor stops watching after its timeout", async () => {
    const w = await load();
    const { $ } = w.__ST;
    let calls = 0;
    $.waitFor("#late-arrival", () => calls++, 30);
    await sleep(80);
    const el = w.document.createElement("div");
    el.id = "late-arrival";
    w.document.body.appendChild(el);
    await sleep(50);
    assert.equal(calls, 0, "callback must not fire once the wait has expired");
});

test("$.waitFor still fires for elements that arrive in time", async () => {
    const w = await load();
    const { $ } = w.__ST;
    let calls = 0;
    $.waitFor("#on-time", () => calls++, 500);
    const el = w.document.createElement("div");
    el.id = "on-time";
    w.document.body.appendChild(el);
    await sleep(30);
    assert.equal(calls, 1);
});

test("no document-wide observers are left behind when TS-only elements never appear", async () => {
    const observers = [];
    const w = await load({
        noinit: true,
        setup(w) {
            const MO = w.MutationObserver;
            w.MutationObserver = class extends MO {
                constructor(cb) { super(cb); observers.push(this); this.__active = false; }
                observe(target, opts) { this.__active = true; this.__target = target; return super.observe(target, opts); }
                disconnect() { this.__active = false; return super.disconnect(); }
            };
        }
    });
    // No "Thread Settings" seeded: Holotower TS is absent, so its header
    // toggle, updater and thread stats never show up
    w.__ST.$SS.waitTimeout = 40;
    w.__ST.$SS.init();
    await until(() => w.__ST.$SS._initDone, 2000);
    await sleep(200);
    const leaked = observers.filter(o => o.__active && o.__target === w.document.documentElement);
    assert.equal(leaked.length, 0, "waitFor observers on <html> still connected: " + leaked.length);
});

test("comment drafts are keyed by thread, not by the URL variant", async () => {
    const a = await load({ url: "https://holotower.org/hlgg/res/100.html" });
    const b = await load({ url: "https://holotower.org/hlgg/res/100+50.html" });
    assert.equal(a.__ST.$SS.getRememberCommentKey(), b.__ST.$SS.getRememberCommentKey());
    const c = await load({ url: "https://holotower.org/hlgg/res/101.html" });
    assert.notEqual(a.__ST.$SS.getRememberCommentKey(), c.__ST.$SS.getRememberCommentKey());
});

test("TS posting controls are not polled for when TS is absent", async () => {
    let pending = 0;
    const w = await load({
        setup(w) {
            const orig = w.setTimeout;
            w.setTimeout = function (fn, ms) { if (ms === 500) pending++; return orig.apply(w, arguments); };
        }
    });
    const d = w.document;
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    d.body.appendChild(qr);
    await sleep(80);
    assert.equal(pending, 0, "no 500ms retry timers without TS");
});
