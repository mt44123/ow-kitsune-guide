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
    Use <b>★Backup</b> and <b>★Import</b> to move them to another device.<br>
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

function shareGoatsImage_() {
  const favs = getFavorites_();

  if (!favs.length) return;

  const rootStyle = getComputedStyle(document.documentElement);
  const bodyStyle = getComputedStyle(document.body);

  const bgDark =
    bodyStyle.getPropertyValue("--bg-dark").trim() || "#111A2D";
  const bgMain =
    bodyStyle.getPropertyValue("--bg-main").trim() || "#111A2D";
  const bgLight =
    bodyStyle.getPropertyValue("--bg-light").trim() || "#1D253A";
  const accent =
    bodyStyle.getPropertyValue("--accent").trim() || "#B84724";
  const textMain =
    bodyStyle.getPropertyValue("--text-main").trim() || "#FFFFFF";
  const textSub =
    bodyStyle.getPropertyValue("--text-sub").trim() || "rgba(255,255,255,.7)";
  const textMuted =
    bodyStyle.getPropertyValue("--text-muted").trim() || "rgba(255,255,255,.45)";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 1200;
  const padding = 80;
  const lineHeight = 54;
  const headerHeight = 260;
  const footerHeight = 150;

  const height =
    headerHeight +
    favs.length * lineHeight +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = bgDark;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = bgMain;
  roundRect_(ctx, 40, 40, width - 80, height - 80, 32);
  ctx.fill();

  ctx.fillStyle = accent;
  roundRect_(ctx, 40, 40, 12, height - 80, 8);
  ctx.fill();

  ctx.fillStyle = bgLight;
  roundRect_(ctx, padding, 76, width - padding * 2, 140, 24);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "700 42px sans-serif";
  ctx.fillText("★", padding + 34, 132);

  ctx.fillStyle = textMain;
  ctx.font = "800 58px sans-serif";
  ctx.fillText("MY GOATS", padding + 90, 136);

  ctx.fillStyle = textSub;
  ctx.font = "700 30px sans-serif";
  ctx.fillText("OW KITSUNE GUIDE 🦊", padding + 94, 178);

  ctx.fillStyle = accent;
  ctx.font = "700 26px sans-serif";
  ctx.fillText(`${favs.length} GOAT${favs.length === 1 ? "" : "s"}`, width - padding - 170, 132);

  ctx.fillStyle = textMain;
  ctx.font = "600 36px sans-serif";

  favs.forEach((name, index) => {
    const y = headerHeight + index * lineHeight;

    ctx.fillStyle = index % 2 === 0
      ? "rgba(255,255,255,.04)"
      : "rgba(255,255,255,.02)";

    roundRect_(ctx, padding, y - 38, width - padding * 2, 44, 12);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.fillText("★", padding + 20, y);

    ctx.fillStyle = textMain;
    ctx.fillText(name, padding + 72, y);
  });

  const footerY = height - 105;

  ctx.fillStyle = accent;
  ctx.fillRect(padding, footerY - 28, width - padding * 2, 3);

  ctx.fillStyle = textSub;
  ctx.font = "700 28px sans-serif";
  ctx.fillText("Where Are the GOATs?", padding, footerY + 20);

  ctx.fillStyle = textMuted;
  ctx.font = "24px sans-serif";
  ctx.fillText("ow-kitsune-guide.pages.dev", padding, footerY + 58);

  canvas.toBlob(blob => {
    if (!blob) return;

    const file = new File(
      [blob],
      "ow-kitsune-my-goats.png",
      { type: "image/png" }
    );

    if (
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      navigator.share({
        title: "MY GOATS",
        text: "MY GOATS on OW KITSUNE GUIDE 🦊",
        files: [file]
      }).catch(() => {});
      return;
    }

    const link = document.createElement("a");
    link.download = "ow-kitsune-my-goats.png";
    link.href = URL.createObjectURL(blob);
    link.click();

    URL.revokeObjectURL(link.href);
  }, "image/png");
}

function roundRect_(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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