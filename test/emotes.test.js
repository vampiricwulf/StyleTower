"use strict";
/* Emote Previews (ported from the Holotower emote changes userscript): an
   enlarged emote beside the cursor on hover, its :code: pasted into the
   comment or copied on click. */
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

function addEmote(w, postId, name) {
    const body = w.document.querySelector("#" + postId + " .body");
    const img = w.document.createElement("img");
    img.className = "c_emoji";
    img.src = "/static/emotes/" + name + ".png";
    img.alt = name;
    body.appendChild(img);
    return img;
}

function mouse(w, type, target, x, y) {
    target.dispatchEvent(new w.MouseEvent(type, { bubbles: true, clientX: x || 0, clientY: y || 0 }));
}

async function hover(w, el, x, y) {
    mouse(w, "mouseover", el, x, y);
    await sleep(40);
}

function addQR(w, opts) {
    const d = w.document;
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    if (opts && opts.closed) qr.style.display = "none";
    d.body.appendChild(qr);
    return qr;
}

function clipboard(w) {
    const calls = w.__clip = [];
    Object.defineProperty(w.navigator, "clipboard", {
        configurable: true,
        value: { writeText(t) { calls.push(t); return Promise.resolve(); } }
    });
    return calls;
}

// jsdom lays nothing out: give the page a viewport and the box a size so the
// placement can be checked
function viewport(w, box, vw, vh) {
    Object.defineProperty(w.document.documentElement, "clientWidth", { configurable: true, value: vw });
    Object.defineProperty(w.document.documentElement, "clientHeight", { configurable: true, value: vh });
    if (box) {
        Object.defineProperty(box, "offsetWidth", { configurable: true, value: 80 });
        Object.defineProperty(box, "offsetHeight", { configurable: true, value: 90 });
    }
}

test("hover: the enlarged emote and its :code: show beside the cursor and go when the cursor leaves", async () => {
    const w = await load();
    const d = w.document;
    viewport(w, null, 1000, 800);
    const emote = addEmote(w, "reply_102", "pekora");
    assert.equal(d.getElementById("st-emote-preview"), null, "nothing built before the first hover");
    await hover(w, emote, 300, 200);
    const box = d.getElementById("st-emote-preview");
    assert.ok(box, "preview built");
    assert.ok(!box.hasAttribute("hidden"), "preview shown");
    assert.equal(box.querySelector("img").src, emote.src, "the hovered emote's image");
    assert.equal(box.querySelector(".st-emote-code").textContent, ":pekora:");
    assert.equal(box.style.left, "312px", "to the right of the cursor");
    assert.equal(box.style.top, "188px", "above the cursor (no size yet, so just the gap)");
    // With a real size: still above-right, then flipped at the edges
    viewport(w, box, 1000, 800);
    await hover(w, d.body, 0, 0);
    await hover(w, emote, 300, 200);
    assert.equal(box.style.left, "312px");
    assert.equal(box.style.top, "98px", "200 - 90 - 12");
    mouse(w, "mousemove", emote, 950, 50);
    await sleep(40);
    assert.equal(box.style.left, "858px", "flipped to the left of the cursor at the right edge: 950 - 12 - 80");
    assert.equal(box.style.top, "62px", "flipped below the cursor at the top: 50 + 12");
    // Onto the post text next to it
    await hover(w, d.querySelector("#reply_102 .body"), 320, 200);
    assert.ok(box.hasAttribute("hidden"), "hidden on leaving the emote");
    // Back on, then out of the window
    await hover(w, emote, 300, 200);
    assert.ok(!box.hasAttribute("hidden"));
    emote.dispatchEvent(new w.MouseEvent("mouseout", { bubbles: true, relatedTarget: null }));
    assert.ok(box.hasAttribute("hidden"), "hidden when the cursor leaves the window");
});

function rect(el, left, top, w, h) {
    el.getBoundingClientRect = () => ({ left, top, right: left + w, bottom: top + h, width: w, height: h });
}

