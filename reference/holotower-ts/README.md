# Holotower TS reference copy

StyleTower styles the DOM that Holotower TS (the site's 4chan-X analog) builds,
so each TS release gets checked against StyleTower's hooks. This folder holds
the exact TS build that check was last done against, so the next check can be a
diff instead of a full read.

| | |
|---|---|
| Script | Holotower TS, Greasy Fork script id 560097 (MIT, "Anonymous") |
| Script page | https://greasyfork.org/en/scripts/560097-holotower-ts |
| Reviewed version | **2.8** |
| Greasy Fork version id | **1980255** |
| Published | 2026-10-29 |
| Reviewed | 2026-10-29 (StyleTower v1.0.28) |
| Previous version | 2.7.2, version id 1950168 (2026-10-03) |

Files:

- `Holotower TS.user.js`: byte-exact copy of the reviewed build.
- `last-review.diff`: unified diff previous -> reviewed (2.7.2 -> 2.8), as read.

## Checking the next release

1. Version list (version ids are the `?version=` numbers):
   `https://greasyfork.org/en/scripts/560097-holotower-ts/versions`
2. Download an exact version with a browser User-Agent (Greasy Fork rejects
   bare curl):
   `https://update.greasyfork.org/scripts/560097/<versionId>/Holotower%20TS.user.js`
   The current build is also at
   `https://update.greasyfork.org/scripts/560097/Holotower%20TS.user.js`.
3. `diff -u "reference/holotower-ts/Holotower TS.user.js" <new>.user.js`
4. Read every removed line, then the changed part of the injected stylesheet
   (the `let css = \`` ... `style.textContent = css;` block inside `addStyle`).
   Stylesheet and selector changes never make the changelog.
5. Grep `src/` for every class, id, localStorage key and CSS variable the diff
   touches. The known touchpoints are listed in the project memory note
   `holotower-ts`.
6. Replace the copy here, update this table, and update the memory note.

## Touchpoints checked for 2.8

- Header: `.boardlist.fixed`/`.autohide`, `--header-height`, `.hb-toggle`
  placement (StyleTower link sits after the caret), `#thread_stats`.
- Posting: `#upload_settings td > .url-upload / .ts-oekaki-toggle` clones
  into the quick reply (`syncTSPostingControls`), `input[name=randfn]`,
  `#upload_filename`, `.upload-filename-wrapper`.
- Posts: `.you` / `.quoting-you` / `span.own_post` and the `own_posts`
  localStorage key, `a.reply.hide-button/.show-button`, `.threadingContainer`,
  `.hidden-post`, `.iq-hidden-post`, `.inline-cloned-post`, `.inline-active`,
  `.post-hover`, `.clone-mentioned`, post menu (`.post-menu li`).
- Chrome: `#notification_container`, `#alert_div`, `.ts-oekaki-panel`,
  Tower Tunes `.side-panel`/`.music-*` (styled on the home page), TS CSS vars
  fed from the theme (`--ts-hover-color`, `--subtle-border-color`,
  `--inline-background-color`, `--reply-background-color`, `--link-hover-color`,
  `--text-color-muted`, `--error-text-color`, `--highlight-color`).
- Keybinds read from `Thread Settings` (`kbQuickReply`).
