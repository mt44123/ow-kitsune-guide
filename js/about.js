const aboutButton =
  document.getElementById("aboutButton");

aboutButton?.addEventListener(
  "click",
  () => {
    settingsMenu.classList.add("settings-hidden");
    loadAboutView();
  }
);

function loadAboutView() {
  currentView = "about";
  history.replaceState({}, "", "?view=about");

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove("youtube-view", "clip-view");

  pageTitle.textContent = "ABOUT";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode";

  app.innerHTML = `
    <div class="tools-page">

      <div class="card">
        <h3>About OW KITSUNE GUIDE</h3>

        ${siteText_(
          `<p>
            OW KITSUNE GUIDE is an unofficial fan-made website that helps
            Overwatch esports fans keep track of professional players' live streams,
            videos, clips, birthdays and social links in one place.
          </p>`,
          `<p>
            OW KITSUNE GUIDE は、Overwatch eスポーツファン向けに、
            プロ選手の配信・動画・クリップ・誕生日・各種リンクを
            まとめて確認できる非公式ファンサイトです。
          </p>`
        )}

        ${siteText_(
          `<p>
            This project was created to make it easier for Overwatch esports fans
            around the world to find and follow their favorite players.
          </p>`,
          `<p>
            世界中のOverwatch eスポーツファンが、お気に入りの選手を
            もっと見つけやすく、応援しやすくなることを目指して制作しています。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Features</h3>

        ${siteText_(
          `<ul>
            <li>Live stream tracker</li>
            <li>YouTube videos</li>
            <li>Twitch / SOOP / CHZZK clips</li>
            <li>Player database</li>
            <li>Birthdays</li>
            <li>Favorites</li>
            <li>Live notifications</li>
          </ul>`,
          `<ul>
            <li>ライブ配信</li>
            <li>YouTube動画</li>
            <li>Twitch / SOOP / CHZZKクリップ</li>
            <li>プレイヤーデータベース</li>
            <li>誕生日</li>
            <li>お気に入り</li>
            <li>ライブ通知</li>
          </ul>`
        )}
      </div>

      <div class="card">
        <h3>Data Sources</h3>

        ${siteText_(
          `<p>
            Player information and public stream data are collected from publicly
            available sources such as Twitch, YouTube, CHZZK, SOOP, Bilibili and Liquipedia.
          </p>`,
          `<p>
            プレイヤー情報や配信情報は Twitch、YouTube、CHZZK、SOOP、
            Bilibili、Liquipedia などの公開情報を利用しています。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Disclaimer</h3>

        ${siteText_(
          `<p>
            OW KITSUNE GUIDE is an unofficial fan project and is not affiliated with
            Blizzard Entertainment, OWCS or any esports organization.
          </p>`,
          `<p>
            OW KITSUNE GUIDE は非公式のファンサイトであり、
            Blizzard Entertainment、OWCS、および各eスポーツチーム・団体とは関係ありません。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Contact</h3>

        ${siteText_(
          `<p>
            For bug reports or player requests, please use the feedback form linked
            at the bottom of the site.
          </p>`,
          `<p>
            不具合報告やプレイヤー追加要望は、サイト下部のフォームから送信してください。
          </p>`
        )}
      </div>

    </div>
  `;
}