function shareGoatsImage_() {
  const favNames = getFavorites_();

  if (!favNames.length) return;

  const players = favNames.map(name => {
    const player = (currentData || []).find(p =>
      p.name === name
    );

    return player || { name };
  });

  players.sort((a, b) =>
    (a.name || "").localeCompare(
      b.name || "",
      "en",
      { sensitivity: "base" }
    )
  );

  const shareText = buildGoatsShareText_(players);

  const bodyStyle = getComputedStyle(document.body);

  // Canvas fixed brand colors
  const bgMain = "#18233A";
  const bgLight = "#26334D";
  const textMain = "#FFFFFF";
  const textSub = "rgba(255,255,255,.82)";
  const textMuted = "rgba(255,255,255,.62)";

  // Theme colors
  const accent =
    bodyStyle.getPropertyValue("--accent").trim() ||
    "#FE5002";

  const border = "rgba(255,255,255,.26)";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const qr = new Image();
  qr.src = "./icons/qr.svg";

  const orangeLine = new Image();
  orangeLine.src = "./icons/orangeline.png";

  const width = 1200;
  const padding = 80;
  const fontTitle = "'Jura', sans-serif";
  const fontBody = "Arial, sans-serif";

  const useTwoColumns = players.length > 12;

  const rows = Math.ceil(
    players.length / (useTwoColumns ? 2 : 1)
  );

  const cardHeight = 96;
  const cardGap = 12;
  const headerHeight = 270;
  const footerHeight = 170;

  const height =
    headerHeight +
    rows * (cardHeight + cardGap) +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = bgMain;
  ctx.fillRect(0, 0, width, height);

  drawGlow_(ctx, width - 80, 90, 360, accent, 0.20);
  drawGlow_(ctx, 80, height - 80, 420, accent, 0.14);
  drawGlow_(ctx, width * 0.5, height * 0.15, 520, accent, 0.07);

  ctx.textAlign = "center";

  ctx.save();

  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;

  ctx.fillStyle = textMain;
  ctx.font = `800 62px ${fontTitle}`;
  ctx.fillText("MY GOATS", width / 2, 135);

  ctx.restore();

  ctx.fillStyle = textSub;
  ctx.font = `700 28px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, 178);

  ctx.save();
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.fillStyle = accent;
  ctx.font = `800 28px ${fontBody}`;
  ctx.fillText(
    `${players.length} Player${players.length === 1 ? "" : "s"}`,
    width / 2,
    214
  );
  ctx.restore();

  ctx.textAlign = "left";

  const listTop = headerHeight;
  const columnGap = 34;
  const listWidth = width - padding * 2;

  let columnWidth;

    if (useTwoColumns) {
      columnWidth = 500;
    } else if (players.length <= 4) {
      columnWidth = 700;
    } else if (players.length <= 8) {
      columnWidth = 820;
    } else {
      columnWidth = listWidth;
    }

    const listLeft =
      useTwoColumns
        ? (width - columnWidth * 2 - columnGap) / 2
        : (width - columnWidth) / 2;

  players.forEach((p, index) => {
    const column = useTwoColumns ? index % 2 : 0;
    const row = useTwoColumns ? Math.floor(index / 2) : index;

    const x =
      listLeft +
      column * (columnWidth + columnGap);

    const y =
      listTop +
      row * (cardHeight + cardGap);

    const regionColor =
      getCanvasRegionColor_(p.nationality);

    const regionLabel =
      getCanvasRegionLabel_(p.nationality);

    const roleIcon =
      getCanvasRoleIcon_(p.role);

  // Glass card base
  const glass = ctx.createLinearGradient(x, y, x, y + cardHeight);

  glass.addColorStop(0.00, "rgba(255,255,255,0.075)");
  glass.addColorStop(0.10, "rgba(255,255,255,0.035)");
  glass.addColorStop(0.50, "rgba(255,255,255,0.010)");
  glass.addColorStop(0.90, "rgba(255,255,255,0.025)");
  glass.addColorStop(1.00, "rgba(255,255,255,0.060)");

  ctx.fillStyle = glass;
  roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
  ctx.fill();

  // Soft inner shadow
  const inner = ctx.createLinearGradient(x, y, x, y + cardHeight);
  inner.addColorStop(0, "rgba(255,255,255,0.10)");
  inner.addColorStop(0.12, "rgba(255,255,255,0.02)");
  inner.addColorStop(1, "rgba(0,0,0,0.14)");

  ctx.fillStyle = inner;
  roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
  ctx.fill();

  // Region tint from bottom-right
  const regionGlow = ctx.createLinearGradient(
    x + columnWidth,
    y + cardHeight,
    x,
    y
  );

  regionGlow.addColorStop(0.00, hexToRgba_(regionColor, 0.20));
  regionGlow.addColorStop(0.18, hexToRgba_(regionColor, 0.08));
  regionGlow.addColorStop(0.42, hexToRgba_(regionColor, 0.02));
  regionGlow.addColorStop(0.72, hexToRgba_(regionColor, 0));

  ctx.fillStyle = regionGlow;
  roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
  ctx.fill();

  // Liquid glass blobs
  ctx.save();
  roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
  ctx.clip();

  const blob1 = ctx.createRadialGradient(
    x + columnWidth * 0.22, y + 10, 0,
    x + columnWidth * 0.22, y + 10, columnWidth * 0.45
  );
  blob1.addColorStop(0, "rgba(255,255,255,0.075)");
  blob1.addColorStop(0.28, "rgba(255,255,255,0.030)");
  blob1.addColorStop(0.62, "rgba(255,255,255,0.006)");
  blob1.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = blob1;
  ctx.fillRect(x, y, columnWidth, cardHeight);

  const blob2 = ctx.createRadialGradient(
    x + columnWidth * 0.82, y + cardHeight * 0.78, 0,
    x + columnWidth * 0.82, y + cardHeight * 0.78, columnWidth * 0.38
  );
  blob2.addColorStop(0, "rgba(255,255,255,0.040)");
  blob2.addColorStop(0.45, "rgba(255,255,255,0.012)");
  blob2.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = blob2;
  ctx.fillRect(x, y, columnWidth, cardHeight);

  ctx.restore();

  // Neon outer glow
  ctx.save();

  ctx.shadowColor = regionColor;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = hexToRgba_(regionColor, 0.38);
  ctx.lineWidth = 2;

  roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
  ctx.stroke();

  ctx.restore();

  // Inner neon rim
  ctx.save();

  ctx.strokeStyle = hexToRgba_(regionColor, 0.22);
  ctx.lineWidth = 1;

  roundRect_(
    ctx,
    x + 2,
    y + 2,
    columnWidth - 4,
    cardHeight - 4,
    14
  );

  ctx.stroke();

  ctx.restore();

  // Thin glass border
  ctx.strokeStyle = "rgba(255,255,255,0.36)";
  ctx.lineWidth = 1;
  roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
  ctx.stroke();

    // 名前
    ctx.fillStyle = textMain;

    const name = p.name || "";
    const nameFontSize =
      useTwoColumns && name.length > 14
        ? 26
        : 32;

    ctx.font = `800 ${nameFontSize}px ${fontBody}`;
    ctx.fillText(
      name,
      x + 32,
      y + 40,
      columnWidth - 56
    );

    const meta = [
      regionLabel,
      roleIcon,
      p.team && p.team !== "No team"
        ? p.team
        : ""
    ]
      .filter(Boolean)
      .join("  •  ");

    ctx.fillStyle = textMuted;
    ctx.font = `600 18px ${fontBody}`;
    ctx.fillText(
      meta,
      x + 32,
      y + 72,
      columnWidth - 56
    );
  });

  const footerY = height - 120;

  const footerLineX =
    useTwoColumns ? listLeft : padding;

  const footerLineWidth =
    useTwoColumns
      ? columnWidth * 2 + columnGap
      : width - padding * 2;

  ctx.fillStyle = accent;
  ctx.fillRect(
    footerLineX,
    footerY - 24,
    footerLineWidth,
    5
  );

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const now = new Date();

  const dateText =
    `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  ctx.textAlign = "center";

  ctx.fillStyle = textSub;
  ctx.font = `700 28px ${fontBody}`;
  ctx.fillText("Where Are the GOATs?", width / 2, footerY + 20);

  ctx.fillStyle = textMuted;
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText(`Generated ${dateText}`, width / 2, footerY + 55);

  ctx.fillStyle = textMuted;
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText("ow-kitsune-guide.pages.dev", width / 2, footerY + 86);

  ctx.textAlign = "left";

  const finishShare = () => {

    canvas.toBlob(blob => {

      if (!blob) return;

      const file = new File(
        [blob],
        "ow-kitsune-my-goats.png",
        { type: "image/png" }
      );

      const isMobile =
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (
        isMobile &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        navigator.share({
          title: "MY GOATS",
          text: shareText,
          files: [file]
        }).catch(() => {});
        return;
      }

      showGoatsShareModal_(blob, shareText);

    }, "image/png");

  };

  const qrSize = 84;

const qrX =
  width - padding - qrSize;

const qrY =
  footerY - 6;

const drawQrAndShare = () => {
  ctx.fillStyle = bgLight;

  roundRect_(
    ctx,
    qrX - 10,
    qrY - 10,
    qrSize + 20,
    qrSize + 40,
    14
  );
  ctx.fill();

  ctx.strokeStyle = border;
  ctx.lineWidth = 1;

  roundRect_(
    ctx,
    qrX - 10,
    qrY - 10,
    qrSize + 20,
    qrSize + 40,
    14
  );
  ctx.stroke();

  ctx.drawImage(
    qr,
    qrX,
    qrY,
    qrSize,
    qrSize
  );

  ctx.textAlign = "center";
  ctx.fillStyle = textMuted;
  ctx.font = `600 15px ${fontBody}`;

  ctx.fillText(
    "Scan Me",
    qrX + qrSize / 2,
    qrY + qrSize + 20
  );

  ctx.textAlign = "left";

  finishShare();
};

const drawHeaderLine = () => {

  ctx.drawImage(
    orangeLine,
    width / 2 - 300,
    232,
    600,
    34
  );

  if (qr.complete) {
    drawQrAndShare();
  } else {
    qr.onload = drawQrAndShare;
    qr.onerror = finishShare;
  }
};

if (orangeLine.complete) {
  drawHeaderLine();
} else {
  orangeLine.onload = drawHeaderLine;

  orangeLine.onerror = () => {
    console.warn("Orange line could not be loaded.");

    if (qr.complete) {
      drawQrAndShare();
    } else {
      qr.onload = drawQrAndShare;
      qr.onerror = finishShare;
    }
  };
}
}

function buildGoatsShareText_(players) {
  return [
    "🦊 MY GOATS",
    "",
    "OW KITSUNE GUIDE",
    "",
    "Live streams, videos, clips and links from Overwatch pro players.",
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