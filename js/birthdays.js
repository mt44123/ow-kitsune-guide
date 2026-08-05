let birthdayCalendarDate = new Date();

function formatUtcOffsetLabel_(hours) {
  if (!Number.isFinite(hours)) return "";

  const sign = hours >= 0 ? "+" : "-";
  const abs = Math.abs(hours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);

  if (m) {
    return `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
  }

  return `UTC${sign}${h}`;
}

function formatUtcRangeLabel_(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return "";
  if (min === max) return formatUtcOffsetLabel_(min);
  return `${formatUtcOffsetLabel_(min)}〜${formatUtcOffsetLabel_(max)}`;
}

function getVisitorTimezoneInfo_() {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const offsetHours = offsetMinutes / 60;
  let iana = "";

  try {
    iana = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {}

  // Etc/GMT±n uses inverted signs and is confusing next to UTC labels.
  if (/^Etc\/GMT/i.test(iana)) {
    iana = "";
  }

  return {
    offsetHours,
    utcLabel: formatUtcOffsetLabel_(offsetHours),
    iana
  };
}

function getVisitorTimezoneText_() {
  const info = getVisitorTimezoneInfo_();
  if (!info.utcLabel) return "";
  return info.iana
    ? `${info.utcLabel} (${info.iana})`
    : info.utcLabel;
}

function getNationalityTimezoneInfo_(nationality) {
  const nat = String(nationality || "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  if (!nat) return null;

  const exact = {
    japan: [9, 9],
    jp: [9, 9],
    "south korea": [9, 9],
    korea: [9, 9],
    kr: [9, 9],
    china: [8, 8],
    cn: [8, 8],
    taiwan: [8, 8],
    "hong kong": [8, 8],
    singapore: [8, 8],
    "united states": [-10, -4],
    usa: [-10, -4],
    us: [-10, -4],
    en: [-10, -4],
    canada: [-8, -3.5],
    mexico: [-8, -5],
    brazil: [-5, -2],
    argentina: [-3, -3],
    chile: [-4, -3],
    colombia: [-5, -5],
    peru: [-5, -5],
    australia: [8, 11],
    "new zealand": [12, 13],
    "united kingdom": [0, 1],
    uk: [0, 1],
    england: [0, 1],
    france: [1, 2],
    germany: [1, 2],
    sweden: [1, 2],
    finland: [2, 3],
    denmark: [1, 2],
    norway: [1, 2],
    netherlands: [1, 2],
    spain: [1, 2],
    italy: [1, 2],
    poland: [1, 2],
    turkey: [3, 3],
    russia: [2, 12],
    india: [5.5, 5.5],
    thailand: [7, 7],
    vietnam: [7, 7],
    philippines: [8, 8],
    indonesia: [7, 9],
    "saudi arabia": [3, 3],
    uae: [4, 4],
    "united arab emirates": [4, 4],
    egypt: [2, 3],
    "south africa": [2, 2]
  };

  if (exact[nat]) {
    return { min: exact[nat][0], max: exact[nat][1] };
  }

  const matched = Object.keys(exact).find(key => nat.includes(key));
  if (matched) {
    return { min: exact[matched][0], max: exact[matched][1] };
  }

  const region = getNationalityRegionClass(nationality);
  const regionRanges = {
    "region-jp": [9, 9],
    "region-kr": [9, 9],
    "region-cn": [8, 8],
    "region-na": [-10, -4],
    "region-emea": [0, 4],
    "region-pac": [8, 13],
    "region-sa": [-5, -3]
  };

  const range = regionRanges[region];
  if (!range) return null;

  return { min: range[0], max: range[1] };
}

function getPlayerTimezoneDisplay_(p, options = {}) {
  const natInfo = getNationalityTimezoneInfo_(p.nationality);
  const natName = shortNationality(p.nationality || "") || "-";

  const natLine = natInfo
    ? `Nationality ${natName}: ${formatUtcRangeLabel_(natInfo.min, natInfo.max)}`
    : `Nationality ${natName}: -`;

  return { natLine };
}

function getTodayBirthdays_(players, today = new Date()) {
  return (players || []).filter(p => {
    if (!p.born) return false;
    if (isMutedPlayer_(p.name)) return false;

    const [, m, d] = p.born.split("-").map(Number);

    return (
      m === today.getMonth() + 1 &&
      d === today.getDate()
    );
  });
}

function loadBirthdaysView() {
  setViewUrl_("birthdays");

  resetSeo_();

  updated.textContent =
  playerLinksLastUpdated;

  const visitorTz = getVisitorTimezoneText_();

  viewNote.innerHTML = `
    <div class="discord-note">
      ${siteNote_(
        `<p>*Dates use your device's local date. Your TZ: ${escapeHtml(visitorTz || "-")}</p>`,
        `<p>※日付はお使いの端末のローカル日付で表示されます。あなたのタイムゾーン: ${escapeHtml(visitorTz || "-")}</p>`
      )}

      <details class="playerlinks-help">
        <summary>More Info</summary>

        ${siteNote_(
          `
            <p>*Around 18:00 JST, most OW regions share the same date (except Hawaii).</p>
            <p>*To share only specific players, temporarily mute the others, then refresh. Unmute them later from ◆ MUTED.</p>
            <p>*Click a day number on the calendar to share that date.</p>
          `,
          `
            <p>※JST 18:00頃は、OW主要地域のほとんどで同じ日付になります（ハワイ等を除く）。</p>
            <p>※特定のプレイヤーのみシェアしたい場合は、一時的に他の人をミュートして、更新してください。ミュートを外したい場合は ◆ ではずしてください。</p>
            <p>※カレンダーの日付数字をクリックすると、その日をシェアできます。</p>
          `
        )}
      </details>
    </div>
  `;

  pageTitle.textContent = "BIRTHDAYS";
  setRandomVoiceLine();

  app.className = "birthday-calendar-mode";

  const paint_ = () => {
    updated.textContent = playerLinksLastUpdated;
    currentData = birthdaysCache;
    renderBirthdayCalendar(currentData);
    applyCurrentSearch_();
  };

  hydrateBirthdaysFromDisk_();

  if (isBirthdaysCacheFresh_()) {
    requestId++;
    stopFakeProgress();
    paint_();
    return;
  }

  if (birthdaysCache) {
    requestId++;
    stopFakeProgress();
    paint_();

    refreshBirthdaysInBackground_().then(() => {
      if (currentView !== "birthdays") return;
      paint_();
    });
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetchConfigApi_("birthdays")
    .then(data => {
      if (currentRequest !== requestId) return;

      finishFakeProgress();

      setBirthdaysCache_(data.birthdays || [], data.lastUpdated || "");
      paint_();
    })
    .catch(err => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      console.error(err);

      if (birthdaysCache) {
        paint_();
        return;
      }

      app.innerHTML = `
        <p class="error">
          Failed to load birthdays.
        </p>
      `;
    });
}

function renderBirthdayCalendar(players) {
  players = (players || []).filter(p => !isMutedPlayer_(p.name));

  const year = birthdayCalendarDate.getFullYear();
  const month = birthdayCalendarDate.getMonth();
  const favSet = new Set(getFavorites_());

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const todayBirthdays = getTodayBirthdays_(players, today);

  const nextBirthdays =
  getNextBirthdays_(players, today);
  
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();
 
  const birthdaysByDay = {};

  players.forEach(p => {
    if (!p.born) return;

    const [, bornMonth, bornDay] = p.born.split("-").map(Number);
    if (bornMonth !== month + 1) return;

    if (!birthdaysByDay[bornDay]) birthdaysByDay[bornDay] = [];
    birthdaysByDay[bornDay].push(p);
  });

  const cells = buildBirthdayCells_(
    year,
    month,
    todayY,
    todayM,
    todayD,
    startDay,
    lastDate,
    prevLastDate,
    birthdaysByDay,
    favSet
  );

  const listItems = buildBirthdayList_(
    players,
    month,
    year,
    favSet
  );

  const todaySection =
    buildBirthdayTodaySection_(
      todayBirthdays,
      today,
      year,
      nextBirthdays,
      favSet
    );

  app.innerHTML = `
    ${todaySection}
  
    <div class="birthday-calendar">
        <div class="birthday-calendar-header">
          <button id="birthdayPrev">‹</button>
  
          <div>
            <div class="birthday-year">${year}</div>
            <div class="birthday-month">${month + 1}</div>
          </div>
  
          <button id="birthdayNext">›</button>
        </div>
  
        <div class="birthday-weekdays">
          <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
        </div>
  
        <div class="birthday-grid">
          ${cells}
        </div>
  
        <div class="birthday-list">
          ${listItems || `<p class="empty">No birthdays this month.</p>`}
        </div>
      </div>
    `;

  document.getElementById("birthdayPrev").onclick = () => {
    birthdayCalendarDate = new Date(year, month - 1, 1);
    renderBirthdayCalendar(players);
  };

  document.getElementById("birthdayNext").onclick = () => {
    birthdayCalendarDate = new Date(year, month + 1, 1);
    renderBirthdayCalendar(players);
  };
}

function getNextBirthdays_(players, today) {
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  const list = players
    .filter(p => p.born)
    .map(p => {
      const [, month, day] =
        p.born.split("-").map(Number);

      let nextDate =
        new Date(today.getFullYear(), month - 1, day);

      if (
        month < todayMonth ||
        (month === todayMonth && day <= todayDay)
      ) {
        nextDate =
          new Date(today.getFullYear() + 1, month - 1, day);
      }

      return {
        ...p,
        nextDate,
        month,
        day
      };
    })
    .sort((a, b) => a.nextDate - b.nextDate);

  const firstDate = list[0]?.nextDate;
  if (!firstDate) return [];

  return list.filter(p =>
    p.nextDate.getTime() === firstDate.getTime()
  );
}

function buildBirthdayTodaySection_(
  todayBirthdays,
  today,
  year,
  nextBirthdays = [],
  favSet = new Set()
) {
  return `
    <div class="birthday-today">

      <div class="birthday-today-header">
        <h3>
          🎂 Today's Birthdays
          (${today.getMonth() + 1}/${today.getDate()})
          🎂
        </h3>

        ${
          todayBirthdays.length
            ? `
              <button
                type="button"
                class="goats-export-button birthday-share-button"
                data-birthday-share
              >
                ★Share
              </button>
            `
            : ""
        }
      </div>

      ${
        todayBirthdays.length
          ? todayBirthdays.map(p => {
              const tz = getPlayerTimezoneDisplay_(p);

              return `
              <div class="birthday-event ${getNationalityRegionClass(p.nationality)} ${favSet.has(p.name) ? "favorite-birthday" : ""}">

                <strong>
                  <a
                    class="birthday-player-link player-name-link"
                    href="#"
                    data-player="${escapeHtml(p.name)}"
                    onclick="return false;"
                  >
                    🎂 ${escapeHtml(p.name)}
                  </a>
                </strong>

                <span>
                  ${escapeHtml(p.team || "-")} /
                  ${escapeHtml(p.role || "-")}
                </span>

                <span>
                  ${getBirthdayAgeText_(p)}
                </span>

                <span class="birthday-tz-line">
                  ${escapeHtml(tz.natLine)}
                </span>

                <a
                  class="birthday-calendar-link"
                  href="${googleBirthdayUrl(p, year)}"
                  target="_blank"
                  rel="noopener"
                >
                  📅 Add
                </a>

              </div>
            `;
            }).join("")
          : `
              <div class="birthday-today-empty">
                <div> No birthdays today.</div>
                <div class="birthday-today-request">
                  Missing a birthday? You can submit player updates using the request form at the bottom of this page🦊<br>
                  誕生日情報をご存じの場合は、このページ最下部のリクエストフォームからお知らせください🦊
                </div>
              </div>
            `
      }

      ${
        nextBirthdays.length
          ? `
            <div class="birthday-next">
              <div class="birthday-next-title">
                Next Birthday
              </div>

              ${nextBirthdays.map(p => `
                <div class="birthday-next-item">
                  ${p.month}/${p.day}
                  ·
                  <a
                    class="birthday-player-link player-name-link"
                    href="#"
                    data-player="${escapeHtml(p.name)}"
                    onclick="return false;"
                  >
                    ${escapeHtml(p.name)}
                  </a>
                  <span>
                    ${escapeHtml(p.team || "-")} /
                    ${escapeHtml(p.role || "-")}
                  </span>
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

    </div>
  `;
}

function buildBirthdayCells_(
  year,
  month,
  todayY,
  todayM,
  todayD,
  startDay,
  lastDate,
  prevLastDate,
  birthdaysByDay,
  favSet = new Set()
) {
  let cells = "";

  for (let i = 0; i < 42; i++) {
    const dayNum = i - startDay + 1;

    let displayDay = dayNum;
    let isOtherMonth = false;

    if (dayNum <= 0) {
      displayDay = prevLastDate + dayNum;
      isOtherMonth = true;

    } else if (dayNum > lastDate) {
      displayDay = dayNum - lastDate;
      isOtherMonth = true;
    }

    const isToday =
      !isOtherMonth &&
      year === todayY &&
      month === todayM &&
      displayDay === todayD;

    const events =
      !isOtherMonth &&
      birthdaysByDay[displayDay]
        ? birthdaysByDay[displayDay]
        : [];

    cells += `
      <div class="birthday-day ${isOtherMonth ? "other-month" : ""} ${isToday ? "today" : ""}">
        <div
          class="birthday-day-number${
            !isOtherMonth && events.length
              ? " birthday-day-share"
              : ""
          }"
          ${
            !isOtherMonth && events.length
              ? `data-birthday-share-date="${year}-${month + 1}-${displayDay}" title="Share this day"`
              : ""
          }
        >
          ${displayDay}
        </div>

        ${events.map(p => `
          <div class="birthday-event ${getNationalityRegionClass(p.nationality)} ${favSet.has(p.name) ? "favorite-birthday" : ""}">
            <strong>
              🎂 <a
                class="birthday-player-link player-name-link"
                href="#"
                data-player="${escapeHtml(p.name)}"
                onclick="return false;"
              >
                ${escapeHtml(p.name)}
              </a>
            </strong>

            <span>
              ${escapeHtml(p.team || "-")} /
              ${escapeHtml(p.role || "-")}
            </span>

            <span>
              ${getBirthdayAgeText_(p, year)}
            </span>

            <a
              class="birthday-calendar-link"
              href="${googleBirthdayUrl(p, year)}"
              target="_blank"
              rel="noopener"
            >
              📅 Add
            </a>

          </div>
        `).join("")}

      </div>
    `;
  }

  return cells;
}

function buildBirthdayList_(
  players,
  month,
  year,
  favSet = new Set()
) {
  return players
    .filter(p => p.born)
    .map(p => {
      const [, m, d] =
        p.born.split("-").map(Number);

      return {
        ...p,
        month: m,
        day: d
      };
    })
    .filter(p => p.month === month + 1)
    .sort((a, b) => a.day - b.day)
    .map(p => `
      <div class="birthday-list-item ${getNationalityRegionClass(p.nationality)} ${favSet.has(p.name) ? "favorite-birthday" : ""}">
        <div class="birthday-list-date">
          ${month + 1}/${p.day}
        </div>

        <div>
          <strong>
            🎂<a
                class="birthday-player-link player-name-link"
                href="#"
                data-player="${escapeHtml(p.name)}"
                onclick="return false;"
              >
              ${escapeHtml(p.name)}
            </a>
          </strong>

          <div>
            ${escapeHtml(p.team || "-")} /
            ${escapeHtml(p.role || "-")} /
            ${escapeHtml(p.nationality || "-")}
          </div>

          <div>
            ${getBirthdayAgeText_(p, year)}
          </div>
        </div>

        <a
          href="${googleBirthdayUrl(p, year)}"
          target="_blank"
          rel="noopener"
        >
          📅 Add
        </a>

      </div>
    `)
    .join("");
}

function googleBirthdayUrl(p, year) {
  const [, month, day] = p.born.split("-").map(Number);

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  const start = `${year}${mm}${dd}`;
  const endDate = new Date(year, month - 1, day + 1);
  const end =
    `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, "0")}${String(endDate.getDate()).padStart(2, "0")}`;

  const title = encodeURIComponent(`🎂 ${p.name} Birthday`);
  const details = encodeURIComponent(
    `${p.name} / ${p.team || "-"} / ${p.role || "-"} / ${p.nationality || "-"}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
}

