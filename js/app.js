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

  const words = text
    .split(/[\s/_-]+/)
    .filter(Boolean);

  const isJapaneseLike = value =>
    /[ぁ-んァ-ン一-龥]/.test(value);

  const matchToken = keyword => {
    if (isJapaneseLike(keyword)) {
      return text.includes(keyword);
    }

    return words.some(word =>
      word.startsWith(keyword)
    );
  };

  return (
    include.every(matchToken) &&
    exclude.every(keyword => !matchToken(keyword))
  );
}

const MUTED_PLAYERS_KEY = "mutedPlayers";

function getMutedPlayers_() {
  try {
    const muted = JSON.parse(
      localStorage.getItem(MUTED_PLAYERS_KEY) || "[]"
    );

    return Array.isArray(muted) ? muted : [];

  } catch (e) {
    return [];
  }
}

function isMutedPlayer_(name) {
  return getMutedPlayers_().includes(String(name || ""));
}

function toggleMutedPlayer_(name) {
  const playerName = String(name || "");
  if (!playerName) return;

  const muted = getMutedPlayers_();

  const next = muted.includes(playerName)
    ? muted.filter(n => n !== playerName)
    : [...muted, playerName];

  localStorage.setItem(
    MUTED_PLAYERS_KEY,
    JSON.stringify(next)
  );
}

function muteButton_(name) {
  return `
    <button
      class="mute-button"
      type="button"
      data-player-menu="${escapeHtml(name)}"
      aria-label="Player menu"
      title="Player menu"
    >
      <svg
        class="media-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
        />
      </svg>
    </button>
  `;
}

let playerContextMenu = null;

function getPlayerMenuLabels_(name) {
  return {
    liquipedia:
      siteTextLanguageMode === "jp"
        ? "📖 Liquipediaを開く"
        : "📖 Liquipedia",

    activity:
      siteTextLanguageMode === "jp"
        ? "🦊 最新の配信・動画"
        : "🦊 Latest Activity",

    mute:
      siteTextLanguageMode === "jp"
        ? (
            isMutedPlayer_(name)
              ? "ミュート解除"
              : "ミュート"
          )
        : (
            isMutedPlayer_(name)
              ? "Unmute Player"
              : "Mute Player"
          )
  };
}

function renderPlayerMenuItems_(name) {
  const labels = getPlayerMenuLabels_(name);

  return `
    <button data-action="liquipedia">
      ${labels.liquipedia}
    </button>

    <button data-action="activity">
      ${labels.activity}
    </button>

    <button data-action="mute">
      ${labels.mute}
    </button>
  `;
}

function openPlayerMenu_(button, player) {
  closePlayerMenu_();
  closePlayerLinkMenu_();

  playerContextMenu = document.createElement("div");
  playerContextMenu.className = "player-context-menu";

  playerContextMenu.innerHTML =
    renderPlayerMenuItems_(player.name);

  document.body.appendChild(playerContextMenu);

  const rect = button.getBoundingClientRect();

  positionContextMenu_(
    playerContextMenu,
    rect,
    "right"
  );

  playerContextMenu.addEventListener("click", e => {
    const menuButton = e.target.closest("button");
    if (!menuButton) return;

    e.preventDefault();
    e.stopPropagation();

    const action = menuButton.dataset.action;

    if (action === "liquipedia") {
      const url =
        player.liquipedia ||
        `https://liquipedia.net/overwatch/${encodeURIComponent(player.name)}`;

      window.open(url, "_blank", "noopener");
    }

    if (action === "activity") {
      history.pushState(
        {},
        "",
        `/player/${encodeURIComponent(playerToSlug_(player.name))}`
      );

      currentView = "player";
      currentPlayerView = "player";

      updateNavState(currentView);
      loadPlayerDetailView();

      closePlayerMenu_();
      return;
    }

    if (action === "mute") {
      toggleMutedPlayer_(player.name);

      closePlayerMenu_();

      if (isLiveView(currentView)) {
        renderLive(filterPlayers(currentData));
      } else if (isYoutubeView(currentView)) {
        renderYoutube(filterYoutube(currentData));
      } else if (isClipView(currentView)) {
        renderClips(filterClips(currentData));
      }

      return;
    }

    closePlayerMenu_();
  });
}

document.addEventListener("click", e => {
  const clickedPlayerMenuButton =
    e.target.closest("[data-player-menu]");

  const clickedPlayerLink =
    e.target.closest("[data-player]");

  const clickedTeamMenuButton =
    e.target.closest("[data-team-menu]");

  if (
    playerContextMenu &&
    !playerContextMenu.contains(e.target) &&
    !clickedPlayerMenuButton
  ) {
    closePlayerMenu_();
  }

  if (
    playerLinkMenu &&
    !playerLinkMenu.contains(e.target) &&
    !clickedPlayerLink &&
    !clickedTeamMenuButton
  ) {
    closePlayerLinkMenu_();
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closePlayerMenu_();
    closePlayerLinkMenu_();
  }
});

function positionContextMenu_(menu, rect, align = "left") {
  const menuWidth = 180;
  const menuHeight = 120;

  const baseLeft =
    align === "right"
      ? rect.right + window.scrollX - menuWidth
      : rect.left + window.scrollX;

  const left = Math.min(
    baseLeft,
    window.scrollX + window.innerWidth - menuWidth - 12
  );

  const top = Math.min(
    rect.bottom + window.scrollY + 6,
    window.scrollY + window.innerHeight - menuHeight
  );

  menu.style.left =
    `${Math.max(12, left)}px`;

  menu.style.top =
    `${Math.max(window.scrollY + 12, top)}px`;
}

