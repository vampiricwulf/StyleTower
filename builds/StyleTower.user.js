// ==UserScript==
// @name         StyleTower
// @version      1.0.13
// @namespace    StyleTower
// @description  Customizable themes for holotower.org.
// @license      GPL-3.0; https://github.com/vampiricwulf/StyleTower/blob/main/LICENSE
// @match        https://holotower.org/*
// @match        https://boards.holotower.org/*
// @exclude      https://holotower.org/mod.php*
// @exclude      https://boards.holotower.org/mod.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.openInTab
// @grant        GM.xmlHttpRequest
// @run-at       document-body
// @updateURL    https://github.com/vampiricwulf/StyleTower/releases/latest/download/StyleTower.meta.js
// @downloadURL  https://github.com/vampiricwulf/StyleTower/releases/latest/download/StyleTower.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAA5FBMVEUAAADqC43tAIyAxjjtAIwBruzrCY0ArvBPtkn37wJQtkkAru9QtkkDrukBru4CrupPtkj/8gD/8gBQtklQtkn98QHsBIwCr+sBru0Crur+8gBQtkntAYz98gAAru7tAYz98QHsAoxQtknsAoxPtknrBoxPtkj78QFQtknsBoz37wIAru8Aru/+8gD88QHsA4wBru3rBoz68QH58AL58AL+8gDsAozsAozsAoz88QEBru5QtklQtklQtkn88QHrBoz58ALtAYz+8gABru9Qtkn68QH98QH78AIArvD/8gBQtkntAIxfAaaZAAAASHRSTlMACPgK8k0R8CkQ7N7NDJ4lEPfr3Z+bfTsxFPLBtrOyrKmNiWRZQDUiHBsX6M7Ad25pU0Q5HNDMwp6GhXJmRzEvKN7cwLVoXE9ZFwasAAACE0lEQVRIx8WS2ZKaQBSGG1RAQFHAuI86uDtxXzPj7AvI+79PeqHTQlNduUhlvhu6rP+T858GfAOZsaaV0AE+x38R7787utN8KA1dR9cddwjElNwLwdTJ0zmLhdtLElMT5TXnwnEvEvoXnveMQHhIEZolgXDWecEVLsnkhT6XEs9kjsX35iby+jk9qEwUCR/GzdSl1i2rcB1fHF72LU/BVxGrcYt3WisahvGWA5RJSw4h8mEAIEPzKo9XujR8hLqk/98JI148iRosX/il+gQ1escqG1KyPyKDzVMv+n+4IT2OIUPGhoaa6/fJvD+zUF5qhWmG3gfJvK9WqcAbLs4XWJ4JoBemGBmA+/oxZjUsDLJxI7sAESTPlZY6YcJYkfyS7jOxVuDJqULhBqX4CkA5JEosJICp3XEjpXWQe7Q0Z6ikdC+RR9/gtDJHStWIG7kU4Yjz3aB8ysNDzkgRFtedOxP4y6gdBEG5QgxeeGIdZJL/GWA4Y1ZL3IN8RPlnmCd0t6gHa14EhKc9/bgVlse0kWHR+3izADVaWRjfryQ2D30Hmqq+vFPhPEWYpygDzxso6JTv0izrAZVqLofjPKcgTnkOhKztIIG9FuUzbCBWPC8QRq+8YD8LhEebFxqbfylMd7zwOgICTrwg3uu0TfffiJ7w5oRsKzaK7T7Xbag0dh8wLybz+Dn/WE8ByG++vjZb8P/5DaGCFxaoVX+0AAAAAElFTkSuQmCC
// ==/UserScript==
(function () {
    var defaultConfig = {
        ":: Main Rice": ["header", ""],
        "Left Margin": [
            65, "Change the size of the left margin.", [{
                name: "Large",
                value: 65
            }, {
                name: "Medium",
                value: 25
            }, {
                name: "Small",
                value: 5
            }, {
                name: "None",
                value: 0
            }, {
                name: "Custom",
                value: 999
            }], true
        ],
        "Custom Left Margin": [
            0, "Left margin custom width (pixels).", "Left Margin", 999, true
        ],
        "Right Margin": [
            65, "Change the size of the right margin.", [{
                name: "Large",
                value: 65
            }, {
                name: "Medium",
                value: 25
            }, {
                name: "Small",
                value: 5
            }, {
                name: "None",
                value: 0
            }, {
                name: "Custom",
                value: 999
            }], true
        ],
        "Custom Right Margin": [
            0, "Right margin custom width (pixels).", "Right Margin", 999, true
        ],
        "Rounded Corners": [true, "Styles replies, menus and Quick Reply to have subtly rounded corners."],
        "Invert Spoiler": [false, "Inverts colors for text spoilers."],
        "Underline All Links": [false, "Underlines all links in the page."],
        "Show Banner": [false, "Toggle visibility of the board banner image.", null, true],
        "Reduce Banner Opacity": [false, "Reduce opacity of the banner for easier viewing.", "Show Banner", true, true],
        "Show Board Name": [true, "Toggle visibility of the board name."],
        "Show Navigation Links": [true, "Toggle visibility of the navigation links at the top and bottom of the threads.", null, true],
        "Show Top Links": [true, "Toggle visibility of the top navigation links.", "Show Navigation Links", true, true],
        "Show Bottom Links": [true, "Toggle visibility of the bottom navigation links.", "Show Navigation Links", true, true],
        ":: Sidebar": ["header", ""],
        "Sidebar Position": [
            3, "Change the position of the sidebar or disable it. If this option is enabled the QR will be locked to the Sidebar.", [{
                name: "Right",
                value: 1
            }, {
                name: "Left",
                value: 2
            }, {
                name: "Disabled",
                value: 3
            }], true
        ],
        "SS-like Sidebar": [false, "Darkens the sidebar and adds a border like 4chan Style Script."],
        "Minimal Sidebar": [false, "Shrinks the sidebar and moves the banner."],
        ":: Quick Reply": ["header", ""],
        "Autohide Style": [
            0, "Changes how the quick reply is hidden.", [{
                name: "Disabled",
                value: 0
            }, {
                name: "Collapse",
                value: 1
            }, {
                name: "Vertical Tabbed",
                value: 2
            }, {
                name: "Fade",
                value: 3
            }]
        ],
        "Transparent QR": [false, "Reduces opacity of the QR box."],
        "Remove Background": [false, "Removes the QR background."],
        "Remove Controls": [false, "Removes the QR controls and checkbox."],
        "Animated Transition": [false, "Enables a transition animation for the QR."],
        "Expanding Form Inputs": [true, "Makes certain form elements expand on focus."],
        "Remember Comment Draft": [false, "Will save and restore unsubmitted QR comments (5 second delay). Drafts expire after 24h."],
        "Auto-Convert Images": [false, "Auto-convert WebP images to JPEG, and convert any image exceeding the board's file size or dimensions limit to JPEG."],
        ":: Replies": ["header", ""],
        "Fit Width": [true, "Replies stretch to the width of the page.", null, true],
        "Fit Post Menu": [false, "Sets the post menu to the right.", "Fit Width", true, true],
        "Fit Expanded Images": [false, "Expanded images will better fit to the viewport."],
        "Show Reply Header": [true, "Shows reply header background and line border."],
        "Show File Info": [true, "Hides filename, dimensions and size info."],
        "Underline QuoteLinks": [false, "Underlines quotelinks only."],
        "Indent OP": [true, "Indents the OP instead of touching the screen."],
        "Allow Wrapping Around OP": [false, "Allow for replies to wrap around OP instead of being forced onto their own line."],
        "OP Background": [true, "Give OP a background similar to a reply."],
        "Recolor Even Replies": [false, "Makes every other post a darker color. If Quote Threading is enabled darkens every root reply."],
        "Reduce Thumbnail Opacity": [false, "Reduces opacity of thumbnails."],
        "Replace Thumbnails": [false, "Replace thumbnails with the full file. Pick formats below. Uses more bandwidth.", null, true],
        "Replace GIF": [true, "Animate GIF thumbnails.", "Replace Thumbnails", true, true],
        "Replace JPG": [true, "Sharp full-resolution JPG thumbnails.", "Replace Thumbnails", true, true],
        "Replace PNG": [true, "Sharp full-resolution PNG thumbnails.", "Replace Thumbnails", true, true],
        "Replace WEBP": [true, "Sharp full-resolution WEBP thumbnails (animated WEBPs animate).", "Replace Thumbnails", true, true],
        "Replace WEBM/MP4": [false, "Muted looping video thumbnails for WEBM and MP4 files (sound only plays in the expanded player). Heaviest on bandwidth.", "Replace Thumbnails", true, true],
        "Backlink Icons": [false, "Use icons for backlinks instead of text."],
        "Backlink Shadow": [false, "Add a shadow to the backlink text."],
        "Borders": [
            2, "Changes which sides of replies have borders.", [{
                name: "Normal (site default)",
                value: 1
            }, {
                name: "On all sides",
                value: 2
            }, {
                name: "None",
                value: 3
            }]
        ],
        "Margin Between Replies": ['', "Change size of spacing in between replies.", [{
            name: "Very Large",
            value: 15
        }, {
            name: "Large",
            value: 8
        }, {
            name: "Normal (site default)",
            value: ''
        }, {
            name: "Minimal",
            value: -2
        }, {
            name: "None",
            value: -4
        }, {
            name: "Overlapping Borders",
            value: -5
        }]],
        "Post Message Margin": [
            2, "Change size of margin around post message.", [{
                name: "Small",
                value: 1
            }, {
                name: "Normal",
                value: 2
            }, {
                name: "Large",
                value: 3
            }]
        ],
        ":: Catalog": ["header", ""],
        "Justified Text": [false, "Justifies the teaser text of every thread to be more uniform."],
        "Show Background": [true, "Threads receive a matching background."],
        "Unified Thumbnail Size": [false, "Makes all thumbnails the same size regardless of aspect ratio."],
        ":: Post Decoration": ["header", ""],
        "Decoration Style": [
            0, "Changes the decoration of all posts.", [{
                name: "None",
                value: 0
            }, {
                name: "Border",
                value: 1
            }, {
                name: "Outline",
                value: 2
            }, {
                name: "Separator",
                value: 3
            }]
        ],
        "Decoration Width": [
            3, "Changes decoration width of posts including (You)s.", [{
                name: "Large",
                value: 6
            }, {
                name: "Medium",
                value: 3
            }, {
                name: "Small",
                value: 1
            }, {
                name: "Custom",
                value: 999
            }], true
        ],
        "Custom Decoration Width": [
            0, "Enter a custom width for the decoration (pixels).", "Decoration Width", 999, true
        ],
        "Highlight Style": [
            "solid", "Changes style of post highlight.", [{
                name: "Dashed",
                value: "dashed"
            }, {
                name: "Dotted",
                value: "dotted"
            }, {
                name: "Double",
                value: "double"
            }, {
                name: "Inset",
                value: "inset"
            }, {
                name: "Solid",
                value: "solid"
            }]
        ],
        "Opacity": [100, "Adjusts the opacity of post highlighting."],
        ":: Fonts": ["header", ""],
        "Font Family": [
            "sans-serif", "Set the default font family.", [{
                name: "Default (sans-serif)",
                value: "sans-serif"
            }, {
                name: "Monospace",
                value: "monospace"
            }, {
                name: "Serif",
                value: "serif"
            }, {
                name: "Cursive",
                value: "cursive"
            }]
        ],
        "Custom Font": ["", "Enter a custom font name. Please make sure the font name is exact. Overrides the Font Family option if set. "],
        "Font Size": [13, "Set the font size of text (in pixels). Default: 13px. Menu elements have a 18px (max) and 9px (min) limit to avoid breaking their layouts."],
        "UI Font Size": [11, "Set the font size of certain QR and button elements (in pixels). Default: 11px."],
        "Backlink Font Size": [10, "Set the font size of backlinks (in pixels). Default: 10px."],
        "Bitmap Font": [false, "Check this if you are using a bitmap font."],
        "Misc": [],
        ":: Notifications": ["header", ""],
        "Toast Notifications": [true, "Show toast notifications for events.", null, true],
        "Style Holotower TS Notifications": [true, "Show Holotower TS notifications in the same style as StyleTower's toasts.", "Toast Notifications", true, true],
        "Center Notifications": [false, "Center notifications at the top below the header bar.", "Toast Notifications", true, true],
        "Full Border": [false, "Use a full border to make notifications more visible. Border style follows the Highlight Style and Width options.", "Toast Notifications", true, true],
        ":: Theming": ["header", ""],
        "System Theming": [false, "Use system color scheme detection to automatically select themes. Overrides NSFW/SFW theme selection.", null, true],
        "Dark Theme": [0, "Theme to use when system is in dark mode.", "System Theming", true, true],
        "Light Theme": [0, "Theme to use when system is in light mode.", "System Theming", true, true],
        "Use StyleTower Icons": [true, "Replace site icons with themed SVG icons. Disable to use the vanilla icons.", null, true],
        "Style Scrollbars": [false, "Customize the look of scrollbars to match the theme.", null, true],
        "Thin Scrollbars": [false, "Use thinner scrollbars.", "Style Scrollbars", true, true],
        ":: Header": ["header", ""],
        "Show Header Background Gradient": [false, "Gives the header bar a gradient background."],
        "Show Header Shadow": [true, "Gives the header a drop shadow."],
        "Highlight Current Board": [true, "Gives the current board link a bottom highlight border."],
        ":: Holotower": ["header", ""],
        ":: General": ["header", ""],
        "Relative Post Dates": [false, "Display dates like '3 minutes ago'. Tooltip shows the original timestamp."],
        "Follow Cursor": [true, "Image previews follow the cursor instead of staying in the corner."],
        "Catalog Links": [false, "Converts board navigation links to catalog links."],
        "Highlight Posts Quoting You": [true, "Styles the highlight of posts quoting you (posts are marked by the site/Holotower TS)."],
        "Highlight Own Posts": [true, "Styles the highlight of your own posts (posts are marked by the site/Holotower TS)."],
        ":: Posting": ["header", ""],
        "Show Original Form": [true, "Show the posting form at the top of the page. Uncheck to hide it and post through the quick reply instead."],
        "Pin Quick Reply": [false, "Open the quick reply automatically when entering a thread."],
        "QR Button Image": ["", "Image URL (or data URI) that replaces the floating Quick Reply button icon. Leave empty to keep the site's icon."],
        "Watch Thread on Reply": [false, "Automatically adds the thread to the thread watcher when posting a reply."],
        ":: Integrations": ["header", ""],
        "Auto Scroll": [true, "Scroll to new posts only when already at the bottom of the thread. Ported from Holotower Auto Scroll."],
        "ImgOps Links": [true, "Add imgops links after file info. Ported from Holotower ImgOps Links."],
        "Sauce Links": [true, "Add X/BSKY sauce links to files with matching filenames. Ported from Holotower X/BSKY Sauce."],
        "Catalog Highlights": [true, "Highlight and pin catalog threads via the Pin Settings button in the catalog. Ported from Holotower Catalog Highlights and Pin."],
        "Enable Mascots": [false, "Display a mascot image in the bottom corner of the page. Selected mascots rotate randomly on each page load."],
        "Hide Mascots in Catalog": [true, "Hides the mascot when viewing the catalog."],
        "Mascots Overlap Posts": [false, "Render the mascot above posts and threads instead of behind them."],
        "Reduce Mascot Opacity": [false, "Fade the mascot out until it is hovered. Note: the mascot captures the mouse where it overlaps the page."],
        "Mascot Max Width": [true, "Cap mascots at the 300px sidebar width by default. Each mascot can override this in its editor."],
        "Advanced Mascot Editor": [false, "Remembered mascot editor mode (set from the editor itself)."],
        "Mascots": ["[]", "Mascot data.", null, null, true],
        "Themes": [],
        "Hidden Themes": [],
        "Selected Theme": 1,
        "NSFW Theme": 0
    },
        NAME = "StyleTower",
        NAMESPACE = "StyleTower.",
        VERSION = "1.0.13",
        CHANGELOG = "https://github.com/vampiricwulf/StyleTower/releases/latest",
        themeInputs = [{
            dName: "Reply Background",
            name: "mainColor",
            property: "background-color"
        }, {
            dName: "Reply Border",
            name: "brderColor",
            property: "border-color"
        }, {
            dName: "Input Background",
            name: "inputColor",
            property: "background-color"
        }, {
            dName: "Input Border",
            name: "inputbColor",
            property: "border-color"
        }, {
            dName: "Header Background",
            name: "headerBGColor",
            property: "background-color"
        }, {
            dName: "Header Text",
            name: "headerColor",
            property: "color"
        }, {
            dName: "Board Title",
            name: "boardColor",
            property: "color"
        }, {
            dName: "Body Background",
            name: "bgColor",
            property: "background-color"
        }, {
            dName: "Text",
            name: "textColor",
            property: "color"
        }, {
            dName: "Backlink",
            name: "blinkColor",
            property: "color"
        }, {
            dName: "Header Link",
            name: "headerLColor",
            property: "color"
        }, {
            dName: "Header Link Hover",
            name: "headerLHColor",
            property: "color"
        }, {
            dName: "Link",
            name: "linkColor",
            property: "color"
        }, {
            dName: "Link Hover",
            name: "linkHColor",
            property: "color"
        }, {
            dName: "Quotelinks",
            name: "qlColor",
            property: "color"
        }, {
            dName: "Name",
            name: "nameColor",
            property: "color"
        }, {
            dName: "Tripcode",
            name: "tripColor",
            property: "color"
        }, {
            dName: "Subject",
            name: "titleColor",
            property: "color"
        }, {
            dName: "Greentext",
            name: "quoteColor",
            property: "color"
        }, {
            dName: "Unread Line",
            name: "unreadColor",
            property: "color"
        }, {
            dName: "Highlighting",
            name: "postHLColor",
            property: "color"
        }, {
            dName: "Posts Quoting You",
            name: "quotesYouHLColor",
            property: "color"
        }, {
            dName: "Own Posts",
            name: "ownPostHLColor",
            property: "color"
        }, {
            dName: "Highlighted Threads",
            name: "threadHLColor",
            property: "color"
        }, {
            dName: "Highlighted Reply BG",
            name: "replybgHLColor",
            property: "background"
        }, {
            dName: "Reply Selection",
            name: "replyslctColor",
            property: "outline"
        }, {
            dName: "Hover Preview BG",
            name: "hoverColor",
            property: "background-color"
        }, {
            dName: "Hover Outline",
            name: "hoverOutColor",
            property: "outline"
        }],
        $, $lib, $SS,
        $docBody = null,
        $docHead = null;

    // Cache DOM references for performance
    function getDocBody() {
        return $docBody || ($docBody = document.body);
    }
    function getDocHead() {
        return $docHead || ($docHead = document.head);
    }

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        };
    }
    /* STYLE SCRIPT LIBRARY */
    /* More or less based off jQuery */
    /* Kept closure-local: overwriting window.$ clobbers the site's jQuery in
       any environment that doesn't sandbox userscripts */
    $ = $lib = function (selector, root) {
        return this instanceof $lib ?
            this.init(selector, root) : new $lib(selector, root);
    };
    $.waitFor = function (selector, cb) {
        var el = document.querySelector(selector);
        if (el) { cb(el); return; }
        var obs = new MutationObserver(function () {
            var el = document.querySelector(selector);
            if (el) { cb(el); obs.disconnect(); }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    };
    $.waitForFn = function (test, cb) {
        var result = test();
        if (result) { cb(result); return; }
        setTimeout(function () { $.waitForFn(test, cb); }, 25);
    };

    $lib.prototype = {
        constructor: $lib,
        elems: [],
        length: function () {
            return this.elems.length;
        },
        /* CONSTRUCTOR */
        init: function (selector, root) {
            if (selector == null || selector == undefined) return this;

            if (selector.constructor === $lib) return selector;
            else if (typeof selector === "string") {
                root = root || document;
                var tagCheck = /^<(\w+)([^>]*)>(.*)$/.exec(selector); // No closing tag for root node.

                if (root.constructor === $lib)
                    root = root.get();

                if (tagCheck) {
                    var tag = document.createElement(tagCheck[1]);

                    if (tagCheck[2]) {
                        var attribs, atRegEx = /(\w+)=((?:"(?:[^"]+)"|'(?:[^']+)'|(?:\w+)))/g;
                        while ((attribs = atRegEx.exec(tagCheck[2])) != null) {
                            var val = attribs[2];
                            if ((val[0] == '"' || val[0] === "'") && val[0] == val[val.length - 1])
                                val = val.substr(1, val.length - 2);

                            tag.setAttribute(attribs[1], val);
                        }
                    }

                    tag.innerHTML = tagCheck[3];

                    this.elems = [tag];
                } else if (/^#[\w-]+$/.test(selector) && root == document) {
                    var el;

                    if ((el = document.getElementById(selector.substr(1))) != null)
                        this.elems = [el];
                } else {
                    if (!root || typeof root.querySelectorAll !== "function") {
                        this.elems = [];
                        return this;
                    }
                    var results = root.querySelectorAll(selector);
                    this.elems = Array.prototype.slice.call(results);
                }
            } else if (selector.nodeType)
                this.elems = [selector];
            else if (Array.isArray(selector))
                this.elems = Array.prototype.slice.call(selector);

            return this;
        },

        /* DOM NODE RETRIEVAL */
        get: function (index) {
            if (index == undefined && this.elems.length === 1)
                return this.elems[0];
            else if (index == undefined && !this.hasSingleEl())
                return this.elems;

            return this.elems[index];
        },

        /* DOM MANIPULATION */
        append: function (el) {
            if (el.constructor === $lib)
                el = el.get();

            return this.each(function () {
                this.appendChild(el);
            });
        },
        before: function (el) {
            if (el.constructor === $lib)
                el = el.get();

            return this.each(function () {
                this.parentNode.insertBefore(el, this);
            });
        },
        replace: function (el) {
            return this.each(function () {
                $(this).before(el).remove();
            });
        },
        html: function (html) {
            if (html == undefined)
                return this.elems[0].innerHTML;

            return this.each(function () {
                this.innerHTML = html;
            });
        },
        text: function (text) {
            if (this.length() === 0)
                return;

            if (text == undefined)
                return this.elems[0].textContent;

            return this.each(function () {
                this.textContent = text;
            });
        },
        attr: function (name, val) {
            if (val == undefined)
                if (!this.hasSingleEl())
                    return this;
                else
                    return this.elems[0].getAttribute(name);
            else
                if (val === "")
                    return this.each(function () {
                        this.removeAttribute(name);
                    });

            return this.each(function () {
                this.setAttribute(name, val);
            });
        },
        toggle: function (bHidden) {
            return this.each(function () {
                var $this = $(this);

                if (bHidden == undefined)
                    bHidden = !($this.attr("disabled") === "true");

                $this.attr("hidden", bHidden || "");
                this.style.display = bHidden ? "none" : "";
            });
        },
        hide: function () {
            return this.toggle(true);
        },
        show: function () {
            return this.toggle(false);
        },
        val: function (val) {
            if (val == undefined) {
                var el = this.elems[0];

                if (el == undefined)
                    return false;

                switch (el.type) {
                    case "checkbox":
                    case "radio":
                        return el.checked == true;
                    default:
                        if (/^\d+$/.test(el.value))
                            return parseInt(el.value);
                        return el.value;
                }
            }

            return this.each(function () {
                switch (this.type) {
                    case "checkbox":
                    case "radio":
                        this.checked = val;
                        break;
                    default:
                        this.value = val;
                        break;
                }
            });
        },
        addClass: function (classNames) {
            if (!classNames || typeof classNames !== "string") return this;
            var classes = classNames.split(" ");
            return this.each(function () {
                if (this.classList) {
                    for (var j = 0, jMAX = classes.length; j < jMAX; j++)
                        this.classList.add(classes[j]);
                } else {
                    for (var j = 0, jMAX = classes.length; j < jMAX; j++)
                        if (!$(this).hasClass(classes[j]))
                            this.className += (this.className ? " " : "") + classes[j];
                }
            });
        },
        hasClass: function (className) {
            if (!this.hasSingleEl() || this.elems[0].className == undefined)
                return false;

            if (this.elems[0].classList) {
                return this.elems[0].classList.contains(className);
            }

            var regx = new RegExp("\\b" + className + "\\b");
            return regx.test(this.elems[0].className);
        },
        removeClass: function (classNames) {
            if (!classNames || typeof classNames !== "string") return this;
            var classes = classNames.split(" ");
            return this.each(function () {
                if (this.classList) {
                    for (var j = 0, jMAX = classes.length; j < jMAX; j++)
                        this.classList.remove(classes[j]);
                } else {
                    var cclassNames = this.className.split(" "),
                        newClasses = [];
                    for (var k = 0, kMAX = cclassNames.length; k < kMAX; k++) {
                        var found = false;
                        for (var j = 0, jMAX = classes.length; j < jMAX; j++) {
                            if (classes[j] === cclassNames[k]) {
                                found = true;
                                break;
                            }
                        }
                        if (!found && cclassNames[k]) {
                            newClasses.push(cclassNames[k]);
                        }
                    }
                    this.className = newClasses.join(" ");
                }
            });
        },

        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            });
        },
        /* DOM TRAVERSING */
        parent: function () {
            if (!this.hasSingleEl()) return this;

            return new $lib(this.elems[0].parentNode);
        },
        children: function (selector) {
            if (!this.hasSingleEl())
                return this;
            else if (selector == null)
                selector = "*";

            return new $lib(selector, this.elems[0]);
        },
        nextSibling: function (selector) {
            if (!this.hasSingleEl() ? true : this.elems[0].nextSibling == null)
                return new $lib(null);

            if (selector != undefined) {
                var t, m = new $lib(selector, this.elems[0].parentNode),
                    s = this.elems[0].parentNode.childNodes;

                for (var i = s.length - 1; i >= 0; --i) {
                    if (s[i] === this.elems[0] && t == undefined) // end and no matching siblings
                        return new $lib(null);
                    else if (s[i] === this.elems[0] && t != undefined) // end and matched sibling
                        return new $lib(t);
                    else if (m.elems.indexOf(s[i]) !== -1) // this element matches the selector
                        t = s[i];
                }
            }

            return new $lib(this.elems[0].nextSibling);
        },


        /* EVENT METHODS */
        bind: function (type, listener) {
            return this.each(function () {
                var types = type.split(/\s+/);
                for (var i = 0; i < types.length; i++) {
                    this.addEventListener(types[i], listener, false);
                }
            });
        },
        unbind: function (type, listener) {
            return this.each(function () {
                this.removeEventListener(type, listener, false);
            });
        },
        fire: function (evnt) {
            var ev = document.createEvent("HTMLEvents");

            return this.each(function () {
                ev.initEvent(evnt, true, true);
                this.dispatchEvent(ev);
            });
        },
        scrollIntoView: function (alignWithTop) {
            return this.each(function () {
                this.scrollIntoView(alignWithTop);
            });
        },
        /* HELPER METHODS */
        each: function (func, args) {
            if (args != null && !Array.isArray(args))
                args = [args];

            for (var i = 0, MAX = this.elems.length; i < MAX; ++i)
                func.apply(this.elems[i], args || [i]);

            return this;
        },
        exists: function () {
            return this.elems.length > 0;
        },
        hasSingleEl: function () {
            return this.elems.length === 1;
        },
    };
    /* END STYLE SCRIPT LIBRARY */

    /* STYLE SCRIPT CLASSES & METHODS */
    $SS = {
        browser: {},
        DOMLoaded: function (reload) {
            $SS.classes.init();
            $SS.disableSiteTheme();
            $SS.displayMascots();
            $SS.integrations.init();
            // Runs on settings reloads too so Replace Thumbnails applies
            // without a page refresh (idempotent per image)
            $SS.replaceThumbnails();

            var div;
            if (reload !== true) {
                $SS.options.init();

                document.addEventListener("click", function (e) {
                    var li = e.target.closest("[data-cmd='toggle-you']");
                    if (li) $SS.toggleYou(li);
                    li = e.target.closest("[data-cmd='delete-post']");
                    if (li) $SS.deletePost(li, false);
                    li = e.target.closest("[data-cmd='delete-file']");
                    if (li) $SS.deletePost(li, true);
                });

                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
                var touchesInline = function (n) {
                    return n.nodeType === 1 && ((n.matches && n.matches(".inline-quote-container")) ||
                        (n.querySelector && n.querySelector(".inline-quote-container") != null));
                };
                var observer = new MutationObserver(function (mutations) {
                    var i, j, MAX, _MAX, nodes, node, inlineSync = false;

                    for (i = 0, MAX = mutations.length; i < MAX; ++i) {
                        // Containers vanish on collapse; watch removals too
                        nodes = mutations[i].removedNodes;
                        for (j = 0, _MAX = nodes.length; j < _MAX; ++j) {
                            if (!inlineSync && touchesInline(nodes[j])) inlineSync = true;
                        }

                        nodes = mutations[i].addedNodes;

                        for (j = 0, _MAX = nodes.length; j < _MAX; ++j) {
                            node = nodes[j];
                            if (node.nodeType !== 1) continue;
                            if (!inlineSync && touchesInline(node)) inlineSync = true;
                            var canHavePosts = node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" &&
                                node.nodeName !== "LINK" && node.nodeName !== "META" && node.nodeName !== "BR";

                            if (canHavePosts) {
                                var formSel = "#quick-reply, form[name='post']";
                                var forms = node.matches && node.matches(formSel)
                                    ? [node]
                                    : node.querySelectorAll ? node.querySelectorAll(formSel) : [];
                                forms.forEach($SS.handleFormNode);
                                if (node.matches && node.matches("#quick-reply"))
                                    $SS.QRDialogCreationHandler({ target: node });
                                if ($SS._initDone) {
                                    $SS.moveOPFiles(node);
                                    $SS.tidyFileInfo(node);
                                    $SS.moveOmittedSpans(node);
                                    if ($SS.addIndexHideButtons) $SS.addIndexHideButtons(node);
                                    $SS.replaceThumbnails(node);
                                    $SS.relativeDates(node);
                                    $SS.replacePostMenuBtn(node);
                                }
                            }
                            var pm = node.matches && node.matches(".post-menu") ? node : node.querySelector ? node.querySelector(".post-menu") : null;
                            if (pm) {
                                $SS.insertToggleYou(pm);
                                $SS.insertDeletePost(pm);
                            }
                        }
                    }

                    if (inlineSync) $SS.syncInlinedMarks();
                });

                // Observe only the body element instead of entire document for better performance
                var targetNode = getDocBody() || document.documentElement;
                observer.observe(targetNode, {
                    childList: true,
                    subtree: true
                });

                // Post hover previews follow the cursor
                if ($SS.conf["Follow Cursor"]) {
                    document.addEventListener("mousemove", function (e) {
                        var img = document.querySelector(".post-hover");
                        if (!img) return;
                        var cw = document.documentElement.clientWidth;
                        var ch = document.documentElement.clientHeight;
                        var h = img.offsetHeight, w = img.offsetWidth;
                        img.style.position = "fixed";
                        var top = Math.max(0, e.clientY * (ch - h) / ch);
                        var threshold = cw / 2;
                        var marginX = Math.min((e.clientX <= threshold ? e.clientX : cw - e.clientX) + 45, cw - w);
                        img.style.top = top + "px";
                        if (e.clientX <= threshold) {
                            img.style.left = marginX + "px";
                            img.style.right = "";
                        } else {
                            img.style.left = "";
                            img.style.right = marginX + "px";
                        }
                    });
                }

                // Auto-convert images on drop
                if ($SS.conf["Auto-Convert Images"]) {
                    $SS.initImageConvertOnDrop();
                }
                // Normalize OP structure (move .files inside .post.op)
                $SS.moveOPFiles();
                $SS.tidyFileInfo();
                $SS.moveOmittedSpans();
                // One-click post hiding + control row on index pages
                if (!$SS.location.reply && !$SS.location.catalog && $SS.location.board) {
                    $SS.initIndexPostHiding();
                    $SS.initIndexNav();
                }
                // Compact single-line thread footer: pull the updater and thread
                // stats up next to the [Return]/[Go to top]/[Catalog] links.
                if ($SS.location.reply) {
                    $.waitFor("#updater", function (updater) {
                        var links = document.getElementById("thread-links");
                        if (links && links.parentNode && updater.previousElementSibling !== links)
                            links.parentNode.insertBefore(updater, links.nextSibling);
                    });
                    $.waitFor("#thread_stats", function (stats) {
                        var ti = document.getElementById("thread-interactions");
                        if (ti && stats.parentNode !== ti) ti.appendChild(stats);
                    });
                }
                // Re-replace a thumb after the site's inline expansion collapses
                // it back to the static thumbnail (that swap is src-only, which
                // the childList observer doesn't see).
                if ($SS.conf["Replace Thumbnails"]) {
                    document.addEventListener("click", function (e) {
                        var a = e.target.closest && e.target.closest(".file > a");
                        if (!a) return;
                        setTimeout(function () { $SS.replaceThumbnails(a.closest(".file").parentNode); }, 150);
                    });
                }
                // Remember QR comments
                $SS.initRememberComment();
                // Native QR autohide (focus/hover behavior for Normal & Vertical Tabbed)
                $SS.initNativeQRAutohide();

                // Set maxlength on subject and name inputs (100 char limit)
                $("input[name=subject], input[name=name]", document).each(function () {
                    this.setAttribute("maxlength", "100");
                    this.addEventListener("input", function () {
                        if (this.value.length >= 100) {
                            this.style.setProperty("border-color", "red", "important");
                            var el = this;
                            setTimeout(function () { el.style.removeProperty("border-color"); }, 600);
                        }
                    });
                });

                // Auto-watch thread on post submission
                if ($SS.conf["Watch Thread on Reply"] && $SS.location.reply) {
                    $SS.handleFormNode();
                }

                // Auto-open the quick reply on thread pages (the floating
                // .quick-reply-btn is the site's opener; #link-quick-reply was
                // 4chan-X). Autohide styles dock the QR as persistent UI, so
                // they imply opening it too.
                if ($SS.location.reply && ($SS.conf["Pin Quick Reply"] || $SS.conf["Autohide Style"] !== 0)) {
                    var qrOpened = false,
                        openQR = function () {
                            if (qrOpened) return;
                            qrOpened = true;
                            var btn = document.querySelector("a.quick-reply-btn");
                            if (btn) btn.click();
                            // Some scripts pre-build the QR hidden; reveal it
                            var qr = document.getElementById("quick-reply");
                            if (qr && qr.style.display === "none") qr.style.display = "";
                        };
                    $.waitFor("a.quick-reply-btn, #quick-reply", function () {
                        setTimeout(openQR, 50);
                    });
                }

                // With an Autohide Style the QR is persistent docked UI, so
                // TS's quick reply keybind (which closes/reopens the form)
                // fights it; repurpose the same binding as a show/hide toggle.
                // Capture phase runs before TS's bubble listener.
                if ($SS.location.reply && $SS.conf["Autohide Style"] !== 0) {
                    document.addEventListener("keydown", function (e) {
                        var tag = e.target.tagName;
                        if (tag === "INPUT" || tag === "TEXTAREA" || !e.key) return;
                        var kb = { ctrl: false, alt: false, shift: false, key: "q" };
                        try {
                            var ts = JSON.parse(localStorage.getItem("Thread Settings") || "{}");
                            if (ts.enableQuickReply === false) return;
                            if (ts.kbQuickReply) kb = ts.kbQuickReply;
                        } catch (er) {}
                        if (e.key.toLowerCase() !== String(kb.key || "q").toLowerCase() ||
                            e.ctrlKey !== !!kb.ctrl || e.altKey !== !!kb.alt || e.shiftKey !== !!kb.shift)
                            return;
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        $SS.toggleAutohideQR();
                    }, true);
                }

                if ($SS.conf["Catalog Links"]) {
                    function fixBoardLinks(nav) {
                        if (!nav) return;
                        nav.querySelectorAll("a[href]").forEach(function (a) {
                            var href = a.getAttribute("href");
                            if (/^\/[a-z0-9]+\/(?:index\.html)?$/i.test(href))
                                a.setAttribute("href", href.replace(/(?:index\.html)?$/, "catalog.html"));
                        });
                    }
                    document.querySelectorAll(".boardlist").forEach(fixBoardLinks);
                }

                // Handle a quick reply that appeared before init
                setTimeout(function () {
                    if (!$SS.QRhandled && (div = $("#quick-reply")).exists())
                        $SS.QRDialogCreationHandler({
                            target: div.elems[0]
                        });
                });

                $SS._initDone = true;
            }
        },
        init: function (reload) {
            if (!reload) {
                if (/^about:neterror/.test(document.documentURI)) return;
                $SS.hasGM = typeof GM_deleteValue !== "undefined";

                $SS.location = $SS.getLocation();

                if ($SS.Config.get("VERSION") !== VERSION) {
                    setTimeout(function () {
                        var content = document.createElement('span');
                        var changelogLink = document.createElement('a');

                        content.appendChild(document.createTextNode(NAME + ' has been updated to version ' + VERSION + '.'));
                        content.appendChild(document.createElement('br'));
                        changelogLink.href = CHANGELOG;
                        changelogLink.target = '_blank';
                        changelogLink.rel = 'noopener noreferrer';
                        changelogLink.textContent = 'Read the changelog.';
                        content.appendChild(changelogLink);

                        $SS.notify({
                            type: 'info',
                            content: content,
                            lifetime: 15
                        });
                    }, 25);
                    // Correct selected theme after updating
                    // and the number defaults has changed.
                    var ntThemes = $SS.Themes.defaults.length,
                        otThemes = $SS.Config.get("Total Themes"),
                        sTheme = $SS.Config.get("Selected Theme");

                    if (otThemes !== ntThemes && otThemes != undefined && sTheme >= otThemes) {
                        sTheme += ntThemes - otThemes;
                        $SS.Config.set("Selected Theme", sTheme);
                    }

                    $SS.Config.set("VERSION", VERSION);
                    $SS.Config.set("Total Themes", ntThemes);
                }
            }

            $SS.Config.init();
            $SS.Themes.init();

            // Set native site theme to mitigate unloaded CSS flashbang #6
            (function () {
                try {
                    localStorage.stylesheet = $SS.theme.bgColor.isLight ? "Yotsuba B" : "Tomorrow";
                } catch (e) {}
            })();

            if (reload) {
                $SS.insertCSS();
                $SS.DOMLoaded(true);
            } else {
                $SS.insertCSS();
                if (/complete|interactive/.test(document.readyState))
                    $SS.DOMLoaded();
                else
                    $(document).bind("DOMContentLoaded", $SS.DOMLoaded);
            }

        },

        /* STYLING & DOM */
        insertCSS: function () {
            var css,
                reload = $("#ch4SS").exists();

            if ($SS.location.dead)
                return;

            css = "#expand-all-images,#password,#watch-board,#watch-pin,#watch-thread,.boardlist.bottom,.post-hover input[type=checkbox],.tab-select:not(:checked)+div,:root.hide-banner img.board_image,:root.hide-board-name header div.subtitle,:root.hide-board-name header h1,:root.hide-navlinkbot #thread-links,:root.hide-navlinks #thread-links,:root.hide-navlinks div.banner,:root.hide-navlinktop div.banner,:root.qr-controls #quick-reply a.close-btn,:root.show-file-info p.fileinfo .unimportant,:root.show-form form[name=post]:not(#quick-reply),:root:not(.st-home) footer,:root:not(.st-home) hr:not(#unread-line),[hidden],div.styles,form[name=postcontrols] .post input[type=checkbox],iframe[src='about:blank'],label:has(> a.threading-toggle){display:none}a,input:focus,select,textarea:focus{outline:0!important}.sjis{font-size:16px;line-height:17px;white-space:pre;font-family:IPAMonaPGothic,Mona,'MS PGothic',monospace;overflow:auto;display:block;clear:left}.mu-s{font-weight:700}.mu-i{font-style:italic}.mu-r{color:#c41e3a}.mu-g{color:#00a550}.mu-b{color:#1d8dc4}.files .file>a{float:left;margin-left:13px;margin-right:20px;margin-bottom:10px}.thread>.files .file>a{margin-bottom:0}p.fileinfo{margin-left:13px!important;margin-bottom:2px!important}p.fileinfo>.unimportant{margin-left:4px}.fixed.bottom-header body.active-thread{padding-bottom:0;padding-top:.5em}.fixed.bottom-header body.active-index{padding-bottom:4.5em;padding-top:.5em}.fixed.bottom-header body.active-catalog,.fixed.bottom-header.catalog-mode body{padding-bottom:3em;padding-top:.5em}.fixed.bottom-header body{padding-top:.5em}:root.bottom-header:not(.autohide) body.active-index{padding-bottom:5em!important}.fixed.top-header body.active-index{padding-bottom:2.5em;padding-top:" + (($SS.conf["Font Size"] <= 11) ? 3.2 : 2.4) + "em!important}.fixed.top-header body.active-thread{padding-bottom:0;padding-top:" + (($SS.conf["Font Size"] <= 11) ? 3.2 : 2.4) + "em!important}.fixed.top-header body.active-catalog,.fixed.top-header.catalog-mode body{padding-bottom:.5em;padding-top:" + (($SS.conf["Font Size"] <= 11) ? 3.2 : 2.4) + "em!important}.fixed.top-header.autohide body{padding-top:2em!important}.fixed.top-header body{padding-top:2.4em!important}.boardlist.bottom{margin-bottom:15px}:root:not(.fixed) .boardlist:not(.bottom){margin-top:15px}div.post{margin:4px 0;overflow:hidden}:root:not(.reply-fit-width) form[name=postcontrols] div.post.reply:not([hidden]):not(.iq-hidden-post):not(.hidden-post):not(.hidden){display:table!important}:root:not(.reply-fit-width) form[name=postcontrols] .stub~div.post.reply:not([hidden]){display:none!important}div.thread{margin:0;clear:both;padding-bottom:10px}div.pages{padding:4px}div.pages{float:left}span.spoiler,span.spoiler:not(:hover)>a{color:#000;background:none repeat scroll 0 0 #000}span.spoiler:focus,span.spoiler:hover{color:#fff}hr{clear:both}table{border-spacing:1px;margin-left:auto;margin-right:auto}#post-moderation-fields{float:right}.fixed.bottom-header body.active-index #post-moderation-fields,.fixed.bottom-header body.active-thread #post-moderation-fields{margin-bottom:35px}.fixed.top-header body.active-index #post-moderation-fields,.fixed.top-header body.active-thread #post-moderation-fields{margin-bottom:8px}input[value=Next],input[value=Previous]{padding:4px 13px}div.post img.icon{margin-bottom:-3px}:root.reply-fit-width .inline{display:flow-root!important}select{padding:0 0 2px 2px;margin-right:1px}.theme-catalog .replies>strong{margin-bottom:5px}form[name=post] input[type=file]{height:23px}#quick-reply input[type=file]{margin-right:0!important}:root.left-sidebar #quick-reply,:root.right-sidebar #quick-reply{max-width:300px!important}:root.left-sidebar #quick-reply input[type=text],:root.left-sidebar #quick-reply textarea,:root.right-sidebar #quick-reply input[type=text],:root.right-sidebar #quick-reply textarea{max-width:294px!important}:root.left-sidebar #quick-reply textarea,:root.right-sidebar #quick-reply textarea{min-width:294px!important}form[name=post]:not(#quick-reply){margin-top:1em}:root.normal-qr #quick-reply:not(:hover):not(.focus){width:303px!important}:root.normal-qr #quick-reply:not(:hover):not(.focus) table tr:not(:first-child){display:none!important}:root.normal-qr .qr-transition #quick-reply table tr:not(:first-child){transition:opacity .2s ease-in-out .1s}#quick-reply input[type=file]::-webkit-file-upload-button,#quick-reply input[type=file]::file-selector-button,form[name=post] input[type=file]::-webkit-file-upload-button,form[name=post] input[type=file]::file-selector-button{appearance:none;cursor:pointer;height:23px;padding:0 6px;text-transform:uppercase;margin-right:4px;background:rgb(var(--sc-mainColor-rgb))!important;border-style:solid;border-width:1px;border-color:rgb(var(--sc-mainColor-shiftM15)) rgb(var(--sc-mainColor-shiftM15)) rgb(var(--sc-mainColor-shiftM30))!important;color:var(--sc-textColor)!important;font-family:" + $SS.formatFont($SS.conf["Font Family"]) + ";font-size:" + $SS.conf["UI Font Size"] + "px!important}#quick-reply input[type=file]:hover::-webkit-file-upload-button,#quick-reply input[type=file]:hover::file-selector-button,form[name=post] input[type=file]:hover::-webkit-file-upload-button,form[name=post] input[type=file]:hover::file-selector-button{background:rgb(var(--sc-mainColor-shift10))!important}div.pages{margin-bottom:10px}:root.follow-cursor #image-hover{max-width:calc(100vw - 100px);max-height:calc(100vh - 60px)}body{margin-left:" + $SS.conf["Margin Left"] + "px;margin-right:" + $SS.conf["Margin Right"] + "px;margin-top:0;margin-bottom:0}div.post.reply{padding:0!important;max-width:none!important}div.post.op{display:block}p.intro{margin:0!important;padding:5px 13px!important;display:block!important}span.omitted{margin-left:2px}.thread>span.omitted{display:block;clear:both;margin:2px 0 4px 4px!important;font-style:italic;opacity:.8}div.post.op{margin-left:4px;margin-right:4px}.expanded-image{position:relative}:root.op-background .op{padding:4px 0}:root.force-indent .op{margin-left:-12px}:root.force-wrapping .op::after{clear:both;content:'';display:block}.thread>.post.reply,.threadContainer>.post.reply,.threadingContainer>.post.reply,:root.op-background .thread>.post.op{margin-bottom:" + ($SS.conf["Margin Between Replies"] !== '' ? $SS.conf["Margin Between Replies"] : 4) + "px!important}:root.oneechan .post.op.st-inlined:not(.iq-hidden-post),:root.oneechan .post.reply.st-inlined:not(.iq-hidden-post):not(.inline-cloned-post):not(.post-hover){opacity:.45;filter:grayscale(60%);transition:opacity .2s ease,filter .2s ease}:root.oneechan .post.op.st-inlined:not(.iq-hidden-post):hover,:root.oneechan .post.reply.st-inlined:not(.iq-hidden-post):not(.inline-cloned-post):not(.post-hover):hover{opacity:.85;filter:grayscale(20%)}.post+br,.reply+br,.thread>br,.threadContainer>br,.threadingContainer>br{display:none!important}.container~.inline{margin:2px 0 2px 13px!important}:root.bottom-backlinks .container~.inline{margin:0 13px 2px!important}:root.bottom-backlinks .container~.inline:last-of-type:not(.inline .hasInline .inline){margin-bottom:3px!important}.hashlink{padding-left:2px}:root.backlink-icon .post.op a.hashlink{vertical-align:middle}div.body{margin:" + $SS.conf["Margin Post Message"] + "!important}:root.bottom-backlinks .container{padding-left:8px}:root.bottom-backlinks .post:not(:root.op-background .op) .container:not(:empty){padding-bottom:4px}:root.fit-eximg.fit-height .full-image{max-height:calc(100vh - 8rem)!important}:root.reply-fit-width .reply.post:not(.iq-hidden-post):not(.hidden-post):not(.hidden){display:block!important}:root.reply-fit-width .stub~.reply.post{display:none!important}.hasInline .inline>.post.reply:not(.expanded-image):not(.hasInline),:root.reply-fit-width .post.reply{overflow:hidden!important}:root.reply-fit-width .post.expanded-image::after,:root.reply-fit-width .post.reply.hasInline::after{clear:both!important;content:''!important;display:block!important}.threadContainer .hide-reply-button{margin-left:-12px!important}.stub{padding:2px}.stub>a.show-thread-button{margin-right:4px}:root.reply-hide .thread>.post.reply.expanded-image,:root.reply-hide .thread>.post.reply.hasInline{margin-left:12px!important}.threadContainer{margin-left:0!important;padding-left:20px!important}:root.reply-hide .thread>.threadContainer{margin-left:13px!important}:root.post-info .post.reply>p.intro{box-shadow:inset rgba(0,0,0,.05) 0 -1px 2px;padding-top:2px!important}:root.post-info .inline .post.reply,:root.post-info .post.reply.post-hover{padding:0 0 1px!important}p.intro a.post-btn{margin:0 0 0 5px!important}:root.reply-fit-width .post.reply .container{padding-right:5px}:root.reply-fit-width.fit-postmenu p.intro>a.post-btn{float:right!important}:root.reply-fit-width.fit-postmenu p.intro>a.post-btn{margin:2px 20px 0 0}:root.reply-fit-width .post a.post-btn{position:relative;opacity:0}:root.reply-fit-width .post:not(:hover) a.post-btn{transition:opacity .3s ease-out 0s!important}:root.reply-fit-width .post:hover a.post-btn{opacity:1;transition:opacity .3s ease-in .1s!important}pre{padding:5px!important;display:block;max-height:400px;overflow-x:auto;max-width:100%;white-space:pre-wrap;overflow-wrap:anywhere}input[type=button],input[type=checkbox],input[type=submit]{cursor:pointer}input[type=checkbox]{display:inline-block;height:12px!important;position:relative;width:12px!important;border-radius:2px!important;appearance:none;margin:0 2px -1px 0}input[type=checkbox]:checked::before{content:'✓';position:absolute;top:0;left:0;height:12px;width:11px;font-size:11px;line-height:12px;text-align:center;color:var(--sc-textColor)}.boardlist:not(.bottom){padding:4px 4px 5px!important}:root:not(.fixed) .boardlist:not(.bottom){top:0;right:0;left:0;box-shadow:0 1px 2px rgba(0,0,0,.15);border-bottom:1px solid}:root.autohide body{padding-top:0!important;padding-bottom:0!important}:root:not(.fixed).right-sidebar .boardlist:not(.bottom){right:300px}:root:not(.fixed).left-sidebar .boardlist:not(.bottom){left:300px}.boardlist a{margin-left:2px}h2,h3{margin:auto}.shortcut{vertical-align:baseline!important}a.quick-reply-btn img{display:block}.post-menu{z-index:80}hr{height:2px;border:none!important}:root.reply-fit-width #unread-line{margin:auto;width:100%}#unread-line{margin-top:" + (($SS.conf["Margin Between Replies"] < -2) ? ($SS.conf["Margin Between Replies"] - 1) : -3) + "px!important;margin-bottom:" + (($SS.conf["Margin Between Replies"] < -2) ? -5 : -3) + "px!important;position:relative}:root:not(.autohide) #scroll-marker{pointer-events:none!important}header h1{cursor:default;letter-spacing:-2px;padding-top:.1em}img.board_image{border:0!important;margin:0 auto;max-height:100px!important;max-width:100%}:root.banner-opacity img.board_image{opacity:.5;transition:opacity .3s ease-out 0s}:root.banner-opacity img.board_image:hover{opacity:1}div.pages a[href$='catalog.html']{margin-left:12px}div.pages a[href$='catalog.html'],input[value=Next],input[value=Previous]{font-weight:700;transition:opacity .3s ease-in 0s}div.pages a.selected:hover,div.pages a[href$='catalog.html']:hover,input[value=Next]:hover,input[value=Previous]:hover{opacity:.7}div.pages{margin-left:18px;margin-bottom:15px}:root.reply-fit-width div.pages{margin-left:0}.pages a{padding:5px 10px;margin-left:-1px}div.pages a.selected{padding-top:3px;transition:opacity .3s ease-in 0s}div.banner{font-size:0!important;background:0 0!important;text-align:left;padding:0!important;margin:8px 0!important}div.banner a{font-size:" + $SS.conf["Font Size"] + "px!important;margin-right:5px}#updater{float:left}a.reply.hide-button,a.reply.show-button{color:var(--sc-blinkColor)!important;opacity:.5;text-decoration:none!important}a.reply.show-button{float:none!important;clear:both;display:flex;align-items:center;gap:13px;width:fit-content;margin-top:8px}a.reply.show-button .hide-icon,a.reply.show-button svg.plus{vertical-align:baseline!important;margin:0!important;display:inline-flex;align-items:center}a.reply.hide-button:hover,a.reply.show-button:hover{opacity:1;color:var(--sc-linkHColor)!important}a.hide-thread-link{display:none!important}a.st-index-hide{float:left;padding:2px}:root.st-menu-silent .post-menu{display:none!important}.post.st-index-hidden{opacity:.6}a.st-index-hide:has(+ .post.reply[style*='display: none']){display:none!important}#update_thread{padding-left:0!important}#thread-catalog::before,header div.subtitle a::before{content:'['}#thread-catalog::after,header div.subtitle a::after{content:']'}#thread-interactions{margin-bottom:5px}#st-index-nav{margin:12px 0 6px;clear:both}#st-index-nav>a{margin-right:5px;text-decoration:none}#st-index-nav>a::before{content:'['}#st-index-nav>a::after{content:']'}#st-index-age{opacity:.7;margin:0 8px 0 2px;font-size:" + (($SS.conf["Font Size"] <= 10) ? 9 : $SS.conf["Font Size"] - 2) + "px}#st-index-search{width:180px!important;min-width:0!important}.st-search-hidden{display:none!important}div.pages{font-size:0!important;background:rgb(var(--sc-mainColor-rgb))!important;border:1px solid var(--sc-brderColor)!important;color:var(--sc-textColor)!important;padding:5px 8px!important;margin:0 0 10px!important}:root.rounded-corners div.pages{border-radius:3px}div.pages a,div.pages input[type=submit]{font-size:" + (($SS.conf["Font Size"] >= 18) ? 18 : ($SS.conf["Font Size"] <= 9 ? 9 : $SS.conf["Font Size"])) + "px!important;padding:2px 6px!important}div.pages form{display:inline!important}div.pages input[type=submit]{background:0 0!important;border:none!important;color:var(--sc-linkColor)!important;cursor:pointer;text-transform:none!important}div.pages input[type=submit]:hover{color:var(--sc-linkHColor)!important}div.pages a.selected{background:rgba(var(--sc-mainColor-shiftM16),.8)!important;color:var(--sc-textColor)!important;text-decoration:none!important}:root.rounded-corners div.pages a.selected{border-radius:2px}.post-hover{z-index:75!important}:root.thumb-opacity .file>a img:not(.full-image){opacity:.5;transition:opacity .3s ease-out 0s}:root.thumb-opacity .file>a img:not(.full-image):hover{opacity:1}select{appearance:none}form[name=postcontrols]{overflow-wrap:break-word;word-break:break-word;margin-bottom:15px}.st-video-thumb img.post-image{display:none!important}video.st-thumb-video{display:block;cursor:pointer;max-width:300px;max-height:300px}#styletower-mascots{position:fixed;bottom:0;z-index:-1;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none}#styletower-mascots.mascots-right{right:10px}#styletower-mascots.mascots-left{left:10px}:root.right-sidebar #styletower-mascots.mascots-right{right:3px}:root.left-sidebar #styletower-mascots.mascots-left{left:3px}#styletower-mascots img{max-width:300px;display:block}:root.mascot-overlap #styletower-mascots{z-index:5}:root.mascot-dim #styletower-mascots{opacity:.35;transition:opacity .25s ease;pointer-events:auto}:root.mascot-dim #styletower-mascots:hover{opacity:1}.pln,.post-menu,body,div.pages a.selected,form table th,form[name=post] table td,header,input,select,span.omitted,textarea{color:var(--sc-textColor)!important}.com,p.intro span.name{color:var(--sc-nameColor)!important}p.intro a.capcode,p.intro span.capcode{color:purple!important}.tag,p.intro span.trip{color:var(--sc-tripColor)!important}:root .atn,:root .options-button,:root .typ,a:not(span.spoiler>a),a:visited,span.spoiler:hover>a:not(:hover){color:var(--sc-linkColor)!important}#import-link>.options-button:hover,.lit,:root a:hover,:root div.post p.intro a.post_no:hover{color:var(--sc-linkHColor)!important}.boardlist{color:var(--sc-headerColor)!important}.boardlist a{color:var(--sc-headerLColor)!important}.boardlist a:hover{color:var(--sc-headerLHColor)!important}.boardlist{background-color:var(--sc-headerBGColor);border-bottom-color:var(--sc-brderColor)}.atv,.str,.theme-catalog .replies .quote,div.body span.quote,span.spoiler:hover .quote{color:var(--sc-quoteColor)!important}.kwd,.option.header .option-title,.tab-label,span.subject{color:var(--sc-titleColor)!important}.option.header{font-size:140%}header h1{color:var(--sc-boardColor)!important;text-shadow:none!important}:root p.intro .clone-mentioned a,:root p.intro .mentioned a,a.post-btn{color:var(--sc-blinkColor)!important}:root.backlink-shadow p.intro .clone-mentioned a,:root.backlink-shadow p.intro .mentioned a{text-shadow:1px 1px 5px}:root div.body a.quotelink,:root div.body a[onclick*=citeReply],:root div.body a[onclick*=highlightReply]{color:var(--sc-qlColor)!important}pre{background:none repeat scroll 0 0 rgba(var(--sc-codeBackground))!important;border:1px solid rgba(var(--sc-codeBorder))!important}.pun,::placeholder{color:rgba(var(--sc-textColor-rgb),.4)!important}body{background:var(--sc-bgImg) var(--sc-bgColor)!important}.reply,:root.op-background .post.op{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important}#alert_div,#header-bar.dialog,#options_div,#pin-settings,#quick-reply .handle,.watch-menu,form table th,form[name=post] table td{background:rgb(var(--sc-mainColor-rgb))!important}.post-menu ul{background:rgb(var(--sc-mainColor-rgb))!important;border:1px solid var(--sc-brderColor)!important}.post-menu,.post-menu li{color:var(--sc-textColor)!important}.post-menu li:hover{background:rgb(var(--sc-mainColor-shift15))!important}#add-mascot,#add-theme,#oneechan-options,.tab-label{background:rgb(var(--sc-mainColor-rgb))!important}#add-mascot,#add-theme{color:var(--sc-textColor)!important}:root:not(.header-gradient) .boardlist{background:rgba(var(--sc-headerBGColor-rgb),var(--sc-navOp))!important}:root.header-gradient .boardlist{background:linear-gradient(rgb(var(--sc-headerBGColor-shift15)),rgba(var(--sc-headerBGColor-rgb),var(--sc-navOp)))!important}:root.header-shadow .boardlist{box-shadow:none!important}#link-quick-reply,#quick-reply input[type=submit],.options-button,button.outline,div.pages a.selected,form[name=post] input[type=submit],input[value=Next],input[value=Previous],label[for=q-spoiler-image]{background:linear-gradient(rgb(var(--sc-mainColor-shift15)),rgb(var(--sc-mainColor-rgb)))!important}#quick-reply input[type=submit]:hover,.import-input:hover+.options-button,.options-button:hover,button.outline:hover,div.pages a.selected:hover,form[name=post] input[type=submit]:hover,input[value=Next]:hover,input[value=Previous]:hover{background:rgb(var(--sc-mainColor-shift15))}#link-quick-reply:hover,:root.vertical-qr #quick-reply .handle{background:rgb(var(--sc-mainColor-rgb))}#quick-reply input,input[type=text],select,textarea{background:var(--sc-inputColor)!important;transition:background .2s,color .2s,border-color .2s!important}input[type=checkbox]{background:rgb(var(--sc-inputColor-shift25))!important}#quick-reply input:hover,input[type=checkbox]:hover,input[type=text]:hover,select:hover,textarea:hover{background:rgb(var(--sc-inputColor-hover))!important}hr:not(#unread-line){background-image:linear-gradient(to left,rgba(var(--sc-brderColor-rgb),0),rgb(var(--sc-brderColor-rgb)),rgba(var(--sc-brderColor-rgb),0))}#unread-line{background-image:linear-gradient(to left,rgba(var(--sc-unreadColor-rgb),0),rgb(var(--sc-unreadColor-rgb)),rgba(var(--sc-unreadColor-rgb),0))}div.post.reply[style*='box-shadow: 0 3px red'],div.post.reply[style*='box-shadow: 0px 3px red'],div.post.reply[style*='box-shadow: red 0px 3px']{box-shadow:0 3px rgb(var(--sc-unreadColor-rgb))!important}.post-hover{background:rgba(var(--sc-hoverColor-rgb),var(--sc-hoverOp))!important}.inline{background:rgba(var(--sc-hoverColor-rgb),var(--sc-hoverOp))!important}:root.post-info .reply>p.intro{background:rgba(var(--sc-mainColor-shiftM16),.2);border-bottom:1px solid rgb(var(--sc-mainColor-shift4))}.reply,:root.op-background .post.op{border-width:0 1px 1px 0;border-style:solid}:root.borders-all .reply,:root.borders-all.op-background .post.op{border-width:1px!important}:root.borders-none .reply,:root.borders-none.op-background .post.op{border:0!important}.post-menu ul,img.thread-image{border-radius:0!important}:root.rounded-corners #add-theme,:root.rounded-corners #alert_div,:root.rounded-corners #link-quick-reply,:root.rounded-corners #oneechan-options,:root.rounded-corners #options_div,:root.rounded-corners #pin-settings,:root.rounded-corners #quick-reply .handle,:root.rounded-corners #quick-reply input[type=submit],:root.rounded-corners #thread_stats,:root.rounded-corners .color-picker-btn,:root.rounded-corners .options-button,:root.rounded-corners .post-hover,:root.rounded-corners .post-menu ul,:root.rounded-corners .preview-border,:root.rounded-corners .reply,:root.rounded-corners .watch-menu,:root.rounded-corners button.outline,:root.rounded-corners div.pages a.selected,:root.rounded-corners img.board_image,:root.rounded-corners img.post-image,:root.rounded-corners img.thread-image,:root.rounded-corners input,:root.rounded-corners input[value=Next],:root.rounded-corners input[value=Previous],:root.rounded-corners label.tab-label,:root.rounded-corners label[for=q-spoiler-image],:root.rounded-corners select,:root.rounded-corners textarea,:root.rounded-corners.op-background .post.op{border-radius:3px!important}:root.post-info.rounded-corners .reply>p.intro,:root.rounded-corners #quick-reply,:root.rounded-corners:root.vertical-qr #quick-reply .handle{border-radius:3px 3px 0 0!important}#alert_div,#header-bar.dialog,#options_div,#pin-settings,#quick-reply,#quick-reply select,.post-hover,.reply,:root.op-background .post.op,:root.vertical-qr #quick-reply .handle,fieldset,select{border-color:var(--sc-brderColor)!important}#quick-reply,#quick-reply select,.watch-menu,:root.vertical-qr #quick-reply .handle,form table th,form[name=post] table td,input,label[for=q-spoiler-image],select,textarea{border:1px solid var(--sc-inputbColor)!important}#link-quick-reply,.options-button,button.outline,div.pages a.selected,input[value=Next],input[value=Previous]{border-style:solid;border-width:1px;border-color:rgb(var(--sc-mainColor-shiftM15)) rgb(var(--sc-mainColor-shiftM15)) rgb(var(--sc-mainColor-shiftM30))!important}button.outline{color:var(--sc-textColor)!important;cursor:pointer}#quick-reply input:focus,input[type=text]:focus,select:focus,textarea:focus{border:1px solid var(--sc-linkColor)!important}.boardlist{border:none!important}img.thread-image{box-shadow:0 0 5px rgba(0,0,0,.25)}#quick-reply,.watch-menu{box-shadow:1px 1px 3px rgba(0,0,0,.1)!important}div.ban{background:rgb(var(--sc-mainColor-rgb))!important;border:1px solid var(--sc-brderColor)!important}div.ban h2{background:var(--sc-headerBGColor)!important;color:var(--sc-headerColor)!important}.ban-reason-table td,.ban-reason-table th{border-color:var(--sc-brderColor)!important}.ban-reason-table th{background-color:var(--sc-headerBGColor)!important;color:var(--sc-headerColor)!important}:root.alt-spoiler span.spoiler,:root.alt-spoiler span.spoiler:not(:hover)>a{color:#fff;background:none repeat scroll 0 0 #fff}:root.alt-spoiler span.spoiler:focus,:root.alt-spoiler span.spoiler:hover{color:#000}#link-quick-reply,.boardlist,::placeholder,button,form,header h1,input,select,span,textarea{font-family:inherit!important;font-size:inherit!important}body{font-family:" + ($SS.conf["Custom Font"] ? "'" + $SS.conf["Custom Font"] + "'" : $SS.formatFont($SS.conf["Font Family"])) + "!important;font-size:" + $SS.conf["Font Size"] + "px!important}.post-menu{font-size:" + $SS.conf["Font Size"] + "px!important}.theme-catalog .replies>strong,p.fileinfo,span.omitted{font-size:82%!important}header h1{font-weight:400!important;font-size:" + (($SS.conf["Font Size"] < 13) ? 22 : 26) + "px!important}pre span{font-family:monospace!important;font-size:medium!important}body>.boardlist{font-size:" + ($SS.conf["Font Size"] - 1) + "px!important}@media (min-width:1280px) and (max-width:1920px){.boardlist{word-spacing:" + (($SS.conf["Font Size"] < 14) ? -1 : -2) + "px}}:root:not(.backlink-icon) p.intro .clone-mentioned a,:root:not(.backlink-icon) p.intro .mentioned a{font-size:" + $SS.conf["Backlink Font Size"] + "px!important}#alert_div,#link-quick-reply,#oneechan-options,#options_div,.options-button,.tab-label,.theme-preview,a.options-button{font-size:" + (($SS.conf["Font Size"] >= 18) ? 18 : ($SS.conf["Font Size"] <= 9 ? 9 : $SS.conf["Font Size"])) + "px!important}#quick-reply .handle,#quick-reply .handle::before,#quick-reply input[type=submit],#quick-reply label,button.outline,select:not(#oneechan-options select,#add-theme select){font-size:" + $SS.conf["UI Font Size"] + "px!important}#quick-reply input[type=submit],#quick-reply label{text-transform:uppercase}#quick-reply label{overflow:hidden;padding-bottom:2px}:root.underline-disabled a{text-decoration:none!important}#thread-interactions a{text-decoration:underline}:root.underline-quotes div.body a.quotelink,:root.underline-quotes div.body a[onclick*=citeReply],:root.underline-quotes div.body a[onclick*=highlightReply],:root.underline-quotes p.intro .clone-mentioned a,:root.underline-quotes p.intro .mentioned a{text-decoration:underline!important}#oneechan-version a,a.options-button{text-decoration:none!important}.option.header .option-title,.tab-label.selected,span.name,span.subject{font-weight:" + ($SS.conf["Bitmap Font"] ? "normal" : "bold") + "!important}.tab-label:not(.selected):not(:hover){font-weight:400;opacity:.85}form table th{font-weight:700}span.omitted{font-style:" + ($SS.conf["Bitmap Font"] ? 'none' : 'italic') + "}"+$SS.theme.customCSS+" "+($SS.conf["Sidebar Position"] !== 3 ? " :root.left-sidebar body{padding-left:306px}:root.right-sidebar body{padding-right:306px}:root.left-sidebar:not(.mini-sidebar) header,:root.left-sidebar:not(.mini-sidebar) img.board_image,:root.right-sidebar:not(.mini-sidebar) header,:root.right-sidebar:not(.mini-sidebar) img.board_image{position:fixed;margin:0}:root.left-sidebar:not(.mini-sidebar) header,:root.left-sidebar:not(.mini-sidebar) img.board_image{left:2px}:root.right-sidebar:not(.mini-sidebar) header,:root.right-sidebar:not(.mini-sidebar) img.board_image{right:2px}:root.left-sidebar:not(.mini-sidebar) img.board_image,:root.right-sidebar:not(.mini-sidebar) img.board_image{top:24px}:root.left-sidebar:not(.mini-sidebar) header,:root.right-sidebar:not(.mini-sidebar) header{top:128px;width:302px}:root.right-sidebar:not(.mini-sidebar) a.quick-reply-btn{top:230px!important}:root.left-sidebar #quick-reply{left:0!important;right:auto!important}:root.right-sidebar #quick-reply{right:0!important;left:auto!important}:root.ss-sidebar body::before{background:var(--sc-sidebar-bg);border-left:2px solid rgba(var(--sc-mainColor-rgb),.9);box-shadow:inset var(--sc-brderColor) 1px 0 0,inset var(--sc-brderColor) -1px 0 0;content:'';height:100%;width:306px;box-sizing:border-box;position:fixed;top:0;right:0;pointer-events:none}:root.ss-sidebar.left-sidebar body::before{border-right:2px solid rgba(var(--sc-mainColor-rgb),.9);border-left:none!important;left:0;right:auto!important}:root.vertical-qr:root.left-sidebar #quick-reply{transform:translateX(-100%);left:0!important;right:auto!important}:root.vertical-qr:root.left-sidebar #quick-reply th{transform:rotate(90deg);transform-origin:bottom left;right:auto;left:100%}:root.mini-sidebar:root.left-sidebar body{padding-left:32px!important}:root.mini-sidebar:root.right-sidebar body{padding-right:32px!important}:root.mini-sidebar header div.subtitle{display:none}:root.mini-sidebar:root.ss-sidebar body::before{width:31px!important}:root.mini-sidebar header h1{top:72px!important;letter-spacing:-1.4px;position:fixed;margin:0;padding-top:.05em}:root.mini-sidebar:root.right-sidebar header h1{right:32px;transform-origin:top right;transform:rotate(-90deg)}:root.mini-sidebar:root.left-sidebar header h1{left:32px;transform-origin:top left;transform:rotate(90deg)}" : "")+" #quick-reply{box-shadow:none!important;border-radius:0!important;margin:0!important}#quick-reply .close-btn{padding:2px 3px 2px 4px!important}#quick-reply input[type=checkbox]{margin:0 4px 1px;vertical-align:baseline;position:relative;top:3px}#quick-reply input[type=submit]{height:25px!important;margin:0!important}form[name=post]:not(#quick-reply) input[type=submit]{height:22px!important}#quick-reply select{margin:1px 0!important}#quick-reply input[type=text]{min-width:0!important}#quick-reply .st-submit-row input[type=submit]{width:100%!important;margin-top:1px!important}:root.expand-inputs form[name=post] input[type=text]{width:100%;box-sizing:border-box}#quick-reply textarea{min-height:25px!important}:root.left-sidebar #quick-reply textarea,:root.right-sidebar #quick-reply textarea{max-width:302px!important}:root.qr-background #quick-reply,:root.qr-background #quick-reply table{background:0 0!important;border:none}:root.qr-opacity #quick-reply{opacity:.9}:root.vertical-qr #quick-reply .close-btn{display:none}:root.vertical-qr #quick-reply textarea{resize:vertical!important;z-index:1}:root.vertical-qr #quick-reply{top:auto!important;position:fixed;right:0!important;left:auto!important;bottom:0!important;transform:translateX(100%);max-width:300px!important}:root.vertical-qr #quick-reply.focus,:root.vertical-qr #quick-reply:hover{transform:translateX(0)!important}:root.qr-transition.vertical-qr #quick-reply{transition:transform .3s ease-in-out .1s!important}:root.vertical-qr #quick-reply th{display:block;position:absolute;bottom:140px;right:100%;width:max-content;min-width:105px;padding:2px 2px 4px 4px;text-align:center;cursor:default;transform:rotate(-90deg);transform-origin:bottom right;white-space:nowrap}:root.vertical-qr #quick-reply th .handle{float:none;display:inline;width:auto}:root.vertical-qr #quick-reply.focus th,:root.vertical-qr #quick-reply:hover th{opacity:0!important;transition:opacity .42s linear}:root.fade-qr #quick-reply:not(.focus):not(:hover){opacity:.2!important;transition:opacity .2s ease-in-out 1s!important}form[name=post] .cf-turnstile{margin:1px auto}#quick-reply th .handle{text-transform:uppercase}.dropzone{color:var(--sc-textColor)!important;background:var(--sc-inputColor)!important;border:1px dashed var(--sc-inputbColor)!important}.dropzone .file-hint{color:rgba(var(--sc-textColor-rgb),.5)!important}.dropzone.dragover .file-hint,.dropzone:hover .file-hint{color:var(--sc-textColor)!important}.dropzone.dragover{background:rgb(var(--sc-inputColor-hover))!important;border-color:var(--sc-linkColor)!important}:root.rounded-corners .dropzone{border-radius:3px!important}.upload-filename-wrapper{gap:2px;align-items:center}#upload_filename input[name=filename]{box-sizing:border-box}#quick-reply #emote-menu{background:var(--sc-inputColor)!important;border:1px solid var(--sc-inputbColor)!important;box-sizing:border-box!important;transition:background .2s}#quick-reply td:has(> #emote-menu){position:relative}#quick-reply td:has(> #emote-menu) input[name=subject]{display:block;width:100%!important;max-width:calc(100% - 26px)!important;box-sizing:border-box}#quick-reply td:has(> #emote-menu) #emote-menu{float:none!important;position:absolute!important;top:0!important;right:0!important;bottom:0!important;height:auto!important;width:22px!important;margin:0!important}#quick-reply #emote-menu:hover{background:rgb(var(--sc-inputColor-hover))!important}:root.rounded-corners #quick-reply #emote-menu{border-radius:3px}#quick-reply #emote-list{background:var(--sc-inputColor)!important;border:1px solid var(--sc-inputbColor)!important;box-sizing:border-box}:root.rounded-corners #quick-reply #emote-list{border-radius:3px}#quick-reply #emote-list>img:hover{background:rgb(var(--sc-inputColor-shift25))}:root.backlink-icon p.intro .clone-mentioned a,:root.backlink-icon p.intro .mentioned a{font-size:0!important;padding:" + (($SS.conf["Font Size"] < 12) ? 5 : 6) + "px!important;margin-right:0!important;opacity:.6!important;position:relative;bottom:5px;left:2px;background-image:var(--sc-icon-backlink)!important}:root.backlink-icon p.intro .clone-mentioned a:hover,:root.backlink-icon p.intro .mentioned a:hover{opacity:1!important}:root.backlink-icon p.intro .clone-mentioned a.inline-active,:root.backlink-icon p.intro .mentioned a.inline-active{background-image:var(--sc-icon-downArrow)!important;opacity:1!important}:root.use-sc-icons p.intro i.fa.fa-lock,:root.use-sc-icons p.intro i.fa.fa-thumb-tack{color:transparent!important;font-size:0!important;background-color:transparent!important;background-position:center!important;background-repeat:no-repeat;display:inline-block;height:0!important;padding-top:16px!important;text-indent:-9999px!important;vertical-align:bottom;width:16px!important}:root.use-sc-icons p.intro i.fa.fa-lock{background-image:var(--sc-icon-threadClosed)!important}:root.use-sc-icons p.intro i.fa.fa-thumb-tack{background-image:var(--sc-icon-threadPinned)!important}#StyleTowerLink{float:right;margin-left:4px}:root.use-sc-icons #StyleTowerLink{font-size:0!important}:root.use-sc-icons #StyleTowerLink a,:root.use-sc-icons .boardlist>a[title=Options]{font-size:0!important;display:inline-block;width:15px;height:15px;background-position:center;background-repeat:no-repeat;background-size:contain;vertical-align:text-bottom;opacity:.8}:root.use-sc-icons #StyleTowerLink a{background-image:var(--sc-icon-menu)}:root.use-sc-icons .boardlist>a[title=Options]{background-image:var(--sc-icon-options)}:root.use-sc-icons #StyleTowerLink a:hover,:root.use-sc-icons .boardlist>a[title=Options]:hover{opacity:1}:root.use-sc-icons #scroll-buttons img{display:none}:root.use-sc-icons #scroll-buttons a::before{content:'';display:block;width:32px;height:32px;background-image:var(--sc-icon-downArrow);background-position:center;background-repeat:no-repeat;background-size:contain;opacity:.7}:root.use-sc-icons #scroll-buttons a:hover::before{opacity:1}:root.use-sc-icons #scroll-buttons a#nav-to-top::before{transform:rotate(180deg)}:root.hl-border .post.reply,:root.op-background.hl-border .post.op{border-left:" + $SS.conf["Width Decoration"] + "px " + $SS.conf["Highlight Style"] + " rgba(var(--sc-postHLColor-rgb)," + (($SS.conf["Opacity"] || 100) / 100) + ")!important}:root.hl-border-down .post.reply,:root.op-background.hl-border-down .post.op{border-bottom:" + $SS.conf["Width Decoration"] + "px " + $SS.conf["Highlight Style"] + " rgba(var(--sc-postHLColor-rgb)," + (($SS.conf["Opacity"] || 100) / 100) + ")!important}:root.hl-outline .post.reply,:root.op-background.hl-outline .post.op{outline:" + $SS.conf["Width Decoration"] + "px " + $SS.conf["Highlight Style"] + " rgba(var(--sc-postHLColor-rgb)," + (($SS.conf["Opacity"] || 100) / 100) + ")}.post-hover{outline:2px solid rgba(var(--sc-hoverOutColor-rgb),var(--sc-hoverOutOp))!important}:root.oneechan.highlight-you .hasQuoteYou.post.op,:root.oneechan.highlight-you .hasQuoteYou.post.reply,:root.oneechan.highlight-you .quoting-you.post.op,:root.oneechan.highlight-you .quoting-you.post.reply{border-left:" + $SS.conf["Width Decoration"] + "px solid rgba(var(--sc-quotesYouHLColor-rgb)," + (($SS.conf["Opacity"] || 100) / 100) + ")!important}:root.oneechan.highlight-own .post.op.you,:root.oneechan.highlight-own .post.reply.you,:root.oneechan.highlight-own .yourPost.post.op,:root.oneechan.highlight-own .yourPost.post.reply{border-left:" + $SS.conf["Width Decoration"] + "px dashed rgba(var(--sc-ownPostHLColor-rgb)," + (($SS.conf["Opacity"] || 100) / 100) + ")!important}.reply.highlighted,.reply:target{background:rgba(var(--sc-replybgHLColor-rgb),.8)!important}.reply.highlighted,.reply:target{outline:1px solid rgba(var(--sc-replyslctColor-rgb),.8)!important}:root.oneechan div.body a.inline-active,:root.oneechan p.intro .clone-mentioned a.inline-active,:root.oneechan p.intro .mentioned a.inline-active{color:var(--sc-linkHColor)!important;font-weight:700!important;text-decoration:underline dotted!important;opacity:.85}:root.oneechan div.body a.inline-active:hover,:root.oneechan p.intro .clone-mentioned a.inline-active:hover,:root.oneechan p.intro .mentioned a.inline-active:hover{opacity:1}.theme-catalog div.thread .replies{margin-left:5px;margin-right:5px}.theme-catalog #Grid div.thread{margin:2px 1px 0 0}select#image_size,select#sort_by{margin-top:4px}.theme-catalog div.threads{padding:10px 0!important}:root.catalog-justify .theme-catalog .replies{text-align:justify!important;text-align-last:center;hyphens:auto}.theme-catalog div.thread:hover{background:rgba(var(--sc-hoverColor-rgb),var(--sc-hoverOp))!important;border-color:var(--sc-brderColor)!important}:root.catalog-background .theme-catalog #Grid div.thread{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important}:root.rounded-corners.catalog-background .theme-catalog #Grid div.thread{border-radius:3px!important}:root.catalog-background .theme-catalog .replies{margin:0 5px 5px 5px}:root.catalog-background .theme-catalog img.thread-image{margin-top:8px}:root.catalog-thumbsize .theme-catalog img.thread-image{width:150px!important;height:150px!important;max-width:none!important;max-height:none!important}:root.catalog-thumbsize .theme-catalog div.grid-size-large img.thread-image{width:250px!important;height:250px!important}:root.st-home body{background:var(--sc-bgColor)!important;color:var(--sc-textColor)!important}:root.st-home .page a{color:var(--sc-linkColor)}:root.st-home .page a:hover{color:var(--sc-linkHColor)}:root.st-home #page{background:var(--sc-bgColor)!important;border-color:var(--sc-brderColor)!important;box-shadow:0 0 0 4px rgba(0,0,0,.3)!important}:root.st-home #layout,:root.st-home .main-column{background:var(--sc-bgColor)!important}:root.st-home .left-column{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important}:root.st-home .sub-panel{background:rgb(var(--sc-mainColor-rgb))!important;border-color:var(--sc-inputbColor)!important}:root.st-home .right-panel{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important}:root.st-home .poll-results,:root.st-home .thread-list li,:root.st-home .window-mods .info-list li{border-color:rgba(var(--sc-brderColor-rgb),.5)!important}:root.st-home .featured-frame{background:var(--sc-inputColor)!important}:root.st-home .poll-button{background:rgb(var(--sc-mainColor-rgb))!important;border-color:var(--sc-inputbColor)!important;color:var(--sc-textColor)!important}:root.st-home .poll-button.secondary,:root.st-home .poll-button:hover{background:rgb(var(--sc-mainColor-shift15))!important}:root.st-home #top-banner{background:rgba(var(--sc-headerBGColor-rgb),var(--sc-navOp))!important;border-bottom-color:var(--sc-brderColor)!important}:root.st-home .top-tagline{color:var(--sc-headerColor)}:root.st-home .top-tagline-subtext{color:var(--sc-headerColor);opacity:.7}:root.st-home a.top-nav-link{background:rgb(var(--sc-mainColor-rgb))!important;border-color:var(--sc-brderColor)!important;color:var(--sc-linkColor)!important}:root.st-home a.top-nav-link:hover{background:rgb(var(--sc-mainColor-shift15))!important;color:var(--sc-linkHColor)!important}:root.st-home .side-panel{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important}:root.st-home a.menu-button{background:rgb(var(--sc-mainColor-rgb))!important;border-color:var(--sc-brderColor)!important;color:var(--sc-textColor)!important}:root.st-home a.menu-button:hover{background:rgb(var(--sc-mainColor-shift15))!important}:root.st-home .friend-name,:root.st-home .panel-heading,:root.st-home .side-heading,:root.st-home .skyline-friends-title,:root.st-home .skyline-title{color:var(--sc-titleColor)!important}:root.st-home .skyline-subtitle{color:var(--sc-textColor)!important;opacity:.8}:root.st-home .skyline{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important}:root.st-home .skyline-right{border-color:var(--sc-brderColor)!important}:root.st-home .ticker{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important}:root.st-home .window{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important;box-shadow:2px 2px 0 rgba(0,0,0,.35)!important}:root.st-home .window-titlebar{background:rgb(var(--sc-headerBGColor-rgb))!important;color:var(--sc-headerColor)!important}:root.st-home .thread-title{color:var(--sc-linkColor)}:root.st-home .thread-meta,:root.st-home .thread-stats{opacity:.7}:root.st-home .featured-frame{border-color:var(--sc-brderColor)!important}:root.st-home .music-player{background:rgb(var(--sc-mainColor-rgb))!important;border-color:var(--sc-brderColor)!important}:root.st-home .music-display{background:var(--sc-inputColor)!important;border-color:var(--sc-inputbColor)!important}:root.st-home .music-label{color:var(--sc-textColor);opacity:.7}:root.st-home .music-button{background:rgb(var(--sc-mainColor-rgb))!important;border-color:var(--sc-inputbColor)!important;color:var(--sc-textColor)!important}:root.st-home .music-button:hover{background:rgb(var(--sc-mainColor-shift15))!important}:root.st-home .music-seek{background:var(--sc-inputColor)!important;border-color:var(--sc-inputbColor)!important}:root.st-home .music-seek::-webkit-slider-runnable-track{background:var(--sc-inputColor)!important}:root.st-home .music-seek::-webkit-slider-thumb{background:var(--sc-textColor)!important;border-color:var(--sc-inputbColor)!important}:root.st-home .music-seek::-moz-range-track{background:var(--sc-inputColor)!important}:root.st-home .music-seek::-moz-range-thumb{background:var(--sc-textColor)!important;border-color:var(--sc-inputbColor)!important}:root.st-home .music-playlist li.active{background:rgb(var(--sc-mainColor-shift15))!important}:root.st-home #footer{background:rgba(var(--sc-mainColor-rgb),var(--sc-replyOp))!important;border-color:var(--sc-brderColor)!important;color:var(--sc-textColor)!important}#styletower-notifications{position:fixed;top:38px;right:10px;z-index:65;width:min(320px,calc(100vw - 20px));display:flex;flex-direction:column;gap:6px;pointer-events:none}:root.bottom-header #styletower-notifications{top:auto;bottom:10px}.styletower-notification{pointer-events:auto;cursor:pointer;padding:7px 10px;border:1px solid;border-left-width:3px;border-radius:3px;box-shadow:rgba(0,0,0,.25) 0 2px 8px;opacity:0;transform:translateY(-4px);transition:opacity .15s ease,transform .15s ease;overflow-wrap:anywhere;font-size:12px;line-height:1.35;min-height:10px}.styletower-notification.visible{opacity:1;transform:translateY(0)}.styletower-notification.closing{opacity:0;transform:translateY(-4px)}.styletower-notification-text{pointer-events:none}.styletower-notification-text a{pointer-events:auto}#styletower-notifications .styletower-notification{color:var(--sc-textColor)!important;background:rgb(var(--sc-mainColor-rgb))!important;border-color:rgb(var(--sc-brderColor-rgb))!important;border-left-color:var(--sc-linkColor)!important}#styletower-notifications .styletower-notification-info{border-left-color:#6f8fb3!important}#styletower-notifications .styletower-notification-warning{border-left-color:#c7a85a!important}#styletower-notifications .styletower-notification-error{border-left-color:#c06b6b!important}#styletower-notifications .styletower-notification-success{border-left-color:var(--sc-quoteColor)!important}:root.ts-notifs #notification_container{position:fixed;top:38px;right:10px;left:auto;z-index:65;width:min(320px,calc(100vw - 20px));display:flex;flex-direction:column;gap:6px}:root.ts-notifs #notification_container .message_notification{margin:0!important;padding:0!important;background:0 0!important;border:none!important;width:auto!important}:root.ts-notifs #notification_container .notification_div{cursor:pointer;padding:7px 10px!important;border:1px solid rgb(var(--sc-brderColor-rgb))!important;border-left:3px solid var(--sc-linkColor)!important;border-radius:3px;box-shadow:rgba(0,0,0,.25) 0 2px 8px;overflow-wrap:anywhere;font-size:12px;line-height:1.35;min-height:10px;color:var(--sc-textColor)!important;background:rgb(var(--sc-mainColor-rgb))!important}:root.ts-notifs #notification_container .notification_div a.notification_close{float:right;margin-left:6px;color:var(--sc-linkColor)!important}:root.ts-notifs #notification_container .notification_div .alert_message{display:inline;margin:0!important;padding:0!important}"+($SS.conf["Center Notifications"] ? "#styletower-notifications{right:auto;left:50%;transform:translateX(-50%);width:min(500px,calc(100vw - 20px))}.ts-notifs #notification_container{right:auto!important;top:30px!important;left:50%!important;transform:translateX(-50%)!important;width:min(480px,calc(100vw - 20px))!important}" : "")+" "+($SS.conf["Full Border"] ? "#styletower-notifications .styletower-notification,.ts-notifs #notification_container .notification_div{border:" + $SS.conf["Width Decoration"] + "px " + $SS.conf["Highlight Style"] + "!important}#styletower-notifications .styletower-notification-info{border-color:#6f8fb3!important}#styletower-notifications .styletower-notification-warning{border-color:#c7a85a!important}#styletower-notifications .styletower-notification-error{border-color:#c06b6b!important}#styletower-notifications .styletower-notification-success{border-color:var(--sc-quoteColor)!important}" : "")+" "+($SS.conf["Style Scrollbars"] ? ":root{scrollbar-color:var(--sc-titleColor) var(--sc-bgColor)}#emote-list,.field{scrollbar-color:var(--sc-textColor) var(--sc-inputColor)}" : "")+" "+($SS.conf["Style Scrollbars"] && $SS.conf["Thin Scrollbars"] ? "*{scrollbar-width:thin}" : "")+" #add-theme,#oneechan-options{border:0!important;position:fixed;margin:auto}#oneechan-options{min-width:30em;max-width:45%;text-align:left!important;height:65vh;max-height:100em;top:0;bottom:0;left:0;right:0;box-shadow:rgba(0,0,0,.6) 0 0 10px!important;padding:.4em .4em 2.7em .4em}#options-container:not(.yui-skin-sam){padding:3px;box-shadow:inset rgba(0,0,0,.3) 0 0 5px;border-radius:5px}#options-container:not(.yui-skin-sam),.options-section{height:100%}.options-section{overflow-y:auto;overflow-x:hidden}#main-section .option,#mascot-section .option,#misc-section .option{display:block;border-top:1px solid rgba(0,0,0,.1);height:1.7em;padding:0 .45em}#main-section .option[hidden],#mascot-section .option[hidden],#misc-section .option[hidden]{display:none!important}#main-section>.option:nth-of-type(2n),#mascot-section>.option:nth-of-type(2n),#misc-section>.option:nth-of-type(2n){background:var(--sc-mainColor-shiftM5)!important}#main-section .buttons-container+.option,#mascot-section .buttons-container+.option{border-top:none!important}.option-title{line-height:1.7em}#main-section .option:first-child,#mascot-section .option:first-child,#misc-section .option:first-child{border-top:0!important}#main-section .option:last-child,#mascot-section .option:last-child,#misc-section .option:last-child{border-bottom:0!important}#main-section input,#main-section select,#mascot-section .option>input,#misc-section input,#misc-section select{float:right!important}#main-section input[type=checkbox],#mascot-section .option>input[type=checkbox],#misc-section input[type=checkbox]{float:left!important;margin-right:5px!important}input[name='Font Family']::-webkit-calendar-picker-indicator,input[name='Font Family']::-webkit-list-button{display:none!important}.suboption::before{border-bottom:1px solid rgba(0,0,0,.1);border-left:1px solid rgba(0,0,0,.1);content:'';display:inline-block;margin-right:2px;height:50%;width:6px}.suboption{padding-left:16px!important}.option.header{cursor:auto!important}.option.header.has-subsections .option-title::after{content:' ▾';font-size:.7em}.theme-preview{cursor:default}.theme-preview blockquote{margin:12px 40px!important}#themes-section .reply{padding:2px!important;position:relative;text-align:left;width:99.4%;border-radius:0!important}.theme-buttons-container{bottom:4px;right:2px;margin:0;opacity:0;position:absolute;z-index:3}.theme-preview:hover .theme-buttons-container{opacity:1}.theme-buttons-container>a{display:inline-block;margin:0 2px;padding:2px 5px;text-align:center;width:50px;border-radius:3px}.theme-preview .sfw-label{bottom:-5px;font-size:32px!important;margin:0!important;opacity:0;position:absolute;right:300px}.theme-preview.nsfw.selected .both,.theme-preview.nsfw:not(.selected) .sfw-label,.theme-preview.selected:not(.nsfw) .sfw-label{transition:opacity .3s,right .3s}.theme-preview.nsfw .notsafe,.theme-preview.selected .safe,.theme-preview.selected.nsfw .both{opacity:1;right:3px;z-index:1}.theme-preview.selected.nsfw .sfw-label:not(.both){opacity:0!important;right:300px!important;z-index:0!important}.theme-preview-post{flex-shrink:0;margin-bottom:8px;background:var(--sc-mainColor);font-size:11px;line-height:1.4;cursor:default;text-align:left;border-bottom:1px solid var(--sc-brderColor);padding-bottom:12px;box-shadow:0 9px 15px -12px rgba(0,0,0,.25)}.theme-preview-post .preview-border{display:block;border:1px solid var(--sc-brderColor);padding:6px;cursor:pointer}.theme-preview-post .preview-border:hover{outline:1px dashed var(--sc-linkColor)}.theme-preview-post [data-color]{cursor:pointer;transition:outline .1s}.theme-preview-post [data-color]:hover{outline:1px dashed var(--sc-linkColor)}.preview-name{color:var(--sc-nameColor);font-weight:700}.preview-trip{color:var(--sc-tripColor)}.preview-subject{color:var(--sc-titleColor);font-weight:700}.preview-quote{color:var(--sc-quoteColor)}.preview-backlink{color:var(--sc-blinkColor)}.preview-date{color:var(--sc-textColor);font-size:10px}.preview-postnum .preview-link{color:var(--sc-linkColor)}.preview-link{text-decoration:underline;cursor:pointer}.theme-preview-post .theme-preview-hover{display:block;margin:8px 4px 8px 14px;padding:6px;background:rgba(var(--sc-hoverColor-rgb),var(--sc-hoverOp));outline:2px solid rgba(var(--sc-hoverOutColor-rgb),var(--sc-hoverOutOp));cursor:pointer;font-size:11px}.theme-body{flex:1 1 auto;min-height:0;overflow-y:auto}.side-switch{position:absolute;top:4px;right:8px;cursor:pointer;font-size:16px;opacity:.5;z-index:1}.side-switch:hover{opacity:1}#add-theme{padding:20px!important;position:fixed;top:0;right:0;left:auto;max-height:100vh;height:calc(100vh - 2.2em);max-width:45vw;overflow:hidden;text-align:left!important;box-sizing:border-box;display:flex;flex-direction:column;gap:6px;margin:2em .2em!important;box-shadow:-2px 0 12px rgba(0,0,0,.3)!important}#add-theme.left{right:auto;left:0;box-shadow:2px 0 12px rgba(0,0,0,.3)}#add-theme.left .side-switch{right:auto;left:8px}#add-theme .option-title{float:left;padding-left:5px;min-width:120px}#add-theme .theme-fields>label{line-height:22px;display:flex;justify-content:space-between;align-items:center;width:100%;padding:2px 4px;box-sizing:border-box;border:1px solid transparent}#add-theme .theme-fields>label:nth-child(2n){background:rgba(var(--sc-mainColor-shiftM16),.35)}#add-theme .theme-fields>label.picked{outline:1px dashed var(--sc-linkColor);outline-offset:-2px}#add-theme .option-title{flex-shrink:0;padding-right:8px}#add-theme .theme-fields>label>input[type=text],#add-theme .theme-fields>label>select{width:auto;max-width:55%;appearance:auto;text-align:left}#add-theme .theme-body{flex:0 1 auto;min-height:0;max-height:calc(85vh - 90px);overflow-y:auto;scrollbar-width:none}#add-theme .theme-body::-webkit-scrollbar{display:none}#add-theme .theme-body>label#customCSS{width:100%;display:flex;flex-direction:column;min-height:0;text-align:left}#add-theme .theme-body>label#customCSS>textarea{width:100%;max-width:100%;min-height:5em;height:clamp(4em,24vh,34vh);max-height:48vh;flex:0 1 auto;box-sizing:border-box;resize:vertical;overflow-y:auto;font-family:monospace}#add-theme .theme-fields>label>input[type=text],#add-theme .theme-fields>label>select{width:auto;max-width:100%;appearance:auto}.color-picker-wrap{display:inline-flex;align-items:center;vertical-align:middle;gap:2px;margin-top:3px}#add-theme .color-hex{width:60px;height:20px;text-align:center;border:1px solid var(--sc-inputbColor)!important;border-radius:2px;outline:0;box-sizing:content-box;font-family:monospace;font-size:11px;background:0 0}.color-picker-btn{width:24px;height:24px;padding:0;border:1px solid var(--sc-inputbColor)!important;cursor:pointer;box-sizing:border-box;background:0 0}.color-picker-btn::-webkit-color-swatch-wrapper{padding:0}.color-picker-btn::-webkit-color-swatch{border:none}:root.rounded-corners #add-theme .color-hex,:root.rounded-corners .color-picker-btn{border-radius:3px!important}#add-theme>div{margin-top:.6em;text-align:left}#add-theme>.theme-buttons{flex:0 0 auto;margin-top:0;text-align:right;border-top:1px solid var(--sc-brderColor);padding-top:6px;box-shadow:0 -10px 12px -12px rgba(0,0,0,.25)}#options-tabs{list-style:none;margin:0;padding:0;position:absolute;top:-24px;left:-1px}.tab-item{float:left;margin:0;padding:0}.tab-label{display:block;height:16px;margin:0 1px;padding:5px;text-align:center;width:75px;transition:all .1s ease-in-out}#overlay{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:99!important;background-color:rgba(0,0,0,.3)!important}#overlay2{background:rgba(0,0,0,.1)!important;position:fixed;top:0;left:0;height:100%;width:100%;text-align:center;z-index:125!important}#overlay2::before{content:'';display:inline-block;height:100%;vertical-align:middle}#overlay.previewing{display:none}#overlay.previewing~#overlay2{background-color:rgba(0,0,0,0)!important}.buttons-container{bottom:3px;left:5px;right:5px;display:flex;justify-content:space-between;align-items:center;position:absolute;z-index:100;margin:0}.btn-center{text-align:center;flex:1}.btn-right{margin-left:auto}.options-button{display:inline-block;line-height:1.4em;margin:0 .15em;min-width:3em;padding:.15em .75em;text-align:center;cursor:pointer}.options-button-small{padding:.15em .4em;min-width:2.3em}#import-link{line-height:1.7em;overflow:hidden;position:relative;float:left;height:1.85em!important;margin-top:-.15em;padding-top:.15em}#import-settings{position:relative;overflow:hidden;vertical-align:bottom}#import-settings>.import-input{left:0}.import-input{position:absolute;opacity:0;cursor:pointer}label.option>input[type=checkbox]{margin:.3em .15em 0!important}.option>input[type=text],span.option>select{width:125px}#oneechan-options input[type=text],#oneechan-options select{max-height:1.55em;margin-top:0!important;padding:0 .25em!important}#oneechan-options textarea{background:0 0!important;border:0!important;height:100%!important;width:100%!important;resize:none}#oneechan-version{opacity:.7;font-size:x-small!important}.link-delim{opacity:.4}[data-tower-status]>.option-title::after,label.tab-label[data-tower-status]::after{display:inline-block;margin-left:6px;padding:0 5px;border-radius:8px;font-size:9px;font-weight:700;letter-spacing:.04em;line-height:14px;vertical-align:middle;white-space:nowrap}[data-tower-status=added]>.option-title::after,label.tab-label[data-tower-status=added]::after{content:'Tower';color:#fff;background:#3fb950}[data-tower-status=changed]>.option-title::after,label.tab-label[data-tower-status=changed]::after{content:'changed';color:#1a1a1a;background:#d29922}#mascot-section .option.mascot-gallery-wrap{height:auto!important;padding:4px 6px!important;overflow:visible}#mascot-section .option.mascot-gallery-wrap::before{display:none!important}.mascot-controls{display:flex;align-items:center;gap:4px;margin:2px 0 6px}.mascot-hint{opacity:.6;font-size:x-small;margin-left:6px}.mascot-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;padding:2px 0 6px}.mascot-empty{opacity:.6;font-style:italic;padding:8px 2px}.mascot-tile{position:relative;border:1px solid var(--sc-inputbColor);padding:4px 4px 2px;cursor:pointer;text-align:center;opacity:.5}.mascot-tile.selected{opacity:1;border-color:var(--sc-linkColor);box-shadow:0 0 3px var(--sc-linkColor)}:root.rounded-corners .mascot-tile{border-radius:3px}.mascot-tile img{max-width:100%;height:96px;object-fit:contain;display:block;margin:0 auto;pointer-events:none}.mascot-tile-name{display:block;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-top:2px}.mascot-tile-btns{position:absolute;top:2px;right:2px;display:none}.mascot-tile:hover .mascot-tile-btns{display:block}.mascot-tile-btns a{display:inline-block;min-width:16px;padding:0 3px;cursor:pointer;background:rgb(var(--sc-mainColor-rgb));border:1px solid var(--sc-inputbColor);margin-left:2px;text-decoration:none!important}.mascot-tile-btns a:hover{border-color:var(--sc-linkColor)}#add-mascot{display:inline-block;vertical-align:middle;text-align:left;padding:8px 10px;min-width:340px;max-width:440px;max-height:92vh;overflow-y:auto;border:0!important;box-shadow:rgba(0,0,0,.6) 0 0 10px!important}#add-mascot:not(.advanced) .adv-only{display:none!important}#add-mascot.advanced .simple-only{display:none!important}#add-mascot .mascot-mode-row{border-bottom:1px solid rgba(128,128,128,.35);padding-bottom:4px;margin-bottom:6px!important}#add-mascot .mascot-mode-row .option-title{font-weight:700}#add-mascot select.mascot-input{height:auto!important;flex:none;width:auto!important}#add-mascot .mascot-filter-head{border-bottom:1px solid rgba(128,128,128,.35);margin-top:8px!important;opacity:.8}#add-mascot .mascot-filter-head .option-title{width:auto;font-weight:700}:root.rounded-corners #add-mascot{border-radius:3px!important}#add-mascot .add-mascot-label{display:flex;align-items:center;gap:6px;margin:4px 0}#add-mascot .add-mascot-label>.option-title{width:125px;flex:none}#add-mascot .mascot-input{flex:1;min-width:0;height:20px!important;width:auto!important;float:none!important}#add-mascot .mascot-clip-inputs{display:flex;flex:1;gap:3px}#add-mascot .mascot-clip{width:34px!important;flex:1;text-align:center}#add-mascot input[type=range].mascot-opacity{flex:1;width:auto}#add-mascot .mascot-opacity-val{width:38px;flex:none}#mascot-buttons-container{text-align:right;margin-top:8px}input[type=range].mascot-opacity{width:64px;float:none!important;margin:0!important;padding:0!important;height:20px;appearance:none;background:0 0}input[type=range].mascot-opacity::-webkit-slider-runnable-track{height:4px;background:rgba(0,0,0,.2);border-radius:2px}input[type=range].mascot-opacity::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--sc-textColor);margin-top:-4px;cursor:pointer}input[type=range].mascot-opacity::-moz-range-track{height:4px;background:rgba(0,0,0,.2);border-radius:2px;border:none}input[type=range].mascot-opacity::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:var(--sc-textColor);border:none;cursor:pointer}.mascot-opacity-val{width:30px;font-size:11px;text-align:right;line-height:20px;margin-right:.3em}:root.rounded-corners .mascot-input,:root.rounded-corners .mascot-opacity-val{border-radius:3px!important}:root.rounded-corners input[type=range],:root.rounded-corners input[type=range]::-moz-range-track,:root.rounded-corners input[type=range]::-webkit-slider-runnable-track{border-radius:3px!important}:root.rounded-corners input[type=range]::-moz-range-thumb,:root.rounded-corners input[type=range]::-webkit-slider-thumb{border-radius:50%!important}#oneechan-options input[type=range].mascot-opacity{float:right!important}#oneechan-options .mascot-opacity-val{float:right;margin-right:.8em}";

            if (reload)
                $("#ch4SS").text(css);
            else
                $(getDocHead()).append($("<style type='text/css' id=ch4SS>").text(css));

            $SS.disableSiteTheme();
        },
        disableSiteTheme: function () {
            // localStorage.stylesheet is set purely so the site pre-paints in a
            // matching light/dark style before this script runs (flashbang
            // mitigation). Once our CSS is inserted the site theme (e.g.
            // tomorrow.css with its blue-grey replies) must stop competing.
            document.querySelectorAll("link#stylesheet").forEach(function (l) {
                l.onload = null;
                l.media = "none";
                l.disabled = true;
            });
        },
        setThemeVariables: function () {
            var t = $SS.theme;
            if (!t || t.hidden) return;
            var sidebarBgOpacity = !t.mainColor.isLight ? ".9" : ".2",
                hoverRGB = t.hoverColor ? t.hoverColor.rgb : t.mainColor.shiftRGB(-16),
                hoverOutRGB = t.hoverOutColor ? t.hoverOutColor.rgb : t.linkColor.rgb,
                css = ":root{" +
                // The disabled site theme used to declare this; without it
                // native widgets (scrollbars, checkboxes, select dropdowns)
                // render light-mode on dark themes
                "color-scheme:" + (t.bgColor.isLight ? "light" : "dark") + ";" +
                "--sc-textColor:" + t.textColor.hex + ";" +
                "--sc-textColor-rgb:" + t.textColor.rgb + ";" +
                "--sc-nameColor:" + t.nameColor.hex + ";" +
                "--sc-tripColor:" + t.tripColor.hex + ";" +
                "--sc-linkColor:" + t.linkColor.hex + ";" +
                "--sc-linkColor-rgb:" + t.linkColor.rgb + ";" +
                "--sc-linkHColor:" + t.linkHColor.hex + ";" +
                "--sc-linkHColor-rgb:" + t.linkHColor.rgb + ";" +
                "--sc-headerColor:" + t.headerColor.hex + ";" +
                "--sc-headerLColor:" + t.headerLColor.hex + ";" +
                "--sc-headerLHColor:" + t.headerLHColor.hex + ";" +
                "--sc-quoteColor:" + t.quoteColor.hex + ";" +
                "--sc-quoteColor-rgb:" + t.quoteColor.rgb + ";" +
                "--sc-titleColor:" + t.titleColor.hex + ";" +
                "--sc-boardColor:" + t.boardColor.hex + ";" +
                "--sc-blinkColor:" + t.blinkColor.hex + ";" +
                "--sc-qlColor:" + t.qlColor.hex + ";" +
                "--sc-bgColor:" + t.bgColor.hex + ";" +
                "--sc-bgColor-rgb:" + t.bgColor.rgb + ";" +
                "--sc-mainColor:" + t.mainColor.hex + ";" +
                "--sc-mainColor-rgb:" + t.mainColor.rgb + ";" +
                "--sc-mainColor-shiftM30:" + t.mainColor.shiftRGB(-30) + ";" +
                "--sc-mainColor-shiftM25:" + t.mainColor.shiftRGB(-25) + ";" +
                "--sc-mainColor-shiftM18:" + t.mainColor.shiftRGB(-18) + ";" +
                "--sc-mainColor-shiftM16:" + t.mainColor.shiftRGB(-16) + ";" +
                "--sc-mainColor-shiftM15:" + t.mainColor.shiftRGB(-15) + ";" +
                "--sc-mainColor-shiftM10:" + t.mainColor.shiftRGB(-10) + ";" +
                "--sc-mainColor-shiftM5:" + t.mainColor.shiftRGB(-5) + ";" +
                "--sc-mainColor-shift4:" + t.mainColor.shiftRGB(4) + ";" +
                "--sc-mainColor-shift10:" + t.mainColor.shiftRGB(10) + ";" +
                "--sc-mainColor-shift15:" + t.mainColor.shiftRGB(15) + ";" +
                "--sc-brderColor:" + t.brderColor.hex + ";" +
                "--sc-brderColor-rgb:" + t.brderColor.rgb + ";" +
                "--sc-inputColor:" + t.inputColor.hex + ";" +
                "--sc-inputColor-rgb:" + t.inputColor.rgb + ";" +
                "--sc-inputColor-shift25:" + t.inputColor.shiftRGB(25) + ";" +
                "--sc-inputColor-hover:" + t.inputColor.hover + ";" +
                "--sc-inputbColor:" + t.inputbColor.hex + ";" +
                "--sc-headerBGColor:" + t.headerBGColor.hex + ";" +
                "--sc-headerBGColor-rgb:" + t.headerBGColor.rgb + ";" +
                "--sc-headerBGColor-shift15:" + t.headerBGColor.shiftRGB(15) + ";" +
                "--sc-unreadColor-rgb:" + t.unreadColor.rgb + ";" +
                "--sc-threadHLColor-rgb:" + t.threadHLColor.rgb + ";" +
                "--sc-hoverColor-rgb:" + hoverRGB + ";" +
                "--sc-hoverOp:" + t.hoverOp + ";" +
                "--sc-hoverOutColor-rgb:" + hoverOutRGB + ";" +
                "--sc-hoverOutOp:" + t.hoverOutOp + ";" +
                "--sc-postHLColor-rgb:" + t.postHLColor.rgb + ";" +
                "--sc-quotesYouHLColor:" + t.quotesYouHLColor.hex + ";" +
                "--sc-quotesYouHLColor-rgb:" + t.quotesYouHLColor.rgb + ";" +
                "--sc-ownPostHLColor-rgb:" + t.ownPostHLColor.rgb + ";" +
                "--sc-replybgHLColor-rgb:" + t.replybgHLColor.rgb + ";" +
                "--sc-replyslctColor-rgb:" + t.replyslctColor.rgb + ";" +
                "--sc-codeBackground:" + t.codeBackground + ";" +
                "--sc-codeBorder:" + t.codeBorder + ";" +
                "--sc-replyOp:" + t.replyOp + ";" +
                "--sc-navOp:" + t.navOp + ";" +
                "--sc-sidebar-bg:rgba(" + t.mainColor.shiftRGB(-18) + "," + sidebarBgOpacity + ");" +
                "--sc-bgImg:" + t.bgImg.get() + ";" +
                "--sc-icon-star:url(\"data:image/svg+xml," + t.icons.star + "\");" +
                "--sc-icon-backlink:url(\"data:image/svg+xml," + t.icons.backlink + "\");" +
                "--sc-icon-downArrow:url(\"data:image/svg+xml," + t.icons.downArrow + "\");" +
                "--sc-icon-threadClosed:url(\"data:image/svg+xml," + t.icons.threadClosed + "\");" +
                "--sc-icon-threadPinned:url(\"data:image/svg+xml," + t.icons.threadPinned + "\");" +
                "--sc-icon-threadArchived:url(\"data:image/svg+xml," + t.icons.threadArchived + "\");" +
                "--sc-icon-msg:url(\"data:image/svg+xml," + t.icons.msg + "\");" +
                "--sc-icon-menu:url(\"data:image/svg+xml," + t.icons.menuIcon.replace("currentColor", "rgb(" + t.headerLColor.rgb + ")") + "\");" +
                "--sc-icon-options:url(\"data:image/svg+xml," + t.icons.options + "\");" +
                // Styling hooks exposed by Holotower TS
                "--subtle-border-color:" + t.brderColor.hex + ";" +
                "--inline-background-color:rgba(" + hoverRGB + "," + t.hoverOp + ");" +
                "--reply-background-color:rgba(" + t.mainColor.rgb + "," + t.replyOp + ");" +
                "--ts-hover-color:" + t.linkHColor.hex + ";" +
                "--link-hover-color:" + t.linkHColor.hex + ";" +
                "--text-color-muted:rgba(" + t.textColor.rgb + ",.5);" +
                "--error-text-color:#c06b6b;" +
                "--highlight-color:rgba(" + t.replyslctColor.rgb + ",.8)" +
                "}" +
                // Out-cascades htsu-style's per-site-theme var overrides (e.g. .tomorrow{--ts-hover-color})
                ":root.oneechan{--ts-hover-color:" + t.linkHColor.hex + ";--ts-mentioned-hover-color:" + t.linkHColor.hex + ";--ts-post-no-hover-color:" + t.linkHColor.hex + "}" +
                // Kept out of the cssmin pipeline, which mangles the `of` selector syntax.
                // Counts only real replies so TS's injected hover .post.dummy (and hover
                // clones / hidden posts) can't flip the even/odd parity.
                ":root.recolor-even .thread>.post.reply:nth-child(even of .post.reply:not(.post-hover):not(.hidden)):not(.highlighted,:target){" +
                "background:rgb(var(--sc-mainColor-shiftM10),var(--sc-replyOp))!important" +
                "}" +
                // Last-post margin exclusion, counting only real posts so TS's
                // injected hover .post.dummy can't shift the footer (the `of`
                // selector syntax must stay out of the cssmin pipeline)
                ".thread>.post.reply:nth-last-child(1 of .post.reply){margin-bottom:0!important}" +
                ":root.op-background .thread>.post.op:nth-last-child(1 of .post){margin-bottom:0!important}" +
                ($SS.conf && $SS.conf["QR Button Image"] ?
                    "a.quick-reply-btn img{display:none}" +
                    "a.quick-reply-btn::before{content:'';display:block;width:64px;height:64px;" +
                    "background:url('" + String($SS.conf["QR Button Image"]).replace(/['"\s()]/g, "") + "') center/contain no-repeat}"
                    : "");
            var el = document.getElementById("sc-theme-vars");
            if (!el) {
                el = document.createElement("style");
                el.id = "sc-theme-vars";
                (document.head || document.documentElement).appendChild(el);
            }
            el.textContent = css;
        },
        getActiveFileInput: function () {
            return document.querySelector("#quick-reply input[type=file]") ||
                document.querySelector("form[name='post'] input[type=file]");
        },
        moveOPFiles: function (root) {
            // vichan puts the OP file block outside div.post.op; move it inside
            // (matching reply structure) so backgrounds and borders wrap the OP.
            var scope = root && root.querySelectorAll ? root : document;
            scope.querySelectorAll(".thread > .files").forEach(function (files) {
                var op = files.parentNode.querySelector(":scope > .post.op");
                if (op) op.insertBefore(files, op.firstChild);
            });
        },
        tidyFileInfo: function (root) {
            // Drop vichan's leading "File: " label so the file line matches
            // the 4chan layout (filename, size, dimensions, links). Site scripts
            // may wrap the line in a span, so look inside one level.
            var scope = root && root.querySelectorAll ? root : document;
            scope.querySelectorAll("p.fileinfo").forEach(function (p) {
                var n = p.firstChild;
                if (n && n.nodeType === 1 && n.tagName === "SPAN") n = n.firstChild;
                if (n && n.nodeType === 3 && /^\s*File:\s*$/.test(n.nodeValue)) n.remove();
            });
        },
        moveOmittedSpans: function (root) {
            // 4chan renders the "N posts omitted" summary between the OP block
            // and the replies on the page background; vichan nests it inside
            // .post.op, where the OP background swallows it (or float layout
            // spits it out under tall OPs). Hoist it to the thread level for a
            // consistent 4chan-style line. expand.js's listeners survive the
            // move, and its own thread-scoped selectors still find the span.
            var scope = root && root.querySelectorAll ? root : document;
            scope.querySelectorAll(".post.op > span.omitted:not(.hide-expanded)").forEach(function (span) {
                var op = span.parentNode,
                    thread = op.parentNode;
                if (thread && thread.classList && thread.classList.contains("thread"))
                    thread.insertBefore(span, op.nextSibling);
            });
        },
        /* TS inline quoting: mark the originals of currently-inlined posts.
           TS removes its containers from the DOM on collapse, so container
           presence == inlined. TS only adds its own iq-hidden-post class
           when its Hide Inlined Posts setting is on; this mark exists
           either way so the faded style can apply when TS is not hiding */
        syncInlinedMarks: function () {
            var inlined = {};
            document.querySelectorAll(".inline-quote-container[data-inlined-id]").forEach(function (c) {
                inlined[c.getAttribute("data-inlined-id")] = true;
            });
            document.querySelectorAll(".post.st-inlined").forEach(function (p) {
                var id = (p.id || "").replace(/^(?:reply_|op_)/, "");
                // Clones (hover previews, inlined copies) never keep the mark
                if (!inlined[id] || p.closest(".inline-quote-container") || p.classList.contains("post-hover"))
                    p.classList.remove("st-inlined");
            });
            for (var k in inlined) {
                var el = document.getElementById("reply_" + k) || document.getElementById("op_" + k);
                if (el && !el.closest(".inline-quote-container"))
                    el.classList.add("st-inlined");
            }
        },
        initIndexPostHiding: function () {
            // The site's post-filter.js only exposes per-post hiding through
            // the post menu (▶ → Hide post) and gives OPs a bare [–] link,
            // while TS's one-click hide buttons are thread-page only. Recreate
            // those buttons on the index by proxying the site controls, so all
            // hide state stays in the site's own filter storage.
            var doc = document,
                minusIcon = '<span class="hide-icon"><svg xmlns="http://www.w3.org/2000/svg" class="minus" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" fill="currentColor"/></svg></span>',
                plusIcon = '<span class="show-icon"><svg xmlns="http://www.w3.org/2000/svg" class="plus" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" fill="currentColor"/></svg></span>';

            function postHidden(post) {
                // post-filter.js hides via jQuery .hide() on the child blocks
                var body = post.querySelector(":scope > .body");
                return body != null && body.style.display === "none";
            }
            function syncBtn(btn, post) {
                var hidden = postHidden(post);
                btn.innerHTML = hidden ? plusIcon : minusIcon;
                btn.classList.toggle("st-hidden", hidden);
                post.classList.toggle("st-index-hidden", hidden);
            }
            function proxyMenu(post, wantUnhide) {
                // Drive the site's own menu items so persistence and refresh
                // behavior stay entirely post-filter's
                var menuBtn = post.querySelector("a.post-btn");
                if (!menuBtn) return;
                var rootCl = doc.documentElement.classList;
                rootCl.add("st-menu-silent");
                try {
                    menuBtn.click();
                    var item = doc.querySelector(".post-menu li#filter-menu-" + (wantUnhide ? "unhide" : "hide") + ":not(.hidden)");
                    if (item) item.click();
                } finally {
                    $(".post-menu", doc).each(function () { this.remove(); });
                    $(".post-btn-open", doc).each(function () { this.classList.remove("post-btn-open"); });
                    rootCl.remove("st-menu-silent");
                }
            }
            function makeButton(post) {
                var btn = doc.createElement("a");
                btn.className = "reply hide-button st-index-hide";
                btn.href = "javascript:void(0)";
                btn.setAttribute("for", post.id);
                post._stHideBtn = btn;
                syncBtn(btn, post);
                post.parentNode.insertBefore(btn, post);
                return btn;
            }
            function addReplyButton(post) {
                if (post._stHideBtn || !post.id) return;
                var btn = makeButton(post);
                btn.addEventListener("click", function (e) {
                    e.preventDefault();
                    proxyMenu(post, postHidden(post));
                    syncBtn(btn, post);
                });
            }
            function addOPButton(op) {
                if (op._stHideBtn || !op.id) return;
                var btn = makeButton(op);
                btn.classList.add("st-thread-hide");
                btn.addEventListener("click", function (e) {
                    e.preventDefault();
                    // post-filter's own [–] quick-toggle (hidden by our CSS)
                    var link = op.querySelector("a.hide-thread-link");
                    if (link) link.click();
                    setTimeout(function () { syncBtn(btn, op); }, 0);
                });
            }
            $SS.addIndexHideButtons = function (root) {
                if (root && root.matches && root.matches(".post.reply")) {
                    if (root.parentNode && root.parentNode.classList &&
                        root.parentNode.classList.contains("thread"))
                        addReplyButton(root);
                    return;
                }
                var scope = root && root.querySelectorAll ? root : doc;
                scope.querySelectorAll(".thread > .post.reply").forEach(addReplyButton);
                scope.querySelectorAll(".thread > .post.op").forEach(addOPButton);
            };
            $SS.addIndexHideButtons();
            // post-filter applies stored hides around the same time we build
            // the buttons; resync once it has settled
            var resync = function () {
                $("a.st-index-hide", doc).each(function () {
                    var post = doc.getElementById(this.getAttribute("for"));
                    if (post && this.parentNode) syncBtn(this, post);
                });
            };
            setTimeout(resync, 800);
            // Collapsing expanded replies removes the posts; drop the orphaned
            // buttons and restore the omitted line expand.js only re-shows
            // inside the OP
            doc.addEventListener("click", function (e) {
                var t = e.target.closest && e.target.closest("span.hide-expanded");
                if (!t) return;
                var thread = t.closest(".thread");
                setTimeout(function () {
                    $("a.st-index-hide", doc).each(function () {
                        var post = doc.getElementById(this.getAttribute("for"));
                        if (!post || !post.isConnected) this.remove();
                    });
                    if (thread)
                        thread.querySelectorAll(":scope > span.omitted").forEach(function (s) {
                            s.style.display = "";
                        });
                }, 0);
            }, true);
        },
        initIndexNav: function () {
            // 4chan-X-style index control row above the post form: nav links
            // built from destinations the site actually has, a reload link with
            // a loaded-N-minutes-ago label, and a client-side OP search that
            // filters the threads on the loaded page. Bump-order/paged controls
            // are server-side on 4chan and have no tower backend, so no row for
            // them here.
            if (document.getElementById("st-index-nav")) return;
            var doc = document,
                anchor = doc.querySelector("form[name=post]:not(#quick-reply)") ||
                    doc.querySelector("form[name=postcontrols]");
            if (!anchor) return;

            var nav = doc.createElement("div");
            nav.id = "st-index-nav";

            function addLink(text, href, onclick) {
                var a = doc.createElement("a");
                a.textContent = text;
                a.href = href;
                if (onclick) a.addEventListener("click", onclick);
                nav.appendChild(a);
                return a;
            }
            addLink("Catalog", "/" + $SS.location.board + "/catalog.html");
            addLink("Archive", "https://archive.holotower.org/");
            addLink("Bottom", "javascript:void(0)", function (e) {
                e.preventDefault();
                window.scrollTo(0, doc.documentElement.scrollHeight);
            });
            addLink("Refresh", "javascript:void(0)", function (e) {
                e.preventDefault();
                location.reload();
            });

            var age = doc.createElement("span");
            age.id = "st-index-age";
            age.textContent = "just now";
            nav.appendChild(age);
            var loadedAt = Date.now();
            setInterval(function () {
                var m = Math.round((Date.now() - loadedAt) / 60000);
                age.textContent = m < 1 ? "just now" : m + " min ago";
            }, 60000);

            var search = doc.createElement("input");
            search.type = "text";
            search.id = "st-index-search";
            search.placeholder = "Search OPs…";
            search.addEventListener("input", function () {
                var q = search.value.trim().toLowerCase();
                // class-based hiding only: post-hover keeps its own inline-
                // hidden thread clones that must not be revealed on clear
                doc.querySelectorAll("div[id^='thread_']").forEach(function (t) {
                    var show = true;
                    if (q) {
                        var op = t.querySelector(".post.op");
                        show = (op ? op.textContent : t.textContent).toLowerCase().indexOf(q) !== -1;
                    }
                    t.classList.toggle("st-search-hidden", !show);
                });
            });
            nav.appendChild(search);

            anchor.parentNode.insertBefore(nav, anchor);
        },
        replaceThumbnails: function (root) {
            if (!$SS.conf["Replace Thumbnails"]) return;
            var formatConf = {
                gif: "Replace GIF", jpg: "Replace JPG", jpeg: "Replace JPG",
                png: "Replace PNG", webp: "Replace WEBP",
                webm: "Replace WEBM/MP4", mp4: "Replace WEBM/MP4"
            };
            var scope = root && root.querySelectorAll ? root : document;
            scope.querySelectorAll(".file > a > img.post-image").forEach(function (img) {
                var href = img.parentNode.href || "";
                // Video thumbs link to the site player, with the actual file
                // in the v= parameter
                var pm = href.match(/\/player\.php\?[^#]*?\bv=([^&#]+)/);
                if (pm) {
                    try { href = decodeURIComponent(pm[1]); } catch (er) { href = pm[1]; }
                }
                var ext = (href.match(/\.([a-z0-9]+)(?:[?#]|$)/i) || [])[1];
                ext = ext && ext.toLowerCase();
                if (!ext || !formatConf[ext] || !$SS.conf[formatConf[ext]]) return;
                // Leave spoiler/deleted placeholder thumbs alone
                if (/\/static\//.test(img.getAttribute("src") || "")) return;
                if (img.classList.contains("full-image")) return;
                if (ext === "webm" || ext === "mp4") {
                    // Video thumbnail: the site's expand-video.js binds its
                    // click on the original img, so keep it (hidden via the
                    // st-video-thumb class) and forward clicks to it
                    if (img._scVideoThumb) return;
                    img._scVideoThumb = true;
                    var file = img.closest(".file");
                    var video = document.createElement("video");
                    video.className = "st-thumb-video";
                    video.src = href;
                    video.muted = true;
                    video.loop = true;
                    video.autoplay = true;
                    video.playsInline = true;
                    video.style.width = img.style.width || (img.width ? img.width + "px" : "");
                    video.style.height = img.style.height || (img.height ? img.height + "px" : "");
                    img.parentNode.insertBefore(video, img.nextSibling);
                    if (file) file.classList.add("st-video-thumb");
                    video.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        img.click();
                    });
                    // While the site's expanded player is open, hide the
                    // looping thumb; bring it back on collapse
                    new MutationObserver(function () {
                        var expanded = false, sib = img.parentNode.querySelectorAll("div > video");
                        sib.forEach(function (v) {
                            if (v !== video && v.parentNode.style.display !== "none") expanded = true;
                        });
                        video.style.display = expanded ? "none" : "";
                        if (expanded) { try { video.pause(); } catch (er) {} }
                        else { try { video.play(); } catch (er) {} }
                    }).observe(img.parentNode, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
                    return;
                }
                var apply = function () {
                    if (!img.classList.contains("full-image") && img.src !== href)
                        img.src = href;
                };
                apply();
                // A lazy loader may overwrite the src with a placeholder and
                // later its cached static thumb; re-assert the full source
                // whenever the src changes away from it.
                if (!img._scGifObserved) {
                    img._scGifObserved = true;
                    new MutationObserver(function () {
                        if (!img.classList.contains("full-image") && img.src !== href)
                            setTimeout(apply, 60);
                    }).observe(img, { attributes: true, attributeFilter: ["src"] });
                }
            });
        },        initImageConvertOnDrop: function () {
            var MAX_BYTES = $SS.location.maxFileSize;

            function notify(msg) {
                $SS.notify({
                    type: 'success',
                    content: msg,
                    lifetime: 5
                });
            }

            function convertToJPEG(file, baseName, qrInput) {
                createImageBitmap(file).then(function (bitmap) {
                    var canvas = document.createElement("canvas"),
                        w = bitmap.width, h = bitmap.height,
                        maxDim = $SS.maxImageDim,
                        outName = baseName + ".jpg",
                        wasResized = false,
                        qualities = [0.99, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10, 0.05, 0.01];

                    if (w > maxDim || h > maxDim) {
                        var scale = Math.min(maxDim / w, maxDim / h);
                        w = Math.round(w * scale);
                        h = Math.round(h * scale);
                        wasResized = true;
                    }
                    canvas.width = w;
                    canvas.height = h;
                    canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
                    bitmap.close();

                    function emitFile(blob, q) {
                        var converted = new File([blob], outName, { type: "image/jpeg" });
                        var dt = new DataTransfer();
                        dt.items.add(converted);
                        qrInput.files = dt.files;
                        qrInput.dispatchEvent(new Event("input", { bubbles: true }));
                        qrInput.dispatchEvent(new Event("change", { bubbles: true }));
                        var msg = "Converted " + file.name + " to " + outName + " (q=" + Math.round(q * 100) + "%)";
                        if (wasResized) msg += ", resized to " + w + "x" + h;
                        notify(msg);
                        qrInput._scConverting = false;
                    }

                    function tryQuality(index) {
                        var q = qualities[index];
                        canvas.toBlob(function (blob) {
                            if (blob.size <= MAX_BYTES || index === qualities.length - 1) {
                                emitFile(blob, q);
                            } else {
                                tryQuality(index + 1);
                            }
                        }, "image/jpeg", q);
                    }

                    tryQuality(0);
                }).catch(function (err) { console.warn("Image conversion failed:", err); });
            }

            function shouldConvert(file) {
                if (file.type === "image/gif") return false;
                if (file.type === "image/jpeg" || file.type === "image/png") return file.size > MAX_BYTES;
                return true;
            }

            function findQRFileInput() {
                return $SS.getActiveFileInput();
            }

            function clearSelectedFile(input) {
                try {
                    input.files = new DataTransfer().files;
                } catch (err) { console.warn("Failed to clear file:", err); }
            }

            function checkAndConvert(file, input) {
                var baseName = file.name.replace(/\.[^.]+$/, "");

                if (shouldConvert(file)) {
                    clearSelectedFile(input);
                    convertToJPEG(file, baseName, input);
                    return;
                }

                var maxDim = $SS.maxImageDim;

                createImageBitmap(file).then(function (bitmap) {
                    if (bitmap.width > maxDim || bitmap.height > maxDim) {
                        bitmap.close();
                        clearSelectedFile(input);
                        convertToJPEG(file, baseName, input);
                    } else {
                        bitmap.close();
                        var dt = new DataTransfer();
                        dt.items.add(file);
                        input.files = dt.files;
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                        input._scConverting = false;
                    }
                }).catch(function (err) {
                    console.warn("Image dimension check failed:", err);
                    var dt = new DataTransfer();
                    dt.items.add(file);
                    input.files = dt.files;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                    input._scConverting = false;
                });
            }

            // File picker: intercept change on the QR input
            function changeHandler(e) {
                var input = e.target;
                if (input._scConverting) return;
                if (input.type !== "file") return;
                if (!input.closest("#quick-reply, form[name='post']")) return;
                var file = input.files && input.files[0];
                if (!file || file.type === "image/gif") return;

                e.stopImmediatePropagation();
                input._scConverting = true;
                checkAndConvert(file, input);
            }
            window.addEventListener("change", changeHandler, true);
            $SS._scChangeHandler = changeHandler;

            // Drag and drop
            function dropHandler(e) {
                var files = e.dataTransfer && e.dataTransfer.files;
                if (!files || !files.length) return;

                var file = files[0];
                if (file.type === "image/gif") return;

                // Find the active file input (quick reply or main form)
                var qrInput = findQRFileInput();
                if (!qrInput) return;

                e.preventDefault();
                e.stopPropagation();

                qrInput._scConverting = true;
                checkAndConvert(file, qrInput);
            }
            window.addEventListener("drop", dropHandler, true);
            $SS._scDropHandler = dropHandler;
        },
        getNotificationRoot: function () {
            var root = document.getElementById('styletower-notifications');

            if (root) return root;
            if (!getDocBody()) return null;

            root = document.createElement('div');
            root.id = 'styletower-notifications';
            root.setAttribute('aria-live', 'polite');
            root.setAttribute('aria-atomic', 'true');

            getDocBody().appendChild(root);
            return root;
        },
        dismissNotification: function (node) {
            if (!node || node.dataset.closing === 'true') return;

            node.dataset.closing = 'true';
            node.classList.add('closing');

            setTimeout(function () {
                if (node.parentNode)
                    node.parentNode.removeChild(node);
            }, 180);
        },
        notify: function (detail) {
            var root, note, text, lifetime;

            if ($SS.conf && !$SS.conf["Toast Notifications"])
                return;

            if (typeof detail === 'string')
                detail = { content: detail };

            if (!detail || !detail.content)
                return;

            root = $SS.getNotificationRoot();
            if (!root) {
                return setTimeout(function () {
                    $SS.notify(detail);
                }, 25);
            }

            note = document.createElement('div');
            text = document.createElement('div');
            lifetime = detail.lifetime === undefined ? 4 : detail.lifetime;

            note.className = 'styletower-notification styletower-notification-' + (detail.type || 'info');
            note.setAttribute('role', 'status');
            note.setAttribute('tabindex', '0');
            note.title = 'Dismiss';

            text.className = 'styletower-notification-text';
            if (typeof detail.content === 'string')
                text.textContent = detail.content;
            else
                text.appendChild(detail.content);
            note.appendChild(text);

            note.addEventListener('click', function (e) {
                if (e.target.closest('a'))
                    return;
                $SS.dismissNotification(note);
            });
            note.addEventListener('keydown', function (e) {
                if (e.target.closest && e.target.closest('a'))
                    return;
                if (e.key === "Enter" || e.key === "Escape") {
                    e.preventDefault();
                    $SS.dismissNotification(note);
                }
            });

            root.appendChild(note);
            if (root.childElementCount > 4)
                $SS.dismissNotification(root.firstElementChild);

            setTimeout(function () {
                note.classList.add('visible');
            }, 0);

            if (lifetime > 0) {
                setTimeout(function () {
                    $SS.dismissNotification(note);
                }, lifetime * 1000);
            }
            return note;
        },
        initRememberComment: function () {
            if (!$SS.conf["Remember Comment Draft"]) return;
            $SS.handleFormNode();
        },
        getRememberCommentPrefix: function () {
            return NAMESPACE + "RememberComment:";
        },
        getRememberCommentKey: function () {
            return $SS.getRememberCommentPrefix() + location.pathname;
        },
        getRememberCommentExpiry: function () {
            return 24 * 60 * 60 * 1000;
        },
        saveRememberedComment: function (storageKey, text) {
            var val = JSON.stringify({ text: text, savedAt: Date.now() });
            if ($SS.hasGM) { try { GM_setValue(storageKey, val); } catch (e) {} }
            else { try { localStorage.setItem(storageKey, val); } catch (e) {} }
            $SS.cleanupRememberedComments();
        },
        clearRememberedComment: function () {
            var key = $SS.getRememberCommentKey();
            if ($SS.hasGM) { try { GM_deleteValue(key); } catch (e) {} }
            try { localStorage.removeItem(key); } catch (e) {}
        },
        cleanupRememberedComments: function () {
            var prefix;
            try { prefix = $SS.getRememberCommentPrefix(); } catch (e) { return; }
            if (!prefix) return;
            var keptEntries = [];
            var i, key, entry, keys = {}, allKeys;

            if ($SS.hasGM) {
                try { allKeys = GM_listValues(); for (i = 0; i < allKeys.length; i++) { if (allKeys[i].indexOf(prefix) === 0) keys[allKeys[i]] = true; } } catch (e) {}
            }
            try { for (i = 0; i < localStorage.length; i++) { key = localStorage.key(i); if (key && key.indexOf(prefix) === 0) keys[key] = true; } } catch (e) {}

            allKeys = Object.keys(keys);
            for (i = 0; i < allKeys.length; i++) {
                entry = $SS.loadRememberedComment(allKeys[i]);
                if (!entry) continue;
                keptEntries.push({ key: allKeys[i], savedAt: entry.savedAt });
            }

            keptEntries.sort(function (a, b) { return b.savedAt - a.savedAt; });
            keptEntries.slice(10).forEach(function (entry) {
                if ($SS.hasGM) { try { GM_deleteValue(entry.key); } catch (e) {} }
                try { localStorage.removeItem(entry.key); } catch (e) {}
            });
        },
        loadRememberedComment: function (storageKey) {
            var rawValue, parsedValue;
            if ($SS.hasGM) { try { rawValue = GM_getValue(storageKey); } catch (e) {} }
            if (!rawValue) { try { rawValue = localStorage.getItem(storageKey); } catch (e) { return null; } }
            if (!rawValue) return null;

            try { parsedValue = JSON.parse(rawValue); } catch (error) {
                if ($SS.hasGM) { try { GM_deleteValue(storageKey); } catch (e) {} }
                try { localStorage.removeItem(storageKey); } catch (e) {}
                return null;
            }

            if (!parsedValue || typeof parsedValue.text !== "string" || typeof parsedValue.savedAt !== "number") {
                if ($SS.hasGM) { try { GM_deleteValue(storageKey); } catch (e) {} }
                try { localStorage.removeItem(storageKey); } catch (e) {}
                return null;
            }

            if (Date.now() - parsedValue.savedAt > $SS.getRememberCommentExpiry()) {
                if ($SS.hasGM) { try { GM_deleteValue(storageKey); } catch (e) {} }
                try { localStorage.removeItem(storageKey); } catch (e) {}
                return null;
            }

            return parsedValue;
        },
        bindRememberComment: function (qrNode) {
            if (!qrNode || !$SS.conf["Remember Comment Draft"]) return;
            if (qrNode._rememberCommentBound) return;

            var commentField = qrNode.querySelector("textarea");
            var formNode = qrNode.querySelector("form") || qrNode.closest("form");
            var storageKey = $SS.getRememberCommentKey();
            var saveTimer = null;
            var savedDraft;
            var suppressRemember = false;

            if (!commentField) return;

            savedDraft = $SS.loadRememberedComment(storageKey);
            if (savedDraft && !commentField.value) {
                commentField.value = savedDraft.text;
                commentField.dispatchEvent(new Event("input", { bubbles: true }));
            }

            function queueSave() {
                if (suppressRemember) {
                    suppressRemember = false;
                }

                clearTimeout(saveTimer);
                saveTimer = setTimeout(function () {
                    if (commentField.value.trim())
                        $SS.saveRememberedComment(storageKey, commentField.value);
                    else
                        $SS.clearRememberedComment();
                }, 5000);
            }

            function clearSavedComment() {
                suppressRemember = true;
                clearTimeout(saveTimer);
                $SS.clearRememberedComment();
            }

            commentField.addEventListener("input", queueSave);
            if (formNode)
                formNode.addEventListener("submit", clearSavedComment, true);
            qrNode.addEventListener("click", function (e) {
                var submitNode = e.target.closest("input[type=submit], button[type=submit]");
                if (submitNode)
                    clearSavedComment();
            });

            qrNode._rememberCommentBound = true;
        },
        handleFormNode: function (form) {
            if (!form) {
                document.querySelectorAll("#quick-reply, form[name='post']").forEach($SS.handleFormNode);
                return;
            }
            if ($SS.conf["Remember Comment Draft"]) {
                $SS.bindRememberComment(form);
            }
            if ($SS.conf["Watch Thread on Reply"]) {
                form.querySelectorAll("input[type=submit]").forEach(function (btn) {
                    if (!btn._watchThreadBound) {
                        btn.addEventListener("click", $SS.watchThread);
                        btn._watchThreadBound = true;
                    }
                });
            }
            var spoiler = form.querySelector("input[name=spoiler]");
            if (spoiler && !spoiler.title) spoiler.title = "Spoiler image";
            if ($SS.conf["Auto-Convert Images"] && $SS._scChangeHandler) {
                var fi = form.querySelector("input[type=file]");
                if (fi && !fi._scHooked) {
                    fi._scHooked = true;
                    fi.addEventListener("change", $SS._scChangeHandler, true);
                }
                if (!form._scDropHooked) {
                    form._scDropHooked = true;
                    form.addEventListener("drop", $SS._scDropHandler, true);
                }
            }
        },
        toggleAutohideQR: function () {
            // All three autohide styles expand on the .focus class (maintained
            // by initNativeQRAutohide's focus delegation), so showing = focus
            // the comment box and hiding = blur it
            var qr = document.getElementById("quick-reply");
            if (!qr || qr.style.display === "none") {
                var btn = document.querySelector("a.quick-reply-btn");
                if (btn) btn.click();
                qr = document.getElementById("quick-reply");
                if (qr && qr.style.display === "none") qr.style.display = "";
            }
            if (!qr) return;
            if (qr.classList.contains("focus")) {
                var active = document.activeElement;
                if (active && qr.contains(active)) active.blur();
                qr.classList.remove("focus");
            } else {
                var body = qr.querySelector("textarea[name=body]");
                if (body) body.focus();
                else qr.classList.add("focus");
            }
        },
        initNativeQRAutohide: function () {
            // The quick reply is recreated each time it opens, so use delegation
            document.addEventListener("focusin", function (e) {
                var qr = e.target.closest && e.target.closest("#quick-reply");
                if (qr) qr.classList.add("focus");
            });
            document.addEventListener("focusout", function (e) {
                var qr = e.target.closest && e.target.closest("#quick-reply");
                if (qr && !qr.contains(e.relatedTarget)) qr.classList.remove("focus");
            });
        },
        getThreadTitle: function () {
            var el = document.querySelector(".post.op .subject");
            return (el && el.textContent.trim()) || document.title.replace(/\s*-\s*\/[^\/]*\/\s*$/, '') || "Untitled";
        },
        localJSON: {
            get: function (key) {
                try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
            },
            set: function (key, data) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
            }
        },
        getThreadId: function () {
            var pathname = window.location.pathname.slice(1).split("/");
            if (pathname[1] !== "res") return null;
            return (pathname[2] || "").replace(/(?:\+\d+)?\.html$/, "") || null;
        },
        getOwnPosts: function (board) {
            var posts = $SS.localJSON.get("own_posts") || {};
            return posts[board] || [];
        },
        watchThread: function () {
            if (!$SS.conf["Watch Thread on Reply"] || !$SS.location.reply) return;
            try {
                var board = $SS.location.board,
                    threadId = $SS.getThreadId();
                if (!board || !threadId) return;
                var watchData = $SS.localJSON.get("watch_js") || {};
                var bc = watchData[board] || {};
                bc.threads = bc.threads || {};
                bc.slugs = bc.slugs || {};
                if (!bc.threads[threadId]) {
                    bc.threads[threadId] = Date.now();
                    bc.slugs[threadId] = window.location.pathname + window.location.search;
                    watchData[board] = bc;
                    $SS.localJSON.set("watch_js", watchData);
                }
            } catch (e) {}
        },
        relativeDates: function (root) {
            if (!$SS.conf["Relative Post Dates"]) return;
            var now = Date.now();
            (root && root.querySelectorAll ? root : document).querySelectorAll("p.intro time[datetime]").forEach(function (dt) {
                if (!dt._relativeDateSet) {
                    var utc = Date.parse(dt.getAttribute("datetime"));
                    if (isNaN(utc)) return;
                    dt._relativeDateSet = true;
                    dt.title = dt.textContent;
                    var seconds = Math.floor((now - utc) / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    var days = Math.floor(hours / 24);
                    var weeks = Math.floor(days / 7);
                    var months = Math.floor(days / 30);
                    var text;
                    if (seconds < 60) text = "just now";
                    else if (minutes < 60) text = minutes + " min ago";
                    else if (hours < 24) text = hours + " hr ago";
                    else if (days < 7) text = days + " day" + (days > 1 ? "s" : "") + " ago";
                    else if (weeks < 5) text = weeks + " week" + (weeks > 1 ? "s" : "") + " ago";
                    else if (months < 12) text = months + " month" + (months > 1 ? "s" : "") + " ago";
                    else text = Math.floor(days / 365) + " year" + (Math.floor(days / 365) > 1 ? "s" : "") + " ago";
                    dt.textContent = text;
                }
            });
        },
        replacePostMenuBtn: function (root) {
            root = root || document;
            var btns = root.querySelectorAll ? root.querySelectorAll("a.post-btn") : [];
            [].forEach.call(btns, function (btn) {
                if (btn.textContent === "▶" || btn.textContent === "\u25B6") btn.textContent = "\u2771";
                // vichan puts the menu button before the poster name, indenting
                // every post header; 4chan-X keeps it after the post number.
                var intro = btn.closest ? btn.closest("p.intro") : null;
                if (intro) {
                    var nums = intro.querySelectorAll("a.post_no");
                    if (nums.length) {
                        var last = nums[nums.length - 1];
                        if (last.nextSibling !== btn)
                            intro.insertBefore(btn, last.nextSibling);
                    }
                }
            });
        },
        mascotFilterCSS: function (m) {
            // Per-mascot image filters; only non-default values contribute
            var f = (m && m.filters) || {},
                parts = [];
            if (f.gray) parts.push("grayscale(" + f.gray + "%)");
            if (f.sepia) parts.push("sepia(" + f.sepia + "%)");
            if (f.invert) parts.push("invert(" + f.invert + "%)");
            if (f.hue) parts.push("hue-rotate(" + f.hue + "deg)");
            if (f.bright != null && f.bright !== 100) parts.push("brightness(" + f.bright + "%)");
            if (f.contrast != null && f.contrast !== 100) parts.push("contrast(" + f.contrast + "%)");
            if (f.sat != null && f.sat !== 100) parts.push("saturate(" + f.sat + "%)");
            if (f.blur) parts.push("blur(" + f.blur + "px)");
            return parts.join(" ");
        },
        displayMascots: function (previewMascot) {
            // One mascot at a time, OneeChan-style: picked at random from the
            // selected set (or forced by the editor's live preview)
            try {
                var existing = document.getElementById("styletower-mascots");
                if (existing) existing.remove();
                var m = previewMascot;
                if (!m) {
                    if (!$SS.conf["Enable Mascots"]) return;
                    if ($SS.conf["Hide Mascots in Catalog"] && $SS.location.catalog) return;
                    var mascots = [];
                    try { mascots = JSON.parse($SS.conf["Mascots"] || "[]"); } catch (e) {}
                    var board = $SS.location.board;
                    var available = mascots.filter(function (mm) {
                        if (mm.enabled === false || !mm.url) return false;
                        if (mm.boards) {
                            var list = String(mm.boards).split(",").map(function (b) {
                                return b.trim();
                            }).filter(Boolean);
                            if (list.length && list.indexOf(board) === -1) return false;
                        }
                        return true;
                    });
                    if (!available.length) return;
                    m = available.length > 1 ? available[Math.floor(Math.random() * available.length)] : available[0];
                }
                var container = document.createElement("div");
                container.id = "styletower-mascots";
                var side = m.side === "left" || m.side === "right" ? m.side :
                    (document.documentElement.classList.contains("left-sidebar") ? "left" : "right");
                container.className = "mascots-" + side;
                var left = side === "left";
                var off = parseInt(m.offset, 10) || 0,
                    hoff = parseInt(m.hoffset, 10) || 0;
                if (off) container.style.bottom = off + "px";
                if (hoff) container.style[left ? "marginLeft" : "marginRight"] = hoff + "px";
                var img = document.createElement("img");
                img.src = m.url;
                img.style.opacity = (m.opacity == null ? 100 : m.opacity) / 100;
                if (m.flip) img.style.transform = "scaleX(-1)";
                // Free CSS sizes like OneeChan ("auto", "300px", "40vh"); bare
                // numbers are treated as px
                var size = function (v) {
                    v = String(v == null ? "" : v).trim();
                    if (!v || v === "auto") return "";
                    return /^\d+$/.test(v) ? v + "px" : v;
                };
                var wCss = size(m.width),
                    hCss = size(m.height),
                    scale = parseInt(m.scale, 10) || 100;
                if (wCss) img.style.width = wCss;
                if (hCss) img.style.height = hCss;
                // The 300px sidebar-fit cap only applies to fully auto-sized
                // mascots; any explicit size or scale overrides it. Whether it
                // applies at all comes from the Mascot Max Width option, which
                // each mascot can override (true/false; undefined = global)
                var capped = m.maxwidth === undefined || m.maxwidth === null ?
                    $SS.conf["Mascot Max Width"] !== false : m.maxwidth !== false;
                if (wCss || hCss || scale !== 100 || !capped)
                    img.style.maxWidth = "none";
                if (!wCss && !hCss && scale !== 100) {
                    var applyScale = function () {
                        if (img.naturalWidth)
                            img.style.width = Math.round(img.naturalWidth * scale / 100) + "px";
                    };
                    if (img.complete && img.naturalWidth) applyScale();
                    else img.addEventListener("load", applyScale);
                }
                if (m.clip && (m.clip[0] || m.clip[1] || m.clip[2] || m.clip[3])) {
                    // Clip values describe the VISIBLE image (OneeChan
                    // semantics). clip-path applies before the flip transform,
                    // so swap L/R for flipped mascots to keep that meaning
                    var cT = m.clip[0] || 0, cL = m.clip[1] || 0,
                        cB = m.clip[2] || 0, cR = m.clip[3] || 0;
                    if (m.flip) { var cTmp = cL; cL = cR; cR = cTmp; }
                    img.style.clipPath = "inset(" + cT + "px " + cR + "px " + cB + "px " + cL + "px)";
                }
                var filterCSS = $SS.mascotFilterCSS(m);
                if (filterCSS) img.style.filter = filterCSS;
                container.appendChild(img);
                document.body.appendChild(container);
            } catch (e) {}
        },
        getOpenMenuPostId: function () {
            var btn = document.querySelector(".post-btn-open");
            var post = btn && btn.closest(".post");
            if (!post || !post.id) return null;
            return post.id.replace(/^(?:reply_|op_)/, "") || null;
        },
        insertToggleYou: function (menu) {
            menu = menu || document.querySelector(".post-menu");
            if (!menu || menu.querySelector("[data-cmd='toggle-you']")) return;
            var ul = menu.querySelector("ul");
            if (!ul) return;
            var postId = $SS.getOpenMenuPostId();
            if (!postId) return;
            var li = document.createElement("li");
            li.className = "post-item";
            li.setAttribute("data-cmd", "toggle-you");
            li.setAttribute("data-id", postId);
            li.textContent = $SS.getOwnPosts($SS.location.board).indexOf(postId) !== -1 ? "✓ You" : "Toggle You";
            ul.appendChild(li);
        },
        toggleYou: function (li) {
            var postId = li.getAttribute("data-id");
            if (!postId) return;
            try {
                var board = $SS.location.board;
                if (!board) return;
                var posts = $SS.localJSON.get("own_posts") || {};
                posts[board] = posts[board] || [];
                var el = document.getElementById("reply_" + postId) || document.getElementById("op_" + postId);
                var idx = posts[board].indexOf(postId);
                if (idx !== -1) {
                    posts[board].splice(idx, 1);
                    li.textContent = "Toggle You";
                    if (el) {
                        el.classList.remove("yourPost");
                        el.classList.remove("you");
                        var mark = el.querySelector(".intro span.own_post");
                        if (mark) mark.remove();
                    }
                } else {
                    posts[board].push(postId);
                    li.textContent = "✓ You";
                    if (el) {
                        el.classList.add("yourPost");
                        el.classList.add("you");
                        var name = el.querySelector(".intro span.name");
                        if (name && !el.querySelector(".intro span.own_post")) {
                            var span = document.createElement("span");
                            span.className = "own_post";
                            span.textContent = "(You)";
                            name.parentNode.insertBefore(span, name.nextSibling);
                            name.parentNode.insertBefore(document.createTextNode(" "), span);
                        }
                    }
                }
                if (posts[board].length === 0) delete posts[board];
                $SS.localJSON.set("own_posts", posts);
            } catch (e) {}
        },
        insertDeletePost: function (menu) {
            menu = menu || document.querySelector(".post-menu");
            if (!menu || menu.querySelector("[data-cmd='delete-post']")) return;
            var ul = menu.querySelector("ul");
            if (!ul) return;
            var postId = $SS.getOpenMenuPostId();
            if (!postId) return;
            var subUl = document.createElement("ul");
            var postLi = document.createElement("li");
            postLi.className = "post-item";
            postLi.setAttribute("data-cmd", "delete-post");
            postLi.setAttribute("data-id", postId);
            postLi.textContent = "Post";
            subUl.appendChild(postLi);
            var fileLi = document.createElement("li");
            fileLi.className = "post-item";
            fileLi.setAttribute("data-cmd", "delete-file");
            fileLi.setAttribute("data-id", postId);
            fileLi.textContent = "File only";
            subUl.appendChild(fileLi);
            var li = document.createElement("li");
            li.className = "post-submenu";
            li.appendChild(subUl);
            li.appendChild(document.createTextNode("Delete"));
            var arrow = document.createElement("span");
            arrow.className = "post-menu-arrow";
            arrow.textContent = "»";
            li.appendChild(arrow);
            ul.appendChild(li);
        },
        deletePost: function (li, fileOnly) {
            var postId = li.getAttribute("data-id");
            if (!postId) return;
            var delForm = document.querySelector("form[name='postcontrols']");
            var url = (delForm && delForm.action) || "/post.php";
            var boardInput = delForm && delForm.querySelector("input[name='board']");
            var board = (boardInput && boardInput.value) || $SS.location.board;
            var pwdInput = document.getElementById("password");
            var password = (pwdInput && pwdInput.value) || localStorage.password || "";
            var formData = new FormData();
            formData.append("board", board);
            formData.append("delete_" + postId, "on");
            formData.append("password", password);
            if (fileOnly) formData.append("file", "on");
            formData.append("delete", "Delete");
            formData.append("json_response", "1");
            var delNote = $SS.notify({ type: 'success', content: "Deleting...", lifetime: 0 });
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.withCredentials = true;
            xhr.onloadend = function () {
                $SS.dismissNotification(delNote);
                var msg, type = 'success', res = null;
                try { res = JSON.parse(xhr.responseText); } catch (e) {}
                if (!res) {
                    msg = "Connection error, please retry.";
                    type = 'warning';
                } else if (res.error) {
                    msg = res.error;
                    type = 'warning';
                } else {
                    msg = fileOnly ? "File deleted." : "Post deleted.";
                }
                $SS.notify({ type: type, content: msg, lifetime: 5 });
            };
            xhr.send(formData);
        },
        QRDialogCreationHandler: function (e) {
            var qr = e.target;

            $("input[name=subject], input[name=name]", qr).each(function () {
                this.setAttribute("maxlength", "100");
                this.addEventListener("input", function () {
                    if (this.value.length >= 100) {
                        this.style.setProperty("border-color", "red", "important");
                        var el = this;
                        setTimeout(function () { el.style.removeProperty("border-color"); }, 600);
                    }
                });
            });
            if ($SS.conf["Watch Thread on Reply"] && $SS.location.reply) {
                $SS.handleFormNode(qr);
            }
            $SS.bindRememberComment(qr);

            var spoiler = qr.querySelector("input[name=spoiler]");
            if (spoiler) spoiler.title = "Spoiler image";

            $SS.syncTSPostingControls(qr, 10);
            $SS.restructureQRSubmit(qr);

            $SS.QRhandled = true;
        },
        restructureQRSubmit: function (qr) {
            // Move the submit button out of the subject row into its own
            // full-width row at the bottom of the QR.
            if (qr.querySelector(".st-submit-row")) return;
            var submit = qr.querySelector("input[type=submit]");
            var table = qr.querySelector("table");
            if (!submit || !table) return;
            var submitTd = submit.closest("td");
            var tr = document.createElement("tr");
            tr.className = "st-submit-row";
            var td = document.createElement("td");
            td.setAttribute("colspan", "2");
            td.appendChild(submit);
            tr.appendChild(td);
            (table.tBodies[0] || table).appendChild(tr);
            if (submitTd && submitTd.classList.contains("submit")) {
                var subjectTd = submitTd.previousElementSibling;
                if (subjectTd) subjectTd.setAttribute("colspan", "2");
                // Keep the emptied cell as a hidden anchor: companion scripts
                // (e.g. the emote menu) insert their rows relative to
                // td.submit, and removing it made their injection silently
                // no-op whenever we processed the QR before they did
                submitTd.hidden = true;
            }
        },
        syncTSPostingControls: function (qr, attempts) {
            // The QR can be cloned before Holotower TS adds its posting controls
            // to the main form (an emote script pre-builds the QR at load), so
            // copy them over. TS's handlers are document-delegated and sync all
            // inputs by name, so the copies stay fully functional.
            if (!qr.isConnected) return;
            var mainRand = document.querySelector("form[name='post']:not(#quick-reply) input[name=randfn]");
            if (!mainRand) {
                // TS may not be done yet (or absent); retry briefly
                if (attempts > 0) setTimeout(function () { $SS.syncTSPostingControls(qr, attempts - 1); }, 500);
                return;
            }
            var qrSpoiler = qr.querySelector("input[name=spoiler]");
            if (!qr.querySelector("input[name=randfn]") && qrSpoiler) {
                var lbl = document.createElement("label"),
                    cb = document.createElement("input");
                cb.type = "checkbox";
                cb.name = "randfn";
                cb.checked = mainRand.checked;
                lbl.appendChild(cb);
                lbl.appendChild(document.createTextNode(" Randomize Filename"));
                qrSpoiler.parentNode.appendChild(document.createTextNode(" "));
                qrSpoiler.parentNode.appendChild(lbl);
            }
            var mainFnRow = document.getElementById("upload_filename");
            if (mainFnRow && !qr.querySelector("input[name=filename]") && qrSpoiler) {
                var spoilerRow = qrSpoiler.closest("tr");
                if (spoilerRow) {
                    var row = mainFnRow.cloneNode(true);
                    row.removeAttribute("id");
                    var th = row.querySelector("th");
                    if (th) th.remove();
                    var td = row.querySelector("td");
                    if (td) td.setAttribute("colspan", "2");
                    var inp = row.querySelector("input[name=filename]");
                    if (inp) {
                        inp.removeAttribute("size");
                        inp.setAttribute("placeholder", "Filename");
                        inp.value = mainFnRow.querySelector("input[name=filename]").value;
                    }
                    spoilerRow.parentNode.insertBefore(row, spoilerRow.nextSibling);
                }
            }
        },

        /* INTEGRATIONS
           Features folded in from the standalone Holotower userscripts:
           - Holotower X/BSKY Sauce (MIT, KanashiiWolf)
           - Holotower ImgOps Links (MIT, slopffian)
           - Holotower Auto Scroll (MIT)
           - Holotower Catalog Highlights and Pin (CC0, anonymous)
           Inline quoting, custom fixes and soundposts live in Holotower TS.
           Disable the matching option before running a standalone copy alongside. */
        integrations: {
            pageWindow: function () {
                return typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
            },
            jq: function () {
                try { return $SS.integrations.pageWindow().jQuery || null; } catch (e) { return null; }
            },
            addStyle: function (id, css) {
                var el = document.getElementById(id);
                if (!el) {
                    el = document.createElement("style");
                    el.id = id;
                    (document.head || document.documentElement).appendChild(el);
                }
                el.textContent = css;
            },
            init: function () {
                var I = $SS.integrations;
                if ($SS.conf["Auto Scroll"] && $SS.location.reply && !I._autoScroll) { I._autoScroll = true; I.initAutoScroll(); }
                if ($SS.conf["ImgOps Links"] && !I._imgOps) { I._imgOps = true; I.initImgOps(); }
                if ($SS.conf["Sauce Links"] && !I._sauce) { I._sauce = true; I.initSauceLinks(); }
                if ($SS.conf["Catalog Highlights"] && $SS.location.catalog && !I._catalog) { I._catalog = true; I.initCatalogHighlights(); }
            },

            /* X/BSKY sauce links on file info (Holotower X/BSKY Sauce) */
            initSauceLinks: function () {
                var regexAll = /@(?:([a-zA-Z0-9-.]+)-bsky|(\w+))-(\d{19}|\S{13})(-\d)?.*\.\w+$/i;

                function addSauceButton(el, data) {
                    if (el == null) return;
                    var site, url;
                    var sauceEl = document.createElement("span");
                    sauceEl.className = "sc-sauce-link";
                    if (data[1]) {
                        site = "🦋"; /* butterfly */
                        url = "https://bsky.app/profile/" + data[1] + "/post/" + data[3];
                    } else {
                        site = "𝕏"; /* X */
                        url = "https://x.com/" + data[2] + "/status/" + data[3];
                    }
                    var a = document.createElement("a");
                    a.href = url;
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    a.textContent = site;
                    sauceEl.appendChild(document.createTextNode("["));
                    sauceEl.appendChild(a);
                    sauceEl.appendChild(document.createTextNode("]"));
                    if (el.parentElement && el.parentElement.parentElement)
                        el.parentElement.parentElement.appendChild(sauceEl);
                }

                function sweep(root) {
                    var scope = root && root.querySelectorAll ? root : document;
                    scope.querySelectorAll(".fileinfo span.unimportant a").forEach(function (file) {
                        if (!file.hasAttribute("sauced")) {
                            file.setAttribute("sauced", "");
                            var data = (file.download || "").match(regexAll);
                            if (data) addSauceButton(file, data);
                        }
                    });
                }

                sweep(document);
                new MutationObserver(function (mutationList) {
                    for (var i = 0; i < mutationList.length; i++) {
                        for (var j = 0; j < mutationList[i].addedNodes.length; j++) {
                            var node = mutationList[i].addedNodes[j];
                            if (node instanceof HTMLElement) sweep(node);
                        }
                    }
                }).observe(getDocBody(), { childList: true, subtree: true });
            },

            /* imgops links after file info (Holotower ImgOps Links) */
            initImgOps: function () {
                var CONFIG = {
                    VARIANCE_THRESHOLD: 100,
                    SEEK_INCREMENT: 0.1,
                    MAX_SEEK_TIME: 5,
                    JPEG_QUALITY: 0.95,
                    LITTERBOX_EXPIRY: '1h',
                    LITTERBOX_API: 'https://litterbox.catbox.moe/resources/internals/api.php',
                    IMGOPS_URL: 'https://imgops.com/'
                };
                var litterboxCache = new WeakMap();

                function updateLinkState(link, text, cursor, color) {
                    link.textContent = text;
                    link.style.cursor = cursor || "pointer";
                    if (color) link.style.color = color;
                }

                function getFilenameFromUrl(url, newExtension) {
                    var filename = url.split("/").pop().split("?")[0];
                    if (newExtension) filename = filename.replace(/\.(webm|mp4)$/i, newExtension);
                    return filename;
                }

                function isFrameBlank(canvas, ctx) {
                    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    var data = imageData.data;
                    var sumR = 0, sumG = 0, sumB = 0, count = 0, i;
                    for (i = 0; i < data.length; i += 40) {
                        sumR += data[i];
                        sumG += data[i + 1];
                        sumB += data[i + 2];
                        count++;
                    }
                    var avgR = sumR / count, avgG = sumG / count, avgB = sumB / count;
                    var varianceSum = 0;
                    for (i = 0; i < data.length; i += 40) {
                        var diffR = data[i] - avgR, diffG = data[i + 1] - avgG, diffB = data[i + 2] - avgB;
                        varianceSum += (diffR * diffR + diffG * diffG + diffB * diffB);
                    }
                    return (varianceSum / count) < CONFIG.VARIANCE_THRESHOLD;
                }

                function extractFirstFrameFromVideo(videoUrl) {
                    return new Promise(function (resolve, reject) {
                        var video = document.createElement("video");
                        video.crossOrigin = "anonymous";
                        video.preload = "metadata";
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        var currentSeekTime = 0;

                        video.onloadedmetadata = function () {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            video.currentTime = currentSeekTime;
                        };
                        video.onseeked = function () {
                            try {
                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                var reachedEnd = currentSeekTime > CONFIG.MAX_SEEK_TIME || currentSeekTime > video.duration;
                                if (!isFrameBlank(canvas, ctx) || reachedEnd) {
                                    canvas.toBlob(function (blob) {
                                        if (blob) resolve(blob);
                                        else reject(new Error("Failed to create blob from canvas"));
                                    }, "image/jpeg", CONFIG.JPEG_QUALITY);
                                } else {
                                    currentSeekTime += CONFIG.SEEK_INCREMENT;
                                    video.currentTime = currentSeekTime;
                                }
                            } catch (error) { reject(error); }
                        };
                        video.onerror = function () { reject(new Error("Failed to load video")); };
                        video.src = videoUrl;
                    });
                }

                function getThumbnailUrl(fileInfo) {
                    var thumbnailImg = fileInfo.closest(".file").querySelector("img.post-image");
                    if (!thumbnailImg || !thumbnailImg.src) throw new Error("No thumbnail found");
                    return thumbnailImg.src;
                }

                function uploadToLitterbox(blob, filename) {
                    var formData = new FormData();
                    formData.append("reqtype", "fileupload");
                    formData.append("time", CONFIG.LITTERBOX_EXPIRY);
                    formData.append("fileToUpload", blob, filename);
                    return fetch(CONFIG.LITTERBOX_API, { method: "POST", body: formData })
                        .then(function (r) { return r.text(); })
                        .then(function (litterboxUrl) {
                            if (!litterboxUrl || litterboxUrl.indexOf("http") !== 0)
                                throw new Error("Invalid response from litterbox");
                            return litterboxUrl;
                        });
                }

                function handleImgOpsClick(fileUrl, imgopsLink, fileInfo, useVideoThumbnail) {
                    var isVideo = /\.(webm|mp4)$/i.test(fileUrl);
                    try {
                        if (!isVideo) {
                            window.open(CONFIG.IMGOPS_URL + fileUrl, "_blank");
                            updateLinkState(imgopsLink, "imgops ✓", "pointer", "green");
                            return;
                        }
                        if (useVideoThumbnail) {
                            var thumbnailUrl = getThumbnailUrl(fileInfo);
                            window.open(CONFIG.IMGOPS_URL + thumbnailUrl, "_blank");
                            updateLinkState(imgopsLink, "imgops (thumb) ✓", "pointer", "green");
                            return;
                        }
                    } catch (error) {
                        updateLinkState(imgopsLink, "imgops (thumb error)", "pointer", "red");
                        return;
                    }

                    var cachedUrl = litterboxCache.get(imgopsLink);
                    var start = Promise.resolve(false);
                    if (cachedUrl) {
                        updateLinkState(imgopsLink, "imgops (checking...)", "wait");
                        start = fetch(cachedUrl, { method: "HEAD" })
                            .then(function (r) { return r.ok; })
                            .catch(function () { return false; });
                    }
                    start.then(function (cacheValid) {
                        if (cacheValid) {
                            window.open(CONFIG.IMGOPS_URL + cachedUrl, "_blank");
                            updateLinkState(imgopsLink, "imgops ✓", "pointer", "green");
                            return null;
                        }
                        updateLinkState(imgopsLink, "imgops (loading...)", "wait");
                        return extractFirstFrameFromVideo(fileUrl).then(function (blob) {
                            return uploadToLitterbox(blob, getFilenameFromUrl(fileUrl, ".jpg"));
                        }).then(function (litterboxUrl) {
                            litterboxCache.set(imgopsLink, litterboxUrl);
                            window.open(CONFIG.IMGOPS_URL + litterboxUrl, "_blank");
                            updateLinkState(imgopsLink, "imgops ✓", "pointer", "green");
                        });
                    }).catch(function (error) {
                        console.error("Error processing for imgops:", error);
                        updateLinkState(imgopsLink, "imgops (error)", "pointer", "red");
                        $SS.notify({ type: "error", content: "Failed to process image for imgops. Please try again.", lifetime: 5 });
                    });
                }

                function createImgOpsLink(text, fileUrl, fileInfo, useVideoThumbnail) {
                    var link = document.createElement("a");
                    link.href = "javascript:void(0)";
                    link.textContent = text;
                    link.className = useVideoThumbnail ? "imgops-link imgops-thumb-link" : "imgops-link";
                    link.style.cursor = "pointer";
                    link.addEventListener("click", function (e) {
                        e.preventDefault();
                        handleImgOpsClick(fileUrl, link, fileInfo, useVideoThumbnail);
                    });
                    return link;
                }

                function hasImgOpsLinks(span) {
                    var sibling = span.nextSibling;
                    while (sibling) {
                        if (sibling.nodeType === 1 && sibling.classList && sibling.classList.contains("imgops-link"))
                            return true;
                        if (sibling.nodeType === 1 && !sibling.classList.contains("imgops-link"))
                            break;
                        sibling = sibling.nextSibling;
                    }
                    return false;
                }

                function addImgOpsLinksToFile(span) {
                    if (hasImgOpsLinks(span)) return;
                    var fileInfo = span.closest(".fileinfo");
                    if (!fileInfo) return;
                    var fileLink = fileInfo.querySelector("a[href*='/src/']");
                    if (!fileLink) return;
                    var fileUrl = fileLink.href;
                    var isVideo = /\.(webm|mp4)$/i.test(fileUrl);
                    var imgopsLink = createImgOpsLink("imgops", fileUrl, fileInfo, false);
                    span.parentNode.insertBefore(document.createTextNode(" ["), span.nextSibling);
                    span.parentNode.insertBefore(imgopsLink, span.nextSibling.nextSibling);
                    if (isVideo) {
                        span.parentNode.insertBefore(document.createTextNode(" | "), span.nextSibling.nextSibling.nextSibling);
                        var thumbLink = createImgOpsLink("imgops (thumb)", fileUrl, fileInfo, true);
                        span.parentNode.insertBefore(thumbLink, span.nextSibling.nextSibling.nextSibling.nextSibling);
                        span.parentNode.insertBefore(document.createTextNode("]"), span.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling);
                    } else {
                        span.parentNode.insertBefore(document.createTextNode("]"), span.nextSibling.nextSibling.nextSibling);
                    }
                }

                function addImgOpsLinks() {
                    document.querySelectorAll(".fileinfo span.unimportant").forEach(addImgOpsLinksToFile);
                }

                function mutationHasFileInfo(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                            var node = mutations[i].addedNodes[j];
                            if (node.nodeType !== 1) continue;
                            if (node.classList && node.classList.contains("fileinfo")) return true;
                            if (node.querySelector && node.querySelector(".fileinfo")) return true;
                        }
                    }
                    return false;
                }

                addImgOpsLinks();
                var observer = new MutationObserver(function (mutations) {
                    if (mutationHasFileInfo(mutations)) {
                        observer.disconnect();
                        addImgOpsLinks();
                        observer.observe(getDocBody(), { childList: true, subtree: true });
                    }
                });
                observer.observe(getDocBody(), { childList: true, subtree: true });
            },

            /* Scroll to new posts only when already at the bottom (Holotower Auto Scroll) */
            initAutoScroll: function () {
                var VISIBILITY_THRESHOLD = 5;
                var STORAGE_KEY = "holotower_auto_scroll_enabled";
                var originalScrollCheckbox = null;
                var autoScrollCheckbox = null;
                var lastPostElements = [];
                var observer = null;

                function saveAutoScrollState(enabled) {
                    try { localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false"); } catch (e) {}
                }
                function loadAutoScrollState() {
                    try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch (e) { return false; }
                }
                function isElementInView(element) {
                    if (!element) return false;
                    var rect = element.getBoundingClientRect();
                    var windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    return rect.top < windowHeight && rect.bottom > 0 &&
                        (rect.bottom - Math.max(rect.top, 0)) >= VISIBILITY_THRESHOLD;
                }
                function isNearBottom() {
                    var scrollPosition = window.innerHeight + window.scrollY;
                    return document.documentElement.scrollHeight - scrollPosition <= 200;
                }
                function getCurrentPosts() {
                    return Array.prototype.slice.call(document.querySelectorAll("p.intro"));
                }
                function isLastPostInView() {
                    var lastPost = lastPostElements[lastPostElements.length - 1];
                    return lastPost ? isElementInView(lastPost) : false;
                }
                function shouldScroll() {
                    return isLastPostInView() || isNearBottom();
                }
                function scrollToBottom() {
                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
                }
                function updatePostRecord() {
                    lastPostElements = getCurrentPosts();
                }
                function checkForNewPosts() {
                    return getCurrentPosts().length > lastPostElements.length;
                }
                function findOriginalScrollCheckbox() {
                    return document.querySelector("input.auto-scroll");
                }
                function createAutoScrollCheckbox() {
                    var originalCheckbox = originalScrollCheckbox;
                    if (!originalCheckbox) return null;
                    originalCheckbox.style.display = "none";
                    var nextSibling = originalCheckbox.nextSibling;
                    while (nextSibling) {
                        if (nextSibling.nodeType === 3 && nextSibling.textContent.indexOf("Scroll to New posts") !== -1) {
                            var span = document.createElement("span");
                            span.style.display = "none";
                            span.textContent = nextSibling.textContent;
                            nextSibling.parentNode.replaceChild(span, nextSibling);
                            break;
                        }
                        nextSibling = nextSibling.nextSibling;
                    }
                    var autoCheckbox = document.createElement("input");
                    autoCheckbox.type = "checkbox";
                    autoCheckbox.id = "auto-scroll-claude";
                    autoCheckbox.className = "auto-scroll-claude";
                    autoCheckbox.checked = loadAutoScrollState();
                    var labelText = document.createTextNode(" Auto Scroll)");
                    var parentContainer = originalCheckbox.parentElement;
                    parentContainer.insertBefore(autoCheckbox, originalCheckbox);
                    parentContainer.insertBefore(labelText, originalCheckbox);
                    return autoCheckbox;
                }
                function handleNewPosts() {
                    var shouldScrollToNew = shouldScroll();
                    updatePostRecord();
                    if (autoScrollCheckbox && autoScrollCheckbox.checked && shouldScrollToNew)
                        scrollToBottom();
                }
                function monitorForNewPosts() {
                    if (checkForNewPosts()) handleNewPosts();
                }
                function setupCheckboxListeners() {
                    if (autoScrollCheckbox) {
                        autoScrollCheckbox.addEventListener("change", function () {
                            saveAutoScrollState(this.checked);
                            if (this.checked && originalScrollCheckbox && originalScrollCheckbox.checked)
                                originalScrollCheckbox.checked = false;
                        });
                    }
                    if (originalScrollCheckbox) {
                        originalScrollCheckbox.addEventListener("change", function () {
                            if (this.checked && autoScrollCheckbox && autoScrollCheckbox.checked) {
                                autoScrollCheckbox.checked = false;
                                saveAutoScrollState(false);
                            }
                        });
                    }
                }

                var INLINE_CONTAINER_CLASS = "inline-quote-container";
                new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (mutation.type !== "childList" || mutation.addedNodes.length === 0) return;
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType !== 1) return;
                            if (node.classList.contains(INLINE_CONTAINER_CLASS))
                                node.setAttribute("data-inline-quote", "true");
                            node.querySelectorAll("." + INLINE_CONTAINER_CLASS).forEach(function (el) {
                                el.setAttribute("data-inline-quote", "true");
                            });
                        });
                    });
                }).observe(getDocBody(), { childList: true, subtree: true });

                function setupObserver() {
                    if (observer) observer.disconnect();
                    observer = new MutationObserver(function (mutations) {
                        var shouldCheck = false;
                        mutations.forEach(function (mutation) {
                            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                                for (var i = 0; i < mutation.addedNodes.length; i++) {
                                    var node = mutation.addedNodes[i];
                                    if (node.nodeType === 1 && node.matches && (
                                        node.matches("p.intro, div.post, .post_no") ||
                                        node.querySelector("p.intro, div.post, .post_no")
                                    ) && !node.closest("[data-inline-quote]") && !node.hasAttribute("data-inline-quote")) {
                                        shouldCheck = true;
                                        break;
                                    }
                                }
                            }
                        });
                        if (shouldCheck) setTimeout(monitorForNewPosts, 100);
                    });
                    observer.observe(getDocBody(), { childList: true, subtree: true });
                }

                function initialize() {
                    originalScrollCheckbox = findOriginalScrollCheckbox();
                    if (!originalScrollCheckbox) return;
                    autoScrollCheckbox = createAutoScrollCheckbox();
                    if (!autoScrollCheckbox) return;
                    updatePostRecord();
                    setupCheckboxListeners();
                    setupObserver();
                    if (autoScrollCheckbox.checked && originalScrollCheckbox.checked)
                        originalScrollCheckbox.checked = false;
                }

                $.waitFor("input.auto-scroll", initialize);

                var reinitTimeout;
                new MutationObserver(function () {
                    clearTimeout(reinitTimeout);
                    reinitTimeout = setTimeout(function () {
                        if (!originalScrollCheckbox || !document.contains(originalScrollCheckbox) ||
                            !autoScrollCheckbox || !document.contains(autoScrollCheckbox)) {
                            initialize();
                        }
                    }, 1000);
                }).observe(getDocBody(), { childList: true, subtree: false });
            },

            /* Highlight and pin catalog threads (Holotower Catalog Highlights and Pin) */
            initCatalogHighlights: function () {
                var STORAGE_KEY = "pinnedThreadSettings";
                var settings = getSettings();

                function getSettings() {
                    var defaults = {
                        highlights: [{ name: "Hololive Global", color: "#00bfff" }],
                        pinThreads: true,
                        hideOlderThreads: false,
                        customSearchBar: true
                    };
                    try {
                        var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
                        if (!parsed || !Array.isArray(parsed.highlights)) throw new Error();
                        for (var key in defaults) {
                            if (!(key in parsed)) parsed[key] = defaults[key];
                        }
                        return parsed;
                    } catch (e) {
                        saveSettings(defaults);
                        return defaults;
                    }
                }
                function saveSettings(s) {
                    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
                }

                function el(tag, attrs, styles, text) {
                    var node = document.createElement(tag);
                    var k;
                    if (attrs) for (k in attrs) node.setAttribute(k, attrs[k]);
                    if (styles) for (k in styles) node.style[k] = styles[k];
                    if (text != null) node.textContent = text;
                    return node;
                }

                function postContainsText(mix, searchText) {
                    var subjectEl = mix.querySelector(".subject");
                    var subjectText = subjectEl ? subjectEl.textContent.trim().replace(/\s+/g, " ").toLowerCase() : "";
                    if (!subjectText) {
                        var strong = mix.querySelector(".replies strong");
                        if (strong && strong.parentNode) {
                            var parts = [];
                            strong.parentNode.childNodes.forEach(function (n) {
                                if (n.nodeType === 3) parts.push(n.textContent);
                            });
                            subjectText = parts.join(" ").toLowerCase();
                        }
                    }
                    var matchText = searchText.trim().replace(/\s+/g, " ").toLowerCase();
                    return !!matchText && subjectText.indexOf(matchText) !== -1;
                }

                function mixSort() {
                    /* Re-sort through the page's MixItUp plugin when reachable */
                    try {
                        var $j = $SS.integrations.jq();
                        if (!$j || !$j.fn || !$j.fn.mixItUp) return;
                        var sortSel = document.getElementById("sort_by");
                        var sortBy = sortSel ? sortSel.value : "bump:desc";
                        $j("#Grid").mixItUp("sort", (sortBy === "random" ? sortBy : "sticky:desc " + sortBy));
                    } catch (e) {}
                }

                function highlightLatestThreads() {
                    if (!settings.highlights || !settings.highlights.length) return;
                    var grid = document.getElementById("Grid");
                    if (!grid) return;
                    var highlightedThreads = {};

                    grid.querySelectorAll(":scope > div.mix").forEach(function (mix) {
                        var thread = mix.querySelector(".thread");
                        if (mix.getAttribute("data-thread-highlighter-hidden") === "true") {
                            mix.style.display = "";
                            mix.setAttribute("data-thread-highlighter-hidden", "false");
                        }
                        mix.classList.remove("highlighted");
                        if (thread) thread.style.boxShadow = "";

                        settings.highlights.forEach(function (setting) {
                            if (!postContainsText(mix, setting.name)) return;
                            mix.classList.add("highlighted");
                            if (setting.color)
                                mix.style.setProperty("--pin-color", setting.color);
                            else
                                mix.style.removeProperty("--pin-color");
                            var matchText = setting.name.trim().replace(/\s+/g, " ").toLowerCase();
                            if (!highlightedThreads[matchText]) highlightedThreads[matchText] = [];
                            highlightedThreads[matchText].push(mix);
                        });
                    });

                    var matchText;
                    for (matchText in highlightedThreads) {
                        highlightedThreads[matchText].sort(function (a, b) {
                            return (+b.getAttribute("data-bump") || 0) - (+a.getAttribute("data-bump") || 0);
                        });
                    }
                    var sortedThreads = Object.keys(highlightedThreads).map(function (key) {
                        return [key, highlightedThreads[key]];
                    }).sort(function (a, b) {
                        return (+a[1][0].getAttribute("data-bump") || 0) - (+b[1][0].getAttribute("data-bump") || 0);
                    });

                    mixSort();

                    sortedThreads.forEach(function (entry) {
                        var threads = entry[1];
                        if (settings.pinThreads) {
                            var first = grid.querySelector(".mix");
                            if (first && first !== threads[0]) {
                                grid.insertBefore(threads[0], first);
                                grid.insertBefore(document.createTextNode(" "), first);
                            }
                        }
                        if (settings.hideOlderThreads) {
                            for (var i = 1; i < threads.length; i++) {
                                threads[i].style.display = "none";
                                threads[i].setAttribute("data-thread-highlighter-hidden", "true");
                            }
                        }
                    });
                }

                function createSettingsButtonAndPopup() {
                    var afterElement = document.querySelector("span.catalog_search") || document.querySelector("select#image_size");
                    if (!afterElement) return;

                    var button = el("button", null, { marginLeft: "6px", padding: "2px 8px", fontSize: "13px" }, "Pin Settings");
                    afterElement.parentNode.insertBefore(button, afterElement.nextSibling);

                    var pinSettings = el("div", { id: "pin-settings", "class": "dialog" }, {
                        position: "fixed", overflow: "auto", maxHeight: "90vh", top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)", padding: "14px", zIndex: 999,
                        width: "330px", borderRadius: "6px", display: "none"
                    });
                    getDocBody().appendChild(pinSettings);

                    button.addEventListener("click", function () {
                        refreshList();
                        pinSettings.style.display = pinSettings.style.display === "none" ? "" : "none";
                    });

                    var closeBtn = el("button", null, {
                        border: "none", background: "transparent", fontSize: "16px", cursor: "pointer",
                        position: "absolute", top: "8px", right: "12px"
                    }, "✖");
                    closeBtn.addEventListener("click", function () { pinSettings.style.display = "none"; });
                    pinSettings.appendChild(closeBtn);

                    pinSettings.appendChild(el("h3", null, { margin: "0", padding: "0" }, "Highlight Settings"));

                    var list = el("div", null, { padding: "0", marginTop: "8px" });
                    pinSettings.appendChild(list);

                    function refreshList() {
                        list.textContent = "";
                        settings.highlights.forEach(function (entry, index) {
                            var listItem = el("div", null, { marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" });
                            list.appendChild(listItem);

                            var subjectInput = el("input", {
                                type: "text", placeholder: "Subject",
                                title: "Text to search in threads subject. If a thread has no subject, its comment is searched instead. Case insensitive"
                            }, { flex: "2", padding: "3px" });
                            subjectInput.value = entry.name;
                            subjectInput.addEventListener("change", function () {
                                entry.name = this.value;
                                saveSettings(settings);
                                highlightLatestThreads();
                            });
                            listItem.appendChild(subjectInput);

                            var colorInput = el("input", { type: "color", "class": "color-picker" }, {
                                width: "30px", height: "30px", border: "none", background: "transparent"
                            });
                            colorInput.value = entry.color;
                            listItem.appendChild(colorInput);

                            var hexInput = el("input", { type: "text", "class": "hex-color", placeholder: "Hex" }, {
                                width: "54px", padding: "3px"
                            });
                            hexInput.value = entry.color;
                            listItem.appendChild(hexInput);

                            colorInput.addEventListener("change", function () {
                                entry.color = this.value;
                                hexInput.value = this.value;
                                saveSettings(settings);
                                highlightLatestThreads();
                            });
                            hexInput.addEventListener("change", function () {
                                if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(this.value)) {
                                    entry.color = this.value;
                                    colorInput.value = this.value;
                                    saveSettings(settings);
                                    highlightLatestThreads();
                                }
                            });

                            var removeBtn = el("button", null, { cursor: "pointer" }, "✖");
                            removeBtn.addEventListener("click", function () {
                                settings.highlights.splice(index, 1);
                                saveSettings(settings);
                                refreshList();
                                highlightLatestThreads();
                            });
                            listItem.appendChild(removeBtn);
                        });
                    }

                    var addBtn = el("button", null, { margin: "8px 0", padding: "4px 8px 4px 5px", cursor: "pointer", display: "block" }, "+ Add");
                    addBtn.addEventListener("click", function () {
                        settings.highlights.push({ name: "", color: "#00bfff" });
                        saveSettings(settings);
                        refreshList();
                        setTimeout(function () {
                            var inputs = list.querySelectorAll("input[placeholder='Subject']");
                            if (inputs.length) inputs[inputs.length - 1].focus();
                        }, 0);
                    });
                    pinSettings.appendChild(addBtn);

                    function checkboxLabel(text, title, checked, marginLeft, onChange) {
                        var label = el("label", { title: title }, marginLeft ? {} : null);
                        var cb = el("input", { type: "checkbox" }, marginLeft ? { marginLeft: marginLeft } : null);
                        cb.checked = checked;
                        cb.addEventListener("change", onChange);
                        label.appendChild(cb);
                        label.appendChild(document.createTextNode(text));
                        pinSettings.appendChild(label);
                        return cb;
                    }
                    checkboxLabel("Pin", "Pin the most recently bumped highlighted threads", settings.pinThreads, null, function () {
                        settings.pinThreads = this.checked;
                        saveSettings(settings);
                        highlightLatestThreads();
                    });
                    checkboxLabel("Hide older threads", "Hide all the older highlighted threads", settings.hideOlderThreads, "10px", function () {
                        settings.hideOlderThreads = this.checked;
                        saveSettings(settings);
                        highlightLatestThreads();
                    });
                    checkboxLabel("Fallback search", "Show a custom search bar if the built-in search bar is missing", settings.customSearchBar, "10px", function () {
                        settings.customSearchBar = this.checked;
                        var bar = document.querySelector(".custom-search-bar");
                        if (bar) bar.style.display = this.checked ? "" : "none";
                        saveSettings(settings);
                    });
                }

                function addSearchBar() {
                    if (document.querySelector("span.catalog_search")) return;
                    var imageSize = document.querySelector("select#image_size");
                    if (!imageSize) return;
                    var searchInput = el("input", { type: "text", placeholder: "Search..." }, { marginLeft: "6px", width: "90px" });
                    searchInput.addEventListener("input", function () {
                        var searchText = this.value;
                        document.querySelectorAll("#Grid > div.mix").forEach(function (mix) {
                            mix.style.display = (!searchText || postContainsText(mix, searchText)) ? "" : "none";
                        });
                    });
                    var span = el("span", { "class": "catalog_search custom-search-bar" });
                    if (!settings.customSearchBar) span.style.display = "none";
                    span.appendChild(searchInput);
                    imageSize.parentNode.insertBefore(span, imageSize.nextSibling);
                }

                $SS.integrations.addStyle("sc-catalog-highlights-css",
                    "/* Generated by StyleTower (Catalog Highlights and Pin) */\n" +
                    ".highlighted > div { box-shadow: inset 0 0 2px 2px var(--pin-color, rgb(var(--sc-threadHLColor-rgb))); }");

                createSettingsButtonAndPopup();
                addSearchBar();
                highlightLatestThreads();
                var sortBy = document.getElementById("sort_by");
                if (sortBy) sortBy.addEventListener("change", function () { highlightLatestThreads(); });
            }
        },

        /* CONFIG */
        Config: {
            init: function () {
                var parseVal = function (key, val) {
                    if (/^(Selected|Hidden)+\s(Themes?)+$/.test(key)) {
                        if (key === "Selected Theme")
                            return parseInt(val);
                        else if (key === "NSFW Theme")
                            return parseInt(val);

                        for (var i = 0, MAX = val.length, ret = []; i < MAX; ++i)
                            ret[i] = parseInt(val[i]);

                        return ret;
                    }

                    return (Array.isArray(val) && typeof val[0] !== "object") ? val[0] : val;
                };

                $SS.conf = [];
                $SS.exportOptions = {};

                for (var key in defaultConfig) {
                    $SS.conf[key] = parseVal(key, this.get(key));
                    if (!(/^::/.test(key))) {
                        $SS.exportOptions[key] = $SS.conf[key];
                    };
                };

                // One-time migration: "Animated GIF Thumbnails" became the
                // Replace Thumbnails group (GIF-only to preserve behavior)
                try {
                    var oldGif = this.get("Animated GIF Thumbnails"),
                        newRaw = $SS.hasGM ? GM_getValue(NAMESPACE + "Replace Thumbnails") :
                            localStorage.getItem(NAMESPACE + "Replace Thumbnails");
                    if (oldGif === true && newRaw == undefined) {
                        this.set("Replace Thumbnails", true);
                        this.set("Replace JPG", false);
                        this.set("Replace PNG", false);
                        $SS.conf["Replace Thumbnails"] = true;
                        $SS.conf["Replace JPG"] = false;
                        $SS.conf["Replace PNG"] = false;
                    }
                } catch (e) {}

                // Include saved site settings in exports
                var chanKeys = ["stylesheet", "name", "email", "password", "own_posts", "watch_js", "hidden_threads", "catalog"];
                chanKeys.forEach(function (key) {
                    try {
                        if (localStorage[key]) {
                            var v;
                            try { v = JSON.parse(localStorage[key]); } catch (er) { v = localStorage[key]; }
                            $SS.exportOptions["SavedSite." + key] = v;
                        }
                    } catch (e) {}
                });

                if (!$SS.location.report) {
                    $SS.conf["Margin Left"] = $SS.conf["Left Margin"] !== 999 ? $SS.conf["Left Margin"] : $SS.conf["Custom Left Margin"];
                    $SS.conf["Margin Right"] = $SS.conf["Right Margin"] !== 999 ? $SS.conf["Right Margin"] : $SS.conf["Custom Right Margin"];
                };
                // "Normal" maps to 4chan's native blockquote margin; vichan's own
                // div.body default is nearly zero, which makes text hug the post
                // edge and wrap fully under thumbnails.
                $SS.conf["Margin Post Message"] = $SS.conf["Post Message Margin"] === 1 ? "4px 16px" : ($SS.conf["Post Message Margin"] === 3 ? "20px 40px" : "13px 40px");
                $SS.conf["Width Decoration"] = $SS.conf["Decoration Width"] !== 999 ? $SS.conf["Decoration Width"] : $SS.conf["Custom Decoration Width"];
            },
            get: function (name) {
                var key = NAMESPACE + name, val;
                try {
                    val = $SS.hasGM ? GM_getValue(key) : localStorage.getItem(key);
                    if (val != undefined) return JSON.parse(val);
                } catch (e) {}
                return defaultConfig[name];
            },
            set: function (name, val) {
                var key = NAMESPACE + name;
                if (typeof val !== "number") val = JSON.stringify(val);
                try {
                    if ($SS.hasGM) GM_setValue(key, val);
                    else localStorage.setItem(key, val);
                } catch (e) {}
            }
        },

        /* OPTIONS */
        options: {
            saveAndClose: false,
            init: function () {
                $(document).bind("keydown", $SS.options.keydown);

                function makeNavLink() {
                    var link = document.createElement("a");
                    link.title = "StyleTower Settings";
                    link.href = "javascript:;";
                    link.addEventListener("click", $SS.options.show);
                    return link;
                }
                function makeNavSpan() {
                    var span = document.createElement("span");
                    span.id = "StyleTowerLink";
                    span.appendChild(document.createTextNode("["));
                    var link = makeNavLink();
                    link.textContent = "StyleTower";
                    span.appendChild(link);
                    span.appendChild(document.createTextNode("]"));
                    return span;
                }
                $.waitFor(".boardlist", function () {
                    document.querySelectorAll(".boardlist").forEach(function (boardlist) {
                        if (boardlist.querySelector("#StyleTowerLink") || boardlist.classList.contains("watch-menu")) return;
                        boardlist.appendChild(makeNavSpan());
                    });
                });
                // The header links are floated right, so DOM order runs right-to-left.
                // Target order (left to right): [Options] [StyleTower] [caret], i.e.
                // DOM order caret, StyleTower, Options. TS builds the caret late,
                // so reposition once it exists.
                $.waitFor(".boardlist a[title='Options']", function (optionsLink) {
                    var boardlist = optionsLink.closest(".boardlist"),
                        span = boardlist && boardlist.querySelector("#StyleTowerLink");
                    if (!span) return;
                    var place = function () {
                        var toggle = boardlist.querySelector(".hb-toggle");
                        if (toggle) boardlist.insertBefore(span, toggle.nextSibling);
                        else boardlist.insertBefore(span, optionsLink);
                    };
                    place();
                    if (!boardlist.querySelector(".hb-toggle"))
                        $.waitFor(".boardlist .hb-toggle", place);
                });
            },
            show: function () {
                // A theme/mascot editor is open: closing the panel under it
                // would leave the editor orphaned and its Save with nothing
                // to write to
                if ($("#overlay2").exists())
                    return;
                if ($("#overlay").exists())
                    $SS.options.close();
                else {
                    var overlay = $("<div id=overlay>").bind("click", $SS.options.close),
                        tOptions = $("<div id='oneechan-options' class=dialog>").bind("click", function (e) {
                            return e.stopPropagation();
                        }),
                        optionsHTML = [
                            "<ul id=options-tabs>",
                            "<li class='tab-item'><label class='tab-label selected' for=main-select>Main</label></li>",
                            "<li class='tab-item'><label class='tab-label' for=misc-select>Misc</label></li>",
                            "<li class='tab-item'><label class='tab-label' for=mascots-select>Mascots</label></li>",
                            "<li class='tab-item'><label class='tab-label' for=themes-select>Themes</label></li>",
                            "</ul><div id=options-container><input type=radio class=tab-select name=tab-select id=main-select hidden checked><div id='main-section' class='options-section'>",
                            "<p class='buttons-container'>",
                            "<span class='btn-left'><a class='options-button' title='Export your settings as JSON.' name=Export>Export</a><a class='options-button' id='import-settings'><input type=file class='import-input' riced=true accept='application/json'>Import</a><a class='options-button' title='Reset StyleTower settings.' name=resetSettings>Reset</a></span>",
                            "<span class='btn-center' id=oneechan-version><span>StyleTower</span> v" + VERSION + "<span class=link-delim> | </span><a href='https://github.com/vampiricwulf/StyleTower/releases/latest' id=changelog-link target='_blank' title='Read the changelog.'>Changelog</a><span class=link-delim> | </span><a href='https://github.com/vampiricwulf/StyleTower/issues' id=issues-link target='_blank' title='Report an issue.'>Issues</a></span>",
                            "<span class='btn-right'><a class='options-button' name=save>Save</a><a class='options-button' name=cancel>Cancel</a></span></p>"
                        ];
                    var key, val, des, id;

                    // Working copy for the Mascots tab; serialized on Save
                    try { $SS.options._mascotWork = JSON.parse($SS.conf["Mascots"] || "[]"); }
                    catch (e) { $SS.options._mascotWork = []; }

                    for (key in defaultConfig) {
                        if (/^(Selected|Hidden)+\s(Themes?)+$/.test(key))
                            continue;

                        if (key === "Style Holotower TS Notifications" && !$SS.isTS())
                            continue;

                        // Set from the mascot editor's own checkbox, not the list
                        if (key === "Advanced Mascot Editor")
                            continue;

                        if (defaultConfig[key][0] === "header") {
                            optionsHTML.push("<label class='option header" + (key === ":: Holotower" || key === ":: Header" ? " has-subsections" : "") + "'><span class='option-title'>" + key + "</span></label>");
                            if (key === ":: Holotower") {
                                optionsHTML.push("<p class='option-actions'><a class='options-button' name=saveSiteSettings>Save Holotower settings</a><span class=link-delim> | </span><a class='options-button' name=restoreSiteSettings>Restore</a></p>");
                            }
                            continue;
                        }

                        val = $SS.conf[key];
                        des = defaultConfig[key][1];

                        if ((defaultConfig[key][4] === true) && (key === "Custom Left Margin")) {
                            var pVal = $SS.conf[defaultConfig[key][2]];
                            id = defaultConfig[key][2].replace(/\s/g, "_") + defaultConfig[key][3];
                            optionsHTML.push("<span class='option suboption " + id + "' title=\"" + des + "\"" +
                                (pVal != defaultConfig[key][3] ? "hidden" : "") + "><span class='option-title'>" + key +
                                "</span><input name='Custom Left Margin' type=text value=" + $SS.conf["Custom Left Margin"] + "px></span>");
                        } else if ((defaultConfig[key][4] === true) && (key === "Custom Right Margin")) {
                            var pVal = $SS.conf[defaultConfig[key][2]];
                            id = defaultConfig[key][2].replace(/\s/g, "_") + defaultConfig[key][3];
                            optionsHTML.push("<span class='option suboption " + id + "' title=\"" + des + "\"" +
                                (pVal != defaultConfig[key][3] ? "hidden" : "") + "><span class='option-title'>" + key +
                                "</span><input name='Custom Right Margin' type=text value=" + $SS.conf["Custom Right Margin"] + "px></span>");
                        } else if ((defaultConfig[key][4] === true) && (key === "Custom Decoration Width")) {
                            var pVal = $SS.conf[defaultConfig[key][2]];
                            id = defaultConfig[key][2].replace(/\s/g, "_") + defaultConfig[key][3];
                            optionsHTML.push("<span class='option suboption " + id + "' title=\"" + des + "\"" +
                                (pVal != defaultConfig[key][3] ? "hidden" : "") + "><span class='option-title'>" + key +
                                "</span><input name='Custom Decoration Width' type=text value=" + $SS.conf["Custom Decoration Width"] + "px></span>");
                        } else if ((defaultConfig[key][4] === true) && (key === "Dark Theme" || key === "Light Theme")) {
                            var pVal = $SS.conf[defaultConfig[key][2]];
                            id = defaultConfig[key][2].replace(/\s/g, "_") + defaultConfig[key][3];
                            var html = "<label class='option suboption " + id + "' title=\"" + des + "\"" +
                                (pVal != defaultConfig[key][3] ? "hidden" : "") + "><span class='option-title'>" + key + "</span>" +
                                "<select name='" + key + "'>";
                            for (var i = 0, MAX = $SS.conf["Themes"].length; i < MAX; ++i) {
                                html += "<option value='" + i + "'" + (i == val ? " selected" : "") + ">" +
                                    $SS.escapeHTML($SS.conf["Themes"][i].name) + "</option>";
                            }
                            html += "</select></label>";
                            optionsHTML.push(html);
                        } else if (key === "Enable Mascots") {
                            // The Mascots tab: master toggle + display options render
                            // into it via the generic branches below, then the
                            // "Mascots" key emits the gallery
                            optionsHTML.push("</div><input type=radio class=tab-select name=tab-select id=mascots-select hidden><div id='mascot-section' class='options-section'>" +
                                "<p class='buttons-container'><span class='btn-right'><a class='options-button' name=save>Save</a><a class='options-button' name=cancel>Cancel</a></span></p>" +
                                "<label class='option header'><span class='option-title'>:: Mascots</span></label>" +
                                "<label class=option title=\"" + des + "\"><span class='option-title'>" + key + "</span><input" + (val ? " checked" : "") + " name='" + key + "' type=checkbox></label>");
                        } else if ((defaultConfig[key][4] === true) && (key === "Mascots")) {
                            optionsHTML.push($SS.options.mascotGalleryHTML());
                        } else if (defaultConfig[key][4] === true) // sub-option
                        {
                            var pVal = $SS.conf[defaultConfig[key][2]];
                            id = defaultConfig[key][2].replace(/\s/g, "_") + defaultConfig[key][3];
                            optionsHTML.push("<label class='option suboption " + id + "' title=\"" + des + "\"" +
                                (pVal != defaultConfig[key][3] ? "hidden" : "") + "><span class='option-title'>" + key +
                                "</span><input" + (val ? " checked" : "") + " name='" + key + "' type=checkbox></label>");
                        } else if (Array.isArray(defaultConfig[key][2])) // select
                        {
                            var opts = defaultConfig[key][2],
                                cFonts = [],
                                html = ["<label class=option title=\"" + des + "\"><span class='option-title'>" + key + "</span>",
                                    "<select name='" + key + "'" + (defaultConfig[key][3] === true ? " has-suboption" : "") + ">"];

                            for (var i = 0, MAX = opts.length; i < MAX; ++i) {
                                var name, value;

                                if (typeof opts[i] === "object") {
                                    name = opts[i].name;
                                    value = opts[i].value;
                                } else
                                    name = value = opts[i];

                                if (key === "Font Family") cFonts.push(value);
                                html.push("<option" + (key === "Font Family" ? " style=\"font-family:" + $SS.formatFont(value) + "!important\"" : "") +
                                    " value='" + value + "'" + (value == val ? " selected" : "") + ">" + name + "</option>");
                            }

                            if (key === "Font Family") {
                                var osFonts = $SS.systemFonts[$SS.getOS()] || [];
                                osFonts.forEach(function (font) {
                                    if (cFonts.indexOf(font) === -1) {
                                        cFonts.push(font);
                                        html.push("<option style=\"font-family:" + $SS.formatFont(font) + "!important\" value='" + font + "'" + (font == val ? " selected" : "") + ">" + font + "</option>");
                                    }
                                });
                            }
                            if (key === "Font Family" && cFonts.indexOf($SS.conf["Font Family"]) == -1)
                                html.push("<option style=\"font-family:" + $SS.formatFont($SS.conf["Font Family"]) + "!important\" value='" + $SS.conf["Font Family"] + "' selected>" + $SS.conf["Font Family"] + "</option>");
                            html.push("</select></label>");
                            optionsHTML.push(html.join(""));
                        } else if (key === "Custom Font") {
                            optionsHTML.push("<label class='option visible' title=\"" + des + "\"><span class='option-title'>Custom Font</span>" +
                                "<input type=text name='Custom Font' value=\"" + ($SS.conf["Custom Font"] || "") + "\" placeholder='system font name'></label>");
                        } else if (key === "QR Button Image") {
                            optionsHTML.push("<label class='option visible' title=\"" + des + "\"><span class='option-title'>" + key + "</span>" +
                                "<input type=text name='QR Button Image' value=\"" + String($SS.conf["QR Button Image"] || "").replace(/"/g, "&quot;") + "\" placeholder='image URL or data URI'></label>");
                        } else if (key === "Font Size") {
                            optionsHTML.push("<label class='option visible' title=\"" + des + "\"><span class='option-title'>" + key + "</span>" +
                                "<input type=text name='Font Size' value=" + $SS.conf["Font Size"] + "px></label>");
                        } else if (key === "UI Font Size") {
                            optionsHTML.push("<label class='option visible' title=\"" + des + "\"><span class='option-title'>" + key + "</span>" +
                                "<input type=text name='UI Font Size' value=" + $SS.conf["UI Font Size"] + "px></label>");
                        } else if (key === "Backlink Font Size") {
                            optionsHTML.push("<label class='option visible' title=\"" + des + "\"><span class='option-title'>" + key + "</span>" +
                                "<input type=text name='Backlink Font Size' value=" + $SS.conf["Backlink Font Size"] + "px></label>");
                        } else if (key === "Misc") {
                            optionsHTML.push("</div><input type=radio class=tab-select name=tab-select id=misc-select hidden><div id='misc-section' class='options-section'>" +
                                "<p class='buttons-container'><span class='btn-right'><a class='options-button' name=save>Save</a><a class='options-button' name=cancel>Cancel</a></span></p>");
                        } else if (key === "Themes") {
                            optionsHTML.push("</div><input type=radio class=tab-select name=tab-select class=tab-select  id=themes-select hidden><div id='themes-section' class='options-section'>");
                        } else if (key === "Opacity") {
                            optionsHTML.push("<label class='option' title=\"" + des + "\"><span class='option-title'>" + key + "</span>" +
                                "<input type=range name=Opacity min=0 max=100 value=" + val + " class='mascot-opacity'><span class='mascot-opacity-val'>" + val + "%</span></label>");
                        } else // checkbox
                            optionsHTML.push("<label class=option title=\"" + des + "\"><span class='option-title'>" + key + "</span><input" + (val ? " checked" : "") +
                                " name='" + key + "' " + (defaultConfig[key][3] === true ? " has-suboption" : "") + " type=checkbox></label>");
                    }

                    optionsHTML.push("</div></div>");
                    tOptions.html(optionsHTML.join(""));
                    overlay.append(tOptions);

                    // Provenance badges (4chan-neXT-style): 'Tower' marks
                    // options added relative to upstream StyleChan, 'changed'
                    // marks ones whose behavior differs here
                    (function () {
                        var status = {
                                "Replace Thumbnails": "added",
                                "QR Button Image": "added",
                                "Auto Scroll": "added",
                                "ImgOps Links": "added",
                                "Sauce Links": "added",
                                "Catalog Highlights": "added",
                                "Hide Mascots in Catalog": "added",
                                "Mascots Overlap Posts": "added",
                                "Reduce Mascot Opacity": "added",
                                "Mascot Max Width": "added",
                                "Use StyleTower Icons": "changed",
                                "Style Holotower TS Notifications": "changed",
                                "Margin Between Replies": "changed",
                                "Autohide Style": "changed",
                                "Enable Mascots": "changed"
                            },
                            rootEl = tOptions.elems[0];
                        if (!rootEl) return;
                        Object.keys(status).forEach(function (k) {
                            var input = rootEl.querySelector("[name='" + k + "']"),
                                row = input && (input.closest("label.option") || input.closest(".option"));
                            if (row) row.setAttribute("data-tower-status", status[k]);
                        });
                        rootEl.querySelectorAll("label.option.header").forEach(function (h) {
                            var t = h.textContent || "";
                            if (t.indexOf(":: Holotower") !== -1) h.setAttribute("data-tower-status", "added");
                            if (t.indexOf(":: Mascots") !== -1) h.setAttribute("data-tower-status", "changed");
                        });
                        var mtab = rootEl.querySelector("label.tab-label[for=mascots-select]");
                        if (mtab) mtab.setAttribute("data-tower-status", "changed");
                    })();

                    $(".import-input", tOptions).bind("change", function () {
                        var file = this.files[0],
                            reader = new FileReader(),
                            key, imported, val;
                        if (this.files[0].name.match(/\.json$/) == null) {
                            alert('Only JSON files are accepted!');
                            return;
                        } else if (!confirm('Your current settings will be entirely overwritten, are you sure?')) {
                            return;
                        }
                        reader.onload = (function () {
                            return function (e) {
                                try {
                                    imported = JSON.parse(e.target.result);
                                } catch (err) {
                                    alert("Invalid settings file!");
                                    return;
                                }

                                $SS.options.importSettings(imported);

                                if (confirm('Import successful. Refresh now?')) {
                                    return window.location.reload();
                                }
                                // Close so the open dialog's pre-import state
                                // can't overwrite the import via a later Save
                                $SS.options.close();

                            };
                        })(file);

                        reader.readAsText(file);
                    });
                    $("a[name=Export]", tOptions).bind("click", function () {
                        if ($("a[download]", tOptions).exists())
                            return;
                        var exportalert = $("<a class='options-button' download='StyleTower v" + VERSION + " Settings.json' href='data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify($SS.exportOptions, null, 2)))) + "'>Save me!").bind("click", $SS.options.close);
                        return $(this).replace(exportalert);
                    });
                    // Reset settings
                    $("a[name=resetSettings]", tOptions).bind("click", function () {
                        var confirmReset = confirm('Your current StyleTower settings will be wiped, are you sure?');
                        if (confirmReset) {
                            try {
                                if ($SS.hasGM) {
                                    var keys = GM_listValues();
                                    for (var i = 0, key = null; key = keys[i]; i++) {
                                        GM_deleteValue(key);
                                    }
                                }
                            } catch (e) {}
                            try {
                                Object.keys(localStorage).forEach(function (key) {
                                    if (/^(?:StyleTower)/.test(key)) {
                                        localStorage.removeItem(key);
                                    }
                                });
                            } catch (e) {}
                            alert('Your StyleTower settings have been reset. Reloading.');
                            return window.location.reload();
                        } else return;
                    });
                    // options window
                    $(".tab-label", tOptions).bind("click", function (e) {
                        var $this = $(this);
                        if ($this.hasClass("selected")) return;

                        $(".tab-label.selected").removeClass("selected");
                        $this.addClass("selected");
                    });
                    $("[has-suboption]", tOptions).bind("change", function () {
                        var id = this.name.replace(/\s/g, "_") + $(this).val(),
                            sub = $("." + id);

                        if (sub.exists())
                            sub.each(function () {
                                this.removeAttribute("hidden");
                            });
                        else
                            $("[class*='" + this.name.replace(/\s/g, "_") + "']").each(function () {
                                this.setAttribute("hidden", "");
                            });
                    });
                    $("input[name='System Theming']", tOptions).bind("change", function () {
                        var id = this.name.replace(/\s/g, "_") + this.checked,
                            sub = $("." + id);
                        if (sub.exists())
                            sub.each(function () { this.removeAttribute("hidden"); });
                        else
                            $("[class*='" + this.name.replace(/\s/g, "_") + "']").each(function () {
                                this.setAttribute("hidden", "");
                            });
                    });
                    // Mascots tab: gallery interactions on the working copy
                    var optsNode = tOptions.elems[0];
                    if (optsNode) {
                        optsNode.addEventListener("click", function (e) {
                            var work = $SS.options._mascotWork;
                            if (!work) return;
                            if (e.target.closest(".mascot-add")) {
                                $SS.options.showMascotEditor(-1);
                                return;
                            }
                            if (e.target.closest(".mascot-select-all") || e.target.closest(".mascot-select-none")) {
                                var on = !!e.target.closest(".mascot-select-all");
                                work.forEach(function (m) { m.enabled = on; });
                                $SS.options.renderMascotGallery();
                                return;
                            }
                            var edit = e.target.closest(".mascot-edit");
                            if (edit) {
                                $SS.options.showMascotEditor(parseInt(edit.closest(".mascot-tile").getAttribute("data-idx")));
                                return;
                            }
                            var del = e.target.closest(".mascot-del");
                            if (del) {
                                work.splice(parseInt(del.closest(".mascot-tile").getAttribute("data-idx")), 1);
                                $SS.options.renderMascotGallery();
                                return;
                            }
                            var tile = e.target.closest(".mascot-tile");
                            if (tile) {
                                var m = work[parseInt(tile.getAttribute("data-idx"))];
                                if (m) {
                                    m.enabled = m.enabled === false;
                                    tile.classList.toggle("selected", m.enabled);
                                }
                            }
                        });
                    }
                    $("a[name=save]", tOptions).bind("click", function () {
                        $SS.options.saveAndClose = true;
                        $SS.options.save();
                        $SS.options.saveAndClose = false;
                    });
                    $("a[name=cancel]", tOptions).bind("click", $SS.options.close);

                    // main tab
                    $("input[name='Font Size']", tOptions).bind("keydown", function (e) {
                        var val = parseInt($(this).val());

                        if (e.key === "ArrowUp" && !isNaN(val))
                            $(this).val(++val + "px");
                        else if (e.key === "ArrowDown" && !isNaN(val))
                            $(this).val(--val + "px");
                    });
                    $("input[name='Opacity']", tOptions).bind("input", function () {
                        var v = this.parentNode.querySelector(".mascot-opacity-val");
                        if (v) v.textContent = this.value + "%";
                    });

                    // themes tab
                    $SS.options.createThemesTab(tOptions);

                    // Holotower settings button handlers
                    (function () {
                        var chanKeys = ["stylesheet", "name", "email", "password", "own_posts", "watch_js", "hidden_threads", "catalog"];
                        $("a[name=saveSiteSettings]", tOptions).bind("click", function () {
                            var count = 0;
                            chanKeys.forEach(function (key) {
                                var val = localStorage[key];
                                if (val) {
                                    $SS.Config.set("SavedSiteSettings." + key, val);
                                    count++;
                                }
                            });
                            if (count > 0)
                                $SS.notify({ content: 'Holotower settings saved.', type: 'success', lifetime: 3 });
                            else
                                $SS.notify({ content: 'No Holotower settings found.', type: 'info', lifetime: 3 });
                        });
                        $("a[name=restoreSiteSettings]", tOptions).bind("click", function () {
                            var count = 0;
                            chanKeys.forEach(function (key) {
                                var saved = $SS.Config.get("SavedSiteSettings." + key);
                                if (saved) {
                                    localStorage[key] = saved;
                                    count++;
                                }
                            });
                            if (count > 0) {
                                $SS.notify({ content: 'Holotower settings restored. Reloading...', type: 'success', lifetime: 2 });
                                setTimeout(function () { location.reload(); }, 2000);
                            } else
                                $SS.notify({ content: 'No saved Holotower settings to restore.', type: 'info', lifetime: 3 });
                        });
                    })();

                    return $(getDocBody()).append(overlay);
                }
            },
            /* Reduces an imported theme object to known keys with validated
               values. Foreign flags never survive: an imported "default"
               would be skipped by every save and vanish on reload, and
               editor bookkeeping must not enter the array */
            sanitizeTheme: function (raw) {
                var t = {},
                    strKeys = ["name", "authorName", "authorTrip", "customCSS"],
                    i, k, v;

                for (i = 0; i < strKeys.length; i++)
                    if (typeof raw[strKeys[i]] === "string" && raw[strKeys[i]] !== "")
                        t[strKeys[i]] = raw[strKeys[i]];
                if (!t.name)
                    t.name = "Imported Theme";

                for (i = 0; i < themeInputs.length; i++) {
                    k = themeInputs[i].name;
                    v = $SS.normalizeHex(raw[k]);
                    if (v) t[k] = v;
                }

                t.replyOp = $SS.normalizeOpacity(raw.replyOp, "1.0");
                t.navOp = $SS.normalizeOpacity(raw.navOp, "0.9");
                t.hoverOp = $SS.normalizeOpacity(raw.hoverOp, "0.8");
                t.hoverOutOp = $SS.normalizeOpacity(raw.hoverOutOp, "0.5");

                if (typeof raw.bgImg === "string" && raw.bgImg !== "") {
                    v = $SS.cleanBase64(raw.bgImg);
                    if ($SS.validImageURL(v) || $SS.validBase64(v)) {
                        t.bgImg = v;
                        t.bgRPA = typeof raw.bgRPA === "string" && /^\S+ \S+ \S+ \S+$/.test(raw.bgRPA) ?
                            raw.bgRPA : "repeat top left scroll";
                    }
                }

                return t;
            },
            createThemesTab: function (tOptions) {
                var themes = $("#themes-section", tOptions).html(""),
                    p = $("<p class='buttons-container'>"),
                    left = $("<span class='btn-left'>");

                left.append($("<a class='options-button' name=addTheme title='Create a new theme.'>Create", tOptions).bind("click", $SS.options.showTheme));
                left.append($("<a class='options-button' href='https://github.com/3nly/StyleChan/wiki/Custom-Themes#custom-themes' target='_blank' title='Browse more themes on GitHub.'>More Themes</a>"));
                left.append($("<div id='import-link' title='Import a new theme file.'>").append($("<input type=file class='import-input' riced=true accept='application/json'>")
                    .bind("change", function () {
                        var file = this.files[0],
                            reader = new FileReader(),
                            theme, div, index;

                        reader.onload = (function () {
                            return function (e) {
                                try {
                                    theme = JSON.parse(e.target.result);
                                } catch (err) {
                                    alert("Invalid theme file!");
                                    return;
                                }

                                if (!theme || typeof theme !== "object" || Array.isArray(theme) ||
                                    !theme.textColor || !theme.mainColor) {
                                    alert("Invalid theme file!");
                                    return;
                                }

                                theme = $SS.options.sanitizeTheme(theme);

                                index = $SS.conf["Themes"].push(theme);
                                theme = new $SS.Theme(--index);
                                div = theme.preview();
                                $("#overlay #themes-section").append(div);
                                div.fire("click").scrollIntoView(true);
                                $SS.options.refreshThemeSelects();
                            };
                        })(file);

                        reader.readAsText(file);
                    })).append($("<span class='options-button'>Import")));
                left.append($("<a class='options-button' name=restoreThemes title='Restore hidden default themes'>Restore", tOptions)
                    .bind("click", function () {
                        $SS.conf["Hidden Themes"] = [];
                        $SS.Config.set("Hidden Themes", []);
                        $("#themes-section>div[hidden]").show();
                        $(this).hide();
                    })
                );

                p.append(left);
                p.append($("<span class='btn-right'><a class='options-button' name=save>Save</a><a class='options-button' name=cancel>Cancel</a></span>"));
                $("a[name=save]", p).bind("click", function () {
                    $SS.options.saveAndClose = true;
                    $SS.options.save();
                    $SS.options.saveAndClose = false;
                });
                $("a[name=cancel]", p).bind("click", $SS.options.close);

                if ($SS.conf["Hidden Themes"].length === 0)
                    $("a[name=restoreThemes]", p).hide();

                themes.append(p);

                for (var i = 0, MAX = $SS.conf["Themes"].length, tTheme; i < MAX; ++i) {
                    tTheme = new $SS.Theme(i);
                    themes.append(tTheme.preview());
                }
            },
            close: function () {
                return $("#overlay").remove();
            },
            keydown: function (e) {
                if (e.ctrlKey && e.key === "F1") {
                    e.preventDefault();
                    e.stopPropagation();
                    $SS.options.show();
                }
            },
            /* Persists only theme state (list, selection, hidden). Callers
               re-apply with $SS.init(true). Guarded: writing while the
               panel is gone would collect nothing and wipe every user
               theme from storage. */
            saveThemeState: function () {
                if (!$("#oneechan-options #themes-section").exists())
                    return false;

                var themes = [],
                    nsfwTheme,
                    selectedTheme;

                $("#oneechan-options #themes-section>div").each(function () {
                    var oldIndex = parseInt(this.id.substr(5)),
                        t = $SS.conf["Themes"][oldIndex];
                    if (t && !t.default && !t._isPreview) {
                        // Editor bookkeeping must not reach storage
                        delete t.modified;
                        delete t.mHandler;
                        themes.push(t);
                    }
                });

                selectedTheme = (selectedTheme = $("#oneechan-options #themes-section>div.selected")).exists() ?
                    parseInt(selectedTheme.attr("id").substr(5)) : 0;
                // Ensure selectedTheme is valid
                if (selectedTheme >= $SS.conf["Themes"].length || !$SS.conf["Themes"][selectedTheme]) {
                    selectedTheme = 0;
                }

                nsfwTheme = (nsfwTheme = $("#oneechan-options #themes-section>div.nsfw")).exists() ?
                    parseInt(nsfwTheme.attr("id").substr(5)) : 0;
                // Ensure nsfwTheme is valid
                if (nsfwTheme >= $SS.conf["Themes"].length || !$SS.conf["Themes"][nsfwTheme]) {
                    nsfwTheme = 0;
                }

                $SS.Config.set("Themes", themes);
                $SS.Config.set("Selected Theme", selectedTheme);
                $SS.Config.set("NSFW Theme", nsfwTheme);
                $SS.Config.set("Hidden Themes", $SS.conf["Hidden Themes"]);
                return true;
            },
            /* Rebuilds the Dark/Light Theme select options after the theme
               list changes shape (delete/import), so their indices can't go
               stale against the compacted array */
            refreshThemeSelects: function () {
                $("#oneechan-options select[name='Dark Theme'], #oneechan-options select[name='Light Theme']").each(function () {
                    var cur = parseInt($SS.conf[this.name], 10) || 0,
                        html = "";
                    for (var i = 0, MAX = $SS.conf["Themes"].length; i < MAX; ++i)
                        html += "<option value='" + i + "'" + (i === cur ? " selected" : "") + ">" +
                            $SS.escapeHTML($SS.conf["Themes"][i].name) + "</option>";
                    this.innerHTML = html;
                });
            },
            save: function () {
                // Never write from a dead panel: the collectors below would
                // see nothing and wipe stored state
                if (!$("#oneechan-options").exists())
                    return;

                // Save main
                $("#oneechan-options input[name]:not(.tab-select), #oneechan-options select").each(function () {
                    var $this = $(this),
                        name = $this.attr("name"),
                        val = $this.val();

                    if (/^(Font Size|Custom (Right|Left) Margin|Custom Decoration Width|UI Font Size|Backlink Font Size|Dark Theme|Light Theme|Opacity)$/.test(name)){
                        val = parseInt(val);
                    }

                    $SS.Config.set(name, val);
                });

                // Save Mascots (gallery edits live in the working copy)
                if ($SS.options._mascotWork)
                    $SS.Config.set("Mascots", JSON.stringify($SS.options._mascotWork));

                $SS.options.saveThemeState();

                if ($SS.options.saveAndClose)
                    $SS.options.close();

                return $SS.init(true);
            },
            /* Settings import: accepts StyleTower, upstream StyleChan and
               original OneeChan exports, normalizing renamed keys and both
               foreign mascot formats into ours */
            importSettings: function (imported) {
                // OneeChan's default theme list in its own order (v5.x): its
                // exported theme indices point into this, not into our list
                var ONEECHAN_THEMES = ["Vimyanized Dark", "Muted", "Surf", "Stilig",
                        "Minimalistic Mayhem", "Blackboard", "Dark Flat", "Yukimura",
                        "Photons + Odin", "Photon", "Original Minimalistic Mayhem",
                        "Tomorrow", "Yotsuba", "Yotsuba B", "Yotsuba Purple",
                        "安心院なじみ", "Solarized Dark", "4chan Rewired Modded",
                        "4chan Dark Upgrade", "Yasashii", "AppChan", "Zenburned",
                        "Monokai", "Ao ni sarasu", "Blue Tone", "Cold Snap",
                        "Midnight Caek", "Cyber Blue", "Colorblind", "Stalenhag",
                        "Blue Phallus", "Prisma Magica"],
                    keyMap = {
                        "Use StyleChan Icons": "Use StyleTower Icons",
                        "Style 4chanX Notifications": "Style Holotower TS Notifications",
                        "Post Decoration Style": "Decoration Style",
                        "Post Decoration Width": "Decoration Width",
                        "Post Highlight Style": "Highlight Style"
                    },
                    num = function (v) {
                        var n = parseInt(v, 10);
                        return isNaN(n) ? 0 : n;
                    },
                    rawMascots = imported["Mascots"],
                    // OneeChan stores mascots as a plain array (and has no
                    // master toggle); StyleChan/StyleTower as a JSON string
                    isOneeChan = Array.isArray(rawMascots) || ("Version Fix" in imported),
                    mascots = null;

                // OneeChan's three-state scrollbars → our two toggles
                if (typeof imported["Scrollbar Type"] === "number") {
                    imported["Style Scrollbars"] = imported["Scrollbar Type"] > 0;
                    imported["Thin Scrollbars"] = imported["Scrollbar Type"] === 2;
                }

                if (typeof rawMascots === "string") {
                    try { mascots = JSON.parse(rawMascots); } catch (e) { mascots = null; }
                } else if (Array.isArray(rawMascots)) {
                    mascots = rawMascots;
                }
                if (Array.isArray(mascots)) {
                    var grayAll = imported["Grayscale Mascots"] === true;
                    mascots = mascots.filter(function (m) {
                        return m && (m.url || m.img);
                    }).map(function (m) {
                        var out = {
                            name: m.name || "",
                            url: m.url || m.img,
                            width: m.width || "auto",
                            height: m.height || "auto",
                            opacity: m.opacity == null ? 100 : num(m.opacity),
                            offset: num(m.offset),
                            hoffset: num(m.hoffset),
                            flip: m.flip === true,
                            enabled: m.enabled !== false
                        };
                        if (m.scale) out.scale = num(m.scale);
                        // OneeChan marks maxwidth per mascot; keep both states
                        // explicit so our global default can't flip them
                        if (m.maxwidth === false) out.maxwidth = false;
                        else if (m.maxwidth === true) out.maxwidth = true;
                        if (m.side === "left" || m.side === "right") out.side = m.side;
                        if (m.boards) out.boards = String(m.boards);
                        // ours is an array; OneeChan uses flat tclip/lclip/…
                        var clip = Array.isArray(m.clip) ? m.clip :
                            [num(m.tclip), num(m.lclip), num(m.bclip), num(m.rclip)];
                        if (clip[0] || clip[1] || clip[2] || clip[3]) out.clip = clip;
                        var fl = {}, fk, has = false;
                        for (fk in (m.filters || {})) fl[fk] = m.filters[fk];
                        if (grayAll && fl.gray == null) fl.gray = 100;
                        for (fk in fl) { has = true; break; }
                        if (has) out.filters = fl;
                        return out;
                    });
                    imported["Mascots"] = JSON.stringify(mascots);
                    if (imported["Enable Mascots"] === undefined && mascots.length)
                        imported["Enable Mascots"] = true;
                }
                delete imported["Grayscale Mascots"];

                for (var key in imported) {
                    var target = keyMap[key] || key,
                        val = imported[key];
                    // Foreign bookkeeping and saved-site blobs never transfer
                    if (/^(Hidden Themes|Themes|Selected Mascots|Hidden Mascots|Total Mascots|Version Fix|Scrollbar Type)$/.test(target))
                        continue;
                    if (/^Saved4chan\./.test(key))
                        continue;
                    if (/^(Selected Theme|NSFW Theme|Dark Theme|Light Theme)$/.test(target)) {
                        if (typeof val !== "number" || val < 0) continue;
                        if (isOneeChan) {
                            // OneeChan's theme order differs from ours: resolve
                            // the index to a theme name, then find that name in
                            // our list. Themes we don't ship are skipped
                            var tName = ONEECHAN_THEMES[val], mapped = -1;
                            ($SS.conf["Themes"] || []).forEach(function (t, ti) {
                                if (mapped === -1 && t && t.name === tName) mapped = ti;
                            });
                            if (mapped === -1) continue;
                            val = mapped;
                        } else if (val >= ($SS.conf["Themes"] || []).length) {
                            // StyleChan/StyleTower share the default list;
                            // just guard the range
                            continue;
                        }
                    } else if (!(target in defaultConfig) && !/^SavedSite\./.test(key)) {
                        continue;
                    }
                    $SS.Config.set(target, val);
                }
            },
            /* Mascots tab (OneeChan-style gallery + editor over a working copy) */
            mascotEsc: function (s) {
                return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
            },
            mascotName: function (m, i) {
                if (m.name) return m.name;
                var base = String(m.url || "").split("/").pop().split("?")[0]
                    .replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
                if (/^data:/i.test(m.url || "") || !base) base = "Mascot " + (i + 1);
                return base;
            },
            mascotGalleryHTML: function () {
                var work = $SS.options._mascotWork || [],
                    esc = $SS.options.mascotEsc,
                    html = ["<div class='option mascot-gallery-wrap'>",
                        "<p class='mascot-controls'>",
                        "<a class='options-button mascot-add' title='Add a new mascot.'>Add Mascot</a>",
                        "<a class='options-button mascot-select-all' title='Select every mascot.'>All</a>",
                        "<a class='options-button mascot-select-none' title='Deselect every mascot.'>None</a>",
                        "<span class='mascot-hint'>Click a tile to select it; hover a tile to edit or delete.</span></p>",
                        "<div class='mascot-gallery'>"];
                if (!work.length)
                    html.push("<span class='mascot-empty'>No mascots yet &mdash; use Add Mascot to create one.</span>");
                work.forEach(function (m, i) {
                    var name = esc($SS.options.mascotName(m, i)),
                        filterCSS = $SS.mascotFilterCSS(m),
                        tileStyle = (m.flip ? "transform:scaleX(-1);" : "") + (filterCSS ? "filter:" + filterCSS + ";" : "");
                    html.push("<div class='mascot-tile" + (m.enabled !== false ? " selected" : "") + "' data-idx='" + i + "'>" +
                        "<img src=\"" + esc(m.url) + "\" loading='lazy'" + (tileStyle ? " style='" + tileStyle + "'" : "") + ">" +
                        "<span class='mascot-tile-name' title=\"" + name + "\">" + name + "</span>" +
                        "<span class='mascot-tile-btns'><a class='mascot-edit' title='Edit mascot'>&#9998;</a><a class='mascot-del' title='Delete mascot'>&times;</a></span></div>");
                });
                html.push("</div></div>");
                return html.join("");
            },
            renderMascotGallery: function () {
                var wrap = document.querySelector("#mascot-section .mascot-gallery-wrap");
                if (!wrap) return;
                var tmp = document.createElement("div");
                tmp.innerHTML = $SS.options.mascotGalleryHTML();
                wrap.parentNode.replaceChild(tmp.firstChild, wrap);
            },
            showMascotEditor: function (mIndex) {
                var bEdit = typeof mIndex === "number" && mIndex >= 0,
                    work = $SS.options._mascotWork || ($SS.options._mascotWork = []),
                    m = bEdit ? work[mIndex] : {},
                    esc = $SS.options.mascotEsc;
                if (!m) return;
                var f = function (v, d) { return v === undefined || v === null ? d : v; },
                    clip = m.clip || [0, 0, 0, 0],
                    filters = m.filters || {},
                    advanced = $SS.conf["Advanced Mascot Editor"] === true,
                    off = parseInt(f(m.offset, 0), 10),
                    hoff = parseInt(f(m.hoffset, 0), 10),
                    slider = function (title, name, val, min, max, unit, tip, modeCls) {
                        return "<label class='add-mascot-label" + (modeCls || "") + "' title='" + tip + "'><span class='option-title'>" + title + ":</span>" +
                            "<input type=range name=" + name + " min=" + min + " max=" + max + " value='" + val + "' data-unit='" + unit + "' class='mascot-opacity'>" +
                            "<span class='mascot-opacity-val'>" + val + unit + "</span></label>";
                    },
                    div = $("<div id='add-mascot' class='dialog" + (advanced ? " advanced" : "") + "'>").html(
                        "<label class='add-mascot-label mascot-mode-row' title='Simple mode keeps the intuitive controls; advanced exposes raw CSS sizes, precise offsets, clipping, page side and per-board lists.'><span class='option-title'>Advanced Editing:</span><input type=checkbox name=mAdvanced" + (advanced ? " checked" : "") + "></label>" +
                        "<label class='add-mascot-label' title='Name shown in the gallery.'><span class='option-title'>Name:</span><input class='mascot-input' type=text name=mName value=\"" + esc(f(m.name, "")) + "\" placeholder='Mascot name'></label>" +
                        "<label class='add-mascot-label' title='Image URL or data URI.'><span class='option-title'>Image:</span><input class='mascot-input' type=text name=mImg value=\"" + esc(f(m.url, "")) + "\" placeholder='https://&hellip; or data:image/&hellip;'></label>" +
                        slider("Scale", "mScale", parseInt(f(m.scale, 100), 10), 10, 300, "%", "Resize the mascot while keeping its shape. Ignored when an exact Width or Height is set.") +
                        "<label class='add-mascot-label' title='Cap this mascot at the 300px sidebar width. Default follows the Mascot Max Width option; Natural Size shows the full image.'><span class='option-title'>Max Width:</span><select name=mMaxwidth class='mascot-input'><option value='default'" + (m.maxwidth === undefined || m.maxwidth === null ? " selected" : "") + ">Default</option><option value='on'" + (m.maxwidth === true ? " selected" : "") + ">Capped</option><option value='off'" + (m.maxwidth === false ? " selected" : "") + ">Natural Size</option></select></label>" +
                        "<label class='add-mascot-label adv-only' title='Exact CSS width (e.g. 500px, 25vw). Use auto to keep the original size and let Scale apply.'><span class='option-title'>Width:</span><input class='mascot-input' type=text name=mWidth value=\"" + esc(f(m.width, "auto")) + "\"></label>" +
                        "<label class='add-mascot-label adv-only' title='Exact CSS height. Use auto to keep the original size.'><span class='option-title'>Height:</span><input class='mascot-input' type=text name=mHeight value=\"" + esc(f(m.height, "auto")) + "\"></label>" +
                        slider("Opacity", "mOpacity", parseInt(f(m.opacity, 100), 10), 0, 100, "%", "0 is transparent, 100 is opaque.") +
                        slider("Raise", "mOffsetS", off, -100, 400, "px", "Slide the mascot up from the bottom edge.", " simple-only") +
                        slider("Push In", "mHOffsetS", hoff, -100, 400, "px", "Slide the mascot away from the screen edge toward the center.", " simple-only") +
                        "<label class='add-mascot-label adv-only' title='Positive values lift the mascot up from the bottom edge; negative push it down.'><span class='option-title'>Vertical Offset:</span><input class='mascot-input' type=text name=mOffset value='" + off + "px'></label>" +
                        "<label class='add-mascot-label adv-only' title='Positive values push the mascot from the screen edge toward the center; negative push it off-screen.'><span class='option-title'>Horizontal Offset:</span><input class='mascot-input' type=text name=mHOffset value='" + hoff + "px'></label>" +
                        "<label class='add-mascot-label adv-only' title='Which side of the page the mascot sits on. Auto follows the sidebar position.'><span class='option-title'>Side:</span><select name=mSide class='mascot-input'><option value='auto'" + (f(m.side, "auto") === "auto" ? " selected" : "") + ">Auto</option><option value='right'" + (m.side === "right" ? " selected" : "") + ">Right</option><option value='left'" + (m.side === "left" ? " selected" : "") + ">Left</option></select></label>" +
                        "<label class='add-mascot-label adv-only' title='Clip the edges of the image as displayed, in pixels: top, left, bottom, right. Left/right always mean the visible sides, even when the image is flipped.'><span class='option-title'>Clip (T/L/B/R):</span>" +
                        "<span class='mascot-clip-inputs'><input class='mascot-input mascot-clip' type=text name=mTClip value='" + parseInt(f(clip[0], 0), 10) + "'><input class='mascot-input mascot-clip' type=text name=mLClip value='" + parseInt(f(clip[1], 0), 10) + "'><input class='mascot-input mascot-clip' type=text name=mBClip value='" + parseInt(f(clip[2], 0), 10) + "'><input class='mascot-input mascot-clip' type=text name=mRClip value='" + parseInt(f(clip[3], 0), 10) + "'></span></label>" +
                        "<label class='add-mascot-label' title='Flip the mascot image horizontally.'><span class='option-title'>Flip Image:</span><input type=checkbox name=mFlip" + (m.flip ? " checked" : "") + "></label>" +
                        "<label class='add-mascot-label mascot-filter-head'><span class='option-title'>Image Filters</span></label>" +
                        slider("Grayscale", "mFGray", parseInt(f(filters.gray, 0), 10), 0, 100, "%", "Desaturate the mascot.") +
                        slider("Sepia", "mFSepia", parseInt(f(filters.sepia, 0), 10), 0, 100, "%", "Warm brownish tone.") +
                        slider("Invert", "mFInvert", parseInt(f(filters.invert, 0), 10), 0, 100, "%", "Invert the image colors.") +
                        slider("Hue Rotate", "mFHue", parseInt(f(filters.hue, 0), 10), 0, 360, "°", "Shift every color around the hue wheel.") +
                        slider("Brightness", "mFBright", parseInt(f(filters.bright, 100), 10), 0, 200, "%", "100 is the original brightness.") +
                        slider("Contrast", "mFContrast", parseInt(f(filters.contrast, 100), 10), 0, 200, "%", "100 is the original contrast.") +
                        slider("Saturation", "mFSat", parseInt(f(filters.sat, 100), 10), 0, 200, "%", "100 is the original saturation; above boosts colors.") +
                        slider("Blur", "mFBlur", parseInt(f(filters.blur, 0), 10), 0, 20, "px", "Gaussian blur radius.") +
                        "<label class='add-mascot-label adv-only' title='Comma-separated boards to show this mascot on. Leave empty for all boards. Example: hlgg,jp'><span class='option-title'>Boards:</span><input class='mascot-input' type=text name=mBoards value=\"" + esc(f(m.boards, "")) + "\" placeholder='all boards'></label>" +
                        "<div id='mascot-buttons-container'><a class='options-button' name=mSave>" + (bEdit ? "Save Mascot" : "Add Mascot") + "</a><a class='options-button' name=mCancel>Cancel</a></div>"),
                    node = div.elems[0],
                    collect = function () {
                        var g = function (n) {
                                var el = node.querySelector("[name=" + n + "]");
                                return el ? el.value : "";
                            },
                            num = function (v) {
                                var n = parseInt(v, 10);
                                return isNaN(n) ? 0 : n;
                            };
                        var fl = {};
                        if (num(g("mFGray"))) fl.gray = num(g("mFGray"));
                        if (num(g("mFSepia"))) fl.sepia = num(g("mFSepia"));
                        if (num(g("mFInvert"))) fl.invert = num(g("mFInvert"));
                        if (num(g("mFHue"))) fl.hue = num(g("mFHue"));
                        if (num(g("mFBright")) !== 100) fl.bright = num(g("mFBright"));
                        if (num(g("mFContrast")) !== 100) fl.contrast = num(g("mFContrast"));
                        if (num(g("mFSat")) !== 100) fl.sat = num(g("mFSat"));
                        if (num(g("mFBlur"))) fl.blur = num(g("mFBlur"));
                        var hasFilters = false, fk;
                        for (fk in fl) { hasFilters = true; break; }
                        var scaleVal = num(g("mScale")) || 100,
                            sideVal = g("mSide");
                        return {
                            name: g("mName").trim(),
                            url: g("mImg").trim(),
                            scale: scaleVal !== 100 ? scaleVal : undefined,
                            maxwidth: g("mMaxwidth") === "on" ? true :
                                g("mMaxwidth") === "off" ? false : undefined,
                            width: g("mWidth").trim() || "auto",
                            height: g("mHeight").trim() || "auto",
                            opacity: num(g("mOpacity")),
                            offset: num(g("mOffset")),
                            hoffset: num(g("mHOffset")),
                            side: sideVal === "left" || sideVal === "right" ? sideVal : undefined,
                            clip: [num(g("mTClip")), num(g("mLClip")), num(g("mBClip")), num(g("mRClip"))],
                            flip: !!node.querySelector("[name=mFlip]").checked,
                            filters: hasFilters ? fl : undefined,
                            boards: g("mBoards").trim(),
                            enabled: bEdit ? m.enabled !== false : true
                        };
                    },
                    overlay2 = $("<div id=overlay2>").append(div),
                    preview = function () {
                        var o = collect();
                        if (o.url) $SS.displayMascots(o);
                    },
                    closeEditor = function () {
                        overlay2.remove();
                        $("#overlay").removeClass("previewing");
                        $SS.displayMascots();
                    };
                // The theme editor shares the #overlay2 id; never allow two
                $("#overlay2").remove();
                $(document.body).append(overlay2);
                // Hide the options window while the editor previews on the live
                // page (same pattern as the theme editor)
                $("#overlay").addClass("previewing");
                preview();
                var setField = function (name, val) {
                    var el = node.querySelector("[name=" + name + "]");
                    if (el) el.value = val;
                };
                node.addEventListener("input", function (e) {
                    var t = e.target;
                    if (t.type === "range") {
                        var vv = t.parentNode.querySelector(".mascot-opacity-val");
                        if (vv) vv.textContent = t.value + (t.getAttribute("data-unit") || "%");
                    }
                    // The simple-mode position sliders and the advanced offset
                    // inputs edit the same values; keep them in sync (the text
                    // inputs are what collect() reads)
                    if (t.name === "mOffsetS") setField("mOffset", t.value + "px");
                    else if (t.name === "mHOffsetS") setField("mHOffset", t.value + "px");
                    else if (t.name === "mOffset") setField("mOffsetS", parseInt(t.value, 10) || 0);
                    else if (t.name === "mHOffset") setField("mHOffsetS", parseInt(t.value, 10) || 0);
                    preview();
                });
                node.addEventListener("change", function (e) {
                    if (e.target.name === "mAdvanced") {
                        var adv = e.target.checked;
                        node.classList.toggle("advanced", adv);
                        $SS.conf["Advanced Mascot Editor"] = adv;
                        $SS.Config.set("Advanced Mascot Editor", adv);
                    }
                    preview();
                });
                $("a[name=mSave]", div).bind("click", function () {
                    var obj = collect();
                    if (obj.url) {
                        if (bEdit) work[mIndex] = obj;
                        else work.push(obj);
                        $SS.options.renderMascotGallery();
                    }
                    closeEditor();
                });
                $("a[name=mCancel]", div).bind("click", closeEditor);
                overlay2.bind("click", function (e) {
                    if (e.target === overlay2.elems[0]) closeEditor();
                });
            },
            showTheme: function (tIndex) {
                // The mascot editor shares the #overlay2 id; never allow two
                $("#overlay2").remove();
                var div, overlay, previewThemeIndex = -1,
                    bEdit = typeof tIndex === "number",
                    tEdit = bEdit ? $SS.conf["Themes"][tIndex] : null,
                    themeIndex = tIndex,
                    originalSelectedTheme = $SS.conf["Selected Theme"], // Store originally selected theme
                    esc = $SS.escapeHTML,
                    // New themes seed from the selected theme instead of
                    // all-black fields, so creating one starts from what's
                    // on screen rather than blanking the page
                    seed = bEdit ? tEdit :
                        ($SS.conf["Themes"][originalSelectedTheme] || $SS.conf["Themes"][0] || {}),
                    RPA, themeR, themePY, themePX, themeA;

                if (seed.bgImg && seed.bgRPA) {
                    RPA = seed.bgRPA.split(" ");
                    themeR = RPA[0];
                    themePY = RPA[1];
                    themePX = RPA[2];
                    themeA = RPA[3];
                }

                div = $("<div id='add-theme' class='dialog'>");

                var switchBtn = "<span class='side-switch' title='Switch side'>&#8646;</span>";

                var previewPost = switchBtn + "<div class='theme-preview-post' data-color='mainColor'>" +
                    "<div class='preview-border' data-color='mainColor'>" +
                    "<span class='preview-subject' data-color='titleColor'>Post Subject</span><br>" +
                    "<span class='preview-name' data-color='nameColor'>Anonymous</span>" +
                    "<span class='preview-trip' data-color='tripColor'> !tripcode</span>" +
                    "<span class='preview-date' data-color='textColor'> 10/01/03(Mon)12:00:00</span>" +
                    // Link-styled spans, not anchors: the site/TS quote
                    // handlers bind to any >>-style anchor added to the DOM
                    // and would treat these as real quotelinks
                    "<span class='preview-postnum'> <span class='preview-link' data-color='linkColor'>No.12345678</span></span>" +
                    "<br><span class='preview-backlink' data-color='blinkColor'><span class='preview-link'>&gt;&gt;12345678</span></span>" +
                    "<div class='theme-preview-hover' data-color='hoverColor' title='Backlink hover preview'>" +
                    "<span class='preview-name'>Anonymous</span><span class='preview-date'> 10/01/03(Mon)11:59:59</span>" +
                    "<br>I appear when hovering the quotelink above." +
                    "</div>" +
                    "<span class='preview-quote' data-color='quoteColor'>&gt;be me, clickable</span>" +
                    "<br><span data-color='textColor'>I'm a dummy post and example text.</span>" +
                    "</div></div>";

                var seedBG = seed.bgImg && ($SS.validImageURL(seed.bgImg) || $SS.validBase64(seed.bgImg)) ? seed.bgImg : "";
                var innerHTML = previewPost + "<div class='theme-body'><div class='theme-fields'><label>" +
                    "<span class='option-title'>Theme Name:</span><input type=text name=name value=\"" + (bEdit ? esc(tEdit.name) : "") + "\">" +
                    "</label><label>" +
                    "<span class='option-title'>Author Name:</span><input type=text name=authorName value=\"" + (bEdit ? esc(tEdit.authorName) : "") + "\">" +
                    "</label><label>" +
                    "<span class='option-title'>Author Tripcode:</span><input type=text name=authorTrip value=\"" + (bEdit ? esc(tEdit.authorTrip) : "") + "\">" +
                    "</label><label>" +
                    "<span class='option-title'>BG Image:</span><input type=text name=bgImg value=\"" + esc(seedBG) + "\"></label><label>" +
                    "<span class='option-title'>BG Repeat:</span><select name=bgR>" +
                    "<option" + (themeR === "no-repeat" ? " selected" : "") + ">no-repeat</option>" +
                    "<option" + (themeR === "repeat" ? " selected" : "") + ">repeat</option>" +
                    "<option" + (themeR === "repeat-x" ? " selected" : "") + ">repeat-x</option>" +
                    "<option" + (themeR === "repeat-y" ? " selected" : "") + ">repeat-y</option>" +
                    "</select></label><label>" +
                    "<span class='option-title'>BG Attachment:</span><select name=bgA>" +
                    "<option" + (themeA === "fixed" ? " selected" : "") + ">fixed</option>" +
                    "<option" + (themeA === "scroll" ? " selected" : "") + ">scroll</option>" +
                    "</select></label><label>" +
                    "<span class='option-title'>BG Position-X:</span><select name=bgPX>" +
                    "<option" + (themePX === "left" ? " selected" : "") + ">left</option>" +
                    "<option" + (themePX === "center" ? " selected" : "") + ">center</option>" +
                    "<option" + (themePX === "right" ? " selected" : "") + ">right</option>" +
                    "</select></label><label>" +
                    "<span class='option-title'>BG Position-Y:</span><select name=bgPY>" +
                    "<option" + (themePY === "top" ? " selected" : "") + ">top</option>" +
                    "<option" + (themePY === "center" ? " selected" : "") + ">center</option>" +
                    "<option" + (themePY === "bottom" ? " selected" : "") + ">bottom</option>" +
                    "</select></label><label>" +
                    "<span class='option-title'>Reply Opacity:</span><input type=text name=replyOp value='" + $SS.normalizeOpacity(seed.replyOp, "1.0") + "'></label><label>" +
                    "<span class='option-title'>Header Opacity:</span><input type=text name=navOp value='" + $SS.normalizeOpacity(seed.navOp, "0.9") + "'>" +
                    "</label><label>" +
                    "<span class='option-title'>Hover Opacity:</span><input type=text name=hoverOp value='" + $SS.normalizeOpacity(seed.hoverOp, "0.8") + "'></label><label>" +
                    "<span class='option-title'>Hover Outline Opacity:</span><input type=text name=hoverOutOp value='" + $SS.normalizeOpacity(seed.hoverOutOp, "0.5") + "'>" +
                    "</label>";

                for (var i = 0, MAX = themeInputs.length; i < MAX; ++i) {
                    var hex = $SS.normalizeHex(seed[themeInputs[i].name]);
                    if (!hex && themeInputs[i].name === "hoverColor") // absent on pre-hoverColor themes: show the derived default
                        hex = $SS.hexFromRGB(new $SS.Color(seed.mainColor).shiftRGB(-16).split(","));
                    if (!hex && themeInputs[i].name === "hoverOutColor") // ditto: outline derives from the link color
                        hex = $SS.normalizeHex(seed.linkColor);
                    hex = hex || "000000";
                    var rgb = $SS.RGBFromHex(hex);
                    var textColor = $SS.isLight(rgb) ? "#000" : "#fff";
                    innerHTML += "<label><span class='option-title'>" + themeInputs[i].dName + ":</span>" +
                        "<span class=color-picker-wrap>" +
                        "<input type=text name=" + themeInputs[i].name + " value=\"" + hex + "\" autocomplete=off " +
                            "class=color-hex style='background:#" + hex + " !important;color:" + textColor + " !important'>" +
                        "<input type=color value=\"#" + hex + "\" class=color-picker-btn>" +
                        "</span></label>";
                }

                innerHTML += "</div><label id=customCSS><span class='option-title'>Custom CSS:</span><textarea name=customCSS class='field'></textarea>" +
                    "</label></div><div class='theme-buttons'>" +
                    "<a class='options-button' name=export>Export</a>" +
                    "<a class='options-button' name=" + (bEdit ? "edit" : "add") + ">Save</a><a class='options-button' name=cancel>Cancel</a></div>";

                div.html(innerHTML);
                if (seed.customCSS)
                    div.elems[0].querySelector("textarea[name=customCSS]").value = seed.customCSS;

                $(".side-switch", div).bind("click", function () {
                    div.elems[0].classList.toggle("left");
                });

                // Click preview elements to focus color inputs
                $("[data-color]", div).bind("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var name = this.getAttribute("data-color"),
                        input = div.elems[0].querySelector("input[name='" + name + "']");
                    if (input) {
                        input.focus();
                        input.select();
                        $("label.picked", div).removeClass("picked");
                        var label = input.closest("label");
                        if (label) label.classList.add("picked");
                    }
                });

                // Live preview function
                var updateLivePreview = function () {
                    var overlay = $("#overlay2"),
                        previewTheme = {},
                        makeRPA = function () {
                            var RPA = [];
                            RPA.push($("select[name=bgR]", overlay).val() || "repeat");
                            RPA.push($("select[name=bgPY]", overlay).val() || "top");
                            RPA.push($("select[name=bgPX]", overlay).val() || "left");
                            RPA.push($("select[name=bgA]", overlay).val() || "scroll");
                            return RPA.join(" ");
                        };

                    // Collect all form values, but only include non-empty color values
                    $("input,textarea,select", overlay).each(function () {
                        var val = this.value;
                        if (this.name) {
                            // For color inputs, strip "#" prefix and include if non-white
                            if (this.type === "color") {
                                var hex = val.replace("#", "");
                                if (hex !== "" && hex !== "ffffff" && hex.length === 6) {
                                    previewTheme[this.name] = hex;
                                }
                            } else if (val !== "") {
                                // For non-color inputs, include if not empty
                                previewTheme[this.name] = val;
                            }
                        }
                    });

                    // Set defaults for missing values
                    if (bEdit && tEdit) {
                        // When editing, use the original theme as base
                        for (var key in tEdit) {
                            if (previewTheme[key] === undefined && typeof tEdit[key] !== "object" && key !== "default") {
                                previewTheme[key] = tEdit[key];
                            }
                        }
                    } else {
                        // For new themes, use the currently selected theme as base (not first theme)
                        var baseTheme = $SS.conf["Themes"][originalSelectedTheme] || $SS.conf["Themes"][0];
                        for (var key in baseTheme) {
                            if (previewTheme[key] === undefined && typeof baseTheme[key] !== "object" && key !== "default") {
                                previewTheme[key] = baseTheme[key];
                            }
                        }
                    }

                    if (previewTheme.bgImg)
                        previewTheme.bgRPA = makeRPA();

                    // Create temporary theme in themes array
                    // Mark it as preview so we can identify and remove it later
                    previewTheme._isPreview = true;
                    if (previewThemeIndex === -1) {
                        previewThemeIndex = $SS.conf["Themes"].length;
                        $SS.conf["Themes"].push(previewTheme);
                    } else {
                        $SS.conf["Themes"][previewThemeIndex] = previewTheme;
                    }

                    // Temporarily switch to preview theme
                    $SS.conf["Selected Theme"] = previewThemeIndex;
                    $SS.theme = new $SS.Theme(previewThemeIndex);
                    $SS.setThemeVariables();
                    // Scheme-dependent root classes must track the preview,
                    // or light-on-dark previews render half-applied
                    document.documentElement.classList.toggle("isLight", $SS.theme.textColor.isLight === true);
                    document.documentElement.classList.toggle("dark-captcha", $SS.theme.bgColor.isLight === false);
                };

                // Sync color swatch to hex text input and trigger preview
                $("input[type='color']", div).bind("input change", function () {
                    var textInput = this.parentNode.querySelector(".color-hex");
                    if (textInput) {
                        var hex = this.value.replace("#", "");
                        textInput.value = hex;
                        textInput.style.setProperty("background-color", "#" + hex, "important");
                        var rgb = $SS.RGBFromHex(hex);
                        textInput.style.setProperty("color", $SS.isLight(rgb) ? "#000" : "#fff", "important");
                    }
                    updateLivePreview();
                });

                // Live preview on text input / textarea / select changes
                $("input[type=text],textarea,select", div).bind("input change", function () {
                    if (this.classList.contains("color-hex")) {
                        var hex = this.value.replace("#", "");
                        if (/^[0-9a-f]{6}$/i.test(hex)) {
                            this.style.setProperty("background-color", "#" + hex, "important");
                            var rgb = $SS.RGBFromHex(hex);
                            this.style.setProperty("color", $SS.isLight(rgb) ? "#000" : "#fff", "important");
                        }
                    }
                    updateLivePreview();
                });

                overlay = $("<div id=overlay2>").append(div);

                $("a[name=export]", div).bind("click", function () {
                    var theme = $SS.options.addTheme(themeIndex, true);
                    if (!theme || $("a[download]", div).exists())
                        return;
                    // Built via the DOM so a quote in the name can't break out
                    // of the download attribute
                    var exportalert = document.createElement("a");
                    exportalert.className = "options-button";
                    exportalert.download = (theme.name || "theme") + ".json";
                    exportalert.href = "data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(theme))));
                    exportalert.textContent = "Save me!";
                    return $(this).replace($(exportalert));
                });

                if (bEdit) {
                    $("a[name=edit]", div).bind("click", function () {
                        $SS.options.addTheme(themeIndex);
                        $("#overlay").removeClass("previewing");
                    });
                    $("#overlay").addClass("previewing");
                } else {
                    $("a[name=add]", div).bind("click", function () {
                        $SS.options.addTheme();
                    });
                    $("#overlay").addClass("previewing");
                }

                $("a[name=cancel]", div).bind("click", function () {
                    // Remove preview theme if it exists
                    if (previewThemeIndex !== -1) {
                        $SS.conf["Themes"].splice(previewThemeIndex, 1);
                    }
                    // Always restore to the originally selected theme (not the theme being edited)
                    $SS.conf["Selected Theme"] = originalSelectedTheme;
                    // Re-derive the displayed theme the way init does: under
                    // System Theming the page shows the Dark/Light theme, not
                    // the selected one
                    var active;
                    if ($SS.conf["System Theming"]) {
                        active = window.matchMedia("(prefers-color-scheme: dark)").matches ?
                            parseInt($SS.conf["Dark Theme"], 10) : parseInt($SS.conf["Light Theme"], 10);
                    } else {
                        active = $SS.location.nsfw ? $SS.conf["NSFW Theme"] : originalSelectedTheme;
                    }
                    if (!$SS.conf["Themes"][active]) active = 0;
                    $SS.theme = new $SS.Theme(active);
                    $SS.setThemeVariables();
                    document.documentElement.classList.toggle("isLight", $SS.theme.textColor.isLight === true);
                    document.documentElement.classList.toggle("dark-captcha", $SS.theme.bgColor.isLight === false);
                    $SS.insertCSS();
                    $("#overlay").removeClass("previewing");
                    $("#overlay2").remove();
                });

                if (bEdit)
                    $("input,textarea,select", div).bind("change", tEdit.mHandler = function () {
                        tEdit.modified = true;
                        $("input,textarea,select", $("#add-theme")).unbind("change", tEdit.mHandler);
                    });

                return $(document.body).append(overlay);
            },
            addTheme: function (tIndex, exp) {
                var overlay = $("#overlay2");

                // Remove preview theme if it exists (from live preview).
                // Export leaves it alone: the editor stays open and the
                // preview must keep rendering
                var previewIndex = -1;
                if (!exp) {
                    for (var i = $SS.conf["Themes"].length - 1; i >= 0; i--) {
                        if ($SS.conf["Themes"][i] && $SS.conf["Themes"][i]._isPreview) {
                            previewIndex = i;
                            break;
                        }
                    }
                    if (previewIndex !== -1) {
                        $SS.conf["Themes"].splice(previewIndex, 1);
                        // Adjust tIndex if it was after the preview theme
                        if (typeof tIndex === "number" && tIndex > previewIndex) {
                            tIndex--;
                        }
                    }
                }

                var tTheme = {},
                    makeRPA = function () {
                        var RPA = [];

                        RPA.push($("select[name=bgR]", overlay).val());
                        RPA.push($("select[name=bgPY]", overlay).val());
                        RPA.push($("select[name=bgPX]", overlay).val());
                        RPA.push($("select[name=bgA]", overlay).val());

                        return RPA.join(" ");
                    },
                    bEdit = typeof tIndex === "number",
                    tEdit = bEdit ? $SS.conf["Themes"][tIndex] : null,
                    error = false,
                    div;

                if (!exp && bEdit && !tEdit.modified) {
                    // A live preview may have been spliced out above, leaving
                    // the in-memory selection dangling past the array end;
                    // re-init restores the stored state
                    if (previewIndex !== -1)
                        $SS.init(true);
                    return overlay.remove();
                }

                var colorNames = {},
                    opDefaults = { replyOp: "1.0", navOp: "0.9", hoverOp: "0.8", hoverOutOp: "0.5" };
                for (var c = 0, cMAX = themeInputs.length; c < cMAX; ++c)
                    colorNames[themeInputs[c].name] = themeInputs[c].dName;

                $("input[type=text],textarea", overlay).each(function () {
                    var val;

                    if (this.name === "bgImg") {
                        val = this.value;

                        if (val !== "" && !$SS.validImageURL(val) && !$SS.validBase64(val)) {
                            error = true;
                            return alert("Not a valid image URL/base64!");
                        }

                        val = $SS.cleanBase64(val);

                    } else if (this.name === "name") {
                        val = this.value;

                        if (bEdit && tEdit.default && tEdit.name === val)
                            val += " [Modded]";
                    } else if (colorNames[this.name]) {
                        // Colors must round-trip as 6-digit hex; junk here
                        // would silently kill every rule using the variable
                        val = $SS.normalizeHex(this.value);
                        if (val === null) {
                            if (this.value !== "") {
                                error = true;
                                return alert("\"" + this.value + "\" is not a valid hex color for " + colorNames[this.name] + "!");
                            }
                            val = "";
                        }
                    } else if (opDefaults[this.name] !== undefined) {
                        val = $SS.normalizeOpacity(this.value, opDefaults[this.name]);
                    } else
                        val = this.value;

                    if (val !== "")
                        tTheme[this.name] = val;
                });

                if (error) return;

                if (!tTheme.name)
                    tTheme.name = "Unnamed Theme";

                if (tTheme.bgImg)
                    tTheme.bgRPA = makeRPA();

                if (exp) return tTheme;

                if (bEdit && !tEdit.default) {
                    $SS.conf["Themes"][tIndex] = tTheme;
                    tTheme = new $SS.Theme(tIndex);
                    div = $("#theme" + tIndex, $("#overlay"));
                    var fresh = tTheme.preview();
                    if (div.exists()) {
                        // replace() returns the detached node; keep the live
                        // one so the click below lands in the document
                        div.replace(fresh);
                        div = fresh;
                    } else {
                        div = fresh;
                        $("#overlay #themes-section").append(div);
                    }
                } else {
                    if (!tTheme.authorName)
                        tTheme.authorName = "You";
                    tIndex = $SS.conf["Themes"].push(tTheme);
                    tTheme = new $SS.Theme(--tIndex);
                    div = tTheme.preview();

                    $("#overlay #themes-section").append(div);
                }

                if (div && div.exists()) {
                    // Select the saved theme explicitly rather than firing a
                    // click on its preview: the click handler's
                    // already-selected guard reads classes rendered from
                    // stale mid-preview state and can skip both the
                    // selection and the save
                    div.parent().children(".selected").removeClass("selected");
                    div.parent().children(".nsfw").removeClass("nsfw");
                    div.addClass("selected nsfw");
                    div.scrollIntoView(true);
                    // Under System Theming the page displays the Dark/Light
                    // mapping, not the selection; point the governing slot at
                    // the saved theme so saving is always visible
                    if ($SS.conf["System Theming"]) {
                        var slot = window.matchMedia("(prefers-color-scheme: dark)").matches ?
                            "Dark Theme" : "Light Theme";
                        $SS.conf[slot] = tIndex;
                        $SS.Config.set(slot, tIndex);
                    }
                    $SS.options.saveThemeState();
                    $SS.init(true);
                }

                // The list may have grown; keep the Dark/Light selects in step
                $SS.options.refreshThemeSelects();
                $("#overlay").removeClass("previewing");
                return overlay.remove();
            },
            deleteTheme: function (tIndex) {
                var t = $SS.conf["Themes"][tIndex];
                if (!t) return;

                // Defaults are hidden, not deleted
                if (t.default) {
                    if ($SS.conf["Hidden Themes"].indexOf(tIndex) === -1 &&
                        $SS.conf["Hidden Themes"].push(tIndex) === 1)
                        $("#themes-section a[name=restoreThemes]").show();
                    $SS.Config.set("Hidden Themes", $SS.conf["Hidden Themes"]);
                    return $("#theme" + tIndex).removeClass("selected").hide();
                }

                if (!confirm('Delete theme "' + t.name + '"? This cannot be undone.'))
                    return;

                // Remove from the array itself, not just the DOM: every index
                // after this shifts down, so compact the index-based settings
                // and rebuild the tab or the stale div ids would persist a
                // selection pointing at the wrong (or no) theme
                $SS.conf["Themes"].splice(tIndex, 1);
                ["Selected Theme", "NSFW Theme", "Dark Theme", "Light Theme"].forEach(function (key) {
                    var v = parseInt($SS.conf[key], 10) || 0;
                    if (v === tIndex) v = 0;
                    else if (v > tIndex) v--;
                    $SS.conf[key] = v;
                    $SS.Config.set(key, v);
                });

                var tOptions = $("#oneechan-options");
                if (tOptions.exists()) {
                    $SS.options.createThemesTab(tOptions);
                    $SS.options.refreshThemeSelects();
                }

                $SS.options.saveThemeState();
                return $SS.init(true);
            },
        },

        /* THEMES */
        Themes: {
            defaults: [{
                name: "Yotsuba",
                authorName: "moot",
                authorTrip: "!Εр8рui8Vw2",
                "default": true,
                bgImg: "iVBORw0KGgoAAAANSUhEUgAAAAEAAADICAIAAACmkByiAAAAWElEQVR4AaWSwQ3AIAwDbfbfpdt0nKrPUp3QCfHgkfjsCMh47mskmU5HGvbmuuh9dVce8M4it/SfMZglGeZx/ccyu/Vsv4/N29f331AY5Bi3+hdo4A92+wXvCwR9mXztrAAAAABJRU5ErkJggg==",
                bgRPA: "repeat-x top center scroll",
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "ffffee",
                mainColor: "f0e0d6",
                brderColor: "d9bFb7",
                inputColor: "ffffff",
                inputbColor: "aaaaaa",
                blinkColor: "800000",
                unreadColor: "000080",
                linkColor: "0000ee",
                linkHColor: "dd0000",
                qlColor: "000080",
                nameColor: "117743",
                quoteColor: "789922",
                textColor: "800000",
                tripColor: "228854",
                titleColor: "cc1105",
                headerColor: "800000",
                headerLColor: "800000",
                headerLHColor: "dd0000",
                headerBGColor: "f0e0d6",
                boardColor: "800000",
                postHLColor: "228854",
                quotesYouHLColor: "dd0000",
                ownPostHLColor: "228854",
                threadHLColor: "dd0000",
                replybgHLColor: "d6bad0",
                replyslctColor: "228854",
                customCSS: "span.postNum.desktop > a {\ncolor: #800000 !important\n}\nspan.postNum.desktop > a:hover {\ncolor: #dd0000 !important\n}\n.menu-button {\ncolor: #800000 !important\n}"
            }, {
                name: "Yotsuba B",
                authorName: "moot",
                authorTrip: "!Εр8рui8Vw2",
                "default": true,
                bgImg: "iVBORw0KGgoAAAANSUhEUgAAAAEAAADICAIAAACmkByiAAAASUlEQVR4AcWRuQ0AIBDDzuy/HAVrMAM9slCorqAJziNgrj2qSg/cGhHnjPqDDPxOfYiebwFj+XobeLGI7p39fW1/Ib58d55Bwh3x9wRv6r75UwAAAABJRU5ErkJggg==",
                bgRPA: "repeat-x top center scroll",
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "eef2ff",
                mainColor: "d6daf0",
                brderColor: "b7c5d9",
                inputColor: "ffffff",
                inputbColor: "aaaaaa",
                blinkColor: "34345c",
                unreadColor: "34345C",
                linkColor: "34345c",
                linkHColor: "dd0000",
                qlColor: "dd0000",
                nameColor: "117743",
                quoteColor: "789922",
                textColor: "000000",
                tripColor: "228854",
                titleColor: "0f0c5d",
                headerColor: "34345c",
                headerLColor: "34345c",
                headerLHColor: "dd0000",
                headerBGColor: "d6daf0",
                boardColor: "af0a0f",
                postHLColor: "228854",
                quotesYouHLColor: "228854",
                ownPostHLColor: "228854",
                threadHLColor: "dd0000",
                replybgHLColor: "d6bad0",
                replyslctColor: "228854",
                customCSS: "span.postNum.desktop > a {\ncolor: #000000 !important\n}\nspan.postNum.desktop > a:hover {\ncolor: #dd0000 !important\n}"
            }, {
                name: "Vimyanized Dark",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "090d0f",
                mainColor: "0d1114",
                brderColor: "0b1316",
                inputColor: "090d0f",
                inputbColor: "0d1114",
                blinkColor: "4797cc",
                unreadColor: "4270b2",
                linkColor: "53bdb1",
                linkHColor: "3090b5",
                qlColor: "53bdb1",
                nameColor: "d63e34",
                quoteColor: "96c83b",
                textColor: "f8f8f8",
                tripColor: "d4b63c",
                titleColor: "b88cd1",
                headerColor: "f8f8f8",
                headerLColor: "53bdb1",
                headerLHColor: "3090b5",
                headerBGColor: "0d1114",
                boardColor: "f8f8f8",
                postHLColor: "d4b63c",
                quotesYouHLColor: "d4b63c",
                ownPostHLColor: "d4b63c",
                threadHLColor: "b88cd1",
                replybgHLColor: "090d10",
                replyslctColor: "d4b63c"
            }, {
                name: "Muted",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "ffffff",
                mainColor: "f5f2e9",
                brderColor: "dddddd",
                inputColor: "ffffff",
                inputbColor: "dddddd",
                blinkColor: "bc312a",
                unreadColor: "bc312a",
                linkColor: "bc312a",
                linkHColor: "8e2220",
                qlColor: "bc312a",
                nameColor: "2c64a0",
                quoteColor: "789922",
                textColor: "393735",
                tripColor: "cc6563",
                titleColor: "111111",
                headerColor: "393735",
                headerLColor: "bc312a",
                headerLHColor: "8e2220",
                headerBGColor: "f5f2e9",
                boardColor: "bc312a",
                postHLColor: "cc6563",
                quotesYouHLColor: "2c64a0",
                ownPostHLColor: "cc6563",
                threadHLColor: "111111",
                replybgHLColor: "d9d6cd",
                replyslctColor: "cc6563"
            }, {
                name: "Surf", //Inspired by Blue Tone
                authorName: "nebukazar",
                authorTrip: "!/Am.NeBUqQ",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "1.0",
                mainColor: "242424",
                brderColor: "242424",
                inputColor: "1b1b1b",
                inputbColor: "252525",
                headerBGColor: "242424",
                headerColor: "ffffff",
                boardColor: "ffffff",
                bgColor: "1b1b1b",
                textColor: "ffffff",
                blinkColor: "20548f",
                headerLColor: "20548f",
                headerLHColor: "ffffff",
                linkColor: "808080",
                linkHColor: "ffffff",
                qlColor: "808080",
                nameColor: "20548f",
                tripColor: "808080",
                titleColor: "808080",
                quoteColor: "07992d",
                unreadColor: "ffffff",
                postHLColor: "292929",
                quotesYouHLColor: "ffffff",
                ownPostHLColor: "ffffff",
                threadHLColor: "808080",
                replybgHLColor: "121212",
                replyslctColor: "ffffff"
            }, {
                name: "Stilig",
                authorName: "Myson",
                authorTrip: "!RiDeag.gG.",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "ffffff",
                brderColor: "ebebeb",
                inputColor: "ffffff",
                inputbColor: "dedede",
                headerBGColor: "3d444e",
                headerColor: "ffffff",
                boardColor: "999999",
                bgColor: "f2f2f2",
                textColor: "717171",
                blinkColor: "999999",
                unreadColor: "999999",
                headerLColor: "babcbe",
                headerLHColor: "999999",
                linkColor: "999999",
                linkHColor: "5f5f65",
                qlColor: "999999",
                nameColor: "49637d",
                tripColor: "5f5f65",
                titleColor: "7a7f88",
                quoteColor: "009933",
                postHLColor: "5f5f65",
                quotesYouHLColor: "ff4a3e",
                ownPostHLColor: "5f5f65",
                threadHLColor: "7a7f88",
                replybgHLColor: "e6e6e6",
                replyslctColor: "5f5f65",
                customCSS: ".reply {box-shadow: -1px 1px 1px rgba(0,0,0,.08);}"
            }, {
                name: "Minimalistic Mayhem",
                authorName: "Mayhem",
                authorTrip: "!MayhemxaEo",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "191919",
                mainColor: "222222",
                brderColor: "292929",
                inputColor: "222222",
                inputbColor: "151515",
                blinkColor: "897399",
                unreadColor: "897399",
                linkColor: "897399",
                linkHColor: "c617e6",
                qlColor: "897399",
                nameColor: "a34443",
                quoteColor: "8ba446",
                textColor: "bbbbbb",
                tripColor: "96562c",
                titleColor: "987d3e",
                headerColor: "bbbbbb",
                headerLColor: "897399",
                headerLHColor: "c617e6",
                headerBGColor: "222222",
                boardColor: "bbbbbb",
                postHLColor: "96562c",
                quotesYouHLColor: "96562c",
                ownPostHLColor: "96562c",
                threadHLColor: "987d3e",
                replybgHLColor: "141414",
                replyslctColor: "96562c"
            }, {
                name: "Blackboard",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "0a0d1c",
                mainColor: "0c1021",
                brderColor: "0e1228",
                inputColor: "0c1021",
                inputbColor: "080b16",
                blinkColor: "54b12e",
                unreadColor: "8da6ce",
                linkColor: "fbde2d",
                linkHColor: "4b65cc",
                qlColor: "fbde2d",
                nameColor: "8da6ce",
                quoteColor: "9acf08",
                textColor: "f8f8f8",
                tripColor: "ff6400",
                titleColor: "ff6400",
                headerColor: "f8f8f8",
                headerLColor: "fbde2d",
                headerLHColor: "4b65cc",
                headerBGColor: "0c1021",
                boardColor: "f8f8f8",
                postHLColor: "ff6400",
                quotesYouHLColor: "ff6400",
                ownPostHLColor: "ff6400",
                threadHLColor: "ff6400",
                replybgHLColor: "080c1d",
                replyslctColor: "ff6400"
            }, {
                name: "Dark Flat",
                authorName: "ahodesuka",
                authorTrip: "!.pC/AHOKAg",
                "default": true,
                bgImg: "R0lGODlhAwADAIAAAB0dHRkZGSH5BADoAwAALAAAAAADAAMAAAIDDG5YADs=",
                bgRPA: "repeat top left fixed",
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "1C1D1E",
                mainColor: "232425",
                brderColor: "292a2b",
                inputColor: "18191a",
                inputbColor: "121314",
                blinkColor: "6f99b4",
                unreadColor: "ac9bb0",
                linkColor: "ac9bb0",
                linkHColor: "6f99b4",
                qlColor: "ac9bb0",
                nameColor: "a8c6d9",
                quoteColor: "b3c45e",
                textColor: "dddddd",
                tripColor: "d4c095",
                titleColor: "9390c9",
                headerColor: "dddddd",
                headerLColor: "ac9bb0",
                headerLHColor: "6f99b4",
                headerBGColor: "232425",
                boardColor: "dddddd",
                postHLColor: "d4c095",
                quotesYouHLColor: "d4c095",
                ownPostHLColor: "d4c095",
                threadHLColor: "9390c9",
                replybgHLColor: "171919",
                replyslctColor: "d4c095"
            }, {
                name: "Yukimura",
                authorName: "the real",
                authorTrip: "!eKISSUy3/c",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "1b1b1b",
                brderColor: "191919",
                inputColor: "1b1b1b",
                inputbColor: "1b1b1b",
                headerBGColor: "1b1b1b",
                headerColor: "e3c2b3",
                boardColor: "e3c2b3",
                bgColor: "171717",
                textColor: "e3c2b3",
                blinkColor: "5c433c",
                headerLColor: "e96a81",
                headerLHColor: "e96a81",
                linkColor: "e96a81",
                linkHColor: "e96a81",
                qlColor: "e96a81",
                nameColor: "e96a81",
                tripColor: "5c433c",
                titleColor: "5c433c",
                quoteColor: "b3c45e",
                unreadColor: "5c433c",
                postHLColor: "5c433c",
                quotesYouHLColor: "d63e34",
                ownPostHLColor: "5c433c",
                threadHLColor: "5c433c",
                replybgHLColor: "0d0d0d",
                replyslctColor: "5c433c"
            }, {
                name: "Photons + Odin",
                authorName: "John",
                authorTrip: "!Hu6tDS8lls",
                "default": true,
                bgImg: "R0lGODlhAwADAIAAAB0dHRkZGSH5BADoAwAALAAAAAADAAMAAAIDDG5YADs=",
                bgRPA: "repeat top left fixed",
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "1a1a1a",
                brderColor: "1f1f1f",
                inputColor: "18191a",
                inputbColor: "121314",
                headerBGColor: "1a1a1a",
                headerColor: "dddddd",
                boardColor: "dddddd",
                bgColor: "202020",
                textColor: "dddddd",
                blinkColor: "c72d41",
                headerLColor: "737f88",
                headerLHColor: "4f585d",
                linkColor: "737f88",
                linkHColor: "4f585d",
                qlColor: "737f88",
                nameColor: "0099bc",
                tripColor: "ff0085",
                titleColor: "ffa600",
                quoteColor: "85c600",
                unreadColor: "446a6d",
                postHLColor: "ff0085",
                quotesYouHLColor: "ff0085",
                ownPostHLColor: "ff0085",
                threadHLColor: "ffa600",
                replybgHLColor: "0d0d0d",
                replyslctColor: "ff0085"
            }, {
                name: "Photon",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "eeeeee",
                mainColor: "dddddd",
                brderColor: "c4c4c4",
                inputColor: "ffffff",
                inputbColor: "cccccc",
                blinkColor: "111111",
                unreadColor: "ff6600",
                linkColor: "ff6600",
                linkHColor: "ff3300",
                qlColor: "ff6600",
                nameColor: "004a99",
                quoteColor: "789922",
                textColor: "333333",
                tripColor: "ff3300",
                titleColor: "002244",
                headerColor: "333333",
                headerLColor: "ff6600",
                headerLHColor: "ff3300",
                headerBGColor: "dddddd",
                boardColor: "004a99",
                postHLColor: "ff3300",
                quotesYouHLColor: "004a99",
                ownPostHLColor: "ff3300",
                threadHLColor: "002244",
                replybgHLColor: "c4c4c4",
                replyslctColor: "ff3300"
            }, {
                name: "Original Minimalistic Mayhem",
                authorName: "Mayhem",
                authorTrip: "!MayhemxaEo",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "191919",
                mainColor: "333333",
                brderColor: "111111",
                inputColor: "222222",
                inputbColor: "151515",
                blinkColor: "559c7a",
                unreadColor: "559c7a",
                linkColor: "559c7a",
                linkHColor: "c7de1a",
                qlColor: "559c7a",
                nameColor: "2e88a6",
                quoteColor: "8ba446",
                textColor: "dddddd",
                tripColor: "8c5d2a",
                titleColor: "486273",
                headerColor: "dddddd",
                headerLColor: "559c7a",
                headerLHColor: "c7de1a",
                headerBGColor: "333333",
                boardColor: "dddddd",
                postHLColor: "8c5d2a",
                quotesYouHLColor: "8c5d2a",
                ownPostHLColor: "8c5d2a",
                threadHLColor: "486273",
                replybgHLColor: "25262a",
                replyslctColor: "8c5d2a"
            }, {
                name: "Tomorrow",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "1d1f21",
                mainColor: "282a2e",
                brderColor: "373b41",
                inputColor: "282a2e",
                inputbColor: "1d1f21",
                blinkColor: "5f89ac",
                unreadColor: "81a2be",
                linkColor: "81a2be",
                linkHColor: "cc6666",
                qlColor: "81a2be",
                nameColor: "81a2be",
                quoteColor: "b5bd68",
                textColor: "c5c8c6",
                tripColor: "8abeb7",
                titleColor: "b294bb",
                headerColor: "c5c8c6",
                headerLColor: "81a2be",
                headerLHColor: "cc6666",
                headerBGColor: "282a2e",
                boardColor: "c5c8c6",
                postHLColor: "8abeb7",
                quotesYouHLColor: "8abeb7",
                ownPostHLColor: "8abeb7",
                threadHLColor: "b294bb",
                replybgHLColor: "24262a",
                replyslctColor: "8abeb7",
                customCSS: "span.postNum.desktop > a {\ncolor: #c5c8c6 !important\n}\nspan.postNum.desktop > a:hover {\ncolor: #81a2be !important\n}"
            }, {
                name: "Yotsuba Purple",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "f8f3fe",
                mainColor: "eeddff",
                brderColor: "cab7d9",
                inputColor: "ffffff",
                inputbColor: "cab7d9",
                blinkColor: "000000",
                unreadColor: "962594",
                linkColor: "962594",
                linkHColor: "b22caa",
                qlColor: "b22caa",
                nameColor: "591177",
                quoteColor: "789922",
                textColor: "000000",
                tripColor: "b22caa",
                titleColor: "0f0c5d",
                headerColor: "000000",
                headerLColor: "962594",
                headerLHColor: "b22caa",
                headerBGColor: "eeddff",
                boardColor: "591177",
                postHLColor: "b22caa",
                quotesYouHLColor: "d63e34",
                ownPostHLColor: "b22caa",
                threadHLColor: "0f0c5d",
                replybgHLColor: "b7aac4",
                replyslctColor: "b22caa"
            }, {
                name: "安心院なじみ",
                authorName: "ahodesuka",
                authorTrip: "!.pC/AHOKAg",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "ffffff",
                mainColor: "efefef",
                brderColor: "d6d6d6",
                inputColor: "cccccc",
                inputbColor: "bbbbbb",
                blinkColor: "f5871f",
                unreadColor: "bf8040",
                linkColor: "bf8040",
                linkHColor: "bf8040",
                qlColor: "bf8040",
                nameColor: "2b80c2",
                quoteColor: "718c00",
                textColor: "4d4d4c",
                tripColor: "3e999f",
                titleColor: "4d4d4d",
                headerColor: "4d4d4c",
                headerLColor: "bf8040",
                headerLHColor: "bf8040",
                headerBGColor: "efefef",
                boardColor: "4d4d4c",
                postHLColor: "3e999f",
                quotesYouHLColor: "3e999f",
                ownPostHLColor: "3e999f",
                threadHLColor: "4d4d4d",
                replybgHLColor: "c7c7c7",
                replyslctColor: "3e999f"
            }, {
                name: "Solarized Dark", // http://ethanschoonover.com/solarized
                authorName: "ubuntufriend",
                authorTrip: "!UbuntuBReY!!iizPaxgtRk3",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "073642",
                mainColor: "032b36",
                brderColor: "133942",
                inputColor: "073642",
                inputbColor: "0d272e",
                blinkColor: "4f5f8f",
                unreadColor: "696fc0",
                linkColor: "696bba",
                linkHColor: "d33682",
                qlColor: "696bba",
                nameColor: "586e75",
                quoteColor: "859900",
                textColor: "93a1a1",
                tripColor: "2aa198",
                titleColor: "bec2c4",
                headerColor: "93a1a1",
                headerLColor: "696bba",
                headerLHColor: "d33682",
                headerBGColor: "032b36",
                boardColor: "93a1a1",
                postHLColor: "2aa198",
                quotesYouHLColor: "2aa198",
                ownPostHLColor: "2aa198",
                threadHLColor: "bec2c4",
                replybgHLColor: "073642",
                replyslctColor: "2aa198"
            }, {
                name: "4chan Rewired Modded", // Originally by !K.WeEabo0o, modded by ahoka
                authorName: "ahodesuka",
                authorTrip: "!.pC/AHOKAg",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "f4f4f4",
                mainColor: "efefef",
                brderColor: "d4d4d4",
                inputColor: "e4e4e4",
                inputbColor: "cccccc",
                blinkColor: "bf7f3f",
                unreadColor: "bf7f3f",
                linkColor: "bf7f3f",
                linkHColor: "d33682",
                nameColor: "4c4c4c",
                quoteColor: "6b7a1e",
                textColor: "4c4c4c",
                tripColor: "bf7f3f",
                titleColor: "4c4c4c",
                headerColor: "4c4c4c",
                headerLColor: "bf7f3f",
                headerLHColor: "d33682",
                headerBGColor: "efefef",
                boardColor: "4c4c4c",
                postHLColor: "bf7f3f",
                quotesYouHLColor: "d63e34",
                ownPostHLColor: "bf7f3f",
                threadHLColor: "4c4c4c",
                replybgHLColor: "c7c7c7",
                replyslctColor: "bf7f3f"
            }, {
                name: "Yasashii",
                authorName: "nebukazar",
                authorTrip: "!/Am.NeBUqQ",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "f8f8f8",
                brderColor: "f8f8f8",
                inputColor: "f8f8f8",
                inputbColor: "be7375",
                headerBGColor: "a6586f",
                headerColor: "f8f8f8",
                boardColor: "a6586f",
                bgColor: "ebebeb",
                textColor: "5b5c5c",
                blinkColor: "656599",
                headerLColor: "ebebeb",
                headerLHColor: "656599",
                linkColor: "b78087",
                linkHColor: "c8ab78",
                qlColor: "b78087",
                nameColor: "be7375",
                tripColor: "656599",
                titleColor: "b87d6e",
                quoteColor: "7eba6c",
                unreadColor: "f8f8f8",
                postHLColor: "9875a3",
                quotesYouHLColor: "656599",
                ownPostHLColor: "9875a3",
                threadHLColor: "b87d6e",
                replybgHLColor: "eaeaea",
                replyslctColor: "9875a3"
            }, {
                name: "AppChan", // Originally by Zixaphir @ http://userstyles.org/styles/54149/appchan
                authorName: "Zixaphir",
                authorTrip: "!M.........",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "2c2c2c",
                mainColor: "333333",
                brderColor: "333333",
                inputColor: "333333",
                inputbColor: "2c2c2c",
                blinkColor: "4f5f8f",
                unreadColor: "6688aa",
                linkColor: "6688aa",
                linkHColor: "6688aa",
                qlColor: "6688aa",
                nameColor: "aaaaaa",
                quoteColor: "789922",
                textColor: "aaaaaa",
                tripColor: "aaaaaa",
                titleColor: "aaaaaa",
                headerColor: "aaaaaa",
                headerLColor: "6688aa",
                headerLHColor: "6688aa",
                headerBGColor: "333333",
                boardColor: "aaaaaa",
                postHLColor: "aaaaaa",
                quotesYouHLColor: "aaaaaa",
                ownPostHLColor: "aaaaaa",
                threadHLColor: "aaaaaa",
                replybgHLColor: "282828",
                replyslctColor: "aaaaaa"
            }, {
                name: "Zenburned",
                authorName: "lazy",
                authorTrip: "!HONKYn7h1.",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "3f3f3f",
                mainColor: "575757",
                brderColor: "5e5e5e",
                inputColor: "454545",
                inputbColor: "888888",
                blinkColor: "dca3a3",
                unreadColor: "93b3a3",
                linkColor: "efdcbc",
                linkHColor: "f8f893",
                qlColor: "efdcbc",
                nameColor: "c0bed1",
                quoteColor: "7f9f7f",
                textColor: "dcdccc",
                tripColor: "8cd0d3",
                titleColor: "aaaaaa",
                headerColor: "dcdccc",
                headerLColor: "efdcbc",
                headerLHColor: "f8f893",
                headerBGColor: "575757",
                boardColor: "dcdccc",
                postHLColor: "8cd0d3",
                quotesYouHLColor: "8cd0d3",
                ownPostHLColor: "8cd0d3",
                threadHLColor: "aaaaaa",
                replybgHLColor: "494949",
                replyslctColor: "8cd0d3"
            }, {
                name: "Monokai",
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "20211c",
                mainColor: "272822",
                brderColor: "2d2e27",
                inputColor: "20211c",
                inputbColor: "171713",
                blinkColor: "f92672",
                unreadColor: "e2db74",
                linkColor: "e2db74",
                linkHColor: "ae81ff",
                qlColor: "e2db74",
                nameColor: "5ac0cc",
                quoteColor: "a2cc28",
                textColor: "f8f8f2",
                tripColor: "fa8220",
                titleColor: "ae81ff",
                headerColor: "f8f8f2",
                headerLColor: "e2db74",
                headerLHColor: "ae81ff",
                headerBGColor: "272822",
                boardColor: "f8f8f2",
                postHLColor: "fa8220",
                quotesYouHLColor: "fa8220",
                ownPostHLColor: "fa8220",
                threadHLColor: "ae81ff",
                replybgHLColor: "23241e",
                replyslctColor: "fa8220"
            }, {
                name: "Ao ni sarasu", // based on jaygeegeegee's http://userstyles.org/styles/75602/last-fm-kind-of-blue
                authorName: "Seaweed",
                authorTrip: "!!lq+3fff+/ev",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                bgColor: "e9eced",
                mainColor: "e3e7e8",
                brderColor: "cccccc",
                inputColor: "e9eced",
                inputbColor: "cccccc",
                blinkColor: "477085",
                unreadColor: "477085",
                linkColor: "477085",
                linkHColor: "5d6678",
                qlColor: "477085",
                nameColor: "4c4c4c",
                quoteColor: "6b7a1e",
                textColor: "4c4c4c",
                tripColor: "5d6678",
                titleColor: "617d6f",
                headerColor: "4c4c4c",
                headerLColor: "477085",
                headerLHColor: "5d6678",
                headerBGColor: "e3e7e8",
                boardColor: "477085",
                postHLColor: "5d6678",
                quotesYouHLColor: "d63e34",
                ownPostHLColor: "5d6678",
                threadHLColor: "617d6f",
                replybgHLColor: "d5dada",
                replyslctColor: "5d6678"
            }, {
                name: "Blue Tone",
                authorName: "Leagle",
                authorTrip: "!YoGiiH6Oi.",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "222222",
                brderColor: "222222",
                inputColor: "18191a",
                inputbColor: "121314",
                headerBGColor: "1b1b1b",
                headerColor: "dddddd",
                boardColor: "dddddd",
                bgColor: "1b1b1b",
                textColor: "a0a0a0",
                blinkColor: "3296c8",
                headerLColor: "3296c8",
                headerLHColor: "dddddd",
                linkColor: "a0a0a0",
                linkHColor: "dddddd",
                qlColor: "3296c8",
                nameColor: "dddddd",
                tripColor: "dddddd",
                titleColor: "a0a0a0",
                quoteColor: "009933",
                unreadColor: "3296c8",
                postHLColor: "ffffff",
                quotesYouHLColor: "ffffff",
                ownPostHLColor: "ffffff",
                threadHLColor: "a0a0a0",
                replybgHLColor: "141414",
                replyslctColor: "ffffff",
                customCSS: "body{\nbackground: rgba(19,19,19,1);\n}\n.boardBanner .boardTitle {\ntext-shadow: 0 0 3px #a0a0a0 !important;\nletter-spacing: 0px !important;\n}\n#delform {\n padding: 0 2px !important;\n background: rgba(19,19,19,1);\n}"
            }, {
                name: "Cold Snap",
                authorName: "Kori",
                authorTrip: "!STRaW/KORI",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "fcfcfc",
                brderColor: "ebebeb",
                inputColor: "ffffff",
                inputbColor: "ffffff",
                headerBGColor: "ffffff",
                headerColor: "aaaaaa",
                boardColor: "6699cc",
                bgColor: "ffffff",
                textColor: "232323",
                blinkColor: "6699cc",
                headerLColor: "aaaaaa",
                headerLHColor: "6699cc",
                linkColor: "6699cc",
                linkHColor: "6699cc",
                qlColor: "6699cc",
                nameColor: "aaaaaa",
                tripColor: "476b8f",
                titleColor: "909090",
                quoteColor: "83bf57",
                unreadColor: "6699cc",
                postHLColor: "476b8f",
                quotesYouHLColor: "476b8f",
                ownPostHLColor: "476b8f",
                threadHLColor: "909090",
                replybgHLColor: "eeeeee",
                replyslctColor: "476b8f"
            }, {
                name: "Blue Phallus",
                authorName: "iluvOP",
                authorTrip: "!Tripfags can die.",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "242436",
                brderColor: "242436",
                inputColor: "242436",
                inputbColor: "262638",
                headerBGColor: "242436",
                headerColor: "da637e",
                boardColor: "7787a3",
                bgColor: "20202f",
                textColor: "a7a7ad",
                blinkColor: "4b5e57",
                headerLColor: "4c626d",
                headerLHColor: "da637e",
                linkColor: "7787a3",
                linkHColor: "da637e",
                qlColor: "4b5e57",
                nameColor: "da637e",
                tripColor: "63918b",
                titleColor: "da637e",
                quoteColor: "b1b792",
                unreadColor: "64657b",
                postHLColor: "da637e",
                quotesYouHLColor: "da637e",
                ownPostHLColor: "da637e",
                threadHLColor: "da637e",
                replybgHLColor: "20202f",
                replyslctColor: "da637e",
                customCSS: ".reply { box-shadow: -2px 2px 2px rgba(0,0,0,.10); }"
            }, {
                name: "Midnight Caek",
                authorName: "saxamaphone",
                authorTrip: "!3.saxN0DHY",
                "default": true,
                bgImg: false,
                replyOp: "1.0",
                navOp: "0.9",
                mainColor: "1c1c1c",
                brderColor: "1c1c1c",
                inputColor: "1c1c1c",
                inputbColor: "1c1c1c",
                headerBGColor: "101010",
                headerColor: "909090",
                boardColor: "909090",
                bgColor: "101010",
                textColor: "909090",
                blinkColor: "424247",
                headerLColor: "909090",
                headerLHColor: "47475b",
                linkColor: "57577b",
                linkHColor: "47475b",
                qlColor: "57577b",
                nameColor: "7c2d2d",
                tripColor: "3e7157",
                titleColor: "aaaaaa",
                quoteColor: "71793e",
                unreadColor: "57577b",
                postHLColor: "7c2d2d",
                quotesYouHLColor: "7c2d2d",
                ownPostHLColor: "7c2d2d",
                threadHLColor: "aaaaaa",
                replybgHLColor: "0e0e0e",
                replyslctColor: "7c2d2d"
            }],

            init: function () {
                $SS.conf["Themes"] = Array.isArray($SS.conf["Themes"]) ?
                    this.defaults.concat($SS.conf["Themes"]) : this.defaults.slice(0);

                var i;
                if ($SS.conf["System Theming"]) {
                    i = window.matchMedia('(prefers-color-scheme: dark)').matches ?
                        parseInt($SS.conf["Dark Theme"], 10) : parseInt($SS.conf["Light Theme"], 10);
                } else {
                    i = $SS.location.nsfw ?
                        $SS.conf["NSFW Theme"] : $SS.conf["Selected Theme"];
                }

                var tIndex = $SS.conf["Themes"][i] ? i : 0;
                $SS.theme = new $SS.Theme(tIndex); // Set the active theme.
                $SS.setThemeVariables();

                // Listen for system color scheme changes
                if (!this._mqListener) {
                    this._mqListener = function () {
                        if ($SS.conf["System Theming"]) {
                            $SS.init(true);
                        }
                    };
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this._mqListener);
                }
            }
        },

        classes: {
            init: function () {
                var cl = document.documentElement.classList,
                    // The home page has its own layout; several board-page
                    // layout features must not engage there
                    isHome = !!document.body && document.body.classList.contains("homepage-standard-mode");
                cl.add("oneechan");
                cl.toggle("isLight", $SS.theme.textColor.isLight === true);
                cl.toggle("dark-captcha", $SS.theme.bgColor.isLight === false);
                cl.toggle("underline-quotes", $SS.conf["Underline QuoteLinks"] === true);
                cl.toggle("underline-disabled", $SS.conf["Underline All Links"] === false);
                cl.toggle("rounded-corners", $SS.conf["Rounded Corners"] === true);
                cl.toggle("hide-board-name", $SS.conf["Show Board Name"] === false);
                cl.toggle("reply-fit-width", $SS.conf["Fit Width"] === true);
                cl.toggle("fit-postmenu", $SS.conf["Fit Post Menu"] === true);
                cl.toggle("hide-banner", $SS.conf["Show Banner"] === false);
                cl.toggle("banner-opacity", $SS.conf["Reduce Banner Opacity"] === true);
                cl.toggle("show-form", $SS.conf["Show Original Form"] === false);
                cl.toggle("post-info", $SS.conf["Show Reply Header"] === true);
                cl.toggle("show-file-info", $SS.conf["Show File Info"] === false);
                cl.toggle("borders-all", $SS.conf["Borders"] === 2);
                cl.toggle("borders-none", $SS.conf["Borders"] === 3);
                cl.toggle("hl-border", $SS.conf["Decoration Style"] === 1);
                cl.toggle("hl-outline", $SS.conf["Decoration Style"] === 2);
                cl.toggle("hl-border-down", $SS.conf["Decoration Style"] === 3);
                if (!$SS.location.report) {
                    // The sidebar rearranges the board header/banner; on the
                    // home page that mangles its custom layout
                    cl.toggle("right-sidebar", $SS.conf["Sidebar Position"] === 1 && !isHome);
                    cl.toggle("left-sidebar", $SS.conf["Sidebar Position"] === 2 && !isHome);
                    cl.toggle("ss-sidebar", $SS.conf["SS-like Sidebar"] === true && !isHome);
                    cl.toggle("mini-sidebar", $SS.conf["Minimal Sidebar"] === true && !isHome);
                }
                cl.toggle("recolor-even", $SS.conf["Recolor Even Replies"] === true);
                cl.toggle("alt-spoiler", $SS.conf["Invert Spoiler"] === true);
                cl.toggle("backlink-icon", $SS.conf["Backlink Icons"] === true);
                cl.toggle("backlink-shadow", $SS.conf["Backlink Shadow"] === true);
                cl.toggle("fit-eximg", $SS.conf["Fit Expanded Images"] === true);
                cl.toggle("normal-qr", $SS.conf["Autohide Style"] === 1);
                cl.toggle("vertical-qr", $SS.conf["Autohide Style"] === 2);
                cl.toggle("fade-qr", $SS.conf["Autohide Style"] === 3);
                cl.toggle("qr-opacity", $SS.conf["Transparent QR"] === true);
                cl.toggle("qr-background", $SS.conf["Remove Background"] === true);
                cl.toggle("qr-controls", $SS.conf["Remove Controls"] === true);
                cl.toggle("force-indent", $SS.conf["Indent OP"] === false);
                cl.toggle("force-wrapping", $SS.conf["Allow Wrapping Around OP"] === false);
                cl.toggle("op-background", $SS.conf["OP Background"] === true);
                cl.toggle("expand-inputs", $SS.conf["Expanding Form Inputs"] === true);
                cl.toggle("qr-transition", $SS.conf["Animated Transition"] === true);
                cl.toggle("ts-notifs", $SS.conf["Style Holotower TS Notifications"] === true);
                cl.toggle("header-gradient", $SS.conf["Show Header Background Gradient"] === true);
                cl.toggle("header-shadow", $SS.conf["Show Header Shadow"] === false);
                cl.toggle("header-highlight", $SS.conf["Highlight Current Board"] === false);
                cl.toggle("hide-navlinks", $SS.conf["Show Navigation Links"] === false);
                cl.toggle("hide-navlinktop", $SS.conf["Show Top Links"] === false);
                cl.toggle("hide-navlinkbot", $SS.conf["Show Bottom Links"] === false);
                cl.toggle("thumb-opacity", $SS.conf["Reduce Thumbnail Opacity"] === true);
                cl.toggle("follow-cursor", $SS.conf["Follow Cursor"] === true);
                cl.toggle("catalog-justify", $SS.conf["Justified Text"] === true);
                cl.toggle("catalog-background", $SS.conf["Show Background"] === true);
                cl.toggle("catalog-thumbsize", $SS.conf["Unified Thumbnail Size"] === true);
                cl.toggle("use-sc-icons", $SS.conf["Use StyleTower Icons"]);
                cl.toggle("highlight-you", $SS.conf["Highlight Posts Quoting You"] === true);
                cl.toggle("highlight-own", $SS.conf["Highlight Own Posts"] === true);
                cl.toggle("mascot-overlap", $SS.conf["Mascots Overlap Posts"] === true);
                cl.toggle("mascot-dim", $SS.conf["Reduce Mascot Opacity"] === true);
                cl.toggle("st-home", isHome);
                // Holotower marks the fixed header on the boardlist element itself
                // (Holotower TS "Fixed Header" / "Auto-hide Header" toggles); mirror
                // that state onto :root as the classes the ported CSS keys off.
                var headerEl = document.querySelector("body > .boardlist:not(.bottom)"),
                    syncHeader = function () {
                        var isFixed = headerEl != null && headerEl.classList.contains("fixed");
                        cl.toggle("fixed", isFixed);
                        cl.toggle("top-header", isFixed);
                        cl.toggle("autohide", isFixed && headerEl.classList.contains("autohide"));
                    };
                // TS only builds its fixed header on thread pages; extend its
                // stored Fixed/Auto-hide Header preference to the index and
                // catalog (its stylesheet ships on those pages too) so the
                // header behaves the same site-wide.
                if (!$SS.location.reply && headerEl && !isHome) {
                    try {
                        var tsHeader = JSON.parse(localStorage.getItem("Thread Settings") || "{}"),
                            wantFixed = tsHeader.headerFixed !== false;
                        headerEl.classList.toggle("fixed", wantFixed);
                        headerEl.classList.toggle("autohide", wantFixed && tsHeader.headerAutohide === true);
                        if (wantFixed && document.body)
                            document.body.style.setProperty("--header-height", (headerEl.offsetHeight || 25) + "px");
                    } catch (e) { }
                }
                syncHeader();
                if (headerEl && !$SS._headerObserver) {
                    $SS._headerObserver = new MutationObserver(syncHeader);
                    $SS._headerObserver.observe(headerEl, { attributes: true, attributeFilter: ["class"] });
                }
                if ($SS.conf["Relative Post Dates"]) $SS.relativeDates();
                $SS.replacePostMenuBtn();
            }
        },

        /* STRUCTS */
        Color: function (hex, incHover) {
            // Themes from imports/old versions may carry 3-digit, prefixed or
            // invalid values; normalize so the emitted CSS is always valid
            hex = $SS.normalizeHex(hex) || "000000";
            this.hex = "#" + hex;
            this.private_rgb = $SS.RGBFromHex(hex);
            this.rgb = this.private_rgb.join(",");
            this.isLight = $SS.isLight(this.private_rgb);
            this.shiftRGB = function (shift, smart) {
                var rgb = this.private_rgb.slice(0);

                shift = smart ?
                    (this.isLight ? (shift < 0 ? shift : -shift) : Math.abs(shift)) : shift;

                rgb[0] = Math.min(Math.max(rgb[0] + shift, 0), 255);
                rgb[1] = Math.min(Math.max(rgb[1] + shift, 0), 255);
                rgb[2] = Math.min(Math.max(rgb[2] + shift, 0), 255);

                return rgb.join(",");
            };

            if (incHover)
                this.hover = this.shiftRGB(16, true);
        },
        Image: function (img, RPA) {
            this.img = img;
            this.RPA = RPA;
            this.get = function () {
                if (!this.img) return "none ";

                var src;
                if ($SS.validBase64(this.img)) {
                    // Imported themes may keep the data: prefix; strip it so it
                    // can't be doubled when the URI is rebuilt
                    var b64 = $SS.cleanBase64(this.img);
                    src = "data:image/" + $SS.typeofBase64(b64) + ";base64," + b64;
                } else
                    src = this.img;

                return "url('" + src + "')" + (this.RPA !== undefined ? " " + this.RPA : "");
            };
        },
        Theme: function (index) {
            var theme;

            if ((theme = $SS.conf["Themes"][index]) == undefined) {
                this.hidden = true;
                return;
            }

            this.index = index;
            this.hidden = $SS.conf["Hidden Themes"].indexOf(index) !== -1;
            this.name = theme.name;
            this.authorName = theme.authorName || "Anonymous";
            this.authorTrip = theme.authorTrip || "!..NoTrip..";
            this.default = theme.default;
            this.replyBrder = theme.replyBrder;
            this.bgImg = new $SS.Image(theme.bgImg, theme.bgRPA);
            // Free-text in old saves: clamp to 0..1 so a stray value can't
            // invalidate every rgba() consumer
            this.replyOp = $SS.normalizeOpacity(theme.replyOp, "1.0");
            this.navOp = $SS.normalizeOpacity(theme.navOp, "0.9");
            this.bgColor = new $SS.Color(theme.bgColor);
            this.mainColor = new $SS.Color(theme.mainColor);
            this.brderColor = new $SS.Color(theme.brderColor);
            this.inputColor = new $SS.Color(theme.inputColor, true);
            this.inputbColor = new $SS.Color(theme.inputbColor);
            this.blinkColor = new $SS.Color(theme.blinkColor);
            this.unreadColor = new $SS.Color(theme.unreadColor);
            this.linkColor = new $SS.Color(theme.linkColor);
            this.linkHColor = new $SS.Color(theme.linkHColor);
            this.qlColor = new $SS.Color(theme.qlColor);
            this.nameColor = new $SS.Color(theme.nameColor);
            this.quoteColor = new $SS.Color(theme.quoteColor);
            this.textColor = new $SS.Color(theme.textColor);
            this.titleColor = new $SS.Color(theme.titleColor);
            this.tripColor = new $SS.Color(theme.tripColor);
            this.boardColor = new $SS.Color(theme.boardColor);
            this.headerColor = new $SS.Color(theme.headerColor);
            this.headerLColor = new $SS.Color(theme.headerLColor);
            this.headerLHColor = new $SS.Color(theme.headerLHColor);
            this.headerBGColor = new $SS.Color(theme.headerBGColor);
            this.postHLColor = new $SS.Color(theme.postHLColor);
            this.quotesYouHLColor = new $SS.Color(theme.quotesYouHLColor);
            this.ownPostHLColor = new $SS.Color(theme.ownPostHLColor);
            this.threadHLColor = new $SS.Color(theme.threadHLColor);
            this.replybgHLColor = new $SS.Color(theme.replybgHLColor);
            this.replyslctColor = new $SS.Color(theme.replyslctColor);
            // Hover previews default to the shade replies always used, so
            // themes without the key keep their look
            this.hoverColor = theme.hoverColor ? new $SS.Color(theme.hoverColor) : null;
            this.hoverOutColor = theme.hoverOutColor ? new $SS.Color(theme.hoverOutColor) : null;
            this.hoverOp = $SS.normalizeOpacity(theme.hoverOp, "0.8");
            this.hoverOutOp = $SS.normalizeOpacity(theme.hoverOutOp, "0.5");
            this.codeBackground = (this.bgColor.isLight ? "255, 255, 255, 0.2" : "0, 0, 0, 0.2");
            this.codeBorder = (this.bgColor.isLight ? "204, 204, 204, 1.0" : "204, 204, 204, 0.1");
            this.icons = {
                menuIcon: "<svg viewBox='0 0 512 512' preserveAspectRatio='xMidYMid meet' class='icon' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='currentColor' d='M256 432q-15 1-16 16 1 15 16 16 15-1 16-16-1-15-16-16ZM64 288H448v32q-1 27-19 45t-45 19H320v64q-1 27-19 45t-45 19q-27-1-45-19t-19-45V384H128q-27-1-45-19T64 320V288v32-32ZM226 6l21 52q3 6 9 6t9-6L286 6q2-6 9-6H400q20 1 34 14 13 14 14 34V224v22 10H74 64V246 224 48q1-20 14-34Q92 1 112 0h10q6 0 8 6l21 52q3 6 9 6t9-6L190 6q2-6 9-6h19q6 0 8 6Z'/></svg>",
                star: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.textColor.rgb + ")' d='M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z'/></svg>",
                msg: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.textColor.rgb + ")' d='M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z'/></svg>",
                backlink: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.blinkColor.rgb + ")' d='M12.981,9.073V6.817l-12.106,6.99l12.106,6.99v-2.422c3.285-0.002,9.052,0.28,9.052,2.269c0,2.78-6.023,4.263-6.023,4.263v2.132c0,0,13.53,0.463,13.53-9.823C29.54,9.134,17.952,8.831,12.981,9.073z'/></svg>",
                threadClosed: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.headerColor.rgb + ")' d='M22.335,12.833V9.999h-0.001C22.333,6.501,19.498,3.666,16,3.666S9.666,6.502,9.666,10h0v2.833H7.375V25h17.25V12.833H22.335zM11.667,10C11.667,10,11.667,10,11.667,10c0-2.39,1.944-4.334,4.333-4.334c2.391,0,4.335,1.944,4.335,4.333c0,0,0,0,0,0v2.834h-8.668V10z'/></svg>",
                threadPinned: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.tripColor.rgb + ")' d='M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z'/></svg>",
                threadArchived: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.tripColor.rgb + ")' d='M15.5,3.029l-10.8,6.235L4.7,21.735L15.5,27.971l10.8-6.235V9.265L15.5,3.029zM24.988,10.599L16,15.789v10.378c0,0.275-0.225,0.5-0.5,0.5s-0.5-0.225-0.5-0.5V15.786l-8.987-5.188c-0.239-0.138-0.321-0.444-0.183-0.683c0.138-0.238,0.444-0.321,0.683-0.183l8.988,5.189l8.988-5.189c0.238-0.138,0.545-0.055,0.684,0.184C25.309,10.155,25.227,10.461,24.988,10.599z'/></svg>",
                downArrow: "<svg viewBox='7 4 29 27' preserveAspectRatio='xMidYMid meet' height='16' width='16' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.tripColor.rgb + ")' d='M8.037,11.166L14.5,22.359c0.825,1.43,2.175,1.43,3,0l6.463-11.194c0.826-1.429,0.15-2.598-1.5-2.598H9.537C7.886,8.568,7.211,9.737,8.037,11.166z'/></svg>",
                options: "<svg viewBox='0 0 30 30' preserveAspectRatio='xMidYMid meet' xmlns='http://www.w3.org/2000/svg'>" +
                    "<path fill='rgb(" + this.headerLColor.rgb + ")' d='M15,10.5c-2.485,0-4.5,2.015-4.5,4.5s2.015,4.5,4.5,4.5s4.5-2.015,4.5-4.5S17.485,10.5,15,10.5z M27.5,17.16v-4.32l-3.02-0.5c-0.22-0.79-0.53-1.54-0.94-2.24l1.78-2.49l-3.05-3.05l-2.49,1.78c-0.7-0.4-1.45-0.72-2.24-0.94L16.16,2.4h-4.32l-0.5,3.02c-0.79,0.22-1.54,0.53-2.24,0.94L6.61,4.58L3.56,7.63l1.78,2.49c-0.4,0.7-0.72,1.45-0.94,2.24l-3.02,0.5v4.32l3.02,0.5c0.22,0.79,0.53,1.54,0.94,2.24l-1.78,2.49l3.05,3.05l2.49-1.78c0.7,0.4,1.45,0.72,2.24,0.94l0.5,3.02h4.32l0.5-3.02c0.79-0.22,1.54-0.53,2.24-0.94l2.49,1.78l3.05-3.05l-1.78-2.49c0.4-0.7,0.72-1.45,0.94-2.24L27.5,17.16z'/></svg>"
            };

            if (theme.customCSS) {
                try {
                    var css = String(theme.customCSS);
                    if (css.length > 2 && css[0] === "(" && css[css.length - 1] === ")") {
                        css = css.slice(1, -1);
                    }
                    css = css.replace(/^\\?"|\\?"$/g, '');
                    this.customCSS = $SS.trimLineBreaks(css);
                } catch (e) {
                    alert("Error processing " + this.name + "'s theme.customCSS!\n" + e.message);
                    this.customCSS = String(theme.customCSS || "");
                }
            } else
                this.customCSS = "";

            this.preview = function () {
                var div = $("<div " + (this.hidden ? "hidden=true " : "") +
                    " id=theme" + this.index + " class=\'theme-preview " + (($SS.conf["Selected Theme"] == $SS.conf["NSFW Theme"]) && ($SS.conf["Selected Theme"] == this.index) ? "selected nsfw" : ($SS.conf["Selected Theme"] == this.index ? "selected " : "") + ($SS.conf["NSFW Theme"] == this.index ? "nsfw " : "")) + "\'>").html("<div class=reply " +
                        "style='background-color:" + this.mainColor.hex + "!important;border:1px solid " + this.brderColor.hex + "!important;color:" + this.textColor.hex + "!important'>" +
                        "<span style='display:inline-block;width:10px;height:10px;border-radius:2px;background-color:" + this.inputColor.hex + "!important;border:1px solid " + this.inputbColor.hex + "!important;box-shadow:rgba(" + this.mainColor.shiftRGB(64) + ",.3) 0 1px;'></span>&ensp;" +
                        "<span style='color:" + this.titleColor.hex + "!important; font-weight: bold !important'>" + $SS.escapeHTML(this.name) + "</span>&ensp;" +
                        "<span style='color:" + this.nameColor.hex + "!important; font-weight: bold !important'>" + $SS.escapeHTML(this.authorName) + "</span>&ensp;" +
                        "<span style='color:" + this.tripColor.hex + "!important'> " + $SS.escapeHTML(this.authorTrip) + "</span>" +
                        "<time style='color:" + this.textColor.hex + "'> 20XX.01.01 12:00 </time>" +
                        "<a href='javascript:;' style='color:" + this.linkColor.hex + "!important' " +
                        "onmouseover='this.setAttribute(\"style\",\"color:" + this.linkHColor.hex + "!important\")' " +
                        "onmouseout='this.setAttribute(\"style\",\"color:" + this.linkColor.hex + "!important\")'>No.22772469</a>" +
                        "<br><blockquote><span style='color:" + this.quoteColor.hex + "'>>implying this isn't a post</span><br>Post content is right here.</blockquote>" +
                        "<p class='theme-buttons-container'>" +
                        "<a href='javascript:;' title='Sets the SFW theme.' style='background-color:" + this.inputColor.hex + "!important;border:1px solid " + this.inputbColor.hex + "!important;color:" + this.textColor.hex + "!important'>SFW</a>" +
                        "<a href='javascript:;' title='Sets the NSFW theme.' style='background-color:" + this.inputColor.hex + "!important;border:1px solid " + this.inputbColor.hex + "!important;color:" + this.textColor.hex + "!important'>NSFW</a>" +
                        "<a href='javascript:;' title=Edit style='background-color:" + this.inputColor.hex + "!important;border:1px solid " + this.inputbColor.hex + "!important;color:" + this.textColor.hex + "!important'>Edit</a>" +
                        "<a href='javascript:;' title=Delete style='background-color:" + this.inputColor.hex + "!important;border:1px solid " + this.inputbColor.hex + "!important;color:" + this.textColor.hex + "!important'>Delete</a></p>" +
                        "<h3 class='sfw-label notsafe'>NSFW</h3>" +
                        "<h3 class='sfw-label safe'>SFW</h3>" +
                        "<h3 class='sfw-label both'>SFW & NSFW</h3>" +
                        "</div>");

                $(div).bind("click", function () {
                    var $this = $(this);

                    // classList.contains never matches a two-token string, so
                    // test the classes separately
                    if ($this.hasClass("selected") && $this.hasClass("nsfw")) return;

                    $this.parent().children(".selected").removeClass("selected");
                    $this.parent().children(".nsfw").removeClass("nsfw");
                    $this.addClass("selected nsfw");
                    // Theme state only: picking a theme must not commit
                    // half-edited settings from the other tabs
                    $SS.options.saveThemeState();
                    $SS.init(true);
                });

                $("a[title='Sets the SFW theme.']", div).bind("click", function (e) {
                    e.stopPropagation();
                    var $this = $(this);
                    if ($this.parent().parent().parent().hasClass("selected")) return;

                    $this.parent().parent().parent().parent().children(".selected").removeClass("selected");
                    $this.parent().parent().parent().addClass("selected");
                    $SS.options.saveThemeState();
                    $SS.init(true);
                });

                $("a[title='Sets the NSFW theme.']", div).bind("click", function (e) {
                    e.stopPropagation();
                    var $this = $(this);
                    if ($this.parent().parent().parent().hasClass("nsfw")) return;

                    $this.parent().parent().parent().parent().children(".nsfw").removeClass("nsfw");
                    $this.parent().parent().parent().addClass("nsfw");
                    $SS.options.saveThemeState();
                    $SS.init(true);
                });
                $("a[title=Delete]", div).bind("click", function (e) {
                    e.stopPropagation();
                    $SS.options.deleteTheme(index);
                });
                $("a[title=Edit]", div).bind("click", function (e) {
                    e.stopPropagation();
                    $SS.options.showTheme(index);
                });

                return div;
            };
        },

        /* HELPER METHODS */
        formatFont: function (font) {
            if (/^(serif|sans-serif|monospace|cursive|system-ui)$/.test(font))
                return font;

            return "'" + font + "'";
        },
        systemFonts: {
            windows: [
                "Arial", "Arial Black", "Arial Narrow", "Calibri", "Cambria",
                "Candara", "Century Gothic", "Comic Sans MS", "Consolas",
                "Constantia", "Corbel", "Courier New", "Franklin Gothic Medium",
                "Georgia", "Impact", "Lucida Console",
                "Lucida Sans Unicode", "Palatino Linotype", "Segoe UI",
                "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"
            ],
            macos: [
                "Arial", "Arial Black", "Comic Sans MS", "Courier New",
                "Futura", "Georgia", "Gill Sans", "Helvetica",
                "Helvetica Neue", "Hoefler Text", "Impact", "Menlo",
                "Monaco", "Optima", "Palatino", "San Francisco",
                "SF Mono", "SF Pro", "Tahoma", "Times New Roman",
                "Trebuchet MS", "Verdana"
            ],
            linux: [
                "Arial", "Cantarell", "Courier New", "DejaVu Sans",
                "DejaVu Sans Mono", "DejaVu Serif", "Georgia",
                "Liberation Mono", "Liberation Sans", "Liberation Serif",
                "Noto Sans", "Noto Sans Mono", "Tahoma",
                "Times New Roman", "Ubuntu", "Ubuntu Mono", "Verdana"
            ]
        },
        is4chanX: function () {
            return false;
        },
        isTS: function () {
            // Holotower TS saves its settings on every run
            try {
                return !!localStorage.getItem("Thread Settings");
            } catch (e) { return false; }
        },
        getOS: function () {
            var ua = navigator.userAgent;
            if (/Windows/i.test(ua)) return "windows";
            if (/Mac/i.test(ua)) return "macos";
            if (/Linux/i.test(ua)) return "linux";
            return "windows";
        },
        RGBFromHex: function (hex) {
            var rgb = [];
            hex = parseInt($SS.normalizeHex(hex) || "000000", 16);

            rgb[0] = (hex >> 16) & 0xFF;
            rgb[1] = (hex >> 8) & 0xFF;
            rgb[2] = hex & 0xFF;

            return rgb;
        },
        hexFromRGB: function (rgb) {
            return ((1 << 24) | (rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16).slice(1);
        },
        /* Returns a lowercase 6-digit hex (no "#") or null: 3-digit hex is
           expanded, 8-digit hex drops its alpha, anything else is rejected */
        normalizeHex: function (hex) {
            if (typeof hex !== "string") return null;
            hex = hex.replace(/^#/, "").toLowerCase();
            if (/^[0-9a-f]{3}$/.test(hex))
                return hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
            if (/^[0-9a-f]{8}$/.test(hex)) return hex.substr(0, 6);
            return /^[0-9a-f]{6}$/.test(hex) ? hex : null;
        },
        /* Returns the value clamped to 0..1 as a string, or fallback when
           the value isn't numeric (cleared field, junk text, old saves) */
        normalizeOpacity: function (val, fallback) {
            var op = parseFloat(val);
            return isNaN(op) ? fallback : String(Math.min(Math.max(op, 0), 1));
        },
        escapeHTML: function (s) {
            return String(s == null ? "" : s)
                .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        },
        isLight: function (rgb) {
            return rgb[0] + rgb[1] + rgb[2] >= 400;
        },
        trimLineBreaks: function (str) {
            return str.replace(/(\r\n|\r|\n)/gm, "");
        },
        cleanBase64: function (b64) {
            return b64.replace(/^(data:image\/(?:gif|jpe?g|png|webp|avif|svg\+xml);base64,)(\r\n|\r|\n)?/gmi, "");
        },
        typeofBase64: function (b64) {
            switch (b64.substr(0, 8)) {
                case "PD94bWwg":
                    return "svg+xml";
                case "R0lGODlh":
                    return "gif";
                case "/9j/4AAQ":
                case "/9j/4QAY":
                    return "jpeg";
                case "iVBORw0K":
                default:
                    if (b64.substr(0, 5) === "UklGR") return "webp";
                    if (b64.substr(0, 5) === "PHN2Z") return "svg+xml";
                    return "png";
            }
        },
        validBase64: function (b64) {
            return /^(?:data:image\/(?:gif|jpe?g|png|webp|avif|svg\+xml);base64,)?(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/i.test(b64);
        },
        validImageURL: function (img) {
            return /^https?:\/\/.+$/i.test(img);
        },
        /* Holotower (vichan) upload limits */
        maxFileSizeDefault: 10485760, /* 10MB */
        maxImageDim: 10000,

        getLocation: function (url) {
            var obj;

            if (typeof url === "string") {
                obj = document.createElement("a");
                obj.href = location.protocol + "//" + url;
            } else
                obj = window.location;

            var pathname = obj.pathname.slice(1).split("/");

            return {
                sub: obj.hostname.split(".")[0],
                board: /\.(?:php|html)$/.test(pathname[0] || "") ? "" : pathname[0],
                nsfw: false,
                maxFileSize: $SS.maxFileSizeDefault,
                reply: pathname[1] === "res",
                catalog: pathname[1] === "catalog.html",
                report: false,
                dead: /^404\b|^Not [Ff]ound\b/.test(document.title)
            };
        }
    };
    /* END STYLE SCRIPT CLASSES */
    $SS.init();
})();
