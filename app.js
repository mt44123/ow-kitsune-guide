const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

let currentView = "new";

document.querySelectorAll(".nav button").forEach(button => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;

    document.querySelectorAll(".nav button").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");
    loadView(currentView);
  });
});

function loadView(view) {
  app.innerHTML = "<p style='color:#aaa;'>Loading...</p>";

  fetch(CONFIG.API_URL + "?view=" + view)
    .then(res => res.json())
    .then(data => {
      renderLive(data.players || []);
    })
    .catch(error => {
      app.innerHTML = "<p style='color:#f99e1a;'>Failed to load data.</p>";
      console.error(error);
    });
}

function renderLive(players) {
  app.innerHTML = players.map(p => `
    <a class="card-link" href="${p.url}" target="_blank" rel="noopener">
      <div class="card">
        <div class="player-name">${p.name}</div>
        <div class="meta">${p.team || "-"} │ ${p.role || "-"} │ ${p.nationality || "-"}</div>
        <div class="stats">${p.platform}　🕓${p.liveFor}　🔥${Number(p.viewers || 0).toLocaleString()}</div>
        <div class="title">${p.title || ""}</div>
      </div>
    </a>
  `).join("");
}

loadView(currentView);
