function buildBirthdaysShareText_(players, date = new Date()) {
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;

  const nameLines = players
    .map(p => `🎂${p.name}🎂`)
    .join("\n");

  return [
    dateLabel,
    "Happy Birthday! 🎉 Hope you have an amazing day!",
    nameLines,
    "",
    "https://owkitsune.com/?view=birthdays",
    "#OW #OWCS #Overwatch #HappyBirthday #オーバーウォッチ"
  ].join("\n");
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

function drawBirthdayEmoji_(ctx, emoji, x, y, size, glowColor) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = Math.max(10, size * 0.35);
  }
  ctx.fillText(emoji, x, y);
  ctx.restore();
}

function drawBirthdayDecor_(ctx, width, height) {
  const items = [
    ["🐾", 95, 200, 56, "rgba(255,140,230,0.95)"],
    ["💖", 78, height * 0.55, 48, "rgba(255,100,170,0.95)"],
    ["🐾", width - 95, height * 0.48, 52, "rgba(120,230,255,0.95)"],
    ["💜", width - 85, 240, 44, "rgba(200,140,255,0.95)"],
    ["✨", 170, 95, 34, "rgba(255,240,160,0.95)"],
    ["✨", width - 175, 105, 34, "rgba(180,245,255,0.95)"],
    ["⭐", 230, 155, 28, "rgba(255,220,120,0.9)"],
    ["💙", width - 150, 175, 30, "rgba(120,200,255,0.95)"],
    ["🎉", 130, height * 0.38, 36, "rgba(255,180,100,0.85)"],
    ["🎈", width - 150, height * 0.62, 36, "rgba(140,220,255,0.85)"],
    ["🦊", 100, height * 0.72, 34, "rgba(255,160,100,0.8)"]
  ];

  items.forEach(([emoji, x, y, size, glow]) => {
    drawBirthdayEmoji_(ctx, emoji, x, y, size, glow);
  });
}

function getBirthdayCardNeonColor_(nationality) {
  const cls = getNationalityRegionClass(nationality);

  // Bright share image: keep JP as white regardless of site theme text color.
  if (cls === "region-jp") {
    return "#FFFFFF";
  }

  return getCanvasRegionColor_(nationality) || "#FFFFFF";
}

async function shareBirthdaysImageForDate_(year, month, day) {
  const date = new Date(year, month - 1, day);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    alert("Invalid date. Use: shareBirthdaysImageForDate_(2026, 7, 30)");
    return;
  }

  return shareBirthdaysImage_(date);
}

