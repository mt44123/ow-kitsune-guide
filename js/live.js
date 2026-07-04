function loadLiveView(view) {
  history.replaceState({}, "", "?view=" + view);

  resetSeo_();
  
  viewNote.textContent = "";
  const now = Date.now();

  pageTitle.textContent =
    titles[view] || view.toUpperCase();

  setRandomVoiceLine();

  if (
  liveCache &&
  now - liveCacheTime < LIVE_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();
    
    renderLiveFromCache(view);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=new")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      finishFakeProgress();

      liveCache = data;
      liveCacheTime = Date.now();

      if (data.counts) {
        updateAllButtonCounts(data.counts);
      }

      renderLiveFromCache(view);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML =
        `<p class="error">Failed to load data.</p>`;

      console.error(error);
    });
}

function renderLiveFromCache(view) {
  const players = liveCache?.players || [];

  checkLiveNotifications_(players);

  currentData = getClientFilteredLivePlayers(players, view);
  renderLive(filterPlayers(currentData));
  updateFavoriteCounts_();

  applyCurrentSearch_();
}

function getClientFilteredLivePlayers(players, view) {
  return players
    .filter(p => matchLiveViewClient(p, view))
    .filter(p =>
      currentRoleFilter === "all" ||
      String(p.role || "").includes(currentRoleFilter)
    )
    .sort((a, b) => {
      if (
        view === "viewers" ||
        view === "kr" ||
        view === "jp" ||
        view === "en" ||
        view === "cn" ||
        view === "intl"
      ) {
        return Number(b.viewers || 0) - Number(a.viewers || 0);
      }

      return (
        getLiveMinutesClient(a.startedAt) -
        getLiveMinutesClient(b.startedAt)
      );
    });
}

function isPlayerLive_(p) {
  const status = String(p.status || "").toUpperCase();

  return (
    status.includes("LIVE") ||
    status.includes("🔥")
  );
}

function matchLiveViewClient(p, view) {
  const platform = String(p.platform || "");
  const language = String(p.language || "").toUpperCase();

  switch (view) {
    case "goats":
      return getFavorites_().includes(p.name);
      
    case "kr":
      return (
        platform.includes("CHZZK") ||
        platform.includes("SOOP") ||
        language === "KO"
      );

    case "jp":
      return language === "JA";

    case "en":
      return language === "EN";

    case "cn":
      return (
        platform.includes("BILIBILI") ||
        language.startsWith("ZH")
      );

    case "intl":
      return (
        !platform.includes("CHZZK") &&
        !platform.includes("SOOP") &&
        !platform.includes("BILIBILI") &&
        language &&
        language !== "KO" &&
        language !== "JA" &&
        language !== "EN" &&
        !language.startsWith("ZH")
      );

    default:
      return isPlayerLive_(p);
  }
}

function getLiveMinutesClient(startedAt) {
  if (!startedAt) return 999999;

  const date = new Date(String(startedAt).replace(/\//g, "-"));

  if (isNaN(date.getTime())) return 999999;

  return Math.floor((Date.now() - date.getTime()) / 60000);
}

function filterPlayers(players) {
  const query = searchBox.value;
  const mutedSet = new Set(getMutedPlayers_());

  return players.filter(p => {

    if (mutedSet.has(p.name)) {
      return false;
    }

    if (!query.trim()) {
      return true;
    }

    const haystack = [
      p.name,
      p.playerAlias,
      p.team,
      p.teamAlias,
      p.role,
      p.nationality,
      p.platform,
      p.rawTitle,
      p.titleJp,
      p.titleEn,
      p.titleKr
    ].join(" ");

    return matchesSearch_(haystack, query);
  });
}

function liveTimeIcon_() {
  return `
    <svg class="live-stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
      <path fill="currentColor" d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
    </svg>
  `;
}

function liveViewersIcon_() {
  return `
    <svg class="live-stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
      <path fill="currentColor" d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm466 0q-47 47-113 47-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113Z"/>
    </svg>
  `;
}

function renderLive(players) {
  app.className = "";

  if (!players.length) {
    app.innerHTML = `<p class="empty">No players found.</p>`;
    return;
  }

  app.innerHTML = players.map(p => {
    const logoPath = getTeamLogoPath_(p.team);
    const isLive = isPlayerLive_(p);
    const isFav = isFavorite_(p.name);

    const { mainTitle, subTitles } =
      isLive
        ? buildMediaTitles_(
            p.rawTitle || "",
            p.titleJp || "",
            p.titleEn || "",
            p.titleKr || ""
          )
        : {
            mainTitle: "",
            subTitles: []
          };

    return `
    <a
      class="card-link"
      href="${p.url}"
      target="_blank"
      rel="noopener"
      data-track-open="live"
    >      
        <div class="card live-card ${getLangClass(p)}">

          <div class="player-name card-name-row">
            <span>
              <span
                class="favorite-star ${isFav ? "active" : ""}"
                data-favorite-name="${escapeHtml(p.name || "")}"
              >
                ${isFav ? "★" : "☆"}
              </span>

              ${escapeHtml(p.name || "")}
            </span>

            ${muteButton_(p.name)}
          </div>

          <div class="meta">
            ${escapeHtml(p.team || "-")} │ ${escapeHtml(p.role || "-")} │ ${escapeHtml(p.nationality || "-")}
          </div>

          <div class="stats live-stats">
            <span class="platform-icons">
              ${renderPlatformIcons_(p.platform)}
            </span>

            <span class="live-stat-item">
              ${liveTimeIcon_()}
              <span>${formatLiveFor(p.startedAt)}</span>
            </span>

            <span class="live-stat-item">
              ${liveViewersIcon_()}
              <span>${Number(p.viewers || 0).toLocaleString()}</span>
            </span>
          </div>

          ${
            isLive && mainTitle
              ? `
                <div class="title">
                  ${escapeHtml(mainTitle)}
                </div>

                ${subTitles.map(t => `
                  <div class="youtube-subtitle live-subtitle">
                    ${escapeHtml(t)}
                  </div>
                `).join("")}
              `
              : ""
          }

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
  }).join("");
}
