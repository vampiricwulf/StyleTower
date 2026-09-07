"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

test("mascots: the selected mascot renders with its offsets, flip, clip and filters", async () => {
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
    assert.equal(box.style.marginRight, "", "Push In moves the image inside the window, not the window");
    const img = box.querySelector("img");
    assert.equal(img.style.marginRight, "10px");
    assert.equal(img.src, "https://example.invalid/m.png");
    assert.equal(img.style.opacity, "0.6");
    assert.equal(img.style.transform, "scaleX(-1)");
    // visible-side clip values are swapped left/right for a flipped image
    assert.equal(img.style.clipPath, "inset(1px 2px 3px 4px)");
    assert.equal(img.style.filter, "grayscale(50%) blur(2px)");
});

// jsdom loads no images: hand the mascot a natural width, then fire load
async function scaledMascot(w, mascot, naturalWidth) {
    const img = w.document.querySelector("#styletower-mascots img");
    Object.defineProperty(img, "naturalWidth", { value: naturalWidth, configurable: true });
    img.dispatchEvent(new w.Event("load"));
    await sleep(10);
    return img;
}
function mascotLoad(mascot, extra) {
    return load({ storage: Object.assign({ "Enable Mascots": true, "Mascots": JSON.stringify([Object.assign({ url: "https://example.invalid/m.png", enabled: true }, mascot)]) }, extra || {}) });
}

// Images the migration loads: the stub reports a natural width per URL
function imageStub(widths) {
    return function (w) {
        w.__imgWidths = widths;
        w.Image = class {
            constructor() { this.naturalWidth = 0; }
            get src() { return this._src; }
            set src(v) {
                this._src = v;
                this.naturalWidth = w.__imgWidths[v] || 0;
                setTimeout(() => { if (this.naturalWidth) { if (this.onload) this.onload(); } else if (this.onerror) this.onerror(); });
            }
        };
    };
}

test("mascots: a capped mascot is a 300px window; an exact size shows as typed and Push In moves the image inside it", async () => {
    const w = await mascotLoad({ width: "425px", hoffset: -100 });
    const box = w.document.getElementById("styletower-mascots");
    const img = box.querySelector("img");
    assert.ok(box.classList.contains("mascots-capped"), "the window");
    assert.equal(img.style.width, "425px");
    assert.equal(img.style.maxWidth, "none", "not scaled down: the window clips the excess");
    assert.equal(img.style.marginRight, "-100px");
    assert.equal(box.style.marginRight, "");
    const w2 = await mascotLoad({ width: "425px", maxwidth: false });
    assert.ok(!w2.document.getElementById("styletower-mascots").classList.contains("mascots-capped"), "Natural Size has no window");
    const w3 = await mascotLoad({});
    const box3 = w3.document.getElementById("styletower-mascots");
    assert.ok(box3.classList.contains("mascots-capped"));
    assert.equal(box3.querySelector("img").style.maxWidth, "", "an auto-sized image is scaled down by the CSS cap");
    const w4 = await mascotLoad({}, { "Mascot Max Width": false });
    assert.ok(!w4.document.getElementById("styletower-mascots").classList.contains("mascots-capped"), "the option off lifts the cap");
    const w5 = await mascotLoad({ side: "left", hoffset: -20 });
    const box5 = w5.document.getElementById("styletower-mascots");
    assert.ok(box5.classList.contains("mascots-left"));
    assert.equal(box5.querySelector("img").style.marginLeft, "-20px", "a left-side mascot mirrors");
});

test("mascots: a Scale from before the scale tool still renders as it did until it is converted", async () => {
    const w = await mascotLoad({ scale: 50 });
    const img = await scaledMascot(w, null, 1000);
    assert.equal(img.style.width, "500px");
    assert.equal(img.style.maxWidth, "none");
    const w2 = await mascotLoad({ scale: 99, scaleBase: "display" });
    const img2 = await scaledMascot(w2, null, 1000);
    assert.equal(img2.style.width, "990px");
    assert.equal(img2.style.maxWidth, "297px");
});

