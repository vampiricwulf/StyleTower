"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function loadWithXHR(response) {
    return load({
        setup(w) {
            w.XMLHttpRequest = class {
                open(method, url) { this.method = method; this.url = url; }
                send(body) {
                    this.body = body;
                    this.responseText = response;
                    w.__lastXHR = this;
                    setTimeout(() => this.onloadend && this.onloadend(), 0);
                }
            };
        }
    });
}

function menuItem(w, id) {
    const li = w.document.createElement("li");
    li.setAttribute("data-id", String(id));
    return li;
}

test("deleting a reply removes it from the page on success", async () => {
    const w = await loadWithXHR("{}");
    const { $SS } = w.__ST;
    $SS.deletePost(menuItem(w, 101), false);
    await sleep(30);
    assert.equal(w.__lastXHR.body.get("delete_101"), "on");
    assert.equal(w.__lastXHR.body.get("file"), null);
    assert.equal(w.document.getElementById("reply_101"), null, "post removed");
    assert.ok(w.document.getElementById("reply_102"), "other posts untouched");
});

test("deleting only the file removes the file block and keeps the post", async () => {
    const w = await loadWithXHR("{}");
    const { $SS } = w.__ST;
    $SS.deletePost(menuItem(w, 101), true);
    await sleep(30);
    assert.equal(w.__lastXHR.body.get("file"), "on");
    const post = w.document.getElementById("reply_101");
    assert.ok(post, "post stays");
    assert.equal(post.querySelector(".files"), null, "file block removed");
});

test("a server error leaves the post in place", async () => {
    const w = await loadWithXHR('{"error":"Wrong password"}');
    const { $SS } = w.__ST;
    $SS.deletePost(menuItem(w, 101), false);
    await sleep(30);
    assert.ok(w.document.getElementById("reply_101"));
    assert.ok(w.document.querySelector(".styletower-notification-warning"));
});
