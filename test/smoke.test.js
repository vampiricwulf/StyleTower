"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./harness");

test("harness: the script initializes on a thread page and exposes $SS", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    assert.equal($SS._initDone, true);
    assert.equal($SS.location.board, "hlgg");
    assert.equal($SS.location.reply, true);
    assert.ok(w.document.getElementById("ch4SS"), "stylesheet inserted");
    assert.ok(w.document.getElementById("sc-theme-vars"), "theme variables inserted");
    assert.ok(w.document.documentElement.classList.contains("oneechan"));
    assert.ok(w.document.getElementById("StyleTowerLink"), "header link added");
    assert.deepEqual(w.__errors.map(e => e.message), []);
});
