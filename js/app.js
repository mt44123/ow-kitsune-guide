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

function buildMutedBackupCode_() {
  const muted = getMutedPlayers_();

  const encoded = btoa(
    unescape(
      encodeURIComponent(JSON.stringify(muted))
    )
  );

  return `OWKG-MUTED:${encoded}`;
}

function copyMutedBackupCode_() {
  const code = buildMutedBackupCode_();

  navigator.clipboard.writeText(code)
    .then(() => {
      alert(
        "Backup code copied!\n" +
        "Paste it with ◆Import on another device.\n\n" +
        "バックアップコードをコピーしました。\n" +
        "別のデバイスで OW KITSUNE GUIDE を開き、◆Import から貼り付けてください。"
      );
    })
    .catch(() => {
      alert("Copy failed.");
    });
}

function importMutedBackupCode_() {
  const code = prompt(
    "Paste your OW KITSUNE GUIDE MUTED backup code:"
  );

  if (!code) return;

  try {
    const cleaned = code.trim();

    if (!cleaned.startsWith("OWKG-MUTED:")) {
      alert("Invalid backup code.");
      return;
    }

    const encoded = cleaned.replace("OWKG-MUTED:", "");

    const muted = JSON.parse(
      decodeURIComponent(
        escape(atob(encoded))
      )
    );

    if (!Array.isArray(muted)) {
      alert("Invalid backup code.");
      return;
    }

    const imported = muted.filter(name =>
      typeof name === "string"
    );

    const mode = prompt(
      "Import Backup\n\n" +
      "1 = Replace current MUTED\n" +
      "2 = Add to current list\n" +
      "3 = Cancel\n\n" +
      "バックアップをインポートします。\n\n" +
      "1 = 今のMUTEDを置き換える\n" +
      "2 = 今のリストに追加する\n" +
      "3 = キャンセル"
    );

    if (mode === null || mode.trim() === "3") {
      return;
    }

    const choice = mode.trim();

    if (choice !== "1" && choice !== "2") {
      alert("Import canceled.");
      return;
    }

    const nextMuted =
      choice === "1"
        ? imported
        : Array.from(
            new Set([
              ...getMutedPlayers_(),
              ...imported
            ])
          );

    localStorage.setItem(
      MUTED_PLAYERS_KEY,
      JSON.stringify(nextMuted)
    );

    alert("MUTED imported!");

    if (currentView === "muted") {
      renderMutedPlayersView();
    }

  } catch (error) {
    console.error(error);
    alert("Failed to import backup.");
  }
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
      } else if (isMediaView(currentView)) {
        rerenderCurrentMediaView_();
      } else if (isArchiveView(currentView)) {
        rerenderCurrentArchiveView_();
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
  const mutedExport = e.target.closest("[data-muted-export]");
  if (mutedExport) {
    e.preventDefault();
    e.stopPropagation();

    const type = mutedExport.dataset.mutedExport;

    if (type === "backup") {
      copyMutedBackupCode_();
    }

    if (type === "import") {
      importMutedBackupCode_();
    }

    return;
  }

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

const faqButton =
  document.getElementById("faqButton");

const howtoNavButton =
  document.getElementById("howtoNavButton");

const watchOwcsNavButton =
  document.getElementById("watchOwcsNavButton");

const toolsNavButton =
  document.getElementById("toolsNavButton");

const usefulLinksNavButton =
  document.getElementById("usefulLinksNavButton");

const hideGuideNavButton =
  document.getElementById("hideGuideNavButton");

const guideNavRow =
  document.getElementById("guideNavRow");

const settingsButton =  document.getElementById("settingsButton");
const settingsMenu =  document.getElementById("settingsMenu");

const themeSelect = document.getElementById("themeSelect");
const titleLanguageSelect =
  document.getElementById("titleLanguageSelect");

const siteTextLanguageSelect =
  document.getElementById("siteTextLanguageSelect");

const streamTitleSelect =
  document.getElementById("streamTitleSelect");

const guideNavSelect =
  document.getElementById("guideNavSelect");

const filtersToggle =
  document.getElementById("filtersToggle");

const filtersPanel =
  document.getElementById("filtersPanel");

let filtersExpanded =
  localStorage.getItem("filtersExpanded") !== "false";

// SHOW by default; HIDE when user chose hide in settings or via Hide button.
// Treat any of "hide" / "0" / "false" as hidden (and clean legacy keys).
function readGuideNavVisible_() {
  // Drop keys from the old fold / howto-hide UX so leftover values never confuse state.
  try {
    localStorage.removeItem("guideNavExpanded");
    localStorage.removeItem("hideHowtoNav");
  } catch (_) {
    /* ignore */
  }

  const raw = String(localStorage.getItem("guideNavVisible") || "show")
    .trim()
    .toLowerCase();

  return raw !== "hide" && raw !== "0" && raw !== "false";
}

let guideNavVisible = readGuideNavVisible_();

function getGuideNavRow_() {
  return guideNavRow || document.getElementById("guideNavRow");
}

function getGuideNavSelect_() {
  return guideNavSelect || document.getElementById("guideNavSelect");
}

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

function updateStickyHeaderScrollOffset_() {
  const header = document.querySelector(".sticky-header");
  if (!header) return;

  // +12px breathing room so card titles clear the sticky nav
  const offset = Math.ceil(header.getBoundingClientRect().height) + 12;
  document.documentElement.style.setProperty(
    "--sticky-header-offset",
    `${Math.max(offset, 72)}px`
  );
}

function initStickyHeaderScrollOffset_() {
  updateStickyHeaderScrollOffset_();

  const header = document.querySelector(".sticky-header");
  if (header && typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => updateStickyHeaderScrollOffset_());
    ro.observe(header);
  }

  window.addEventListener("resize", updateStickyHeaderScrollOffset_);
  window.addEventListener("orientationchange", updateStickyHeaderScrollOffset_);
}

function setGuideNavVisible_(visible, { syncSelect = true } = {}) {
  guideNavVisible = Boolean(visible);

  try {
    localStorage.setItem(
      "guideNavVisible",
      guideNavVisible ? "show" : "hide"
    );
  } catch (_) {
    /* private mode etc. */
  }

  const row = getGuideNavRow_();

  if (row) {
    row.hidden = !guideNavVisible;
    row.classList.toggle("is-hidden", !guideNavVisible);
    // Inline style as a hard fallback against display:flex rules
    row.style.display = guideNavVisible ? "" : "none";
  }

  if (syncSelect) {
    const select = getGuideNavSelect_();
    if (select) {
      select.value = guideNavVisible ? "show" : "hide";
    }
  }

  // Measure after guide row show/hide changes sticky height
  requestAnimationFrame(updateStickyHeaderScrollOffset_);
}

function applyGuideNavVisibility_() {
  setGuideNavVisible_(guideNavVisible, { syncSelect: true });
}

const HOWTO_NAV_SEEN_KEY = "howtoNavButtonSeen";
const HIDE_GUIDE_NAV_SEEN_KEY = "hideGuideNavButtonSeen";

function isHowtoNavSeen_() {
  return localStorage.getItem(HOWTO_NAV_SEEN_KEY) === "1";
}

function isHideGuideNavSeen_() {
  return localStorage.getItem(HIDE_GUIDE_NAV_SEEN_KEY) === "1";
}

function markHowtoNavSeen_() {
  try {
    localStorage.setItem(HOWTO_NAV_SEEN_KEY, "1");
  } catch (_) {
    /* ignore */
  }
  applyGuideNavNudge_();
}

function markHideGuideNavSeen_() {
  try {
    localStorage.setItem(HIDE_GUIDE_NAV_SEEN_KEY, "1");
  } catch (_) {
    /* ignore */
  }
  applyGuideNavNudge_();
}

