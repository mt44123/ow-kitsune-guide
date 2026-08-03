function loadWatchOwcsView() {
  currentView = "watchowcs";
  setViewUrl_("watchowcs");

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

  pageTitle.textContent = "WATCH OWCS";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode faq-mode";

  app.innerHTML = `
    <div class="tools-page">

      <div class="card faq-card">
        <h3>
          🦊 New to OWCS?<br>
          🦊 OWCSは初めて？
        </h3>
        ${siteText_(
          `
            <p>
              A short map of Overwatch’s main competitive circuit — what OWCS is,
              how a season feels, and how to start watching without learning every
              term first.
            </p>
            <p>
              For exact times, drops, and stage-specific details, use the official
              viewers guides and schedule. This page stays focused on beginner basics.
            </p>
          `,
          `
            <p>
              Overwatch 公式のメイン大会サーキット「OWCS」の全体像と、
              最初の観戦のコツだけまとめました。専門用語は最小限です。
            </p>
            <p>
              日程・ドロップ・今ステージ固有の情報は公式の Viewers Guide や
              スケジュールを見てください。ここはすぐ古くならない「入り口」です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🏆 What is OWCS?<br>
          🏆 OWCSとは？
        </h3>
        ${siteText_(
          `
            <p>
              <b>OWCS (Overwatch Champions Series)</b> is the main official esports
              circuit for Overwatch 2.
            </p>
            <p>
              Top teams compete in their regions through the year. Strong results
              lead to international live events, where regions meet and a season’s
              biggest titles are decided.
            </p>
            <p>Main regions you’ll hear about:</p>
            <ul>
              <li>Korea</li>
              <li>Japan / Pacific</li>
              <li>North America (NA)</li>
              <li>EMEA</li>
              <li>China</li>
            </ul>
            <p>
              You don’t need to follow every region. One region + the big
              international weekends is enough to start.
            </p>
          `,
          `
            <p>
              <b>OWCS（Overwatch Champions Series）</b> は、Overwatch 2 の公式メイン
              eスポーツサーキットです。
            </p>
            <p>
              各地域でトップチームが戦い、好成績を残したチームが国際ライブイベントへ
              進みます。そこで地域を超えた強豪がぶつかり、シーズンの大きなタイトルが
              決まります。
            </p>
            <p>よく聞く地域:</p>
            <ul>
              <li>Korea</li>
              <li>Japan / Pacific</li>
              <li>North America（NA）</li>
              <li>EMEA</li>
              <li>China</li>
            </ul>
            <p>
              全部追う必要はありません。最初は「推しの地域 + 大きな国際大会の週末」で
              十分です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🗺️ How a season works<br>
          🗺️ シーズンの流れ
        </h3>
        ${siteText_(
          `
            <p>Remember this flow first:</p>
            <p><b>Regional stages</b> → <b>Regional playoffs</b> → <b>International events</b></p>
            <p>
              A year usually has multiple <b>Stages</b>. Each Stage is its own chapter
              of regional play. International events happen more than once a year
              (for example Champions Clash, Midseason Championship, and later
              finals-style events) — not a single one-and-done tournament.
            </p>
            <p>
              Formats differ by region, but the idea is the same: win at home, then
              prove it on the world stage.
            </p>
          `,
          `
            <p>まずはこの流れだけ覚えればOKです:</p>
            <p><b>地域ステージ</b> → <b>地域プレーオフ</b> → <b>国際イベント</b></p>
            <p>
              1年は複数の <b>Stage（ステージ）</b> に分かれます。各ステージで地域大会が
              あり、国際大会も年に複数回あります（Champions Clash、Midseason Championship、
              後半の決勝系など）。1本のトーナメントだけ、ではありません。
            </p>
            <p>
              方式は地域で違いますが、考え方は同じです。
              「地域で勝ち上がり → 世界の舞台で証明する」。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ✨ What’s fun to watch<br>
          ✨ 何が面白い？
        </h3>
        ${siteText_(
          `
            <p>You don’t need pro knowledge. These moments carry the show:</p>
            <ul>
              <li><b>Aim &amp; mechanics</b> — Pro DPS can end a fight in a blink.</li>
              <li><b>Teamwork</b> — Tank / DPS / Support only work as a unit of five.</li>
              <li><b>Drafts &amp; swaps</b> — Hero changes mid-series feel like coaching chess.</li>
              <li><b>Clutch plays</b> — One save or one pick can flip a map that looked lost.</li>
            </ul>
            <p>If something looks amazing, it probably <i>is</i> — enjoy that first.</p>
          `,
          `
            <p>プロ知識は不要です。見どころはだいたいこれです:</p>
            <ul>
              <li><b>エイム・操作</b> — プロの DPS は一瞬でファイトを終わらせることがある</li>
              <li><b>チームワーク</b> — タンク / DPS / サポートの5人が噛み合って初めて強い</li>
              <li><b>編成・ヒーローチェンジ</b> — シリーズ中の入れ替えは、采配を見ている感覚に近い</li>
              <li><b>クラッチ</b> — あと1秒、あと1キルで試合がひっくり返る</li>
            </ul>
            <p>「すごい」と思った瞬間を素直に楽しむのが正解です。</p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          👀 How to start watching<br>
          👀 初心者の観戦スタート
        </h3>
        ${siteText_(
          `
            <p>Don’t try to understand everything. Do these three:</p>
            <p><b>1. Pick a team to root for</b></p>
            <p>
              Having someone to cheer for makes every map matter. Browse
              <a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS</a>
              on this site and pick one roster that clicks.
            </p>
            <p><b>2. Pick a player to follow</b></p>
            <p>
              One “wait, that player is insane” moment is enough. Use player pages
              for role, heroes, team, and region — then favorite them for LIVE.
            </p>
            <p><b>3. Listen to the casters</b></p>
            <p>
              They tell you who’s winning the fight, why a play was strong, and
              what’s coming next. Unknown terms are fine — keep watching.
            </p>
            <p>
              <b>Bonus:</b> When drop campaigns are live, official streams may give
              in-game rewards for watch time (Battle.net linking is often required).
              Nice extra, not required for enjoying the games.
            </p>
          `,
          `
            <p>全部理解しようとしなくて大丈夫。この3つだけで始められます:</p>
            <p><b>1. 推しチームを決める</b></p>
            <p>
              応援するチームがあるだけで、毎マップが違って見えます。このサイトの
              <a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS</a>
              から、しっくりくる1チームを選んでみてください。
            </p>
            <p><b>2. 推し選手を見つける</b></p>
            <p>
              「この人すごい」が1人いれば十分です。選手ページでロール・ヒーロー・所属・
              地域を確認して、お気に入りに入れると LIVE で追いやすくなります。
            </p>
            <p><b>3. 実況・解説を聞く</b></p>
            <p>
              どちらが有利か、なぜ強かったか、次に何が起きそうかを教えてくれます。
              知らない用語はスルーでOK。見続ける方が早いです。
            </p>
            <p>
              <b>おまけ:</b> ドロップ期間中は、公式配信の視聴でゲーム内報酬が付くことが
              あります（Battle.net 連携が必要なことが多いです）。必須ではありませんが、
              ついでに嬉しい要素です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          📖 Terms worth knowing<br>
          📖 最初に覚えたい用語
        </h3>
        <div class="howto-glossary-wrap">
          <table class="howto-glossary">
            <thead>
              <tr>
                <th>Term</th>
                <th>${siteText_("Meaning", "意味")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Ult</b></td>
                <td>${siteText_("Ultimate ability", "アルティメット（必殺）")}</td>
              </tr>
              <tr>
                <td><b>Pick</b></td>
                <td>${siteText_("Eliminating one enemy", "敵を1人倒すこと")}</td>
              </tr>
              <tr>
                <td><b>Dive</b></td>
                <td>${siteText_("Jump in together on a target", "一気に飛び込む戦術")}</td>
              </tr>
              <tr>
                <td><b>Rush</b></td>
                <td>${siteText_("Push through as a group", "正面から押し切る戦術")}</td>
              </tr>
              <tr>
                <td><b>Hitscan</b></td>
                <td>${siteText_("Hits instantly on aim", "照準どおり即着弾の武器系統")}</td>
              </tr>
              <tr>
                <td><b>Flex</b></td>
                <td>${siteText_("Player who covers many heroes", "幅広いヒーローを使える選手")}</td>
              </tr>
              <tr>
                <td><b>Ft3 / Ft4</b></td>
                <td>${siteText_("First to 3 / 4 maps", "先に3（4）マップ取った方が勝ち")}</td>
              </tr>
              <tr>
                <td><b>Lower bracket</b></td>
                <td>${siteText_("Second-chance side in double-elim", "ダブルエリミの敗者側ブラケット")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        ${siteText_(
          `<p>Everything else can wait.</p>`,
          `<p>それ以外は後回しで大丈夫です。</p>`
        )}
      </div>

      <div class="card faq-card">
        <h3>
          📺 Where to watch<br>
          📺 どこで見る？
        </h3>
        ${siteText_(
          `
            <p>
              OWCS broadcasts are free. Channels depend on the region
              (Twitch, YouTube, SOOP, Bilibili, and more).
            </p>
            <p>Quick path:</p>
            <ul>
              <li>
                Check the
                <a href="https://esports.overwatch.com/en-us/schedule" target="_blank" rel="noopener">
                  official OWCS schedule
                </a>
              </li>
              <li>
                Open stream links from this site’s
                <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">USEFUL LINKS</a>
              </li>
              <li>
                On this site, use
                <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">LIVE → OWCS</a>
                while events are on
              </li>
            </ul>
            <p>
              Japanese-language casts appear for some Asia broadcasts — check
              JP / Pacific / Korea listings when you want that.
            </p>
          `,
          `
            <p>
              OWCS の公式配信は基本無料です。地域ごとに Twitch / YouTube / SOOP /
              Bilibili などが使われます。
            </p>
            <p>手順の例:</p>
            <ul>
              <li>
                <a href="https://esports.overwatch.com/en-us/schedule" target="_blank" rel="noopener">
                  公式 OWCS スケジュール
                </a>
                を見る
              </li>
              <li>
                このサイトの
                <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">USEFUL LINKS</a>
                から配信を開く
              </li>
              <li>
                大会中は
                <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">LIVE → OWCS</a>
                も併用する
              </li>
            </ul>
            <p>
              日本語配信がある大会・チャンネルもあります。
              JP / Pacific / Korea 周りを見ると見つけやすいです。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ❓ Beginner FAQ<br>
          ❓ よくある質問
        </h3>
        ${siteText_(
          `
            <p><b>Can I enjoy it if I don’t play Overwatch?</b></p>
            <p>
              Yes. Like any sport on TV, you can enjoy skill, stories, and crowd
              energy before you know every rule.
            </p>
            <hr>
            <p><b>Is this the same as OWL?</b></p>
            <p>
              No. <b>OWL (Overwatch League)</b> was the previous franchise league era.
              <b>OWCS</b> is the current open, region-based official circuit.
            </p>
            <hr>
            <p><b>Is Korea really that strong?</b></p>
            <p>
              Often yes — Korea has long been one of the deepest regions and
              frequently contenders at international events. That said, every Stage
              has upsets.
            </p>
            <hr>
            <p><b>What about Japan?</b></p>
            <p>
              The JP scene has clear standout teams and is absolutely worth watching
              on its own — especially if you want familiar language or local storylines.
            </p>
          `,
          `
            <p><b>ゲームをやってなくても楽しめる？</b></p>
            <p>
              できます。サッカー中継と同じで、最初はルールが曖昧でも
              「上手さ」と「物語」で楽しめます。
            </p>
            <hr>
            <p><b>OWL とは違うの？</b></p>
            <p>
              違います。<b>OWL（Overwatch League）</b> は以前のフランチャイズリーグです。
              いま世界で続く公式の主軸が <b>OWCS</b> です。
            </p>
            <hr>
            <p><b>韓国が強いって本当？</b></p>
            <p>
              長く世界トップクラスの厚みがある地域で、国際大会でも中心になりやすいです。
              ただし毎ステージ、番狂わせもあります。
            </p>
            <hr>
            <p><b>日本チームは？</b></p>
            <p>
              日本地域にも見どころのあるチームが多く、単独でも十分楽しめます。
              言語やローカルな物語を追いやすいのも魅力です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          🦊 Enjoy more with OW KITSUNE GUIDE<br>
          🦊 このサイトでさらに楽しむ
        </h3>
        ${siteText_(
          `
            <ul>
              <li>
                <b>LIVE</b> — catch streams; filter
                <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">OWCS</a>
                during events
              </li>
              <li>
                <b>PLAYERS / TEAMS</b> — learn rosters and find favorites
                (<a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS</a>)
              </li>
              <li>
                <b>USEFUL LINKS</b> — official schedule, channels, Liquipedia, replay codes
                (<a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">open</a>)
              </li>
              <li><b>★ Favorites</b> — keep your players easy to reopen</li>
            </ul>
            <p>
              Official stage blogs cover drops and week-by-week details. This page is
              your starting map; the rest of the site helps you build <i>your</i> watch list.
            </p>
            <p>
              Further reading (official):
              <a href="https://overwatch.blizzard.com/en-us/news/24033788/the-future-of-overwatch-esports/" target="_blank" rel="noopener">The Future of Overwatch Esports</a>
              ·
              <a href="https://esports.overwatch.com/en-us/news" target="_blank" rel="noopener">Overwatch Esports News</a>
            </p>
          `,
          `
            <ul>
              <li>
                <b>LIVE</b> — 配信を探す。大会中は
                <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">OWCS</a>
                フィルタ
              </li>
              <li>
                <b>PLAYERS / TEAMS</b> — ロスターを見て推しを見つける
                （<a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS</a>）
              </li>
              <li>
                <b>USEFUL LINKS</b> — 公式スケジュール・配信・Liquipedia・リプレイコード
                （<a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">開く</a>）
              </li>
              <li><b>★ お気に入り</b> — 推し選手をすぐ開けるようにする</li>
            </ul>
            <p>
              ドロップや週ごとの詳細は公式ブログへ。このページは地図、サイトの他機能は
              「自分の観戦リスト」作りに使ってください。
            </p>
            <p>
              公式の参考:
              <a href="https://overwatch.blizzard.com/en-us/news/24033788/the-future-of-overwatch-esports/" target="_blank" rel="noopener">The Future of Overwatch Esports</a>
              ·
              <a href="https://esports.overwatch.com/en-us/news" target="_blank" rel="noopener">Overwatch Esports News</a>
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ✅ Start simple<br>
          ✅ まずはシンプルに
        </h3>
        ${siteText_(
          `
            <p>
              Start with one team, one player, and one full series. The rest comes naturally.
            </p>
          `,
          `
            <p>
              まずは推しチーム1つ、推し選手1人、シリーズ1本。あとは見ながら自然に増えます。
            </p>
          `
        )}
      </div>

    </div>
  `;
}

function openOwcsLiveFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  currentView = "owcs";
  currentLiveView = "owcs";
  setViewUrl_("owcs");
  updateNavState(currentView);
  loadView(currentView);
}

function openTeamsFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  currentView = "teams";
  currentPlayerView = "teams";
  setViewUrl_("teams");
  updateNavState(currentView);
  loadView(currentView);
}
