"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./harness");

test("importing a StyleTower export keeps its custom themes, sanitized", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const defaults = $SS.Themes.defaults.length;
    $SS.options.importSettings({
        "Rounded Corners": false,
        "Themes": [
            { name: "Custom", mainColor: "#123", textColor: "ffffff", bgColor: "000000", "default": true, _isPreview: true, junk: 1 },
            "not a theme"
        ],
        "Selected Theme": defaults,
        "Hidden Themes": [2, 5]
    });
    const themes = $SS.Config.get("Themes");
    assert.equal(themes.length, 1);
    assert.equal(themes[0].name, "Custom");
    assert.equal(themes[0].mainColor, "112233");
    assert.equal(themes[0]["default"], undefined, "foreign default flag dropped");
    assert.equal(themes[0]._isPreview, undefined, "editor bookkeeping dropped");
    assert.equal(themes[0].junk, undefined);
    assert.equal($SS.Config.get("Selected Theme"), defaults, "index into the imported list is valid");
    assert.deepEqual(Array.from($SS.Config.get("Hidden Themes")), [2, 5]);
    assert.equal($SS.Config.get("Rounded Corners"), false);
});

test("a selected-theme index past the imported list is not stored", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const defaults = $SS.Themes.defaults.length;
    $SS.options.importSettings({
        "Themes": [{ name: "Only", mainColor: "000000", textColor: "ffffff" }],
        "Selected Theme": defaults + 1
    });
    assert.equal($SS.Config.get("Selected Theme"), 1, "default selection kept");
});

test("imported saved site settings land where Restore reads them", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.importSettings({
        "SavedSite.name": "Wolf",
        "SavedSite.own_posts": { hlgg: ["1", "2"] }
    });
    assert.equal($SS.Config.get("SavedSiteSettings.name"), "Wolf");
    assert.equal($SS.Config.get("SavedSiteSettings.own_posts"), '{"hlgg":["1","2"]}');
    assert.equal($SS.Config.get("SavedSite.name"), undefined, "no dead copy under the export prefix");
});

test("OneeChan hidden-theme indices are not imported (their list differs)", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.importSettings({ "Version Fix": true, "Hidden Themes": [0, 1] });
    assert.deepEqual(Array.from($SS.Config.get("Hidden Themes")), []);
});

test("non-primitive values for plain options are not imported", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.importSettings({ "Rounded Corners": { x: 1 }, "Font Size": [14], "Custom Font": null, "Bitmap Font": true });
    ["Rounded Corners", "Font Size", "Custom Font"].forEach(k =>
        assert.equal(w.localStorage.getItem("StyleTower." + k), null, k + " must not be stored"));
    assert.equal($SS.Config.get("Bitmap Font"), true, "a valid value in the same import still lands");
});

test("importing a StyleTower export keeps each mascot's Scale rule marker", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.importSettings({
        "Mascots": JSON.stringify([
            { url: "https://example.invalid/a.png", enabled: true, scale: 187, scaleBase: "display" },
            { url: "https://example.invalid/b.png", enabled: true, scale: 23 }
        ])
    });
    const saved = JSON.parse($SS.Config.get("Mascots"));
    assert.equal(saved[0].scale, 187);
    assert.equal(saved[0].scaleBase, "display", "a converted value is not converted again later");
    assert.equal(saved[1].scale, 23);
    assert.equal(saved[1].scaleBase, undefined, "an old-rule value stays marked for conversion");
});