test("hover: emotes in posts that arrive later are covered; a scroll takes the preview down until a move finds the emote still under the cursor", async () => {
    const w = await load();
    const d = w.document;
    const post = d.createElement("div");
    post.className = "post reply";
    post.id = "reply_300";
    post.innerHTML = '<p class="intro"><a class="post_no" href="#300">300</a></p><div class="body">late</div>';
    d.getElementById("thread_100").appendChild(post);
    await sleep(30);
    const emote = addEmote(w, "reply_300", "gura");
    await hover(w, emote, 100, 100);
    const box = d.getElementById("st-emote-preview");
    assert.ok(box && !box.hasAttribute("hidden"), "a later post's emote previews");
    assert.equal(box.querySelector(".st-emote-code").textContent, ":gura:");
    w.dispatchEvent(new w.Event("scroll"));
    assert.ok(box.hasAttribute("hidden"), "hidden on scroll");
    // A small scroll: the emote is still under the cursor, so the next
    // move brings the preview back
    rect(emote, 90, 90, 30, 30);
    mouse(w, "mousemove", emote, 100, 105);
    await sleep(40);
    assert.ok(!box.hasAttribute("hidden"), "back after a move over the emote");
    // A big one: it scrolled away, and the move lands on something else
    w.dispatchEvent(new w.Event("scroll"));
    rect(emote, 90, -500, 30, 30);
    mouse(w, "mousemove", d.body, 100, 105);
    await sleep(40);
    assert.ok(box.hasAttribute("hidden"), "stays down when the emote has gone");
});

test("hover: an emote removed while hovered (its hover preview or inline quote closing) takes the preview with it", async () => {
    const w = await load();
    const d = w.document;
    const clone = d.createElement("div");
    clone.className = "post reply inline-cloned-post";
    clone.innerHTML = '<div class="body">quoted</div>';
    d.querySelector("#reply_102 .body").appendChild(clone);
    const emote = d.createElement("img");
    emote.className = "c_emoji";
    emote.src = "/static/emotes/mumei.png";
    emote.alt = "mumei";
    clone.querySelector(".body").appendChild(emote);
    await hover(w, emote, 100, 100);
    const box = d.getElementById("st-emote-preview");
    assert.ok(box && !box.hasAttribute("hidden"));
    clone.remove();
    mouse(w, "mousemove", d.body, 101, 101);
    await sleep(40);
    assert.ok(box.hasAttribute("hidden"), "hidden once the emote is gone");
});

test("hover: an alt that already carries its colons is not doubled, and no alt means no caption", async () => {
    const w = await load();
    const d = w.document;
    const a = addEmote(w, "reply_102", "x");
    a.alt = ":korone:";
    await hover(w, a, 50, 50);
    const box = d.getElementById("st-emote-preview");
    assert.equal(box.querySelector(".st-emote-code").textContent, ":korone:");
    const b = addEmote(w, "reply_103", "y");
    b.removeAttribute("alt");
    await hover(w, b, 60, 60);
    assert.ok(!box.hasAttribute("hidden"), "image still previews");
    assert.ok(box.querySelector(".st-emote-code").hidden, "caption hidden without a code");
});

test("click: the :code: is typed into the open quick reply at the caret, with input and change fired", async () => {
    const w = await load();
    const d = w.document;
    const qr = addQR(w);
    await sleep(30);
    const box = qr.querySelector("textarea[name=body]");
    box.value = "hello world";
    box.focus();
    box.setSelectionRange(5, 5);
    const events = [];
    box.addEventListener("input", () => events.push("input"));
    box.addEventListener("change", () => events.push("change"));
    const emote = addEmote(w, "reply_102", "pekora");
    // mousedown is prevented so the comment box keeps the focus and caret
    // (jsdom never moves focus on mousedown, so the prevention itself is
    // what can be checked)
    const down = new w.MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0 });
    emote.dispatchEvent(down);
    assert.ok(down.defaultPrevented, "mousedown on a pasteable emote is prevented");
    const right = new w.MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 2 });
    emote.dispatchEvent(right);
    assert.ok(!right.defaultPrevented, "other buttons are left alone");
    mouse(w, "click", emote);
    assert.equal(box.value, "hello:pekora: world", "inserted at the caret");
    assert.equal(box.selectionStart, 13, "caret after the code");
    assert.deepEqual(events, ["input", "change"]);
    assert.equal(d.activeElement, box, "comment box focused");
    // A selection is replaced
    box.setSelectionRange(0, 5);
    mouse(w, "click", emote);
    assert.equal(box.value, ":pekora::pekora: world");
    // A modified click is left alone
    const ctrl = new w.MouseEvent("mousedown", { bubbles: true, cancelable: true, button: 0, ctrlKey: true });
    emote.dispatchEvent(ctrl);
    assert.ok(!ctrl.defaultPrevented);
    emote.dispatchEvent(new w.MouseEvent("click", { bubbles: true, ctrlKey: true }));
    assert.equal(box.value, ":pekora::pekora: world", "ctrl+click pastes nothing");
});

