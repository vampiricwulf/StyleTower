"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep, NAMESPACE } = require("./harness");

test("Auto-Convert Images is gone: Holotower TS converts oversized uploads itself", async () => {
    const w = await load();
    assert.equal(w.__ST.defaultConfig["Auto-Convert Images"], undefined);
    w.__ST.$SS.options.show();
    assert.ok(w.document.querySelector("#oneechan-options input[name='Sauce Links']"), "panel open");
    assert.equal(w.document.querySelector("#oneechan-options input[name='Auto-Convert Images']"), null);
});

test("a stored Auto-Convert Images setting is cleared and hooks nothing", async () => {
    const w = await load({ storage: { "Auto-Convert Images": true } });
    assert.equal(w.localStorage.getItem(NAMESPACE + "Auto-Convert Images"), null, "old key cleared");
    assert.equal(w.__ST.$SS.conf["Auto-Convert Images"], undefined);
    // A picked file reaches the site's own listeners untouched
    const input = w.document.querySelector("form[name=post] input[type=file]");
    const file = new w.File([new Uint8Array(10)], "pic.webp", { type: "image/webp" });
    Object.defineProperty(input, "files", { value: [file], writable: true, configurable: true });
    let seen = null;
    input.addEventListener("change", () => { seen = input.files[0]; });
    input.dispatchEvent(new w.Event("change", { bubbles: true }));
    await sleep(30);
    assert.equal(seen, file, "the WebP is not swallowed or swapped for a JPEG");
});

test("an older export's Auto-Convert Images value is not imported", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.importSettings({ "Auto-Convert Images": true, "Bitmap Font": true });
    assert.equal(w.localStorage.getItem(NAMESPACE + "Auto-Convert Images"), null);
    assert.equal($SS.Config.get("Bitmap Font"), true, "the rest of the import lands");
});
