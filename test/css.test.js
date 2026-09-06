"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { load, ROOT } = require("./harness");

const cssDir = path.join(ROOT, "src", "css");
const cssFiles = fs.readdirSync(cssDir).filter(f => /\.css$/.test(f));
function css(name) { return fs.readFileSync(path.join(cssDir, name), "utf8"); }
const allCSS = cssFiles.map(css).join("\n");
// Plain booleans: assert.match would print the whole stylesheet on failure
function has(text, re) { return re.test(text); }

test("Fit Expanded Images applies on its own root class", () => {
    assert.equal(has(css("General.css"), /:root\.fit-eximg[^{]*\.full-image\s*\{/), true, "fit-eximg rule on .full-image");
    assert.equal(has(allCSS, /fit-height/), false, "4chan-X's fit-height class is never set here");
});

test("Follow Cursor rules target the site's hover image and describe quote previews", async () => {
    assert.equal(has(allCSS, /#image-hover/), false, "#image-hover is 4chan-X's id");
    assert.equal(has(allCSS, /:root\.follow-cursor\s+#chx_hoverImage/), true, "site hover image rule");
    const w = await load();
    const desc = w.__ST.defaultConfig["Follow Cursor"][1];
    assert.match(desc, /quote|post/i);
    assert.doesNotMatch(desc, /^Image previews/);
});

test("Home page link rule targets the #page element the markup actually has", () => {
    const home = css("Home.css");
    assert.equal(has(home, /\.page\s+a/), false, ".page class rule");
    assert.equal(has(home, /#page\s+a\b/), true, "#page id rule");
});

test("stylesheets carry no rules for classes nothing sets on Holotower", () => {
    const dead = [
        "bottom-header", "bottom-backlinks", "reply-hide", "catalog-mode",
        ".hashlink", ".threadContainer", ".hasInline", ".stub", ".expanded-image",
        "q-spoiler-image", "yui-skin-sam", ".pln", ".kwd", ".atv", ".typ", ".atn", ".lit", ".pun",
        ".hide-reply-button", ".show-thread-button", "::-webkit-calendar-picker-indicator", ".sfw-label"
    ];
    const found = dead.filter(token => allCSS.indexOf(token) !== -1);
    assert.deepEqual(found, []);
});

test("every emitted --sc variable is consumed and every consumed one is emitted", async () => {
    const w = await load();
    const vars = w.document.getElementById("sc-theme-vars").textContent;
    const defined = new Set();
    vars.replace(/(--sc-[A-Za-z0-9-]+):/g, (m, v) => { defined.add(v); });
    const built = fs.readFileSync(path.join(ROOT, "tmp", "style.min.css"), "utf8") +
        fs.readFileSync(path.join(ROOT, "src", "script.js"), "utf8") + vars;
    const used = new Set();
    built.replace(/var\((--sc-[A-Za-z0-9-]+)/g, (m, v) => { used.add(v); });
    const unused = [...defined].filter(v => !used.has(v));
    const undef = [...used].filter(v => !defined.has(v));
    assert.deepEqual(unused, [], "emitted but never referenced");
    assert.deepEqual(undef, [], "referenced but never emitted");
});
