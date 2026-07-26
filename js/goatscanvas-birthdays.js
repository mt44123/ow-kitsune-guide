function buildBirthdaysShareText_(players) {
  const names = players.map(p => p.name).join(" / ");
  const visitorTz = getVisitorTimezoneText_();
  const today = new Date();
  const dateLabel = `${today.getMonth() + 1}/${today.getDate()}`;

  const lines = [
    `🎂 Today's Birthdays (${dateLabel})`,
    names
  ];

  if (visitorTz) {
    lines.push(`Your TZ: ${visitorTz}`);
  }

  lines.push(
    "",
    "https://owkitsune.com/?view=birthdays",
    "#OW #OWCS #Overwatch #HappyBirthday #オーバーウォッチ"
  );

  return lines.join("\n");
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
  const visitorTz = getVisitorTimezoneText_();
  const bodyStyle = getComputedStyle(document.body);

  const accent =
    bodyStyle.getPropertyValue("--accent").trim() || "#FE5002";

  const textMain = "#FFFFFF";
  const textSub = "rgba(255,255,255,.82)";
  const textMuted = "rgba(255,255,255,.62)";

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

  const columnWidth = 530;
  const columnGap = 36;

  const cardHeight = 168;
  const cardGap = 24;
  const headerHeight = 320;
  const footerHeight = 190;

  const height =
    headerHeight +
    rows * (cardHeight + cardGap) +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, "#0D1016");
  bg.addColorStop(1, "#090B10");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  drawGlow_(ctx, width / 2, 120, 420, accent, 0.035);
  drawGlow_(ctx, width / 2, height / 2, 700, "#FFFFFF", 0.015);

  ctx.textAlign = "center";

  ctx.save();
  ctx.font = `900 58px ${fontTitle}`;
  ctx.shadowColor = hexToRgba_(accent, 0.9);
  ctx.shadowBlur = 18;
  ctx.fillStyle = textMain;
  ctx.fillText("TODAY'S BIRTHDAYS", width / 2, 118);
  ctx.restore();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const dateText =
    `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,.35)";
  ctx.shadowBlur = 5;
  ctx.fillStyle = textSub;
  ctx.font = `800 27px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, 164);
  ctx.restore();

  ctx.fillStyle = accent;
  ctx.font = `900 26px ${fontBody}`;
  ctx.fillText(
    `${dateText}  ·  ${players.length} PLAYER${players.length === 1 ? "" : "S"}`,
    width / 2,
    210
  );

  ctx.fillStyle = textMuted;
  ctx.font = `600 20px ${fontBody}`;
  ctx.fillText(
    `Your TZ: ${visitorTz || "-"}`,
    width / 2,
    248
  );

  ctx.fillStyle = "rgba(255,255,255,.45)";
  ctx.font = `500 16px ${fontBody}`;
  ctx.fillText(
    "Around 18:00 JST, most OW regions share this date (Hawaii often previous day)",
    width / 2,
    278
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
    const regionLabel = getCanvasRegionLabel_(p.nationality);
    const roleIcon = getCanvasRoleIcon_(p.role);
    const logo = teamLogoCache[getTeamLogoPath_(p.team, false)];
    const tz = getPlayerTimezoneDisplay_(p);
    const ageText = getBirthdayAgeText_(p);

    ctx.save();
    ctx.shadowColor = regionColor;
    ctx.shadowBlur = 28;
    ctx.strokeStyle = hexToRgba_(regionColor, 0.62);
    ctx.lineWidth = 1.8;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.stroke();
    ctx.restore();

    const cardGradient = ctx.createLinearGradient(
      x, y,
      x + columnWidth, y + cardHeight
    );
    cardGradient.addColorStop(0, "rgba(255,255,255,.035)");
    cardGradient.addColorStop(0.35, "rgba(255,255,255,.012)");
    cardGradient.addColorStop(1, "rgba(255,255,255,.006)");

    ctx.fillStyle = cardGradient;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.fill();

    ctx.fillStyle = "rgba(0,0,0,.24)";
    roundRect_(ctx, x + 2, y + 2, columnWidth - 4, cardHeight - 4, 12);
    ctx.fill();

    const regionLight = ctx.createRadialGradient(
      x + columnWidth,
      y + cardHeight / 2,
      0,
      x + columnWidth,
      y + cardHeight / 2,
      210
    );
    regionLight.addColorStop(0, hexToRgba_(regionColor, 0.46));
    regionLight.addColorStop(0.45, hexToRgba_(regionColor, 0.12));
    regionLight.addColorStop(1, hexToRgba_(regionColor, 0));

    ctx.fillStyle = regionLight;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.fill();

    ctx.strokeStyle = hexToRgba_(regionColor, 0.9);
    ctx.lineWidth = 1.4;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.stroke();

    if (logo) {
      ctx.save();

      const maxWidth = 88;
      const maxHeight = 76;
      const scale = Math.min(
        maxWidth / logo.width,
        maxHeight / logo.height
      );
      const w = logo.width * scale;
      const h = logo.height * scale;
      const logoAreaWidth = 100;
      const logoAreaRight = x + columnWidth - 20;
      const logoX =
        logoAreaRight - logoAreaWidth +
        (logoAreaWidth - w) / 2;

      ctx.shadowColor = regionColor;
      ctx.shadowBlur = 5;
      ctx.globalAlpha = 0.95;
      ctx.drawImage(logo, logoX, y + 28, w, h);
      ctx.restore();
    }

    const name = p.name || "";
    const nameFontSize =
      useTwoColumns && name.length > 14 ? 30 : 36;

    ctx.save();
    ctx.shadowColor = hexToRgba_(regionColor, 0.8);
    ctx.shadowBlur = 8;
    ctx.fillStyle = textMain;
    ctx.font = `900 ${nameFontSize}px ${fontTitle}`;
    ctx.fillText(name, x + 28, y + 48, columnWidth - 140);
    ctx.restore();

    const meta = [
      "🎂",
      regionLabel,
      roleIcon,
      p.team && p.team !== "No team" ? p.team : "",
      ageText
    ].filter(Boolean).join("  •  ");

    ctx.fillStyle = textSub;
    ctx.font = `700 16px ${fontBody}`;
    ctx.fillText(meta, x + 28, y + 82, columnWidth - 140);

    ctx.fillStyle = textMuted;
    ctx.font = `600 15px ${fontBody}`;
    ctx.fillText(tz.teamLine, x + 28, y + 112, columnWidth - 140);
    ctx.fillText(tz.natLine, x + 28, y + 138, columnWidth - 140);
  });

  const footerY = height - 130;
  const footerLineX = useTwoColumns ? listLeft : padding;
  const footerLineWidth =
    useTwoColumns
      ? columnWidth * 2 + columnGap
      : width - padding * 2;

  ctx.fillStyle = hexToRgba_(accent, 0.75);
  ctx.fillRect(footerLineX, footerY - 28, footerLineWidth, 2);

  ctx.textAlign = "center";
  ctx.fillStyle = textMuted;
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText(`Generated ${dateText}`, width / 2, footerY + 10);
  ctx.fillText("Celebrate with the GOATs — link below", width / 2, footerY + 42);
  ctx.fillText("https://owkitsune.com/?view=birthdays", width / 2, footerY + 72);

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
          title: "Today's Birthdays",
          text: shareText,
          files: [file]
        }).catch(() => {});
        return;
      }

      showGoatsShareModal_(blob, shareText, {
        title: "Share Today's Birthdays",
        shareTitle: "TODAY'S BIRTHDAYS",
        fileName: "owkg-todays-birthdays.png"
      });
    }, "image/png");
  };

  const qrSize = 58;
  const qrX = width - padding - qrSize;
  const qrY = footerY + 18;

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
