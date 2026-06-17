const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

const updated = document.getElementById("updated");
const pageTitle = document.getElementById("pageTitle");
const voiceLine = document.getElementById("voiceLine");
const searchBox = document.getElementById("searchBox");

const params = new URLSearchParams(window.location.search);
let currentView = params.get("view") || "new";

let currentData = [];

const titles = {
  new: "NEW",
  viewers: "VIEWERS",
  kr: "KR",
  en: "EN",
  cn: "CN",
  jp: "JP",
  intl: "INTL",
  youtube: "YOUTUBE",
  playerlinks: "PLAYER LINKS"
};

const voiceLines = [
  "Kore ga atashi no narenohate da!",
  "Eyes on the skies!",
  "Deploying R.O.T.H. unit!",
  "Meoweoweew!!!",
  "Meeeeeooooowww!!!",
  "Protect us, kekkai!",
  "Noroi wo tachikire!",
  "Etsi ja tuhoa.",
  "Search and destroy.",
  "Mere mutabia chalo!",
  "Serve my design!",
  "Huoyu fen tian!",
  "Scorch the sky!",
  "Zhuque zhan chi!",
  "Rising from the ashes!",
  "Arriva la punizione!",
  "Retribution comes! Ha!",
  "Reverse the tide!",
  "Li wan kuang lan!",
  "The tide is with you! Dive in!",
  "Nu vanker der!",
  "Hunting them down!",
  "Tear it down!",
  "Bringing the rain!",
  "Welcome to orbit!",
  "Locking satellite vector!",
  "Excavation initiation!",
  "Plotting out the dig site!",
  "Se se'i koikiiki!",
  "We got them where we want them!",
  "Face the sunrise!",
  "Inti lluqsimun!",
  "Life protects life!",
  "Chii-wit bpok-bpaawng chii-wit!",
  "Suffer as I have!",
  "Rip them to pieces!",
  "Let the kitsune guide you!",
  "Kitsune no kagizume wo tokihanate!",
  "Time for the reckoning!",
  "Let's take him to the wasteland!",
  "This ends now!",
  "It's go time!",
  "Adaptive circuits engaged!",
  "Duplication initiated!",
  "Het universum zingt voor mij!",
  "What is that melody?",
  "Light them up!",
  "Vide bal sou yo!",
  "Bob, do something!",
  "Get in there, Bob!",
  "Area denied!",
  "Minefield deployed!",
  "Rally to me!",
  "Alla till mig!",
  "Surrender to my will!",
  "Geill do mo thoil!",
  "Meteor strike!",
  "Incoming!",
  "Pade ayanmo re! Ha!",
  "Meet your fate!",
  "¡Apagando las luces!",
  "EMP activated!",
  "You're powered up. Get in there!",
  "Nano boost administered!",
  "Warihum quwitak!",
  "Ryujin no ken wo kurae!",
  "The dragon becomes me!",
  "Dong zhu! Bu xu zou!",
  "Freeze! Don't move!",
  "Nerf this!",
  "Activating self-destruct sequence!",
  "Fire in the hole!",
  "Ladies and gentlemen, start your engines!",
  "Unloading scrap!",
  "Oh, let's break it. Damn!",
  "Vamos esculachar!",
  "I've got you in my sights!",
  "Tactical visor activated!",
  "It's high noon.",
  "Step right up!",
  "Ogon' po gotovnosti!",
  "Fire at will!",
  "Yahi param vaastavikta hai!",
  "Reality bends to my will!",
  "Experience tranquility!",
  "Pass into the Iris!",
  "Ryu ga waga teki wo kurau!",
  "Let the dragon consume you!",
  "Molten core!",
  "Molten floor!",
  "Setting out the welcome mat!",
  "Helden sterben nicht!",
  "Heroes never die!",
  "Hammer down!",
  "For the crusaders!",
  "Justice rains from above!",
  "Rocket barrage incoming!",
  "No one can hide from my sight.",
  "Personne n'echappe a mon regard.",
  "Die... die... die...",
  "Clearing the area.",
  "Bomb's ticking!",
  "Catch!",
  "Here goes nothing!",
  "Present for ya!",
  "Special delivery!",
  "Thought of you!",
  "Time to drop the bomb!",
  "Winging it!",
  "A perfect stick!",
  "Direct hit!",
  "Enjoy the detonation!",
  "Looks good on you!",
  "Right on the money!",
  "Spot on!",
  "Target locked!",
  "That's a stick!"
];

