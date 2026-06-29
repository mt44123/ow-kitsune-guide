function getFavorites_() {
  return JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
}

function isFavorite_(name) {
  return getFavorites_().includes(name);
}

function toggleFavorite_(name) {
  const favs = getFavorites_();

  const index = favs.indexOf(name);

  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    favs.push(name);
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favs)
  );

  updateFavoriteCounts_();
}

function loadFavoritesView() {
  updateFavoriteCounts_();
  const now = Date.now();

  pageTitle.textContent = "★MY GOATS";
  setRandomVoiceLine();

  viewNote.innerHTML = `
    ★ Saved on this browser only.
  `;

  if (
    playerLinksCache &&
    now - playerLinksCacheTime < PLAYER_LINKS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent = playerLinksLastUpdated;

    currentData = playerLinksCache;
    renderFavorites(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=playerlinks")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      finishFakeProgress();

      playerLinksLastUpdated = data.lastUpdated || "";
      updated.textContent = playerLinksLastUpdated;

      playerLinksCache = data.playerLinks || [];
      playerLinksCacheTime = Date.now();

      currentData = playerLinksCache;
      renderFavorites(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML =
        `<p class="error">Failed to load data.</p>`;

      console.error(error);
    });
}

function renderFavorites(players) {
  const favs = getFavorites_();

  const favoritePlayers = players.filter(p =>
    favs.includes(p.name)
  );

  if (!favoritePlayers.length) {
    app.className = "";
    app.innerHTML = `
      <p class="empty">
        No GOATs yet.<br>
        Tap ☆ on players to add them here.<br>
        ☆を押すとMY GOATSに追加できます。
      </p>
    `;
    return;
  }

  renderPlayerLinks(favoritePlayers);

  const wrap = app.querySelector(".player-table-wrap");

  if (wrap && !wrap.querySelector(".goats-export-box")) {
    wrap.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="goats-export-box">
          <button class="goats-export-button" data-goats-export="copy">
            Copy List
          </button>
          <button class="goats-export-button" data-goats-export="share">
            Share
          </button>
          <button class="goats-export-button" data-goats-export="image">
            Export Image
          </button>
        </div>
      `
    );
  }
}

function buildGoatsExportText_() {
  const favs = getFavorites_();

  return [
    "My GOATs on OW KITSUNE GUIDE 🦊",
    "",
    ...favs.map(name => `★ ${name}`),
    "",
    "https://ow-kitsune-guide.pages.dev/"
  ].join("\n");
}

function copyGoatsList_() {
  const text = buildGoatsExportText_();

  navigator.clipboard.writeText(text)
    .then(() => {
      alert("MY GOATS list copied!");
    })
    .catch(() => {
      alert("Copy failed.");
    });
}

function shareGoatsList_() {
  const text = buildGoatsExportText_();

  if (!navigator.share) {
    copyGoatsList_();
    return;
  }

  navigator.share({
    title: "My GOATs",
    text
  }).catch(() => {});
}

function exportGoatsImage_() {
  const favs = getFavorites_();

  if (!favs.length) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 1200;
  const padding = 80;
  const lineHeight = 52;
  const headerHeight = 190;
  const footerHeight = 110;

  const height =
    headerHeight +
    favs.length * lineHeight +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#111A2D";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 54px sans-serif";
  ctx.fillText("MY GOATS", padding, 95);

  ctx.fillStyle = "#B84724";
  ctx.font = "700 34px sans-serif";
  ctx.fillText("OW KITSUNE GUIDE 🦊", padding, 145);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 36px sans-serif";

  favs.forEach((name, index) => {
    ctx.fillText(
      `★ ${name}`,
      padding,
      headerHeight + index * lineHeight
    );
  });

  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.font = "28px sans-serif";
  ctx.fillText(
    "https://ow-kitsune-guide.pages.dev/",
    padding,
    height - 60
  );

  const link = document.createElement("a");
  link.download = "ow-kitsune-my-goats.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

document.addEventListener("click", e => {
    const goatsExport = e.target.closest("[data-goats-export]");
  if (goatsExport) {
    e.preventDefault();
    e.stopPropagation();

    const type = goatsExport.dataset.goatsExport;

    if (type === "copy") {
      copyGoatsList_();
    }

    if (type === "share") {
      shareGoatsList_();
    }

    if (type === "image") {
      exportGoatsImage_();
    }

    return;
  }

  const star = e.target.closest(".favorite-star");
  if (!star) return;

  e.preventDefault();
  e.stopPropagation();

  const name = star.dataset.favoriteName;
  if (!name) return;

  toggleFavorite_(name);

  const active = isFavorite_(name);

  document
    .querySelectorAll(
      `.favorite-star[data-favorite-name="${CSS.escape(name)}"]`
    )
    .forEach(s => {
      s.classList.toggle("active", active);
      s.textContent = active ? "★" : "☆";
    });

  if (currentView === "favorites") {
    renderFavorites(currentData);
    searchPlayerLinksTable();
    return;
  }

  if (currentView === "teams" && currentTeamName) {
    renderTeamPlayers(
      currentTeamName,
      currentData,
      currentRegionName
    );
    return;
  }

  if (currentView === "goats") {
    renderLive(filterPlayers(currentData));
    return;
  }

  if (currentView === "youtubegoats") {
    renderYoutube(filterYoutube(currentData));
    return;
  }

  if (currentView === "goatclips") {
    renderClips(filterClips(currentData));
    return;
  }
});
