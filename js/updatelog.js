function loadUpdateLogView() {
  currentView = "updatelog";
  history.replaceState({}, "", "?view=updatelog");

  const currentRequest = ++requestId;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove(
    "youtube-view",
    "clip-view"
  );

  pageTitle.textContent = "UPDATE LOG";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode";
  app.innerHTML = `<p class="loading">🦊 Loading Update Log...</p>`;

  fetch(CONFIG.API_URL + "?view=updatelog")
    .then(res => res.json())
    .then(data => {
      if (currentRequest !== requestId) return;

      renderUpdateLog_(data.updateLog || []);
    })
    .catch(error => {
      if (currentRequest !== requestId) return;

      console.error(error);
      app.innerHTML =
        `<p class="error">Failed to load Update Log.</p>`;
    });
}

function renderUpdateLog_(logs) {
  if (!logs.length) {
    app.innerHTML =
      `<p class="empty">No update logs found.</p>`;
    return;
  }

  app.innerHTML = `
    <div class="tools-page">
      ${logs.map(log => `
        <div class="card">
          <h3>Version ${escapeHtml(log.version)}</h3>
          <p>${escapeHtml(log.date)}</p>

          ${renderUpdateLogSection_("NEW 新機能", log.new)}
          ${renderUpdateLogSection_("IMPROVED 改善", log.improved)}
          ${renderUpdateLogSection_("FIXED 修正", log.fixed)}
        </div>
      `).join("")}
    </div>
  `;
}

function renderUpdateLogSection_(title, items) {
  if (!items || !items.length) return "";

  return `
    <h4>${title}</h4>
    <ul>
      ${items.map(item => `
        <li>
          ${escapeHtml(item.en || "")}
          ${
            item.jp
              ? `<br><span class="update-log-jp">${escapeHtml(item.jp)}</span>`
              : ""
          }
        </li>
      `).join("")}
    </ul>
  `;
}