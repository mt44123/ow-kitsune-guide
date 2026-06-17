const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

const updated = document.getElementById("updated");
const searchBox = document.getElementById("searchBox");

let currentView = "new";
let currentPlayers = [];

document.querySelectorAll(".nav button").forEach(button => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    searchBox.value = "";

    document.querySelectorAll(".nav button").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");
    loadView(currentView);
  });
});

searchBox.addEventListener("input", () => {
  renderLive(filterPlayers(currentPlayers));
});

function loadView(view) {
  app.innerHTML = "<p style='color:#aaa;'>Loading...</p>";

  fetch(CONFIG.API_URL + "?view=" + view)
    .then(res => res.json())
    .then(data => {
      updated.textContent = data.lastUpdated || "";
      currentPlayers = data.players || [];
      renderLive(currentPlayers);
    })
    .catch(error => {
      app.innerHTML = "<p style='color:#f99e1a;'>Failed to load data.</p>";
      console.error(error);
    });
}

function filterPlayers(players) {
  const keyword = searchBox.value.toLowerCase().trim();
  if (!keyword) return players;

  return players.filter(p => {
    const text = [
      p.name,
      p.team,
      p.role,
      p.nationality,
      p.platform,
      p.title
    ].join(" ").toLowerCase();

    return text.includes(keyword);
  });
}

function renderLive(players) {
  if (!players.length) {
    app.innerHTML = "<p style='color:#aaa;'>No players found.</p>";
    return;
  }

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
