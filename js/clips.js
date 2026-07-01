function loadClipsView(view) {

  resetSeo_();

  viewNote.textContent = "";
  document.body.classList.add("clip-view");
  document.body.classList.remove("youtube-view");
  
  const now = Date.now();

  pageTitle.textContent = titles[view] || view.toUpperCase();
  setRandomVoiceLine();

  if (
    view === "hotclips" ||
    view === "soophotclips" ||
    view === "chzzkhotclips"
  ) {
    viewNote.textContent =
      "HOT = Most viewed clips from the last 30 days";

  } else if (view === "chzzkbestclips") {
    viewNote.textContent =
      "BEST = Popular clips";

  } else {
    viewNote.textContent = "";
  }

  if (view === "goatclips") {
    loadGoatClipsView();
    return;
  }
  
  const source = getClipSource_(view);
  const cached = clipCache[source.cacheKey];

  if (
    cached?.data &&
    now - cached.time < CLIPS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent =
    "Updates daily";

    currentData = filterClipView(cached.data, view);
    renderClips(filterClips(currentData));
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=" + source.apiView)
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      clipLastUpdated[source.cacheKey] =
        data.lastUpdated || "";

      updated.textContent =
        "Updates daily";

      finishFakeProgress();

      const clips = getClipsFromApiData_(data, source.type);

      setClipCache_(source.cacheKey, clips);

      currentData = filterClipView(clips, view);
      renderClips(filterClips(currentData));
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function loadGoatClipsView() {
  viewNote.textContent = "";
  const now = Date.now();

  pageTitle.textContent = "★MY GOATS";
  setRandomVoiceLine();
  viewNote.textContent =
    "Favorite players' clips from Twitch, CHZZK and SOOP.";

  const allReady =
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

    updated.textContent = "Updates daily";

    currentData = buildGoatClips_();
    renderClips(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  Promise.all([
    fetch(CONFIG.API_URL + "?view=clips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=hotclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=soopclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=chzzknewclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=chzzkbestclips").then(r => r.json())
  ])
    .then(([twitchNew, twitchHot, soop, chzzkNew, chzzkBest]) => {
    
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }
    
      if (currentView !== "goatclips") {
        return;
      }
    
      finishFakeProgress();

      setClipCache_("twitch", twitchNew.clips || []);
      setClipCache_("twitchhot", twitchHot.clips || []);
      setClipCache_("soop", soop.soopclips || []);
      setClipCache_("chzzknew", chzzkNew.chzzknewclips || []);
      setClipCache_("chzzkbest", chzzkBest.chzzkbestclips || []);

      updated.textContent = "Updates daily";

      currentData = buildGoatClips_();
      renderClips(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load clips.</p>`;
      console.error(error);
    });
}

function buildGoatClips_() {
  const favs = getFavorites_();

  const allClips = [
    ...(clipCache.twitch.data || []),
    ...(clipCache.twitchhot.data || []),
    ...(clipCache.soop.data || []),
    ...(clipCache.chzzknew.data || []),
    ...(clipCache.chzzkbest.data || [])
  ];

  const seen = new Set();

  return allClips
    .filter(c => favs.includes(c.name))
    .filter(c => {
      const key = c.url || `${c.name}-${c.rawTitle || c.title}-${c.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getClipSource_(view) {
  if (view === "soopclips") {
    return {
      type: "soop",
      apiView: "soopclips",
      cacheKey: "soop"
    };
  }

  if (view === "soophotclips") {
    return {
      type: "soop",
      apiView: "soophotclips",
      cacheKey: "soophot"
    };
  }

  if (view === "chzzknewclips") {
    return {
      type: "chzzknew",
      apiView: "chzzknewclips",
      cacheKey: "chzzknew"
    };
  }

  if (view === "chzzkhotclips") {
    return {
      type: "chzzknew",
      apiView: "chzzknewclips",
      cacheKey: "chzzkhot"
    };
  }

  if (view === "chzzkbestclips") {
    return {
      type: "chzzkbest",
      apiView: "chzzkbestclips",
      cacheKey: "chzzkbest"
    };
  }

  if (view === "hotclips") {
    return {
      type: "twitch",
      apiView: "hotclips",
      cacheKey: "twitchhot"
    };
  }

  return {
    type: "twitch",
    apiView: "clips",
    cacheKey: "twitch"
  };
}

function getClipsFromApiData_(data, type) {
  if (type === "soop") {
    return data.soopclips || data.clips || [];
  }

  if (type === "chzzknew") {
    return data.chzzknewclips || data.clips || [];
  }

  if (type === "chzzkbest") {
    return data.chzzkbestclips || data.clips || [];
  }

  return data.clips || [];
}

function setClipCache_(cacheKey, clips) {
  if (!clipCache[cacheKey]) return;

  clipCache[cacheKey].data = clips;
  clipCache[cacheKey].time = Date.now();
}

function filterClips(clips) {
  const query = searchBox.value;
  const muted = getMutedPlayers_();

  return clips.filter(c => {

    if (muted.includes(c.name)) {
      return false;
    }

    if (!query.trim()) {
      return true;
    }

    const haystack = [
      c.name,
      c.playerAlias,
      c.team,
      c.teamAlias,
      c.role,
      c.nationality,
      c.rawTitle,
      c.titleJp,
      c.titleEn,
      c.titleKr,
      c.date
    ].join(" ");

    return matchesSearch_(haystack, query);
  });
}

function filterClipView(clips, view) {
  const result = [...clips];

  if (view === "jpclips") {
    return result.filter(c =>
      getNationalityRegionClass(c.nationality) === "region-jp"
    );
  }

  if (view === "chzzkbestclips") {
    return sortByViews_(result);
  }

  if (view === "chzzkhotclips" || view === "soophotclips") {
    return sortByViews_(
      filterRecentClips_(result, 30)
    );
  }

  return sortByDateDesc_(result);
}

function filterRecentClips_(clips, daysLimit) {
  return clips.filter(c => {
    const date = new Date(c.date);
    if (isNaN(date.getTime())) return false;

    const days =
      (Date.now() - date.getTime()) /
      (1000 * 60 * 60 * 24);

    return days <= daysLimit;
  });
}

function renderClips(clips) {
  app.className = "clip-mode";

  if (!clips.length) {
    app.innerHTML = `<p class="empty">No clips found.</p>`;
    return;
  }
  app.innerHTML =
    clips
      .map(renderClipCard_)
      .join("");
}

function renderClipCard_(c) {
  const { mainTitle, subTitles } =
    buildMediaTitles_(
      c.rawTitle || c.title || "",
      c.titleJp || "",
      c.titleEn || "",
      c.titleKr || ""
    );

  const logoPath = getTeamLogoPath_(c.team);

  return `
    <a
      class="card-link youtube-card-link"
      href="${c.url}"
      target="_blank"
      rel="noopener"
    >
      <div class="youtube-card ${getNationalityRegionClass(c.nationality)}">

        ${
          c.thumbnail
            ? `<img
                 class="youtube-thumb"
                 src="${c.thumbnail}"
                 loading="lazy"
                 alt=""
               >`
            : ""
        }

        <div class="youtube-info">

          <div class="youtube-title">
            ${escapeHtml(mainTitle)}
          </div>

          ${subTitles.map(t => `
            <div class="youtube-subtitle">
              ${escapeHtml(t)}
            </div>
          `).join("")}

          <div class="youtube-player card-name-row">
            <span>
              <span
                class="favorite-star ${isFavorite_(c.name) ? "active" : ""}"
                data-favorite-name="${escapeHtml(c.name || "")}"
              >
                ${isFavorite_(c.name) ? "★" : "☆"}
              </span>
              ${escapeHtml(c.name || "-")}
            </span>

            ${muteButton_(c.name)}
          </div>

          <div class="youtube-meta">
            ${escapeHtml(c.team || "-")}
            │
            ${escapeHtml(c.role || "-")}
            │
            ${escapeHtml(c.nationality || "-")}
          </div>

          <div class="youtube-date">

            <span class="youtube-stat-item">
              ${youtubeViewsIcon_()}
              <span>${Number(c.views || 0).toLocaleString()} views</span>
            </span>
            
            <span class="youtube-stat-item">
              ${youtubeTimeIcon_()}
              <span>${timeAgo(c.date)}</span>
            </span>

          </div>

                </div>

        ${
          logoPath
            ? `<img
                class="card-team-watermark"
                src="${logoPath}"
                alt=""
                loading="lazy"
                onerror="this.remove()"
              >`
            : ""
        }

      </div>
    </a>
  `;
}