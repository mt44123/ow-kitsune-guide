function loadWatchOwcsView() {
  currentView = "watchowcs";
  setViewUrl_("watchowcs");

  resetSeo_();

  document.title = "OWCS観戦ガイド | OW KITSUNE GUIDE";
  const meta = document.getElementById("metaDescription");
  if (meta) {
    meta.content =
      "OWCS初心者向け観戦ガイド。日本語実況・見どころ・視聴方法・大会の仕組みをわかりやすく解説。";
  }
  const canonical = document.getElementById("canonicalUrl");
  if (canonical) {
    canonical.href = "https://owkitsune.com/watchowcs";
  }

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
    <main class="tools-page watchowcs-page">

      <header class="card faq-card watchowcs-hero" id="watchowcs-top">
        <p class="watchowcs-kicker">${siteHeading_("OWCS beginner guide", "OWCS初心者向け")}</p>
        <h1 class="watchowcs-h1">
          ${siteHeading_("OWCS watch guide", "OWCS観戦ガイド")}
        </h1>
        ${siteText_(
          `
            <p class="watchowcs-lead">
              Enjoy world-class Overwatch with Japanese casts — without needing
              pro-level know-how.
            </p>
            <p>
              This page covers highlights, how to watch, and how the tournament
              works — for first-time viewers.
            </p>
          `,
          `
            <p class="watchowcs-lead">
              世界最高峰のOverwatchを、日本語実況で気軽に楽しもう。
            </p>
            <p>
              OWCSを初めて見る人向けに、見どころ・視聴方法・大会の仕組みを分かりやすく紹介します。
            </p>
          `
        )}

        <ul class="watchowcs-trust" aria-label="Key points">
          <li>${siteHeading_("Japanese casts available", "日本語配信あり")}</li>
          <li>${siteHeading_("No competitive knowledge required", "競技知識がなくても楽しめる")}</li>
          <li>${siteHeading_("Free to watch", "無料で視聴できる")}</li>
        </ul>

        <div class="watchowcs-cta">
          <a class="watchowcs-cta-primary" href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">
            ${siteHeading_("Find live OWCS streams", "今見られるOWCS配信を探す")}
          </a>
          <a class="watchowcs-cta-secondary" href="#watchowcs-fun">
            ${siteHeading_("See what’s fun about OWCS", "OWCSの見どころを知る")}
          </a>
          <a class="watchowcs-cta-secondary" href="#watchowcs-structure">
            ${siteHeading_("How the tournament works", "大会の仕組みを見る")}
          </a>
        </div>

        ${siteText_(
          `
            <p class="owcs-sitetext-tip">
              <b>Tip:</b> Open the ⚙ menu (top right) and set <b>Site Text</b> to
              English or Japanese only — it’s much easier to read.
            </p>
          `,
          `
            <p class="owcs-sitetext-tip">
              <b>右上の⚙マークから、Site Text設定を英/日どちらかに切り替えると読みやすいです。</b>
            </p>
          `
        )}

        <nav class="watchowcs-toc" aria-label="On this page">
          ${siteText_(
            `
              <p><b>On this page</b></p>
              <ol>
                <li><a href="#watchowcs-what">What is OWCS?</a></li>
                <li><a href="#watchowcs-fun">4 highlights</a></li>
                <li><a href="#watchowcs-watch">How to watch</a></li>
                <li><a href="#watchowcs-first">What to watch first</a></li>
                <li><a href="#watchowcs-structure">How the season progresses</a></li>
                <li><a href="#watchowcs-regions">Region notes</a></li>
                <li><a href="#watchowcs-terms">Quick terms</a></li>
                <li><a href="#watchowcs-links">Useful links</a></li>
              </ol>
            `,
            `
              <p><b>このページの内容</b></p>
              <ol>
                <li><a href="#watchowcs-what">OWCSとは？</a></li>
                <li><a href="#watchowcs-fun">4つの見どころ</a></li>
                <li><a href="#watchowcs-watch">OWCSを見てみよう</a></li>
                <li><a href="#watchowcs-first">初めて見るなら</a></li>
                <li><a href="#watchowcs-structure">大会の流れ</a></li>
                <li><a href="#watchowcs-regions">地域の特徴</a></li>
                <li><a href="#watchowcs-terms">これだけ分かれば観戦できる</a></li>
                <li><a href="#watchowcs-links">観戦に役立つリンク</a></li>
              </ol>
            `
          )}
        </nav>
      </header>

      <section class="card faq-card" id="watchowcs-what">
        <h2 class="watchowcs-h2">
          ${siteHeading_("What is OWCS?", "OWCSとは？")}
        </h2>
        ${siteText_(
          `
            <p>
              <b>OWCS (Overwatch Champions Series)</b> is Overwatch’s official
              competitive circuit. Top teams from each region play through their
              local stages; the best advance to world events.
            </p>
            <p>
              Regions include Asia (Japan, Korea, Pacific), China, NA, and EMEA.
              You don’t need to follow every region — “your favorite region +
              world events” is enough at first. Japan, Korea, Asia, and world
              events often have Japanese casts.
            </p>
          `,
          `
            <p>
              <b>OWCS（Overwatch Champions Series）</b> は、世界各地域のトップチームが参加する
              Overwatchの公式競技大会です。
            </p>
            <p>
              Japan・Koreaなどが参加するAsiaをはじめ、China、NA、EMEAで大会が行われ、
              上位チームは世界大会へ進出します。
              全部追う必要はありません。最初は「推しの地域 + 世界大会」で十分です。
              Japan、Korea、Asia、世界大会には日本語実況がついていることが多く、日本人向けでも分かりやすいです。
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-fun">
        <h2 class="watchowcs-h2">
          ${siteHeading_("4 highlights of OWCS", "OWCSの4つの見どころ")}
        </h2>
        ${siteText_(
          `
            <p>
              “Pro matches seem hard…” is a common first impression — but you can enjoy
              OWCS without deep game knowledge.
            </p>

            <h3 class="owcs-fun-subhead">① Japanese casts make matches readable</h3>
            <p>
              JP streams explain not only the fight, but schedule context, teams and
              players to watch, and common comps/tactics.
            </p>
            <p>
              Start the stream from the beginning if you can — you’ll usually pick up
              enough basics for the day. Winner interviews in other languages are often
              summarized in Japanese too.
            </p>

            <h3 class="owcs-fun-subhead">② World-class individual play</h3>
            <p>
              Elite aim, movement, and clutch decisions show up every series.
            </p>
            <p>
              It’s also a five-player team game: full-team voice fights are a spectacle of
              their own.
            </p>

            <h3 class="owcs-fun-subhead">③ Strategy and mind games</h3>
            <p>
              Map plans, hero comps, ult timing, and hero bans shape series beyond aim.
            </p>
            <p>
              Once you can tell when a team “read” the next fight, same-looking
              teamfights get way more interesting.
            </p>

            <h3 class="owcs-fun-subhead">④ Players and stories to root for</h3>
            <p>
              After a few series you’ll naturally pick favorites from style and vibes.
            </p>
            <p>
              Supporting a team or player lets you follow their path through regional and
              world-event stages.
            </p>
          `,
          `
            <p>
              「プロの試合って難しそう……」と感じる人もいますが、
              実際はゲームの知識がなくても十分楽しめます。
            </p>

            <h3 class="owcs-fun-subhead">① 日本語実況で、初めてでも状況が分かる</h3>
            <p>
              日本語配信では、試合内容だけでなく、大会の流れ、注目チーム、選手の特徴、
              現在の構成や戦術も解説されることが多いです。
            </p>
            <p>
              気になる試合は冒頭から見るのがおすすめです。観戦に必要な基本をつかみやすくなります。
              韓国語などの勝利者インタビューも、日本語で内容が紹介されることがあります。
            </p>

            <h3 class="owcs-fun-subhead">② プロ選手の異次元のプレー</h3>
            <p>
              正確なエイム、素早いキャラクター操作、ギリギリの判断など、
              普段の試合ではなかなか見られないプレーが続きます。
            </p>
            <p>
              個人技だけでなく、チーム全員が連携する集団戦も大きな見どころです。
            </p>

            <h3 class="owcs-fun-subhead">③ 作戦と読み合い</h3>
            <p>
              使うヒーロー、攻めるルート、アルティメットのタイミング、ヒーローBANなど、
              試合中には多くの駆け引きがあります。
            </p>
            <p>
              「相手の作戦を読んで先回りした」場面が分かるようになると、さらに面白くなります。
            </p>

            <h3 class="owcs-fun-subhead">④ 応援したい選手やチームが見つかる</h3>
            <p>
              何度か見ると、プレースタイルや雰囲気から自然と気になる選手が見つかります。
            </p>
            <p>
              応援するチームができると、地域大会から世界大会まで続く結果や成長も楽しめます。
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-watch">
        <h2 class="watchowcs-h2">
          ${siteHeading_("Start watching OWCS", "OWCSを見てみよう")}
        </h2>
        ${siteText_(
          `
            <p>Pick the path that matches what you want right now.</p>
          `,
          `
            <p>今の目的に合う入口を選んでください。</p>
          `
        )}

        <div class="watchowcs-action-grid">
          <a class="watchowcs-action-card" href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">
            <span class="watchowcs-action-title">${siteHeading_("Watch a live match", "今まさに試合を見たい")}</span>
            <span class="watchowcs-action-desc">${siteHeading_("Open LIVE filtered to OWCS", "LIVEのOWCS配信一覧へ")}</span>
          </a>
          <a class="watchowcs-action-card" href="/team/overwatch-champions-series">
            <span class="watchowcs-action-title">${siteHeading_("Japanese / regional official casts", "日本語・各地域の公式配信")}</span>
            <span class="watchowcs-action-desc">${siteHeading_("Channel list by region", "地域別・公式チャンネル一覧")}</span>
          </a>
          <a class="watchowcs-action-card" href="https://esports.overwatch.com/en-us/schedule" target="_blank" rel="noopener">
            <span class="watchowcs-action-title">${siteHeading_("Catch up / check schedules", "見逃し・日程を確認")}</span>
            <span class="watchowcs-action-desc">${siteHeading_("Official schedule pages", "公式スケジュール")}</span>
          </a>
          <a class="watchowcs-action-card" href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">
            <span class="watchowcs-action-title">${siteHeading_("Player personal streams", "選手の個人配信も見たい")}</span>
            <span class="watchowcs-action-desc">${siteHeading_("Browse streams on this site", "このサイトで配信を探す")}</span>
          </a>
        </div>

        ${siteText_(
          `
            <h3 class="owcs-fun-subhead">Platforms (free)</h3>
            <ul>
              <li>Twitch</li>
              <li>YouTube</li>
              <li>SOOP (Korea)</li>
              <li>Bilibili (China)</li>
            </ul>
            <p>
              Japanese casts commonly appear for Japan, Korea, Asia, and world events.
              YouTube free archives are great if you miss the live show (Twitch free VODs
              may not always remain).
            </p>
            <p>
              <b>Typical times (JST, approximate):</b>
              Japan Mon–Wed ~18:00 · Pacific Thu ~20:00 · Korea Fri ~17:00 / weekend ~15:00 ·
              China weekend ~18:00 · EMEA/NA weekend from ~02:00.
            </p>
            <p>
              <b>Beginner tip:</b> start with <b>Monday 18:00 (JST) Japan</b>.
            </p>
          `,
          `
            <h3 class="owcs-fun-subhead">配信プラットフォーム（無料）</h3>
            <ul>
              <li>Twitch</li>
              <li>YouTube</li>
              <li>SOOP（韓国）</li>
              <li>Bilibili（中国）</li>
            </ul>
            <p>
              日本語配信がある大会は、OWCS Japan、Korea、Asia、世界大会です。
              リアルタイムで見られない場合は、YouTubeアーカイブがおすすめです
              （Twitchでは無料VODが残らない場合があります）。
            </p>
            <p>
              <b>よくある時間帯（日本時間・目安）:</b>
              Japan 月〜水18時〜 · Pacific 木20時〜 · Korea 金17時〜 / 土日15時〜 ·
              China 土日18時〜 · EMEA/NA 土日深夜2時〜
              （大会によって前後します）
            </p>
            <p>
              <b>まず始めるなら:</b> <b>月曜18時 日本枠</b>に集合！
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-first">
        <h2 class="watchowcs-h2">
          ${siteHeading_("If it’s your first time", "初めて見るなら")}
        </h2>
        ${siteText_(
          `
            <p>Not sure which series to open? Use this shortcut.</p>
            <ul>
              <li>
                <b>Want Japanese casts</b> → OWCS Japan or Asia JP streams
              </li>
              <li>
                <b>Want world-class intensity</b> → Korea, China, or world events
              </li>
              <li>
                <b>Short on time</b> → highlights, or series with close scorelines
              </li>
            </ul>
            <p>
              Also try: pick one team or one player first
              (<a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS</a>),
              or join a watch party (e.g.
              <a href="https://www.twitch.tv/ta1yo" target="_blank" rel="noopener">Ta1yo</a>).
            </p>
            <p>
              Prefer study mode? Use
              <a
                href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                target="_blank"
                rel="noopener"
              >replay codes</a>
              + official VODs, or
              <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">POV uploads by ObsSojourn</a>
              when codes expire (world-event POVs are especially valuable).
            </p>
          `,
          `
            <p>どの試合から見ればいいか迷ったら、次の目安で選べます。</p>
            <ul>
              <li>
                <b>日本語実況で見たい</b> → OWCS Japan または Asia の日本語配信
              </li>
              <li>
                <b>世界トップクラスの試合を見たい</b> → Korea、China、世界大会
              </li>
              <li>
                <b>短時間で見どころを知りたい</b> → ハイライト、または接戦の試合
              </li>
            </ul>
            <p>
              あわせて推しチーム／推し選手を1つ決める
              （<a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS</a>）
              のもおすすめです。知っている配信者のウォッチパーティ
              （例:
              <a href="https://www.twitch.tv/ta1yo" target="_blank" rel="noopener">Ta1yo</a>）
              も初心者に安心です。
            </p>
            <p>
              じっくり見たいなら
              <a
                href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                target="_blank"
                rel="noopener"
              >リプレイコード</a>
              ＋大会アーカイブでのPOV観戦。期限切れ後は
              <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
              のPOV動画が役立ちます（世界大会POVは特に貴重です）。
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-structure">
        <h2 class="watchowcs-h2">
          ${siteHeading_("How OWCS progresses", "OWCSはどう進む？")}
        </h2>
        ${siteText_(
          `
            <p>At a high level, the path looks like this:</p>
          `,
          `
            <p>ざっくり言うと、大会は次の3段階です。</p>
          `
        )}

        <div class="watchowcs-simple-flow" aria-label="Simple OWCS path">
          <div class="watchowcs-simple-step">
            <span class="watchowcs-simple-num">1</span>
            <div>
              <b>${siteHeading_("Regional competition", "地域大会")}</b>
              <p>${siteHeading_("Teams compete inside each region", "各地域でチームが対戦")}</p>
            </div>
          </div>
          <div class="watchowcs-simple-arrow" aria-hidden="true">↓</div>
          <div class="watchowcs-simple-step">
            <span class="watchowcs-simple-num">2</span>
            <div>
              <b>${siteHeading_("Regional tops decided", "地域上位の決定")}</b>
              <p>${siteHeading_("Decide who advances", "上位チームを決定")}</p>
            </div>
          </div>
          <div class="watchowcs-simple-arrow" aria-hidden="true">↓</div>
          <div class="watchowcs-simple-step">
            <span class="watchowcs-simple-num">3</span>
            <div>
              <b>${siteHeading_("World events", "世界大会")}</b>
              <p>${siteHeading_("Regional representatives meet", "各地域の代表が対戦")}</p>
            </div>
          </div>
        </div>

        ${siteText_(
          `
            <p>
              The year usually has about 3–4 stages, each feeding into a world event
              window. Slots and rules differ slightly by world event.
            </p>
            <h3 class="owcs-fun-subhead">Year overview (Jan → Dec)</h3>
          `,
          `
            <p>
              年間はだいたい3〜4ステージあり、それぞれ世界大会につながります。
              進出枠や条件は世界大会ごとに若干異なります。
            </p>
            <h3 class="owcs-fun-subhead">1年の流れ（1月 → 12月）</h3>
          `
        )}
        ${buildOwcsYearFlowHtml_()}

        <details class="watchowcs-details">
          <summary>
            ${siteHeading_("See regional structure in more detail", "地域ごとの詳しい仕組みを見る")}
          </summary>
          ${siteText_(
            `
              <p>
                Each stage typically involves open quals (or FACEIT pathway),
                promo/relegation, regular season, and playoffs. Asia also runs an Asia stage.
              </p>
            `,
            `
              <p>
                各ステージの中身は、だいたいオープン予選（またはFACEIT経路）、昇格戦・降格戦、
                総当たり戦、トーナメント戦、という流れです。Asiaにはアジア大会もあります。
              </p>
            `
          )}
          ${buildOwcsSeasonFlowHtml_()}
          ${siteText_(
            `
              <div class="owcs-flow-aside">
                <p>
                  <b>Q: Do Japanese teams make world events?</b><br>
                  <b>A:</b> Sometimes yes. On flowchart-style Asia seasons, Korea often
                  advances ~99% of the time — but formats like summer Midseason Championship
                  (EWC) can give Japan/Pacific direct paths.
                </p>
              </div>
            `,
            `
              <div class="owcs-flow-aside">
                <p>
                  <b>Q: 日本チームは世界大会に出場してる？</b><br>
                  <b>A:</b> 出場している時もあります。
                  フロー図形式のアジアでは韓国進出が多い一方、
                  夏季の Midseason Championship（EWC）などでは
                  日本・パシフィック1位が直接進出できる形式もあります。
                </p>
              </div>
            `
          )}
        </details>
      </section>

      <section class="card faq-card" id="watchowcs-regions">
        <h2 class="watchowcs-h2">
          ${siteHeading_("Region notes", "地域の特徴")}
        </h2>
        ${siteText_(
          `
            <ul>
              <li><b>Asia</b> — Japan, Korea, and Pacific compete (with an Asia stage)</li>
              <li><b>China</b> — China’s own regional path</li>
              <li><b>NA</b> — North America</li>
              <li><b>EMEA</b> — Europe, Middle East, and Africa</li>
            </ul>
            <p>
              Strength and style shift by meta and season. Korea often draws attention
              for high mechanical skill and fast teamfights — but every stage has upsets,
              and regions like EMEA have been rising too.
            </p>
          `,
          `
            <ul>
              <li><b>Asia</b> — Japan、Korea、Pacific（アジア大会あり）</li>
              <li><b>China</b> — 中国地域の大会</li>
              <li><b>NA</b> — 北米</li>
              <li><b>EMEA</b> — ヨーロッパ・中東・アフリカ</li>
            </ul>
            <p>
              強さやプレースタイルはシーズン・メタで変わります。
              Koreaでは素早い集団戦や高い個人技が注目されることが多い一方、
              毎ステージ番狂わせもあり、EMEAも近年強さを見せています。
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-terms">
        <h2 class="watchowcs-h2">
          ${siteHeading_("Terms that make streams readable", "これだけ分かれば観戦できる")}
        </h2>
        ${siteText_(
          `
            <div class="watchowcs-glossary-wrap">
              <table class="howto-glossary watchowcs-glossary">
                <thead>
                  <tr><th>Term</th><th>Simple meaning</th></tr>
                </thead>
                <tbody>
                  <tr><td>Meta</td><td>Common strong comps / play styles that period</td></tr>
                  <tr><td>Comp</td><td>The five-hero lineup a team locks</td></tr>
                  <tr><td>Ult / ULT</td><td>Ultimate ability</td></tr>
                  <tr><td>Teamfight</td><td>Both teams committing into one fight</td></tr>
                  <tr><td>Map take</td><td>Winning that map</td></tr>
                  <tr><td>BO5</td><td>First to 3 maps wins the series</td></tr>
                  <tr><td>Ban</td><td>Heroes locked out before map play</td></tr>
                  <tr><td>POV</td><td>Player camera / player-eye VOD</td></tr>
                </tbody>
              </table>
            </div>
          `,
          `
            <div class="watchowcs-glossary-wrap">
              <table class="howto-glossary watchowcs-glossary">
                <thead>
                  <tr><th>用語</th><th>簡単な説明</th></tr>
                </thead>
                <tbody>
                  <tr><td>メタ</td><td>その時期によく使われる強い構成や戦い方</td></tr>
                  <tr><td>構成</td><td>チームが選んだヒーローの組み合わせ</td></tr>
                  <tr><td>ウルト／ULT</td><td>アルティメット・アビリティ</td></tr>
                  <tr><td>集団戦</td><td>両チームがまとまって戦う場面</td></tr>
                  <tr><td>マップ取得</td><td>そのマップで勝利すること</td></tr>
                  <tr><td>BO5</td><td>先に3マップ取ったチームが勝つ形式</td></tr>
                  <tr><td>BAN</td><td>マップ前に使用を封じるヒーロー指定</td></tr>
                  <tr><td>POV</td><td>選手視点の映像</td></tr>
                </tbody>
              </table>
            </div>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-links">
        <h2 class="watchowcs-h2">
          ${siteHeading_("Links for watching", "観戦に役立つリンク")}
        </h2>
        ${siteText_(
          `
            <ul class="watchowcs-linklist">
              <li><a href="/team/overwatch-champions-series">Official stream channels by region</a></li>
              <li><a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">Find live OWCS streams on this site</a></li>
              <li><a href="https://esports.overwatch.com/en-us/schedule" target="_blank" rel="noopener">Official OWCS schedule</a></li>
              <li><a href="https://liquipedia.net/overwatch/Main_Page" target="_blank" rel="noopener">Liquipedia (times, brackets, results)</a></li>
              <li><a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">USEFUL LINKS (schedule, X, tools, more)</a></li>
              <li><a href="/howto" onclick="openStaticView_('howto'); return false;">HOW TO USE (including translation tips)</a></li>
              <li><a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS / player discovery</a></li>
            </ul>
          `,
          `
            <ul class="watchowcs-linklist">
              <li><a href="/team/overwatch-champions-series">OWCS公式配信チャンネル一覧（地域別）</a></li>
              <li><a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">今見られるOWCS配信を探す（LIVE）</a></li>
              <li><a href="https://esports.overwatch.com/en-us/schedule" target="_blank" rel="noopener">OWCS公式スケジュール</a></li>
              <li><a href="https://liquipedia.net/overwatch/Main_Page" target="_blank" rel="noopener">Liquipedia（時刻・トーナメント・結果）</a></li>
              <li><a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">観戦に役立つリンク集（公式X・ツールなど）</a></li>
              <li><a href="/howto" onclick="openStaticView_('howto'); return false;">HOW TO USE（翻訳の使い方など）</a></li>
              <li><a href="/teams" onclick="openTeamsFromGuide_(); return false;">TEAMS / 選手を探す</a></li>
            </ul>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-faq">
        <h2 class="watchowcs-h2">
          ${siteHeading_("FAQ", "よくある質問")}
        </h2>
        ${siteText_(
          `
            <p><b>Can I enjoy OWCS if I don’t play Overwatch?</b></p>
            <p>
              Yes — skill and story work like watching soccer even when rules are fuzzy
              at first.
            </p>
            <hr>
            <p><b>Is this the same as OWL?</b></p>
            <p>OWCS launched in 2024 as the successor to the Overwatch League.</p>
            <hr>
            <p><b>Is Korea really that strong?</b></p>
            <p>
              Korea is often a deep, high-skill region central to internationals — but
              upsets happen every stage, and other regions stay competitive.
            </p>
          `,
          `
            <p><b>ゲームをやってなくても楽しめる？</b></p>
            <p>
              楽しめます。最初はルールが曖昧でも、「上手さ」と「物語」で十分観戦できます。
            </p>
            <hr>
            <p><b>OWLとは違うの？</b></p>
            <p>
              OWCSは、オーバーウォッチリーグの後継として2024年に導入されました。
            </p>
            <hr>
            <p><b>韓国が強いって本当？</b></p>
            <p>
              高い個人技と早い集団戦で注目されやすい地域です。
              ただし毎ステージ番狂わせもあり、他地域も強いです。
            </p>
          `
        )}
      </section>

      <section class="card faq-card howto-wip-card">
        ${siteText_(
          `
            <p>
              Official reading:
              <a href="https://overwatch.blizzard.com/en-us/news/24033788/the-future-of-overwatch-esports/" target="_blank" rel="noopener">The Future of Overwatch Esports</a>
              ·
              <a href="https://esports.overwatch.com/en-us/news" target="_blank" rel="noopener">Overwatch Esports News</a>
            </p>
            <p class="watchowcs-updated">
              This guide is maintained for beginners and may be updated as formats change.
            </p>
          `,
          `
            <p>
              公式の参考:
              <a href="https://overwatch.blizzard.com/en-us/news/24033788/the-future-of-overwatch-esports/" target="_blank" rel="noopener">The Future of Overwatch Esports</a>
              ·
              <a href="https://esports.overwatch.com/en-us/news" target="_blank" rel="noopener">Overwatch Esports News</a>
            </p>
            <p class="watchowcs-updated">
              このページは初心者向けに随時更新します。大会形式は年によって変わることがあります。
            </p>
          `
        )}
      </section>

    </main>
  `;
}

/**
 * Year overview flowchart (Jan → Dec stages + world events).
 * Site Text: en | jp | both.
 */
function buildOwcsYearFlowHtml_() {
  const mode =
    typeof getSiteTextLanguageMode_ === "function"
      ? getSiteTextLanguageMode_()
      : "both";

  if (mode === "en") {
    return buildOwcsYearFlowDiagram_("en");
  }

  if (mode === "jp") {
    return buildOwcsYearFlowDiagram_("jp");
  }

  return `
    ${buildOwcsYearFlowDiagram_("en")}
    <hr class="owcs-flow-lang-sep">
    ${buildOwcsYearFlowDiagram_("jp")}
  `;
}

function buildOwcsYearFlowDiagram_(lang) {
  const L = lang === "jp" ? OWCS_YEAR_FLOW_COPY_JP_ : OWCS_YEAR_FLOW_COPY_EN_;
  const docLang = lang === "jp" ? "ja" : "en";
  const arrow = `<span class="owcs-year-flow-arrow" aria-hidden="true">→</span>`;
  const arrowV = `<span class="owcs-year-flow-arrow owcs-year-flow-arrow-v" aria-hidden="true">↓</span>`;

  const box = (text, extraClass = "") =>
    `<div class="owcs-year-flow-box ${extraClass}"><span>${text}</span></div>`;

  return `
    <div class="owcs-year-flow" lang="${docLang}" aria-label="${L.aria}">
      <div class="owcs-year-flow-range">
        <span class="owcs-year-flow-month">${L.jan}</span>
        <span class="owcs-year-flow-range-line" aria-hidden="true"></span>
        <span class="owcs-year-flow-month">${L.dec}</span>
      </div>
      <div class="owcs-year-flow-track">
        ${box(L.stage1, "owcs-year-flow-box-stage")}
        ${arrow}${arrowV}
        ${box(L.world, "owcs-year-flow-box-world")}
        ${arrow}${arrowV}
        ${box(L.stage2, "owcs-year-flow-box-stage")}
        ${arrow}${arrowV}
        ${box(L.world, "owcs-year-flow-box-world")}
        ${arrow}${arrowV}
        ${box(L.stage3, "owcs-year-flow-box-stage")}
        ${arrow}${arrowV}
        ${box(L.worldFinals, "owcs-year-flow-box-world owcs-year-flow-box-finals")}
      </div>
      <p class="owcs-year-flow-note">${L.note}</p>
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

const OWCS_YEAR_FLOW_COPY_EN_ = {
  aria: "OWCS year overview",
  jan: "Jan",
  dec: "Dec",
  stage1: "Stage 1",
  stage2: "Stage 2",
  stage3: "Stage 3",
  world: "World event",
  worldFinals: "World event<br>(World Finals)",
  note: "Open Qualifiers and promo / relegation happen around each stage (details below)."
};

const OWCS_YEAR_FLOW_COPY_JP_ = {
  aria: "OWCS 1年の流れ",
  jan: "1月",
  dec: "12月",
  stage1: "ステージ1",
  stage2: "ステージ2",
  stage3: "ステージ3",
  world: "世界大会",
  worldFinals: "世界大会<br>(World Finals)",
  note: "各ステージ前後にはオープン予選や昇格戦・降格戦などもあります（詳細は下図）。"
};

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
    "【FACEIT League】 NA · EMEA · Oceania · South America<br>(Open → Advanced → Expert → Master)",
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
    "【FACEIT League】 NA・EMEA・Oceania・SouthAmerica<br>(Open→Advanced→Expert→Master）",
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
