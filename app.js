const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

const updated = document.getElementById("updated");
const pageTitle = document.getElementById("pageTitle");
const voiceLine = document.getElementById("voiceLine");
const voiceActor =
  document.getElementById("voiceActor");

voiceLine?.addEventListener("click", () => {
  const text =
  voiceLine.dataset.voice ||
  voiceLine.textContent.trim();

  if (!text) return;

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

const voices = speechSynthesis.getVoices();

const voice =
  voices[
    Math.floor(Math.random() * voices.length)
  ];

utterance.voice = voice;

if (voiceActor) {
  voiceActor.textContent =
    `${voice.name} (${voice.lang})`;
}

utterance.rate = 0.95;
utterance.pitch =  0.8 + Math.random() * 0.6;
utterance.volume = 0.3;

  speechSynthesis.speak(utterance);
});

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

let birthdaysCache = null;
let birthdaysCacheTime = 0;
const BIRTHDAYS_CLIENT_CACHE_MS = 6 * 60 * 60 * 1000;

let playerLinksLastUpdated = "";

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

  playerlinks: "LINKS",
  birthdays: "BIRTHDAYS"
};

const voiceLines = [
{ hero:"Shion", text:"Kore ga atashi no narenohate da!", lang:"ja-JP" },

{ hero:"Sierra", text:"Eyes on the skies!", lang:"en-US" },
{ hero:"Sierra", text:"Deploying R.O.T.H. unit!", lang:"en-US" },

{ hero:"JetpackCat", text:"Meoweoweew!!!", lang:"en-US" },
{ hero:"JetpackCat", text:"Meeeeeooooowww!!!", lang:"en-US" },

{ hero:"Mizuki", text:"Protect us, kekkai!", lang:"en-US" },
{ hero:"Mizuki", text:"Noroi o tachikire!", lang:"ja-JP" },

{ hero:"Emre", text:"Etsi ja tuhoa.", lang:"fi-FI" },
{ hero:"Emre", text:"Search and destroy.", lang:"en-US" },

{ hero:"Domina", text:"Mere mutabia chalo!", lang:"hi-IN" },
{ hero:"Domina", text:"Serve my design!", lang:"en-US" },

{ hero:"Anran", text:"Huoyu fen tian!", lang:"zh-CN" },
{ hero:"Anran", text:"Scorch the sky!", lang:"en-US" },
{ hero:"Anran", text:"Zhuque zhan chi!", lang:"zh-CN" },
{ hero:"Anran", text:"Rising from the ashes!", lang:"en-US" },

{ hero:"Vendetta", text:"Arriva la punizione!", lang:"it-IT" },
{ hero:"Vendetta", text:"Retribution comes! Ha!", lang:"en-US" },

{ hero:"Wuyang", text:"Reverse the tide!", lang:"en-US" },
{ hero:"Wuyang", text:"Li wan kuang lan!", lang:"zh-CN" },
{ hero:"Wuyang", text:"The tide is with you! Dive in!", lang:"en-US" },

{ hero:"Freja", text:"Nu vanker der!", lang:"da-DK" },
{ hero:"Freja", text:"Hunting them down!", lang:"en-US" },

{ hero:"Hazard", text:"Tear it down!", lang:"en-US" },
{ hero:"Hazard", text:"Bringing the rain!", lang:"en-US" },

{ hero:"Juno", text:"Welcome to orbit!", lang:"en-US" },
{ hero:"Juno", text:"Locking satellite vector!", lang:"en-US" },

{ hero:"Venture", text:"Excavation initiation!", lang:"en-CA" },
{ hero:"Venture", text:"Plotting out the dig site!", lang:"en-CA" },

{ hero:"Mauga", text:"Se se'i koikiiki!", lang:"sm-WS" },
{ hero:"Mauga", text:"We got them where we want them!", lang:"en-US" },

{ hero:"Illari", text:"Face the sunrise!", lang:"en-US" },
{ hero:"Illari", text:"Inti lluqsimun!", lang:"qu-PE" },

{ hero:"Lifeweaver", text:"Life protects life!", lang:"en-US" },
{ hero:"Lifeweaver", text:"Chii-wit bpok-bpaawng chii-wit!", lang:"th-TH" },

{ hero:"Ramattra", text:"Suffer as I have!", lang:"en-US" },
{ hero:"Ramattra", text:"Rip them to pieces!", lang:"en-US" },

{ hero:"Kiriko", text:"Let the kitsune guide you!", lang:"en-US" },
{ hero:"Kiriko", text:"Kitsune no kagizume o tokihanate!", lang:"ja-JP" },

{ hero:"JunkerQueen", text:"Time for the reckoning!", lang:"en-AU" },
{ hero:"JunkerQueen", text:"Let's take him to the wasteland!", lang:"en-AU" },

{ hero:"Sojourn", text:"This ends now!", lang:"en-CA" },
{ hero:"Sojourn", text:"It's go time!", lang:"en-CA" },

{ hero:"Echo", text:"Adaptive circuits engaged!", lang:"en-US" },
{ hero:"Echo", text:"Duplication initiated!", lang:"en-US" },

{ hero:"Sigma", text:"Het universum zingt voor mij!", lang:"nl-NL" },
{ hero:"Sigma", text:"What is that melody?", lang:"en-US" },

{ hero:"Baptiste", text:"Light them up!", lang:"en-US" },
{ hero:"Baptiste", text:"Vide bal sou yo!", lang:"ht-HT" },

{ hero:"Ashe", text:"Bob, do something!", lang:"en-US" },
{ hero:"Ashe", text:"Get in there, Bob!", lang:"en-US" },

{ hero:"Wrecking Ball", text:"Area denied!", lang:"en-US" },
{ hero:"Wrecking Ball", text:"Minefield deployed!", lang:"en-US" },

{ hero:"Brigitte", text:"Rally to me!", lang:"en-US" },
{ hero:"Brigitte", text:"Alla till mig!", lang:"sv-SE" },

{ hero:"Moira", text:"Surrender to my will!", lang:"en-US" },
{ hero:"Moira", text:"Geill do mo thoil!", lang:"ga-IE" },

{ hero:"Doomfist", text:"Meteor strike!", lang:"en-US" },
{ hero:"Doomfist", text:"Incoming!", lang:"en-US" },

{ hero:"Orisa", text:"Pade ayanmo re! Ha!", lang:"yo-NG" },
{ hero:"Orisa", text:"Meet your fate!", lang:"en-US" },

{ hero:"Sombra", text:"¡Apagando las luces!", lang:"es-ES" },
{ hero:"Sombra", text:"EMP activated!", lang:"en-US" },

{ hero:"Ana", text:"You're powered up. Get in there!", lang:"en-US" },
{ hero:"Ana", text:"Nano boost administered!", lang:"en-US" },
{ hero:"Ana", text:"Warihum quwitak!", lang:"ar-SA" },

{ hero:"Genji", text:"Ryujin no ken o kurae!", lang:"ja-JP" },
{ hero:"Genji", text:"The dragon becomes me!", lang:"en-US" },

{ hero:"Mei", text:"Dong zhu! Bu xu zou!", lang:"zh-CN" },
{ hero:"Mei", text:"Freeze! Don't move!", lang:"en-US" },

{ hero:"D.Va", text:"Nerf this!", lang:"en-US" },
{ hero:"D.Va", text:"Activating self-destruct sequence!", lang:"en-US" },

{ hero:"Junkrat", text:"Fire in the hole!", lang:"en-AU" },
{ hero:"Junker Queen", text:"Ladies and gentlemen, start your engines!", lang:"en-AU" },

{ hero:"Roadhog", text:"Unloading scrap!", lang:"en-AU" },

{ hero:"Lucio", text:"Oh, let's break it. Damn!", lang:"en-US" },
{ hero:"Lucio", text:"Vamos esculachar!", lang:"pt-BR" },

{ hero:"Soldier: 76", text:"I've got you in my sights!", lang:"en-US" },
{ hero:"Soldier: 76", text:"Tactical visor activated!", lang:"en-US" },

{ hero:"Cassidy", text:"It's high noon.", lang:"en-US" },
{ hero:"Cassidy", text:"Step right up!", lang:"en-US" },

{ hero:"Zarya", text:"Ogon' po gotovnosti!", lang:"ru-RU" },
{ hero:"Zarya", text:"Fire at will!", lang:"en-US" },

{ hero:"Symmetra", text:"Yahi param vaastavikta hai!", lang:"hi-IN" },
{ hero:"Symmetra", text:"Reality bends to my will!", lang:"en-US" },

{ hero:"Zenyatta", text:"Experience tranquility!", lang:"en-US" },
{ hero:"Zenyatta", text:"Pass into the Iris!", lang:"en-US" },

{ hero:"Hanzo", text:"Ryu ga waga teki o kurau!", lang:"ja-JP" },
{ hero:"Hanzo", text:"Let the dragon consume you!", lang:"en-US" },

{ hero:"Torbjorn", text:"Molten core!", lang:"en-US" },
{ hero:"Torbjorn", text:"Molten floor!", lang:"en-US" },
{ hero:"Torbjorn", text:"Setting out the welcome mat!", lang:"en-US" },

{ hero:"Mercy", text:"Helden sterben nicht!", lang:"de-DE" },
{ hero:"Mercy", text:"Heroes never die!", lang:"en-US" },

{ hero:"Reinhardt", text:"Hammer down!", lang:"en-US" },
{ hero:"Reinhardt", text:"For the crusaders!", lang:"en-US" },

{ hero:"Pharah", text:"Justice rains from above!", lang:"en-US" },
{ hero:"Pharah", text:"Rocket barrage incoming!", lang:"en-US" },

{ hero:"Widowmaker", text:"No one can hide from my sight.", lang:"en-US" },
{ hero:"Widowmaker", text:"Personne n'echappe a mon regard.", lang:"fr-FR" },

{ hero:"Reaper", text:"Die... die... die...", lang:"en-US" },
{ hero:"Reaper", text:"Clearing the area.", lang:"en-US" },

{ hero:"Tracer", text:"Bomb's ticking!", lang:"en-GB" },
{ hero:"Tracer", text:"Catch!", lang:"en-GB" },
{ hero:"Tracer", text:"Here goes nothing!", lang:"en-GB" },
{ hero:"Tracer", text:"Present for ya!", lang:"en-GB" },
{ hero:"Tracer", text:"Special delivery!", lang:"en-GB" },
{ hero:"Tracer", text:"Thought of you!", lang:"en-GB" },
{ hero:"Tracer", text:"Time to drop the bomb!", lang:"en-GB" },
{ hero:"Tracer", text:"Winging it!", lang:"en-GB" },
{ hero:"Tracer", text:"A perfect stick!", lang:"en-GB" },
{ hero:"Tracer", text:"Direct hit!", lang:"en-GB" },
{ hero:"Tracer", text:"Enjoy the detonation!", lang:"en-GB" },
{ hero:"Tracer", text:"Looks good on you!", lang:"en-GB" },
{ hero:"Tracer", text:"Right on the money!", lang:"en-GB" },
{ hero:"Tracer", text:"Spot on!", lang:"en-GB" },
{ hero:"Tracer", text:"Target locked!", lang:"en-GB" },
{ hero:"Tracer", text:"That's a stick!", lang:"en-GB" }, 
];