function applyGuideNavNudge_() {
  howtoNavButton?.classList.toggle(
    "howto-nav-nudge",
    !isHowtoNavSeen_()
  );

  hideGuideNavButton?.classList.toggle(
    "howto-nav-nudge",
    !isHideGuideNavSeen_()
  );
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

function siteNote_(enHtml, jpHtml) {
  // View notes: JP only in Japanese mode. EN (+ both) stays English to keep notes short.
  return siteTextLanguageMode === "jp" ? jpHtml : enHtml;
}

function settingsText_(en, jp) {
  return siteNote_(en, jp);
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
    "#notifySettingTitle",
    settingsText_("Live Notifications", "LIVE通知")
  );

  setSettingsText_(
    "#notifySettingDesc",
    settingsText_(
      "Experimental. See FAQ for details.",
      "実験的機能です。詳細はFAQを参照してください。"
    )
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

  setSettingsText_(
    "#streamTitleSettingTitle",
    settingsText_("Stream Title", "配信タイトル表示")
  );

  setSettingsText_(
    "#streamTitleSettingDesc",
    settingsText_(
      "Applies to LIVE and ARCHIVE cards.",
      "LIVEとARCHIVEカードに適用されます。"
    )
  );

  setSettingsText_(
    "#guideNavSettingTitle",
    settingsText_("Guide Buttons", "ガイドボタン")
  );

  setSettingsText_(
    "#guideNavSettingDesc",
    settingsText_(
      "Second-row shortcuts under the main nav.",
      "メインナビ下の2行目ショートカット。"
    )
  );

  setSettingsRowTitle_(
    refreshDataButton,
    settingsText_("Refresh Data", "データ更新")
  );

  setSettingsRowTitle_(
    faqButton,
    settingsText_("FAQ", "FAQ")
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

  if (isMediaView(currentView)) {
    rerenderCurrentMediaView_();
    return;
  }

  if (isArchiveView(currentView)) {
    rerenderCurrentArchiveView_();
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

  if (
    [
      "birthdays",
      "favorites",
      "muted",
      "mediagoats",
      "hotclips",
      "soophotclips",
      "chzzkhotclips",
      "chzzkbestclips"
    ].includes(currentView)
  ) {
    loadView(currentView);
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

  if (streamTitleSelect) {
    streamTitleSelect.value = liveTitleMode;
  }
}

applyLiveTitleMode_();

streamTitleSelect?.addEventListener("change", () => {
  liveTitleMode = streamTitleSelect.value;

  localStorage.setItem("liveTitleMode", liveTitleMode);

  applyLiveTitleMode_();
  updateViewActionButton_();

  if (isLiveView(currentView)) {
    renderLive(filterPlayers(currentData));
  } else if (isArchiveView(currentView)) {
    rerenderCurrentArchiveView_();
  }
});

if (guideNavSelect) {
  guideNavSelect.value = guideNavVisible ? "show" : "hide";
}

applyGuideNavVisibility_();
initStickyHeaderScrollOffset_();
applyGuideNavNudge_();

guideNavSelect?.addEventListener("change", () => {
  setGuideNavVisible_(guideNavSelect.value !== "hide");
});

hideGuideNavButton?.addEventListener("click", () => {
  markHideGuideNavSeen_();
  setGuideNavVisible_(false);
});

let liveLayout =
  localStorage.getItem("liveLayout") || "grid";

function applyLiveLayout_() {
  document.body.classList.toggle(
    "live-list-layout",
    liveLayout === "list"
  );
}

applyLiveLayout_();

let mediaLayout =
  localStorage.getItem("mediaLayout") ||
  localStorage.getItem("youtubeLayout") ||
  "grid";

let youtubeLayout = mediaLayout;
let clipLayout = mediaLayout;

function applyYoutubeLayout_() {
  document.body.classList.toggle(
    "youtube-list-layout",
    youtubeLayout === "list"
  );
}

function applyClipLayout_() {
  document.body.classList.toggle(
    "clip-list-layout",
    clipLayout === "list"
  );
}

function applyMediaLayout_() {
  youtubeLayout = mediaLayout;
  clipLayout = mediaLayout;

  applyYoutubeLayout_();
  applyClipLayout_();
}

applyMediaLayout_();

let archiveLayout =
  localStorage.getItem("archiveLayout") || "grid";

function applyArchiveLayout_() {
  document.body.classList.toggle(
    "archive-list-layout",
    archiveLayout === "list"
  );
}

applyArchiveLayout_();

let playerLinksLayout =
  localStorage.getItem("playerLinksLayout") || "table";

function updateViewActionButton_(view = currentView) {
  if (!viewActionButton) return;

  if (isLiveView(view)) {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      liveLayout === "grid"
        ? "▦ Grid"
        : "☰ List";

    return;
  }

  if (isMediaView(view)) {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      mediaLayout === "grid"
        ? "▦ Grid"
        : "☰ List";

    return;
  }

  if (isArchiveView(view)) {
    viewActionButton.hidden = false;

    viewActionButton.textContent =
      archiveLayout === "grid"
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
    view === "mediagoats";

  pageTitle.classList.toggle(
    "page-title-link",
    isGoatsMediaView
  );

  pageTitle.onclick = isGoatsMediaView
    ? () => {
        currentView = "favorites";
        currentPlayerView = "favorites";

        setViewUrl_("favorites");

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
      '[data-view="goats"], [data-view="archivegoats"], [data-view="favorites"]'
    )
    .forEach(btn => {
      switch (btn.dataset.view) {
        case "goats":
          btn.textContent = `★ (${liveCount})`;
          break;

        case "archivegoats": {
          const archiveCount = (archiveCache || []).filter(
            a => favSet.has(a.name)
          ).length;
          btn.textContent = `★ (${archiveCount})`;
          break;
        }

        case "favorites":
          btn.textContent = `★ (${favoriteCount})`;
          break;
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
    liveLayout =
      liveLayout === "grid"
        ? "list"
        : "grid";

    localStorage.setItem("liveLayout", liveLayout);

    applyLiveLayout_();
    updateViewActionButton_();
    renderLive(filterPlayers(currentData));
    return;
  }

  if (isMediaView(currentView)) {
    mediaLayout =
      mediaLayout === "grid"
        ? "list"
        : "grid";

    localStorage.setItem("mediaLayout", mediaLayout);

    applyMediaLayout_();
    updateViewActionButton_();
    rerenderCurrentMediaView_();
    return;
  }

  if (isArchiveView(currentView)) {
    archiveLayout =
      archiveLayout === "grid"
        ? "list"
        : "grid";

    localStorage.setItem("archiveLayout", archiveLayout);

    applyArchiveLayout_();
    updateViewActionButton_();
    rerenderCurrentArchiveView_();
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

faqButton?.addEventListener(
  "click",
  () => openStaticView_("faq")
);

howtoNavButton?.addEventListener(
  "click",
  () => {
    markHowtoNavSeen_();
    openStaticView_("howto");
  }
);

watchOwcsNavButton?.addEventListener(
  "click",
  () => openStaticView_("watchowcs")
);

toolsNavButton?.addEventListener(
  "click",
  () => openStaticView_("toolstips")
);

usefulLinksNavButton?.addEventListener(
  "click",
  () => openStaticView_("usefullinks")
);

function viewToPath_(view) {
  const id = normalizeViewId_(view);
  if (!id) return "/";

  // Players ★ MY GOATS list uses /goats (same path as LIVE ★).
  if (id === "favorites") return "/goats";

  return "/" + encodeURIComponent(id);
}

function normalizeViewId_(view) {
  const id = String(view || "").trim();
  if (!id) return "";

  // Old LIVE HOT path/query used "viewers".
  if (id === "viewers") return "hot";

  return id;
}

function setViewUrl_(view, push = false) {
  const id = normalizeViewId_(view) || String(view || "");
  const url = viewToPath_(id);
  const state = { view: id };

  if (push) {
    history.pushState(state, "", url);
  } else {
    history.replaceState(state, "", url);
  }
}

function migrateLegacyViewUrl_() {
  const params = new URLSearchParams(location.search);
  const legacyView = params.get("view");
  const path = location.pathname || "/";

  // Old Players ★ path.
  if (path === "/favorites" || path === "/favorites/") {
    history.replaceState({ view: "favorites" }, "", "/goats");
    return;
  }

  if (!legacyView) return;

  // Detail pages: drop a misleading ?view= left by old relative updates.
  if (path.startsWith("/player/") || path.startsWith("/team/")) {
    history.replaceState({}, "", path);
    return;
  }

  const id = normalizeViewId_(legacyView) || legacyView;
  history.replaceState({ view: id }, "", viewToPath_(id));
}

function getViewFromLocation_() {
  const path =
    (location.pathname || "/").replace(/\/+$/, "") || "/";

  if (path.startsWith("/player/") || path === "/player") {
    return "player";
  }

  if (path.startsWith("/team/") || path === "/team") {
    return "team";
  }

  if (path === "/" || path === "/index.html") {
    return "new";
  }

  // /goats is shared by LIVE ★ and Players ★; history.state disambiguates.
  if (path === "/goats" || path === "/favorites") {
    const stateView = history.state && history.state.view;
    if (stateView === "favorites") return "favorites";
    if (stateView === "goats") return "goats";
    // Cold load / shared links default to LIVE ★.
    return path === "/favorites" ? "favorites" : "goats";
  }

  const raw = decodeURIComponent(path.slice(1).split("/")[0] || "");
  const view = normalizeViewId_(raw) || "new";

  // Rewrite retired aliases onto the canonical path.
  if (raw && view !== raw) {
    history.replaceState({ view }, "", viewToPath_(view));
  }

  return view;
}

migrateLegacyViewUrl_();
let currentView = getViewFromLocation_();

// Canonical LIVE NEW path is /new (keep / as an alias).
if (
  currentView === "new" &&
  ((location.pathname || "/") === "/" ||
    location.pathname === "/index.html")
) {
  history.replaceState({ view: "new" }, "", "/new");
}

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
// "full" = entire playerlinks payload; "teams" = slim TEAMS-only fields.
let playerLinksCacheMode = "";
const PLAYER_LINKS_CLIENT_CACHE_MS =  6 * 60 * 60 * 1000;
// Hard max for disk copies (fresh TTL is shorter; extra age enables SWR after reload).
const CLIENT_PERSIST_MAX_MS = 6 * 60 * 60 * 1000;
const TEAMS_PERSIST_KEY_ = "okgTeamsPlayerLinksV1";
const PLAYERLINKS_FULL_PERSIST_KEY_ = "okgPlayerLinksFullV1";
const YOUTUBE_PERSIST_KEY_ = "okgYoutubeV1";
const ARCHIVE_PERSIST_KEY_ = "okgArchiveV1";
const BIRTHDAYS_PERSIST_KEY_ = "okgBirthdaysV1";
const CLIP_PERSIST_PREFIX_ = "okgClips_";

const clipCache = {
  twitch:{ data:null, time:0 },
  twitchhot:{ data:null, time:0 },
  soop:{ data:null, time:0 },
  soophot:{ data:null, time:0 },
  // CHZZK HOT reuses the "chzzknew" slot (same source data, sorted client-side).
  chzzknew:{ data:null, time:0 },
  chzzkbest:{ data:null, time:0 }
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

let youtubeBackgroundRefreshPromise_ = null;
let archiveBackgroundRefreshPromise_ = null;
let birthdaysBackgroundRefreshPromise_ = null;
let playerLinksBackgroundRefreshPromise_ = null;
const clipBackgroundRefreshPromises_ = Object.create(null);

// Apps Script often returns HTML 404s under load; retry + dedupe reduce
// "Failed to load data" without hammering the same endpoint twice.
const gasFetchInflightByView_ = Object.create(null);
let gasFetchActive_ = 0;
const gasFetchWaiters_ = [];
const GAS_FETCH_MAX_CONCURRENT = 2;
const GAS_FETCH_RETRIES = 3;
const GAS_FETCH_RETRY_BASE_MS = 1200;

function acquireGasSlot_() {
  if (gasFetchActive_ < GAS_FETCH_MAX_CONCURRENT) {
    gasFetchActive_++;
    return Promise.resolve();
  }

  return new Promise(resolve => {
    gasFetchWaiters_.push(resolve);
  }).then(() => {
    gasFetchActive_++;
  });
}

function releaseGasSlot_() {
  gasFetchActive_ = Math.max(0, gasFetchActive_ - 1);
  const next = gasFetchWaiters_.shift();
  if (next) next();
}

function fetchConfigApi_(view, options = {}) {
  const key = String(view || "");
  const retries = options.retries ?? GAS_FETCH_RETRIES;
  const baseDelayMs = options.baseDelayMs ?? GAS_FETCH_RETRY_BASE_MS;

  if (gasFetchInflightByView_[key]) {
    return gasFetchInflightByView_[key];
  }

  const promise = (async () => {
    await acquireGasSlot_();

    try {
      let lastError;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const res = await fetch(
            CONFIG.API_URL + "?view=" + encodeURIComponent(key)
          );
          const text = await res.text();
          let data;

          try {
            data = JSON.parse(text);
          } catch (e) {
            throw new Error(
              `Apps Script returned non-JSON (HTTP ${res.status})`
            );
          }

          if (!res.ok) {
            throw new Error(`Apps Script HTTP ${res.status}`);
          }

          return data;
        } catch (e) {
          lastError = e;

          if (attempt < retries) {
            await new Promise(resolve =>
              setTimeout(resolve, baseDelayMs * attempt)
            );
          }
        }
      }

      throw lastError;
    } finally {
      releaseGasSlot_();
    }
  })().finally(() => {
    delete gasFetchInflightByView_[key];
  });

  gasFetchInflightByView_[key] = promise;
  return promise;
}

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
  }, 1100);
}

function finishFakeProgress() {
  clearInterval(progressTimer);

  app.innerHTML =
    `<p class="loading">🦊 My ultimate is charging... 100%</p>`;
}

function stopFakeProgress() {
  clearInterval(progressTimer);
}

function isCacheFresh_(time, freshMs) {
  return Number(time) > 0 && Date.now() - Number(time) < freshMs;
}

function readPersistedPayload_(key, maxAgeMs = CLIENT_PERSIST_MAX_MS) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data = JSON.parse(raw);
    const time = Number(data?.time || 0);

    if (!time || Date.now() - time >= maxAgeMs) return null;

    return data;
  } catch (e) {
    return null;
  }
}

function writePersistedPayload_(key, fields) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        time: Date.now(),
        ...fields
      })
    );
    return true;
  } catch (e) {
    return false;
  }
}

