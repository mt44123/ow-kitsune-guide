function loadTeamsView(openFromUrl = false) {
  document.body.classList.remove("player-detail-view");

  const now = Date.now();

  resetSeo_();

  pageTitle.textContent = "TEAMS";
  setRandomVoiceLine();

  viewNote.textContent = "";

  if (
    playerLinksCache &&
    now - playerLinksCacheTime < PLAYER_LINKS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent = playerLinksLastUpdated;

    currentData = playerLinksCache;

    if (openFromUrl) {
      openTeamFromUrl_();
    } else {
      renderTeams(currentData);
    }

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

      playerLinksLastUpdated =
        data.lastUpdated || "";

      updated.textContent =
        playerLinksLastUpdated;

      playerLinksCache =
        data.playerLinks || [];

      playerLinksCacheTime =
        Date.now();

      currentData = playerLinksCache;

      if (openFromUrl) {
        openTeamFromUrl_();
      } else {
        renderTeams(currentData);
      }
      
      applyCurrentSearch_();
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML =
        `<p class="error">Failed to load data.</p>`;

      console.error(error);
    });
}

function renderLiquipediaNote_(showClickNote = true) {
  return `
    <div class="discord-note">

      ${
        showClickNote
          ? siteText_(
              `<p>*Click player or team names to open Liquipedia.</p>`,
              `<p>※プレイヤー・チーム名をクリックするとLiquipediaを開きます。</p>`
            )
          : ""
      }

      <details class="playerlinks-help">
        <summary>More Info</summary>

        ${siteText_(
          `<p>*DC links are Discord server home pages, not invite links.</p>`,
          `<p>※DCはDiscordサーバーのトップページです（招待リンクではありません）。</p>`
        )}

        ${siteText_(
          `<p>*If the Discord app is installed on your mobile device, the link may only open the app and not navigate to the server.</p>`,
          `<p>※Discordアプリがインストールされている場合、アプリが開くだけでサーバーへ移動しないことがあります。</p>`
        )}

        ${siteText_(
          `<p>Some player and team information is sourced from Liquipedia.</p>`,
          `<p>一部のプレイヤー情報・チーム情報はLiquipediaを参考にしています。</p>`
        )}

      </details>
    </div>
  `;
}

function renderTeams(players) {
  document.body.classList.remove("player-detail-view");

  app.className = "teams-mode";

  const regions = buildTeamRegions_(players);

  if (!regions.length) {
    app.innerHTML = `<p class="empty">No regions found.</p>`;
    return;
  }

  app.innerHTML = regions.map(region => `
    <button
      class="team-card ${getTeamRegionClass(region.name)}"
      data-region="${escapeHtml(region.name)}"
    >
      <div class="team-card-name">
        ${escapeHtml(region.name)}
      </div>

      <div class="team-card-meta">
        ${region.teamCount} teams / ${region.playerCount} players
      </div>
    </button>
  `).join("");

  document.querySelectorAll(".team-card").forEach(button => {
    button.addEventListener("click", () => {
      const region = button.dataset.region;

      if (region === "Official OWCS") {
        renderTeamPlayers(
          "Overwatch_Champions_Series",
          players,
          "Official OWCS"
        );
        return;
      }

      renderRegionTeams(region, players);
    });
  });
}

function buildTeams_(players) {
  const map = new Map();

  players.forEach(p => {

  if (!isTeamListMember_(p)) return;

    const team = String(p.team || "").trim();
    if (!team || team === "-") return;

    if (!map.has(team)) {
      map.set(team, {
        name: team,
        region: "",
        count: 0
      });
    }
    
    const item = map.get(team);
    const normalizedRegion = normalizeTeamRegion_(p.teamRegion, team);
    
    if (normalizedRegion && !item.region) {
      item.region = normalizedRegion;
    }
    
    item.count++;
  });

  return Array.from(map.values())
    .sort((a, b) => {
      const regionCompare =
        String(a.region || "").localeCompare(String(b.region || ""));

      if (regionCompare !== 0) return regionCompare;

      return String(a.name || "").localeCompare(String(b.name || ""));
    });
}

function isTeamListMember_(p) {
  const region = String(p.teamRegion || "")
    .replace(/^●\s*/, "")
    .trim();

  return (
    region !== "★OWCS Creator" &&
    region !== "● Team Official" &&
    region !== "HERO"
  );
}

function normalizeTeamRegion_(region, team = "") {

  region = String(region || "")
    .replace(/^●\s*/, "")
    .trim();

  if (region === "★OWCS Creator") {
    return null;
  }

  team = String(team || "").trim();

  if ([
    "Official OWCS",
    "KR",
    "JP",
    "PAC",
    "CN",
    "NA",
    "EMEA",
    "SA"
  ].includes(region)) {
    return region;
  }

  if (team === "VARREL") return "JP";

  return null;
}

