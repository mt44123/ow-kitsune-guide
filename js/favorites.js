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
    ★ Saved on this browser only. Use <b>★Backup</b> and <b>★Import</b> to move them to another device.<br>
    このブラウザにのみ保存されます。<b>★Backup</b> と <b>★Import</b> で別のデバイスへ引き継げます。
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
    app.className = "table-mode";
    app.innerHTML = `
      <div class="goats-empty-actions">
        <button class="goats-export-button" data-goats-export="import">
          ★Import
        </button>
      </div>

      <p class="empty">
        No GOATs yet.<br>
        Tap ☆ on players to add them here.<br>
        ☆を押すとMY GOATSに追加できます。
      </p>
    `;
    return;
  }

  renderPlayerLinks(favoritePlayers, {
    showGoatsExport: true
  });
}

function buildGoatsBackupCode_() {
  const favs = getFavorites_();

  const encoded = btoa(
    unescape(
      encodeURIComponent(JSON.stringify(favs))
    )
  );

  return `OWKG:${encoded}`;
}

function copyGoatsBackupCode_() {
  const code = buildGoatsBackupCode_();

  navigator.clipboard.writeText(code)
    .then(() => {
      alert(
        "Backup code copied!\n" +
        "Paste it with Import Backup on another device.\n\n" +
        "バックアップコードをコピーしました。\n" +
        "別のデバイスで OW KITSUNE GUIDE を開き、★Import から貼り付けてください。"
      );
    })
    .catch(() => {
      alert("Copy failed.");
    });
}

function importGoatsBackupCode_() {
  const code = prompt(
    "Paste your OW KITSUNE GUIDE backup code:"
  );

  if (!code) return;

  try {
    const cleaned = code.trim();

    if (!cleaned.startsWith("OWKG:")) {
      alert("Invalid backup code.");
      return;
    }

    const encoded = cleaned.replace("OWKG:", "");

    const favs = JSON.parse(
      decodeURIComponent(
        escape(atob(encoded))
      )
    );

    if (!Array.isArray(favs)) {
      alert("Invalid backup code.");
      return;
    }

   const imported = favs.filter(name =>
    typeof name === "string"
  );

  const mode = prompt(
    "Import Backup\n\n" +
    "1 = Replace current MY GOATS\n" +
    "2 = Add to current list\n" +
    "3 = Cancel\n\n" +
    "バックアップをインポートします。\n\n" +
    "1 = 今のMY GOATSを置き換える\n" +
    "2 = 今のリストに追加する\n" +
    "3 = キャンセル"
  );

  if (mode === null || mode.trim() === "3") {
    return;
  }

  const choice = mode.trim();

  if (choice !== "1" && choice !== "2") {
    alert("Import canceled.");
    return;
  }

  const nextFavs =
    choice === "1"
      ? imported
      : Array.from(
          new Set([
            ...getFavorites_(),
            ...imported
          ])
        );

    localStorage.setItem(
      "favorites",
      JSON.stringify(nextFavs)
    );

      updateFavoriteCounts_();

      alert("MY GOATS imported!");

      if (currentView === "favorites") {
        renderFavorites(currentData);

        if (document.querySelector(".player-table")) {
          searchPlayerLinksTable();
        }
      }

    } catch (error) {
      console.error(error);
      alert("Failed to import backup.");
    }
  }

document.addEventListener("click", e => {
  const goatsExport = e.target.closest("[data-goats-export]");
  if (goatsExport) {
    e.preventDefault();
    e.stopPropagation();

    const type = goatsExport.dataset.goatsExport;

    if (type === "backup") {
      copyGoatsBackupCode_();
    }

    if (type === "import") {
      importGoatsBackupCode_();
    }

    if (type === "share") {
      shareGoatsImage_();
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

    if (document.querySelector(".player-table")) {
      searchPlayerLinksTable();
    }

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