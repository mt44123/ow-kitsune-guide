const notifySelect = document.getElementById("notifySelect");
const notifyIcon = document.getElementById("notifyIcon");

let liveNotificationMode =
  localStorage.getItem("liveNotificationMode") || "off";

function notifyIcon_(type) {
  if (type === "all") {
    return `
      <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
        <path fill="currentColor" d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80Z"/>
      </svg>
    `;
  }

  if (type === "goats") {
    return `
      <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
        <path fill="currentColor" d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
      </svg>
    `;
  }

  return `
    <svg class="settings-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true">
      <path fill="currentColor" d="M160-200v-80h80v-280q0-33 8.5-65t25.5-61l126 126H288L56-792l56-56 736 736-56 56-146-144H160Zm560-154L328-746q20-16 43-28t49-18v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v206ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z"/>
    </svg>
  `;
}

function updateNotifySelect_() {
  if (!notifySelect) return;

  notifySelect.value = liveNotificationMode;

  if (notifyIcon) {
    notifyIcon.innerHTML = notifyIcon_(liveNotificationMode);
  }

  if (!("Notification" in window)) {
    notifySelect.value = "off";
    notifySelect.disabled = true;
  }

  if ("Notification" in window && Notification.permission === "denied") {
    notifySelect.value = "off";
    notifySelect.disabled = true;
  }
}

updateNotifySelect_();

notifySelect?.addEventListener(
  "change",
  async () => {
    const nextMode = notifySelect.value;

    if (nextMode === "off") {
      liveNotificationMode = "off";

      localStorage.setItem(
        "liveNotificationMode",
        liveNotificationMode
      );

      updateNotifySelect_();
      return;
    }

    if (!("Notification" in window)) {
      alert(siteText_("Notifications are not supported.", "このブラウザは通知に対応していません。"));
      notifySelect.value = "off";
      return;
    }

    if (nextMode !== "off" && Notification.permission !== "granted") {
      const result = await Notification.requestPermission();

      if (result !== "granted") {
        liveNotificationMode = "off";
        notifySelect.value = "off";
        localStorage.setItem("liveNotificationMode", "off");
        updateNotifySelect_();
        return;
      }
    }

    liveNotificationMode = nextMode;

    localStorage.setItem(
      "liveNotificationMode",
      liveNotificationMode
    );

    if (liveNotificationMode !== "off" && liveCache?.players) {
      saveLiveState_(liveCache.players);
      liveStateInitialized = true;
    }

    updateNotifySelect_();

    if (liveNotificationMode !== "off") {
      new Notification(
        "OW KITSUNE GUIDE",
        {
          body:
            liveNotificationMode === "goats"
              ? siteText_("Live notifications: MY GOATS", "ライブ通知: MY GOATS")
              : siteText_("Live notifications: ALL", "ライブ通知: ALL"),
          icon: "./icons/icon-192.png"
        }
      );
    }
  }
);

let previousLiveState = {};

try{
  previousLiveState =
    JSON.parse(localStorage.getItem("liveState") || "{}");
}catch{
  previousLiveState = {};
}

let liveStateInitialized = false;

function checkLiveNotifications_(players){

  if (!Array.isArray(players)) return;

  if (liveNotificationMode === "off") {
  return;
}

  if (!liveStateInitialized) {
    saveLiveState_(players);
    liveStateInitialized = true;
    return;
  }

  if (!("Notification" in window)) {
    saveLiveState_(players);
    return;
  }

  if (Notification.permission !== "granted") {
    saveLiveState_(players);
    return;
  }

  for (const p of players){

    if (
      liveNotificationMode === "goats" &&
      !isFavorite_(p.name)
    ) {
      continue;
    }

    const isLive =
      p.status === "LIVE" ||
      p.status === "🔥 LIVE";

    const wasLive =
      previousLiveState[p.name] || false;

    if (!wasLive && isLive){

      const { mainTitle, subTitles } =
        buildMediaTitles_(
          p.rawTitle || "",
          p.titleJp || "",
          p.titleEn || "",
          p.titleKr || ""
        );

      new Notification(
        `🔴 ${p.name} is LIVE`,
        {
         body:
            [
              p.platform || "",
              mainTitle,
              ...subTitles
            ].filter(Boolean).join("\n"),
          icon: "./icons/icon-192.png"
        }
      );
    }
  }

  saveLiveState_(players);
}

function saveLiveState_(players){

  previousLiveState = {};

  for(const p of players){

    previousLiveState[p.name] =
      p.status === "LIVE" ||
      p.status === "🔥 LIVE";
  }

  localStorage.setItem(
    "liveState",
    JSON.stringify(previousLiveState)
  );
}

setInterval(() => {
  refreshLiveNotificationsOnly_();
}, 5 * 60 * 1000);

function refreshLiveNotificationsOnly_() {
  if (liveNotificationMode === "off") return;

  fetch(CONFIG.API_URL + "?view=new")
    .then(res => res.json())
    .then(data => {
      const players = data.players || [];

      liveCache = data;
      liveCacheTime = Date.now();

      if (data.counts) {
        updateAllButtonCounts(data.counts);
      }

      checkLiveNotifications_(players);
    })
    .catch(error => {
      console.error("Live notification refresh failed:", error);
    });
}