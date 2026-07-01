function loadPlayerLinksView() {
  history.replaceState({}, "", "?view=playerlinks");

  resetSeo_();

  viewNote.textContent = "";
  const now = Date.now();

  pageTitle.textContent = titles.playerlinks;
  setRandomVoiceLine();

  if (
    playerLinksCache &&
    now - playerLinksCacheTime < PLAYER_LINKS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent = playerLinksLastUpdated;

    currentData = playerLinksCache;
    renderPlayerLinks(currentData);
    applyCurrentSearch_();
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
      renderPlayerLinks(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML =
        `<p class="error">Failed to load data.</p>`;

      console.error(error);
    });
}

function renderPlayerLinks(players, options = {}) {
  const showGoatsExport = options.showGoatsExport === true;
  app.className = "table-mode";

  if (!players.length) {
    app.innerHTML = `<p class="empty">No player links found.</p>`;
    return;
  }

  players = [...players].sort((a, b) => {
    const aValue = String(a.teamRegion || "");
    const bValue = String(b.teamRegion || "");

    if (aValue === "" && bValue !== "") return 1;
    if (aValue !== "" && bValue === "") return -1;
    if (aValue === "" && bValue === "") return 0;

    return aValue.localeCompare(bValue);
  });

app.innerHTML = `
  ${renderLiquipediaNote_()}

    <div class="player-table-top">
    <div class="scroll-note">
      ←📱Mobile:Swipe→
    </div>

    ${
      showGoatsExport
        ? `
          <div class="goats-export-box">
            <button class="goats-export-button" data-goats-export="backup">
              ★Backup
            </button>
            <button class="goats-export-button" data-goats-export="import">
              ★Import
            </button>
            <button class="goats-export-button" data-goats-export="share">
              ★Share
            </button>
          </div>
        `
        : ""
    }
  </div>

  <div class="player-table-wrap">
    <table class="player-table">
      <thead>
        <tr>
          <th class="sortable sorted-asc" data-sort="teamRegion">Region</th>
          <th class="sortable" data-sort="team">Team</th>
          <th class="sortable" data-sort="name">Name</th>
          <th class="sortable" data-sort="nationality">Nationality</th>
          <th class="sortable" data-sort="role">Role</th>
          <th class="sortable" data-sort="age">Age (Born)</th>
          <th class="sortable" data-sort="laststream">Last Stream</th>
          <th>TW</th>
          <th>CHZ</th>
          <th>SOOP</th>
          <th>BILI</th>
          <th>YT</th>
          <th>X</th>
          <th>DC*</th>
        </tr>
      </thead>
      <tbody>
        ${players.map(p => `
          <tr
            data-team-region="${(p.teamRegion || "").toLowerCase()}"
            data-team="${(p.team || "").toLowerCase()}"
            data-name="${(p.name || "").toLowerCase()}"
            data-team-alias="${(p.teamAlias || "").toLowerCase()}"
            data-player-alias="${(p.playerAlias || "").toLowerCase()}"
            data-nationality="${(p.nationality || "").toLowerCase()}"
            data-role="${(p.role || "").toLowerCase()}"
            data-age="${
              String(p.role || "").toLowerCase() === "hero"
                ? (p.age || "")
                : (p.born ? getCurrentAgeFromBorn(p.born) : "")
            }"
            data-laststream="${p.lastStreamAge || '9999d'}"
          >
            <td>${p.teamRegion || ""}</td>

            <td class="team-cell ${getTeamRegionClass(p.teamRegion, p.team)}">
              <a
                class="team-link"
                href="https://liquipedia.net/overwatch/${encodeURIComponent(p.team || "")}"
                target="_blank"
                rel="noopener"
              >
                ${p.team || ""}
              </a>
            </td>

            <td class="name-cell ${getNationalityRegionClass(p.nationality)}">

              <span
                class="favorite-star ${isFavorite_(p.name) ? "active" : ""}"
                data-favorite-name="${escapeHtml(p.name || "")}"
              >
                ${isFavorite_(p.name) ? "★" : "☆"}
              </span>
            
              ${
                hasPlayerProfile_(p)
                  ? `
                    <a
                      class="player-name-link"
                      href="#"
                      data-player="${escapeHtml(p.name)}"
                      onclick="return false;"
                    >
                      ${escapeHtml(p.name || "")}
                    </a>
                  `
                  : `
                    <span>${escapeHtml(p.name || "")}</span>
                  `
              }
            
            </td>

           <td>${shortNationality(p.nationality || "")}</td>
            <td>${p.role || ""}</td>
           <td>
              ${
                String(p.role || "").toLowerCase() === "hero"
                ? `${p.age || ""}${p.born ? ` (${formatHeroBirthday_(p.born)})` : ""}`
                  : `${p.born ? getCurrentAgeFromBorn(p.born) : ""}${p.born ? ` (${p.born})` : ""}`
              }
            </td>
            <td>
              ${
                p.lastStreamUrl
                  ? `<a class="last-stream-link" href="${p.lastStreamUrl}" target="_blank" rel="noopener">
                      ${renderPlatformIcons_(p.lastStreamPlatform)}
                      <span>${cleanLastStreamAge_(p.lastStreamAge)}</span>
                    </a>`
                  : "-"
              }
            </td>
            <td>${linkDot(p.twitchUrl, p.twitchActive ? "tw" : "tw-inactive")}</td>
            <td>${linkDot(p.chzzkUrl, "chz")}</td>
            <td>${linkDot(p.soopUrl, "soop")}</td>
            <td>${linkDot(p.biliUrl, "bili")}</td>
            <td>${linkDot(p.youtubeUrl, "yt")}</td>
            <td>${linkDot(p.xUrl, "x")}</td>
            <td>${linkDot(p.discordUrl, "dc")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
`;

  setupPlayerLinksSort();
}

function cleanLastStreamAge_(value) {
  return String(value || "-")
    .replace(/^[🟣🟢🔵🟡]\s*/, "")
    .trim();
}

function formatHeroBirthday_(born) {
  if (!born) return "";

  const [, month, day] =
    String(born).split("-");

  return `${month}-${day}`;
}

function setupPlayerLinksSort() {
  document
    .querySelectorAll(".player-table th.sortable")
    .forEach(th => {

      th.addEventListener("click", () => {
        const key = th.dataset.sort;

        const tbody =
          document.querySelector(
            ".player-table tbody"
          );

        if (!tbody) return;

        const rows =
          Array.from(
            tbody.querySelectorAll("tr")
          );

        const currentDir =
          th.dataset.dir || "desc";

        const nextDir =
          currentDir === "asc"
            ? "desc"
            : "asc";

        document
          .querySelectorAll(
            ".player-table th.sortable"
          )
          .forEach(h => {
            h.dataset.dir = "";
            h.classList.remove(
              "sorted-asc",
              "sorted-desc"
            );
          });

        th.dataset.dir = nextDir;

        th.classList.add(
          nextDir === "asc"
            ? "sorted-asc"
            : "sorted-desc"
        );

        rows.sort((a, b) => {
          const aValue =
            a.dataset[key] || "";

          const bValue =
            b.dataset[key] || "";

          if (key === "age") {
            return compareAge_(
              aValue,
              bValue,
              nextDir
            );
          }

          if (key === "laststream") {
            return compareLastStream_(
              aValue,
              bValue,
              nextDir
            );
          }

          return compareText_(
            aValue,
            bValue,
            nextDir
          );
        });

        rows.forEach(row =>
          tbody.appendChild(row)
        );
      });

    });
}

function compareAge_(aValue, bValue, dir) {
  const aEmpty = aValue === "";
  const bEmpty = bValue === "";

  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;
  if (aEmpty && bEmpty) return 0;

  const result =
    Number(aValue) - Number(bValue);

  return dir === "asc"
    ? result
    : -result;
}

function compareLastStream_(aValue, bValue, dir) {

  const parseDays = value => {
    if (!value) return 999999;
    if (value === "TODAY") return 0;

    const match =
      String(value).match(/^(\d+)d$/);

    return match
      ? Number(match[1])
      : 999999;
  };

  const result =
    parseDays(aValue) -
    parseDays(bValue);

  return dir === "asc"
    ? result
    : -result;
}

function compareText_(aValue, bValue, dir) {

  if (aValue === "" && bValue !== "") return 1;
  if (aValue !== "" && bValue === "") return -1;
  if (aValue === "" && bValue === "") return 0;

  const result =
    aValue.localeCompare(bValue);

  return dir === "asc"
    ? result
    : -result;
}

function searchPlayerLinksTable() {
  const query = searchBox.value;
  const rows = document.querySelectorAll(".player-table tbody tr");

  rows.forEach(row => {
    const haystack = [
      row.dataset.teamRegion,
      row.dataset.team,
      row.dataset.teamAlias,
      row.dataset.name,
      row.dataset.playerAlias,
      row.dataset.nationality,
      row.dataset.role
    ].join(" ");

    row.style.display =
      matchesSearch_(haystack, query)
        ? ""
        : "none";
  });
}

function loadPlayerDetailView() {
  resetSeo_();

  const slug = location.pathname
    .replace(/^\/player\//, "")
    .replace(/\/$/, "");

  const name = decodeURIComponent(slug);

  if (!name) {
    app.innerHTML = `<p class="empty">Player not found.</p>`;
    return;
  }

  startFakeProgress();

  Promise.all([
  fetch(CONFIG.API_URL + "?view=playerlinks").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=youtube").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=clips").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=hotclips").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=soopclips").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=soophotclips").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=chzzknewclips").then(r => r.json()),
  fetch(CONFIG.API_URL + "?view=chzzkbestclips").then(r => r.json())
])
  .then(([
    linksData,
    youtubeData,
    clipsData,
    hotClipsData,
    soopClipsData,
    soopHotClipsData,
    chzzkNewClipsData,
    chzzkBestClipsData
  ]) => {
    finishFakeProgress();

    playerLinksLastUpdated = linksData.lastUpdated || "";
    updated.textContent = playerLinksLastUpdated;

    playerLinksCache = linksData.playerLinks || [];
    playerLinksCacheTime = Date.now();

    youtubeCache = youtubeData.videos || [];
    youtubeCacheTime = Date.now();

    setClipCache_("twitch", clipsData.clips || []);
    setClipCache_("twitchhot", hotClipsData.clips || []);

    setClipCache_("soop", soopClipsData.clips || []);
    setClipCache_("soophot", soopHotClipsData.clips || []);

    setClipCache_("chzzknew", chzzkNewClipsData.clips || []);
    setClipCache_("chzzkbest", chzzkBestClipsData.clips || []);

    currentData = playerLinksCache;
    renderPlayerDetail(name, currentData);
  })
  .catch(error => {
    stopFakeProgress();
    console.error(error);
    app.innerHTML = `<p class="error">Failed to load player.</p>`;
  });
}

function renderPlayerDetail(name, players) {
  const player = players.find(p =>
    playerToSlug_(p.name) === name
  );

  if (!player) {
    app.innerHTML = `<p class="empty">Player not found.</p>`;
    return;
  }

  setPlayerSeo_(player);

  app.className = "";
  document.body.classList.add("player-detail-view");

  const aliasText =
    player.playerAlias
      ? player.playerAlias.replaceAll("|", " / ")
      : "";

  const latestVideo =
    youtubeCache?.find(v => v.name === player.name);

  const latestClip = [
    ...(clipCache.twitch.data || []),
    ...(clipCache.twitchhot.data || []),

    ...(clipCache.soop.data || []),
    ...(clipCache.soophot.data || []),

    ...(clipCache.chzzknew.data || []),
    ...(clipCache.chzzkbest.data || [])
  ]
    .filter(c => c.name === player.name)
    .sort((a, b) => {
      const aTime = new Date(a.date || 0).getTime();
      const bTime = new Date(b.date || 0).getTime();
      return bTime - aTime;
    })[0];

  app.innerHTML = `
    <div class="card player-detail-card">
    ${
      getTeamLogoPath_(player.team)
        ? `<img
            class="player-detail-team-logo"
            src="${getTeamLogoPath_(player.team)}"
            alt=""
            loading="lazy"
            onerror="this.remove()"
          >`
        : ""
    }
      <div class="player-detail-title-row">

        <div class="player-detail-name-wrap">

          <span
            class="favorite-star ${isFavorite_(player.name) ? "active" : ""}"
            data-favorite-name="${escapeHtml(player.name)}"
          >
            ${isFavorite_(player.name) ? "★" : "☆"}
          </span>

          <h2 class="player-detail-name">
            ${escapeHtml(player.name)}
          </h2>

        </div>

        <button
          class="player-menu-button"
          data-player-menu="${escapeHtml(player.name)}"
          aria-label="Player menu"
        >
          ⋮
        </button>

      </div>

      ${
        aliasText
          ? `<p class="player-detail-alias">${escapeHtml(aliasText)}</p>`
          : ""
      }

      <div class="player-detail-meta">
        <div>${escapeHtml(player.team || "-")}</div>
        <div>${escapeHtml(player.nationality || "-")}</div>
        <div>${escapeHtml(player.role || "-")}</div>
      </div>

      ${
        player.born
          ? `<div class="player-detail-birthday">
              Age ${getCurrentAgeFromBorn(player.born)} / Birthday ${player.born}
            </div>`
          : ""
      }

      <div class="team-player-links">
        ${linkTag(player.twitchUrl, "TW", player.twitchActive ? "tw" : "tw-inactive")}
        ${linkTag(player.chzzkUrl, "CHZ", "chz")}
        ${linkTag(player.soopUrl, "SOOP", "soop")}
        ${linkTag(player.biliUrl, "BILI", "bili")}
        ${linkTag(player.youtubeUrl, "YT", "yt")}
        ${linkTag(player.xUrl, "X", "x")}
        ${linkTag(player.discordUrl, "DC", "dc")}
      </div>

      <div class="player-detail-section">
        <h3>Latest Activity</h3>

        <div class="player-detail-activity">

          ${
            player.lastStreamUrl
              ? `
              <a
                class="last-stream-link"
                href="${player.lastStreamUrl}"
                target="_blank"
                rel="noopener"
              >
                ${renderPlatformIcons_(player.lastStreamPlatform)}
                <span>Last Stream · ${cleanLastStreamAge_(player.lastStreamAge)}</span>
              </a>
              `
              : `
              <span class="player-detail-empty">
                No recent stream
              </span>
              `
          }

          ${
            latestVideo
              ? `
              <a
                class="player-activity-card"
                href="${latestVideo.url}"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="player-activity-thumb"
                  src="${latestVideo.thumbnail}"
                  alt="${escapeHtml(latestVideo.rawTitle || latestVideo.titleJp || latestVideo.titleEn || latestVideo.titleKr || "")}"
                  loading="lazy"
                >

                <div class="player-activity-info">

                  <div class="player-activity-label">
                    <img class="platform-icon" src="/icons/youtube.png" alt="">
                    Latest YouTube
                  </div>

                  <div class="player-activity-title">
                    ${escapeHtml(latestVideo.rawTitle || latestVideo.titleJp || latestVideo.titleEn || latestVideo.titleKr || "")}
                  </div>

                  <div class="player-activity-time">
                    ${timeAgo(latestVideo.date)}
                  </div>

                </div>
              </a>
              `
              : ""
          }

          ${
            latestClip
              ? `
              <a
                class="player-activity-card"
                href="${latestClip.url}"
                target="_blank"
                rel="noopener"
              >
                <img
                  class="player-activity-thumb"
                  src="${latestClip.thumbnail}"
                  alt="${escapeHtml(
                    latestClip.rawTitle ||
                    latestClip.titleJp ||
                    latestClip.titleEn ||
                    latestClip.titleKr ||
                    ""
                  )}"
                  loading="lazy"
                >

                <div class="player-activity-info">

                  <div class="player-activity-label">
                    ${latestClip.platform ? renderPlatformIcons_(latestClip.platform) : "✂"}
                    Latest Clip
                  </div>

                  <div class="player-activity-title">
                    ${escapeHtml(
                      latestClip.rawTitle ||
                      latestClip.titleJp ||
                      latestClip.titleEn ||
                      latestClip.titleKr ||
                      ""
                    )}
                  </div>

                  <div class="player-activity-time">
                    ${timeAgo(latestClip.date)}
                  </div>

                </div>
              </a>
              `
              : ""
          }

        </div>
      </div>

      <p class="seo-note">
        ${escapeHtml(player.name)}
        ${aliasText ? `(${escapeHtml(aliasText)})` : ""}
        Overwatch player links: Twitch, YouTube, Discord, clips and stream information.
        ${escapeHtml(player.name)} の配信、YouTube、Discord、クリップ、選手情報を確認できます。
      </p>
    </div>
  `;
}

function setPlayerSeo_(player) {
  const name = player.name || "";
  const team = player.team || "Overwatch";
  const slug = playerToSlug_(name);

  const title =
    `${name} - ${team} Overwatch Player Profile | OW KITSUNE GUIDE`;

  const description =
    `${name} is a ${player.role || "Overwatch"} player from ${player.nationality || "unknown region"} currently playing for ${team}. View Twitch, YouTube, latest streams, clips, Discord and complete Overwatch player profile.`;

  document.title = title;

  pageTitle.textContent = player.name;

  setMeta_("description", description);

  setCanonical_(
    `${location.origin}/player/${slug}`
  );

  setPlayerJsonLd_(player);
  setPlayerOgp_(player, title, description);
}

function setPlayerJsonLd_(player) {
  const name = player.name || "";
  const slug = playerToSlug_(name);

  const sameAs = [
    player.twitchUrl,
    player.chzzkUrl,
    player.soopUrl,
    player.biliUrl,
    player.youtubeUrl,
    player.xUrl
  ].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "alternateName": player.playerAlias
      ? player.playerAlias.split("|").map(v => v.trim()).filter(Boolean)
      : undefined,
    "nationality": player.nationality || undefined,
    "birthDate": player.born || undefined,
    "url": `${location.origin}/player/${slug}`,
    "sameAs": sameAs.length ? sameAs : undefined,
    "memberOf": player.team
      ? {
          "@type": "SportsTeam",
          "name": player.team
        }
      : undefined
  };

  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });

  let script =
    document.querySelector('script[data-player-jsonld="true"]');

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.playerJsonld = "true";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

function setPlayerOgp_(player, title, description) {
  const slug = playerToSlug_(player.name || "");

  setOg_("og:title", title);
  setOg_("og:description", description);
  setOg_("og:url", `${location.origin}/player/${slug}`);
  setOg_("og:type", "profile");

  setOg_("twitter:card", "summary_large_image");
  setOg_("twitter:title", title);
  setOg_("twitter:description", description);
}
