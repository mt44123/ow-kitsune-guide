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

function shareGoatsImage_() {
  const favNames = getFavorites_();

  if (!favNames.length) return;

  const players = favNames.map(name => {
    const player = (currentData || []).find(p =>
      p.name === name
    );

    return player || { name };
  });

  players.sort((a, b) =>
    (a.name || "").localeCompare(
      b.name || "",
      "en",
      { sensitivity: "base" }
    )
  );

  const shareText = buildGoatsShareText_(players);

  const bodyStyle = getComputedStyle(document.body);

  const bgDark = bodyStyle.getPropertyValue("--bg-dark").trim() || "#111A2D";
  const bgMain = bodyStyle.getPropertyValue("--bg-main").trim() || "#111A2D";
  const bgLight = bodyStyle.getPropertyValue("--bg-light").trim() || "#1D253A";
  const accent = bodyStyle.getPropertyValue("--accent").trim() || "#B84724";
  const textMain = bodyStyle.getPropertyValue("--text-main").trim() || "#FFFFFF";
  const textSub = bodyStyle.getPropertyValue("--text-sub").trim() || "rgba(255,255,255,.7)";
  const textMuted = bodyStyle.getPropertyValue("--text-muted").trim() || "rgba(255,255,255,.45)";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 1200;
  const padding = 80;
  const fontTitle = "'Jura', sans-serif";
  const fontBody = "'Jura', Arial, sans-serif";

  const useTwoColumns = players.length > 12;
  const columns = useTwoColumns ? 2 : 1;
  const rows = Math.ceil(players.length / columns);

  const cardHeight = 82;
  const cardGap = 12;
  const headerHeight = 300;
  const footerHeight = 170;

  const height =
    headerHeight +
    rows * (cardHeight + cardGap) +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = bgDark;
  ctx.fillRect(0, 0, width, height);

  const bgGradient = ctx.createLinearGradient(
    0,
    0,
    width,
    height
  );

  bgGradient.addColorStop(0, bgDark);
  bgGradient.addColorStop(0.6, bgMain);
  bgGradient.addColorStop(1, bgDark);

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = bgLight;
  roundRect_(ctx, padding, 76, width - padding * 2, 170, 24);
  ctx.fill();

  ctx.textAlign = "center";

  ctx.fillStyle = textMain;
  ctx.font = `800 62px ${fontTitle}`;
  ctx.fillText("MY GOATS", width / 2, 145);

  ctx.fillStyle = textSub;
  ctx.font = `700 28px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, 188);

  ctx.fillStyle = accent;
  ctx.font = `700 26px ${fontBody}`;
  ctx.fillText(
    `${players.length} Player${players.length === 1 ? "" : "s"}`,
    width / 2,
    224
  );

  ctx.textAlign = "left";

  const listTop = headerHeight;
  const columnGap = 34;
  const listWidth = width - padding * 2;
  const columnWidth =
    useTwoColumns
      ? (listWidth - columnGap) / 2
      : listWidth;

  players.forEach((p, index) => {
    const column = useTwoColumns ? index % 2 : 0;
    const row = useTwoColumns ? Math.floor(index / 2) : index;

    const x =
      padding +
      column * (columnWidth + columnGap);

    const y =
      listTop +
      row * (cardHeight + cardGap);

    const regionColor =
      getCanvasRegionColor_(p.nationality);

    const regionLabel =
      getCanvasRegionLabel_(p.nationality);

    const roleIcon =
      getCanvasRoleIcon_(p.role);

    ctx.fillStyle = bgLight;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.fill();

    ctx.fillStyle = regionColor;
    roundRect_(ctx, x, y, 7, cardHeight, 6);
    ctx.fill();

    ctx.fillStyle = accent;
    ctx.font = `700 28px ${fontBody}`;
    ctx.fillText("★", x + 26, y + 50);

    ctx.fillStyle = textMain;

    const name = p.name || "";
    const nameFontSize =
      useTwoColumns && name.length > 14
        ? 24
        : 30;

    ctx.font = `800 ${nameFontSize}px ${fontBody}`;
    ctx.fillText(name, x + 72, y + 35, columnWidth - 100);

    const meta = [
      regionLabel,
      roleIcon,
      p.team && p.team !== "No team" ? p.team : ""
    ].filter(Boolean).join("  •  ");

    ctx.fillStyle = textMuted;
    ctx.font = `600 18px ${fontBody}`;
    ctx.fillText(
      meta,
      x + 72,
      y + 64,
      columnWidth - 100
    );
  });

  const footerY = height - 120;

  ctx.fillStyle = accent;
  ctx.fillRect(padding, footerY - 24, width - padding * 2, 3);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const now = new Date();

  const dateText =
    `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  ctx.textAlign = "center";

  ctx.fillStyle = textSub;
  ctx.font = `700 28px ${fontBody}`;
  ctx.fillText("Where Are the GOATs?", width / 2, footerY + 20);

  ctx.fillStyle = textMuted;
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText(`Generated ${dateText}`, width / 2, footerY + 55);

  ctx.fillStyle = textMuted;
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText("ow-kitsune-guide.pages.dev", width / 2, footerY + 86);

  ctx.textAlign = "left";

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
        text: shareText,
        files: [file]
      }).catch(() => {});
      return;
    }

    navigator.clipboard?.writeText(shareText).catch(() => {});

    const link = document.createElement("a");
    link.download = "ow-kitsune-my-goats.png";
    link.href = URL.createObjectURL(blob);
    link.click();

    URL.revokeObjectURL(link.href);
  }, "image/png");
}

function buildGoatsShareText_(players) {
  return [
    "🦊 MY GOATS",
    "",
    `${players.length} Player${players.length === 1 ? "" : "s"}`,
    "",
    "Where Are the GOATs?",
    "https://ow-kitsune-guide.pages.dev/",
    "",
    "#OWCS #Overwatch2 #OWKitsuneGuide"
  ].join("\n");
}

function getCanvasRegionLabel_(region) {
  const key = String(region || "").toLowerCase();

  if (key.includes("kr")) return "KR";
  if (key.includes("jp")) return "JP";
  if (key.includes("cn")) return "CN";
  if (key.includes("na")) return "NA";
  if (key.includes("emea")) return "EMEA";
  if (key.includes("pac")) return "PAC";
  if (key.includes("sa")) return "SA";

  return "";
}

function getCanvasRoleIcon_(role) {
  const key = String(role || "").toLowerCase();

  if (key.includes("tank")) return "💪 TANK";
  if (key.includes("dps")) return "🔫 DPS";
  if (key.includes("sup")) return "💉 SUP";
  if (key.includes("coach")) return "📋 COACH";

  return "";
}

function getCanvasRegionColor_(region) {
  const bodyStyle = getComputedStyle(document.body);
  const key = String(region || "").toLowerCase();

  if (key.includes("kr")) {
    return bodyStyle.getPropertyValue("--region-kr").trim();
  }

  if (key.includes("jp")) {
    return bodyStyle.getPropertyValue("--region-jp").trim();
  }

  if (key.includes("cn")) {
    return bodyStyle.getPropertyValue("--region-cn").trim();
  }

  if (key.includes("na")) {
    return bodyStyle.getPropertyValue("--region-na").trim();
  }

  if (key.includes("emea")) {
    return bodyStyle.getPropertyValue("--region-emea").trim();
  }

  if (key.includes("pac")) {
    return bodyStyle.getPropertyValue("--region-pac").trim();
  }

  if (key.includes("sa")) {
    return bodyStyle.getPropertyValue("--region-sa").trim();
  }

  return bodyStyle.getPropertyValue("--region-unknown").trim() || "#777777";
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