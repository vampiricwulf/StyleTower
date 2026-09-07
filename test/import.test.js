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

// Images the Scale conversion loads: the stub reports a natural width per URL
function imageStub(widths) {
    return function (w) {
        w.Image = class {
            constructor() { this.naturalWidth = 0; }
            get src() { return this._src; }
            set src(v) {
                this._src = v;
                this.naturalWidth = widths[v] || 0;
                setTimeout(() => { if (this.naturalWidth) { if (this.onload) this.onload(); } else if (this.onerror) this.onerror(); });
            }
        };
    };
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WIDTHS = { "https://example.invalid/p8b6vh.png": 2434, "https://example.invalid/ypsxyn.png": 2502 };
// The shape of a v1.0.18 export: mascots still carry a Scale percentage
const V18 = {
    "Rounded Corners": false, "Enable Mascots": true, "Mascot Max Width": true, "Mascots Overlap Posts": false,
    "Mascots": JSON.stringify([
        { name: "Awoomei", url: "https://example.invalid/p8b6vh.png", enabled: true, opacity: 100, scale: 23, hoffset: -30 },
        { name: "Awoomei (Wolf Quest)", url: "https://example.invalid/ypsxyn.png", enabled: true, opacity: 100, scale: 17, hoffset: -100 },
        { name: "Mumei (Wolf)", url: "https://example.invalid/p8b6vh.png", enabled: true, opacity: 100, width: "500px", clip: [0, 0, 0, 125] },
        { name: "Mumei (Pixel)", url: "https://example.invalid/9p9pa7.png", enabled: true, opacity: 100, width: "350px", hoffset: -25, flip: true },
        { name: "Mumei (Peeker)", url: "https://example.invalid/2pxxwz.png", enabled: false, opacity: 80, hoffset: -30, flip: true, clip: [0, 0, 0, 30] },
        { name: "Free", url: "https://example.invalid/free.png", enabled: true, opacity: 100, maxwidth: false, side: "left", boards: "hlgg,vt", offset: 12, filters: { gray: 50, blur: 2 } }
    ])
};

test("an export taken after the Scale conversion carries the converted mascots", async () => {
    const w = await load({ storage: { "Enable Mascots": true, "Mascots": JSON.stringify([{ url: "https://example.invalid/p8b6vh.png", enabled: true, scale: 23 }]) }, setup: imageStub(WIDTHS) });
    await sleep(40);
    const ex = JSON.parse(w.__ST.$SS.exportOptions["Mascots"]);
    assert.equal(ex[0].width, "560px");
    assert.equal(ex[0].scale, undefined, "the export snapshot follows the conversion");
});

test("importing a v1.0.18 export converts Scale on the re-init and round-trips through export", async () => {
    const w = await load({ setup: imageStub(WIDTHS) });
    const { $SS } = w.__ST;
    $SS.options.importSettings(JSON.parse(JSON.stringify(V18)));
    $SS.init(true);
    await sleep(40);
    const got = JSON.parse($SS.Config.get("Mascots"));
    assert.equal(got.length, 6);
    assert.equal(got[0].width, "560px", "23% of the 2434px image");
    assert.equal(got[0].hoffset, -30);
    assert.equal(got[1].width, "425px", "17% of the 2502px image");
    assert.equal(got[1].hoffset, -100);
    assert.equal(got[2].width, "500px");
    assert.deepEqual(Array.from(got[2].clip), [0, 0, 0, 125]);
    assert.equal(got[3].width, "350px");
    assert.equal(got[3].hoffset, -25);
    assert.equal(got[3].flip, true);
    assert.equal(got[4].enabled, false);
    assert.equal(got[4].opacity, 80);
    assert.deepEqual(Array.from(got[4].clip), [0, 0, 0, 30]);
    assert.equal(got[5].maxwidth, false);
    assert.equal(got[5].side, "left");
    assert.equal(got[5].boards, "hlgg,vt");
    assert.equal(got[5].offset, 12);
    assert.deepEqual(JSON.parse(JSON.stringify(got[5].filters)), { gray: 50, blur: 2 });
    assert.equal(got.some(m => "scale" in m || "scaleBase" in m), false, "no Scale survives the import");
    assert.equal($SS.Config.get("Rounded Corners"), false, "plain options import alongside");
    assert.equal($SS.exportOptions["Mascots"], $SS.Config.get("Mascots"), "export sees the converted list");
    // Round trip: the export re-imports to exactly the same mascots
    const exported = JSON.parse(JSON.stringify($SS.exportOptions));
    const w2 = await load({ setup: imageStub(WIDTHS) });
    w2.__ST.$SS.options.importSettings(exported);
    w2.__ST.$SS.init(true);
    await sleep(40);
    assert.equal(w2.__ST.$SS.Config.get("Mascots"), $SS.Config.get("Mascots"));
});
