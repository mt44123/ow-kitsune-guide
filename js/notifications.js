let liveNotificationsEnabled =
  localStorage.getItem("liveNotificationsEnabled") === "true";

function updateNotifyButton_() {
  if (!notifyButton) return;

  if (!("Notification" in window)) {
    notifyButton.textContent =
      "❌ Notifications: Unsupported";
    return;
  }
  
  if (Notification.permission === "denied") {
    notifyButton.textContent =
      "🚫 Notifications: Blocked";
    return;
  }

  notifyButton.textContent =
    liveNotificationsEnabled
      ? "🔔 Live Notifications: ON"
      : "🔕 Live Notifications: OFF";
  }

updateNotifyButton_();

notifyButton?.addEventListener(
  "click",
  async () => {

    if (!("Notification" in window)) {
      alert("Notifications are not supported.");
      return;
    }

    if (Notification.permission !== "granted") {
      const result =
        await Notification.requestPermission();

      if (result !== "granted") {
        updateNotifyButton_();
        return;
      }
    }

    liveNotificationsEnabled =
      !liveNotificationsEnabled;

    if (liveNotificationsEnabled && liveCache?.players) {
      saveLiveState_(liveCache.players);
      liveStateInitialized = true;
    }
    
    localStorage.setItem(
      "liveNotificationsEnabled",
      liveNotificationsEnabled ? "true" : "false"
    );

updateNotifyButton_();

    if (liveNotificationsEnabled) {
      new Notification(
        "OW KITSUNE GUIDE",
        {
          body: "LIVE notifications enabled.",
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

  if (!liveNotificationsEnabled) {
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

    if (!isFavorite_(p.name)) continue;

    const isLive =
      p.status === "LIVE" ||
      p.status === "🔥 LIVE";

    const wasLive =
      previousLiveState[p.name] || false;

    if (!wasLive && isLive){

      new Notification(
        `🔴 ${p.name} is LIVE`,
        {
          body:
            `${p.platform || ""}\n${p.title || p.titleJp || p.titleEn || ""}`,
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
  liveCacheTime = 0;

  if (isLiveView(currentView)) {
    loadLiveView(currentView);
  } else {
    loadLiveView("new");
  }
}, 5 * 60 * 1000);
