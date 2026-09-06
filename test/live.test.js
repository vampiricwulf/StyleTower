"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function toggle(w, name) {
    const box = w.document.querySelector("#oneechan-options input[name='" + name + "']");
    box.checked = !box.checked;
    box.dispatchEvent(new w.Event("change", { bubbles: true }));
    return box;
}

test("a changed checkbox applies at once but is not stored until Save", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const root = w.document.documentElement.classList;
    $SS.options.show();
    assert.ok(root.contains("rounded-corners"));
    toggle(w, "Rounded Corners");
    assert.ok(!root.contains("rounded-corners"), "applied live");
    assert.equal(w.localStorage.getItem("StyleTower.Rounded Corners"), null, "nothing stored yet");
    w.document.querySelector("#oneechan-options a[name=save]").click();
    assert.equal($SS.Config.get("Rounded Corners"), false, "stored on Save");
    assert.ok(!root.contains("rounded-corners"));
});

test("a changed select and a typed size apply live", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    const root = d.documentElement.classList;
    $SS.options.show();
    const sel = d.querySelector("#oneechan-options select[name='Decoration Style']");
    sel.value = "2";
    sel.dispatchEvent(new w.Event("change", { bubbles: true }));
    assert.ok(root.contains("hl-outline"), "select applied live");
    const size = d.querySelector("#oneechan-options input[name='Font Size']");
    size.value = "15px";
    size.dispatchEvent(new w.Event("input", { bubbles: true }));
    await sleep(350);
    assert.match(d.getElementById("ch4SS").textContent, /body\{[^}]*font-size:15px/, "typed size applied live");
    assert.equal(w.localStorage.getItem("StyleTower.Font Size"), null);
});

test("Cancel with unsaved changes asks, keeps them when declined, reverts when confirmed", async () => {
    let answer = false, asked = 0;
    const w = await load({ setup(w) { w.confirm = () => { asked++; return answer; }; } });
    const { $SS } = w.__ST;
    const d = w.document;
    const root = d.documentElement.classList;
    $SS.options.show();
    toggle(w, "Rounded Corners");
    d.querySelector("#oneechan-options a[name=cancel]").click();
    assert.equal(asked, 1, "warned about unsaved changes");
    assert.ok(d.getElementById("overlay"), "declined: panel stays open");
    assert.ok(!root.contains("rounded-corners"), "declined: change still applied");
    answer = true;
    d.querySelector("#oneechan-options a[name=cancel]").click();
    assert.equal(asked, 2);
    assert.equal(d.getElementById("overlay"), null, "confirmed: panel closed");
    assert.ok(root.contains("rounded-corners"), "confirmed: change reverted");
    assert.equal(w.localStorage.getItem("StyleTower.Rounded Corners"), null);
});

test("Escape and the backdrop go through the same warning", async () => {
    let asked = 0;
    const w = await load({ setup(w) { w.confirm = () => { asked++; return false; }; } });
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    toggle(w, "Rounded Corners");
    d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert.equal(asked, 1);
    assert.ok(d.getElementById("overlay"));
    d.getElementById("overlay").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    assert.equal(asked, 2);
    assert.ok(d.getElementById("overlay"));
});

test("switching tabs or saving does not count as an unsaved change", async () => {
    let asked = 0;
    const w = await load({ setup(w) { w.confirm = () => { asked++; return false; }; } });
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    d.querySelector("label.tab-label[for=misc-select]").click();
    d.getElementById("misc-select").checked = true;
    d.getElementById("misc-select").dispatchEvent(new w.Event("change", { bubbles: true }));
    d.querySelector("#oneechan-options a[name=cancel]").click();
    assert.equal(asked, 0, "no warning after a tab switch");
    assert.equal(d.getElementById("overlay"), null);
    $SS.options.show();
    toggle(w, "Rounded Corners");
    d.querySelector("#oneechan-options a[name=save]").click();
    assert.equal(d.getElementById("overlay"), null, "Save closes without asking");
    assert.equal(asked, 0);
});

test("a theme tile applies live and is stored on Save; Cancel reverts it", async () => {
    const w = await load({ setup(w) { w.confirm = () => true; } });
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    d.getElementById("theme3").click();
    assert.equal($SS.theme.index, 3, "applied live");
    assert.equal($SS.Config.get("Selected Theme"), 1, "not stored yet");
    d.querySelector("#oneechan-options a[name=cancel]").click();
    assert.equal($SS.theme.index, 1, "reverted");
    $SS.options.show();
    d.getElementById("theme3").click();
    d.querySelector("#oneechan-options a[name=save]").click();
    assert.equal($SS.Config.get("Selected Theme"), 3, "stored on Save");
    assert.equal($SS.theme.index, 3);
});

test("mascot gallery edits show live and revert on Cancel", async () => {
    const w = await load({
        storage: { "Enable Mascots": true, "Mascots": JSON.stringify([{ url: "https://example.invalid/m.png", enabled: true }]) },
        setup(w) { w.confirm = () => true; }
    });
    const { $SS } = w.__ST;
    const d = w.document;
    assert.ok(d.getElementById("styletower-mascots"));
    $SS.options.show();
    d.querySelector("#mascot-section .mascot-select-none").click();
    assert.equal(d.getElementById("styletower-mascots"), null, "deselected mascot gone live");
    d.querySelector("#oneechan-options a[name=cancel]").click();
    assert.ok(d.getElementById("styletower-mascots"), "back after Cancel");
    assert.equal(JSON.parse($SS.Config.get("Mascots"))[0].enabled, true);
});

test("the reload notice still reflects what changed since the stored state", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    toggle(w, "Catalog Links");
    d.querySelector("#oneechan-options a[name=save]").click();
    await sleep(50);
    const notes = [...d.querySelectorAll(".styletower-notification-text")].map(n => n.textContent);
    assert.ok(notes.some(t => /reload/i.test(t) && /Catalog Links/.test(t)), "got: " + JSON.stringify(notes));
});

test("an editor's own Save keeps the panel's other unsaved changes applied", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    const root = d.documentElement.classList;
    $SS.options.show();
    toggle(w, "Rounded Corners");
    d.querySelector("#main-section a[name=navPosition]").click();
    d.querySelector("#st-nav-editor a[name=nSave]").click();
    assert.ok(!root.contains("rounded-corners"), "unsaved change survives the editor's save");
    assert.ok(d.querySelector("#oneechan-options input[name='Rounded Corners']").checked === false);
    assert.ok(!!JSON.parse($SS.Config.get("Nav Buttons")), "the editor itself persisted");
});

test("provenance pills cover the new and reworked options", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    const d = w.document;
    const status = name => {
        const input = d.querySelector("#oneechan-options [name='" + name + "']");
        return input.closest(".option").getAttribute("data-tower-status");
    };
    assert.equal(status("navPosition"), "added");
    assert.equal(status("Fit Expanded Images"), "changed");
    assert.equal(status("Follow Cursor"), "changed");
    assert.equal(status("Replace Thumbnails"), "added");
});
