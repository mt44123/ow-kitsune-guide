function loadPlayerLinksView() {
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
            
              <a
                class="player-name-link"
                href="https://liquipedia.net/overwatch/${encodeURIComponent(p.name || "")}"
                target="_blank"
                rel="noopener"
              >
                ${p.name || ""}
              </a>
            
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
      row.dataset.name,
      row.dataset.nationality,
      row.dataset.role
    ].join(" ");

    row.style.display =
      matchesSearch_(haystack, query)
        ? ""
        : "none";
  });
}