function setRandomVoiceLine() {
  if (!voiceLine) return;

  voiceLine.textContent =
    voiceLines[Math.floor(Math.random() * voiceLines.length)];
}

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
  app.innerHTML = `<p class="loading">🦊 My ultimate is charging...</p>`;
  pageTitle.textContent = titles[view] || view.toUpperCase();
  setRandomVoiceLine();

  fetch(CONFIG.API_URL + "?view=" + view)
    .then(res => res.json())
    .then(data => {
      updated.textContent = data.lastUpdated || "";

      if (data.counts) {
        updateAllButtonCounts(data.counts);
      }

      if (view === "youtube") {
        currentData = data.videos || [];
        renderYoutube(currentData);
      } else if (view === "playerlinks") {
        currentData = data.playerLinks || [];
        renderPlayerLinks(currentData);
      } else {
        currentData = data.players || [];
        renderLive(currentData);
      }
    })
    .catch(error => {
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
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
    [p.name, p.teamRegion, p.team, p.role, p.nationality]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

function renderLive(players) {
  app.className = "";

  if (!players.length) {
    app.innerHTML = `<p class="empty">No players found.</p>`;
    return;
  }

  app.innerHTML = players.map(p => `
    <a class="card-link" href="${p.url}" target="_blank" rel="noopener">
      <div class="card ${getLangClass(p)}">
        <div class="player-name">${p.name}</div>
        <div class="meta">${p.team || "-"} │ ${p.role || "-"} │ ${p.nationality || "-"}</div>
        <div class="stats">${p.platform}　🕓${p.liveFor}　🔥${Number(p.viewers || 0).toLocaleString()}</div>
        <div class="title">${p.title || ""}</div>
      </div>
    </a>
  `).join("");
}

function renderYoutube(videos) {
  app.className = "youtube-mode";

  if (!videos.length) {
    app.innerHTML = `<p class="empty">No videos found.</p>`;
    return;
  }

  app.innerHTML = videos.map(v => {
    const mainTitle = v.titleJp || v.rawTitle || v.titleEn || "";
    const subTitle = v.titleEn && v.titleEn !== mainTitle ? v.titleEn : "";

    return `
      <a class="card-link youtube-card-link" href="${v.url}" target="_blank" rel="noopener">
        <div class="youtube-card ${getNationalityRegionClass(v.nationality)}">
          ${v.thumbnail ? `<img class="youtube-thumb" src="${v.thumbnail}" loading="lazy" alt="">` : ""}

          <div class="youtube-info">
            <div class="youtube-title">${mainTitle}</div>
            ${subTitle ? `<div class="youtube-subtitle">${subTitle}</div>` : ""}

            <div class="youtube-player">${v.name || "-"}</div>
            <div class="youtube-meta">${v.team || "-"} │ ${v.role || "-"} │ ${v.nationality || "-"}</div>
            <div class="youtube-date">📅 ${v.date || "-"} ・ ${timeAgo(v.date)}</div>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

function renderPlayerLinks(players) {
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
    <div class="discord-note">
      ● DC links are Discord server home pages, not invite links. DCはDiscordサーバーのトップページです（招待リンクではありません）
    </div>

    <div class="player-table-wrap">
      <table class="player-table">
        <thead>
          <tr>
            <th class="sortable sorted-asc" data-sort="teamRegion">Region</th>
            <th class="sortable" data-sort="team">Team</th>
            <th class="sortable" data-sort="name">Name</th>
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
              data-team-region="${(p.teamRegion || "").toLowerCase()}"
              data-team="${(p.team || "").toLowerCase()}"
              data-name="${(p.name || "").toLowerCase()}"
              data-nationality="${(p.nationality || "").toLowerCase()}"
              data-role="${(p.role || "").toLowerCase()}"
            >
              <td>${p.teamRegion || ""}</td>
              <td>${p.team || ""}</td>
              <td>${p.name || ""}</td>
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

        if (aValue === "" && bValue !== "") return 1;
        if (aValue !== "" && bValue === "") return -1;
        if (aValue === "" && bValue === "") return 0;

        const result = aValue.localeCompare(bValue);
        return nextDir === "asc" ? result : -result;
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

function getLangClass(p) {
  const platform = String(p.platform || "");
  const language = String(p.language || "");

  if (platform.includes("CHZZK") || platform.includes("SOOP") || language === "KO") {
    return "lang-kr";
  }

  if (language === "JA") {
    return "lang-jp";
  }

  if (language === "EN") {
    return "lang-en";
  }

  if (platform.includes("BILIBILI")) {
    return "lang-cn";
  }

  return "lang-intl";
}

function linkDot(url, cls) {
  if (!url) return `<span class="no-link">-</span>`;
  return `<a class="${cls} link-dot" href="${url}" target="_blank" rel="noopener">●</a>`;
}

function getNationalityRegionClass(nationality) {
  const nat = String(nationality || "").toLowerCase();

  if (nat.includes("japan") || nat.includes("jp")) return "region-jp";
  if (nat.includes("south korea") || nat.includes("kr")) return "region-kr";
  if (nat.includes("china") || nat.includes("cn")) return "region-cn";

  const na = [
    "canada", "costa rica", "cuba", "dominican republic", "el salvador",
    "guatemala", "honduras", "jamaica", "mexico", "nicaragua",
    "panama", "us", "en"
  ];

  const pac = [
    "australia", "bangladesh", "brunei", "cambodia", "fiji",
    "hong kong", "india", "indonesia", "laos", "malaysia",
    "mongolia", "myanmar", "nepal", "new zealand", "pakistan",
    "papua new guinea", "philippines", "singapore", "sri lanka",
    "taiwan", "thailand", "timor-leste", "vietnam"
  ];

  const sa = [
    "argentina", "bolivia", "brazil", "chile", "colombia",
    "ecuador", "guyana", "paraguay", "peru", "suriname",
    "uruguay", "venezuela"
  ];

  const emea = [
    "albania", "algeria", "andorra", "armenia", "austria",
    "azerbaijan", "bahrain", "belgium", "belarus",
    "bosnia and herzegovina", "bulgaria", "croatia", "cyprus",
    "czech republic", "denmark", "egypt", "estonia", "finland",
    "france", "georgia", "germany", "greece", "hungary", "iraq",
    "ireland", "israel", "italy", "jordan", "kazakhstan",
    "kuwait", "latvia", "lebanon", "libya", "lithuania",
    "luxembourg", "malta", "morocco", "netherlands", "norway",
    "oman", "palestine", "poland", "portugal", "qatar",
    "romania", "saudi arabia", "serbia", "slovakia", "slovenia",
    "south africa", "spain", "sweden", "switzerland", "syria",
    "tunisia", "turkey", "ukraine", "united arab emirates",
    "uk", "yemen"
  ];

  if (na.some(x => nat.includes(x))) return "region-na";
  if (pac.some(x => nat.includes(x))) return "region-pac";
  if (sa.some(x => nat.includes(x))) return "region-sa";
  if (emea.some(x => nat.includes(x))) return "region-emea";

  return "region-unknown";
}

function timeAgo(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;

  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `${h} hour${h > 1 ? "s" : ""} ago`;
  }

  if (diff < 604800) {
    const d = Math.floor(diff / 86400);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }

  if (diff < 2592000) {
    const w = Math.floor(diff / 604800);
    return `${w} week${w > 1 ? "s" : ""} ago`;
  }

  if (diff < 31536000) {
    const m = Math.floor(diff / 2592000);
    return `${m} month${m > 1 ? "s" : ""} ago`;
  }

  const y = Math.floor(diff / 31536000);
  return `${y} year${y > 1 ? "s" : ""} ago`;
}

function updateAllButtonCounts(counts) {
  Object.entries(titles).forEach(([key, label]) => {
    const button = document.querySelector(`.nav button[data-view="${key}"]`);
    if (!button) return;

    const count = counts[key] ?? "";
    button.textContent = `${label} (${count})`;
  });
}

loadView(currentView);