function removePersistedPayload_(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
}

function clearAllPersistedClientCaches_() {
  removePersistedPayload_(TEAMS_PERSIST_KEY_);
  removePersistedPayload_(PLAYERLINKS_FULL_PERSIST_KEY_);
  removePersistedPayload_(YOUTUBE_PERSIST_KEY_);
  removePersistedPayload_(ARCHIVE_PERSIST_KEY_);
  removePersistedPayload_(BIRTHDAYS_PERSIST_KEY_);

  Object.keys(clipCache).forEach(key => {
    removePersistedPayload_(CLIP_PERSIST_PREFIX_ + key + "V1");
  });
}

function hasPlayerLinksCache_(mode = "full") {
  if (!playerLinksCache) return false;
  if (mode === "teams") return true;
  return playerLinksCacheMode !== "teams";
}

function isPlayerLinksCacheUsable_(mode = "full", options = {}) {
  if (!hasPlayerLinksCache_(mode)) return false;

  if (options.allowStale) return true;

  return isCacheFresh_(playerLinksCacheTime, PLAYER_LINKS_CLIENT_CACHE_MS);
}

function setPlayerLinksCache_(list, lastUpdated, mode = "full") {
  // Prefer keeping a full payload over overwriting with a slim TEAMS subset.
  if (
    mode === "teams" &&
    playerLinksCache &&
    playerLinksCacheMode === "full" &&
    Date.now() - playerLinksCacheTime < PLAYER_LINKS_CLIENT_CACHE_MS
  ) {
    return false;
  }

  playerLinksCache = Array.isArray(list) ? list : [];
  playerLinksCacheTime = Date.now();
  playerLinksCacheMode = mode === "teams" ? "teams" : "full";

  if (lastUpdated != null) {
    playerLinksLastUpdated = lastUpdated;
  }

  if (playerLinksCacheMode === "full") {
    writePersistedPayload_(PLAYERLINKS_FULL_PERSIST_KEY_, {
      lastUpdated: playerLinksLastUpdated || "",
      playerLinks: playerLinksCache
    });
  }

  // Keep a slim local copy so TEAMS can paint instantly after reload.
  persistTeamsPlayerLinksCache_();

  return true;
}

function hydratePlayerLinksFullFromDisk_() {
  if (hasPlayerLinksCache_("full")) return true;

  const data = readPersistedPayload_(PLAYERLINKS_FULL_PERSIST_KEY_);

  if (!data || !Array.isArray(data.playerLinks) || !data.playerLinks.length) {
    return false;
  }

  playerLinksCache = data.playerLinks;
  playerLinksCacheTime = Number(data.time) || 0;
  playerLinksCacheMode = "full";
  playerLinksLastUpdated = data.lastUpdated || "";
  return true;
}

