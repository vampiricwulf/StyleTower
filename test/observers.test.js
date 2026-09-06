"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function addReply(w, id, html) {
    const thread = w.document.getElementById("thread_100");
    const post = w.document.createElement("div");
    post.className = "post reply";
    post.id = "reply_" + id;
    post.innerHTML = '<p class="intro"><span class="name">Anonymous</span> <a class="post_no" href="#' + id + '">No.</a><a class="post_no" href="#q' + id + '">' + id + '</a></p>' + (html || '<div class="body">new</div>');
    thread.appendChild(post);
    return post;
}

test("sauce links: present at load and added to posts that arrive later", async () => {
    const w = await load();
    const d = w.document;
    const first = d.querySelector("#reply_101 .sc-sauce-link a");
    assert.ok(first, "X link on the loaded post");
    assert.equal(first.href, "https://x.com/someone/status/1234567890123456789");
    const post = addReply(w, 200, '<div class="files "><div class="file"><p class="fileinfo"><span>File: <a href="/hlgg/src/9.png">9.png</a></span><span class="unimportant">(1 KB, 10x10, <a href="/hlgg/src/9.png" download="@bob.bsky.social-bsky-3lbcdefghijkl.png">x</a>)</span></p><a href="/hlgg/src/9.png"><img class="post-image" src="/hlgg/thumb/9.jpg"></a></div></div><div class="body">later</div>');
    await sleep(80);
    const later = post.querySelector(".sc-sauce-link a");
    assert.ok(later, "sauce link on the appended post");
    assert.equal(later.href, "https://bsky.app/profile/bob.bsky.social/post/3lbcdefghijkl");
});

test("auto scroll: builds its checkbox and scrolls on new posts when at the bottom", async () => {
    const w = await load({ storage: { "Auto Scroll": true } });
    const d = w.document;
    await sleep(50);
    const box = d.querySelector("#updater input.auto-scroll-claude");
    assert.ok(box, "Auto Scroll checkbox added next to the site's");
    assert.equal(d.querySelector("#updater input.auto-scroll").style.display, "none");
    box.checked = true;
    addReply(w, 201);
    await sleep(250);
    assert.ok(w.__scrollCalls && w.__scrollCalls.length > 0, "scrolled to the new post");
});

test("auto scroll: no scroll when the box is unchecked", async () => {
    const w = await load({ storage: { "Auto Scroll": true } });
    await sleep(50);
    const box = w.document.querySelector("#updater input.auto-scroll-claude");
    box.checked = false;
    addReply(w, 202);
    await sleep(250);
    assert.equal((w.__scrollCalls || []).length, 0);
});

test("auto scroll: re-attaches when the site rebuilds its updater", async () => {
    const w = await load({ storage: { "Auto Scroll": true } });
    const d = w.document;
    await sleep(50);
    const updater = d.getElementById("updater");
    const fresh = d.createElement("span");
    fresh.id = "updater";
    fresh.innerHTML = '[<a href="#" id="update_thread">Update</a>] (<input type="checkbox" class="auto-scroll"> Scroll to New posts)';
    updater.parentNode.replaceChild(fresh, updater);
    await sleep(1300);
    assert.ok(fresh.querySelector("input.auto-scroll-claude"), "checkbox rebuilt in the new updater");
});

test("replaced thumbnails: full image at load, re-asserted after a lazy-loader overwrite", async () => {
    const w = await load({ storage: { "Replace Thumbnails": true } });
    const img = w.document.querySelector("#reply_101 img.post-image");
    assert.equal(img.src, "https://holotower.org/hlgg/src/2.jpg");
    img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
    await sleep(150);
    assert.equal(img.src, "https://holotower.org/hlgg/src/2.jpg");
});

test("replaced thumbnails: a post that arrives later is replaced too", async () => {
    const w = await load({ storage: { "Replace Thumbnails": true } });
    const post = addReply(w, 203, '<div class="files "><div class="file"><p class="fileinfo"></p><a href="/hlgg/src/9.png"><img class="post-image" src="/hlgg/thumb/9.jpg"></a></div></div>');
    await sleep(80);
    assert.equal(post.querySelector("img.post-image").src, "https://holotower.org/hlgg/src/9.png");
});

test("video thumbnails: a looping video stands in, hides while the site's player is open", async () => {
    const w = await load({ storage: { "Replace Thumbnails": true, "Replace WEBM/MP4": true } });
    const d = w.document;
    const file = d.querySelector("#reply_103 .file");
    const video = file.querySelector("video.st-thumb-video");
    assert.ok(video, "loop video inserted");
    assert.equal(video.src, "https://holotower.org/hlgg/src/3.webm");
    assert.ok(video.muted && video.loop);
    assert.ok(file.classList.contains("st-video-thumb"));
    // The site's inline-expanding.js drops a div > video player beside the thumb
    const player = d.createElement("div");
    player.innerHTML = "<video></video>";
    file.querySelector("a").appendChild(player);
    await sleep(80);
    assert.equal(video.style.display, "none", "loop hidden behind the expanded player");
    player.style.display = "none";
    await sleep(80);
    assert.equal(video.style.display, "", "loop back after collapse");
});

test("auto scroll: a hover preview present during a new post does not skew later detection", async () => {
    const w = await load({ storage: { "Auto Scroll": true } });
    const d = w.document;
    await sleep(50);
    d.querySelector("#updater input.auto-scroll-claude").checked = true;
    // TS drops a cloned post (with its own p.intro) into the body on hover
    const clone = d.createElement("div");
    clone.className = "post reply post-hover";
    clone.id = "post-hover-101";
    clone.innerHTML = '<p class="intro"><span class="name">Anonymous</span></p><div class="body">clone</div>';
    d.body.appendChild(clone);
    addReply(w, 210);
    await sleep(250);
    assert.equal((w.__scrollCalls || []).length, 1, "first real post scrolls");
    clone.remove();
    addReply(w, 211);
    await sleep(250);
    assert.equal(w.__scrollCalls.length, 2, "the next real post still scrolls after the clone is gone");
});

test("video thumbnails: loops do not preload until they are played", async () => {
    const w = await load({ storage: { "Replace Thumbnails": true, "Replace WEBM/MP4": true } });
    const video = w.document.querySelector("#reply_103 video.st-thumb-video");
    assert.equal(video.getAttribute("preload"), "none");
});

test("follow cursor: the current hover preview is positioned on mouse move, including a later one", async () => {
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
    await sleep(30);
    move(100, 200);
    assert.equal(hover.style.position, "fixed");
    assert.ok(hover.style.top !== "", "top set");
    hover.remove();
    await sleep(30);
    const later = d.createElement("div");
    later.className = "post reply post-hover";
    later.id = "post-hover-102";
    d.body.appendChild(later);
    await sleep(30);
    move(900, 50);
    assert.equal(later.style.position, "fixed");
    assert.ok(later.style.right !== "" || later.style.left !== "", "placed horizontally");
});
