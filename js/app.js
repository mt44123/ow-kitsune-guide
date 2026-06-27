const app = document.getElementById("app");
const updated = document.getElementById("updated");
const viewNote = document.getElementById("viewNote");
const pageTitle = document.getElementById("pageTitle");
const voiceLine = document.getElementById("voiceLine");
const voiceActor = document.getElementById("voiceActor");
const viewActionButton = document.getElementById("viewActionButton");

speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};

voiceLine?.addEventListener(
  "click",
  speakCurrentVoiceLine_
);

const searchBox = document.getElementById("searchBox");

function matchesSearch_(haystack, query) {
  const tokens = String(query || "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return true;

  const include = [];
  const exclude = [];

  tokens.forEach(token => {
    if (token.startsWith("-") && token.length > 1) {
      exclude.push(token.slice(1));
    } else {
      include.push(token);
    }
  });

  const text = String(haystack || "").toLowerCase();

  return (
    include.every(word => text.includes(word)) &&
    exclude.every(word => !text.includes(word))
  );
}

const toolsButton =  document.getElementById("toolsButton");
const faqButton =  document.getElementById("faqButton");

const notifyButton =  document.getElementById("notifyButton");
const settingsButton =  document.getElementById("settingsButton");
const settingsMenu =  document.getElementById("settingsMenu");

const themeSelect = document.getElementById("themeSelect");

function applyTheme_(theme) {
  document.body.classList.remove(
    "light-theme",
    "theme-midnight"
  );

  if (theme === "light") {
    document.body.classList.add("light-theme");
  }

  if (theme === "midnight") {
    document.body.classList.add("theme-midnight");
  }

  if (themeSelect) {
    themeSelect.value = theme;
  }
}

let currentTheme =
  localStorage.getItem("theme") || "dark";

applyTheme_(currentTheme);

themeSelect?.addEventListener("change", () => {
  currentTheme = themeSelect.value;

  localStorage.setItem("theme", currentTheme);

  applyTheme_(currentTheme);
});

let liveTitleMode =
  localStorage.getItem("liveTitleMode") || "full";

function applyLiveTitleMode_() {
  document.body.classList.remove(
    "short-live-title",
    "hide-live-title"
  );

  if (liveTitleMode === "short") {
    document.body.classList.add("short-live-title");
  }

  if (liveTitleMode === "off") {
    document.body.classList.add("hide-live-title");
  }
}

applyLiveTitleMode_();

let youtubeLayout =
  localStorage.getItem("youtubeLayout") || "grid";

function applyYoutubeLayout_() {
  document.body.classList.toggle(
    "youtube-list-layout",
    youtubeLayout === "list"
  );
}

applyYoutubeLayout_();

let clipLayout =
  localStorage.getItem("clipLayout") || "grid";

function applyClipLayout_() {
  document.body.classList.toggle(
    "clip-list-layout",
    clipLayout === "list"
  );
}

applyClipLayout_();

function updateViewActionButton_(view = currentView) {
  if (!viewActionButton) return;

  if (isLiveView(view)) {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      liveTitleMode === "full"
        ? "📝 Full"
        : liveTitleMode === "short"
          ? "📝 Short"
          : "📝 Off";

    return;
  }

  if (isYoutubeView(view)) {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      youtubeLayout === "grid"
        ? "▦ Grid"
        : "☰ List";

    return;
  }

  if (isClipView(view)) {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      clipLayout === "grid"
        ? "▦ Grid"
        : "☰ List";

    return;
  }

  viewActionButton.hidden = true;
  viewActionButton.textContent = "";
}

function updateFavoriteCounts_() {
  const favs = getFavorites_();

  const favoriteCount = favs.length;

  const livePlayers = liveCache?.players || [];

  const liveCount = livePlayers.filter(
    p => favs.includes(p.name)
  ).length;

  document
    .querySelectorAll(
      '[data-view="goats"], [data-view="youtubegoats"], [data-view="goatclips"], [data-view="favorites"]'
    )
    .forEach(btn => {
      switch (btn.dataset.view) {
        case "goats":
          btn.textContent = `★ (${liveCount})`;
          break;

        case "favorites":
          btn.textContent = `★ (${favoriteCount})`;
          break;

        default:
          btn.textContent = "★";
      }
    });
}

settingsButton?.addEventListener(
  "click",
  e => {
    e.stopPropagation();

    settingsMenu?.classList.toggle(
      "settings-hidden"
    );
  }
);

document.addEventListener(
  "click",
  e => {
    if (
      settingsMenu &&
      !settingsMenu.contains(e.target) &&
      e.target !== settingsButton
    ) {
      settingsMenu.classList.add(
        "settings-hidden"
      );
    }
  }
);

viewActionButton?.addEventListener("click", () => {
  if (isLiveView(currentView)) {
    liveTitleMode =
      liveTitleMode === "full"
        ? "short"
        : liveTitleMode === "short"
          ? "off"
          : "full";

    localStorage.setItem("liveTitleMode", liveTitleMode);

    applyLiveTitleMode_();
    updateViewActionButton_();
    renderLive(currentData);
    return;
  }

  if (isYoutubeView(currentView)) {
    youtubeLayout =
      youtubeLayout === "grid"
        ? "list"
        : "grid";

    localStorage.setItem("youtubeLayout", youtubeLayout);

    applyYoutubeLayout_();
    updateViewActionButton_();
    renderYoutube(currentData);
    return;
  }

  if (isClipView(currentView)) {
    clipLayout =
      clipLayout === "grid"
        ? "list"
        : "grid";

    localStorage.setItem("clipLayout", clipLayout);

    applyClipLayout_();
    updateViewActionButton_();
    renderClips(currentData);
  }
});

toolsButton?.addEventListener(
  "click",
  () => loadToolsView()
);

faqButton?.addEventListener(
  "click",
  () => loadFaqView()
);

const params = new URLSearchParams(window.location.search);

let currentView = params.get("view") || "new";

let currentRoleFilter =
  localStorage.getItem("roleFilter") || "all";

let currentData = [];
let requestId = 0;

const progressSets = [
  [0, 8, 21, 39, 58, 77, 95],
  [0, 12, 28, 47, 66, 84, 96],
  [0, 15, 31, 52, 70, 87, 97],
  [0, 10, 24, 43, 63, 81, 98]
];

let progressSteps =
  progressSets[Math.floor(Math.random() * progressSets.length)];

let progressTimer = null;
let progressIndex = 0;

let liveCache = null;
let liveCacheTime = 0;
const LIVE_CLIENT_CACHE_MS = 60 * 1000;

let playerLinksCache = null;
let playerLinksCacheTime = 0;
const PLAYER_LINKS_CLIENT_CACHE_MS =  6 * 60 * 60 * 1000;

const clipCache = {
  twitch: { data: null, time: 0 },
  twitchhot: { data: null, time: 0 },
  soop: { data: null, time: 0 },
  chzzknew: { data: null, time: 0 },
  chzzkbest: { data: null, time: 0 }
};

const CLIPS_CLIENT_CACHE_MS = 6 * 60 * 60 * 1000;

let youtubeCache = null;
let youtubeCacheTime = 0;
const YOUTUBE_CLIENT_CACHE_MS =  30 * 60 * 1000;
let youtubeLastUpdated = "";
const clipLastUpdated = {};

let currentTeamName = "";
let currentRegionName = null;

let birthdaysCache = null;
let birthdaysCacheTime = 0;
const BIRTHDAYS_CLIENT_CACHE_MS = 6 * 60 * 60 * 1000;

let playerLinksLastUpdated = "";

function startFakeProgress() {
  progressSteps =
    progressSets[
      Math.floor(Math.random() * progressSets.length)
    ];

  progressIndex = 0;
  clearInterval(progressTimer);

  app.innerHTML =
    `<p class="loading">🦊 My ultimate is charging... ${progressSteps[0]}%</p>`;

  progressTimer = setInterval(() => {
    if (progressIndex >= progressSteps.length - 1) return;

    progressIndex++;

    app.innerHTML =
      `<p class="loading">🦊 My ultimate is charging... ${progressSteps[progressIndex]}%</p>`;
  }, 700);
}

function finishFakeProgress() {
  clearInterval(progressTimer);

  app.innerHTML =
    `<p class="loading">🦊 My ultimate is charging... 100%</p>`;
}

function stopFakeProgress() {
  clearInterval(progressTimer);
}

const titles = {
  new: "NEW",
  goats: "★MY GOATS",
  viewers: "HOT",
  kr: "KR",
  en: "EN",
  cn: "CN",
  jp: "JP",
  intl: "INTL",
  
  youtube: "NEW",
  youtubegoats: "★MY GOATS",
  youtubehot: "HOT",
  youtubejp: "JP",

  clips: "NEW",
  goatclips: "★MY GOATS",
  hotclips: "HOT",
  jpclips: "JP",
  soopclips: "SOOP NEW",
  soophotclips: "SOOP HOT",
  
  chzzknewclips: "CHZZK NEW",
  chzzkhotclips: "CHZZK HOT",
  chzzkbestclips: "CHZZK BEST",

  teams: "TEAMS",
  playerlinks: "ALL",
  birthdays: "BIRTHDAYS",
  favorites: "★MY GOATS"
  };

let voiceLines = [];

function setRandomVoiceLine() {
  if (!voiceLine) return;
  if (!voiceLines.length) return;

  const line =
    voiceLines[
      Math.floor(Math.random() * voiceLines.length)
    ];

  voiceLine.dataset.voice = line.text;
  voiceLine.dataset.lang = line.lang;
  voiceLine.dataset.hero = line.hero || "";

  voiceLine.textContent =
    "🎙️ " + line.text;
}

function speakCurrentVoiceLine_() {
  const text =
    voiceLine?.dataset.voice ||
    voiceLine?.textContent.trim();

  if (!text) return;

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  const voices =
    speechSynthesis.getVoices();

  if (voices.length) {
    const voice =
      voices[Math.floor(
        Math.random() * voices.length
      )];

    utterance.voice = voice;

    if (voiceActor) {
      voiceActor.textContent =
        `${voice.name} (${voice.lang})`;
    }

  } else if (voiceActor) {
    voiceActor.textContent =
      "Loading voice...";
  }

  utterance.rate = 0.95;
  utterance.pitch = 0.8 + Math.random() * 0.6;
  utterance.volume = 0.3;

  speechSynthesis.speak(utterance);
}

async function loadVoiceLines() {
  try {
    const res = await fetch(
      CONFIG.API_URL + "?view=voicelines"
    );

    const data = await res.json();

    voiceLines = data.voiceLines || [];

  } catch (e) {
    console.error("Voice lines load failed", e);
  }
}

const VIEW_GROUPS = {
  live: ["new", "viewers", "goats", "kr", "en", "cn", "jp", "intl"],

  clips: [
    "clips",
    "goatclips",
    "hotclips",
    "jpclips",
    "soopclips",
    "soophotclips",
    "chzzknewclips",
    "chzzkhotclips",
    "chzzkbestclips"
  ],

  youtube: ["youtube", "youtubehot", "youtubegoats", "youtubejp"],

  players: [
    "teams",
    "playerlinks",
    "birthdays",
    "favorites"
  ]
};

let currentLiveView =
  isLiveView(currentView)
    ? currentView
    : "new";

let currentClipView =
  isClipView(currentView)
    ? currentView
    : "clips";

let currentYoutubeView =
  isYoutubeView(currentView)
    ? currentView
    : "youtube";

let currentPlayerView =
  isPlayerView(currentView)
    ? currentView
    : "teams";

function isLiveView(view) {
  return VIEW_GROUPS.live.includes(view);
}

function isClipView(view) {
  return VIEW_GROUPS.clips.includes(view);
}

function isYoutubeView(view) {
  return VIEW_GROUPS.youtube.includes(view);
}

function isPlayerView(view) {
  return VIEW_GROUPS.players.includes(view);
}

function updateNavState(view) {
  const liveButton = document.querySelector('[data-section="live"]');
  const clipsButton = document.querySelector('[data-section="clips"]');
  const youtubeButton = document.querySelector('[data-section="youtube"]');
  const playersButton = document.querySelector('[data-section="players"]');

  const liveSubNav = document.getElementById("liveSubNav");
  const liveRoleSubNav = document.getElementById("liveRoleSubNav");
  const clipsSubNav = document.getElementById("clipsSubNav");
  const youtubeSubNav = document.getElementById("youtubeSubNav");
  const youtubeRoleSubNav = document.getElementById("youtubeRoleSubNav");
  const playerSubNav = document.getElementById("playerSubNav");

  document
    .querySelectorAll('.main-nav button:not(#searchToggle)')
    .forEach(b => b.classList.remove("active"));

  document
    .querySelectorAll(".sub-nav button")
    .forEach(b => b.classList.remove("active"));

  if (liveSubNav) liveSubNav.style.display = "none";
  if (liveRoleSubNav) liveRoleSubNav.style.display = "none";
  if (clipsSubNav) clipsSubNav.style.display = "none";
  if (youtubeSubNav) youtubeSubNav.style.display = "none";
  if (youtubeRoleSubNav) youtubeRoleSubNav.style.display = "none";
  if (playerSubNav) playerSubNav.style.display = "none";

  if (isLiveView(view)) {
    liveButton?.classList.add("active");
    if (liveSubNav) liveSubNav.style.display = "flex";
    if (liveRoleSubNav) liveRoleSubNav.style.display = "flex";

    document
      .querySelector(`#liveSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isClipView(view)) {
    clipsButton?.classList.add("active");
    if (clipsSubNav) clipsSubNav.style.display = "flex";

    document
      .querySelector(`#clipsSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isYoutubeView(view)) {
    youtubeButton?.classList.add("active");
    if (youtubeSubNav) youtubeSubNav.style.display = "flex";
    if (youtubeRoleSubNav) youtubeRoleSubNav.style.display = "flex";

    document
      .querySelector(`#youtubeSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isPlayerView(view)) {
    playersButton?.classList.add("active");
    if (playerSubNav) playerSubNav.style.display = "flex";

    document
      .querySelector(`#playerSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else {
    document
      .querySelector(`.main-nav button[data-view="${view}"]`)
      ?.classList.add("active");
  }

  document
    .querySelectorAll(`[data-role-filter="${currentRoleFilter}"]`)
    .forEach(b => b.classList.add("active"));

  document.body.classList.toggle(
    "has-sub-nav",
    isLiveView(view) ||
    isClipView(view) ||
    isYoutubeView(view) ||
    isPlayerView(view)
  );
}

document
  .querySelectorAll(".main-nav button")
  .forEach(button => {
    button.addEventListener("click", () => {
      if (button.id === "searchToggle") return;
      
      if (button.dataset.section === "live") {
        currentView = currentLiveView;
      
      } else if (button.dataset.section === "clips") {
        currentView = currentClipView;
      
      } else if (button.dataset.section === "youtube") {
        currentView = currentYoutubeView;

      } else if (button.dataset.section === "players") {
        currentView = currentPlayerView;
        
      } else {
        currentView = button.dataset.view;
      }

      searchBox.value = "";

      history.replaceState({}, "", "?view=" + currentView);

      updateNavState(currentView);
      loadView(currentView);
    });
  });

document
  .querySelectorAll(".sub-nav button")
  .forEach(button => {
    button.addEventListener("click", () => {

      if (button.dataset.roleFilter) {
        currentRoleFilter = button.dataset.roleFilter;

        localStorage.setItem(
          "roleFilter",
          currentRoleFilter
        );

        updateNavState(currentView);
        loadView(currentView);
        return;
      }

      currentView = button.dataset.view;

      if (isLiveView(currentView)) {
        currentLiveView = currentView;
      }

      if (isClipView(currentView)) {
        currentClipView = currentView;
      }

      if (isYoutubeView(currentView)) {
        currentYoutubeView = currentView;
      }

      if (isPlayerView(currentView)) {
        currentPlayerView = currentView;
      }
            
      searchBox.value = "";

      history.replaceState({}, "", "?view=" + currentView);

      updateNavState(currentView);
      loadView(currentView);
    });
  });

updateNavState(currentView);

const searchToggle =
  document.getElementById("searchToggle");

searchToggle?.addEventListener("click", () => {
  const isOpen = searchBox.classList.toggle("search-hidden") === false;

  searchToggle.classList.toggle("search-active", isOpen);

  if (isOpen) {
    searchBox.focus();
  }
});

let searchTimer;

searchBox?.addEventListener("input", () => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
   if (currentView === "birthdays") {
    jumpBirthdaySearch_();

  } else if (isYoutubeView(currentView)) {
    renderYoutube(filterYoutube(currentData));
  
  } else if (isClipView(currentView)) {
    renderClips(filterClips(currentData));
  
  } else if (
    currentView === "playerlinks" ||
    currentView === "favorites"
  ) {
    searchPlayerLinksTable();
  
  } else {
    renderLive(filterPlayers(currentData));
  }

  }, 300);
});

