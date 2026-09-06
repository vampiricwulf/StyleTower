"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep } = require("./harness");

const CUSTOM = JSON.stringify({ scale: 150, x: 40, y: 60, gap: 8, reverse: true });

function mouse(w, target, type, x, y) {
    target.dispatchEvent(new w.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 }));
}

test("the Sidebar section offers a Navigation Buttons row with a Set Position button", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    const d = w.document;
    const btn = d.querySelector("#main-section a[name=navPosition]");
    assert.ok(btn, "Set Position button");
    assert.equal(btn.textContent, "Set Position");
    const row = btn.closest(".option");
    assert.match(row.querySelector(".option-title").textContent, /Navigation Buttons/);
    assert.equal(row.getAttribute("data-tower-status"), "added");
    assert.equal(row.previousElementSibling.querySelector("input[name='Minimal Sidebar']") != null, true, "sits right after Minimal Sidebar");
    assert.match(row.querySelector(".st-nav-status").textContent, /default/i);
});

test("a stored position applies to the buttons at load", async () => {
    const w = await load({ storage: { "Nav Buttons": CUSTOM } });
    const box = w.document.getElementById("scroll-buttons");
    assert.ok(box.classList.contains("st-nav-custom"));
    assert.equal(box.style.right, "40px");
    assert.equal(box.style.bottom, "60px");
    assert.equal(box.style.getPropertyValue("--st-nav-gap"), "8px");
    assert.equal(box.style.transform, "scale(1.5)");
    assert.ok(box.classList.contains("st-nav-reversed"), "reversed through CSS order, not the flex axis");
    assert.equal(box.style.flexDirection, "", "the site's row stays a row");
    assert.equal(box.style.display, "flex", "the site's display value is left alone");
});

test("buttons the site adds after load are positioned too", async () => {
    const w = await load({
        storage: { "Nav Buttons": CUSTOM },
        setup(w) { w.document.getElementById("scroll-buttons").remove(); }
    });
    const d = w.document;
    const box = d.createElement("div");
    box.id = "scroll-buttons";
    box.style.cssText = "position: fixed; bottom: 35px; right: 20px; display: flex;";
    box.innerHTML = '<a id="nav-to-top" href="#top"><img alt="Go to top"></a><a id="nav-to-bottom" href="#bottom"><img alt="Go to bottom"></a>';
    d.body.appendChild(box);
    await sleep(60);
    assert.equal(box.style.right, "40px");
    assert.equal(box.style.bottom, "60px");
});

test("without a stored position the site's own placement stays", async () => {
    const w = await load();
    const box = w.document.getElementById("scroll-buttons");
    assert.ok(!box.classList.contains("st-nav-custom"));
    assert.equal(box.style.right, "20px");
    assert.equal(box.style.bottom, "35px");
    assert.equal(box.style.transform, "");
});

test("the editor previews live, saves on Save, and shows the buttons above the overlay while editing", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    d.querySelector("#main-section a[name=navPosition]").click();
    const ed = d.getElementById("st-nav-editor");
    assert.ok(ed, "editor open");
    assert.ok(d.getElementById("overlay").classList.contains("previewing"), "options panel hidden while previewing");
    const box = d.getElementById("scroll-buttons");
    assert.ok(box.classList.contains("st-nav-editing"), "buttons marked as being edited");
    ["nScale", "nX", "nY", "nGap"].forEach(n => assert.equal(ed.querySelector("input[name=" + n + "]").type, "range", n));
    assert.equal(ed.querySelector("input[name=nReverse]").type, "checkbox");
    // Site defaults are the starting values
    assert.equal(ed.querySelector("input[name=nX]").value, "20");
    assert.equal(ed.querySelector("input[name=nY]").value, "35");
    assert.equal(ed.querySelector("input[name=nScale]").value, "100");
    const x = ed.querySelector("input[name=nX]");
    x.value = "120";
    x.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(box.style.right, "120px", "live preview");
    assert.equal(x.parentNode.querySelector(".mascot-opacity-val").textContent, "120px", "readout follows");
    const rev = ed.querySelector("input[name=nReverse]");
    rev.checked = true;
    rev.dispatchEvent(new w.Event("change", { bubbles: true }));
    assert.ok(box.classList.contains("st-nav-reversed"));
    rev.checked = false;
    rev.dispatchEvent(new w.Event("change", { bubbles: true }));
    assert.ok(!box.classList.contains("st-nav-reversed"));
    rev.checked = true;
    rev.dispatchEvent(new w.Event("change", { bubbles: true }));
    ed.querySelector("a[name=nSave]").click();
    assert.equal(d.getElementById("st-nav-editor"), null, "editor closed");
    assert.ok(!box.classList.contains("st-nav-editing"));
    const saved = JSON.parse($SS.Config.get("Nav Buttons"));
    assert.equal(saved.x, 120);
    assert.equal(saved.reverse, true);
    assert.equal(box.style.right, "120px", "still applied after save");
    assert.match(d.querySelector("#main-section .st-nav-status").textContent, /custom/i, "row status updated");
    assert.ok(!d.getElementById("overlay").classList.contains("previewing"), "options panel back");
});

