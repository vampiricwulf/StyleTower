"use strict";
/* Live settings changes re-run the whole init; the parts of the page that
   did not change must not be rebuilt, or every toggle costs a stylesheet
   re-parse, a page-wide restyle and a fresh mascot. */
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function watch(w, el) {
    const records = [];
    new w.MutationObserver(m => records.push(...m)).observe(el, { childList: true, characterData: true, subtree: true });
    return records;
}

test("a live change that alters no CSS leaves the stylesheet and theme variables untouched", async () => {
    const w = await load();
    const { $SS } = w.__ST, d = w.document;
    const sheet = watch(w, d.getElementById("ch4SS"));
    const vars = watch(w, d.getElementById("sc-theme-vars"));
    const custom = watch(w, d.getElementById("sc-custom-css"));
    // A root-class option: the page restyles once for the class, not again
    // for an identical stylesheet and identical variables
    $SS.init(true, { "Recolor Even Replies": true });
    await sleep(20);
    assert.ok(d.documentElement.classList.contains("recolor-even"), "the option applied");
    assert.equal(sheet.length, 0, "main stylesheet rewritten");
    assert.equal(vars.length, 0, "theme variables rewritten");
    assert.equal(custom.length, 0, "custom CSS rewritten");
    // An option that is part of the stylesheet text does rewrite it
    $SS.init(true, { "Left Margin": 40 });
    await sleep(20);
    assert.ok(sheet.length > 0, "a real CSS change is written");
    assert.equal(vars.length, 0, "variables still unchanged");
});

test("mascots: the mascot picked at load stays through live changes, and follows edits to itself", async () => {
    const list = [
        { url: "https://example.invalid/a.png", name: "a", enabled: true },
        { url: "https://example.invalid/b.png", name: "b", enabled: true },
        { url: "https://example.invalid/c.png", name: "c", enabled: true }
    ];
    const w = await load({ storage: { "Enable Mascots": true, "Mascots": JSON.stringify(list) } });
    const { $SS } = w.__ST, d = w.document;
    const box = d.getElementById("styletower-mascots");
    const first = box.querySelector("img").src;
    for (let i = 0; i < 6; i++) {
        $SS.init(true, { "Recolor Even Replies": i % 2 === 0 });
        assert.equal(d.getElementById("styletower-mascots"), box, "not rebuilt by live apply " + i);
        assert.equal(box.querySelector("img").src, first);
    }
    // Editing the shown mascot keeps it shown, rebuilt with the new values
    const edited = list.map(m => m.url === first ? Object.assign({}, m, { opacity: 40 }) : m);
    $SS.init(true, { "Mascots": JSON.stringify(edited) });
    const img = d.querySelector("#styletower-mascots img");
    assert.notEqual(img.closest("#styletower-mascots"), box, "rebuilt for a real change");
    assert.equal(img.src, first);
    assert.equal(img.style.opacity, "0.4");
    // Deselecting it picks another
    const without = list.map(m => m.url === first ? Object.assign({}, m, { enabled: false }) : m);
    $SS.init(true, { "Mascots": JSON.stringify(without) });
    assert.notEqual(d.querySelector("#styletower-mascots img").src, first, "a deselected mascot is replaced");
});