function readPersistedTeamsPlayerLinksCache_() {
  const data = readPersistedPayload_(TEAMS_PERSIST_KEY_);

  if (!data || !Array.isArray(data.playerLinks)) return null;

  return {
    playerLinks: data.playerLinks,
    lastUpdated: data.lastUpdated || "",
    time: Number(data.time) || 0
  };
}

function persistTeamsPlayerLinksCache_() {
  if (
    !playerLinksCache ||
    (playerLinksCacheMode !== "teams" && playerLinksCacheMode !== "full")
  ) {
    return;
  }

  writePersistedPayload_(TEAMS_PERSIST_KEY_, {
    lastUpdated: playerLinksLastUpdated || "",
    playerLinks:
      playerLinksCacheMode === "full"
        ? playerLinksCache.map(slimPlayerForTeamsCache_)
        : playerLinksCache
  });
}

function slimPlayerForTeamsCache_(p) {
  if (!p || typeof p !== "object") return p;

  const out = {};
  const keys = [
    "teamRegion",
    "team",
    "name",
    "nationality",
    "role",
    "born",
    "age",
    "teamAlias",
    "playerAlias",
    "owwcTeam",
    "lastStreamAge",
    "lastStreamPlatform",
    "lastStreamUrl",
    "twitchActive",
    "twitchUrl",
    "chzzkUrl",
    "soopUrl",
    "biliUrl",
    "youtubeUrl",
    "discordUrl",
    "xUrl",
    "instagramUrl"
  ];

  for (const key of keys) {
    const value = p[key];
    if (value == null || value === "") continue;
    out[key] = value;
  }

  return out;
}

function clearPersistedTeamsPlayerLinksCache_() {
  removePersistedPayload_(TEAMS_PERSIST_KEY_);
}

function refreshPlayerLinksInBackground_() {
  if (playerLinksBackgroundRefreshPromise_) {
    return playerLinksBackgroundRefreshPromise_;
  }

  playerLinksBackgroundRefreshPromise_ = fetchConfigApi_("playerlinks")
    .then(data => {
      setPlayerLinksCache_(
        data.playerLinks || [],
        data.lastUpdated || "",
        "full"
      );
    })
    .catch(() => {})
    .finally(() => {
      playerLinksBackgroundRefreshPromise_ = null;
    });

  return playerLinksBackgroundRefreshPromise_;
}

function setYoutubeCache_(videos, lastUpdated, time = Date.now()) {
  youtubeCache = Array.isArray(videos) ? videos : [];
  youtubeCacheTime = time;

  if (lastUpdated != null) {
    youtubeLastUpdated = lastUpdated;
  }

  writePersistedPayload_(YOUTUBE_PERSIST_KEY_, {
    lastUpdated: youtubeLastUpdated || "",
    videos: youtubeCache
  });
}

function hydrateYoutubeFromDisk_() {
  if (youtubeCache) return true;

  const data = readPersistedPayload_(YOUTUBE_PERSIST_KEY_);

  if (!data || !Array.isArray(data.videos)) return false;

  youtubeCache = data.videos;
  youtubeCacheTime = Number(data.time) || 0;
  youtubeLastUpdated = data.lastUpdated || "";
  return true;
}

function isYoutubeCacheFresh_() {
  return (
    Array.isArray(youtubeCache) &&
    isCacheFresh_(youtubeCacheTime, YOUTUBE_CLIENT_CACHE_MS)
  );
}

function refreshYoutubeInBackground_() {
  if (youtubeBackgroundRefreshPromise_) {
    return youtubeBackgroundRefreshPromise_;
  }

  youtubeBackgroundRefreshPromise_ = fetchConfigApi_("youtube")
    .then(data => {
      setYoutubeCache_(data.videos || [], data.lastUpdated || "");
    })
    .catch(() => {})
    .finally(() => {
      youtubeBackgroundRefreshPromise_ = null;
    });

  return youtubeBackgroundRefreshPromise_;
}

function ensureYoutubeCache_() {
  hydrateYoutubeFromDisk_();

  if (isYoutubeCacheFresh_()) {
    return Promise.resolve(youtubeCache);
  }

  if (youtubeCache) {
    refreshYoutubeInBackground_();
    return Promise.resolve(youtubeCache);
  }

  return fetchConfigApi_("youtube").then(data => {
    setYoutubeCache_(data.videos || [], data.lastUpdated || "");
    return youtubeCache;
  });
}

function setClipCache_(cacheKey, clips, lastUpdated, time = Date.now()) {
  if (!clipCache[cacheKey]) return;

  clipCache[cacheKey].data = Array.isArray(clips) ? clips : [];
  clipCache[cacheKey].time = time;

  if (lastUpdated != null) {
    clipLastUpdated[cacheKey] = lastUpdated;
  }

  writePersistedPayload_(CLIP_PERSIST_PREFIX_ + cacheKey + "V1", {
    lastUpdated: clipLastUpdated[cacheKey] || "",
    clips: clipCache[cacheKey].data
  });
}

function hydrateClipCacheFromDisk_(cacheKey) {
  if (!clipCache[cacheKey]) return false;
  if (clipCache[cacheKey].data) return true;

  const data = readPersistedPayload_(CLIP_PERSIST_PREFIX_ + cacheKey + "V1");

  if (!data || !Array.isArray(data.clips)) return false;

  clipCache[cacheKey].data = data.clips;
  clipCache[cacheKey].time = Number(data.time) || 0;
  clipLastUpdated[cacheKey] = data.lastUpdated || "";
  return true;
}

function isClipCacheFresh_(cacheKey) {
  const cached = clipCache[cacheKey];
  return !!(
    cached?.data &&
    isCacheFresh_(cached.time, CLIPS_CLIENT_CACHE_MS)
  );
}

function getClipApiKeyMeta_(cacheKey) {
  switch (cacheKey) {
    case "twitch":
      return { apiView: "clips", type: "twitch" };
    case "twitchhot":
      return { apiView: "hotclips", type: "twitch" };
    case "soop":
      return { apiView: "soopclips", type: "soop" };
    case "soophot":
      return { apiView: "soophotclips", type: "soop" };
    case "chzzknew":
      return { apiView: "chzzknewclips", type: "chzzknew" };
    case "chzzkbest":
      return { apiView: "chzzkbestclips", type: "chzzkbest" };
    default:
      return null;
  }
}

function extractClipsFromApiData_(data, type) {
  if (type === "soop") {
    return data.soopclips || data.clips || [];
  }

  if (type === "chzzknew") {
    return data.chzzknewclips || data.clips || [];
  }

  if (type === "chzzkbest") {
    return data.chzzkbestclips || data.clips || [];
  }

  return data.clips || [];
}

function refreshClipCacheInBackground_(cacheKey) {
  const meta = getClipApiKeyMeta_(cacheKey);
  if (!meta) return Promise.resolve();

  if (clipBackgroundRefreshPromises_[cacheKey]) {
    return clipBackgroundRefreshPromises_[cacheKey];
  }

  clipBackgroundRefreshPromises_[cacheKey] = fetchConfigApi_(meta.apiView)
    .then(data => {
      const clips = extractClipsFromApiData_(data, meta.type);
      setClipCache_(cacheKey, clips, data.lastUpdated || "");
    })
    .catch(() => {})
    .finally(() => {
      delete clipBackgroundRefreshPromises_[cacheKey];
    });

  return clipBackgroundRefreshPromises_[cacheKey];
}

function ensureClipCache_(cacheKey) {
  hydrateClipCacheFromDisk_(cacheKey);

  if (isClipCacheFresh_(cacheKey)) {
    return Promise.resolve(clipCache[cacheKey].data);
  }

  if (clipCache[cacheKey]?.data) {
    refreshClipCacheInBackground_(cacheKey);
    return Promise.resolve(clipCache[cacheKey].data);
  }

  const meta = getClipApiKeyMeta_(cacheKey);
  if (!meta) return Promise.resolve([]);

  return fetchConfigApi_(meta.apiView).then(data => {
    const clips = extractClipsFromApiData_(data, meta.type);
    setClipCache_(cacheKey, clips, data.lastUpdated || "");
    return clips;
  });
}

function setArchiveCache_(list, lastUpdated, time = Date.now()) {
  archiveCache = Array.isArray(list) ? list : [];
  archiveCacheTime = time;
  writePersistedPayload_(ARCHIVE_PERSIST_KEY_, {
    lastUpdated: lastUpdated || "",
    archive: archiveCache
  });
}