test("Cancel restores the stored placement; Use Site Default clears it", async () => {
    const w = await load({ storage: { "Nav Buttons": CUSTOM } });
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    d.querySelector("#main-section a[name=navPosition]").click();
    const ed = d.getElementById("st-nav-editor");
    assert.equal(ed.querySelector("input[name=nX]").value, "40", "starts from the stored value");
    const box = d.getElementById("scroll-buttons");
    const x = ed.querySelector("input[name=nX]");
    x.value = "300";
    x.dispatchEvent(new w.Event("input", { bubbles: true }));
    assert.equal(box.style.right, "300px");
    ed.querySelector("a[name=nCancel]").click();
    assert.equal(box.style.right, "40px", "back to the stored value");
    assert.equal($SS.Config.get("Nav Buttons"), CUSTOM, "nothing written");

    d.querySelector("#main-section a[name=navPosition]").click();
    d.querySelector("#st-nav-editor a[name=nDefault]").click();
    assert.equal($SS.Config.get("Nav Buttons"), "");
    assert.ok(!box.classList.contains("st-nav-custom"));
    assert.equal(box.style.right, "20px", "site default restored");
    assert.equal(box.style.bottom, "35px");
    assert.equal(box.style.transform, "");
    assert.match(d.querySelector("#main-section .st-nav-status").textContent, /default/i);
});

test("dragging the buttons while the editor is open moves them and updates the sliders", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    d.querySelector("#main-section a[name=navPosition]").click();
    const ed = d.getElementById("st-nav-editor");
    const box = d.getElementById("scroll-buttons");
    mouse(w, box.querySelector("#nav-to-top"), "mousedown", 900, 700);
    mouse(w, d, "mousemove", 800, 600);
    assert.equal(box.style.right, "120px", "moved left by 100 → 20 + 100 from the right");
    assert.equal(box.style.bottom, "135px", "moved up by 100 → 35 + 100 from the bottom");
    assert.equal(ed.querySelector("input[name=nX]").value, "120");
    assert.equal(ed.querySelector("input[name=nY]").value, "135");
    mouse(w, d, "mouseup", 800, 600);
    const click = new w.MouseEvent("click", { bubbles: true, cancelable: true });
    box.querySelector("#nav-to-top").dispatchEvent(click);
    assert.equal(click.defaultPrevented, true, "the click that ends a drag does not scroll");
    // dragging past the edges clamps at the viewport
    mouse(w, box, "mousedown", 500, 500);
    mouse(w, d, "mousemove", 5000, 5000);
    mouse(w, d, "mouseup", 5000, 5000);
    assert.equal(box.style.right, "0px");
    assert.equal(box.style.bottom, "0px");
    ed.querySelector("a[name=nSave]").click();
    assert.equal(JSON.parse($SS.Config.get("Nav Buttons")).x, 0);
});

test("Escape closes the position editor first", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    const d = w.document;
    $SS.options.show();
    d.querySelector("#main-section a[name=navPosition]").click();
    d.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert.equal(d.getElementById("st-nav-editor"), null);
    assert.ok(d.getElementById("overlay"), "panel still open");
});

test("a stored position survives an options Save and is exported", async () => {
    const w = await load({ storage: { "Nav Buttons": CUSTOM } });
    const { $SS } = w.__ST;
    $SS.options.show();
    $SS.options.save();
    assert.equal($SS.Config.get("Nav Buttons"), CUSTOM);
    assert.equal($SS.exportOptions["Nav Buttons"], CUSTOM);
});

test("the navigation arrows use a tightly cropped, centered icon so neither order has hidden padding", async () => {
    const w = await load();
    const vars = w.document.getElementById("sc-theme-vars").textContent;
    assert.match(vars, /--sc-icon-navArrow:url\("data:image\/svg\+xml,<svg viewBox='6\.5 7\.5 19 17'/);
    const fs = require("fs"), path = require("path");
    const icons = fs.readFileSync(path.join(require("./harness").ROOT, "src", "css", "Icons.css"), "utf8");
    const scroll = icons.slice(icons.indexOf("#scroll-buttons a::before"));
    assert.match(scroll, /background-image:\s*var\(--sc-icon-navArrow\)/);
    assert.doesNotMatch(scroll.split("}")[0], /downArrow/);
    assert.match(icons, /a\.inline-active[\s\S]*?var\(--sc-icon-downArrow\)/, "the backlink arrow keeps its icon");
});
