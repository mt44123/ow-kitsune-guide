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
              tournament.
            </p>
            <p>
              Teams that advance through each region’s qualifiers move on to
              world events — where the world’s best is decided.
            </p>
            <p>Participating regions:</p>
            <ul>
              <li>Asia</li>
              <li>China</li>
              <li>NA</li>
              <li>EMEA</li>
            </ul>
            <p>
              You don’t need to follow everything. Starting with “your favorite
              region + world events” is enough.<br>
              Japan, Korea, Asia, and World events also have Japanese cast
              commentary.
            </p>
          `,
          `
            <p>
              <b>OWCS（Overwatch Champions Series）</b> はOverwatchの公式大会です。
            </p>
            <p>
              各地域の予選を突破したチームが世界大会へ進み、世界一が決まります。
            </p>
            <p>参加する地域:</p>
            <ul>
              <li>Asia</li>
              <li>China</li>
              <li>NA</li>
              <li>EMEA</li>
            </ul>
            <p>
              全部追う必要はありません。最初は「推しの地域 + 世界大会」で十分です。<br>
              ちなみに、Japan、Korea、Asia、世界大会には日本語実況がついています。
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
            <p>Here’s how the season flows:</p>
            <ol>
              <li><b>Open Qualifier</b> (prelims)</li>
              <li><b>Promotion / Relegation</b></li>
              <li><b>Regular Season</b> (round robin)</li>
              <li>
                <b>Regional Playoffs</b> (tournament)<br>
                (In Asia, there is also an Asia stage.)
              </li>
              <li><b>World events</b></li>
            </ol>
            <p>
              Exact formats differ a little by region, but this cycle happens about
              3–4 times a year.<br>
              In other words, there are roughly 3–4 shots each year at becoming
              #1 in the world.
            </p>
          `,
          `
            <p>大会の流れです。</p>
            <ol>
              <li><b>予選</b> (Open Qualifier)</li>
              <li><b>昇格戦・降格戦</b> (Promotion/Relegation)</li>
              <li><b>総当たり戦</b> (Regular Season)</li>
              <li>
                <b>トーナメント戦</b> (Regional Playoffs)<br>
                （アジア地域は、アジア大会もあります）
              </li>
              <li><b>世界大会</b></li>
            </ol>
            <p>
              地域ごとに形式は少し違いますが、これが年3～4回あります。<br>
              つまり、年3～4回、世界1位を目指すチャンスがあります。
            </p>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("🗺️ Season structure map", "🗺️ シーズン構造図")}
        </h3>
        ${siteText_(
          `
            <p>
              Real HTML text (not a flat image), so browser translation tools can be used.
              Site Text (EN / JP) can also switch this map.
            </p>
          `,
          `
            <p>
              画像ではなくHTMLのテキストなので、ブラウザの翻訳機能を使用可能です。Site Text（英 / 日 ）でも切替可能です。
            </p>
          `
        )}
        ${buildOwcsSeasonFlowHtml_()}
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

/**
 * OWCS season flowchart as real DOM text (browser-translate friendly).
 * Uses Site Text language: en | jp | both.
 */
function buildOwcsSeasonFlowHtml_() {
  const mode =
    typeof getSiteTextLanguageMode_ === "function"
      ? getSiteTextLanguageMode_()
      : "both";

  if (mode === "en") {
    return buildOwcsSeasonFlowDiagram_("en");
  }

  if (mode === "jp") {
    return buildOwcsSeasonFlowDiagram_("jp");
  }

  return `
    ${buildOwcsSeasonFlowDiagram_("en")}
    <hr class="owcs-flow-lang-sep">
    ${buildOwcsSeasonFlowDiagram_("jp")}
  `;
}

function owcsFlowBox_(titleHtml, noteHtml, extraClass = "") {
  const note = noteHtml
    ? `<span class="owcs-flow-box-note">${noteHtml}</span>`
    : "";

  return `
    <div class="owcs-flow-box ${extraClass}">
      <span class="owcs-flow-box-title">${titleHtml}</span>
      ${note}
    </div>
  `;
}