test("mascots: a stored Scale converts once into the Width it produced, keeping the size on screen", async () => {
    const list = [
        { url: "https://example.invalid/big.png", enabled: true, scale: 23 },
        { url: "https://example.invalid/shown.png", enabled: true, scale: 187, scaleBase: "display" },
        { url: "https://example.invalid/free.png", enabled: true, scale: 40, maxwidth: false },
        { url: "https://example.invalid/sized.png", enabled: true, scale: 50, width: "200px" },
        { url: "https://example.invalid/plain.png", enabled: true }
    ];
    const w = await load({
        storage: { "Enable Mascots": true, "Mascots": JSON.stringify(list) },
        setup: imageStub({ "https://example.invalid/big.png": 2434, "https://example.invalid/shown.png": 2434, "https://example.invalid/free.png": 1000 })
    });
    await sleep(40);
    const { $SS } = w.__ST;
    const saved = JSON.parse($SS.Config.get("Mascots"));
    assert.equal(saved[0].width, "560px", "23% of the 2434px image");
    assert.equal(saved[0].scale, undefined);
    assert.equal(saved[1].width, "561px", "187% of the 300px it showed at");
    assert.equal(saved[1].scaleBase, undefined);
    assert.equal(saved[2].width, "400px", "Natural Size: 40% of the image");
    assert.equal(saved[3].width, "200px", "an exact size wins; its Scale is dropped");
    assert.equal(saved[3].scale, undefined);
    assert.equal(saved[4].width, undefined, "unscaled mascots are untouched");
    assert.equal(JSON.parse($SS.conf["Mascots"])[0].width, "560px", "the live config follows");
    assert.equal(saved.some(m => "scale" in m || "scaleBase" in m), false, "no Scale is left anywhere");
});

test("mascot editor: the scale tool resizes Width, Height and Clip from the 100% values, and only the values are saved", async () => {
    const w = await load({ storage: { "Enable Mascots": true, "Mascots": JSON.stringify([{ url: "https://example.invalid/m.png", enabled: true, width: "500px", height: "40vh", clip: [0, 0, 0, 125] }]) } });
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    $SS.options.showMascotEditor(0);
    const q = n => d.querySelector("#add-mascot [name=" + n + "]");
    const click = sel => d.querySelector("#add-mascot " + sel).click();
    assert.equal(q("mScalePct").value, "100");
    assert.equal(d.querySelector("#add-mascot [name=mScale]"), null, "no Scale slider any more");
    click(".mascot-scale-btn[data-step='10']");
    assert.equal(q("mScalePct").value, "110");
    assert.equal(q("mWidth").value, "550px");
    assert.equal(q("mHeight").value, "44vh");
    assert.equal(q("mRClip").value, "138", "clip pixels scale with the box");
    click(".mascot-scale-btn[data-step='-5']");
    assert.equal(q("mScalePct").value, "105");
    assert.equal(q("mWidth").value, "525px", "steps are relative to the 100% values, not compounded");
    assert.equal(q("mRClip").value, "131");
    q("mScalePct").value = "50";
    q("mScalePct").dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(q("mWidth").value, "250px");
    assert.equal(q("mHeight").value, "20vh");
    assert.equal(q("mRClip").value, "63");
    const shown = d.querySelector("#styletower-mascots img");
    assert.equal(shown.style.width, "250px", "the live preview follows");
    assert.equal(shown.style.clipPath, "inset(0px 63px 0px 0px)");
    click(".mascot-scale-reset");
    assert.equal(q("mScalePct").value, "100");
    assert.equal(q("mWidth").value, "500px");
    assert.equal(q("mHeight").value, "40vh");
    assert.equal(q("mRClip").value, "125");
    click(".mascot-scale-btn[data-step='5']");
    assert.equal(q("mWidth").value, "525px");
    click("a[name=mSave]");
    const saved = $SS.options._mascotWork[0];
    assert.equal(saved.width, "525px");
    assert.equal(saved.height, "42vh");
    assert.deepEqual(Array.from(saved.clip), [0, 0, 0, 131]);
    assert.equal("scale" in saved, false, "the percent itself is not saved");
});

