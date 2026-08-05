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
            <p>
              Tip: Open the ⚙ menu (top right) and set <b>Site Text</b> to
              English or Japanese only — it’s much easier to read.
            </p>
            <p class="watchowcs-updated">Last updated: August 5, 2026</p>
          `,
          `
            <p>
              このページは現在執筆中です。内容は今後追加・修正していく予定です。
            </p>
            <p>
              右上の⚙マークから、Site Text設定を英/日どちらかに切り替えると読みやすいです。
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
              Regions include Asia (Japan, Korea, Pacific), China, NA, and EMEA.
              You don’t need to follow every region — “your favorite region +
              world events” is enough at first. Japan, Korea, Asia, and world
              events have Japanese casts, so they’re easy to follow for Japanese
              viewers.
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
              全部追う必要はありません。最初は「推しの地域 + 世界大会」で十分です。
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
              Start interesting series from the beginning — casters walk through the
              basics you need every time.
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

            <h3 class="owcs-fun-subhead">③ Players and teams you’ll want to root for</h3>
            <p>
              Watching OWCS naturally creates “I want to root for this player / team”
              moments — and that makes every series more fun.
            </p>
            <p>
              <b>Winner interviews after maps</b> (not for Japan and Pacific):
              players revisit the series, talk about teammates, or discuss the meta —
              sides of the game you don’t see only from kill feed.
            </p>
            <p>
              <b>Player face cams</b> (offline / LAN events only):
              grins after pop-offs, fist pumps in huge wins, frustration after tough
              losses — emotions come through clearly.
            </p>
            <p>
              <b>Player and team stories</b> sit behind every series:
            </p>
            <ul>
              <li>long-time rivals meeting again</li>
              <li>new rosters challenging champions</li>
              <li>do-or-die series for a world-event spot</li>
            </ul>
            <p>
              Knowing the effort, heartbreak, and hunger for wins often leaves you
              pulling for both sides. Casters also explain this context as the show goes on.
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

            <h3 class="owcs-fun-subhead">③ 応援したい選手やチームが見つかる</h3>
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
              If you can’t watch live, YouTube archives are recommended
              (Twitch free VODs may not always remain).
            </p>
            <h3 class="owcs-fun-subhead">Typical times (JST, approximate)</h3>
            <ul>
              <li><b>Japan</b> — Mon–Wed from 18:00</li>
              <li><b>Pacific</b> — Thu from 20:00</li>
              <li><b>Korea</b> — Fri from 17:00 / Sat–Sun from 15:00</li>
              <li><b>China</b> — Sat–Sun from 18:00</li>
              <li><b>EMEA / NA</b> — Sat–Sun from 02:00 (late night)</li>
            </ul>
            <p>
              For exact times, check official X or Liquipedia.<br>
              <a href="/usefullinks" onclick="openStaticView_('usefullinks'); return false;">
                👉 Links for watching OWCS
              </a>
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
            <h3 class="owcs-fun-subhead">よくある時間帯（日本時間・目安）</h3>
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
            <ul>
              <li>
                <b>Want Japanese casts</b> → Japanese streams for OWCS Japan, Korea,
                and world events
              </li>
              <li>
                <b>Want top-tier matches</b> → OWCS Korea and world events
              </li>
              <li>
                <b>Want highlight-heavy series</b> → even small skill gaps often finish
                3–0. 3–2 close series are usually the most watchable
              </li>
              <li>
                <b>Want to study pro play</b> → OWCS publishes
                <a
                  href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                  target="_blank"
                  rel="noopener"
                >replay codes</a>.
                After codes expire,
                <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
                POV videos help a lot (world-event codes aren’t viewable for the public,
                so those POVs are especially valuable)
              </li>
              <li>
                <b>Official cams jump around too fast</b> →
                <a
                  href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955"
                  target="_blank"
                  rel="noopener"
                >replay codes</a>
                or
                <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">ObsSojourn</a>
              </li>
              <li>
                <b>Want more fun</b> → Twitch channel-point win predictions, or a
                streamer watch party (e.g.
                <a href="https://www.twitch.tv/ta1yo" target="_blank" rel="noopener">Ta1yo</a>)
              </li>
            </ul>
            <p>First, find a way of watching that fits you.</p>
            <p>OWCS is not a “learn every rule before you start” product.</p>
            <ul>
              <li>Root for favorites</li>
              <li>Watch with the cast commentary</li>
              <li>Study pro POVs for your own play</li>
            </ul>
            <p>Everyone’s path is different.</p>
            <p>
              Finding one style that fits you is the fastest way to enjoy OWCS more.
            </p>
          `,
          `
            <ul class="watchowcs-tip-list">
              <li>
                <span class="watchowcs-tip-label">日本語実況で見たい</span>
                <span class="watchowcs-tip-body">
                  OWCS Japan、Korea、国際大会の日本語配信
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">トップクラスの試合を見たい</span>
                <span class="watchowcs-tip-body">OWCS Korea、国際大会</span>
              </li>
              <li>
                <span class="watchowcs-tip-label">見どころある試合を見たい</span>
                <span class="watchowcs-tip-body">
                  OWCSでは、わずかな実力差でも3-0になることが多いです。
                  3-2までもつれた試合は、最後まで目が離せない好ゲームが多いです。
                </span>
              </li>
              <li>
                <span class="watchowcs-tip-label">プロを参考にプレイを研究したい</span>
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
              </li>
              <li>
                <span class="watchowcs-tip-label">公式配信は視点がコロコロ変わってよくわからない</span>
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
              </li>
              <li>
                <span class="watchowcs-tip-label">楽しく見たい</span>
                <span class="watchowcs-tip-body">
                  Twitchのチャンネルポイントによる勝敗予想に参加する、<br>
                  配信者のウォッチパーティで見てみる（例:
                  <a href="https://www.twitch.tv/ta1yo" target="_blank" rel="noopener">Ta1yo</a>）
                </span>
              </li>
            </ul>
            <p>まずは、自分なりの楽しみ方を見つけてください。</p>
            <p>OWCSは、「ルールを全部覚えてから見る大会」ではありません。</p>
            <ul>
              <li>推しを応援する</li>
              <li>実況を聞きながら試合を見る</li>
              <li>プロを参考にプレイを研究する</li>
            </ul>
            <p>楽しみ方は人それぞれです。</p>
            <p>
              まずは自分に合った観戦スタイルを一つ見つけること。
              それが、OWCSをもっと楽しむための一番の近道です。
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
              The year usually has about 3–4 stages, each feeding into a world event
              window. Slots and rules differ slightly by world event.
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
        </div>
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
