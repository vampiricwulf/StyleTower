"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { load, sleep, until } = require("./harness");

function pickFile(w, input, name, text) {
    const file = new w.File([text], name, { type: "application/json" });
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    input.dispatchEvent(new w.Event("change", { bubbles: true }));
}

test("settings import through the file input applies the file and closes the panel", async () => {
    const w = await load({ setup(w) { let n = 0; w.confirm = () => (++n === 1); } }); // overwrite? yes; refresh? no
    const { $SS } = w.__ST;
    $SS.options.show();
    const input = w.document.querySelector("#import-settings .import-input");
    pickFile(w, input, "StyleTower settings.json", JSON.stringify({ "Rounded Corners": false, "Font Size": 15 }));
    await until(() => $SS.Config.get("Font Size") === 15, 2000);
    assert.equal($SS.Config.get("Rounded Corners"), false);
    assert.equal(w.document.getElementById("overlay"), null, "panel closed so a later Save cannot overwrite the import");
});

test("settings import rejects a non-JSON file name", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    pickFile(w, w.document.querySelector("#import-settings .import-input"), "settings.txt", "{}");
    await sleep(30);
    assert.deepEqual(w.__alerts, ["Only JSON files are accepted!"]);
});

test("theme file import appends, selects and applies the theme", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    const input = w.document.querySelector("#themes-section #import-link .import-input");
    pickFile(w, input, "Mine.json", JSON.stringify({ name: "Mine", mainColor: "#123456", textColor: "ffffff", bgColor: "000000", default: true }));
    await until(() => $SS.theme.name === "Mine", 2000);
    const stored = $SS.Config.get("Themes");
    assert.equal(stored.length, 1);
    assert.equal(stored[0].mainColor, "123456");
    assert.equal(stored[0]["default"], undefined, "foreign default flag dropped");
    assert.equal($SS.Config.get("Selected Theme"), $SS.Themes.defaults.length);
    assert.ok(w.document.querySelector("#theme" + $SS.Themes.defaults.length + ".selected"));
});

test("theme file import rejects files without the base colors", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    pickFile(w, w.document.querySelector("#themes-section #import-link .import-input"), "x.json", JSON.stringify({ name: "x" }));
    await sleep(60);
    assert.deepEqual(w.__alerts, ["Invalid theme file!"]);
    assert.equal(($SS.Config.get("Themes") || []).length, 0);
});

test("Export turns into a download link carrying the settings JSON", async () => {
    const w = await load({ storage: { "Font Size": 15 } });
    const { $SS } = w.__ST;
    $SS.options.show();
    w.document.querySelector("#oneechan-options a[name=Export]").click();
    const link = w.document.querySelector("#oneechan-options a[download]");
    assert.ok(link, "download link");
    assert.match(link.getAttribute("download"), /^StyleTower v.* Settings\.json$/);
    const json = JSON.parse(Buffer.from(link.href.split(",")[1], "base64").toString("utf8"));
    assert.equal(json["Font Size"], 15);
    assert.equal(json["Rounded Corners"], true);
});

test("first run after an update shows the changelog notice and stores the version", async () => {
    const w = await load({ storage: { "VERSION": "0.0.1", "Total Themes": 26, "Selected Theme": 27 } });
    const { $SS } = w.__ST;
    await sleep(60);
    const notes = [...w.document.querySelectorAll(".styletower-notification-text")].map(n => n.textContent);
    assert.ok(notes.some(t => /updated to version/.test(t)), "got: " + JSON.stringify(notes));
    assert.notEqual($SS.Config.get("VERSION"), "0.0.1");
    assert.equal($SS.Config.get("Total Themes"), $SS.Themes.defaults.length);
    // The default list grew by one since that save: the custom-theme index shifts with it
    assert.equal($SS.Config.get("Selected Theme"), 27 + ($SS.Themes.defaults.length - 26));
});

test("system theming follows the color scheme and reacts to a change", async () => {
    const w = await load({ storage: { "System Theming": true, "Dark Theme": 2, "Light Theme": 3 } });
    const { $SS } = w.__ST;
    assert.equal($SS.theme.index, 3, "light scheme → Light Theme");
    w.__mq.matches = true;
    w.__mq.listeners.forEach(fn => fn({ matches: true }));
    assert.equal($SS.theme.index, 2, "dark scheme → Dark Theme");
});

test("TS posting controls are copied into a quick reply built before TS patched the form", async () => {
    const w = await load({ site: { "Thread Settings": "{}" } });
    const d = w.document;
    // TS adds a randomize-filename checkbox and a filename row to the main form
    const spoilerTd = d.querySelector("form[name=post] #upload_settings td");
    const lbl = d.createElement("label");
    lbl.innerHTML = '<input type="checkbox" name="randfn" checked> Randomize Filename';
    spoilerTd.appendChild(lbl);
    const row = d.createElement("tr");
    row.id = "upload_filename";
    row.innerHTML = '<th>Filename</th><td><div class="upload-filename-wrapper"><input type="text" name="filename" size="30" value="cool"></div></td>';
    d.querySelector("form[name=post] #upload_settings").after(row);
    // An emote script pre-built the QR from a pristine clone (no TS controls)
    const qr = d.querySelector("form[name=post]").cloneNode(true);
    qr.id = "quick-reply";
    qr.querySelector("input[name=randfn]").closest("label").remove();
    qr.querySelector("#upload_filename").remove();
    d.body.appendChild(qr);
    await sleep(80);
    const rand = qr.querySelector("input[name=randfn]");
    assert.ok(rand, "randfn checkbox copied");
    assert.equal(rand.checked, true);
    const fn = qr.querySelector("input[name=filename]");
    assert.ok(fn, "filename input copied");
    assert.equal(fn.value, "cool");
    assert.equal(fn.getAttribute("placeholder"), "Filename");
});

test("Catalog Links rewrites board links in the board list", async () => {
    const w = await load({ storage: { "Catalog Links": true } });
    const links = [...w.document.querySelectorAll(".boardlist a")].map(a => a.getAttribute("href"));
    assert.ok(links.includes("/hlgg/catalog.html"), "got: " + links.join(" "));
    assert.ok(!links.includes("/hlgg/index.html"));
});

test("opening the settings while they are open closes them", async () => {
    const w = await load();
    const { $SS } = w.__ST;
    $SS.options.show();
    assert.ok(w.document.getElementById("overlay"));
    $SS.options.show();
    assert.equal(w.document.getElementById("overlay"), null);
});
