"use strict";
/* Quote hover previews: the site clones the quoted post on every hover and
   TS drops a hidden .post.dummy beside the quoting post; both used to pull
   the whole per-post pipeline and thread-wide style work. These cases pin
   the cheap paths. */
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function addReply(w, id, threadId, html) {
    const thread = w.document.getElementById(threadId || "thread_100");
    const post = w.document.createElement("div");
    post.className = "post reply";
    post.id = "reply_" + id;
    post.innerHTML = '<p class="intro"><span class="name">Anonymous</span> <a class="post_no" href="#' + id + '">No.</a><a class="post_no" href="#q' + id + '">' + id + '</a></p>' + (html || '<div class="body">new</div>');
    thread.appendChild(post);
    return post;
}

function marks(el) {
    return ["st-last-reply", "st-last-post", "st-even"].filter(c => el.classList.contains(c)).join(" ");
}

test("thread marks: the last real reply is marked, and TS's hover dummy leaves the marks alone", async () => {
    const w = await load();
    const d = w.document;
    assert.equal(marks(d.getElementById("reply_103")), "st-last-reply");
    assert.equal(marks(d.getElementById("reply_101")), "");
    assert.equal(marks(d.getElementById("reply_102")), "");
    assert.equal(marks(d.getElementById("op_100")), "", "an OP with replies keeps its margin");
    // TS inserts this after the quoting post on mouseenter and removes it on leave
    const dummy = d.createElement("div");
    dummy.className = "post dummy";
    dummy.style.display = "none";
    d.getElementById("reply_103").after(dummy);
    await sleep(50);
    assert.equal(marks(d.getElementById("reply_103")), "st-last-reply", "dummy after the last reply is not counted");
    assert.equal(marks(dummy), "", "the dummy itself is never marked");
    dummy.remove();
    await sleep(50);
    assert.equal(marks(d.getElementById("reply_103")), "st-last-reply");
    const p104 = addReply(w, 104);
    await sleep(50);
    assert.equal(marks(p104), "st-last-reply", "a new last reply takes the mark");
    assert.equal(marks(d.getElementById("reply_103")), "", "and the previous one loses it");
    p104.remove();
    await sleep(50);
    assert.equal(marks(d.getElementById("reply_103")), "st-last-reply", "removal hands the mark back");
});

test("thread marks: Recolor Even Replies parity counts real replies only", async () => {
    const w = await load({ storage: { "Recolor Even Replies": true } });
    const d = w.document;
    assert.equal(marks(d.getElementById("reply_101")), "");
    assert.equal(marks(d.getElementById("reply_102")), "st-even");
    assert.equal(marks(d.getElementById("reply_103")), "st-last-reply");
    // post-hover.js parks fetched cross-thread posts hidden before the first reply
    const hidden = d.createElement("div");
    hidden.className = "post reply hidden";
    hidden.id = "reply_50";
    hidden.style.display = "none";
    d.getElementById("reply_101").before(hidden);
    await sleep(50);
    assert.equal(marks(d.getElementById("reply_102")), "st-even", "hidden posts do not shift the parity");
    assert.equal(marks(hidden), "");
    const p104 = addReply(w, 104);
    await sleep(50);
    assert.equal(marks(p104), "st-last-reply st-even");
});

test("thread marks: an OP with nothing after it carries the last-post mark", async () => {
    const w = await load();
    const d = w.document;
    const thread = d.createElement("div");
    thread.className = "thread";
    thread.id = "thread_900";
    thread.setAttribute("data-board", "hlgg");
    thread.innerHTML = '<div class="post op" id="op_900"><p class="intro"><a class="post_no" href="#q900">900</a></p><div class="body">op</div></div><br class="clear">';
    d.querySelector("form[name=postcontrols]").appendChild(thread);
    await sleep(50);
    assert.equal(marks(d.getElementById("op_900")), "st-last-post");
    const reply = addReply(w, 901, "thread_900");
    await sleep(50);
    assert.equal(marks(d.getElementById("op_900")), "", "a reply after the OP restores its margin");
    assert.equal(marks(reply), "st-last-reply");
});

test("hover previews skip the per-post pipeline but still re-arm the copied loop video", async () => {
    const w = await load({ storage: { "Replace Thumbnails": true, "Replace WEBM/MP4": true } });
    const d = w.document, $SS = w.__ST.$SS;
    const calls = {};
    ["tidyFileInfo", "replacePostMenuBtn", "syncInlinedMarks", "moveOPFiles", "replaceThumbnails"].forEach(name => {
        const orig = $SS[name];
        calls[name] = 0;
        $SS[name] = function () { calls[name]++; return orig.apply(this, arguments); };
    });
    const origNode = $SS.integrations.onNodeAdded;
    calls.onNodeAdded = 0;
    $SS.integrations.onNodeAdded = function () { calls.onNodeAdded++; return origNode.apply(this, arguments); };
    const observed = [];
    w.__io.observe = v => observed.push(v);
    // Startup still adds things (the update notice): let it settle, then count
    await sleep(200);
    Object.keys(calls).forEach(name => { calls[name] = 0; });

    // post-hover.js: a full clone of the quoted post, inserted after the link's parent
    const hover = d.getElementById("reply_103").cloneNode(true);
    hover.id = "post-hover-103";
    hover.classList.add("post-hover");
    hover.querySelector(".body").innerHTML += '<div class="inline-quote-container" data-inlined-id="102"></div>';
    d.querySelector("#reply_101 .body").after(hover);
    await sleep(50);
    const video = hover.querySelector("video.st-thumb-video");
    assert.ok(video, "the clone carries the loop video");
    assert.equal(video._stCloneArmed, true, "armed");
    assert.ok(video.muted && video.loop, "muted and looping");
    assert.ok(observed.indexOf(video) !== -1, "handed to the viewport observer");

    // TS then refills the preview from the source post
    const fresh = d.getElementById("reply_103").cloneNode(true);
    hover.innerHTML = "";
    while (fresh.firstChild) hover.appendChild(fresh.firstChild);
    await sleep(50);
    const video2 = hover.querySelector("video.st-thumb-video");
    assert.equal(video2._stCloneArmed, true, "the refilled clone's video is armed too");

    hover.remove();
    await sleep(50);
    Object.keys(calls).forEach(name => assert.equal(calls[name], 0, name + " ran for a hover clone"));
    assert.equal($SS._hoverEl, null, "hover tracking cleared on removal");
});