function loadView(view) {

  updateViewActionButton_(view);

  if (isLiveView(view)) {
    loadLiveView(view);
    return;
  }

  if (isYoutubeView(view)) {
    loadYoutubeView(view);
    return;
  }

  if (isClipView(view)) {
    loadClipsView(view);
    return;
  }

  if (view === "teams") {
    loadTeamsView();
    return;
  }

  if (view === "playerlinks") {
    loadPlayerLinksView();
    return;
  }

  if (view === "birthdays") {
    loadBirthdaysView();
    return;
  }

  if (view === "favorites") {
    loadFavoritesView();
    return;
  }

  loadLiveView("new");
}

function getLangClass(p) {
  const platform = String(p.platform || "");
  const language = String(p.language || "").toUpperCase();

  if (
    platform.includes("CHZZK") ||
    platform.includes("SOOP") ||
    language === "KO"
  ) {
    return "lang-kr";
  }

  if (language === "JA") {
    return "lang-jp";
  }

  if (language === "EN") {
    return "lang-en";
  }

  if (
    platform.includes("BILIBILI") ||
    language.startsWith("ZH")
  ) {
    return "lang-cn";
  }

  return "lang-intl";
}

function linkDot(url, type) {
  if (!url) {
    return `<span class="no-link">-</span>`;
  }

  const icons = {
    tw: {
      name: "Twitch",
      src: "./icons/twitch.png"
    },
    "tw-inactive": {
      name: "Twitch",
      src: "./icons/twitch.png"
    },
    chz: {
      name: "CHZZK",
      src: "./icons/chzzk.png"
    },
    soop: {
      name: "SOOP",
      src: "./icons/soop.png"
    },
    bili: {
      name: "Bilibili",
      src: "./icons/bilibili.png"
    },
    yt: {
      name: "YouTube",
      src: "./icons/youtube.png"
    },
    dc: {
      name: "Discord",
      src: "./icons/discord.png"
    }
  };

  const icon = icons[type];

  if (!icon) {
    return `<a class="link-dot ${type}" href="${url}" target="_blank" rel="noopener">●</a>`;
  }

  return `
    <a
      class="link-icon ${type}"
      href="${url}"
      target="_blank"
      rel="noopener"
      title="${icon.name}"
      aria-label="${icon.name}"
    >
      <img
        class="platform-icon"
        src="${icon.src}"
        alt="${icon.name}"
      >
    </a>
  `;
}

