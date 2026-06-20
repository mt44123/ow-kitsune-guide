const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

const updated = document.getElementById("updated");
const pageTitle = document.getElementById("pageTitle");
const voiceLine = document.getElementById("voiceLine");
const searchBox = document.getElementById("searchBox");
const toolsButton =  document.getElementById("toolsButton");

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

let twitchClipsCache = null;
let twitchClipsCacheTime = 0;
let twitchHotClipsCache = null;
let twitchHotClipsCacheTime = 0;

let soopClipsCache = null;
let soopClipsCacheTime = 0;

let chzzkNewClipsCache = null;
let chzzkNewClipsCacheTime = 0;
let chzzkHotClipsCache = null;
let chzzkHotClipsCacheTime = 0;
let chzzkBestClipsCache = null;
let chzzkBestClipsCacheTime = 0;

const CLIPS_CLIENT_CACHE_MS = 6 * 60 * 60 * 1000;

let youtubeCache = null;
let youtubeCacheTime = 0;
const YOUTUBE_CLIENT_CACHE_MS =  30 * 60 * 1000;

function startFakeProgress() {
    progressSteps =
    progressSets[Math.floor(Math.random() * progressSets.length)];
  
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
  viewers: "HOT",
  kr: "KR",
  en: "EN",
  cn: "CN",
  jp: "JP",
  intl: "INTL",
  
  youtube: "NEW",
  youtubehot: "HOT",
  youtubejp: "JP",

  clips: "NEW",
  hotclips: "HOT",
  jpclips: "JP",
  soopclips: "SOOP NEW",
  soophotclips: "SOOP HOT",
  
  chzzknewclips: "CHZZK NEW",
  chzzkhotclips: "CHZZK HOT",
  chzzkbestclips: "CHZZK BEST",

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

const liveViews = ["new", "viewers", "kr", "en", "cn", "jp", "intl"];
const clipViews = [
  "clips",  "hotclips",  "jpclips",
  "soopclips",  "soophotclips", 
  "chzzknewclips", "chzzkhotclips", "chzzkbestclips"
];
const youtubeViews = [  "youtube",  "youtubehot",  "youtubejp"];

let currentLiveView =
  liveViews.includes(currentView)
    ? currentView
    : "new";

let currentClipView =
  clipViews.includes(currentView)
    ? currentView
    : "clips";

let currentYoutubeView =
  youtubeViews.includes(currentView)
    ? currentView
    : "youtube";

function isLiveView(view) {
  return liveViews.includes(view);
}

function isClipView(view) {
  return clipViews.includes(view);
}

function isYoutubeView(view) {
  return youtubeViews.includes(view);
}

function updateNavState(view) {
  const liveButton = document.querySelector('[data-section="live"]');
  const clipsButton = document.querySelector('[data-section="clips"]');

  const liveSubNav = document.getElementById("liveSubNav");
  const clipsSubNav = document.getElementById("clipsSubNav");
  const youtubeSubNav = document.getElementById("youtubeSubNav");

document
  .querySelectorAll(
    '.main-nav button:not(#searchToggle)'
  )
  .forEach(b => b.classList.remove("active"));

document
  .querySelectorAll(".sub-nav button")
  .forEach(b => b.classList.remove("active"));

  if (liveSubNav) liveSubNav.style.display = "none";
  if (clipsSubNav) clipsSubNav.style.display = "none";
  if (youtubeSubNav) youtubeSubNav.style.display = "none";

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

  document
    .querySelector('.main-nav button[data-section="youtube"]')
    ?.classList.add("active");

  if (youtubeSubNav)
    youtubeSubNav.style.display = "flex";

  document
    .querySelector(
      `#youtubeSubNav button[data-view="${view}"]`
    )
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
  isYoutubeView(view)
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

searchBox.addEventListener("input", () => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {

    if (isYoutubeView(currentView)) {
  renderYoutube(filterYoutube(currentData));

} else if (isClipView(currentView)) {
  renderClips(filterClips(currentData));

} else if (currentView === "playerlinks") {
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

  if (view === "playerlinks") {
    loadPlayerLinksView();
    return;
  }

  if (isClipView(view)) {
    loadClipsView(view);
    return;
  }

  loadLiveView("new");
}

function loadYoutubeView(view) {
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
  document.body.classList.add("clip-view");
  document.body.classList.remove("youtube-view");
  
  const now = Date.now();

  pageTitle.textContent = titles[view] || view.toUpperCase();
  setRandomVoiceLine();

 const viewNote =
  document.getElementById("viewNote");

if (
  view === "hotclips" ||
  view === "soophotclips" ||
  view === "chzzkhotclips"
) {
  viewNote.textContent =
    "HOT = Most viewed clips from the last 30 days　過去30日以内の人気クリップ";

} else if (view === "chzzkbestclips") {
  viewNote.textContent =
    "BEST = Popular clips 人気クリップ";

} else {
  viewNote.textContent = "";
}

const isSoop =
  view === "soopclips" ||
  view === "soophotclips";

const isChzzk =
  view === "chzzknewclips" ||
  view === "chzzkhotclips" ||
  view === "chzzkbestclips";

let cache;
let cacheTime;

if (isSoop) {
  cache = soopClipsCache;
  cacheTime = soopClipsCacheTime;
  
} else if (isChzzk) {

  if (view === "chzzknewclips") {
    cache = chzzkNewClipsCache;
    cacheTime = chzzkNewClipsCacheTime;

  } else if (view === "chzzkhotclips") {
    cache = chzzkHotClipsCache;
    cacheTime = chzzkHotClipsCacheTime;

  } else {
    cache = chzzkBestClipsCache;
    cacheTime = chzzkBestClipsCacheTime;
  }
  
} else if (view === "hotclips") {
  cache = twitchHotClipsCache;
  cacheTime = twitchHotClipsCacheTime;
} else {
  cache = twitchClipsCache;
  cacheTime = twitchClipsCacheTime;
}

  if (cache && now - cacheTime < CLIPS_CLIENT_CACHE_MS) {
    requestId++;
    stopFakeProgress();

    currentData = filterClipView(cache, view);
    renderClips(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

let apiView = view === "hotclips" ? "hotclips" : "clips";

if (isSoop) {
  apiView = "soopclips";
  
} else if (
  view === "chzzknewclips" ||
  view === "chzzkhotclips"
) {
  apiView = "chzzknewclips";
} else if (view === "chzzkbestclips") {
  apiView = "chzzkbestclips";
}

  fetch(CONFIG.API_URL + "?view=" + apiView)
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) {
        stopFakeProgress();
        return;
      }

      finishFakeProgress();

let clips = [];

if (isSoop) {
  clips = data.soopclips || [];

} else if (
  view === "chzzknewclips" ||
  view === "chzzkhotclips"
) {
  clips = data.chzzknewclips || [];

} else if (view === "chzzkbestclips") {
  clips = data.chzzkbestclips || [];

} else {
  clips = data.clips || [];
}
      
if (isSoop) {
  soopClipsCache = clips;
  soopClipsCacheTime = Date.now();

} else if (view === "chzzknewclips") {
  chzzkNewClipsCache = clips;
  chzzkNewClipsCacheTime = Date.now();

} else if (view === "chzzkhotclips") {
  chzzkHotClipsCache = clips;
  chzzkHotClipsCacheTime = Date.now();

} else if (view === "chzzkbestclips") {
  chzzkBestClipsCache = clips;
  chzzkBestClipsCacheTime = Date.now();

} else if (view === "hotclips") {
  twitchHotClipsCache = clips;
  twitchHotClipsCacheTime = Date.now();
} else {
  twitchClipsCache = clips;
  twitchClipsCacheTime = Date.now();
}

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
function loadPlayerLinksView() {
  const now = Date.now();

  pageTitle.textContent = titles.playerlinks;
  setRandomVoiceLine();

if (
  playerLinksCache &&
  now - playerLinksCacheTime < PLAYER_LINKS_CLIENT_CACHE_MS
) {
requestId++;
stopFakeProgress();
currentData = playerLinksCache;
renderPlayerLinks(currentData);
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

      updated.textContent = data.lastUpdated || "";

      playerLinksCache = data.playerLinks || [];
      playerLinksCacheTime = Date.now();

      currentData = playerLinksCache;
      renderPlayerLinks(currentData);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function loadLiveView(view) {
  const now = Date.now();

if (liveCache && now - liveCacheTime < LIVE_CLIENT_CACHE_MS) {
requestId++;
stopFakeProgress();
pageTitle.textContent = titles[view] || view.toUpperCase();
setRandomVoiceLine();
renderLiveFromCache(view);
return;
}

  const currentRequest = ++requestId;

  startFakeProgress();

  pageTitle.textContent = titles[view] || view.toUpperCase();
  setRandomVoiceLine();

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

      updated.textContent = data.lastUpdated || "";

      if (data.counts) {
        updateAllButtonCounts(data.counts);
      }

      renderLiveFromCache(view);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();

      app.innerHTML = `<p class="error">Failed to load data.</p>`;
      console.error(error);
    });
}

function renderLiveFromCache(view) {
  const players = liveCache?.players || [];

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
  let result = [...videos];

  if (view === "youtubehot") {
    return result.sort(
      (a, b) => Number(b.views || 0) - Number(a.views || 0)
    );
  }

  if (view === "youtubejp") {
  return result.filter(
    v =>
      getNationalityRegionClass(v.nationality) ===
      "region-jp"
  );
}

  return result.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

function filterClips(clips) {
  const keyword = searchBox.value.toLowerCase().trim();
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
  let result = [...clips];

  if (view === "jpclips") {
    return result.filter(
      c =>
        getNationalityRegionClass(c.nationality) ===
        "region-jp"
    );
  }

if (view === "chzzkhotclips") {
  result = result.filter(c => {
    const date = new Date(c.date);
    if (isNaN(date.getTime())) return false;

    const days =
      (Date.now() - date.getTime()) /
      (1000 * 60 * 60 * 24);

    return days <= 30;
  });

  return result.sort(
    (a, b) => Number(b.views || 0) - Number(a.views || 0)
  );
}

if (view === "chzzkbestclips") {
  return result.sort(
    (a, b) => Number(b.views || 0) - Number(a.views || 0)
  );
}
  
  if (view === "soophotclips") {
    result = result.filter(c => {
      const date = new Date(c.date);
      if (isNaN(date.getTime())) return false;
  
      const days =
        (Date.now() - date.getTime()) /
        (1000 * 60 * 60 * 24);
  
      return days <= 30;
    });
  
    return result.sort(
      (a, b) => Number(b.views || 0) - Number(a.views || 0)
    );
  }
  
  return result.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
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

function searchPlayerLinksTable() {
  const keyword = searchBox.value.toLowerCase().trim();
  const rows = document.querySelectorAll(".player-table tbody tr");

  rows.forEach(row => {
    const text = [
      row.dataset.teamRegion,
      row.dataset.team,
      row.dataset.name,
      row.dataset.nationality,
      row.dataset.role
    ].join(" ");

    row.style.display =
      !keyword || text.includes(keyword)
        ? ""
        : "none";
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
        <div class="player-name">${p.name}</div>
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

  app.innerHTML = videos.map(v => {
    const raw = v.rawTitle || "";
    const jp = v.titleJp || "";
    const en = v.titleEn || "";

    let mainTitle = "";
    const subTitles = [];

    if (jp) {
      mainTitle = jp;

      if (en) subTitles.push(en);
      if (raw && raw !== jp && raw !== en) subTitles.push(raw);
    } else {
      mainTitle = raw || en || "";
      if (raw && en && en !== raw) subTitles.push(en);
    }

    return `
      <a class="card-link youtube-card-link" href="${v.url}" target="_blank" rel="noopener">
        <div class="youtube-card ${getNationalityRegionClass(v.nationality)}">
          ${v.thumbnail ? `<img class="youtube-thumb" src="${v.thumbnail}" loading="lazy" alt="">` : ""}

          <div class="youtube-info">
            <div class="youtube-title">${escapeHtml(mainTitle)}</div>

            ${subTitles.map(t => `
              <div class="youtube-subtitle">${escapeHtml(t)}</div>
            `).join("")}

            <div class="youtube-player">${escapeHtml(v.name || "-")}</div>
            <div class="youtube-meta">${escapeHtml(v.team || "-")} │ ${escapeHtml(v.role || "-")} │ ${escapeHtml(v.nationality || "-")}</div>
            <div class="youtube-date">
            ▶️ ${formatViews(v.views)} ・ 🕓 ${timeAgo(v.date)}
          </div>
          </div>
        </div>
      </a>
    `;
  }).join("");
}

function renderClips(clips) {
  app.className = "youtube-mode";

  if (!clips.length) {
    app.innerHTML = `<p class="empty">No clips found.</p>`;
    return;
  }

  app.innerHTML = clips.map(c => {
    const raw = c.rawTitle || c.title || "";
    const jp = c.titleJp || "";
    const en = c.titleEn || "";

    let mainTitle = "";
    const subTitles = [];

    if (jp) {
      mainTitle = jp;

      if (en) subTitles.push(en);
      if (raw && raw !== jp && raw !== en) subTitles.push(raw);
    } else {
      mainTitle = raw || en || "";
      if (raw && en && en !== raw) subTitles.push(en);
    }

    return `
      <a class="card-link youtube-card-link" href="${c.url}" target="_blank" rel="noopener">
        <div class="youtube-card ${getNationalityRegionClass(c.nationality)}">
          ${c.thumbnail ? `<img class="youtube-thumb" src="${c.thumbnail}" loading="lazy" alt="">` : ""}

          <div class="youtube-info">
            <div class="youtube-title">${escapeHtml(mainTitle)}</div>

            ${subTitles.map(t => `
              <div class="youtube-subtitle">${escapeHtml(t)}</div>
            `).join("")}

            <div class="youtube-player">${escapeHtml(c.name || "-")}</div>
            <div class="youtube-meta">${escapeHtml(c.team || "-")} │ ${escapeHtml(c.role || "-")} │ ${escapeHtml(c.nationality || "-")}</div>
            <div class="youtube-date">▶️ ${Number(c.views || 0).toLocaleString()} views 🕓 ${timeAgo(c.date)}</div>
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
    *Click player or team names to open Liquipedia.<br>
    プレイヤー名・チーム名をクリックするとLiquipediaを開きます。

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
    </details>
  </div>

  <div class="scroll-note">
    📱Mobile: Swipe left / right 📱スマホ: 左右にスワイプ
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
          <th class="sortable" data-sort="laststream">Last Stream</th>
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
              <a
                class="player-name-link"
                href="https://liquipedia.net/overwatch/${encodeURIComponent(p.name || "")}"
                target="_blank"
                rel="noopener"
              >
                ${p.name || ""}
              </a>
            </td>

            <td>${p.nationality || ""}</td>
            <td>${p.role || ""}</td>
            <td>  ${    p.lastStreamUrl      ? `<a class="last-stream-link" href="${p.lastStreamUrl}" target="_blank" rel="noopener">${p.lastStreamAge || "-"} ${p.lastStreamPlatform || ""}</a>`      : "-"  }</td>
            <td>${linkDot(p.twitchUrl, p.twitchActive ? "tw" : "tw-inactive")}</td>
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

if (key === "laststream") {
  const parseDays = v => {
    if (!v) return 999999;
    if (v === "TODAY") return 0;

    const m = String(v).match(/^(\d+)d$/);
    return m ? Number(m[1]) : 999999;
  };

  const result = parseDays(aValue) - parseDays(bValue);
  return nextDir === "asc" ? result : -result;
}

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

function getTeamRegionClass(region, team) {
  team = String(team || "");

  switch (String(region || "").toUpperCase()) {
    case "KR":
      return "team-kr";

    case "JP":
      return "team-jp";

    case "NA":
      return "team-na";

    case "EMEA":
      return "team-emea";

    case "CN":
      return "team-cn";

    case "PAC":
      return "team-pac";

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

function updateAllButtonCounts(counts) {
  Object.entries(titles).forEach(([key, label]) => {
    const button = document.querySelector(`#liveSubNav button[data-view="${key}"]`);
    if (!button) return;

    const count = counts[key] ?? "";
    button.textContent = `${label} (${count})`;
  });

  document.querySelectorAll(".main-nav .media-nav").forEach(button => {
    const view = button.dataset.view;
    if (!view) return;

    const labelEl = button.querySelector(".media-label");
    if (!labelEl) return;

    labelEl.textContent = titles[view] || labelEl.textContent;
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

function loadToolsView() {
  currentView = "toolstips";
  history.replaceState({}, "", "?view=toolstips");

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove("youtube-view", "clip-view");

  pageTitle.textContent = "TOOLS";
  setRandomVoiceLine();

  updated.textContent = "";
  document.getElementById("viewNote").textContent = "";

  app.className = "tools-mode";

  app.innerHTML = `
<div class="tools-page">

  <div class="card">
  <h3>📚 Translation Tools</h3>

  <p>
    Some YouTube and SOOP streams may include built-in captions and translation features.
    If captions or translations are unavailable, try using the tools below.
  </p>

  <p>
    YouTubeやSOOPでは、配信や動画によって公式の自動字幕・翻訳機能が利用できる場合があります
    字幕や翻訳機能が利用できない場合は、下記のツールをお試しください
  </p>

<div class="tool-item">
  <div>
    <a href="https://support.google.com/chrome/answer/10538231?hl=en-GB&sjid=4036900480667797437-NC">
    💻Manage captions and translations in Chrome(EN)</a>
  </div>

  <div>
    <a href="https://support.google.com/chrome/answer/10538231?hl=ja">
    Chromeで字幕と翻訳を管理する(JP)</a>
  </div>

  <p>Generate captions in Chrome and translate videos and live streams in real time.</p>
  <p>Chromeブラウザで、動画やライブ配信の字幕を生成して、リアルタイムで翻訳できます</p>
</div>

<div class="tool-item">
  <div>
    <a href="https://support.google.com/accessibility/android/answer/9350862?hl=en&sjid=4036900480667797437-NC">
    📱Manage captions and translations on Android(EN)</a>
  </div>

  <div>
    <a href="https://support.google.com/accessibility/android/answer/9350862?hl=ja_ALL">
    Androidで字幕と翻訳を管理する(JP)</a>
  </div>

  <p>Generate captions on Android and translate videos and live streams in real time.</p>
  <p>※I use an iPhone, so Android instructions are based on official documentation.</p>
  <p>Androidで、動画やライブ配信の字幕を生成して、リアルタイムで翻訳できます</p>
  <p>※筆者はiPhoneユーザーのため、Android関連の内容は公式ドキュメントを参考にしています</p>
  
</div>

<div class="tool-item">
  <div>
    <a href="https://chatgpt.com/">
      💻📱ChatGPT
    </a>
  </div>

  <p>
    My personal recommendation. ChatGPT usually provides the most natural translations, especially for gaming terms, esports slang, and stream conversations.
  </p>
  <p>
    個人的に一番おすすめです。ゲーム用語やeスポーツ用語、配信中の会話なども自然に翻訳してくれます。
  </p>
  <p>
    For YouTube videos, open the transcript ("Show transcript"), copy the text, and paste it into ChatGPT. It can translate long interviews, stream clips, and match discussions with better context than most translation tools.
  </p>
  <p>
    YouTube動画の場合は、「文字起こし（文字起こしを表示）」を開いて内容をコピーし、ChatGPTに貼り付けるだけです。長いインタビューや配信内容、試合の振り返りなども文脈を考慮して翻訳してくれます。
  </p>
</div>



</div>
`;
}

loadView(currentView);
