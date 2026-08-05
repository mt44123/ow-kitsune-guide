function loadClipsView(view) {
  setViewUrl_(view);

  resetSeo_();

  viewNote.textContent = "";
  document.body.classList.add("clip-view");
  document.body.classList.remove("youtube-view", "mediagoats-view", "archive-view");

  pageTitle.textContent = titles[view] || view.toUpperCase();
  setRandomVoiceLine();

  if (
    view === "hotclips" ||
    view === "soophotclips" ||
    view === "chzzkhotclips"
  ) {
    viewNote.textContent = siteNote_(
      "HOT = Most viewed clips from the last 30 days",
      "HOT = 直近30日で再生の多いクリップ"
    );

  } else if (view === "chzzkbestclips") {
    viewNote.textContent = siteNote_(
      "BEST = Popular clips",
      "BEST = 人気クリップ"
    );

  } else {
    viewNote.textContent = "";
  }

  const source = getClipSource_(view);
  const cacheKey = source.cacheKey;

  const paint_ = () => {
    const clips = clipCache[cacheKey]?.data || [];
    currentData = filterClipView(clips, view);
    renderClips(filterClips(currentData));
    applyCurrentSearch_();
  };

  hydrateClipCacheFromDisk_(cacheKey);

  if (isClipCacheFresh_(cacheKey)) {
    requestId++;
    stopFakeProgress();
    paint_();
    return;
  }

  if (clipCache[cacheKey]?.data) {
    requestId++;
    stopFakeProgress();
    paint_();

    refreshClipCacheInBackground_(cacheKey).then(() => {
      if (!isClipView(currentView)) return;
      const active = getClipSource_(currentView);
      if (active.cacheKey !== cacheKey) return;
      paint_();
    });
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetchConfigApi_(source.apiView)
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      finishFakeProgress();

      const clips = getClipsFromApiData_(data, source.type);
      setClipCache_(cacheKey, clips, data.lastUpdated || "");
      paint_();
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      if (clipCache[cacheKey]?.data) {
        paint_();
        return;
      }

      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
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
    // CHZZK HOT re-sorts the same "new clips" data client-side,
    // so it reuses the chzzknew cache instead of fetching it again.
    return {
      type: "chzzknew",
      apiView: "chzzknewclips",
      cacheKey: "chzzknew"
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
  return extractClipsFromApiData_(data, type);
}

// setClipCache_ lives in app.js (disk persistence + shared access).

function filterClips(clips) {
  const query = searchBox.value;
  const mutedSet = new Set(getMutedPlayers_());

  return clips.filter(c => {

    if (mutedSet.has(c.name)) {
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
  let result = [...clips];

  result = result.filter(c =>
    currentRoleFilter === "all" ||
    String(c.role || "").includes(currentRoleFilter)
  );

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
      c.rawTitle || "",
      c.titleJp || "",
      c.titleEn || "",
      c.titleKr || ""
    );

  const isFav = isFavorite_(c.name);

  return `
    <a
      class="card-link youtube-card-link"
      href="${c.url}"
      target="_blank"
      rel="noopener"
      data-track-open="clip"
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
                class="favorite-star ${isFav ? "active" : ""}"
                data-favorite-name="${escapeHtml(c.name || "")}"
              >
                ${isFav ? "★" : "☆"}
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

        ${renderCardTeamWatermarks_(c)}

      </div>
    </a>
  `;
}