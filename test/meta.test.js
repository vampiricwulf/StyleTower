"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { ROOT } = require("./harness");

function meta(name) { return fs.readFileSync(path.join(ROOT, "src", "meta", name), "utf8"); }

test("the Chrome manifest is manifest v3 and runs once the DOM exists", () => {
    // Grunt templates: quoted ones become "x", the bare JSON.stringify ones []
    const json = meta("manifest.json")
        .replace(/"<%=[\s\S]*?%>[^"]*"/g, '"x"')
        .replace(/<%= JSON\.stringify[\s\S]*?%>/g, "[]");
    const m = JSON.parse(json);
    assert.equal(m.manifest_version, 3);
    assert.ok(Array.isArray(m.host_permissions), "host permissions split out");
    assert.deepEqual(m.permissions, ["storage"]);
    assert.equal(m.content_scripts[0].run_at, "document_end");
    assert.ok(!m.content_scripts[0].all_frames);
});

["metadata.js", "metadata.min.js"].forEach(function (name) {
    test(name + " grants only what the script calls and stays out of frames", () => {
        const text = meta(name);
        assert.match(text, /^\/\/ @noframes/m);
        assert.doesNotMatch(text, /xmlhttprequest/i);
        assert.doesNotMatch(text, /@grant\s+GM\./, "promise-style GM.* API is never called");
        ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues", "GM_openInTab"].forEach(function (g) {
            assert.match(text, new RegExp("@grant\\s+" + g + "\\b"));
        });
    });
});

test("the build has no references to files that do not exist", () => {
    const grunt = fs.readFileSync(path.join(ROOT, "Gruntfile.coffee"), "utf8");
    assert.doesNotMatch(grunt, /botproc/);
});

test("no dead extension update plumbing: Chrome cannot auto-update an unpacked MV3 zip", () => {
    const manifest = meta("manifest.json");
    assert.doesNotMatch(manifest, /update_url/);
    assert.equal(fs.existsSync(path.join(ROOT, "src", "meta", "updates.xml")), false, "updates.xml template removed");
    const grunt = fs.readFileSync(path.join(ROOT, "Gruntfile.coffee"), "utf8");
    assert.doesNotMatch(grunt, /updates\.xml/);
});

test("the package is private: it is a userscript, not an npm library", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    assert.equal(pkg.private, true);
});