function linkTag(url, label, cls) {
  if (!url) return "";

  const type = cls || "";
  const icons = {
    tw: { name: "Twitch", src: "./icons/twitch.png" },
    "tw-inactive": { name: "Twitch", src: "./icons/twitch.png" },
    chz: { name: "CHZZK", src: "./icons/chzzk.png" },
    soop: { name: "SOOP", src: "./icons/soop.png" },
    bili: { name: "Bilibili", src: "./icons/bilibili.png" },
    yt: { name: "YouTube", src: "./icons/youtube.png" },
    dc: { name: "Discord", src: "./icons/discord.png" }
  };

  const icon = icons[type];

  if (!icon) {
    return "";
  }

  return `
    <a
      class="team-link-tag team-link-icon ${type}"
      href="${url}"
      target="_blank"
      rel="noopener"
      title="${icon.name}"
      aria-label="${icon.name}"
    >
      <img
        class="platform-icon"
        src="${icon.src}"
        alt="${icon.name}"
      >
    </a>
  `;
}

const REGION_NA = [
  "canada", "costa rica", "cuba", "dominican republic",
  "el salvador", "guatemala", "honduras", "jamaica",
  "mexico", "nicaragua", "panama"
];

const REGION_PAC = [
  "australia", "bangladesh", "brunei", "cambodia",
  "fiji", "hong kong", "india", "indonesia",
  "laos", "malaysia", "mongolia", "myanmar",
  "nepal", "new zealand", "pakistan",
  "papua new guinea", "philippines",
  "singapore", "sri lanka", "taiwan",
  "thailand", "timor-leste", "vietnam"
];

