let birthdayCalendarDate = new Date();

function loadBirthdaysView() {
  history.replaceState({}, "", "?view=birthdays");

  resetSeo_();

  const now = Date.now();

  updated.textContent =
  playerLinksLastUpdated;
  
  viewNote.innerHTML = `
  🌐 Dates are shown based on your device's local date.
  `;

  pageTitle.textContent = "BIRTHDAYS";
  setRandomVoiceLine();

  app.className = "birthday-calendar-mode";

  if (
    birthdaysCache &&
    now - birthdaysCacheTime < BIRTHDAYS_CLIENT_CACHE_MS
  ) {
    requestId++;
    stopFakeProgress();

    currentData = birthdaysCache;
    renderBirthdayCalendar(currentData);
    applyCurrentSearch_();
    return;
  }

  const currentRequest = ++requestId;

  startFakeProgress();

  fetch(CONFIG.API_URL + "?view=birthdays")
    .then(r => r.json())
    .then(data => {
      if (currentRequest !== requestId) return;

      finishFakeProgress();

      birthdaysCache = data.birthdays || [];
      birthdaysCacheTime = Date.now();

      currentData = birthdaysCache;
      renderBirthdayCalendar(currentData);
    })
    .catch(err => {
      if (currentRequest !== requestId) return;

      stopFakeProgress();
      console.error(err);

      app.innerHTML = `
        <p class="error">
          Failed to load birthdays.
        </p>
      `;
    });
}

function renderBirthdayCalendar(players) {
  const year = birthdayCalendarDate.getFullYear();
  const month = birthdayCalendarDate.getMonth();

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const todayBirthdays = players.filter(p => {
    if (!p.born) return false;
  
    const [, m, d] = p.born.split("-").map(Number);
  
    return (
      m === today.getMonth() + 1 &&
      d === today.getDate()
    );
  });
  
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
    birthdaysByDay
  );

  const listItems = buildBirthdayList_(
    players,
    month,
    year
  );

  const todaySection =
    buildBirthdayTodaySection_(
      todayBirthdays,
      today,
      year
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

function buildBirthdayTodaySection_(
  todayBirthdays,
  today,
  year
) {
  return `
    <div class="birthday-today">

      <h3>
        🎂 Today's Birthdays
        (${today.getMonth() + 1}/${today.getDate()})
        🎂
      </h3>

      ${
        todayBirthdays.length
          ? todayBirthdays.map(p => `
              <div class="birthday-event ${getNationalityRegionClass(p.nationality)} ${isFavorite_(p.name) ? "favorite-birthday" : ""}">

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

                <a
                  class="birthday-calendar-link"
                  href="${googleBirthdayUrl(p, year)}"
                  target="_blank"
                  rel="noopener"
                >
                  📅 Add
                </a>

              </div>
            `).join("")
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
  birthdaysByDay
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
        <div class="birthday-day-number">
          ${displayDay}
        </div>

        ${events.map(p => `
          <div class="birthday-event ${getNationalityRegionClass(p.nationality)} ${isFavorite_(p.name) ? "favorite-birthday" : ""}">

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
  year
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
      <div class="birthday-list-item ${getNationalityRegionClass(p.nationality)} ${isFavorite_(p.name) ? "favorite-birthday" : ""}">

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

function getCurrentAgeFromBorn(born) {
  if (!born) return "";

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
