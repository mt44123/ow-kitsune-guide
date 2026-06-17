fetch(CONFIG.API_URL + "?view=new")

const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

fetch(API_URL + "?view=new")
  .then(res => res.json())
  .then(data => {
    renderLive(data.players || []);
  });

function renderLive(players) {
  app.innerHTML = players.map(p => `
    <a class="card-link" href="${p.url}" target="_blank" rel="noopener">
      <div class="card">
        <div class="player-name">${p.name}</div>
        <div class="meta">${p.team || "-"} │ ${p.role || "-"} │ ${p.nationality || "-"}</div>
        <div class="stats">${p.platform}　🕓${p.liveFor}　🔥${p.viewers}</div>
        <div class="title">${p.title || ""}</div>
      </div>
    </a>
  `).join("");
}
