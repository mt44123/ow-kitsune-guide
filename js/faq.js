function loadFaqView() {

  pageTitle.textContent = "FAQ";
  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode";

  app.innerHTML = `
    <div class="tools-page">

      <div class="card">
        <h3>🔔 How do Live Notifications work?<br>
            ライブ通知はどのように動作しますか？</h3>

        <p>
          Live notifications are experimental.<br>
          Notifications only work while this site is open.
        </p>
        <ul>
          <li>MY GOATS: notify only favorite players</li>
          <li>ALL: notify all tracked players</li>
          <li>OFF: disable notifications</li>
        </ul>
        <hr>
        <p>
          ライブ通知は実験機能です。<br>
          サイトを開いている間のみ動作します。
        </p>
        <ul>
          <li>MY GOATS：お気に入り選手のみ通知</li>
          <li>ALL：登録されている全選手を通知</li>
          <li>OFF：通知しない</li>
        </ul>
      </div>

      <div class="card">
        <h3>
          💻📱 Why don't notifications appear?<br>
          通知が表示されないのはなぜですか？
        </h3>

        <p>
          If notifications do not appear, check your browser and operating system notification settings.
        </p>

        <ul>
          <li>Windows: Settings → System → Notifications → Google Chrome</li>
          <li>Android: Settings → Notifications → Chrome</li>
          <li>iPhone / iPad: Settings → Notifications → Safari</li>
          <li>macOS: System Settings → Notifications → Chrome / Safari</li>
        </ul>
        <hr>
        <p>
          通知が表示されない場合は、ブラウザとOSの通知設定を確認してください。
        </p>

        <ul>
          <li>Windows：設定 → システム → 通知 → Google Chrome</li>
          <li>Android：設定 → 通知 → Chrome</li>
          <li>iPhone / iPad：設定 → 通知 → Safari</li>
          <li>macOS：システム設定 → 通知 → Chrome / Safari</li>
        </ul>
      </div>

    <div class="card">
      <h3>
        💻📲 How do I install OW KITSUNE GUIDE as an app?<br>
        OW KITSUNE GUIDEをアプリとしてインストールするには？
      </h3>

      <p>
        Benefits of installing the app:
      </p>

      <ul>
        <li>Faster access from your desktop or home screen</li>
        <li>Opens in a dedicated app window</li>
        <li>Easier notification management</li>
        <li>May display notifications as "OW KITSUNE GUIDE"</li>
      </ul>

      <p>
        Installation steps may differ depending on your device and browser.
      </p>

      <ul>
        <li>Windows Chrome / Edge: Click the install icon near the address bar</li>
        <li>Android Chrome: Menu → Add to Home screen / Install app</li>
        <li>iPhone / iPad Safari: Share → Add to Home Screen</li>
        <li>macOS Chrome / Edge: Click the install icon near the address bar</li>
        <li>macOS Safari: Share → Add to Dock</li>
      </ul>

      <p>
        When installed as an app, notifications may appear as
        "OW KITSUNE GUIDE" instead of your browser name.
      </p>

      <hr>

      <p>
        アプリとしてインストールするメリット：
      </p>

      <ul>
        <li>デスクトップやホーム画面から素早く起動できる</li>
        <li>ブラウザではなく専用アプリのように表示される</li>
        <li>通知を管理しやすい</li>
        <li>通知が「OW KITSUNE GUIDE」として表示される場合がある</li>
      </ul>

      <p>
        インストール方法は端末やブラウザによって異なります。
      </p>

      <ul>
        <li>Windows Chrome / Edge：アドレスバー付近のインストールアイコンをクリック</li>
        <li>Android Chrome：メニュー → ホーム画面に追加 / アプリをインストール</li>
        <li>iPhone / iPad Safari：共有 → ホーム画面に追加</li>
        <li>macOS Chrome / Edge：アドレスバー付近のインストールアイコンをクリック</li>
        <li>macOS Safari：共有 → Dockに追加</li>
      </ul>

      <p>
        アプリとしてインストールした場合、
        通知はブラウザ名ではなく
        「OW KITSUNE GUIDE」として表示される場合があります。
      </p>
    </div>

      <div class="card">
        <h3>
          🕓 How often is the site updated?<br>
          サイトはどれくらいの頻度で更新されますか？
        </h3>

        <p>
          Update frequency:
        </p>

        <ul>
          <li>LIVE: every 5 min</li>
          <li>YOUTUBE: every 30 min</li>
          <li>CLIPS: daily</li>
          <li>PLAYER LINKS: manual update</li>
        </ul>
        <hr>
        <p>
          更新頻度：
        </p>

        <ul>
          <li>LIVE：5分ごと</li>
          <li>YOUTUBE：30分ごと</li>
          <li>CLIPS：1日ごと</li>
          <li>PLAYER LINKS：手動更新</li>
        </ul>
      </div>

      <div class="card">
        <h3>
          ⭐ What is MY GOATS?<br>
          MY GOATSとは何ですか？
        </h3>

        <p>
          MY GOATS lets you save your favorite players for quick access.
        </p>

        <ul>
          <li>Favorite players are marked with ★</li>
          <li>Shows favorite LIVE streams, videos and clips</li>
          <li>Used for Live Notifications</li>
          <li>Stored locally in your browser only</li>
        </ul>

        <hr>

        <p>
          MY GOATSではお気に入り選手を保存できます。
        </p>

        <ul>
          <li>★でお気に入り登録</li>
          <li>お気に入り選手のLIVE・動画・クリップを表示</li>
          <li>ライブ通知でも利用</li>
          <li>ブラウザ内にのみ保存されます</li>
        </ul>
      </div>

      <div class="card">
        <h3>
          🦊 Where does the data come from?<br>
          データはどこから取得していますか？
        </h3>

        <p>
          OW KITSUNE GUIDE collects publicly available information from multiple sources.
        </p>

        <p>
          Stream, video and player information may be delayed or occasionally inaccurate.
        </p>

        <ul>
          <li>Twitch</li>
          <li>CHZZK</li>
          <li>SOOP</li>
          <li>Bilibili</li>
          <li>YouTube</li>
          <li>Liquipedia</li>
        </ul>
        <hr>
        <p>
          OW KITSUNE GUIDE は複数の公開情報ソースからデータを収集しています。
        </p>
        
        <p>
          配信・動画・選手情報には遅延や誤差が含まれる場合があります。
        </p>

        <ul>
          <li>Twitch</li>
          <li>CHZZK</li>
          <li>SOOP</li>
          <li>Bilibili</li>
          <li>YouTube</li>
          <li>Liquipedia</li>
        </ul>
      </div>

    </div>
  `;
}