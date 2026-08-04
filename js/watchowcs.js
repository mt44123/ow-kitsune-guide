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

      <div class="card faq-card howto-wip-card">
        <h3>
          ${siteHeading_("📝 Work in progress", "📝 執筆中です")}
        </h3>
        ${siteText_(
          `
            <p>
              This guide is still being written. Content may change or expand.
            </p>
          `,
          `
            <p>
              このページは現在執筆中です。内容は今後追加・修正していく予定です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("🦊 New to OWCS?", "🦊 OWCSは初めて？")}
        </h3>
        ${siteText_(
          `
            <p>
              “I keep hearing about OWCS — what tournament is that?”<br>
              “What do Overwatch pro matches even look like?”<br>
              “I open a stream and still feel lost…”
            </p>
            <p>
              This page covers OWCS basics and simple ways beginners can enjoy watching —
              without needing pro-level knowledge first.
            </p>
          `,
          `
            <p>
              「OWCSってよく聞くけど、何の大会？」<br>

              「Overwatchのプロってどんな試合をしているの？」<br>

              「配信を見てもよく分からない…」<br>
            </p>
            <p>
              そんな方のために、このページではOWCSの基本から、初心者でも楽しめる観戦方法までを分かりやすく紹介します。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("🏆 What is OWCS?", "🏆 OWCSとは？")}
        </h3>
        ${siteText_(
          `
            <p>
              <b>OWCS (Overwatch Champions Series)</b> is Overwatch’s official
              international tournament series.
            </p>
            <p>
              Teams that advance through each region’s qualifiers move on to
              international events — where the world’s best is decided.
            </p>
            <p>Participating regions:</p>
            <ul>
              <li>Asia (Japan, Korea, Pacific)</li>
              <li>NA (North America)</li>
              <li>EMEA (Europe, Middle East, Africa)</li>
              <li>China</li>
            </ul>
            <p>
              You don’t need to follow everything. Starting with “your favorite
              region + international events” is enough.
            </p>
          `,
          `
            <p>
              <b>OWCS（Overwatch Champions Series）</b> は、Overwatchの公式国際大会シリーズです。
            </p>
            <p>
              各地域の予選を突破したチームが国際大会へ進み、世界一が決まります。
            </p>
            <p>参加する地域:</p>
            <ul>
              <li>Asia(Japan, Korea, Pacific)</li>
              <li>NA（North America）</li>
              <li>EMEA（Europe, Middle East, Africa）</li>
              <li>China</li>
            </ul>
            <p>
              全部追う必要はありません。最初は「推しの地域 + 国際大会」で十分です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("🗺️ How a season works", "🗺️ シーズンの流れ")}
        </h3>
        ${siteText_(
          `
            <p>Remember just this flow first:</p>
            <p>
              <b>Open Qualifier</b> (regional open quals) →
              <b>Regular Season</b> (regional league play) →
              <b>Regional Playoffs</b> (regional tournament) →
              <b>International Events</b>
            </p>
            <p>
              Exact formats differ a little by region, but this cycle happens about
              3–4 times a year.<br>
              In other words, there are roughly 3–4 shots each year at becoming
              #1 in the world.
            </p>
            <p>
              For Japan:<br>
              Finishing in the <b>top 2 domestically</b> can advance a team to the
              Asia regional stage.<br>
              The <b>top 2–3 Asia teams</b> advance to international events.<br>
              <br>
              Right now, the Asia power balance is roughly
              <b>Korea &gt; Pacific / Japan</b>.<br>
              Under this format, <b>Korean teams advance to internationals about
              99% of the time</b>.<br>
              <br>
              Currently, only the summer <b>EWC</b> lets the #1 teams from Japan and
              Pacific qualify directly for that international event.
            </p>
          `,
          `
            <p>まずはこれだけ覚えればOKです:</p>
            <p><b>Open Qualifier(地域オープン予選)</b> → <b>Regular Season(地域総当たり戦)</b> → <b>Regional Playoffs(地域トーナメント)</b> → <b>International Events(国際大会)</b></p>
            <p>
              地域ごとに形式は少し違いますが、これが年3～4回あります。<br>
              つまり、年3～4回、世界1位を目指すチャンスがあります。<br>
            </p>
            <p>
              日本の場合<br>
              <b>国内上位2チーム</b>に入ることで、アジア地域大会へ進出可能です。<br>
              <b>アジア上位2~3チーム</b>が国際大会へ進出します。<br>
              <br>
              ただし現状、アジア地域のパワーバランスは、<b>韓国＞パシフィック・日本</b>です。<br>
              この形式で行われる際は<b>99％韓国チームが国際大会へ進出</b>します。<br>
              <br>
              現状、夏季に行われるEWCのみ、日本・パシフィックでの1位チームが直接国際大会へ進出可能です。<br>
            
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("✨ What’s fun to watch", "✨ 何が面白い？")}
        </h3>
        ${siteText_(
          `
            <p>You don’t need pro knowledge. The highlights are usually these:</p>
            <ul>
              <li>
                <b>World-class aim &amp; movement</b> — Pro-level mechanics are truly
                another tier. Super plays come one after another.
              </li>
              <li>
                <b>Teamwork</b> — Full-team voice comms produce coordination you
                rarely see in ranked.
              </li>
              <li>
                <b>Mind games &amp; strategy</b> — Multiple coaches are involved.
                Map picks, player subs, bans, and comps can flip entire matches.
              </li>
              <li>
                <b>Face cams &amp; interviews</b> — Player banter, behind-the-scenes
                stories, and meta talk you won’t get from the scoreboard alone.
              </li>
            </ul>
            <p>When something looks amazing, just enjoy that moment — you’re right.</p>
          `,
          `
            <p>プロ知識は不要です。見どころはだいたいこれです:</p>
            <ul>
              <li><b>世界最高峰のエイム・キャラコン</b> — プロのフィジカルは本当に別次元です。スーパープレイの連続です。</li>
              <li><b>チームワーク</b> — チーム全員がVCするため、異次元のチームプレーを見ることが出来ます。</li>
              <li><b>作戦の読み合い</b> — コーチが何人もいます。マップ・選手交代・BAN・構成などの作戦選択によって、試合がひっくり返ります。</li>
              <li><b>フェイスカメラ・インタビュー</b> — 選手同士のやり取りや、裏話・メタ考察等の情報も得ることが出来ます。</li>
            </ul>
            <p>「すごい」と思った瞬間を素直に楽しむのが正解です。</p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("👀 How to start watching", "👀 初心者の観戦スタート")}
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
              what’s coming next. If a term is unfamiliar, a quick search usually
              clears it up.
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
              知らない用語は検索すれば大体わかります。
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
          ${siteHeading_("📺 Where to watch", "📺 どこで見る？")}
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
          ${siteHeading_("❓ Beginner FAQ", "❓ よくある質問")}
        </h3>
        ${siteText_(
          `
            <p><b>Can I enjoy it if I don’t play Overwatch?</b></p>
            <p>
              Yes. Like watching soccer on TV, you can enjoy skill and story even
              when the rules still feel fuzzy at first.
            </p>
            <hr>
            <p><b>Is this the same as OWL?</b></p>
            <p>
              OWCS was introduced in 2024 as the successor to the Overwatch League.
            </p>
            <hr>
            <p><b>Is Korea really that strong?</b></p>
            <p>
              Yes — Korea has long been one of the deepest regions and often sits
              at the center of international events. That said, every Stage has
              upsets. EMEA has also been getting stronger recently.
            </p>
            <hr>
            <p><b>What about Japan?</b></p>
            <p>
              Japan has plenty of teams worth watching on their own. Language also
              makes it easier to follow players’ personal streams, which helps
              fans stick with their favorites.
            </p>
          `,
          `
            <p><b>ゲームをやってなくても楽しめる？</b></p>
            <p>
              楽しめます。サッカー中継と同じで、最初はルールが曖昧でも
              「上手さ」と「物語」で楽しめます。
            </p>
            <hr>
            <p><b>OWL とは違うの？</b></p>
            <p>
              OWCSは、オーバーウォッチリーグの後継として、2024年に導入されました。
            </p>
            <hr>
            <p><b>韓国が強いって本当？</b></p>
            <p>
              長く世界トップクラスの厚みがある地域で、国際大会でも中心になりやすいです。
              ただし毎ステージ、番狂わせもあります。
              また、最近はEMEA地域も強くなってきています。
            </p>
            <hr>
            <p><b>日本チームは？</b></p>
            <p>
              日本地域にも見どころのあるチームが多く、単独でも十分楽しめます。
              言語の関係で、選手の個人配信を追いかけやすい為、応援しやすいのも魅力です。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_(
            "🦊 Enjoy more with OW KITSUNE GUIDE",
            "🦊 このサイトでさらに楽しむ"
          )}
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
          ${siteHeading_("✅ Start simple", "✅ まずはシンプルに")}
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