function closePlayerMenu_() {
  playerContextMenu?.remove();
  playerContextMenu = null;
}

document.addEventListener("click", e => {
  const button = e.target.closest("[data-player-menu]");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  openPlayerMenu_(button, {
    name: button.dataset.playerMenu,
    liquipedia: button.dataset.liquipedia || ""
  });
});

document.addEventListener("click", e => {
  const button = e.target.closest("[data-unmute-player]");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  toggleMutedPlayer_(button.dataset.unmutePlayer);

  loadView(currentView);
});

document.addEventListener("click", e => {
  const button = e.target.closest("#clearMutedPlayersButton");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  localStorage.setItem(
    MUTED_PLAYERS_KEY,
    JSON.stringify([])
  );

  loadView(currentView);
});

const refreshDataButton =
  document.getElementById("refreshDataButton");

const toolsButton =
  document.getElementById("toolsButton");

const usefulLinksButton =
  document.getElementById("usefulLinksButton");

const faqButton =
  document.getElementById("faqButton");

const contactButton =
  document.getElementById("contactButton");

const notifyButton =  document.getElementById("notifyButton");
const settingsButton =  document.getElementById("settingsButton");
const settingsMenu =  document.getElementById("settingsMenu");

const themeSelect = document.getElementById("themeSelect");
const titleLanguageSelect =
  document.getElementById("titleLanguageSelect");

const siteTextLanguageSelect =
  document.getElementById("siteTextLanguageSelect");

const filtersToggle =
  document.getElementById("filtersToggle");

const filtersPanel =
  document.getElementById("filtersPanel");

let filtersExpanded =
  localStorage.getItem("filtersExpanded") !== "false";

function getCurrentFilterLabel_() {
  const viewLabel = titles[currentView] || currentView.toUpperCase();

  const roleLabel =
    currentRoleFilter && currentRoleFilter !== "all"
      ? ` / ${currentRoleFilter}`
      : "";

  return `${viewLabel}${roleLabel}`;
}

function applyFiltersExpanded_() {
  if (!filtersToggle || !filtersPanel) return;

  filtersPanel.classList.toggle(
    "filters-collapsed",
    !filtersExpanded
  );

  filtersToggle.textContent =
    filtersExpanded
      ? "▼ Filters"
      : `▶ Filters (${getCurrentFilterLabel_()})`;
}

filtersToggle?.addEventListener("click", () => {
  filtersExpanded = !filtersExpanded;

  localStorage.setItem(
    "filtersExpanded",
    String(filtersExpanded)
  );

  applyFiltersExpanded_();
});

function applyTheme_(theme) {

  document.body.classList.remove(
    "light-theme",
    "theme-midnight",

    "theme-limegreen",
    "theme-blackgold",
    "theme-blackred",
    "theme-blackgreen",
    "theme-blackorange",
    "theme-blackpurple",
    "theme-blazingblue",

    "theme-whitegray",
    "theme-whiteblue",
    "theme-whitered",    
    "theme-yellowblue",
    "theme-whitepink",
    "theme-cyanpink",
    "theme-dreampurple"
    
  );

  const classMap = {
    light: "light-theme",
    midnight: "theme-midnight",

    limegreen: "theme-limegreen",
    blackgold: "theme-blackgold",
    blackred: "theme-blackred",
    blackgreen: "theme-blackgreen",
    blackorange: "theme-blackorange",
    blackpurple: "theme-blackpurple",
    blazingblue: "theme-blazingblue",

    whitegray: "theme-whitegray",
    whiteblue: "theme-whiteblue",
    whitered: "theme-whitered",    
    yellowblue: "theme-yellowblue",
    whitepink: "theme-whitepink",
    cyanpink: "theme-cyanpink",
    dreampurple: "theme-dreampurple"
    
  };

  if (classMap[theme]) {
    document.body.classList.add(classMap[theme]);
  }

  if (themeSelect) {
    themeSelect.value = theme;
  }
}

let currentTheme =
  localStorage.getItem("theme") || "dark";

applyTheme_(currentTheme);

let titleLanguageMode =
  localStorage.getItem("titleLanguageMode") || "original";

if (titleLanguageSelect) {
  titleLanguageSelect.value = titleLanguageMode;
}

let siteTextLanguageMode =
  localStorage.getItem("siteTextLanguageMode") || "both";

if (siteTextLanguageSelect) {
  siteTextLanguageSelect.value =
    siteTextLanguageMode;
}

function settingsText_(en, jp) {
  return siteTextLanguageMode === "jp"
    ? jp
    : en;
}

updateSettingsMenuText_();

function setSettingsText_(selector, text) {
  const el = document.querySelector(selector);
  if (!el) return;

  el.textContent = text;
}

function setSettingsRowTitle_(button, text) {
  const title = button?.querySelector(".settings-row-title");

  if (title) {
    title.textContent = text;
    return;
  }

  if (button) {
    button.textContent = text;
  }
}