function hydrateArchiveFromDisk_() {
  if (archiveCache) return true;

  const data = readPersistedPayload_(ARCHIVE_PERSIST_KEY_);

  if (!data || !Array.isArray(data.archive)) return false;

  archiveCache = data.archive;
  archiveCacheTime = Number(data.time) || 0;
  return true;
}

function isArchiveCacheFresh_() {
  const freshMs =
    typeof ARCHIVE_CLIENT_CACHE_MS === "number"
      ? ARCHIVE_CLIENT_CACHE_MS
      : 5 * 60 * 1000;

  return (
    Array.isArray(archiveCache) &&
    isCacheFresh_(archiveCacheTime, freshMs)
  );
}

function refreshArchiveInBackground_() {
  if (archiveBackgroundRefreshPromise_) {
    return archiveBackgroundRefreshPromise_;
  }

  archiveBackgroundRefreshPromise_ = fetchConfigApi_("archive")
    .then(data => {
      setArchiveCache_(data.archive || [], data.lastUpdated || "");
    })
    .catch(() => {})
    .finally(() => {
      archiveBackgroundRefreshPromise_ = null;
    });

  return archiveBackgroundRefreshPromise_;
}

function setBirthdaysCache_(list, lastUpdated, time = Date.now()) {
  birthdaysCache = Array.isArray(list) ? list : [];
  birthdaysCacheTime = time;

  if (lastUpdated != null && lastUpdated !== "") {
    playerLinksLastUpdated = lastUpdated;
  }

  writePersistedPayload_(BIRTHDAYS_PERSIST_KEY_, {
    lastUpdated: playerLinksLastUpdated || "",
    birthdays: birthdaysCache
  });
}

function hydrateBirthdaysFromDisk_() {
  if (birthdaysCache) return true;

  const data = readPersistedPayload_(BIRTHDAYS_PERSIST_KEY_);

  if (!data || !Array.isArray(data.birthdays)) return false;

  birthdaysCache = data.birthdays;
  birthdaysCacheTime = Number(data.time) || 0;

  if (data.lastUpdated) {
    playerLinksLastUpdated = data.lastUpdated;
  }

  return true;
}

function isBirthdaysCacheFresh_() {
  return (
    Array.isArray(birthdaysCache) &&
    isCacheFresh_(birthdaysCacheTime, BIRTHDAYS_CLIENT_CACHE_MS)
  );
}

function refreshBirthdaysInBackground_() {
  if (birthdaysBackgroundRefreshPromise_) {
    return birthdaysBackgroundRefreshPromise_;
  }

  birthdaysBackgroundRefreshPromise_ = fetchConfigApi_("birthdays")
    .then(data => {
      setBirthdaysCache_(data.birthdays || [], data.lastUpdated || "");
    })
    .catch(() => {})
    .finally(() => {
      birthdaysBackgroundRefreshPromise_ = null;
    });

  return birthdaysBackgroundRefreshPromise_;
}

function prefetchTeamsData_() {
  if (isPlayerLinksCacheUsable_("teams")) {
    persistTeamsPlayerLinksCache_();
    return;
  }

  const run = () => {
    if (isPlayerLinksCacheUsable_("teams")) return;

    const persisted = readPersistedTeamsPlayerLinksCache_();

    if (persisted) {
      playerLinksCache = persisted.playerLinks;
      playerLinksCacheTime = persisted.time || Date.now();
      playerLinksCacheMode = "teams";
      playerLinksLastUpdated = persisted.lastUpdated || "";
    }

    fetchTeamsPayload_()
      .then(payload => {
        setPlayerLinksCache_(
          payload.playerLinks,
          payload.lastUpdated,
          payload.mode
        );
      })
      .catch(() => {});
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 4000 });
  } else {
    setTimeout(run, 2000);
  }
}

function prefetchSecondaryData_() {
  const run = () => {
    // Full player list is the next-most common slow tab after TEAMS.
    if (!hasPlayerLinksCache_("full")) {
      if (hydratePlayerLinksFullFromDisk_()) {
        if (!isPlayerLinksCacheUsable_("full")) {
          refreshPlayerLinksInBackground_();
        }
      } else if (
        currentView !== "playerlinks" &&
        currentView !== "favorites" &&
        currentView !== "player" &&
        currentView !== "muted"
      ) {
        refreshPlayerLinksInBackground_();
      }
    }

    if (
      !isYoutubeCacheFresh_() &&
      currentView !== "youtube" &&
      currentView !== "youtubehot" &&
      currentView !== "youtubejp" &&
      currentView !== "mediagoats" &&
      currentView !== "player"
    ) {
      ensureYoutubeCache_().catch(() => {});
    }

    if (
      typeof archiveCache !== "undefined" &&
      !isArchiveCacheFresh_() &&
      !String(currentView || "").startsWith("archive")
    ) {
      hydrateArchiveFromDisk_();

      if (archiveCache) {
        if (!isArchiveCacheFresh_()) refreshArchiveInBackground_();
      } else {
        refreshArchiveInBackground_();
      }
    }
  };

  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(run, { timeout: 8000 });
  } else {
    setTimeout(run, 3500);
  }
}

function fetchTeamsPayload_() {
  return fetchConfigApi_("teams", { retries: 1 })
    .then(data => ({
      playerLinks: data.playerLinks || [],
      lastUpdated: data.lastUpdated || "",
      mode: "teams"
    }))
    .catch(() =>
      // Worker not deployed / cold edge — fall back to full playerlinks.
      fetchConfigApi_("playerlinks").then(data => ({
        playerLinks: data.playerLinks || [],
        lastUpdated: data.lastUpdated || "",
        mode: "full"
      }))
    );
}

function clearClientCache_() {

  liveCache = null;
  liveCacheTime = 0;

  youtubeCache = null;
  youtubeCacheTime = 0;

  playerLinksCache = null;
  playerLinksCacheTime = 0;
  playerLinksCacheMode = "";
  clearAllPersistedClientCaches_();

  birthdaysCache = null;
  birthdaysCacheTime = 0;

  archiveCache = null;
  archiveCacheTime = 0;

  todayStatsCache = null;
  todayStatsCacheTime = 0;

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
  hot: "HOT",
  kr: "KR",
  en: "EN",
  cn: "CN",
  jp: "JP",
  intl: "INTL",
  owcs: "OWCS",
  faceit: "FACEIT",
  
  mediagoats: "★MY GOATS",

  youtube: "YOUTUBE NEW",
  youtubehot: "YOUTUBE HOT",
  youtubejp: "YOUTUBE JP",

  clips: "TWITCH NEW",
  hotclips: "TWITCH HOT",
  jpclips: "TWITCH JP",
  soopclips: "SOOP NEW",
  soophotclips: "SOOP HOT",
  
  chzzknewclips: "CHZZK NEW",
  chzzkhotclips: "CHZZK HOT",
  chzzkbestclips: "CHZZK BEST",

  archive: "ARCHIVE",
  archivegoats: "★MY GOATS",
  archivekr: "KR",
  archiveen: "EN",
  archivecn: "CN",
  archivejp: "JP",
  archiveintl: "INTL",
  archiveowcs: "OWCS",
  archivefaceit: "FACEIT",

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
    const data = await fetchConfigApi_("voicelines", {
      retries: 2
    });

    voiceLines = data.voiceLines || [];

  } catch (e) {
    console.error("Voice lines load failed", e);
  }
}

const VIEW_GROUPS = {
  live: [
 "new",
 "goats",
 "hot",
 "kr",
 "en",
 "cn",
 "jp",
 "intl",
 "owcs",
 "faceit"
],

  clips: [
    "clips",
    "hotclips",
    "jpclips",
    "chzzknewclips",
    "chzzkhotclips",
    "chzzkbestclips",
    "soopclips",
    "soophotclips"
  ],

  youtube: ["youtube", "youtubehot", "youtubejp"],

  media: [
    "mediagoats",
    "youtube",
    "youtubehot",
    "youtubejp",
    "clips",
    "hotclips",
    "jpclips",
    "chzzknewclips",
    "chzzkhotclips",
    "chzzkbestclips",
    "soopclips",
    "soophotclips"
  ],

  archive: [
    "archive",
    "archivegoats",
    "archivekr",
    "archiveen",
    "archivecn",
    "archivejp",
    "archiveintl",
    "archiveowcs",
    "archivefaceit"
  ],

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
  howto: () => loadHowtoView(),
  watchowcs: () => loadWatchOwcsView(),
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

  const nextPath = viewToPath_(normalizeViewId_(view) || view);
  const currentPath =
    (location.pathname || "/").replace(/\/+$/, "") || "/";
  const shouldPush = nextPath !== currentPath;

  currentView = view;
  currentPlayerView = "teams";

  setViewUrl_(view, shouldPush);

  updateNavState(currentView);
  loadView(currentView);
  window.scrollTo(0, 0);
}

