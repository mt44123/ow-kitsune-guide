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
}

function loadFavoritesView() {
  const now = Date.now();

  pageTitle.textContent = "MY GOATS";
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
}

document.addEventListener("click", e => {
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

