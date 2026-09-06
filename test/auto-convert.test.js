"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function makeFile(w, name, type, size) {
    return new w.File([new Uint8Array(size || 10)], name, { type });
}

function loadConvert(extra) {
    return load({
        storage: Object.assign({ "Auto-Convert Images": true }, extra),
        setup(w) {
            // jsdom has no bitmap decoder: images decode, anything else fails
            // like a real browser handed a video
            w.createImageBitmap = function (file) {
                return /^image\//.test(file.type) ?
                    Promise.resolve({ width: 100, height: 100, close() {} }) :
                    Promise.reject(new TypeError("The source image could not be decoded."));
            };
        }
    });
}

function select(w, input, file) {
    Object.defineProperty(input, "files", { value: [file], writable: true, configurable: true });
    input.dispatchEvent(new w.Event("change", { bubbles: true }));
}

test("a non-image upload (WEBM) passes through untouched", async () => {
    const w = await loadConvert();
    const input = w.document.querySelector("form[name=post] input[type=file]");
    let seen = 0;
    input.addEventListener("change", () => seen++);
    select(w, input, makeFile(w, "clip.webm", "video/webm"));
    await sleep(60);
    assert.equal(input.files.length, 1, "the selected file must survive");
    assert.equal(input.files[0].name, "clip.webm");
    assert.equal(seen, 1, "the site's own change listener sees the selection once");
    assert.ok(!input._scConverting, "the input must not stay flagged as converting");
});

test("a file with no MIME type passes through untouched", async () => {
    const w = await loadConvert();
    const input = w.document.querySelector("form[name=post] input[type=file]");
    select(w, input, makeFile(w, "mystery.bin", ""));
    await sleep(60);
    assert.equal(input.files.length, 1);
    assert.equal(input.files[0].name, "mystery.bin");
    assert.ok(!input._scConverting);
});

test("a small JPEG within limits is re-emitted once, unchanged", async () => {
    const w = await loadConvert();
    const input = w.document.querySelector("form[name=post] input[type=file]");
    let seen = 0;
    input.addEventListener("change", () => seen++);
    select(w, input, makeFile(w, "photo.jpg", "image/jpeg"));
    await sleep(60);
    assert.equal(input.files.length, 1);
    assert.equal(input.files[0].name, "photo.jpg");
    assert.equal(seen, 1);
    assert.ok(!input._scConverting);
});

test("a decode failure on an image restores the original selection", async () => {
    const w = await load({
        storage: { "Auto-Convert Images": true },
        setup(w) { w.createImageBitmap = () => Promise.reject(new TypeError("decode failed")); }
    });
    const input = w.document.querySelector("form[name=post] input[type=file]");
    select(w, input, makeFile(w, "broken.webp", "image/webp"));
    await sleep(60);
    assert.equal(input.files.length, 1, "the original file is put back");
    assert.equal(input.files[0].name, "broken.webp");
    assert.ok(!input._scConverting);
});
