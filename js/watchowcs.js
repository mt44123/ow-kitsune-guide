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

      <div class="card faq-card howto-wip-card">
        <h3>
          ${siteHeading_("📝 Work in progress", "📝 執筆中です")}
        </h3>
        ${siteText_(
          `
            <p>
              This guide is still being written. Content may change or expand.
            </p>
            <p class="owcs-sitetext-tip">
              Tip: Open the ⚙ menu (top right) and set <b>Site Text</b> to
              English or Japanese only — it’s much easier to read.
            </p>
            <p class="watchowcs-updated">Last updated: August 5, 2026</p>
          `,
          `
            <p>
              このページは現在執筆中です。内容は今後追加・修正していく予定です。
            </p>
            <p class="owcs-sitetext-tip">
              右上の⚙マークから、<b>Site Text</b>設定を英/日どちらかに切り替えると読みやすいです。
            </p>
            <p class="watchowcs-updated">更新日：2026年8月5日</p>
          `
        )}
      </div>

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

        ${siteText_(
          `
            <ul>
              <li>Japanese casts available</li>
              <li>No competitive knowledge required</li>
              <li>Free to watch</li>
            </ul>
          `,
          `
            <ul>
              <li>日本語配信あり</li>
              <li>競技知識がなくても楽しめる</li>
              <li>無料で視聴できる</li>
            </ul>
          `
        )}

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
            <p>
              Tip: Open the ⚙ menu (top right) and set Site Text to
              English or Japanese only — it’s much easier to read.
            </p>
          `,
          `
            <p>
              右上の⚙マークから、Site Text設定を英/日どちらかに切り替えると読みやすいです。
            </p>
          `
        )}

        <nav class="watchowcs-toc" aria-label="On this page">
          ${siteText_(
            `
              <p><b>On this page</b></p>
              <ol>
                <li><a href="#watchowcs-what">What is OWCS?</a></li>
                <li><a href="#watchowcs-fun">3 highlights</a></li>
                <li><a href="#watchowcs-watch">How to watch</a></li>
                <li><a href="#watchowcs-first">What to watch first</a></li>
                <li><a href="#watchowcs-structure">How the season progresses</a></li>
                <li><a href="#watchowcs-site">What you can do on this site</a></li>
              </ol>
            `,
            `
              <p><b>このページの内容</b></p>
              <ol>
                <li><a href="#watchowcs-what">OWCSとは？</a></li>
                <li><a href="#watchowcs-fun">3つの見どころ</a></li>
                <li><a href="#watchowcs-watch">OWCSを見てみよう</a></li>
                <li><a href="#watchowcs-first">初めて見るなら</a></li>
                <li><a href="#watchowcs-structure">OWCSの流れ</a></li>
                <li><a href="#watchowcs-site">このサイトでできること</a></li>
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
              esports competition. Top teams from each region play through their
              local stages; the best advance to world events.
            </p>
            <p>
              Regions include Asia (with Japan), China, NA, and EMEA.
            </p>
            <p>
              <a href="#watchowcs-structure">👉 How OWCS progresses (below)</a>
            </p>
            <p>
              You don’t need to follow everything — starting with “your favorites’
              matches” is enough.
            </p>
          `,
          `
            <p>
              <b>OWCS（Overwatch Champions Series）</b> は、世界各地域のトップチームが参加する
              Overwatchの公式esports大会です。
            </p>
            <p>
              日本が参加するAsiaをはじめ、China、NA、EMEAで大会が行われ、
              上位チームは世界大会へ進出します。
            </p>
            <p>
              <a href="#watchowcs-structure">👉OWCSの流れ（後述）</a>
            </p>
            <p>
              全部追う必要はありません。最初は「推しの試合」だけで十分です。
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-fun">
        <h2 class="watchowcs-h2">
          ${siteHeading_("3 highlights of OWCS", "OWCSの3つの見どころ")}
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
              Start with any OWCS stream from the beginning —
              pro casters walk through the basics you need every time.
            </p>

            <h3 class="owcs-fun-subhead">② World-class super plays</h3>
            <p>
              Elite aim, movement, and clutch decisions show up every series —
              super plays you rarely see in regular games.
            </p>
            <p>
              It’s also a five-player team game: full-team voice fights are a spectacle of
              their own.
            </p>

            <h3 class="owcs-fun-subhead">③ Find favorites you’ll root for</h3>
            <p>
              Watching OWCS naturally creates “I want to root for this player / team”
              moments — and that makes every series more fun.
            </p>
            <ul class="watchowcs-tip-list">
              <li>
                <span class="watchowcs-tip-label">Winner interviews after maps</span>
                <span class="watchowcs-tip-note">(not for Japan and Pacific)</span>
                <span class="watchowcs-tip-body">
                  Players revisit the series, talk about teammates, or discuss the meta —
                  sides of the game you don’t see only from kill feed.
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">Player face cams</span>
                <span class="watchowcs-tip-note">(offline / LAN events only)</span>
                <span class="watchowcs-tip-body">
                  Grins after pop-offs, fist pumps in huge wins, frustration after tough
                  losses — emotions come through clearly.
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">Player and team stories</span>
                <span class="watchowcs-tip-body">
                  Behind every series are long-time rivalries, underdog championship
                  runs, and do-or-die series for a world-event spot.
                </span>
              </li>
            </ul>
            <p>
              Knowing the effort, heartbreak, and hunger for wins often leaves you
              pulling for both sides. Pro casters also explain this context as the
              show goes on.
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
              どれでもいいので、OWCSの配信を一度冒頭から見てみるのがおすすめです。
              プロのキャスターが観戦に必要な基本を毎回解説しています。
            </p>

            <h3 class="owcs-fun-subhead">② プロ選手の異次元のプレー</h3>
            <p>
              正確なエイム、素早いキャラクター操作、ギリギリの判断など、
              普段の試合ではなかなか見られないスーパープレーが続きます。
            </p>
            <p>
              個人技だけでなく、チーム全員が連携する集団戦も大きな見どころです。
            </p>

            <h3 class="owcs-fun-subhead">③ 推しが見つかる</h3>
            <p>
              OWCSを見ることで、「この選手・このチームを応援したい」という気持ちが自然と生まれ、
              観戦がさらに楽しくなります。
            </p>
            <ul class="watchowcs-tip-list">
              <li>
                <span class="watchowcs-tip-label">試合後の勝利者インタビュー</span>
                <span class="watchowcs-tip-note">（JapanとPacificはありません）</span>
                <span class="watchowcs-tip-body">
                  選手が試合を振り返ったり、チームメイトへの思いを語ったり、
                  現在のメタについて話したりと、ゲーム内では見えない一面を知ることができます。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">各選手のフェイスカメラ</span>
                <span class="watchowcs-tip-note">（オフライン大会のみ）</span>
                <span class="watchowcs-tip-body">
                  スーパープレイを決めて思わず笑顔になる瞬間、劇的な勝利にガッツポーズをする瞬間、
                  敗戦を受け止めて悔しそうな表情を見せる瞬間まで、選手たちの感情がリアルに伝わってきます。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">選手やチームのストーリー</span>
                <span class="watchowcs-tip-body">
                  試合の裏には、長年のライバル対決、新人チームの下剋上、
                  世界大会出場をかけた一戦など、それぞれの物語があります。
                </span>
              </li>
            </ul>
            <p>
              選手たちが積み重ねてきた努力や悔しさ、そして勝利への思いを知ると、
              「どちらにも勝ってほしい」と感じるような試合も少なくありません。
              こうした背景まで、プロのキャスターが解説してくれます。
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
            <h3 class="owcs-fun-subhead">Platforms (free)</h3>
            <ul>
              <li>Twitch</li>
              <li>YouTube</li>
              <li>SOOP (Korea)</li>
              <li>Bilibili (China)</li>
            </ul>
            <p>
              Japanese casts are available for OWCS Japan, Korea, Asia, and world events.
            </p>
            <p>
              <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                👉 Links for watching OWCS
              </a>
            </p>
            <p>
              If you can’t watch live, archives are recommended
              (Twitch free VODs may not always remain).
            </p>
            <ul>
              <li>
                <a href="https://www.youtube.com/@ow_esports/streams" target="_blank" rel="noopener">
                  English cast (EMEA / NA / world) — YouTube
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@ow_esports_jp/streams" target="_blank" rel="noopener">
                  Japanese cast (Japan / Korea / Asia / world) — YouTube
                </a>
              </li>
              <li>
                <a href="https://www.sooplive.com/station/owesports/vod/review" target="_blank" rel="noopener">
                  Korean cast (Korea / Asia / world) — SOOP
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@roofesports/streams" target="_blank" rel="noopener">
                  Thai cast (Pacific) — YouTube
                </a>
              </li>
            </ul>
            ${buildOwcsLocalWatchTimesHtml_()}
            <p>
              For exact times, check official X or Liquipedia.<br>
              <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                👉 Links for watching OWCS
              </a>
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
            </p>
            <p>
              <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                👉 OWCS観戦に役立つリンク集
              </a>
            </p>
            <p>
              リアルタイムで見られない場合は、YouTubeアーカイブがおすすめです
              （Twitchでは無料VODが残らない場合があります）。
            </p>
            <ul>
              <li>
                <a href="https://www.youtube.com/@ow_esports/streams" target="_blank" rel="noopener">
                  英語実況（EMEA / NA / 世界）— YouTube
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@ow_esports_jp/streams" target="_blank" rel="noopener">
                  日本語実況（Japan / Korea / Asia / 世界）— YouTube
                </a>
              </li>
              <li>
                <a href="https://www.sooplive.com/station/owesports/vod/review" target="_blank" rel="noopener">
                  韓国語実況（Korea / Asia / 世界）— SOOP
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@roofesports/streams" target="_blank" rel="noopener">
                  タイ語実況（Pacific）— YouTube
                </a>
              </li>
            </ul>
            <h3 class="owcs-fun-subhead">リアルタイムで観戦できる時間帯（日本時間・目安）</h3>
            <ul>
              <li><b>Japan</b> — 月〜水 18時〜</li>
              <li><b>Pacific</b> — 木 20時〜</li>
              <li><b>Korea</b> — 金 17時〜 / 土日 15時〜</li>
              <li><b>China</b> — 土日 18時〜</li>
              <li><b>EMEA / NA</b> — 土日 深夜2時〜</li>
            </ul>
            <p>
              正確に確認したい場合、公式X、またはLiquipediaを確認しましょう。<br>
              <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                👉 OWCS観戦に役立つリンク集
              </a>
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
            <ul class="watchowcs-tip-list watchowcs-tip-list-accordion">
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Want Japanese casts</summary>
                  <span class="watchowcs-tip-body">
                    Japanese streams are also available for OWCS Japan, Korea, Asia, and world events.
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Want top-tier matches</summary>
                  <span class="watchowcs-tip-body">
                    OWCS Korea and international events are a great place to start.
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Want highlight-heavy series</summary>
                  <span class="watchowcs-tip-body">
                    In OWCS, even small skill gaps often finish 3–0.
                    Series that go to 3–2 are often the ones you can’t stop watching.
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Want to study pro play</summary>
                  <span class="watchowcs-tip-body">
                    OWCS publishes
                    <a
                      href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                      target="_blank"
                      rel="noopener"
                    >replay codes</a>.
                    After codes expire,
                    <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
                    POV videos help a lot
                    (world-event codes aren’t viewable for the public, so those POVs are especially valuable).
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Official cams jump around too fast</summary>
                  <span class="watchowcs-tip-body">
                    OWCS publishes
                    <a
                      href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                      target="_blank"
                      rel="noopener"
                    >replay codes</a>.
                    After codes expire,
                    <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
                    POV videos help a lot
                    (world-event codes aren’t viewable for the public, so those POVs are especially valuable).
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Want more fun</summary>
                  <span class="watchowcs-tip-body">
                    Join Twitch channel-point win predictions.<br>
                    Watch with a streamer watch party — for Japanese streams, KR &amp; JP are
                    often covered by
                    <a href="https://www.twitch.tv/ta1yo_tv" target="_blank" rel="noopener">Ta1yo</a>;
                    EMEA &amp; NA are usually covered almost every time by official caster
                    <a href="https://www.twitch.tv/hoshimi0000" target="_blank" rel="noopener">hoshimi</a>.
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">Want your favorites’ games</summary>
                  <span class="watchowcs-tip-body">
                    Open a Liquipedia player or team page — match schedules sit at the top.
                    On this site, tap a player or team name to open Liquipedia.<br>
                    Fan Discords also often share which events that player is entering.
                  </span>
                </details>
              </li>
            </ul>
            <p>There’s no single “right” way to watch.</p>
            <p>Start with whatever looks fun and jump in casually.</p>
            <p>
              Rules and flow can sink in while you watch.
              Finding a style that fits you makes it easier to keep enjoying OWCS longer.
            </p>
          `,
          `
            <ul class="watchowcs-tip-list watchowcs-tip-list-accordion">
              <li>
                <details>
                  <summary class="watchowcs-tip-label">日本語実況で見たい</summary>
                  <span class="watchowcs-tip-body">
                    OWCS Japan・Korea・Asia・世界大会では、日本語配信もお届けされています。
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">トップクラスの試合を見たい</summary>
                  <span class="watchowcs-tip-body">
                    OWCS Korea や国際大会がおすすめです。
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">見どころある試合を見たい</summary>
                  <span class="watchowcs-tip-body">
                    OWCSでは、わずかな実力差でも3-0になることが多いです。
                    3-2までもつれた試合は、最後まで目が離せない好ゲームが多いです。
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">プロを参考にプレイを研究したい</summary>
                  <span class="watchowcs-tip-body">
                    OWCSは
                    <a
                      href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                      target="_blank"
                      rel="noopener"
                    >リプレイコード</a>
                    が公開されています。<br>
                    リプレイコードの期限切れ後は
                    <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
                    のPOV動画が役立ちます
                    （世界大会のリプレイコードは関係者以外視聴不可の為、特に貴重です）。
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">公式配信は視点がコロコロ変わってよくわからない</summary>
                  <span class="watchowcs-tip-body">
                    OWCSは
                    <a
                      href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                      target="_blank"
                      rel="noopener"
                    >リプレイコード</a>
                    が公開されています。<br>
                    リプレイコードの期限切れ後は
                    <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
                    のPOV動画が役立ちます
                    （世界大会のリプレイコードは関係者以外視聴不可の為、特に貴重です）。
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">楽しく見たい</summary>
                  <span class="watchowcs-tip-body">
                    Twitchのチャンネルポイントによる勝敗予想に参加できます。<br>
                    配信者のウォッチパーティで見てみるのもおすすめです。
                    日本語なら、KR・JPは
                    <a href="https://www.twitch.tv/ta1yo_tv" target="_blank" rel="noopener">Ta1yo</a>、
                    EMEA・NAは公式キャスターの
                    <a href="https://www.twitch.tv/hoshimi0000" target="_blank" rel="noopener">hoshimi</a>
                    がほぼ毎回配信してくれています。
                  </span>
                </details>
              </li>
              <li>
                <details>
                  <summary class="watchowcs-tip-label">推しの試合を見たい</summary>
                  <span class="watchowcs-tip-body">
                    Liquipediaの選手ページ・チームページを開くと、上部に試合予定が表示されます。
                    このサイトでは、チーム名や選手名をクリックするとLiquipediaを開けます。<br>
                    あわせて、推し選手のファンDiscordに入ると、どの大会に出るか教えてもらえることも多いです。
                  </span>
                </details>
              </li>
            </ul>
            <p>どう見るのが正しい、という決まりはありません。</p>
            <p>まずは、好きそうなところから気軽に覗いてみてください。</p>
            <p>
              ルールや流れは、観戦しながら覚えていけば大丈夫です。
              自分に合った楽しみ方が見つかると、もっと長く続けやすくなります。
            </p>
          `
        )}
      </section>

      <section class="card faq-card" id="watchowcs-structure">
        <h2 class="watchowcs-h2">
          ${siteHeading_("How OWCS progresses", "OWCSの流れ")}
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
              The year usually has about 3 stages, each feeding into a world event.
              In other words, there are about 3 chances each year to chase the #1 team
              in the world. Slots and rules differ slightly by world event.
            </p>
            <h3 class="owcs-fun-subhead">Year overview (Jan → Dec)</h3>
          `,
          `
            <p>
              年間はだいたい3ステージあり、それぞれ世界大会につながります。
              つまり年3回世界一のチームを目指せます。
              進出枠や条件は世界大会ごとに若干異なります。
            </p>
            <h3 class="owcs-fun-subhead">1年の流れ（1月 → 12月）</h3>
          `
        )}
        ${buildOwcsYearFlowHtml_()}

        <div class="watchowcs-region-detail" id="watchowcs-region-detail">
          <h3 class="owcs-fun-subhead">
            ${siteHeading_("Regional structure in more detail", "地域ごとの詳しい仕組み")}
          </h3>
          ${siteText_(
            `
              <p>Each stage typically follows this path:</p>
              <ul>
                <li>Open Qualifier (or FACEIT pathway in some regions)</li>
                <li>Promotion &amp; Relegation</li>
                <li>Regular Season (Group Stage when teams are split into groups; Korea also has Seeding Decider matches that set tournament seeding)</li>
                <li>Playoffs (Korea also has an LCQ tournament that decides advancement for lower Round Robin teams)</li>
              </ul>
            `,
            `
              <p>各ステージの中身は、だいたい次の流れです。</p>
              <ul>
                <li>オープン予選（オープン・クオリファイア）※または FACEIT 経路</li>
                <li>昇格戦・降格戦（プロモーション・レリゲーション）</li>
                <li>総当たり戦（レギュラーシーズン。グループ分けされる場合はグループステージ。Koreaにはシーディングディサイダーというトーナメント戦での位置を決めるマッチもある）</li>
                <li>トーナメント戦（プレイオフ・KoreaにはLCQという総当たり戦下位チームの進退を決めるトーナメントもある）</li>
              </ul>
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
                <p>
                  <b>Q: Do teams have players from overseas?</b><br>
                  <b>A:</b> Yes. In OWCS, teams can roster up to two players from other regions.
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
                <p>
                  <b>Q: チームに海外出身の選手が居る？</b><br>
                  <b>A:</b> はい。OWCSでは、最大2名まで他地域の選手が所属できます。
                </p>
              </div>
            `
          )}
        </div>
      </section>

      <section class="card faq-card" id="watchowcs-site">
        <h2 class="watchowcs-h2">
          ${siteHeading_("What you can do on this site", "このサイトでできること")}
        </h2>
        ${siteText_(
          `
            <p>
              After watching OWCS, use this site to find favorites and keep following them.
            </p>
            <ul class="watchowcs-tip-list">
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/playerlinks" onclick="openPlayerlinksFromGuide_(); return false;">
                    Find channels &amp; socials — PLAYERS
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Open a player page to check stream and SNS links
                  (Twitch / CHZZK / SOOP / YouTube and more).
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/goats" onclick="openFavoritesFromGuide_(); return false;">
                    Register favorites to ★ MY GOATS
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Tap ☆ / ★ on a card to save players. Then use the ★ tab on LIVE /
                  media, or Live Notifications → MY GOATS, to catch them easily.
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">
                    Watch favorites live — LIVE
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Spot who’s live, including
                  <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">OWCS</a>
                  filters during events, and personal streams from pros.
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/youtube" onclick="openMediaFromGuide_(); return false;">
                    Watch favorites’ clips &amp; videos — CLIP&amp;YOUTUBE
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Twitch has clips — and CHZZK / SOOP do too.
                  Browse them together on CLIP&amp;YOUTUBE.
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                    USEFUL LINKS — schedules &amp; more
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Official schedule, cast channels, Liquipedia, and replay codes —
                  handy for watching and studying matches.
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/howto" onclick="openStaticView_('howto'); return false;">
                    HOW TO USE — site guide
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Filters, search, ★ MY GOATS, ◆ MUTED, and more —
                  the full tour of this site lives there.
                </span>
              </li>
            </ul>
          `,
          `
            <p>
              OWCSを見たら、このサイトで推しを見つけて追いかけやすくできます。
            </p>
            <ul class="watchowcs-tip-list">
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/playerlinks" onclick="openPlayerlinksFromGuide_(); return false;">
                    推しのチャンネル・SNSを探す — PLAYERS
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  選手ページを開くと、Twitch / CHZZK / SOOP / YouTube や SNS のリンクを確認できます。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/goats" onclick="openFavoritesFromGuide_(); return false;">
                    推しを★ MY GOATS に登録する
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  カードの ☆ / ★ でお気に入り保存。LIVE やメディアの ★ タブ、
                  通知の MY GOATS で推しを追いやすくなります。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">
                    推しの配信を見る — LIVE
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  今配信中の選手をチェック。大会中は
                  <a href="/owcs" onclick="openOwcsLiveFromGuide_(); return false;">OWCS</a>
                  フィルタ、普段はプロの個人配信も探せます。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/youtube" onclick="openMediaFromGuide_(); return false;">
                    推しのクリップ・動画を見る — CLIP&amp;YOUTUBE
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  Twitchにあるクリップ機能は、CHZZKやSOOPにもあります。
                  CLIP&amp;YOUTUBEでまとめて確認できます。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                    USEFUL LINKS — 観戦に役立つリンク
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  公式スケジュール、配信チャンネル、Liquipedia、リプレイコードなど、
                  観戦や研究に便利なサイトをまとめています。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">
                  <a href="/howto" onclick="openStaticView_('howto'); return false;">
                    HOW TO USE — サイトの使い方
                  </a>
                </span>
                <span class="watchowcs-tip-body">
                  フィルター、検索、★ MY GOATS、◆ MUTED など、
                  このサイト全体の使い方はこちらです。
                </span>
              </li>
            </ul>
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
    ${dCell(row, 3, owcsFlowBox_(openTitle, L.openNoOfficialCast, "owcs-flow-box-open"))}
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
        ${dCell(4, 3, owcsFlowBox_(L.cnOpen, L.openNoOfficialCast, "owcs-flow-box-open"), "", 3)}
        ${dArrow(4, 6)}
        ${dCell(4, 7, owcsFlowBox_(L.cnMain, L.cnStagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-cn"), "", 3)}

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
              owcsFlowBox_(L.krOpen, L.openNoOfficialCast, "owcs-flow-box-open"),
              owcsFlowBox_(L.promo, L.promoAsiaNote, "owcs-flow-box-soft"),
              owcsFlowBox_(L.krRegional, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-kr"),
              owcsFlowBox_(L.asiaChampTitle, L.asiaNote, "owcs-flow-box-owcs owcs-flow-box-owcs-asia"),
              owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
            ])}
            ${mobileTrack("jp", L.jp, [
              owcsFlowBox_(L.jpOpen, L.openNoOfficialCast, "owcs-flow-box-open"),
              owcsFlowBox_(L.promo, L.promoAsiaNote, "owcs-flow-box-soft"),
              owcsFlowBox_(L.jpRegional, L.stagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-jp"),
              owcsFlowBox_(L.asiaChampTitle, L.asiaNote, "owcs-flow-box-owcs owcs-flow-box-owcs-asia"),
              owcsFlowBox_(L.worldTitle, L.worldEvents, "owcs-flow-box-owcs owcs-flow-box-owcs-world")
            ])}
            ${mobileTrack("pac", L.pac, [
              owcsFlowBox_(L.pacOpen, L.openNoOfficialCast, "owcs-flow-box-open"),
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
            owcsFlowBox_(L.cnOpen, L.openNoOfficialCast, "owcs-flow-box-open"),
            owcsFlowBox_(L.cnMain, L.cnStagePath, "owcs-flow-box-owcs owcs-flow-box-owcs-cn"),
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
  promoAsiaNote:
    "Open Quals top teams vs last season’s lower teams<br>※ No official cast. Player personal streams only.",
  promoFaceitNote: "FACEIT League Master top teams vs last season’s lower teams",
  krOpen: "Korea Open Quals",
  jpOpen: "Japan Open Quals",
  pacOpen: "Pacific Open Quals",
  krRegional: "OWCS Korea<br>(offline)",
  jpRegional: "OWCS Japan",
  pacRegional: "OWCS Pacific",
  stagePath: "Round robin → tournament<br>Top 2 advance",
  asiaChampTitle: "OWCS Asia<br>(offline)",
  asiaNote: "Group round robin → tournament<br>Top 2 advance",
  cnOpen: "China Open Quals",
  cnMain: "OWCS China",
  cnStagePath: "Swiss-style tournament → round robin → tournament",
  openNoOfficialCast: "※ No official cast. Player personal streams only.",
  faceit: "FACEIT League<br>Master",
  faceitBar: "FACEIT",
  faceitLabel: "FACEIT",
  faceitInfoTitle:
    "【FACEIT League】 NA · EMEA · Oceania · South America<br>(Open → Advanced → Expert → Master)",
  faceitInfoBody:
    "A second-division style pathway that runs alongside OWCS.<br>Like OWCS, each tier runs round robin → playoffs every season.<br>※ Not present in the Asia region.<br>※ No official cast. Check match times on Liquipedia — if a player is streaming personally or a FACEIT caster is on that day, you can watch there.",
  naMain: "OWCS NA",
  emeaMain: "OWCS EMEA",
  worldTitle: "OWCS World Events<br>(offline)",
  worldEvents: "Champions Clash · Midseason Championship · World Finals<br>Tournament"
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
  promoAsiaNote:
    "オープン予選上位チーム VS 前シーズン下位チーム<br>※公式配信はありません。選手の個人配信のみ。",
  promoFaceitNote: "FACEIT League Master 上位チーム VS 前シーズン下位チーム",
  krOpen: "韓国オープン予選",
  jpOpen: "日本オープン予選",
  pacOpen: "パシフィックオープン予選",
  krRegional: "OWCS Korea<br>（オフライン）",
  jpRegional: "OWCS Japan",
  pacRegional: "OWCS Pacific",
  stagePath: "総当たり戦→トーナメント戦<br>上位2チームが進出",
  asiaChampTitle: "OWCS Asia<br>（オフライン）",
  asiaNote: "グループ別総当たり戦→トーナメント戦<br>上位2チームが進出",
  cnOpen: "中国オープン予選",
  cnMain: "OWCS China",
  cnStagePath: "スイス式トーナメント戦→総当たり戦→トーナメント戦",
  openNoOfficialCast: "※公式配信はありません。選手の個人配信のみ。",
  faceit: "FACEIT League<br>Master",
  faceitBar: "FACEIT",
  faceitLabel: "FACEIT",
  faceitInfoTitle:
    "【FACEIT League】 NA・EMEA・Oceania・SouthAmerica<br>(Open→Advanced→Expert→Master）",
  faceitInfoBody:
    "2部リーグのような位置付けで、OWCSと同時進行されています。<br>OWCS同様、シーズン毎に各階級の総当たり戦→トーナメント戦が行われています。<br>※アジア地域にはありません。<br>※公式配信はありません。Liquipediaで試合日程を確認し、試合当日に選手の個人配信や FACEIT キャスター配信があれば、視聴可能です。",
  naMain: "OWCS NA",
  emeaMain: "OWCS EMEA",
  worldTitle: "OWCS 世界大会<br>（オフライン）",
  worldEvents: "Champions Clash · Midseason Championship · World Finals<br>トーナメント戦"
};

/**
 * Convert a Japan wall-clock schedule slot to the viewer’s local weekday + time.
 * monOffset: 0 = Monday … 6 = Sunday (JST), using a fixed JST week in 2024.
 */
function owcsJstToDate_(monOffset, hour, minute = 0) {
  const day = monOffset + 1;
  const iso =
    `2024-01-${String(day).padStart(2, "0")}` +
    `T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+09:00`;
  return new Date(iso);
}

function owcsFormatLocalDayTime_(date) {
  return {
    weekday: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date),
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit"
    }).format(date)
  };
}

/** e.g. Mon–Wed from 4:00 AM, or Fri 3:00 AM / Sat–Sun 1:00 AM */
function owcsFormatLocalFromJstDays_(monOffsets, hour, minute = 0) {
  const parts = monOffsets.map(d =>
    owcsFormatLocalDayTime_(owcsJstToDate_(d, hour, minute))
  );
  if (!parts.length) return "";

  const uniqueTimes = [...new Set(parts.map(p => p.time))];
  if (uniqueTimes.length === 1) {
    const time = uniqueTimes[0];
    const days = parts.map(p => p.weekday);
    if (days.length === 1) return `${days[0]} from ${time}`;

    const sameName = days.every(d => d === days[0]);
    if (sameName) return `${days[0]} from ${time}`;

    return `${days[0]}–${days[days.length - 1]} from ${time}`;
  }

  return parts.map(p => `${p.weekday} ${p.time}`).join(", ");
}

function owcsVisitorTimezoneLabel_() {
  if (typeof getVisitorTimezoneText_ === "function") {
    const t = getVisitorTimezoneText_();
    if (t) return t;
  }
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "your local time";
  } catch (e) {
    return "your local time";
  }
}

function buildOwcsLocalWatchTimesHtml_() {
  const tz = owcsVisitorTimezoneLabel_();
  const japan = owcsFormatLocalFromJstDays_([0, 1, 2], 18);
  const pacific = owcsFormatLocalFromJstDays_([3], 20);
  const korea = `${owcsFormatLocalFromJstDays_([4], 17)} / ${owcsFormatLocalFromJstDays_([5, 6], 15)}`;
  const china = owcsFormatLocalFromJstDays_([5, 6], 18);
  const emeaNa = owcsFormatLocalFromJstDays_([5, 6], 2);

  return `
    <h3 class="owcs-fun-subhead">Typical live times (your local time, approximate)</h3>
    <p class="watchowcs-updated">Shown in: ${tz}</p>
    <ul>
      <li><b>Japan</b> — ${japan}</li>
      <li><b>Pacific</b> — ${pacific}</li>
      <li><b>Korea</b> — ${korea}</li>
      <li><b>China</b> — ${china}</li>
      <li><b>EMEA / NA</b> — ${emeaNa}</li>
    </ul>
  `;
}

function openOwcsLiveFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  const shouldPush = currentView !== "owcs";
  currentView = "owcs";
  currentLiveView = "owcs";
  setViewUrl_("owcs", shouldPush);
  updateNavState(currentView);
  loadView(currentView);
  window.scrollTo(0, 0);
}

function openTeamsFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  const shouldPush = currentView !== "teams";
  currentView = "teams";
  currentPlayerView = "teams";
  setViewUrl_("teams", shouldPush);
  updateNavState(currentView);
  loadView(currentView);
  window.scrollTo(0, 0);
}

function openFavoritesFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  const shouldPush = currentView !== "favorites";
  currentView = "favorites";
  currentPlayerView = "favorites";
  setViewUrl_("favorites", shouldPush);
  updateNavState(currentView);
  loadView(currentView);
  window.scrollTo(0, 0);
}

function openPlayerlinksFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  const shouldPush = currentView !== "playerlinks";
  currentView = "playerlinks";
  currentPlayerView = "playerlinks";
  setViewUrl_("playerlinks", shouldPush);
  updateNavState(currentView);
  loadView(currentView);
  window.scrollTo(0, 0);
}

function openMediaFromGuide_() {
  settingsMenu?.classList.add("settings-hidden");
  const shouldPush = currentView !== "youtube";
  currentView = "youtube";
  currentMediaView = "youtube";
  setViewUrl_("youtube", shouldPush);
  updateNavState(currentView);
  loadView(currentView);
  window.scrollTo(0, 0);
}
