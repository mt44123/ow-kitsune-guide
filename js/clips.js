function loadClipsView(view) {

  resetSeo_();

  viewNote.textContent = "";
  document.body.classList.add("clip-view");
  document.body.classList.remove("youtube-view", "mediagoats-view", "archive-view");
  
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

  const source = getClipSource_(view);
  const cached = clipCache[source.cacheKey];

  if (
    cached?.data &&
    now - cached.time < CLIPS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    currentData = filterClipView(cached.data, view);
    renderClips(filterClips(currentData));
    applyCurrentSearch_();
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

      finishFakeProgress();

      const clips = getClipsFromApiData_(data, source.type);

      setClipCache_(source.cacheKey, clips);

      currentData = filterClipView(clips, view);
      renderClips(filterClips(currentData));
      applyCurrentSearch_();
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
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

  const logoPath = getTeamLogoPath_(c.team);
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