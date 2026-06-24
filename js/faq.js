function loadFaqView() {

  pageTitle.textContent = "FAQ";
  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "";

  app.innerHTML = `
    <div class="faq-list">

      <div class="faq-item">
        <h3>🔔 Live Notifications</h3>
        <p>
          Live notifications are experimental.<br>
          Notifications only work while this site is open.
        </p>
        <p>
          ライブ通知は実験機能です。<br>
          サイトを開いている間のみ動作します。
        </p>
      </div>

      <div class="faq-item">
        <h3>💻 Notifications don't appear on PC</h3>
        <p>
          Check Windows Settings →
          System →
          Notifications →
          Google Chrome.
        </p>
        <p>
          Windows設定 →
          システム →
          通知 →
          Google Chrome を確認してください。
        </p>
      </div>

      <div class="faq-item">
        <h3>📲 Install App</h3>
        <p>
          OW KITSUNE GUIDE can be installed as an app on PC and mobile devices.
        </p>
        <p>
          OW KITSUNE GUIDE はPC・スマホにアプリとしてインストールできます。
        </p>
      </div>

      <div class="faq-item">
        <h3>🕓 Update Frequency</h3>
        <p>
          LIVE: every 5 min<br>
          YOUTUBE: every 30 min<br>
          CLIPS: daily
        </p>
        <p>
          LIVE：5分ごと<br>
          YOUTUBE：30分ごと<br>
          CLIPS：1日ごと
        </p>
      </div>

      <div class="faq-item">
        <h3>⭐ MY GOATS</h3>
        <p>
          Favorites are saved locally in your browser only.
        </p>
        <p>
          お気に入りはブラウザ内にのみ保存されます。
        </p>
      </div>

    </div>
  `;
}