async function shareBirthdaysImage_(date = new Date()) {
  const targetDate = date instanceof Date ? date : new Date();
  const players = getTodayBirthdays_(currentData || [], targetDate);

  if (!players.length) {
    const label =
      `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
    alert(`No birthdays on ${label}.`);
    return;
  }

  players.sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
  );

  // Bright birthday image uses a white logo plate, so force light-theme logos.
  await preloadTeamLogos_(players, true, true);

  const shareText = buildBirthdaysShareText_(players, targetDate);

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
  const fontHeavy = '"Arial Black", "Arial Bold", Arial, sans-serif';

  const useTwoColumns = players.length >= 4;
  const rows = Math.ceil(players.length / (useTwoColumns ? 2 : 1));

  const columnWidth = useTwoColumns ? 520 : 760;
  const columnGap = 36;

  const cardHeight = 168;
  const cardGap = 28;
  const headerHeight = 220;
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
    `${months[targetDate.getMonth()]} ${targetDate.getDate()}, ${targetDate.getFullYear()}`;

  ctx.textAlign = "center";

  const title = "HAPPY BIRTHDAY!";
  const titleY = 118;

  // Soft glow behind (separate pass, no blur on final glyphs)
  ctx.save();
  ctx.font = `900 68px ${fontHeavy}`;
  ctx.shadowColor = "rgba(255, 240, 150, 0.95)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText(title, width / 2, titleY);
  ctx.restore();

  // Crisp outline + solid fill for readability
  ctx.save();
  ctx.font = `900 68px ${fontHeavy}`;
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#4A148C";
  ctx.strokeText(title, width / 2, titleY);

  const titleGrad = ctx.createLinearGradient(
    width / 2 - 300,
    titleY - 40,
    width / 2 + 300,
    titleY + 20
  );
  titleGrad.addColorStop(0, "#FFFFFF");
  titleGrad.addColorStop(0.45, "#FFF6C8");
  titleGrad.addColorStop(1, "#FFE566");
  ctx.fillStyle = titleGrad;
  ctx.fillText(title, width / 2, titleY);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 30px ${fontBody}`;
  ctx.fillText(dateText, width / 2, 178);
  ctx.restore();

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

    const neon = getBirthdayCardNeonColor_(p.nationality);
    const regionColor = neon;
    const regionLabel = getCanvasRegionLabel_(p.nationality);
    const roleIcon = getCanvasRoleIcon_(p.role);
    const logo = teamLogoCache[getTeamLogoPath_(p.team, true, true)];
    const tz = getPlayerTimezoneDisplay_(p);
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

    const logoArea = 132;
    const textMaxWidth = columnWidth - logoArea - 48;

    if (logo) {
      ctx.save();
      const maxWidth = 118;
      const maxHeight = 108;
      const scale = Math.min(
        maxWidth / logo.width,
        maxHeight / logo.height
      );
      const w = logo.width * scale;
      const h = logo.height * scale;
      const logoCenterX = x + columnWidth - 24 - logoArea / 2;
      const logoCenterY = y + cardHeight / 2;
      const logoX = logoCenterX - w / 2;
      const logoY = logoCenterY - h / 2;

      // Bright plate behind logo
      ctx.shadowColor = neon;
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      roundRect_(
        ctx,
        logoCenterX - logoArea / 2,
        logoCenterY - logoArea / 2,
        logoArea,
        logoArea,
        22
      );
      ctx.fill();

      ctx.strokeStyle = neon;
      ctx.lineWidth = 2.5;
      roundRect_(
        ctx,
        logoCenterX - logoArea / 2,
        logoCenterY - logoArea / 2,
        logoArea,
        logoArea,
        22
      );
      ctx.stroke();

      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(0,0,0,0.25)";
      ctx.globalAlpha = 1;
      ctx.drawImage(logo, logoX, logoY, w, h);
      ctx.restore();
    } else {
      drawBirthdayEmoji_(
        ctx,
        "🥳",
        x + columnWidth - 24 - logoArea / 2,
        y + cardHeight / 2,
        64,
        neon
      );
    }

    const name = p.name || "";
    const displayName = `🎂${name}🎂`;
    const nameFontSize =
      useTwoColumns && name.length > 12 ? 28 : 36;

    ctx.save();
    ctx.shadowColor = neon;
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `900 ${nameFontSize}px ${fontTitle}`;
    ctx.fillText(displayName, x + 32, y + 52, textMaxWidth);
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
    ctx.fillText(meta, x + 32, y + 90, textMaxWidth);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = `600 15px ${fontBody}`;
    ctx.fillText(tz.natLine, x + 32, y + 124, textMaxWidth);
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

  drawBirthdayEmoji_(
    ctx,
    "💖",
    width / 2,
    footerY - 34,
    28,
    "rgba(255,120,200,0.95)"
  );

  ctx.textAlign = "center";

  ctx.save();
  ctx.shadowColor = "#FFFFFF";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `900 26px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, footerY + 12);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.8)";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 22px ${fontBody}`;
  ctx.fillText("Celebrate with the GOATs — link below", width / 2, footerY + 48);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "#7CFFF7";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#E8FFFF";
  ctx.font = `900 24px ${fontBody}`;
  ctx.fillText("https://owkitsune.com/?view=birthdays", width / 2, footerY + 84);
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
        shareTitle: "HAPPY BIRTHDAY!",
        fileName: "owkg-todays-birthdays.png"
      });
    }, "image/png");
  };

  const qrSize = 58;
  const qrX = width - padding - qrSize;
  const qrY = footerY + 28;

  const drawQrAndShare = () => {
    ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);
    finishShare();
  };

  if (qr.complete) {
    drawQrAndShare();
  } else {
    qr.onload = drawQrAndShare;
    qr.onerror = finishShare;
  }
}