const REGION_SA = [
  "argentina", "bolivia", "brazil", "chile",
  "colombia", "ecuador", "guyana",
  "paraguay", "peru", "suriname",
  "uruguay", "venezuela"
];

const REGION_EMEA = [
  "albania", "algeria", "andorra", "armenia",
  "austria", "azerbaijan", "bahrain",
  "belgium", "belarus",
  "bosnia and herzegovina", "bulgaria",
  "croatia", "cyprus", "czech republic",
  "denmark", "egypt", "estonia", "finland",
  "france", "georgia", "germany", "greece",
  "hungary", "iraq", "ireland", "israel",
  "italy", "jordan", "kazakhstan",
  "kuwait", "latvia", "lebanon", "libya",
  "lithuania", "luxembourg", "malta",
  "morocco", "netherlands", "norway",
  "oman", "palestine", "poland",
  "portugal", "qatar", "romania",
  "saudi arabia", "serbia", "slovakia",
  "slovenia", "south africa", "spain",
  "sweden", "switzerland", "syria",
  "tunisia", "turkey", "ukraine",
  "united arab emirates", "uk", "yemen"
];

function getNationalityRegionClass(nationality) {
  const nat = String(nationality || "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  if (["japan", "jp"].includes(nat)) {
    return "region-jp";
  }

  if (["south korea", "kr"].includes(nat)) {
    return "region-kr";
  }

  if (["china", "cn"].includes(nat)) {
    return "region-cn";
  }

  if (
    ["united states", "usa", "us", "en"]
      .includes(nat)
  ) {
    return "region-na";
  }

  if (REGION_NA.some(x => nat.includes(x))) {
    return "region-na";
  }

  if (REGION_PAC.some(x => nat.includes(x))) {
    return "region-pac";
  }

  if (REGION_SA.some(x => nat.includes(x))) {
    return "region-sa";
  }

  if (REGION_EMEA.some(x => nat.includes(x))) {
    return "region-emea";
  }

  return "region-unknown";
}