function updateSettingsMenuText_() {
  setSettingsText_(
    'label[for="themeSelect"]',
    settingsText_("Theme", "テーマ")
  );

  setSettingsText_(
    'label[for="siteTextLanguageSelect"]',
    settingsText_("Site Text", "サイト表示")
  );

  setSettingsText_(
    'label[for="titleLanguageSelect"]',
    settingsText_("Title Language", "タイトル言語")
  );

  setSettingsText_(
    "#themeSettingTitle",
    settingsText_("Theme", "テーマ")
  );

  setSettingsText_(
    "#siteTextSettingTitle",
    settingsText_("Site Text", "サイト表示")
  );

  setSettingsText_(
    "#titleLanguageSettingTitle",
    settingsText_("Title Language", "タイトル言語")
  );

  setSettingsRowTitle_(
    refreshDataButton,
    settingsText_("Refresh Data", "データ更新")
  );

  setSettingsRowTitle_(
    toolsButton,
    settingsText_("Translation Tools", "翻訳ツール")
  );

  setSettingsRowTitle_(
    usefulLinksButton,
    settingsText_("Useful Links", "関連リンク")
  );

  setSettingsRowTitle_(
    faqButton,
    settingsText_("FAQ", "よくある質問")
  );

  setSettingsRowTitle_(
    contactButton,
    settingsText_("Contact", "お問い合わせ")
  );
}

themeSelect?.addEventListener("change", () => {
  currentTheme = themeSelect.value;

  localStorage.setItem("theme", currentTheme);

  applyTheme_(currentTheme);
});

titleLanguageSelect?.addEventListener("change", () => {
  titleLanguageMode = titleLanguageSelect.value;

  localStorage.setItem(
    "titleLanguageMode",
    titleLanguageMode
  );

  if (isLiveView(currentView)) {
    renderLiveFromCache(currentView);
    return;
  }

  if (isYoutubeView(currentView)) {
    renderYoutube(filterYoutube(currentData));
    return;
  }

  if (isClipView(currentView)) {
    renderClips(filterClips(currentData));
    return;
  }

  if (currentView === "playerlinks") {
    renderPlayerLinks(currentData);
    applyCurrentSearch_();
    return;
  }

  if (currentView === "favorites") {
    renderFavorites(currentData);
    applyCurrentSearch_();
  }
});

siteTextLanguageSelect?.addEventListener("change", () => {

  siteTextLanguageMode =
    siteTextLanguageSelect.value;

  localStorage.setItem(
    "siteTextLanguageMode",
    siteTextLanguageMode
  );

  updateSettingsMenuText_();

  if (typeof updateNotifySelect_ === "function") {
    updateNotifySelect_();
  }

  loadSiteGuided_();

  if (isStaticView_(currentView)) {
    loadView(currentView);
    return;
  }

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

let playerLinksLayout =
  localStorage.getItem("playerLinksLayout") || "table";

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

  if (view === "playerlinks" || view === "favorites") {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      playerLinksLayout === "table"
        ? "▦ Cards"
        : "☰ Table";

    return;
  }

  viewActionButton.hidden = true;
  viewActionButton.textContent = "";
}

function updatePageTitleLink_(view = currentView) {
  const isGoatsMediaView =
    view === "goats" ||
    view === "youtubegoats" ||
    view === "goatclips";

  pageTitle.classList.toggle(
    "page-title-link",
    isGoatsMediaView
  );

  pageTitle.onclick = isGoatsMediaView
    ? () => {
        currentView = "favorites";
        currentPlayerView = "favorites";

        history.replaceState({}, "", "?view=favorites");

        updateNavState(currentView);
        loadView(currentView);
      }
    : null;
}

function updateFavoriteCounts_() {
  const favs = getFavorites_();
  const favSet = new Set(favs);

  const favoriteCount = favs.length;

  const livePlayers = liveCache?.players || [];

  const liveCount = livePlayers.filter(
    p => favSet.has(p.name)
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
      settingsMenu.classList.add("settings-hidden");
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
    renderLive(filterPlayers(currentData));
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
    renderYoutube(filterYoutube(currentData));
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
    renderClips(filterClips(currentData));
    return;
  }

  if (currentView === "playerlinks" || currentView === "favorites") {
    playerLinksLayout =
      playerLinksLayout === "table"
        ? "grid"
        : "table";

    localStorage.setItem(
      "playerLinksLayout",
      playerLinksLayout
    );

    updateViewActionButton_();

    if (currentView === "favorites") {
      renderFavorites(currentData);
    } else {
      renderPlayerLinks(currentData);
    }

    applyCurrentSearch_();
    return;
  }
});

refreshDataButton?.addEventListener("click", () => {

  settingsMenu?.classList.add("settings-hidden");

  clearClientCache_();

  searchBox.value = "";

  loadView(currentView);

});

toolsButton?.addEventListener(
  "click",
  () => openStaticView_("toolstips")
);

usefulLinksButton?.addEventListener(
  "click",
  () => openStaticView_("usefullinks")
);

faqButton?.addEventListener(
  "click",
  () => openStaticView_("faq")
);

contactButton?.addEventListener(
  "click",
  () => {
    settingsMenu?.classList.add("settings-hidden");

    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSeDkW65qI07FFzP3oczawUR3AIp-9tOAfRmSEpavrLipZHS1w/viewform?usp=header",
      "_blank",
      "noopener"
    );
  }
);

function getViewFromLocation_() {
  const params =
    new URLSearchParams(window.location.search);

  const path = location.pathname;

  if (path.startsWith("/player/")) {
    return "player";
  }

  if (path.startsWith("/team/")) {
    return "team";
  }

  return params.get("view") || "new";
}