function setRandomVoiceLine() {
  if (!voiceLine) return;

  const line =
    voiceLines[Math.floor(Math.random() * voiceLines.length)];

  voiceLine.dataset.voice = line.text;
  voiceLine.dataset.lang = line.lang;
  voiceLine.dataset.hero = line.hero || "";

  voiceLine.textContent =
  "🎙️ " + line.text;
}

const liveViews = ["new", "viewers", "kr", "en", "cn", "jp", "intl"];
const clipViews = [
  "clips",  "hotclips",  "jpclips",
  "soopclips",  "soophotclips", 
  "chzzknewclips", "chzzkhotclips", "chzzkbestclips"
];
const youtubeViews = [  "youtube",  "youtubehot",  "youtubejp"];

const playerViews = [
  "playerlinks",
  "birthdays"
];

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

let currentPlayerView =
  playerViews.includes(currentView)
    ? currentView
    : "playerlinks";

function isPlayerView(view) {
  return playerViews.includes(view);
}

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
    document
      .querySelector('.main-nav button[data-section="youtube"]')
      ?.classList.add("active");

    if (youtubeSubNav) youtubeSubNav.style.display = "flex";

    document
      .querySelector(`#youtubeSubNav button[data-view="${view}"]`)
      ?.classList.add("active");

  } else if (isPlayerView(view)) {
    document
      .querySelector('.main-nav button[data-section="players"]')
      ?.classList.add("active");

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

  if (view === "birthdays") {
  loadBirthdaysView();
  return;
}

  if (isClipView(view)) {
    loadClipsView(view);
    return;
  }

  loadLiveView("new");
}

