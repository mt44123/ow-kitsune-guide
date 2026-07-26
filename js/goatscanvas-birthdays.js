function buildBirthdaysShareText_(players) {
  const visitor = getVisitorTimezoneInfo_();

  const nameLines = players
    .map(p => `🎂${p.name}🎂`)
    .join("\n");

  const lines = [
    "Happy Birthday! 🎉 Hope you have an amazing day!",
    nameLines
  ];

  if (visitor.utcLabel) {
    const tzValue = visitor.iana
      ? `${visitor.utcLabel}, ${visitor.iana}`
      : visitor.utcLabel;
    lines.push(`(My time zone: ${tzValue})`);
  }

  lines.push(
    "",
    "https://owkitsune.com/?view=birthdays",
    "#OW #OWCS #Overwatch #HappyBirthday #オーバーウォッチ"
  );

  return lines.join("\n");
}

function drawBirthdaySunburst_(ctx, width, height) {
  const cx = width / 2;
  const cy = 40;

  ctx.save();
  for (let i = 0; i < 28; i++) {
    const angle = (Math.PI * 2 * i) / 28 - Math.PI / 2;
    const len = 520 + (i % 2) * 80;
    const grad = ctx.createLinearGradient(
      cx,
      cy,
      cx + Math.cos(angle) * len,
      cy + Math.sin(angle) * len
    );
    grad.addColorStop(0, "rgba(255,255,220,0.28)");
    grad.addColorStop(0.35, "rgba(255,200,120,0.08)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(angle) * len,
      cy + Math.sin(angle) * len
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawBirthdayDecor_(ctx, width, height) {
  const drawNeonPath = (color, lineWidth, drawFn) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    drawFn();
    ctx.stroke();
    ctx.restore();
  };

  // paw (top-left)
  drawNeonPath("rgba(255,120,220,0.95)", 4, () => {
    ctx.beginPath();
    ctx.ellipse(90, 210, 28, 22, -0.3, 0, Math.PI * 2);
    ctx.moveTo(62, 175);
    ctx.ellipse(62, 175, 10, 13, -0.4, 0, Math.PI * 2);
    ctx.moveTo(82, 162);
    ctx.ellipse(82, 162, 10, 13, -0.1, 0, Math.PI * 2);
    ctx.moveTo(105, 165);
    ctx.ellipse(105, 165, 10, 13, 0.2, 0, Math.PI * 2);
    ctx.moveTo(122, 182);
    ctx.ellipse(122, 182, 10, 13, 0.5, 0, Math.PI * 2);
  });

  // heart (mid-left)
  drawNeonPath("rgba(255,90,160,0.9)", 4, () => {
    const hx = 70;
    const hy = height * 0.55;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 18);
    ctx.bezierCurveTo(hx - 28, hy - 8, hx - 22, hy - 36, hx, hy - 18);
    ctx.bezierCurveTo(hx + 22, hy - 36, hx + 28, hy - 8, hx, hy + 18);
  });

  // paw (mid-right)
  drawNeonPath("rgba(120,220,255,0.9)", 4, () => {
    const px = width - 95;
    const py = height * 0.48;
    ctx.beginPath();
    ctx.ellipse(px, py, 26, 20, 0.25, 0, Math.PI * 2);
    ctx.moveTo(px - 22, py - 30);
    ctx.ellipse(px - 22, py - 30, 9, 12, -0.2, 0, Math.PI * 2);
    ctx.moveTo(px - 4, py - 38);
    ctx.ellipse(px - 4, py - 38, 9, 12, 0, 0, Math.PI * 2);
    ctx.moveTo(px + 16, py - 34);
    ctx.ellipse(px + 16, py - 34, 9, 12, 0.25, 0, Math.PI * 2);
    ctx.moveTo(px + 28, py - 18);
    ctx.ellipse(px + 28, py - 18, 9, 12, 0.45, 0, Math.PI * 2);
  });

  // heart (top-right-ish)
  drawNeonPath("rgba(255,170,90,0.85)", 3.5, () => {
    const hx = width - 80;
    const hy = 250;
    ctx.beginPath();
    ctx.moveTo(hx, hy + 14);
    ctx.bezierCurveTo(hx - 22, hy - 6, hx - 18, hy - 28, hx, hy - 14);
    ctx.bezierCurveTo(hx + 18, hy - 28, hx + 22, hy - 6, hx, hy + 14);
  });

  // sparkles
  const sparkles = [
    [160, 90, "rgba(255,240,150,0.9)"],
    [220, 150, "rgba(255,160,220,0.85)"],
    [width - 180, 100, "rgba(160,240,255,0.9)"],
    [width - 140, 180, "rgba(255,210,120,0.85)"],
    [140, height * 0.42, "rgba(255,180,255,0.75)"],
    [width - 160, height * 0.62, "rgba(140,230,255,0.8)"]
  ];

  sparkles.forEach(([x, y, color]) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawBirthdayPartyHat_(ctx, x, y, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(0, -46);
  ctx.lineTo(34, 28);
  ctx.lineTo(-34, 28);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -50, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-30, 28);
  ctx.quadraticCurveTo(0, 40, 30, 28);
  ctx.stroke();

  ctx.restore();
}

function getBirthdayCardNeonColor_(index, regionColor) {
  const palette = [
    "#5CFFF7",
    "#FFD56A",
    "#FF7AD9",
    "#7CFFB2",
    "#FF9B6A"
  ];
  return palette[index % palette.length] || regionColor || "#5CFFF7";
}

async function shareBirthdaysImage_() {
  const today = new Date();
  const players = getTodayBirthdays_(currentData || [], today);

  if (!players.length) {
    alert("No birthdays today.");
    return;
  }

  players.sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
  );

  await preloadTeamLogos_(players, false);

  const shareText = buildBirthdaysShareText_(players);
  const visitor = getVisitorTimezoneInfo_();
  const visitorTzLabel = visitor.utcLabel
    ? (visitor.iana
        ? `${visitor.utcLabel}, ${visitor.iana}`
        : visitor.utcLabel)
    : "";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    alert("Failed to create share image.");
    return;
  }

  const qr = new Image();
  qr.src = "/icons/qr.png";

  const width = 1200;
  const padding = 56;
  const fontTitle = "'Jura', sans-serif";
  const fontBody = "Arial, sans-serif";

  const useTwoColumns = players.length >= 4;
  const rows = Math.ceil(players.length / (useTwoColumns ? 2 : 1));

  const columnWidth = useTwoColumns ? 520 : 760;
  const columnGap = 36;

  const cardHeight = 156;
  const cardGap = 28;
  const headerHeight = 300;
  const footerHeight = 180;

  const height =
    headerHeight +
    rows * (cardHeight + cardGap) +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  // Bright festive background
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#B14CFF");
  bg.addColorStop(0.28, "#FF5AA8");
  bg.addColorStop(0.55, "#FF8A3D");
  bg.addColorStop(0.78, "#FFC94A");
  bg.addColorStop(1, "#3DE0FF");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft light overlays
  drawGlow_(ctx, width * 0.2, height * 0.15, 420, "#FF7ADB", 0.35);
  drawGlow_(ctx, width * 0.8, height * 0.25, 480, "#FFE566", 0.28);
  drawGlow_(ctx, width * 0.7, height * 0.85, 520, "#4DE8FF", 0.32);
  drawGlow_(ctx, width * 0.5, 0, 380, "#FFF6B0", 0.45);

  drawBirthdaySunburst_(ctx, width, height);
  drawBirthdayDecor_(ctx, width, height);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const dateText =
    `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  ctx.textAlign = "center";

  // Title
  ctx.save();
  ctx.font = `900 64px ${fontTitle}`;
  ctx.shadowColor = "#FFE566";
  ctx.shadowBlur = 28;
  const titleGrad = ctx.createLinearGradient(
    width / 2 - 280,
    0,
    width / 2 + 280,
    0
  );
  titleGrad.addColorStop(0, "#FFF8C8");
  titleGrad.addColorStop(0.5, "#FFE566");
  titleGrad.addColorStop(1, "#FFC94A");
  ctx.fillStyle = titleGrad;
  ctx.fillText("TODAY'S BIRTHDAYS", width / 2, 108);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.65)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 28px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, 156);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "#FF9B4A";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#FFE0A8";
  ctx.font = `900 26px ${fontBody}`;
  ctx.fillText(
    `${dateText}  ·  ${players.length} PLAYER${players.length === 1 ? "" : "S"}`,
    width / 2,
    200
  );
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = `600 20px ${fontBody}`;
  ctx.fillText(
    visitorTzLabel
      ? `(My time zone: ${visitorTzLabel})`
      : "(My time zone: -)",
    width / 2,
    236
  );

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `500 16px ${fontBody}`;
  ctx.fillText(
    "Around 18:00 JST, most OW regions share this date (Hawaii often previous day)",
    width / 2,
    266
  );

  const listTop = headerHeight;
  const listLeft =
    useTwoColumns
      ? (width - columnWidth * 2 - columnGap) / 2
      : (width - columnWidth) / 2;

  ctx.textAlign = "left";

  players.forEach((p, index) => {
    const column = useTwoColumns ? index % 2 : 0;
    const row = useTwoColumns ? Math.floor(index / 2) : index;

    const x = listLeft + column * (columnWidth + columnGap);
    const y = listTop + row * (cardHeight + cardGap);

    const regionColor = getCanvasRegionColor_(p.nationality);
    const neon = getBirthdayCardNeonColor_(index, regionColor);
    const regionLabel = getCanvasRegionLabel_(p.nationality);
    const roleIcon = getCanvasRoleIcon_(p.role);
    const logo = teamLogoCache[getTeamLogoPath_(p.team, false)];
    const tz = getPlayerTimezoneDisplay_(p, { forceEnglish: true });
    const ageText = getBirthdayAgeText_(p);

    // Card glass base
    ctx.save();
    ctx.shadowColor = neon;
    ctx.shadowBlur = 26;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 22);
    ctx.fillStyle = "rgba(20, 12, 40, 0.28)";
    ctx.fill();
    ctx.restore();

    const glass = ctx.createLinearGradient(x, y, x, y + cardHeight);
    glass.addColorStop(0, "rgba(255,255,255,0.18)");
    glass.addColorStop(0.45, "rgba(255,255,255,0.08)");
    glass.addColorStop(1, "rgba(255,255,255,0.04)");
    ctx.fillStyle = glass;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 22);
    ctx.fill();

    // Neon border
    ctx.save();
    ctx.shadowColor = neon;
    ctx.shadowBlur = 22;
    ctx.strokeStyle = neon;
    ctx.lineWidth = 3;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 22);
    ctx.stroke();
    ctx.restore();

    // Soft inner tint
    const tint = ctx.createRadialGradient(
      x + columnWidth * 0.85,
      y + cardHeight * 0.5,
      10,
      x + columnWidth * 0.85,
      y + cardHeight * 0.5,
      220
    );
    tint.addColorStop(0, hexToRgba_(neon, 0.22));
    tint.addColorStop(1, hexToRgba_(neon, 0));
    ctx.fillStyle = tint;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 22);
    ctx.fill();

    if (logo) {
      ctx.save();
      const maxWidth = 92;
      const maxHeight = 80;
      const scale = Math.min(
        maxWidth / logo.width,
        maxHeight / logo.height
      );
      const w = logo.width * scale;
      const h = logo.height * scale;
      const logoX = x + columnWidth - 28 - w;
      const logoY = y + (cardHeight - h) / 2;

      ctx.shadowColor = neon;
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.98;
      ctx.drawImage(logo, logoX, logoY, w, h);
      ctx.restore();
    } else {
      drawBirthdayPartyHat_(
        ctx,
        x + columnWidth - 70,
        y + cardHeight / 2 - 4,
        neon
      );
    }

    const name = p.name || "";
    const displayName = `🎂${name}🎂`;
    const nameFontSize =
      useTwoColumns && name.length > 12 ? 30 : 38;

    ctx.save();
    ctx.shadowColor = neon;
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `900 ${nameFontSize}px ${fontTitle}`;
    ctx.fillText(displayName, x + 32, y + 52, columnWidth - 150);
    ctx.restore();

    const meta = [
      "🎂",
      regionLabel,
      roleIcon,
      p.team && p.team !== "No team" ? p.team : "",
      ageText
    ].filter(Boolean).join("  •  ");

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `700 17px ${fontBody}`;
    ctx.fillText(meta, x + 32, y + 88, columnWidth - 150);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `600 15px ${fontBody}`;
    ctx.fillText(tz.natLine, x + 32, y + 120, columnWidth - 150);
  });

  const footerY = height - 120;
  const footerLineX = useTwoColumns ? listLeft : (width - columnWidth) / 2;
  const footerLineWidth =
    useTwoColumns
      ? columnWidth * 2 + columnGap
      : columnWidth;

  const lineGrad = ctx.createLinearGradient(
    footerLineX,
    0,
    footerLineX + footerLineWidth,
    0
  );
  lineGrad.addColorStop(0, "rgba(255,120,220,0.15)");
  lineGrad.addColorStop(0.5, "rgba(255,255,255,0.95)");
  lineGrad.addColorStop(1, "rgba(80,230,255,0.15)");

  ctx.fillStyle = lineGrad;
  ctx.fillRect(footerLineX, footerY - 34, footerLineWidth, 3);

  // Center heart on divider
  ctx.save();
  ctx.fillStyle = "#FF7ADB";
  ctx.shadowColor = "#FF7ADB";
  ctx.shadowBlur = 12;
  const hx = width / 2;
  const hy = footerY - 34;
  ctx.beginPath();
  ctx.moveTo(hx, hy + 8);
  ctx.bezierCurveTo(hx - 10, hy - 2, hx - 8, hy - 12, hx, hy - 5);
  ctx.bezierCurveTo(hx + 8, hy - 12, hx + 10, hy - 2, hx, hy + 8);
  ctx.fill();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = `600 22px ${fontBody}`;
  ctx.fillText(`Generated ${dateText}`, width / 2, footerY + 8);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = `700 22px ${fontBody}`;
  ctx.fillText("Celebrate with the GOATs — link below", width / 2, footerY + 42);

  ctx.save();
  ctx.shadowColor = "#7CFFF7";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#B8FFFF";
  ctx.font = `800 22px ${fontBody}`;
  ctx.fillText("https://owkitsune.com/?view=birthdays", width / 2, footerY + 76);
  ctx.restore();

  const finishShare = () => {
    canvas.toBlob(blob => {
      if (!blob) return;

      const file = new File(
        [blob],
        "owkg-todays-birthdays.png",
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
          title: "Happy Birthday",
          text: shareText,
          files: [file]
        }).catch(() => {});
        return;
      }

      showGoatsShareModal_(blob, shareText, {
        title: "Share Happy Birthday",
        shareTitle: "TODAY'S BIRTHDAYS",
        fileName: "owkg-todays-birthdays.png"
      });
    }, "image/png");
  };

  const qrSize = 58;
  const qrX = width - padding - qrSize;
  const qrY = footerY + 18;

  const drawQrAndShare = () => {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect_(ctx, qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 8);
    ctx.fill();
    ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);
    ctx.restore();
    finishShare();
  };

  if (qr.complete) {
    drawQrAndShare();
  } else {
    qr.onload = drawQrAndShare;
    qr.onerror = finishShare;
  }
}
