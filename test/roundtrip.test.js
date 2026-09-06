"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./harness");

// Cross-realm objects (jsdom) fail strict deep-equal on prototypes: compare
// through JSON, which also pins the stored type of every value
const plain = v => JSON.parse(JSON.stringify(v === undefined ? null : v));

test("saving the options panel untouched preserves every setting and its type", async () => {
    const w = await load({
        storage: {
            "Margin Between Replies": -2, "Left Margin": 999, "Custom Left Margin": 42,
            "Font Family": "Consolas", "Custom Font": "My Font", "Highlight Style": "dashed",
            "Opacity": 55, "Font Size": 14, "QR Button Image": "https://example.invalid/q.png",
            "Sidebar Position": 1, "Decoration Style": 2, "System Theming": true, "Dark Theme": 3
        }
    });
    const { $SS } = w.__ST;
    const before = {};
    Object.keys($SS.conf).forEach(k => { before[k] = plain($SS.conf[k]); });
    $SS.options.show();
    $SS.options.save();
    const drift = [];
    Object.keys(before).forEach(k => {
        // Derived on save: kept equal to Selected Theme for export compatibility
        if (k === "NSFW Theme") return;
        const after = plain($SS.conf[k]);
        if (JSON.stringify(after) !== JSON.stringify(before[k]))
            drift.push(k + ": " + JSON.stringify(before[k]) + " → " + JSON.stringify(after));
    });
    assert.deepEqual(drift, []);
});

test("theme editor: create, edit and delete a custom theme", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    const idx = $SS.Themes.defaults.length;
    $SS.options.show();
    $SS.options.showTheme();
    d.querySelector("#add-theme input[name=name]").value = "Mine";
    const mc = d.querySelector("#add-theme input[name=mainColor]");
    mc.value = "abcdef";
    mc.dispatchEvent(new w.Event("input", { bubbles: true }));
    d.querySelector("#add-theme a[name=add]").click();
    let stored = $SS.Config.get("Themes");
    assert.equal(stored.length, 1);
    assert.equal(stored[0].name, "Mine");
    assert.equal(stored[0].mainColor, "abcdef");
    assert.equal($SS.Config.get("Selected Theme"), idx, "the new theme is selected");
    assert.equal($SS.theme.name, "Mine", "and applied");
    assert.equal(d.querySelector("#add-theme"), null, "editor closed");

    $SS.options.showTheme(idx);
    const nm = d.querySelector("#add-theme input[name=name]");
    nm.value = "Mine 2";
    nm.dispatchEvent(new w.Event("change", { bubbles: true }));
    d.querySelector("#add-theme a[name=edit]").click();
    stored = $SS.Config.get("Themes");
    assert.equal(stored.length, 1);
    assert.equal(stored[0].name, "Mine 2");
    assert.equal($SS.theme.name, "Mine 2");

    $SS.options.deleteTheme(idx);
    assert.equal($SS.Config.get("Themes").length, 0);
    assert.equal($SS.Config.get("Selected Theme"), 0);
    assert.equal($SS.theme.name, $SS.Themes.defaults[0].name);
});

test("mascot editor: an added mascot is stored on Save", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    $SS.options.showMascotEditor(-1);
    d.querySelector("#add-mascot input[name=mImg]").value = "https://example.invalid/m.png";
    d.querySelector("#add-mascot input[name=mName]").value = "Mumei";
    d.querySelector("#add-mascot a[name=mSave]").click();
    assert.equal(d.querySelectorAll("#mascot-section .mascot-tile").length, 1);
    $SS.options.save();
    const m = JSON.parse($SS.Config.get("Mascots"));
    assert.equal(m.length, 1);
    assert.equal(m[0].name, "Mumei");
    assert.equal(m[0].url, "https://example.invalid/m.png");
    assert.equal(m[0].enabled, true);
});

test("GM storage: settings round-trip and the thumbnail migration runs once", async () => {
    const w = await load({ gm: true, gmStore: { "StyleTower.Animated GIF Thumbnails": "true" } });
    const { $SS } = w.__ST;
    assert.equal($SS.hasGM, true);
    assert.equal($SS.conf["Replace Thumbnails"], true, "migrated");
    assert.equal($SS.conf["Replace JPG"], false, "GIF-only behavior preserved");
    $SS.Config.set("Rounded Corners", false);
    assert.equal($SS.Config.get("Rounded Corners"), false);
    assert.equal(w.__gmStore["StyleTower.Rounded Corners"], "false");

    const store = Object.assign({}, w.__gmStore, { "StyleTower.Replace JPG": "true" });
    const w2 = await load({ gm: true, gmStore: store });
    assert.equal(w2.__ST.$SS.conf["Replace JPG"], true, "a later change is not reset by the migration");
});

test("export carries every option and only the user's themes", async () => {
    const w = await load({ storage: { "Themes": [{ name: "Mine", mainColor: "000000", textColor: "ffffff" }] } });
    const ex = w.__ST.$SS.exportOptions;
    assert.equal(ex["Themes"].length, 1);
    assert.equal(ex["Themes"][0].name, "Mine");
    assert.equal(ex["Rounded Corners"], true);
    assert.equal(ex[":: Main Rice"], undefined, "headers are not exported");
    assert.equal(typeof ex["Mascots"], "string");
});
