// ==UserScript==
// @name         Holotower TS
// @namespace    Holotower-TS
// @version      2.8
// @author       Anonymous
// @license      MIT
// @description  Adds various features to Holotower
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAVFBMVEVHcEwwP4D1w7eCb344MmLhubU6OGc2RIvp1Njyn4r0dBv7eyKUIgHpmWHhYAjpcB3w7/XvpHD1iT+vKQH5+fvOeFrbhV31soLv4OXBPw72vpdmcK6vNWMgAAAACnRSTlMAQnVHIKlv8dwqvTaiTAAAAQBJREFUeNqFz1uOhCAARNGaHt8KiIqC7n+fgwVDIh31/BluCgQZvBiG12BwL4FnngKaDRKt1nXy9CWYXQqElKrr+h4Bj8mlQJ2BTsEcOWdCwIEJkaGVzMqAF+y4JeJA7tM0zYcBX/iltKNdxrINgcCXxo7e0pxBfoEG0Fo7EoPteq6AovTnyxKCfMAZoKoPu3jjAujsF4VbAfzUR1rIBqRc4RX18b+AC8WAG81obYmclFKAqvq3bZFT0p0B1XWB3CalSkHFIB/gFbeEOjHQkSBEHekQ933vP5Q6VxFMKaDJF0ykAu19oBHtKQHtWwAiHRKFW3zKY8CnTHjAp+BFeNYfKeQVY6F7prQAAAAASUVORK5CYII=
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @connect      archive.holotower.org
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560097/Holotower%20TS.user.js
// @updateURL https://update.greasyfork.org/scripts/560097/Holotower%20TS.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // === Settings ===
  const settings = JSON.parse(localStorage.getItem("Thread Settings")) || {};
  try {
    const oldIQ = localStorage.getItem("InlineQuote Settings");
    if (oldIQ) {
      const old = JSON.parse(oldIQ);
      if (old.hideInlinedPosts !== undefined && settings.hideInlinedPosts === undefined) settings.hideInlinedPosts = old.hideInlinedPosts;
      if (old.alwaysInline !== undefined && settings.alwaysInline === undefined) settings.alwaysInline = old.alwaysInline;
      localStorage.removeItem("InlineQuote Settings");
    }
    const oldBorderStyle = localStorage.getItem('youBorderStyle');
    if (oldBorderStyle && settings.youBorderStyle === undefined) settings.youBorderStyle = oldBorderStyle;
    localStorage.removeItem('youBorderStyle');
    delete settings.appendQuotesWarning;
    localStorage.setItem("Thread Settings", JSON.stringify(settings));
  } catch (e) {}

  const showDeletedCounter = settings.showDeletedCounter ?? true;
  const showDeletedIcon = settings.showDeletedIcon ?? true;
  const showDeletedText = settings.showDeletedText ?? false;
  const hideDeleted = settings.hideDeletedPosts ?? false;
  const showArchivedMessage = settings.showArchivedMessage ?? true;
  const enableFaviconChanges = settings.faviconUpdater ?? true;
  const notifyNewPost = settings.notifyNewPost ?? true;
  const notifyNewYou = settings.notifyNewYou ?? true;
  const changeFaviconOnArchive = settings.changeFaviconOnArchive ?? true;
  const showUnreadLine = settings.showUnreadLine ?? true;
  const appendQuotes = settings.appendQuotes ?? true;
  const appendCrossThread = settings.appendCrossThread ?? false;
  const optionThreading = settings.optionThreading ?? true;
  const enableThreading = settings.enableThreading ?? false;
  const hidePosts = settings.hidePosts ?? true;
  const recursiveHiding = settings.recursiveHiding ?? true;
  const showStubs = settings.showStubs ?? true;
  const filenameChanger = settings.filenameChanger ?? true;
  const linkPreview = settings.linkPreview ?? true;
  const urlUpload = settings.urlUpload ?? true;
  const thumbnailSwap = settings.thumbnailSwap ?? true;
  const linkEmbed = settings.linkEmbed ?? true;
  const translateAuto = settings.translateAuto ?? false;
  const directButton = settings.directButton ?? false;
  const videoHover = settings.videoHover ?? true;
  const videoScrollVol = settings.videoScrollVol ?? true;
  const showSpoilerText = settings.showSpoilerText ?? false;
  const showSpoilerMedia = settings.showSpoilerMedia ?? false;
  const linkIcon = settings.linkIcon ?? true;
  const linkTitle = settings.linkTitle ?? true;
  const randomizeClipboard = settings.randomizeClipboard ?? false;
  const kbOptions = settings.kbOptions || { ctrl: false, alt: true, shift: false, key: "o" };
  const kbThreadToggle = settings.kbThreadToggle || { ctrl: false, alt: false, shift: true, key: "t" };
  const kbThreadNew = settings.kbThreadNew || { ctrl: false, alt: false, shift: false, key: "t" };
  const kbURL = settings.kbURL || { ctrl: false, alt: true, shift: false, key: "l" };
  const persistentEffect = settings.persistentEffect ?? false;
  const persistentDecor = settings.persistentDecor ?? false;
  const enableKbYou = settings.enableKbYou ?? true;
  const kbYouDown = settings.kbYouDown || { ctrl: false, alt: true, shift: false, key: "ArrowDown" };
  const kbYouUp = settings.kbYouUp || { ctrl: false, alt: true, shift: false, key: "ArrowUp" };
  const enableKbOwn = settings.enableKbOwn ?? true;
  const kbOwnDown = settings.kbOwnDown || { ctrl: true, alt: false, shift: false, key: "ArrowDown" };
  const kbOwnUp = settings.kbOwnUp || { ctrl: true, alt: false, shift: false, key: "ArrowUp" };
  const enableTowerTunes = settings.enableTowerTunes ?? true;
  const kbTowerTunes = settings.kbTowerTunes || { ctrl: false, alt: true, shift: false, key: "m" };
  const scrollMarker = settings.scrollMarker ?? true;
  const kbToggleMarker = settings.kbToggleMarker || { ctrl: false, alt: false, shift: false, key: "m" };
  const quoteResurrect = settings.quoteResurrect ?? true;
  const rememberLastRead = settings.rememberLastRead ?? true;
  const scrollToLastRead = settings.scrollToLastRead ?? true;
  const unreadCount = settings.unreadCount ?? true;
  const faviconOnEntry = settings.faviconOnEntry ?? true;
  const desktopNotifications = settings.desktopNotifications ?? true;
  const inlineQuoting = settings.inlineQuoting ?? true;
  const hideInlinedPosts = settings.hideInlinedPosts ?? false;
  const alwaysInline = settings.alwaysInline ?? true;
  const highlightPosts = settings.highlightPosts ?? true;
  let youBorderStyle = settings.youBorderStyle ?? 'dashed';
  const enableQuickReply = settings.enableQuickReply ?? true;
  const kbQuickReply = settings.kbQuickReply || { ctrl: false, alt: false, shift: false, key: "q" };
  const enableSoundposts = settings.enableSoundposts ?? true;
  const archiveRedirect = settings.archiveRedirect ?? true;
  const videoHoverCursor = settings.videoHoverCursor ?? false;
  const rerouteCatbox = settings.rerouteCatbox ?? false;
  let catboxProxy = settings.catboxProxy ?? 'pixstash';
  const enableImgOps = settings.enableImgOps ?? true;
  const hashNavigation = settings.hashNavigation ?? false;
  const enableOekaki = settings.enableOekaki ?? true;
  const formatFilenames = settings.formatFilenames ?? true;
  const resizeMedia = settings.resizeMedia ?? true;
  const postOutbox = settings.postOutbox ?? true;
  const kbPostOutbox = settings.kbPostOutbox || { ctrl: false, alt: true, shift: false, key: "n" };

  const FAVICON_URL = window.location.hostname === 'boards.holotower.org'
  ? 'https://boards.holotower.org/favicon.gif'
  : 'https://holotower.org/favicon.gif';
  let alertState = 'none';
  let requestedFaviconState = 'none';
  let pendingFaviconState = null;
  let faviconRequestToken = 0;
  const notifyPostColor = settings.notifyPostColor || "white";
  const notifyYouColor = settings.notifyYouColor || "red";

  const originalTitle = rememberLastRead ? document.title.replace(/^\(\d+\)\s*/, '') : document.title;
  const updaterCheckbox = document.getElementById('auto_update_status');
  const hiddenSet = new Set();
  const unreadSet = new Set();
  const sessionUnreadPostIds = new Set();
  const postPlacementMap = new Map();
  let placementToPostId = [];

  let lastPostCount = null;
  let lastSeenPostId = 0;
  let lastLine = 0;
  let hasUnreadLine = false;
  let currentBoard = null;
  let currentThreadId = null;
  let lowPostWarningCount = 0;
  let isLargeDrop = false;
  let isThreadArchived = false;
  let updaterDisabled = false;
  let currentLastPostId = 0;
  let lastThreadedId = 0;
  let toggleThread = enableThreading;
  let isChristmas = false;
  let isNewYear = false;
  let isLast50Mode = false;
  let lastReadPostId = null;
  let lastReadPlacement = 0;
  let lastReadObserver = null;
  let saveReadDebounce = null;
  let unreadTitleTimer = null;
  let isScrolling = false;
  let scrollIdleTimer = null;
  let pendingMaxSeen = 0;
  let rafScheduled = false;
  let nextPlacement = 1;
  let suppressTitleWrites = true;
  let postsInitialized = false;
  let siteImageHover = false;

  const bumpLimit = 1400;
  const pageLimit = 10;

  function setFavicon(url) {
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;
    if (!link.parentNode) document.head.appendChild(link);
  }

  function restoreFavicon() {
    requestedFaviconState = 'none';
    pendingFaviconState = null;
    ++faviconRequestToken;
    alertState = 'none';
    setFavicon(FAVICON_URL);
  }

  function updateFavicon(color) {
    if (requestedFaviconState === color && (alertState === color || pendingFaviconState === color)) return;

    requestedFaviconState = color;
    pendingFaviconState = color;
    const requestToken = ++faviconRequestToken;

    const drawColor = color === 'red' ? notifyYouColor : notifyPostColor;
    const archived = isThreadArchived;

    const img = new Image();
    img.onload = () => {
      if (requestToken !== faviconRequestToken) return;
      pendingFaviconState = null;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      if (archived) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.beginPath();
      ctx.arc(canvas.width - 16, 16, 5, 0, 2 * Math.PI);
      ctx.fillStyle = drawColor;
      ctx.fill();

      setFavicon(canvas.toDataURL('image/x-icon'));
      alertState = color;
    };
    img.onerror = () => {
      if (requestToken === faviconRequestToken && requestedFaviconState === color) {
        pendingFaviconState = null;
        requestedFaviconState = alertState;
      }
    };
    img.src = FAVICON_URL;
  }

  function updateFaviconArchived() {
    if (!changeFaviconOnArchive) return;

    isThreadArchived = true;
    const requestToken = ++faviconRequestToken;
    pendingFaviconState = null;

    const img = new Image();
    img.onload = () => {
      if (requestToken !== faviconRequestToken) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      if (requestedFaviconState === 'red' || alertState === 'red') {
        const drawColor = notifyYouColor;
        ctx.beginPath();
        ctx.arc(canvas.width - 16, 16, 5, 0, 2 * Math.PI);
        ctx.fillStyle = drawColor;
        ctx.fill();
      } else if (requestedFaviconState === 'white' || alertState === 'white') {
        const drawColor = notifyPostColor;
        ctx.beginPath();
        ctx.arc(canvas.width - 16, 16, 5, 0, 2 * Math.PI);
        ctx.fillStyle = drawColor;
        ctx.fill();
      }

      setFavicon(canvas.toDataURL('image/x-icon'));
    };
    img.src = FAVICON_URL;
  }

  function revertFavicon() {
    if (alertState === 'none' && requestedFaviconState === 'none') return;

    if (isThreadArchived) {
      requestedFaviconState = 'none';
      pendingFaviconState = null;
      ++faviconRequestToken;
      alertState = 'none';
      updateFaviconArchived();
    } else {
      restoreFavicon();
    }
  }

  function recomputePlacements() {
    if (!rememberLastRead) return;
    const threadEl = document.getElementById('thread_' + currentThreadId);
    if (!threadEl) return;

    nextPlacement = 1;
    postPlacementMap.clear();
    placementToPostId.length = 0;
    const posts = threadEl.querySelectorAll('div.post.reply');
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const place = nextPlacement++;
      post.dataset.place = String(place);
      const postId = post.id.split('_')[1];
      postPlacementMap.set(postId, place);
      placementToPostId[place] = postId;
    }

    if (lastReadPlacement > 0) {
      lastReadPostId = placementToPostId[lastReadPlacement] || null;
      if (!lastReadPostId) lastReadPlacement = 0;
    } else if (lastReadPostId) {
      lastReadPlacement = postPlacementMap.get(lastReadPostId) || 0;
    }

    unreadSet.clear();
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      if (post.classList.contains('hidden-post') || post.classList.contains('deleted-post')) continue;
      const place = Number(post.dataset.place);
      if (place > lastReadPlacement) {
        const id = post.id.split('_')[1];
        unreadSet.add(id);
        if (lastReadObserver) lastReadObserver.observe(post);
      }
    }
    updateUnreadTitle();
  }

  function initializeLastReadObserver() {
    if (lastReadObserver) return;

    lastReadObserver = new IntersectionObserver((entries) => {
      let maxSeen = lastReadPlacement;
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.isIntersecting) continue;
        const place = Number(entry.target.dataset.place);
        if (isScrolling) {
          if (place > pendingMaxSeen) pendingMaxSeen = place;
        } else {
          if (place > maxSeen) maxSeen = place;
          lastReadObserver.unobserve(entry.target);
        }
      }

      if (!isScrolling && maxSeen > lastReadPlacement) {
        pendingMaxSeen = Math.max(pendingMaxSeen, maxSeen);
        if (!rafScheduled) {
          rafScheduled = true;
          requestAnimationFrame(() => {
            rafScheduled = false;
            flushPendingSeen();
          });
        }
      }
    }, { threshold: 1 });
  }

  function flushPendingSeen() {
    if (!pendingMaxSeen || pendingMaxSeen <= lastReadPlacement) {
      pendingMaxSeen = 0;
      return;
    }

    lastReadPlacement = pendingMaxSeen;
    pendingMaxSeen = 0;
    lastReadPostId = placementToPostId[lastReadPlacement] || lastReadPostId;
    for (const id of unreadSet) {
      if ((postPlacementMap.get(id) || 0) <= lastReadPlacement) {
        unreadSet.delete(id);
      }
    }

    scheduleLastReadSave();
    updateUnreadTitle();

    if (unreadSet.size === 0) {
      revertFavicon();
    } else if (requestedFaviconState === 'red' || alertState === 'red') {
      let youRemaining = false;
      for (const id of unreadSet) {
        if (youPostIds.has(id)) {
          youRemaining = true;
          break;
        }
      }
      if (!youRemaining) {
        updateFavicon('white');
      }
    }
  }

  function scheduleLastReadSave() {
    if (saveReadDebounce) return;

    saveReadDebounce = setTimeout(() => {
      saveReadDebounce = null;
      const latest = JSON.parse(localStorage.getItem("Thread Settings")) || {};
      if (!latest.lastReadPosts) latest.lastReadPosts = {};
      if (!latest.lastReadPosts[currentBoard]) latest.lastReadPosts[currentBoard] = {};

      const existing = latest.lastReadPosts[currentBoard][currentThreadId];
      let existingPlacement = 0;
      if (existing?.postId) {
        existingPlacement = postPlacementMap.get(existing.postId) || 0;
      }
      if (lastReadPlacement > existingPlacement) {
        latest.lastReadPosts[currentBoard][currentThreadId] = {
          postId: lastReadPostId
        };
        localStorage.setItem("Thread Settings", JSON.stringify(latest));
      }
    }, 750);
  }

  function updateUnreadTitle() {
    if (!rememberLastRead) return;

    if (unreadTitleTimer) clearTimeout(unreadTitleTimer);
    unreadTitleTimer = setTimeout(() => {
      unreadTitleTimer = null;
      const unread = unreadSet.size;
      suppressTitleWrites = false;
      if (unreadCount && unread > 0) {
        document.title = `(${unread}) ${originalTitle}`;
      } else {
        document.title = originalTitle;
      }
      suppressTitleWrites = true;
    }, 50);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      sessionUnreadPostIds.clear();
      revertFavicon();
      removeUnreadLine();
    }
    if (rememberLastRead) {
      isScrolling = true;
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        isScrolling = false;
        flushPendingSeen();
      }, 120);
    }
  }, { passive: true });

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const MAX_DIMENSION = 10000;
  const CONVERTIBLE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp']);

  function showMessageNotification(message, options = {}) {
    const { timeout = 15000, single = null } = options;

    let container = $('#notification_container');

    if (!container.length) {
      container = $('<div id="notification_container"></div>');
      $('body').append(container);
    }

    if (single) {
      const existing = container
      .find(`.message_notification[data-single-key="${single}"]`);
      if (existing.length) return;
    }

    const alert = $(`
      <div class="message_notification">
        <div class="notification_div">
          <a class="notification_close" href="javascript:void(0)">
            <i class="fa fa-times"></i>
          </a>
          <div class="alert_message"></div>
        </div>
      </div>
    `);

    if (single) {
      alert.attr('data-single-key', single);
    }

    alert.find('.alert_message').html(
      String(message).replace(/\n/g, '<br>')
    );

    alert.hide();
    container.append(alert);
    alert.fadeIn(300);

    alert.on('click', '.notification_close', function () {
      alert.stop(true).fadeOut(200, () => alert.remove());
    });

    setTimeout(() => {
      alert.stop(true).fadeOut(400, () => alert.remove());
    }, timeout);
  }

  const imageConversionButtonStates = new WeakMap();

  function getConversionForm(context) {
    const source = context && context.nodeType === 1 ? context : null;
    const form = source && (source.tagName === 'FORM' ? source : source.closest('form'));
    if (form) return form;

    if (typeof mobileInput !== 'undefined' && mobileInput) {
      return document.getElementById('mbReplyForm') || document.querySelector('form[name="post"]');
    }
    return document.querySelector('#quick-reply') || document.querySelector('form[name="post"]');
  }

  function getButtonLabel(button) {
    return button.tagName === 'INPUT' ? button.value : button.innerHTML;
  }

  function setButtonLabel(button, label) {
    if (button.tagName === 'INPUT') button.value = label;
    else button.innerHTML = label;
  }

  function lockPostButtons(context) {
    const scope = getConversionForm(context);
    if (!scope) return () => {};

    const buttons = scope.querySelectorAll('#mbSend, input[type="submit"], button[type="submit"]');
    const states = [];
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      let state = imageConversionButtonStates.get(button);
      if (!state) {
        if (button.disabled) continue;
        state = {
          count: 0,
          originalDisabled: button.disabled,
          originalLabel: getButtonLabel(button)
        };
        imageConversionButtonStates.set(button, state);
        button.disabled = true;
        setButtonLabel(button, 'Converting…');
      }
      state.count++;
      states.push([button, state]);
    }

    let released = false;
    return () => {
      if (released) return;
      released = true;
      for (let i = 0; i < states.length; i++) {
        const [button, state] = states[i];
        if (imageConversionButtonStates.get(button) !== state) continue;
        state.count--;
        if (state.count > 0) continue;

        if (button.isConnected && getButtonLabel(button) === 'Converting…') {
          setButtonLabel(button, state.originalLabel);
          if (button.disabled) button.disabled = state.originalDisabled;
        }
        imageConversionButtonStates.delete(button);
      }
    };
  }

  async function checkImageConversion(file, context = null) {
    const isImage = file.type && file.type.startsWith('image/');
    if (!isImage) return file;

    const fileExtMatch = (file.name || '').match(/\.([a-z0-9]+)$/i);
    const ext = fileExtMatch ? fileExtMatch[1].toLowerCase() : (file.type ? file.type.split('/')[1].toLowerCase() : '');

    let bitmap = null;
    let origW = null, origH = null;
    let shouldConvert = false;

    try {
      bitmap = await createImageBitmap(file);
      origW = bitmap.width;
      origH = bitmap.height;

      if (file.size > MAX_FILE_SIZE || bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION) {
        shouldConvert = true;
      }
    } catch (e) {
      if (file.size > MAX_FILE_SIZE) shouldConvert = true;
    }

    let releasePostButtonLock = null;

    if (shouldConvert && CONVERTIBLE_EXTS.has(ext)) {
      releasePostButtonLock = lockPostButtons(context);
    }

    try {
      if (shouldConvert && CONVERTIBLE_EXTS.has(ext)) {
        const result = await convertToJpeg(file, bitmap, MAX_FILE_SIZE, 0.6);

        if (result?.file) {
          const origRes = (origW && origH) ? `${origW}×${origH}` : 'unknown';
          const convRes = (result.finalWidth && result.finalHeight) ? `${result.finalWidth}×${result.finalHeight}` : 'unknown';

          showMessageNotification(
            `Image was converted to jpg to fit upload limits. It might have lost transparency.<br><br>` +
            `Original: ${origRes} - ${(result.origSize / 1048576).toFixed(2)} MB<br>` +
            `Converted: ${convRes} - ${(result.newSize / 1048576).toFixed(2)} MB<br>` +
            `Quality ≈ ${Math.round(result.qualityUsed * 100)}%`
          );

          return result.file;
        }
      }
    } catch (e) {
      showMessageNotification('Image conversion failed; using original file.');
    } finally {
      if (releasePostButtonLock) releasePostButtonLock();

      if (bitmap && bitmap.close) bitmap.close();
    }

    return file;
  }

  async function convertToJpeg(file, bitmapOrNull = null, targetBytes = MAX_FILE_SIZE, minQuality = 0.6) {
    const bitmap = bitmapOrNull || await createImageBitmap(file);
    const shouldClose = !bitmapOrNull;

    let srcW = bitmap.width;
    let srcH = bitmap.height;
    let scale = 1;
    if (srcW > MAX_DIMENSION || srcH > MAX_DIMENSION) {
      scale = MAX_DIMENSION / Math.max(srcW, srcH);
      srcW = Math.max(1, Math.round(srcW * scale));
      srcH = Math.max(1, Math.round(srcH * scale));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let bestBlob = null;
    let bestQ = null;
    let bestW = srcW, bestH = srcH;

    const toBlob = (c, q) => new Promise(r => c.toBlob(r, 'image/jpeg', q));

    async function tryExport(width, height) {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);

      const startPercent = 95;
      const stepPercent = 5;
      const minPercent = Math.round(minQuality * 100);

      for (let p = startPercent; p >= minPercent; p -= stepPercent) {
        const q = p / 100;
        const blob = await toBlob(canvas, q);
        if (!blob) continue;

        if (!bestBlob || blob.size < bestBlob.size) {
          bestBlob = blob;
          bestQ = q;
          bestW = width;
          bestH = height;
        }

        if (blob.size <= targetBytes) {
          const newName = (file.name || 'file').replace(/\.[^.]+$/, '') + '.jpg';
          if (shouldClose && bitmap.close) bitmap.close();
          return {
            file: new File([blob], newName, { type: 'image/jpeg' }),
            origSize: file.size,
            newSize: blob.size,
            qualityUsed: q,
            succeeded: true,
            finalWidth: width,
            finalHeight: height
          };
        }
      }

      return null;
    }

    let attempt = await tryExport(srcW, srcH);
    if (attempt) return attempt;

    let currentW = srcW;
    let currentH = srcH;
    const MIN_DIM = 64;
    let passes = 0;
    while (passes < 10 && Math.max(currentW, currentH) >= MIN_DIM) {
      passes++;
      currentW = Math.max(MIN_DIM, Math.round(currentW * 0.9));
      currentH = Math.max(MIN_DIM, Math.round(currentH * 0.9));
      const res = await tryExport(currentW, currentH);
      if (res) return res;
    }

    if (shouldClose && bitmap.close) bitmap.close();

    if (bestBlob) {
      const newName = (file.name || 'file').replace(/\.[^.]+$/, '') + '.jpg';
      const newFile = new File([bestBlob], newName, { type: 'image/jpeg' });
      return {
        file: newFile,
        origSize: file.size,
        newSize: newFile.size,
        qualityUsed: bestQ,
        succeeded: newFile.size <= targetBytes,
        finalWidth: bestW,
        finalHeight: bestH
      };
    }

    throw new Error('Conversion produced no blob');
  }

  function simDragDrop(dropzoneEl, file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    try {
      const dragEvent = new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt });
      dropzoneEl.dispatchEvent(dragEvent);
      return true;
    } catch (e) {}
    try {
      const evt = document.createEvent('Event');
      evt.initEvent('drop', true, true);
      try { Object.defineProperty(evt, 'dataTransfer', { value: dt }); } catch (defineErr) { evt.dataTransfer = dt; }
      dropzoneEl.dispatchEvent(evt);
      return true;
    } catch (e) {
      return false;
    }
  }

  function setFileInputFiles(inputEl, file) {
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputEl.files = dt.files;
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } catch (e) {
      return false;
    }
  }

  function addFileToContainer(container, file) {
    if (!container) return false;
    const dropzone = container.querySelector('.dropzone') || container.querySelector('.dropzone-wrap .dropzone');
    if (dropzone && simDragDrop(dropzone, file)) return true;
    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput && setFileInputFiles(fileInput, file)) return true;
    const mbFileInput = container.querySelector('#mbFileInput');
    if (mbFileInput && setFileInputFiles(mbFileInput, file)) return true;
    return false;
  }

  function initializeImageConverter() {

    const thumbs = document.querySelector('.file-thumbs');

    document.addEventListener('paste', (e) => {
      markClipboardPaste();
      if (!thumbs || checkMobile()) return;
      const clipboard = e.clipboardData;
      if (!clipboard?.items) return;
      let hasFileItem = false;
      for (let i = 0; i < clipboard.items.length; i++) {
        if (clipboard.items[i].kind === 'file') { hasFileItem = true; break; }
      }
      if (!hasFileItem) return;
      const removeBtn = thumbs.querySelector('.remove-btn');
      if (removeBtn) removeBtn.click();
    }, true);

    document.addEventListener('change', (e) => {
      const input = e.target;
      if (input.tagName !== 'INPUT' || input.type !== 'file') return;
      if (mobileInput) return;
      if (outboxRestoringFile) return;

      const file = input.files?.[0];
      if (!file) return;

      (async () => {
        syncDraftFile();
        const conversionPostId = captureDraftId(file, input);
        const converted = await checkImageConversion(file, input);
        if (converted === file) { syncDraftFile(); return; }
        replaceConvertedFile(file, converted, conversionPostId);

        if (input.files?.[0] !== file) { syncDraftFile(); return; }

        const dt = new DataTransfer();
        dt.items.add(converted);
        input.files = dt.files;
        syncDraftFile();
      })();
    });

    if (thumbs) {
      const observer = new MutationObserver((mutations) => {
        syncDraftFile();
        for (let i = 0; i < mutations.length; i++) {
          const { addedNodes } = mutations[i];

          for (let j = 0; j < addedNodes.length; j++) {
            const node = addedNodes[j];
            if (
              node.nodeType !== 1 ||
              !node.classList.contains('tmb-container')
            ) continue;

            const file = $(node).data('file-ref');
            if (!file) continue;

            (async () => {
              if (outboxRestoringFile) return;
              const wasClipboard = isClipboardFile(file);
              const conversionPostId = captureDraftId(file, node);

              const converted = await checkImageConversion(file, node);
              if (converted === file) { syncDraftFile(); return; }
              if (outboxRestoringFile) return;
              replaceConvertedFile(file, converted, conversionPostId);

              if (!node.isConnected) {
                if (!syncConvertedFile(file, converted, conversionPostId)) {
                  syncDraftFile();
                }
                return;
              }
              const dropzone = node.closest('.dropzone, .dropzone-wrap, form');
              if (!dropzone) return;

              const removeBtn = node.querySelector('.remove-btn');
              if (removeBtn) removeBtn.click();

              if (wasClipboard) {
                clipboardFiles.add(converted);
              }

              simDragDrop(dropzone, converted);
              syncDraftFile();
            })();
          }
        }
      });

      observer.observe(thumbs, { childList: true });
    }

    if (thumbs && !checkMobile()) {
      document.addEventListener('drop', (e) => {
        if (!thumbs.querySelector('.tmb-container')) return;
        const outboxList = e.target?.closest?.('#outbox-list, #mb-outbox-list');
        if (outboxDragSession && outboxList === outboxDragSession.list) return;
        if (!e.target.closest || !e.target.closest('.dropzone')) {
          e.stopImmediatePropagation();
          e.preventDefault();
          return;
        }
        const droppedFiles = Array.from(e.dataTransfer?.files || []);
        if (!droppedFiles.some((file) => /^image\//i.test(file.type) || /^video\//i.test(file.type))) return;
        const removeBtn = thumbs.querySelector('.remove-btn');
        if (removeBtn) removeBtn.click();
      }, true);

      function handleFileSelect(dropzone) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.addEventListener('change', () => {
          if (fileInput.files.length === 0) return;
          const removeBtn = thumbs.querySelector('.remove-btn');
          if (removeBtn) removeBtn.click();
          for (let i = 0; i < fileInput.files.length; i++) {
            simDragDrop(dropzone, fileInput.files[i]);
          }
          fileInput.remove();
        });
        fileInput.click();
      }

      document.addEventListener('click', (e) => {
        if (!thumbs.querySelector('.tmb-container')) return;
        if (e.target.className !== 'file-hint') return;
        const dropzone = e.target.closest('.dropzone');
        if (!dropzone) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        handleFileSelect(dropzone);
      }, true);

      document.addEventListener('keypress', (e) => {
        if (!thumbs.querySelector('.tmb-container')) return;
        if (e.which !== 13) return;
        const dropzone = e.target.closest('.dropzone');
        if (!dropzone) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        handleFileSelect(dropzone);
      }, true);
    }

    if (checkMobile()) {
      waitForElement('#mbFileInput', (mbFileInput) => {
        mbFileInput.addEventListener('change', () => {
          const file = mbFileInput.files?.[0];
          if (!file) return;

          (async () => {
            if (outboxRestoringFile) return;
            syncDraftFile();
            const conversionPostId = captureDraftId(file, mbFileInput);
            const converted = await checkImageConversion(file, mbFileInput);
            if (converted === file) { syncDraftFile(); return; }
            replaceConvertedFile(file, converted, conversionPostId);
            if (mbFileInput.files?.[0] !== file) { syncDraftFile(); return; }

            const dt = new DataTransfer();
            dt.items.add(converted);
            mbFileInput.files = dt.files;
            const filenameInput = mbFileInput.form?.querySelector('input[name="filename"]');
            const filename = filenameInput?.value;
            mbFileInput.dispatchEvent(new Event('change', { bubbles: true }));
            if (filenameInput) {
              filenameInput.value = filename;
              filenameInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            syncDraftFile();
          })();
        });
      });
    }
  }

  function hoverQuoteReplies() {
    document.body.addEventListener('mouseenter', (e) => {
      const link = e.target.closest('a[href*="#"]');
      if (!link) return;

      const text = (link.textContent || '').trim();
      if (!text.match(/^>>\d+/)) return;

      const match = link.href.match(/#(\d+)$/);
      if (!match) return;
      const postId = match[1];

      const post = link.closest('.post.reply:not(.inline-cloned-post)');

      requestAnimationFrame(() => {
        const hover = document.getElementById(`post-hover-${postId}`);
        if (!hover) return;

        if (hover.closest(`.${INLINE_CONTAINER_CLASS}`) || hover.closest(`.${CLONED_POST_CLASS}`)) {
          if (post) post.appendChild(hover);
        }

        const originalPost = document.getElementById(`reply_${postId}`) ||
              document.getElementById(`op_${postId}`);
        if (!originalPost) return;
        const mentioned = originalPost.querySelector('.mentioned.unimportant');
        if (!mentioned) return;

        const intro = hover.querySelector('p.intro');
        if (intro && !intro.querySelector('.clone-mentioned.unimportant')) {
          const clone = mentioned.cloneNode(true);
          clone.classList.remove('mentioned');
          clone.classList.add('clone-mentioned');
          intro.appendChild(clone);
        }
      });
    }, { capture: true });
  }

  const appendedPostIds = new Set();

  function isQuoteYouSpan(node) {
    return node?.tagName === 'SPAN' && node.textContent === ' (You)';
  }

  function appendQuoteLabel(link, label) {
    if (!link || (link.textContent || '').includes(label)) return;
    const suffix = ` ${label}`;
    const inlineYouLabel = Array.from(link.children).find(isQuoteYouSpan);
    const textNode = document.createTextNode(suffix);
    if (inlineYouLabel) link.insertBefore(textNode, inlineYouLabel);
    else link.appendChild(textNode);
  }

  function appendPosts(post, body, smallTags) {
    if (!body) return;

    const postId = post.id.split('_')[1];
    appendedPostIds.add(postId);

    for (let j = 0; j < smallTags.length; j++) {
      const small = smallTags[j];
      const label = small.textContent.trim();
      if (label !== '(OP)') continue;

      let target = small.previousSibling;
      while (target && (target.nodeType !== 1 || target.tagName !== 'A')) {
        target = target.previousSibling;
      }

      if (target?.tagName !== 'A') continue;

      small.setAttribute('style', 'display: none !important;');
      appendQuoteLabel(target, label);
    }

    const links = body.querySelectorAll('a[href*="/res/"]');
    for (let j = 0; j < links.length; j++) {
      const link = links[j];
      const href = link.getAttribute('href');
      const match = href?.match(/\/res\/(\d+)\.html#(\d+)/);
      if (!match) continue;

      const linkThreadId = match[1];
      const quotedPostId = match[2];

      let following = link.nextSibling;
      while (following && following.nodeType === Node.TEXT_NODE && !following.textContent.trim()) {
        following = following.nextSibling;
      }
      const hasFollowingSmall = following &&
            following.nodeType === 1 &&
            following.tagName === 'SMALL' &&
            following.textContent.trim() !== '(You)';

      if (quotedPostId === currentThreadId && !hasFollowingSmall && !link.textContent.includes('(OP)')) {
        appendQuoteLabel(link, '(OP)');
      }

      if (linkThreadId !== currentThreadId && !hasFollowingSmall && !link.textContent.includes('→') && !link.textContent.includes('(Cross-thread)')) {
        appendQuoteLabel(link, appendCrossThread ? '(Cross-thread)' : '→');
      }
    }
  }

  function addHideButton(post) {
    if (!hidePosts || post.dataset.hideButton) return;

    post.dataset.hideButton = '1';

    const btn = document.createElement('a');
    btn.className = 'reply hide-button';
    btn.setAttribute('for', post.id);
    btn.href = 'javascript:void(0)';
    btn.innerHTML = `
      <span class="hide-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="minus" viewBox="0 0 448 512">
          <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" fill="currentColor"/>
        </svg>
      </span>
    `;
    btn.addEventListener('click', () => toggleHidePost(post, btn));
    post.insertAdjacentElement('beforebegin', btn);
  }

  function toggleHidePost(post, btn, recursive = false, originPostId = null, suppressSave = false) {
    const postId = post.id.split('_')[1];
    const isHidden = post.classList.toggle('hidden-post');

    if (!showStubs) {
      post.classList.toggle('hidden-post', isHidden);
      if (btn) btn.classList.toggle('hidden-post', isHidden);

      const br = post.nextElementSibling;
      if (br?.tagName === 'BR') br.classList.toggle('hidden-post', isHidden);
    } else {
      if (isHidden) {
        btn.className = 'reply show-button';
        btn.innerHTML = `
          <span class="show-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="plus" viewBox="0 0 448 512">
              <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" fill="currentColor"/>
            </svg>
          </span>
        `;

        const nameSpan = post.querySelector('p.intro span.name');
        const name = nameSpan ? nameSpan.textContent.trim() : 'Anonymous';

        const hideName = document.createElement('span');
        hideName.className = 'hide-name';
        hideName.textContent = name;

        const hideReason = document.createElement('span');
        hideReason.className = 'hide-reason';
        hideReason.textContent = recursive
          ? ` (Hidden recursively from ${originPostId})`
          : ' (Hidden manually)';

        btn.appendChild(hideName);
        btn.appendChild(hideReason);
      } else {
        btn.className = 'reply hide-button';
        btn.innerHTML = `
          <span class="hide-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="minus" viewBox="0 0 448 512">
              <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" fill="currentColor"/>
            </svg>
          </span>
        `;
      }
    }

    if (isHidden) {
      hiddenSet.add(postId);
    } else {
      hiddenSet.delete(postId);
    }

    if (rememberLastRead) {
      if (isHidden) {
        unreadSet.delete(postId);
        if (lastReadObserver) lastReadObserver.unobserve(post);
      } else {
        const place = Number(post.dataset.place);
        if (place > lastReadPlacement) {
          unreadSet.add(postId);
          if (lastReadObserver) lastReadObserver.observe(post);
        }
      }
    }

    if (!recursive && !suppressSave) {
      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      if (!latest.hiddenPosts) latest.hiddenPosts = {};
      if (!latest.hiddenPosts[currentBoard]) latest.hiddenPosts[currentBoard] = {};
      if (!latest.hiddenPosts[currentBoard][currentThreadId]) latest.hiddenPosts[currentBoard][currentThreadId] = [];

      const postList = latest.hiddenPosts[currentBoard][currentThreadId];
      const index = postList.indexOf(postId);

      if (isHidden) {
        if (index === -1) postList.push(postId);
      } else {
        if (index !== -1) postList.splice(index, 1);
      }

      localStorage.setItem("Thread Settings", JSON.stringify(latest));
    }

    if (!recursive) {
      toggleRecursive(postId, isHidden ? 'hide' : 'unhide');
    }

    if (
      isHidden &&
      postId === lastLine &&
      showUnreadLine &&
      !hasUnreadLine
    ) {
      removeUnreadLine();
    }

  }

  function toggleRecursive(postId, action = 'hide', visited = new Set()) {
    if (visited.has(postId)) return;
    visited.add(postId);

    const anchors = document.querySelectorAll(`.post.reply .body a[href$="#${postId}"]`);
    for (let i = 0; i < anchors.length; i++) {
      const link = anchors[i];
      const container = link.closest('.post.reply');
      if (!container) continue;

      const replyId = container.id;
      const btn = document.querySelector(`a.reply[for="${replyId}"].hide-button, a.reply[for="${replyId}"].show-button`);
      const alreadyHidden = container.classList.contains('hidden-post');

      if (recursiveHiding) {
        if (action === 'hide' && !alreadyHidden) {
          toggleHidePost(container, btn, true, postId);
          toggleRecursive(replyId.split('_')[1], 'hide', visited);
        } else if (action === 'unhide' && alreadyHidden) {
          toggleHidePost(container, btn, true, postId);
          toggleRecursive(replyId.split('_')[1], 'unhide', visited);
        }
      }

      if (action === 'hide') {
        link.style.textDecoration = 'underline line-through';
      } else {
        link.style.textDecoration = '';
      }
    }
  }

  const threadedPostIds = new Set();
  let threadButton = null;

  const iconStreamable = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOwgAADsIBFShKgAAAAFdQTFRFR3BMD5D6F5T7DpD6DpD6DpD6D5D6EZH6DY79DpD6D5D8D5D6DpD7TqD7D5D6M5v7MZr7DpD6/f7/PZ378Pj/Wqn7ebT84e7+jr/8IpX7xt7+oMb8l8L8dvSONQAAABF0Uk5TAIArtvqSzvIGiCPWHpKm1dj2KFEKAAAAkUlEQVR42k3PbRLBMBSG0ee++bpRjO5/lfxApUkNhnF2cHjZWy4l1x0fbnF+i9V5Oc4/wQGb/1S0D4AciA5NZieimtRjU1xYlUDk3Euv4SEkI7ax3MJd15XEXQAG5o0MoI2oMeW+FBmNatVJY0hbh7yw2u5xwNcxUOgDzlDnPwmxXfi5BACv31xyPpSmUqYkgCeZritCO6onSAAAAABJRU5ErkJggg==';
  const iconPixiv = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAC1QTFRFAJb6AJb6AJb6AJb6////8Pj/5PL+2Or+xeD+qtH9kcP8dLb7Q6X7Epr6AJX6FLjp4QAAAAR0Uk5T/wJx52ZYi2kAAABZSURBVHjaYxAyYAACZkUGBQYwYGIwgDCYgXjP7TVgNl9ZiksNmFHi3uoOYTTwpGwAMzYwTJkAZixgaFkAZkSfdD0AZri4eEEUT8/YAGa0HQBRcCsQlsKcAQAM1xU5J7LrcwAAAABJRU5ErkJggg==';
  const iconVocaroo = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAh1BMVEVHcEw9aRGOrVvH63RjrCAzUxGgxFUhQQNjiC09ZRJfnSMOKACSuktPdiRBYxx3mESEp0N4nD6v0WaQtFGgwlxXhyFEgQ5mqCSqwIat0GLV+X6+4WuTwkmpz1202GOasWTM8HizwGfjOVO/1XjEoGFbY0nW9JGAj1vNzc2pt4d9hmf19fXNYlSGMR5dAAAAGnRSTlMAbW3+/CGfE2ZG3wnukDBDnsPr4cS5j+Wz2uQ4lkcAAACuSURBVHjaBcEFYsMwAATBNUpmCLUnMCbF/78vMwAAppvK0gIAphquwTkXYwUASXdkkuTcCADpS5Ik+fwGwIckrV+HQl4DNJf4u2n5firzCUDvl7+n1p9FChWAqdclZG6VdDFAUzSz5KLkygJI27oZPmMI/pZUAEWf3zHj5H30vgLA5l29vbQd4ZFbAOb2bs99/3fltQWgLyi2fT/VPhIAAGZ3Kpu8BQAgLdPBMFreBWQOpOs51woAAAAASUVORK5CYII=';
  const iconTwitch = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIgAALiIBquLdkgAAAB5QTFRFR3BMZEGlZEGlZEGlZEGlZEGlZEGlZEGlZEGlZEGlVumfBAAAAAl0Uk5TABAlQFV/o8vvnShU+QAAAFRJREFUeNpjYJkJBhMY2KeFAkH4BAbOyQxAwApmKDMYQRiRDFMJMoCADcbILGDgnGosaGw6XYCBc+ZM95kzCxlAjM6ZQAEGZuPMGc6GDCAQ2cSADAD/Qx99Dm+XMQAAAABJRU5ErkJggg==';
  const iconTwitter = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIgAALiIBquLdkgAAAC1QTFRFR3BMHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHyHaHy+JamXQAAAA50Uk5TAAQQHDVMXnaIn8DS4vLdwynJAAAAYUlEQVR42o3OQQ6AMAhE0V8s2NbC/Y9rImqauPHtGIYEPmQjtYguWjHPpMfF0AgFtpxdEY84jJrBDiW7/lygsarAWOZZAFmSBqyV/IA6PJKRyt3Zc9+P96eLtOnuc1jhpxP+pwcBWPTPAQAAAABJRU5ErkJggg==';
  const iconX = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAuIgAALiIBquLdkgAAAJ9JREFUeNqFkcENhCAUROdoC5ZhLGUr2AJswAZswg6sgwaILXDn6mmWDE5icKOZAxPyCA8+MCB2xJ90RMQARPAhEV2lletp7wMEJx7KSihL6ZvhuqxMnJk5nXggHJfAXdiXubT+DoxM3Bh4MJWOOwCdnYWhBZzAbJMWsHuSSebYAnbvT5O9BT52V1uuJn6B3H2VUk381c2YFLX3Yb2N+wd00i149msMYgAAAABJRU5ErkJggg==';
  const iconHoloplus = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAKlBMVEVHcEw6jfRBnfkvv/81q/soxv81q/sxrvtGrP0nxP89nPglxf8mxf8/nPjFGi9WAAAADHRSTlMA/s1pH8pWP/2fluPxrm40AAAAeUlEQVQI12NgYGA+M50BDGzOnAkHM/ZM3nMmDEiznDFgjzkTAGKkaLnvOQliGPVe5zwNZihdAjKYm/cYsF3KOcxg0RwDYkxgiFCICQ0TdGBg6FhQcwbMWNHkMrUcxGC6e6mADcRgSLp7KUsQbFfRRUEpiPVFggsYGADMUyhH5HbGtwAAAABJRU5ErkJggg==';

  (function addStyle() {
    if (location.pathname === '/') {
      return;
    }

    const style = document.createElement('style');
    style.id = 'htsu-style';
    let css = `
      .threadingContainer {
        margin-left: 20px;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: 1px solid rgba(128, 128, 128, 0.3) !important;
      }
      .reply.hide-button {
        float: left;
        padding: 2px;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: none !important;
      }
      .reply.hide-button:not(:hover) {
        opacity: 0.4;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: none !important;
      }
      .reply.show-button {
        padding: 2px;
        text-decoration: initial;
        background: inherit !important;
        border-color: inherit !important;
        border-width: inherit !important;
        border-style: inherit !important;
        border-left: none !important;
      }
      .threadingContainer .reply.hide-button,
      .threadingContainer .reply.show-button {
        margin-left: 2px !important;
        position: relative;
        left: 1px;
      }
      .threadingContainer.post-hover {
        display: none !important;
      }
      svg.plus {
        height: 1em;
        width: 1em;
        display: inline-flex;
        vertical-align: -.150em;
        margin-right: 0.5ch;
      }
      svg.minus {
        height: 1em;
        width: 1em;
        display: inline-flex;
        vertical-align: -.500em;
      }
      .hidden-post {
        display: none !important;
      }
      .hidden-post.post-hover,
      .hidden-post.inline-cloned-post {
        display: inline-block !important;
      }
      :root.reply-fit-width .post.reply.hidden-post {
        display: none !important;
      }
      :root.reply-fit-width .post.reply.hidden-post.post-hover,
      :root.reply-fit-width .post.reply.hidden-post.inline-cloned-post {
        display: inline-block !important;
      }
      .post-hover .clone-mentioned {
        word-break: break-word;
      }
      .clone-mentioned {
        word-wrap: anywhere;
      }
      html.mobile-style-new.desktop-floating-mode #mbDesktopFloat #mbRandomizerBtn.active {
        border: 3px solid #ff511c;
        background: rgba(255,81,28,.15)
      }
      html.mobile-style-new #mobileReplyDrawer #mbRandomizerBtn {
        border: 3px solid rgba(255,255,255,.25);
        box-sizing: border-box;
        transition: background-color .15s,border-color .15s,box-shadow .15s;
        padding: .45rem .55rem
      }
      html.mobile-style-new #mobileReplyDrawer #mbRandomizerBtn.active {
        border-color: #ff511c;
        background: rgba(255,81,28,.15)
      }
      #notification_container {
        position: fixed;
        top: 25px;
        left: 0;
        right: 0;
        z-index: 9901;
        pointer-events: none;
        text-align: center;
        background: inherit;
        visibility: hidden;
      }
      .message_notification {
        margin-top: 10px;
        pointer-events: auto;
        background: inherit;
      }
      .notification_div {
        border: 1px solid black;
        display: inline-block;
        position: relative;
        background: inherit;
        visibility: visible;
      }
      .notification_close {
        top: 0px;
        right: 0px;
        position: absolute;
        margin-right: 3px;
        z-index: 100;
      }
      .alert_message {
        margin: 13px;
        font-size: 110%;
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .reply.hide-button {
        position: absolute;
        transform: translate(-6px, -10px);
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .threadingContainer .reply.hide-button,
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .threadingContainer .reply.show-button {
        transform: translate(0px, 0px);
      }
      .twt-embed,
      .twt-threadwrapper {
        margin: 6px 0;
        background: inherit;
        max-width: 550px;
      }
      .twt-header {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 6px;
        justify-self: start;
        color: inherit !important;
        text-decoration: inherit !important;
      }
      .twt-header img.twt-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        flex: 0 0 auto;
      }
      .twt-meta {
        font-size: 13px;
      }
      .twt-meta .handle {
        opacity: 0.5;
        display: block;
      }
      .twt-text {
        margin-bottom: 6px;
      }
      .twt-translate {
        font-size: 12px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
      }
      .twt-translate span {
        opacity: 0.4;
      }
      .photos-grid {
        display: grid;
        gap: 2px;
        grid-template-columns: 1fr 1fr;
      }
      .photos-grid.single {
        grid-template-columns: 1fr;
      }
      .photo-link {
        justify-self: start;
        display: inline-block;
        pointer-events: none;
      }
      .photo-img {
        display: block;
        max-width: 100%;
        max-height: 550px;
        pointer-events: auto;
      }
      .photo-img.expanded {
        max-width: 100%;
        max-height: 100%;
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .photo-img {
        max-height: 100%;
      }
      .twt-video {
        max-width: 100%;
        max-height: 100vh;
        display: block;
      }
      .twt-footer {
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.6;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
      }
      .twt-footer i.fa {
        opacity: 0.7;
        margin-top: -2px !important;
      }
      .twt-footer span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .twt-embed a {
        text-decoration: none;
        color: inherit;
      }
      .twt-threadwrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
        position: relative;
      }
      .twt-threadwrapper .twt-replychain {
        border: none !important;
        background: inherit;
        position: relative;
      }
      .twt-threadwrapper .twt-replychain > *:not(.twt-header) {
        margin-left: 45px;
      }
      .twt-replychain::before {
        content: '';
        position: absolute;
        top: 38px;
        left: 16px;
        width: 4px;
        height: calc(100% - 16px);
        background-color: currentColor;
        opacity: 0.2;
        z-index: 0;
      }
      .twt-threadwrapper > .twt-replychain:last-child::before {
        height: 0px;
      }
      .twt-poll {
        border-radius: 6px;
      }
      .twt-poll-choices {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .twt-poll-choice {
        position: relative;
      }
      .twt-poll-bar-bg {
        position: relative;
        background: rgba(0, 0, 0, 0.06);
        padding: 6px 50px 6px 8px;
        overflow: hidden;
      }
      .twt-poll-bar {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, color-mix(in srgb, currentColor 50%, transparent), color-mix(in srgb, currentColor 40%, transparent));
        border-radius: 6px 0 0 6px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 0;
      }
      .twt-poll-label {
        position: relative;
        z-index: 1;
        color: currentColor;
        cursor: default;
      }
      .twt-poll-pct {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        color: currentColor;
      }
      .twt-poll-footer {
        display: flex;
        flex-direction: row;
        margin-top: 6px;
        font-size: 12px;
        opacity: 0.6;
        gap: 8px;
      }
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .twt-embed,
      html:is(.mobile-style, .mobile-style-new):not(.desktop-floating-mode) .twt-threadwrapper,
      .twt-quote {
        max-width: 100%;
      }
      .twt-quote,
      .twt-threadwrapper,
      .holoplus-embed {
        border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        border-radius: 12px;
        padding: 6px;
      }
      .holoplus-voice-audio {
        display: block;
        width: 100%;
        height: 28px;
      }
      .holoplus-voice-audio + .holoplus-voice-audio,
      .holoplus-media {
        margin-top: 6px;
      }
      .holoplus-title {
        font-weight: 700;
        overflow-wrap: anywhere;
      }
      .holoplus-meta {
        margin-bottom: 6px;
        font-size: 11px;
      }
      .holoplus-meta-text {
        opacity: .65;
      }
      .holoplus-meta .hp-sep {
        opacity: 1 !important;
      }
      .holoplus-text {
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .holoplus-translation {
        margin-top: 6px;
        font-size: 12px;
      }
      .holoplus-translation summary {
        cursor: pointer;
        opacity: .7;
      }
      .holoplus-translation-title {
        margin: 4px 0;
        font-weight: 700;
      }
      .holoplus-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 6px;
      }
      .holoplus-chips a {
        padding: 1px 6px;
        border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
        border-radius: 4px;
        color: inherit;
        font-size: 11px;
        text-decoration: none;
      }
      .embed-active {
        font-weight: bolder;
        text-decoration: underline dotted;
      }
      div.post i.fa-youtube-play,
      div.post i.fa-streamable,
      div.post i.fa-pixiv,
      div.post i.fa-twt,
      div.post i.fa-x,
      div.post i.fa-holoplus,
      div.post i.fa-vocaroo,
      div.post i.fa-twitchtv,
      div.post i.fa-image,
      div.post i.fa-music,
      div.post i.fa-film {
        position: relative;
        display: inline;
        top: 2px !important;
        margin-right: 4px;
      }
      div.post i.fa-youtube-play {
        color: #ff0033;
      }
      .fa-streamable::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconStreamable}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-pixiv::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconPixiv}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-vocaroo::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconVocaroo}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-twitchtv::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconTwitch}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-twt::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconTwitter}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-x::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconX}') center left no-repeat !important;
        padding-left: 16px;
      }
      .fa-holoplus::before {
        content: "";
        background: transparent url('data:image/png;base64,${iconHoloplus}') center left no-repeat !important;
        padding-left: 16px;
      }
      div.post i.fa-music {
        margin-right: 6px;
      }
      div.post i.fa-film {
        top: 1px !important;
      }
      span.spoiler:hover span.embed-button,
      span.spoiler span.embed-button {
        color: inherit !important;
      }
      div.boardlist:nth-child(1) {
        transition: all .1s .05s ease-in-out;
      }
      .boardlist:nth-child(1) #watch-pinned {
        display: none !important;
      }
      div.boardlist.fixed {
        position: fixed !important;
        margin-top: 0;
        box-shadow: -5px 1px 10px rgba(0, 0, 0, 0.20) !important;
        border-bottom: 1px solid color-mix(in srgb, currentColor 20%, transparent) !important;
        padding: 4px;
        font-size: 13px;
      }
      div.boardlist.fixed.autohide:not(:hover) {
        box-shadow: none !important;
        transition: all .8s .6s cubic-bezier(.55, .055, .675, .19);
        margin-bottom: -1em;
        transform: translateY(-100%);
      }
      .boardlist #autohide-marker {
        left: 0;
        right: 0;
        height: 10px;
        position: absolute;
      }
      .boardlist.fixed #autohide-marker {
        top: 100%;
      }
      .boardlist:not(.autohide) #autohide-marker {
        pointer-events: none;
      }
      .boardlist.fixed ~ a.quick-reply-btn {
        top: var(--header-height, 24px);
      }
      .desktop-floating-mode div.boardlist:nth-child(1),
      html:not(.desktop-style) div.boardlist:nth-child(1) {
        margin-top: 0;
      }
      :where(.desktop-floating-mode) :where(.boardlist:nth-child(1)),
      :where(html:not(.desktop-style) .boardlist:nth-child(1)),
      :where(.boardlist.fixed) {
        position: static;
        top: 0;
        left: 0;
        right: 0;
        z-index: 30;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
        border-bottom: 1px solid;
        background: inherit;
      }
      .hb-menu {
        position: absolute;
        display: none;
        background: inherit;
        border: 1px solid rgba(0,0,0,.2);
        padding: 6px;
        z-index: 9999;
        right: 4px;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        font-size: 9pt;
      }
      .hb-thread-stats,
      .hb-update-secs,
      .hb-new-count,
      .hb-status-message {
        float: right;
        margin-right: 6px;
        opacity: 0.85;
        white-space: nowrap;
      }
      .hb-new-count {
        color: limegreen;
        opacity: 1;
        transition: opacity 0.2s ease;
      }
      .hb-new-count.fade-out {
        opacity: 0;
      }
      .hb-warning {
        color: red;
      }
      @layer side-reset;
      @layer side-reset {
        .side-panel.side-extra,
        .side-panel.side-extra * {
          margin: 0;
          padding: 0;
        }
      }
      .side-panel.side-extra,
      .side-panel.side-extra * {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        color: #333333;
        box-sizing: border-box;
      }
      .side-panel.side-extra {
        width: 242px;
        background-color: #ffea93;
        border: 1px solid #cc9933;
        margin-bottom: 10px;
        padding: 6px 5px;
      }
      .side-heading {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-bottom: 4px;
      }
      .side-heading span {
        font-weight: bold;
        cursor: default;
      }
      .side-section-body {
        font-size: 11px;
        line-height: 1.4;
      }
      .music-art {
        display: block;
        margin: 0 auto 4px auto;
        height: 80px;
        width: auto;
      }
      .music-player {
        border: 1px solid #cc9933;
        background-color: #fffdf0;
        padding: 4px;
      }
      .music-display {
        background-color: #fff6c0;
        border: 1px solid #ffdd88;
        padding: 3px 4px;
        margin-bottom: 4px;
      }
      .music-label {
        font-size: 10px;
        text-transform: uppercase;
        color: #666666;
      }
      .music-title {
        font-size: 11px;
        font-weight: bold;
      }
      .music-seek-row {
        margin: 3px 0 5px 0;
      }
      .music-seek {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        height: 10px;
        background-color: #ffecb3;
        border: 1px solid #cc9933;
        padding: 0;
      }
      .music-seek::-webkit-slider-runnable-track {
        height: 8px;
        background-color: #fff6c0;
      }
      .music-seek::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 10px;
        height: 14px;
        background-color: #ffcc66;
        border: 1px solid #996600;
        margin-top: -3px;
      }
      .music-seek::-moz-range-track {
        height: 8px;
        background-color: #fff6c0;
      }
      .music-seek::-moz-range-thumb {
        width: 10px;
        height: 14px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      .music-seek::-ms-track {
        height: 8px;
        background-color: transparent;
        border-color: transparent;
        color: transparent;
      }
      .music-seek::-ms-fill-lower,
      .music-seek::-ms-fill-upper,
      .music-volume::-ms-fill-lower,
      .music-volume::-ms-fill-upper {
        background-color: #fff6c0;
      }
      .music-seek::-ms-thumb {
        width: 10px;
        height: 14px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      .music-controls {
        text-align: center;
        margin-bottom: 4px;
      }
      .music-button,
      .tt-reset {
        font-size: 10px;
        padding: 1px 6px;
        margin-right: 2px;
        border: 1px solid #996600;
        background-color: #ffdd77;
        cursor: pointer;
      }
      .music-button:hover,
      .tt-reset:hover {
        background-color: #ffeeaa;
      }
      .music-playlist {
        list-style: square inside;
        font-size: 10px;
        max-height: 80px;
        overflow-y: auto;
      }
      .music-playlist li {
        cursor: pointer;
      }
      .music-playlist li.active {
        background-color: #fff0aa;
        font-weight: bold;
      }
      .tt-menu-btn,
      .tt-close-btn {
        font-family: FontAwesome !important;
        cursor: pointer;
      }
      .tt-volume-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .music-volume {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        height: 8px;
        background-color: #ffecb3;
        border: 1px solid #cc9933;
      }
      .music-volume::-webkit-slider-runnable-track {
        height: 6px;
        background-color: #fff6c0;
      }
      .music-volume::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 10px;
        height: 12px;
        background-color: #ffcc66;
        border: 1px solid #996600;
        margin-top: -3px;
      }
      .music-volume::-moz-range-track {
        height: 6px;
        background-color: #fff6c0;
      }
      .music-volume::-moz-range-thumb {
        width: 10px;
        height: 12px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      .music-volume::-ms-track {
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      .music-volume::-ms-thumb {
        width: 10px;
        height: 12px;
        background-color: #ffcc66;
        border: 1px solid #996600;
      }
      div.post.reply.hidden,
      .ts-oekaki-panel[hidden],
      .outbox-comment:empty,
      body.outbox-locked .outbox-item.outbox-selected .outbox-remove {
        display: none;
      }
      .post-menu .post-item:hover,
      .post-menu .post-submenu:hover {
        background-color: color-mix(in srgb, currentColor 20%, transparent);
      }
      #you-scroll-rail {
        position: fixed;
        top: 0;
        right: 0;
        width: 10px;
        height: 100vh;
        pointer-events: none;
      }
      #you-scroll-rail .you-marker {
        position: fixed;
        right: -5px;
        border: none;
        padding: 0;
        border-radius: 3px;
        width: 10px;
        min-height: 5px;
        top: calc(var(--top) * 1vh);
        height: calc(var(--height) * 1vh);
        pointer-events: auto;
        transition: width .08s ease-in-out, opacity .08s ease-in-out;
      }
      #you-scroll-rail .you-hover-marker {
        position: absolute;
        right: 0;
        width: 20px;
        height: 100%;
        cursor: default;
      }
      #you-scroll-rail .you-marker:hover {
        width: 15px;
      }
      .own-rail-marker {
        opacity: 0.5;
      }
      #you-scroll-rail.hide-own .own-rail-marker,
      #you-scroll-rail.hide-you .you-marker:not(.own-rail-marker) {
        width: 0;
        opacity: 0;
        pointer-events: none;
      }
      a.archive-quote::after {
        content: " (Dead)";
      }
      a.archive-quote.archive-live::after {
        content: " (Archive)";
      }
      a.archive-deleted::after {
        content: " (Deleted)";
      }
      .inline-quote-container {
        display: table;
        border: 1px dashed var(--subtle-border-color,#888);
        background-color: var(--inline-background-color,rgba(128,128,128,.05));
        padding: 5px;
        margin-top: 5px;
        border-radius: 4px;
        max-width: 100%;
      }
      .inline-quote-container > .inline-cloned-post[data-board] {
        display: block !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        width: 100% !important;
      }
      .inline-quote-container > .inline-cloned-post[data-board] .intro a.post_no {
        color: var(--ts-post-no-color, inherit) !important;
      }
      .inline-quote-container > .inline-cloned-post[data-board] .clone-mentioned a {
        color: var(--ts-link-color, revert-rule) !important;
      }
      .inline-quote-container > .inline-cloned-post[data-board] p.fileinfo a {
        color: var(--ts-fileinfo-color, revert-rule) !important;
      }
      .yotsuba-b, .greendark, .v8ch { --ts-hover-color: #ff0000; }
      .yotsuba, .futaba, .futaba-vichan, .futaba-light { --ts-hover-color: #d00; --ts-post-no-hover-color: #ff0000; }
      .nose { --ts-hover-color: #ff6fad; }
      .dope { --ts-hover-color: #E89005; }
      .dagger { --ts-hover-color: #d4a520; }
      .dawn { --ts-hover-color: #6053CD; }
      .dawn #alert_handler,
      .dawn #notification_container,
      .dawn .hb-menu {
        background: linear-gradient(135deg, #F1E6DB 50%, #FFBE78);
      }
      .dusk { --ts-hover-color: #6053CD; }
      .dusk #alert_handler,
      .dusk #notification_container,
      .dusk .hb-menu {
        background: linear-gradient(135deg, #32324A, #0A0A22 50%);
      }
      .tomorrow { --ts-hover-color: #5f89ac; --ts-mentioned-hover-color: #81a2be; }
      .dark { --ts-hover-color: #fff; --ts-post-no-hover-color: #32DD72; }
      .burichan, .miku, .notsuba { --ts-hover-color: #DD0000; --ts-post-no-hover-color: #ff0000; }
      .caffe { --ts-hover-color: #a47a6b; --ts-post-no-hover-color: #ff0000; }
      .confraria { --ts-hover-color: rgb(95, 137, 172); --ts-post-no-hover-color: #ff0000; }
      .dark-roach { --ts-hover-color: #996699; }
      .favela { --ts-hover-color: #FF7800; --ts-post-no-hover-color: #ff0000; }
      .ferus { --ts-hover-color: #003C00; --ts-post-no-hover-color: #ff0000; }
      .gentoochan { --ts-hover-color: inherit; --ts-post-no-hover-color: #ff0000; }
      .jungle { --ts-hover-color: red; --ts-post-no-hover-color: #ff0000; }
      .nigrachan { --ts-hover-color: #A0A0A0; --ts-post-no-hover-color: #ff0000; }
      .northboard-cb { --ts-hover-color: #82c2fe; }
      .novo-jungle { --ts-hover-color: #00990B; --ts-post-no-hover-color: #ff0000; }
      .photon { --ts-hover-color: #0066FF; --ts-post-no-hover-color: #ff0000; }
      .piwnichan { --ts-hover-color: #5A8C99; --ts-post-no-hover-color: #ff0000; }
      .ricechan { --ts-hover-color: #8E748F; }
      .roach { --ts-hover-color: #000; }
      .sharp { --ts-hover-color: #F00; }
      .sis, .stripes { --ts-hover-color: #FF6666; --ts-post-no-hover-color: #ff0000; }
      .szalet { --ts-hover-color: #8A8A23; }
      .terminal2 { --ts-hover-color: #00FF00; --ts-post-no-hover-color: #ff0000; }
      .testorange { --ts-hover-color: #ffff00; --ts-post-no-hover-color: #ff0000; }
      .wasabi { --ts-hover-color: limegreen; --ts-post-no-hover-color: #ff0000; }
      .inline-quote-container > .inline-cloned-post[data-board] .intro a.post_no:hover {
        color: var(--ts-post-no-hover-color, var(--ts-hover-color, inherit)) !important;
      }
      .inline-quote-container > .inline-cloned-post[data-board] .clone-mentioned a:hover {
        color: var(--ts-mentioned-hover-color, var(--ts-hover-color, inherit)) !important;
      }
      .inline-quote-container > .inline-cloned-post[data-board] p.fileinfo a:hover {
        color: var(--ts-hover-color, inherit) !important;
      }
      section.post {
        display: inline-block;
        background: inherit;
        border-color: inherit;
        border-width: inherit;
        border-style: inherit;
      }
      section.post.reply {
        background: var(--reply-background-color, #d6daf0);
        border: 1px solid var(--subtle-border-color, #b7c5d9);
        border-left: none;
        border-top: none;
      }
      a.inline-active,
      .inline-quote-container > .inline-cloned-post[data-board] a.inline-active {
        font-weight: bold !important;
        color: var(--link-hover-color,#d11a1a) !important;
        opacity: .85;
        text-decoration: underline dotted !important;
      }
      a.inline-active:hover {
        opacity: 1;
      }
      a[data-inline-loading="true"]::after {
        content: " (loading.)";
        font-style: italic;
        color: var(--text-color-muted,#888);
        margin-left: 4px;
      }
      a[data-inline-error="true"]::after {
        content: " (not found)";
        font-style: italic;
        color: var(--error-text-color,#f00);
        margin-left: 4px;
      }
      .inline-temp-highlight {
        transition: outline .1s ease-in-out;
        outline: 2px solid var(--highlight-color,yellow) !important;
        outline-offset: 2px;
      }
      .iq-hidden-post {
        display: none !important;
      }
      a.hash-link {
        text-decoration: none;
      }
      a.hash-link::before {
        content: ' ';
        visibility: hidden;
      }
      .intro a.hash-link {
        margin-left: 0px;
      }
      .ts-oekaki-panel {
        position: fixed;
        top: 10%;
        left: 10%;
        z-index: 1300;
        padding: 4px;
        background-color: var(--ts-post-bg-color, #ffea93);
        background-image: var(--ts-post-bg-image, none);
        color: var(--ts-post-text-color, #333333);
        border: var(--ts-post-border-color, 1px solid #cc9933);
        border-radius: 2px;
      }
      .ts-oekaki-panel-header {
        position: relative;
        z-index: 101;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 4px;
        padding: 1px 2px;
        cursor: move;
      }
      .ts-oekaki-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 15px;
        line-height: 1;
        padding: 2px 4px;
      }
      .ts-oekaki-controls {
        position: relative;
        z-index: 101;
        margin-top: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 6px;
      }
      .ts-oekaki-zoom {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-right: auto;
      }
      .ts-oekaki-zoom i {
        cursor: pointer;
        font-size: 14px;
        padding: 2px;
      }
      .ts-oekaki-zoom-range {
        width: 110px;
        vertical-align: middle;
      }
      .ts-oekaki-placeholder {
        padding: 20px;
        text-align: center;
        opacity: 0.7;
      }
      .ts-oekaki-ctr {
        box-sizing: content-box;
        padding: 48px 24px 0;
      }
      .ts-oekaki-ctr .ui-resizable-se {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 12px;
        height: 12px;
        cursor: se-resize;
        background: rgba(128, 128, 128, 0.35);
      }
      #outbox-button,
      .ts-oekaki-toggle {
        float: right;
        margin: 0 2px;
        color: inherit;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      #outbox-button:hover,
      .ts-oekaki-toggle:hover {
        opacity: 1;
      }
      #outbox-row td {
        border-bottom: none;
        padding: 2px 0 0;
      }
      #outbox-container,
      #mb-outbox-container {
        display: none;
        position: relative;
        overflow-y: hidden;
        margin-top: 1px;
      }
      body.outbox-has-posts #outbox-container,
      body.outbox-has-posts #mb-outbox-container {
        display: block;
      }
      #outbox-list,
      #mb-outbox-list {
        overflow: auto;
        white-space: nowrap;
        width: 100%;
        max-height: 280px;
        min-height: 90px;
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        counter-reset: outbox-thumbnails;
      }
      .outbox-item {
        box-sizing: border-box;
        counter-increment: outbox-thumbnails;
        cursor: move;
        display: inline-block;
        height: 90px;
        width: 90px;
        padding: 2px;
        opacity: 0.5;
        position: relative;
        text-shadow: 0 0 2px #000;
        transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
        vertical-align: top;
        background-size: cover;
        background-position: center;
        background-origin: border-box;
        background-color: rgba(0, 0, 0, 0.15);
        border: 2px solid transparent;
        flex: none;
      }
      .outbox-item:hover,
      .outbox-item:focus {
        opacity: 0.9;
      }
      .outbox-item.outbox-selected {
        opacity: 1;
        border-color: var(--ts-hover-color, inherit);
      }
      .outbox-drag-active .outbox-item {
        transform: scale(0.9);
      }
      .outbox-item.outbox-drag {
        opacity: 0.5;
        transform: scale(0.8);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      }
      .outbox-item.outbox-over {
        border-color: #fff;
        transform: scale(1);
        opacity: 0.9;
        z-index: 10;
      }
      body.outbox-locked .outbox-item.outbox-selected,
      body.outbox-locked #outbox-button,
      body.outbox-locked #mbDFOutboxBtn {
        pointer-events: none;
        opacity: 0.55;
      }
      .outbox-item .outbox-remove {
        cursor: pointer;
      }
      .outbox-item::before {
        content: counter(outbox-thumbnails);
        color: #fff;
        position: absolute;
        top: 3px;
        right: 3px;
        text-shadow: 0 0 3px #000, 0 0 8px #000;
        font-size: 12px;
        font-weight: bold;
        z-index: 1;
      }
      .outbox-comment {
        color: #fff;
        position: absolute;
        bottom: -2px;
        left: -2px;
        right: -2px;
        padding: 2px 4px;
        background: rgba(0, 0, 0, 0.7);
        font-size: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      }
      .outbox-item.outbox-selected .outbox-comment {
        bottom: 0;
        left: 0;
        right: 0;
      }
      .outbox-remove {
        background: none;
        color: #fff;
        position: absolute;
        top: 0px;
        left: 2px;
        z-index: 2;
        display: none;
        text-shadow: 0 0 3px #000, 0 0 8px #000;
        cursor: pointer;
        border: none;
        font-size: 13px;
      }
      .outbox-item:hover .outbox-remove {
        display: block;
      }
      .outbox-item.outbox-spoiler::after {
        content: '';
        position: absolute;
        inset: 0;
        background: url('/static/spoiler-vt2.png') center/cover no-repeat;
        opacity: 0.3;
        pointer-events: none;
      }
      #mb-outbox-list {
        max-height: 180px;
      }
    `;

    if (showSpoilerText) {
      css += `
        span.spoiler {
          color: white !important;
        }
      `;
    } else {
      css += `
        span.spoiler i.fa,
        span.spoiler img {
          visibility: hidden;
        }
        span.spoiler:hover i.fa,
        span.spoiler:hover img {
          visibility: visible;
        }
      `;
    }

    if (highlightPosts) {
      css += `
        div.post.you:has(span.own_post),
        .inline-quote-container > .inline-cloned-post.you:has(span.own_post) {
          border-left: 5px var(--you-border-style, dashed) #00b8e6 !important;
        }
        div.post.quoting-you,
        .inline-quote-container > .inline-cloned-post.quoting-you {
          border-left: 5px var(--you-border-style, dashed) #ff3d3d !important;
        }
      `;
    }

    if (resizeMedia) {
      css += `
        .ts-resize-media-youtube {
          position: relative !important;
          display: block !important;
          width: fit-content !important;
          vertical-align: top;
          overflow: visible !important;
          margin-top: 10px !important;
        }
        .ts-resize-media-youtube > iframe.embed {
          display: block !important;
          margin: 0 !important;
        }
        body :is(div, span):has(> video[controls]) {
          position: relative !important;
          inset: auto !important;
          width: fit-content;
          overflow: visible !important;
        }
        body :is(div, span) > video[controls] {
          width: auto !important;
          height: auto !important;
          vertical-align: bottom;
        }
        .ts-resize-media-youtube::after,
        body :is(div, span):has(> video[controls])::after {
          content: '';
          position: absolute !important;
          right: -16px !important;
          bottom: -16px !important;
          width: 20px !important;
          height: 20px !important;
          box-sizing: border-box !important;
          padding: 0 !important;
          margin: 0 !important;
          border: 0 !important;
          background: transparent !important;
          pointer-events: auto !important;
          touch-action: none !important;
          cursor: se-resize !important;
          z-index: 2 !important;
        }
      `;
    }

    checkDate();
    if (isChristmas) {
      if (persistentEffect) {
        snowEffect();
      }
      css += `
        .twt-embed a:has(> .twt-avatar)::before {
          content: "";
          position: absolute;
          transform: translate(-16%, 9%);
          width: 54px;
          height: 64px;
          pointer-events: none;
          background: url("https://files.fatbox.moe/4nt2ne.png") no-repeat center/contain;
        }
        .twt-text {
          content: "";
          position: relative;
        }
      `;
      if (persistentDecor) {
        css += `
          .file a:has(> .post-image) {
            position: relative;
          }
          .file a:has(> .post-image)::before {
            content: "";
            position: absolute;
            width: 138px;
            height: var(--decor-height);
            margin-top: -5px;
            margin-left: -138px;
            background: url("https://files.fatbox.moe/4nt2ne.png") no-repeat center/contain;
            pointer-events: none;
            z-index: 2;
          }
        `;
      }
    }

    style.textContent = css;
    document.head.appendChild(style);

    const tsColorsStyle = document.createElement('style');
    tsColorsStyle.id = 'ts-colors';
    document.head.appendChild(tsColorsStyle);
  })();

  function applyDecorHeight(context, img) {
    const image = img || context.querySelector('.file a > .post-image');
    if (!image) return;

    const link = image.parentElement;
    const h = image.getBoundingClientRect().height - 10;
    if (h <= 0) return;

    const newHeight = Math.round(h * 1.3);
    link.style.setProperty('--decor-height', `${newHeight}px`);
  }

  function findOverallParentPost(container) {
    let topContainer = container;
    while (topContainer.parentElement?.classList?.contains('threadingContainer')) {
      topContainer = topContainer.parentElement;
    }

    let node = topContainer.previousSibling;
    while (node) {
      if (node.nodeType === 1 && node.tagName === 'BR') {
        let prev = node.previousSibling;
        while (prev) {
          if (
            prev.nodeType === 1 &&
            prev.tagName === 'DIV' &&
            prev.classList.contains('post') &&
            prev.classList.contains('reply')
          ) {
            return prev;
          }
          prev = prev.previousSibling;
        }
      }
      node = node.previousSibling;
    }

    return null;
  }

  const newThreadPosts = new Set();

  function getThreadTargetContainer(post) {
    const body = post.querySelector('.body');
    if (!body) return null;

    const postId = post.id.split('_')[1];
    threadedPostIds.add(postId);

    const links = body.querySelectorAll('a[href*="/res/"]');
    const parentPosts = new Map();
    const containerByPostId = new Map();

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const href = link.getAttribute('href');
      const match = href?.match(/\/res\/(\d+)\.html#(\d+)/);
      if (!match) continue;

      const threadId = match[1];
      const targetPostId = match[2];
      if (threadId !== currentThreadId) continue;

      const targetPost = document.getElementById(`reply_${targetPostId}`);
      if (!targetPost) continue;

      let sibling = targetPost.nextSibling;
      while (sibling && !(sibling.nodeType === 1 && sibling.tagName === 'BR')) {
        sibling = sibling.nextSibling;
      }
      if (!sibling) continue;

      let container = sibling.nextSibling;
      if (!(container instanceof HTMLElement) || !container.classList.contains('threadingContainer')) {
        container = document.createElement('div');
        container.className = 'reply threadingContainer';

        const threadWrapper = targetPost.closest('.thread');
        if (threadWrapper) {
          const threadId = threadWrapper.getAttribute('id');
          const board = threadWrapper.getAttribute('data-board');

          if (threadId) container.id = threadId;
          if (board) container.setAttribute('data-board', board);
        }

        sibling.parentNode.insertBefore(container, sibling.nextSibling);
      }

      const parentPost = findOverallParentPost(container);
      if (parentPost) {
        parentPosts.set(targetPostId, parentPost);
        containerByPostId.set(targetPostId, container);
      }
    }

    if (parentPosts.size === 0) return null;

    const uniqueParents = new Set();
    const parentValues = Array.from(parentPosts.values());
    for (let i = 0; i < parentValues.length; i++) {
      uniqueParents.add(parentValues[i]);
    }
    if (uniqueParents.size > 1) return null;

    let highestId = 0;
    const keys = Array.from(containerByPostId.keys());
    for (let i = 0; i < keys.length; i++) {
      const num = parseInt(keys[i], 10);
      if (num > highestId) highestId = num;
    }

    return containerByPostId.get(String(highestId));
  }

  function threadPosts(post) {
    const container = getThreadTargetContainer(post);
    if (!container) return;

    const postId = post.id.split('_')[1];
    const wasLastPost = postId === currentLastPostId;

    const prev = post.previousElementSibling;
    const isHideButton = prev && (prev.classList.contains('hide-button') || prev.classList.contains('show-button'));

    let next = post.nextSibling;

    while (next?.classList?.contains('dummy')) {
      next = next.nextSibling;
    }

    const hasBr = next && next.nodeType === 1 && next.tagName === 'BR';

    if (isHideButton) container.appendChild(prev);
    container.appendChild(post);
    if (hasBr) container.appendChild(next);

    if (wasLastPost && showUnreadLine) {
      removeUnreadLine();
    }
  }

  function checkThreadable(post) {
    const container = getThreadTargetContainer(post);
    if (!container) return;
    showThreadButton();
  }

  function showThreadButton() {
    if (threadButton) return;

    const container = document.querySelector('#thread-links');
    if (!container) return;

    threadButton = document.createElement('a');
    threadButton.href = 'javascript:void(0)';
    threadButton.className = 'threading-new';
    threadButton.textContent = '[Thread New Posts]';

    threadButton.onclick = () => {
      const ids = Array.from(newThreadPosts);
      ids.sort((a, b) => Number(a) - Number(b));

      let maxThreaded = lastThreadedId;
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const post = document.getElementById(`reply_${id}`);
        if (!post) continue;

        threadPosts(post);

        const num = Number(id);
        if (num > maxThreaded) maxThreaded = num;
      }

      lastThreadedId = maxThreaded;
      newThreadPosts.clear();
      recomputePlacements();

      threadButton.remove();
      threadButton = null;
      scheduleRailRebuild();
    };

    container.appendChild(threadButton);
  }

  function initializeThreadingToggle() {
    if (!optionThreading) return;

    waitForElement("#watch-thread", (expandImages) => {

      const createToggle = (container, floatDir) => {
        const label = document.createElement('label');
        label.style.cssText = `float: ${floatDir};`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.verticalAlign = 'middle';
        checkbox.checked = enableThreading;

        const linkText = document.createElement('a');
        linkText.href = 'javascript:void(0)';
        linkText.className = 'threading-toggle';
        linkText.textContent = '[Threading]';

        linkText.onclick = () => {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        };

        label.appendChild(checkbox);
        label.appendChild(linkText);
        container.appendChild(label);
        return checkbox;
      };

      const bottomContainer = document.querySelector('#thread-interactions');
      if (!bottomContainer) return;

      const topWrapper = document.createElement('div');

      expandImages.parentNode.insertBefore(topWrapper, expandImages);

      const bottomCheckbox = createToggle(bottomContainer, 'right');
      const topCheckbox = createToggle(topWrapper, 'left');

      const onToggle = (checked) => {
        const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
        toggleThread = checked;
        latest.enableThreading = checked;
        localStorage.setItem('Thread Settings', JSON.stringify(latest));
        bottomCheckbox.checked = checked;
        topCheckbox.checked = checked;

        const posts = document.querySelectorAll('div.post.reply');
        if (checked) {
          for (let i = 0; i < posts.length; i++) {
            threadPosts(posts[i]);
          }
          scheduleRailRebuild();
        } else {
          unthreadPosts(posts);
          scheduleRailRebuild();
        }
        recomputePlacements();
      };

      bottomCheckbox.addEventListener('change', () => onToggle(bottomCheckbox.checked));
      topCheckbox.addEventListener('change', () => onToggle(topCheckbox.checked));
    });
  }

  function unthreadPosts(posts) {
    const threadEl = document.getElementById('thread_' + currentThreadId);
    if (!threadEl) return;

    const opPost = threadEl.querySelector('.post.op');
    if (!opPost) return;

    const sortedPosts = Array.from(posts)
    .filter(post => {
      const postThread = post.closest('.thread');
      return postThread && postThread.id === 'thread_' + currentThreadId;
    })
    .map(post => ({
      id: parseInt(post.id.split('_')[1], 10),
      element: document.getElementById(post.id)
    }))
    .filter(p => p.element)
    .sort((a, b) => a.id - b.id);

    let insertAfter = opPost;

    for (let i = 0; i < sortedPosts.length; i++) {
      const postEl = sortedPosts[i].element;

      let br = postEl.nextSibling;

      while (br?.classList?.contains('dummy')) {
        br = br.nextSibling;
      }

      br = (br && br.tagName === 'BR') ? br : null;
      const hideBtn = postEl.previousElementSibling;
      const isHideButton = hideBtn && (hideBtn.classList.contains('hide-button') || hideBtn.classList.contains('show-button'));

      if (isHideButton) {
        threadEl.insertBefore(hideBtn, insertAfter.nextSibling);
        insertAfter = hideBtn;
      }

      threadEl.insertBefore(postEl, insertAfter.nextSibling);
      insertAfter = postEl;

      if (br) {
        threadEl.insertBefore(br, insertAfter.nextSibling);
        insertAfter = br;
      }
    }

    if (threadButton) {
      threadButton.remove();
      threadButton = null;
    }

    const containers = document.querySelectorAll('.threadingContainer');
    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      if (!container.querySelector('.post')) {
        container.remove();
      }
    }
    if (showUnreadLine) {
      removeUnreadLine();
    }
  }

  const CATBOX_HOSTS = ['files.catbox.moe', 'litter.catbox.moe'];
  const CATBOX_REROUTE_MAP = { pixstash: 'pixstash.moe', fatbox: 'fatbox.moe' };

  function rerouteCatboxUrl(url) {
    if (!rerouteCatbox) return url;
    try {
      const u = new URL(url);
      if (CATBOX_HOSTS.includes(u.hostname)) {
        const suffix = CATBOX_REROUTE_MAP[catboxProxy];
        if (suffix) {
          u.hostname = u.hostname.replace('catbox.moe', suffix);
          return u.href;
        }
      }
    } catch {}
    return url;
  }

  function getYouTubeThumbnail(url) {
    const id = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    );
    return id ? `https://img.youtube.com/vi/${id[1]}/0.jpg` : null;
  }

  function getStreamableThumbnail(url) {
    const id = url.match(/streamable\.com(?:\/e)?\/([a-zA-Z0-9]+)/);
    return id ? `https://thumbs-east.streamable.com/image/${id[1]}.jpg?width=480` : null;
  }

  function waitForDimensions(media, callback) {
    if (media.videoWidth || media.naturalWidth) {
      callback();
      return;
    }
    const check = () => {
      if (media.videoWidth || media.naturalWidth) {
        callback();
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  }

  function handleLinkHover(e, allowImages = true) {
    const link = e.currentTarget;
    const href = rerouteCatboxUrl(link.href);
    let src = null;
    let isVideo = false;
    link.isHovering = true;

    if ($(link).data('expanded')) return;

    if (allowImages && /\.(jpg|jpeg|png|gif|webp|jfif|bmp|avif|jxl)$/i.test(href)) {
      src = href;
    } else if (videoHover && /\.(mp4|webm)$/i.test(href)) {
      src = href;
      isVideo = true;
    } else if (/youtu(?:\.be|be\.com)/.test(href)) {
      const playlistMatch = href.match(/youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/);
      if (playlistMatch) {
        if (link.dataset.videoId) {
          src = `https://img.youtube.com/vi/${link.dataset.videoId}/0.jpg`;
        } else {
          const apiUrl = `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/playlist%3Flist%3D${playlistMatch[1]}&format=json`;
          fetch(apiUrl)
            .then(r => r.json())
            .then(data => {
            if (!link.isHovering) return;

            if (data.thumbnail_url) {
              const vidMatch = data.thumbnail_url.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
              if (vidMatch) {
                link.dataset.videoId = vidMatch[1];
                const thumb = `https://img.youtube.com/vi/${vidMatch[1]}/0.jpg`;
                if (link.isHovering) {
                  handleLinkHover({ currentTarget: link }, allowImages);
                }
              }
            }
          })
            .catch(() => {});
          return;
        }
      } else {
        src = getYouTubeThumbnail(href);
      }
    } else if (/streamable\.com/.test(href)) {
      src = getStreamableThumbnail(href);
    } else if (/^https?:\/\/pbs\.twimg\.com\/media\//.test(href)) {
      src = href;
    }

    if (!src) return;

    let media;
    if (isVideo) {
      media = document.createElement('video');
      media.src = src;
      media.loop = true;
      media.autoplay = true;
      media.id = 'chx_hoverVideo';
      media.style.maxWidth = '100vw';
      media.style.maxHeight = '100vh';
      media.style.position = 'absolute';
      media.style.zIndex = '101';
      media.style.pointerEvents = 'none';

      const savedTime = parseFloat(link.dataset.hoverTime);
      if (!isNaN(savedTime) && savedTime > 0) {
        media.addEventListener('loadedmetadata', () => {
          media.currentTime = savedTime;
        }, { once: true });
      }

      const savedVolume = parseFloat(localStorage.getItem('videovolume'));
      media.volume = !isNaN(savedVolume) ? Math.min(Math.max(savedVolume, 0), 1) : 0.5;

      media.addEventListener('volumechange', () => {
        localStorage.setItem('videovolume', media.volume);
      });
    } else {
      media = document.createElement('img');
      media.src = src;
      media.id = 'chx_hoverImage';
      media.style.position = 'absolute';
      media.style.zIndex = '101';
      media.style.pointerEvents = 'none';
      media.style.maxWidth = '100vw';
      media.style.maxHeight = '100vh';
    }

    document.body.appendChild(media);

    const updatePos = (ev) => {
      const marginBottom = 15;
      const cursorOffsetX = 20;
      const cursorOffsetY = 20;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const w = media.videoWidth || media.naturalWidth;
      const h = media.videoHeight || media.naturalHeight;
      const scale = Math.min(1, (vw - 30) / w, (vh - marginBottom) / h);
      const displayWidth = w * scale;
      const displayHeight = h * scale;

      media.style.width = displayWidth + 'px';
      media.style.height = displayHeight + 'px';

      let left = ev.pageX + cursorOffsetX;
      let top = ev.pageY + cursorOffsetY;

      left = Math.min(left, vw - displayWidth - cursorOffsetX);
      left = Math.max(0, left);

      top = Math.min(top, window.scrollY + vh - displayHeight - marginBottom);
      top = Math.max(0, top);

      media.style.left = left + 'px';
      media.style.top = top + 'px';
    };

    waitForDimensions(media, () => {
      updatePos(e);
    });

    document.addEventListener('mousemove', updatePos);
    link.hoverMove = updatePos;
    link.hoverMedia = media;

    if (isVideo && videoScrollVol) {
      const onWheel = (ev) => {
        ev.preventDefault();
        const delta = ev.deltaY < 0 ? 0.05 : -0.05;
        media.volume = Math.min(1, Math.max(0, media.volume + delta));
        localStorage.setItem('videovolume', media.volume);
      };
      document.addEventListener('wheel', onWheel, { passive: false });
      link.hoverWheel = onWheel;
    }
  }

  function handleLinkOut(e) {
    const link = e.currentTarget;
    const media = link.hoverMedia;
    link.isHovering = false;

    if (media && media.tagName === 'VIDEO') {
      const time = media.currentTime;
      if (time > 0.1) {
        link.dataset.hoverTime = time;
      }
    }

    if (media) media.remove();

    if (link.hoverMove) {
      document.removeEventListener('mousemove', link.hoverMove);
      delete link.hoverMove;
    }
    if (link.hoverWheel) {
      document.removeEventListener('wheel', link.hoverWheel);
      delete link.hoverWheel;
    }
    delete link.hoverMedia;
  }

  function bindLinkPreviews(linkElements, allowImages = true) {
    for (let i = 0; i < linkElements.length; i++) {
      const link = linkElements[i];
      if (link.hoverBound) continue;
      link.addEventListener('mouseenter', (e) => handleLinkHover(e, allowImages));
      link.addEventListener('mouseleave', handleLinkOut);
      link.hoverBound = true;
    }
  }

  const fetchTasks = [];
  let fetchProcessing = false;

  async function fetchQueue(limit = 5) {
    if (fetchProcessing) return;
    fetchProcessing = true;

    async function worker() {
      while (fetchTasks.length > 0) {
        const task = fetchTasks.shift();
        try {
          await task();
        } catch (e) {
        }
      }
    }

    const workers = Array.from({ length: limit }, worker);
    await Promise.all(workers);

    fetchProcessing = false;
  }

  const thumbCanvas = document.createElement('canvas');
  const thumbCtx = thumbCanvas.getContext('2d', { willReadFrequently: true });

  let canvasMutex = Promise.resolve();
  async function withCanvasLock(callback) {
    const prior = canvasMutex;
    let release;
    canvasMutex = new Promise(resolve => { release = resolve; });
    await prior;
    try {
      return await callback();
    } finally {
      release();
    }
  }

  async function checkThumb(imgEl, skip = 4) {
    if (!imgEl.complete) {
      await new Promise(res => {
        imgEl.addEventListener('load', res, { once: true });
        imgEl.addEventListener('error', res, { once: true });
      });
    } else if (typeof imgEl.decode === 'function') {
      try { await imgEl.decode(); } catch (e) {}
    }

    return withCanvasLock(() => {
      try {
        const w = imgEl.naturalWidth || imgEl.width;
        const h = imgEl.naturalHeight || imgEl.height;
        if (!w || !h) return true;

        thumbCanvas.width = w;
        thumbCanvas.height = h;
        thumbCtx.clearRect(0, 0, w, h);
        thumbCtx.drawImage(imgEl, 0, 0, w, h);
        const data = thumbCtx.getImageData(0, 0, w, h).data;

        for (let i = 0; i < data.length; i += 4 * skip) {
          if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
            return true;
          }
        }
        return false;
      } catch {
        return true;
      }
    });
  }

  function thumbSwap(post, fileLink, img, queue = false) {
    if (!thumbnailSwap) return;
    if (!fileLink || !img) return;

    const href = fileLink.getAttribute('href');
    if (!href) return;

    const isPng = href.endsWith('.png');
    const isGif = href.endsWith('.gif');
    const isWebp = href.endsWith('.webp');
    if (!isPng && !isGif && !isWebp) return;
    if (img.src.includes('/static/spoiler')) return;

    function getThumbContainer() {
      let container = document.getElementById('hidden-thumbs');
      if (!container) {
        container = document.createElement('div');
        container.id = 'hidden-thumbs';
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      return container;
    }

    function preserveThumbnail(imgEl) {
      const src = imgEl.getAttribute('src');
      if (!src) return;
      const container = getThumbContainer();
      if (!container.querySelector(`img[data-thumb="${src}"]`)) {
        const hidden = document.createElement('img');
        hidden.src = src;
        hidden.setAttribute('data-thumb', src);
        container.appendChild(hidden);
      }
    }

    const processThumb = async () => {
      try {
        const thumbHasAlpha = await checkThumb(img, 4);
        if (!thumbHasAlpha) return;

        if (isPng || isWebp) {
          preserveThumbnail(img);
          img.src = href;
          return;
        }

        if (isGif) {
          try {
            const resp = await fetch(href);
            const blob = await resp.blob();
            const bitmap = await createImageBitmap(blob, { imageOrientation: 'none' });
            try {
              const cv = document.createElement('canvas');
              const w = img.naturalWidth || img.width || bitmap.width;
              const h = img.naturalHeight || img.height || bitmap.height;
              cv.width = w;
              cv.height = h;
              const cctx = cv.getContext('2d');
              cctx.drawImage(bitmap, 0, 0, w, h);
              preserveThumbnail(img);
              img.src = cv.toDataURL('image/png');
            } finally {
              if (bitmap && typeof bitmap.close === 'function') bitmap.close();
            }
          } catch (e) {}
        }
      } catch (e) {}
    };

    function enqueueOrRun(task) {
      if (queue) {
        if (img.complete) {
          fetchTasks.push(task);
          if (!fetchProcessing) fetchQueue(5);
        } else {
          img.addEventListener('load', () => {
            fetchTasks.push(task);
            if (!fetchProcessing) fetchQueue(5);
          }, { once: true });
        }
      } else {
        task();
      }
    }

    enqueueOrRun(processThumb);
  }

  function handleSpoilerMedia(post, unimportant, fileLink, spoilerImg) {
    if (!showSpoilerMedia) return;
    if (!unimportant || !unimportant.textContent.includes('Spoiler Image')) return;
    if (!fileLink) return;
    if (!spoilerImg) return;

    spoilerImg.removeAttribute('style');
    spoilerImg.style.maxWidth = '125px';
    spoilerImg.style.maxHeight = '125px';

    const href = fileLink.getAttribute('href');
    if (!href) return;

    const isGif = href.endsWith('.gif');
    const isVideo = href.includes('/player.php?v=');

    if (isGif) {
      fetch(href)
        .then(resp => resp.blob())
        .then(async blob => {
        try {
          const bitmap = await createImageBitmap(blob, { imageOrientation: 'none' });
          const cv = document.createElement('canvas');
          cv.width = bitmap.width;
          cv.height = bitmap.height;
          const ctx = cv.getContext('2d');
          ctx.drawImage(bitmap, 0, 0);
          spoilerImg.src = cv.toDataURL('image/png');
          if (typeof bitmap.close === 'function') bitmap.close();
        } catch (e) {}
      })
        .catch(() => {});
      return;
    }

    if (isVideo) {
      const match = href.match(/\/player\.php\?v=([^&]+)/);
      if (match && match[1]) {
        let videoPath = decodeURIComponent(match[1]);
        const thumbPath = videoPath.replace('/src/', '/thumb/').replace(/\.\w+$/, '.jpg');
        spoilerImg.src = thumbPath;
      }
      return;
    }

    spoilerImg.src = href;
  }

  const TWEET_LINK_RE = /^https?:\/\/(?:\w+\.)?(?:twitter|x)\.com\/([^\/]+)\/status\/(\d+)/i;
  const API_PREFIX = 'https://api.fxtwitter.com/';
  const HOLOPLUS_UUID_RE = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
  const HOLOPLUS_PAGE_CACHE_LIMIT = 10;
  const holoplusPageCache = new Map();
  const holoplusPageRequests = new Map();
  const YT_LINK_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const YT_PLAYLIST_RE = /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i;
  const STREAMABLE_LINK_RE = /streamable\.com(?:\/e)?\/([a-zA-Z0-9]+)/i;
  const VOCAROO_LINK_RE = /(?:vocaroo\.com|voca\.ro)\/([a-zA-Z0-9]+)/i;
  const TWITCH_LINK_RE = /(?:www\.)?twitch\.tv\/(?:videos\/(\d+)(?:\?t(?:ime)?=([\dhms]+))?|([a-zA-Z0-9_]+))(?:$|[?#])/i;
  const TWITCH_CLIP_RE = /(?:www\.)?twitch\.tv\/(?:[a-zA-Z0-9_]+\/clip\/|clips\/)([A-Za-z0-9\-]+)/i;
  const IMAGE_RE = /\.(?:jpg|jpeg|png|gif|webp|jfif|bmp|avif|jxl)(?:[?#].*)?$/i;
  const MEDIA_FILE_RE = /\.(?:ogg|mp3|wav|aac|m4a|webm|mp4)(?:[?#].*)?$/i;
  const TWIMG_RE = /^https?:\/\/pbs\.twimg\.com\/media\/[^\s]+/i;
  const PIXIV_LINK_RE = /^https?:\/\/(?:www\.)?pixiv\.net\/(?:en\/)?artworks\/(\d+)/i;
  const PIXIV_API_PREFIX = 'https://www.pixiv.net/ajax/illust/';
  const PXIMG_LINK_RE = /^https?:\/\/i\.pximg\.net\//i;
  const PIXIV_REFERER = 'https://www.pixiv.net';
  const BSKY_LINK_RE = /^https?:\/\/(?:www\.)?bsky\.app\/profile\/([^\/?#]+)\/post\/([^\/?#]+)/i;
  const BSKY_API_PREFIX = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=';
  const LINKIFY_REGEX = /(https?:\/\/[^\s]+)|([@#][^\s]+)/g;
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const translateFrom = settings.translateFrom || "ja, id";
  const isMobileTheme = !document.documentElement.classList.contains('desktop-style') && !document.documentElement.classList.contains('desktop-floating-mode');
  const gmRequest = (typeof GM !== 'undefined' && GM?.xmlHttpRequest) || (typeof GM_xmlhttpRequest !== 'undefined' && GM_xmlhttpRequest);

  function getHoloplusPost(url) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch (e) {
      return null;
    }

    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.port) return null;

    let postId = null;
    if (parsed.hostname === 'holotower.org' || parsed.hostname === 'www.holotower.org') {
      if (parsed.pathname !== '/holoplus.php') return null;
      postId = parsed.searchParams.get('post');
    } else if (parsed.hostname === 'holoplus.com' || parsed.hostname === 'www.holoplus.com') {
      const match = parsed.pathname.match(/^\/app\/threads\/([^/]+)\/?$/i);
      if (match) postId = match[1];
    } else {
      return null;
    }

    if (!postId || !HOLOPLUS_UUID_RE.test(postId)) return null;
    return { id: postId, url: `https://holotower.org/holoplus.php?post=${postId}` };
  }

  async function fetchHoloplusHtml(url) {
    try {
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.text();
    } catch (e) {
      if (!gmRequest) throw e;
    }

    return new Promise((resolve, reject) => {
      gmRequest({
        method: 'GET',
        url,
        responseType: 'text',
        timeout: 15000,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300 && response.responseText) {
            resolve(response.responseText);
          } else {
            reject(new Error('HTTP ' + response.status));
          }
        },
        onerror: () => reject(new Error('holoplus request failed')),
        ontimeout: () => reject(new Error('holoplus request timed out'))
      });
    });
  }

  function fetchHoloplusPage(post) {
    const cachedPage = holoplusPageCache.get(post.url);
    if (cachedPage) {
      holoplusPageCache.delete(post.url);
      holoplusPageCache.set(post.url, cachedPage);
      return Promise.resolve(cachedPage);
    }
    if (holoplusPageRequests.has(post.url)) return holoplusPageRequests.get(post.url);

    const promise = fetchHoloplusHtml(post.url).then((html) => {
      if (typeof html !== 'string') throw new Error('Invalid holoplus response');
      const page = new DOMParser().parseFromString(html, 'text/html');
      if (!page.querySelector('article.hp-post')) throw new Error('holoplus post not found');

      const pageUrl = page.querySelector('meta[property="og:url"]')?.getAttribute('content');
      const pagePost = pageUrl && getHoloplusPost(pageUrl);
      if (pagePost && pagePost.id.toLowerCase() !== post.id.toLowerCase()) {
        throw new Error('holoplus post did not match the requested ID');
      }

      holoplusPageCache.delete(post.url);
      holoplusPageCache.set(post.url, page);
      while (holoplusPageCache.size > HOLOPLUS_PAGE_CACHE_LIMIT) {
        holoplusPageCache.delete(holoplusPageCache.keys().next().value);
      }
      return page;
    }).finally(() => {
      holoplusPageRequests.delete(post.url);
    });

    holoplusPageRequests.set(post.url, promise);
    return promise;
  }

  function makeEmbedButton(originalUrl) {
    const wrapper = document.createElement('span');
    wrapper.className = 'embed-container';
    const btn = document.createElement('span');
    btn.className = 'embed-button';
    btn.style.fontWeight = 'bold';
    btn.style.textDecoration = 'underline';
    btn.style.color = 'rgb(221, 0, 0)';
    btn.style.cursor = 'pointer';
    btn.setAttribute('data-embedurl', originalUrl);
    btn.textContent = 'Embed';
    wrapper.appendChild(document.createTextNode(' ['));
    wrapper.appendChild(btn);
    wrapper.appendChild(document.createTextNode('] '));
    return wrapper;
  }

  function revokeObjectURLs(node) {
    if (!node) return;
    const imgs = node.querySelectorAll('img[data-objurl]');
    for (let i = 0; i < imgs.length; i++) {
      const u = imgs[i].dataset.objurl;
      if (u) {
        try { URL.revokeObjectURL(u); } catch {}
        delete imgs[i].dataset.objurl;
      }
    }
    const vids = node.querySelectorAll('video[data-objurl]');
    for (let i = 0; i < vids.length; i++) {
      const u = vids[i].dataset.objurl;
      if (u) {
        try { URL.revokeObjectURL(u); } catch {}
        delete vids[i].dataset.objurl;
      }
      try { vids[i].removeAttribute('src'); vids[i].load(); } catch {}
    }
  }

  function removeEmbedThread(btn) {
    const container = btn.closest('.embed-container') || btn;
    if (!container) return;
    let next = container.nextSibling;
    while (next && next.classList && (next.classList.contains('twt-embed') || next.classList.contains('media-embed'))) {
      const toRemove = next;
      next = next.nextSibling;
      revokeObjectURLs(toRemove);
      toRemove.remove();
    }
    btn.classList.remove('embed-active');
    if (btn.tagName.toLowerCase() !== 'a') {
      btn.textContent = 'Embed';
    }
  }

  function formatTimestamp(unix) {
    if (!unix) return '';
    const date = new Date(unix * 1000);
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2,'0');
    const dd = String(date.getDate()).padStart(2,'0');
    const day = DAYS[date.getDay()];
    const hh = String(date.getHours()).padStart(2,'0');
    const min = String(date.getMinutes()).padStart(2,'0');
    const ss = String(date.getSeconds()).padStart(2,'0');
    return `${mm}/${dd}/${yy} (${day}) ${hh}:${min}:${ss}`;
  }

  function linkifyText(inputText) {
    const fragment = document.createDocumentFragment();
    if (!inputText) return fragment;
    let lastIndex = 0;
    let match;
    LINKIFY_REGEX.lastIndex = 0;
    while ((match = LINKIFY_REGEX.exec(inputText)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(inputText.slice(lastIndex, match.index)));
      }
      const a = document.createElement('a');
      a.target = '_blank';
      a.referrerPolicy = 'no-referrer';
      a.style.textDecoration = 'none';
      a.style.color = 'inherit';
      if (match[1]) {
        a.href = match[1];
        a.textContent = match[1];
      } else {
        const tag = match[2];
        if (tag.startsWith('#')) a.href = `https://x.com/hashtag/${encodeURIComponent(tag.slice(1))}`;
        else a.href = `https://x.com/${tag.slice(1)}`;
        a.textContent = tag;
      }
      fragment.appendChild(a);
      lastIndex = LINKIFY_REGEX.lastIndex;
    }
    if (lastIndex < inputText.length) {
      fragment.appendChild(document.createTextNode(inputText.slice(lastIndex)));
    }
    return fragment;
  }

  async function fetchTweetData(apiUrl) {
    const path = apiUrl.replace(/^https?:\/\/(?:\w+\.)?api\.fxtwitter\.com\//i, '');
    const resp = await fetch(API_PREFIX + path + '/en', { credentials: 'omit' });
    if (!resp.ok) throw new Error('API ' + resp.status);
    const data = await resp.json();
    if (!data || !data.tweet) throw new Error('Invalid API response');
    return data.tweet;
  }

  async function fetchJsonViaGM(url) {
    try {
      const resp = await fetch(url, { credentials: 'omit' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return await resp.json();
    } catch (e) {
      if (!gmRequest) {
        if (e && e.name === 'TypeError') throw new Error(`${e.message}<br>GM API not detected. Use a userscript manager for best compatibility.`);
        throw e;
      }
      return new Promise((resolve, reject) => {
        gmRequest({
          method: 'GET',
          url,
          responseType: 'text',
          onload: (resp) => {
            if (resp.status >= 200 && resp.status < 300 && resp.responseText) {
              try {
                resolve(JSON.parse(resp.responseText));
              } catch (parseErr) {
                reject(new Error('Invalid API response'));
              }
            } else {
              reject(new Error('HTTP ' + resp.status));
            }
          },
          onerror: () => reject(new Error('HTTP network error')),
          ontimeout: () => reject(new Error('HTTP request timed out'))
        });
      });
    }
  }

  function sanitizeFilenamePart(name) {
    const fullwidthChars = {
      '\\': '＼', '/': '／', ':': '：', '*': '＊', '?': '？',
      '"': '＂', '<': '＜', '>': '＞', '|': '｜'
    };
    return String(name)
      .replace(/[\x00-\x1f\x7f]/g, '')
      .replace(/[\\\/:*?"<>|]/g, (c) => fullwidthChars[c])
      .replace(/^\.+/, '');
  }

  function getOembedTitle(data) {
    const title = typeof data?.title === 'string' ? data.title.trim() : '';
    if (title && sanitizeFilenamePart(title).replace(/[. ]+$/, '')) return title;
    if (typeof data?.html !== 'string') return null;

    try {
      const iframeTitle = new DOMParser()
        .parseFromString(data.html, 'text/html')
        .querySelector('iframe[title]')
        ?.getAttribute('title')
        ?.trim();
      return iframeTitle && sanitizeFilenamePart(iframeTitle).replace(/[. ]+$/, '')
        ? iframeTitle
        : null;
    } catch (e) {
      return null;
    }
  }

  function makeFailEmbed(replyContext) {
    const embed = document.createElement('div');
    embed.className = 'twt-embed';
    const failText = document.createElement('div');
    failText.style.color = 'red';
    failText.textContent = 'Embed failed';
    embed.appendChild(failText);
    return embed;
  }

  function holoplusTitle(page) {
    const metaTitle = page.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim();
    if (metaTitle) return metaTitle.slice(0, 300);
    const articleTitle = page.querySelector('article.hp-post .window-title')?.textContent?.trim();
    if (articleTitle) return articleTitle.slice(0, 300);
    return (page.title || 'Holoplus post').replace(/\s+-\s+holoplus\s+-\s+Holotower$/i, '').trim().slice(0, 300);
  }

  function appendHoloplusContent(source, target) {
    if (!source) return;

    for (const child of source.childNodes) {
      if (child.nodeType === 3) {
        target.appendChild(document.createTextNode(child.nodeValue || ''));
        continue;
      }
      if (child.nodeType !== 1) continue;

      const tag = child.tagName.toLowerCase();
      if (tag === 'br') {
        target.appendChild(document.createElement('br'));
        continue;
      }
      if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'].includes(tag)) continue;
      if (tag === 'a') {
        const href = child.getAttribute('href');
        if (!href) {
          target.appendChild(document.createTextNode(child.textContent || ''));
          continue;
        }
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer nofollow';
        link.referrerPolicy = 'no-referrer';
        link.textContent = child.textContent || href;
        target.appendChild(link);
        continue;
      }

      const block = ['div', 'p', 'li', 'blockquote'].includes(tag);
      if (block && target.lastChild && target.lastChild.nodeName !== 'BR') {
        target.appendChild(document.createElement('br'));
      }
      appendHoloplusContent(child, target);
      if (block && child.nextSibling && target.lastChild && target.lastChild.nodeName !== 'BR') {
        target.appendChild(document.createElement('br'));
      }
    }
  }

  function renderHoloplus(page, post, replyContext) {
    const article = page.querySelector('article.hp-post');
    if (!article) throw new Error('holoplus post not found');

    const embed = document.createElement('div');
    embed.className = 'twt-embed holoplus-embed';
    const margin = computeEmbedMargin(replyContext);
    if (margin) embed.style.marginLeft = margin;

    const title = holoplusTitle(page);
    const header = document.createElement('a');
    header.className = 'twt-header holoplus-title';
    header.href = post.url;
    header.target = '_blank';
    header.rel = 'noopener noreferrer';
    header.referrerPolicy = 'no-referrer';
    header.textContent = title;
    embed.appendChild(header);

    const meta = article.querySelector('.hp-meta');
    if (meta?.textContent?.trim()) {
      const metaLine = document.createElement('div');
      metaLine.className = 'holoplus-meta';
      for (const child of meta.childNodes) {
        if (child.nodeType === 1 && child.matches('.hp-sep')) {
          const separator = document.createElement('span');
          separator.className = 'hp-sep';
          separator.textContent = child.textContent;
          metaLine.appendChild(separator);
        } else {
          const text = document.createElement('span');
          text.className = 'holoplus-meta-text';
          text.textContent = child.textContent || '';
          metaLine.appendChild(text);
        }
      }
      embed.appendChild(metaLine);
    }

    const body = article.querySelector('.hp-body');
    if (body) {
      const text = document.createElement('div');
      text.className = 'twt-text holoplus-text';
      appendHoloplusContent(body, text);
      embed.appendChild(text);
    }

    const translationSource = article.querySelector('details.hp-translation');
    if (translationSource) {
      const translationBody = translationSource.querySelector('.hp-body');
      const translationTitle = translationSource.querySelector('p > strong')?.textContent?.trim();
      if (translationBody || translationTitle) {
        const details = document.createElement('details');
        details.className = 'holoplus-translation';
        details.open = true;
        const summary = document.createElement('summary');
        summary.textContent = translationSource.querySelector('summary')?.textContent?.trim() || 'Translation';
        details.appendChild(summary);
        if (translationTitle) {
          const title = document.createElement('div');
          title.className = 'holoplus-translation-title';
          title.textContent = translationTitle;
          details.appendChild(title);
        }
        if (translationBody) {
          const translated = document.createElement('div');
          translated.className = 'holoplus-text';
          appendHoloplusContent(translationBody, translated);
          details.appendChild(translated);
        }
        embed.appendChild(details);
      }
    }

    const sourceImages = article.querySelectorAll('.hp-media img[src]');
    if (sourceImages.length) {
      const media = document.createElement('div');
      media.className = `holoplus-media photos-grid${sourceImages.length === 1 ? ' single' : ''}`;
      for (const sourceImage of sourceImages) {
        const src = sourceImage.getAttribute('src');
        if (!src) continue;

        const img = document.createElement('img');
        img.className = 'photo-img';
        img.src = src;
        img.alt = sourceImage.getAttribute('alt') || title;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.dataset.expanded = '0';
        img.onerror = () => {
          const unavailable = document.createElement('span');
          unavailable.textContent = 'Image unavailable';
          img.replaceWith(unavailable);
        };

        const sourceLink = sourceImage.closest('a[href]');
        const href = sourceLink && sourceLink.getAttribute('href');
        const link = document.createElement('a');
        link.className = 'photo-link';
        link.href = href || src;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.referrerPolicy = 'no-referrer';
        link.appendChild(img);
        media.appendChild(link);
      }
      if (media.childElementCount) {
        bindPhotoGrid(media);
        embed.appendChild(media);
      }
    }

    const sourceAudios = article.querySelectorAll('audio.hp-voice[src]');
    if (sourceAudios.length) {
      const voices = document.createElement('div');
      voices.className = 'holoplus-media holoplus-voices';
      const seenAudioSources = new Set();
      for (const sourceAudio of sourceAudios) {
        const src = sourceAudio.getAttribute('src');
        if (!src || seenAudioSources.has(src)) continue;
        seenAudioSources.add(src);

        const audio = document.createElement('audio');
        audio.className = 'holoplus-voice-audio';
        audio.controls = true;
        audio.preload = 'metadata';
        audio.referrerPolicy = 'no-referrer';
        audio.src = src;
        const label = sourceAudio.closest('.hp-player')?.querySelector('.hp-player-label')?.textContent?.trim();
        audio.setAttribute('aria-label', label || 'Voice clip');
        voices.appendChild(audio);
      }
      if (voices.childElementCount) embed.appendChild(voices);
    }

    const sourceChips = article.querySelectorAll('.hp-chips a.hp-chip[href]');
    if (sourceChips.length) {
      const chips = document.createElement('div');
      chips.className = 'holoplus-chips';
      for (const sourceChip of sourceChips) {
        const href = sourceChip.getAttribute('href');
        const label = sourceChip.textContent?.trim();
        if (!href || !label) continue;

        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        const title = sourceChip.getAttribute('title')?.trim();
        if (title) link.title = title;
        chips.appendChild(link);
      }
      if (chips.childElementCount) embed.appendChild(chips);
    }

    const footer = document.createElement('div');
    footer.className = 'twt-footer';
    const openLink = document.createElement('a');
    openLink.href = `https://www.holoplus.com/app/threads/${encodeURIComponent(post.id)}`;
    openLink.target = '_blank';
    openLink.rel = 'noopener noreferrer';
    openLink.referrerPolicy = 'no-referrer';
    openLink.textContent = 'Open in holoplus';
    footer.appendChild(openLink);
    const editedMatch = article.querySelector('.hp-actions')?.textContent?.match(/\bEdited\s+[^\r\n]+/i);
    if (editedMatch) {
      const edited = document.createElement('span');
      edited.className = 'holoplus-edited';
      const separator = document.createElement('span');
      separator.className = 'hp-sep';
      separator.textContent = '|';
      edited.appendChild(separator);
      edited.appendChild(document.createTextNode(` ${editedMatch[0].trim()}`));
      footer.appendChild(edited);
    }
    embed.appendChild(footer);
    return embed;
  }

  function bindPhotoGrid(grid) {
    const allImagesArray = Array.from(grid.querySelectorAll('img.photo-img'));
    grid.addEventListener('click', (e) => {
      const t = e.target;
      const img = t && (t.matches && t.matches('img.photo-img') ? t : t.closest && t.closest('img.photo-img'));
      if (!img || !grid.contains(img)) return;
      e.preventDefault();

      const expanded = img.dataset.expanded === '1';
      if (!expanded) {
        img.classList.add('expanded');
        img.dataset.expanded = '1';
        for (let j = 0; j < allImagesArray.length; j++) {
          const iel = allImagesArray[j];
          if (iel !== img) iel.style.display = 'none';
        }
        grid.style.gridTemplateColumns = '1fr';
      } else {
        img.classList.remove('expanded');
        img.dataset.expanded = '0';
        for (let j = 0; j < allImagesArray.length; j++) {
          allImagesArray[j].style.removeProperty('display');
        }
        grid.style.removeProperty('grid-template-columns');
      }
    });
  }

  async function insertHoloplus(post, replyContext, insertionPoint) {
    if (!insertionPoint?.parentNode) return;
    try {
      const page = await fetchHoloplusPage(post);
      if (!insertionPoint.parentNode) return;
      insertionPoint.parentNode.insertBefore(renderHoloplus(page, post, replyContext), insertionPoint.nextSibling);
    } catch (e) {
      if (insertionPoint.parentNode) {
        insertionPoint.parentNode.insertBefore(makeFailEmbed(replyContext), insertionPoint.nextSibling);
      }
    }
  }

  async function fetchGMBlob(url) {
    if (!gmRequest) throw new Error('GM.xmlHttpRequest not available');

    return new Promise((resolve, reject) => {
      gmRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload: (resp) => {
          if (resp.status >= 200 && resp.status < 300 && resp.response) resolve(resp.response);
          else reject(new Error('HTTP ' + resp.status));
        },
        onerror: () => reject(new Error('HTTP network error')),
        ontimeout: () => reject(new Error('HTTP request timed out'))
      });
    });
  }

  async function mediaGM(el) {
    if (!el) return;
    const tag = (el.tagName || '').toLowerCase();
    if (tag !== 'img' && tag !== 'video') return;

    if (el.dataset.gmtry === '1') return;
    el.dataset.gmtry = '1';

    if (!gmRequest) {
      try { el.onerror = null; } catch {}
      const warn = document.createElement('span');
      warn.style.color = 'red';
      warn.style.fontSize = '0.85em';
      warn.textContent = 'Cannot load media. Use a userscript manager.';
      if (el.parentNode) el.parentNode.insertBefore(warn, el.nextSibling);
      return;
    }

    const origVisibility = el.style.visibility || '';
    const origSrc = el.getAttribute('src') || '';
    const origPoster = tag === 'video' ? el.getAttribute('poster') || '' : '';
    const origOnerror = el.onerror;

    try { el.onerror = null; } catch {}
    el.style.visibility = 'hidden';

    try {
      const blob = await fetchGMBlob(origSrc || (tag === 'video' && el.currentSrc) || '');
      if (!blob) throw new Error('no blob');

      const objUrl = URL.createObjectURL(blob);
      el.dataset.objurl = objUrl;

      if (tag === 'img') {
        el.removeAttribute('src');
        el.src = objUrl;
        await new Promise((res) => {
          el.onload = el.onerror = function () { el.onload = el.onerror = null; res(); };
        });
        el.style.visibility = origVisibility || '';
      } else {
        try { el.pause(); } catch (e) {}
        const sources = el.querySelectorAll('source');
        for (let i = 0; i < sources.length; i++) sources[i].remove();
        el.removeAttribute('src');
        el.src = objUrl;
        el.load();
        await new Promise((res) => {
          el.onloadeddata = el.onerror = function () { el.onloadeddata = el.onerror = null; res(); };
        });
        el.style.visibility = origVisibility || '';
        if (el.paused && !el.controls) el.controls = true;
      }
    } catch (e) {
      el.style.visibility = origVisibility || '';
      try { el.onerror = null; } catch {}
    } finally {
      try {} catch {}
    }
  }

  function renderTweetEmbed(tweet, replyContext) {
    const embed = document.createElement('div');
    embed.className = 'twt-embed';

    const fragment = document.createDocumentFragment();

    const headerLink = document.createElement('a');
    headerLink.className = 'twt-header';
    headerLink.href = tweet.author?.url || '#';
    headerLink.title = tweet.author?.description || '';
    headerLink.target = '_blank';
    headerLink.referrerPolicy = 'no-referrer';

    const avatar = document.createElement('img');
    avatar.className = 'twt-avatar';
    avatar.src = tweet.author?.avatar_url || '';
    avatar.onerror = () => mediaGM(avatar);
    avatar.alt = '';
    headerLink.appendChild(avatar);

    const meta = document.createElement('div');
    meta.className = 'twt-meta';
    meta.innerHTML = `<strong>${escapeHtml(tweet.author?.name || '')}</strong><br><span class="handle">@${escapeHtml(tweet.author?.screen_name || '')}</span>`;
    headerLink.appendChild(meta);

    fragment.appendChild(headerLink);

    const textBox = document.createElement('div');
    textBox.className = 'twt-text';
    const originalFragment = linkifyText(tweet.text || '');
    const translatedFragment = tweet.translation?.text ? linkifyText(tweet.translation.text) : null;
    textBox.appendChild(originalFragment.cloneNode(true));
    fragment.appendChild(textBox);

    const translation = tweet.translation;

    function normalizeText(text) {
      return (text || '')
        .replace(/@\w+/g, '')
        .replace(/[\p{P}\p{S}]/gu, '')
        .replace(/\s+/g, '')
        .toLowerCase()
        .trim();
    }

    const normalizedOriginal = normalizeText(tweet.text);
    const normalizedTranslation = normalizeText(translation?.text);

    if (
      translation &&
      translation.text &&
      translation.source_lang &&
      translation.target_lang &&
      translation.source_lang !== translation.target_lang &&
      translation.text !== tweet.text &&
      /^[a-z]{2}$/i.test(translation.source_lang) &&
      normalizedOriginal !== normalizedTranslation
    ) {
      const translateContainer = document.createElement('div');
      translateContainer.className = 'twt-translate';

      const sourceLangText = document.createElement('span');
      sourceLangText.textContent = '';

      const translateLink = document.createElement('a');
      translateLink.href = 'javascript:void(0)';
      translateLink.textContent = 'Translate post';

      let isTranslated = false;

      let srcLang = translation.source_lang?.toLowerCase();
      if (srcLang === 'in') srcLang = 'id';

      let srcLangEn = translation.source_lang_en;
      if (!srcLangEn) {
        if (srcLang === 'ja') {
          srcLangEn = 'Japanese';
        } else if (srcLang === 'id') {
          srcLangEn = 'Indonesian';
        }
      } else {
        if (srcLangEn === 'language_in' || srcLangEn === 'language_id') {
          srcLangEn = 'Indonesian';
        } else if (srcLangEn === 'language_ja') {
          srcLangEn = 'Japanese';
        }
      }

      const sourceLang = srcLangEn || srcLang.toUpperCase();

      function applyTranslation(state) {
        textBox.innerHTML = '';
        if (state) {
          textBox.appendChild(translatedFragment.cloneNode(true));
          translateLink.textContent = 'Show original';
          sourceLangText.textContent = `Translated from ${sourceLang} `;
          isTranslated = true;
        } else {
          textBox.appendChild(originalFragment.cloneNode(true));
          translateLink.textContent = 'Translate post';
          sourceLangText.textContent = '';
          isTranslated = false;
        }
      }

      translateLink.addEventListener('click', () => applyTranslation(!isTranslated));

      if (translateAuto && translation.source_lang) {
        const fromList = translateFrom.toLowerCase().split(/[\s,]+/).filter(Boolean);

        if (fromList.includes('all') || fromList.includes('any') || fromList.includes(srcLang)) {
          applyTranslation(true);
        }
      }

      translateContainer.appendChild(sourceLangText);
      translateContainer.appendChild(translateLink);
      fragment.appendChild(translateContainer);
    }

    if (tweet.poll) {
      const p = tweet.poll;
      const pollEl = document.createElement('div');
      pollEl.className = 'twt-poll';

      const choicesWrap = document.createElement('div');
      choicesWrap.className = 'twt-poll-choices';

      const choices = Array.isArray(p.choices) ? p.choices : [];
      if (!choices.length) return;

      let maxPct = -1;
      for (let i = 0; i < choices.length; i++) {
        const val = Number(choices[i].percentage) || 0;
        if (val > maxPct) maxPct = val;
      }

      for (let i = 0; i < choices.length; i++) {
        const ch = choices[i];
        const pct = Math.max(0, Math.min(100, Number(ch.percentage) || 0));
        const pctText = (Math.abs(pct - Math.round(pct)) >= 0.05) ? pct.toFixed(1) + '%' : Math.round(pct) + '%';

        const choiceEl = document.createElement('div');
        choiceEl.className = 'twt-poll-choice';
        const barBg = document.createElement('div');
        barBg.className = 'twt-poll-bar-bg';

        const bar = document.createElement('div');
        bar.className = 'twt-poll-bar';
        bar.style.width = '0%';
        barBg.appendChild(bar);

        const labelSpan = document.createElement('span');
        labelSpan.className = 'twt-poll-label';
        labelSpan.textContent = ch.label || '';
        barBg.appendChild(labelSpan);

        const pctSpan = document.createElement('span');
        pctSpan.className = 'twt-poll-pct';
        pctSpan.textContent = pctText;
        barBg.appendChild(pctSpan);

        if (pct === maxPct) {
          const linkColor = tsLinkColor || getComputedStyle(document.querySelector('a')).color;

          bar.style.background = `linear-gradient(90deg,
            color-mix(in srgb, ${linkColor} 50%, transparent),
            color-mix(in srgb, ${linkColor} 40%, transparent)
          )`;
          labelSpan.style.fontWeight = 'bolder';
          pctSpan.style.fontWeight = 'bolder';
        }

        choiceEl.appendChild(barBg);
        choicesWrap.appendChild(choiceEl);

        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.style.width = pct + '%';
          }, 10);
        });
      }

      pollEl.appendChild(choicesWrap);

      const footer = document.createElement('div');
      footer.className = 'twt-poll-footer';

      if (typeof p.total_votes === 'number') {
        const votesSpan = document.createElement('span');
        votesSpan.className = 'twt-poll-total';
        votesSpan.textContent = `${p.total_votes} vote${p.total_votes === 1 ? '' : 's'}`;
        footer.appendChild(votesSpan);
      }

      if (p.time_left_en) {
        const timeSpan = document.createElement('span');
        timeSpan.className = 'twt-poll-timeleft';
        timeSpan.textContent = p.time_left_en;
        footer.appendChild(timeSpan);
      }

      pollEl.appendChild(footer);
      fragment.appendChild(pollEl);
    }

    const media = tweet.media || {};
    if (media.all?.length) {
      const items = media.all;
      const photos = [];
      const others = [];

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.type === 'photo') photos.push(it);
        else others.push(it);
      }

      if (photos.length) {
        const grid = document.createElement('div');
        grid.className = 'photos-grid ' + (photos.length === 1 ? 'single' : '');

        for (let i = 0; i < photos.length; i++) {
          const p = photos[i];
          const a = document.createElement('a');
          a.className = 'photo-link';
          a.href = p.url;
          a.target = '_blank';

          const img = document.createElement('img');
          img.className = 'photo-img';
          img.src = p.url;
          img.onerror = () => mediaGM(img);
          img.dataset.expanded = '0';

          a.appendChild(img);
          grid.appendChild(a);
        }

        bindPhotoGrid(grid);

        fragment.appendChild(grid);
      }

      for (let k = 0; k < others.length; k++) {
        const item = others[k];
        if ((item.type === 'video' || item.type === 'gif') && item.variants?.length) {
          const videoWrapper = document.createElement('div');
          videoWrapper.className = 'videos-single';

          const video = document.createElement('video');
          video.className = 'twt-video';
          video.controls = true;
          video.loop = item.type === 'gif';
          video.autoplay = item.type === 'gif';

          let best = null;
          const variants = item.variants;
          for (let vi = 0; vi < variants.length; vi++) {
            const v = variants[vi];
            if (v.content_type !== 'video/mp4') continue;
            if (!best || (v.bitrate || 0) > (best.bitrate || 0)) best = v;
          }
          video.src = (best && best.url) || item.url;
          video.onerror = () => mediaGM(video);

          const savedVolume = parseFloat(localStorage.getItem('videovolume'));
          video.volume = !isNaN(savedVolume) ? Math.min(Math.max(savedVolume, 0), 1) : 0.5;
          video.addEventListener('volumechange', () => localStorage.setItem('videovolume', video.volume));
          if (item.thumbnail_url) video.poster = item.thumbnail_url;

          videoWrapper.appendChild(video);
          fragment.appendChild(videoWrapper);
        }
      }
    }

    if (tweet.quote) {
      const quoted = renderTweetEmbed(tweet.quote, replyContext);
      quoted.classList.add('twt-quote');
      fragment.appendChild(quoted);
    }

    const footer = document.createElement('div');
    footer.className = 'twt-footer';

    const formattedTime = formatTimestamp(tweet.created_timestamp);
    const timeEl = document.createElement('span');
    timeEl.textContent = formattedTime;
    footer.appendChild(timeEl);

    if (tweet.replies != null) {
      const repliesEl = document.createElement('span');
      repliesEl.innerHTML = `<i class="fa fa-commenting"></i> ${tweet.replies}`;
      footer.appendChild(repliesEl);
    }
    if (tweet.retweets != null) {
      const retweetsEl = document.createElement('span');
      retweetsEl.innerHTML = `<i class="fa fa-retweet"></i> ${tweet.retweets}`;
      footer.appendChild(retweetsEl);
    }
    if (tweet.likes != null) {
      const likesEl = document.createElement('span');
      likesEl.innerHTML = `<i class="fa fa-heart"></i> ${tweet.likes}`;
      footer.appendChild(likesEl);
    }

    fragment.appendChild(footer);

    embed.appendChild(fragment);
    return embed;
  }

  async function loadThreadAndInsert(initialApiPath, replyContext, insertionPoint, maxDepth = 5) {
    const wrapper = document.createElement('div');
    wrapper.className = 'twt-embed twt-threadwrapper';
    if (!isMobileTheme) {
      const margin = computeEmbedMargin(replyContext);
      if (margin) wrapper.style.marginLeft = margin;
    }

    async function loadReplies(fromTweet, depthLimit) {
      const parents = [];
      let current = fromTweet;

      for (let depth = 0; depth < depthLimit - 1; depth++) {
        const parentUser = current.replying_to || current.replying_to_user || current.replying_to_screen_name || null;
        const parentId = current.replying_to_status || null;
        if (!parentUser || !parentId) break;

        const parentApiPath = encodeURIComponent(parentUser) + '/status/' + encodeURIComponent(parentId);
        try {
          const parentTweet = await fetchTweetData(parentApiPath);
          parents.push(parentTweet);
          current = parentTweet;
        } catch (e) {
          parents.push({ __failed: true });
          break;
        }
      }

      return { parents, lastParent: current };
    }

    let initialTweet;
    try {
      initialTweet = await fetchTweetData(initialApiPath);
    } catch (e) {
      insertionPoint.parentNode.insertBefore(makeFailEmbed(replyContext), insertionPoint.nextSibling);
      return;
    }

    const { parents, lastParent } = await loadReplies(initialTweet, maxDepth);
    const ordered = parents.slice().reverse();
    ordered.push(initialTweet);

    for (let i = 0; i < ordered.length; i++) {
      const item = ordered[i];
      const embedEl = item && !item.__failed
      ? renderTweetEmbed(item, replyContext)
      : makeFailEmbed(replyContext);
      if (i < ordered.length - 1) embedEl.classList.add('twt-replychain');
      wrapper.appendChild(embedEl);
    }

    const hasMore = !!(lastParent.replying_to || lastParent.replying_to_user || lastParent.replying_to_screen_name);

    if (hasMore) {
      const loadMore = document.createElement('a');
      loadMore.href = 'javascript:void(0)';
      loadMore.textContent = 'Load more replies';
      loadMore.className = 'twt-loadmore';
      loadMore.style.textAlign = 'center';
      loadMore.style.marginTop = '6px';
      loadMore.style.marginBottom = '-12px';
      loadMore.style.cursor = 'pointer';

      wrapper.insertBefore(loadMore, wrapper.firstChild);

      loadMore.addEventListener('click', async () => {
        loadMore.textContent = 'Loading…';
        loadMore.style.pointerEvents = 'none';

        const { parents: moreParents, lastParent: newLast } = await loadReplies(lastParent, 5);

        const newOrdered = moreParents.slice();
        for (const parent of newOrdered) {
          const el = parent && !parent.__failed
          ? renderTweetEmbed(parent, replyContext)
          : makeFailEmbed(replyContext);
          el.classList.add('twt-replychain');
          wrapper.insertBefore(el, wrapper.firstChild.nextSibling);
        }

        Object.assign(lastParent, newLast);

        const stillHasMore = !!(newLast.replying_to || newLast.replying_to_user || newLast.replying_to_screen_name);

        if (stillHasMore) {
          loadMore.textContent = 'Load more replies';
          loadMore.style.pointerEvents = '';
        } else {
          loadMore.remove();
        }
      });
    }

    insertionPoint.parentNode.insertBefore(wrapper, insertionPoint.nextSibling);
  }

  function computeEmbedMargin(container) {
    const replyContext = container?.closest?.('.post.reply');
    if (!replyContext || isMobileTheme) return '';

    const thumb = replyContext.querySelector?.('.files .file .post-image');
    if (!thumb) return '';

    const w = thumb.style.width;
    if (!w) return '131px';

    const base = parseFloat(w) || 0;
    return (base + 6) + 'px';
  }

  function makeEmbedWrapper(container) {
    const wrap = document.createElement('div');
    wrap.className = 'media-embed';
    wrap.style.marginTop = '6px';
    wrap.style.marginBottom = '6px';
    const ml = computeEmbedMargin(container);
    if (ml) wrap.style.marginLeft = ml;
    return wrap;
  }

  function isYouTubeUrl(value) {
    if (!value) return false;
    try {
      const host = new URL(value, location.href).hostname.toLowerCase();
      return host === 'youtube-nocookie.com' || host.endsWith('.youtube-nocookie.com') ||
             host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be';
    } catch (e) {
      return false;
    }
  }

  function createImageEmbed(container, src) {
    const wrap = makeEmbedWrapper(container);

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    img.loading = 'lazy';

    img.addEventListener('error', () => {
      const replyContext = container.closest('.post.reply');
      const failEmbed = makeFailEmbed(replyContext);
      wrap.replaceWith(failEmbed);
    });

    wrap.appendChild(img);
    container.parentNode.insertBefore(wrap, container.nextSibling);
    return wrap;
  }

  function createMediaEmbed(container, src, isAudio = false) {
    const wrap = makeEmbedWrapper(container);

    const tag = isAudio ? 'audio' : 'video';
    const media = document.createElement(tag);
    media.controls = true;
    media.preload = 'metadata';

    if (!isAudio) {
      media.width = 360;
      media.height = 270;
      media.style.maxWidth = '100%';
      media.style.display = 'block';
    } else {
      media.style.display = 'block';
    }

    media.src = src;

    wrap.appendChild(media);
    container.parentNode.insertBefore(wrap, container.nextSibling);
    return wrap;
  }

  async function onEmbedClick(ev) {
    ev.preventDefault?.();
    const btn = ev.currentTarget;
    if (!btn) return;
    const url = btn.getAttribute('data-embedurl');
    if (!url) return;
    const isYouTubeEmbed = isYouTubeUrl(url);
    if (resizeMedia && isYouTubeEmbed) ev.stopImmediatePropagation?.();

    const container = btn.closest('.embed-container') || btn;
    const nextEmbed = container?.nextElementSibling;
    const isLink = btn.tagName.toLowerCase() === 'a';

    if (nextEmbed && nextEmbed.classList && (nextEmbed.classList.contains('twt-embed') || nextEmbed.classList.contains('media-embed'))) {
      removeEmbedThread(btn);
      return;
    }

    if (btn.dataset.loading === '1') return;
    btn.dataset.loading = '1';
    btn.classList.add('embed-active');
    if (!isLink) btn.textContent = 'Loading…';

    try {
      const replyContext = btn.closest('.post.reply');
      const insertionPoint = btn.closest('.embed-container') || btn;

      const tweetMatch = url.match(TWEET_LINK_RE);
      if (tweetMatch) {
        const user = tweetMatch[1];
        const id = tweetMatch[2];
        const apiUrl = API_PREFIX + encodeURIComponent(user) + '/status/' + encodeURIComponent(id);
        await loadThreadAndInsert(apiUrl, replyContext, insertionPoint, 5);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      const holoplusPost = getHoloplusPost(url);
      if (holoplusPost) {
        await insertHoloplus(holoplusPost, replyContext, insertionPoint);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      if (IMAGE_RE.test(url) || TWIMG_RE.test(url)) {
        createImageEmbed(container, url);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      if (MEDIA_FILE_RE.test(url) || /video\.twimg\.com/i.test(url)) {
        const isAudio = /\.(?:mp3|wav|ogg|aac|m4a)(?:[?#].*)?$/i.test(url);
        createMediaEmbed(container, url, isAudio);
        if (!isLink) btn.textContent = 'Remove';
        delete btn.dataset.loading;
        return;
      }

      const embedWrapper = makeEmbedWrapper(container);

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = 360;
      iframe.height = 270;
      iframe.frameBorder = 0;
      iframe.allowFullscreen = true;
      if (isYouTubeEmbed && resizeMedia) {
        iframe.classList.add('embed');
      } else {
        iframe.style.margin = '10px 0 0 0';
      }

      if (url.includes('vocaroo.com')) {
        iframe.height = 75;
        iframe.allowFullscreen = false;
      } else if (url.includes('pixiv.net')) {
        iframe.width = 400;
        iframe.height = 210;
      }

      embedWrapper.appendChild(iframe);
      if (isYouTubeEmbed && resizeMedia) {
        iframe.classList.add('ts-resize-media-youtube-frame');
        embedWrapper.classList.add('ts-resize-media-youtube');
      }
      container.parentNode.insertBefore(embedWrapper, container.nextSibling);
      if (!isLink) btn.textContent = 'Remove';
    } catch (e) {
      const replyContext = btn.closest('.post.reply');
      const insertionPoint = container || btn;
      insertionPoint.parentNode.insertBefore(makeFailEmbed(replyContext), insertionPoint.nextSibling);
      if (!isLink) btn.textContent = 'Remove';
    } finally {
      delete btn.dataset.loading;
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, '&quot;');
  }

  function processLinks(links, queue = false) {
    if (!linkEmbed && !linkIcon && !linkTitle && !resizeMedia) return;

    const oembedCache = new Map();

    function bindEmbed(a, embedUrl) {
      if (!linkEmbed) return;
      if (a.dataset.embedBound) return;

      if (directButton) {
        a.classList.add('embed-button');
        a.dataset.embedurl = embedUrl;
        a.addEventListener('click', onEmbedClick);
        a.dataset.embedBound = '1';
      } else {
        const btnWrap = makeEmbedButton(embedUrl);
        const btn = btnWrap.querySelector('.embed-button');
        if (btn) btn.addEventListener('click', onEmbedClick);
        a.parentNode?.insertBefore(btnWrap, a.nextSibling);
        a.dataset.embedBound = '1';
      }
    }

    function enqueueOembed(link, apiUrl, label, iconName) {
      let task;

      if (oembedCache.has(apiUrl)) {
        task = () => oembedCache.get(apiUrl).then(data => applyOembed(link, data, label, iconName));
      } else {
        const promise = fetch(apiUrl)
        .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
        .catch(() => null);
        oembedCache.set(apiUrl, promise);
        task = async () => applyOembed(link, await promise, label, iconName);
      }

      if (queue) {
        fetchTasks.push(task);
        if (!fetchProcessing) fetchQueue(5);
      } else {
        task();
      }
    }

    function queueHoloplusTitle(link, post) {
      const task = async () => {
        try {
          const page = await fetchHoloplusPage(post);
          const title = holoplusTitle(page);
          if (!title || !link.isConnected) return;
          link.replaceChildren();
          if (linkIcon) {
            const icon = document.createElement('i');
            icon.className = 'fa fa-holoplus';
            link.appendChild(icon);
          }
          link.appendChild(document.createTextNode(`[holoplus] ${title}`));
          link.style.textDecoration = 'none';
          link.dataset.decorated = '1';
        } catch (e) {}
      };

      if (queue) {
        fetchTasks.push(task);
        if (!fetchProcessing) fetchQueue(5);
      } else {
        task();
      }
    }

    function applyOembed(link, data, label, iconName) {
      const title = getOembedTitle(data);
      if (!title) return;
      const iconHTML = linkIcon ? `<i class="fa fa-${iconName}"></i>` : "";
      link.innerHTML = `${iconHTML}${label} ${escapeHtml(title)}`;
      link.style.textDecoration = "none";
      link.dataset.decorated = '1';
    }

    function prependIcon(link, faName) {
      if (!linkIcon) return;
      if (link.dataset.iconAdded) return;
      link.dataset.iconAdded = "1";
      const icon = document.createElement('i');
      icon.className = `fa fa-${faName}`;
      link.prepend(icon);
      link.dataset.decorated = link.dataset.decorated || '1';
    }

    for (let i = 0; i < links.length; i++) {
      let a = links[i];
      if (!a.href || !a.href.startsWith('http')) continue;

      let host = a.hostname;
      let match;
      const holoplusPost = getHoloplusPost(a.href);

      if (rerouteCatbox && CATBOX_HOSTS.includes(host)) {
        a.href = rerouteCatboxUrl(a.href);
        host = a.hostname;
      }

      const maybeNext = a.nextElementSibling;
      const existingBtn = maybeNext?.classList?.contains('embed-container')
        ? maybeNext.querySelector('.embed-button')
        : null;

      if (resizeMedia && existingBtn && !a.dataset.embedBound && isYouTubeUrl(existingBtn.getAttribute('data-embedurl'))) {
        const embedUrl = existingBtn.getAttribute('data-embedurl') || a.href;
        if (linkEmbed && directButton) {
          a.classList.add('embed-button');
          a.setAttribute('data-embedurl', embedUrl);
          a.addEventListener('click', onEmbedClick);
          a.dataset.embedBound = '1';
          maybeNext.remove();
        } else {
          const resizeButton = makeEmbedButton(embedUrl).querySelector('.embed-button');
          existingBtn.replaceWith(resizeButton);
          resizeButton.addEventListener('click', onEmbedClick);
          a.dataset.embedBound = '1';
        }
      } else if (linkEmbed && maybeNext && maybeNext.classList?.contains('embed-container')) {

        if (existingBtn && (IMAGE_RE.test(a.href) || TWIMG_RE.test(a.href) || MEDIA_FILE_RE.test(a.href))) {
          if (directButton) {
            const embedUrl = existingBtn.getAttribute('data-embedurl') || a.href;
            a.classList.add('embed-button');
            a.setAttribute('data-embedurl', embedUrl);
            a.addEventListener('click', onEmbedClick);
            a.dataset.embedBound = '1';
            maybeNext.remove();
          } else {
            const newBtnWrap = makeEmbedButton(a.href);
            const newBtn = newBtnWrap.querySelector('.embed-button');
            if (newBtn && !newBtn.getAttribute('data-embedurl')) newBtn.setAttribute('data-embedurl', a.href);

            try {
              existingBtn.parentNode.replaceChild(newBtn, existingBtn);
            } catch {
              a.parentNode?.insertBefore(newBtnWrap, a.nextSibling);
              maybeNext.remove();
            }

            newBtn?.addEventListener('click', onEmbedClick);
            a.dataset.embedBound = '1';
            newBtn && (newBtn.dataset.embedBound = '1');
          }
        } else if (existingBtn) {
          if (directButton) {
            const embedUrl = existingBtn.getAttribute('data-embedurl') || a.href;
            a.classList.add('embed-button');
            a.dataset.embedurl = embedUrl;
            a.addEventListener('click', onEmbedClick);
            a.dataset.embedBound = '1';
            maybeNext.remove();
          } else {
            a.dataset.embedBound = '1';
          }
        }
      }

      if ((linkEmbed && a.dataset.embedBound) && ((linkIcon || linkTitle) && a.dataset.decorated)) continue;

      if (linkEmbed && a.classList.contains('embed-button')) {
        a.dataset.embedBound = '1';
      }

      if (holoplusPost) {
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, holoplusPost.url);
        if (linkIcon) prependIcon(a, 'holoplus');
        if (linkTitle) queueHoloplusTitle(a, holoplusPost);
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if ((host.includes('youtube.com') || host === 'youtu.be')) {
        if ((match = a.href.match(YT_LINK_RE))) {
          const videoId = match[1];

          let startSeconds = 0;
          const tMatch = a.href.match(/[?&#](?:t|start)=([\dhms]+)/i);
          if (tMatch) {
            const raw = tMatch[1];
            if (/^\d+$/.test(raw)) {
              startSeconds = +raw;
            } else {
              const hh = raw.match(/(\d+)h/);
              const mm = raw.match(/(\d+)m/);
              const ss = raw.match(/(\d+)s/);
              startSeconds = (hh ? +hh[1] * 3600 : 0) + (mm ? +mm[1] * 60 : 0) + (ss ? +ss[1] : 0);
            }
          }

          if (linkEmbed && !a.dataset.embedBound) {
            let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
            if (startSeconds > 0) embedUrl += `?start=${startSeconds}`;
            bindEmbed(a, embedUrl);
          }

          if (linkIcon || linkTitle) {
            if (linkIcon) prependIcon(a, 'youtube-play');

            if (linkTitle) {
              const timeLabel = startSeconds > 0
              ? (Math.floor(startSeconds / 3600) > 0
                 ? ` <b>[${Math.floor(startSeconds / 3600)}:${String(Math.floor((startSeconds % 3600) / 60)).padStart(2, "0")}:${String(startSeconds % 60).padStart(2, "0")}]</b>`
                 : ` <b>[${Math.floor(startSeconds / 60)}:${String(startSeconds % 60).padStart(2, "0")}]</b>`)
              : "";

              const apiUrl = `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D${videoId}&format=json`;
              enqueueOembed(a, apiUrl, `[YouTube]${timeLabel}`, 'youtube-play');
            }
          }

          if ((linkEmbed && a.dataset.embedBound) || (linkIcon || linkTitle)) {
            a.dataset.decorated = a.dataset.decorated || '1';
          }
          continue;
        }

        if ((match = a.href.match(YT_PLAYLIST_RE))) {
          const playlistId = match[1];

          if (linkEmbed && !a.dataset.embedBound) {
            bindEmbed(a, `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`);
          }

          if (linkIcon || linkTitle) {
            if (linkIcon) prependIcon(a, 'youtube-play');
            if (linkTitle) {
              const apiUrl = `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/playlist%3Flist%3D${playlistId}&format=json`;
              enqueueOembed(a, apiUrl, `[Playlist]`, 'youtube-play');
            }
          }

          a.dataset.decorated = a.dataset.decorated || '1';
          continue;
        }

        continue;
      }

      if ((host === 'x.com' || host.includes('twitter.com')) && TWEET_LINK_RE.test(a.href)) {
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, a.href);
        if (linkIcon) prependIcon(a, host === 'x.com' ? 'x' : 'twt');
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if (host.includes('streamable.com') && (match = a.href.match(STREAMABLE_LINK_RE))) {
        const id = match[1];
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, `https://streamable.com/e/${id}`);
        if (linkIcon || linkTitle) {
          if (linkIcon) prependIcon(a, 'streamable');
          if (linkTitle) enqueueOembed(a, `https://api.streamable.com/oembed?url=https://streamable.com/${id}`, '[Streamable]', 'streamable');
        }
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if ((host.includes('vocaroo.com') || host === 'voca.ro') && (match = a.href.match(VOCAROO_LINK_RE))) {
        const id = match[1];
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, `https://vocaroo.com/embed/${id}`);
        if (linkIcon) prependIcon(a, 'vocaroo');
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if (host.includes('twitch.tv')) {
        if ((match = a.href.match(TWITCH_CLIP_RE))) {
          const clipId = match[1];
          if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, `https://clips.twitch.tv/embed?clip=${clipId}&parent=${location.hostname}`);
          if (linkIcon) prependIcon(a, 'twitchtv');
          a.dataset.decorated = a.dataset.decorated || '1';
          continue;
        }

        if ((match = a.href.match(TWITCH_LINK_RE))) {
          const vodId = match[1];
          const vodTime = match[2];
          const channel = match[3];
          if (linkEmbed && !a.dataset.embedBound) {
            let embedUrl;
            if (vodId) {
              embedUrl = `https://player.twitch.tv/?video=${vodId}`;
              if (vodTime) embedUrl += `&time=${vodTime}`;
            } else if (channel) {
              embedUrl = `https://player.twitch.tv/?channel=${channel}`;
            }
            embedUrl += `&parent=${location.hostname}`;
            bindEmbed(a, embedUrl);
          }
          if (linkIcon) prependIcon(a, 'twitchtv');
          a.dataset.decorated = a.dataset.decorated || '1';
          continue;
        }
      }

      if (IMAGE_RE.test(a.href) || TWIMG_RE.test(a.href)) {
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, a.href);
        if (linkIcon) prependIcon(a, 'image');
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }

      if (MEDIA_FILE_RE.test(a.href) || host === 'video.twimg.com') {
        if (linkIcon) {
          const ext = a.href.split('.').pop().split(/[?#]/)[0].toLowerCase();
          const isAudio = ext === 'ogg' || ext === 'mp3' || ext === 'wav' || ext === 'aac' || ext === 'm4a';
          prependIcon(a, isAudio ? 'music' : 'film');
        }
        if (linkEmbed && !a.dataset.embedBound) bindEmbed(a, a.href);
        a.dataset.decorated = a.dataset.decorated || '1';
        continue;
      }
    }
  }

  const youPostIds = new Set();
  const ownPostIds = new Set();

  const OWN_POSTS_STORAGE_KEY = 'own_posts';
  let ownershipSnapshot = null;
  const ownershipInitialPosts = new WeakSet();
  const ownershipMenuIdentities = new WeakMap();
  const ownershipNavInstalled = { mobile: false, desktop: false };

  function normalizePostId(value) {
    const id = String(value ?? '').trim();
    return /^\d+$/.test(id) ? id : null;
  }

  function normalizeOwnershipBoard(value) {
    const board = String(value ?? '').trim();
    return /^[a-zA-Z0-9_-]+$/.test(board) ? board : null;
  }

  function parseOwnPosts(value) {
    const byBoard = new Map();
    let stored = {};

    if (value !== null && value !== undefined) {
      try {
        stored = JSON.parse(value) || {};
      } catch (e) {
        return byBoard;
      }
    }

    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
      return byBoard;
    }

    for (const [board, values] of Object.entries(stored)) {
      const normalizedBoard = normalizeOwnershipBoard(board);
      if (!normalizedBoard || !Array.isArray(values)) continue;
      const ids = byBoard.get(normalizedBoard) || new Set();
      for (const value of values) {
        const id = normalizePostId(value);
        if (id) ids.add(id);
      }
      byBoard.set(normalizedBoard, ids);
    }

    return byBoard;
  }

  function readOwnPosts() {
    return parseOwnPosts(localStorage.getItem(OWN_POSTS_STORAGE_KEY));
  }

  function makeOwnershipKey(board, id) {
    return `${board}\u0000${id}`;
  }

  function updateOwnershipSnapshot(board, id, owned) {
    if (!ownershipSnapshot) return;
    const ids = ownershipSnapshot.get(board) || new Set();
    if (owned) ids.add(id);
    else ids.delete(id);
    if (ids.size) ownershipSnapshot.set(board, ids);
    else ownershipSnapshot.delete(board);
  }

  function findAffectedPosts(board, id) {
    const posts = new Set();
    const postCandidates = document.querySelectorAll('.post.op, .post.reply');
    for (let i = 0; i < postCandidates.length; i++) {
      const post = postCandidates[i];
      const identity = getPostIdentity(post);
      const sourceMatches = normalizeOwnershipBoard(identity?.board) === board &&
        normalizePostId(identity?.id) === id;
      const quoteMatches = getOwnershipQuotes(post, identity).some(target =>
        target.board === board && target.id === id
      );
      if (sourceMatches || quoteMatches) {
        posts.add(post);
      }
    }

    return posts;
  }

  function reconcileOwnershipChange(board, id, previousOwnPostsByBoard, ownPostsByBoard) {
    const targetPosts = findAffectedPosts(board, id);
    const menuItem = document.querySelector('.post-menu #ts-mark-you');
    const menuIdentity = menuItem ? ownershipMenuIdentities.get(menuItem) : null;
    const menuRelevant = !!menuItem &&
      normalizeOwnershipBoard(menuIdentity?.board) === board &&
      normalizePostId(menuIdentity?.id) === id;
    const quoteCache = new Map();
    let navigationChanged = false;
    let faviconChanged = false;
    let staleMembershipChanged = false;
    const unreadIds = rememberLastRead ? unreadSet : sessionUnreadPostIds;

    if (board === currentBoard && (ownPostIds.has(id) || youPostIds.has(id))) {
      const hasSourcePost = Array.from(targetPosts).some(post => {
        const identity = getPostIdentity(post);
        return isSourcePost(post, identity) && identity.board === board && identity.id === id;
      });
      if (!hasSourcePost) {
        const sourcePost = getNavigationPost(id);
        if (sourcePost) {
          targetPosts.add(sourcePost);
        } else {
          const wasYou = youPostIds.delete(id);
          const wasOwn = ownPostIds.delete(id);
          if (wasYou || wasOwn) {
            navigationChanged = true;
            staleMembershipChanged = true;
            if (wasYou && enableFaviconChanges && notifyNewYou && unreadIds.has(id)) faviconChanged = true;
          }
        }
      }
    }

    if (!targetPosts.size && !menuRelevant && !staleMembershipChanged) return;

    const changedKey = makeOwnershipKey(board, id);
    for (const post of targetPosts) {
      const identity = getPostIdentity(post);
      const sourcePost = isSourcePost(post, identity);
      const quotes = getOwnershipQuotes(post, identity);
      quoteCache.set(post, quotes);
      if (sourcePost && identity) {
        const board = normalizeOwnershipBoard(identity.board);
        const id = normalizePostId(identity.id);
        if (board && id) {
          const previousOwn = !!previousOwnPostsByBoard.get(board)?.has(id);
          const nextOwn = !!ownPostsByBoard.get(board)?.has(id);
          if (previousOwn !== nextOwn) navigationChanged = true;

          let previousYou = false;
          let nextYou = false;
          let previousYouPost = false;
          let nextYouPost = false;
          for (const target of quotes) {
            const previous = !!previousOwnPostsByBoard.get(target.board)?.has(target.id);
            const next = !!ownPostsByBoard.get(target.board)?.has(target.id);
            previousYouPost ||= previous;
            nextYouPost ||= next;
            if (target.board !== board || target.id !== id) {
              previousYou ||= previous;
              nextYou ||= next;
            }
          }
          if (previousYou !== nextYou) navigationChanged = true;
          if (enableFaviconChanges && notifyNewYou && unreadIds.has(id) && previousYouPost !== nextYouPost) {
            faviconChanged = true;
          }
        }
      }
      updateOwnership(post, ownPostsByBoard, false, changedKey, quotes);
    }

    if (menuRelevant) refreshOwnershipMenu(ownPostsByBoard);
    const layoutPostAffected = Array.from(targetPosts).some(post => post.isConnected);
    if (currentThreadId && scrollMarker && (layoutPostAffected || staleMembershipChanged || menuRelevant)) {
      scheduleRailRebuild();
    }
    if (navigationChanged) {
      invalidateNavigationLists();
      refreshNavigation(true, null, false, quoteCache);
    }
    if (faviconChanged) refreshYouFavicon();

  }

  function getPostId(post) {
    if (!post || post.nodeType !== Node.ELEMENT_NODE) return null;

    const canonical = post.id?.match(/^(?:reply|op)_(\d+)$/);
    if (canonical) return canonical[1];

    const hover = post.id?.match(/^post-hover-(\d+)$/);
    if (hover) return hover[1];

    const inlineId = post.closest('.inline-quote-container')?.getAttribute('data-inlined-id');
    const inlineMatch = inlineId?.match(/^(\d+)$/);
    if (inlineMatch) return inlineMatch[1];

    const dataId = normalizePostId(post.getAttribute('data-post-id'));
    if (dataId) return dataId;

    const anchorId = post.querySelector('.intro a.post_no[id^="post_no_"]')?.id.match(/^post_no_(\d+)$/);
    if (anchorId) return anchorId[1];

    const postNoText = post.querySelector('.intro a.post_no')?.textContent?.match(/(\d+)\s*$/);
    return postNoText ? postNoText[1] : null;
  }

  function getPostIdentity(post) {
    const id = getPostId(post);
    const board = post?.getAttribute('data-board') ||
      post?.closest('[data-board]')?.getAttribute('data-board') ||
      currentBoard ||
      document.querySelector('input[name="board"]')?.value ||
      null;
    return id && board ? { board, id } : null;
  }

  function getQuoteLinks(post) {
    const body = Array.from(post?.children || []).find(child => child.classList?.contains('body'));
    if (!body) return [];
    return Array.from(body.querySelectorAll('a:not([rel="nofollow"]):not(.hash-link)'))
      .filter(link => link.closest('.post.op, .post.reply') === post);
  }

  function isSourcePost(post, identity) {
    return !!identity &&
      post.isConnected &&
      identity.board === currentBoard &&
      /^(?:reply|op)_\d+$/.test(post.id || '') &&
      !post.classList.contains('inline-cloned-post') &&
      !post.closest('.inline-cloned-post, .inline-quote-container, .post-hover') &&
      !post.closest('.thread[data-cached="yes"], .thread[id^="thread_iqdummy_"], .thread[id^="thread_archdummy_"], .thread[id^="thread_archcache_"]');
  }

  function getQuoteTarget(link, sourceBoard) {
    if (!link || link.getAttribute('rel') === 'nofollow') return null;

    const text = (link.textContent || '').trim();
    const textMatch = text.match(/^>>>\s*\/([a-zA-Z0-9_-]+)\/(\d+)\b|^>>\s*(?:\/([a-zA-Z0-9_-]+)\/)?(\d+)\b/);
    if (!textMatch) return null;

    let board = textMatch[1] || textMatch[3] || null;
    const id = textMatch[2] || textMatch[4];
    if (!board) {
      try {
        const url = new URL(link.getAttribute('href') || link.href, location.href);
        const pathMatch = url.pathname.match(/^\/([a-zA-Z0-9_-]+)\/(?:res\/\d+|post\/\d+|thread\/\d+)/);
        if (pathMatch) board = pathMatch[1];
      } catch (e) {}
    }

    return { board: board || sourceBoard, id };
  }

  function getOwnershipQuotes(post, identity) {
    return getQuoteLinks(post).map(link => {
      const target = getQuoteTarget(link, identity?.board);
      return { link, board: normalizeOwnershipBoard(target?.board), id: normalizePostId(target?.id) };
    });
  }

  function hasOwnedQuote(post, ownPostsByBoard, sourceIdentity = getPostIdentity(post), excludeSelf = false, quotes = null) {
    if (!sourceIdentity) return false;
    for (const target of quotes || getOwnershipQuotes(post, sourceIdentity)) {
      if (!target?.board) continue;
      if (excludeSelf && target.board === sourceIdentity.board && target.id === sourceIdentity.id) continue;
      if (ownPostsByBoard.get(target.board)?.has(target.id)) return true;
    }

    return false;
  }

  function getQuoteYouTags(link) {
    const tags = [];
    let node = link?.nextSibling;

    while (node) {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
        node = node.nextSibling;
        continue;
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('a.hash-link')) {
        node = node.nextSibling;
        continue;
      }
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SMALL' && node.textContent.trim() === '(You)') {
        tags.push(node);
        node = node.nextSibling;
        continue;
      }
      break;
    }

    return tags;
  }

  function updateQuoteLabel(link, shouldOwn) {
    const tags = getQuoteYouTags(link);
    const inlineLabels = Array.from(link.children).filter(isQuoteYouSpan);

    if (!shouldOwn) {
      for (const label of inlineLabels) label.remove();
      for (const tag of tags) tag.remove();
      return;
    }

    if (appendQuotes) {
      let inlineLabel = inlineLabels[0] || null;
      if (!inlineLabel) {
        inlineLabel = document.createElement('span');
        inlineLabel.textContent = ' (You)';
        link.appendChild(inlineLabel);
      }
      for (const duplicate of inlineLabels) {
        if (duplicate !== inlineLabel) duplicate.remove();
      }
      const hiddenSmall = tags[0] || null;
      if (hiddenSmall) {
        hiddenSmall.style.setProperty('display', 'none', 'important');
      }
      for (const duplicate of tags) {
        if (duplicate !== hiddenSmall) duplicate.remove();
      }
      return;
    }

    for (const label of inlineLabels) label.remove();
    let smallLabel = tags[0] || null;
    if (!smallLabel) {
      smallLabel = document.createElement('small');
      smallLabel.textContent = '(You)';
      link.after(smallLabel);
    }
    for (const duplicate of tags) {
      if (duplicate !== smallLabel) duplicate.remove();
    }
  }

  function renderOwnLabel(post, shouldOwn, identity = getPostIdentity(post)) {
    const intro = Array.from(post?.children || []).find(child => child.classList?.contains('intro')) || null;
    const labels = intro ? Array.from(intro.querySelectorAll('span.own_post'))
      .filter(label => label.closest('.post.op, .post.reply') === post) : [];
    const thread = post.classList.contains('op') ? post.closest('.thread') : null;
    const realOpThread = thread && identity && thread.id === `thread_${identity.id}`;

    if (!shouldOwn) {
      for (const label of labels) label.remove();
      post.classList.remove('you');
      if (realOpThread) thread.classList.remove('you');
      return;
    }

    post.classList.add('you');
    if (realOpThread) thread.classList.add('you');
    let label = labels[0] || null;
    if (!label) {
      const name = intro?.querySelector('span.name');
      if (!name) return;
      label = document.createElement('span');
      label.className = 'own_post';
      label.textContent = '(You)';
      name.appendChild(document.createTextNode(' '));
      name.appendChild(label);
    }
    for (const duplicate of labels) {
      if (duplicate !== label) duplicate.remove();
    }
  }

  function renderOwnership(post, ownPostsByBoard, identity = getPostIdentity(post), changedKey = null, quotes = null) {
    if (!identity) return { identity: null, own: false, quoting: false };

    const ownedBoard = normalizeOwnershipBoard(identity.board);
    const ownedId = normalizePostId(identity.id);
    const ownKey = ownedBoard && ownedId ? makeOwnershipKey(ownedBoard, ownedId) : null;
    const ownChanged = !changedKey || ownKey === changedKey;

    const own = !!ownedBoard && !!ownedId && !!ownPostsByBoard.get(ownedBoard)?.has(ownedId);
    if (ownChanged) renderOwnLabel(post, own, identity);

    let quoting = false;
    for (const target of quotes || getOwnershipQuotes(post, identity)) {
      const { link, board: targetBoard, id: targetId } = target;
      const targetKey = targetBoard && targetId ? makeOwnershipKey(targetBoard, targetId) : null;
      const targetChanged = !changedKey || targetKey === changedKey;
      const targetOwned = !!targetBoard && !!targetId && !!ownPostsByBoard.get(targetBoard)?.has(targetId);
      if (targetOwned) quoting = true;
      if (targetChanged) updateQuoteLabel(link, targetOwned);
    }

    post.classList.toggle('quoting-you', highlightPosts && quoting);
    return { identity, own, quoting };
  }

  function reconcileOwnershipContent(root, options = {}) {
    if (!root) return;
    const posts = new Set();

    if (root.matches?.('.post.op, .post.reply')) posts.add(root);
    const parentPost = root.closest?.('.post.op, .post.reply');
    if (parentPost) posts.add(parentPost);
    root.querySelectorAll?.('.post.op, .post.reply').forEach(post => posts.add(post));

    if (posts.size) reconcileOwnership(Array.from(posts), options);
  }

  function updateOwnership(post, ownPostsByBoard, notifyNewReply = false, changedKey = null, quotes = null) {
    const previousIdentity = getPostIdentity(post);
    const sourcePost = isSourcePost(post, previousIdentity);
    const wasYou = sourcePost && youPostIds.has(previousIdentity.id);
    const wasOwn = sourcePost && ownPostIds.has(previousIdentity.id);
    const state = renderOwnership(post, ownPostsByBoard, previousIdentity, changedKey, quotes);
    if (!sourcePost || !state.identity) return false;

    if (state.own) ownPostIds.add(state.identity.id);
    else ownPostIds.delete(state.identity.id);
    if (state.quoting) youPostIds.add(state.identity.id);
    else youPostIds.delete(state.identity.id);

    if (notifyNewReply && postsInitialized && !wasYou && state.quoting) {
      showYouNotification(post);
    }

    return wasYou !== state.quoting || wasOwn !== state.own;
  }

  function refreshOwnershipMenu(ownPostsByBoard) {
    const item = document.querySelector('.post-menu #ts-mark-you');
    if (!item) return;
    const identity = ownershipMenuIdentities.get(item);
    const board = normalizeOwnershipBoard(identity?.board);
    const id = normalizePostId(identity?.id);
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (!board || !id || !checkbox) return;

    const owned = !!board && !!ownPostsByBoard.get(board)?.has(id);
    checkbox.checked = owned;
  }

  function refreshYouFavicon() {
    if (!enableFaviconChanges) return;

    const unreadIds = rememberLastRead ? unreadSet : sessionUnreadPostIds;

    if (!unreadIds.size) {
      if (requestedFaviconState !== 'none' || alertState !== 'none') revertFavicon();
      return;
    }

    let hasYouUnread = false;
    if (notifyNewYou) {
      for (const id of unreadIds) {
        if (youPostIds.has(id)) {
          hasYouUnread = true;
          break;
        }
      }
    }

    if (hasYouUnread) updateFavicon('red');
    else if (requestedFaviconState === 'red' || alertState === 'red') {
      if (notifyNewPost) updateFavicon('white');
      else revertFavicon();
    } else if ((requestedFaviconState === 'white' || alertState === 'white') && !notifyNewPost) {
      revertFavicon();
    }
  }

  function reconcileOwnership(posts = null, options = {}) {
    const fullRefresh = !posts;
    const oldYouIds = fullRefresh ? new Set(youPostIds) : null;
    const oldOwnIds = fullRefresh ? new Set(ownPostIds) : null;
    const ownPostsByBoard = options.ownPostsByBoard || readOwnPosts();
    const targetPosts = fullRefresh
      ? Array.from(document.querySelectorAll('.post.op, .post.reply'))
      : Array.from(new Set(Array.isArray(posts) ? posts : [posts])).filter(Boolean);
    const hasSourcePosts = !fullRefresh && targetPosts.some(post =>
      post?.matches?.('.post.op, .post.reply') && isSourcePost(post, getPostIdentity(post))
    );

    if (hasSourcePosts && !options.refreshNavigation) invalidateNavigationLists();

    if (fullRefresh) {
      youPostIds.clear();
      ownPostIds.clear();
    }

    let anyChange = false;
    for (const post of targetPosts) {
      if (!post?.matches?.('.post.op, .post.reply')) continue;
      if (options.markInitialPosts) ownershipInitialPosts.add(post);
      anyChange = updateOwnership(post, ownPostsByBoard, !!options.notifyNewReply) || anyChange;
    }
    refreshOwnershipMenu(ownPostsByBoard);

    if (fullRefresh) {
      anyChange = oldYouIds.size !== youPostIds.size ||
        oldOwnIds.size !== ownPostIds.size ||
        [...oldYouIds].some(id => !youPostIds.has(id)) ||
        [...oldOwnIds].some(id => !ownPostIds.has(id));
    }

    if (currentThreadId && (anyChange || options.forceRail)) scheduleRailRebuild();
    if (options.refreshFavicon) refreshYouFavicon();

    if (options.refreshNavigation) {
      invalidateNavigationLists();
      refreshNavigation(true);
    }
    return { ownPostsByBoard, anyChange };
  }

  function setPostOwned(board, postId, shouldOwn) {
    const normalizedBoard = normalizeOwnershipBoard(board);
    const id = normalizePostId(postId);
    if (!normalizedBoard || !id) return false;

    const ownPostsByBoard = readOwnPosts();
    const ids = ownPostsByBoard.get(normalizedBoard) || new Set();
    const wasOwn = ids.has(id);
    if (wasOwn === shouldOwn) return false;
    const previousOwnPostsByBoard = new Map(ownershipSnapshot || ownPostsByBoard);
    const previousIds = new Set(previousOwnPostsByBoard.get(normalizedBoard) || []);
    if (wasOwn) previousIds.add(id);
    else previousIds.delete(id);
    if (previousIds.size) previousOwnPostsByBoard.set(normalizedBoard, previousIds);
    else previousOwnPostsByBoard.delete(normalizedBoard);

    if (shouldOwn) ids.add(id);
    else ids.delete(id);
    ownPostsByBoard.set(normalizedBoard, ids);

    const stored = {};
    for (const [storedBoard, storedIds] of ownPostsByBoard) {
      stored[storedBoard] = Array.from(storedIds);
    }
    localStorage.setItem(OWN_POSTS_STORAGE_KEY, JSON.stringify(stored));
    updateOwnershipSnapshot(normalizedBoard, id, shouldOwn);
    reconcileOwnershipChange(normalizedBoard, id, previousOwnPostsByBoard, ownPostsByBoard);
    return true;
  }

  function initializeOwnershipMenu() {
    if (typeof Menu === 'undefined' || typeof Menu.onclick !== 'function' || typeof Menu.add_item !== 'function') return;
    Menu.onclick((event, menu) => {
      const postButton = event.target instanceof Element ? event.target : null;
      const post = postButton?.closest('.post.op, .post.reply');
      const identity = getPostIdentity(post);
      const item = menu.find('#ts-mark-you');
      if (!identity || !item.length) return;
      const itemIdentity = {
        board: normalizeOwnershipBoard(identity.board),
        id: normalizePostId(identity.id)
      };
      if (!itemIdentity.board || !itemIdentity.id) return;

      const owned = !!readOwnPosts().get(itemIdentity.board)?.has(itemIdentity.id);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = owned;
      checkbox.setAttribute('aria-label', 'You');
      checkbox.style.cssText = 'margin: 0 5px 0 0; vertical-align: middle;';

      const label = document.createElement('label');
      label.style.cssText = 'display: flex; align-items: center; cursor: pointer;';
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode('You'));

      item.empty()
        .append(label)
        .on('click.tsOwnership', clickEvent => {
          clickEvent.preventDefault();
          const next = !readOwnPosts().get(itemIdentity.board)?.has(itemIdentity.id);
          checkbox.checked = next;
          setPostOwned(itemIdentity.board, itemIdentity.id, next);
        });
      ownershipMenuIdentities.set(item[0], itemIdentity);

      const copyTextItem = menu.find('#copy-text');
      if (copyTextItem.length) item.insertAfter(copyTextItem);
    });

    Menu.add_item('ts-mark-you', 'You');
  }

  const ownershipNavigation = {
    mobile: { meIds: [], youIds: [], meIndex: -1, youIndex: -1, meTarget: null, youTarget: null },
    desktop: { meIds: [], youIds: [], meIndex: -1, youIndex: -1, meTarget: null, youTarget: null }
  };
  let ownershipNavigationListsCache = null;

  function invalidateNavigationLists() {
    ownershipNavigationListsCache = null;
  }

  function getNavigationLists(quoteCache = null) {
    if (ownershipNavigationListsCache) return ownershipNavigationListsCache;

    const ownPostsByBoard = readOwnPosts();
    const ownedIds = ownPostsByBoard.get(currentBoard) || new Set();
    const posts = Array.from(document.querySelectorAll('.post.op[id^="op_"], .post.reply[id^="reply_"]'))
      .filter(post => isSourcePost(post, getPostIdentity(post)));
    const meIds = [];
    const youIds = [];

    for (const post of posts) {
      const identity = getPostIdentity(post);
      if (!identity || identity.board !== currentBoard) continue;
      if (ownedIds.has(identity.id)) meIds.push(identity.id);
      if (identity.id !== null && hasOwnedQuote(post, ownPostsByBoard, identity, true, quoteCache?.get(post))) {
        youIds.push(identity.id);
      }
    }

    ownershipNavigationListsCache = { meIds, youIds };
    return ownershipNavigationListsCache;
  }

  function getNavigationPost(id) {
    const posts = document.querySelectorAll(`.post#reply_${id}, .post#op_${id}`);
    return Array.from(posts).find(post => isSourcePost(post, getPostIdentity(post))) || null;
  }

  function setNavigationTarget(mode, type, id, scroll = false) {
    const state = ownershipNavigation[mode];
    const targetKey = `${type}Target`;
    const otherTarget = state[type === 'me' ? 'youTarget' : 'meTarget'];
    const previous = state[targetKey];

    if (previous && previous !== id && previous !== otherTarget) {
      getNavigationPost(previous)?.classList.remove('jump-target');
    }

    state[targetKey] = id || null;
    if (!id) return;

    const post = getNavigationPost(id);
    if (!post) return;
    post.classList.add('jump-target');
    if (scroll) post.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setNavigationStatus(mode) {
    const state = ownershipNavigation[mode];
    const meStatus = document.getElementById(mode === 'mobile' ? 'mbYouMeStatus' : 'mbDFMeStatus');
    const youStatus = document.getElementById(mode === 'mobile' ? 'mbYouStatus' : 'mbDFYouStatus');
    const format = (index, ids) => {
      if (!ids.length) return '0';
      if (mode === 'desktop' && index < 0) return String(ids.length);
      return `${Math.max(0, index) + 1}/${ids.length}`;
    };

    if (meStatus) meStatus.textContent = format(state.meIndex, state.meIds);
    if (youStatus) youStatus.textContent = format(state.youIndex, state.youIds);
  }

  function refreshNavigation(preserveTargets = true, onlyMode = null, justOpened = false, quoteCache = null) {
    if (!ownershipNavInstalled.mobile && !ownershipNavInstalled.desktop) return;
    const modes = onlyMode ? [onlyMode] : ['mobile', 'desktop'].filter(mode => ownershipNavInstalled[mode]);
    const activeModes = modes.filter(mode => {
      const root = document.getElementById(mode === 'mobile' ? 'mobileYouDrawer' : 'mbDesktopFloat');
      return !!root;
    });
    if (!activeModes.length) return;

    const lists = getNavigationLists(quoteCache);

    for (const mode of activeModes) {
      const root = document.getElementById(mode === 'mobile' ? 'mobileYouDrawer' : 'mbDesktopFloat');
      const isOpen = root.classList.contains('open');
      const state = ownershipNavigation[mode];
      const oldMeIndex = state.meIndex;
      const oldYouIndex = state.youIndex;
      let meTarget = preserveTargets ? state.meTarget : null;
      let youTarget = preserveTargets ? state.youTarget : null;

      if (justOpened) {
        const active = Array.from(document.querySelectorAll('.jump-target'))
          .filter(post => isSourcePost(post, getPostIdentity(post)))
          .map(post => getPostId(post))
          .find(id => id && (lists.meIds.includes(id) || lists.youIds.includes(id))) || null;
        if (mode === 'mobile') {
          state.meIndex = lists.meIds.length ? 0 : -1;
          state.youIndex = lists.youIds.length ? 0 : -1;
          meTarget = active && lists.meIds.includes(active) ? active : null;
          youTarget = active && lists.youIds.includes(active) ? active : null;
        } else {
          state.meIndex = -1;
          state.youIndex = -1;
          meTarget = active && lists.meIds.includes(active) ? active : null;
          youTarget = active && lists.youIds.includes(active) ? active : null;
        }
      } else if (preserveTargets) {
        const reconcileTarget = (target, oldIndex, ids) => {
          if (!ids.length) return { index: -1, target: null };
          if (target && ids.includes(target)) return { index: ids.indexOf(target), target };
          if (target) {
            const index = Math.min(Math.max(oldIndex, 0), ids.length - 1);
            return { index, target: ids[index] };
          }
          return {
            index: oldIndex < 0 ? -1 : Math.min(oldIndex, ids.length - 1),
            target: null
          };
        };
        const me = reconcileTarget(meTarget, oldMeIndex, lists.meIds);
        const you = reconcileTarget(youTarget, oldYouIndex, lists.youIds);
        state.meIndex = me.index;
        state.youIndex = you.index;
        meTarget = me.target;
        youTarget = you.target;
      } else if (!isOpen) {
        state.meIndex = -1;
        state.youIndex = -1;
      }

      state.meIds = lists.meIds;
      state.youIds = lists.youIds;

      if (meTarget !== state.meTarget) setNavigationTarget(mode, 'me', meTarget, false);
      else state.meTarget = meTarget;
      if (youTarget !== state.youTarget) setNavigationTarget(mode, 'you', youTarget, false);
      else state.youTarget = youTarget;

      setNavigationStatus(mode);
    }
  }

  function handleNavigationClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const desktopClear = target.closest('#mbDFClearHL');
    if (desktopClear) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const state = ownershipNavigation.desktop;
      setNavigationTarget('desktop', 'me', null, false);
      setNavigationTarget('desktop', 'you', null, false);
      state.meIndex = -1;
      state.youIndex = -1;
      setNavigationStatus('desktop');
      return;
    }

    const button = target.closest(
      '#mbYouMePrev, #mbYouMeNext, #mbYouPrev, #mbYouNext, #mbDFMePrev, #mbDFMeNext, #mbDFYouPrev, #mbDFYouNext'
    );
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const mode = button.id.startsWith('mbDF') ? 'desktop' : 'mobile';
    refreshNavigation(true, mode);
    const state = ownershipNavigation[mode];
    const type = button.id.includes('Me') ? 'me' : 'you';
    const ids = state[type === 'me' ? 'meIds' : 'youIds'];
    const indexKey = `${type}Index`;
    if (!ids.length) {
      state[indexKey] = -1;
      setNavigationTarget(mode, type, null, false);
      setNavigationStatus(mode);
      return;
    }

    const isNext = button.id.endsWith('Next');
    let index = state[indexKey];
    if (index < 0) index = 0;
    else index = isNext ? (index + 1) % ids.length : (index - 1 + ids.length) % ids.length;
    state[indexKey] = index;
    setNavigationTarget(mode, type, ids[index], true);
    setNavigationStatus(mode);
  }

  function handleNavigationOpen(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('#mbYou')) {
      requestAnimationFrame(() => {
        const drawer = document.getElementById('mobileYouDrawer');
        refreshNavigation(false, 'mobile', !!drawer?.classList.contains('open'));
      });
    } else if (target.closest('#mbDesktopQuickReplyBtn')) {
      requestAnimationFrame(() => {
        const float = document.getElementById('mbDesktopFloat');
        refreshNavigation(false, 'desktop', !!float?.classList.contains('open'));
      });
    } else if (target.closest('#mbDesktopClose')) {
      const state = ownershipNavigation.desktop;
      state.meIndex = -1;
      state.youIndex = -1;
    }
  }

  function installNavigation() {
    const root = document.documentElement;
    const floatingLayout = root.classList.contains('desktop-floating-mode');
    const mobileExpected = root.matches('html.mobile-style-new') && !floatingLayout;
    const desktopExpected = floatingLayout;
    const hasNavigationPanel = document.getElementById('mobileYouDrawer') ||
      document.getElementById('mbDesktopFloat') ||
      document.getElementById('mbYou') ||
      document.getElementById('mbDesktopQuickReplyBtn');
    if (!mobileExpected && !desktopExpected && !hasNavigationPanel) return;

    const installOpener = (selector, shouldWait = false) => {
      const attach = button => {
        button.addEventListener('click', handleNavigationOpen);
      };
      const button = document.querySelector(selector);
      if (button) attach(button);
      else if (shouldWait) waitForElement(selector, attach, 5000);
    };

    const installPanel = (mode, selector) => {
      const attach = panel => {
        ownershipNavInstalled[mode] = true;
        panel.addEventListener('click', handleNavigationClick, true);
        if (mode === 'desktop') {
          const close = panel.querySelector('#mbDesktopClose');
          if (close) installOpener('#mbDesktopClose');
        }
        refreshNavigation(false, mode);
      };
      const panel = document.querySelector(selector);
      if (panel) attach(panel);
      else if (mode === 'mobile' ? mobileExpected : desktopExpected) waitForElement(selector, attach, 5000);
    };

    installPanel('mobile', '#mobileYouDrawer');
    installPanel('desktop', '#mbDesktopFloat');
    installOpener('#mbYou', mobileExpected);
    installOpener('#mbDesktopQuickReplyBtn', desktopExpected);
  }

  function initializeOwnership() {
    const initial = reconcileOwnership(null, { forceRail: true, markInitialPosts: true });
    ownershipSnapshot = new Map(Array.from(initial.ownPostsByBoard, ([board, ids]) => [board, new Set(ids)]));
    $(initializeOwnershipMenu);
    installNavigation();
  }

  function showYouNotification(post) {
    if (!desktopNotifications || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    const intro = post.querySelector('p.intro');
    const name = intro?.querySelector('.name')?.textContent?.trim() || 'Anonymous';
    const trip = intro?.querySelector('.trip')?.textContent?.trim() || '';
    const cap = intro?.querySelector('.capcode')?.textContent?.trim() || '';
    const postId = post.id.split('_')[1];
    const title = [name, trip, cap, 'No.' + postId, 'replied to you'].filter(Boolean).join(' ');
    const bodyContent = post.querySelector('.body')?.cloneNode(true);
    if (appendQuotes && bodyContent) {
      const sourceBoard = getPostIdentity(post)?.board;
      const links = bodyContent.querySelectorAll('a');
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (!getQuoteTarget(link, sourceBoard) || !Array.from(link.children).some(isQuoteYouSpan)) continue;
        const tags = getQuoteYouTags(link);
        for (let j = 0; j < tags.length; j++) tags[j].remove();
      }
    }
    const body = (bodyContent?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    const notif = new Notification(title, { body, icon: FAVICON_URL });
    notif.onclick = () => { window.focus(); post.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
    notif.onshow = () => setTimeout(() => notif.close(), 7000);
  }

  function requestNotifPermission() {
    if (!desktopNotifications || !('Notification' in window)) return;
    if (Notification.permission !== 'default') return;
    const alert = $(`
      <div id="alert_handler">
        <div id="alert_div">
          <a id="alert_close" class="desktop-alert-close" href="javascript:void(0)">
            <i class="fa fa-times"></i>
          </a>
          <div id="alert_message">
            Holotower TS needs permission to show desktop notifications.
          </div>
          <div>
            <button class="button alert_button" id="notifAuthorize">Authorize</button>
            <button class="button alert_button" id="notifDisable">Disable</button>
          </div>
        </div>
      </div>
    `);

    alert.hide();
    $('body').append(alert);
    alert.fadeIn(300);

    $('#notifAuthorize').on('click', function () {
      Notification.requestPermission(status => {
        if (status === 'granted' || status === 'denied') {
          alert.fadeOut(400, () => alert.remove());
        }
      });
    });

    $('#notifDisable').on('click', function () {
      const checkbox = document.getElementById('desktopNotifications');
      if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
      alert.fadeOut(400, () => alert.remove());
    });

    alert.on('click', '.desktop-alert-close', function () {
      alert.fadeOut(400, () => alert.remove());
    });
  }

  let youRail = null;
  let railRebuildScheduled = false;
  let youMarkerColor = null;
  let markerToggleState = 0;

  function createYouRail() {
    if (!scrollMarker) return;

    if (!youRail) {
      youRail = document.createElement('div');
      youRail.id = 'you-scroll-rail';
      document.body.appendChild(youRail);

      youRail.addEventListener('click', e => {
        const marker = e.target.closest('.you-marker');
        if (!marker) return;
        const postId = marker.dataset.postId;
        if (postId) scrollToPost(postId);
      });
    }
  }

  let tsLinkColor = '';
  let tsPostNoColor = '';
  let tsMentionedColor = '';
  let tsFileinfoColor = '';
  let tsPostBgColor = '';
  let tsPostBgImage = '';
  let tsPostTextColor = '';
  let tsPostBorderColor = '';
  const colorWaits = new Set();

  let currentStyleClass = '';

  function updateStyleAttribute() {
    const styleName = localStorage.getItem('stylesheet') || 'Yotsuba B';
    const styleClass = styleName.toLowerCase().replace(/[ +]/g, '-');
    if (styleClass === currentStyleClass) return;
    if (currentStyleClass) document.documentElement.classList.remove(currentStyleClass);
    document.documentElement.classList.add(styleClass);
    currentStyleClass = styleClass;
  }

  function updateColorStyle() {
    const lines = [];
    if (inlineQuoting) {
      if (tsPostNoColor) lines.push(`--ts-post-no-color: ${tsPostNoColor};`);
      if (tsMentionedColor) lines.push(`--ts-link-color: ${tsMentionedColor};`);
      if (tsFileinfoColor) lines.push(`--ts-fileinfo-color: ${tsFileinfoColor};`);
    }
    if (highlightPosts) {
      lines.push(`--you-border-style: ${youBorderStyle};`);
    }
    if (enableOekaki) {
      if (tsPostBgColor) lines.push(`--ts-post-bg-color: ${tsPostBgColor};`);
      if (tsPostBgImage) lines.push(`--ts-post-bg-image: ${tsPostBgImage};`);
      if (tsPostTextColor) lines.push(`--ts-post-text-color: ${tsPostTextColor};`);
      if (tsPostBorderColor) lines.push(`--ts-post-border-color: ${tsPostBorderColor};`);
    }
    const el = document.getElementById('ts-colors');
    if (el) el.textContent = lines.length ? `:root { ${lines.join('\n')} }` : '';
  }

  function waitForColor(selector, setter, afterCompute) {
    if (colorWaits.has(selector)) return;
    colorWaits.add(selector);
    waitForElement(selector, (el) => {
      colorWaits.delete(selector);
      setter(getComputedStyle(el).color);
      updateColorStyle();
      if (afterCompute) afterCompute();
    }, 0);
  }

  function computeStyleColors() {
    colorWaits.clear();
    const post = document.querySelector('.post.reply:not(.inline-cloned-post)') || document.querySelector('.post.op');

    if (!post) {
      if (scrollMarker || linkEmbed || inlineQuoting || enableOekaki) {
        waitForColor('.post.reply:not(.inline-cloned-post), .post.op', () => {
          computeStyleColors();
        });
      }
      return;
    }

    if (scrollMarker) {
      const bodyLink = post.querySelector('.body a') || document.querySelector('.post.reply .body a, .post.op .body a');
      if (bodyLink) {
        youMarkerColor = getComputedStyle(bodyLink).color;
      } else {
        waitForColor('.post.reply:not(.inline-cloned-post) .body a, .post.op .body a', (c) => {
          youMarkerColor = c;
        }, () => { if (scrollMarker) scheduleRailRebuild(); });
      }
    }

    if (linkEmbed) {
      const baseLink = post.querySelector('a') || document.querySelector('.post.reply a, .post.op a');
      if (baseLink) {
        tsLinkColor = getComputedStyle(baseLink).color;
      } else {
        waitForColor('.post.reply:not(.inline-cloned-post) a, .post.op a', (c) => {
          tsLinkColor = c;
        });
      }
    }

    if (inlineQuoting) {
      const postNo = post.querySelector('.intro a.post_no');
      const mentioned = post.querySelector('span.mentioned a') || document.querySelector('.post.reply span.mentioned a, .post.op span.mentioned a');
      const fileinfo = post.querySelector('p.fileinfo a') || document.querySelector('.post.reply p.fileinfo a, .post.op p.fileinfo a');

      if (postNo) {
        tsPostNoColor = getComputedStyle(postNo).color;
      } else {
        waitForColor('.post.reply:not(.inline-cloned-post) .intro a.post_no, .post.op .intro a.post_no', (c) => {
          tsPostNoColor = c;
        });
      }

      if (mentioned) {
        tsMentionedColor = getComputedStyle(mentioned).color;
      } else {
        waitForColor('.post.reply:not(.inline-cloned-post) span.mentioned a, .post.op span.mentioned a', (c) => {
          tsMentionedColor = c;
        });
      }

      if (fileinfo) {
        tsFileinfoColor = getComputedStyle(fileinfo).color;
      } else {
        waitForColor('.post.reply:not(.inline-cloned-post) p.fileinfo a, .post.op p.fileinfo a', (c) => {
          tsFileinfoColor = c;
        });
      }
    }

    if (enableOekaki) {
      const postCs = getComputedStyle(post);
      const readPostBg = (cs) => ({
        color: (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') ? cs.backgroundColor : '',
        image: (cs.backgroundImage && cs.backgroundImage !== 'none') ? cs.backgroundImage : ''
      });
      let bg = readPostBg(postCs);
      if (!bg.color && !bg.image) {
        bg = readPostBg(getComputedStyle(document.body));
      }
      tsPostBgColor = bg.color;
      tsPostBgImage = bg.image;
      tsPostTextColor = postCs.color || '';
      tsPostBorderColor = (postCs.borderTopStyle !== 'none' && parseFloat(postCs.borderTopWidth) > 0)
        ? `${postCs.borderTopWidth} ${postCs.borderTopStyle} ${postCs.borderTopColor}`
        : '';
    }

    updateColorStyle();
  }

  function rebuildYouRail() {
    if (!scrollMarker) return;
    createYouRail();

    if (youPostIds.size === 0 && ownPostIds.size === 0) {
      youRail.innerHTML = '';
      return;
    }

    const docHeight = document.documentElement.scrollHeight;
    const drawnIds = new Set();

    const allIds = [...youPostIds, ...ownPostIds];
    const existingMarkers = youRail.children;
    let markerIndex = 0;

    for (let i = 0; i < allIds.length; i++) {
      const id = allIds[i];

      if (drawnIds.has(id)) continue;
      drawnIds.add(id);

      const postEl = getNavigationPost(id);
      if (!postEl) continue;

      const rect = postEl.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      const top = ((absoluteTop / docHeight) * 100).toFixed(1);
      const height = Math.max(1, (rect.height / docHeight) * 100).toFixed(1);

      let marker;
      if (existingMarkers[markerIndex]) {
        marker = existingMarkers[markerIndex];
      } else {
        marker = document.createElement('div');
        marker.className = 'you-marker';
        const hover = document.createElement('div');
        hover.className = 'you-hover-marker';
        marker.appendChild(hover);
        youRail.appendChild(marker);
      }

      marker.dataset.postId = id;

      if (ownPostIds.has(id)) {
        marker.classList.add('own-rail-marker');
      } else {
        marker.classList.remove('own-rail-marker');
      }

      marker.style.setProperty('--top', top);
      marker.style.setProperty('--height', height);
      marker.style.backgroundColor = youMarkerColor;

      markerIndex++;
    }

    while (youRail.children.length > markerIndex) {
      youRail.removeChild(youRail.lastChild);
    }

    if (markerToggleState > 0) {
      youRail.classList.add(markerToggleState === 1 ? 'hide-own' : 'hide-you');
    }
  }

  function scrollToPost(targetId, highlight = true) {
    const el = getNavigationPost(targetId);
    if (!el) return;

    if (highlight) {
      const prev = document.querySelector('.highlighted');
      if (prev) prev.classList.remove('highlighted');
      el.classList.add('highlighted');
      location.hash = targetId;
    }

    let padding = 5;

    const boardlist = document.querySelector('.boardlist');
    if (boardlist && getComputedStyle(boardlist).position === 'fixed') {
      padding += boardlist.getBoundingClientRect().height;
    }

    const headerBar = document.querySelector('#header-bar.dialog');
    if (headerBar && getComputedStyle(headerBar).position === 'fixed') {
      padding += headerBar.getBoundingClientRect().height;
    }

    const top = el.getBoundingClientRect().top + window.scrollY - padding;
    window.scrollTo({ top, behavior: 'auto' });
  }

  function scheduleRailRebuild() {
    if (railRebuildScheduled) return;
    railRebuildScheduled = true;

    requestAnimationFrame(() => {
      railRebuildScheduled = false;
      rebuildYouRail();
    });
  }

  function hookChangeStyle() {
    const script = document.createElement('script');

    script.textContent = `
      (function() {
        if (typeof window.changeStyle !== 'function') return;

        const originalChangeStyle = window.changeStyle;

        window.changeStyle = function(...args) {
          const result = originalChangeStyle.apply(this, args);

          const activeLink = document.querySelector('link#stylesheet[rel="stylesheet"]:not([media="none"])');

          if (activeLink) {
            const href = activeLink.getAttribute('href');

            if (href && href !== "") {
              activeLink.addEventListener('load', () => {
                window.dispatchEvent(new Event('style-loaded'));
              }, { once: true });
            } else {
              window.dispatchEvent(new Event('style-loaded'));
            }
          }

          return result;
        };
      })();
    `;

    document.documentElement.appendChild(script);
    script.remove();
  }

  function initializeHeaderBar() {
    const boardlist = document.querySelector('.boardlist');
    const optionsLink = boardlist?.querySelector('a[title="Options"]');
    const sub = boardlist?.querySelector('.sub[data-description="1"]');

    if (boardlist && optionsLink && sub) {
      headerBar(boardlist, optionsLink, sub);
      return;
    }

    waitForElement('.boardlist', boardlist => {
      const optionsLink = boardlist.querySelector('a[title="Options"]');
      const sub = boardlist.querySelector('.sub[data-description="1"]');

      if (optionsLink && sub) {
        headerBar(boardlist, optionsLink, sub);
      } else {
        waitForElement('a[title="Options"]', optionsLink => {
          waitForElement('.sub[data-description="1"]', sub => {
            headerBar(boardlist, optionsLink, sub);
          });
        });
      }
    });
  }

  function headerBar(boardlist, optionsLink, sub) {

    if (!sub.querySelector('a[href$="/catalog.html"]')) {
      const homeLink = sub.querySelector('a[href="/"]');
      if (homeLink) {
        homeLink.insertAdjacentHTML(
          'afterend',
          ` / <a href="/${currentBoard}/catalog.html">catalog</a>`
        );
      }
    }

    if (!document.documentElement.classList.contains('desktop-style') && !document.documentElement.classList.contains('desktop-floating-mode')) {
      if (sub.dataset.mobileCollapsed) return;
      sub.dataset.mobileCollapsed = '1';

      const originalHTML = sub.innerHTML;
      let expanded = false;

      function collapse() {
        expanded = false;
        sub.innerHTML = '';

        const openBracket = document.createTextNode('[ ');
        const closeBracket = document.createTextNode(' ]');

        const link = document.createElement('a');
        link.href = 'javascript:void(0)';
        link.textContent = 'Holotower';

        sub.appendChild(openBracket);
        sub.appendChild(link);
        sub.appendChild(closeBracket);
      }

      function expand() {
        expanded = true;
        sub.innerHTML = originalHTML;
      }

      collapse();

      sub.addEventListener('click', e => {
        e.stopPropagation();

        if (!expanded) {
          expand();

          const closeOnOutside = evt => {
            if (!sub.contains(evt.target)) {
              collapse();
              document.removeEventListener('mousedown', closeOnOutside, true);
            }
          };

          document.addEventListener('mousedown', closeOnOutside, true);
        }
      });
    }

    const stats = document.createElement('span');
    stats.className = 'hb-thread-stats';

    optionsLink.insertAdjacentElement('afterend', stats);

    function syncThreadStats() {
      const statsRoot = document.getElementById('thread_stats');
      if (!statsRoot) {
        stats.textContent = '';
        stats.removeAttribute('title');
        return;
      }

      const actualEl = statsRoot.querySelector('#thread_stats_posts_actual') || statsRoot.querySelector('#thread_stats_posts');
      const actual = actualEl ? actualEl.textContent.trim() : '0';
      const deletedMatch = statsRoot .querySelector('#thread_stats_posts_deleted') ?.textContent.match(/\d+/);
      const deleted = deletedMatch ? Number(deletedMatch[0]) : 0;
      const images = statsRoot.querySelector('#thread_stats_images')?.textContent.trim() || '0';
      const page = statsRoot.querySelector('#thread_stats_page')?.textContent.trim() || '1';
      const showDeleted = showDeletedCounter && deleted > 0;

      const postSpan = document.createElement('span');
      postSpan.className = 'hb-post-count';
      postSpan.textContent = actual;
      postSpan.classList.toggle('hb-warning', parseInt(actual, 10) >= bumpLimit);

      const pageSpan = document.createElement('span');
      pageSpan.className = 'hb-page-num';
      pageSpan.textContent = page;
      pageSpan.classList.toggle('hb-warning', parseInt(page, 10) >= pageLimit);

      stats.textContent = '';
      stats.append(postSpan, ' / ');
      if (showDeleted) {
        stats.append(`${deleted} / ${images} / `);
        stats.title = 'Posts / Deleted / Files / Page';
      } else {
        stats.append(`${images} / `);
        stats.title = 'Posts / Files / Page';
      }
      stats.append(pageSpan);
    }

    setTimeout(syncThreadStats, 0);

    headerBar.syncThreadStats = syncThreadStats;

    const updateDisplay = document.createElement('span');
    updateDisplay.className = 'hb-update-secs';
    updateDisplay.title = 'Update now';
    updateDisplay.style.cssText = 'cursor:pointer;';

    stats.insertAdjacentElement('afterend', updateDisplay);

    const newCountDisplay = document.createElement('span');
    newCountDisplay.className = 'hb-new-count';
    newCountDisplay.style.display = 'none';

    updateDisplay.insertAdjacentElement('afterend', newCountDisplay);

    const statusMessage = document.createElement('span');
    statusMessage.className = 'hb-status-message hb-warning';
    statusMessage.textContent = 'Archived';
    statusMessage.style.display = 'none';

    newCountDisplay.insertAdjacentElement('afterend', statusMessage);

    let newCountTimer = null;
    let fadeTimer = null;

    function updateNewCount(count) {
      clearTimeout(newCountTimer);
      clearTimeout(fadeTimer);

      if (count > 0) {
        newCountDisplay.textContent = `+${count}`;

        newCountDisplay.classList.remove('fade-out');
        newCountDisplay.style.display = '';

        newCountTimer = setTimeout(() => {
          newCountDisplay.classList.add('fade-out');

          fadeTimer = setTimeout(() => {
            newCountDisplay.style.display = 'none';
          }, 200);
        }, 5000);

      } else {
        newCountDisplay.classList.remove('fade-out');
        newCountDisplay.style.display = 'none';
      }
    }

    function setArchiveState(isArchived) {
      statusMessage.style.display = isArchived ? '' : 'none';
    }

    headerBar.updateNewCount = updateNewCount;
    headerBar.setArchiveState = setArchiveState;

    function syncUpdateSecs() {
      const updateEl = document.getElementById('update_secs');
      if (!updateEl) {
        updateDisplay.textContent = '';
        return;
      }

      const text = updateEl.textContent.trim();
      updateDisplay.textContent =
        /updating/i.test(text) ? '...' : text;
    }

    updateDisplay.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('update_thread')?.click();
    });

    setTimeout(syncUpdateSecs, 0);
    headerBar.syncUpdateSecs = syncUpdateSecs;

    const updateObserverEl = document.getElementById('update_secs');
    if (updateObserverEl) {
      new MutationObserver(syncUpdateSecs).observe(updateObserverEl, {
        childList: true,
        characterData: true
      });
    }

    function applyDefaults(obj, defaults) {
      for (const k in defaults) {
        if (!(k in obj)) obj[k] = defaults[k];
      }
    }

    const towerBtn = document.createElement('a');
    towerBtn.href = 'javascript:void(0)';
    towerBtn.title = 'Tower Tunes';
    towerBtn.style.cssText = 'float:right; margin-right:6px; cursor:pointer;';
    towerBtn.innerHTML = '<i class="fa fa-music"></i>';

    optionsLink.insertAdjacentElement('afterend', towerBtn);

    let ttState = JSON.parse(localStorage.getItem("Tower Tunes") || '{}');

    function saveTT() {
      localStorage.setItem("Tower Tunes", JSON.stringify(ttState));
    }

    applyDefaults(ttState, {
      volume: 0.2,
      shuffle: false,
      repeat: false,
      autoOpen: false,
      x: null,
      y: null
    });

    let panel = null;
    let audio = null;

    let playlist = [];
    let originalPlaylist = [];
    let currentIndex = 0;
    let fetched = false;

    function createPanel() {
      if (panel) return;

      panel = document.createElement('div');
      panel.className = 'side-panel side-extra';
      panel.style.position = 'fixed';
      panel.style.top = ttState.y !== null ? ttState.y + 'px' : '30px';
      panel.style.left = ttState.x !== null ? ttState.x + 'px' : '8px';

      panel.innerHTML = `
        <section class="side-section">
          <h2 class="side-heading" style="display:flex; justify-content:space-between; align-items:center;">
            <span>Tower Tunes</span>
            <span class="tt-controls">
              <i class="fa fa-caret-down tt-menu-btn"></i>
              <i class="fa fa-times tt-close-btn"></i>
            </span>
          </h2>

          <div class="side-section-body">
            <div class="music-player">
              <img src="/static/music.png" class="music-art">

              <div class="music-display">
                <div class="music-label">Now Playing:</div>
                <div id="music-title" class="music-title"></div>
              </div>

              <div class="music-seek-row">
                <input type="range" id="music-seek" class="music-seek" min="0" value="0" step="1">
              </div>

              <div class="music-controls">
                <button id="music-prev" class="music-button">«</button>
                <button id="music-play" class="music-button">Play</button>
                <button id="music-pause" class="music-button">Pause</button>
                <button id="music-next" class="music-button">»</button>
              </div>

              <ul id="music-playlist" class="music-playlist"></ul>
              <audio id="music-audio"></audio>
            </div>
          </div>
        </section>
      `;

      document.body.appendChild(panel);

      setupMenu(panel);
      setupPlayer(panel);
      makeDraggable(panel);

      panel.style.display = 'block';

      requestAnimationFrame(() => {
        viewportCheck(panel);
      });
    }

    function fetchMusic() {
      if (fetched) return;
      fetched = true;

      fetch('/static/homepage_content.json')
        .then(r => r.json())
        .then(data => {
          originalPlaylist = data.music.slice();
          playlist = originalPlaylist.slice();

          if (ttState.shuffle) applyShuffle();

          populatePlaylist();
          loadTrack(0);
        });
    }

    function applyShuffle() {
      const cur = playlist[currentIndex];
      shuffleArray(playlist);
      currentIndex = playlist.indexOf(cur);
    }

    function removeShuffle() {
      const cur = playlist[currentIndex];
      playlist = originalPlaylist.slice();
      currentIndex = playlist.indexOf(cur);
    }

    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    function populatePlaylist() {
      const ul = panel.querySelector('#music-playlist');
      ul.innerHTML = '';

      for (let i = 0; i < playlist.length; i++) {
        const track = playlist[i];
        const li = document.createElement('li');
        li.textContent = track.title;
        li.onclick = () => loadTrack(i, true);
        ul.appendChild(li);
      }

      updateActive();
    }

    function updateActive() {
      const lis = panel.querySelectorAll('#music-playlist li');

      for (let i = 0; i < lis.length; i++) {
        lis[i].classList.toggle('active', i === currentIndex);
      }
    }

    let lastNotifiedTrack = null;

    function loadTrack(i, autoplay) {
      if (!playlist[i]) return;

      const track = playlist[i];
      const isNewTrack = currentIndex !== i;

      currentIndex = i;
      audio.src = track.path;
      panel.querySelector('#music-title').textContent = playlist[i].title;
      panel.querySelector('#music-seek').value = 0;
      updateActive();

      if (autoplay) audio.play();

      if (isNewTrack && lastNotifiedTrack !== track.title && panel && panel.style.display === 'none') {
        lastNotifiedTrack = track.title;

        showMessageNotification(
          `Now Playing: ${track.title}`,
          { timeout: 5000 }
        );
      }
    }

    function nextTrack(auto = false) {
      if (auto && ttState.repeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      if (ttState.shuffle && auto) {
        let next;
        do {
          next = Math.floor(Math.random() * playlist.length);
        } while (next === currentIndex && playlist.length > 1);
        loadTrack(next, true);
      } else {
        loadTrack((currentIndex + 1) % playlist.length, true);
      }
    }

    function setupPlayer(container) {
      audio = container.querySelector('#music-audio');
      audio.volume = ttState.volume;

      const seek = container.querySelector('#music-seek');

      audio.addEventListener('timeupdate', () => {
        seek.max = Math.floor(audio.duration || 0);
        seek.value = Math.floor(audio.currentTime);
      });

      seek.oninput = () => { audio.currentTime = seek.value; };

      audio.addEventListener('ended', () => nextTrack(true));

      container.querySelector('#music-play').onclick = () => audio.play();
      container.querySelector('#music-pause').onclick = () => audio.pause();
      container.querySelector('#music-prev').onclick = () => loadTrack((currentIndex - 1 + playlist.length) % playlist.length, true);
      container.querySelector('#music-next').onclick = () => nextTrack(false);
    }

    function setupMenu(container) {
      const menu = document.createElement('div');
      menu.className = 'tt-menu';
      menu.style.display = 'none';

      menu.innerHTML = `
        <div class="tt-volume-row"><label>Volume</label><input type="range" class="music-volume" min="0" max="1" step="0.01"></div>
        <div><label><input type="checkbox" data-key="shuffle"> Shuffle</label></div>
        <div><label><input type="checkbox" data-key="repeat"> Repeat</label></div>
        <div><label><input type="checkbox" data-key="autoOpen"> Auto-open</label></div>
        <div><button class="tt-reset">Reset position</button></div>
      `;

      container.appendChild(menu);

      const vol = menu.querySelector('input[type=range]');
      vol.value = ttState.volume;
      vol.oninput = () => {
        audio.volume = vol.value;
        ttState.volume = +vol.value;
        saveTT();
      };

      const cbs = menu.querySelectorAll('input[type=checkbox]');
      for (let i = 0; i < cbs.length; i++) {
        const cb = cbs[i];

        cb.checked = !!ttState[cb.dataset.key];
        cb.onchange = () => {
          ttState[cb.dataset.key] = cb.checked;

          if (cb.dataset.key === 'shuffle') {
            if (cb.checked) {
              applyShuffle();
            } else {
              removeShuffle();
            }
            populatePlaylist();
          }

          saveTT();
        };
      }

      menu.querySelector('.tt-reset').onclick = () => {
        ttState.x = ttState.y = null;
        saveTT();
        panel.style.top = '30px';
        panel.style.left = '8px';
      };

      container.querySelector('.tt-menu-btn').onclick = () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      };
      container.querySelector('.tt-close-btn').onclick = () => {
        panel.style.display = 'none';
      };
    }

    function makeDraggable(el) {
      let sx, sy, dx, dy;

      el.querySelector('.side-heading').onmousedown = e => {
        sx = e.clientX;
        sy = e.clientY;
        dx = el.offsetLeft;
        dy = el.offsetTop;

        document.onmousemove = m => {
          el.style.left = dx + m.clientX - sx + 'px';
          el.style.top = dy + m.clientY - sy + 'px';
        };

        document.onmouseup = () => {
          ttState.x = el.offsetLeft;
          ttState.y = el.offsetTop;
          saveTT();
          document.onmousemove = document.onmouseup = null;
        };
      };
    }

    function viewportCheck(el) {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const outside =
        rect.left < 0 ||
        rect.top < 0 ||
        rect.right > vw ||
        rect.bottom > vh;

      if (!outside) return;

      ttState.x = null;
      ttState.y = null;
      saveTT();

      el.style.left = '8px';
      el.style.top = '30px';
    }

    towerBtn.onclick = () => {
      const wasCreated = !!panel;

      createPanel();
      fetchMusic();

      if (wasCreated) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      }
    };

    if (ttState.autoOpen) {
      setTimeout(() => {
        createPanel();
        fetchMusic();
      }, 0);
    }

    if (boardlist.querySelector('.hb-toggle')) return;

    const toggle = document.createElement('a');
    toggle.href = 'javascript:void(0)';
    toggle.title = 'Menu';
    toggle.className = 'hb-toggle';
    toggle.style.cssText = 'float:right; cursor:pointer;';

    const icon = document.createElement('i');
    icon.className = 'fa fa-caret-down';
    icon.style.cssText = 'margin: 0px 6px;';
    toggle.appendChild(icon);

    const menu = document.createElement('div');
    menu.className = 'hb-menu';

    boardlist.insertBefore(menu, optionsLink);
    boardlist.insertBefore(toggle, optionsLink);

    if (!boardlist.querySelector('#autohide-marker')) {
      const marker = document.createElement('div');
      marker.id = 'autohide-marker';
      boardlist.appendChild(marker);
    }

    function addLinkCheckbox({ label, get, set }) {
      const wrapper = document.createElement('label');
      wrapper.style.display = 'block';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.style.margin = '0 4px 0 0';
      cb.checked = !!get();

      const link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.textContent = label;

      wrapper.appendChild(cb);
      wrapper.appendChild(link);
      menu.appendChild(wrapper);

      function sync() {
        cb.checked = !!get();
      }

      link.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        set(!get());
        sync();
      });

      cb.addEventListener('click', e => {
        e.stopPropagation();
        set(cb.checked);
      });

      return sync;
    }

    const watchEntry = document.createElement('a');
    watchEntry.href = 'javascript:void(0)';
    watchEntry.style.display = 'block';
    watchEntry.style.cursor = 'pointer';

    menu.appendChild(watchEntry);

    function getWatchLink() {
      return document.querySelector('#watch-thread a');
    }

    function syncWatchLabel() {
      const link = getWatchLink();
      watchEntry.textContent = link && /stop watching/i.test(link.textContent) ? 'Unwatch thread' : 'Watch thread';
    }

    watchEntry.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const link = getWatchLink();
      if (link) link.click();
      setTimeout(syncWatchLabel, 0);
    });

    if (rememberLastRead) {
      const lastReadEntry = document.createElement('a');
      lastReadEntry.href = 'javascript:void(0)';
      lastReadEntry.style.display = 'block';
      lastReadEntry.style.cursor = 'pointer';
      lastReadEntry.textContent = 'Scroll to last read post';
      menu.appendChild(lastReadEntry);

      lastReadEntry.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (lastReadPostId) scrollToPost(lastReadPostId);
      });
    }

    let syncThreading = null;

    if (optionThreading) {
      syncThreading = addLinkCheckbox({
        label: 'Threading',
        get() {
          return document.querySelector('.threading-toggle')
            ?.closest('label')
            ?.querySelector('input[type="checkbox"]')?.checked;
        },
        set(val) {
          const siteCb = document.querySelector('.threading-toggle')
            ?.closest('label')
            ?.querySelector('input[type="checkbox"]');
          if (siteCb && siteCb.checked !== val) siteCb.click();
        }
      });
    }

    let scrollHandler = null;

    const threadSettings = JSON.parse(localStorage.getItem("Thread Settings") || '{}');

    applyDefaults(threadSettings, {
      headerFixed: true,
      headerAutohide: false,
      headerHideScroll: false
    });

    function saveHeaderSettings() {
      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      Object.assign(latest, {
        headerFixed: threadSettings.headerFixed,
        headerAutohide: threadSettings.headerAutohide,
        headerHideScroll: threadSettings.headerHideScroll
      });
      localStorage.setItem("Thread Settings", JSON.stringify(latest));
    }

    function applyHeaderClasses() {
      boardlist.classList.toggle('fixed', threadSettings.headerFixed);
      boardlist.classList.toggle('autohide', threadSettings.headerAutohide);
      if (threadSettings.headerFixed) {
        setTimeout(() => {
          document.body.style.setProperty('--header-height', boardlist.offsetHeight + 'px');
        }, 150);
      } else {
        document.body.style.setProperty('--header-height', '');
      }
    }

    function setScrollHeader(enabled) {
      if (enabled && !scrollHandler) {
        let prevOffset = 0;

        scrollHandler = () => {
          const offsetY = window.pageYOffset;

          if (offsetY > prevOffset) {
            boardlist.classList.add('autohide', 'scroll');
          } else {
            boardlist.classList.remove('autohide', 'scroll');
          }

          prevOffset = offsetY;
        };

        window.addEventListener('scroll', scrollHandler);
      }
      else if (!enabled && scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;

        boardlist.classList.remove('scroll');

        applyHeaderClasses();
      }
    }

    const headerToggles = [
      {
        label: 'Fixed Header',
        get: () => threadSettings.headerFixed,
        set: v => {
          threadSettings.headerFixed = v;
          applyHeaderClasses();
          saveHeaderSettings();
        }
      },
      {
        label: 'Auto-hide Header',
        get: () => threadSettings.headerAutohide,
        set: v => {
          threadSettings.headerAutohide = v;
          applyHeaderClasses();
          saveHeaderSettings();
        }
      },
      {
        label: 'Auto-hide Header on Scroll',
        get: () => threadSettings.headerHideScroll,
        set: v => {
          threadSettings.headerHideScroll = v;
          setScrollHeader(v);
          saveHeaderSettings();
        }
      }
    ];

    const headerSyncs = headerToggles.map(opt => addLinkCheckbox(opt));

    applyHeaderClasses();
    setScrollHeader(threadSettings.headerHideScroll);

    let open = false;

    function setMenu(openState) {
      if (open === openState) return;
      open = openState;

      menu.style.display = open ? 'block' : 'none';

      if (open) {
        syncWatchLabel();
        syncThreading?.();

        for (let i = 0; i < headerSyncs.length; i++) {
          headerSyncs[i]();
        }

        menu.style.top = `${toggle.offsetHeight}px`;
        document.addEventListener('mousedown', onOutsideClick, true);
      } else {
        document.removeEventListener('mousedown', onOutsideClick, true);
      }
    }

    toggle.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      setMenu(!open);
    };

    function onOutsideClick(e) {
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      setMenu(false);
    }

    menu.addEventListener('mousedown', e => e.stopPropagation());
  }

  const archiveQuoteCache = new Map();

  function formatArchiveTime(utcSeconds) {
    const d = new Date(Number(utcSeconds) * 1000);
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const sec = String(d.getSeconds()).padStart(2, '0');
    return `${mm}/${dd}/${yy} (${day}) ${hh}:${min}:${sec}`;
  }

  function updateHoverContent(postId, sourcePostEl) {
    const hoverEl = document.getElementById(`post-hover-${postId}`);
    if (!hoverEl || (!hoverEl.offsetHeight && !hoverEl.offsetWidth)) return false;

    const clone = sourcePostEl.cloneNode(true);

    const toRemove = clone.querySelectorAll('span.mentioned, a.post_anchor');
    for (let i = 0; i < toRemove.length; i++) {
      toRemove[i].remove();
    }

    hoverEl.innerHTML = '';
    while (clone.firstChild) {
      hoverEl.appendChild(clone.firstChild);
    }

    return true;
  }

  function addDeletedBacklink(targetPostId, callerPostId) {
    const targetPost = document.getElementById(`reply_${targetPostId}`);
    if (!targetPost || targetPost.querySelector(`a.mentioned-${callerPostId}`)) return;

    let mentionedSpan = targetPost.querySelector('span.mentioned.unimportant');

    if (!mentionedSpan) {
      mentionedSpan = document.createElement('span');
      mentionedSpan.className = 'mentioned unimportant';
      mentionedSpan.classList.add('ts-archive-backlink');

      const intro = targetPost.querySelector('.intro');
      const deletedEl = targetPost.querySelector('.deleted-post');

      if (deletedEl && intro) {
        deletedEl.after(mentionedSpan);
      } else if (intro) {
        intro.appendChild(mentionedSpan);
      }
    }

    const backlink = document.createElement('a');
    backlink.className = `mentioned-${callerPostId} ts-archive-backlink`;
    backlink.href = `#${callerPostId}`;
    backlink.textContent = `>>${callerPostId}`;
    mentionedSpan.appendChild(backlink);

    if (typeof initHover === 'function') {
      initHover.call(backlink);
    }
  }

  function fixDeletedLinks(deletedPostId) {
    if (!currentBoard || !currentThreadId) return;
    const idStr = String(deletedPostId);
    const quoteText = `>>${idStr}`;
    const localHref = `/${currentBoard}/res/${currentThreadId}.html#${idStr}`;
    const nodes = document.querySelectorAll(`div.body a[href$="#${idStr}"], div.body span.quote`);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.classList.contains('archive-deleted') || node.classList.contains('archive-dead') || node.classList.contains('archive-live')) continue;
      if (!(node.textContent || '').trim().startsWith(quoteText)) continue;
      if (node.getAttribute('rel') === 'nofollow') continue;

      let finalNode;

      if (node.tagName === 'A') {
        finalNode = node.cloneNode(true);
        finalNode.classList.add('archive-quote', 'archive-deleted');
        finalNode.dataset.postId = idStr;
        finalNode.dataset.archiveState = 'deleted';
        finalNode.href = localHref;
      } else {
        finalNode = document.createElement('a');
        finalNode.className = 'archive-quote archive-deleted';
        finalNode.dataset.postId = idStr;
        finalNode.dataset.archiveState = 'deleted';
        finalNode.textContent = node.textContent;
        finalNode.href = localHref;
      }

      node.replaceWith(finalNode);

      const callerPost = finalNode.closest('.post.reply');
      const callerPostId = callerPost ? callerPost.id.split('_')[1] : null;
      if (callerPostId) addDeletedBacklink(deletedPostId, callerPostId);

      if (typeof initHover === 'function') initHover.call(finalNode);
    }
  }

  function restoreDeletedLinks(restoredPostId) {
    if (!currentBoard || !currentThreadId || !document.querySelector('.archive-deleted')) return;

    const idStr = String(restoredPostId);
    const markedLinks = document.querySelectorAll(`div.body a.archive-deleted[href$="#${idStr}"]`);

    for (let i = 0; i < markedLinks.length; i++) {
      const link = markedLinks[i];

      const cleanLink = link.cloneNode(true);
      cleanLink.classList.remove('archive-quote', 'archive-deleted');
      delete cleanLink.dataset.archiveState;
      delete cleanLink.dataset.postId;
      link.replaceWith(cleanLink);

      if (typeof initHover === 'function') initHover.call(cleanLink);
    }
  }

  function silentCacheArchive(board, postId, linkEl) {
    const archiveApiUrl = `https://archive.holotower.org/${board}/post/${postId}`;
    const realHref = linkEl.getAttribute('href');
    linkEl.setAttribute('href', 'javascript:void(0)');

    let promise = archiveQuoteCache.get(archiveApiUrl);

    if (!promise) {
      promise = new Promise((resolve, reject) => {
        if (!gmRequest) { reject(new Error('GM.xmlHttpRequest not available')); return; }
        gmRequest({
          method: 'GET',
          url: archiveApiUrl,
          responseType: 'text',
          onload: (resp) => { try { resolve(JSON.parse(resp.responseText || resp.response || '{}')); } catch(e) { reject(e); } },
          onerror: () => reject(new Error('HTTP network error')),
          ontimeout: () => reject(new Error('HTTP request timed out'))
        });
      });
      archiveQuoteCache.set(archiveApiUrl, promise);
    }

    const restoreHref = () => {
      if (linkEl.isConnected) linkEl.setAttribute('href', realHref);
    };

    promise.then((data) => {
      if (!data || !data.thread_num) {
        restoreHref();
        return;
      }

      cacheArchiveThread(board, postId, String(data.thread_num), data);
      restoreHref();
    }).catch(() => {
      restoreHref();
    });
  }

  function fetchArchive(quoteNode) {
    if (!quoteNode) return null;

    const text = (quoteNode.textContent || '').trim();
    const match = text.match(/^>>(\d+)$/);
    if (!match) return null;

    const postId = match[1];
    const currentPostEl = quoteNode.closest('.post.reply');
    const currentPostId = currentPostEl ? Number((currentPostEl.id || '').split('_')[1] || 0) : 0;

    if (currentPostId && Number(postId) > currentPostId) return quoteNode;

    const board = currentBoard || (quoteNode.closest('[data-board]') && quoteNode.closest('[data-board]').getAttribute('data-board')) || '';
    if (!board) return null;

    let isLocalDeleted = false;
    if (currentThreadId && Number(postId) >= Number(currentThreadId)) {
      const localPost = document.getElementById(`reply_${postId}`);
      if (localPost) {
        if (!localPost.closest(`[id^="thread_archdummy_"], [id^="thread_iqdummy_"], [id^="thread_archcache_"]`)) {
          if (localPost.classList.contains('deleted-post') || localPost.querySelector('.deleted-post')) {
            isLocalDeleted = true;
          } else {
            if (typeof initHover === 'function') initHover.call(quoteNode);
            return quoteNode;
          }
        }
      }
    }

    if (isLocalDeleted) {
      let link = quoteNode;
      if (quoteNode.tagName !== 'A') {
        link = document.createElement('a');
        link.textContent = `>>${postId}`;
        quoteNode.parentNode.replaceChild(link, quoteNode);
      }

      link.className = 'archive-quote archive-deleted';
      link.dataset.postId = postId;
      link.dataset.archiveState = 'deleted';
      link.href = `/${board}/res/${currentThreadId}.html#${postId}`;

      addDeletedBacklink(postId, currentPostId);
      if (typeof initHover === 'function') initHover.call(link);
      return link;
    }

    const cachedPost = document.querySelector(`form[name="postcontrols"] [data-cached="yes"] #reply_${postId}`);
    if (cachedPost) {
      let link = quoteNode;
      if (quoteNode.tagName !== 'A') {
        link = document.createElement('a');
        link.textContent = `>>${postId}`;
        quoteNode.parentNode.replaceChild(link, quoteNode);
      }

      link.className = 'archive-quote archive-live';
      link.dataset.postId = postId;
      link.dataset.archiveState = 'archive';

      const cachedThread = cachedPost.closest('.thread');
      const threadNum = cachedThread ? cachedThread.id.replace('thread_', '').replace('thread_archcache_', '') : '';

      if (threadNum) {
        link.href = `https://archive.holotower.org/${board}/thread/${threadNum}#p${postId}`;
        link.removeAttribute('rel');
      }

      if (typeof initHover === 'function') initHover.call(link);
      return link;
    }

    let link = quoteNode;
    if (quoteNode.tagName !== 'A') {
      link = document.createElement('a');
      link.textContent = `>>${postId}`;
      quoteNode.parentNode.replaceChild(link, quoteNode);
    }

    link.href = 'javascript:void(0)';
    link.rel = 'nofollow';
    link.className = 'archive-quote archive-dead';
    link.dataset.postId = postId;
    link.dataset.archiveState = 'dead';

    const host = document.querySelector('form[name="postcontrols"]');
    if (host) {
      const dummyThreadId = `thread_archdummy_${postId}`;
      let wrapper = document.getElementById(dummyThreadId);

      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'thread';
        wrapper.id = dummyThreadId;
        wrapper.dataset.board = board;
        wrapper.style.display = 'none';
        host.insertBefore(wrapper, host.firstChild);
      }

      if (!wrapper.querySelector(`#reply_${postId}`)) {
        const post = document.createElement('div');
        post.className = 'post reply';
        post.id = `reply_${postId}`;
        post.dataset.board = board;
        post.innerHTML = `<div class="body"><span class="archive-loading">Loading post No.${postId}...</span></div>`;
        wrapper.appendChild(post);
      }
    }

    if (typeof initHover === 'function') initHover.call(link);

    if (!link.dataset.archiveBound) {
      link.dataset.archiveBound = '1';
      link.addEventListener('mouseenter', function() {
        if (link.dataset.archiveState === 'loading' || link.dataset.archiveState === 'archive' || link.dataset.archiveState === 'error') return;
        link.dataset.archiveState = 'loading';
        loadArchiveQuote(link, board, postId);
      }, { passive: true });
    }

    return link;
  }

  function syncArchiveOwnership(posts) {
    const sourcePosts = [];
    const copyPosts = [];
    for (const post of posts) {
      if (!post?.isConnected || !post.matches?.('.post.op, .post.reply')) continue;
      if (isSourcePost(post, getPostIdentity(post))) sourcePosts.push(post);
      else copyPosts.push(post);
    }

    if (sourcePosts.length) {
      reconcileOwnership(sourcePosts, { refreshNavigation: true, refreshFavicon: true });
    }
    if (copyPosts.length) reconcileOwnership(copyPosts);
  }

  function loadArchiveQuote(link, board, postId) {
    const archiveApiUrl = `https://archive.holotower.org/${board}/post/${postId}`;

    let promise = archiveQuoteCache.get(archiveApiUrl);
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        if (!gmRequest) { reject(new Error('GM.xmlHttpRequest not available')); return; }
        gmRequest({
          method: 'GET',
          url: archiveApiUrl,
          responseType: 'text',
          onload: (resp) => { try { resolve(JSON.parse(resp.responseText || '{}')); } catch(e) { reject(e); } },
          onerror: () => reject(new Error('HTTP network error')),
          ontimeout: () => reject(new Error('HTTP request timed out'))
        });
      });
      archiveQuoteCache.set(archiveApiUrl, promise);
    }

    promise.then((data) => {
      const allDeadLinks = document.querySelectorAll(`a.archive-quote[data-post-id="${postId}"][data-archive-state="dead"], a.archive-quote[data-post-id="${postId}"][data-archive-state="loading"]`);
      if (allDeadLinks.length === 0) return;

      const threadNum = data && data.thread_num ? String(data.thread_num) : '';
      if (!threadNum || !cacheArchiveThread(board, postId, threadNum, data)) {
        for (let i = 0; i < allDeadLinks.length; i++) {
          const dl = allDeadLinks[i];
          if (!dl.isConnected) continue;
          dl.dataset.archiveState = 'error';
          const dummyPost = document.querySelector(`#thread_archdummy_${postId} #reply_${postId}`);
          if (dummyPost) {
            dummyPost.innerHTML = '<div class="body"><span style="color: red;">Post not found.</span></div>';
            updateHoverContent(postId, dummyPost);
          }
        }
        return;
      }

      const finalUrl = `https://archive.holotower.org/${board}/thread/${threadNum}#p${postId}`;
      const affectedPosts = new Set();

      for (let i = 0; i < allDeadLinks.length; i++) {
        const dl = allDeadLinks[i];
        if (!dl.isConnected) continue;
        dl.href = finalUrl;
        dl.removeAttribute('rel');
        dl.dataset.archiveState = 'archive';
        dl.classList.remove('archive-dead');
        dl.classList.add('archive-live');
        const parentPost = dl.closest('.post.op, .post.reply');
        if (parentPost) affectedPosts.add(parentPost);

        const hashLink = dl.nextElementSibling;
        if (hashLink && hashLink.classList.contains('hash-link') && hashLink.dataset.postId === String(postId)) {
          hashLink.href = finalUrl;
          hashLink.dataset.archiveState = 'archive';
          hashLink.classList.remove('archive-hash-dead');
          hashLink.classList.add('archive-hash-live');
        }
      }

      const targetWrapperId = String(threadNum) === currentThreadId ? `thread_archcache_${threadNum}` : `thread_${threadNum}`;
      const realPost = document.querySelector(`form[name="postcontrols"] #${targetWrapperId} #reply_${postId}`);
      const dummyThread = document.getElementById(`thread_archdummy_${postId}`);
      const dummyPost = dummyThread ? dummyThread.querySelector(`#reply_${postId}`) : null;

      if (realPost && dummyPost) {
        dummyPost.innerHTML = realPost.innerHTML;
        updateHoverContent(postId, dummyPost);

        const cleanupDone = { done: false };
        const performCleanup = () => {
          if (cleanupDone.done) return;
          cleanupDone.done = true;
          if (dummyThread) dummyThread.remove();

          for (let i = 0; i < allDeadLinks.length; i++) {
            const dl = allDeadLinks[i];
            if (!dl.isConnected) continue;

            const cleanDl = dl.cloneNode(true);
            dl.replaceWith(cleanDl);
            if (typeof initHover === 'function') initHover.call(cleanDl);
          }
        };

        for (let i = 0; i < allDeadLinks.length; i++) {
          if (allDeadLinks[i].isConnected) {
            allDeadLinks[i].addEventListener('mouseleave', performCleanup, { once: true });
          }
        }
      } else {
        if (dummyThread) dummyThread.remove();
        for (let i = 0; i < allDeadLinks.length; i++) {
          const dl = allDeadLinks[i];
          if (!dl.isConnected) continue;
          const cleanDl = dl.cloneNode(true);
          dl.replaceWith(cleanDl);
          if (typeof initHover === 'function') initHover.call(cleanDl);
        }
      }

      syncArchiveOwnership(affectedPosts);
    }).catch(() => {
      const allLoadingLinks = document.querySelectorAll(`a.archive-quote[data-post-id="${postId}"][data-archive-state="loading"]`);

      const errorMsg = !gmRequest
      ? '<span>Cannot load archive post. Use a userscript manager.</span>'
      : '<span style="color: red;">Post not found.</span>';

      for (let i = 0; i < allLoadingLinks.length; i++) {
        const dl = allLoadingLinks[i];
        if (!dl.isConnected) continue;
        dl.dataset.archiveState = 'error';
        const dummyPost = document.querySelector(`#thread_archdummy_${postId} #reply_${postId}`);
        if (dummyPost) {
          dummyPost.innerHTML = `<div class="body">${errorMsg}</div>`;
          updateHoverContent(postId, dummyPost);
        }
      }

      for (let i = 0; i < allLoadingLinks.length; i++) {
        const hashLink = allLoadingLinks[i].nextElementSibling;
        if (hashLink && hashLink.classList.contains('hash-link') && hashLink.dataset.postId === String(postId)) {
          hashLink.dataset.archiveState = 'error';
        }
      }
    });
  }

  function buildCachedPost(archiveDoc, board, threadNum, postId) {
    const archivePost = archiveDoc.querySelector('div.post.reply, div[id^="p"]');
    if (!archivePost) return null;

    const postInfo = archivePost.querySelector('.postInfo');
    const message = archivePost.querySelector('blockquote.postMessage');
    const fileText = archivePost.querySelector('.fileText a');
    const mediaImg = archivePost.querySelector('.media_cont img');

    const warningEl = archivePost.querySelector('strong.warning');
    const isDeletedPost = warningEl && warningEl.textContent.trim() === '[Deleted]' && warningEl.title.includes('deleted');

    const post = document.createElement('div');
    post.className = 'post reply';
    post.id = `reply_${postId}`;
    post.dataset.board = board;

    const intro = document.createElement('p');
    intro.className = 'intro';

    const postAnchor = document.createElement('a');
    postAnchor.id = postId;
    postAnchor.className = 'post_anchor';

    const deleteInput = document.createElement('input');
    deleteInput.type = 'checkbox';
    deleteInput.className = 'delete';
    deleteInput.name = `delete_${postId}`;
    deleteInput.id = `delete_${postId}`;
    deleteInput.style.display = 'none';

    const postMenu = document.createElement('a');
    postMenu.href = '#';
    postMenu.className = 'post-btn';
    postMenu.title = 'Post menu';
    postMenu.textContent = '▶';

    const label = document.createElement('label');
    label.setAttribute('for', `delete_${postId}`);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = postInfo?.querySelector('.name')?.textContent?.trim() || 'Anonymous';

    const timeEl = document.createElement('time');
    const utc = postInfo?.querySelector('.dateTime')?.getAttribute('data-utc');
    if (utc) {
      const d = new Date(Number(utc) * 1000);
      timeEl.setAttribute('datetime', d.toISOString());
      timeEl.setAttribute('data-local', 'true');
      timeEl.title = 'Archived';
      timeEl.textContent = formatArchiveTime(utc);
    }

    label.appendChild(nameSpan);

    const capcodeEl = archivePost.querySelector('strong.capcode');
    if (capcodeEl) {
      const capcodeSpan = document.createElement('span');
      capcodeSpan.className = 'capcode';
      let capcodeText = capcodeEl.textContent.trim();
      if (capcodeText === '## Admin') capcodeText = '## admin';

      capcodeSpan.textContent = capcodeText;
      label.appendChild(document.createTextNode(' '));
      label.appendChild(capcodeSpan);
    }

    if (timeEl.textContent) {
      label.appendChild(document.createTextNode(' '));
      label.appendChild(timeEl);
    }

    const postNo1 = document.createElement('a');
    postNo1.className = 'post_no';
    postNo1.id = `post_no_${postId}`;
    postNo1.setAttribute('onclick', `highlightReply(${postId})`);
    postNo1.href = `/${board}/res/${threadNum}.html#${postId}`;
    postNo1.textContent = 'No.';

    const postNo2 = document.createElement('a');
    postNo2.className = 'post_no';
    postNo2.setAttribute('onclick', `citeReply(${postId})`);
    postNo2.href = `/${board}/res/${threadNum}.html#q${postId}`;
    postNo2.textContent = String(postId);

    intro.appendChild(postAnchor);
    intro.appendChild(deleteInput);
    intro.appendChild(postMenu);
    intro.appendChild(label);
    intro.appendChild(document.createTextNode('\u00A0'));
    intro.appendChild(postNo1);
    intro.appendChild(postNo2);

    if (isDeletedPost) {
      const delSpan = document.createElement('span');
      delSpan.textContent = ' [Deleted]';
      delSpan.className = 'deleted-post';
      delSpan.style.color = 'red';
      delSpan.style.fontWeight = 'bolder';
      intro.appendChild(delSpan);
    }

    const archiveSpan = document.createElement('span');
    archiveSpan.textContent = ' [Archive]';
    archiveSpan.className = 'archived-post';
    archiveSpan.style.color = 'red';
    archiveSpan.style.fontWeight = 'bolder';
    intro.appendChild(archiveSpan);

    post.appendChild(intro);

    const files = document.createElement('div');
    files.className = 'files ';

    if (fileText || mediaImg) {
      const fileWrap = document.createElement('div');
      fileWrap.className = 'file';

      const fileInfo = document.createElement('p');
      fileInfo.className = 'fileinfo';

      const mediaUrl = fileText ? fileText.href : '';
      let finalMediaUrl = mediaUrl;
      const isDeletedImage = mediaUrl.includes('image_deleted') || (fileText && fileText.textContent.trim() === '[Deleted]');

      if (isDeletedImage) {
        finalMediaUrl = 'https://archive.holotower.org/static/images/image_deleted.png';
      }

      const mediaName = finalMediaUrl ? finalMediaUrl.split('/').pop() : '';
      const originalName = fileText ? fileText.textContent.trim() : '';

      const spanFile = document.createElement('span');
      spanFile.appendChild(document.createTextNode('File: '));
      const fileLinkEl = document.createElement('a');
      fileLinkEl.href = finalMediaUrl || '#';
      fileLinkEl.textContent = mediaName || originalName || '';
      spanFile.appendChild(fileLinkEl);

      const spanUnimportant = document.createElement('span');
      spanUnimportant.className = 'unimportant';

      const sizeNode = archivePost.querySelector('.fileText span[title]');
      const displayParts = sizeNode ? [sizeNode.textContent.trim()] : [];

      const downloadLink = document.createElement('a');
      downloadLink.href = finalMediaUrl || '#';
      downloadLink.setAttribute('download', originalName || mediaName || '');
      downloadLink.title = `Save as original filename: ${originalName || mediaName || ''}`;
      downloadLink.textContent = originalName || mediaName || '';

      if (displayParts.length) {
        spanUnimportant.appendChild(document.createTextNode(`(${displayParts[0]}, `));
        spanUnimportant.appendChild(downloadLink);
        spanUnimportant.appendChild(document.createTextNode(')'));
      } else {
        spanUnimportant.appendChild(downloadLink);
      }

      fileInfo.appendChild(spanFile);
      fileInfo.appendChild(spanUnimportant);

      const thumbLink = document.createElement('a');
      thumbLink.href = finalMediaUrl || '#';
      thumbLink.target = '_blank';

      if (mediaImg) {
        const img = mediaImg.cloneNode(true);
        img.classList.add('post-image');

        if (isDeletedImage) {
          const archiveBase = 'https://archive.holotower.org';
          const src = img.getAttribute('src');
          const fullSrc = img.getAttribute('data-full_media_src');
          const thumbSrc = img.getAttribute('data-thumb_src');

          if (src && src.startsWith('/')) img.setAttribute('src', archiveBase + src);
          if (fullSrc && fullSrc.startsWith('/')) img.setAttribute('data-full_media_src', archiveBase + fullSrc);
          if (thumbSrc && thumbSrc.startsWith('/')) img.setAttribute('data-thumb_src', archiveBase + thumbSrc);
        } else {
          const width = parseInt(img.getAttribute('width'), 10);
          const height = parseInt(img.getAttribute('height'), 10);

          if (width === 100 && height === 100) {
            const currentSrc = img.getAttribute('src');
            if (currentSrc) {
              img.setAttribute('onerror', "this.onerror=null;this.src='/static/spoiler-vt2.png';this.setAttribute('data-thumb_src', '/static/spoiler-vt2.png');");
              const checker = new Image();
              checker.onload = () => { img.removeAttribute('onerror'); };
              checker.onerror = () => {
                img.setAttribute('src', '/static/spoiler-vt2.png');
                img.setAttribute('data-thumb_src', '/static/spoiler-vt2.png');
                img.removeAttribute('onerror');
              };
              checker.src = currentSrc;
            }
          }
        }

        thumbLink.appendChild(img);
      } else if (finalMediaUrl) {
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.className = 'post-image';

        if (isDeletedImage) {
          img.src = finalMediaUrl;
        } else {
          const thumbUrl = mediaUrl.replace('/image/', '/thumb/').replace(/\.[^.]+$/, 's.jpg');
          img.src = thumbUrl;
          img.dataset.full_media_src = mediaUrl;
          img.dataset.thumb_src = thumbUrl;
        }

        thumbLink.appendChild(img);
      }

      fileWrap.appendChild(fileInfo);
      fileWrap.appendChild(thumbLink);
      files.appendChild(fileWrap);
    }

    post.appendChild(files);

    const body = document.createElement('div');
    body.className = 'body';

    if (message) {
      body.innerHTML = message.innerHTML;

      const links = body.querySelectorAll('a');
      for (let i = 0; i < links.length; i++) {
        const a = links[i];
        const qMatch = (a.textContent || '').trim().match(/^>>(\d+)$/);
        if (!qMatch) continue;

        const qId = qMatch[1];
        a.setAttribute('onclick', `highlightReply('${qId}', event);`);
        a.href = `/${board}/res/${threadNum}.html#${qId}`;
        a.removeAttribute('data-board');
        a.removeAttribute('data-board_shortname');
        a.removeAttribute('rel');
      }

      const quotes = body.querySelectorAll('span.quote');
      for (let i = 0; i < quotes.length; i++) {
        const span = quotes[i];
        if (span.querySelector('a')) continue;
        const match = span.textContent.trim().match(/^>>(\d+)$/);
        if (!match) continue;

        if (Number(match[1]) < Number(postId)) {
          const a = document.createElement('a');
          a.href = 'javascript:void(0)';
          a.className = 'quotelink';
          a.textContent = span.textContent;
          span.replaceWith(a);
        }
      }
    }

    post.appendChild(body);

    const clear = document.createElement('div');
    clear.style.clear = 'both';
    post.appendChild(clear);

    return post;
  }

  function cacheArchiveThread(board, postId, threadNum, data) {
    const host = document.querySelector('form[name="postcontrols"]');
    if (!host) return false;

    const parsed = new DOMParser().parseFromString(data.html_content || '', 'text/html');

    let wrapperId = `thread_${threadNum}`;
    if (String(threadNum) === currentThreadId) {
      wrapperId = `thread_archcache_${threadNum}`;
    }

    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'thread';
      wrapper.id = wrapperId;
      wrapper.dataset.board = board;
      wrapper.dataset.cached = 'yes';
      wrapper.style.display = 'none';
      host.insertBefore(wrapper, host.firstChild || null);
    }

    if (wrapper.querySelector(`#reply_${postId}`)) return true;

    const post = buildCachedPost(parsed, board, threadNum, postId);
    if (!post) return false;

    const firstReply = wrapper.querySelector('.post.reply');
    if (firstReply) {
      wrapper.insertBefore(post, firstReply);
    } else {
      wrapper.appendChild(post);
    }

    if (typeof initHover === 'function') {
      $(post).find('div.body a:not([rel="nofollow"])').each(initHover);
    }

    const bodyLinks = post.querySelectorAll('div.body a');
    for (let i = 0; i < bodyLinks.length; i++) {
      const qMatch = (bodyLinks[i].textContent || '').trim().match(/^>>(\d+)$/);
      if (qMatch) fetchArchive(bodyLinks[i]);
    }
    reconcileOwnershipContent(post);

    return true;
  }


  function detectStandaloneDuplicates() {
    if (document.querySelector('.duplicate-alert-close')) return;
    waitForElement('.options_tab_icon i.fa-quote-right, #you-custom-style, #youBorderSelector, span[data-sound-controls-added]', function () {
      const alert = $(`
        <div id="alert_handler">
          <div id="alert_background"></div>
          <div id="alert_div">
            <a id="alert_close" class="duplicate-alert-close" href="javascript:void(0)">
              <i class="fa fa-times"></i>
            </a>
            <div id="alert_message">
              <strong>⚠ Standalone Script Detected</strong><br><br>
              One or more of the following scripts by grem coder were detected:<br><br>
              <strong>Inline Quoting</strong><br>
              <strong>Custom Fixes</strong><br>
              <strong>Soundposts</strong><br><br>
              These features have been integrated into <strong>Holotower TS</strong>.<br>
              Disable or remove the standalone script(s) to avoid duplicate behavior.
            </div>
            <div>
              <button class="button alert_button" id="standaloneOk">OK</button>
            </div>
          </div>
        </div>
      `);

      alert.hide();
      $('body').append(alert);
      alert.fadeIn(300);

      $('#standaloneOk').on('click', function () {
        alert.fadeOut(400, () => alert.remove());
      });

      alert.on('click', '.duplicate-alert-close', function () {
        alert.fadeOut(400, () => alert.remove());
      });
    });
  }

  const INLINE_CONTAINER_CLASS = 'inline-quote-container';
  const INLINE_ACTIVE_LINK_CLASS = 'inline-active';
  const LOADING_DATA_ATTR = 'data-inline-loading';
  const ERROR_DATA_ATTR = 'data-inline-error';
  const TEMP_HIGHLIGHT_CLASS = 'inline-temp-highlight';
  const PROCESSED_ATTR = 'data-inline-processed';
  const INLINED_ID_ATTR = 'data-inlined-id';
  const CLONED_POST_CLASS = 'inline-cloned-post';
  const HOVER_INITIALIZED_ATTR = 'data-iq-hover-init';
  const INLINE_HIDDEN_CLASS = 'iq-hidden-post';

  const POST_SELECTOR_ID_FORMAT = (postId) => `div.post[id$='_${postId}']`;
  const POTENTIAL_QUOTE_LINK_SELECTOR = "a[onclick*='highlightReply'], a[href*='#q']";
  const QUOTE_LINK_REGEX = /^>>(?:>\/[a-zA-Z0-9_-]+\/)?(\d+)/;
  const SITE_HOVER_TARGET_SELECTOR = 'div.body a:not([rel="nofollow"]), span.mentioned a:not([rel="nofollow"]), span.clone-mentioned a:not([rel="nofollow"])';
  const BOARD_CONTEXT_SELECTOR = '[data-board]';
  let iqClonePostNoCounter = 0;
  const hoverFetchPromises = new Map();

  function getPostIdFromLink(link) {
    if (!link) return null;
    const textMatch = link.textContent?.trim().match(QUOTE_LINK_REGEX);
    if (textMatch) return textMatch[1];
    const hrefMatch = link.getAttribute('href')?.match(/#(\d+)$/);
    if (hrefMatch) return hrefMatch[1];
    const quoteHrefMatch = link.getAttribute('href')?.match(/#q(\d+)$/);
    if (quoteHrefMatch) return quoteHrefMatch[1];
    return null;
  }

  function fetchPostHtml(url) {
    const fetchUrl = url?.split('#')[0];
    if (!fetchUrl) return Promise.resolve(null);
    return fetch(fetchUrl)
      .then(r => r.ok ? r.text() : null)
      .catch(() => null);
  }

  function parseAndFindPost(html, postId) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const postElement = doc.querySelector(POST_SELECTOR_ID_FORMAT(postId));
      if (postElement && postElement.classList.contains('op')) {
        const filesElement = postElement.previousElementSibling;
        if (filesElement && filesElement.classList.contains('files')) {
          const wrapper = document.createElement('div');
          wrapper.appendChild(filesElement.cloneNode(true));
          wrapper.appendChild(postElement.cloneNode(true));
          return wrapper;
        }
      }
      return postElement;
    } catch (error) {
      return null;
    }
  }

  function bindHoverHandler(link) {
    if (typeof initHover !== 'function') return;
    const originalText = link.textContent;
    const match = originalText.trim().match(QUOTE_LINK_REGEX);
    if (!match) return;

    const postId = match[1];
    let el = link.parentElement;
    while (el) {
      if (el.classList.contains(CLONED_POST_CLASS) || el.classList.contains(INLINE_CONTAINER_CLASS)) {
        el = el.parentElement;
        continue;
      }
      if (el.classList.contains('post') && (el.classList.contains('reply') || el.classList.contains('op')) && el.id && (el.id.startsWith('reply_') || el.id.startsWith('op_'))) {
        if (postId === el.id.replace(/^(?:reply_|op_)/, '')) return;
        break;
      }
      el = el.parentElement;
    }

    if (match[0] === originalText.trim()) {
      initHover.call(link);
    } else {
      link.textContent = '>>' + match[1];
      initHover.call(link);
      link.textContent = originalText;
    }
  }

  function initHoverTarget(link, postId, board) {
    if (typeof initHover !== 'function') return;
    const existingPost = document.getElementById('reply_' + postId) || document.getElementById('op_' + postId);
    if (existingPost) {
      bindHoverHandler(link);
      return;
    }
    const host = document.querySelector('form[name="postcontrols"]');
    if (!host) { bindHoverHandler(link); return; }
    const wrapperId = 'thread_iqdummy_' + postId;
    let wrapper = document.getElementById(wrapperId);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'thread';
      wrapper.id = wrapperId;
      wrapper.dataset.board = board;
      wrapper.style.display = 'none';
      host.insertBefore(wrapper, host.firstChild);
    }
    if (!wrapper.querySelector('#reply_' + postId)) {
      const post = document.createElement('div');
      post.className = 'post reply';
      post.id = 'reply_' + postId;
      post.dataset.board = board;
      post.innerHTML = '<div class="body"><span class="iq-loading">Loading...</span></div>';
      wrapper.appendChild(post);
    }
    bindHoverHandler(link);
    let fetched = false;
    link.addEventListener('mouseenter', async function onHover() {
      if (fetched) return;
      fetched = true;
      const url = link.getAttribute('href')?.split('#')[0];
      if (!url) return;
      const fetchPromise = fetchPostHtml(url).then(html => {
        if (!html) {
          const dummyPost = document.querySelector('#' + wrapperId + ' #reply_' + postId);
          if (dummyPost) {
            dummyPost.innerHTML = '<div class="body"><span style="color: red;">Post not found.</span></div>';
            updateHoverContent(postId, dummyPost);
          }
          return;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const threadEl = doc.querySelector('div[id^="thread_"]');
        const fetchedThreadId = threadEl ? threadEl.id.replace('thread_', '') : '';
        doc.querySelectorAll('div.post.reply, div.post.op').forEach(fetchedPost => {
          const existing = document.querySelector('[data-board="' + board + '"] #' + fetchedPost.id);
          if (!existing) {
            const threadWrapper = document.querySelector('[data-board="' + board + '"]#thread_' + fetchedThreadId);
            if (threadWrapper) {
              const firstReply = threadWrapper.querySelector('.post.reply');
              if (firstReply) firstReply.before(fetchedPost);
              else threadWrapper.appendChild(fetchedPost);
              reconcileOwnershipContent(fetchedPost, { refreshNavigation: true, refreshFavicon: true });
            }
          }
        });
        if (threadEl && !document.querySelector('[data-board="' + board + '"]#thread_' + fetchedThreadId)) {
          threadEl.style.display = 'none';
          threadEl.setAttribute('data-cached', 'yes');
          threadEl.setAttribute('data-board', board);
          host.insertBefore(threadEl, host.firstChild);
          reconcileOwnershipContent(threadEl);
        }
        const realPost = document.querySelector('[data-board="' + board + '"] div.post#reply_' + postId);
        const dummyPost = document.querySelector('#' + wrapperId + ' #reply_' + postId);
        if (realPost && dummyPost) {
          const clone = realPost.cloneNode(true);
          clone.querySelectorAll('span.mentioned, a.post_anchor').forEach(el => el.remove());
          dummyPost.innerHTML = '';
          while (clone.firstChild) dummyPost.appendChild(clone.firstChild);
          updateHoverContent(postId, dummyPost);
        }
        link.addEventListener('mouseleave', function() {
          const dummyThread = document.getElementById(wrapperId);
          if (dummyThread) dummyThread.remove();
        }, { once: true });
      });
      hoverFetchPromises.set(postId, fetchPromise);
      try {
        await fetchPromise;
      } finally {
        hoverFetchPromises.delete(postId);
      }
    }, { once: true });
  }

  function isElementInViewportStrict(el) {
    el = el && el[0] ? el[0] : el;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
  }

  function temporaryHighlight(el) {
    el = el && el[0] ? el[0] : el;
    if (!el) return;
    $(el).addClass(TEMP_HIGHLIGHT_CLASS);
    setTimeout(() => { $(el).removeClass(TEMP_HIGHLIGHT_CLASS); }, 500);
  }

  function processQuoteLinks(parentElement) {
    if (!parentElement) return;
    const links = parentElement.querySelectorAll(POTENTIAL_QUOTE_LINK_SELECTOR);
    links.forEach(link => {
      if (!link.hasAttribute(PROCESSED_ATTR)) {
        const onclickValue = link.getAttribute('onclick');
        if (onclickValue && onclickValue.includes('highlightReply')) {
          link.removeAttribute('onclick');
        }
        link.setAttribute(PROCESSED_ATTR, 'true');
      }
    });
  }

  function toggleOriginalVisibility(postId, hide) {
    const original = document.querySelector(POST_SELECTOR_ID_FORMAT(postId));
    if (!original) return;

    let startNode = original;
    if (original.classList.contains('op') && original.previousElementSibling?.classList.contains('files')) {
      startNode = original.previousElementSibling;
    }

    const elementsToToggle = [original];
    if (startNode !== original) {
      elementsToToggle.push(startNode);
    }

    let prev = startNode.previousSibling;
    while (prev) {
      if (prev.nodeType === Node.ELEMENT_NODE) {
        if (
          prev.classList.contains('post') ||
          prev.classList.contains('files') ||
          prev.classList.contains('inline-quote-container') ||
          prev.tagName === 'HR' ||
          prev.tagName === 'FORM'
        ) {
          break;
        }
      }
      elementsToToggle.push(prev);
      prev = prev.previousSibling;
    }

    elementsToToggle.forEach(el => {
      if (el.nodeType === Node.ELEMENT_NODE) {
        if (hide) {
          el.classList.add(INLINE_HIDDEN_CLASS);
        } else {
          el.classList.remove(INLINE_HIDDEN_CLASS);
        }
      }
    });
  }

  function cleanInlineContainer($container) {
    $container.find('> .inline-cloned-post > p.intro').each(function() {
      let next = this.nextSibling;
      while (next && next.nodeType === 3 && !/\S/.test(next.nodeValue)) {
        let toRemove = next;
        next = next.nextSibling;
        toRemove.parentNode.removeChild(toRemove);
      }
    });

    $container.find('> .inline-cloned-post > .files').each(function() {
      let next = this.nextSibling;
      while (next && next.nodeType === 3 && !/\S/.test(next.nodeValue)) {
        let toRemove = next;
        next = next.nextSibling;
        toRemove.parentNode.removeChild(toRemove);
      }

      if (!this.innerText.trim() && !this.querySelector('img, video, a, object, embed')) {
        this.parentNode.removeChild(this);
      }
    });
  }

  async function handleInlineQuoteClick(linkElement, postId) {
    const $link = $(linkElement);
    let $mainPost = $link.closest('.post.reply, .post.op, section.post');
    if ($mainPost.hasClass('post-hover')) {
      const match = $mainPost.attr('id') && $mainPost.attr('id').match(/^post-hover-(\d+)/);
      if (match) {
        $mainPost = $(`.post.reply#reply_${match[1]}, .post.op#op_${match[1]}`);
      }
    }
    const $body = $mainPost.find('.body').first();

    let $existingContainer = $();
    const $mentionedSpan = $link.closest('span.mentioned.unimportant, span.clone-mentioned.unimportant');
    if ($mentionedSpan.length) {
      let el = $mentionedSpan[0].nextSibling;
      while (el) {
        if (el.nodeType === 1 && el.classList.contains(INLINE_CONTAINER_CLASS) && el.getAttribute(INLINED_ID_ATTR) === postId) {
          $existingContainer = $(el);
          break;
        }
        if (el.nodeType === 1 && !el.classList.contains(INLINE_CONTAINER_CLASS)) break;
        el = el.nextSibling;
      }
    } else {
      let anchor = $link[0];
      while (true) {
        let next = anchor.nextSibling;
        if (!next) break;
        if (next.nodeType === 3 && /^\s*$/.test(next.nodeValue)) {
          let peek = next.nextSibling;
          if (peek && peek.nodeType === 1 && (peek.tagName === 'SMALL' || peek.classList.contains('hash-link'))) {
            anchor = peek;
            continue;
          }
          break;
        }
        if (next.nodeType === 1 && (next.tagName === 'SMALL' || next.classList.contains('hash-link'))) {
          anchor = next;
          continue;
        }
        if (next.nodeType === 1 && next.classList.contains(INLINE_CONTAINER_CLASS) && next.getAttribute(INLINED_ID_ATTR) === postId) {
          $existingContainer = $(next);
        }
        break;
      }
    }
    if ($existingContainer.length) {
      const nestedIds = [];
      if (hideInlinedPosts) {
        $existingContainer.find(`.${INLINE_CONTAINER_CLASS}`).each(function() {
          const nId = $(this).attr(INLINED_ID_ATTR);
          if (nId) nestedIds.push(nId);
        });
      }

      $existingContainer.remove();
      $('#chx_hoverImage').remove();

      if (hideInlinedPosts) {
        nestedIds.forEach(nId => {
          if ($(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${nId}"]`).length === 0) {
            toggleOriginalVisibility(nId, false);
          }
        });
      }
    }

    if ($link.hasClass(INLINE_ACTIVE_LINK_CLASS)) {
      $link.removeClass(INLINE_ACTIVE_LINK_CLASS).removeAttr(LOADING_DATA_ATTR).removeAttr(ERROR_DATA_ATTR);
      if (hideInlinedPosts) {
        if ($(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${postId}"]`).length === 0) {
          toggleOriginalVisibility(postId, false);
        }
      }
      return;
    }

    let targetPostElement = document.querySelector(POST_SELECTOR_ID_FORMAT(postId));
    let boardValue = null;
    const $linkContext = $link.closest(BOARD_CONTEXT_SELECTOR);
    if ($linkContext.length > 0) boardValue = $linkContext.data('board');
    else if (targetPostElement) {
      const $targetContext = $(targetPostElement).closest(BOARD_CONTEXT_SELECTOR);
      if ($targetContext.length > 0) boardValue = $targetContext.data('board');
    }

    if (targetPostElement && targetPostElement.closest('.thread[id^="thread_iqdummy_"], .thread[id^="thread_archdummy_"]')) {
      const hoverPromise = hoverFetchPromises.get(postId);
      if (hoverPromise) {
        $link.addClass(INLINE_ACTIVE_LINK_CLASS).attr(LOADING_DATA_ATTR, "true");
        try { await hoverPromise; } catch (e) {}
        $link.removeAttr(LOADING_DATA_ATTR);
        hoverFetchPromises.delete(postId);
      }

      if (!hoverPromise && targetPostElement.closest('.thread[id^="thread_archdummy_"]')) {
        const board = linkElement.closest('[data-board]')?.getAttribute('data-board') || boardValue || currentBoard;
        if (board) {
          const archiveApiUrl = `https://archive.holotower.org/${board}/post/${postId}`;
          const cachedPromise = archiveQuoteCache.get(archiveApiUrl);
          if (cachedPromise) {
            $link.addClass(INLINE_ACTIVE_LINK_CLASS).attr(LOADING_DATA_ATTR, "true");
            try { await cachedPromise; } catch (e) {}
            $link.removeAttr(LOADING_DATA_ATTR);
          }
        }
      }

      const allPosts = document.querySelectorAll(POST_SELECTOR_ID_FORMAT(postId));
      let found = null;
      for (let i = 0; i < allPosts.length; i++) {
        if (!allPosts[i].closest('.thread[id^="thread_iqdummy_"], .thread[id^="thread_archdummy_"]')) {
          found = allPosts[i];
          break;
        }
      }
      targetPostElement = found;
    }

    if (!alwaysInline && targetPostElement && isElementInViewportStrict(targetPostElement)) {
      temporaryHighlight(targetPostElement);
      $link.removeClass(INLINE_ACTIVE_LINK_CLASS).removeAttr(LOADING_DATA_ATTR).removeAttr(ERROR_DATA_ATTR);
      return;
    }

    let isAncestor = false;
    let $highlightTarget = null;

    $link.parents('.post').each(function() {
      let pid = null;
      if ($(this).hasClass('inline-cloned-post')) {
        pid = $(this).closest(`.${INLINE_CONTAINER_CLASS}`).attr(INLINED_ID_ATTR);
      } else {
        const match = $(this).attr('id')?.match(/^(?:reply_|op_)(\d+)/);
        if (match) pid = match[1];
      }
      if (pid === postId) {
        isAncestor = true;
        $highlightTarget = $(this);
        return false;
      }
    });

    if (isAncestor) {
      temporaryHighlight($highlightTarget);
      $link.removeClass(INLINE_ACTIVE_LINK_CLASS).removeAttr(LOADING_DATA_ATTR).removeAttr(ERROR_DATA_ATTR);
      return;
    }

    $link.addClass(INLINE_ACTIVE_LINK_CLASS).attr(LOADING_DATA_ATTR, "true");

    if (!targetPostElement && linkElement.classList?.contains('archive-dead')) {
      const board = linkElement.closest('[data-board]')?.getAttribute('data-board') || boardValue || currentBoard;
      if (board) {
        const archiveApiUrl = `https://archive.holotower.org/${board}/post/${postId}`;
        let cachedPromise = archiveQuoteCache.get(archiveApiUrl);
        if (!cachedPromise) {
          loadArchiveQuote(linkElement, board, postId);
          cachedPromise = archiveQuoteCache.get(archiveApiUrl);
        }
        if (cachedPromise) {
          try { await cachedPromise; } catch (e) {}
        }
        const allPosts = document.querySelectorAll(POST_SELECTOR_ID_FORMAT(postId));
        for (let i = 0; i < allPosts.length; i++) {
          if (!allPosts[i].closest('.thread[id^="thread_iqdummy_"], .thread[id^="thread_archdummy_"]')) {
            targetPostElement = allPosts[i];
            break;
          }
        }
      }
    }

    if (!targetPostElement && linkElement.href) {
      const postHtml = await fetchPostHtml(linkElement.href);
      if (postHtml) {
        const parsed = parseAndFindPost(postHtml, postId);
        if (parsed) {
          try {
            const fetchedBoard = new URL(linkElement.href, location.href).pathname.match(/^\/([a-zA-Z0-9_-]+)\//)?.[1];
            if (fetchedBoard) {
              parsed.dataset.board = fetchedBoard;
              boardValue = fetchedBoard;
            }
          } catch (e) {}
          reconcileOwnershipContent(parsed);
          targetPostElement = parsed;
        }
      }
    }
    $link.removeAttr(LOADING_DATA_ATTR);

    if (targetPostElement) {
      let sourceElementToClone = targetPostElement;
      if (sourceElementToClone.classList && sourceElementToClone.classList.contains('op') && sourceElementToClone.parentNode) {
        const filesElement = sourceElementToClone.previousElementSibling;
        if (filesElement && filesElement.classList.contains('files')) {
          const wrapper = document.createElement('div');
          wrapper.appendChild(filesElement.cloneNode(true));
          wrapper.appendChild(sourceElementToClone.cloneNode(true));
          sourceElementToClone = wrapper;
        }
      }

      const $container = $('<div>')
        .addClass(INLINE_CONTAINER_CLASS)
        .attr(INLINED_ID_ATTR, postId)
        .attr('data-board', boardValue || currentBoard || '');

      const $mentionedSpan = $link.closest('span.mentioned.unimportant, span.clone-mentioned.unimportant');

      let doInsert = () => {};

      if ($mentionedSpan.length) {
        let $insertionAnchor = $mentionedSpan;
        const $linksInSpan = $mentionedSpan.find('a');
        const clickedLinkIndex = $linksInSpan.index($link);

        for (let i = clickedLinkIndex - 1; i >= 0; i--) {
          const id = getPostIdFromLink($linksInSpan[i]);
          if (id) {
            const $containerForLink = $mainPost.find(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${id}"]`);
            if ($containerForLink.length) {
              $insertionAnchor = $containerForLink.first();
              break;
            }
          }
        }
        doInsert = () => $insertionAnchor.after($container);
      } else {
        let insertAfterTarget = $link[0];

        while (true) {
          let nextNode = insertAfterTarget.nextSibling;
          if (!nextNode) break;

          if (nextNode.nodeType === 3 && /^\s*$/.test(nextNode.nodeValue)) {
            let peek = nextNode.nextSibling;
            if (peek && peek.nodeType === 1 && peek.tagName === 'SMALL') {
              insertAfterTarget = peek;
              continue;
            } else {
              break;
            }
          } else if (nextNode.nodeType === 1 && nextNode.tagName === 'SMALL') {
            insertAfterTarget = nextNode;
            continue;
          } else if (nextNode.nodeType === 1 && nextNode.classList.contains('hash-link')) {
            insertAfterTarget = nextNode;
            continue;
          }
          break;
        }

        doInsert = () => $(insertAfterTarget).after($container);
      }

      let handled = false;
      if (window.g?.posts) {
        const boardID = boardValue;
        const postKey = `${boardID}.${postId}`;
        const postObj = g.posts.get(postKey);
        if (postObj && typeof postObj.addClone === 'function') {
          const cloneObj = postObj.addClone($container[0], false);
          $(cloneObj.nodes.root)
            .addClass(CLONED_POST_CLASS)
            .attr(PROCESSED_ATTR, 'true');
          handled = true;
        }
      }
      if (!handled) {
        const cloned = document.createElement('section');
        let actualPost = sourceElementToClone;
        if (sourceElementToClone && !sourceElementToClone.classList.contains('post')) {
          actualPost = sourceElementToClone.querySelector('.post');
        }

        let originalClasses = actualPost ? actualPost.className : '';
        originalClasses = originalClasses.replace(new RegExp('\\b' + INLINE_HIDDEN_CLASS + '\\b', 'g'), '').replace(/\s+/g, ' ').trim();
        cloned.className = originalClasses + ' ' + CLONED_POST_CLASS;

        const postContent = sourceElementToClone.cloneNode(true);

        if (postContent.removeAttribute) postContent.removeAttribute('id');
        postContent.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

        $(postContent).find('a[data-expanded="true"]').each(function() {
          $(this).removeData('expanded').removeAttr('data-expanded');
          $(this).find('img.full-image').remove();
          $(this).find('img.post-image').css({opacity: '', display: ''});
        });

        while (postContent.firstChild) {
          cloned.appendChild(postContent.firstChild);
        }

        cloned.setAttribute('id', 'thread_0');
        if (boardValue) cloned.setAttribute('data-board', boardValue);
        else cloned.setAttribute('data-board-missing', 'true');

        $(cloned).find('.' + INLINE_HIDDEN_CLASS).removeClass(INLINE_HIDDEN_CLASS);
        cloned.querySelectorAll('span.mentioned').forEach(el => {
          el.classList.remove('mentioned');
          el.classList.add('clone-mentioned');
        });

        $container.append(cloned);

        $container.on('click', 'a', function(e) {
          const thumb = this.childNodes[0];
          if (thumb && thumb.className && thumb.className.match(/post-image/) && !this.className.match(/file/)) {
            if (e.which === 2 || e.ctrlKey || e.shiftKey || e.metaKey) return;

            e.stopPropagation();

            $('#chx_hoverImage').remove();

            const $a = $(this);
            const $thumb = $(thumb);

            if (!this.onclick) {
              e.preventDefault();
              if (!$a.data('expanded')) {
                $a.data('expanded', 'true');
                $thumb.css({'opacity': '0.4', 'pointer-events': 'none'});
                const $full = $('<img>').addClass('full-image').css('display', 'none').attr('alt', 'Fullsized image');
                $full.on('load', function() {
                  $thumb.css('display', 'none');
                  $full.css('display', '');
                });
                $full.attr('src', $a.attr('href'));
                $a.append($full);
              } else {
                $a.removeData('expanded');
                $a.find('.full-image').remove();
                $thumb.css({'opacity': '', 'display': '', 'pointer-events': ''});

                let padding = 5;

                const boardlist = document.querySelector('.boardlist');
                if (boardlist && getComputedStyle(boardlist).position === 'fixed') {
                  padding += boardlist.getBoundingClientRect().height;
                }

                const headerBar = document.querySelector('#header-bar.dialog');
                if (headerBar) {
                  const classList = headerBar.classList;

                  const hasOnlyAutohide = classList.length === 2 &&
                        classList.contains('dialog') &&
                        classList.contains('autohide');

                  if (!hasOnlyAutohide) {
                    const style = getComputedStyle(headerBar);
                    const hasBottom = parseFloat(style.bottom) < 1;

                    if (style.position === 'fixed' && !hasBottom) {
                      padding += headerBar.getBoundingClientRect().height;
                    }
                  }
                }

                if ($thumb[0].getBoundingClientRect().top - padding < 0) {
                  $(document).scrollTop($container.offset().top - padding);
                }

                this.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
              }
            } else {
              setTimeout(() => {
                if ($a.data('expanded')) {
                  $thumb.css('pointer-events', 'none');
                  $('#chx_hoverImage').remove();
                } else {
                  $thumb.css('pointer-events', '');
                  $('#chx_hoverImage').remove();
                  this.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
                }
              }, 10);
            }
          }
        });

        cleanInlineContainer($container);

        doInsert();

        if (typeof initHover === 'function') {
          $(cloned).find(SITE_HOVER_TARGET_SELECTOR + ', a.archive-quote').each(function() {
            if (this.hasAttribute(HOVER_INITIALIZED_ATTR)) return;
            const linkPostId = getPostIdFromLink(this);
            if (!linkPostId) return;
            if (linkPostId === postId) return;
            if ($(this).parents(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${linkPostId}"]`).length) return;
            this.setAttribute(HOVER_INITIALIZED_ATTR, 'true');
            const board = cloned.getAttribute('data-board') || boardValue || '';
            initHoverTarget(this, linkPostId, board);
          });
        }

        if (linkPreview) {
            const bodyLinks = Array.from(cloned.querySelectorAll(':scope a')).filter(a => !a.closest('.file'));
          bindLinkPreviews(bodyLinks, true);
          if (siteImageHover) {
            const fileLinks = cloned.querySelectorAll('.file a[target="_blank"]');
            bindLinkPreviews(fileLinks, true);
          }
        }
        if (linkEmbed || resizeMedia) {
          $(cloned).find('.embed-button[data-embedurl]').each(function() {
            const url = this.getAttribute('data-embedurl');
            if (!url || (!linkEmbed && !(resizeMedia && isYouTubeUrl(url)))) return;
            this.addEventListener('click', onEmbedClick);
          });
        }
        if (quoteResurrect) {
          $(cloned).find('a').each(function() {
            const qMatch = (this.textContent?.trim() || '').match(/^>>(\d+)$/);
            if (!qMatch) return;
            const qId = qMatch[1];
            const board = currentBoard || (this.closest('[data-board]')?.getAttribute('data-board')) || '';
            if (!board) return;
            if (this.classList.contains('archive-quote')) {
              if (this.dataset.archiveState === 'dead') {
                const host = document.querySelector('form[name="postcontrols"]');
                if (host) {
                  const dummyThreadId = `thread_archdummy_${qId}`;
                  let wrapper = document.getElementById(dummyThreadId);
                  if (!wrapper) {
                    wrapper = document.createElement('div');
                    wrapper.className = 'thread';
                    wrapper.id = dummyThreadId;
                    wrapper.dataset.board = board;
                    wrapper.style.display = 'none';
                    host.insertBefore(wrapper, host.firstChild);
                  }
                  if (!wrapper.querySelector(`#reply_${qId}`)) {
                    const post = document.createElement('div');
                    post.className = 'post reply';
                    post.id = `reply_${qId}`;
                    post.dataset.board = board;
                    post.innerHTML = `<div class="body"><span class="archive-loading">Loading post No.${qId}...</span></div>`;
                    wrapper.appendChild(post);
                  }
                }
                loadArchiveQuote(this, board, qId);
              }
              return;
            }
            const localReply = document.querySelector(`div.post#reply_${qId}`);
            if (localReply && !localReply.closest('[id^="thread_iqdummy_"], [id^="thread_archdummy_"], [id^="thread_archcache_"]')) return;
            if (document.querySelector(`form[name="postcontrols"] [data-cached="yes"] #reply_${qId}`)) return;
            fetchArchive(this);
          });
        }

        $(cloned).find('.post-btn').remove();
        $(cloned).find('input.delete').remove();
        $('a.mentioned-thread_0').remove();
      } else {
        doInsert();
      }

      $container.find(`.${CLONED_POST_CLASS} .post_no:not([id]), .${CLONED_POST_CLASS}.post_no:not([id])`).each(function() {
        this.id = 'iq-clone-postno-' + (iqClonePostNoCounter++);
      });

      if (!$mentionedSpan.length) {
        $container.find('.inline-cloned-post')[0]?.style.setProperty('max-width', '100%', 'important');
        $container.find('.inline-cloned-post').css('box-sizing','border-box');
      }

      if (hideInlinedPosts) {
        toggleOriginalVisibility(postId, true);
      }

    } else {
      $link.attr(ERROR_DATA_ATTR, "true").removeClass(INLINE_ACTIVE_LINK_CLASS);
      setTimeout(() => { $link.removeAttr(ERROR_DATA_ATTR); }, 3000);
    }
  }

  function syncBacklinksAfterSitePass(postEl) {
    const idMatch = (postEl.id || '').match(/^(?:reply_|op_)(\d+)$/);
    if (!idMatch) return;
    const replyId = idMatch[1];
    const cls = 'mentioned-' + replyId;

    const quotedIds = new Set();
    $(postEl).find('div.body a').each(function() {
      if ($(this).closest(`.${INLINE_CONTAINER_CLASS}`).length) return;
      const m = (this.textContent || '').trim().match(/^>>(\d+)/);
      if (m) quotedIds.add(m[1]);
    });

    quotedIds.forEach(quotedId => {
      const realTarget = document.getElementById('reply_' + quotedId) || document.getElementById('op_' + quotedId);
      if (realTarget) {
        const $real = $(realTarget);
        let $row = $real.children('p.intro').children('span.mentioned');
        const $direct = $row.children('a.' + cls);
        const $strays = $real.find('a.' + cls).not($direct);
        if ($strays.length) {
          const $original = $strays.last();
          if (!$row.length) {
            $row = $('<span class="mentioned unimportant"></span>').appendTo($real.children('p.intro'));
          }
          if ($direct.length) {
            $direct.first().replaceWith($original);
            $direct.slice(1).remove();
          } else {
            $row.append($original);
          }
          $strays.not($original).remove();
          $real.find(`.${CLONED_POST_CLASS} span.mentioned, .${CLONED_POST_CLASS} span.clone-mentioned`).filter(function() {
            return !this.childNodes.length;
          }).remove();
        }
        if (hashNavigation) addHashLinks(realTarget);
      }

      $(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${quotedId}"] > .${CLONED_POST_CLASS}`).each(function() {
        const $intro = $(this).children('p.intro');
        if (!$intro.length) return;
        let $cloneRow = $intro.children('span.clone-mentioned').first();
        if (!$cloneRow.length) {
          $cloneRow = $('<span class="clone-mentioned unimportant"></span>').appendTo($intro);
        }
        if (!$cloneRow.children('a.' + cls).length) {
          const newLink = $('<a>', { 'class': cls, href: '#' + replyId, text: '>>' + replyId }).attr('onclick', "highlightReply('" + replyId + "')").appendTo($cloneRow);
          if (typeof initHover === 'function') bindHoverHandler(newLink[0]);
        }
        if (hashNavigation) addHashLinks(this);
      });

      const hover = document.getElementById('post-hover-' + quotedId);
      if (hover) {
        const intro = hover.querySelector('p.intro');
        if (intro) {
          let hoverRow = intro.querySelector('span.clone-mentioned');
          if (!hoverRow) {
            hoverRow = document.createElement('span');
            hoverRow.className = 'clone-mentioned unimportant';
            intro.appendChild(hoverRow);
          }
          if (!hoverRow.querySelector('a.' + cls)) {
            const link = document.createElement('a');
            link.className = cls;
            link.href = '#' + replyId;
            link.textContent = '>>' + replyId;
            link.setAttribute('onclick', "highlightReply('" + replyId + "')");
            hoverRow.appendChild(link);
          }
        }
        if (hashNavigation) addHashLinks(hover);
      }
    });
  }

  function initializeMediaResize() {
    if (!resizeMedia) return;

    const selector = 'img.full-image, img.photo-img.expanded, video[controls], .media-embed > img';
    const cornerSize = 20;
    let activeResize = null;
    let cursorMedia = null;
    let originalCursor = null;
    let resizeClickBlock = null;
    let resizeFrame = null;
    let pendingResizePoint = null;
    const originalMediaSizing = new WeakMap();

    function isYouTubeIframe(iframe) {
      return iframe instanceof HTMLIFrameElement && isYouTubeUrl(iframe.src);
    }

    function isVisibleElement(element) {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
    }

    function isResizableMedia(media) {
      if (!(media instanceof Element)) return false;
      if (media instanceof HTMLIFrameElement) return isYouTubeIframe(media) && isVisibleElement(media);
      return media.matches(selector) && isVisibleElement(media);
    }

    function restoreCursor() {
      if (!cursorMedia) return;
      if (originalCursor.value) cursorMedia.style.setProperty('cursor', originalCursor.value, originalCursor.priority);
      else cursorMedia.style.removeProperty('cursor');
      cursorMedia = null;
      originalCursor = null;
    }

    function setResizeCursor(media) {
      if (cursorMedia === media) return;
      restoreCursor();
      cursorMedia = media;
      originalCursor = {
        value: media.style.getPropertyValue('cursor'),
        priority: media.style.getPropertyPriority('cursor')
      };
      media.style.setProperty('cursor', 'se-resize', 'important');
    }

    function saveMediaSize(media) {
      if (originalMediaSizing.has(media)) return;
      const properties = ['width', 'height', 'max-width', 'max-height'];
      const sizing = {};
      for (const property of properties) {
        sizing[property] = {
          value: media.style.getPropertyValue(property),
          priority: media.style.getPropertyPriority(property)
        };
      }
      originalMediaSizing.set(media, sizing);
    }

    function restoreMediaSize(media) {
      const sizing = originalMediaSizing.get(media);
      if (!sizing) return;
      for (const [property, original] of Object.entries(sizing)) {
        if (original.value) media.style.setProperty(property, original.value, original.priority);
        else media.style.removeProperty(property);
      }
      originalMediaSizing.delete(media);
    }

    function getResizeMedia(target) {
      return target instanceof Element ? target.closest(selector) : null;
    }

    function getResizeTarget(eventTarget) {
      if (!(eventTarget instanceof Element)) return null;
      const iframe = eventTarget.matches('.ts-resize-media-youtube')
        ? eventTarget.querySelector(':scope > iframe.ts-resize-media-youtube-frame') : null;
      if (iframe) return { media: iframe, captureTarget: eventTarget, isIframe: true };
      const video = eventTarget.matches(':is(div, span)') ? eventTarget.querySelector(':scope > video[controls]') : null;
      if (video) return { media: video, captureTarget: eventTarget, isIframe: false };
      const media = getResizeMedia(eventTarget);
      return media ? { media, captureTarget: media, isIframe: false } : null;
    }

    function isResizeCorner(event, media) {
      if (!isResizableMedia(media)) return false;
      const rect = media.getBoundingClientRect();
      const offset = media instanceof HTMLIFrameElement || media.matches('video[controls]') ? 16 : 0;
      return event.clientX >= rect.right + offset - cornerSize && event.clientX <= rect.right + offset &&
             event.clientY >= rect.bottom + offset - cornerSize && event.clientY <= rect.bottom + offset;
    }

    function updateResizeCursor(event) {
      if (activeResize) return;
      const resizeTarget = getResizeTarget(event.target);
      if (resizeTarget?.isIframe) {
        restoreCursor();
        return;
      }
      const media = resizeTarget?.media;
      if (media && isResizeCorner(event, media)) setResizeCursor(media);
      else restoreCursor();
    }

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (resizeClickBlock && performance.now() <= resizeClickBlock.expires) {
        const targetMedia = getResizeMedia(target);
        if (targetMedia === resizeClickBlock.media || target === resizeClickBlock.host || resizeClickBlock.host?.contains(target)) {
          event.preventDefault();
          event.stopImmediatePropagation();
          resizeClickBlock = null;
          return;
        }
      }
    }, true);

    function applyResize() {
      resizeFrame = null;
      const point = pendingResizePoint;
      pendingResizePoint = null;
      if (!activeResize || !point) return;
      const { media, startWidth, startHeight } = activeResize;
      if (!media.isConnected || !activeResize.captureTarget.isConnected) {
        cancelResize();
        return;
      }
      const dx = point.clientX - activeResize.startX;
      const dy = point.clientY - activeResize.startY;
      if (!activeResize.moved && Math.hypot(dx, dy) < 3) return;
      if (!activeResize.moved) {
        activeResize.moved = true;
        saveMediaSize(media);
        media.style.setProperty('max-width', 'none');
        media.style.setProperty('max-height', 'none');
        if (!activeResize.isIframe) media.style.setProperty('height', 'auto', 'important');
      }

      const scaleDelta = Math.abs(dx / startWidth) >= Math.abs(dy / startHeight)
        ? dx / startWidth : dy / startHeight;
      const minScale = Math.max(32 / startWidth, 32 / startHeight);
      const maxScale = Math.min(8192 / startWidth, 8192 / startHeight);
      const scale = Math.max(minScale, Math.min(maxScale, 1 + scaleDelta));
      const width = Math.round(startWidth * scale);
      const height = Math.round(startHeight * scale);
      if (activeResize.width !== width) {
        media.style.setProperty('width', width + 'px', 'important');
        activeResize.width = width;
      }
      if (activeResize.isIframe && activeResize.height !== height) {
        media.style.setProperty('height', height + 'px', 'important');
        activeResize.height = height;
      }
    }

    document.addEventListener('pointermove', (event) => {
      if (activeResize && (!activeResize.captureTarget.isConnected || !activeResize.media.isConnected)) {
        cancelResize();
        return;
      }
      if (!activeResize) {
        updateResizeCursor(event);
        return;
      }
      if (event.pointerId !== activeResize.pointerId) return;
      pendingResizePoint = { clientX: event.clientX, clientY: event.clientY };
      if (resizeFrame === null) resizeFrame = requestAnimationFrame(applyResize);
      event.preventDefault();
    }, true);

    document.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.isPrimary === false) return;
      const resizeTarget = getResizeTarget(event.target);
      if (!resizeTarget || !isResizeCorner(event, resizeTarget.media)) return;
      const { media, captureTarget, isIframe } = resizeTarget;
      const rect = media.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      event.preventDefault();
      event.stopPropagation();
      if (!isIframe) setResizeCursor(media);
      activeResize = {
        media,
        host: media.parentElement,
        captureTarget,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: rect.width,
        startHeight: rect.height,
        isIframe,
        moved: false
      };
      captureTarget.setPointerCapture?.(event.pointerId);
    }, true);

    function finishResize(event) {
      if (!activeResize || event.pointerId !== activeResize.pointerId) return;
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = null;
      if (event.type === 'pointerup') {
        pendingResizePoint = { clientX: event.clientX, clientY: event.clientY };
        applyResize();
      }
      pendingResizePoint = null;
      if (!activeResize) return;
      const finished = activeResize;
      activeResize = null;
      if (finished.captureTarget.hasPointerCapture?.(event.pointerId)) finished.captureTarget.releasePointerCapture(event.pointerId);
      if (finished.moved && event.type === 'pointerup') {
        resizeClickBlock = { media: finished.media, host: finished.host, expires: performance.now() + 250 };
        setTimeout(() => {
          if (resizeClickBlock?.media === finished.media && resizeClickBlock.expires <= performance.now()) resizeClickBlock = null;
        }, 260);
      }
      if (event.type === 'pointercancel') restoreCursor();
      else updateResizeCursor(event);
    }

    function cancelResize() {
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame);
      resizeFrame = null;
      pendingResizePoint = null;
      const interruptedResize = activeResize;
      activeResize = null;
      resizeClickBlock = null;
      if (interruptedResize?.captureTarget.isConnected &&
          interruptedResize.captureTarget.hasPointerCapture?.(interruptedResize.pointerId)) {
        try {
          interruptedResize.captureTarget.releasePointerCapture(interruptedResize.pointerId);
        } catch (e) {}
      }
      restoreCursor();
    }

    document.addEventListener('pointerup', finishResize, true);
    document.addEventListener('pointercancel', finishResize, true);
    document.addEventListener('lostpointercapture', (event) => {
      if (!activeResize || activeResize.captureTarget !== event.target ||
          activeResize.pointerId !== event.pointerId) return;
      cancelResize();
    }, true);
    document.addEventListener('pointerout', (event) => {
      if (activeResize || !cursorMedia) return;
      const related = event.relatedTarget;
      if ((event.target === cursorMedia || cursorMedia.contains(event.target)) &&
          !(related === cursorMedia || cursorMedia.contains(related))) restoreCursor();
    }, true);
    document.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.matches('img.photo-img') && !event.target.matches('.expanded')) {
        restoreMediaSize(event.target);
      }
      if (cursorMedia && !isResizableMedia(cursorMedia)) restoreCursor();
    });
    window.addEventListener('blur', () => {
      cancelResize();
    });
  }

  const SITE_VOLUME_KEY = 'videovolume';
  const VOLUME_FALLBACK = 1.0;

  const soundMap = new Map();
  const active = new Map();
  let soundpostDetected = false;

  const NATIVE_EXPANDED_IMAGE_SELECTOR = 'img.full-image';
  const NATIVE_HOVER_IMAGE_SELECTOR = '#chx_hoverImage';
  const IQ_HOVER_IMAGE_SELECTOR = 'img[style*="position: fixed"][style*="pointer-events: none"]';
  const ALL_IMAGE_SELECTORS = `${NATIVE_EXPANDED_IMAGE_SELECTOR}, ${NATIVE_HOVER_IMAGE_SELECTOR}, ${IQ_HOVER_IMAGE_SELECTOR}`;

  const siteVolume = () => {
    let v = localStorage.getItem(SITE_VOLUME_KEY);
    if (typeof v === "string" && v.startsWith('"') && v.endsWith('"')) {
      v = v.slice(1, -1);
    }
    v = parseFloat(v);
    if (!isFinite(v) || v < 0 || v > 1) v = VOLUME_FALLBACK;
    return v;
  };

  const ALLOWED_SOUND_DOMAINS = [
    'files.catbox.moe',
    'litter.catbox.moe',
    'files.pixstash.moe',
    'litter.pixstash.moe',
    'files.fatbox.moe',
    'litter.fatbox.moe',
    'x0.at'
  ];

  const isAllowedSoundURL = (url) => {
    try {
      const urlObj = new URL(url);
      return ALLOWED_SOUND_DOMAINS.includes(urlObj.hostname);
    } catch {
      return false;
    }
  };

  const tagIcon = (span, fullURL) => {
    if (span.dataset.soundControlsAdded) {
      detectStandaloneDuplicates();
      return;
    }
    if (span.dataset.soundControls) return;
    span.dataset.soundControls = 'true';
    const link = document.createElement('a');
    link.href = fullURL;
    link.target = '_blank';
    link.innerHTML = ' <i class="fa fa-volume-up" style="margin: inherit; font-size: inherit;"></i>';
    link.title = 'This file has sound. Click to open sound source.';
    span.after(link);
    if (!soundpostDetected) {
      soundpostDetected = true;
      detectStandaloneDuplicates();
    }
    return link;
  };

  function validateSoundLink(url, filePath, linkElement) {
    const audio = new Audio();
    audio.preload = 'metadata';

    const onSuccess = () => {
      cleanup();
    };

    const onError = () => {
      cleanup();
      soundMap.delete(filePath);
      const brokenMark = document.createElement('span');
      brokenMark.textContent = ' [broken]';
      brokenMark.style.color = 'red';
      linkElement.after(brokenMark);
    };

    const cleanup = () => {
      audio.removeEventListener('canplaythrough', onSuccess);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('abort', onError);
      audio.src = '';
    };

    audio.addEventListener('canplaythrough', onSuccess, { once: true });
    audio.addEventListener('error', onError, { once: true });
    audio.addEventListener('abort', onError, { once: true });
    audio.src = url;
  }

  function scan(root = document) {
    root.querySelectorAll('p.fileinfo a[download]').forEach(a => {
      const span = a.closest('span.unimportant');
      if (!span) return;
      const m = a.download.match(/\[sound=([^\]]+)]/i);
      if (!m) return;
      try {
        const url = decodeURIComponent(decodeURIComponent(m[1]));
        const fullURL = rerouteCatboxUrl(url.startsWith('http') ? url : `https://${url}`);
        const filePath = new URL(a.getAttribute('href'), location.href).pathname;

        if (!isAllowedSoundURL(fullURL)) {
          const rejectedMark = document.createElement('span');
          rejectedMark.textContent = ' [blocked]';
          rejectedMark.style.color = 'orange';
          span.after(rejectedMark);
          return;
        }

        const linkElement = tagIcon(span, fullURL);
        if (!linkElement) return;

        soundMap.set(filePath, fullURL);
        validateSoundLink(fullURL, filePath, linkElement);
      } catch {}
    });
  }

  function isDisplayVisible(el) {
    if (!el) return false;
    const style = el.style.display || window.getComputedStyle(el).display;
    return style === "block" || style === "inline" || style === "";
  }

  function bind(video) {
    const path = new URL(video.src, location.href).pathname;
    const soundURL = soundMap.get(path);
    if (!soundURL || active.has(video)) return;
    if (!isAllowedSoundURL(soundURL)) return;

    let container = video.parentElement;
    for (let i = 0; i < 2; ++i) {
      if (!container) break;
      if (container.style && (container.style.display !== undefined)) break;
      container = container.parentElement;
    }
    if (!container || container === document.body) container = video;

    const audio = new Audio(soundURL);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = video.volume ?? siteVolume();
    audio.muted = video.muted;
    video.loop = true;

    const listeners = {};
    let isSeeking = false;

    const syncAudioToVideo = () => {
      if (isSeeking) return;
      const d = audio.duration || video.duration || 1;
      const target = video.currentTime % d;
      if (Math.abs(audio.currentTime - target) > 0.25) {
        audio.currentTime = target;
      }
    };

    listeners.onVideoPlay = () => {
      if (!isDisplayVisible(container)) return;
      syncAudioToVideo();
      audio.play().catch(() => {});
    };

    listeners.onVideoPause = () => {
      audio.pause();
    };

    listeners.onVideoSeeking = () => {
      isSeeking = true;
    };

    listeners.onVideoSeeked = () => {
      syncAudioToVideo();
      isSeeking = false;
    };

    listeners.onVideoTimeUpdate = () => {
      if (isSeeking) return;
      const d = audio.duration || video.duration || 1;
      const target = video.currentTime % d;
      if (Math.abs(audio.currentTime - target) > 0.5) {
        audio.currentTime = target;
      }
    };

    listeners.onVolumeChange = () => {
      audio.volume = video.volume;
      audio.muted = video.muted;
    };

    listeners.tryPauseAudio = () => {
      if (!isDisplayVisible(container) && !audio.paused) {
        audio.pause();
      }
    };

    video.addEventListener('play', listeners.onVideoPlay);
    video.addEventListener('pause', listeners.onVideoPause);
    video.addEventListener('seeking', listeners.onVideoSeeking);
    video.addEventListener('seeked', listeners.onVideoSeeked);
    video.addEventListener('timeupdate', listeners.onVideoTimeUpdate);
    video.addEventListener('volumechange', listeners.onVolumeChange);

    const visibilityObserver = new MutationObserver(() => {
      const visible = isDisplayVisible(container);
      if (visible) {
        if (!video.paused) {
          syncAudioToVideo();
        }
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });
    visibilityObserver.observe(container, { attributes: true, attributeFilter: ["style"] });

    if (isDisplayVisible(container) && !video.paused) {
      syncAudioToVideo();
      audio.play().catch(() => {});
    }
    active.set(video, { audio, visibilityObserver, listeners });
  }

  function bindImage(img) {
    const path = new URL(img.src, location.href).pathname;
    const soundURL = soundMap.get(path);
    if (!soundURL || active.has(img)) return;
    if (!isAllowedSoundURL(soundURL)) return;

    let container = img.parentElement;
    if (img.matches(ALL_IMAGE_SELECTORS)) {
      container = img;
    } else {
      for (let i = 0; i < 2; ++i) {
        if (!container) break;
        if (container.style && (container.style.display !== undefined)) break;
        container = container.parentElement;
      }
      if (!container || container === document.body) container = img;
    }

    const audio = new Audio(soundURL);
    audio.preload = 'auto';
    audio.loop = true;

    const listeners = {};

    listeners.tryPlayAudio = () => {
      if (!audio.paused && isDisplayVisible(container)) return;
      if (isDisplayVisible(container)) {
        audio.volume = siteVolume();
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    listeners.tryPauseAudio = () => {
      if (!isDisplayVisible(container) && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    const visibilityObserver = new MutationObserver(() => {
      const visible = isDisplayVisible(container);
      if (visible) {
        listeners.tryPlayAudio();
      } else {
        listeners.tryPauseAudio();
      }
    });
    visibilityObserver.observe(container, { attributes: true, attributeFilter: ["style"] });

    if (isDisplayVisible(container)) {
      listeners.tryPlayAudio();
    }

    if (videoScrollVol) {
      const isHoverImage = img.matches(NATIVE_HOVER_IMAGE_SELECTOR) || img.matches(IQ_HOVER_IMAGE_SELECTOR);
      if (isHoverImage) {
        const sourceThumb = document.querySelector(`.file a[href="${path}"] > .post-image`)?.parentElement;
        if (sourceThumb) {
          const onWheel = (ev) => {
            ev.preventDefault();
            const delta = ev.deltaY < 0 ? 0.05 : -0.05;
            audio.volume = Math.min(1, Math.max(0, audio.volume + delta));
            localStorage.setItem(SITE_VOLUME_KEY, audio.volume);
          };
          sourceThumb.addEventListener('wheel', onWheel, { passive: false });
          listeners.onWheel = onWheel;
          listeners.wheelTarget = sourceThumb;
        }
      }
    }

    active.set(img, { audio, visibilityObserver, listeners });
  }

  function scanImages(root = document) {
    root.querySelectorAll(ALL_IMAGE_SELECTORS).forEach(bindImage);
  }

  const soundObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches('video')) bind(node);
        node.querySelectorAll?.('video').forEach(bind);
        if (node.matches(ALL_IMAGE_SELECTORS)) bindImage(node);
        node.querySelectorAll?.(ALL_IMAGE_SELECTORS).forEach(bindImage);
      }

      for (const removedNode of mutation.removedNodes) {
        if (removedNode.nodeType !== 1) continue;
        active.forEach((value, key) => {
          if (removedNode === key || removedNode.contains(key)) {
            setTimeout(() => {
              if (key.isConnected) return;
              value.audio.pause();
              value.visibilityObserver.disconnect();
              if (value.listeners.onVideoPlay) {
                key.removeEventListener('play', value.listeners.onVideoPlay);
                key.removeEventListener('pause', value.listeners.onVideoPause);
                key.removeEventListener('seeking', value.listeners.onVideoSeeking);
                key.removeEventListener('seeked', value.listeners.onVideoSeeked);
                key.removeEventListener('timeupdate', value.listeners.onVideoTimeUpdate);
                key.removeEventListener('volumechange', value.listeners.onVolumeChange);
              }
              if (value.listeners.onWheel) {
                const target = value.listeners.wheelTarget || key;
                target.removeEventListener('wheel', value.listeners.onWheel);
              }
              active.delete(key);
            }, 0);
          }
        });
      }
    }
  });

  function patchPostCloning() {
    const postProto = window.g?.Post?.prototype;
    if (typeof postProto?.addClone !== 'function') {
      if ((patchPostCloning.attempts || 0) < 5) {
        setTimeout(patchPostCloning, 500);
        patchPostCloning.attempts = (patchPostCloning.attempts || 0) + 1;
      }
      return;
    }

    const originalAddClone = postProto.addClone;
    if (originalAddClone.isPatchedBySoundposts) return;

    postProto.addClone = function(...args) {
      const cloneObj = originalAddClone.apply(this, args);
      if (cloneObj?.nodes?.root) {
        const clonedPost = cloneObj.nodes.root;
        scan(clonedPost);
        clonedPost.querySelectorAll('video').forEach(bind);
        scanImages(clonedPost);
      }
      return cloneObj;
    };
    postProto.addClone.isPatchedBySoundposts = true;
  }

  const imgOpsConfig = {
    VARIANCE_THRESHOLD: 100,
    SEEK_INCREMENT: 0.1,
    MAX_SEEK_TIME: 5,
    JPEG_QUALITY: 0.95,
    LITTERBOX_EXPIRY: '1h',
    LITTERBOX_API: 'https://litterbox.catbox.moe/resources/internals/api.php',
    IMGOPS_URL: 'https://imgops.com/'
  };

  const litterboxCache = new Map();

  async function isLitterboxUrlValid(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function updateLinkState(link, text, cursor = 'pointer', color = null) {
    link.textContent = text;
    link.style.cursor = cursor;
    if (color) link.style.color = color;
  }

  function getFilenameFromUrl(url, newExtension = null) {
    let filename = url.split('/').pop().split('?')[0];
    if (newExtension) {
      filename = filename.replace(/\.(webm|mp4)$/i, newExtension);
    }
    return filename;
  }

  function isFrameBlank(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let sumR = 0, sumG = 0, sumB = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 40) {
      sumR += data[i];
      sumG += data[i + 1];
      sumB += data[i + 2];
      count++;
    }

    const avgR = sumR / count;
    const avgG = sumG / count;
    const avgB = sumB / count;

    let varianceSum = 0;
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diffR = r - avgR;
      const diffG = g - avgG;
      const diffB = b - avgB;

      varianceSum += (diffR * diffR + diffG * diffG + diffB * diffB);
    }

    const variance = varianceSum / count;
    return variance < imgOpsConfig.VARIANCE_THRESHOLD;
  }

  async function extractFirstFrameFromVideo(videoUrl) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let currentSeekTime = 0;

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = currentSeekTime;
      };

      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const reachedEnd = currentSeekTime > imgOpsConfig.MAX_SEEK_TIME || currentSeekTime > video.duration;

          if (!isFrameBlank(canvas, ctx) || reachedEnd) {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob from canvas'));
              }
            }, 'image/jpeg', imgOpsConfig.JPEG_QUALITY);
          } else {
            currentSeekTime += imgOpsConfig.SEEK_INCREMENT;
            video.currentTime = currentSeekTime;
          }
        } catch (error) {
          reject(error);
        }
      };

      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = videoUrl;
    });
  }

  function getThumbnailUrl(fileInfo) {
    const thumbnailImg = fileInfo.closest('.file').querySelector('img.post-image');
    if (!thumbnailImg || !thumbnailImg.src) {
      throw new Error('No thumbnail found');
    }
    return thumbnailImg.src;
  }

  async function uploadToLitterbox(blob, filename) {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('time', imgOpsConfig.LITTERBOX_EXPIRY);
    formData.append('fileToUpload', blob, filename);

    const uploadResponse = await fetch(imgOpsConfig.LITTERBOX_API, {
      method: 'POST',
      body: formData
    });

    const litterboxUrl = await uploadResponse.text();

    if (!litterboxUrl || !litterboxUrl.startsWith('http')) {
      throw new Error('Invalid response from litterbox');
    }

    return litterboxUrl;
  }

  async function handleImgOpsClick(fileUrl, imgopsLink) {
    try {
      const cachedUrl = litterboxCache.get(fileUrl);
      if (cachedUrl) {
        updateLinkState(imgopsLink, 'imgops (checking...)', 'wait');

        const isValid = await isLitterboxUrlValid(cachedUrl);
        if (isValid) {
          window.open(`${imgOpsConfig.IMGOPS_URL}${cachedUrl}`, '_blank', 'noopener,noreferrer');
          updateLinkState(imgopsLink, 'imgops ✓', 'pointer', 'green');
          return;
        }
      }

      updateLinkState(imgopsLink, 'imgops (loading...)', 'wait');

      const blob = await extractFirstFrameFromVideo(fileUrl);
      const filename = getFilenameFromUrl(fileUrl, '.jpg');
      const litterboxUrl = await uploadToLitterbox(blob, filename);

      litterboxCache.set(fileUrl, litterboxUrl);
      window.open(`${imgOpsConfig.IMGOPS_URL}${litterboxUrl}`, '_blank', 'noopener,noreferrer');
      updateLinkState(imgopsLink, 'imgops ✓', 'pointer', 'green');

    } catch (error) {
      updateLinkState(imgopsLink, 'imgops (error)', 'pointer', 'red');
    }
  }

  function createImgOpsLink(text, fileUrl, fileInfo, useVideoThumbnail = false) {
    const link = document.createElement('a');
    link.textContent = text;
    link.className = useVideoThumbnail ? 'imgops-link imgops-thumb-link' : 'imgops-link';
    link.target = '_blank';
    link.rel = 'noopener,noreferrer';

    const isVideo = /\.(webm|mp4)$/i.test(fileUrl);

    if (!isVideo) {
      link.href = `${imgOpsConfig.IMGOPS_URL}${fileUrl}`;
    } else if (useVideoThumbnail) {
      link.href = `${imgOpsConfig.IMGOPS_URL}${getThumbnailUrl(fileInfo)}`;
    } else {
      link.href = 'javascript:void(0)';
    }

    return link;
  }

  function addImgOpsLinksToFile(span) {
    const next = span.nextElementSibling;
    if (next && next.querySelector && next.querySelector('.imgops-link')) return;

    const fileInfo = span.closest('.fileinfo');
    if (!fileInfo) return;

    const fileLink = fileInfo.querySelector('a[href*="/src/"]');
    if (!fileLink) return;

    const fileUrl = fileLink.href;
    const isVideo = /\.(webm|mp4)$/i.test(fileUrl);

    const wrapper = document.createElement('span');
    wrapper.appendChild(document.createTextNode(' ['));
    wrapper.appendChild(createImgOpsLink('imgops', fileUrl, fileInfo, false));

    if (isVideo) {
      wrapper.appendChild(document.createTextNode(' | '));
      wrapper.appendChild(createImgOpsLink('imgops (thumb)', fileUrl, fileInfo, true));
    }

    wrapper.appendChild(document.createTextNode(']'));

    if (span.nextSibling) {
      span.nextSibling.after(wrapper);
    } else {
      fileInfo.appendChild(wrapper);
    }
  }

  const HASH_LINK_SELECTOR = 'div.body a, span.mentioned a, span.clone-mentioned a';
  const HASH_QUOTE_REGEX = /^>>(?:>\/[a-zA-Z0-9_-]+\/)?(\d+)/;

  function addHashLinks(container) {
    if (!container) return;
    const links = container.querySelectorAll(HASH_LINK_SELECTOR);

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.classList.contains('hash-link')) continue;
      if (link.hasAttribute('data-hash-processed')) continue;

      const text = (link.textContent || '').trim();
      const textMatch = text.match(HASH_QUOTE_REGEX);
      if (!textMatch) continue;

      const postId = textMatch[1];
      link.setAttribute('data-hash-processed', '1');

      const href = link.getAttribute('href') || '';
      const resMatch = href.match(/\/res\/(\d+)\.html#(\d+)$/);
      const isCrossThread = resMatch && resMatch[1] !== currentThreadId;
      const archiveState = link.dataset.archiveState || '';
      const isDead = archiveState === 'dead';
      const isLive = archiveState === 'archive';

      let hashHref;
      if (isDead) {
        hashHref = 'javascript:void(0)';
      } else if (isLive) {
        hashHref = link.href;
      } else if (isCrossThread) {
        hashHref = link.href;
      } else {
        hashHref = `/${currentBoard}/res/${currentThreadId}.html#${postId}`;
      }

      const hashLink = document.createElement('a');
      hashLink.className = 'hash-link';
      hashLink.href = hashHref;
      hashLink.textContent = '#';
      hashLink.dataset.postId = postId;

      if (isDead) {
        hashLink.dataset.archiveState = 'dead';
        hashLink.classList.add('archive-hash-dead');
      } else if (isLive) {
        hashLink.dataset.archiveState = 'archive';
        hashLink.classList.add('archive-hash-live');
      }

      if (link.nextSibling) {
        link.parentNode.insertBefore(hashLink, link.nextSibling);
      } else {
        link.parentNode.appendChild(hashLink);
      }
    }
  }

  function processResurrectedQuotes(post, quotes) {
    let ownershipRelevant = false;
    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const result = fetchArchive(quote);
      if (result !== quote && result?.matches('a:not([rel="nofollow"]):not(.hash-link)')) {
        ownershipRelevant = true;
      }
    }

    if (ownershipRelevant) {
      reconcileOwnership([post], { refreshNavigation: true, refreshFavicon: true });
    }
  }

  function processPost(post) {
    const postId = post.id.split('_')[1];
    const body = post.querySelector('.body') || null;
    const smallTags = body ? body.querySelectorAll('small') : [];
    const bodyLinks = body ? Array.from(body.querySelectorAll('a')) : [];
    const fileLink = post.querySelector('.file a[target="_blank"]') || null;
    const fileImg = fileLink ? fileLink.querySelector('img.post-image') : null;
    const unimportant = post.querySelector('.fileinfo .unimportant') || null;

    if (ownershipInitialPosts.has(post)) {
      ownershipInitialPosts.delete(post);
    } else {
      reconcileOwnership([post], { notifyNewReply: true });
    }

    if (optionThreading && toggleThread) {
      newThreadPosts.add(postId);
    }

    if (appendQuotes && !appendedPostIds.has(postId)) {
      appendPosts(post, body, smallTags);
    }

    if (hidePosts) {
      addHideButton(post);

      for (let i = 0; i < bodyLinks.length; i++) {
        const link = bodyLinks[i];
        if (link.getAttribute('rel') === 'nofollow') continue;
        const match = link.textContent.match(/^>>(\d+)/);
        if (!match) continue;
        const quotedId = match[1];
        if (!hiddenSet.has(quotedId)) continue;

        link.style.textDecoration = 'underline line-through';

        if (recursiveHiding) {
          const btn = post.previousElementSibling;
          if (btn && (btn.classList.contains('hide-button') || btn.classList.contains('show-button'))) {
            toggleHidePost(post, btn, true, quotedId, true);
          }
          break;
        }
      }
    }

    if (linkPreview) {
      bindLinkPreviews(bodyLinks, true);
    }

    if (thumbnailSwap) {
      thumbSwap(post, fileLink, fileImg);
    }

    if (linkEmbed || linkIcon || linkTitle || resizeMedia) {
      processLinks(bodyLinks);
    }

    if (showSpoilerMedia) {
      handleSpoilerMedia(post, unimportant, fileLink, fileImg);
    }

    if (quoteResurrect) {
      const quotes = post.querySelectorAll('div.body span.quote');
      processResurrectedQuotes(post, quotes);
    }

    if (rememberLastRead) {
      if (!post.dataset.place) {
        const pl = nextPlacement++;
        post.dataset.place = String(pl);
        postPlacementMap.set(postId, pl);
        placementToPostId[pl] = postId;
      }
      const place = Number(post.dataset.place);
      if (place > lastReadPlacement) {
        if (!unreadSet.has(postId)) {
          unreadSet.add(postId);
          if (lastReadObserver) lastReadObserver.observe(post);
        }
      }
    }

    if (inlineQuoting) {
      processQuoteLinks(post);
    }

    if (enableSoundposts) {
      scan(post);
      scanImages(post);
    }

    if (enableImgOps && unimportant) {
      addImgOpsLinksToFile(unimportant);
    }

    if (hashNavigation) {
      addHashLinks(post);
    }

    if (isChristmas) {
      applyDecorHeight(post, fileImg);
    }
  }

  function initializePosts() {
    initializeOwnership();
    siteImageHover = localStorage.getItem('imageHover') === 'true';
    detectStandaloneDuplicates();

    const lastPostCountEl = document.getElementById("thread_stats_posts");
    if (lastPostCountEl) {
      lastPostCount = parseInt(lastPostCountEl.textContent, 10);
    }

    if (rememberLastRead) {
      const desc = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
      if (desc && desc.set) {
        Object.defineProperty(document, 'title', {
          configurable: true,
          get: desc.get,
          set(value) {
            if (suppressTitleWrites) return;
            desc.set.call(document, value);
          }
        });
      }

      const entry = settings.lastReadPosts?.[currentBoard]?.[currentThreadId];
      if (entry?.postId) {
        lastReadPostId = entry.postId;
      }
      initializeLastReadObserver();

      window.addEventListener('storage', (e) => {
        if (e.key !== 'Thread Settings' || !e.newValue) return;
        const updated = JSON.parse(e.newValue);
        const entry = updated?.lastReadPosts?.[currentBoard]?.[currentThreadId];
        if (!entry?.postId) return;
        const incomingPlacement = postPlacementMap.get(entry.postId) || 0;
        if (incomingPlacement > lastReadPlacement) {
          lastReadPlacement = incomingPlacement;
          lastReadPostId = entry.postId;
          for (const id of unreadSet) {
            if ((postPlacementMap.get(id) || 0) <= lastReadPlacement) {
              unreadSet.delete(id);
            }
          }
          updateUnreadTitle();
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden || !showUnreadLine) return;
        if (hasUnreadLine) {
          const oldPost = document.querySelector(`#reply_${lastLine}`);
          if (oldPost) oldPost.style.boxShadow = '';
        }
        if (unreadSet.size > 0) {
          const linePostId = placementToPostId[lastReadPlacement];
          if (linePostId) {
            lastLine = linePostId;
            hasUnreadLine = false;
            addUnreadLine();
          }
        } else {
          hasUnreadLine = false;
        }
      });
    }

    const opPost = document.querySelector('.post.op');
    const opImage = opPost ? opPost.previousElementSibling : null;
    const opBody = opPost ? opPost.querySelector('.body') : null;
    const opSmallTags = opBody ? opBody.querySelectorAll('small') : [];

    const posts = Array.from(document.querySelectorAll('div.post.reply'));

    if (opPost) {
      if (appendQuotes && !appendedPostIds.has(currentThreadId)) {
        appendPosts(opPost, opBody, opSmallTags);
      }

      if (linkPreview) {
        const opLinks = Array.from(opPost.querySelectorAll('.body a'));
        if (opLinks.length) bindLinkPreviews(opLinks, true);
      }

      if (quoteResurrect && opBody) {
        const textWalker = document.createTreeWalker(opBody, NodeFilter.SHOW_TEXT, {
          acceptNode: function(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_SKIP;
            if (parent.classList.contains('quote') || parent.tagName === 'A') return NodeFilter.FILTER_REJECT;
            if (/>>\d+/.test(node.textContent)) return NodeFilter.FILTER_ACCEPT;
            return NodeFilter.FILTER_SKIP;
          }
        }, false);

        const textNodes = [];
        let tn;
        while (tn = textWalker.nextNode()) {
          textNodes.push(tn);
        }

        for (const textNode of textNodes) {
          const text = textNode.textContent;
          const frag = document.createDocumentFragment();
          let lastIdx = 0;
          const re = />>(\d+)/g;
          let m;
          let found = false;

          while ((m = re.exec(text)) !== null) {
            found = true;
            if (m.index > lastIdx) {
              frag.appendChild(document.createTextNode(text.substring(lastIdx, m.index)));
            }
            const span = document.createElement('span');
            span.className = 'quote';
            span.textContent = m[0];
            frag.appendChild(span);
            lastIdx = re.lastIndex;
          }

          if (found) {
            if (lastIdx < text.length) {
              frag.appendChild(document.createTextNode(text.substring(lastIdx)));
            }
            textNode.parentNode.replaceChild(frag, textNode);
          }
        }

        const opQuotes = opPost.querySelectorAll('div.body span.quote');
        processResurrectedQuotes(opPost, opQuotes);
      }

      if (hashNavigation) {
        addHashLinks(opPost);
      }
    }

    if (opImage && thumbnailSwap) {
      const opFileLink = opImage.querySelector ? opImage.querySelector('.file a[target="_blank"]') : null;
      const opImg = opFileLink ? opFileLink.querySelector('img.post-image') : null;

      thumbSwap(opImage, opFileLink, opImg, true);
    }

    if (opImage && showSpoilerMedia) {
      const opUnimportant = opImage.querySelector ? opImage.querySelector('.fileinfo .unimportant') : null;
      const opFileLink = opImage.querySelector ? opImage.querySelector('.file a[target="_blank"]') : null;
      const opSpoilerImg = opFileLink ? opFileLink.querySelector('img.post-image') : null;
      handleSpoilerMedia(opImage, opUnimportant, opFileLink, opSpoilerImg);
    }

    if (opImage && enableSoundposts) {
      scan(opImage);
      scanImages(opImage);
    }

    if (opImage && enableImgOps) {
      const opUnimportant = opImage.querySelector ? opImage.querySelector('.fileinfo .unimportant') : null;
      if (opUnimportant) addImgOpsLinksToFile(opUnimportant);
    }

    if (linkEmbed || linkIcon || linkTitle) {
      const allPostLinks = Array.from(document.querySelectorAll('.post.reply .body a, .post.op .body a'));
      if (allPostLinks.length) processLinks(allPostLinks, true);
    }

    if (posts.length) {
      const lastPost = posts[posts.length - 1];
      const lastPostId = lastPost.id.split('_')[1];
      lastSeenPostId = lastPostId;
      lastLine = lastPostId;
      lastThreadedId = lastPostId;
      currentLastPostId = lastPostId;
    }

    const hiddenList = settings.hiddenPosts?.[currentBoard]?.[currentThreadId] || [];
    hiddenSet.clear();
    for (let i = 0; i < hiddenList.length; i++) {
      hiddenSet.add(hiddenList[i]);
    }

    if (scrollMarker) {
      new ResizeObserver(() => {
        scheduleRailRebuild();
      }).observe(document.documentElement);
    }

    if (scrollMarker || linkEmbed || inlineQuoting || highlightPosts || enableOekaki) {
      updateStyleAttribute();
      computeStyleColors();
      hookChangeStyle();

      window.addEventListener('style-loaded', () => {
        updateStyleAttribute();
        computeStyleColors();
        if (scrollMarker) scheduleRailRebuild();
      });

      const activeSheet = document.querySelector('link#stylesheet[rel="stylesheet"]:not([media="none"])');
      if (activeSheet && activeSheet.href && !activeSheet.sheet) {
        activeSheet.addEventListener('load', () => {
          updateStyleAttribute();
          computeStyleColors();
          if (scrollMarker) scheduleRailRebuild();
        }, { once: true });
      } else if (!activeSheet && document.readyState !== 'complete') {
        window.addEventListener('load', () => {
          updateStyleAttribute();
          computeStyleColors();
          if (scrollMarker) scheduleRailRebuild();
        }, { once: true });
      }
    }

    const needPerPostProcessing = appendQuotes ||
          (optionThreading && enableThreading) ||
          hidePosts ||
          linkPreview ||
          thumbnailSwap ||
          showSpoilerMedia ||
          linkEmbed || linkIcon || linkTitle || resizeMedia ||
          quoteResurrect ||
          rememberLastRead ||
          inlineQuoting ||
          enableSoundposts ||
          enableImgOps ||
          hashNavigation ||
          isChristmas;

    if (!needPerPostProcessing) return;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const postId = post.id.split('_')[1];

      processPost(post);

      if (optionThreading && enableThreading) {
        setTimeout(() => {
          threadPosts(post);
        }, 0);
        scheduleRailRebuild();
      }

      if (hidePosts && hiddenList.includes(postId)) {
        const btn = document.querySelector(`a.reply[for="${post.id}"].hide-button, a.reply[for="${post.id}"].show-button`);
        if (btn) {
          setTimeout(() => {
            const alreadyHidden = post.classList.contains('hidden-post');
            if (!alreadyHidden) {
              toggleHidePost(post, btn, false, null, true);
            }
          }, 0);
        } else {
          addHideButton(post);
          const createdBtn = document.querySelector(`a.reply[for="${post.id}"].hide-button, a.reply[for="${post.id}"].show-button`);
          if (createdBtn) {
            setTimeout(() => {
              const alreadyHidden = post.classList.contains('hidden-post');
              if (!alreadyHidden) {
                toggleHidePost(post, createdBtn, false, null, true);
              }
            }, 0);
          }
        }
      }
    }

    if (optionThreading && enableThreading) {
      setTimeout(() => {
        recomputePlacements();
      }, 0);
    }

    if (rememberLastRead) {
      if (lastReadPostId && !postPlacementMap.has(lastReadPostId)) {
        const savedId = Number(lastReadPostId);
        let nearestId = null;
        for (const id of postPlacementMap.keys()) {
          const num = Number(id);
          if (num < savedId && (nearestId === null || num > nearestId)) {
            nearestId = num;
          }
        }
        if (nearestId !== null) {
          lastReadPostId = String(nearestId);
        }
      }

      if (lastReadPostId) {
        lastReadPlacement = postPlacementMap.get(lastReadPostId) || 0;
        for (const id of unreadSet) {
          if ((postPlacementMap.get(id) || 0) <= lastReadPlacement) {
            unreadSet.delete(id);
          }
        }

        if (showUnreadLine && lastReadPlacement > 0 && unreadSet.size > 0) {
          const linePostId = placementToPostId[lastReadPlacement];
          if (linePostId) {
            lastLine = linePostId;
            addUnreadLine();
          }
        }

        if (scrollToLastRead && lastReadPlacement > 0 && !location.hash) {
          const scrollTarget = lastReadPostId;
          setTimeout(() => scrollToPost(scrollTarget, false), 50);
        }
      }

      updateUnreadTitle();
    }

    if (enableFaviconChanges && faviconOnEntry && rememberLastRead) {
      if (unreadSet.size > 0) {
        let hasYouUnread = false;
        if (notifyNewYou) {
          for (const id of unreadSet) {
            if (youPostIds.has(id)) {
              hasYouUnread = true;
              break;
            }
          }
        }
        if (hasYouUnread) {
          updateFavicon('red');
        } else if (notifyNewPost) {
          updateFavicon('white');
        }
      }
    }

    if (optionThreading) {
      document.addEventListener('click', function (e) {
        const img = e.target;
        if (!img.classList.contains('full-image')) return;

        const anchor = img.closest('a');
        if (!anchor) return;

        const threadingContainer = anchor.closest('.threadingContainer');
        if (!threadingContainer) return;

        const thumb = anchor.querySelector('.post-image');
        if (!thumb) return;

        thumb.style.display = '';
        thumb.style.opacity = '';
        thumb.style.filter = '';
        img.remove();
        $(anchor).removeData('expanded');

        const post_body = $(thumb).closest('.post.reply');
        const still_open = post_body.find('.post-image').filter(function () {
          return $(this).parent().data('expanded') === 'true';
        }).length;

        let padding = 5;

        const boardlist = document.querySelector('.boardlist');
        if (boardlist && getComputedStyle(boardlist).position === 'fixed') {
          padding += boardlist.getBoundingClientRect().height;
        }

        const headerBar = document.querySelector('#header-bar.dialog');
        if (headerBar) {
          const classList = headerBar.classList;

          const hasOnlyAutohide = classList.length === 2 &&
                classList.contains('dialog') &&
                classList.contains('autohide');

          if (!hasOnlyAutohide) {
            const style = getComputedStyle(headerBar);
            const hasBottom = parseFloat(style.bottom) < 1;

            if (style.position === 'fixed' && !hasBottom) {
              padding += headerBar.getBoundingClientRect().height;
            }
          }
        }

        if (still_open > 0) {
          if (thumb.getBoundingClientRect().top - padding < 0) {
            $(document).scrollTop($(thumb).parent().parent().offset().top - padding);
          }
        } else {
          if (post_body[0].getBoundingClientRect().top - padding < 0) {
            $(document).scrollTop(post_body.offset().top - padding);
          }
        }

        e.preventDefault();
        e.stopImmediatePropagation();
      }, true);
    }

    postsInitialized = true;

    if (desktopNotifications) {
      requestNotifPermission();
    }

    if (inlineQuoting) {
      document.documentElement.addEventListener('click', function(event) {
        const linkElement = event.target.closest('a');
        if (!linkElement) return;

        if (linkElement.classList.contains('hash-link')) return;

        const postId = getPostIdFromLink(linkElement);
        if (postId && /^>>/.test(linkElement.textContent?.trim() || '')) {
          event.preventDefault(); event.stopImmediatePropagation();
          handleInlineQuoteClick(linkElement, postId);
          return;
        }

        if (linkElement.classList.contains('post_no') && linkElement.textContent.trim() === 'No.') {
          event.preventDefault();
          const postId = getPostIdFromLink(linkElement);
          if (postId) scrollToPost(postId);
        }
      }, true);

    }

    if (inlineQuoting || videoHoverCursor) {
      document.addEventListener('mouseover', function(e) {
        if (inlineQuoting) {
          const link = e.target.closest('a');
          if (link && link.classList.contains(INLINE_ACTIVE_LINK_CLASS)) {
            e.stopImmediatePropagation();
          }
        }
        if (videoHoverCursor && typeof setting === 'function' && setting('videohover')) {
          const thumb = e.target.closest('a.file');
          if (thumb && !thumb.vhcBound && /\.(webm|mp4)/i.test(thumb.href)) {
            thumb.vhcBound = true;
            thumb.addEventListener('mouseenter', () => {
              const container = thumb.nextElementSibling;
              if (!container || container.style.position !== 'fixed') return;
              const video = container.querySelector('video');
              if (!video) return;

              const updatePos = (ev) => {
                if (container.style.display === 'none') return;
                if (container.style.position === 'static') {
                  container.style.pointerEvents = '';
                  return;
                }
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const fileInfo = thumb.closest('div.file')?.querySelector('.fileinfo .unimportant');
                const fileDims = fileInfo?.textContent?.match(/(\d+)x(\d+)/);
                const w = video.videoWidth || (fileDims ? +fileDims[1] : 320);
                const h = video.videoHeight || (fileDims ? +fileDims[2] : 240);
                const scale = Math.min(1, (vw - 30) / w, (vh - 15) / h);
                const dw = w * scale;
                const dh = h * scale;

                let left = ev.pageX + 20;
                let top = ev.pageY + 20;
                left = Math.min(left, vw - dw - 20);
                left = Math.max(0, left);
                top = Math.min(top, window.scrollY + vh - dh - 15);
                top = Math.max(0, top);

                container.style.position = 'absolute';
                container.style.left = left + 'px';
                container.style.top = top + 'px';
                container.style.right = 'auto';
                container.style.zIndex = '101';
                container.style.pointerEvents = 'none';
                video.style.position = 'absolute';
                video.style.left = '0';
                video.style.right = 'auto';
                video.style.top = '0';
                video.style.maxWidth = 'none';
                video.style.maxHeight = 'none';
                video.style.width = dw + 'px';
                video.style.height = dh + 'px';
              };

              document.addEventListener('mousemove', updatePos);
              thumb.vhcMove = updatePos;
            });

            thumb.addEventListener('mouseleave', () => {
              if (thumb.vhcMove) {
                document.removeEventListener('mousemove', thumb.vhcMove);
                delete thumb.vhcMove;
              }
              const c = thumb.nextElementSibling;
              if (c) c.style.pointerEvents = '';
            });
          }
        }
      }, true);
    }

    if (!videoScrollVol && typeof setting === 'function' && setting('videohover')) {
      document.addEventListener('wheel', (e) => {
        const thumb = e.target.closest('a.file');
        if (thumb && /\.(webm|mp4)/i.test(thumb.href)) {
          e.stopPropagation();
        }
      }, true);
    }

    if (enableQuickReply) {
      document.body.addEventListener('click', e => {
        const link = e.target.closest('a.post_no');
        if (link && /^citeReply\(\d+\)$/.test(link.getAttribute('onclick') || '')) {
          setTimeout(() => {
            const ta = document.querySelector('#quick-reply textarea[name="body"]');
            if (ta) {
              ta.focus();
              ta.setSelectionRange(ta.value.length, ta.value.length);
            }
          }, 50);
        }
      });
    }

    if (enableSoundposts) {
      document.querySelectorAll('video').forEach(bind);
      soundObserver.observe(document.body, { childList: true, subtree: true });
      patchPostCloning();
    }

    if (enableImgOps) {
      document.documentElement.addEventListener('click', function(e) {
        const link = e.target.closest('a.imgops-link[href="javascript:void(0)"]');
        if (!link) return;
        e.preventDefault();
        const fileInfo = link.closest('.fileinfo');
        const fileLink = fileInfo?.querySelector('a[href*="/src/"]');
        if (fileLink) handleImgOpsClick(fileLink.href, link);
      }, true);
    }

    if (hashNavigation) {
      document.body.addEventListener('click', async function(e) {
        const hashLink = e.target.closest('a.hash-link');
        if (!hashLink) return;

        const archiveState = hashLink.dataset.archiveState || '';
        if (archiveState === 'dead') {
          e.preventDefault();
          const quoteLink = hashLink.previousElementSibling;
          if (!quoteLink || quoteLink.dataset.archiveState !== 'dead') return;
          const $quoteLink = $(quoteLink);
          if ($quoteLink.hasClass(INLINE_ACTIVE_LINK_CLASS)) return;
          $quoteLink.addClass(INLINE_ACTIVE_LINK_CLASS).attr(LOADING_DATA_ATTR, "true");
          hashLink.dataset.archiveState = 'loading';
          const board = currentBoard || hashLink.closest('[data-board]')?.getAttribute('data-board') || quoteLink.closest('[data-board]')?.getAttribute('data-board') || '';
          const postId = hashLink.dataset.postId;
          if (!board || !postId || typeof loadArchiveQuote !== 'function') {
            $quoteLink.removeAttr(LOADING_DATA_ATTR).removeClass(INLINE_ACTIVE_LINK_CLASS);
            hashLink.dataset.archiveState = 'dead';
            return;
          }
          loadArchiveQuote(quoteLink, board, postId);
          const apiUrl = `https://archive.holotower.org/${board}/post/${postId}`;
          const cachedPromise = archiveQuoteCache.get(apiUrl);
          if (cachedPromise) {
            try { await cachedPromise; } catch (err) {}
          }
          $quoteLink.removeAttr(LOADING_DATA_ATTR).removeClass(INLINE_ACTIVE_LINK_CLASS);
          if (quoteLink.dataset.archiveState === 'archive') {
            const finalHref = (hashLink.href && hashLink.href !== 'javascript:void(0)') ? hashLink.href : quoteLink.href;
            if (finalHref && finalHref !== 'javascript:void(0)') window.location.href = finalHref;
          } else {
            $quoteLink.attr(ERROR_DATA_ATTR, "true");
            setTimeout(() => $quoteLink.removeAttr(ERROR_DATA_ATTR), 3000);
          }
          return;
        }
        if (archiveState === 'loading' || archiveState === 'error') {
          e.preventDefault();
          return;
        }
        if (archiveState === 'archive') return;
        const href = hashLink.getAttribute('href') || '';
        const resMatch = href.match(/\/res\/(\d+)\.html#(\d+)$/);
        if (resMatch && resMatch[1] !== currentThreadId) return;
        const postId = hashLink.dataset.postId || href.match(/#(\d+)$/)?.[1];
        if (!postId) return;
        const dest = document.getElementById('reply_' + postId) || document.getElementById('op_' + postId);
        if (dest && dest.classList.contains('iq-hidden-post')) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        scrollToPost(postId);
      }, true);
    }
  }

  function addUnreadLine() {
    if (!showUnreadLine) return;

    const lastPost = document.querySelector(`#reply_${lastLine}`);
    if (lastPost && !hasUnreadLine) {
      lastPost.style.boxShadow = '0 3px red';
      hasUnreadLine = true;
    }
  }

  function removeUnreadLine() {
    if (!showUnreadLine) return;

    const lastPost = document.querySelector(`#reply_${lastLine}`);
    if (lastPost && hasUnreadLine) {
      lastPost.style.boxShadow = '';
      hasUnreadLine = false;
    }

    const posts = document.querySelectorAll('div.post.reply');
    for (let i = posts.length - 1; i >= 0; i--) {
      const post = posts[i];
      if (
        !post.classList.contains('post-hover') &&
        !post.classList.contains('hidden-post') &&
        !post.classList.contains('deleted-post') &&
        !post.classList.contains('inline-cloned-post')
      ) {
        lastLine = post.id.split('_')[1];
        break;
      }
    }
  }

  function updateThreadStatsActual() {
    if (lastPostCount !== null) {
      const oldElement = document.getElementById('thread_stats_posts');
      if (oldElement) {
        oldElement.style.display = 'none';

        let newElement = document.getElementById('thread_stats_posts_actual');
        if (!newElement) {
          newElement = document.createElement('span');
          newElement.id = 'thread_stats_posts_actual';
          oldElement.parentNode.insertBefore(newElement, oldElement.nextSibling);
        }

        newElement.textContent = lastPostCount;

        const postsDeleted = parseInt(oldElement.textContent) - lastPostCount;

        if (showDeletedCounter) {
          let deletedElement = document.getElementById('thread_stats_posts_deleted');
          if (postsDeleted >= 1) {
            if (!deletedElement) {
              deletedElement = document.createElement('span');
              deletedElement.id = 'thread_stats_posts_deleted';
              const imagesElement = document.getElementById('thread_stats_images');
              if (imagesElement) {
                imagesElement.parentNode.insertBefore(deletedElement, imagesElement);
              }
            }

            deletedElement.textContent = postsDeleted;
            deletedElement.insertAdjacentHTML('beforeend', ' deleted |&nbsp;');
          } else if (deletedElement) {
            deletedElement.remove();
          }
        }

        const isArchivedNow = lastPostCount >= 1500;

        if (isArchivedNow) {
          if (enableFaviconChanges && changeFaviconOnArchive) {
            updateFaviconArchived();
          }
          if (showArchivedMessage && !document.getElementById('archived-msg')) {
            addArchivedMessage();
          }
          if (updaterCheckbox?.checked && !updaterDisabled) {
            updaterCheckbox.click();
            updaterDisabled = true;
          }
        } else {
          if (isThreadArchived || updaterDisabled) {
            if (isThreadArchived) {
              isThreadArchived = false;
              restoreFavicon();
            }
            updaterDisabled = false;
          }
        }
        headerBar.setArchiveState(isArchivedNow);
      }
    }
  }

  function snowEffect(duration) {
    if (document.getElementById('snow-container')) return;

    const styleId = 'htsu-snow-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes fall {
          from { transform: translateY(-10vh) translateX(0); }
          to   { transform: translateY(110vh) translateX(var(--wind-shift)); }
        }
        @keyframes spin-only {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .snow-flake {
          position: absolute;
          top: -5vh;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .snow-flake > .inner {
          display: inline-block;
          transform-origin: center;
        }
      `;
      document.head.appendChild(style);
    }

    const layers = [
      {
        weight: 0.50, z: 9995, size: 0.6,
        fall: [14, 20], blur: [1.0, 1.0], op: [0.45, 0.85], wind: 1.4,
        simple: true
      },
      {
        weight: 0.33, z: 9998, size: 1.0,
        fall: [11, 16], blur: [0.9, 1.8], op: [0.55, 0.95], wind: 2.2,
        simple: false
      },
      {
        weight: 0.17, z: 10001, size: 1.4,
        fall: [6, 12], blur: [0.9, 1.7], op: [0.70, 1.0], wind: 2.6,
        simple: false
      }
    ];

    const glyphs = ['✻', '❆', '❅'];
    const rand = (a, b) => a + Math.random() * (b - a);

    function chooseLayer() {
      let r = Math.random();
      for (let i = 0; i < layers.length; i++) {
        r -= layers[i].weight;
        if (r <= 0) return layers[i];
      }
      return layers[2];
    }

    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    Object.assign(snowContainer.style, {
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      color: '#f5f5f5',
      zIndex: 9999
    });
    document.body.appendChild(snowContainer);

    let snowActive = true;

    const spawnTimer = setInterval(() => snowActive && spawnFlake(), 150);

    if (duration > 0) {
      setTimeout(() => {
        snowActive = false;
        clearInterval(spawnTimer);
        const cleaner = setInterval(() => {
          if (!snowContainer.hasChildNodes()) {
            snowContainer.remove();
            clearInterval(cleaner);
          }
        }, 500);
      }, duration);
    }

    function spawnFlake() {
      const layer = chooseLayer();

      const fallDur = rand(layer.fall[0], layer.fall[1]);
      const size = (rand(8, 26) * layer.size) | 0;
      const opacity = rand(layer.op[0], layer.op[1]);
      const blur = rand(layer.blur[0], layer.blur[1]);

      const wind = (rand(3, 12) * layer.wind) * (Math.random() < 0.5 ? -1 : 1);
      const windShift = (wind * fallDur) + 'px';

      const flake = document.createElement('div');
      flake.className = 'snow-flake';
      flake.style.left = Math.random() * 100 + '%';
      flake.style.fontSize = size + 'px';
      flake.style.opacity = opacity;
      flake.style.filter = `blur(${blur}px)`;
      flake.style.zIndex = layer.z;
      flake.style.animation = `fall ${fallDur}s linear forwards`;
      flake.style.setProperty('--wind-shift', windShift);

      const inner = document.createElement('span');
      inner.className = 'inner';

      if (layer.simple) {
        inner.textContent = '❆';
        inner.style.transform = 'scale(1)';
      } else {
        inner.textContent = glyphs[Math.floor(Math.random() * 3)];
        inner.style.transform = `scale(${rand(0.85, 1.25)})`;
        inner.style.animation = `spin-only ${rand(1.6, 3.8)}s linear infinite`;
        inner.style.animationDirection = Math.random() < 0.5 ? 'normal' : 'reverse';
      }

      flake.appendChild(inner);
      snowContainer.appendChild(flake);

      setTimeout(() => {
        flake.style.opacity = '0';
        setTimeout(() => flake.remove(), 450);
      }, (fallDur + 0.25) * 1000);
    }
  }

  function checkDate() {
    const nowLocal = new Date();
    const nowJST = new Date(nowLocal.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

    const isMD = (d, m, day) => d.getMonth() === m && d.getDate() === day;

    if (isMD(nowJST, 11, 25) || isMD(nowLocal, 11, 25)) {
      isChristmas = true;
      isNewYear = false;
      return "christmas";
    }

    const isLocalNYE = isMD(nowLocal, 11, 31);
    const isLocalNY = isMD(nowLocal, 0, 1);
    const isJSTNYE = isMD(nowJST, 11, 31);
    const isJSTNY = isMD(nowJST, 0, 1);

    if (isLocalNYE || isLocalNY || isJSTNYE || isJSTNY) {
      isChristmas = false;
      isNewYear = true;
      return "newyear";
    }

    isChristmas = false;
    isNewYear = false;
    return null;
  }

  function addArchivedMessage() {
    const postControlsForm = document.forms["postcontrols"];
    if (!postControlsForm) return;

    function scaleLength(value, factor) {
      if (typeof value !== 'string') return value;

      const match = value.trim().match(/^([\d.]+)([a-z%]+)$/i);
      if (!match) return value;

      const num = parseFloat(match[1]);
      const unit = match[2];

      return (num * factor) + unit;
    }

    const holiday = checkDate();
    const isChristmas = holiday === "christmas";

    const archivedMsg = document.createElement('div');
    archivedMsg.id = 'archived-msg';
    archivedMsg.style.marginTop = '-25px';
    archivedMsg.style.marginBottom = '20px';

    const messageText = settings.archivedMessageText || "THREAD ARCHIVED";
    const imageURL = settings.archivedImageURL || "https://i.imgur.com/LQHVLil.png";
    const fontSize = settings.archivedMessageFontSize || "14px";
    const imageSize = settings.archivedImageSize || "7%";
    const useHeight = settings.archivedImageUseHeight;
    const christmasURL = "https://files.fatbox.moe/4nt2ne.png";
    const christmasSize = scaleLength(imageSize, 1.3);

    archivedMsg.innerHTML = `
      <strong style="color: red; font-size: ${fontSize};">${messageText}</strong><br>
      <img src="${imageURL}" alt="Archived Image" style="margin-top: 5px; ${useHeight ? `height` : `width`}: ${imageSize};">
      ${isChristmas ? `
        <img src="${christmasURL}" alt="" class="archived-christmas" style="position: absolute; ${useHeight ? 'height' : 'width'}: ${christmasSize}; transform: translateY(-5%) translateX(-82%); pointer-events: none;">
      ` : ''}
    `;

    postControlsForm.parentNode.insertBefore(archivedMsg, postControlsForm.nextSibling);

    if (!holiday) return;

    if (holiday === "christmas") {
      snowEffect(25000);
    } else if (holiday === "newyear") {
      // fireworksEffect(25000);
      return;
    }

    const cloned = archivedMsg.cloneNode(true);
    cloned.id = 'archived-msg-clone';

    Object.assign(cloned.style, {
      position: 'fixed',
      bottom: '1%',
      left: '1%',
      zIndex: 10000,
      opacity: 0,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: 'none'
    });

    document.body.appendChild(cloned);

    requestAnimationFrame(() => {
      cloned.style.opacity = 1;
    });

    let cloneRemoved = false;

    function removeClone() {
      if (cloneRemoved) return;
      cloneRemoved = true;
      cloned.style.opacity = 0;
      setTimeout(() => cloned.remove(), 500);
      observer.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          removeClone();
        }
      },
      {
        threshold: 0,
        rootMargin: "20% 0px"
      }
    );

    observer.observe(archivedMsg);

    setTimeout(removeClone, 25000);
  }

  const justPostedIds = new Set();

  function threadMonitoring() {
    (function(open) {
      XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;

        if (currentThreadId) {
          const base = `/res/${currentThreadId}`;
          if (url.endsWith('.html') && url.includes(base)) {
            const after = url.slice(url.indexOf(base) + base.length);
            this._monitored = /^(\+\d+)?\.html(?:\?|$)/.test(after);
          } else {
            this._monitored = false;
          }
        }

        this._isThreadsJson = monitorThreadsJson && url.includes("/threads.json");
        return open.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open);

    (function(send) {
      XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', () => {
          if (this._monitored) {
            if (this.status === 200) {
              const lastModified = this.getResponseHeader("Last-Modified");
              if (checkSync(lastModified)) {
                syncPostStatus(this.responseText);
                headerBar.syncThreadStats();
              } else {
                  headerBar.updateNewCount(0);
              }
            } else if (this.status === 404) {
              if (enableFaviconChanges && changeFaviconOnArchive) {
                updateFaviconArchived();
              }
              if (showArchivedMessage && !document.getElementById('archived-msg')) {
                addArchivedMessage();
              }
              headerBar.setArchiveState(true);
              const pageEl = document.getElementById('thread_stats_page');
              if (pageEl?.textContent.trim() === '???' && updaterCheckbox?.checked) {
                updaterCheckbox.click();
              }
            }
          }

          if (this._isThreadsJson && this.status === 200) {
            cleanThreadStorage(this.responseText);
          }
        });
        return send.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.send);

    let lastModifiedPrevious = null;

    function checkSync(lastModified) {
      if (!lastModified) {
        return false;
      }

      if (lastModified === lastModifiedPrevious) {
        return false;
      }

      lastModifiedPrevious = lastModified;
      return true;
    }

    $(document).on('ajax_after_post', function(e, post_response) {
      if (post_response && post_response.id) {
        const idStr = String(post_response.id);
        justPostedIds.add(idStr);
        setTimeout(() => justPostedIds.delete(idStr), 10000);
      }
    });

    $(document).on('new_post', (e, post) => {
      processPost(post);
      updateUnreadTitle();
      setTimeout(() => syncBacklinksAfterSitePass(post), 0);
    });
  }

  function syncPostStatus(responseText) {
    if (!currentThreadId) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");
    const currentPosts = document.querySelectorAll('div.post.reply');
    const updatePosts = doc.querySelectorAll('div.post.reply');
    const postCount = updatePosts.length;
    const lastPost = currentPosts[currentPosts.length - 1];
    const isTruncated = !responseText.trim().toLowerCase().endsWith('</html>');

    if (lastPost) {
      currentLastPostId = lastPost.id.split('_')[1];
    }

    if (postCount > 0) {
      const postDrop = lastPostCount - postCount;
      isLargeDrop = lastPostCount > 200 ? postDrop >= 100 : (postDrop / lastPostCount) >= 0.3;

      if (isLargeDrop && lastPostCount >= 10) {
        lowPostWarningCount++;

        if (lowPostWarningCount >= 2) {
          lastPostCount = postCount;
          updateThreadStatsActual();
        }
      } else {
        lowPostWarningCount = 0;
        lastPostCount = postCount;
        updateThreadStatsActual();
      }
    }

    if (postCount === 0) return;

    const updatePostIds = new Set();
    let seenRed = false;
    let seenWhite = false;
    let ownPostsByBoard = new Map();
    if (enableFaviconChanges && notifyNewYou && requestedFaviconState !== 'red') {
      ownPostsByBoard = readOwnPosts();
    }

    let lastInsertedNode = null;
    let newPostsInThisUpdate = 0;

    for (let i = 0; i < updatePosts.length; i++) {
      const post = updatePosts[i];
      const postId = post.id.split('_')[1];
      updatePostIds.add(postId);

      if (Number(postId) > Number(lastSeenPostId)) {
        lastSeenPostId = postId;
        newPostsInThisUpdate++;
        if (!rememberLastRead) sessionUnreadPostIds.add(postId);
        if (!hasUnreadLine) addUnreadLine();

        if (enableFaviconChanges) {
          if (notifyNewYou && requestedFaviconState !== 'red') {
            const identity = getPostIdentity(post);
            if (hasOwnedQuote(post, ownPostsByBoard, identity)) seenRed = true;
          }

          if (!seenRed && notifyNewPost) {
            seenWhite = true;
          }
        }
      }

      let currentPost = null;

      const firstBan = post.querySelector('span.public_ban');
      if (firstBan) {
        currentPost = currentPost || document.getElementById('reply_' + postId);
        if (currentPost) {
          const existingBans = Array.from(currentPost.querySelectorAll('span.public_ban'));
          const incomingBans = Array.from(post.querySelectorAll('span.public_ban'));

          const isWarning = (el) => {
            const t = el.textContent.toLowerCase();
            return t.includes('warned') && !t.includes('banned');
          };

          if (incomingBans.length !== existingBans.length) {
            const currentBody = currentPost.querySelector('div.body');
            if (currentBody) {
              const existingBanHtml = new Set(existingBans.map(el => el.outerHTML));
              const newBans = incomingBans.filter(ban => !existingBanHtml.has(ban.outerHTML));

              for (const ban of newBans) {
                const clonedBan = ban.cloneNode(true);

                let referenceEl = null;
                let nextSib = ban.nextElementSibling;
                while (nextSib) {
                  if (nextSib.classList?.contains('public_ban')) {
                    const match = existingBans.find(el => el.outerHTML === nextSib.outerHTML);
                    if (match) {
                      referenceEl = match;
                      break;
                    }
                  }
                  nextSib = nextSib.nextElementSibling;
                }

                if (referenceEl) {
                  currentBody.insertBefore(clonedBan, referenceEl);
                } else {
                  currentBody.appendChild(clonedBan);
                }

                const title = isWarning(ban) ? 'New Warning Message' : 'New Ban Message';
                const action = isWarning(ban) ? 'was warned' : 'was banned';
                const messageHtml = `<strong>${title}</strong><br>
                  User <a href="javascript:void(0)" class="ban-link">No.${postId}</a> ${action} with the following message:
                  ${clonedBan.outerHTML}
                `;

                showMessageNotification(messageHtml);
              }

              setTimeout(() => {
                document.querySelectorAll('.message_notification .ban-link').forEach(link => {
                  if (link.textContent === `No.${postId}` && !link.dataset.bound) {
                    link.dataset.bound = '1';
                    link.addEventListener('click', (e) => {
                      e.preventDefault();
                      scrollToPost(postId);
                    });
                  }
                });
              }, 0);
            }
          } else if (incomingBans.length > 0) {
            let shown = false;
            for (let i = 0; i < incomingBans.length; i++) {
              if (incomingBans[i].outerHTML !== existingBans[i].outerHTML) {
                const clonedBan = incomingBans[i].cloneNode(true);
                existingBans[i].replaceWith(clonedBan);

                const title = isWarning(incomingBans[i]) ? 'New Warning Message' : 'New Ban Message';
                const action = isWarning(incomingBans[i]) ? 'was warned' : 'was banned';
                const messageHtml = `<strong>${title}</strong><br>
                  User <a href="javascript:void(0)" class="ban-link">No.${postId}</a> ${action} with the following message:
                  ${clonedBan.outerHTML}
                `;

                showMessageNotification(messageHtml);
                shown = true;
              }
            }

            if (shown) {
              setTimeout(() => {
                document.querySelectorAll('.message_notification .ban-link').forEach(link => {
                  if (link.textContent === `No.${postId}` && !link.dataset.bound) {
                    link.dataset.bound = '1';
                    link.addEventListener('click', (e) => {
                      e.preventDefault();
                      scrollToPost(postId);
                    });
                  }
                });
              }, 0);
            }
          }
        }
      }

      if (optionThreading && toggleThread && !threadedPostIds.has(postId)) {
        const currentPost = document.getElementById('reply_' + postId);
        if (currentPost) {
          const container = currentPost.closest('.threadingContainer');
          if (container) {
            let topContainer = container;
            while (topContainer.parentElement?.classList?.contains('threadingContainer')) {
              topContainer = topContainer.parentElement;
            }

            const parent = topContainer.parentNode;
            const prev = currentPost.previousElementSibling;
            const isHideButton = prev && (prev.classList.contains('hide-button') || prev.classList.contains('show-button'));
            let br = currentPost.nextSibling;

            while (br?.classList?.contains('dummy')) {
              br = br.nextSibling;
            }

            const hasBr = br && br.nodeType === 1 && br.tagName === 'BR';
            const insertAfter = lastInsertedNode || topContainer;

            let insertPoint = insertAfter.nextSibling;

            if (isHideButton) {
              parent.insertBefore(prev, insertPoint);
              lastInsertedNode = prev;
              insertPoint = lastInsertedNode.nextSibling;
            }

            parent.insertBefore(currentPost, insertPoint);
            lastInsertedNode = currentPost;
            insertPoint = lastInsertedNode.nextSibling;

            if (hasBr) {
              parent.insertBefore(br, insertPoint);
              lastInsertedNode = br;
            }
          }

          if (!threadButton) {
            checkThreadable(currentPost);
          }
        }
      }
    }

    headerBar.updateNewCount(newPostsInThisUpdate);

    if (seenRed) {
      updateFavicon('red');
    } else if (seenWhite && requestedFaviconState !== 'red') {
      updateFavicon('white');
    }

    if (!isTruncated && (hideDeleted || showDeletedIcon || quoteResurrect) && (!isLargeDrop || lowPostWarningCount >= 2)) {
      for (let i = 0; i < currentPosts.length; i++) {
        const post = currentPosts[i];
        if (post.closest('.post.qp.reply') || post.classList.contains('post-hover') || post.classList.contains('dummy')) continue;

        const postId = post.id.split('_')[1];
        const threadEl = post.closest('.thread');
        if (!threadEl) continue;
        const xthreadId = threadEl.id.split('_')[1];
        if (xthreadId !== currentThreadId) continue;

        const inlineQuoteContainer = post.closest('.inline-quote-container');
        const refId = inlineQuoteContainer?.getAttribute('data-inlined-id') || postId;

        const isDeleted = !updatePostIds.has(refId) && !justPostedIds.has(refId);

        let btn = null;
        const prev = post.previousElementSibling;
        if (prev && (prev.classList.contains('hide-button') || prev.classList.contains('show-button'))) {
          btn = prev;
        }

        if (isDeleted) {
          const wasDeleted = post.classList.contains('deleted-post') || post.querySelector('.deleted-post');

          if (!wasDeleted) {
            post.classList.add('deleted-post');
          }

          if (rememberLastRead && !wasDeleted) {
            unreadSet.delete(postId);
            if (lastReadObserver) lastReadObserver.unobserve(post);
          }

          if (hideDeleted) {
            if (!inlineQuoteContainer) {
              post.style.setProperty("display", "none", "important");
              let br = post.nextElementSibling;

              while (br?.classList?.contains('dummy')) {
                br = br.nextElementSibling;
              }

              if (br?.tagName === "BR") {
                br.style.setProperty("display", "none", "important");
              }
            }
            if (btn) {
              btn.style.setProperty("display", "none", "important");
            }
          } else {
            addDeletedIcon(post);
          }
          if (quoteResurrect && !wasDeleted) {
            fixDeletedLinks(postId);
          }
        } else {
          const wasDeleted = post.classList.contains('deleted-post') || post.querySelector('.deleted-post');
          post.classList.remove('deleted-post');
          if (rememberLastRead && wasDeleted) {
            const place = Number(post.dataset.place);
            if (place > lastReadPlacement) {
              unreadSet.add(postId);
              if (lastReadObserver) lastReadObserver.observe(post);
            }
          }
          post.style.removeProperty("display");
          let br = post.nextElementSibling;

          while (br?.classList?.contains('dummy')) {
            br = br.nextElementSibling;
          }

          if (br?.tagName === "BR") {
            br.style.removeProperty("display");
          }
          if (btn) {
            btn.style.removeProperty("display");
          }
          if (!hideDeleted && post.querySelector('.deleted-post')) {
            removeDeletedIcon(post);
          }
          if (quoteResurrect && wasDeleted) {
            restoreDeletedLinks(postId);
          }
        }
      }
    }

    const updateBlotter = doc.querySelector('div.blotter');
    if (updateBlotter) {
      const existingBlotter = document.querySelector('div.blotter');

      if (!existingBlotter || existingBlotter.innerHTML !== updateBlotter.innerHTML) {
        const firstHr = document.querySelector('hr');
        if (firstHr) {
          const clonedBlotter = updateBlotter.cloneNode(true);
          const newHr = document.createElement('hr');

          firstHr.parentNode.insertBefore(clonedBlotter, firstHr.nextSibling);
          firstHr.parentNode.insertBefore(newHr, clonedBlotter.nextSibling);

          showMessageNotification(`<strong>New Announcement</strong><br>
            ${clonedBlotter.outerHTML}
          `, { timeout: 30000 });
        }
      }
    }

    const omittedSpan = doc.querySelector('span.omitted');
    if (omittedSpan) {
      const match = omittedSpan.textContent.match(/([\d,]+) posts?/);
      if (match) {
        const omittedPostCount = Number(match[1].replace(/,/g, ''));
        const isArchivedNow = omittedPostCount >= 1450;

        if (isArchivedNow) {
          if (enableFaviconChanges && changeFaviconOnArchive) {
            updateFaviconArchived();
          }
          if (showArchivedMessage && !document.getElementById('archived-msg')) {
            addArchivedMessage();
          }
          if (updaterCheckbox?.checked && !updaterDisabled) {
            updaterCheckbox.click();
            updaterDisabled = true;
          }
        } else {
          if (isThreadArchived || updaterDisabled) {
            if (isThreadArchived) {
              isThreadArchived = false;
              restoreFavicon();
            }
            updaterDisabled = false;
          }
        }
        headerBar.setArchiveState(isArchivedNow);
      }
    }
  }

  function addDeletedIcon(post) {
    if (!showDeletedIcon) return;
    if (!post.querySelector('.post-btn')) return;

    const postNoLink = post.querySelector('.post_no');
    if (!postNoLink || post.querySelector('.deleted-post')) return;

    if (showDeletedText) {
      const span = document.createElement('span');
      span.textContent = ' [Deleted]';
      span.className = 'deleted-post';
      span.style.color = 'red';
      span.style.fontWeight = 'bolder';
      postNoLink.parentNode.insertBefore(span, postNoLink.nextSibling?.nextSibling || null);
    } else {
      const icon = document.createElement('i');
      icon.classList.add('fa', 'fa-trash', 'deleted-post');
      icon.title = 'Deleted';
      icon.style.opacity = '0.5';
      icon.style.marginRight = '0px';
      postNoLink.parentNode.insertBefore(icon, postNoLink.nextSibling?.nextSibling || null);
    }
  }

  function removeDeletedIcon(post) {
    if (!showDeletedIcon) return;

    const postNoLink = post.querySelector('.post_no');
    const deletedPost = postNoLink?.nextSibling?.nextSibling;
    if (deletedPost?.classList.contains('deleted-post')) {
      deletedPost.remove();
    }
  }

  let firstThreadSet = null;
  let waitingForSecondCheck = false;
  let monitorThreadsJson = true;

  function cleanThreadStorage(responseText) {
    if (!monitorThreadsJson) return;

    try {
      const parsed = JSON.parse(responseText);
      const currentThreads = new Set();

      for (const page of parsed) {
        for (const thread of page.threads) {
          currentThreads.add(thread.no);
        }
      }

      const latestSettings = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      const board = currentBoard;
      const hidden = latestSettings.hiddenPosts?.[board] || {};
      const missing = [];

      for (const threadId in hidden) {
        if (!currentThreads.has(parseInt(threadId, 10))) {
          missing.push(threadId);
        }
      }

      if (!firstThreadSet) {
        if (missing.length === 0) {
          monitorThreadsJson = false;
          return;
        }
        firstThreadSet = currentThreads;
        waitingForSecondCheck = true;
      } else if (waitingForSecondCheck) {
        waitingForSecondCheck = false;

        const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
        const freshHidden = latest.hiddenPosts?.[board] || {};
        let changed = false;

        for (const threadId in freshHidden) {
          if (!currentThreads.has(parseInt(threadId, 10))) {
            delete freshHidden[threadId];
            changed = true;
          }
        }

        if (changed) {
          latest.hiddenPosts[board] = freshHidden;
          localStorage.setItem("Thread Settings", JSON.stringify(latest));
        }

        firstThreadSet = null;
        monitorThreadsJson = false;
      }
    } catch (e) {

    }
  }

  const DAY = 24 * 60 * 60 * 1000;
  let originalFilenameBase = '';
  let clipboardPasteActive = false;
  let clipboardPasteTimer = null;
  const clipboardFiles = new WeakSet();

  function markClipboardPaste() {
    clipboardPasteActive = true;
    clearTimeout(clipboardPasteTimer);
    clipboardPasteTimer = setTimeout(() => {
      clipboardPasteActive = false;
    }, 100);
  }

  function isClipboardFile(file) {
    if (file && clipboardFiles.has(file)) return true;
    return (
      randomizeClipboard &&
      clipboardPasteActive &&
      file &&
      file.name === 'ClipboardImage.png'
    );
  }

  function sanitizeFilenameInput(name) {
    return String(name || '').replace(/[\\\/:\*\?"<>\|]/g, '');
  }

  function sanitizeFilename(name) {
    return sanitizeFilenameInput(name).trim();
  }

  function syncFilename(value) {
    const clean = sanitizeFilenameInput(value);
    const inputs = document.querySelectorAll('input[name="filename"]');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = clean;
    }
  }

  function randomizeFilename(formData) {
    let inputName = sanitizeFilename(formData.get('filename') || '');

    const entries = Array.from(formData.entries());
    const toRename = [];

    for (let i = 0; i < entries.length; i++) {
      const [key, val] = entries[i];
      if (val instanceof File) {
        toRename.push({ key, file: val });
      }
    }

    if (toRename.length === 0) return;

    for (let i = 0; i < toRename.length; i++) {
      formData.delete(toRename[i].key);
    }

    for (let i = 0; i < toRename.length; i++) {
      const { key, file } = toRename[i];
      const parts = file.name.split('.');
      const ext = parts.length > 1 ? '.' + parts.pop() : '';
      const base = sanitizeFilename(inputName || parts.join('.'));
      const finalName = base || originalFilenameBase || 'file';

      const newFile = new File([file], finalName + ext, { type: file.type });
      formData.append(key, newFile);
    }
  }

  function initializeRandomizerToggle() {
    if (!filenameChanger) return;

    const row = document.getElementById('upload_settings');
    if (!row) return;
    const td = row.querySelector('td');
    if (!td) return;

    const filenameRow = document.createElement('tr');
    filenameRow.id = 'upload_filename';
    filenameRow.innerHTML = `
      <th>Filename</th>
      <td><input type="text" name="filename" size="30" maxlength="255" autocomplete="off"></td>
    `;
    row.parentNode.insertBefore(filenameRow, row.nextSibling);

    const filenameInput = filenameRow.querySelector('input[name="filename"]');

    const spoilerInput = td.querySelector('input');
    const spoilerLabel = td.querySelector('label');
    spoilerLabel.removeAttribute('for');
    spoilerLabel.innerHTML = ' Spoiler Image';
    spoilerLabel.prepend(spoilerInput);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'randfn';
    input.id = 'randfn';

    const label = document.createElement('label');
    label.appendChild(input);
    label.appendChild(document.createTextNode(' Randomize Filename'));
    td.appendChild(label);

    document.addEventListener('change', (e) => {
      const target = e.target;

      if (target.tagName === 'INPUT' && target.type === 'file') {
        if (mobileInput) return;
        let file = target.files?.[0];
        if (!file) return;

        const parts = file.name.split('.');
        const ext = parts.length > 1 ? parts.pop() : '';
        originalFilenameBase = sanitizeFilename(parts.join('.'));
        filenameInput.maxLength = 255 - (ext.length > 0 ? ext.length + 1 : 0);
        if (outboxRestoringFile) return;

        const randfnInput = target.form?.querySelector('input[name="randfn"]') || input;
        const soundpost = originalFilenameBase.includes('[sound=');
        if (randfnInput.checked && !soundpost) {
          const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
          syncFilename(timestamp);
        } else {
          syncFilename(originalFilenameBase);
        }
      }

      if (target.name === 'spoiler') {
        const checked = target.checked;
        const boxes = document.querySelectorAll('input[name="spoiler"]');
        for (let i = 0; i < boxes.length; i++) {
          boxes[i].checked = checked;
        }
      }

      if (target.name === 'randfn') {
        const checked = target.checked;
        const boxes = document.querySelectorAll('input[name="randfn"]');
        for (let i = 0; i < boxes.length; i++) {
          boxes[i].checked = checked;
        }
        if (checked) {
          const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
          syncFilename(timestamp);
        } else {
          syncFilename(originalFilenameBase || '');
        }
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.name === 'filename') {
        let val = e.target.value || '';
        if (val.length > filenameInput.maxLength) {
          val = val.substring(0, filenameInput.maxLength);
        }
        syncFilename(val);
      }
    });

    $(document).on('ajax_before_post', (e, formData) => {
      randomizeFilename(formData);
    });

    const thumbs = document.querySelector('.file-thumbs');
    if (thumbs) {
      const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
          const { addedNodes, removedNodes } = mutations[i];
          for (let j = 0; j < addedNodes.length; j++) {
            const node = addedNodes[j];
            if (node.nodeType !== 1 || !node.classList.contains('tmb-container')) continue;
            const file = $(node).data('file-ref');
            if (file) {
              const parts = file.name.split('.');
              const ext = parts.length > 1 ? parts.pop() : '';
              originalFilenameBase = sanitizeFilename(parts.join('.'));
              filenameInput.maxLength = 255 - (ext.length > 0 ? ext.length + 1 : 0);

              if (!outboxRestoringFile) {
                const randfnInput = node.closest('form')?.querySelector('input[name="randfn"]') || input;
                const soundpost = originalFilenameBase.includes('[sound=');
                const clipboardImage = randomizeClipboard && isClipboardFile(file);

                if (!soundpost && (randfnInput.checked || clipboardImage)) {
                  const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
                  syncFilename(timestamp);
                } else {
                  syncFilename(originalFilenameBase);
                }
              }
            }
          }

          if (removedNodes.length > 0) {
            const remainingFiles = thumbs.querySelectorAll('.tmb-container');
            if (remainingFiles.length === 0) {
              syncFilename('');
              originalFilenameBase = '';
            }
          }
        }
      });

      observer.observe(thumbs, { childList: true });
    }
  }

  let mobileInput = false;
  let mobileURLBtn = false;

  let outboxRestoringFile = false;
  let outboxClosing = false;
  let outboxCiteOpening = false;
  let outboxRescueFields = false;

  function checkMobile() {
    const mobileHtml = document.documentElement.matches('html.mobile-style, html.mobile-style-new');
    const forceMobileTheme = localStorage.getItem('forceMobileTheme') === 'on';
    const mobileStyleNew = localStorage.getItem('mobileStyle') === 'new';

    if (!mobileStyleNew) return false;

    return mobileHtml || forceMobileTheme;
  }

  function waitForElement(selector, callback, timeout = 5000) {
    const el = document.querySelector(selector);
    if (el) {
      callback(el);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        cleanup();
        callback(el);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    let timer = null;
    if (timeout) {
      timer = setTimeout(cleanup, timeout);
    }

    function cleanup() {
      observer.disconnect();
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
  }

  function initializeMobileRandomizer() {
    if (!filenameChanger) return;
    if (!checkMobile()) return;

    waitForElement('#mbReplyForm', (mbForm) => {
      if (mbForm.querySelector('#mbRandomizerBtn')) return;

      const embedInput = mbForm.querySelector('input[name="embed"]');
      if (!embedInput) return;

      const mbFilenameInput = document.createElement('input');
      mbFilenameInput.name = 'filename';
      mbFilenameInput.placeholder = 'Filename';
      mbFilenameInput.maxLength = 255;
      embedInput.insertAdjacentElement('afterend', mbFilenameInput);

      const mbSpoilerBtn = document.getElementById('mbSpoilerBtn');
      if (!mbSpoilerBtn) return;

      const mbRandBtn = document.createElement('button');
      mbRandBtn.type = 'button';
      mbRandBtn.id = 'mbRandomizerBtn';
      mbRandBtn.className = 'outline';
      mbRandBtn.setAttribute('aria-pressed', 'false');
      mbRandBtn.textContent = 'Randomize';
      mbSpoilerBtn.insertAdjacentElement('beforebegin', mbRandBtn);

      const mbFileInput = document.getElementById('mbFileInput');
      mbFileInput.addEventListener('change', () => {
        const file = mbFileInput.files?.[0];
        if (file) {
          const parts = file.name.split('.');
          const ext = parts.length > 1 ? parts.pop() : '';
          originalFilenameBase = sanitizeFilename(parts.join('.'));
          mbFilenameInput.maxLength = 255 - (ext ? ext.length + 1 : 0);

          const soundpost = originalFilenameBase.includes('[sound=');
          const clipboardImage = randomizeClipboard && isClipboardFile(file);

          if (!soundpost && (mbRandBtn.getAttribute('aria-pressed') === 'true' || clipboardImage)) {
            const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
              mbFilenameInput.value = timestamp;
          } else {
              mbFilenameInput.value = originalFilenameBase;
          }
        }
      });

      mbRandBtn.addEventListener('click', () => {
        const isOn = mbRandBtn.getAttribute('aria-pressed') === 'true';
        if (isOn) {
          mbRandBtn.setAttribute('aria-pressed', 'false');
          mbRandBtn.classList.remove('active');
          mbFilenameInput.value = originalFilenameBase || '';
        } else {
          mbRandBtn.setAttribute('aria-pressed', 'true');
          mbRandBtn.classList.add('active');
          const timestamp = '' + (Date.now() - Math.floor(Math.random() * 365 * DAY));
          mbFilenameInput.value = timestamp;
        }
      });

      mbFilenameInput.addEventListener('input', () => {
        let val = mbFilenameInput.value || '';
        if (val.length > mbFilenameInput.maxLength) {
          val = val.substring(0, mbFilenameInput.maxLength);
        }
        mbFilenameInput.value = sanitizeFilenameInput(val);
      });

      mbForm.addEventListener('submit', (e) => {
        const mbFileInput = document.getElementById('mbFileInput');
        const file = mbFileInput?.files?.[0];
        if (!file) return;

        const parts = file.name.split('.');
        const ext = parts.length > 1 ? '.' + parts.pop() : '';
        const base = sanitizeFilename(mbFilenameInput.value || '');
        const finalName = base || originalFilenameBase || 'file';

        const newFile = new File([file], finalName + ext, { type: file.type });
        const dt = new DataTransfer();
        dt.items.add(newFile);
        mbFileInput.files = dt.files;
      }, true);

      const mbFileStatus = document.getElementById("mbFileStatus");
      if (mbFileStatus) {
        const observer = new MutationObserver(() => {
          if (!mbFileStatus.textContent.trim()) {
            mbFilenameInput.value = '';
            originalFilenameBase = '';
          }
        });
        observer.observe(mbFileStatus, { childList: true, characterData: true, subtree: true });
      }
    });
    mobileInput = true;
  }

  const outboxStore = { posts: [], activeIndex: -1 };
  const outboxObjectUrls = new WeakMap();
  const outboxVideoThumbnails = new WeakMap();
  let outboxLocked = false;
  let outboxNextPostId = 1;
  let outboxDragSession = null;
  let outboxRenderPending = false;

  function getOutboxPanel() {
    const mobileForm = document.getElementById('mbReplyForm');
    if (mobileForm && (document.documentElement.matches('html.mobile-style, html.mobile-style-new') || checkMobile())) {
      return { type: 'mobile', form: mobileForm };
    }
    const qr = document.getElementById('quick-reply');
    return { type: 'desktop', form: qr || document.querySelector('form[name="post"]') };
  }

  function getOutboxFieldRoot(panel) {
    const form = panel && panel.form;
    if (!form) return null;
    return panel.type === 'mobile' ? form.closest('#mbDesktopFloat') || form : form;
  }

  function readDraftFields(panel) {
    const form = panel.form;
    if (!form) return null;
    const fieldRoot = getOutboxFieldRoot(panel);

    const field = (sel) => {
      const el = fieldRoot.querySelector(sel);
      return el ? el.value : '';
    };

    let spoiler = false;
    const spoilerChk = form.querySelector('input[name="spoiler"]');
    if (spoilerChk) spoiler = spoilerChk.checked;
    const spoilerBtn = panel.type === 'mobile' ? fieldRoot.querySelector('#mbSpoilerBtn') : null;
    if (spoilerBtn) spoiler = spoilerBtn.getAttribute('aria-pressed') === 'true';

    let randfn = false;
    const randfnChk = form.querySelector('input[name="randfn"]');
    if (randfnChk) {
      randfn = randfnChk.checked;
    } else {
      const mbRandBtn = panel.type === 'mobile' ? fieldRoot.querySelector('#mbRandomizerBtn') : null;
      if (mbRandBtn) randfn = mbRandBtn.getAttribute('aria-pressed') === 'true';
    }

    const file = readDraftFile(panel);
    return ensurePostId({
      body: field('textarea[name="body"]'),
      name: field('input[name="name"]'),
      email: field('input[name="email"], input[name="options"], select[name="email"], select[name="options"]'),
      subject: field('input[name="subject"]'),
      embed: field('input[name="embed"]'),
      password: field('#mbPassword, input[name="password"]'),
      spoiler,
      randfn,
      filename: field('input[name="filename"]'),
      file
    }, outboxStore.activeIndex >= 0 ? outboxStore.posts[outboxStore.activeIndex] : null);
  }

  function ensurePostId(post, previous) {
    if (!post._outboxId) post._outboxId = previous && previous._outboxId ? previous._outboxId : 'outbox-' + outboxNextPostId++;
    return post;
  }

  function readDraftFile(panel) {
    const form = panel.form;
    if (!form) return null;

    if (panel.type === 'mobile') {
      const mb = document.getElementById('mbFileInput');
      if (mb && mb.files && mb.files.length) return mb.files[0];
    }

    const thumb = document.querySelector('.file-thumbs .tmb-container');
    if (thumb) {
      const f = $(thumb).data('file-ref');
      if (f) return f;
    }

    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length) return fileInput.files[0];
    return null;
  }

  function releaseDraftFile(file) {
    if (!file || !outboxObjectUrls.has(file) || outboxStore.posts.some(post => post.file === file)) return;
    const thumbnail = outboxVideoThumbnails.get(file);
    if (thumbnail && thumbnail.status === 'pending') {
      thumbnail.status = 'cancelled';
      thumbnail.cleanup();
    }
    outboxVideoThumbnails.delete(file);
    URL.revokeObjectURL(outboxObjectUrls.get(file));
    outboxObjectUrls.delete(file);
  }

  function getOutboxFileUrl(file) {
    let url = outboxObjectUrls.get(file);
    if (!url) {
      try {
        url = URL.createObjectURL(file);
        outboxObjectUrls.set(file, url);
      } catch (e) {}
    }
    return url || '';
  }

  function updateOutboxVideoThumbnail(file, thumbnailUrl) {
    if (!outboxStore.posts.some(post => post.file === file)) return;
    const backgroundImage = thumbnailUrl ? 'url("' + thumbnailUrl + '")' : '';
    for (const list of document.querySelectorAll('#outbox-list, #mb-outbox-list')) {
      for (const item of list.querySelectorAll('.outbox-item')) {
        const post = outboxStore.posts.find(entry => entry._outboxId === item.dataset.postId);
        if (post?.file === file) item.style.backgroundImage = backgroundImage;
      }
    }
  }

  function getOutboxVideoThumbnail(file) {
    const cached = outboxVideoThumbnails.get(file);
    if (cached) return cached.status === 'ready' ? cached.url : '';

    const sourceUrl = getOutboxFileUrl(file);
    if (!sourceUrl) {
      outboxVideoThumbnails.set(file, { status: 'failed', url: '' });
      return '';
    }

    const entry = { status: 'pending', url: '', cleanup: null };
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    let timer = 0;
    let done = false;

    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener('loadedmetadata', seekFrame);
      video.removeEventListener('loadeddata', captureFrame);
      video.removeEventListener('seeked', captureFrame);
      video.removeEventListener('error', fail);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };

    const finish = (thumbnailUrl) => {
      if (done) return;
      done = true;
      entry.status = thumbnailUrl ? 'ready' : 'failed';
      entry.url = thumbnailUrl || '';
      cleanup();
      if (thumbnailUrl) updateOutboxVideoThumbnail(file, thumbnailUrl);
    };

    const fail = () => finish('');

    const captureFrame = () => {
      if (done || video.readyState < 2 || !video.videoWidth || !video.videoHeight || video.seeking) return;
      try {
        const scale = Math.min(1, 320 / Math.max(video.videoWidth, video.videoHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        finish(canvas.toDataURL('image/jpeg', 0.8));
      } catch (e) {
        fail();
      }
    };

    const seekFrame = () => {
      if (video.duration > 0.1) {
        try {
          video.currentTime = Math.min(0.1, video.duration / 2);
          return;
        } catch (e) {}
      }
      captureFrame();
    };

    entry.cleanup = cleanup;
    outboxVideoThumbnails.set(file, entry);
    video.addEventListener('loadedmetadata', seekFrame);
    video.addEventListener('loadeddata', captureFrame);
    video.addEventListener('seeked', captureFrame);
    video.addEventListener('error', fail);
    timer = setTimeout(fail, 5000);
    video.src = sourceUrl;
    video.load();
    return '';
  }

  function isOutboxVideo(file) {
    return /^video\//i.test(file.type || '') || /\.(?:mp4|webm)$/i.test(file.name || '');
  }

  function setDraftFile(post, file) {
    if (post.file === file) return false;
    const previous = post.file;
    post.file = file;
    releaseDraftFile(previous);
    return true;
  }

  function captureDraftId(file, context) {
    if (!postOutbox) return null;

    const source = context && context.nodeType === 1 ? context : null;
    const sourceForm = source && (source.tagName === 'FORM' ? source : source.form || source.closest('form'));
    const activePanel = getOutboxPanel();
    if (sourceForm && sourceForm !== activePanel.form) return null;

    const post = outboxStore.posts[outboxStore.activeIndex];
    if (!post) return null;
    if (sourceForm && sourceForm === activePanel.form) {
      if (file !== undefined && setDraftFile(post, file)) renderDraftList();
      return post._outboxId;
    }
    return post.file === file ? post._outboxId : null;
  }

  function attachDraftFile(file, form, postId) {
    if (postId) {
      let post = outboxStore.posts.find(post => post._outboxId === postId);
      if (!post) return false;
      const active = outboxStore.posts[outboxStore.activeIndex] === post;
      if (active) {
        saveActiveDraft();
        post = outboxStore.posts[outboxStore.activeIndex];
      }
      setDraftFile(post, file);
      const base = sanitizeFilename(file.name.replace(/\.[^.]+$/, ''));
      post.filename = post.randfn && !base.includes('[sound=')
        ? String(Date.now() - Math.floor(Math.random() * 365 * DAY)) : base;
      if (active) {
        const panel = getOutboxPanel();
        if (panel.form) writeDraftFields(panel, post);
      }
      renderDraftList();
      return true;
    }
    if (!form?.isConnected) return false;
    const panel = { type: form.id === 'mbReplyForm' ? 'mobile' : 'desktop', form };
    clearDraftFile(panel);
    return addFileToContainer(form, file);
  }

  function syncDraftFile() {
    if (!postOutbox || outboxRestoringFile || outboxClosing || outboxStore.activeIndex < 0) return;
    const panel = getOutboxPanel();
    if (!panel.form) return;
    const file = readDraftFile(panel);
    const post = outboxStore.posts[outboxStore.activeIndex];
    if (post && setDraftFile(post, file)) renderDraftList();
  }

  function writeDraftFields(panel, post, skipBody) {
    const form = panel.form;
    if (!form) return;
    const fieldRoot = getOutboxFieldRoot(panel);

    const set = (sel, val) => {
      const el = fieldRoot.querySelector(sel);
      if (el) el.value = val || '';
    };

    if (!skipBody) set('textarea[name="body"]', post.body);
    set('input[name="name"]', post.name);
    set('input[name="email"], input[name="options"], select[name="email"], select[name="options"]', post.email);
    set('input[name="subject"]', post.subject);
    set('input[name="embed"]', post.embed);
    set('#mbPassword, input[name="password"]', post.password);

    const spoilerChk = form.querySelector('input[name="spoiler"]');
    if (spoilerChk) spoilerChk.checked = !!post.spoiler;

    const spoilerBtn = panel.type === 'mobile' ? fieldRoot.querySelector('#mbSpoilerBtn') : null;
    if (spoilerBtn && spoilerBtn.getAttribute('aria-pressed') !== String(!!post.spoiler)) {
      spoilerBtn.click();
    }

    outboxRestoringFile = true;
    try {
      writeDraftFile(panel, post.file);
      set('input[name="filename"]', post.filename);
      const randfnChk = form.querySelector('input[name="randfn"]');
      if (randfnChk) {
        randfnChk.checked = !!post.randfn;
      } else {
        const mbRandBtn = panel.type === 'mobile' ? fieldRoot.querySelector('#mbRandomizerBtn') : null;
        if (mbRandBtn && mbRandBtn.getAttribute('aria-pressed') !== String(!!post.randfn)) {
          mbRandBtn.setAttribute('aria-pressed', String(!!post.randfn));
          mbRandBtn.classList.toggle('active', !!post.randfn);
        }
      }
    } finally {
      setTimeout(() => { outboxRestoringFile = false; }, 0);
    }
  }

  function clearDraftFile(panel) {
    const form = panel.form;
    if (!form) return;

    document.querySelectorAll('.file-thumbs .tmb-container .remove-btn').forEach((btn) => btn.click());

    const fileInput = form.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';

    const mb = document.getElementById('mbFileInput');
    if (mb) mb.value = '';

    const clearBtn = document.getElementById('mbClearFiles');
    if (clearBtn) {
      clearBtn.click();
    } else {
      const status = document.getElementById('mbFileStatus');
      if (status) { status.textContent = ''; status.style.color = ''; }
      const preview = document.getElementById('mbFilePreview');
      if (preview) preview.innerHTML = '';
    }

    syncDraftFile();
  }

  function writeDraftFile(panel, file) {
    const form = panel.form;
    if (!form) return;

    clearDraftFile(panel);
    if (!file) return;

    addFileToContainer(form, file);
  }

  function syncConvertedFile(original, converted, sourcePostId) {
    if (!sourcePostId || outboxStore.activeIndex < 0 || outboxStore.activeIndex >= outboxStore.posts.length) return false;
    const activePost = outboxStore.posts[outboxStore.activeIndex];
    if (!activePost || activePost._outboxId !== sourcePostId) return false;

    const panel = getOutboxPanel();
    if (!panel.form || readDraftFile(panel) !== original) return false;

    const wasRestoringFile = outboxRestoringFile;
    outboxRestoringFile = true;
    try {
      writeDraftFile(panel, converted);
    } finally {
      if (!wasRestoringFile) {
        setTimeout(() => { outboxRestoringFile = false; }, 0);
      }
    }
    return true;
  }

  function saveDraft() {
    if (!postOutbox || outboxLocked) return;

    const panel = getOutboxPanel();
    if (panel.type === 'desktop' && panel.form && !panel.form.querySelector('#outbox-row')) {
      addOutboxPanel(panel.form);
    }
    if (!panel.form) return;

    const post = readDraftFields(panel);
    if (!post) return;

    const hasActive = outboxStore.activeIndex >= 0;
    const empty = !post.body && !post.name && !post.email && !post.subject && !post.embed && !post.file;

    if (hasActive) {
      if (!empty) {
        setDraftFile(outboxStore.posts[outboxStore.activeIndex], post.file);
        outboxStore.posts[outboxStore.activeIndex] = post;
      }
    } else {
      outboxStore.posts.push(post);
    }

    const latest = outboxStore.posts[outboxStore.posts.length - 1] || { name: '', email: '', randfn: false, filename: '' };
    const blank = {
      name: latest.name,
      email: latest.email,
      body: '', subject: '', embed: '', password: latest.password || localStorage.password || '',
      spoiler: latest.spoiler || false, randfn: latest.randfn || false,
      filename: '',
      file: null
    };

    outboxStore.posts.push(ensurePostId(blank));
    outboxStore.activeIndex = outboxStore.posts.length - 1;
    document.body.classList.add('outbox-has-posts');
    writeDraftFields(panel, blank);
    renderDraftList();
  }

  function loadDraft(index) {
    if (outboxLocked) return;
    const panel = getOutboxPanel();
    if (!panel.form) return;
    if (index < 0 || index >= outboxStore.posts.length) return;

    if (outboxStore.activeIndex >= 0) saveActiveDraft();
    outboxStore.activeIndex = index;
    writeDraftFields(panel, outboxStore.posts[index]);
    renderDraftList();
  }

  function removeOutboxDraft(index, afterActiveRestore) {
    const removed = outboxStore.posts.splice(index, 1)[0];
    releaseDraftFile(removed?.file);

    if (outboxStore.activeIndex === index) {
      if (outboxStore.posts.length > 0) {
        outboxStore.activeIndex = Math.min(index, outboxStore.posts.length - 1);
        const panel = getOutboxPanel();
        if (afterActiveRestore) {
          if (panel.form) {
            writeDraftFields(panel, outboxStore.posts[outboxStore.activeIndex]);
            afterActiveRestore(panel);
          }
        } else {
          writeDraftFields(panel, outboxStore.posts[outboxStore.activeIndex]);
        }
      } else {
        outboxStore.activeIndex = -1;
      }
    } else if (outboxStore.activeIndex > index) {
      outboxStore.activeIndex--;
    }

    if (!outboxStore.posts.length) document.body.classList.remove('outbox-has-posts');
    renderDraftList();
  }

  function reorderDrafts(fromId, toId) {
    const from = outboxStore.posts.findIndex((post) => post._outboxId === fromId);
    const to = outboxStore.posts.findIndex((post) => post._outboxId === toId);
    if (from < 0 || from >= outboxStore.posts.length || to < 0 || to >= outboxStore.posts.length) return;
    if (from === to) return;

    const active = outboxStore.posts[outboxStore.activeIndex];
    const [moved] = outboxStore.posts.splice(from, 1);
    outboxStore.posts.splice(to, 0, moved);

    if (active) outboxStore.activeIndex = outboxStore.posts.indexOf(active);
    renderDraftList();
  }

  function saveActiveDraft() {
    const panel = getOutboxPanel();
    if (!panel.form) return;
    if (outboxStore.activeIndex < 0 || outboxStore.activeIndex >= outboxStore.posts.length) return;

    const post = readDraftFields(panel);
    if (post) {
      setDraftFile(outboxStore.posts[outboxStore.activeIndex], post.file);
      outboxStore.posts[outboxStore.activeIndex] = post;
    }
  }

  function saveDraftField(e) {
    if (outboxStore.activeIndex < 0 || outboxStore.activeIndex >= outboxStore.posts.length) return;
    const target = e.target;
    if (!target || target.nodeType !== 1) return;
    const panel = getOutboxPanel();
    const fieldRoot = getOutboxFieldRoot(panel);
    if (!panel.form || !panel.form.querySelector('#outbox-row, #mb-outbox-container') || !fieldRoot?.contains(target)) return;

    const post = outboxStore.posts[outboxStore.activeIndex];
    const spoilerButton = e.type === 'click' && panel.type === 'mobile' && target.closest ? target.closest('#mbSpoilerBtn') : null;
    if (spoilerButton && fieldRoot.querySelector('#mbSpoilerBtn') !== spoilerButton) return;
    const field = spoilerButton ? 'spoiler' : target.name === 'options' ? 'email' : target.name;
    const isCheckbox = target.type === 'checkbox';
    if (e.type === 'change' && !isCheckbox) return;
    if (e.type === 'input' && isCheckbox) return;
    if (e.type === 'click' && !spoilerButton) return;

    const checkboxField = field === 'spoiler' || field === 'randfn';
    if (!['body', 'name', 'email', 'subject', 'embed', 'password', 'filename', 'spoiler', 'randfn'].includes(field)) return;

    const value = spoilerButton
      ? spoilerButton.getAttribute('aria-pressed') === 'true'
      : checkboxField ? target.checked : target.value;

    post[field] = value;
    updateDraftPreview(post, field);
  }

  function lockOutbox() {
    outboxLocked = true;
    document.body.classList.add('outbox-locked');
  }

  function unlockOutbox() {
    outboxLocked = false;
    document.body.classList.remove('outbox-locked');
  }

  function replaceConvertedFile(original, converted, sourcePostId) {
    if (!postOutbox || original === converted) return;

    const post = outboxStore.posts.find(post => post._outboxId === sourcePostId && post.file === original);
    if (post && setDraftFile(post, converted)) renderDraftList();
  }

  function updateDraftPreview(post, field) {
    if (field !== 'body' && field !== 'spoiler') return;
    if (outboxDragSession) {
      outboxRenderPending = true;
      return;
    }

    const postId = ensurePostId(post)._outboxId;
    const preview = field === 'body'
      ? String(post.body || '').replace(/\s+/g, ' ').slice(0, 30)
      : null;

    for (const list of document.querySelectorAll('#outbox-list, #mb-outbox-list')) {
      const item = Array.from(list.children).find(child => child.dataset?.postId === postId);
      if (!item) continue;

      if (field === 'body') {
        const comment = item.querySelector('.outbox-comment');
        if (comment && comment.textContent !== preview) comment.textContent = preview;
      } else {
        item.classList.toggle('outbox-spoiler', !!post.spoiler);
      }
    }
  }

  function renderDraftList() {
    for (let i = 0; i < outboxStore.posts.length; i++) {
      ensurePostId(outboxStore.posts[i]);
    }
    if (outboxDragSession) {
      outboxRenderPending = true;
      return;
    }
    const lists = document.querySelectorAll('#outbox-list, #mb-outbox-list');
    if (!lists.length) return;

    for (const list of lists) {
      const existing = new Map(Array.from(list.children).filter((item) => item.classList.contains('outbox-item')).map((item) => [item.dataset.postId, item]));
      const desired = outboxStore.posts.map((post, i) => {
        let item = existing.get(post._outboxId);
        if (!item) {
          item = document.createElement('div');
          item.className = 'outbox-item';
          const comment = document.createElement('span');
          comment.className = 'outbox-comment';
          const remove = document.createElement('span');
          remove.className = 'outbox-remove';
          remove.textContent = '✕';
          remove.title = 'Remove';
          item.append(comment, remove);
        } else {
          existing.delete(post._outboxId);
        }
        item.dataset.postId = post._outboxId;
        item.classList.toggle('outbox-selected', i === outboxStore.activeIndex);
        item.classList.toggle('outbox-spoiler', !!post.spoiler);
        item.draggable = true;

        if (post.file) {
          const thumbnailUrl = isOutboxVideo(post.file)
            ? getOutboxVideoThumbnail(post.file)
            : getOutboxFileUrl(post.file);
          const backgroundImage = thumbnailUrl ? 'url("' + thumbnailUrl + '")' : '';
          if (item.style.backgroundImage !== backgroundImage) item.style.backgroundImage = backgroundImage;
        } else {
          if (item.style.backgroundImage) item.style.backgroundImage = '';
        }

        const comment = item.querySelector('.outbox-comment');
        const preview = (post.body || '').replace(/\s+/g, ' ').slice(0, 30);
        if (comment.textContent !== preview) comment.textContent = preview;
        return item;
      });

      existing.forEach((item) => item.remove());
      for (let i = 0; i < desired.length; i++) {
        const item = desired[i];
        const current = list.children[i];
        if (current !== item) list.insertBefore(item, current || null);
      }
      while (list.children.length > desired.length) list.lastElementChild.remove();
    }
    outboxRenderPending = false;
  }

  function clearDragTarget(session, item) {
    if (!session || (item && session.targetItem !== item)) return;
    if (session.targetItem) session.targetItem.classList.remove('outbox-over');
    session.targetItem = null;
  }

  function setDragTarget(item) {
    const session = outboxDragSession;
    if (!session || session.ending) return;
    if (!item || !item.isConnected || item.closest('#outbox-list, #mb-outbox-list') !== session.list || item.dataset.postId === session.fromId) {
      clearDragTarget(session);
      return;
    }

    if (session.targetItem === item) return;
    clearDragTarget(session);
    session.targetItem = item;
    item.classList.add('outbox-over');
  }

  function clearDragState(session) {
    if (!session) return;
    if (session.list) session.list.classList.remove('outbox-drag-active');
    if (session.sourceItem) session.sourceItem.classList.remove('outbox-drag');
    document.querySelectorAll('.outbox-item.outbox-drag').forEach((el) => el.classList.remove('outbox-drag'));
    clearDragTarget(session);
  }

  function releaseDragSession(session) {
    if (outboxDragSession !== session || session.ending || session.released) return;
    session.released = true;
    clearDragState(session);
  }

  function finishDragSession(session, allowEnding = false) {
    if (outboxDragSession !== session || (session.ending && !allowEnding)) return;
    session.ending = true;
    clearDragState(session);
    if (outboxDragSession !== session || !session.ending) return;
    if (session.observer) session.observer.disconnect();
    outboxDragSession = null;
    if (session.toId) reorderDrafts(session.fromId, session.toId);
    if (outboxRenderPending) renderDraftList();
  }

  function cancelDragSession(session, allowEnding = false) {
    if (outboxDragSession !== session) return;
    session.toId = null;
    finishDragSession(session, allowEnding);
  }

  function observeDragSession(session) {
    if (typeof MutationObserver === 'undefined' || !document.body) return;
    session.observer = new MutationObserver(() => {
      if (outboxDragSession !== session) return;
      if (!session.ending && (!session.list.isConnected || !session.sourceItem.isConnected || session.sourceItem.closest('#outbox-list, #mb-outbox-list') !== session.list)) {
        cancelDragSession(session);
        return;
      }
      if (session.dropItem && (!session.dropItem.isConnected || session.dropItem.closest('#outbox-list, #mb-outbox-list') !== session.list)) {
        session.dropItem = null;
        session.toId = null;
      }
      if (session.targetItem && (!session.targetItem.isConnected || session.targetItem.closest('#outbox-list, #mb-outbox-list') !== session.list)) clearDragTarget(session);
    });
    session.observer.observe(document.body, { childList: true, subtree: true });
  }

  function bindOutboxEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target.closest) return;

      if (target.closest('#outbox-button, #mbDFOutboxBtn')) {
        e.preventDefault();
        saveDraft();
        return;
      }

      if (target.closest('#mbClearFiles')) {
        if (outboxStore.activeIndex >= 0) syncDraftFile();
        return;
      }

      if (target.closest('#mbSpoilerBtn')) {
        saveDraftField(e);
        return;
      }

      const item = target.closest('.outbox-item');
      if (item) {
        const index = outboxStore.posts.findIndex((entry) => entry._outboxId === item.dataset.postId);
        if (index < 0) return;
        if (target.classList.contains('outbox-remove')) {
          if (outboxLocked && index === outboxStore.activeIndex) return;
          removeOutboxDraft(index);
        } else {
          loadDraft(index);
        }
      }
    });

    document.addEventListener('dragstart', (e) => {
      const item = e.target && e.target.closest ? e.target.closest('.outbox-item') : null;
      if (!item) return;
      if (outboxDragSession) cancelDragSession(outboxDragSession, true);
      const list = item.closest('#outbox-list, #mb-outbox-list');
      const post = outboxStore.posts.find((entry) => entry._outboxId === item.dataset.postId);
      if (!list || !post) return;
      outboxDragSession = { fromId: post._outboxId, toId: null, list, sourceItem: item, targetItem: null, dropItem: null, ending: false, released: false };
      list.classList.add('outbox-drag-active');
      item.classList.add('outbox-drag');
      const session = outboxDragSession;
      observeDragSession(session);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
      }
    });

    document.addEventListener('dragover', (e) => {
      const item = e.target && e.target.closest ? e.target.closest('.outbox-item') : null;
      if (!outboxDragSession || outboxDragSession.ending || outboxDragSession.released) return;
      if (!item || item.closest('#outbox-list, #mb-outbox-list') !== outboxDragSession.list) {
        clearDragTarget(outboxDragSession);
        return;
      }
      e.preventDefault();
      setDragTarget(item);
    });

    document.addEventListener('dragleave', (e) => {
      const item = e.target && e.target.closest ? e.target.closest('.outbox-item') : null;
      if (!item || !outboxDragSession || outboxDragSession.ending || outboxDragSession.released || item.closest('#outbox-list, #mb-outbox-list') !== outboxDragSession.list) return;
      const related = e.relatedTarget;
      if (related && item.contains(related)) return;
      clearDragTarget(outboxDragSession, item);
    });

    document.addEventListener('drop', (e) => {
      const session = outboxDragSession;
      if (!session || session.ending || session.released) return;
      const item = e.target && e.target.closest ? e.target.closest('.outbox-item') : null;
      if (item && item.closest('#outbox-list, #mb-outbox-list') === session.list && item.dataset.postId !== session.fromId) {
        const target = outboxStore.posts.find((post) => post._outboxId === item.dataset.postId);
        if (target) {
          e.preventDefault();
          session.toId = target._outboxId;
          session.dropItem = item;
        }
      }
      releaseDragSession(session);
    });

    document.addEventListener('dragend', () => {
      const session = outboxDragSession;
      if (!session) return;
      releaseDragSession(session);
      setTimeout(() => finishDragSession(session), 0);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && outboxDragSession) cancelDragSession(outboxDragSession);
    });

    window.addEventListener('blur', () => {
      if (outboxDragSession) cancelDragSession(outboxDragSession);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && outboxDragSession) cancelDragSession(outboxDragSession);
    });
  }

  function addOutboxPanel(qr) {
    if (!qr || qr.querySelector('#outbox-row')) return;

    const uploadSettings = qr.querySelector('#upload_settings');
    if (!uploadSettings) return;

    const td = uploadSettings.querySelector('td');
    if (td && !td.querySelector('#outbox-button')) {
      const btn = document.createElement('a');
      btn.id = 'outbox-button';
      btn.href = 'javascript:;';
      btn.title = 'Outbox';
      btn.setAttribute('aria-label', 'Outbox');
      btn.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
      td.appendChild(btn);
    }

    const row = document.createElement('tr');
    row.id = 'outbox-row';
    row.innerHTML = '<td colspan="2"><div id="outbox-container"><div id="outbox-list"></div></div></td>';
    uploadSettings.parentNode.insertBefore(row, uploadSettings);
  }

  function initializeOutboxDesktop() {
    if (!postOutbox) return;

    const injectSource = () => {
      const qr = document.getElementById('quick-reply');
      if (qr) {
        addOutboxPanel(qr);
        return;
      }
      const mainForm = document.querySelector('form[name="post"]');
      if (!mainForm || mainForm.querySelector('#outbox-row')) return;
      const uploadSettings = mainForm.querySelector('#upload_settings');
      if (!uploadSettings) return;
      addOutboxPanel(mainForm);
    };

    injectSource();

    const onQuickReply = () => {
      const qr = document.getElementById('quick-reply');
      const isCiteOpen = outboxCiteOpening;
      outboxCiteOpening = false;
      if (qr && qr.querySelector('#outbox-row') && outboxClosing === false) return;
      outboxClosing = false;
      injectSource();
      if (outboxStore.activeIndex >= 0 && outboxStore.activeIndex < outboxStore.posts.length) {
        const panel = getOutboxPanel();
        if (panel.form) {
          writeDraftFields(panel, outboxStore.posts[outboxStore.activeIndex], isCiteOpen);
        }
      }
      renderDraftList();
    };

    document.addEventListener('click', (e) => {
      if (!e.target.closest) return;

      if (e.target.closest('#quick-reply .close-btn')) {
        if (outboxStore.activeIndex >= 0) saveActiveDraft();
        outboxClosing = true;
        if (outboxStore.activeIndex >= 0 && outboxStore.activeIndex < outboxStore.posts.length) {
          setTimeout(() => {
            if (outboxStore.activeIndex < 0 || outboxStore.activeIndex >= outboxStore.posts.length) return;
            const panel = getOutboxPanel();
            if (panel.form) writeDraftFields(panel, outboxStore.posts[outboxStore.activeIndex]);
          }, 0);
        }
        return;
      }

      if (e.target.closest('.quick-reply-btn')) {
        waitForElement('#quick-reply', onQuickReply);
        return;
      }

      const postLink = e.target.closest('a.post_no');
      if (postLink && /^citeReply\(\d+\)$/.test(postLink.getAttribute('onclick') || '')) {
        outboxCiteOpening = !document.getElementById('quick-reply');
        waitForElement('#quick-reply', onQuickReply);
        return;
      }
    }, true);
  }

  function initializeOutboxMobile() {
    if (!postOutbox) return;
    if (!checkMobile() && !document.getElementById('mbReplyForm')) return;

    waitForElement('#mbReplyForm', (mbForm) => {
      if (mbForm.querySelector('#mb-outbox-container')) return;

      const embedInput = mbForm.querySelector('input[name="embed"]');
      const textarea = mbForm.querySelector('textarea[name="body"]');
      const container = document.createElement('div');
      container.id = 'mb-outbox-container';
      container.innerHTML = '<div id="mb-outbox-list"></div>';
      if (textarea) {
        textarea.insertAdjacentElement('afterend', container);
      } else if (embedInput) {
        embedInput.insertAdjacentElement('beforebegin', container);
      }

      const dfClearHL = document.getElementById('mbDFClearHL');
      const hlClear = dfClearHL && dfClearHL.parentElement;
      if (hlClear && hlClear.classList.contains('hl-clear') && !hlClear.querySelector('#mbDFOutboxBtn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'mbDFOutboxBtn';
        btn.className = 'outline';
        btn.style.flex = '0 1 0%';
        btn.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
        btn.title = 'Outbox';
        btn.setAttribute('aria-label', 'Outbox');
        hlClear.appendChild(btn);
      }

      renderDraftList();
    });
  }

  function initializeOutbox() {
    if (!postOutbox) return;
    bindOutboxEvents();
    initializeOutboxDesktop();
    initializeOutboxMobile();
    watchOutboxPosting();
    document.addEventListener('input', saveDraftField, true);
    document.addEventListener('change', saveDraftField, true);
  }

  function removePostedDraft(postId) {
    const index = postId
      ? outboxStore.posts.findIndex((post) => post._outboxId === postId)
      : outboxStore.activeIndex;
    if (index < 0 || index >= outboxStore.posts.length) return;

    removeOutboxDraft(index, (panel) => {
      if (panel.type === 'desktop' && !outboxRescueFields) {
        outboxRescueFields = true;
        $(document).one('new_post', () => {
          setTimeout(() => {
            outboxRescueFields = false;
            if (outboxStore.activeIndex >= 0 && outboxStore.activeIndex < outboxStore.posts.length) {
              const p = getOutboxPanel();
              if (p.form) writeDraftFields(p, outboxStore.posts[outboxStore.activeIndex]);
            }
          }, 0);
        });
      }
    });
  }

  function watchOutboxPosting() {
    let mobileAttempt = null;
    let desktopErrorObserver = null;

    function stopMobileAttempt(render = true) {
      if (!mobileAttempt) return;
      mobileAttempt.observer.disconnect();
      mobileAttempt = null;
      if (!outboxLocked) return;
      unlockOutbox();
      if (render) renderDraftList();
    }

    function hasMobileError(modal, mutations, wasInserted) {
      if (!modal || !modal.classList.contains('open')) return false;
      if (wasInserted) return true;
      const text = modal.querySelector('#mbErrorMessage')?.textContent || '';
      if (text !== mobileAttempt.errorText) return true;
      return mutations.some((mutation) => mutation.type === 'attributes'
        && mutation.target === modal && mutation.attributeName === 'class'
        && !(mutation.oldValue || '').split(/\s+/).includes('open'));
    }

    function startMobileAttempt(form) {
      if (mobileAttempt || !outboxStore.posts.length) return;
      const button = form.querySelector('#mbSend');
      if (!button) return;
      const modal = document.getElementById('mbErrorModal');
      mobileAttempt = {
        form,
        button,
        postId: outboxStore.posts[outboxStore.activeIndex]?._outboxId,
        wasDisabledAtSubmit: button.disabled,
        sawDisabled: false,
        staleOpenModal: !!modal?.classList.contains('open'),
        modal,
        errorText: modal?.querySelector('#mbErrorMessage')?.textContent || '',
        observer: null
      };
      lockOutbox();
      const attempt = mobileAttempt;
      attempt.observer = new MutationObserver((mutations) => {
        if (mobileAttempt !== attempt) return;
        const currentModal = document.getElementById('mbErrorModal');
        const insertedModal = currentModal !== attempt.modal || mutations.some((mutation) => mutation.type === 'childList'
          && Array.from(mutation.addedNodes).some((node) => node.nodeType === 1
            && (node.id === 'mbErrorModal' || node.querySelector?.('#mbErrorModal'))));
        if (currentModal && currentModal !== attempt.modal) {
          attempt.modal = currentModal;
          attempt.observer.observe(currentModal, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class']
          });
        }
        if (hasMobileError(currentModal, mutations, insertedModal)) {
          stopMobileAttempt();
          return;
        }
        const observedDisabled = mutations.some((mutation) => mutation.type === 'attributes'
          && mutation.target === attempt.button && mutation.attributeName === 'disabled'
          && mutation.oldValue !== null);
        if (!attempt.wasDisabledAtSubmit && (attempt.button.disabled || observedDisabled)) {
          attempt.sawDisabled = true;
        }
        if (!attempt.form.isConnected) {
          stopMobileAttempt();
          return;
        }
        if (attempt.sawDisabled && !attempt.button.disabled) {
          if (attempt.staleOpenModal && attempt.modal?.isConnected
            && attempt.modal.classList.contains('open')) {
            stopMobileAttempt();
            return;
          }
          const submittedPostId = attempt.postId;
          stopMobileAttempt(!submittedPostId);
          if (submittedPostId) removePostedDraft(submittedPostId);
          return;
        }
      });
      attempt.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      attempt.observer.observe(button, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['disabled']
      });
      if (modal) {
        attempt.observer.observe(modal, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ['class']
        });
      }
      setTimeout(() => {
        if (mobileAttempt !== attempt) return;
        if (!attempt.wasDisabledAtSubmit && attempt.button.disabled) attempt.sawDisabled = true;
        else if (!attempt.sawDisabled) stopMobileAttempt();
      }, 0);
    }

    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (!form || form.nodeType !== 1) return;
      if (!form.querySelector('#outbox-row, #mb-outbox-container')) return;
      if (form.id === 'mbReplyForm') startMobileAttempt(form);
      else {
        if (mobileAttempt) return;
        if (!outboxStore.posts.length) return;
        lockOutbox();
        if (!desktopErrorObserver) {
          desktopErrorObserver = new MutationObserver((mutations) => {
            const found = mutations.some((mutation) => mutation.type === 'childList'
              && Array.from(mutation.addedNodes).some((node) => node.nodeType === 1
                && (node.id === 'alert_handler'
                  ? node.querySelector('button.alert_button:not([id])')
                  : node.querySelector?.('#alert_handler button.alert_button:not([id])'))));
            if (!found) return;
            desktopErrorObserver.disconnect();
            desktopErrorObserver = null;
            unlockOutbox();
            renderDraftList();
          });
          desktopErrorObserver.observe(document.body, { childList: true, subtree: true });
        }
      }
    }, true);

    $(document).on('ajax_after_post', (e, post_response) => {
      if (!outboxLocked || mobileAttempt) return;
      desktopErrorObserver?.disconnect();
      desktopErrorObserver = null;
      unlockOutbox();
      if (post_response && !post_response.error) removePostedDraft();
      else renderDraftList();
    });
  }

  function initializeURLUpload() {
    if (!urlUpload) return;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const CONVERTIBLE_EXTS = new Set(['png', 'jpg', 'jpeg', 'webp']);
    const MAX_DIMENSION = 10000;
    const MAX_VARIANT_ATTEMPTS = 4;

    function tweetVideoRes(videoUrl) {
      try {
        const m = /\/(\d{2,5})x(\d{2,5})\//.exec(new URL(videoUrl, location.href).pathname);
        return m ? `${m[1]}×${m[2]}` : null;
      } catch (e) {
        return null;
      }
    }

    async function headContentLength(url) {
      try {
        const resp = await fetch(url, { method: 'HEAD', mode: 'cors' });
        if (resp.ok) {
          const len = Number(resp.headers.get('content-length'));
          if (Number.isFinite(len) && len > 0) return len;
        }
      } catch (e) {}
      if (gmRequest) {
        try {
          const len = await new Promise((resolve) => {
            gmRequest({
              method: 'HEAD',
              url,
              onload: (resp) => {
                const m = /content-length:\s*(\d+)/i.exec(resp.responseHeaders || '');
                resolve(m ? Number(m[1]) : 0);
              },
              onerror: () => resolve(0),
              ontimeout: () => resolve(0)
            });
          });
          if (len > 0) return len;
        } catch (e) {}
      }
      return null;
    }

    function notifyVideoDowngrade(orig, sel) {
      const line = (label, res, bytes) => `${label}: ${res ? res + ' - ' : ''}${(bytes / 1048576).toFixed(2)} MB`;
      showMessageNotification(
        `Video resolution was lowered to fit upload limits.<br><br>` +
        `${line('Original', orig.res, orig.size)}<br>` +
        `${line('Selected', sel.res, sel.size)}`
      );
    }

    async function pickTweetVideo(video, tryFetch) {
      const source = (video.formats && video.formats.length) ? video.formats : (video.variants || []);
      const candidates = source
      .filter(f => f.url && f.bitrate > 0 && (f.container === 'mp4' || f.content_type === 'video/mp4'))
      .sort((a, b) => b.bitrate - a.bitrate)
      .slice(0, MAX_VARIANT_ATTEMPTS);

      if (!candidates.length) return null;

      const sizes = [];
      let headOk = true;
      for (const cand of candidates) {
        const size = await headContentLength(cand.url);
        if (size === null) {
          headOk = false;
          break;
        }
        sizes.push(size);
        if (size <= MAX_FILE_SIZE) break;
      }

      if (headOk) {
        let idx = sizes.findIndex(s => s <= MAX_FILE_SIZE);
        if (idx === -1) idx = 0;
        const picked = await tryFetch(candidates[idx].url);
        if (idx > 0) {
          notifyVideoDowngrade(
            { res: tweetVideoRes(candidates[0].url), size: sizes[0] },
            { res: tweetVideoRes(candidates[idx].url), size: picked.blob.size }
          );
        }
        return picked;
      }

      let fallback = null;
      for (let i = 0; i < candidates.length; i++) {
        const res = await tryFetch(candidates[i].url);
        if (res.blob.size <= MAX_FILE_SIZE) {
          if (i > 0 && fallback) {
            notifyVideoDowngrade(
              { res: tweetVideoRes(candidates[0].url), size: fallback.blob.size },
              { res: tweetVideoRes(candidates[i].url), size: res.blob.size }
            );
          }
          return res;
        }
        if (i === 0) fallback = res;
      }
      return fallback;
    }

    async function fetchFile(url) {

      function httpStatusText(status) {
        const codes = {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not Found',
          408: 'Request Timeout',
          429: 'Too Many Requests',
          500: 'Internal Server Error',
          502: 'Bad Gateway',
          503: 'Service Unavailable',
          504: 'Gateway Timeout'
        };
        return codes[status] || 'Error';
      }

      async function fetchGM(url, headers) {
        if (!gmRequest) throw new Error('GM API not detected. Use a userscript manager for best compatibility.');

        return new Promise((resolve, reject) => {
          gmRequest({
            method: 'GET',
            url,
            headers,
            responseType: 'blob',
            onload: (resp) => {
              if (resp.status >= 200 && resp.status < 300 && resp.response) {
                resolve({ blob: resp.response, finalUrl: resp.finalUrl || resp.responseURL || url });
              } else {
                reject(new Error(`HTTP ${resp.status} (${httpStatusText(resp.status)})`));
              }
            },
            onerror: () => reject(new Error('HTTP network error')),
            ontimeout: () => reject(new Error('HTTP request timed out'))
          });
        });
      }

      async function tryFetch(url, yt = false, headers = null) {
        try {
          if (headers) return await fetchGM(url, headers);
          const resp = await fetch(url, { mode: 'cors' });
          if (!resp.ok) throw new Error(`HTTP ${resp.status} (${httpStatusText(resp.status)})`);
          const blob = await resp.blob();
          return { blob, finalUrl: resp.url || url };
        } catch (e) {
          try {
            return await fetchGM(url, headers);
          } catch (gmErr) {
            if (yt && /maxresdefault/.test(url) && (/HTTP 404/.test(e.message) || /HTTP 404/.test(gmErr.message))) {
              return tryFetch(url.replace('maxresdefault', 'hqdefault'), true);
            }

            if (!gmRequest) throw new Error(`${e.message}<br>${gmErr.message}`);
            throw gmErr;
          }
        }
      }

      const ytMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
      );
      const isYouTube = !!ytMatch;
      if (isYouTube) {
        const id = ytMatch[1];
        url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      }

      let ytTitle = null;
      if (isYouTube && formatFilenames) {
        try {
          const data = await fetchJsonViaGM(
            `https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D${ytMatch[1]}&format=json`
          );
          ytTitle = getOembedTitle(data);
        } catch (e) {}
      }

      let tweetData = null;
      const tweetMatch = url.match(TWEET_LINK_RE);
      if (tweetMatch) {
        try {
          tweetData = await fetchTweetData(encodeURIComponent(tweetMatch[1]) + '/status/' + tweetMatch[2]);
        } catch (e) {
          tweetData = null;
        }
      }

      let bskyData = null;
      const bskyMatch = url.match(BSKY_LINK_RE);
      if (bskyMatch) {
        let post;
        try {
          const resp = await fetch(
            BSKY_API_PREFIX + encodeURIComponent(`at://${bskyMatch[1]}/app.bsky.feed.post/${bskyMatch[2]}`) + '&depth=0',
            { credentials: 'omit' }
          );
          if (!resp.ok) {
            let msg = 'HTTP ' + resp.status;
            try {
              const err = await resp.json();
              if (err && err.message) msg += ' - ' + err.message;
            } catch (e) {}
            throw new Error(msg);
          }
          const data = await resp.json();
          post = data && data.thread && data.thread.post;
          if (!post || !post.author) throw new Error('Invalid API response');
        } catch (e) {
          throw new Error('Bluesky post lookup failed: ' + e.message);
        }
        let embed = post.record && post.record.embed;
        if (embed && embed.$type === 'app.bsky.embed.recordWithMedia') embed = embed.media;
        const did = post.author.did;
        let media = null;
        if (embed && embed.$type === 'app.bsky.embed.images' && embed.images && embed.images.length) {
          const imageBlob = embed.images[0].image;
          if (imageBlob && imageBlob.ref && imageBlob.ref.$link) {
            media = { kind: 'image', did, cid: imageBlob.ref.$link, mimeType: imageBlob.mimeType || '' };
          }
        }
        if (!media && embed && embed.$type === 'app.bsky.embed.video' && embed.video && embed.video.ref && embed.video.ref.$link) {
          media = { kind: 'video', did, cid: embed.video.ref.$link, mimeType: embed.video.mimeType || 'video/mp4' };
        }
        if (!media) throw new Error('No media in this Bluesky post');
        bskyData = { handle: post.author.handle, rkey: bskyMatch[2], media };
      }

      let pixivData = null;
      const pixivMatch = url.match(PIXIV_LINK_RE);
      if (pixivMatch) {
        let pixivJson;
        try {
          pixivJson = await fetchJsonViaGM(PIXIV_API_PREFIX + encodeURIComponent(pixivMatch[1]));
        } catch (e) {
          throw new Error('Pixiv work lookup failed: ' + e.message);
        }
        const pixivBody = pixivJson && pixivJson.body;
        if (!pixivJson || pixivJson.error || !pixivBody || !pixivBody.urls || !pixivBody.urls.original) {
          throw new Error('Pixiv work lookup failed: ' + ((pixivJson && pixivJson.message) || 'work not found'));
        }
        pixivData = pixivBody;
        url = pixivData.urls.original;
      }
      const pximgHeaders = PXIMG_LINK_RE.test(url) ? { Referer: PIXIV_REFERER } : null;

      let tweetResult = null;
      if (tweetData) {
        const videos = tweetData.media && tweetData.media.videos;
        if (videos && videos.length) {
          try {
            tweetResult = await pickTweetVideo(videos[0], tryFetch);
          } catch (e) {
            tweetResult = null;
          }
        }
        if (!tweetResult) {
          const photos = tweetData.media && tweetData.media.photos;
          if (photos && photos.length && photos[0].url) {
            url = photos[0].url;
          }
        }
      }

      let bskyResult = null;
      if (bskyData) {
        const m = bskyData.media;
        if (m.kind === 'image') {
          const suffix = m.mimeType === 'image/png' ? '@png' : '@jpeg';
          bskyResult = await tryFetch(`https://cdn.bsky.app/img/feed_fullsize/plain/${encodeURIComponent(m.did)}/${encodeURIComponent(m.cid)}${suffix}`);
        } else {
          let pdsHost = 'https://bsky.social';
          try {
            const docUrl = m.did.startsWith('did:web:')
              ? 'https://' + decodeURIComponent(m.did.slice(8)) + '/.well-known/did.json'
              : 'https://plc.directory/' + encodeURIComponent(m.did);
            const docResp = await fetch(docUrl, { credentials: 'omit' });
            if (docResp.ok) {
              const doc = await docResp.json();
              const service = (doc.service || []).find(
                (s) => s.type === 'AtprotoPersonalDataServer' || s.id === '#atproto_pds'
              );
              if (typeof service?.serviceEndpoint === 'string' && service.serviceEndpoint.startsWith('https://')) {
                pdsHost = service.serviceEndpoint.replace(/\/+$/, '');
              }
            }
          } catch (e) {}
          const blobUrl = `${pdsHost}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(m.did)}&cid=${encodeURIComponent(m.cid)}`;
          const fetched = await tryFetch(blobUrl);
          if (m.mimeType && (!fetched.blob.type || fetched.blob.type === 'application/octet-stream')) {
            bskyResult = { blob: new Blob([fetched.blob], { type: m.mimeType }), finalUrl: fetched.finalUrl };
          } else {
            bskyResult = fetched;
          }
        }
      }

      let blob, finalUrl;
      if (bskyResult) {
        blob = bskyResult.blob;
        finalUrl = bskyResult.finalUrl;
      } else if (tweetResult) {
        blob = tweetResult.blob;
        finalUrl = tweetResult.finalUrl;
      } else {
        url = url.replace(
          /^https?:\/\/(?:\w+\.)?(?:twitter|x)\.com\//i,
          'https://d.fxtwitter.com/'
        );
        const fetched = await tryFetch(url, isYouTube, pximgHeaders);
        blob = fetched.blob;
        finalUrl = fetched.finalUrl || url;
      }

      if (blob.type && /^text\/html/i.test(blob.type)) {
        throw new Error('Unsupported link or not a direct media URL');
      }

      let filename = 'file';
      if (bskyData) {
        filename = bskyData.media.cid;
      } else {
        try {
          const p = new URL(finalUrl, location.href).pathname;
          const parts = p.split('/');
          const last = parts.pop() || parts.pop();
          if (last) filename = decodeURIComponent(last);
        } catch (e) {}
      }

      if (!/\.[a-z0-9]+$/i.test(filename) && blob.type) {
        const raw = blob.type.split('/')[1] || '';
        const ext = raw === 'jpeg' ? 'jpg' : raw;
        if (ext) filename += '.' + ext;
      }

      if (formatFilenames && bskyData) {
        const extMatch = filename.match(/\.[a-z0-9]+$/i);
        filename = `@${bskyData.handle}-bsky-${bskyData.rkey}-0${extMatch ? extMatch[0] : ''}`;
      } else if (formatFilenames && tweetData && tweetData.author && tweetData.author.screen_name && tweetData.id) {
        const extMatch = filename.match(/\.[a-z0-9]+$/i);
        filename = `@${tweetData.author.screen_name}-${tweetData.id}${extMatch ? extMatch[0] : ''}`;
      } else if (formatFilenames && pixivData) {
        const pixivId = String(pixivData.id);
        const suffix = filename.startsWith(pixivId) ? filename.slice(pixivId.length) : filename;
        const pixivName = sanitizeFilenamePart(pixivData.userName || pixivData.userAccount || '') || pixivId;
        filename = `@${pixivName}-pixiv-${pixivId}${suffix}`;
      } else if (formatFilenames && ytTitle) {
        const extMatch = filename.match(/\.[a-z0-9]+$/i);
        const ytExt = extMatch ? extMatch[0] : '.jpg';
        let base = sanitizeFilenamePart(ytTitle);
        const maxBase = 255 - ytExt.length;
        if (base.length > maxBase) {
          base = base.slice(0, maxBase);
          if (/[\uD800-\uDBFF]$/.test(base)) base = base.slice(0, -1);
        }
        base = base.replace(/[. ]+$/, '');
        if (base) filename = base + ytExt;
      }

      return new File([blob], filename, { type: blob.type || 'application/octet-stream' });
    }

    function showUrlAlert(callback) {
      const alert = $(`
        <div id="alert_handler">
          <div id="alert_background"></div>
          <div id="alert_div" style="max-width:90%;">
            <a id="url_info" href="javascript:void(0)" style="position:absolute;top:2px;right:25px;font-size:18px;z-index:100;">
              <i class="fa fa-info-circle" style="cursor:pointer;opacity:0.8;"></i>
            </a>
            <div id="url-upload-info" style="display:none;font-size:0.75em;opacity:0.75;position:inherit;top:5px;">
              YouTube links fetch the video thumbnail. Twitter/Bsky/pixiv fetch the first available media.
            </div>
            <a id="alert_close" href="javascript:void(0)">
              <i class="fa fa-times"></i>
            </a>
            <form id="url_form" style="margin-bottom:0;">
              <div id="alert_message">
                <strong><i class="fa fa-external-link"></i> URL Upload</strong><br><br>
                Enter a URL:<br><br>
                <input type="text" id="url_input_field" style="width:100%;box-sizing:border-box;padding:6px;">
              </div>
              <div style="margin:0 13px;display:flex;justify-content:flex-end;gap:.2rem;">
                <button type="submit" class="button alert_button" id="urlOk">Upload</button>
                <button type="button" class="button alert_button" id="urlCancel">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `);

      $('body').append(alert);

      $('#url_info').on('click', function (e) {
        e.preventDefault();
        const $icon = $(this).find('.fa-info-circle');
        const $info = $('#url-upload-info');
        const willShow = $info.is(':hidden');
        $info.slideToggle(150);
        $icon.css('opacity', willShow ? 0.6 : 0.8);
      });

      const urlField = $('#url_input_field');
      urlField.focus();

      $('#url_form').on('submit', function (e) {
        e.preventDefault();
        const url = urlField.val().trim();
        $('#alert_handler').remove();
        callback(url || null);
      });

      $('#urlCancel, #alert_close, #alert_background').on('click', function () {
        $('#alert_handler').remove();
        callback(null);
      });

      urlField.on('keydown', function (e) {
        if (e.key === 'Escape') {
          $('#alert_handler').remove();
          callback(null);
        }
      });
    }

    function createURLButton(noMargin = false) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'outline url-upload';
      btn.textContent = 'URL';
      if (!noMargin) {
        btn.style.marginLeft = '2px';
        btn.style.marginRight = '2px';
        btn.style.padding = '0 2px';
      }
      return btn;
    }

    if (!document.querySelector('.url-upload')) {
      const uploadTd = document.querySelector('#upload_settings td');
      const filenameRow = document.getElementById('upload_filename');

      if (filenameRow && uploadTd) {
        const td = filenameRow.querySelector('td');
        const filenameInput = td && td.querySelector('input[name="filename"]');
        if (td && filenameInput && !td.querySelector('.url-upload')) {
          let wrapper = td.querySelector('.upload-filename-wrapper');
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'upload-filename-wrapper';
            wrapper.style.display = 'flex';
            filenameInput.style.flex = '1 1 auto';
            td.appendChild(wrapper);
            wrapper.appendChild(filenameInput);
          }
          const btn = createURLButton(false);
          wrapper.appendChild(btn);
        } else if (uploadTd && !uploadTd.querySelector('.url-upload')) {
          const btn = createURLButton(false);
          btn.style.float = 'right';
          uploadTd.appendChild(btn);
        }
      } else if (uploadTd && !uploadTd.querySelector('.url-upload')) {
        const btn = createURLButton(false);
        btn.style.float = 'right';
        uploadTd.appendChild(btn);
      }
    }

    if (checkMobile()) {
      waitForElement('#mbReplyForm', (mbForm) => {
        const mbSend = mbForm.querySelector('#mbSend');
        const existing = mbForm.querySelector('.url-upload');

        if (!existing && mbSend) {
          const btn = createURLButton(true);
          mbSend.parentNode.insertBefore(btn, mbSend);
          mobileURLBtn = true;
        } else if (existing) {
          mobileURLBtn = true;
        }
      });
    }

    document.addEventListener('click', async (ev) => {
      const btn = ev.target.closest && ev.target.closest('.url-upload');
      if (!btn) return;
      ev.preventDefault();

      const container = btn.closest('form') || btn.closest('.dropzone-wrap') || document.getElementById('mbReplyForm') || document.querySelector('#upload_settings td') || document.body;

      showUrlAlert(async (url) => {
        if (!url) return;

        const uploadPostId = captureDraftId(undefined, container);
        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = 'Fetching…';

        try {
          let file = await fetchFile(url);
          file = await checkImageConversion(file, container);

          if (!attachDraftFile(file, container, uploadPostId)) {
            alert('Could not add file to uploader.');
          }
        } catch (e) {
          alert('Failed to fetch file: ' + (e.message || e));
        } finally {
          btn.disabled = false;
          btn.textContent = oldText;
        }
      });
    });
  }

  const wpaintBaseUrl = 'https://cdn.jsdelivr.net/gh/vichan-devel/wPaint@f11220032e7edb8349516d3751d3aaee0fd0de68/';
  const wpaintWidth = parseInt(window.tb_settings?.wpaint?.width, 10) || 500;
  const wpaintHeight = parseInt(window.tb_settings?.wpaint?.height, 10) || 250;

  let wpaintLoadState = 'idle';
  const wpaintLoadQueue = [];
  let oekakiPanel = null;
  let oekakiAttachForm = null;
  let oekakiLoadListener = null;
  let oekakiZoomRef = null;
  let oekakiDisplayScale = 1;

  function loadWPaint(onReady, onFail) {
    if (typeof $ === 'undefined') {
      if (onFail) onFail();
      return;
    }
    if (wpaintLoadState === 'ready' && $.fn.wPaint) {
      onReady();
      return;
    }
    if (wpaintLoadState === 'failed') {
      showMessageNotification('Oekaki drawing library failed to load', { single: 'wpaint-load' });
      if (onFail) onFail();
      return;
    }

    wpaintLoadQueue.push({ ready: onReady, fail: onFail });
    if (wpaintLoadState === 'loading') return;
    wpaintLoadState = 'loading';

    function notifyQueue(state) {
      const queue = wpaintLoadQueue.splice(0);
      for (let i = 0; i < queue.length; i++) {
        const fn = state === 'ready' ? queue[i].ready : queue[i].fail;
        if (fn) {
          try { fn(); } catch (e) {}
        }
      }
    }

    function failLoad(detail) {
      if (wpaintLoadState === 'failed') return;
      wpaintLoadState = 'failed';
      notifyQueue('fail');
      showMessageNotification('Could not load the oekaki drawing library' + (detail ? ' (' + detail + ')' : ''), { single: 'wpaint-load' });
    }

    function finishLoad() {
      if (typeof $ === 'undefined' || !$.fn.wPaint) {
        failLoad('library missing');
        return;
      }
      $.extend($.fn.wPaint.defaults, {
        mode: 'pencil',
        lineWidth: '1',
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000'
      });
      if ($.fn.wPaint.menus && $.fn.wPaint.menus.main && $.fn.wPaint.menus.main.items) {
        delete $.fn.wPaint.menus.main.items.save;
      }
      try {
        const menus = $.fn.wPaint.menus || {};
        for (const menuName in menus) {
          const items = menus[menuName] && menus[menuName].items;
          if (!items) continue;
          for (const itemName in items) {
            if (items[itemName] && items[itemName].keybind !== undefined) delete items[itemName].keybind;
          }
        }
      } catch (e) {}
      wpaintLoadState = 'ready';
      notifyQueue('ready');
    }

    function loadScript(url, next) {
      const el = document.createElement('script');
      el.src = url;
      el.onload = () => next();
      el.onerror = () => {
        if (!gmRequest) {
          failLoad('script blocked');
          return;
        }
        gmRequest({
          method: 'GET',
          url,
          responseType: 'text',
          onload: (resp) => {
            if (resp.status >= 200 && resp.status < 300 && resp.responseText) {
              try {
                const scriptEl = document.createElement('script');
                scriptEl.textContent = resp.responseText;
                document.head.appendChild(scriptEl);
                next();
              } catch (e) {
                failLoad(e.message || 'script error');
              }
            } else {
              failLoad('HTTP ' + resp.status);
            }
          },
          onerror: () => failLoad('script fetch failed'),
          ontimeout: () => failLoad('script fetch timed out')
        });
      };
      document.head.appendChild(el);
    }

    function loadStyle(url) {
      const el = document.createElement('link');
      el.rel = 'stylesheet';
      el.href = url;
      el.onerror = () => {
        if (!gmRequest) return;
        gmRequest({
          method: 'GET',
          url,
          responseType: 'text',
          onload: (resp) => {
            if (resp.status >= 200 && resp.status < 300 && resp.responseText) {
              const style = document.createElement('style');
              style.textContent = resp.responseText;
              document.head.appendChild(style);
            }
          }
        });
      };
      document.head.appendChild(el);
    }

    loadStyle(wpaintBaseUrl + 'wPaint.min.css');
    loadStyle(wpaintBaseUrl + 'lib/wColorPicker.min.css');
    loadStyle('/stylesheets/jquery-ui/core.css');
    loadStyle('/stylesheets/jquery-ui/resizable.css');
    loadStyle('/stylesheets/jquery-ui/theme.css');

    if (typeof _ === 'undefined') {
      loadScript(wpaintBaseUrl + 'lib/gettext.js', () => {
        loadScript(wpaintBaseUrl + '8ch.js', finishLoad);
      });
    } else {
      loadScript(wpaintBaseUrl + '8ch.js', finishLoad);
    }
  }

  function oekakiClearBodyCursor() {
    setTimeout(() => {
      document.body.style.removeProperty('cursor');
    }, 0);
  }

  function oekakiClosePanel() {
    if (!oekakiPanel) return;
    oekakiPanel.hidden = true;
    oekakiCancelLoad();
    oekakiZoomRef = null;
    oekakiDisplayScale = 1;
    const range = oekakiPanel.querySelector('.ts-oekaki-zoom-range');
    if (range) range.value = '100';
    oekakiPanel.querySelectorAll('.wPaint-menu').forEach((m) => m.remove());
    const ctr = oekakiPanel.querySelector('.ts-oekaki-ctr');
    if (ctr) {
      const fresh = document.createElement('div');
      fresh.className = 'ts-oekaki-ctr';
      fresh.innerHTML = '<div class="ts-oekaki-div"></div>';
      ctr.parentNode.replaceChild(fresh, ctr);
    }
  }

  function oekakiCreatePanel() {
    if (oekakiPanel) return oekakiPanel;

    const panel = document.createElement('div');
    panel.className = 'ts-oekaki-panel';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="ts-oekaki-panel-header">' +
      '<span class="ts-oekaki-panel-title">Oekaki</span>' +
      '<button type="button" class="ts-oekaki-close" title="Close">&times;</button>' +
      '</div>' +
      '<div class="ts-oekaki-ctr"><div class="ts-oekaki-div"></div></div>' +
      '<div class="ts-oekaki-controls">' +
      '<span class="ts-oekaki-zoom" title="Zoom">' +
      '<i class="fa fa-search-plus" title="Toggle full size / fit to screen"></i>' +
      '<input type="range" class="ts-oekaki-zoom-range" min="5" max="200" step="1" value="100">' +
      '</span>' +
      '<button type="button" class="outline ts-oekaki-load" title="Load the attached image onto the canvas">Load File</button>' +
      '<button type="button" class="outline ts-oekaki-save">Attach</button>' +
      '</div>';
    document.body.appendChild(panel);

    const zoomRange = panel.querySelector('.ts-oekaki-zoom-range');
    if (zoomRange) {
      zoomRange.addEventListener('input', () => {
        oekakiSetZoom(parseInt(zoomRange.value, 10));
      });
    }
    const zoomIcon = panel.querySelector('.ts-oekaki-zoom i');
    if (zoomIcon) {
      zoomIcon.addEventListener('click', () => {
        if (!zoomRange || !oekakiZoomRef) return;
        const cur = parseInt(zoomRange.value, 10) || 100;
        let target;
        if (cur === 100) {
          const rect = panel.getBoundingClientRect();
          const availW = Math.max(80, window.innerWidth - rect.left - 75);
          const availH = Math.max(80, window.innerHeight - rect.top - 130);
          const scale = Math.min(1, availW / (oekakiZoomRef.w + 5), availH / (oekakiZoomRef.h + 5));
          target = Math.max(5, Math.min(200, Math.floor(scale * 100)));
        } else {
          target = 100;
        }
        zoomRange.value = String(target);
        oekakiSetZoom(target);
      });
    }

    if ($.fn.draggable) {
      $(panel).draggable({
        handle: '.ts-oekaki-panel-header',
        containment: 'window',
        scroll: false,
        stop: oekakiClearBodyCursor
      });
    }

    oekakiPanel = panel;
    return panel;
  }

  function oekakiCancelLoad() {
    if (oekakiLoadListener) {
      document.removeEventListener('click', oekakiLoadListener, true);
      oekakiLoadListener = null;
    }
  }

  function oekakiSnapshotCanvas(canvas) {
    if (!canvas || !canvas.width || !canvas.height) return null;
    try {
      const clone = document.createElement('canvas');
      clone.width = canvas.width;
      clone.height = canvas.height;
      clone.getContext('2d').drawImage(canvas, 0, 0);
      return clone;
    } catch (e) {
      return null;
    }
  }

  function oekakiRestoreScaled(snap, ctx, w, h) {
    if (!snap || !ctx) return;
    try {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(snap, 0, 0, w, h);
    } catch (e) {}
  }

  function oekakiApplyDisplayScale(paint, scale) {
    oekakiDisplayScale = scale;
    if (!paint) return;
    const fit = (c) => {
      if (!c) return;
      if (scale === 1) {
        c.style.width = '';
        c.style.height = '';
      } else {
        c.style.width = (c.width * scale) + 'px';
        c.style.height = (c.height * scale) + 'px';
      }
    };
    fit(paint.canvasBg);
    fit(paint.canvas);
    fit(paint.canvasTemp);
  }

  function oekakiSizeViewport(w, h) {
    const panel = oekakiPanel;
    const ctr = panel && panel.querySelector('.ts-oekaki-ctr');
    const div = panel && panel.querySelector('.ts-oekaki-div');
    if (!ctr || !div) return null;
    const rect = panel.getBoundingClientRect();
    const availW = Math.max(80, window.innerWidth - rect.left - 75);
    const availH = Math.max(80, window.innerHeight - rect.top - 130);
    const visW = Math.min(w, availW);
    const visH = Math.min(h, availH);
    $(div).width(w).height(h);
    $(ctr).width(visW + 5).height(visH + 5);
    const big = w > visW + 1 || h > visH + 1;
    ctr.style.overflow = big ? 'auto' : 'hidden';
    if ($.fn.resizable && $(ctr).hasClass('ui-resizable')) {
      $(ctr).resizable('option', { minWidth: visW + 5, minHeight: visH + 5 });
    }
    const r2 = panel.getBoundingClientRect();
    if (r2.right > window.innerWidth) panel.style.left = Math.max(0, window.innerWidth - panel.offsetWidth - 12) + 'px';
    if (r2.bottom > window.innerHeight) panel.style.top = Math.max(0, window.innerHeight - panel.offsetHeight - 12) + 'px';
    oekakiSyncMenuLayout();
    return { w: w, h: h, big: big };
  }

  function oekakiResizeCanvas(contentW, contentH, skipFg) {
    const panel = oekakiPanel;
    const ctr = panel && panel.querySelector('.ts-oekaki-ctr');
    const div = panel && panel.querySelector('.ts-oekaki-div');
    if (!ctr || !div || typeof $ === 'undefined') return null;
    const paint = $.data(div, 'wPaint');
    if (!paint) return null;

    contentW = parseInt(contentW, 10) || 0;
    contentH = parseInt(contentH, 10) || 0;
    if (contentW < 1 || contentH < 1) return null;

    const maxSide = 4096;
    const maxArea = 16777216;
    let scale = 1;
    if (contentW > maxSide) scale = Math.min(scale, maxSide / contentW);
    if (contentH > maxSide) scale = Math.min(scale, maxSide / contentH);
    if (contentW * contentH * scale * scale > maxArea) {
      scale = Math.min(scale, Math.sqrt(maxArea / (contentW * contentH)));
    }
    if (scale < 1) {
      contentW = Math.max(1, Math.round(contentW * scale));
      contentH = Math.max(1, Math.round(contentH * scale));
    }

    const bgSnap = oekakiSnapshotCanvas(paint.canvasBg);
    const fgSnap = skipFg ? null : oekakiSnapshotCanvas(paint.canvas);

    $(div).width(contentW).height(contentH);

    paint.ctxBgResize = true;
    paint.ctxResize = true;
    paint.resize();

    oekakiRestoreScaled(bgSnap, paint.ctxBg, contentW, contentH);
    if (!skipFg) oekakiRestoreScaled(fgSnap, paint.ctx, contentW, contentH);
    paint.ctxBgResize = false;
    paint.ctxResize = false;
    oekakiApplyDisplayScale(paint, 1);

    return oekakiSizeViewport(contentW, contentH);
  }

  function oekakiSetZoom(pct) {
    const ref = oekakiZoomRef;
    if (!ref || !isFinite(pct)) return;
    pct = Math.min(200, Math.max(5, pct));
    const panel = oekakiPanel;
    const div = panel && panel.querySelector('.ts-oekaki-div');
    const paint = (typeof $ !== 'undefined' && div) ? $.data(div, 'wPaint') : null;
    if (!paint) return;
    oekakiApplyDisplayScale(paint, pct / 100);
    oekakiSizeViewport(
      Math.max(1, Math.round(ref.w * pct / 100)),
      Math.max(1, Math.round(ref.h * pct / 100))
    );
  }

  function oekakiFitToImage(imgW, imgH) {
    const panel = oekakiPanel;
    const ctr = panel && panel.querySelector('.ts-oekaki-ctr');
    const div = panel && panel.querySelector('.ts-oekaki-div');
    if (!ctr || !div || typeof $ === 'undefined') return;
    const paint = $.data(div, 'wPaint');
    if (!paint) return;

    imgW = parseInt(imgW, 10) || 0;
    imgH = parseInt(imgH, 10) || 0;
    if (imgW < 1 || imgH < 1) return;

    const rect = panel.getBoundingClientRect();
    const availW = Math.max(80, window.innerWidth - rect.left - 75);
    const availH = Math.max(80, window.innerHeight - rect.top - 130);
    const scale = Math.min(1, availW / (imgW + 5), availH / (imgH + 5));
    const w = Math.max(200, Math.round(imgW * scale));
    const h = Math.max(50, Math.round(imgH * scale));

    const final = oekakiResizeCanvas(w, h, true);
    if (final) {
      oekakiZoomRef = final;
      const range = panel.querySelector('.ts-oekaki-zoom-range');
      if (range) range.value = '100';
    }
  }

  function oekakiSyncMenuLayout() {
    if (typeof $ === 'undefined') return;
    const panel = oekakiPanel;
    if (!panel) return;
    const menu = $(panel).find('.wPaint-menu').first();
    if (!menu.length) return;
    const ctr = panel.querySelector('.ts-oekaki-ctr');
    if (!ctr) return;
    const mh = Math.round(menu.outerHeight() || 0);
    const prev = menu.data('tsWrapH') || 0;
    if (mh > 50) {
      if (mh === prev) return;
      menu.data('tsWrapH', mh);
      $(ctr).css('padding-top', mh + 2);
      menu.css('top', (ctr.offsetTop + 2) + 'px');
    } else if (prev) {
      menu.data('tsWrapH', 0);
      $(ctr).css('padding-top', 48);
      menu.css('top', (ctr.offsetTop + 2) + 'px');
    }
  }

  function oekakiLoadImg(isFg) {
    const paint = this;
    oekakiCancelLoad();
    showMessageNotification(
      isFg
        ? 'Click an image on this page to load it as the canvas foreground'
        : 'Click an image on this page to load it as the canvas background',
      { timeout: 4000 }
    );
    const onClick = (e) => {
      const target = e.target;
      if (!target.closest) return;
      if (target.closest('.wPaint-menu, .wPaint-modal')) return;
      const img = target.closest('img');
      if (!img) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      document.removeEventListener('click', onClick, true);
      oekakiLoadListener = null;
      const url = img.src;
      if (!isFg) {
        try { paint.setBg(url); } catch (err) {}
        return;
      }
      const probe = new Image();
      probe.onload = () => {
        oekakiFitToImage(probe.naturalWidth, probe.naturalHeight);
        try { paint.setImage(url, '', false); } catch (e) {}
      };
      probe.onerror = () => {
        try { paint.setImage(url, '', false); } catch (e) {}
      };
      probe.src = url;
    };
    oekakiLoadListener = onClick;
    document.addEventListener('click', onClick, true);
  }

  function oekakiAttachedImageSource() {
    const containers = document.querySelectorAll('.file-thumbs .tmb-container');
    let firstFile = null;
    for (const c of containers) {
      let file = null;
      try { file = (typeof $ !== 'undefined') ? $(c).data('file-ref') : null; } catch (e) {}
      if (!file || typeof file.type !== 'string') continue;
      if (file.type.indexOf('image/') === 0) return file;
      if (!firstFile) firstFile = file;
    }
    if (firstFile) return firstFile;
    for (const c of containers) {
      const tmb = c.querySelector('.file-tmb');
      const bg = tmb && tmb.style ? tmb.style.backgroundImage : '';
      const m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
      if (m && m[1]) return m[1];
    }
    const form = (oekakiAttachForm && oekakiAttachForm.isConnected)
      ? oekakiAttachForm
      : document.querySelector('form[name="post"]:not(#quick-reply)');
    const input = form && form.querySelector('input[type="file"]');
    if (input && input.files && input.files[0]) return input.files[0];
    return null;
  }

  function oekakiApplyImageFull(paint, url) {
    const probe = new Image();
    const apply = (w, h) => {
      const final = oekakiResizeCanvas(w, h, true);
      if (final) {
        oekakiZoomRef = final;
        const range = oekakiPanel && oekakiPanel.querySelector('.ts-oekaki-zoom-range');
        if (range) range.value = '100';
      }
      try { paint.setImage(url, '', false); } catch (e) {}
    };
    probe.onload = () => apply(probe.naturalWidth || wpaintWidth, probe.naturalHeight || wpaintHeight);
    probe.onerror = () => apply(wpaintWidth, wpaintHeight);
    probe.src = url;
  }

  function oekakiInitCanvas() {
    const panel = oekakiPanel;
    const ctr = panel && panel.querySelector('.ts-oekaki-ctr');
    const div = panel && panel.querySelector('.ts-oekaki-div');
    if (!ctr || !div || typeof $ === 'undefined') return;
    if ($.data(div, 'wPaint')) return;

    const placeholder = ctr.querySelector('.ts-oekaki-placeholder');
    if (placeholder) placeholder.remove();

    div.innerHTML = '';

    const cw = Math.max(200, Math.min(wpaintWidth, window.innerWidth - 60));
    $(ctr).removeClass('ui-resizable ui-resizable-resizing ui-resizable-enabled');
    $(ctr).find('.ui-resizable-handle').remove();
    $(div).width(cw).height(wpaintHeight).css('position', 'relative');
    $(ctr).width(cw + 5).height(wpaintHeight + 5).css({ 'padding-top': 48, position: 'relative' });

    try {
      $(div).wPaint({
        path: wpaintBaseUrl,
        menuOffsetTop: -46,
        bg: '#ffffff',
        loadImgFg: function () { oekakiLoadImg.call(this, true); },
        loadImgBg: function () { oekakiLoadImg.call(this, false); }
      });
    } catch (e) {
      showMessageNotification('Could not start the oekaki canvas');
      oekakiClosePanel();
      return;
    }

    try {
      const paint = $.data(div, 'wPaint');
      const shapeCall = paint && paint._callShapeFunc;
      if (typeof shapeCall === 'function') {
        paint._callShapeFunc = function (e) {
          const sc = oekakiDisplayScale;
          if (sc !== 1 && e && isFinite(e.pageX) && isFinite(e.pageY)) {
            try {
              const off = this.$canvas.offset();
              const nx = off.left + (e.pageX - off.left) / sc;
              const ny = off.top + (e.pageY - off.top) / sc;
              try {
                e.pageX = nx;
                e.pageY = ny;
              } catch (err) {
                Object.defineProperty(e, 'pageX', { value: nx, configurable: true, writable: true });
                Object.defineProperty(e, 'pageY', { value: ny, configurable: true, writable: true });
              }
            } catch (err) {}
          }
          const lw = this.options && this.options.lineWidth;
          const scaleLw = sc !== 1 && typeof lw === 'number' && lw > 0;
          if (scaleLw) this.options.lineWidth = lw / sc;
          let ret;
          try {
            ret = shapeCall.apply(this, arguments);
          } finally {
            if (scaleLw) this.options.lineWidth = lw;
          }
          const tmp = this.canvasTemp;
          if (sc !== 1 && tmp && tmp.style && e && e.left !== undefined && tmp.style.left) {
            tmp.style.left = (e.left * sc) + 'px';
            if (e.top !== undefined) tmp.style.top = (e.top * sc) + 'px';
            tmp.style.width = (tmp.width * sc) + 'px';
            tmp.style.height = (tmp.height * sc) + 'px';
          }
          return ret;
        };
      }
    } catch (e) {}

    panel.querySelectorAll('.wPaint-menu').forEach((m) => {
      const visible = !!(m.offsetWidth || m.offsetHeight || m.getClientRects().length);
      const mRect = m.getBoundingClientRect();
      const pRect = panel.getBoundingClientRect();
      panel.appendChild(m);
      if (visible) {
        m.style.top = (ctr.offsetTop + 2) + 'px';
        m.style.left = Math.round(mRect.left - pRect.left - (parseFloat(window.getComputedStyle(ctr).paddingLeft) || 0)) + 'px';
      }
    });
    const wanted = div.className.match(/\bwPaint-theme-\S+/g) || [];
    const have = panel.className.match(/\bwPaint-theme-\S+/g) || [];
    wanted.forEach((c) => panel.classList.add(c));
    have.forEach((c) => { if (wanted.indexOf(c) === -1) panel.classList.remove(c); });
    oekakiZoomRef = { w: cw, h: wpaintHeight };

    try { $(panel).find('.wPaint-menu').draggable('option', 'scroll', false); } catch (e) {}
    $(panel).find('.wPaint-menu').on('dragstop', oekakiClearBodyCursor);

    const header = panel.querySelector('.ts-oekaki-panel-header');
    if (header && $.fn.bindMobileEvents && !$(header).data('tsTouchBound')) {
      $(header).bindMobileEvents();
      $(header).data('tsTouchBound', true);
    }

    if ($.fn.resizable) {
      $(ctr).resizable({
        alsoResize: div,
        minWidth: cw + 5,
        minHeight: wpaintHeight + 5,
        stop: () => {
          $(div).wPaint('resize');
          oekakiApplyDisplayScale($.data(div, 'wPaint'), 1);
          oekakiZoomRef = { w: Math.round($(div).width()), h: Math.round($(div).height()) };
          const range = panel.querySelector('.ts-oekaki-zoom-range');
          if (range) range.value = '100';
          oekakiClearBodyCursor();
          oekakiSyncMenuLayout();
        }
      });
      $(ctr).find('.ui-resizable-se').css({ height: '12px', width: '12px' });
      if ($.fn.bindMobileEvents) $(ctr).find('.ui-resizable-handle').bindMobileEvents();
    }

    oekakiSyncMenuLayout();
  }

  async function oekakiSave() {
    const panel = oekakiPanel;
    const div = panel && panel.querySelector('.ts-oekaki-div');
    if (!div || typeof $ === 'undefined' || !$.data(div, 'wPaint')) return;

    let dataUrl = null;
    try {
      dataUrl = $(div).wPaint('image');
    } catch (e) {}

    if (!dataUrl || dataUrl.indexOf('data:image/') !== 0) {
      showMessageNotification('Could not read the oekaki drawing');
      return;
    }

    const form = oekakiAttachForm?.isConnected
      ? oekakiAttachForm : document.querySelector('form[name="post"]:not(#quick-reply)');
    const uploadPostId = captureDraftId(undefined, form);

    let file = null;
    try {
      const commaIndex = dataUrl.indexOf(',');
      const header = commaIndex > 0 ? dataUrl.slice(0, commaIndex) : '';
      const typeMatch = header.match(/^data:([^;,]+)/);
      const mime = (typeMatch && typeMatch[1]) || 'image/png';
      const ext = (mime.split('/')[1] || 'png').replace('jpeg', 'jpg');
      const binary = atob(dataUrl.slice(commaIndex + 1));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      file = new File([bytes], 'oekaki.' + ext, { type: mime });
      file = await checkImageConversion(file, form);
    } catch (e) {
      showMessageNotification('Could not convert the oekaki drawing');
      return;
    }

    if (!attachDraftFile(file, form, uploadPostId)) {
      showMessageNotification('Could not add the oekaki image to the uploader');
      return;
    }

    showMessageNotification('Oekaki image attached', { timeout: 4000 });
    oekakiClosePanel();
  }

  function initializeOekaki() {
    if (!enableOekaki) return;
    if (typeof $ === 'undefined') return;

    const mainForm = document.querySelector('form[name="post"]:not(#quick-reply)');
    if (!mainForm) return;

    if (!mainForm.querySelector('.ts-oekaki-toggle')) {
      const uploadTd = mainForm.querySelector('#upload_settings td') || mainForm.querySelector('#upload td');
      if (uploadTd) {
        const link = document.createElement('a');
        link.href = 'javascript:;';
        link.className = 'ts-oekaki-toggle';
        link.title = 'Oekaki';
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', 'Oekaki');
        link.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
        uploadTd.appendChild(link);
      }
    }

    waitForElement('#mbReplyForm #mbClearFiles', (clearBtn) => {
      const form = clearBtn.closest('form');
      if (!form || form.querySelector('.ts-oekaki-toggle')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'outline ts-oekaki-toggle';
      btn.title = 'Oekaki';
      btn.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
      clearBtn.insertAdjacentElement('afterend', btn);
    });

    document.addEventListener('click', (ev) => {
      const target = ev.target;
      if (!target.closest) return;

      const toggle = target.closest('.ts-oekaki-toggle');
      if (toggle) {
        ev.preventDefault();
        const form = toggle.closest('form');
        if (form) {
          if (typeof $ === 'undefined') return;
          const panel = oekakiCreatePanel();
          if (!panel.hidden) {
            oekakiClosePanel();
            return;
          }

          oekakiAttachForm = form;
          panel.style.top = '';
          panel.style.left = '';
          panel.hidden = false;

          const ctr = panel.querySelector('.ts-oekaki-ctr');
          const div = panel.querySelector('.ts-oekaki-div');
          if ($.data(div, 'wPaint')) return;

          if (!ctr.querySelector('.ts-oekaki-placeholder')) {
            const placeholder = document.createElement('div');
            placeholder.className = 'ts-oekaki-placeholder';
            placeholder.textContent = 'Loading…';
            ctr.appendChild(placeholder);
          }

          loadWPaint(
            () => oekakiInitCanvas(),
            () => { oekakiClosePanel(); }
          );
        }
        return;
      }

      const saveBtn = target.closest('.ts-oekaki-save');
      if (saveBtn) {
        ev.preventDefault();
        oekakiSave();
        return;
      }

      const loadBtn = target.closest('.ts-oekaki-load');
      if (loadBtn) {
        ev.preventDefault();
        const panel = oekakiPanel;
        const div = panel && panel.querySelector('.ts-oekaki-div');
        if (!div || typeof $ === 'undefined') return;
        const paint = $.data(div, 'wPaint');
        if (!paint) {
          showMessageNotification('The oekaki canvas is still loading', { timeout: 4000 });
          return;
        }
        const src = oekakiAttachedImageSource();
        if (!src) {
          showMessageNotification('No file is attached to the post form', { timeout: 4000 });
          return;
        }
        if (typeof src !== 'string') {
          if (typeof src.type === 'string' && src.type.indexOf('image/') !== 0) {
            showMessageNotification('The attached file is not an image', { timeout: 4000 });
            return;
          }
          const reader = new FileReader();
          reader.onload = () => oekakiApplyImageFull(paint, reader.result);
          reader.onerror = () => showMessageNotification('Could not read the attached file', { timeout: 4000 });
          reader.readAsDataURL(src);
          return;
        }
        oekakiApplyImageFull(paint, src);
        return;
      }

      const closeBtn = target.closest('.ts-oekaki-close');
      if (closeBtn) {
        ev.preventDefault();
        oekakiClosePanel();
      }
    });
  }

  function initializeCopyTextMenu() {
    const emoteRegex = /^:.*:$/;

    function extractPostText(bodyEl) {
      const resultArr = [];

      const walk = (node) => {
        if (!node) return;

        if (node.nodeType === Node.TEXT_NODE) {
          resultArr.push(node.textContent);
          return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return;

        switch (node.tagName) {
          case 'SPAN': {
            if (node.classList.contains('embed-container')) return;
            if (node.classList.contains('spoiler')) {
              resultArr.push('**');
              break;
            }
            if (node.classList.contains('heading')) {
              resultArr.push('==');
              break;
            }
            break;
          }

          case 'SMALL':
            return;

          case 'BR':
            resultArr.push('\n');
            return;

          case 'EM': {
            resultArr.push("''");
            break;
          }

          case 'STRONG': {
            resultArr.push("'''");
            break;
          }

          case 'S': {
            resultArr.push('~~');
            break;
          }

          case 'A': {
            const text = node.textContent.trim();
            if (text.startsWith('>>')) {
              const quoteMatch = text.match(/^(>>\d+)/);
              resultArr.push(quoteMatch ? quoteMatch[1] : text);
            } else {
              resultArr.push(node.getAttribute('href') || text);
            }
            return;
          }

          case 'IMG': {
            const alt = node.getAttribute('alt') || '';
            if (emoteRegex.test(alt) || node.classList.contains('c_emoji')) {
              resultArr.push(alt);
            }
            return;
          }

          default:
            break;
        }

        const children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
          walk(children[i]);
        }

        if (node.tagName === 'SPAN') {
          if (node.classList.contains('spoiler')) resultArr.push('**');
          else if (node.classList.contains('heading')) resultArr.push('==');
        } else if (node.tagName === 'EM') {
          resultArr.push("''");
        } else if (node.tagName === 'STRONG') {
          resultArr.push("'''");
        } else if (node.tagName === 'S') {
          resultArr.push('~~');
        }
      };

      const bodyChildren = bodyEl.childNodes;
      for (let i = 0; i < bodyChildren.length; i++) {
        walk(bodyChildren[i]);
      }

      let finalText = resultArr.join('');
      return finalText.replace(/\n{3,}/g, '\n\n').trim();
    }

    const handleCopyText = (e, $menu) => {
      $menu.find('#copy-text').on('click', function(ev) {
        ev.preventDefault();

        const postEl = e.target.closest('.post.reply, .thread > .op');
        if (!postEl) return;

        const bodyEl = postEl.querySelector('.body');
        if (!bodyEl) {
          showMessageNotification('No text to copy', { timeout: 3000 });
          return;
        }

        const text = extractPostText(bodyEl);

        if (!text) {
          showMessageNotification('No text to copy', { timeout: 3000 });
          return;
        }

        navigator.clipboard.writeText(text).then(() => {
          showMessageNotification('Copied text to clipboard', { timeout: 3000 });
        }).catch(() => {
          showMessageNotification('Failed to copy text to clipboard', { timeout: 3000 });
        });
      });
    };

    Menu.onclick(handleCopyText);
    Menu.add_item('copy-text', 'Copy text', 'Copy post text to clipboard');
  }

  function checkStyles() {
    if (!(linkEmbed || linkPreview)) return;

    function checkHolidayAvatar() {
      try {
        let mainSheet = null;
        const sheets = document.styleSheets;
        for (let i = 0; i < sheets.length; i++) {
          const sheet = sheets[i];
          if (sheet.href && sheet.href.includes('/stylesheets/style.css')) {
            mainSheet = sheet;
            break;
          }
        }
        if (!mainSheet) return;

        function getAllRules(sheet, collected) {
          if (!collected) collected = [];
          try {
            const rules = sheet.cssRules || [];
            for (let i = 0; i < rules.length; i++) {
              const rule = rules[i];
              if (rule instanceof CSSImportRule && rule.styleSheet) {
                getAllRules(rule.styleSheet, collected);
              } else {
                collected.push(rule);
              }
            }
          } catch (e) {}
          return collected;
        }

        const allRules = getAllRules(mainSheet);
        let beforeBg = '';
        let afterBg = '';

        for (let i = 0; i < allRules.length; i++) {
          const rule = allRules[i];
          if (rule.selectorText && rule.selectorText.includes('.file a:has(> .post-image)::before')) {
            beforeBg = rule.style.background || '';
          } else if (rule.selectorText && rule.selectorText.includes('.file a:has(> .post-image)::after')) {
            afterBg = rule.style.background || '';
          }
        }

        if (!beforeBg && !afterBg) return;

        let styleEl = document.getElementById('twt-avatar-holiday-style');
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'twt-avatar-holiday-style';
          document.head.appendChild(styleEl);
        }

        let css = '';
        if (beforeBg) {
          css += `
            .twt-embed a:has(> .twt-avatar)::before {
              content: "";
              position: absolute;
              transform: translate(-5%, -50%);
              width: 40px;
              height: 31px;
              pointer-events: none;
              z-index: 2;
              background: ${beforeBg};
            }
          `;
        }

        if (afterBg) {
          css += `
            .twt-embed a:has(> .twt-avatar)::after {
              content: "";
              position: absolute;
              transform: translateX(100%);
              width: 27px;
              height: 36px;
              pointer-events: none;
              z-index: 2;
              background: ${afterBg};
            }
          `;
        }

        styleEl.textContent = css;
      } catch (e) {}
    }

    if (linkEmbed) {
      checkHolidayAvatar();
    }
  }

  function catalogLastReply() {
    const sortSelect = document.querySelector('#sort_by');
    if (!sortSelect) return;

    if (isChristmas) {
      snowEffect();
    } else if (isNewYear) {
      // fireworksEffect();
    }

    let lastOption = sortSelect.querySelector('option[value="last:desc"]');
    if (!lastOption) {
      lastOption = document.createElement('option');
      lastOption.value = 'last:desc';
      lastOption.textContent = 'Last reply';
      const timeOption = sortSelect.querySelector('option[value="time:desc"]');
      sortSelect.insertBefore(lastOption, timeOption);
    }

    let dataLoaded = false;
    let loadingInterval = null;

    const mixEls = Array.from(document.querySelectorAll('.mix[data-id]'));
    const visibleThreadIds = new Set(mixEls.map(el => el.dataset.id));

    async function loadReplyData() {
      if (dataLoaded) return;
      dataLoaded = true;

      const baseText = 'Last reply';
      let dots = 0;
      let completed = 0;
      let totalTasks = 0;

      function updateLoadingText() {
        const dotStr = '.'.repeat(dots) + '\u00A0'.repeat(3 - dots);
        const pct = totalTasks > 0 ? Math.min(100, Math.floor((completed / totalTasks) * 100)) : 0;
        lastOption.textContent = `Loading${dotStr} ${pct}%`;
      }

      loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        const renderDots = dots === 0 ? 0 : dots;
        dots = renderDots;
        updateLoadingText();
      }, 400);

      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');
      if (!latest.lastPosts) latest.lastPosts = {};
      if (!latest.lastPosts[currentBoard]) latest.lastPosts[currentBoard] = {};
      const stored = latest.lastPosts[currentBoard];

      const threadTimes = new Map();

      for (let i = 0; i < mixEls.length; i++) {
        const mixEl = mixEls[i];
        const threadId = mixEl.dataset.id;

        const replies = Number(mixEl.dataset.reply);
        const bump = Number(mixEl.dataset.bump);

        if (replies < bumpLimit) {
          threadTimes.set(threadId, bump);
        } else {
          if (stored[threadId] && stored[threadId].replies === replies) {
            threadTimes.set(threadId, stored[threadId].lastModified);
          } else {
            totalTasks++;
            fetchTasks.push(async () => {
              try {
                const res = await fetch(`/${currentBoard}/res/${threadId}.json`, {
                  headers: { "Range": "bytes=-1024" },
                  cache: "reload"
                });
                if (!res.ok && res.status !== 206) throw new Error("Failed tail fetch");

                const text = await res.text();
                const matches = Array.from(text.matchAll(/"last_modified"\s*:\s*(\d+)/g));
                if (matches.length > 0) {
                  const lastModified = Number(matches[matches.length - 1][1]);
                  threadTimes.set(threadId, lastModified);
                  stored[threadId] = { replies, lastModified };
                } else if (stored[threadId]) {
                  threadTimes.set(threadId, stored[threadId].lastModified);
                } else {
                  threadTimes.set(threadId, bump);
                }
              } catch (e) {
                if (stored[threadId]) {
                  threadTimes.set(threadId, stored[threadId].lastModified);
                } else {
                  threadTimes.set(threadId, bump);
                }
              } finally {
                completed++;
                updateLoadingText();
              }
            });
          }
        }
      }

      updateLoadingText();

      await fetchQueue(5);

      for (let i = 0; i < mixEls.length; i++) {
        const mixEl = mixEls[i];
        const threadId = mixEl.dataset.id;
        if (threadTimes.has(threadId)) {
          mixEl.setAttribute('data-last', threadTimes.get(threadId));
        }
      }

      latest.lastPosts[currentBoard] = stored;
      localStorage.setItem("Thread Settings", JSON.stringify(latest));

      clearInterval(loadingInterval);
      lastOption.textContent = baseText;

      sortSelect.dispatchEvent(new Event('change'));
    }

    (function cleanup() {
      const latest = JSON.parse(localStorage.getItem("Thread Settings") || '{}');

      if (latest.lastPosts?.[currentBoard]) {
        const stored = latest.lastPosts[currentBoard];
        for (const storedId of Object.keys(stored)) {
          if (!visibleThreadIds.has(storedId)) {
            delete stored[storedId];
          }
        }
        latest.lastPosts[currentBoard] = stored;
      }

      if (latest.lastReadPosts?.[currentBoard]) {
        const readStored = latest.lastReadPosts[currentBoard];
        for (const storedId of Object.keys(readStored)) {
          if (!visibleThreadIds.has(storedId)) {
            delete readStored[storedId];
          }
        }
      }

      localStorage.setItem("Thread Settings", JSON.stringify(latest));
    })();

    sortSelect.addEventListener('change', () => {
      if (sortSelect.value === 'last:desc') {
        loadReplyData();
      }
    });

    let autoselectLast = false;
    try {
      const catalog = JSON.parse(localStorage.catalog || '{}');
      const sort = catalog.sort_by;
      if (sort === 'last:desc' || sort === '') {
        autoselectLast = true;
        catalog.sort_by = 'last:desc';
        localStorage.catalog = JSON.stringify(catalog);
      }
    } catch (e) {}

    if (autoselectLast) {
      sortSelect.value = 'last:desc';
      sortSelect.dispatchEvent(new Event('change'));
    }
  }

  function matchKeybind(e, keybind) {
    if (!keybind || typeof keybind !== "object") return false;

    if (!!keybind.ctrl !== e.ctrlKey) return false;
    if (!!keybind.alt !== e.altKey) return false;
    if (!!keybind.shift !== e.shiftKey) return false;

    const key = e.key === " " ? " " : e.key.toLowerCase();
    return key === keybind.key.toLowerCase();
  }

  function initializeKeybinds(optionsOnly = false) {
    waitForElement("a[title='Options']", (optionsBtn) => {
      let optionsChecked = false;

      document.addEventListener("keydown", function (ev) {
        const targetTag = ev.target.tagName;
        const inInput = targetTag === "INPUT" || targetTag === "TEXTAREA";

        if (matchKeybind(ev, kbOptions)) {
          const handler = document.getElementById("options_handler");
          if (!handler) return;

          const isHidden = handler.style.display === "none";
          if (inInput && isHidden) return;

          ev.preventDefault();

          if (isHidden) {
            if (!optionsChecked) {
              optionsChecked = true;
              const tabList = handler.querySelector("#options_tablist");
              const hasActive = !!(tabList && tabList.querySelector(".options_tab_icon.active"));

              if (!hasActive) {
                Options.select_tab("thread-status");
              }
            }
            optionsBtn.click();
          } else {
            Options.hide();
          }
          return;
        }

        if (optionsOnly) return;

        if (urlUpload && matchKeybind(ev, kbURL)) {
          const cancelBtn = document.getElementById("urlCancel");
          ev.preventDefault();

          if (cancelBtn) {
            cancelBtn.click();
            return;
          }

          let btn;
          if (mobileURLBtn) {
            const mbForm = document.querySelector('#mbReplyForm');
            btn = mbForm && mbForm.querySelector('.url-upload');
          } else {
            btn = document.querySelector('.url-upload');
          }

          if (btn) {
            btn.click();
            return;
          }
        }

        if (inInput) return;

        if (optionThreading && matchKeybind(ev, kbThreadToggle)) {
          const btn = document.querySelector(".threading-toggle");
          if (btn) {
            ev.preventDefault();
            btn.click();
            return;
          }
        }

        if (optionThreading && toggleThread && matchKeybind(ev, kbThreadNew)) {
          const btn = document.querySelector(".threading-new");
          if (btn) {
            ev.preventDefault();
            btn.click();
            return;
          }
        }

        if (enableKbYou && (matchKeybind(ev, kbYouDown) || matchKeybind(ev, kbYouUp))) {
          ev.preventDefault();

          if (!youPostIds || youPostIds.size === 0) {
            showMessageNotification('No posts replying to (You)', { timeout: 5000, single: 'notifyYou' });
            return;
          }

          const ids = Array.from(youPostIds).sort((a, b) => a - b);

          const currentMatch = location.hash.match(/#(\d+)/);
          const currentId = currentMatch ? currentMatch[1] : null;

          let idx = currentId ? ids.indexOf(currentId) : -1;

          if (matchKeybind(ev, kbYouDown)) {
            idx = (idx + 1) % ids.length;
          } else {
            idx = (idx - 1 + ids.length) % ids.length;
          }

          const targetId = ids[idx];
          scrollToPost(targetId);

          return;
        }

        if (enableKbOwn && (matchKeybind(ev, kbOwnDown) || matchKeybind(ev, kbOwnUp))) {
          ev.preventDefault();

          if (!ownPostIds || ownPostIds.size === 0) {
            showMessageNotification('No posts by (You)', { timeout: 5000, single: 'notifyOwn' });
            return;
          }

          const ids = Array.from(ownPostIds).sort((a, b) => a - b);

          const currentMatch = location.hash.match(/#(\d+)/);
          const currentId = currentMatch ? currentMatch[1] : null;

          let idx = currentId ? ids.indexOf(currentId) : -1;

          if (matchKeybind(ev, kbOwnDown)) {
            idx = (idx + 1) % ids.length;
          } else {
            idx = (idx - 1 + ids.length) % ids.length;
          }

          const targetId = ids[idx];
          scrollToPost(targetId);

          return;
        }

        if (enableTowerTunes && matchKeybind(ev, kbTowerTunes)) {
          const btn = document.querySelector('a[title="Tower Tunes"]');
          if (btn) {
            ev.preventDefault();
            btn.click();
            return;
          }
        }

        if (scrollMarker && matchKeybind(ev, kbToggleMarker)) {
          if (!youRail || youPostIds.size === 0 || ownPostIds.size === 0) return;
          ev.preventDefault();
          markerToggleState = (markerToggleState + 1) % 3;
          youRail.className = '';
          if (markerToggleState === 1) youRail.classList.add('hide-own');
          else if (markerToggleState === 2) youRail.classList.add('hide-you');
          return;
        }

        if (enableQuickReply && matchKeybind(ev, kbQuickReply)) {
          ev.preventDefault();
          const form = document.getElementById('quick-reply');
          if (form && form.style.display !== 'none') {
            form.querySelector('.close-btn')?.click();
          } else {
            document.querySelector('.quick-reply-btn')?.click();
            setTimeout(() => {
              document.querySelector('#quick-reply textarea[name="body"]')?.focus();
            }, 50);
          }
          return;
        }

        if (postOutbox && matchKeybind(ev, kbPostOutbox)) {
          ev.preventDefault();
          saveDraft();
          return;
        }
      });
    });
  }

  if (typeof $ !== 'undefined') $(function () {
    if (typeof Options === "undefined") return;

    const SETTINGS_KEY = "Thread Settings";

    const settingsList = [
      {
        label: "Posting",
        settings: [
          { key: "enableQuickReply", label: "Quick Reply", description: "Enable keybind to toggle the quick reply panel" },
          { key: "postOutbox", label: "Post Outbox", description: "Store and swap posts in the reply panel" },
          { key: "filenameChanger", label: "Filename Changer", description: "Enable filename changer and randomizer" },
          { key: "urlUpload", label: "URL Upload", description: "Add button to upload files via URL" },
          { key: "enableOekaki", label: "Oekaki", description: "Add button to create and edit images via wPaint" }
        ]
      },
      {
        label: "Posts",
        settings: [
          { key: "appendQuotes", label: "Append Quotes", description: "Append '(OP)' '(You)' '→' to applicable quotes" },
          { key: "quoteResurrect", label: "Resurrect Quotes", description: "Link dead quotes to the archive", info: "Requires a userscript manager and a token attached on the <a href=\"/global-entry.php\" target=\"_blank\">Global Entry</a> page" },
          { key: "inlineQuoting", label: "Inline Quoting", description: "Click quote links to inline quoted posts" },
          { key: "optionThreading", label: "Quote Threading", description: "Add option to thread conversations" },
          { key: "highlightPosts", label: "Highlight Posts", description: "Add colored borders to your posts and replies to them" },
          { key: "showDeletedCounter", label: "Deleted Count", description: "Show deleted post counter" },
          { key: "hideDeletedPosts", label: "Hide Deleted Posts", description: "Hide posts upon deletion" },
          { key: "showDeletedIcon", label: "Deleted Icon", description: 'Add an icon <i class="fa fa-trash deleted-post"title="Deleted"style="opacity:0.5;margin-right:0px;"></i> next to deleted posts' },
          { key: "hidePosts", label: "Post Hiding Buttons", description: "Add buttons to hide posts" }
        ]
      },
      {
        label: "Post Content",
        settings: [
          { key: "videoHoverCursor", label: "Video Hover Position", description: "Native video hovers follow the cursor" },
          { key: "videoScrollVol", label: "Video Hover Scroll Volume", description: "Adjust hover video volume with the scroll wheel" },
          { key: "resizeMedia", label: "Resize Media", description: "Resize post media and supported embeds" },
          { key: "linkTitle", label: "Link Title", description: "Replace supported links with their actual titles" },
          { key: "linkIcon", label: "Link Icon", description: "Add icons next to supported links" },
          { key: "linkEmbed", label: "Link Embedding", description: "Add embed buttons to supported links" },
          { key: "linkPreview", label: "Media Hover", description: "Show images and videos of supported links on mouseover" },
          { key: "thumbnailSwap", label: "Transparent Thumbnails", description: "Images with transparency replace their thumbnails" },
          { key: "showSpoilerText", label: "Reveal Spoilers", description: "Show all spoilers in text" },
          { key: "showSpoilerMedia", label: "Reveal Spoiler Thumbnails", description: "Replace spoiler thumbnails with the original image" },
          { key: "rerouteCatbox", label: "Catbox Reroute", description: "Reroute Catbox links through a proxy" },
          { key: "enableImgOps", label: "ImgOps Links", description: "Add ImgOps links for reverse image searching" },
          { key: "enableSoundposts", label: "Soundposts", description: "Enable loading audio from [sound=] filenames" }
        ]
      },
      {
        label: "Navigation",
        settings: [
          { key: "rememberLastRead", label: "Remember Last Read Post", description: "Remember last read post per thread" },
          { key: "showUnreadLine", label: "Unread Line", description: "Show a line below the last read post" },
          { key: "scrollMarker", label: "Scroll Markers", description: "Add scrollbar markers for your posts and replies to them" },
          { key: "enableKbOwn", label: "Own Keybinds", description: "Scrolls to your own posts" },
          { key: "enableKbYou", label: "(You) Keybinds", description: "Scrolls to posts that quote (You)" },
          { key: "archiveRedirect", label: "Archive Redirect", description: "Redirect dead threads and media to the archive" }
        ]
      },
      {
        label: "Miscellaneous",
        settings: [
          { key: "enableTowerTunes", label: "Tower Tunes", description: "Enable keybind for Tower Tunes" }
        ]
      },
      {
        label: "Notifications",
        settings: [
          { key: "desktopNotifications", label: "Desktop Notifications", description: "Show desktop notifications when someone replies to (You)" },
          { key: "faviconUpdater", label: "Favicon Updater", description: "Enable favicon changes" },
          { key: "showArchivedMessage", label: "Archived Message", description: "Show archived message on post limit" }
        ]
      }
    ];

    const subSettings = [
      { key: "showDeletedText", label: "Deleted Text", description: 'Add <span style="color:red;font-weight:bolder">[Deleted]</span> text instead', parentKey: "showDeletedIcon" },
      { key: "notifyNewPost", label: "New Post", description: "White circle in favicon on new posts", parentKey: "faviconUpdater" },
      { key: "notifyNewYou", label: "New (You)", description: "Red circle in favicon on new (You) quotes", parentKey: "faviconUpdater" },
      { key: "changeFaviconOnArchive", label: "Archived", description: "Favicon turns red on post limit", parentKey: "faviconUpdater" },
      { key: "appendCrossThread", label: "Append (Cross-thread)", description: "Use (Cross-thread) instead", parentKey: "appendQuotes" },
      { key: "archivedMessageText", label: "Text", parentKey: "showArchivedMessage", type: "text" },
      { key: "archivedImageURL", label: "Image URL", parentKey: "showArchivedMessage", type: "text" },
      { key: "archivedMessageFontSize", label: "Font Size", description: "Use with 'px' or '%'", parentKey: "showArchivedMessage", type: "text", size: "1", after: "archivedMessageText" },
      { key: "archivedImageSize", label: "Image Width", description: "Use with 'px' or '%'", parentKey: "showArchivedMessage", type: "text", size: "1", after: "archivedImageURL" },
      { key: "archivedImageUseHeight", label: "Use Height", description: "Instead of width for image", parentKey: "showArchivedMessage", after: "archivedImageSize" },
      { key: "showStubs", label: "Stubs", description: "Show stubs of hidden posts", parentKey: "hidePosts" },
      { key: "recursiveHiding", label: "Recursive Hiding", description: "Hide replies of hidden posts, recursively", parentKey: "hidePosts" },
      { key: "translateAuto", label: "Auto Translate", description: "If original language is:", parentKey: "linkEmbed" },
      { key: "translateFrom", label: "", parentKey: "linkEmbed", type: "text", size: "3", after: "translateAuto", requires: "translateAuto" },
      { key: "notifyPostColor", label: "", parentKey: "faviconUpdater", type: "text", size: "3", after: "notifyNewPost", requires: "notifyNewPost" },
      { key: "notifyYouColor", label: "", parentKey: "faviconUpdater", type: "text", size: "3", after: "notifyNewYou", requires: "notifyNewYou" },
      { key: "directButton", label: "Direct Embed", description: "Use the link itself as an embed button", parentKey: "linkEmbed" },
      { key: "randomizeClipboard", label: "Randomize Clipboard", description: "Always randomize pasted image filenames", parentKey: "filenameChanger" },
      { key: "kbThreadNew", label: "[Thread New Posts]", description: "Keybind", parentKey: "optionThreading", type: "keybind", size: "6" },
      { key: "kbThreadToggle", label: "", parentKey: "optionThreading", type: "keybind", size: "6" },
      { key: "kbURL", label: "", parentKey: "urlUpload", type: "keybind", size: "6" },
      { key: "kbOwnDown", label: "", parentKey: "enableKbOwn", type: "keybind", size: "6" },
      { key: "kbOwnUp", label: "", parentKey: "enableKbOwn", type: "keybind", size: "6" },
      { key: "kbYouDown", label: "", parentKey: "enableKbYou", type: "keybind", size: "6" },
      { key: "kbYouUp", label: "", parentKey: "enableKbYou", type: "keybind", size: "6" },
      { key: "kbTowerTunes", label: "", parentKey: "enableTowerTunes", type: "keybind", size: "6" },
      { key: "kbToggleMarker", label: "Toggle Visibility", description: "Cycle which markers are shown", parentKey: "scrollMarker", type: "keybind", size: "6" },
      { key: "scrollToLastRead", label: "Scroll to Last Read Post", description: "Scroll to the last read post on thread entry", parentKey: "rememberLastRead" },
      { key: "unreadCount", label: "Unread Count", description: "Show unread post count in the tab title", parentKey: "rememberLastRead", after: "scrollToLastRead" },
      { key: "faviconOnEntry", label: "Thread Entry", description: "Update favicon on thread entry", parentKey: "faviconUpdater", after: "notifyPostColor" },
      { key: "hideInlinedPosts", label: "Hide Inlined Posts", description: "Hide original posts when they are inlined", parentKey: "inlineQuoting" },
      { key: "alwaysInline", label: "Always Inline Posts", description: "Inline posts even if they are already visible on screen", parentKey: "inlineQuoting", after: "hideInlinedPosts" },
      { key: "hashNavigation", label: "Hash Navigation", description: "Add # links after quotes to scroll to quoted posts", parentKey: "inlineQuoting", after: "alwaysInline" },
      { key: "youBorderStyle", label: "Border Style", parentKey: "highlightPosts", type: "select", options: ["solid","dashed","dotted","double","groove","ridge"] },
      { key: "kbQuickReply", label: "", parentKey: "enableQuickReply", type: "keybind", size: "6" },
      { key: "catboxProxy", label: "", parentKey: "rerouteCatbox", type: "select", options: ["pixstash", "fatbox"], optionLabels: { pixstash: "Pixstash", fatbox: "Fatbox" } },
      { key: "formatFilenames", label: "Format Filenames", description: "Rename media filenames of supported links", parentKey: "urlUpload", after: "kbURL" },
      { key: "kbPostOutbox", label: "", parentKey: "postOutbox", type: "keybind", size: "6" }
    ];

    const defaultSettings = {
      showDeletedCounter: true,
      showDeletedIcon: true,
      hideDeletedPosts: false,
      showArchivedMessage: true,
      faviconUpdater: true,
      optionThreading: true,
      showUnreadLine: true,
      appendQuotes: true,
      notifyNewPost: true,
      notifyNewYou: true,
      changeFaviconOnArchive: true,
      showDeletedText: false,
      appendCrossThread: false,
      archivedMessageText: "THREAD ARCHIVED",
      archivedImageURL: "https://i.imgur.com/LQHVLil.png",
      archivedMessageFontSize: "14px",
      archivedImageSize: "7%",
      archivedImageUseHeight: false,
      hidePosts: true,
      recursiveHiding: true,
      showStubs: true,
      filenameChanger: true,
      linkPreview: true,
      urlUpload: true,
      linkEmbed: true,
      translateAuto: false,
      translateFrom: "ja, id",
      thumbnailSwap: true,
      notifyPostColor: "white",
      notifyYouColor: "red",
      directButton: false,
      videoScrollVol: true,
      showSpoilerText: false,
      showSpoilerMedia: false,
      linkIcon: true,
      linkTitle: true,
      randomizeClipboard: false,
      kbOptions: { ctrl: false, alt: true, shift: false, key: "o" },
      kbThreadToggle: { ctrl: false, alt: false, shift: true, key: "t" },
      kbThreadNew: { ctrl: false, alt: false, shift: false, key: "t" },
      kbURL: { ctrl: false, alt: true, shift: false, key: "l" },
      persistentEffect: false,
      persistentDecor: false,
      enableKbYou: true,
      kbYouDown: { ctrl: false, alt: true, shift: false, key: "ArrowDown" },
      kbYouUp: { ctrl: false, alt: true, shift: false, key: "ArrowUp" },
      enableTowerTunes: true,
      kbTowerTunes: { ctrl: false, alt: true, shift: false, key: "m" },
      scrollMarker: true,
      kbToggleMarker: { ctrl: false, alt: false, shift: false, key: "m" },
      enableKbOwn: true,
      kbOwnDown: { ctrl: true, alt: false, shift: false, key: "ArrowDown" },
      kbOwnUp: { ctrl: true, alt: false, shift: false, key: "ArrowUp" },
      quoteResurrect: true,
      rememberLastRead: true,
      scrollToLastRead: true,
      unreadCount: true,
      faviconOnEntry: true,
      desktopNotifications: true,
      inlineQuoting: true,
      hideInlinedPosts: false,
      alwaysInline: true,
      highlightPosts: true,
      youBorderStyle: "dashed",
      enableQuickReply: true,
      kbQuickReply: { ctrl: false, alt: false, shift: false, key: "q" },
      enableSoundposts: true,
      archiveRedirect: true,
      videoHoverCursor: false,
      rerouteCatbox: false,
      catboxProxy: "pixstash",
      enableImgOps: true,
      hashNavigation: false,
      enableOekaki: true,
      formatFilenames: true,
      resizeMedia: true,
      postOutbox: true,
      kbPostOutbox: { ctrl: false, alt: true, shift: false, key: "n" },
    };

    let threadSettings = {};
    try {
      threadSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch {
      threadSettings = {};
    }

    for (const key in defaultSettings) {
      if (!(key in threadSettings)) {
        threadSettings[key] = defaultSettings[key];
      }
    }

    const saveSettings = () => {
      let latest = {};
      try {
        latest = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      } catch {
        latest = {};
      }

      const toSave = {
        ...threadSettings,
        hiddenPosts: latest.hiddenPosts,
        enableThreading: latest.enableThreading,
        lastPosts: latest.lastPosts,
        lastReadPosts: latest.lastReadPosts,
        headerFixed: latest.headerFixed,
        headerAutohide: latest.headerAutohide,
        headerHideScroll: latest.headerHideScroll,
      };

      localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave));
    };

    const content = $("<div></div>");

    settingsList.forEach(group => {
      const fieldset = $('<fieldset><legend>' + group.label + '</legend></fieldset>');
      group.settings.forEach(({ key, label, description, info }) => {
        const isChecked = threadSettings[key];
        const descSpan = description ? `<span class="description">: ${description}</span>` : "";
        const infoBlock = info
          ? `<i class="fa fa-info-circle" style="cursor:pointer;margin-left:4px;opacity:0.8;" title="More info"></i><div id="${key}-info" style="display:none;margin-top:4px;font-size:0.9em;opacity:0.75;padding-left:2em;">${info}</div>`
          : "";

        let style = "";
        if (key === "urlUpload" || key === "optionThreading" || key === "enableKbOwn" || key === "enableKbYou" || key === "enableTowerTunes" || key === "highlightPosts" || key === "enableQuickReply" || key === "rerouteCatbox" || key === "postOutbox") {
          style = "display:inline-block;";
        }

        const checkbox = $(`
          <div id="${key}-container" style="${style}">
            <label style="text-decoration: underline; cursor: pointer; display: inline;">
              <input type="checkbox" id="${key}" ${isChecked ? "checked" : ""} name="${label}">${label}</label>${descSpan}${infoBlock}
          </div>
        `);
        fieldset.append(checkbox);
      });
      content.append(fieldset);
    });

    subSettings.forEach((s) => {
      const { key, label, description, type = "checkbox" } = s;
      const value = threadSettings[key];
      const descSpan = description ? `<span class="description">: ${description}</span>` : "";

      let input;
      if (type === "keybind") {
        const displayValue = formatKeybind(value);
        input = `<input type="text" id="${key}" value="${displayValue}" size="${s.size || 6}" class="keybind-box" style="margin-right:3px;">`;
      } else if (type === "text") {
        const inputSize = s.size || "20";
        input = `<input type="text" id="${key}" value="${value}" size="${inputSize}" style="margin-right: 3px;">`;
      } else if (type === "select") {
        const options = (s.options || []).map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${s.optionLabels?.[o] ?? o}</option>`).join('');
        input = `<select id="${key}" style="margin-right:3px;">${options}</select>`;
      } else {
        input = `<input type="checkbox" id="${key}" ${value ? "checked" : ""}>`;
      }

      let style = "margin-left: 1.5em;";
      if (key === "translateAuto" || key === "notifyNewPost" || key === "notifyNewYou") style += " display:inline-block;";
      if (key === "translateFrom" || key === "notifyPostColor" || key === "notifyYouColor" || key === "kbThreadToggle" || key === "kbURL" || key === "kbOwnDown" || key === "kbOwnUp" || key === "kbYouDown" || key === "kbYouUp" || key === "kbTowerTunes" || key === "kbQuickReply" || key === "catboxProxy" || key === "kbPostOutbox") style += " display:inline-block; margin-left:0.5em;";

      const container = $(`
         <div id="${key}-container" style="${style}">
            <label style="text-decoration: underline; cursor: pointer; display: inline;">
              ${input}${label}</label>${descSpan}
         </div>
      `);

      content.append(container);
    });

    const previewWrapper = $(`
      <div id="archived-preview" style="
        position: absolute;
        top: 287px;
        right: 0px;
        width: 207px;
        height: 90px;
        overflow: hidden;
        pointer-events: none;
        transform-origin: top left;
      ">
      </div>
    `);
    content.css("position", "relative");
    content.append(previewWrapper);

    function renderArchivedPreview() {
      const rawFontSize = threadSettings.archivedMessageFontSize || defaultSettings.archivedMessageFontSize || "14px";
      const rawImageSize = threadSettings.archivedImageSize || defaultSettings.archivedImageSize || "7%";
      const useHeight = threadSettings.archivedImageUseHeight;
      const msg = threadSettings.archivedMessageText || defaultSettings.archivedMessageText || "THREAD ARCHIVED";
      const img = threadSettings.archivedImageURL || defaultSettings.archivedImageURL || "https://i.imgur.com/LQHVLil.png";

      const convertSize = (raw, isHeight = false) => {
        if (raw.endsWith('%')) {
          const percent = parseFloat(raw);
          const base = isHeight ? window.innerHeight : window.innerWidth;
          return `${(percent / 100) * base}px`;
        }
        return raw;
      };

      const fontSize = convertSize(rawFontSize);
      const imageSize = convertSize(rawImageSize, useHeight);

      const previewContent = $(`
        <div style="display: inline-block; white-space: nowrap;">
          <div style="display: inline-block;">
            <strong style="color: red; font-size: ${fontSize}; display: inline-block; white-space: nowrap;">${msg}</strong><br>
            <img src="${img}" style="margin-top: 5px; display: inline-block; ${useHeight ? 'height' : 'width'}: ${imageSize};">
          </div>
        </div>
      `);

      previewWrapper.empty().append(previewContent);

      const imageEl = previewContent.find('img')[0];

      const applyScale = (scale) => {
        previewContent.css({
          transform: `scale(${scale})`,
          transformOrigin: "top left"
        });
      };

      const tryScale = () => {
        const bounds = previewContent[0].getBoundingClientRect();
        const width = bounds.width;
        const height = bounds.height;

        if (width && height) {
          const scaleX = 220 / width;
          const scaleY = 90 / height;
          const scale = Math.min(scaleX, scaleY, 1);

          applyScale(scale);
          threadSettings.archivedPreviewScale = scale.toFixed(6);
        } else {
          const fallbackScale = parseFloat(threadSettings.archivedPreviewScale);
          if (fallbackScale && isFinite(fallbackScale)) {
            applyScale(fallbackScale);
          }
        }
      };

      if (imageEl.complete) {
        tryScale();
      } else {
        imageEl.onload = tryScale;
      }
    }

    function positionArchivedPreview() {
      const target = document.getElementById("archivedImageUseHeight-container");
      const preview = document.getElementById("archived-preview");
      const container = content[0];

      if (!target || !preview || !container) return;

      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const top = targetRect.top - containerRect.top + targetRect.height / 2 - preview.offsetHeight / 2;

      preview.style.top = `${Math.round(top)}px`;
      preview.style.right = `0px`;
    }

    function getTotalHiddenCount() {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      const hp = settings.hiddenPosts || {};
      let total = 0;

      const boards = Object.keys(hp);
      for (let i = 0; i < boards.length; i++) {
        const board = boards[i];
        const threads = Object.keys(hp[board]);
        for (let j = 0; j < threads.length; j++) {
          const thread = threads[j];
          const arr = hp[board][thread];
          if (Array.isArray(arr)) total += arr.length;
        }
      }
      return total;
    }

    function updateHiddenCountDisplay() {
      const count = getTotalHiddenCount();
      $('#clear-hidden').text(`Hidden: ${count}`);
    }

    const clearBtn = $(`
      <div id="clear-hidden-container">
        <button id="clear-hidden">Hidden: ${getTotalHiddenCount()}</button>
        <span class="description">: Clear manually-hidden posts</span>
      </div>
    `);
    content.append(clearBtn);

    Options.add_tab("thread-status", "cog", "Thread Options", content);

    $('#clear-hidden').on('click', () => {
      const latest = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
      latest.hiddenPosts = {};
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(latest));
      updateHiddenCountDisplay();
    });

    subSettings.forEach(({ key, parentKey, after }) => {
      const parent = $(`#${parentKey}-container`);
      const insertAfter = after ? $(`#${after}-container`) : parent;
      $(`#${key}-container`).insertAfter(insertAfter);
    });

    $('#clear-hidden-container').insertAfter($('#showStubs-container'));

    function settingsStatus() {
      subSettings.forEach(({ key, parentKey, requires }) => {
        const parentChecked = parentKey ? !!threadSettings[parentKey] : true;
        const requiresChecked = requires ? !!threadSettings[requires] : true;
        const disabled = !(parentChecked && requiresChecked);

        const $input = $(`#${key}`);
        const $label = $input.closest("label");
        const $desc = $label.next(".description");

        $input.prop("disabled", disabled);
        $label.css("opacity", disabled ? 0.5 : 1);
        $desc.css("opacity", disabled ? 0.5 : 1);
      });

      $("#archived-preview").toggle(!!threadSettings.showArchivedMessage);
    }

    subSettings.forEach(({ key, type = "checkbox" }) => {
      const $input = $(`#${key}`);
      $input.on("change input", function () {
        if (type === "text") {
          const trimmed = this.value.trim();
          if (key === "archivedImageSize" && !trimmed) {
            threadSettings[key] = defaultSettings[key];
            threadSettings.archivedImageUseHeight = defaultSettings.archivedImageUseHeight;
            $(`#archivedImageUseHeight`).prop("checked", defaultSettings.archivedImageUseHeight);
          } else {
            threadSettings[key] = trimmed || defaultSettings[key];
          }
        } else if (type === "select") {
          threadSettings[key] = this.value;
          if (key === "youBorderStyle") {
            youBorderStyle = this.value;
            updateColorStyle();
          } else if (key === "catboxProxy") {
            catboxProxy = this.value;
          }
        } else {
          threadSettings[key] = this.checked;
        }
        saveSettings();
        renderArchivedPreview();
      });
    });

    const kbOptionsBox = $(`
      <div id="kbOptions-container" style="position: absolute; top: -22px; right: 0px;">
        <label>Open Settings <input type="text" id="kbOptions" class="keybind-box" size="6">
        </label>
        <div style="font-size: 0.75em; text-align: right;">Backspace resets keybind</div>
      </div>
    `);

    content.css("position", "relative");
    content.append(kbOptionsBox);

    $("#kbOptions").val(formatKeybind(threadSettings.kbOptions));

    if (isChristmas) {
      content.css('position', 'relative');

      const controls = $(`
        <div id="persistent-controls" style="
          position: absolute;
          top: -22px;
          left: 0;
          display: flex;
          gap: 12px;
          align-items: center;
        ">
        <label for="persistentEffect" style="text-decoration: underline; cursor: pointer;">
          <input type="checkbox" id="persistentEffect" name="persistentEffect">Effect</label>
        <label for="persistentDecor" style="text-decoration: underline; cursor: pointer;">
          <input type="checkbox" id="persistentDecor" name="persistentDecor">Decor</label>
        </div>
      `);

      $('#persistentEffect', controls).prop('checked', !!threadSettings.persistentEffect);
      $('#persistentDecor', controls).prop('checked', !!threadSettings.persistentDecor);

      content.append(controls);
    }

    function formatKeybind(obj) {
      if (!obj || typeof obj !== "object") return "";

      const parts = [];
      if (obj.ctrl) parts.push("Ctrl");
      if (obj.alt) parts.push("Alt");
      if (obj.shift) parts.push("Shift");

      if (obj.key) {
        const keyMap = {
          " ": "Space",
          ArrowUp: "Up",
          ArrowDown: "Down",
          ArrowLeft: "Left",
          ArrowRight: "Right",
        };

        let main = keyMap[obj.key] ?? (obj.key.length === 1 ? obj.key.toUpperCase() : obj.key);

        parts.push(main);
      }

      return parts.join("+");
    }

    $(".keybind-box").each(function () {
      const $box = $(this);
      const key = $box.attr("id");
      const def = defaultSettings[key];

      $box.on("keydown", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === "Backspace") {
          threadSettings[key] = defaultSettings[key];
          $box.val(formatKeybind(defaultSettings[key]));
          saveSettings();
          return;
        }

        if (["Alt", "Control", "Shift", "Meta"].includes(e.key)) return;

        const keybind = {
          ctrl: e.ctrlKey,
          alt: e.altKey,
          shift: e.shiftKey,
          key: e.key === " " ? " " : e.key
        };

        threadSettings[key] = keybind;
        $box.val(formatKeybind(keybind));
        saveSettings();
      });
    });

    const $brTarget = $('#notifyNewPost-container');
    if ($brTarget.length) {
      $('<br>').insertBefore($brTarget);
    }

    content.on("change input", "input", function () {
      const key = this.id;
      if (!key) return;

      const isCheckbox = this.type === "checkbox";

      if (isCheckbox) {
        threadSettings[key] = this.checked;
      } else {
        const trimmed = this.value.trim();
        threadSettings[key] = trimmed || defaultSettings[key];
      }

      saveSettings();
      settingsStatus();
      renderArchivedPreview();
    });

    $("a[title='Options'], .options_tab_icon:has(.fa-cog)").on("click", () => {
      setTimeout(updateHiddenCountDisplay, 0);
      renderArchivedPreview();
      positionArchivedPreview();
    });

    content.on('click', '.fa-info-circle', function () {
      const $icon = $(this);
      const $info = $icon.next('div[id$="-info"]');
      const willShow = $info.is(':hidden');
      $info.slideToggle(150);
      $icon.css('opacity', willShow ? 0.6 : 0.8);
    });

    settingsStatus();
    saveSettings();
  });

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  function redirect404(targetUrl) {
    const metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
    if (!metaRefresh || document.title !== 'Something went wrong!') return false;
    const timeout = parseInt(metaRefresh.content) || 5;
    metaRefresh.remove();
    setTimeout(() => {
      window.location.replace(targetUrl);
    }, timeout * 1000);
    return true;
  }

  function onReady() {
    const path = window.location.pathname;
    const boardPageMatch = path.match(/^\/([^/]+)(?:\/(?:index|catalog)\.html|\/\d+\.html|\/?)$/);
    if (boardPageMatch) currentBoard = boardPageMatch[1];
    const mobileNewTheme = localStorage.getItem('forceMobileTheme') === 'on' && localStorage.getItem('mobileStyle') === 'new';

    if (mobileNewTheme) {
      waitForElement('#mbDesktopClose', (closeBtn) => {
        closeBtn.click();
        setTimeout(() => {
          try {
            const geo = JSON.parse(localStorage.getItem('mbDF_geometry_last'));
            if (geo && typeof geo.l === 'number' && typeof geo.t === 'number') {
              const float = document.getElementById('mbDesktopFloat');
              if (float) {
                float.style.left = geo.l + 'px';
                float.style.top = geo.t + 'px';
              }
            }
          } catch (e) {}
        }, 0);
      });
    }

    const threadMatch = path.match(/^\/([^/]+)\/res\/(\d+)(?:\+\d+)?\.html/);
    if (threadMatch) {
      currentBoard = threadMatch[1];
      currentThreadId = threadMatch[2];
      isLast50Mode = !!threadMatch[3];

      if (archiveRedirect) {
        const hash = window.location.hash;
        const archiveHash = hash ? '#p' + hash.slice(1) : '';
        if (redirect404(`https://archive.holotower.org/${currentBoard}/thread/${currentThreadId}${archiveHash}`)) return;
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initializeHeaderBar();
          initializeMediaResize();
          initializePosts();
          hoverQuoteReplies();
          threadMonitoring();
          initializeThreadingToggle();
          initializeImageConverter();
          initializeRandomizerToggle();
          initializeMobileRandomizer();
          initializeOutbox();
          initializeURLUpload();
          initializeOekaki();
          initializeKeybinds();
          initializeCopyTextMenu();
          checkStyles();
        });
      });
      return;
    } else {
      if (archiveRedirect) {
        const mediaMatch = path.match(/^\/([^/]+)\/src\/(\d+(?:-\d+)?)\.(\w+)$/);
        if (mediaMatch) {
          const stem = mediaMatch[2];
          const file = `${stem}.${mediaMatch[3]}`;
          const archiveUrl = `https://moom.archive.holotower.org/${mediaMatch[1]}/image/${stem.slice(0, 4)}/${stem.slice(4, 6)}/${file}`;
          if (redirect404(archiveUrl)) return;
        }
      }
      initializeMediaResize();
      initializeOutbox();
      initializeKeybinds(true);
      initializeOekaki();
      if (currentBoard) initializeOwnership();
    }

    const catalogMatch = path.match(/^\/([^/]+)\/catalog\.html$/);
    if (catalogMatch) {
      currentBoard = catalogMatch[1];
      checkDate();
      catalogLastReply();
      return;
    }
  }
})();