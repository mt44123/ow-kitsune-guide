const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

const updated = document.getElementById("updated");
const searchBox = document.getElementById("searchBox");

const params = new URLSearchParams(window.location.search);
let currentView = params.get("view") || "new";

let currentData = [];

document.querySelectorAll(".nav button").forEach(button => {
  if (button.dataset.view === currentView) {
    button.classList.add("active");
  } else {
    button.classList.remove("active");
  }

  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    searchBox.value = "";

    history.replaceState({}, "", "?view=" + currentView);

    document.querySelectorAll(".nav button").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");

    loadView(currentView);
  });
});

searchBox.addEventListener("input", () => {
  if (currentView === "youtube") {
    renderYoutube(filterYoutube(currentData));
  } else if (currentView === "playerlinks") {
    renderPlayerLinks(filterPlayerLinks(currentData));
  } else {
    renderLive(filterPlayers(currentData));
  }
});

function loadView(view) {
  app.innerHTML = "<p style='color:#aaa;'>Loading...</p>";

  fetch(CONFIG.API_URL + "?view=" + view)
    .then(res => res.json())
    .then(data => {
      updated.textContent = data.lastUpdated || "";

      if (view === "youtube") {
        currentData = data.videos || [];
        updateButtonCount(view, currentData.length);
        renderYoutube(currentData);
      } else if (view === "playerlinks") {
        currentData = data.playerLinks || [];
        updateButtonCount(view, currentData.length);
        renderPlayerLinks(currentData);
      } else {
        currentData = data.players || [];
        updateButtonCount(view, currentData.length);
        renderLive(currentData);
      }
    })
    .catch(error => {
      app.innerHTML = "<p style='color:#f99e1a;'>Failed to load data.</p>";
      console.error(error);
    });
}

function filterPlayers(players) {
  const keyword = searchBox.value.toLowerCase().trim();
  if (!keyword) return players;

  return players.filter(p =>
    [p.name, p.team, p.role, p.nationality, p.platform, p.title]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

function filterYoutube(videos) {
  const keyword = searchBox.value.toLowerCase().trim();
  if (!keyword) return videos;

  return videos.filter(v =>
    [v.name, v.team, v.role, v.nationality, v.rawTitle, v.titleJp, v.titleEn, v.date]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

function filterPlayerLinks(players) {
  const keyword = searchBox.value.toLowerCase().trim();
  if (!keyword) return players;

  return players.filter(p =>
    [p.name, p.team, p.role, p.nationality]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

function renderLive(players) {
  app.className = "";

  if (!players.length) {
    app.innerHTML = "<p style='color:#aaa;'>No players found.</p>";
    return;
  }

  app.innerHTML = players.map(p => `
    <a class="card-link" href="${p.url}" target="_blank" rel="noopener">
      <div class="card">
        <div class="player-name">${p.name}</div>
        <div class="meta">${p.team || "-"} │ ${p.role || "-"} │ ${p.nationality || "-"}</div>
        <div class="stats">${p.platform}　🕓${p.liveFor}　🔥${Number(p.viewers || 0).toLocaleString()}</div>
        <div class="title">${p.title || ""}</div>
      </div>
    </a>
  `).join("");
}

function renderYoutube(videos) {
  app.className = "";

  if (!videos.length) {
    app.innerHTML = "<p style='color:#aaa;'>No videos found.</p>";
    return;
  }

  app.innerHTML = videos.map(v => {
    const mainTitle = v.titleJp || v.rawTitle || v.titleEn || "";

    return `
      <a class="card-link" href="${v.url}" target="_blank" rel="noopener">
        <div class="card">
          ${v.thumbnail ? `<img class="thumb" src="${v.thumbnail}" loading="lazy">` : ""}
          <div class="player-name">${v.name}</div>
          <div class="meta">${v.team || "-"} │ ${v.role || "-"} │ ${v.nationality || "-"}</div>
          <div class="title">${mainTitle}</div>
          <div class="stats">📅 ${v.date}</div>
        </div>
      </a>
    `;
  }).join("");
}

function renderPlayerLinks(players) {
  app.className = "table-mode";

  if (!players.length) {
    app.innerHTML = "<p style='color:#aaa;'>No player links found.</p>";
    return;
  }

  app.innerHTML = `
    <div class="player-table-wrap">
      <table class="player-table">
        <thead>
          <tr>
            <th class="sortable" data-sort="name">Name</th>
            <th class="sortable" data-sort="team">Team</th>
            <th class="sortable" data-sort="nationality">Nat</th>
            <th class="sortable" data-sort="role">Role</th>
            <th>TW</th>
            <th>CHZ</th>
            <th>SOOP</th>
            <th>BILI</th>
            <th>YT</th>
            <th>DC*</th>
          </tr>
        </thead>
        <tbody>
          ${players.map(p => `
            <tr
              data-name="${(p.name || "").toLowerCase()}"
              data-team="${(p.team || "").toLowerCase()}"
              data-nationality="${(p.nationality || "").toLowerCase()}"
              data-role="${(p.role || "").toLowerCase()}"
            >
              <td>${p.name || ""}</td>
              <td>${p.team || ""}</td>
              <td>${p.nationality || ""}</td>
              <td>${p.role || ""}</td>
              <td>${linkDot(p.twitchUrl, "tw")}</td>
              <td>${linkDot(p.chzzkUrl, "chz")}</td>
              <td>${linkDot(p.soopUrl, "soop")}</td>
              <td>${linkDot(p.biliUrl, "bili")}</td>
              <td>${linkDot(p.youtubeUrl, "yt")}</td>
              <td>${linkDot(p.discordUrl, "dc")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  setupPlayerLinksSort();
}

function setupPlayerLinksSort() {
  document.querySelectorAll(".player-table th.sortable").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      const tbody = document.querySelector(".player-table tbody");
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll("tr"));

      const currentDir = th.dataset.dir || "desc";
      const nextDir = currentDir === "asc" ? "desc" : "asc";

      document.querySelectorAll(".player-table th.sortable").forEach(h => {
        h.dataset.dir = "";
        h.classList.remove("sorted-asc", "sorted-desc");
      });

      th.dataset.dir = nextDir;
      th.classList.add(nextDir === "asc" ? "sorted-asc" : "sorted-desc");

      rows.sort((a, b) => {
        const aValue = a.dataset[key] || "";
        const bValue = b.dataset[key] || "";

        const result = aValue.localeCompare(bValue);
        return nextDir === "asc" ? result : -result;
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

function linkDot(url, cls) {
  if (!url) return `<span class="no-link">-</span>`;
  return `<a class="${cls} link-dot" href="${url}" target="_blank" rel="noopener">●</a>`;
}

function updateButtonCount(view, count) {
  const button = document.querySelector(`.nav button[data-view="${view}"]`);
  if (!button) return;

  const labels = {
    new: "NEW",
    viewers: "VIEWERS",
    kr: "KR",
    jp: "JP",
    en: "EN",
    cn: "CN",
    youtube: "YOUTUBE",
    playerlinks: "PLAYER LINKS"
  };

  button.textContent = `${labels[view] || view.toUpperCase()} (${count})`;
}

loadView(currentView);
