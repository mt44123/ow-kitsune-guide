async function shareGoatsImageHype_() {
  const favNames = getFavorites_();
  if (!favNames.length) return;

  const players = favNames.map(name => {
    const player = (currentData || []).find(p => p.name === name);
    return player || { name };
  });

  players.sort((a, b) =>
    (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" })
  );

  await preloadTeamLogos_(players, false);

  const shareText = buildGoatsShareText_(players);
  const bodyStyle = getComputedStyle(document.body);

  const accent =
    bodyStyle.getPropertyValue("--accent").trim() || "#FE5002";

  const bgPanel = "#111C31";
  const textMain = "#FFFFFF";
  const textSub = "rgba(255,255,255,.82)";
  const textMuted = "rgba(255,255,255,.62)";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const qr = new Image();
  qr.src = "./icons/qr.png";

  const width = 1200;
  const padding = 56;
  const fontTitle = "'Jura', sans-serif";
  const fontBody = "Arial, sans-serif";

  const useTwoColumns = players.length >= 4;
  const rows = Math.ceil(players.length / (useTwoColumns ? 2 : 1));

  const columnWidth = 530;
  const columnGap = 36;

  const cardHeight = 128;
  const cardGap = 24;
  const headerHeight = 290;
  const footerHeight = 170;

  const height =
    headerHeight +
    rows * (cardHeight + cardGap) +
    footerHeight;

  canvas.width = width;
  canvas.height = height;

  // Background
  const bg = ctx.createLinearGradient(
    0, 0,
    0, height
  );

  bg.addColorStop(0, "#0D1016");
  bg.addColorStop(1, "#090B10");

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // subtle background depth
  drawGlow_(ctx, width / 2, 120, 420, accent, 0.035);
  drawGlow_(ctx, width / 2, height / 2, 700, "#FFFFFF", 0.015);

  // Header
  ctx.textAlign = "center";

  ctx.save();
  ctx.font = `900 66px ${fontTitle}`;

  const myText = "MY ";
  const goatsText = "GOATS";
  const totalWidth =
    ctx.measureText(myText).width + ctx.measureText(goatsText).width;

  let titleX = width / 2 - totalWidth / 2;

  ctx.shadowColor = "rgba(255,255,255,.45)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = textMain;
  ctx.fillText(myText, titleX + ctx.measureText(myText).width / 2, 130);

  titleX += ctx.measureText(myText).width;

  ctx.shadowColor = hexToRgba_(accent, 0.9);
  ctx.shadowBlur = 18;
  const goatsGradient = ctx.createLinearGradient(
    titleX,
    0,
    titleX + ctx.measureText(goatsText).width,
    0
  );

  goatsGradient.addColorStop(0, "#FFFFFF");
  goatsGradient.addColorStop(.25, "#F4F4F4");
  goatsGradient.addColorStop(.65, accent);
  goatsGradient.addColorStop(1, accent);

  ctx.fillStyle = goatsGradient;
  ctx.fillText(goatsText, titleX + ctx.measureText(goatsText).width / 2, 130);

  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,.35)";
  ctx.shadowBlur = 5;
  ctx.fillStyle = textSub;
  ctx.font = `800 27px ${fontBody}`;
  ctx.fillText("OW KITSUNE GUIDE 🦊", width / 2, 174);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = hexToRgba_(accent, 0.8);
  ctx.lineWidth = 2;

  ctx.fillStyle = accent;
  ctx.font = `900 28px ${fontBody}`;
  ctx.fillText(
    `${players.length} PLAYER${players.length === 1 ? "" : "S"}`,
    width / 2,
    219
  );
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

    const regionColor = getCanvasRegionColor_(p.nationality);
    const regionLabel = getCanvasRegionLabel_(p.nationality);
    const roleIcon = getCanvasRoleIcon_(p.role);
    const logo = teamLogoCache[getTeamLogoPath_(p.team, false)];

    // outer glow
    ctx.save();
    ctx.shadowColor = regionColor;
    ctx.shadowBlur = 28;
    ctx.strokeStyle = hexToRgba_(regionColor, 0.62);
    ctx.lineWidth = 1.8;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.stroke();
    ctx.restore();

    // card base
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

    // inner dark smoke
    ctx.fillStyle = "rgba(0,0,0,.24)";
    roundRect_(
      ctx,
      x + 2,
      y + 2,
      columnWidth - 4,
      cardHeight - 4,
      12
    );
    ctx.fill();

    const centerShadow = ctx.createRadialGradient(
      x + columnWidth * 0.45,
      y + cardHeight * 0.5,
      20,
      x + columnWidth * 0.45,
      y + cardHeight * 0.5,
      220
    );

    centerShadow.addColorStop(0, "rgba(0,0,0,.22)");
    centerShadow.addColorStop(0.65, "rgba(0,0,0,.10)");
    centerShadow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = centerShadow;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.fill();

    // region light wash
    const regionLight = ctx.createRadialGradient(
      x + columnWidth * 0.92,
      y + cardHeight / 2,
      0,
      x + columnWidth * 0.92,
      y + cardHeight / 2,
      240
    );
    regionLight.addColorStop(
      0,
      hexToRgba_(regionColor, 0.42)
    );

    regionLight.addColorStop(
      0.35,
      hexToRgba_(regionColor, 0.12)
    );

    regionLight.addColorStop(
      1,
      hexToRgba_(regionColor, 0)
    );

    ctx.fillStyle = regionLight;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.fill();

    // sharp border
    ctx.strokeStyle = hexToRgba_(regionColor, 0.9);
    ctx.lineWidth = 1.4;
    roundRect_(ctx, x, y, columnWidth, cardHeight, 14);
    ctx.stroke();

    // logo
    if (logo) {
      ctx.save();

      const maxWidth = 96;
      const maxHeight = 84;

      const scale = Math.min(
        maxWidth / logo.width,
        maxHeight / logo.height
      );

      const w = logo.width * scale;
      const h = logo.height * scale;

      const logoAreaWidth = 108;
      const logoAreaRight = x + columnWidth - 22;

      const logoX =
        logoAreaRight - logoAreaWidth +
        (logoAreaWidth - w) / 2;

      ctx.shadowColor = regionColor;
      ctx.shadowBlur=5;
      ctx.globalAlpha = 0.95;

      ctx.drawImage(
        logo,
        logoX,
        y + (cardHeight - h) / 2,
        w,
        h
      );

      ctx.restore();
    }

    // text
    const name = p.name || "";
    const nameFontSize =
      useTwoColumns && name.length > 14 ? 32 : 40;

    ctx.save();
    ctx.shadowColor = hexToRgba_(regionColor, 0.8);
    ctx.shadowBlur = 8;
    ctx.fillStyle = textMain;
    ctx.font = `900 ${nameFontSize}px ${fontTitle}`;
    ctx.fillText(name, x + 34, y + 54, columnWidth - 150);
    ctx.restore();

    const meta = [
      regionLabel,
      roleIcon,
      p.team && p.team !== "No team" ? p.team : ""
    ].filter(Boolean).join("  •  ");

    ctx.fillStyle = textSub;
    ctx.font = `700 18px ${fontBody}`;
    ctx.fillText(meta, x + 34, y + 92, columnWidth - 150);
  });

  // Footer
  const footerY = height - 118;

  const footerLineX = useTwoColumns ? listLeft : padding;
  const footerLineWidth =
    useTwoColumns
      ? columnWidth * 2 + columnGap
      : width - padding * 2;

  ctx.fillStyle = hexToRgba_(accent, 0.75);
  ctx.fillRect(footerLineX, footerY - 28, footerLineWidth, 2);

  ctx.textAlign = "center";

  ctx.fillStyle = textSub;
  ctx.font = `800 28px ${fontBody}`;
  ctx.fillText("Where Are the GOATs?", width / 2, footerY + 10);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const now = new Date();
  const dateText =
    `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  ctx.fillStyle = textMuted;
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText(`Generated ${dateText}`, width / 2, footerY + 42);

  ctx.fillText("ow-kitsune-guide.pages.dev", width / 2, footerY + 72);

  ctx.textAlign = "left";

  const finishShare = () => {
    canvas.toBlob(blob => {
      if (!blob) return;

      const file = new File(
        [blob],
        "ow-kitsune-my-goats-hype.png",
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

      showGoatsShareModal_(blob, shareText, {
        title: "Share Your GOATs - HYPE",
        shareTitle: "MY GOATS",
        fileName: "ow-kitsune-my-goats-hype.png"
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