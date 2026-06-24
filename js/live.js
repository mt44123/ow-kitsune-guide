function loadLiveView(view) {
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
  
    updated.textContent =
      "Updates every 5 min";
  
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

      updated.textContent =
      "Updates every 5 min";

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
  renderLive(currentData);
}

function getClientFilteredLivePlayers(players, view) {
  return players
    .filter(p => matchLiveViewClient(p, view))
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

      return getLiveMinutesClient(a.startedAt) - getLiveMinutesClient(b.startedAt);
    });
}

function matchLiveViewClient(p, view) {
  const platform = String(p.platform || "");
  const language = String(p.language || "");

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
      return platform.includes("BILIBILI");

    case "intl":
      return (
        !platform.includes("CHZZK") &&
        !platform.includes("SOOP") &&
        !platform.includes("BILIBILI") &&
        language &&
        language !== "KO" &&
        language !== "JA" &&
        language !== "EN"
      );

    default:
      return true;
  }
}

function getLiveMinutesClient(startedAt) {
  if (!startedAt) return 999999;

  const date = new Date(String(startedAt).replace(/\//g, "-"));

  if (isNaN(date.getTime())) return 999999;

  return Math.floor((Date.now() - date.getTime()) / 60000);
}

function filterPlayers(players) {
  const keyword = searchBox.value.toLowerCase().trim();
  if (!keyword) return players;

  return players.filter(p =>
    [p.name, p.team, p.role, p.nationality, p.platform, p.title]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

function renderLive(players) {
  app.className = "";

  if (!players.length) {
    app.innerHTML = `<p class="empty">No players found.</p>`;
    return;
  }

  app.innerHTML = players.map(p => `
    <a class="card-link" href="${p.url}" target="_blank" rel="noopener">
      <div class="card ${getLangClass(p)}">
        <div class="player-name">

          <span
            class="favorite-star ${isFavorite_(p.name) ? "active" : ""}"
            data-favorite-name="${escapeHtml(p.name || "")}"
          >
            ${isFavorite_(p.name) ? "★" : "☆"}
          </span>
        
          ${p.name}
        
        </div>
        <div class="meta">${p.team || "-"} │ ${p.role || "-"} │ ${p.nationality || "-"}</div>
        <div class="stats">${p.platform}　🕓${formatLiveFor(p.startedAt)}　👥${Number(p.viewers || 0).toLocaleString()}</div>
        <div class="title">${p.title || ""}</div>
      </div>
    </a>
  `).join("");
}