test("click: a never-focused comment box (a quick reply just cloned over a restored draft) gets the code at the end, not in front", async () => {
    const w = await load();
    const d = w.document;
    // The draft sits in the page form; the site clones that form into the
    // quick reply, and the clone's caret reports 0 in front of the text
    d.querySelector("form[name=post] textarea[name=body]").value = "my draft";
    const qr = addQR(w);
    await sleep(30);
    const box = qr.querySelector("textarea[name=body]");
    assert.equal(box.value, "my draft");
    assert.equal(box.selectionStart, 0);
    assert.notEqual(d.activeElement, box);
    mouse(w, "click", addEmote(w, "reply_102", "pekora"));
    assert.equal(box.value, "my draft:pekora:");
    // Now that it has been focused, a caret put at the start is honored
    box.setSelectionRange(0, 0);
    mouse(w, "click", addEmote(w, "reply_102", "gura"));
    assert.equal(box.value, ":gura:my draft:pekora:");
});

test("click: an emote in an inline quote clone pastes like one in the post itself", async () => {
    const w = await load();
    const d = w.document;
    const qr = addQR(w);
    await sleep(30);
    const clone = d.createElement("div");
    clone.className = "post reply inline-cloned-post";
    clone.innerHTML = '<div class="body"></div>';
    d.querySelector("#reply_102 .body").appendChild(clone);
    const emote = d.createElement("img");
    emote.className = "c_emoji";
    emote.src = "/static/emotes/irys.png";
    emote.alt = "irys";
    clone.querySelector(".body").appendChild(emote);
    mouse(w, "click", emote);
    assert.equal(qr.querySelector("textarea[name=body]").value, ":irys:");
});

test("click: a closed quick reply is opened through the site's button first", async () => {
    const w = await load();
    const d = w.document;
    const btn = d.createElement("a");
    btn.className = "quick-reply-btn";
    btn.href = "#";
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!d.getElementById("quick-reply")) addQR(w);
    });
    d.body.appendChild(btn);
    const emote = addEmote(w, "reply_102", "ina");
    mouse(w, "click", emote);
    const qr = d.getElementById("quick-reply");
    assert.ok(qr, "quick reply opened");
    assert.equal(qr.querySelector("textarea[name=body]").value, ":ina:");
    assert.equal(d.querySelector("form[name=post]:not(#quick-reply) textarea[name=body]").value, "", "the page's form untouched");
    // Hidden rather than absent: shown again
    qr.style.display = "none";
    mouse(w, "click", emote);
    assert.equal(qr.style.display, "", "a hidden quick reply is revealed");
    assert.equal(qr.querySelector("textarea[name=body]").value, ":ina::ina:");
});

function toasts(d) {
    return [...d.querySelectorAll(".styletower-notification-text")].map(t => t.textContent);
}

test("click: on a thread page with no quick reply to open, the page's own reply form gets the code and a toast says so", async () => {
    const w = await load();
    const d = w.document;
    const emote = addEmote(w, "reply_102", "kiara");
    mouse(w, "click", emote);
    assert.equal(d.querySelector("form[name=post] textarea[name=body]").value, ":kiara:");
    await sleep(20);
    assert.ok(toasts(d).some(t => /Typed :kiara: into the posting form/.test(t)), toasts(d).join(" | "));
});

test("click: with Show Original Form off and no quick reply, nothing is typed into the hidden form", async () => {
    const w = await load({ storage: { "Show Original Form": false } });
    const d = w.document;
    mouse(w, "click", addEmote(w, "reply_102", "kiara"));
    assert.equal(d.querySelector("form[name=post] textarea[name=body]").value, "");
    await sleep(20);
    assert.ok(toasts(d).some(t => /Open the quick reply to paste :kiara:/.test(t)), toasts(d).join(" | "));
});