function buildTeamRegions_(players) {
  const map = new Map();

  players.forEach(p => {

  if (!isTeamListMember_(p)) return;

  const region =
    normalizeTeamRegion_(p.teamRegion, p.team)
    
    if (!region) return;

    const team =
      String(p.team || "").trim();

    if (!team || team === "-") return;

    if (!map.has(region)) {
      map.set(region, {
        name: region,
        teams: new Set(),
        playerCount: 0
      });
    }

    map.get(region).teams.add(team);
    map.get(region).playerCount++;
  });

   const order = {
    "Official OWCS": 1,
    KR: 2,
    JP: 3,
    PAC: 4,
    CN: 5,
    NA: 6,
    EMEA: 7,
    SA: 8
  };

  return Array.from(map.values())
    .map(r => ({
      name: r.name,
      teamCount: r.teams.size,
      playerCount: r.playerCount
    }))
    .sort((a, b) =>
      (order[a.name] || 999) -
      (order[b.name] || 999)
    );
}

function renderRegionTeams(regionName, players) {
  document.body.classList.remove("player-detail-view");

  app.className = "teams-mode";

  const teams = buildTeams_(players)
    .filter(team => {
      const region = normalizeTeamRegion_(team.region, team.name)
  
      return region === regionName;
    });

  app.innerHTML = `
    <button class="team-back-button" id="regionBackButton">
      ← Back to Regions
    </button>

    ${teams.map(team => `
      <button
        class="team-card ${getTeamRegionClass(team.region, team.name)}"
        data-team="${escapeHtml(team.name)}"
      >
        <div class="team-card-logo-wrap">
          <img
            class="team-card-logo"
            src="${getTeamLogoPath_(team.name)}"
            alt=""
            onerror="this.style.display='none'"
          >
        </div>

        <div class="team-card-name">
          ${escapeHtml(team.name)}
        </div>

        <div class="team-card-meta">
          ${escapeHtml(team.region || "-")} / ${team.count} players
        </div>
      </button>
    `).join("")}
  `;

  document.getElementById("regionBackButton")
    ?.addEventListener("click", () => {
      renderTeams(players);
    });

  document.querySelectorAll(".team-card").forEach(button => {
    button.addEventListener("click", () => {
      renderTeamPlayers(button.dataset.team, players, regionName);
    });
  });
}