function shortNationality(nationality) {
  return String(nationality || "")
    .replaceAll("Dominican Republic", "Dominican")
    .replaceAll("United Arab Emirates", "U.Arab Emir");
}

function getTeamRegionClass(region, team) {
  const r = String(region || "")
    .replace(/^●\s*/, "")
    .trim()
    .toUpperCase();

  switch (r) {
    case "TEAM OFFICIAL":
      return "team-official-account";

    case "OFFICIAL OWCS":
      return "team-official";

    case "KR":
      return "team-kr";

    case "JP":
      return "team-jp";

    case "PAC":
      return "team-pac";

    case "CN":
      return "team-cn";

    case "NA":
      return "team-na";

    case "EMEA":
      return "team-emea";

    case "SA":
      return "team-sa";

    default:
      return "team-unknown";
  }
}

function formatLiveFor(startedAt) {
  if (!startedAt) return "";

  const start = new Date(startedAt);

  if (isNaN(start.getTime())) {
    return "";
  }

  const diffMinutes = Math.floor(
    (Date.now() - start.getTime()) / 60000
  );

  if (diffMinutes < 0) {
    return "";
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function timeAgo(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return "NOW";

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  }

  const days = Math.floor(diff / 86400);

  if (days < 30) {
    return `${days}d`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months}mo`;
  }

  return `${Math.floor(months / 12)}y`;
}

function formatViews(views) {
  views = Number(views || 0);

  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  }

  if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  }

  return views.toLocaleString();
}

function getPlatformIcons_(platform) {
  const text = String(platform || "").toUpperCase();

  const icons = [];

  if (text.includes("TWITCH") || text.includes("🟣")) {
    icons.push({
      name: "Twitch",
      src: "./icons/twitch.png"
    });
  }

  if (text.includes("CHZZK") || text.includes("🟢")) {
    icons.push({
      name: "CHZZK",
      src: "./icons/chzzk.png"
    });
  }

  if (text.includes("SOOP") || text.includes("🔵")) {
    icons.push({
      name: "SOOP",
      src: "./icons/soop.png"
    });
  }

  if (text.includes("BILIBILI") || text.includes("🟡")) {
    icons.push({
      name: "Bilibili",
      src: "./icons/bilibili.png"
    });
  }

  return icons;
}

function renderPlatformIcons_(platform) {
  const icons = getPlatformIcons_(platform);

  if (!icons.length) {
    return `<span>${platform || ""}</span>`;
  }

  return icons
    .map(icon => `
      <img
        class="platform-icon"
        src="${icon.src}"
        alt="${icon.name}"
        title="${icon.name}"
      >
    `)
    .join("");
}

function updateAllButtonCounts(counts) {

  document
    .querySelectorAll("#liveSubNav button[data-view]")
    .forEach(button => {

      const view = button.dataset.view;
      const label = titles[view] || view.toUpperCase();

      const count = counts?.[view] ?? "";

      button.textContent =
        count === ""
          ? label
          : `${label} (${count})`;
    });

}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function init() {
  speechSynthesis.getVoices();

  loadView(currentView);

  await loadVoiceLines();
  setRandomVoiceLine();
}
