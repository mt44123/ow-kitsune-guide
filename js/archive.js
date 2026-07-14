// =========================================================
// ARCHIVE (past LIVE broadcasts, ordered by when they ended)
// =========================================================
// Grid uses the exact same look as LIVE cards (.live-card), and List uses
// the exact same look as Players > ALL (.player-table). Links always go to
// the player's channel (not a specific VOD), same as the "Last Stream" link
// on Players > ALL.

let archiveCache = null;
let archiveCacheTime = 0;
const ARCHIVE_CLIENT_CACHE_MS = 5 * 60 * 1000;

function loadArchiveView(view) {
  history.replaceState({}, "", "?view=" + view);

  resetSeo_();

  viewNote.textContent = "";

  document.body.classList.add("archive-view");
  document.body.classList.remove("youtube-view", "clip-view", "mediagoats-view");

  const now = Date.now();

  pageTitle.textContent = titles[view] || "ARCHIVE";
  setRandomVoiceLine();

  if (
    archiveCache &&
    now - archiveCacheTime < ARCHIVE_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    renderArchiveFromCache(view);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=archive")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      finishFakeProgress();

      archiveCache = data.archive || [];
      archiveCacheTime = Date.now();

      renderArchiveFromCache(view);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function renderArchiveFromCache(view) {
  currentData = filterArchiveView_(archiveCache || [], view);
  renderArchive(filterArchive(currentData));
  applyCurrentSearch_();
}

function matchArchiveViewClient_(a, view) {
  const platform = String(a.platform || "");
  const language = String(a.language || "").toUpperCase();

  switch (view) {
    case "archivekr":
      return (
        platform.includes("CHZZK") ||
        platform.includes("SOOP") ||
        language === "KO"
      );

    case "archivejp":
      return language === "JA";

    case "archiveen":
      return language === "EN";

    case "archivecn":
      return (
        platform.includes("BILIBILI") ||
        language.startsWith("ZH")
      );

    case "archiveintl":
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

    case "archiveowcs":
      return /(owcs|owcc)/i.test(getArchiveTitleText_(a));

    case "archivefaceit":
      return /\bfaceit\b/i.test(getArchiveTitleText_(a));

    default:
      return true;
  }
}

function archiveEndedAgo_(endedAt) {
  const ago = timeAgo(endedAt);
  return ago === "NOW" ? "just now" : `${ago} ago`;
}

function getArchiveTitleText_(a) {
  return [
    a.rawTitle,
    a.titleJp,
    a.titleEn,
    a.titleKr
  ]
    .join(" ")
    .toLowerCase();
}

function filterArchiveView_(items, view = currentView) {
  const result = items
    .filter(a => matchArchiveViewClient_(a, view))
    .filter(a =>
      currentRoleFilter === "all" ||
      String(a.role || "").includes(currentRoleFilter)
    );

  return sortByDateDesc_(
    result.map(a => ({ ...a, date: a.endedAt }))
  );
}

function filterArchive(items) {
  const query = searchBox.value;
  const mutedSet = new Set(getMutedPlayers_());

  return items.filter(a => {

    if (mutedSet.has(a.name)) {
      return false;
    }

    if (!query.trim()) {
      return true;
    }

    const haystack = [
      a.name,
      a.playerAlias,
      a.team,
      a.teamAlias,
      a.role,
      a.nationality,
      a.platform,
      a.rawTitle,
      a.titleJp,
      a.titleEn,
      a.titleKr
    ].join(" ");

    return matchesSearch_(haystack, query);
  });
}

function renderArchive(items) {
  if (archiveLayout === "list") {
    renderArchiveList_(items);
    return;
  }

  renderArchiveGrid_(items);
}

function renderArchiveGrid_(items) {
  app.className = "";

  if (!items.length) {
    app.innerHTML = `<p class="empty">No archived broadcasts found yet.</p>`;
    return;
  }

  app.innerHTML =
    items
      .map(renderArchiveCard_)
      .join("");
}

function renderArchiveCard_(a) {
  const logoPath = getTeamLogoPath_(a.team);
  const isFav = isFavorite_(a.name);

  const { mainTitle, subTitles } =
    buildMediaTitles_(
      a.rawTitle || "",
      a.titleJp || "",
      a.titleEn || "",
      a.titleKr || ""
    );

  return `
    <a
      class="card-link"
      href="${a.url}"
      target="_blank"
      rel="noopener"
      data-track-open="archive"
    >
      <div class="card live-card ${getLangClass(a)}">

        <div class="player-name card-name-row">
          <span>
            <span
              class="favorite-star ${isFav ? "active" : ""}"
              data-favorite-name="${escapeHtml(a.name || "")}"
            >
              ${isFav ? "★" : "☆"}
            </span>

            ${escapeHtml(a.name || "")}
          </span>

          ${muteButton_(a.name)}
        </div>

        <div class="meta">
          ${escapeHtml(a.team || "-")} │ ${escapeHtml(a.role || "-")} │ ${escapeHtml(a.nationality || "-")}
        </div>

        <div class="stats live-stats">
          <span class="platform-icons">
            ${renderPlatformIcons_(a.platform)}
          </span>

          <span class="live-stat-item">
            ${liveTimeIcon_()}
            <span>${archiveEndedAgo_(a.endedAt)}</span>
          </span>
        </div>

        ${
          mainTitle
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
}

function renderArchiveList_(items) {
  app.className = "table-mode archive-list-mode";

  if (!items.length) {
    app.innerHTML = `<p class="empty">No archived broadcasts found yet.</p>`;
    return;
  }

  app.innerHTML = `
    <div class="player-table-top">
      <div class="scroll-note">←📱Mobile:Swipe→</div>
    </div>

    <div class="player-table-wrap">
      <table class="player-table archive-table">
        <thead>
          <tr>
            <th class="archive-title-col">Title</th>
            <th>Name</th>
            <th>Team</th>
            <th>Role</th>
            <th>Nationality</th>
            <th>Ended</th>
          </tr>
        </thead>

        <tbody>
          ${items.map(renderArchiveListRow_).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderArchiveListRow_(a) {
  const isFav = isFavorite_(a.name);

  const { mainTitle, subTitles } =
    buildMediaTitles_(
      a.rawTitle || "",
      a.titleJp || "",
      a.titleEn || "",
      a.titleKr || ""
    );

  return `
    <tr>
      <td class="archive-title-col">
        <a
          class="last-stream-link archive-title-link"
          href="${a.url}"
          target="_blank"
          rel="noopener"
          data-track-open="archive"
        >
          ${renderPlatformIcons_(a.platform)}

          <span class="archive-title-text">
            <span class="archive-title-line">
              ${escapeHtml(mainTitle) || "(No title)"}
            </span>

            ${subTitles.map(t => `
              <span class="archive-title-line archive-title-sub">
                ${escapeHtml(t)}
              </span>
            `).join("")}
          </span>
        </a>
      </td>

      <td class="name-cell ${getNationalityRegionClass(a.nationality)}">
        <span
          class="favorite-star ${isFav ? "active" : ""}"
          data-favorite-name="${escapeHtml(a.name || "")}"
        >
          ${isFav ? "★" : "☆"}
        </span>

        <a
          class="player-name-link"
          href="#"
          data-player="${escapeHtml(a.name || "")}"
          onclick="return false;"
        >
          ${escapeHtml(a.name || "-")}
        </a>
      </td>

      <td>
        <button
          type="button"
          class="team-link"
          data-team-menu="${escapeHtml(a.team || "")}"
        >
          ${escapeHtml(a.team || "-")}
        </button>
      </td>

      <td>${escapeHtml(a.role || "-")}</td>
      <td>${escapeHtml(shortNationality(a.nationality || "-"))}</td>
      <td>${archiveEndedAgo_(a.endedAt)}</td>
    </tr>
  `;
}

function rerenderCurrentArchiveView_() {
  currentData = filterArchiveView_(archiveCache || [], currentView);
  renderArchive(filterArchive(currentData));
}
