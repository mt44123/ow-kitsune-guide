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

  const border =
    bodyStyle.getPropertyValue("--border").trim() ||
    "rgba(255,255,255,.12)";

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

  ctx.fillStyle = textMain;
  ctx.font = `800 62px ${fontTitle}`;
  ctx.fillText("MY GOATS", width / 2, 135);

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

  const columnWidth =
    useTwoColumns
      ? 500
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

    ctx.shadowColor = accent;
    ctx.shadowBlur = 8;
    ctx.globalAlpha = 0.14;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = bgLight;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.fill();

    ctx.restore();

    ctx.fillStyle = bgLight;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.fill();

    const cardShine = ctx.createLinearGradient(
      x,
      y,
      x,
      y + cardHeight
    );

    cardShine.addColorStop(0, "rgba(255,255,255,0.075)");
    cardShine.addColorStop(0.18, "rgba(255,255,255,0.025)");

    ctx.fillStyle = cardShine;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.fill();

    const regionGlow = ctx.createLinearGradient(
      x,
      y,
      x + columnWidth,
      y
    );

    regionGlow.addColorStop(
        0,
        hexToRgba_(regionColor,0.20)
    );

    regionGlow.addColorStop(
        0.10,
        hexToRgba_(regionColor,0.06)
    );

    regionGlow.addColorStop(
        0.18,
        hexToRgba_(regionColor,0)
    );

    ctx.fillStyle = regionGlow;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.fill();

    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 16);
    ctx.stroke();

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

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "ow-kitsune-my-goats.png";
    link.href = url;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
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