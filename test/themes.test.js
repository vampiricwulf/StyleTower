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
    assert.equal($SS.Config.get("Selected Theme"), 3);
    assert.equal($SS.theme.name, $SS.conf["Themes"][3].name);
    assert.ok(tile.classList.contains("selected"));
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
