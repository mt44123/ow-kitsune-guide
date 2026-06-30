function loadTeamsView() {
  const now = Date.now();

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
    renderTeams(currentData);
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

      renderTeams(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML =
        `<p class="error">Failed to load data.</p>`;

      console.error(error);
    });
}

function renderLiquipediaNote_() {
  return `
    <div class="discord-note">
       <p>
      *Click player or team names to open Liquipedia.<br>
      プレイヤー・チーム名をクリックしてLiquipediaを開きます。
      </p>
      
      <details class="playerlinks-help">
        <summary>More Info / 詳細</summary>
  
        <p>
        *DC links are Discord server home pages, not invite links.<br>
        DCはDiscordサーバーのトップページです（招待リンクではありません）
        </p>
  
        <p>
        *If the Discord app is installed on your mobile device, the link may only open the app and not navigate to the server.<br>
        Discordアプリがインストールされている場合、アプリが開くだけでサーバーへ移動しないことがあります。
        </p>
        
        <p>Some player and team information is sourced from Liquipedia.<br>
        Special thanks to the Liquipedia contributors who help keep esports history alive.<br>
        一部のプレイヤー情報・チーム情報はLiquipediaを参考にしています。<br>
        eスポーツの歴史を支えているLiquipedia編集者の皆様に感謝します。</p>
        </details>
    </div>
  `;
}

function renderTeams(players) {
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

function renderTeamPlayers(teamName, players, regionName = null) {

  currentTeamName = teamName;
  currentRegionName = regionName;

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

  app.innerHTML = `
    ${renderLiquipediaNote_()}

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
    const age = p.born ? getCurrentAgeFromBorn(p.born) : "-";
    const born = p.born ? ` (${p.born})` : "";

    return `
      <div class="team-player-card-row">

        <div class="team-player-name">

          <span
            class="favorite-star ${isFavorite_(p.name) ? "active" : ""}"
            data-favorite-name="${escapeHtml(p.name || "")}"
          >
            ${isFavorite_(p.name) ? "★" : "☆"}
          </span>
        
          <a
            class="player-name-link"
            href="https://liquipedia.net/overwatch/${encodeURIComponent(p.name || "")}"
            target="_blank"
            rel="noopener"
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
        ${linkTag(p.discordUrl, "DC", "dc")}
        </div>

      </div>
    `;
  }).join("")}

</div>
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

