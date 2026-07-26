const HIDE_HOWTO_NAV_KEY = "hideHowtoNav";

function isHowtoNavHidden_() {
  return localStorage.getItem(HIDE_HOWTO_NAV_KEY) === "1";
}

function applyHowtoNavVisibility_() {
  const row = document.getElementById("howtoNavRow");
  if (!row) return;

  row.hidden = isHowtoNavHidden_();
}

function setHowtoNavHidden_(hidden) {
  if (hidden) {
    localStorage.setItem(HIDE_HOWTO_NAV_KEY, "1");
  } else {
    localStorage.removeItem(HIDE_HOWTO_NAV_KEY);
  }

  applyHowtoNavVisibility_();
}

function loadHowtoView() {
  currentView = "howto";
  history.replaceState({}, "", "?view=howto");

  resetSeo_();

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove(
    "youtube-view",
    "clip-view",
    "mediagoats-view",
    "archive-view",
    "player-detail-view"
  );

  pageTitle.textContent = "HOW TO USE";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode faq-mode";

  const hidden = isHowtoNavHidden_();

  const hideBanner = hidden
    ? `
      <div class="card faq-card howto-hide-card">
        <h3>
          📌 Nav button is hidden<br>
          ナビボタンは非表示です
        </h3>
        ${siteText_(
          `
            <p>
              The HOW TO USE button is hidden from the top nav.
              You can still open this page anytime from ⚙ Settings.
            </p>
          `,
          `
            <p>
              上部ナビの HOW TO USE ボタンは非表示です。
              このページはいつでも ⚙ Settings から開けます。
            </p>
          `
        )}
        <button
          type="button"
          class="howto-action-button howto-action-button-show"
          id="showHowtoNavButton"
        >
          Show HOW TO USE button
        </button>
      </div>
    `
    : `
      <div class="card faq-card howto-hide-card howto-hide-card-emphasize">
        <h3>
          ✕ You can hide this button<br>
          ✕ このボタンは消せます
        </h3>
        ${siteText_(
          `
            <p>
              If the HOW TO USE nav button gets in the way, hide it anytime.
              After hiding, you can still open this page from ⚙ Settings → How to use.
            </p>
          `,
          `
            <p>
              HOW TO USE ナビボタンが邪魔なら、いつでも非表示にできます。
              消したあとも ⚙ Settings → How to use から読めます。
            </p>
          `
        )}
        <button
          type="button"
          class="howto-action-button howto-action-button-hide"
          id="hideHowtoNavButton"
        >
          ✕ Hide this button
        </button>
      </div>
    `;

  app.innerHTML = `
    <div class="tools-page">

      ${hideBanner}

      <div class="card faq-card">
        <h3>
          🦊 What you can do here<br>
          このサイトでできること
        </h3>
        ${siteText_(
          `
            <ul>
              <li>
                An unofficial fan site for checking which Overwatch pro players are
                live right now — Twitch, CHZZK, SOOP, Bilibili, and more in one place
              </li>
              <li>
                You can also browse clips &amp; YouTube and player link collections
              </li>
            </ul>
          `,
          `
            <ul>
              <li>
                Overwatch のプロプレイヤーで「今」誰が配信しているかを、
                Twitch / CHZZK / SOOP / Bilibili などからまとめてチェックできる
                非公式ファンサイトです
              </li>
              <li>
                CLIP &amp; YouTube・プレイヤーのリンク集なども一覧で確認できます
              </li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ⚙ Settings<br>
          設定
        </h3>
        ${siteText_(
          `
            <ul>
              <li>
                In ⚙ Settings, you can change how the site looks — themes, languages,
                and more — and find useful URLs and tools
              </li>
              <li>
                <b>Site Text</b> switches the site’s explanatory text between English
                and Japanese. If you prefer another language, choose EN or JP first,
                then use your browser’s translate feature. The creator is Japanese,
                so when wording differs, the Japanese text is the intended meaning
              </li>
            </ul>
          `,
          `
            <ul>
              <li>
                ⚙ では、テーマや言語など、サイトの表示変更や、
                便利なURLやツールの紹介を確認できます
              </li>
              <li>
                <b>Site Text</b> では、サイト内の説明文を英語または日本語に
                切り替えられます。その他の言語の方は、英語か日本語に切り替えたうえで
                ブラウザの翻訳機能を使うと読みやすいです。
                製作者が日本人のため、意味の正は日本語側です
              </li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🧭 Top navigation<br>
          上のナビ
        </h3>
        ${siteText_(
          `
            <ul>
              <li><b>LIVE</b> — players who are live right now</li>
              <li><b>ARCHIVE</b> — streams that ended recently</li>
              <li><b>CLIP&amp;YOUTUBE</b> — clips and YouTube videos</li>
              <li><b>PLAYERS</b> — links for listed players, plus manage ★ MY GOATS and ◆ MUTED</li>
              <li><b>SEARCH</b> — open the search box</li>
              <li><b>HOW TO USE</b> — this page (optional; hide anytime)</li>
            </ul>
          `,
          `
            <ul>
              <li><b>LIVE</b> — 現在配信中のプレイヤー</li>
              <li><b>ARCHIVE</b> — 直近に終了した配信</li>
              <li><b>CLIP&amp;YOUTUBE</b> — クリップと YouTube</li>
              <li><b>PLAYERS</b> — 掲載プレイヤーのリンク一覧、★ MY GOATS・◆ MUTED の管理</li>
              <li><b>SEARCH</b> — 検索ボックスを開く</li>
              <li><b>HOW TO USE</b> — このページ（任意・非表示可）</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ▶ Filters<br>
          フィルター
        </h3>
        ${siteText_(
          `
            <ul>
              <li>Tap <b>▶ Filters</b> to show or hide NEW / ★ / HOT / region / role filters</li>
              <li>On mobile, swipe the list left or right to change filters</li>
              <li>Role filters (TANK / DPS / SUP) are saved on your device</li>
            </ul>
          `,
          `
            <ul>
              <li><b>▶ Filters</b> で NEW / ★ / HOT / 地域 / ロールなどを開閉</li>
              <li>スマホでは一覧を左右スワイプしてもフィルター切替可</li>
              <li>ロール（TANK / DPS / SUP）は端末に保存されます</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🔍 Search<br>
          検索
        </h3>
        ${siteText_(
          `
            <ul>
              <li>Open <b>SEARCH</b>, then filter by player, team, nationality, title, and more</li>
              <li>Use spaces for multiple words (AND)</li>
              <li>Prefix a word with <b>-</b> to exclude it (example: <code>owcs -faceit</code>)</li>
            </ul>
          `,
          `
            <ul>
              <li><b>SEARCH</b> で選手名・チーム・国籍・タイトルなどで絞り込み</li>
              <li>スペース区切りで複数語（AND）</li>
              <li><b>-</b> を付けた語は除外（例: <code>owcs -faceit</code>）</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🔴 LIVE / ARCHIVE
        </h3>
        ${siteText_(
          `
            <ul>
              <li><b>NEW</b> — newest first</li>
              <li><b>★</b> — MY GOATS streams only</li>
              <li><b>HOT</b> — sorted by viewers</li>
              <li><b>KR / EN / CN / JP / INTL / OWCS / FACEIT</b> — region or circuit filters</li>
              <li>Tap a card to open the stream. Use the card menu for ★ / Mute and more</li>
            </ul>
          `,
          `
            <ul>
              <li><b>NEW</b> — 新しい順</li>
              <li><b>★</b> — MY GOATS の配信だけ</li>
              <li><b>HOT</b> — 視聴者順</li>
              <li><b>KR / EN / CN / JP / INTL / OWCS / FACEIT</b> — 地域・大会系</li>
              <li>カードをタップで配信元へ。メニューから ★ / Mute など</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🎬 CLIP &amp; YouTube
        </h3>
        ${siteText_(
          `
            <ul>
              <li>Switch tabs by platform (YouTube / Twitch / CHZZK / SOOP)</li>
              <li><b>★</b> shows media from your favorite players</li>
              <li>Use NEW / HOT / region / BEST tabs to change the sort</li>
            </ul>
          `,
          `
            <ul>
              <li>プラットフォーム別タブ（YouTube / Twitch / CHZZK / SOOP）</li>
              <li><b>★</b> タブでお気に入り選手のメディア</li>
              <li>NEW / HOT / 地域 / BEST などで切替</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ⭐ PLAYERS
        </h3>
        ${siteText_(
          `
            <ul>
              <li><b>TEAMS</b> — browse by team</li>
              <li><b>ALL</b> — all player links</li>
              <li><b>🎂HBD</b> — birthdays (★Share for today's birthday image; shows your TZ and each player's team/nationality TZ range)</li>
              <li><b>★</b> — MY GOATS list</li>
              <li><b>◆</b> — MUTED list</li>
              <li>Open a player for stream and social links</li>
            </ul>
          `,
          `
            <ul>
              <li><b>TEAMS</b> — チームから選手へ</li>
              <li><b>ALL</b> — 全選手リンク</li>
              <li><b>🎂HBD</b> — 誕生日（★Share で今日の誕生日画像。自分のTZと選手のチーム/国籍TZ範囲を表示）</li>
              <li><b>★</b> — MY GOATS 一覧</li>
              <li><b>◆</b> — MUTED 一覧</li>
              <li>選手を開くと配信・SNSなどのリンク集</li>
            </ul>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ★ MY GOATS
        </h3>
        ${siteText_(
          `
            <ul>
              <li>Tap ☆ / ★ to save favorites (stored in this browser only)</li>
              <li>Used by LIVE / media ★ tabs and Live Notifications → MY GOATS</li>
              <li><b>★Backup / ★Import</b> move your list to another device</li>
              <li><b>★Share</b> creates a share image</li>
            </ul>
            <p>
              More details:
              <a href="?view=faq" onclick="openStaticView_('faq'); return false;">FAQ — What is MY GOATS?</a>
            </p>
          `,
          `
            <ul>
              <li>☆ / ★ でお気に入り（このブラウザ内のみ）</li>
              <li>LIVE・メディアの ★ タブ、通知の MY GOATS でも使用</li>
              <li><b>★Backup / ★Import</b> で別端末へ</li>
              <li><b>★Share</b> で画像共有</li>
            </ul>
            <p>
              詳細は
              <a href="?view=faq" onclick="openStaticView_('faq'); return false;">FAQ — MY GOATSとは？</a>
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ◆ MUTED
        </h3>
        ${siteText_(
          `
            <ul>
              <li>Hide players you do not want to see from LIVE / YouTube / Clips</li>
              <li>Mute from a card menu, or manage the list in PLAYERS → ◆</li>
              <li><b>◆Backup / ◆Import</b> available</li>
            </ul>
            <p>
              More details:
              <a href="?view=faq" onclick="openStaticView_('faq'); return false;">FAQ — What is MUTED?</a>
            </p>
          `,
          `
            <ul>
              <li>見たくない選手を LIVE / YouTube / Clips から隠す</li>
              <li>カードメニュー、または PLAYERS → ◆ で管理</li>
              <li><b>◆Backup / ◆Import</b> あり</li>
            </ul>
            <p>
              詳細は
              <a href="?view=faq" onclick="openStaticView_('faq'); return false;">FAQ — MUTEDとは？</a>
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          💬 Need more help?<br>
          困ったとき
        </h3>
        ${siteText_(
          `
            <ul>
              <li>Missing players, notifications, display issues →
                <a href="?view=faq" onclick="openStaticView_('faq'); return false;">FAQ</a>
              </li>
              <li>Requests / bugs → Contact form in the footer</li>
            </ul>
          `,
          `
            <ul>
              <li>選手がいない・通知が出ない・表示がおかしい →
                <a href="?view=faq" onclick="openStaticView_('faq'); return false;">FAQ</a>
              </li>
              <li>要望・不具合 → フッターの Contact フォーム</li>
            </ul>
          `
        )}
      </div>

    </div>
  `;

  document
    .getElementById("hideHowtoNavButton")
    ?.addEventListener("click", () => {
      setHowtoNavHidden_(true);
      loadHowtoView();
    });

  document
    .getElementById("showHowtoNavButton")
    ?.addEventListener("click", () => {
      setHowtoNavHidden_(false);
      loadHowtoView();
    });
}

applyHowtoNavVisibility_();
