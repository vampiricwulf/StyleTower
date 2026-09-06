"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

test("mascots: the selected mascot renders with its scale, flip, clip and filters", async () => {
    const w = await load({
        storage: {
            "Enable Mascots": true,
            "Mascots": JSON.stringify([{ url: "https://example.invalid/m.png", name: "m", enabled: true, opacity: 60,
                offset: 20, hoffset: 10, flip: true, clip: [1, 2, 3, 4], filters: { gray: 50, blur: 2 } }])
        }
    });
    const box = w.document.getElementById("styletower-mascots");
    assert.ok(box, "mascot container");
    assert.ok(box.classList.contains("mascots-right"));
    assert.equal(box.style.bottom, "20px");
    assert.equal(box.style.marginRight, "10px");
    const img = box.querySelector("img");
    assert.equal(img.src, "https://example.invalid/m.png");
    assert.equal(img.style.opacity, "0.6");
    assert.equal(img.style.transform, "scaleX(-1)");
    // visible-side clip values are swapped left/right for a flipped image
    assert.equal(img.style.clipPath, "inset(1px 2px 3px 4px)");
    assert.equal(img.style.filter, "grayscale(50%) blur(2px)");
});

test("mascots: a board filter keeps a mascot off other boards", async () => {
    const w = await load({
        storage: { "Enable Mascots": true, "Mascots": JSON.stringify([{ url: "https://example.invalid/m.png", enabled: true, boards: "jp, vt" }]) }
    });
    assert.equal(w.document.getElementById("styletower-mascots"), null);
});

test("comment draft: saved after the delay, restored on the next load, cleared on submit", async () => {
    const w = await load({ storage: { "Remember Comment Draft": true } });
    const { $SS } = w.__ST;
    $SS.draftDelay = 30;
    const d = w.document;
    const ta = d.querySelector("form[name=post] textarea[name=body]");
    ta.value = "half-written";
    ta.dispatchEvent(new w.Event("input", { bubbles: true }));
    await sleep(120);
    const key = $SS.getRememberCommentKey();
    const saved = JSON.parse(w.localStorage.getItem(key));
    assert.equal(saved.text, "half-written");

    const w2 = await load({ storage: { "Remember Comment Draft": true }, setup(w2) { w2.localStorage.setItem(key, w.localStorage.getItem(key)); } });
    const ta2 = w2.document.querySelector("form[name=post] textarea[name=body]");
    assert.equal(ta2.value, "half-written", "draft restored");
    w2.document.querySelector("form[name=post]").addEventListener("submit", e => e.preventDefault());
    w2.document.querySelector("form[name=post] input[type=submit]").click();
    await sleep(30);
    assert.equal(w2.localStorage.getItem(key), null, "draft cleared on submit");
});

test("watch thread on reply: submitting adds the thread to the site's watcher", async () => {
    const w = await load({ storage: { "Watch Thread on Reply": true } });
    const d = w.document;
    d.querySelector("form[name=post]").addEventListener("submit", e => e.preventDefault());
    d.querySelector("form[name=post] input[type=submit]").click();
    const watch = JSON.parse(w.localStorage.getItem("watch_js"));
    assert.ok(watch && watch.hlgg && watch.hlgg.threads["100"], "thread 100 watched: " + w.localStorage.getItem("watch_js"));
    assert.equal(watch.hlgg.slugs["100"], "/hlgg/res/100.html");
});

test("post menu: Toggle You marks and unmarks a post in the site's own_posts store", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    const btn = d.createElement("a");
    btn.className = "post-btn post-btn-open";
    d.querySelector("#reply_101 p.intro").appendChild(btn);
    const menu = d.createElement("div");
    menu.className = "post-menu";
    menu.innerHTML = '<ul><li class="post-item">Hide post</li></ul>';
    d.body.appendChild(menu);
    await sleep(30);
    const item = menu.querySelector("[data-cmd='toggle-you']");
    assert.ok(item, "Toggle You added to the menu");
    assert.equal(item.textContent, "Toggle You");
    assert.ok(menu.querySelector("[data-cmd='delete-post']"), "Delete submenu added");
    item.click();
    assert.deepEqual(JSON.parse(w.localStorage.getItem("own_posts")), { hlgg: ["101"] });
    const post = d.getElementById("reply_101");
    assert.ok(post.classList.contains("you"));
    assert.equal(post.querySelector(".intro span.own_post").textContent, "(You)");
    assert.equal(item.textContent, "✓ You");
    item.click();
    assert.equal(w.localStorage.getItem("own_posts"), "{}");
    assert.ok(!post.classList.contains("you"));
    assert.equal(post.querySelector(".intro span.own_post"), null);
    assert.equal($SS.getOwnPosts("hlgg").length, 0);
});

test("autohide quick reply: the TS keybind shows and hides a docked form", async () => {
    const w = await load({ storage: { "Autohide Style": 1 } });
    const d = w.document;
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    d.body.appendChild(qr);
    await sleep(60);
    const press = () => d.body.dispatchEvent(new w.KeyboardEvent("keydown", { key: "q", bubbles: true }));
    press();
    assert.ok(qr.classList.contains("focus"), "shown with the comment box focused");
    assert.equal(d.activeElement, qr.querySelector("textarea[name=body]"));
    press();
    assert.ok(!qr.classList.contains("focus"), "hidden again");
});

test("header: TS's stored fixed-header preference is mirrored onto :root on index pages", async () => {
    const w = await load({ fixture: "index.html", url: "https://holotower.org/hlgg/index.html",
        site: { "Thread Settings": JSON.stringify({ headerFixed: true, headerAutohide: true }) } });
    const root = w.document.documentElement.classList;
    assert.ok(root.contains("fixed") && root.contains("top-header") && root.contains("autohide"));
    assert.ok(w.document.querySelector("body > .boardlist").classList.contains("fixed"));
    const w2 = await load({ fixture: "index.html", url: "https://holotower.org/hlgg/index.html",
        site: { "Thread Settings": JSON.stringify({ headerFixed: false }) } });
    assert.ok(!w2.document.documentElement.classList.contains("fixed"));
});
