// =========================================================
// CLIP & YOUTUBE (merged "media" nav section)
// =========================================================
// The ★ tab ("mediagoats") combines favourite players' YouTube
// videos and Twitch/CHZZK/SOOP clips into a single feed. Each
// entry keeps its own card renderer (YouTube card vs Clip card)
// via the "_kind" tag, so the look of each item is unchanged.

function loadMediaGoatsView() {
  currentView = "mediagoats";
  history.replaceState({}, "", "?view=mediagoats");

  resetSeo_();

  viewNote.textContent =
    "Favorite players' YouTube videos, Twitch/CHZZK/SOOP clips in one feed.";

  document.body.classList.add("mediagoats-view");
  document.body.classList.remove("youtube-view", "clip-view", "archive-view");

  const now = Date.now();

  pageTitle.textContent = titles.mediagoats;
  setRandomVoiceLine();
  updatePageTitleLink_("mediagoats");

  const allReady =
    youtubeCache &&
    now - youtubeCacheTime < YOUTUBE_CLIENT_CACHE_MS &&
    clipCache.twitch.data &&
    clipCache.twitchhot.data &&
    clipCache.soop.data &&
    clipCache.chzzknew.data &&
    clipCache.chzzkbest.data &&
    now - clipCache.twitch.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.twitchhot.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.soop.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.chzzknew.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.chzzkbest.time < CLIPS_CLIENT_CACHE_MS;

  if (allReady) {
    requestId++;
    stopFakeProgress();

    currentData = buildMediaGoats_();
    renderMediaGoats_(filterMediaGoats_(currentData));
    applyCurrentSearch_();
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  Promise.all([
    fetch(CONFIG.API_URL + "?view=youtube").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=clips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=hotclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=soopclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=chzzknewclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=chzzkbestclips").then(r => r.json())
  ])
    .then(([youtube, twitchNew, twitchHot, soop, chzzkNew, chzzkBest]) => {

      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      if (currentView !== "mediagoats") {
        return;
      }

      finishFakeProgress();

      youtubeCache = youtube.videos || [];
      youtubeCacheTime = Date.now();

      setClipCache_("twitch", twitchNew.clips || []);
      setClipCache_("twitchhot", twitchHot.clips || []);
      setClipCache_("soop", soop.soopclips || []);
      setClipCache_("chzzknew", chzzkNew.chzzknewclips || []);
      setClipCache_("chzzkbest", chzzkBest.chzzkbestclips || []);

      currentData = buildMediaGoats_();
      renderMediaGoats_(filterMediaGoats_(currentData));
      applyCurrentSearch_();
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
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
