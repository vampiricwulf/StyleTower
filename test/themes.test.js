"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./harness");

test("theme tiles no longer offer the inert NSFW slot", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    const d = w.document;
    assert.ok(d.querySelector("#themes-section .theme-preview"), "themes rendered");
    assert.equal(d.querySelector("#themes-section a[title='Sets the NSFW theme.']"), null);
    assert.equal(d.querySelector("#themes-section a[title='Sets the SFW theme.']"), null);
    assert.equal(d.querySelector("#themes-section .sfw-label"), null);
    assert.ok(d.querySelector("#themes-section .theme-preview a[title=Edit]"));
    assert.ok(d.querySelector("#themes-section .theme-preview a[title=Delete]"));
});

test("clicking a theme tile selects and applies it", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    const tile = w.document.getElementById("theme3");
    tile.click();
    assert.equal($SS.theme.name, $SS.conf["Themes"][3].name, "applied at once");
    assert.ok(tile.classList.contains("selected"));
    assert.equal($SS.Config.get("Selected Theme"), 1, "stored only by Save");
    w.document.querySelector("#oneechan-options a[name=save]").click();
    assert.equal($SS.Config.get("Selected Theme"), 3);
});

test("the editor's live preview ignores a half-typed hex", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    $SS.options.showTheme(2);
    const d = w.document;
    const input = d.querySelector("#add-theme input[name=mainColor]");
    assert.ok(input, "editor open");
    const base = $SS.conf["Themes"][2].mainColor;
    input.value = "ff";
    input.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal($SS.theme.mainColor.hex, "#" + base, "partial input keeps the theme's color");
    input.value = "123456";
    input.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal($SS.theme.mainColor.hex, "#123456", "a complete hex previews");
    d.querySelector("#add-theme a[name=cancel]").click();
    const selected = $SS.conf["Themes"][$SS.conf["Selected Theme"]];
    assert.equal($SS.theme.mainColor.hex, "#" + selected.mainColor, "cancel restores the selection");
});

test("every shipped theme file carries the full palette", async () => {
    const fs = require("fs"), path = require("path");
    const { ROOT } = require("./harness");
    const w = await load();
    const required = w.__ST.$SS.Themes.defaults[0];
    const keys = Object.keys(required).filter(k => /Color$/.test(k));
    const dir = path.join(ROOT, "themes");
    const gaps = [];
    fs.readdirSync(dir).filter(f => /\.json$/.test(f)).forEach(f => {
        const t = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
        const missing = keys.filter(k => !(k in t));
        if (missing.length) gaps.push(f + ": " + missing.join(","));
    });
    assert.deepEqual(gaps, []);
});

test("a theme missing secondary colors derives them from its palette instead of black", async () => {
    const w = await load({
        storage: {
            "Themes": [{
                name: "Sparse", mainColor: "282828", bgColor: "1e1e1e", textColor: "a4a4a4",
                linkColor: "969696", linkHColor: "5d6a9e", nameColor: "6c7fcb", tripColor: "5d6a9e",
                titleColor: "6c7fcb", headerColor: "a4a4a4", headerBGColor: "191919", quoteColor: "b8b784",
                brderColor: "282828", inputColor: "191919", inputbColor: "1e1e1e"
            }],
            "Selected Theme": 27
        }
    });
    const t = w.__ST.$SS.theme;
    assert.equal(t.name, "Sparse");
    const derived = {
        qlColor: t.qlColor.hex, blinkColor: t.blinkColor.hex, unreadColor: t.unreadColor.hex,
        boardColor: t.boardColor.hex, headerLColor: t.headerLColor.hex, headerLHColor: t.headerLHColor.hex,
        postHLColor: t.postHLColor.hex, quotesYouHLColor: t.quotesYouHLColor.hex, ownPostHLColor: t.ownPostHLColor.hex,
        threadHLColor: t.threadHLColor.hex, replyslctColor: t.replyslctColor.hex, replybgHLColor: t.replybgHLColor.hex
    };
    const black = Object.keys(derived).filter(k => derived[k] === "#000000");
    assert.deepEqual(black, [], "fell back to black: " + JSON.stringify(derived));
    assert.equal(t.qlColor.hex, "#969696", "quotelinks follow the link color");
    assert.equal(t.boardColor.hex, "#a4a4a4", "board title follows the header text");
});

test("hiding the selected default theme moves the selection to a visible theme", async () => {
    const w = await load({ storage: { "Selected Theme": 3 } });
    const { $SS } = w.__ST;
    $SS.options.show();
    $SS.options.deleteTheme(3);
    assert.deepEqual(Array.from($SS.Config.get("Hidden Themes")), [3]);
    assert.notEqual($SS.Config.get("Selected Theme"), 3, "selection left the hidden theme");
    assert.notEqual($SS.theme.index, 3, "and the page no longer shows it");
    assert.ok(w.document.querySelector("#themes-section .theme-preview.selected:not([hidden])"), "a visible tile is selected");
});

test("theme tiles use no inline event handlers", async () => {
    const w = await load();
    w.__ST.$SS.options.show();
    assert.equal(w.document.querySelector("#themes-section [onmouseover], #themes-section [onmouseout], #themes-section [onclick]"), null);
});

test("a stored selection that points at a hidden theme falls back to a visible one at load", async () => {
    const w = await load({ storage: { "Selected Theme": 2, "Hidden Themes": [2] } });
    const { $SS } = w.__ST;
    assert.notEqual($SS.theme.index, 2);
    assert.equal($SS.theme.hidden, false);
});

test("a theme's custom CSS lives in its own style element so a syntax slip cannot eat the stylesheet", async () => {
    const w = await load({
        storage: { "Themes": [{ name: "Broken", mainColor: "202020", textColor: "eeeeee", bgColor: "101010", customCSS: ".custom-marker{color:red" }], "Selected Theme": 27 }
    });
    const d = w.document;
    const main = d.getElementById("ch4SS"), custom = d.getElementById("sc-custom-css");
    assert.ok(custom, "custom css element");
    assert.equal(main.nextElementSibling, custom, "placed right after the main stylesheet");
    assert.match(custom.textContent, /custom-marker/);
    assert.doesNotMatch(main.textContent, /custom-marker/);
    assert.match(main.textContent, /#oneechan-options/, "rules after the custom block survive");
    w.__ST.$SS.Config.set("Selected Theme", 2); // Vimyanized Dark ships no custom CSS
    w.__ST.$SS.init(true);
    assert.equal(d.getElementById("sc-custom-css").textContent, "", "cleared when a theme without custom CSS applies");
});

test("a background image URL with quotes or parentheses cannot break the theme variables", async () => {
    const w = await load({
        storage: { "Themes": [{ name: "Q", mainColor: "202020", textColor: "eeeeee", bgColor: "101010", bgImg: "https://example.invalid/a'b (c).png", bgRPA: "repeat top left scroll" }], "Selected Theme": 27 }
    });
    const vars = w.document.getElementById("sc-theme-vars").textContent;
    assert.match(vars, /--sc-bgImg:url\('https:\/\/example\.invalid\/a%27b%20%28c%29\.png'\) repeat top left scroll;/);
    assert.match(vars, /--sc-icon-options:/, "later variables still present");
});
