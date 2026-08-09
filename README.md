![StyleTower](https://github.com/user-attachments/assets/ddbc2791-7915-4226-ba33-38c13d8be1d9) StyleTower
====

StyleTower is a userscript allowing you to customize [holotower.org](https://holotower.org/hlgg/index.html) with various themes and features.\
Works with **native holotower** and alongside **Holotower TS**.

This is a port of [StyleChan](https://github.com/3nly/StyleChan) (itself a fork of [OneeChan](https://github.com/seaweedchan/OneeChan) by seaweedchan) from 4chan to holotower.org.

StyleTower is a *styler*: it themes the page and the features the site and Holotower TS provide, and deliberately avoids duplicating their behavior.

## [Click here to Install](https://github.com/vampiricwulf/StyleTower/releases/latest/download/StyleTower.user.js)

 
 **Minified Version** → [StyleTower.min.user.js](https://github.com/vampiricwulf/StyleTower/releases/latest/download/StyleTower.min.user.js) 

- Firefox: requires [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)
- Chrome/Edge: requires [Violentmonkey](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag/)

Open the settings with the **[StyleTower]** link next to the site's **[Options]** in the board list, or **CTRL + F1**.

## Highlights

- All StyleChan/OneeChan themes, plus a full in-browser theme editor with live preview, import/export, and per-SFW/NSFW or light/dark (system) theme selection
- Holotower-native styling: fixed header clearance, post menu, posting form, "Posting mode" banner, file-selector dropzone, catalog, thread watcher, scroll arrows and more
- Layout options: reply fit width, margins, borders, rounded corners, post decoration and highlight styles, sidebar (with mini and Style-Script-like variants), quick reply autohide styles
- Quick reply refinements: submit button on its own bottom row, themed posting controls, optional comment draft memory, auto image conversion, auto-watch on reply
- Extras: Animated GIF Thumbnails, mascots, custom Quick Reply button image, relative post dates, themed SVG icons, styled scrollbars, toast notifications

## Built-in integrations

The following standalone Holotower userscripts are folded into StyleTower and can be toggled under **Options → Misc → Integrations**. If you keep running a standalone copy, disable the matching option here first:

- [Holotower Auto Scroll](https://greasyfork.org/en/scripts/540450-holotower-auto-scroll)
- [Holotower ImgOps Links](https://greasyfork.org/en/scripts/552932-holotower-imgops-links)
- [Holotower X/BSKY Sauce](https://greasyfork.org/en/scripts/554505-holotower-x-bsky-sauce)
- [Holotower Catalog Highlights and Pin](https://greasyfork.org/en/scripts/543156-holotower-catalog-highlights-and-pin)

[Holotower TS](https://greasyfork.org/en/scripts/560097-holotower-ts) is detected and themed automatically:

- Its fixed/auto-hide header state is mirrored so the page clears the bar correctly
- Its notifications, inline quotes, archive posts and hover colors follow the active theme through TS's own CSS hooks
- Its (You)/quoting-you highlight marks are colored by the theme (respecting TS's border-style setting)
- Its posting controls are restored into the quick reply when another script pre-builds it

## Theming

Get [more themes](https://github.com/3nly/StyleChan/wiki/Custom-Themes#custom-themes) — StyleChan/OneeChan themes are compatible.

## Troubleshooting

This port was done nearly entirely by Claude Fable 5, so there are bound to be many issues — please report everything you find.

- If you have problems, try first resetting your StyleTower settings (**CTRL + F1 → Reset**) and restarting your browser.
  
- Check if it's a holotower issue - StyleTower primarily deals with stylesheets.
  
- Report issues on the [Issues](https://github.com/vampiricwulf/StyleTower/issues) page.

## Development & Contribution

- [Changelog](https://github.com/vampiricwulf/StyleTower/blob/main/CHANGELOG.md)

- [Contributing](https://github.com/vampiricwulf/StyleTower/blob/main/CONTRIBUTING.md#development--contribution)

- [Reporting Bugs](https://github.com/vampiricwulf/StyleTower/blob/main/CONTRIBUTING.md#reporting-bugs-and-suggestions)
