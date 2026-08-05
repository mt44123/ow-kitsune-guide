// =========================================================
// CLIP & YOUTUBE (merged "media" nav section)
// =========================================================
// The ★ tab ("mediagoats") combines favourite players' YouTube
// videos and Twitch/CHZZK/SOOP clips into a single feed. Each
// entry keeps its own card renderer (YouTube card vs Clip card)
// via the "_kind" tag, so the look of each item is unchanged.

function loadMediaGoatsView() {
  currentView = "mediagoats";
  setViewUrl_("mediagoats");

  resetSeo_();

  viewNote.textContent = siteNote_(
    "Favorite players' YouTube videos, Twitch/CHZZK/SOOP clips in one feed.",
    "お気に入り選手の YouTube・Twitch/CHZZK/SOOP クリップをまとめて表示します。"
  );

  document.body.classList.add("mediagoats-view");
  document.body.classList.remove("youtube-view", "clip-view", "archive-view");

  pageTitle.textContent = titles.mediagoats;
  setRandomVoiceLine();
  updatePageTitleLink_("mediagoats");

  const sources = [
    "youtube",
    "twitch",
    "twitchhot",
    "soop",
    "chzzknew",
    "chzzkbest"
  ];

  hydrateYoutubeFromDisk_();
  sources.slice(1).forEach(hydrateClipCacheFromDisk_);

  const hasAny_ = () =>
    !!(
      youtubeCache ||
      clipCache.twitch.data ||
      clipCache.twitchhot.data ||
      clipCache.soop.data ||
      clipCache.chzzknew.data ||
      clipCache.chzzkbest.data
    );

  const allFresh =
    isYoutubeCacheFresh_() &&
    isClipCacheFresh_("twitch") &&
    isClipCacheFresh_("twitchhot") &&
    isClipCacheFresh_("soop") &&
    isClipCacheFresh_("chzzknew") &&
    isClipCacheFresh_("chzzkbest");

  const paint_ = () => {
    if (currentView !== "mediagoats") return;
    currentData = buildMediaGoats_();
    renderMediaGoats_(filterMediaGoats_(currentData));
    applyCurrentSearch_();
  };

  if (allFresh) {
    requestId++;
    stopFakeProgress();
    paint_();
    return;
  }

  const currentRequest = ++requestId;

  if (hasAny_()) {
    stopFakeProgress();
    paint_();
  } else {
    startFakeProgress();
  }

  const ensureOne_ = key => {
    if (key === "youtube") {
      return ensureYoutubeCache_();
    }
    return ensureClipCache_(key);
  };

  // Load missing sources with concurrency limits from fetchConfigApi_;
  // repaint after each completion so feed fills progressively.
  Promise.all(
    sources.map(key =>
      ensureOne_(key)
        .then(() => {
          if (currentRequest !== requestId) return;
          if (currentView !== "mediagoats") return;

          if (
            app.querySelector(".loading") ||
            !hasAny_()
          ) {
            stopFakeProgress();
          }

          paint_();
        })
        .catch(() => {})
    )
  )
    .then(() => {
      if (currentRequest !== requestId) return;
      if (currentView !== "mediagoats") return;

      stopFakeProgress();

      if (!hasAny_()) {
        app.innerHTML = `<p class="error">Failed to load data.</p>`;
        return;
      }

      paint_();
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      if (hasAny_()) {
        paint_();
        return;
      }

      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function buildMediaGoats_() {
  const favSet = new Set(getFavorites_());

  const youtubeItems = (youtubeCache || []).map(v => ({ ...v, _kind: "youtube" }));

  const clipItems = [
    ...(clipCache.twitch.data || []),
    ...(clipCache.twitchhot.data || []),
    ...(clipCache.soop.data || []),
    ...(clipCache.chzzknew.data || []),
    ...(clipCache.chzzkbest.data || [])
  ].map(c => ({ ...c, _kind: "clip" }));

  const seen = new Set();

  return [...youtubeItems, ...clipItems]
    .filter(item => favSet.has(item.name))
    .filter(item =>
      currentRoleFilter === "all" ||
      String(item.role || "").includes(currentRoleFilter)
    )
    .filter(item => {
      const key = item.url || `${item._kind}-${item.name}-${item.rawTitle || item.title}-${item.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function filterMediaGoats_(items) {
  const query = searchBox.value;
  const mutedSet = new Set(getMutedPlayers_());

  return items.filter(item => {

    if (mutedSet.has(item.name)) {
      return false;
    }

    if (!query.trim()) {
      return true;
    }

    const haystack = [
      item.name,
      item.playerAlias,
      item.team,
      item.teamAlias,
      item.role,
      item.nationality,
      item.rawTitle,
      item.titleJp,
      item.titleEn,
      item.titleKr,
      item.date
    ].join(" ");

    return matchesSearch_(haystack, query);
  });
}

function renderMediaGoats_(items) {
  app.className = "clip-mode";

  if (!items.length) {
    app.innerHTML = `<p class="empty">No favorites found. Add favorites from LIVE, ARCHIVE or here.</p>`;
    return;
  }

  app.innerHTML = items
    .map(item =>
      item._kind === "youtube"
        ? renderYoutubeCard_(item)
        : renderClipCard_(item)
    )
    .join("");
}

// Dispatches re-render for whichever "media" tab is currently active
// (YouTube tabs, Twitch/CHZZK/SOOP clip tabs, or the merged ★ tab).
function rerenderCurrentMediaView_() {
  if (currentView === "mediagoats") {
    renderMediaGoats_(filterMediaGoats_(currentData));
    return;
  }

  if (isYoutubeView(currentView)) {
    renderYoutube(filterYoutube(currentData));
    return;
  }

  if (isClipView(currentView)) {
    renderClips(filterClips(currentData));
  }
}
