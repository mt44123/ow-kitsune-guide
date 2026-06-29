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
    ★ Saved on this browser only.<br>
    Use <b>Backup MY GOATS</b> and <b>Import Backup</b> to move them to another device.<br>
    このブラウザにのみ保存されます。<b>Backup MY GOATS</b> と <b>Import Backup</b> で別のデバイスへ引き継げます。
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
        "Backup code copied!\nPaste it with Import Backup on another device."
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

    const current = getFavorites_();

    const merged = Array.from(
      new Set([
        ...current,
        ...favs.filter(name => typeof name === "string")
      ])
    );

    localStorage.setItem(
      "favorites",
      JSON.stringify(merged)
    );

    updateFavoriteCounts_();

    alert("MY GOATS imported!");

    if (currentView === "favorites") {
      renderFavorites(currentData);
      searchPlayerLinksTable();
    }

  } catch (error) {
    console.error(error);
    alert("Failed to import backup.");
  }
}

function shareGoatsList_() {
  const code = buildGoatsBackupCode_();

  if (!navigator.share) {
    copyGoatsBackupCode_();
    return;
  }

  navigator.share({
    title: "Backup MY GOATS",
    text:
      "Import my MY GOATS on OW KITSUNE GUIDE 🦊\n\n" +
      code
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

    if (type === "backup") {
        copyGoatsBackupCode_();
      }

    if (type === "import") {
        importGoatsBackupCode_();
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