test("TS's hidden hover dummy runs none of the per-post work", async () => {
    const w = await load();
    const $SS = w.__ST.$SS, d = w.document;
    let calls = 0;
    const orig = $SS.replacePostMenuBtn;
    $SS.replacePostMenuBtn = function () { calls++; return orig.apply(this, arguments); };
    await sleep(200); // startup's own additions (the update notice) settle first
    calls = 0;
    const dummy = d.createElement("div");
    dummy.className = "post dummy";
    dummy.style.display = "none";
    d.getElementById("reply_101").after(dummy);
    await sleep(50);
    dummy.remove();
    await sleep(50);
    assert.equal(calls, 0);
});

test("foreign nodes (TS markers, the media hover image) skip the per-post pipeline; posts still get it", async () => {
    const w = await load();
    const $SS = w.__ST.$SS, d = w.document;
    const calls = {};
    ["tidyFileInfo", "replacePostMenuBtn", "replaceThumbnails", "moveOPFiles"].forEach(name => {
        const orig = $SS[name];
        calls[name] = 0;
        $SS[name] = function () { calls[name]++; return orig.apply(this, arguments); };
    });
    await sleep(200);
    Object.keys(calls).forEach(name => { calls[name] = 0; });
    const rail = d.createElement("div");
    rail.id = "you-scroll-rail";
    rail.innerHTML = '<span class="you-marker"></span><span class="you-marker"></span>';
    d.body.appendChild(rail);
    const hoverImg = d.createElement("img");
    hoverImg.id = "chx_hoverImage";
    d.body.appendChild(hoverImg);
    const notice = d.createElement("div");
    notice.className = "ts-notice";
    notice.textContent = "hello";
    d.body.appendChild(notice);
    await sleep(50);
    Object.keys(calls).forEach(name => assert.equal(calls[name], 0, name + " ran for a foreign node"));
    addReply(w, 105);
    await sleep(50);
    Object.keys(calls).forEach(name => assert.ok(calls[name] > 0, name + " did not run for a real post"));
});

test("follow cursor: one placement per frame, left-anchored, and a new preview is placed at once", async () => {
    const w = await load({
        setup(w) {
            Object.defineProperty(w.HTMLElement.prototype, "clientWidth", { get() { return 1000; }, configurable: true });
            Object.defineProperty(w.HTMLElement.prototype, "clientHeight", { get() { return 800; }, configurable: true });
        }
    });
    const d = w.document;
    const move = (x, y) => d.dispatchEvent(new w.MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true }));
    const hover = d.createElement("div");
    hover.className = "post reply post-hover";
    hover.id = "post-hover-101";
    d.body.appendChild(hover);
    await sleep(40);
    // The site writes left/top on every mousemove; a burst of moves must
    // not add a layout read+write per event on top of that
    move(100, 200); move(101, 201); move(102, 202);
    assert.equal(hover.style.position, "", "nothing written synchronously");
    await sleep(40);
    assert.equal(hover.style.position, "fixed");
    assert.ok(hover.style.top !== "", "top set");
    assert.ok(hover.style.left !== "", "left set");
    assert.equal(hover.style.right, "", "right is never set: with left it would over-constrain the width");
    hover.remove();
    await sleep(40);
    move(900, 50);
    await sleep(40);
    // The cursor sits still while the page scrolls under it: the preview
    // appears without a mousemove and must still land beside the cursor
    const later = d.createElement("div");
    later.className = "post reply post-hover";
    later.id = "post-hover-102";
    d.body.appendChild(later);
    await sleep(60);
    assert.equal(later.style.position, "fixed", "placed from the remembered cursor position");
    assert.equal(later.style.right, "");
    assert.ok(parseFloat(later.style.left) > 500, "on the right half, anchored by left");
});

test("replaced thumbnails load lazily and decode off the frame, and so do their hover clones", async () => {
    const w = await load({ storage: { "Replace Thumbnails": true } });
    const img = w.document.querySelector("#reply_101 img.post-image");
    assert.equal(img.getAttribute("decoding"), "async");
    // The browser defers the full-size fetch until the post nears the
    // viewport, instead of every image on the page loading at once
    assert.equal(img.getAttribute("loading"), "lazy");
    const clone = img.cloneNode(true);
    assert.equal(clone.getAttribute("decoding"), "async", "attribute, so post-hover.js's clone carries it");
    assert.equal(clone.getAttribute("loading"), "lazy");
});
