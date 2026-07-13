function loadFaqView() {
  currentView = "faq";
  history.replaceState({}, "", "?view=faq");

  resetSeo_();

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove(
    "youtube-view",
    "clip-view",
    "player-detail-view"
  );

  pageTitle.textContent = "FAQ";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode faq-mode";

  app.innerHTML = `
    <div class="tools-page">

    <div class="card faq-card">
      <h3>
        ➕ Can't find a player?<br>
        掲載されていない選手がいますか？
      </h3>

      ${siteText_(
        `
          <p>
            If a player is missing, feel free to submit a Player Request.
          </p>

          <p>
            Players are generally added if they meet one of the following criteria:
          </p>

          <ul>
            <li>Previously listed on Liquipedia (including player pages, tournament pages or team rosters)</li>
            <li>Champion-ranked players who regularly stream or upload videos</li>
          </ul>

          <p>
            We review every request, but not all players may be added.
          </p>

          <p>
            <a
              href="YOUR_GOOGLE_FORM_URL"
              target="_blank"
              rel="noopener"
            >
              Player Request Form
            </a>
          </p>
        `,
        `
          <p>
            掲載されていない選手がいる場合は、
            Player Requestフォームからお気軽にご連絡ください。
          </p>

          <p>
            主な掲載対象は以下のいずれかです。
          </p>

          <ul>
            <li>Liquipedia掲載経験者（個人ページ・大会ページ・ロスター掲載を含む）</li>
            <li>継続的に配信・動画投稿を行っているChampion到達者</li>
          </ul>

          <p>
            すべてのご要望を確認していますが、
            基準などにより掲載できない場合があります。
          </p>

          <p>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeDkW65qI07FFzP3oczawUR3AIp-9tOAfRmSEpavrLipZHS1w/viewform"
              target="_blank"
              rel="noopener"
            >
              Player Requestフォーム
            </a>
          </p>
        `
      )}
    </div>

      <div class="card faq-card">
        <h3>
          🔔 How do Live Notifications work?<br>
          ライブ通知はどのように動作しますか？
        </h3>

        ${siteText_(
          `
            <p>
              Live notifications are experimental.<br>
              Notifications only work while this site is open.
            </p>
            <ul>
              <li>MY GOATS: notify only favorite players</li>
              <li>ALL: notify all tracked players</li>
              <li>OFF: disable notifications</li>
            </ul>
          `,
          `
            <p>
              ライブ通知は実験機能です。<br>
              サイトを開いている間のみ動作します。
            </p>
            <ul>
              <li>MY GOATS：お気に入り選手のみ通知</li>
              <li>ALL：登録されている全選手を通知</li>
              <li>OFF：通知しない</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          💻📱 Why don't notifications appear?<br>
          通知が表示されないのはなぜですか？
        </h3>

        ${siteText_(
          `
            <p>
              If notifications do not appear, check your browser and operating system notification settings.
            </p>
            <ul>
              <li>Windows: Settings → System → Notifications → Google Chrome</li>
              <li>Android: Settings → Notifications → Chrome</li>
              <li>iPhone / iPad: Settings → Notifications → Safari</li>
              <li>macOS: System Settings → Notifications → Chrome / Safari</li>
            </ul>
          `,
          `
            <p>
              通知が表示されない場合は、ブラウザとOSの通知設定を確認してください。
            </p>
            <ul>
              <li>Windows：設定 → システム → 通知 → Google Chrome</li>
              <li>Android：設定 → 通知 → Chrome</li>
              <li>iPhone / iPad：設定 → 通知 → Safari</li>
              <li>macOS：システム設定 → 通知 → Chrome / Safari</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          💻📲 How do I install OW KITSUNE GUIDE as an app?<br>
          OW KITSUNE GUIDEをアプリとしてインストールするには？
        </h3>

        ${siteText_(
          `
            <p>Benefits of installing the app:</p>
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
          `,
          `
            <p>アプリとしてインストールするメリット：</p>
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
              アプリとしてインストールした場合、通知はブラウザ名ではなく
              「OW KITSUNE GUIDE」として表示される場合があります。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🕓 How often is the site updated?<br>
          サイトはどれくらいの頻度で更新されますか？
        </h3>

        ${siteText_(
          `
            <p>Update frequency:</p>
            <ul>
              <li>LIVE: every 5 min</li>
              <li>YOUTUBE: every 30 min</li>
              <li>CLIPS: daily</li>
              <li>BIRTHDAYS: manual update</li>
              <li>PLAYER LINKS: manual update</li>
            </ul>
          `,
          `
            <p>更新頻度：</p>
            <ul>
              <li>LIVE：5分ごと</li>
              <li>YOUTUBE：30分ごと</li>
              <li>CLIPS：1日ごと</li>
              <li>BIRTHDAYS：手動更新</li>
              <li>PLAYER LINKS：手動更新</li>
            </ul>
          `
        )}
      </div>

            <div class="card faq-card">
        <h3>
          🛠️ Why does the site look broken or not update?<br>
          サイトの表示がおかしい・更新されないのはなぜですか？
        </h3>

        ${siteText_(
          `
            <p>
              If the site does not load correctly or seems outdated, try the following.
            </p>
            <ul>
              <li>Refresh the page</li>
              <li>On PC, try Ctrl + F5 if possible</li>
              <li>Clear your browser cache</li>
              <li>Close and reopen the browser</li>
              <li>If you are using the Home Screen app on mobile, remove it and add it again if the issue persists</li>
            </ul>
            <p>
              Mobile browsers do not usually have a Ctrl + F5 or Ctrl + Shift + R equivalent. If refreshing does not help, clearing the browser cache usually resolves the issue.
            </p>
          `,
          `
            <p>
              サイトが正しく表示されない、または最新の内容に更新されない場合は、以下をお試しください。
            </p>
            <ul>
              <li>ページを再読み込みする</li>
              <li>PCでは可能であれば Ctrl + F5 または Ctrl + Shift + R を試す</li>
              <li>ブラウザのキャッシュを削除する</li>
              <li>ブラウザを閉じて開き直す</li>
              <li>スマートフォンでホーム画面に追加したアプリを使っている場合、改善しないときは一度削除して再追加する</li>
            </ul>
            <p>
              スマートフォンには通常、Ctrl + F5 と同じ操作はありません。再読み込みで改善しない場合は、ブラウザのキャッシュ削除をお試しください。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ⭐ What is MY GOATS?<br>
          MY GOATSとは何ですか？
        </h3>

        ${siteText_(
          `
            <p>
              MY GOATS lets you save your favorite players for quick access.
            </p>
            <ul>
              <li>Favorite players are marked with ★</li>
              <li>Shows favorite LIVE streams, videos and clips</li>
              <li>Used for Live Notifications</li>
              <li>★Backup / ★Import can move your list to another device</li>
              <li>★Share creates a MY GOATS share image</li>
              <li>Stored locally in your browser only</li>
            </ul>
          `,
          `
            <p>
              MY GOATSではお気に入り選手を保存できます。
            </p>
            <ul>
              <li>★でお気に入り登録</li>
              <li>お気に入り選手のLIVE・動画・クリップを表示</li>
              <li>ライブ通知でも利用</li>
              <li>★Backup / ★Import で別のデバイスへ引き継げます</li>
              <li>★Share でMY GOATS画像を作成できます</li>
              <li>ブラウザ内にのみ保存されます</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ◆ What is MUTED?<br>
          MUTEDとは何ですか？
        </h3>

        ${siteText_(
          `
            <p>
              MUTED lets you hide players from LIVE, YouTube and Clips.
            </p>
            <ul>
              <li>Muted players are hidden from stream, video and clip views</li>
              <li>You can mute or unmute players from the card menu</li>
              <li>Muted players can be managed from PLAYERS → ◆</li>
              <li>Stored locally in your browser only</li>
            </ul>
          `,
          `
            <p>
              MUTEDでは、特定の選手をLIVE・YouTube・Clipsから非表示にできます。
            </p>
            <ul>
              <li>ミュートした選手は配信・動画・クリップ一覧に表示されません</li>
              <li>カード右上のメニューからMute / Unmuteできます</li>
              <li>PLAYERS → ◆ からミュート一覧を管理できます</li>
              <li>ブラウザ内にのみ保存されます</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🦊 Where does the data come from?<br>
          データはどこから取得していますか？
        </h3>

        ${siteText_(
          `
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
          `,
          `
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
          `
        )}
      </div>

    </div>
  `;
}