test("click: on an index page only an already-open quick reply is written to; none is opened and the new-thread form is not touched", async () => {
    const w = await load({ fixture: "index.html", url: "https://holotower.org/hlgg/index.html" });
    const d = w.document;
    const post = d.querySelector(".thread .post.reply") || d.querySelector(".thread .post");
    assert.ok(post, "a post on the index");
    const emote = d.createElement("img");
    emote.className = "c_emoji";
    emote.src = "/static/emotes/bae.png";
    emote.alt = "bae";
    post.querySelector(".body").appendChild(emote);
    const form = d.querySelector("form[name=post] textarea[name=body]");
    assert.ok(form, "the index has a new-thread form");
    // A floating button and a pre-built hidden quick reply must both be
    // left alone here
    let opened = 0;
    const btn = d.createElement("a");
    btn.className = "quick-reply-btn";
    btn.addEventListener("click", () => opened++);
    d.body.appendChild(btn);
    const hidden = addQR(w, { closed: true });
    mouse(w, "click", emote);
    assert.equal(form.value, "", "not typed into the new-thread form");
    assert.equal(opened, 0, "the button was not clicked");
    assert.equal(hidden.style.display, "none", "the hidden quick reply stays hidden");
    assert.equal(hidden.querySelector("textarea[name=body]").value, "", "and is not written to");
    await sleep(20);
    assert.ok(toasts(d).some(t => /Open the thread to paste :bae:/.test(t)), toasts(d).join(" | "));
    // One that is open (another script's) is written to
    hidden.style.display = "";
    mouse(w, "click", emote);
    assert.equal(hidden.querySelector("textarea[name=body]").value, ":bae:");
    assert.equal(opened, 0);
});

test("click: an emote outside a post (a catalog teaser, whose card opens the thread) previews but is not pasted", async () => {
    const w = await load({ fixture: "catalog.html", url: "https://holotower.org/hlgg/catalog.html" });
    const d = w.document;
    const card = d.querySelector("#Grid .thread .replies") || d.querySelector("#Grid .thread");
    assert.ok(card, "a catalog card");
    // The fixture omits the catalog's new-thread form; the real page has one
    const form0 = d.createElement("form");
    form0.name = "post";
    form0.innerHTML = '<textarea name="body"></textarea>';
    d.body.insertBefore(form0, d.body.firstChild);
    const emote = d.createElement("img");
    emote.className = "c_emoji";
    emote.src = "/static/emotes/fauna.png";
    emote.alt = "fauna";
    card.appendChild(emote);
    await hover(w, emote, 100, 100);
    const box = d.getElementById("st-emote-preview");
    assert.ok(box && !box.hasAttribute("hidden"), "hover still previews");
    const form = d.querySelector("form[name=post] textarea[name=body]");
    assert.ok(form, "the catalog has a posting form");
    mouse(w, "click", emote);
    await sleep(20);
    assert.equal(form.value, "", "nothing pasted");
    assert.ok(!toasts(d).some(t => /paste|posting form/.test(t)), "no paste toast: " + toasts(d).join(" | "));
});

test("click: paste and copy both on act in one click", async () => {
    const w = await load({ storage: { "Click to Copy Emote": true }, setup: clipboard });
    const qr = addQR(w);
    await sleep(30);
    mouse(w, "click", addEmote(w, "reply_102", "kronii"));
    await sleep(20);
    assert.equal(qr.querySelector("textarea[name=body]").value, ":kronii:");
    assert.deepEqual(w.__clip, [":kronii:"]);
});

test("click: no clipboard API at all (jsdom's default) is reported, not thrown from the click", async () => {
    const w = await load({ storage: { "Click to Paste Emote": false, "Click to Copy Emote": true } });
    assert.equal(w.navigator.clipboard, undefined);
    mouse(w, "click", addEmote(w, "reply_102", "sana"));
    await sleep(20);
    assert.ok(toasts(w.document).some(t => /Could not copy :sana:/.test(t)));
    assert.equal(w.__errors.length, 0, "no uncaught error");
});

test("click: Click to Copy writes the clipboard and toasts; with paste off the comment stays as it was", async () => {
    const w = await load({
        storage: { "Click to Paste Emote": false, "Click to Copy Emote": true },
        setup: clipboard
    });
    const d = w.document;
    addQR(w);
    await sleep(30);
    const emote = addEmote(w, "reply_102", "calli");
    mouse(w, "click", emote);
    await sleep(20);
    assert.deepEqual(w.__clip, [":calli:"]);
    assert.equal(d.querySelector("#quick-reply textarea[name=body]").value, "");
    const toast = d.querySelector(".styletower-notification-success .styletower-notification-text");
    assert.ok(toast, "success toast");
    assert.equal(toast.textContent, "Copied :calli:");
});

