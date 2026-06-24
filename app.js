const app = document.getElementById("app");
const updated = document.getElementById("updated");
const viewNote = document.getElementById("viewNote");
const pageTitle = document.getElementById("pageTitle");
const voiceLine = document.getElementById("voiceLine");
const voiceActor = document.getElementById("voiceActor");

speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};

voiceLine?.addEventListener(
  "click",
  speakCurrentVoiceLine_
);

const searchBox = document.getElementById("searchBox");
const toolsButton =  document.getElementById("toolsButton");

const themeToggle = document.getElementById("themeToggle");

const notifyButton =  document.getElementById("notifyButton");
const settingsButton =  document.getElementById("settingsButton");
const settingsMenu =  document.getElementById("settingsMenu");

function applyThemeButtonText_() {
  if (!themeToggle) return;

  themeToggle.textContent =
    document.body.classList.contains("light-theme")
      ? "🎨 Theme: Light"
      : "🎨 Theme: Dark";
}

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
}

applyThemeButtonText_();

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

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme")
      ? "light"
      : "dark"
  );

  applyThemeButtonText_();
});

toolsButton?.addEventListener(
  "click",
  () => loadToolsView()
);

const params = new URLSearchParams(window.location.search);
let currentView = params.get("view") || "new";

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
  goats: "★",
  viewers: "HOT",
  kr: "KR",
  en: "EN",
  cn: "CN",
  jp: "JP",
  intl: "INTL",
  
  youtube: "NEW",
  youtubegoats: "★",
  youtubehot: "HOT",
  youtubejp: "JP",

  clips: "NEW",
  goatclips: "★",
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
  favorites: "MY GOATS"
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
  const clipsSubNav = document.getElementById("clipsSubNav");
  const youtubeSubNav = document.getElementById("youtubeSubNav");
  const playerSubNav = document.getElementById("playerSubNav");

  document
    .querySelectorAll('.main-nav button:not(#searchToggle)')
    .forEach(b => b.classList.remove("active"));

  document
    .querySelectorAll(".sub-nav button")
    .forEach(b => b.classList.remove("active"));

  if (liveSubNav) liveSubNav.style.display = "none";
  if (clipsSubNav) clipsSubNav.style.display = "none";
  if (youtubeSubNav) youtubeSubNav.style.display = "none";
  if (playerSubNav) playerSubNav.style.display = "none";

  if (isLiveView(view)) {
    liveButton?.classList.add("active");
    if (liveSubNav) liveSubNav.style.display = "flex";

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

function loadYoutubeView(view) {
  viewNote.textContent = "";
  document.body.classList.add("youtube-view");
  document.body.classList.remove("clip-view");

  const now = Date.now();

  pageTitle.textContent = titles[view] || "YOUTUBE";
  setRandomVoiceLine();

  if (
    youtubeCache &&
    now - youtubeCacheTime < YOUTUBE_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent =
    "Updates every 30 min";

    currentData = filterYoutubeView(youtubeCache, view);
    renderYoutube(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=youtube")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      updated.textContent =
      "Updates every 30 min";

      finishFakeProgress();

      youtubeCache = data.videos || [];
      youtubeCacheTime = Date.now();

      currentData = filterYoutubeView(youtubeCache, view);
      renderYoutube(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function loadClipsView(view) {
  viewNote.textContent = "";
  document.body.classList.add("clip-view");
  document.body.classList.remove("youtube-view");
  
  const now = Date.now();

  pageTitle.textContent = titles[view] || view.toUpperCase();
  setRandomVoiceLine();

  if (
    view === "hotclips" ||
    view === "soophotclips" ||
    view === "chzzkhotclips"
  ) {
    viewNote.textContent =
      "HOT = Most viewed clips from the last 30 days";

  } else if (view === "chzzkbestclips") {
    viewNote.textContent =
      "BEST = Popular clips";

  } else {
    viewNote.textContent = "";
  }

  if (view === "goatclips") {
    loadGoatClipsView();
    return;
  }
  
  const source = getClipSource_(view);
  const cached = clipCache[source.cacheKey];

  if (
    cached?.data &&
    now - cached.time < CLIPS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    updated.textContent =
    "Updates daily";

    currentData = filterClipView(cached.data, view);
    renderClips(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=" + source.apiView)
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      clipLastUpdated[source.cacheKey] =
        data.lastUpdated || "";

      updated.textContent =
        "Updates daily";

      finishFakeProgress();

      const clips = getClipsFromApiData_(data, source.type);

      setClipCache_(source.cacheKey, clips);

      currentData = filterClipView(clips, view);
      renderClips(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function loadGoatClipsView() {
  viewNote.textContent = "";
  const now = Date.now();

  pageTitle.textContent = "★";
  setRandomVoiceLine();
  viewNote.textContent =
    "Favorite players' clips from Twitch, CHZZK and SOOP.";

  const allReady =
    clipCache.twitch.data &&
    clipCache.twitchhot.data &&
    clipCache.soop.data &&
    clipCache.chzzknew.data &&
    clipCache.chzzkbest.data &&
    now - clipCache.twitch.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.twitchhot.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.soop.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.chzzknew.time < CLIPS_CLIENT_CACHE_MS &&
    now - clipCache.chzzkbest.time < CLIPS_CLIENT_CACHE_MS;

  if (allReady) {
    requestId++;
    stopFakeProgress();

    updated.textContent = "Updates daily";

    currentData = buildGoatClips_();
    renderClips(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  Promise.all([
    fetch(CONFIG.API_URL + "?view=clips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=hotclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=soopclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=chzzknewclips").then(r => r.json()),
    fetch(CONFIG.API_URL + "?view=chzzkbestclips").then(r => r.json())
  ])
    .then(([twitchNew, twitchHot, soop, chzzkNew, chzzkBest]) => {
    
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }
    
      if (currentView !== "goatclips") {
        return;
      }
    
      finishFakeProgress();

      setClipCache_("twitch", twitchNew.clips || []);
      setClipCache_("twitchhot", twitchHot.clips || []);
      setClipCache_("soop", soop.soopclips || []);
      setClipCache_("chzzknew", chzzkNew.chzzknewclips || []);
      setClipCache_("chzzkbest", chzzkBest.chzzkbestclips || []);

      updated.textContent = "Updates daily";

      currentData = buildGoatClips_();
      renderClips(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      app.innerHTML = `<p class="error">Failed to load clips.</p>`;
      console.error(error);
    });
}

function buildGoatClips_() {
  const favs = getFavorites_();

  const allClips = [
    ...(clipCache.twitch.data || []),
    ...(clipCache.twitchhot.data || []),
    ...(clipCache.soop.data || []),
    ...(clipCache.chzzknew.data || []),
    ...(clipCache.chzzkbest.data || [])
  ];

  const seen = new Set();

  return allClips
    .filter(c => favs.includes(c.name))
    .filter(c => {
      const key = c.url || `${c.name}-${c.rawTitle || c.title}-${c.date}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getClipSource_(view) {
  if (view === "soopclips" || view === "soophotclips") {
    return {
      type: "soop",
      apiView: view === "soophotclips" ? "soophotclips" : "soopclips",
      cacheKey: "soop"
    };
  }

  if (view === "chzzknewclips" || view === "chzzkhotclips") {
    return {
      type: "chzzknew",
      apiView: "chzzknewclips",
      cacheKey: "chzzknew"
    };
  }

  if (view === "chzzkbestclips") {
    return {
      type: "chzzkbest",
      apiView: "chzzkbestclips",
      cacheKey: "chzzkbest"
    };
  }

  if (view === "hotclips") {
    return {
      type: "twitch",
      apiView: "hotclips",
      cacheKey: "twitchhot"
    };
  }

  return {
    type: "twitch",
    apiView: "clips",
    cacheKey: "twitch"
  };
}

function getClipsFromApiData_(data, type) {
  if (type === "soop") return data.soopclips || [];
  if (type === "chzzknew") return data.chzzknewclips || [];
  if (type === "chzzkbest") return data.chzzkbestclips || [];

  return data.clips || [];
}

function setClipCache_(cacheKey, clips) {
  if (!clipCache[cacheKey]) return;

  clipCache[cacheKey].data = clips;
  clipCache[cacheKey].time = Date.now();
}

function loadLiveView(view) {
  viewNote.textContent = "";
  const now = Date.now();

  pageTitle.textContent =
    titles[view] || view.toUpperCase();

  setRandomVoiceLine();

  if (
  liveCache &&
  now - liveCacheTime < LIVE_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();
  
    updated.textContent =
      "Updates every 5 min";
  
    renderLiveFromCache(view);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=new")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      finishFakeProgress();

      liveCache = data;
      liveCacheTime = Date.now();

      updated.textContent =
      "Updates every 5 min";

      if (data.counts) {
        updateAllButtonCounts(data.counts);
      }

      renderLiveFromCache(view);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML =
        `<p class="error">Failed to load data.</p>`;

      console.error(error);
    });
}

function renderLiveFromCache(view) {
  const players = liveCache?.players || [];

  checkLiveNotifications_(players);

  currentData = getClientFilteredLivePlayers(players, view);
  renderLive(currentData);
}

function getClientFilteredLivePlayers(players, view) {
  return players
    .filter(p => matchLiveViewClient(p, view))
    .sort((a, b) => {
      if (
        view === "viewers" ||
        view === "kr" ||
        view === "jp" ||
        view === "en" ||
        view === "cn" ||
        view === "intl"
      ) {
        return Number(b.viewers || 0) - Number(a.viewers || 0);
      }

      return getLiveMinutesClient(a.startedAt) - getLiveMinutesClient(b.startedAt);
    });
}

function matchLiveViewClient(p, view) {
  const platform = String(p.platform || "");
  const language = String(p.language || "");

  switch (view) {
    case "goats":
      return getFavorites_().includes(p.name);
      
    case "kr":
      return (
        platform.includes("CHZZK") ||
        platform.includes("SOOP") ||
        language === "KO"
      );

    case "jp":
      return language === "JA";

    case "en":
      return language === "EN";

    case "cn":
      return platform.includes("BILIBILI");

    case "intl":
      return (
        !platform.includes("CHZZK") &&
        !platform.includes("SOOP") &&
        !platform.includes("BILIBILI") &&
        language &&
        language !== "KO" &&
        language !== "JA" &&
        language !== "EN"
      );

    default:
      return true;
  }
}

function getLiveMinutesClient(startedAt) {
  if (!startedAt) return 999999;

  const date = new Date(String(startedAt).replace(/\//g, "-"));

  if (isNaN(date.getTime())) return 999999;

  return Math.floor((Date.now() - date.getTime()) / 60000);
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

function filterYoutubeView(videos, view) {
  const result = [...videos];

  if (view === "youtubehot") {
    return sortByViews_(result);
  }

  if (view === "youtubegoats") {
    return result.filter(v =>
      getFavorites_().includes(v.name)
    );
  }

  if (view === "youtubejp") {
    return result.filter(v =>
      getNationalityRegionClass(v.nationality) === "region-jp"
    );
  }

  return sortByDateDesc_(result);
}

function sortByViews_(items) {
  return items.sort(
    (a, b) => Number(b.views || 0) - Number(a.views || 0)
  );
}

function sortByDateDesc_(items) {
  return items.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

function filterClips(clips) {
  const keyword =
    searchBox.value.toLowerCase().trim();

  if (!keyword) return clips;

  return clips.filter(c =>
    [
      c.name,
      c.team,
      c.role,
      c.nationality,
      c.rawTitle,
      c.titleJp,
      c.titleEn,
      c.date
    ]
      .join(" ")
      .toLowerCase()
      .includes(keyword)
  );
}

function filterClipView(clips, view) {
  const result = [...clips];

  if (view === "jpclips") {
    return result.filter(c =>
      getNationalityRegionClass(c.nationality) === "region-jp"
    );
  }

  if (view === "chzzkbestclips") {
    return sortByViews_(result);
  }

  if (view === "chzzkhotclips" || view === "soophotclips") {
    return sortByViews_(
      filterRecentClips_(result, 30)
    );
  }

  return sortByDateDesc_(result);
}

function filterRecentClips_(clips, daysLimit) {
  return clips.filter(c => {
    const date = new Date(c.date);
    if (isNaN(date.getTime())) return false;

    const days =
      (Date.now() - date.getTime()) /
      (1000 * 60 * 60 * 24);

    return days <= daysLimit;
  });
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
        <div class="player-name">

          <span
            class="favorite-star ${isFavorite_(p.name) ? "active" : ""}"
            data-favorite-name="${escapeHtml(p.name || "")}"
          >
            ${isFavorite_(p.name) ? "★" : "☆"}
          </span>
        
          ${p.name}
        
        </div>
        <div class="meta">${p.team || "-"} │ ${p.role || "-"} │ ${p.nationality || "-"}</div>
        <div class="stats">${p.platform}　🕓${formatLiveFor(p.startedAt)}　👥${Number(p.viewers || 0).toLocaleString()}</div>
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

  app.innerHTML =
    videos
      .map(renderYoutubeCard_)
      .join("");
}

function renderYoutubeCard_(v) {
  const { mainTitle, subTitles } =
    buildMediaTitles_(
      v.rawTitle || "",
      v.titleJp || "",
      v.titleEn || ""
    );

  return `
    <a
      class="card-link youtube-card-link"
      href="${v.url}"
      target="_blank"
      rel="noopener"
    >
      <div class="youtube-card ${getNationalityRegionClass(v.nationality)}">

        ${
          v.thumbnail
            ? `<img
                 class="youtube-thumb"
                 src="${v.thumbnail}"
                 loading="lazy"
                 alt=""
               >`
            : ""
        }

        <div class="youtube-info">

          <div class="youtube-title">
            ${escapeHtml(mainTitle)}
          </div>

          ${subTitles.map(t => `
            <div class="youtube-subtitle">
              ${escapeHtml(t)}
            </div>
          `).join("")}

          <div class="youtube-player">
            <span
              class="favorite-star ${isFavorite_(v.name) ? "active" : ""}"
              data-favorite-name="${escapeHtml(v.name || "")}"
            >
              ${isFavorite_(v.name) ? "★" : "☆"}
            </span>
            ${escapeHtml(v.name || "-")}
          </div>

          <div class="youtube-meta">
            ${escapeHtml(v.team || "-")}
            │
            ${escapeHtml(v.role || "-")}
            │
            ${escapeHtml(v.nationality || "-")}
          </div>

          <div class="youtube-date">
            ▶️ ${formatViews(v.views)}
            ・
            🕓 ${timeAgo(v.date)}
          </div>

        </div>
      </div>
    </a>
  `;
}

function buildMediaTitles_(raw, jp, en) {
  let mainTitle = "";
  const subTitles = [];

  if (jp) {
    mainTitle = jp;

    if (en) {
      subTitles.push(en);
    }

    if (raw && raw !== jp && raw !== en) {
      subTitles.push(raw);
    }

  } else {
    mainTitle = raw || en || "";

    if (raw && en && en !== raw) {
      subTitles.push(en);
    }
  }

  return {
    mainTitle,
    subTitles
  };
}

function renderClips(clips) {
  app.className = "youtube-mode";

  if (!clips.length) {
    app.innerHTML = `<p class="empty">No clips found.</p>`;
    return;
  }
  app.innerHTML =
    clips
      .map(renderClipCard_)
      .join("");
}

function renderClipCard_(c) {
  const { mainTitle, subTitles } =
    buildMediaTitles_(
      c.rawTitle || c.title || "",
      c.titleJp || "",
      c.titleEn || ""
    );

  return `
    <a
      class="card-link youtube-card-link"
      href="${c.url}"
      target="_blank"
      rel="noopener"
    >
      <div class="youtube-card ${getNationalityRegionClass(c.nationality)}">

        ${
          c.thumbnail
            ? `<img
                 class="youtube-thumb"
                 src="${c.thumbnail}"
                 loading="lazy"
                 alt=""
               >`
            : ""
        }

        <div class="youtube-info">

          <div class="youtube-title">
            ${escapeHtml(mainTitle)}
          </div>

          ${subTitles.map(t => `
            <div class="youtube-subtitle">
              ${escapeHtml(t)}
            </div>
          `).join("")}

          <div class="youtube-player">
            <span
              class="favorite-star ${isFavorite_(c.name) ? "active" : ""}"
              data-favorite-name="${escapeHtml(c.name || "")}"
            >
              ${isFavorite_(c.name) ? "★" : "☆"}
            </span>
            ${escapeHtml(c.name || "-")}
          </div>

          <div class="youtube-meta">
            ${escapeHtml(c.team || "-")}
            │
            ${escapeHtml(c.role || "-")}
            │
            ${escapeHtml(c.nationality || "-")}
          </div>

          <div class="youtube-date">
            ▶️ ${Number(c.views || 0).toLocaleString()} views
            🕓 ${timeAgo(c.date)}
          </div>

        </div>
      </div>
    </a>
  `;
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

function linkTag(url, label, cls) {
  if (!url) return "";

  return `
    <a
      class="team-link-tag ${cls}"
      href="${url}"
      target="_blank"
      rel="noopener"
    >
      ${label}
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
  team = String(team || "");

  switch (String(region || "").toUpperCase()) {

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
