// =========================================================
// ARCHIVE (past LIVE broadcasts, ordered by when they ended)
// =========================================================

let archiveCache = null;
let archiveCacheTime = 0;
const ARCHIVE_CLIENT_CACHE_MS = 5 * 60 * 1000;

function loadArchiveView(view) {
  history.replaceState({}, "", "?view=" + view);

  resetSeo_();

  viewNote.textContent =
    "Most recent ended broadcast per player, newest first.";

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

    currentData = filterArchiveView_(archiveCache);
    renderArchive(filterArchive(currentData));
    applyCurrentSearch_();
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

      currentData = filterArchiveView_(archiveCache);
      renderArchive(filterArchive(currentData));
      applyCurrentSearch_();
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function filterArchiveView_(items) {
  const result = items.filter(a =>
    currentRoleFilter === "all" ||
    String(a.role || "").includes(currentRoleFilter)
  );

  return sortByDateDesc_(result.map(a => ({ ...a, date: a.endedAt })));
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
  app.className = "clip-mode";

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
  const { mainTitle, subTitles } =
    buildMediaTitles_(
      a.rawTitle || "",
      a.titleJp || "",
      a.titleEn || "",
      a.titleKr || ""
    );

  const logoPath = getTeamLogoPath_(a.team);
  const isFav = isFavorite_(a.name);

  return `
    <a
      class="card-link youtube-card-link"
      href="${a.url}"
      target="_blank"
      rel="noopener"
      data-track-open="archive"
    >
      <div class="youtube-card ${getNationalityRegionClass(a.nationality)}">

        ${
          a.thumbnail
            ? `<img
                 class="youtube-thumb"
                 src="${a.thumbnail}"
                 loading="lazy"
                 alt=""
               >`
            : ""
        }

        <div class="youtube-info">

          <div class="youtube-title">
            ${escapeHtml(mainTitle) || "(No title)"}
          </div>

          ${subTitles.map(t => `
            <div class="youtube-subtitle">
              ${escapeHtml(t)}
            </div>
          `).join("")}

          <div class="youtube-player card-name-row">
            <span>
              <span
                class="favorite-star ${isFav ? "active" : ""}"
                data-favorite-name="${escapeHtml(a.name || "")}"
              >
                ${isFav ? "★" : "☆"}
              </span>
              ${escapeHtml(a.name || "-")}
            </span>

            ${muteButton_(a.name)}
          </div>

          <div class="youtube-meta">
            ${escapeHtml(a.team || "-")}
            │
            ${escapeHtml(a.role || "-")}
            │
            ${escapeHtml(a.nationality || "-")}
          </div>

          <div class="youtube-date">

            <span class="youtube-stat-item">
              ${renderPlatformIcons_(a.platform)}
            </span>

            <span class="youtube-stat-item">
              ${youtubeTimeIcon_()}
              <span>ended ${timeAgo(a.endedAt)} ago</span>
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

function rerenderCurrentArchiveView_() {
  renderArchive(filterArchive(currentData));
}