test("mascot editor: an auto size scales from the size the mascot shows at, and a typed size becomes the new 100%", async () => {
    const w = await load({ storage: { "Enable Mascots": true, "Mascots": JSON.stringify([{ url: "https://example.invalid/m.png", enabled: true }]) } });
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.mascotShownSize = () => ({ width: 300, height: 191 });
    $SS.options.show();
    $SS.options.showMascotEditor(0);
    const q = n => d.querySelector("#add-mascot [name=" + n + "]");
    const click = sel => d.querySelector("#add-mascot " + sel).click();
    click(".mascot-scale-btn[data-step='-5']");
    assert.equal(q("mScalePct").value, "95");
    assert.equal(q("mWidth").value, "285px", "95% of the 300px it shows at, not of the raw image");
    assert.equal(q("mHeight").value, "auto", "the other side stays auto so the shape is kept");
    click(".mascot-scale-btn[data-step='-10']");
    assert.equal(q("mWidth").value, "255px");
    click(".mascot-scale-reset");
    assert.equal(q("mWidth").value, "auto", "reset brings the original auto back");
    click(".mascot-scale-btn[data-step='10']");
    assert.equal(q("mWidth").value, "330px");
    q("mWidth").value = "400px";
    q("mWidth").dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(q("mScalePct").value, "100", "a typed size is the new 100%");
    click(".mascot-scale-btn[data-step='5']");
    assert.equal(q("mWidth").value, "420px");
    const key = (el, k, shift) => el.dispatchEvent(new w.KeyboardEvent("keydown", { key: k, shiftKey: !!shift, bubbles: true, cancelable: true }));
    key(q("mScalePct"), "ArrowUp");
    assert.equal(q("mScalePct").value, "106", "the arrow keys on the field still step 1");
    key(q("mScalePct"), "ArrowUp", true);
    assert.equal(q("mScalePct").value, "116", "and 10 with Shift");
    assert.equal(q("mWidth").value, "464px");
    click(".mascot-scale-reset");
    assert.equal(q("mWidth").value, "400px", "reset returns to the typed size");
});

test("mascots: an explicit Width or Height is used as typed and skips the cap", async () => {
    const w = await mascotLoad({ width: "500px" });
    const img = w.document.querySelector("#styletower-mascots img");
    assert.equal(img.style.width, "500px");
    assert.equal(img.style.maxWidth, "none", "a typed size is not squeezed by the sidebar cap");
    const w2 = await mascotLoad({ height: "40vh" });
    const img2 = w2.document.querySelector("#styletower-mascots img");
    assert.equal(img2.style.height, "40vh");
    assert.equal(img2.style.maxWidth, "none");
});

test("mascots: a clip stays in pixels of the rendered box", async () => {
    const w = await mascotLoad({ width: "500px", clip: [0, 0, 0, 125] });
    const img = w.document.querySelector("#styletower-mascots img");
    assert.equal(img.style.width, "500px");
    assert.equal(img.style.clipPath, "inset(0px 125px 0px 0px)");
});

