"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

const INDEX = "https://holotower.org/hlgg/index.html";
const CATALOG = "https://holotower.org/hlgg/catalog.html";

test("index: the control row offers catalog, archive, bottom, refresh and an OP search", async () => {
    const w = await load({ fixture: "index.html", url: INDEX });
    const d = w.document;
    const nav = d.getElementById("st-index-nav");
    assert.ok(nav, "control row built");
    const texts = [...nav.querySelectorAll("a")].map(a => a.textContent);
    assert.deepEqual(texts, ["Catalog", "Archive", "Bottom", "Refresh"]);
    assert.equal(nav.querySelector("a").getAttribute("href"), "/hlgg/catalog.html");
    const search = d.getElementById("st-index-search");
    search.value = "kronii";
    search.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(d.getElementById("thread_300").classList.contains("st-search-hidden"), true);
    assert.equal(d.getElementById("thread_400").classList.contains("st-search-hidden"), false);
    search.value = "";
    search.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(d.querySelectorAll(".st-search-hidden").length, 0);
});

test("index: OP and reply structure is normalized like on thread pages", async () => {
    const w = await load({ fixture: "index.html", url: INDEX });
    const d = w.document;
    assert.ok(d.querySelector("#op_300 > .files"), "OP files moved inside the OP");
    assert.ok(d.querySelector("#thread_300 > span.omitted"), "omitted summary hoisted to the thread");
    assert.equal(d.querySelector("#op_300 span.omitted"), null);
    assert.equal(d.querySelector("#op_300 p.fileinfo").textContent.indexOf("File:"), -1, "File: label dropped");
});

test("index: one-click hide buttons proxy the site's thread and post controls", async () => {
    const w = await load({ fixture: "index.html", url: INDEX });
    const d = w.document;
    await sleep(900);
    const opBtn = d.querySelector("a.st-index-hide.st-thread-hide[for='op_300']");
    const replyBtn = d.querySelector("a.st-index-hide[for='reply_301']");
    assert.ok(opBtn, "OP hide button");
    assert.ok(replyBtn, "reply hide button");
    // The site's post-filter.js hides the OP's body when its [–] link is clicked
    const op = d.getElementById("op_300");
    d.querySelector("#op_300 a.hide-thread-link").addEventListener("click", e => {
        e.preventDefault();
        op.querySelector(":scope > .body").style.display = "none";
    });
    opBtn.click();
    await sleep(30);
    assert.ok(opBtn.classList.contains("st-hidden"));
    assert.ok(op.classList.contains("st-index-hidden"));
});

test("index: a reply hide button drives the site's post menu silently", async () => {
    const w = await load({ fixture: "index.html", url: INDEX });
    const d = w.document;
    await sleep(900);
    // Simulate post-menu.js + post-filter.js: the ▶ button opens a menu whose
    // Hide item hides the post body
    const reply = d.getElementById("reply_301");
    const menuBtn = d.createElement("a");
    menuBtn.className = "post-btn";
    menuBtn.href = "#";
    menuBtn.textContent = "▶";
    reply.querySelector("p.intro").appendChild(menuBtn);
    let menuOpened = 0;
    menuBtn.addEventListener("click", e => {
        e.preventDefault();
        menuOpened++;
        menuBtn.classList.add("post-btn-open");
        const menu = d.createElement("div");
        menu.className = "post-menu";
        menu.innerHTML = '<ul><li class="post-item" id="filter-menu-hide">Hide post</li></ul>';
        menu.querySelector("#filter-menu-hide").addEventListener("click", () => {
            reply.querySelector(":scope > .body").style.display = "none";
        });
        d.body.appendChild(menu);
    });
    await sleep(30);
    d.querySelector("a.st-index-hide[for='reply_301']").click();
    await sleep(30);
    assert.equal(menuOpened, 1);
    assert.equal(d.querySelector(".post-menu"), null, "the proxied menu is removed again");
    assert.ok(reply.classList.contains("st-index-hidden"));
    assert.ok(!d.documentElement.classList.contains("st-menu-silent"));
});

test("catalog: cards open their thread; Ctrl+click opens a background tab", async () => {
    const opened = [];
    const w = await load({
        fixture: "catalog.html", url: CATALOG, gm: true,
        setup(w) { w.GM_openInTab = (href, o) => opened.push([href, o && o.active]); }
    });
    const d = w.document;
    assert.equal(w.__ST.$SS.location.catalog, true);
    const card = d.querySelector("#Grid .mix[data-id='500'] div.thread");
    card.querySelector(".replies").dispatchEvent(new w.MouseEvent("click", { bubbles: true, ctrlKey: true }));
    assert.deepEqual(opened, [["https://holotower.org/hlgg/res/500.html", false]]);
});

test("catalog: highlighted threads are marked and the newest one pinned first", async () => {
    const w = await load({ fixture: "catalog.html", url: CATALOG });
    const d = w.document;
    const first = d.querySelector("#Grid > .mix");
    assert.equal(first.getAttribute("data-id"), "501", "newest Hololive Global thread pinned to the top");
    assert.ok(first.classList.contains("highlighted"));
    assert.equal(first.style.getPropertyValue("--pin-color"), "#00bfff");
    assert.ok(d.querySelector("#Grid .mix[data-id='502']").classList.contains("highlighted"));
    assert.ok(!d.querySelector("#Grid .mix[data-id='500']").classList.contains("highlighted"));
    assert.ok(d.querySelector("#sc-catalog-highlights-css"), "highlight style injected");
});

test("catalog: the Pin Settings dialog opens and the fallback search filters cards", async () => {
    const w = await load({ fixture: "catalog.html", url: CATALOG });
    const d = w.document;
    const btn = [...d.querySelectorAll("button")].find(b => b.textContent === "Pin Settings");
    assert.ok(btn, "Pin Settings button");
    btn.click();
    const dialog = d.getElementById("pin-settings");
    assert.ok(dialog && dialog.style.display !== "none", "dialog shown");
    assert.equal(dialog.querySelectorAll("input[placeholder=Subject]").length, 1);
    const search = d.querySelector(".custom-search-bar input");
    assert.ok(search, "fallback search bar added (the page has none)");
    search.value = "kronii";
    search.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(d.querySelector("#Grid .mix[data-id='500']").style.display, "");
    assert.equal(d.querySelector("#Grid .mix[data-id='501']").style.display, "none");
});

test("catalog: mascots stay hidden there by default", async () => {
    const mascots = JSON.stringify([{ url: "https://example.invalid/m.png", enabled: true }]);
    const w = await load({ fixture: "catalog.html", url: CATALOG, storage: { "Enable Mascots": true, "Mascots": mascots } });
    assert.equal(w.document.getElementById("styletower-mascots"), null);
    const w2 = await load({ fixture: "catalog.html", url: CATALOG, storage: { "Enable Mascots": true, "Mascots": mascots, "Hide Mascots in Catalog": false } });
    assert.ok(w2.document.querySelector("#styletower-mascots img"));
});
