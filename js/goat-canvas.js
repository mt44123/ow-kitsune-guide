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

  const bgDark = bodyStyle.getPropertyValue("--bg-dark").trim() || "#111A2D";
  const bgMain = bodyStyle.getPropertyValue("--bg-main").trim() || "#111A2D";
  const bgLight = bodyStyle.getPropertyValue("--bg-light").trim() || "#1D253A";
  const accent = bodyStyle.getPropertyValue("--accent").trim() || "#B84724";
  const textMain = bodyStyle.getPropertyValue("--text-main").trim() || "#FFFFFF";
  const textSub = bodyStyle.getPropertyValue("--text-sub").trim() || "rgba(255,255,255,.7)";
  const textMuted = bodyStyle.getPropertyValue("--text-muted").trim() || "rgba(255,255,255,.45)";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

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
  const headerHeight = 300;
  const footerHeight = 170;

  const height =
    headerHeight +
    rows * (cardHeight + cardGap) +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = bgMain;
  ctx.fillRect(0, 0, width, height);

// ===== Accent Glow =====
  drawGlow_(ctx, width - 80, 90, 360, accent, 0.28);
  drawGlow_(ctx, 80, height - 80, 420, accent, 0.22);
  drawGlow_(ctx, width * 0.5, height * 0.15, 520, accent, 0.10);

  ctx.textAlign = "center";

  ctx.fillStyle = textMain;
  ctx.font = `800 62px ${fontTitle}`;
  ctx.fillText("MY GOATS", width / 2, 145);

  ctx.fillStyle = textSub;
  ctx.font = `700 28px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, 188);

  ctx.fillStyle = accent;
  ctx.font = `700 26px ${fontBody}`;
  ctx.fillText(
    `${players.length} Player${players.length === 1 ? "" : "s"}`,
    width / 2,
    224
  );

  ctx.textAlign = "left";

  const listTop = headerHeight;
  const columnGap = 34;
  const listWidth = width - padding * 2;

  const columnWidth =
    useTwoColumns
      ? 480
      : listWidth;

  const listLeft =
    useTwoColumns
      ? (width - columnWidth * 2 - columnGap) / 2
      : padding;

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

    ctx.save();

    ctx.shadowColor = "rgba(0,0,0,.28)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = bgLight;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = regionColor;
    roundRect_(ctx, x, y, 9, cardHeight, 6);
    ctx.fill();

    ctx.fillStyle = textMuted;
    ctx.font = `700 22px ${fontBody}`;
    ctx.fillText("★", x + 28, y + 48);

    ctx.fillStyle = textMain;

    const name = p.name || "";
    const nameFontSize =
      useTwoColumns && name.length > 14
        ? 26
        : 32;

    ctx.font = `800 ${nameFontSize}px ${fontBody}`;
    ctx.fillText(name, x + 72, y + 35, columnWidth - 100);

    const info = [
      regionLabel,
      roleIcon
    ].filter(Boolean).join("  •  ");

    ctx.fillStyle = textMuted;
    ctx.font = `600 18px ${fontBody}`;
    ctx.fillText(
      info,
      x + 72,
      y + 60
    );

    if (p.team && p.team !== "No team") {
      ctx.fillText(
        p.team,
        x + 72,
        y + 82,
        columnWidth - 100
      );
    }
  });

  const footerY = height - 120;

  const footerLineX = useTwoColumns ? listLeft : padding;

const footerLineWidth =
    useTwoColumns
        ? columnWidth * 2 + columnGap
        : width - padding * 2;

    ctx.fillStyle = accent;
    ctx.fillRect(
    footerLineX,
    footerY - 24,
    footerLineWidth,
    3
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

  canvas.toBlob(blob => {
    if (!blob) return;

    const file = new File(
      [blob],
      "ow-kitsune-my-goats.png",
      { type: "image/png" }
    );

    if (
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

    navigator.clipboard?.writeText(shareText).catch(() => {});

    const link = document.createElement("a");
    link.download = "ow-kitsune-my-goats.png";
    link.href = URL.createObjectURL(blob);
    link.click();

    URL.revokeObjectURL(link.href);
  }, "image/png");
}

function buildGoatsShareText_(players) {
  return [
    "🦊 MY GOATS",
    "",
    `${players.length} Player${players.length === 1 ? "" : "s"}`,
    "",
    "Where Are the GOATs?",
    "https://ow-kitsune-guide.pages.dev/",
    "",
    "#OWCS #Overwatch2 #OWKitsuneGuide"
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
  const ctx = document.createElement("canvas").getContext("2d");

  ctx.fillStyle = color;
  const normalized = ctx.fillStyle;

  if (!normalized.startsWith("#")) {
    return color.replace(
      /rgba?\(([^)]+)\)/,
      `rgba($1, ${alpha})`
    );
  }

  const hex = normalized.slice(1);

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

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