function buildOwcsSeasonFlowDiagram_(lang) {
  const L = lang === "jp" ? OWCS_FLOW_COPY_JP_ : OWCS_FLOW_COPY_EN_;
  const docLang = lang === "jp" ? "ja" : "en";

  // Desktop grid cols:
  // 1 bar | 2 label | 3 open | 4 arr | 5 promo | 6 arr | 7 regional | 8 arr | 9 asia | 10 arr | 11 world
  const dCell = (row, col, html, extraClass = "", spanCols = 1, spanRows = 1) => {
    const colEnd = spanCols > 1 ? ` / span ${spanCols}` : "";
    const rowEnd = spanRows > 1 ? ` / span ${spanRows}` : "";
    return `
      <div class="owcs-flow-cell ${extraClass}" style="grid-row:${row}${rowEnd};grid-column:${col}${colEnd}">
        ${html}
      </div>
    `;
  };

  const dArrow = (row, col, spanRows = 1) =>
    dCell(
      row,
      col,
      `<span class="owcs-flow-arrow owcs-flow-arrow-h" aria-hidden="true">→</span>`,
      "owcs-flow-arrow-cell",
      1,
      spanRows
    );

  const arrowH = `<span class="owcs-flow-arrow owcs-flow-arrow-h" aria-hidden="true">→</span>`;
  const arrowV = `<span class="owcs-flow-arrow owcs-flow-arrow-v" aria-hidden="true">↓</span>`;

  const pipe = items => {
    const parts = [];
    items.forEach((item, i) => {
      parts.push(item);
      if (i < items.length - 1) {
        parts.push(arrowH);
        parts.push(arrowV);
      }
    });
    return `<div class="owcs-flow-pipeline">${parts.join("")}</div>`;
  };

  const asiaTrack = (row, regionKey, label, openTitle, regionalTitle) => `
    ${dCell(row, 2, `<span class="owcs-flow-sublabel">${label}</span>`, `owcs-flow-label-cell owcs-flow-region-${regionKey}`)}
    ${dCell(row, 3, owcsFlowBox_(openTitle, "", "owcs-flow-box-open"))}
    ${dArrow(row, 4)}
    ${dCell(row, 5, owcsFlowBox_(L.promo, L.promoAsiaNote, "owcs-flow-box-soft"))}
    ${dArrow(row, 6)}
    ${dCell(row, 7, owcsFlowBox_(regionalTitle, L.stagePath, `owcs-flow-box-owcs owcs-flow-box-owcs-${regionKey}`))}
    ${dArrow(row, 8)}
  `;

  const desktop = `
    <div class="owcs-flow-desktop" aria-label="${L.flowAria}">
      <div class="owcs-flow-grid">
        ${dCell(1, 1, `<span>${L.asia}</span>`, "owcs-flow-bar-cell owcs-flow-asia-bar", 1, 3)}

        ${asiaTrack(1, "kr", L.kr, L.krOpen, L.krRegional)}
        ${asiaTrack(2, "jp", L.jp, L.jpOpen, L.jpRegional)}
        ${asiaTrack(3, "pac", L.pac, L.pacOpen, L.pacRegional)}

        ${dCell(1, 9, owcsFlowBox_(L.asiaChampTitle, L.asiaNote, "owcs-flow-box-owcs owcs-flow-box-owcs-asia"), "owcs-flow-asia-span", 1, 3)}
        ${dArrow(1, 10, 6)}
        ${dCell(1, 11, owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world"), "owcs-flow-world-span", 1, 6)}

        ${dCell(4, 1, `<span>${L.china}</span>`, "owcs-flow-bar-cell owcs-flow-china-bar")}
        ${dCell(4, 2, `<span class="owcs-flow-sublabel owcs-flow-sublabel-cn">${L.china}</span>`, "owcs-flow-label-cell owcs-flow-region-cn")}
        ${dCell(4, 3, owcsFlowBox_(L.cnOpen, "", "owcs-flow-box-open"), "", 3)}
        ${dArrow(4, 6)}
        ${dCell(4, 7, owcsFlowBox_(L.cnMain, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-cn"), "", 3)}

        ${dCell(5, 1, `<span>${L.na}</span>`, "owcs-flow-bar-cell owcs-flow-na-bar")}
        ${dCell(5, 2, `<span class="owcs-flow-sublabel owcs-flow-sublabel-na">${L.na}</span>`, "owcs-flow-label-cell owcs-flow-region-na")}
        ${dCell(5, 3, owcsFlowBox_(L.faceit, "", "owcs-flow-box-open"))}
        ${dArrow(5, 4)}
        ${dCell(5, 5, owcsFlowBox_(L.promo, L.promoFaceitNote, "owcs-flow-box-soft"))}
        ${dArrow(5, 6)}
        ${dCell(5, 7, owcsFlowBox_(L.naMain, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-na"), "", 3)}

        ${dCell(6, 1, `<span>${L.emea}</span>`, "owcs-flow-bar-cell owcs-flow-emea-bar")}
        ${dCell(6, 2, `<span class="owcs-flow-sublabel owcs-flow-sublabel-emea">${L.emea}</span>`, "owcs-flow-label-cell owcs-flow-region-emea")}
        ${dCell(6, 3, owcsFlowBox_(L.faceit, "", "owcs-flow-box-open"))}
        ${dArrow(6, 4)}
        ${dCell(6, 5, owcsFlowBox_(L.promo, L.promoFaceitNote, "owcs-flow-box-soft"))}
        ${dArrow(6, 6)}
        ${dCell(6, 7, owcsFlowBox_(L.emeaMain, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-emea"), "", 3)}

        ${dCell(7, 1, `<span>${L.faceitBar}</span>`, "owcs-flow-bar-cell owcs-flow-faceit-bar")}
        ${dCell(7, 2, `<span class="owcs-flow-sublabel owcs-flow-sublabel-faceit">${L.faceitLabel}</span>`, "owcs-flow-label-cell owcs-flow-region-faceit")}
        ${dCell(
          7,
          3,
          `
            <div class="owcs-flow-box owcs-flow-box-faceit-info">
              <span class="owcs-flow-box-title">${L.faceitInfoTitle}</span>
              <span class="owcs-flow-box-note">${L.faceitInfoBody}</span>
            </div>
          `,
          "owcs-flow-faceit-span",
          9
        )}
      </div>
    </div>
  `;

  const mobileTrack = (regionKey, label, items) => `
    <div class="owcs-flow-subtrack owcs-flow-region-${regionKey}">
      <div class="owcs-flow-sublabel">${label}</div>
      ${pipe(items)}
    </div>
  `;

  const mobile = `
    <div class="owcs-flow-mobile" aria-label="${L.flowAria}">
      <div class="owcs-flow-block owcs-flow-asia">
        <div class="owcs-flow-region-bar"><span>${L.asia}</span></div>
        <div class="owcs-flow-region-body">
          <div class="owcs-flow-asia-tracks">
            ${mobileTrack("kr", L.kr, [
              owcsFlowBox_(L.krOpen, "", "owcs-flow-box-open"),
              owcsFlowBox_(L.promo, L.promoAsiaNote, "owcs-flow-box-soft"),
              owcsFlowBox_(L.krRegional, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-kr"),
              owcsFlowBox_(L.asiaChampTitle, L.asiaNote, "owcs-flow-box-owcs owcs-flow-box-owcs-asia"),
              owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
            ])}
            ${mobileTrack("jp", L.jp, [
              owcsFlowBox_(L.jpOpen, "", "owcs-flow-box-open"),
              owcsFlowBox_(L.promo, L.promoAsiaNote, "owcs-flow-box-soft"),
              owcsFlowBox_(L.jpRegional, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-jp"),
              owcsFlowBox_(L.asiaChampTitle, L.asiaNote, "owcs-flow-box-owcs owcs-flow-box-owcs-asia"),
              owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
            ])}
            ${mobileTrack("pac", L.pac, [
              owcsFlowBox_(L.pacOpen, "", "owcs-flow-box-open"),
              owcsFlowBox_(L.promo, L.promoAsiaNote, "owcs-flow-box-soft"),
              owcsFlowBox_(L.pacRegional, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-pac"),
              owcsFlowBox_(L.asiaChampTitle, L.asiaNote, "owcs-flow-box-owcs owcs-flow-box-owcs-asia"),
              owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
            ])}
          </div>
        </div>
      </div>

      <div class="owcs-flow-block owcs-flow-china">
        <div class="owcs-flow-region-bar"><span>${L.china}</span></div>
        <div class="owcs-flow-region-body">
          ${pipe([
            owcsFlowBox_(L.cnOpen, "", "owcs-flow-box-open"),
            owcsFlowBox_(L.cnMain, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-cn"),
            owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
          ])}
        </div>
      </div>

      <div class="owcs-flow-block owcs-flow-na">
        <div class="owcs-flow-region-bar"><span>${L.na}</span></div>
        <div class="owcs-flow-region-body">
          ${pipe([
            owcsFlowBox_(L.faceit, "", "owcs-flow-box-open"),
            owcsFlowBox_(L.promo, L.promoFaceitNote, "owcs-flow-box-soft"),
            owcsFlowBox_(L.naMain, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-na"),
            owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
          ])}
        </div>
      </div>

      <div class="owcs-flow-block owcs-flow-emea">
        <div class="owcs-flow-region-bar"><span>${L.emea}</span></div>
        <div class="owcs-flow-region-body">
          ${pipe([
            owcsFlowBox_(L.faceit, "", "owcs-flow-box-open"),
            owcsFlowBox_(L.promo, L.promoFaceitNote, "owcs-flow-box-soft"),
            owcsFlowBox_(L.emeaMain, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-emea"),
            owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
          ])}
        </div>
      </div>

      <div class="owcs-flow-block owcs-flow-faceit">
        <div class="owcs-flow-region-bar"><span>${L.faceitBar}</span></div>
        <div class="owcs-flow-region-body">
          <div class="owcs-flow-sublabel owcs-flow-sublabel-faceit">${L.faceitLabel}</div>
          <div class="owcs-flow-box owcs-flow-box-faceit-info">
            <span class="owcs-flow-box-title">${L.faceitInfoTitle}</span>
            <span class="owcs-flow-box-note">${L.faceitInfoBody}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  return `
    <div class="owcs-flow" lang="${docLang}">
      ${desktop}
      ${mobile}
    </div>
  `;
}

const OWCS_FLOW_COPY_EN_ = {
  flowAria: "OWCS season structure",
  asia: "Asia",
  china: "China",
  na: "NA",
  emea: "EMEA",
  kr: "Korea",
  jp: "Japan",
  pac: "Pacific",
  promo: "Promo / relegation",
  promoAsiaNote: "Open Quals top teams vs last season’s lower teams",
  promoFaceitNote: "FACEIT League Master top teams vs last season’s lower teams",
  krOpen: "Korea Open Quals",
  jpOpen: "Japan Open Quals",
  pacOpen: "Pacific Open Quals",
  krRegional: "OWCS Korea<br>(offline)",
  jpRegional: "OWCS Japan",
  pacRegional: "OWCS Pacific",
  stagePath: "Round robin → tournament<br>Top 2 advance",
  asiaChampTitle: "OWCS Asia<br>(offline)",
  asiaNote: "Top 2 advance",
  cnOpen: "China Open Quals",
  cnMain: "OWCS China",
  faceit: "FACEIT League<br>Master",
  faceitBar: "FACEIT",
  faceitLabel: "FACEIT",
  faceitInfoTitle:
    "FACEIT League NA · EMEA · Oceania · South America<br>(Open → Advanced → Expert → Master)",
  faceitInfoBody:
    "A second-division style pathway that runs alongside OWCS.<br>Like OWCS, each tier runs round robin → playoffs every season.<br>※ Not present in the Asia region.",
  naMain: "OWCS NA",
  emeaMain: "OWCS EMEA",
  worldTitle: "OWCS World Events<br>(offline)",
  worldEvents: "Champions Clash · Midseason Championship · World Finals"
};

const OWCS_FLOW_COPY_JP_ = {
  flowAria: "OWCSシーズン構造図",
  asia: "Asia",
  china: "China",
  na: "NA",
  emea: "EMEA",
  kr: "Korea",
  jp: "Japan",
  pac: "Pacific",
  promo: "昇格戦・降格戦",
  promoAsiaNote: "オープン予選上位チーム VS 前シーズン下位チーム",
  promoFaceitNote: "FACEIT League Master 上位チーム VS 前シーズン下位チーム",
  krOpen: "韓国オープン予選",
  jpOpen: "日本オープン予選",
  pacOpen: "パシフィックオープン予選",
  krRegional: "OWCS Korea<br>（オフライン）",
  jpRegional: "OWCS Japan",
  pacRegional: "OWCS Pacific",
  stagePath: "総当たり戦→トーナメント<br>上位2チームが進出",
  asiaChampTitle: "OWCS Asia<br>（オフライン）",
  asiaNote: "上位2チームが進出",
  cnOpen: "中国オープン予選",
  cnMain: "OWCS China",
  faceit: "FACEIT League<br>Master",
  faceitBar: "FACEIT",
  faceitLabel: "FACEIT",
  faceitInfoTitle:
    "FACEIT League NA・EMEA・Oceania・SouthAmerica<br>(Open→Advanced→Expert→Master）",
  faceitInfoBody:
    "2部リーグのような位置付けで、OWCSと同時進行されています。<br>OWCS同様、シーズン毎に各階級の総当たり戦→トーナメント戦が行われています。<br>※アジア地域にはありません。",
  naMain: "OWCS NA",
  emeaMain: "OWCS EMEA",
  worldTitle: "OWCS 世界大会<br>（オフライン）",
  worldEvents: "Champions Clash · Midseason Championship · World Finals"
};

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
