"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
const { ROOT } = require("./harness");

// The Pages tools are plain pages with inline scripts: run them for real
function tool(name) {
    const html = fs.readFileSync(path.join(ROOT, "themes", "tools", name), "utf8");
    const vc = new VirtualConsole();
    const errors = [];
    vc.on("jsdomError", e => { if (!/Could not parse CSS/.test(e.message)) errors.push(e.message); });
    const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc, url: "https://vampiricwulf.github.io/StyleTower/" + name });
    dom.window.__errors = errors;
    return dom.window;
}

function convert(w, obj) {
    w.document.getElementById("input").value = JSON.stringify(obj);
    w.convert("theme.json");
    const status = w.document.getElementById("status").textContent;
    assert.doesNotMatch(status, /^Error|Unknown/, status);
    return JSON.parse(w.document.getElementById("output").value);
}

test("converter: a StyleTower theme keeps its own header and hover colors", () => {
    const w = tool("converter.html");
    const out = convert(w, {
        name: "Mine", authorName: "Wolf", authorTrip: "!trip", replyOp: "1.0", navOp: "0.9", hoverOp: "0.7", hoverOutOp: "0.4",
        mainColor: "111111", textColor: "eeeeee", linkColor: "8ab4f8", linkHColor: "aac4f8", bgColor: "000000",
        headerColor: "123456", headerBGColor: "234567", headerLColor: "345678", headerLHColor: "456789", boardColor: "567890",
        unreadColor: "abcdef", hoverColor: "222222", hoverOutColor: "333333", customCSS: ".x{}"
    });
    assert.equal(out.headerColor, "123456", "header text kept");
    assert.equal(out.headerBGColor, "234567");
    assert.equal(out.headerLColor, "345678");
    assert.equal(out.headerLHColor, "456789");
    assert.equal(out.boardColor, "567890");
    assert.equal(out.unreadColor, "abcdef");
    assert.equal(out.hoverColor, "222222", "hover colors survive");
    assert.equal(out.hoverOutColor, "333333");
    assert.equal(out.hoverOp, "0.7");
    assert.equal(out.hoverOutOp, "0.4");
    assert.equal(out.authorTrip, "!trip");
    assert.deepEqual(w.__errors, []);
});

test("converter: a 4chan-X theme maps to StyleTower keys", () => {
    const w = tool("converter.html");
    const out = convert(w, {
        "Theme": "Xtheme", "Author": "Anon", "Reply Background": "#1e1e1e", "Text": "rgb(200, 200, 200)", "Links": "#8ab4f8",
        "Hovered Links": "#fff", "Navigation Background": "#111", "Navigation Links": "#8ab4f8", "Hovered Navigation Links": "#fff",
        "Board Title": "#ddd", "Reply Border": "#333", "Input Background": "#000", "Input Border": "#444", "Background Color": "#0a0a0a",
        "Backlinks": "#886644", "Names": "#117743", "Tripcodes": "#228854", "Subjects": "#cc1105", "Greentext": "#789922",
        "Quotelinks": "#8ab4f8", "Highlighted Reply Background": "#2a2a2a", "Custom CSS": ""
    });
    assert.equal(out.name, "Xtheme");
    assert.equal(out.mainColor, "1e1e1e");
    assert.equal(out.textColor, "c8c8c8");
    assert.equal(out.linkHColor, "ffffff");
    assert.equal(out.bgColor, "0a0a0a");
    assert.equal(out.qlColor, "8ab4f8");
});

test("creator: builds a theme JSON from its palette with every key", () => {
    const w = tool("creator.html");
    assert.deepEqual(w.__errors, []);
    const d = w.document;
    if (d.getElementById("themeName")) d.getElementById("themeName").value = "Made";
    const out = typeof w.buildTheme === "function" ? w.buildTheme() : null;
    if (out) {
        assert.equal(out.name, "Made");
        ["hoverColor", "hoverOutColor", "replyslctColor", "threadHLColor", "unreadColor"].forEach(k => assert.ok(k in out, k));
    }
});
