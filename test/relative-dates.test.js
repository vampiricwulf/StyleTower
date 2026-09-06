"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, NAMESPACE } = require("./harness");

test("Relative Post Dates is gone: the site's own Show relative time covers it", async () => {
    const w = await load();
    assert.equal(w.__ST.defaultConfig["Relative Post Dates"], undefined);
    assert.equal(w.document.querySelector("#reply_101 time").textContent, "07/26/26 (Sun) 09:38:21");
});

test("an enabled Relative Post Dates setting migrates to the site option", async () => {
    const w = await load({ storage: { "Relative Post Dates": true } });
    assert.equal(w.localStorage.getItem("show_relative_time"), "true");
    assert.equal(w.localStorage.getItem(NAMESPACE + "Relative Post Dates"), null, "old key cleared");
});

test("a disabled Relative Post Dates setting leaves the site option alone", async () => {
    const w = await load({ storage: { "Relative Post Dates": false } });
    assert.equal(w.localStorage.getItem("show_relative_time"), null);
});