let currentView = getViewFromLocation_();

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
  twitch:{ data:null, time:0 },
  twitchhot:{ data:null, time:0 },
  soop:{ data:null, time:0 },
  soophot:{ data:null, time:0 },
  chzzknew:{ data:null, time:0 },
  chzzkhot:{ data:null, time:0 },
  chzzkbest:{ data:null, time:0 }
};

const CLIPS_CLIENT_CACHE_MS = 6 * 60 * 60 * 1000;

let youtubeCache = null;
let youtubeCacheTime = 0;
const YOUTUBE_CLIENT_CACHE_MS =  30 * 60 * 1000;
let youtubeLastUpdated = "";
const clipLastUpdated = {};

let siteGuidedCache = null;
let siteGuidedCacheTime = 0;

const SITE_GUIDED_CACHE_MS = 60 * 1000;

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

function clearClientCache_() {

  liveCache = null;
  liveCacheTime = 0;

  youtubeCache = null;
  youtubeCacheTime = 0;

  playerLinksCache = null;
  playerLinksCacheTime = 0;

  birthdaysCache = null;
  birthdaysCacheTime = 0;

  todayStatsCache = null;
  todayStatsCacheTime = 0;

  siteGuidedCache = null;
  siteGuidedCacheTime = 0;

  statsFetchPromise = null;

  Object.values(clipCache).forEach(cache => {
    cache.data = null;
    cache.time = 0;
  });
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
  owcs: "OWCS",
  faceit: "FACEIT",
  
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
  favorites: "★MY GOATS",
  muted: "◆MUTED"
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
  live: [
 "new",
 "goats",
 "viewers",
 "kr",
 "en",
 "cn",
 "jp",
 "intl",
 "owcs",
 "faceit"
]

  clips: [
    "clips",
    "goatclips",
    "hotclips",
    "jpclips",
    "chzzknewclips",
    "chzzkhotclips",
    "chzzkbestclips",
    "soopclips",
    "soophotclips"
  ],

  youtube: ["youtube", "youtubegoats", "youtubehot", "youtubejp"],

  players: [
    "teams",
    "team",
    "player",
    "playerlinks",
    "birthdays",
    "favorites",
    "muted",
    "about",
    "privacy",
    "usefullinks",
    "faq",
    "toolstips",
    "updatelog"
  ]
};

const STATIC_VIEW_LOADERS = {
  about: () => loadAboutView(),
  privacy: () => loadPrivacyView(),
  usefullinks: () => loadUsefulLinksView(),
  faq: () => loadFaqView(),
  toolstips: () => loadToolsView(),
  updatelog: () => loadUpdateLogView()
};

function isStaticView_(view) {
  return Boolean(STATIC_VIEW_LOADERS[view]);
}

function loadStaticView_(view) {
  const loader = STATIC_VIEW_LOADERS[view];

  if (!loader) {
    return false;
  }

  loader();
  return true;
}

function openStaticView_(view) {
  settingsMenu?.classList.add("settings-hidden");

  currentView = view;
  currentPlayerView = "teams";

  history.replaceState({}, "", "?view=" + view);

  updateNavState(currentView);
  loadView(currentView);
}

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
  isPlayerView(currentView) && !isStaticView_(currentView)
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

function hasSubNav_(view) {
  return (
    isLiveView(view) ||
    isClipView(view) ||
    isYoutubeView(view) ||
    (isPlayerView(view) && !isStaticView_(view))
  );
}

function hasFilterPanel_(view) {
  return hasSubNav_(view);
}

function hasCollapsibleFilters_(view) {
  return (
    isLiveView(view) ||
    isYoutubeView(view) ||
    isClipView(view)
  );
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

    if (playerSubNav && !isStaticView_(view)) {
      playerSubNav.style.display = "flex";
    }

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
    hasSubNav_(view)
  );

  const showFilters = hasFilterPanel_(view);

  if (filtersToggle) {
    filtersToggle.style.display =
      hasCollapsibleFilters_(view)
        ? ""
        : "none";
  }

  if (filtersPanel) {
    filtersPanel.style.display =
      showFilters ? "" : "none";

    if (isPlayerView(view) && !isStaticView_(view)) {
      filtersPanel.classList.remove("filters-collapsed");
    }
  }

  if (hasCollapsibleFilters_(view)) {
    applyFiltersExpanded_();
  }
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

      history.replaceState({}, "", "?view=" + currentView);

      updateNavState(currentView);
      loadView(currentView);
    });
  });

document
  .querySelectorAll(".sub-nav button")
  .forEach(button => {
    button.addEventListener("click", () => {
         hideSwipeHint_();

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

      if (
        isPlayerView(currentView) &&
        !isStaticView_(currentView)
      ) {
        currentPlayerView = currentView;
      }
            
      history.replaceState({}, "", "?view=" + currentView);

      updateNavState(currentView);
      loadView(currentView);
    });
  });

updateNavState(currentView);

window.addEventListener("popstate", () => {
  currentView = getViewFromLocation_();

  if (
    currentView === "team" ||
    isStaticView_(currentView)
  ) {
    currentPlayerView = "teams";
  }

  updateNavState(currentView);
  loadView(currentView);
});

let swipeHintEl = null;

function hideSwipeHint_() {
  swipeHintEl?.remove();
  swipeHintEl = null;

  localStorage.setItem("swipeHintShown", "true");
}