let birthdayCalendarDate = new Date();

function loadBirthdaysView() {
  const now = Date.now();

  updated.textContent = "";
  
  document.getElementById("viewNote").innerHTML = `
  🌐 Dates are shown based on your device's local date.<br>
  🌐 日付はお使いの端末のローカル日付を基準に表示されます。
  `;

  pageTitle.textContent = "BIRTHDAYS";
  setRandomVoiceLine();

  app.className = "birthday-calendar-mode";

  if (
    birthdaysCache &&
    now - birthdaysCacheTime < BIRTHDAYS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    currentData = birthdaysCache;
    renderBirthdayCalendar(currentData);
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=birthdays")
    .then(r => r.json())
    .then(data => {
      if (currentRequest !== requestId) return;

      finishFakeProgress();

      birthdaysCache = data.birthdays || [];
      birthdaysCacheTime = Date.now();

      currentData = birthdaysCache;
      renderBirthdayCalendar(currentData);
    })
    .catch(err => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      console.error(err);

      app.innerHTML = `
        <p class="error">
          Failed to load birthdays.
        </p>
      `;
    });
}

function renderBirthdayCalendar(players) {
  const year = birthdayCalendarDate.getFullYear();
  const month = birthdayCalendarDate.getMonth();

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

const todayBirthdays = players.filter(p => {
  if (!p.born) return false;

  const [, m, d] = p.born.split("-").map(Number);

  return (
    m === today.getMonth() + 1 &&
    d === today.getDate()
  );
});
  
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
 
  const birthdaysByDay = {};

  players.forEach(p => {
    if (!p.born) return;

    const [, bornMonth, bornDay] = p.born.split("-").map(Number);
    if (bornMonth !== month + 1) return;

    if (!birthdaysByDay[bornDay]) birthdaysByDay[bornDay] = [];
    birthdaysByDay[bornDay].push(p);
  });

  let cells = "";

  for (let i = 0; i < 42; i++) {
    const dayNum = i - startDay + 1;

    let displayDay = dayNum;
    let isOtherMonth = false;

    if (dayNum <= 0) {
      displayDay = prevLastDate + dayNum;
      isOtherMonth = true;
    } else if (dayNum > lastDate) {
      displayDay = dayNum - lastDate;
      isOtherMonth = true;
    }

    const isToday =
      !isOtherMonth &&
      year === todayY &&
      month === todayM &&
      displayDay === todayD;

    const events =
      !isOtherMonth && birthdaysByDay[displayDay]
        ? birthdaysByDay[displayDay]
        : [];

    cells += `
      <div class="birthday-day ${isOtherMonth ? "other-month" : ""} ${isToday ? "today" : ""}">
        <div class="birthday-day-number">
        ${displayDay}
        </div>

        ${events.map(p => `
          <div class="birthday-event ${getNationalityRegionClass(p.nationality)}">
            <strong>
              🎂 <a
                class="birthday-player-link"
                href="https://liquipedia.net/overwatch/${encodeURIComponent(p.name || "")}"
                target="_blank"
                rel="noopener"
              >${escapeHtml(p.name)}</a>
            </strong>
            <span>${escapeHtml(p.team || "-")} / ${escapeHtml(p.role || "-")}</span>
            <span>${p.born ? `Turns ${getAgeOnBirthdayThisYear(p.born, year)}` : ""}</span>
            <a
              class="birthday-calendar-link"
              href="${googleBirthdayUrl(p, year)}"
              target="_blank"
              rel="noopener"
            >📅 Add</a>
          </div>
        `).join("")}
      </div>
    `;
  }

  const listItems = players
    .filter(p => p.born)
    .map(p => {
      const [, m, d] = p.born.split("-").map(Number);
      return { ...p, month: m, day: d };
    })
    .filter(p => p.month === month + 1)
    .sort((a, b) => a.day - b.day)
    .map(p => `
      <div class="birthday-list-item ${getNationalityRegionClass(p.nationality)}">
        <div class="birthday-list-date">${month + 1}/${p.day}</div>
        <div>
          <strong>
            🎂 <a
              class="birthday-player-link"
              href="https://liquipedia.net/overwatch/${encodeURIComponent(p.name || "")}"
              target="_blank"
              rel="noopener"
            >${escapeHtml(p.name)}</a>
          </strong>
          <div>${escapeHtml(p.team || "-")} / ${escapeHtml(p.role || "-")} / ${escapeHtml(p.nationality || "-")}</div>
          <div>${p.born ? `Turns ${getAgeOnBirthdayThisYear(p.born, year)}` : ""}</div>
        </div>
        <a href="${googleBirthdayUrl(p, year)}" target="_blank" rel="noopener">📅 Add</a>
      </div>
    `)
    .join("");

  const todaySection = `
  <div class="birthday-today">

   <h3>
  🎂 Today's Birthdays
  (${today.getMonth() + 1}/${today.getDate()})
</h3>

    ${
      todayBirthdays.length
        ? todayBirthdays.map(p => `
  <div class="birthday-event ${getNationalityRegionClass(p.nationality)}">

    <strong>
      <a
        class="birthday-player-link"
        href="https://liquipedia.net/overwatch/${encodeURIComponent(p.name || "")}"
        target="_blank"
        rel="noopener"
      >
        🎂 ${escapeHtml(p.name)}
      </a>
    </strong>

    <span>
      ${escapeHtml(p.team || "-")} /
      ${escapeHtml(p.role || "-")}
    </span>

    <span>
      ${p.born ? `Turns ${getTurnsAgeToday(p.born)}` : ""}
    </span>

    <a
      class="birthday-calendar-link"
      href="${googleBirthdayUrl(p, year)}"
      target="_blank"
      rel="noopener"
    >
      📅 Add
    </a>

  </div>
`).join("")
        : `
            <div class="birthday-today-empty">
              🦊 No birthdays today.
            </div>
          `
    }

  </div>
`;

app.innerHTML = `
  ${todaySection}

  <div class="birthday-calendar">
      <div class="birthday-calendar-header">
        <button id="birthdayPrev">‹</button>

        <div>
          <div class="birthday-year">${year}</div>
          <div class="birthday-month">${month + 1}</div>
        </div>

        <button id="birthdayNext">›</button>
      </div>

      <div class="birthday-weekdays">
        <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
      </div>

      <div class="birthday-grid">
        ${cells}
      </div>

      <div class="birthday-list">
        ${listItems || `<p class="empty">No birthdays this month.</p>`}
      </div>
    </div>
  `;

  document.getElementById("birthdayPrev").onclick = () => {
    birthdayCalendarDate = new Date(year, month - 1, 1);
    renderBirthdayCalendar(players);
  };

  document.getElementById("birthdayNext").onclick = () => {
    birthdayCalendarDate = new Date(year, month + 1, 1);
    renderBirthdayCalendar(players);
  };
}