test("click: a clipboard that refuses is reported instead of failing silently", async () => {
    const w = await load({
        storage: { "Click to Paste Emote": false, "Click to Copy Emote": true },
        setup(w) {
            Object.defineProperty(w.navigator, "clipboard", {
                configurable: true,
                value: { writeText() { return Promise.reject(new Error("denied")); } }
            });
        }
    });
    mouse(w, "click", addEmote(w, "reply_102", "ame"));
    await sleep(20);
    const toast = w.document.querySelector(".styletower-notification-warning .styletower-notification-text");
    assert.ok(toast, "warning toast");
    assert.match(toast.textContent, /Could not copy :ame:/);
});

test("click: emotes in the quick reply's own emote picker (not in a post) are left alone", async () => {
    const w = await load({ setup: clipboard, storage: { "Click to Copy Emote": true } });
    const d = w.document;
    const qr = addQR(w);
    await sleep(30);
    const list = d.createElement("div");
    list.id = "emote-list";
    const pick = d.createElement("img");
    pick.className = "c_emoji";
    pick.src = "/static/emotes/watson.png";
    pick.alt = "watson";
    list.appendChild(pick);
    qr.appendChild(list);
    mouse(w, "click", pick);
    assert.equal(qr.querySelector("textarea[name=body]").value, "");
    assert.deepEqual(w.__clip, []);
});

test("off: nothing happens with Emote Previews unchecked, and a live change switches it on and off again", async () => {
    const w = await load({ storage: { "Emote Previews": false } });
    const { $SS } = w.__ST, d = w.document;
    addQR(w);
    await sleep(30);
    const emote = addEmote(w, "reply_102", "pekora");
    await hover(w, emote, 100, 100);
    assert.equal(d.getElementById("st-emote-preview"), null, "no preview while off");
    mouse(w, "click", emote);
    assert.equal(d.querySelector("#quick-reply textarea[name=body]").value, "", "no paste while off");
    // The panel's live preview turns it on
    $SS.init(true, { "Emote Previews": true });
    await sleep(30);
    await hover(w, emote, 100, 100);
    const box = d.getElementById("st-emote-preview");
    assert.ok(box && !box.hasAttribute("hidden"), "preview after enabling live");
    mouse(w, "click", emote);
    assert.equal(d.querySelector("#quick-reply textarea[name=body]").value, ":pekora:", "paste after enabling live");
    // And off again while a preview is up: it comes down at once
    await hover(w, emote, 100, 100);
    assert.ok(!box.hasAttribute("hidden"));
    $SS.init(true, { "Emote Previews": false });
    await sleep(30);
    assert.ok(box.hasAttribute("hidden"), "hidden when switched off live");
    await hover(w, emote, 100, 100);
    assert.ok(box.hasAttribute("hidden"), "stays hidden");
    mouse(w, "click", emote);
    assert.equal(d.querySelector("#quick-reply textarea[name=body]").value, ":pekora:", "still the one paste from before: none while off");
});

test("options: the three rows sit under Integrations as Tower additions, the two click rows under the master", async () => {
    const w = await load();
    const d = w.document;
    w.__ST.$SS.options.show();
    const master = d.querySelector("#oneechan-options input[name='Emote Previews']");
    const paste = d.querySelector("#oneechan-options input[name='Click to Paste Emote']");
    const copy = d.querySelector("#oneechan-options input[name='Click to Copy Emote']");
    assert.ok(master && paste && copy, "rows present");
    assert.equal(master.checked, true);
    assert.equal(paste.checked, true);
    assert.equal(copy.checked, false);
    assert.ok(master.hasAttribute("has-suboption"));
    for (const el of [master, paste, copy])
        assert.equal(el.closest(".option").getAttribute("data-tower-status"), "added");
    assert.ok(paste.closest(".option").classList.contains("suboption"));
    assert.ok(!paste.closest(".option").hasAttribute("hidden"), "sub-options shown while the master is on");
    // Unchecking the master folds them away
    master.checked = false;
    master.dispatchEvent(new w.Event("change", { bubbles: true }));
    assert.ok(paste.closest(".option").hasAttribute("hidden"));
    assert.ok(copy.closest(".option").hasAttribute("hidden"));
});