function showSwipeHintOnce_() {
  if (!window.matchMedia("(max-width: 900px)").matches) {
    return;
  }

  if (localStorage.getItem("swipeHintShown") === "true") {
    return;
  }

  if (
    !isLiveView(currentView) &&
    !isYoutubeView(currentView) &&
    !isClipView(currentView)
  ) {
    return;
  }

  swipeHintEl = document.createElement("div");
  swipeHintEl.className = "swipe-hint";
  swipeHintEl.textContent = "← Swipe to change filters →";

  document.body.appendChild(swipeHintEl);
}

showSwipeHintOnce_();

let swipeStartX = 0;
let swipeStartY = 0;
let swipeEndX = 0;
let swipeEndY = 0;

let swipeTracking = false;

const SWIPE_THRESHOLD = 70;

function getSwipeViews_() {
  if (isLiveView(currentView)) {
    return VIEW_GROUPS.live;
  }

  if (isYoutubeView(currentView)) {
    return VIEW_GROUPS.youtube;
  }

  if (isClipView(currentView)) {
    return VIEW_GROUPS.clips;
  }

  return [];
}

function switchSwipeView_(direction) {

  hideSwipeHint_();

  const views = getSwipeViews_();
  if (!views.length) return;

  const index = views.indexOf(currentView);
  if (index < 0) return;

  const nextIndex =
    direction === "left"
      ? (index + 1) % views.length
      : (index - 1 + views.length) % views.length;

  currentView = views[nextIndex];

  if (isLiveView(currentView)) currentLiveView = currentView;
  if (isYoutubeView(currentView)) currentYoutubeView = currentView;
  if (isClipView(currentView)) currentClipView = currentView;

  history.replaceState({}, "", "?view=" + currentView);

  updateNavState(currentView);

  pageTitle.textContent =
    titles[currentView] || currentView.toUpperCase();

  updateViewActionButton_(currentView);
  updatePageTitleLink_(currentView);

  if (isLiveView(currentView)) {
    renderLiveFromCache(currentView);
  } else if (isYoutubeView(currentView)) {
    if (!youtubeCache) {
      loadView(currentView);
      return;
    }

    currentData = filterYoutubeView(youtubeCache, currentView);
    renderYoutube(filterYoutube(currentData));
  } else if (isClipView(currentView)) {
    const source = getClipSource_(currentView);
    const cached = clipCache[source.cacheKey];

    if (!cached?.data) {
      loadView(currentView);
      return;
    }

    currentData = filterClipView(cached.data, currentView);
    renderClips(filterClips(currentData));
  } else {
    loadView(currentView);
    return;
  }

  app.classList.remove("swipe-left", "swipe-right");

  void app.offsetWidth;

  app.classList.add(
    direction === "left"
      ? "swipe-left"
      : "swipe-right"
  );
}

app.addEventListener("touchstart", e => {
  if (
    e.target.closest(".player-table-wrap")
  ) {
    return;
  }
  if (e.touches.length !== 1) return;

  if (
    e.target.closest("button") ||
    e.target.closest("input") ||
    e.target.closest("textarea") ||
    e.target.closest("select")
  ) {
    swipeStartX = 0;
    swipeStartY = 0;
    return;
  }

  swipeTracking = true;
  app.style.transition = "none";

  swipeStartX = e.touches[0].clientX;
  swipeStartY = e.touches[0].clientY;
}, { passive:true });

app.addEventListener("touchmove", e => {
  if (
    e.target.closest(".player-table-wrap")
  ) {
    return;
  }
  if (!swipeTracking) return;
  if (e.touches.length !== 1) return;

  const dx = e.touches[0].clientX - swipeStartX;
  const dy = e.touches[0].clientY - swipeStartY;

  if (Math.abs(dx) < Math.abs(dy)) return;

  app.style.transform = `translateX(${dx * 0.18}px)`;
}, { passive:true });

app.addEventListener("touchend", e => {
  if (
    e.target.closest(".player-table-wrap")
  ) {
    return;
  }
  swipeTracking = false;
  app.style.transition = "";
  app.style.transform = "";

  const touch = e.changedTouches[0];
  if (!touch) return;

  if (!swipeStartX && !swipeStartY) return;

  swipeEndX = touch.clientX;
  swipeEndY = touch.clientY;

  const dx = swipeEndX - swipeStartX;
  const dy = swipeEndY - swipeStartY;

  if (Math.abs(dx) < SWIPE_THRESHOLD) return;
  if (Math.abs(dx) < Math.abs(dy)) return;

  if (dx < 0) {
    switchSwipeView_("left");
  } else {
    switchSwipeView_("right");
  }
}, { passive:true });

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

    } else if (currentView === "playerlinks") {
      searchPlayerLinksTable();

    } else if (currentView === "favorites") {
      searchPlayerLinksTable();

    } else if (currentView === "teams") {
      renderTeams(currentData);

    } else if (currentView === "team") {
      renderTeamPlayers(
        currentTeamName,
        currentData,
        currentRegionName
      );

    } else if (currentView === "muted") {
      renderMutedPlayersView();

    } else if (isLiveView(currentView)) {
      renderLive(filterPlayers(currentData));
    }
  }, 300);
});