function googleBirthdayUrl(p, year) {
  const [, month, day] = p.born.split("-").map(Number);

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  const start = `${year}${mm}${dd}`;
  const endDate = new Date(year, month - 1, day + 1);
  const end =
    `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}`;

  const title = encodeURIComponent(`🎂 ${p.name} Birthday`);
  const details = encodeURIComponent(
    `${p.name} / ${p.team || "-"} / ${p.role || "-"} / ${p.nationality || "-"}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
}

function getCurrentAgeFromBorn(born) {
  if (!born) return "";

  const [birthYear, birthMonth, birthDay] =
    String(born).split("-").map(Number);

  if (!birthYear || !birthMonth || !birthDay) return "";

  const today = new Date();

  let age = today.getFullYear() - birthYear;

  const birthdayThisYear =
    new Date(today.getFullYear(), birthMonth - 1, birthDay);

  if (today < birthdayThisYear) {
    age--;
  }

  return age;
}

function getAgeOnBirthdayThisYear(born, year) {
  if (!born) return "";

  const birthYear = Number(String(born).split("-")[0]);

  if (!birthYear) return "";

  return year - birthYear;
}

function getTurnsAgeToday(born) {
  if (!born) return "";

  const birthYear = Number(
    String(born).split("-")[0]
  );

  if (!birthYear) return "";

  return new Date().getFullYear() - birthYear;
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

  updated.textContent = playerLinksLastUpdated;

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
    プレイヤー名・チーム名をクリックするとLiquipediaを開きます。皆Liquipediaを見よう。

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
      
      <p>
        Some player and team information is sourced from Liquipedia.<br>
        Special thanks to the Liquipedia contributors who help keep esports history alive.<br>
        
        一部のプレイヤー情報・チーム情報はLiquipediaを参考にしています。<br>
        eスポーツの歴史を支えているLiquipedia編集者の皆様に感謝します。
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
          <th class="sortable" data-sort="age">Age (Born)</th>
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
            data-age="${p.born ? getCurrentAgeFromBorn(p.born) : ""}"
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

           <td>${shortNationality(p.nationality || "")}</td>
            <td>${p.role || ""}</td>
            <td>
            ${p.born ? getCurrentAgeFromBorn(p.born) : ""}
            ${p.born ? ` (${p.born})` : ""}
            </td>
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

if (key === "age") {
  const aEmpty = aValue === "";
  const bEmpty = bValue === "";

  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;
  if (aEmpty && bEmpty) return 0;

  const result = Number(aValue) - Number(bValue);

  return nextDir === "asc" ? result : -result;
}
        
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
  const nat = String(nationality || "")
  .split(",")[0]
  .trim()
  .toLowerCase();

  if (["japan", "jp"].includes(nat)) return "region-jp";
  if (["south korea", "kr"].includes(nat)) return "region-kr";
  if (["china", "cn"].includes(nat)) return "region-cn";
  if (["united states", "usa", "us", "en"].includes(nat)) return "region-na";

  const na = [
    "canada", "costa rica", "cuba", "dominican republic", "el salvador",
    "guatemala", "honduras", "jamaica", "mexico", "nicaragua",
    "panama",
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

function shortNationality(nationality) {
  return String(nationality || "")
    .replaceAll("Dominican Republic", "Dominican")
    .replaceAll("United Arab Emirates", "U.Arab Emir");
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

  requestId++;

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
  If captions or translations are unavailable, try the tools below. For most users, the free versions are more than enough.
</p>

<p>
  字幕や翻訳機能が利用できない場合は、下記のツールをお試しください。一般的な用途であれば、無料版でも十分活用できます。
</p>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://support.google.com/chrome/answer/10538231?hl=en-GB&sjid=4036900480667797437-NC">
    💻 Manage captions and translations in Chrome (EN)</a>
  </div>

  <div>
    <a href="https://support.google.com/chrome/answer/10538231?hl=ja">
    Chromeで字幕と翻訳を管理する (JP)</a>
  </div>

  <p>Generate captions in Chrome and translate videos and live streams in real time.</p>
  <p>Chromeブラウザで、動画やライブ配信の字幕を生成して、リアルタイムで翻訳できます</p>
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://support.google.com/accessibility/android/answer/9350862?hl=en&sjid=4036900480667797437-NC">
    📱 Manage captions and translations on Android (EN)</a>
  </div>

  <div>
    <a href="https://support.google.com/accessibility/android/answer/9350862?hl=ja_ALL">
    Androidで字幕と翻訳を管理する (JP)</a>
  </div>

  <p>Generate captions on Android and translate videos and live streams in real time.</p>
  <p>※I use an iPhone, so Android instructions are based on official documentation.</p>
  <p>Androidで、動画やライブ配信の字幕を生成して、リアルタイムで翻訳できます</p>
  <p>※筆者はiPhoneユーザーのため、Android関連の内容は公式ドキュメントを参考にしています</p>
  
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://chatgpt.com/">
      💻📱 ChatGPT
    </a>
  </div>

<p>
  ・My personal recommendation. ChatGPT usually provides the most natural translations, especially for gaming terms, esports slang, and stream conversations.
</p>

<p>
  ・For YouTube videos, open the transcript ("Show transcript"), copy the text, and paste it into ChatGPT. It can translate long interviews, stream clips, and match discussions with better context than most translation tools.
</p>

<p>
  ・Chrome Live Caption subtitles cannot be directly selected or copied. If needed, you can use an OCR tool to extract text from the screen and then paste it into ChatGPT or another AI assistant. This allows you to use your preferred AI instead of relying only on Google Translate.
</p>

<p>
  Below are some OCR tools that I personally use.
</p>

<p>
  ・個人的に一番おすすめです。ゲーム用語やeスポーツ用語、配信中の会話なども自然に翻訳してくれます。
</p>

<p>
  ・YouTube動画の場合は、「文字起こし（文字起こしを表示）」を開いて内容をコピーし、ChatGPTに貼り付けるだけです。長いインタビューや配信内容、試合の振り返りなども文脈を考慮して翻訳してくれます。
</p>

<p>
  ・Chromeの自動字幕起こしは直接選択やコピーができません。その場合はOCRソフトで画面内の文字を読み取り、テキスト化してからChatGPTなどのAIに貼り付ける方法もおすすめです。Google翻訳だけでなく、自分の好きなAIで翻訳できるようになります。
</p>

<p>
  下記に私が実際に使用しているOCRソフトを紹介します
</p>
  
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://chromewebstore.google.com/detail/eenjdnjldapjajjofmldgmkjaienebbj?utm_source=item-share-cb">
      💻 Copyfish 🐟 Free OCR Software
    </a>
  </div>

<p>
  A Chrome extension that lets you extract text directly from images and videos using OCR.
</p>

<p>
  It was the first OCR tool I found through a web search, and I have been using it ever since. While there may be other alternatives, it has worked well for my needs.
</p>
<p>
  画像や動画内の文字をOCRで読み取り、テキスト化できるChrome拡張機能です。
</p>

<p>
  検索で最初に見つけたOCRソフトだったため、ずっと使用しています。他にも選択肢はあると思いますが、私の用途では特に問題なく利用できています。
</p>
   
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://chromewebstore.google.com/detail/debflmkfmkejgppfabgfcbemelmnpnho?utm_source=item-share-cb">
      💻 ViiTor Real-Time Translation
    </a>
  </div>

<p>
  Another Chrome extension that I recommend. Chrome's built-in Live Caption and translation features can sometimes use more system resources, while ViiTor is generally much lighter.
</p>
<p>
  The translations can be less accurate, but the generated subtitles can be selected and copied. This makes it easy to paste them into ChatGPT or another AI assistant for higher-quality translations.
</p>
<p>
  The free version has been more than sufficient for my personal use.
</p>
<p>
  こちらもおすすめのChrome拡張機能です。Chromeの自動字幕起こし・翻訳機能はブラウザが少し重くなる場合がありますが、ViiTorは比較的軽快に動作します。
</p>

<p>
  翻訳精度はやや粗めですが、生成された字幕を選択してコピーできるのが大きな特徴です。そのままChatGPTなどのAIに貼り付けることで、より自然な翻訳にすることができます。
</p>

<p>
  私の使用用途では、無料版でも特に問題なく利用できています。
</p>
</div>
</div>

<div class="card">
<div class="tool-item">

  <div>
    <strong>💻📱 Discord (Browser Version)</strong>
  </div>

  <p>
   If you use Discord in a web browser, you can translate messages using your browser's built-in translation feature.
   This can be useful when reading Discord servers run by overseas players.
  </p>

  <p>
    Discordをブラウザ版で利用すると、ブラウザの翻訳機能でメッセージを翻訳できます。海外プレイヤーのDiscordサーバーを読む際に便利です。
  </p>

</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://www.duolingo.com/learn">
      💻📱 Duolingo
    </a>
  </div>

  <p>Great for learning English, Korean, Chinese, Japanese, chess, and many other topics through short daily lessons.</p>
  <p>Helpful if you want to understand streams without relying entirely on translation tools.</p>
  <p>英語・韓国語・中国語・日本語・チェスなどを少しずつ学べる語学学習アプリです</p>
  <p>翻訳ツールだけに頼らず、海外配信をもっと理解したい方におすすめです</p>
   
</div>
</div>

</div>
`;
}

loadView(currentView);