function renderTeamPlayers(teamName, players, regionName = null, updateUrl = true) {

  currentTeamName = teamName;
  currentRegionName = regionName;

  if (updateUrl) {
    history.pushState(
      {},
      "",
      `/team/${teamToSlug_(teamName)}`
    );
  }

  setTeamSeo_(teamName);

  app.className = "team-detail-mode";
  
  const official = players.find(
    p =>
      p.teamRegion === "● Team Official" &&
      p.team === teamName
  );

  const members = players
    .filter(
      p =>
        p.team === teamName &&
        isTeamListMember_(p)
    )
    .sort((a, b) => {

      const roleOrder = {
        TANK: 1,
        DPS: 2,
        SUP: 3,
        COACH: 4
      };

      const roleA =
        String(a.role || "")
          .replace(/[^\p{L}\p{N}]/gu, "");

      const roleB =
        String(b.role || "")
          .replace(/[^\p{L}\p{N}]/gu, "");

      return (
        (roleOrder[roleA] || 99) -
        (roleOrder[roleB] || 99)
      );
    });

  const favSet = new Set(getFavorites_());

  const teamAlias =
    official?.teamAlias ||
    members[0]?.teamAlias ||
    "";

  app.innerHTML = `
    ${renderLiquipediaNote_(true)}

    <button class="team-back-button" id="teamBackButton">
      ← Back to Teams
    </button>

    <div class="team-detail-card ${getTeamRegionClass(members[0]?.teamRegion, teamName)}">
      <div class="team-detail-title">
        <a
          class="team-link"
          href="https://liquipedia.net/overwatch/${encodeURIComponent(teamName)}"
          target="_blank"
          rel="noopener"
        >
          ${escapeHtml(teamName)}
        </a>
      </div>

      <div class="team-official-links">
        ${
          official
            ? `
                ${linkTag(official.youtubeUrl, "", "yt")}
                ${linkTag(official.twitchUrl, "", "tw")}
                ${linkTag(official.chzzkUrl, "", "chz")}
                ${linkTag(official.soopUrl, "", "soop")}
                ${linkTag(official.biliUrl, "", "bili")}
                ${linkTag(official.xUrl, "", "x")}
                ${linkTag(official.instagramUrl, "", "ig")}
                ${linkTag(official.discordUrl, "", "dc")}
              `
            : ""
        }
      </div>

      <div class="team-detail-meta">
        ${escapeHtml(members[0]?.teamRegion || "-")} / Team
      </div>

      <div class="team-player-table">

        <div class="team-player-header desktop-only">
          <div>Name</div>
          <div>Nat</div>
          <div>Age (Born)</div>
          <div>Role</div>
          <div>Last Stream</div>
          <div>Links</div>
        </div>

        ${members.map(p => {
          const age =
            p.born
              ? (isUnknownBirthYear_(p.born) ? "-" : getCurrentAgeFromBorn(p.born))
              : "-";

          const born =
            p.born
              ? ` (${isUnknownBirthYear_(p.born) ? formatHeroBirthday_(p.born) : p.born})`
              : "";
          const isFav = favSet.has(p.name);

          return `
            <div class="team-player-card-row">

              <div class="team-player-name">

                <span
                  class="favorite-star ${isFav ? "active" : ""}"
                  data-favorite-name="${escapeHtml(p.name || "")}"
                >
                  ${isFav ? "★" : "☆"}
                </span>
              
                <a
                  class="player-name-link"
                  href="#"
                  data-player="${escapeHtml(p.name)}"
                  onclick="return false;"
                >
                  ${escapeHtml(p.name || "-")}
                </a>
                      
              </div>

              <div class="team-player-nat">
                ${escapeHtml(shortNationality(p.nationality || "-"))}
              </div>
              
              <div class="team-player-age">
                ${age}${born}
              </div>
              
              <div class="team-player-role">
                ${escapeHtml(p.role || "-")}
              </div>

              <div class="team-player-last">
                ${
                  p.lastStreamUrl
                    ? `<a class="last-stream-link" href="${p.lastStreamUrl}" target="_blank" rel="noopener">
                        ${renderPlatformIcons_(p.lastStreamPlatform)}
                        <span>${cleanLastStreamAge_(p.lastStreamAge)}</span>
                      </a>`
                    : "-"
                }
              </div>

              <div class="team-player-links">
                ${linkTag(
                  p.twitchUrl,
                  "TW",
                  p.twitchActive ? "tw" : "tw-inactive"
                )}
                ${linkTag(p.chzzkUrl, "CHZ", "chz")}
                ${linkTag(p.soopUrl, "SOOP", "soop")}
                ${linkTag(p.biliUrl, "BILI", "bili")}
                ${linkTag(p.youtubeUrl, "YT", "yt")}
                ${linkTag(p.xUrl, "X", "x")}
                ${linkTag(p.instagramUrl, "IG", "ig")}
                ${linkTag(p.discordUrl, "DC", "dc")}
              </div>

            </div>
          `;
        }).join("")}

      </div>

      <p class="seo-note">
        ${escapeHtml(teamName)}
        ${teamAlias ? ` (${escapeHtml(teamAlias)})` : ""}
        is an Overwatch team.
        Team roster with Twitch, CHZZK, SOOP, Bilibili, YouTube, X, Instagram, Discord, live streams and player information.

        ${escapeHtml(teamName)}
        ${teamAlias ? `（${escapeHtml(teamAlias)}）` : ""}
        はOverwatchチームです。
        所属選手、Twitch、CHZZK、SOOP、Bilibili、YouTube、X、Instagram、Discord、配信、選手情報をまとめて確認できます。
      </p>

    </div>
  `;

  document
    .getElementById("teamBackButton")
    ?.addEventListener("click", () => {
      if (regionName) {
        renderRegionTeams(regionName, players);
      } else {
        renderTeams(players);
      }
    });
}

function setTeamSeo_(teamName) {
  const slug = teamToSlug_(teamName);

  const title =
    `${teamName} Players | OW KITSUNE GUIDE`;

  const description =
    `${teamName} Overwatch roster, live streams, YouTube videos, clips, player links and latest activity.`;

  document.title = title;

  pageTitle.textContent = teamName;

  setMeta_("description", description);

  setCanonical_(
    `${location.origin}/team/${slug}`
  );

  setOg_("og:title", title);
  setOg_("og:description", description);
  setOg_("og:url", `${location.origin}/team/${slug}`);
  setOg_("og:type", "website");

  setOg_("twitter:card", "summary_large_image");
  setOg_("twitter:title", title);
  setOg_("twitter:description", description);

  setTeamJsonLd_(teamName);
}

function setTeamJsonLd_(teamName) {
  const slug = teamToSlug_(teamName);

  const data = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": teamName,
    "url": `${location.origin}/team/${slug}`
  };

  let script =
    document.querySelector('script[data-team-jsonld="true"]');

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.teamJsonld = "true";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}