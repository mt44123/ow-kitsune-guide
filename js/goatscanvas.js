const teamLogoCache = {};

function buildGoatsShareText_(players) {
  return [
    "私のヤギ",
    "",
    "https://ow-kitsune-guide.pages.dev/",
    "",
    "#OWCS #Overwatch #OWKitsuneGuide"
  ].join("\n");
}

function getCanvasRegionLabel_(nationality) {
  const cls = getNationalityRegionClass(nationality);

  switch (cls) {
    case "region-kr":
      return "KR";
    case "region-jp":
      return "JP";
    case "region-cn":
      return "CN";
    case "region-na":
      return "NA";
    case "region-emea":
      return "EMEA";
    case "region-pac":
      return "PAC";
    case "region-sa":
      return "SA";
    default:
      return "";
  }
}

function getCanvasRoleIcon_(role) {
  const key = String(role || "").toLowerCase();

  if (key.includes("tank")) return "💪 TANK";
  if (key.includes("dps")) return "🔫 DPS";
  if (key.includes("sup")) return "💉 SUP";
  if (key.includes("coach")) return "📋 COACH";

  return "";
}

function getCanvasRegionColor_(nationality) {
  const bodyStyle = getComputedStyle(document.body);
  const cls = getNationalityRegionClass(nationality);

  const colorMap = {
    "region-kr": "--region-kr",
    "region-jp": "--region-jp",
    "region-cn": "--region-cn",
    "region-na": "--region-na",
    "region-emea": "--region-emea",
    "region-pac": "--region-pac",
    "region-sa": "--region-sa",
    "region-unknown": "--region-unknown"
  };

  const varName = colorMap[cls] || "--region-unknown";

  return (
    bodyStyle.getPropertyValue(varName).trim() ||
    "#777777"
  );
}

function drawGlow_(ctx, x, y, radius, color, alpha) {
  const glow = ctx.createRadialGradient(
    x, y, 0,
    x, y, radius
  );

  glow.addColorStop(0, hexToRgba_(color, alpha));
  glow.addColorStop(0.45, hexToRgba_(color, alpha * 0.35));
  glow.addColorStop(1, hexToRgba_(color, 0));

  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCornerGlow_(ctx, x, y, radius, color) {
  const glow = ctx.createRadialGradient(
    x, y, 0,
    x, y, radius
  );

  glow.addColorStop(0, color);
  glow.addColorStop(0.42, color.replace(/[\d.]+\)$/,"0.04)"));
  glow.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(
    x - radius,
    y - radius,
    radius * 2,
    radius * 2
  );
}

function hexToRgba_(color, alpha) {
  const probe = document.createElement("span");
  probe.style.color = color;
  document.body.appendChild(probe);

  const computed = getComputedStyle(probe).color;
  probe.remove();

  const match = computed.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)/
  );

  if (!match) {
    return `rgba(255,255,255,${alpha})`;
  }

  const r = match[1];
  const g = match[2];
  const b = match[3];

  return `rgba(${r},${g},${b},${alpha})`;
}

function roundRect_(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function showGoatsShareModal_(blob, shareText, options = {}) {
  const shareTitle = options.shareTitle || "MY GOATS";
  const modalTitle = options.title || "Share Your GOATs";
  const fileName = options.fileName || "ow-kitsune-my-goats.png";
  const oldModal =
    document.querySelector(".goats-share-modal");

  if (oldModal) {
    oldModal.remove();
  }

  const url = URL.createObjectURL(blob);

  const modal = document.createElement("div");
  modal.className = "goats-share-modal";

  modal.innerHTML = `
    <div class="goats-share-modal-backdrop"></div>

    <div class="goats-share-modal-card">
      <button class="goats-share-modal-close" type="button">
        ×
      </button>

      <h3>${escapeHtml(modalTitle)}</h3>

      <img
        class="goats-share-preview"
        src="${url}"
        alt="Your GOATs share image"
      >

      <textarea
        class="goats-share-text"
        readonly
      >${escapeHtml(shareText)}</textarea>

      <div class="goats-share-actions">

        <button
          type="button"
          data-goats-share
        >
          Share Social
        </button>

        <a
          href="${url}"
          download="${escapeHtml(fileName)}"
        >
          Download PNG
        </a>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => {
    modal.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  modal
    .querySelector(".goats-share-modal-backdrop")
    .addEventListener("click", close);

  modal
    .querySelector(".goats-share-modal-close")
    .addEventListener("click", close);

  modal
    .querySelector("[data-goats-share]")
    .addEventListener("click", async () => {

      const file = new File(
        [blob],
        fileName,
        {
          type: "image/png"
        }
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {

          await navigator.share({
            title: shareTitle,
            text: shareText,
            files: [file]
          });

          close();

        } catch (e) {}
      } else {

        alert(
          "Windows Share is not available in this browser."
        );

      }

    });
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildSiteShareText_() {
  return [
    "🦊 OW KITSUNE GUIDE",
    "Where Are the GOATs?",
    "",
    "Live streams, videos, clips and links from Overwatch pro players.",
    "Track Twitch, CHZZK, SOOP, Bilibili, YouTube, birthdays and player links in one place.",
    "",
    "https://ow-kitsune-guide.pages.dev/",
    "",
    "#OWCS #Overwatch #OWKitsuneGuide"
  ].join("\n");
}

function shareSite_() {
  fetch("./og-image.png")
    .then(res => res.blob())
    .then(blob => {
      showGoatsShareModal_(
        blob,
        buildSiteShareText_(),
        {
          title: "Share OW KITSUNE GUIDE",
          shareTitle: "OW KITSUNE GUIDE",
          fileName: "ow-kitsune-guide.png"
        }
      );
    })
    .catch(error => {
      console.error(error);
      alert("Failed to prepare site share image.");
    });
}

document
  .getElementById("shareSiteButton")
  ?.addEventListener("click", shareSite_);

document
  .getElementById("shareGoatsButton")
  ?.addEventListener("click", () => {
    settingsMenu?.classList.add("settings-hidden");
    shareGoatsImage_();
  });

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
    "ZANSIDE GAMING",
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
    return `./TeamLogo/${file}_light.png`;
  }

  return `./TeamLogo/${file}.png`;
}

async function preloadTeamLogos_(players, useLightTheme = true) {

  const promises = players.map(p => {

    const team = String(p.team || "");

    if (!team || team === "No team") {
      return Promise.resolve();
    }

    const logoPath =  getTeamLogoPath_(team, useLightTheme);

    if (!logoPath || teamLogoCache[logoPath]) {
      return Promise.resolve();
    }

    return new Promise(resolve => {

      const img = new Image();

      img.onload = () => {
        teamLogoCache[logoPath] = img;
        resolve();
      };

      img.onerror = () => resolve();

      img.src = logoPath;

    });

  });

  await Promise.all(promises);
}