function isUnknownBirthYear_(born) {
  if (!born) return false;

  const birthYear = Number(String(born).split("-")[0]);

  return birthYear === 1900;
}

function getCurrentAgeFromBorn(born) {
  if (!born || isUnknownBirthYear_(born)) return "";

  const [birthYear, birthMonth, birthDay] =
    String(born).split("-").map(Number);

  if (!birthYear || !birthMonth || !birthDay) return "";

  const today = new Date();

  let age = today.getFullYear() - birthYear;

  const birthdayThisYear =
    new Date(today.getFullYear(), birthMonth - 1, birthDay);

  if (today < birthdayThisYear) {
    age--;
  }

  return age;
}

function getAgeOnBirthdayThisYear(born, year) {
  if (!born) return "";

  const birthYear = Number(String(born).split("-")[0]);

  if (!birthYear) return "";

  return year - birthYear;
}

function getTurnsAgeToday(born) {
  if (!born) return "";

  const birthYear = Number(
    String(born).split("-")[0]
  );

  if (!birthYear) return "";

  return new Date().getFullYear() - birthYear;
}

function getBirthdayAgeText_(p, year = null) {
  if (!p.born) return "";

  if (String(p.role || "").toLowerCase() === "hero") {
    return p.age ? `Age ${p.age}` : "";
  }

  if (isUnknownBirthYear_(p.born)) {
    return "-";
  }

  if (year) {
    return `Turns ${getAgeOnBirthdayThisYear(p.born, year)}`;
  }

  return `Turns ${getTurnsAgeToday(p.born)}`;
}

