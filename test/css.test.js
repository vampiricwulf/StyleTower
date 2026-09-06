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
        ".hide-reply-button", ".show-thread-button", "::-webkit-calendar-picker-indicator", ".sfw-label",
        ".inline ", ".inline{", ".inline>", "#unread-line", "#scroll-marker", ".shortcut", ".right-panel", ".sub-panel",
        ".mu-", ".options-button-small"
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

test("an auto-hidden header leaves no top padding: the zeroing rule outranks the fixed-header ones", () => {
    const original = css("Original.css"), general = css("General.css");
    assert.equal(has(original, /\.fixed\.top-header\.autohide body/), false, "the 2em auto-hide rule is gone");
    assert.equal(has(general, /:root\.autohide\.fixed\.top-header body[^{]*\{[^}]*padding-top:\s*0 !important/), true, "zeroing rule at fixed-header specificity");
});

test("no selector group is declared twice in the same file and media context", () => {
    const dupes = [];
    cssFiles.forEach(f => {
        const text = css(f).replace(/\/\*[\s\S]*?\*\//g, "");
        const seen = new Map();
        let media = "";
        // walk rule by rule, tracking the enclosing @media block
        const re = /(@media[^{]*\{)|([^{}]+)\{([^{}]*)\}|(\})/g;
        let m;
        while ((m = re.exec(text))) {
            if (m[1]) { media = m[1].replace(/\s+/g, " ").trim(); continue; }
            if (m[4]) { media = ""; continue; }
            const sel = m[2].replace(/\s+/g, " ").trim();
            if (!sel) continue;
            const key = media + " | " + sel;
            if (seen.has(key)) dupes.push(f + ": " + sel.slice(0, 80));
            seen.set(key, true);
        }
    });
    assert.deepEqual(dupes, []);
});