function applyCurrentSearch_() {
  if (!searchBox.value.trim()) return;

  if (currentView === "birthdays") {
    jumpBirthdaySearch_();

  } else if (isYoutubeView(currentView)) {
    renderYoutube(filterYoutube(currentData));

  } else if (isClipView(currentView)) {
    renderClips(filterClips(currentData));

  } else if (currentView === "playerlinks") {
    searchPlayerLinksTable();

  } else if (currentView === "favorites") {
    searchPlayerLinksTable();

  } else if (currentView === "teams") {
    renderTeams(currentData);

  } else if (currentView === "team") {
    renderTeamPlayers(
      currentTeamName,
      currentData,
      currentRegionName
    );

  } else if (currentView === "muted") {
    renderMutedPlayersView();

  } else if (isLiveView(currentView)) {
    renderLive(filterPlayers(currentData));
  }
}

function loadView(view) {

  document.body.classList.remove("player-detail-view");
  updatePageTitleLink_(view);

  if (
    isPlayerView(view) &&
    !isStaticView_(view)
  ) {
    currentPlayerView = view;
  }

  updateViewActionButton_(view);

  if (loadStaticView_(view)) {
    return;
  }

  if (
    isLiveView(view) ||
    isYoutubeView(view) ||
    isClipView(view)
  ) {
    loadTodayStats_();
  }

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

  if (view === "team") {
    loadTeamsView(true);
    return;
  }

  if (view === "player") {
    loadPlayerDetailView();
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

  if (view === "muted") {
    loadMutedPlayersView();
    return;
  }

  currentView = "new";
  currentLiveView = "new";

  history.replaceState({}, "", "?view=new");

  updateNavState(currentView);
  updateViewActionButton_(currentView);
  loadLiveView(currentView);
  
}

function loadMutedPlayersView() {
  currentView = "muted";
  currentPlayerView = "muted";
  history.replaceState({}, "", "?view=muted");

  resetSeo_();

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove(
    "youtube-view",
    "clip-view",
    "player-detail-view"
  );

  pageTitle.textContent = "◆MUTED";
  setRandomVoiceLine();

  updated.textContent = "";

  currentData = getMutedPlayers_();

  renderMutedPlayersView();
}

function renderMutedPlayersView() {
  const muted = getMutedPlayers_().filter(name =>
    matchesSearch_(name, searchBox.value)
  );

  app.className = "table-mode muted-mode";

  viewNote.innerHTML = `
    ◆ Players hidden from LIVE, YouTube and Clips.
  `;

  if (!muted.length) {
    app.innerHTML = `
      <p class="empty">No muted players.</p>
    `;
    return;
  }

  app.innerHTML = `
    <div class="player-table-wrap">
      <table class="player-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          ${muted.map(name => `
            <tr>
              <td class="name-cell">
                ${escapeHtml(name)}
              </td>
              <td>
                <button
                  type="button"
                  class="muted-clear-button"
                  data-unmute-player="${escapeHtml(name)}"
                >
                  Unmute
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <button
        type="button"
        class="muted-clear-button"
        id="clearMutedPlayersButton"
      >
        Clear All
      </button>
    </div>
  `;
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
      src: "/icons/twitch.png"
    },
    "tw-inactive": {
      name: "Twitch",
      src: "/icons/twitch.png"
    },
    chz: {
      name: "CHZZK",
      src: "/icons/chzzk.png"
    },
    soop: {
      name: "SOOP",
      src: "/icons/soop.png"
    },
    bili: {
      name: "Bilibili",
      src: "/icons/bilibili.png"
    },
    yt: {
      name: "YouTube",
      src: "/icons/youtube.png"
    },
    dc: {
      name: "Discord",
      src: "/icons/discord.png"
    },
    x: {
      name: "X",
      src: "/icons/x.png"
    },
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
    tw: { name: "Twitch", src: "/icons/twitch.png" },
    "tw-inactive": { name: "Twitch", src: "/icons/twitch.png" },
    chz: { name: "CHZZK", src: "/icons/chzzk.png" },
    soop: { name: "SOOP", src: "/icons/soop.png" },
    bili: { name: "Bilibili", src: "/icons/bilibili.png" },
    yt: { name: "YouTube", src: "/icons/youtube.png" },
    dc: { name: "Discord", src: "/icons/discord.png" },
    x: {  name: "X",  src: "/icons/x.png"},
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
      src: "/icons/twitch.png"
    });
  }

  if (text.includes("CHZZK") || text.includes("🟢")) {
    icons.push({
      name: "CHZZK",
      src: "/icons/chzzk.png"
    });
  }

  if (text.includes("SOOP") || text.includes("🔵")) {
    icons.push({
      name: "SOOP",
      src: "/icons/soop.png"
    });
  }

  if (text.includes("YOUTUBE") || text.includes("🔴")) {
    icons.push({
      name: "YouTube",
      src: "/icons/youtube.png"
    });
  }

  if (text.includes("BILIBILI") || text.includes("🟡")) {
    icons.push({
      name: "Bilibili",
      src: "/icons/bilibili.png"
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

      if (view === "owcs" || view === "faceit") {
        return;   // ←ここだけ追加
      }

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

function trackOpen(type) {
  fetch("/api/track-open", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type })
  }).catch(() => {});
}

document.addEventListener("click", e => {
  const link = e.target.closest("[data-track-open]");
  if (!link) return;

  trackOpen(link.dataset.trackOpen);
});

let todayStatsCache = null;
let todayStatsCacheTime = 0;

const TODAY_STATS_CACHE_MS = 60 * 1000;

let statsFetchPromise = null;

async function getStats_() {
  const now = Date.now();

  if (
    todayStatsCache &&
    now - todayStatsCacheTime < TODAY_STATS_CACHE_MS
  ) {
    return todayStatsCache;
  }

  if (statsFetchPromise) {
    return statsFetchPromise;
  }

  statsFetchPromise = fetch("/api/stats", {
    cache: "no-store"
  })
    .then(res => res.json())
    .then(stats => {
      todayStatsCache = stats;
      todayStatsCacheTime = Date.now();

      siteGuidedCache = stats;
      siteGuidedCacheTime = Date.now();

      return stats;
    })
    .finally(() => {
      statsFetchPromise = null;
    });

  return statsFetchPromise;
}

async function loadTodayStats_() {
  const el = document.getElementById("updated");
  if (!el) return;

  try {
    const stats = await getStats_();

    renderTodayStats_(stats);

  } catch (e) {
    el.textContent = "";
  }
}

function renderTodayStats_(stats) {

  const el = document.getElementById("updated");
  if (!el) return;

  if (isLiveView(currentView)) {
    el.textContent =
      `Updates every 5 min • 🦊 Guided ${Number(stats.live || 0).toLocaleString()} fans to LIVE today.`;
    return;
  }

  if (isYoutubeView(currentView)) {
    el.textContent =
      `Updates every 30 min • 🦊 Guided ${Number(stats.youtube || 0).toLocaleString()} fans to YouTube today.`;
    return;
  }

  if (isClipView(currentView)) {
    el.textContent =
      `Updates every day • 🦊 Guided ${Number(stats.clip || 0).toLocaleString()} fans to Clips today.`;
    return;
  }

  el.textContent = "";
}

async function loadSiteGuided_() {
  try {
    const stats = await getStats_();

    renderSiteGuided_(stats);

  } catch (e) {
    const el = document.getElementById("siteGuided");
    if (el) el.textContent = "";
  }
}

function renderSiteGuided_(stats) {

  const el = document.getElementById("siteGuided");
  if (!el) return;

  const total = Number(stats.total || 0).toLocaleString();

  if (siteTextLanguageMode === "jp") {
    el.textContent = `あなたは${total}人目の訪問者です。`;
    return;
  }

  if (siteTextLanguageMode === "both") {
    el.innerHTML = `
      Kitsune has guided ${total} fans.　あなたは${total}人目の訪問者です。
    `;
    return;
  }

  el.textContent = `Kitsune has guided ${total} fans.`;
}

function getTeamLogoPath_(team, useLightTheme = true) {

  const name = String(team || "").trim();

  if (!name || name === "No team") return "";

  const file =
    encodeURIComponent(
      name.replace(/\s+/g, "_")
    );

  const lightLogoTeams = [
    "99DIVINE",    
    "Disguised",
    "9z Team",    
    "Nyam Gaming",
    "Four Angry Men",
    "HUNENG Gaming",
    "LuneX Gaming",
    "MURASH GAMING",
    "Najdorf Esports",
    "O2 Blast",
    "Please Not Hero Ban",
    "Poker Face",
    "REVATI",
    "Team Liquid",
    "Team Secret",
    "RØDE ZANSIDE GAMING",
    "ZETA DIVISION",
  ];

  const isLightTheme =
    useLightTheme &&
    (
      document.body.classList.contains("light-theme") ||
      document.body.classList.contains("theme-whitered") ||
      document.body.classList.contains("theme-whiteblue") ||
      document.body.classList.contains("theme-whitepink") ||
      document.body.classList.contains("theme-cyanpink") ||
      document.body.classList.contains("theme-yellowblue") ||
      document.body.classList.contains("theme-dreampurple") ||
      document.body.classList.contains("theme-whitegray")
    );

  if (
    isLightTheme &&
    lightLogoTeams.includes(name)
  ) {
    return `/TeamLogo/${file}_light.png`;
  }

  return `/TeamLogo/${file}.png`;
}

async function init() {
  speechSynthesis.getVoices();

  loadView(currentView);
  loadSiteGuided_();

  await loadVoiceLines();
  setRandomVoiceLine();
}

function teamToSlug_(team) {
  return String(team || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function playerToSlug_(name) {
  const original = String(name || "").trim();

  const slug = original
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // 英字だけで構成されている名前だけスラッグ化
  if (/^[A-Za-z0-9&\s._-]+$/.test(original)) {
    return slug;
  }

  // 日本語・韓国語・中国語などが含まれる場合は元の名前
  return original;
}

function openTeamFromUrl_() {
  const slug = location.pathname
    .replace(/^\/team\//, "")
    .replace(/\/$/, "");

  if (!slug) {
    renderTeams(currentData);
    return;
  }

  const team = buildTeams_(currentData).find(t =>
    teamToSlug_(t.name) === slug
  );

  if (!team) {
    app.innerHTML = `<p class="empty">Team not found.</p>`;
    return;
  }

  renderTeamPlayers(
    team.name,
    currentData,
    team.region,
    false
  );
}

function resetSeo_() {
  document.title = "OW KITSUNE GUIDE";
  
  const meta = document.getElementById("metaDescription");
  if (meta) {
    meta.content =
      "Track Overwatch pro player live streams, YouTube videos, clips and player links.";
  }

  const canonical = document.getElementById("canonicalUrl");
  if (canonical) {
    canonical.href = "https://owkitsune.com/";
  }

  document
    .querySelectorAll(
      'script[data-player-jsonld="true"], script[data-team-jsonld="true"]'
    )
    .forEach(script => script.remove());
}

function setOg_(property, content) {
  let meta =
    document.querySelector(`meta[property="${property}"]`) ||
    document.querySelector(`meta[name="${property}"]`);

  if (!meta) {
    meta = document.createElement("meta");

    if (property.startsWith("twitter:")) {
      meta.setAttribute("name", property);
    } else {
      meta.setAttribute("property", property);
    }

    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function hasPlayerProfile_(player) {
  const region = String(player.teamRegion || "")
    .replace(/^●\s*/, "")
    .trim();

  return ![
    "Team Official",
    "Official OWCS",
    "HERO"
  ].includes(region);
}

function setMeta_(name, content) {
  let meta =
    document.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

function setCanonical_(url) {
  let link =
    document.querySelector(`link[rel="canonical"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}

let playerLinkMenu = null;

function closePlayerLinkMenu_() {
  playerLinkMenu?.remove();
  playerLinkMenu = null;
}

function openPlayerLinkMenu_(button, playerName) {
  closePlayerLinkMenu_();
  closePlayerMenu_();

  const name = String(playerName || "");
  if (!name) return;

  playerLinkMenu = document.createElement("div");
  playerLinkMenu.className = "player-context-menu";

  playerLinkMenu.innerHTML =
    renderPlayerMenuItems_(name);

  document.body.appendChild(playerLinkMenu);

  const rect = button.getBoundingClientRect();

  positionContextMenu_(
    playerLinkMenu,
    rect,
    "left"
  );

  playerLinkMenu.addEventListener("click", e => {
    const item = e.target.closest("button");
    if (!item) return;

    e.preventDefault();
    e.stopPropagation();

    if (item.dataset.action === "liquipedia") {
      window.open(
        `https://liquipedia.net/overwatch/${encodeURIComponent(name)}`,
        "_blank",
        "noopener"
      );
    }

    if (item.dataset.action === "activity") {

      history.pushState(
        {},
        "",
        `/player/${encodeURIComponent(playerToSlug_(name))}`
      );

      currentView = "player";
      updateNavState(currentView);
      loadPlayerDetailView();
    }

    if (item.dataset.action === "mute") {
      toggleMutedPlayer_(name);

      closePlayerLinkMenu_();
      return;
    }

    closePlayerLinkMenu_();
  });
}

function openTeamLinkMenu_(button, teamName) {
  closePlayerLinkMenu_();
  closePlayerMenu_();

  const team = String(teamName || "");
  if (!team) return;

  playerLinkMenu = document.createElement("div");
  playerLinkMenu.className = "player-context-menu";

  const liquipediaLabel =
    siteTextLanguageMode === "jp"
      ? "📖 Liquipediaを開く"
      : "📖 Liquipedia";

  const teamDetailLabel =
    siteTextLanguageMode === "jp"
      ? "🦊 チーム詳細"
      : "🦊 Team Detail";

  playerLinkMenu.innerHTML = `
    <button data-action="liquipedia">
      ${liquipediaLabel}
    </button>

    <button data-action="team-detail">
      ${teamDetailLabel}
    </button>
  `;

  document.body.appendChild(playerLinkMenu);

  const rect = button.getBoundingClientRect();

  positionContextMenu_(
    playerLinkMenu,
    rect,
    "left"
  );

  playerLinkMenu.addEventListener("click", e => {
    const item = e.target.closest("button");
    if (!item) return;

    e.preventDefault();
    e.stopPropagation();

    if (item.dataset.action === "team-detail") {

      history.pushState(
        {},
        "",
        `/team/${teamToSlug_(team)}`
      );

      currentView = "team";
      currentPlayerView = "teams";

      updateNavState(currentView);
      loadTeamsView(true);
    }

    if (item.dataset.action === "liquipedia") {
      window.open(
        `https://liquipedia.net/overwatch/${encodeURIComponent(team)}`,
        "_blank",
        "noopener"
      );
    }

    closePlayerLinkMenu_();
  });
}

document.addEventListener("click", e => {
  const button = e.target.closest("[data-team-menu]");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  openTeamLinkMenu_(button, button.dataset.teamMenu);
});

document.addEventListener("click", e => {
  if (e.target.closest("[data-team-menu]")) {
    return;
  }

  const link = e.target.closest("[data-player]");
  if (!link) {
    closePlayerLinkMenu_();
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  openPlayerLinkMenu_(link, link.dataset.player);
});

document.addEventListener("click", e => {
  const button = e.target.closest("[data-player-detail-filter]");
  if (!button) return;

  e.preventDefault();
  e.stopPropagation();

  const type = button.dataset.playerDetailFilter;
  const value = button.dataset.value || "";

  if (!value) return;

  if (type === "team") {
    history.pushState(
      {},
      "",
      `/team/${teamToSlug_(value)}`
    );

    currentView = "team";
    currentPlayerView = "teams";

    updateNavState(currentView);
    loadTeamsView(true);
    return;
  }

  currentView = "playerlinks";
  currentPlayerView = "playerlinks";

  history.pushState({}, "", "?view=playerlinks");

  searchBox.value = value;

  updateNavState(currentView);
  loadPlayerLinksView();
});

function setClipCacheIfNotEmpty_(key, data) {
  if (Array.isArray(data) && data.length > 0) {
    setClipCache_(key, data);
  }
}