function jumpBirthdaySearch_() {
  const query = searchBox.value;
  if (!query.trim()) return;

  const hit = currentData.find(p => {
    const haystack = [
      p.name,
      p.playerAlias,
      p.team,
      p.teamAlias,
      p.role,
      p.nationality
    ].join(" ");

    return matchesSearch_(haystack, query);
  });

  if (!hit || !hit.born) return;

  const [, month] = hit.born.split("-").map(Number);

  if (!month) return;

  birthdayCalendarDate =
    new Date(birthdayCalendarDate.getFullYear(), month - 1, 1);

  renderBirthdayCalendar(currentData);
}

document.addEventListener("click", e => {
  const dayShare = e.target.closest("[data-birthday-share-date]");
  if (dayShare) {
    e.preventDefault();
    e.stopPropagation();

    const parts = String(dayShare.dataset.birthdayShareDate || "")
      .split("-")
      .map(Number);
    const [year, month, day] = parts;

    if (
      typeof shareBirthdaysImageForDate_ === "function" &&
      year &&
      month &&
      day
    ) {
      shareBirthdaysImageForDate_(year, month, day);
    }

    return;
  }

  const shareBtn = e.target.closest("[data-birthday-share]");
  if (!shareBtn) return;

  e.preventDefault();
  e.stopPropagation();

  if (typeof shareBirthdaysImage_ === "function") {
    shareBirthdaysImage_();
  }
});
