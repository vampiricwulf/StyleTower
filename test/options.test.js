"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

test("Custom Font values with quotes survive the options panel", async () => {
    const w = await load({ storage: { "Custom Font": 'Foo"Bar' } });
    const { $SS } = w.__ST;
    $SS.options.show();
    const input = w.document.querySelector("#oneechan-options input[name='Custom Font']");
    assert.equal(input.value, 'Foo"Bar');
});

test("mascot names with markup characters render as text", async () => {
    const name = "<b>x</b>'&\"";
    const w = await load({
        storage: { "Mascots": JSON.stringify([{ url: "https://example.invalid/m.png", name: name, enabled: true }]) }
    });
    const { $SS } = w.__ST;
    $SS.options.show();
    const tile = w.document.querySelector("#mascot-section .mascot-tile");
    assert.ok(tile);
    assert.equal(tile.querySelector("b"), null);
    assert.equal(tile.querySelector(".mascot-tile-name").textContent, name);
    assert.equal(tile.querySelector(".mascot-tile-name").title, name);
});

test("custom-width suboptions render their values and follow their parent", async () => {
    const w = await load({ storage: { "Left Margin": 999, "Custom Left Margin": 42, "Decoration Width": 999, "Custom Decoration Width": 7 } });
    const { $SS } = w.__ST;
    $SS.options.show();
    const d = w.document;
    const left = d.querySelector("#oneechan-options input[name='Custom Left Margin']");
    const right = d.querySelector("#oneechan-options input[name='Custom Right Margin']");
    const deco = d.querySelector("#oneechan-options input[name='Custom Decoration Width']");
    assert.equal(left.value, "42px");
    assert.equal(left.closest(".option").hasAttribute("hidden"), false);
    assert.equal(right.value, "0px");
    assert.equal(right.closest(".option").hasAttribute("hidden"), true, "Right Margin is not Custom");
    assert.equal(deco.value, "7px");
    assert.equal(deco.closest(".option").hasAttribute("hidden"), false);
    assert.equal(d.querySelector("#oneechan-options input[name='Font Size']").value, "13px");
    assert.equal(d.querySelector("#oneechan-options input[name='UI Font Size']").value, "11px");
    assert.equal(d.querySelector("#oneechan-options input[name='Backlink Font Size']").value, "10px");
});

test("the themes tab radio carries a single class attribute", async () => {
    const w = await load();
    w.__ST.$SS.options.show();
    const radio = w.document.getElementById("themes-select");
    assert.equal(radio.className, "tab-select");
    assert.equal(radio.getAttribute("name"), "tab-select");
});

test("Use StyleTower Icons toggles its root class strictly", async () => {
    let w = await load();
    assert.ok(w.document.documentElement.classList.contains("use-sc-icons"));
    w = await load({ storage: { "Use StyleTower Icons": false } });
    assert.ok(!w.document.documentElement.classList.contains("use-sc-icons"));
});

test("a quick reply that appears later gets the name/subject limits", async () => {
    const w = await load();
    const d = w.document;
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    d.body.appendChild(qr);
    await sleep(80);
    assert.equal(qr.querySelector("input[name=name]").getAttribute("maxlength"), "100");
    assert.equal(qr.querySelector("input[name=subject]").getAttribute("maxlength"), "100");
    assert.equal(d.querySelector("form[name=post]:not(#quick-reply) input[name=name]").getAttribute("maxlength"), "100");
    assert.ok(qr.querySelector(".st-submit-row"), "submit moved to its own row");
});

test("saving an option that only applies on the next load says so", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    const box = d.querySelector("#oneechan-options input[name='Catalog Links']");
    box.checked = !box.checked;
    d.querySelector("#oneechan-options a[name=save]").click();
    await sleep(50);
    const notes = [...d.querySelectorAll(".styletower-notification-text")].map(n => n.textContent);
    assert.ok(notes.some(t => /reload/i.test(t) && /Catalog Links/.test(t)), "got: " + JSON.stringify(notes));
});

test("saving only live options does not mention a reload", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    const box = d.querySelector("#oneechan-options input[name='Rounded Corners']");
    box.checked = !box.checked;
    d.querySelector("#oneechan-options a[name=save]").click();
    await sleep(50);
    const notes = [...d.querySelectorAll(".styletower-notification-text")].map(n => n.textContent);
    assert.ok(!notes.some(t => /reload/i.test(t)), "got: " + JSON.stringify(notes));
});

test("the Export button warns that saved site credentials are included", async () => {
    const w = await load();
    w.__ST.$SS.options.show();
    const btn = w.document.querySelector("#oneechan-options a[name=Export]");
    assert.match(btn.title, /password/i);
});

test("Escape closes the options panel, and an open editor first", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    const esc = () => d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    $SS.options.show();
    $SS.options.showTheme(2);
    assert.ok(d.getElementById("add-theme"));
    esc();
    assert.equal(d.getElementById("add-theme"), null, "editor closed");
    assert.ok(d.getElementById("overlay"), "panel still open");
    esc();
    assert.equal(d.getElementById("overlay"), null, "panel closed");
});
