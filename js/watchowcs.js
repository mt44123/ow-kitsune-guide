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
          ${siteHeading_("🦊 New to OWCS?", "🦊 OWCSは初めてですか？")}
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
            <p class="owcs-sitetext-tip">
              <b>Tip:</b> Open the ⚙ menu (top right) and set <b>Site Text</b> to
              English or Japanese only — it’s much easier to read.
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
            <p class="owcs-sitetext-tip">
              <b>右上の⚙マークから、Site Text設定を英/日どちらかに切り替えると読みやすいです。</b>
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
              commentary — so they’re easier for Japanese viewers to follow!
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
              ちなみに、Japan、Korea、Asia、世界大会には日本語実況がついている為、日本人向けでわかりやすいです！
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
            <p>
              Formats differ a little by region, but the year usually follows the flow
              below — about 3–4 stages, each leading into a world event.
            </p>
            <p>
              In other words, there are roughly 3–4 chances each year to chase the
              #1 ranking in the world.
            </p>
          `,
          `
            <p>
              地域ごとに形式は少し違いますが、年間はだいたい下図のような流れです。
              ステージは年3～4回あり、それぞれ世界大会につながります。
            </p>
            <p>
              つまり、年3～4回、世界1位を目指すチャンスがあります。
            </p>
          `
        )}
        <h4 class="owcs-flow-subhead">
          ${siteHeading_("Year overview (Jan → Dec)", "1年の流れ（1月 → 12月）")}
        </h4>
        ${buildOwcsYearFlowHtml_()}
        <h4 class="owcs-flow-subhead">
          ${siteHeading_("One stage in detail", "1ステージの詳細")}
        </h4>
        ${siteText_(
          `
            <p class="owcs-flow-detail-lead">
              Each stage has a path like this.
            </p>
            <p class="owcs-flow-detail-lead">
              The number of slots and the qualification rules differ slightly for
              each world event.
            </p>
          `,
          `
            <p class="owcs-flow-detail-lead">
              各ステージの中身は、だいたい下図のような流れです。
            </p>
            <p class="owcs-flow-detail-lead">
              各世界大会ごとに、進出できるチーム数・条件は若干異なります。
            </p>
          `
        )}
        ${buildOwcsSeasonFlowHtml_()}
        ${siteText_(
          `
            <div class="owcs-flow-aside">
              <p>
                <b>Q: Do Japanese teams play at world events?</b><br>
                <b>A:</b> Sometimes, yes.
              </p>
              <p>
                Right now the Asia power balance is roughly
                Korea &gt; Pacific / Japan. Under the flowchart-style season format,
                Korean teams advance to world events about 99% of the time.
              </p>
              <p>
                Depending on the event format, though, Korea may use a separate
                path — and then Japan can appear at world events more often.
              </p>
              <p>
                For example, at the summer Midseason Championship (EWC), the #1
                teams from Japan and Pacific can qualify directly for that world
                event.
              </p>
            </div>
          `,
          `
            <div class="owcs-flow-aside">
              <p>
                <b>Q: 日本チームは世界大会に出場してる？</b><br>
                <b>A:</b> 出場している時もあります。
              </p>
              <p>
                現状、アジア地域のパワーバランスは 韓国 &gt; パシフィック・日本です。
                フロー図形式のシーズンでは、約 99%の確率で韓国チームが世界大会へ進出します。
              </p>
              <p>
                ただ、大会形式によっては韓国が別枠扱いになるため、
                日本が世界大会に出場していることもあります。
              </p>
              <p>
                たとえば夏季の Midseason Championship（EWC）では、
                日本・パシフィック内の1位チームが、直接その世界大会へ進出できます。
              </p>
            </div>
          `
        )}
      </div>

      <div class="card faq-card">
        <h3>
          ${siteHeading_("✨ What’s fun about OWCS?", "✨ OWCSは何が面白い？")}
        </h3>
        ${siteText_(
          `
            <p>“Pro matches seem hard to follow…”</p>
            <p>
              It’s easy to feel that way. In practice, though, you can enjoy OWCS
              fully without deep game knowledge.
            </p>
            <p>Here are five reasons I especially want people to watch OWCS.</p>

            <h4 class="owcs-fun-subhead">① Clear Japanese cast &amp; analysis</h4>
            <p>“If I don’t know the rules, I won’t understand anything…”</p>
            <p>You barely need to worry about that.</p>
            <p>
              OWCS has Japanese streams where casters and analysts explain the match
              in plain language.
            </p>
            <p>At the start of a broadcast they carefully cover:</p>
            <ul>
              <li>how the tournament works and the schedule</li>
              <li>teams and players to watch that day</li>
              <li>the current meta (common tactics and hero comps)</li>
            </ul>
            <p>During the match they cover things like:</p>
            <ul>
              <li>why a play was strong</li>
              <li>which team is ahead right now</li>
              <li>what might happen next</li>
            </ul>
            <p>
              so even first-timers can follow the flow while watching.
            </p>
            <p>
              Korean or English winner interviews from international events are also
              often summarized on the Japanese cast, so the language barrier is low.
            </p>
            <p class="owcs-sitetext-tip">
              <b>If it’s your first time, start the stream from the beginning.</b>
              You’ll usually get the overview and what to watch for in that series.
            </p>

            <h4 class="owcs-fun-subhead">② World-class aim and team play</h4>
            <p>OWCS players are among the best in the world.</p>
            <p>
              Amazing aim, clutch decisions that flip a map — super plays show up in
              almost every series.
            </p>
            <p>It’s not only individual skill, either.</p>
            <p>Overwatch is a five-player team game.</p>
            <p>
              Pros fight on full-team voice comms, so perfect five-player teamfights are
              a spectacle of their own.
            </p>
            <p>
              One person’s super play, and the whole team locking in together —
              getting both is a big part of what makes OWCS special.
            </p>

            <h4 class="owcs-fun-subhead">③ Mind games and strategy</h4>
            <p>Results aren’t only about who aims better.</p>
            <p>
              Before maps, coaches and players plan map strategies, hero comps, and
              roster choices.
            </p>
            <p>
              OWCS also uses hero bans, so “which comps you ban” and “which comps
              you run” can swing whole series.
            </p>
            <p>
              Favorites lose prep games, underdogs cook a plan and upset — that happens
              more often than you might think.
            </p>
            <p>
              Wondering “what’s the next comps?” is part of the fun unique to OWCS.
            </p>

            <h4 class="owcs-fun-subhead">④ Interviews and face cams show the human side</h4>
            <p>At offline events, winner interviews after maps are a highlight.</p>
            <p>
              Players rewatch the series, talk about teammates, or chat about the meta —
              sides of the game the scoreboard never shows.
            </p>
            <p>
              Many offline broadcasts also show each player’s face cam: a grin after a
              pop-off, a fist pump in a huge win, the frustration of a hard loss —
              emotions come through clearly.
            </p>
            <p>
              One recent scene that stuck with fans: in a high-stakes match for a world
              event berth, T1’s DONGHAK was booped by ZETA DIVISION’s Viol2t and hit by
              a Neon Junction train, losing D.Va’s mech. On the way to respawn he
              scratched his head — a raw, human moment of frustration that a lot of
              people remember.
            </p>
            <p>
              Seeing expressions and stories beyond pure gameplay makes “I want to root
              for this player” feel natural — and watching gets even more fun.
            </p>

            <h4 class="owcs-fun-subhead">⑤ Stories make every match mean more</h4>
            <p>OWCS isn’t just strong teams trading blows on empty blueprints.</p>
            <p>Behind each series are player and team stories.</p>
            <ul>
              <li>revenge against someone who stopped you last season</li>
              <li>long-time rivals settling another chapter</li>
              <li>a new roster challenging a champion</li>
              <li>a do-or-die series for a world event slot</li>
            </ul>
            <p>
              Knowing that context changes how every fight — and every result — feels.
            </p>
            <p>
              Once you’ve felt their grind, losses, and hunger to win, you’ll often
              want both sides to pull it off — just like any sport where you pick
              favorites.
            </p>
            <p>
              <a href="https://liquipedia.net/overwatch/Main_Page" target="_blank" rel="noopener">Liquipedia</a>
              covers player profiles, teams, and past results.
              Even a little prep before a series — “they were on another roster last
              year,” “this team missed worlds by a hair” — makes watch night better.
            </p>
            <p>
              Great pro play is one half of it. Knowing the path those players walked
              might be the best part of watching OWCS.
            </p>
          `,
          `
            <p>「プロの試合って難しそう……」</p>
            <p>
              そんなイメージを持っている方もいるかもしれません。しかし、実際にはゲームの知識がなくても十分楽しめます。
            </p>
            <p>ここでは、私がOWCSをぜひ見てほしいと思う理由を5つ紹介します。</p>

            <h4 class="owcs-fun-subhead">① 日本語実況・解説がとても分かりやすい</h4>
            <p>「ルールが分からないから見ても理解できないかも……」</p>
            <p>そんな心配はほとんど必要ありません。</p>
            <p>
              OWCSでは日本語配信が行われており、実況・解説が試合を分かりやすく伝えてくれます。
            </p>
            <p>配信の冒頭では、次のような内容を丁寧に紹介してくれます。</p>
            <ul>
              <li>大会全体の仕組みやスケジュール</li>
              <li>その日の注目チームや注目選手</li>
              <li>現在のメタ（流行している戦術やヒーロー構成）</li>
            </ul>
            <p>さらに試合中は、</p>
            <ul>
              <li>なぜこのプレイが強かったのか</li>
              <li>今どちらのチームが有利なのか</li>
              <li>この後どんな展開になりそうなのか</li>
            </ul>
            <p>
              といったポイントをリアルタイムで解説してくれるため、初心者でも試合の流れを理解しながら観戦できます。
            </p>
            <p>
              また、海外大会で行われる韓国語や英語の勝利者インタビューも、日本語配信では内容を紹介してくれることが多く、
              言語の壁を感じることなく楽しめるのも魅力です。
            </p>
            <p class="owcs-sitetext-tip">
              <b>初めて見る方は、ぜひ配信を最初から視聴してみてください。</b>
              大会の概要から試合の見どころまで、一通り理解できるはずです。
            </p>

            <h4 class="owcs-fun-subhead">② 世界最高峰の神エイムとチームプレー</h4>
            <p>OWCSに出場する選手たちは、世界トップレベルの実力を持っています。</p>
            <p>
              驚異的なエイムで敵を次々と倒したり、一瞬の判断で試合をひっくり返したりと、
              毎試合のようにスーパープレイが飛び出します。
            </p>
            <p>もちろん見どころは個人技だけではありません。</p>
            <p>Overwatchは5人で戦うチームゲームです。</p>
            <p>
              プロチームは常にボイスチャットでコミュニケーションを取りながら戦っているため、
              5人全員が完璧に連携した集団戦は圧巻です。
            </p>
            <p>
              「一人のスーパープレイ」と「チーム全体の連携」。<br>
              その両方を楽しめるのがOWCSの大きな魅力です。
            </p>

            <h4 class="owcs-fun-subhead">③ 作戦の読み合いが熱い</h4>
            <p>OWCSでは、選手の実力だけで勝敗が決まるわけではありません。</p>
            <p>
              試合前にはコーチと選手が話し合い、マップごとの戦略やヒーロー構成、メンバー起用など、
              さまざまな作戦を練っています。
            </p>
            <p>
              また、OWCSではヒーローBANルールが採用されており、
              「どの構成を封じるか」「どの構成で挑むか」が勝敗を大きく左右します。
            </p>
            <p>
              格上チームが作戦負けをしたり、格下チームが緻密な準備で番狂わせを起こしたりすることも珍しくありません。
            </p>
            <p>
              「次はどんな構成で来るんだろう？」<br>
              そんな予想をしながら見るのも、OWCSならではの楽しみ方です。
            </p>

            <h4 class="owcs-fun-subhead">④ インタビューやフェイスカメラで選手の"人間らしさ"が見える</h4>
            <p>オフライン大会では、試合後の勝利者インタビューも見どころのひとつです。</p>
            <p>
              選手が試合を振り返ったり、チームメイトへの思いを語ったり、現在のメタについて話したりと、
              ゲーム内では見えない一面を知ることができます。
            </p>
            <p>
              さらに、多くのオフライン大会では各選手のフェイスカメラも配信に映ります。
              スーパープレイを決めて思わず笑顔になる瞬間、劇的な勝利にガッツポーズをする瞬間、
              そして敗戦を受け止めて悔しそうな表情を見せる瞬間まで、選手たちの感情がリアルに伝わってきます。
            </p>
            <p>
              例えば、最近の印象的なシーンでは、世界大会出場を懸けた重要な試合で、
              T1のDONGHAK選手がZETA DIVISIONのViol2t選手のブープによってNEON JUNCTIONの電車にひかれてしまい、
              D.Vaのメックを失ってしまう場面がありました。
              リスポーンへ戻る途中、思わず頭をかく仕草を見せたその姿は、
              悔しさと人間らしさが伝わるワンシーンとして、多くのファンの印象に残っています。
            </p>
            <p>
              こうしたプレー以外の表情やストーリーを知ることで、「この選手を応援したい」という気持ちが自然と生まれ、
              観戦がさらに楽しくなります。
            </p>

            <h4 class="owcs-fun-subhead">⑤ 選手やチームのストーリーを知ると、もっと面白い</h4>
            <p>OWCSは、ただ強いチーム同士が試合をするだけではありません。</p>
            <p>その試合の裏には、選手やチームそれぞれのストーリーがあります。</p>
            <ul>
              <li>昨シーズン敗れた相手へのリベンジ</li>
              <li>長年ライバルとして戦い続けてきたチーム同士の対決</li>
              <li>新人チームが王者に挑む下剋上</li>
              <li>世界大会出場をかけた運命の一戦</li>
            </ul>
            <p>
              こうした背景を知っているだけで、一つひとつのプレイや勝敗の重みがまったく違って見えてきます。
            </p>
            <p>
              選手たちが積み重ねてきた努力や悔しさ、そして勝利への思いを知ると、
              「どちらにも勝ってほしい」と感じるような試合も少なくありません。
            </p>
            <p>
              スポーツ観戦で選手を応援したくなるのと同じように、
              OWCSでも自然と「推し」の選手やチームができていきます。
            </p>
            <p>
              <a href="https://liquipedia.net/overwatch/Main_Page" target="_blank" rel="noopener">リキペディア</a>
              というサイトでは、各選手のプロフィールや所属チーム、過去の戦績なども紹介されています。
              試合を見る前に少しだけ予習しておくだけでも、
              「この選手が去年は別のチームにいたんだ」「このチームは去年あと一歩で世界大会を逃したんだ」
              といった背景が分かり、観戦がより楽しくなります。
            </p>
            <p>
              プロのプレーを見るだけでなく、その選手たちが歩んできたストーリーを知ること。<br>
              それこそが、OWCS観戦の一番の魅力なのかもしれません。
            </p>
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