let currentLiveView =
  isLiveView(currentView)
    ? currentView
    : "new";

let currentMediaView =
  isMediaView(currentView)
    ? currentView
    : "youtube";

let currentArchiveView =
  isArchiveView(currentView)
    ? currentView
    : "archive";

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

function isMediaView(view) {
  return VIEW_GROUPS.media.includes(view);
}

function isArchiveView(view) {
  return VIEW_GROUPS.archive.includes(view);
}

function isPlayerView(view) {
  return VIEW_GROUPS.players.includes(view);
}

function hasSubNav_(view) {
  return (
    isLiveView(view) ||
    isMediaView(view) ||
    isArchiveView(view) ||
    (isPlayerView(view) && !isStaticView_(view))
  );
}

function hasFilterPanel_(view) {
  return hasSubNav_(view);
}

function hasCollapsibleFilters_(view) {
  return (
    isLiveView(view) ||
    isMediaView(view) ||
    isArchiveView(view)
  );
}

function updateNavState(view) {
  const liveButton = document.querySelector('[data-section="live"]');
  const archiveButton = document.querySelector('[data-section="archive"]');
  const mediaButton = document.querySelector('[data-section="media"]');
  const playersButton = document.querySelector('[data-section="players"]');

  const liveSubNav = document.getElementById("liveSubNav");
  const liveRoleSubNav = document.getElementById("liveRoleSubNav");
  const mediaSubNav = document.getElementById("mediaSubNav");
  const mediaRoleSubNav = document.getElementById("mediaRoleSubNav");
  const archiveSubNav = document.getElementById("archiveSubNav");
  const archiveRoleSubNav = document.getElementById("archiveRoleSubNav");
  const playerSubNav = document.getElementById("playerSubNav");
  const playerRoleSubNav = document.getElementById("playerRoleSubNav");

  document
    .querySelectorAll('.main-nav button:not(#searchToggle)')
    .forEach(b => b.classList.remove("active"));

  howtoNavButton?.classList.remove("active");
  watchOwcsNavButton?.classList.remove("active");
  toolsNavButton?.classList.remove("active");
  usefulLinksNavButton?.classList.remove("active");

  document
    .querySelectorAll(".sub-nav button")
    .forEach(b => b.classList.remove("active"));

  if (liveSubNav) liveSubNav.style.display = "none";
  if (liveRoleSubNav) liveRoleSubNav.style.display = "none";
  if (mediaSubNav) mediaSubNav.style.display = "none";
  if (mediaRoleSubNav) mediaRoleSubNav.style.display = "none";
  if (archiveSubNav) archiveSubNav.style.display = "none";
  if (archiveRoleSubNav) archiveRoleSubNav.style.display = "none";
  if (playerSubNav) playerSubNav.style.display = "none";
  if (playerRoleSubNav) playerRoleSubNav.style.display = "none";

  if (view === "howto") {
    howtoNavButton?.classList.add("active");

  } else if (view === "watchowcs") {
    watchOwcsNavButton?.classList.add("active");

  } else if (view === "toolstips") {
    toolsNavButton?.classList.add("active");

  } else if (view === "usefullinks") {
    usefulLinksNavButton?.classList.add("active");

  } else if (isLiveView(view)) {
    liveButton?.classList.add("active");
    if (liveSubNav) liveSubNav.style.display = "flex";
    if (liveRoleSubNav) liveRoleSubNav.style.display = "flex";

    document
      .querySelector(`#liveSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isArchiveView(view)) {
    archiveButton?.classList.add("active");
    if (archiveSubNav) archiveSubNav.style.display = "flex";
    if (archiveRoleSubNav) archiveRoleSubNav.style.display = "flex";

    document
      .querySelector(`#archiveSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isMediaView(view)) {
    mediaButton?.classList.add("active");
    if (mediaSubNav) mediaSubNav.style.display = "flex";
    if (mediaRoleSubNav) mediaRoleSubNav.style.display = "flex";

    document
      .querySelector(`#mediaSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isPlayerView(view)) {
    playersButton?.classList.add("active");

    if (playerSubNav && !isStaticView_(view)) {
      playerSubNav.style.display = "flex";
    }

    if (playerRoleSubNav && view === "playerlinks") {
      playerRoleSubNav.style.display = "flex";
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

      } else if (button.dataset.section === "archive") {
        currentView = currentArchiveView;

      } else if (button.dataset.section === "media") {
        currentView = currentMediaView;

      } else if (button.dataset.section === "players") {
        currentView = currentPlayerView;
        
      } else {
        currentView = button.dataset.view;
      }

      setViewUrl_(currentView);

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

      if (isMediaView(currentView)) {
        currentMediaView = currentView;
      }

      if (isArchiveView(currentView)) {
        currentArchiveView = currentView;
      }

      if (
        isPlayerView(currentView) &&
        !isStaticView_(currentView)
      ) {
        currentPlayerView = currentView;
      }
            
      setViewUrl_(currentView);

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
    !isMediaView(currentView) &&
    !isArchiveView(currentView)
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

  if (isMediaView(currentView)) {
    return VIEW_GROUPS.media;
  }

  if (isArchiveView(currentView)) {
    return VIEW_GROUPS.archive;
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
  if (isMediaView(currentView)) currentMediaView = currentView;
  if (isArchiveView(currentView)) currentArchiveView = currentView;

  setViewUrl_(currentView);

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
    // "mediagoats", archive views, etc. always go through the normal
    // loader since they have their own dedicated fetch/cache logic.
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

    } else if (isMediaView(currentView)) {
      rerenderCurrentMediaView_();

    } else if (isArchiveView(currentView)) {
      rerenderCurrentArchiveView_();

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

  } else if (isMediaView(currentView)) {
    rerenderCurrentMediaView_();

  } else if (isArchiveView(currentView)) {
    rerenderCurrentArchiveView_();

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
    isMediaView(view)
  ) {
    loadTodayStats_();
  }

  if (isLiveView(view)) {
    loadLiveView(view);
    return;
  }

  if (view === "mediagoats") {
    loadMediaGoatsView();
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

  if (isArchiveView(view)) {
    loadArchiveView(view);
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

  setViewUrl_("new");

  updateNavState(currentView);
  updateViewActionButton_(currentView);
  loadLiveView(currentView);
  
}

function loadMutedPlayersView() {
  currentView = "muted";
  currentPlayerView = "muted";
  setViewUrl_("muted");

  resetSeo_();

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove(
    "youtube-view",
    "clip-view",
    "mediagoats-view",
    "archive-view",
    "player-detail-view"
  );

  pageTitle.textContent = "◆MUTED";
  setRandomVoiceLine();

  updated.textContent = "";

  currentData = getMutedPlayers_();

  renderMutedPlayersView();
}

function renderMutedPlayersView() {
  const allMuted = getMutedPlayers_();
  const muted = allMuted.filter(name =>
    matchesSearch_(name, searchBox.value)
  );

  app.className = "table-mode muted-mode";

  viewNote.innerHTML = siteNote_(
    `◆ Players hidden from LIVE, YouTube and Clips.`,
    `◆ LIVE / YouTube / Clips から非表示にしたプレイヤーです。`
  );

  const exportBox = `
    <div class="goats-export-box">
      ${
        allMuted.length
          ? `
            <button class="goats-export-button" data-muted-export="backup">
              ◆Backup
            </button>
          `
          : ""
      }
      <button class="goats-export-button" data-muted-export="import">
        ◆Import
      </button>
    </div>
  `;

  if (!muted.length) {
    app.innerHTML = `
      ${
        allMuted.length
          ? exportBox
          : `
            <div class="goats-empty-actions">
              <button class="goats-export-button" data-muted-export="import">
                ◆Import
              </button>
            </div>
          `
      }

      <p class="empty">No muted players.</p>
    `;
    return;
  }

  app.innerHTML = `
    ${exportBox}

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
    ig: {
      name: "Instagram",
      src: "/icons/Instagram.png"
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
    ig: { name: "Instagram", src: "/icons/Instagram.png" },
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
    case "OWWC":
    case "OWWC TEAM OFFICIAL":
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

  if (currentView === "mediagoats") {
    el.textContent =
      "YouTube updates every 30 min, Clips update every day.";
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

function getTeamLogoPath_(team, useLightTheme = true, forceLightLogo = false) {

  const name = String(team || "").trim();

  if (!name || name === "No team" || name === "-") return "";

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
    forceLightLogo ||
    (
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
      )
    );

  if (
    isLightTheme &&
    lightLogoTeams.includes(name)
  ) {
    return `/TeamLogo/${file}_light.png`;
  }

  return `/TeamLogo/${file}.png`;
}

function getPlayerOwwcTeam_(p) {
  const direct = String(p?.owwcTeam || "").trim();

  if (direct && direct !== "-") {
    return direct;
  }

  const name = String(p?.name || "").trim();

  if (!name || !Array.isArray(playerLinksCache)) {
    return "";
  }

  const hit = playerLinksCache.find(x => x.name === name);
  return String(hit?.owwcTeam || "").trim();
}

function formatTeamDisplayName_(team) {
  return String(team || "")
    .replace(/_/g, " ")
    .trim();
}

function loadPlayerTableColWidths_(storageKey) {
  try {
    return JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    );
  } catch (e) {
    return {};
  }
}

function savePlayerTableColWidths_(table, storageKey) {
  const widths = {};

  table.querySelectorAll("thead th").forEach(th => {
    const key = th.dataset.colKey;
    if (!key) return;

    const width = parseInt(th.dataset.colWidth || "0", 10);
    if (width > 0) widths[key] = width;
  });

  localStorage.setItem(storageKey, JSON.stringify(widths));
}

function syncPlayerTableColWidths_(table, cols, ths) {
  let total = 0;

  ths.forEach((th, index) => {
    const widthPx = Math.max(
      0,
      parseInt(th.dataset.colWidth || "0", 10)
    );

    const width = `${widthPx}px`;

    th.dataset.colWidth = String(widthPx);
    th.style.width = width;
    th.style.minWidth = "0";
    th.style.maxWidth = width;

    if (cols[index]) {
      cols[index].style.width = width;
      cols[index].style.minWidth = "0";
    }

    total += widthPx;
  });

  if (total > 0) {
    table.style.width = `${total}px`;
    table.style.minWidth = `${total}px`;
  }
}

function setupPlayerTableColumnResize_(
  tableOrSelector = ".player-table",
  storageKey = "playerTableColWidths"
) {
  const table =
    typeof tableOrSelector === "string"
      ? document.querySelector(tableOrSelector)
      : tableOrSelector;

  if (!table) return;

  const ths = Array.from(table.querySelectorAll("thead th"));
  if (!ths.length) return;

  let colgroup = table.querySelector("colgroup");

  if (!colgroup) {
    colgroup = document.createElement("colgroup");
    ths.forEach(() => {
      colgroup.appendChild(document.createElement("col"));
    });
    table.insertBefore(colgroup, table.firstChild);
  }

  const cols = Array.from(colgroup.querySelectorAll("col"));
  const saved = loadPlayerTableColWidths_(storageKey);

  ths.forEach((th, index) => {
    const key =
      th.dataset.colKey ||
      th.dataset.sort ||
      `col${index}`;

    th.dataset.colKey = key;

    const widthPx =
      saved[key] ||
      Math.max(8, Math.round(th.getBoundingClientRect().width));

    th.dataset.colWidth = String(widthPx);
  });

  table.classList.add("player-table-resizable");
  syncPlayerTableColWidths_(table, cols, ths);

  ths.forEach(th => {
    if (th.querySelector(".col-resize-handle")) return;

    const handle = document.createElement("span");
    handle.className = "col-resize-handle";
    handle.title = "Drag to resize";
    th.appendChild(handle);

    const startResize_ = (clientX) => {
      const startWidth = parseInt(th.dataset.colWidth || "0", 10) ||
        Math.round(th.getBoundingClientRect().width);

      table.classList.add("is-col-resizing");
      document.body.classList.add("is-col-resizing");

      const onMove_ = (moveX) => {
        const nextWidth = Math.max(
          0,
          Math.round(startWidth + (moveX - clientX))
        );

        th.dataset.colWidth = String(nextWidth);
        syncPlayerTableColWidths_(table, cols, ths);
      };

      const onMouseMove_ = (e) => {
        e.preventDefault();
        onMove_(e.clientX);
      };

      const onTouchMove_ = (e) => {
        if (!e.touches[0]) return;
        e.preventDefault();
        onMove_(e.touches[0].clientX);
      };

      const stop_ = () => {
        document.removeEventListener("mousemove", onMouseMove_);
        document.removeEventListener("mouseup", stop_);
        document.removeEventListener("touchmove", onTouchMove_);
        document.removeEventListener("touchend", stop_);
        document.removeEventListener("touchcancel", stop_);

        table.classList.remove("is-col-resizing");
        document.body.classList.remove("is-col-resizing");
        savePlayerTableColWidths_(table, storageKey);
      };

      document.addEventListener("mousemove", onMouseMove_);
      document.addEventListener("mouseup", stop_);
      document.addEventListener("touchmove", onTouchMove_, { passive: false });
      document.addEventListener("touchend", stop_);
      document.addEventListener("touchcancel", stop_);
    };

    handle.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();
      startResize_(e.clientX);
    });

    handle.addEventListener("touchstart", e => {
      if (!e.touches[0]) return;
      e.preventDefault();
      e.stopPropagation();
      startResize_(e.touches[0].clientX);
    }, { passive: false });

    handle.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function getCardTeamLogoPaths_(p) {
  const paths = [];
  const seen = new Set();

  function addTeam_(team) {
    const name = String(team || "").trim();
    if (!name || name === "-" || name === "No team") return;

    const path = getTeamLogoPath_(name);
    if (!path || seen.has(path)) return;

    seen.add(path);
    paths.push(path);
  }

  // OWWC national logo on the left, club logo on the right.
  addTeam_(getPlayerOwwcTeam_(p));
  addTeam_(p?.team);

  return paths;
}

function renderCardTeamWatermarks_(p) {
  const paths = getCardTeamLogoPaths_(p);

  if (!paths.length) return "";

  return `
    <div class="card-team-watermarks">
      ${paths.map(src => `
        <img
          class="card-team-watermark"
          src="${src}"
          alt=""
          loading="lazy"
          onerror="this.remove()"
        >
      `).join("")}
    </div>
  `;
}

function renderPlayerDetailTeamLogos_(player) {
  const paths = getCardTeamLogoPaths_(player);

  if (!paths.length) return "";

  return `
    <div class="player-detail-team-logos">
      ${paths.map(src => `
        <img
          class="player-detail-team-logo"
          src="${src}"
          alt=""
          loading="lazy"
          onerror="this.remove()"
        >
      `).join("")}
    </div>
  `;
}

async function init() {
  speechSynthesis.getVoices();

  // Hydrate disk caches before first paint when possible.
  hydratePlayerLinksFullFromDisk_();
  hydrateYoutubeFromDisk_();
  hydrateBirthdaysFromDisk_();

  loadView(currentView);
  loadSiteGuided_();

  // Let the initial view register its Apps Script request first.
  await Promise.resolve();

  const pending = Object.values(gasFetchInflightByView_);
  if (pending.length) {
    await Promise.all(pending.map(p => p.catch(() => {})));
  }

  await loadVoiceLines();
  setRandomVoiceLine();

  // Warm slower tabs after first paint.
  // LIVE first: small payload, most common next tab.
  setupLivePrefetchListeners_();

  if (!isLiveView(currentView)) {
    prefetchLiveData_();
  }

  if (currentView !== "teams" && currentView !== "team") {
    prefetchTeamsData_();
  }

  prefetchSecondaryData_();
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

const VIEW_SEO_META_ = {
  new: {
    title: "LIVE NEW Streams | OW KITSUNE GUIDE",
    description:
      "Latest Overwatch pro player live streams from Twitch, CHZZK, SOOP and more."
  },
  goats: {
    title: "MY GOATS Live Streams | OW KITSUNE GUIDE",
    description:
      "Follow live streams from your favorite Overwatch pro players."
  },
  hot: {
    title: "HOT Live Streams | OW KITSUNE GUIDE",
    description:
      "Most-watched Overwatch pro player live streams right now."
  },
  kr: {
    title: "KR Live Streams | OW KITSUNE GUIDE",
    description: "Live Overwatch streams from Korean pro players."
  },
  en: {
    title: "EN Live Streams | OW KITSUNE GUIDE",
    description: "Live Overwatch streams from English-speaking pro players."
  },
  cn: {
    title: "CN Live Streams | OW KITSUNE GUIDE",
    description: "Live Overwatch streams from Chinese pro players."
  },
  jp: {
    title: "JP Live Streams | OW KITSUNE GUIDE",
    description: "Live Overwatch streams from Japanese pro players."
  },
  intl: {
    title: "INTL Live Streams | OW KITSUNE GUIDE",
    description: "International Overwatch pro player live streams."
  },
  owcs: {
    title: "OWCS Live Streams | OW KITSUNE GUIDE",
    description: "Live streams related to Overwatch Champions Series."
  },
  faceit: {
    title: "FACEIT Live Streams | OW KITSUNE GUIDE",
    description: "FACEIT Overwatch pro player live streams."
  },
  archive: {
    title: "Recent Streams Archive | OW KITSUNE GUIDE",
    description: "Recent Overwatch pro player stream VODs and archives."
  },
  archivegoats: {
    title: "MY GOATS Stream Archive | OW KITSUNE GUIDE",
    description: "Stream archives for your favorite Overwatch pro players."
  },
  youtube: {
    title: "YouTube NEW Videos | OW KITSUNE GUIDE",
    description: "Latest YouTube videos from Overwatch pro players."
  },
  youtubehot: {
    title: "YouTube HOT Videos | OW KITSUNE GUIDE",
    description: "Popular YouTube videos from Overwatch pro players."
  },
  youtubejp: {
    title: "YouTube JP Videos | OW KITSUNE GUIDE",
    description: "Japanese Overwatch pro player YouTube videos."
  },
  clips: {
    title: "Twitch NEW Clips | OW KITSUNE GUIDE",
    description: "Latest Twitch clips from Overwatch pro players."
  },
  hotclips: {
    title: "Twitch HOT Clips | OW KITSUNE GUIDE",
    description: "Popular Twitch clips from Overwatch pro players."
  },
  jpclips: {
    title: "Twitch JP Clips | OW KITSUNE GUIDE",
    description: "Japanese Overwatch pro player Twitch clips."
  },
  chzzknewclips: {
    title: "CHZZK NEW Clips | OW KITSUNE GUIDE",
    description: "Latest CHZZK clips from Overwatch pro players."
  },
  chzzkhotclips: {
    title: "CHZZK HOT Clips | OW KITSUNE GUIDE",
    description: "Popular CHZZK clips from Overwatch pro players."
  },
  chzzkbestclips: {
    title: "CHZZK BEST Clips | OW KITSUNE GUIDE",
    description: "Top CHZZK clips from Overwatch pro players."
  },
  soopclips: {
    title: "SOOP NEW Clips | OW KITSUNE GUIDE",
    description: "Latest SOOP clips from Overwatch pro players."
  },
  soophotclips: {
    title: "SOOP HOT Clips | OW KITSUNE GUIDE",
    description: "Popular SOOP clips from Overwatch pro players."
  },
  mediagoats: {
    title: "MY GOATS Media | OW KITSUNE GUIDE",
    description: "Clips and videos from your favorite Overwatch pro players."
  },
  teams: {
    title: "Overwatch Teams & Rosters | OW KITSUNE GUIDE",
    description:
      "Overwatch team rosters with player links, live streams, YouTube and social profiles."
  },
  playerlinks: {
    title: "All Overwatch Pro Players | OW KITSUNE GUIDE",
    description:
      "Directory of Overwatch pro players with Twitch, CHZZK, SOOP, Bilibili, YouTube and social links."
  },
  birthdays: {
    title: "Overwatch Pro Player Birthdays | OW KITSUNE GUIDE",
    description: "Birthday calendar for Overwatch professional players."
  },
  favorites: {
    title: "MY GOATS Players | OW KITSUNE GUIDE",
    description: "Your favorite Overwatch pro player profiles and links."
  },
  howto: {
    title: "How to Use | OW KITSUNE GUIDE",
    description: "How to use OW KITSUNE GUIDE to track Overwatch pro players."
  },
  watchowcs: {
    title: "OWCS観戦ガイド | OW KITSUNE GUIDE",
    description:
      "How and where to watch Overwatch Champions Series matches."
  },
  toolstips: {
    title: "Tools & Tips | OW KITSUNE GUIDE",
    description: "Tools and tips for following Overwatch esports."
  },
  usefullinks: {
    title: "Useful Links | OW KITSUNE GUIDE",
    description: "Useful Overwatch esports links and resources."
  },
  faq: {
    title: "FAQ | OW KITSUNE GUIDE",
    description: "Frequently asked questions about OW KITSUNE GUIDE."
  },
  about: {
    title: "About | OW KITSUNE GUIDE",
    description: "About OW KITSUNE GUIDE."
  },
  privacy: {
    title: "Privacy Policy | OW KITSUNE GUIDE",
    description: "Privacy policy for OW KITSUNE GUIDE."
  },
  updatelog: {
    title: "Update Log | OW KITSUNE GUIDE",
    description: "Site update history for OW KITSUNE GUIDE."
  },
  muted: {
    title: "Muted Players | OW KITSUNE GUIDE",
    description: "Manage muted Overwatch players on OW KITSUNE GUIDE."
  }
};

const DEFAULT_SEO_META_ = {
  title:
    "OW KITSUNE GUIDE | Overwatch Pro Player Streams, Videos & Clips",
  description:
    "Track Overwatch pro player live streams, YouTube videos, clips and player links."
};

function resetSeo_() {
  document
    .querySelectorAll(
      'script[data-player-jsonld="true"], script[data-team-jsonld="true"], script[data-edge-seo="true"]'
    )
    .forEach(script => script.remove());

  applyPathSeo_(location.pathname || "/");
}

function applyPathSeo_(pathname) {
  const path =
    String(pathname || "/")
      .replace(/\/+$/, "") || "/";

  // Detail pages set full SEO after data loads; still fix canonical for crawlers mid-load.
  if (path.startsWith("/team/")) {
    const slug = path.replace(/^\/team\//, "");
    const title = `${slug.replace(/-/g, " ")} | OW KITSUNE GUIDE`;
    const description =
      "Overwatch team roster, live streams, YouTube videos, clips and player links.";
    document.title = title;
    setMeta_("description", description);
    setCanonical_(`${location.origin}/team/${slug}`);
    setOg_("og:title", title);
    setOg_("og:description", description);
    setOg_("og:url", `${location.origin}/team/${slug}`);
    return;
  }

  if (path.startsWith("/player/")) {
    const slug = decodeURIComponent(path.replace(/^\/player\//, ""));
    const title = `${slug} | OW KITSUNE GUIDE`;
    const description =
      "Overwatch player profile with streams, videos, clips and social links.";
    document.title = title;
    setMeta_("description", description);
    setCanonical_(
      `${location.origin}/player/${encodeURIComponent(slug)}`
    );
    setOg_("og:title", title);
    setOg_("og:description", description);
    setOg_(
      "og:url",
      `${location.origin}/player/${encodeURIComponent(slug)}`
    );
    return;
  }

  const viewKey =
    path === "/" || path === "/index.html"
      ? ""
      : decodeURIComponent(path.slice(1).split("/")[0] || "");

  if (!viewKey) {
    document.title = DEFAULT_SEO_META_.title;
    setMeta_("description", DEFAULT_SEO_META_.description);
    setCanonical_(`${location.origin}/`);
    setOg_("og:title", DEFAULT_SEO_META_.title);
    setOg_("og:description", DEFAULT_SEO_META_.description);
    setOg_("og:url", `${location.origin}/`);
    setOg_("og:type", "website");
    return;
  }

  const meta = VIEW_SEO_META_[viewKey] || DEFAULT_SEO_META_;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  document.title = meta.title;
  setMeta_("description", meta.description);
  setCanonical_(`${location.origin}${canonicalPath}`);
  setOg_("og:title", meta.title);
  setOg_("og:description", meta.description);
  setOg_("og:url", `${location.origin}${canonicalPath}`);
  setOg_("og:type", "website");
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

  if (region.toLowerCase() === "owwc team official") {
    return false;
  }

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

  setViewUrl_("playerlinks", true);

  searchBox.value = value;

  updateNavState(currentView);
  loadPlayerLinksView();
});

function setClipCacheIfNotEmpty_(key, data, lastUpdated) {
  if (Array.isArray(data) && data.length > 0) {
    setClipCache_(key, data, lastUpdated);
  }
}