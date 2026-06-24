let liveNotificationMode =
  localStorage.getItem("liveNotificationMode") || "off";

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

  if (liveNotificationMode === "goats") {
    notifyButton.textContent =
      "⭐ Live Notifications: MY GOATS";
  } else if (liveNotificationMode === "all") {
    notifyButton.textContent =
      "🔔 Live Notifications: ALL";
  } else {
    notifyButton.textContent =
      "🔕 Live Notifications: OFF";
}
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

    if (liveNotificationMode === "off") {
      liveNotificationMode = "goats";
    } else if (liveNotificationMode === "goats") {
      liveNotificationMode = "all";
    } else {
      liveNotificationMode = "off";
    }

    if (liveNotificationMode !== "off" && liveCache?.players) {
      saveLiveState_(liveCache.players);
      liveStateInitialized = true;
    }

    localStorage.setItem(
      "liveNotificationMode",
      liveNotificationMode
    );

    updateNotifyButton_();

    if (liveNotificationMode !== "off") {
      new Notification(
        "OW KITSUNE GUIDE",
        {
          body:
            liveNotificationMode === "goats"
              ? "Live notifications: MY GOATS"
              : "Live notifications: ALL",
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
