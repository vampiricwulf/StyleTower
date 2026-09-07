"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

// jsdom has no layout: give the viewport a size and the QR a box
function viewport(w, width, height) {
    const de = w.document.documentElement;
    Object.defineProperty(de, "clientWidth", { value: width, configurable: true });
    Object.defineProperty(de, "clientHeight", { value: height, configurable: true });
}
function box(el, r) {
    el.getBoundingClientRect = () => ({
        top: r.top, left: r.left, width: r.width, height: r.height,
        right: r.left + r.width, bottom: r.top + r.height
    });
}
async function openQR(w, opts) {
    const d = w.document;
    viewport(w, 1000, 800);
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    // the site's QR gets a draggable title row
    const th = d.createElement("tr");
    th.innerHTML = '<th colspan="2"><span class="handle">Quick Reply<a class="close-btn" href="#">X</a></span></th>';
    qr.querySelector("table tbody, table").prepend(th);
    d.body.appendChild(qr);
    await sleep(80);
    const ta = qr.querySelector("textarea[name=body]");
    Object.defineProperty(ta, "offsetHeight", { value: (opts && opts.textarea) || 100, configurable: true });
    return qr;
}
function observerFor(w, qr) {
    return (w.__ro || []).find(ro => ro.targets.includes(qr));
}

test("QR past the bottom edge moves up so its bottom sits on the window's bottom", async () => {
    const w = await load();
    const qr = await openQR(w);
    const ro = observerFor(w, qr);
    assert.ok(ro, "the QR's size is observed");
    box(qr, { top: 600, left: 100, width: 300, height: 300 });
    ro.trigger();
    assert.equal(qr.style.top, "500px");
    assert.equal(qr.style.right, "600px");
    assert.equal(qr.style.left, "auto");
});

test("QR past the right edge moves left", async () => {
    const w = await load();
    const qr = await openQR(w);
    box(qr, { top: 50, left: 900, width: 300, height: 300 });
    observerFor(w, qr).trigger();
    assert.equal(qr.style.right, "0px");
    assert.equal(qr.style.top, "50px");
});

test("a QR inside the window is left alone", async () => {
    const w = await load();
    const qr = await openQR(w);
    box(qr, { top: 50, left: 100, width: 300, height: 300 });
    observerFor(w, qr).trigger();
    w.dispatchEvent(new w.Event("resize"));
    assert.equal(qr.style.top, "");
    assert.equal(qr.style.right, "");
});

test("a QR pushed up by growth returns to its original place when it shrinks", async () => {
    const w = await load();
    const qr = await openQR(w);
    const ro = observerFor(w, qr);
    box(qr, { top: 500, left: 100, width: 300, height: 200 });
    ro.trigger();
    assert.equal(qr.style.top, "");
    box(qr, { top: 500, left: 100, width: 300, height: 500 });
    ro.trigger();
    assert.equal(qr.style.top, "300px");
    box(qr, { top: 300, left: 100, width: 300, height: 200 });
    ro.trigger();
    assert.equal(qr.style.top, "500px");
    assert.equal(qr.style.right, "600px");
});

test("a QR pushed right by growth returns to its original place when it shrinks", async () => {
    const w = await load();
    const qr = await openQR(w);
    const ro = observerFor(w, qr);
    box(qr, { top: 50, left: 100, width: 300, height: 200 });
    ro.trigger();
    // the site anchors the QR by its right edge, so a wider form grows leftward
    box(qr, { top: 50, left: -200, width: 600, height: 200 });
    ro.trigger();
    assert.equal(qr.style.right, "400px");
    box(qr, { top: 50, left: 0, width: 300, height: 200 });
    ro.trigger();
    assert.equal(qr.style.right, "600px");
});

function drag(w, qr, from, to) {
    const handle = qr.querySelector("th .handle");
    handle.dispatchEvent(new w.MouseEvent("mousedown", { bubbles: true, clientX: from[0], clientY: from[1] }));
    if (to.box) box(qr, to.box);
    handle.dispatchEvent(new w.MouseEvent("mouseup", { bubbles: true, clientX: to[0], clientY: to[1] }));
}

test("dragging the QR makes the dropped spot its new original place", async () => {
    const w = await load();
    const qr = await openQR(w);
    const ro = observerFor(w, qr);
    box(qr, { top: 500, left: 100, width: 300, height: 200 });
    ro.trigger();
    const dropped = { top: 100, left: 200, width: 300, height: 200 };
    drag(w, qr, [150, 510], Object.assign([250, 110], { box: dropped }));
    await sleep(20);
    box(qr, { top: 100, left: 200, width: 300, height: 750 });
    ro.trigger();
    assert.equal(qr.style.top, "50px");
    box(qr, { top: 50, left: 200, width: 300, height: 200 });
    ro.trigger();
    assert.equal(qr.style.top, "100px");
    assert.equal(qr.style.right, "500px");
});

test("a click on the handle without a drag keeps the original place", async () => {
    const w = await load();
    const qr = await openQR(w);
    const ro = observerFor(w, qr);
    box(qr, { top: 500, left: 100, width: 300, height: 200 });
    ro.trigger();
    box(qr, { top: 500, left: 100, width: 300, height: 500 });
    ro.trigger();
    assert.equal(qr.style.top, "300px");
    drag(w, qr, [150, 310], [153, 312]);
    await sleep(20);
    box(qr, { top: 300, left: 100, width: 300, height: 200 });
    ro.trigger();
    assert.equal(qr.style.top, "500px");
});

test("QR past the top or left edge is pinned at the edge", async () => {
    const w = await load();
    const qr = await openQR(w);
    box(qr, { top: -40, left: -20, width: 300, height: 300 });
    observerFor(w, qr).trigger();
    assert.equal(qr.style.top, "0px");
    assert.equal(qr.style.right, "700px");
});

test("a window resize re-clamps the QR", async () => {
    const w = await load();
    const qr = await openQR(w);
    box(qr, { top: 600, left: 100, width: 300, height: 300 });
    w.dispatchEvent(new w.Event("resize"));
    assert.equal(qr.style.top, "500px");
});

test("a QR taller than the window caps its comment box so the whole form fits", async () => {
    const w = await load();
    const qr = await openQR(w, { textarea: 400 });
    box(qr, { top: 50, left: 100, width: 300, height: 900 });
    observerFor(w, qr).trigger();
    assert.equal(qr.style.top, "0px");
    assert.equal(qr.querySelector("textarea[name=body]").style.maxHeight, "300px");
});

test("the comment box cap tracks the room left under the rest of the form", async () => {
    const w = await load();
    const qr = await openQR(w, { textarea: 100 });
    box(qr, { top: 50, left: 100, width: 300, height: 300 });
    observerFor(w, qr).trigger();
    assert.equal(qr.querySelector("textarea[name=body]").style.maxHeight, "600px");
});

test("Vertical Tabbed QR is docked by CSS and not repositioned", async () => {
    const w = await load({ storage: { "Autohide Style": 2 } });
    const qr = await openQR(w);
    box(qr, { top: 600, left: 900, width: 300, height: 300 });
    const ro = observerFor(w, qr);
    if (ro) ro.trigger();
    w.dispatchEvent(new w.Event("resize"));
    assert.equal(qr.style.top, "");
    assert.equal(qr.style.right, "");
});

test("the size watch is dropped once the QR is closed", async () => {
    const w = await load();
    const qr = await openQR(w);
    const ro = observerFor(w, qr);
    qr.remove();
    ro.trigger();
    assert.equal(ro.disconnected, true);
});
