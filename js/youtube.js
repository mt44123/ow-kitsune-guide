function loadYoutubeView(view) {

  resetSeo_();
  
  viewNote.textContent = "";
  document.body.classList.add("youtube-view");
  document.body.classList.remove("clip-view");

  const now = Date.now();

  pageTitle.textContent = titles[view] || "YOUTUBE";
  setRandomVoiceLine();

  if (
    youtubeCache &&
    now - youtubeCacheTime < YOUTUBE_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent =
    "Updates every 30 min";

    currentData = filterYoutubeView(youtubeCache, view);
    renderYoutube(filterYoutube(currentData));
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=youtube")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      updated.textContent =
      "Updates every 30 min";

      finishFakeProgress();

      youtubeCache = data.videos || [];
      youtubeCacheTime = Date.now();

      currentData = filterYoutubeView(youtubeCache, view);
      renderYoutube(filterYoutube(currentData));
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function filterYoutube(videos) {
  const query = searchBox.value;
  const muted = getMutedPlayers_();

  return videos.filter(v => {

    if (muted.includes(v.name)) {
      return false;
    }

    if (!query.trim()) {
      return true;
    }

    const haystack = [
      v.name,
      v.playerAlias,
      v.team,
      v.teamAlias,
      v.role,
      v.nationality,
      v.rawTitle,
      v.titleJp,
      v.titleEn,
      v.titleKr,
      v.date
    ].join(" ");

    return matchesSearch_(haystack, query);
  });
}

function filterYoutubeView(videos, view) {
  let result = [...videos];

  if (view === "youtubegoats") {
    result = result.filter(v =>
      getFavorites_().includes(v.name)
    );
  }

  if (view === "youtubejp") {
    result = result.filter(v =>
      getNationalityRegionClass(v.nationality) === "region-jp"
    );
  }

  result = result.filter(v =>
    currentRoleFilter === "all" ||
    String(v.role || "").includes(currentRoleFilter)
  );

  if (view === "youtubehot") {
    return sortByViews_(result);
  }

  return sortByDateDesc_(result);
}

function renderYoutube(videos) {
  app.className = "youtube-mode";

  if (!videos.length) {
    app.innerHTML = `<p class="empty">No videos found.</p>`;
    return;
  }

  app.innerHTML =
    videos
      .map(renderYoutubeCard_)
      .join("");
}

function youtubeViewsIcon_() {
  return `
    <svg class="youtube-stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
      <path fill="currentColor" d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
    </svg>
  `;
}

function youtubeTimeIcon_() {
  return `
    <svg class="youtube-stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
      <path fill="currentColor" d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
    </svg>
  `;
}

function renderYoutubeCard_(v) {
  const { mainTitle, subTitles } =
    buildMediaTitles_(
      v.rawTitle || "",
      v.titleJp || "",
      v.titleEn || "",
      v.titleKr || ""
    );

    const logoPath = getTeamLogoPath_(v.team);

  return `
    <a
      class="card-link youtube-card-link"
      href="${v.url}"
      target="_blank"
      rel="noopener"
    >
      <div class="youtube-card ${getNationalityRegionClass(v.nationality)}">

        ${
          v.thumbnail
            ? `<img
                 class="youtube-thumb"
                 src="${v.thumbnail}"
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
                class="favorite-star ${isFavorite_(v.name) ? "active" : ""}"
                data-favorite-name="${escapeHtml(v.name || "")}"
              >
                ${isFavorite_(v.name) ? "★" : "☆"}
              </span>
              ${escapeHtml(v.name || "-")}
            </span>

            ${muteButton_(v.name)}
          </div>

          <div class="youtube-meta">
            ${escapeHtml(v.team || "-")}
            │
            ${escapeHtml(v.role || "-")}
            │
            ${escapeHtml(v.nationality || "-")}
          </div>

          <div class="youtube-date">

            <span class="youtube-stat-item">
              ${youtubeViewsIcon_()}
              <span>${formatViews(v.views)}</span>
            </span>           

            <span class="youtube-stat-item">
              ${youtubeTimeIcon_()}
              <span>${timeAgo(v.date)}</span>
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