test("mascots: without a Scale the CSS cap alone sizes the mascot", async () => {
    const w = await mascotLoad({});
    const img = w.document.querySelector("#styletower-mascots img");
    assert.equal(img.style.width, "");
    assert.equal(img.style.maxWidth, "");
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

test("mascot editor sliders have typed fields that stay in sync", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    $SS.options.showMascotEditor(-1);
    const d = w.document;
    const num = d.querySelector("#add-mascot .mascot-opacity-num[data-for=mOffsetS]");
    assert.ok(num, "typed field on the Raise slider");
    num.value = "150";
    num.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(d.querySelector("#add-mascot input[name=mOffsetS]").value, "150");
    const range = d.querySelector("#add-mascot input[name=mOpacity]");
    range.value = "40";
    range.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(d.querySelector("#add-mascot .mascot-opacity-num[data-for=mOpacity]").value, "40");
});

test("mascot editor: arrow keys step values by 1, Shift by 10, and the preview follows", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    $SS.options.showMascotEditor(-1);
    const d = w.document;
    const key = (el, k, shift) => el.dispatchEvent(new w.KeyboardEvent("keydown", { key: k, shiftKey: !!shift, bubbles: true, cancelable: true }));
    d.querySelector("#add-mascot input[name=mImg]").value = "https://example.invalid/m.png";
    const num = d.querySelector("#add-mascot .mascot-opacity-num[data-for=mOffsetS]");
    key(num, "ArrowUp");
    assert.equal(num.value, "1");
    key(num, "ArrowUp", true);
    assert.equal(num.value, "11");
    key(num, "ArrowDown");
    assert.equal(num.value, "10");
    assert.equal(d.querySelector("#add-mascot input[name=mOffsetS]").value, "10", "the slider follows its typed field");
    const range = d.querySelector("#add-mascot input[name=mOpacity]");
    key(range, "ArrowLeft", true);
    assert.equal(range.value, "90");
    key(range, "ArrowRight");
    assert.equal(range.value, "91");
    assert.equal(d.querySelector("#add-mascot .mascot-opacity-num[data-for=mOpacity]").value, "91", "the typed field follows the slider");
    assert.equal(d.querySelector("#styletower-mascots img").style.opacity, "0.91", "the live preview follows");
    key(range, "ArrowUp", true);
    key(range, "ArrowUp", true);
    assert.equal(range.value, "100", "a slider stops at its end");
    // advanced text fields keep their unit; Left/Right still move the caret there
    const off = d.querySelector("#add-mascot input[name=mOffset]");
    key(off, "ArrowUp");
    assert.equal(off.value, "1px");
    key(off, "ArrowDown", true);
    assert.equal(off.value, "-9px");
    assert.equal(d.querySelector("#add-mascot input[name=mOffsetS]").value, "-9", "the Raise slider follows the offset field");
    key(off, "ArrowLeft");
    assert.equal(off.value, "-9px");
    const width = d.querySelector("#add-mascot input[name=mWidth]");
    key(width, "ArrowUp");
    assert.equal(width.value, "auto", "non-numeric text is left alone");
    width.value = "40vh";
    key(width, "ArrowUp", true);
    assert.equal(width.value, "50vh");
    const clip = d.querySelector("#add-mascot input[name=mRClip]");
    key(clip, "ArrowUp", true);
    assert.equal(clip.value, "10");
    const name = d.querySelector("#add-mascot input[name=mName]");
    name.value = "123";
    key(name, "ArrowUp");
    assert.equal(name.value, "123", "the name is not a value");
});

async function dockedQR(w) {
    const d = w.document;
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    d.body.appendChild(qr);
    await sleep(60);
    return qr;
}

test("autohide quick reply: stays open while the file picker holds the window's focus", async () => {
    const w = await load({ storage: { "Autohide Style": 1 } });
    const qr = await dockedQR(w);
    const file = qr.querySelector("input[type=file]");
    file.focus();
    assert.ok(qr.classList.contains("focus"));
    // The OS file dialog takes the window's focus: focusout fires with no
    // related target while the input stays the document's active element
    file.dispatchEvent(new w.FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
    await sleep(20);
    assert.equal(w.document.activeElement, file);
    assert.ok(qr.classList.contains("focus"), "still shown");
});

test("autohide quick reply: hides when focus really leaves the form", async () => {
    const w = await load({ storage: { "Autohide Style": 1 } });
    const qr = await dockedQR(w);
    const body = qr.querySelector("textarea[name=body]");
    body.focus();
    const subject = qr.querySelector("input[name=subject]");
    subject.focus();
    await sleep(20);
    assert.ok(qr.classList.contains("focus"), "moving between its own fields keeps it shown");
    subject.blur();
    await sleep(20);
    assert.ok(!qr.classList.contains("focus"), "hidden after a real blur");
    body.focus();
    w.document.querySelector("form[name=post]:not(#quick-reply) input[name=name]").focus();
    await sleep(20);
    assert.ok(!qr.classList.contains("focus"), "hidden when another form takes focus");
});
