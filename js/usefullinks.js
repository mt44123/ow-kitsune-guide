function loadUsefulLinksView() {
  currentView = "usefullinks";
  history.replaceState({}, "", "?view=usefullinks");

  resetSeo_();

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove("youtube-view", "clip-view", "mediagoats-view", "archive-view");

  pageTitle.textContent = "USEFUL LINKS";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode";

  app.innerHTML = `
    <div class="tools-page">

      <div class="card">
        <h3>🌐 Useful Links</h3>

        ${siteText_(
          `
            <p>
              A collection of useful websites for competitive Overwatch players and fans.
            </p>
            <p>
              These websites are operated by Blizzard, community members or third parties and are not affiliated with OW KITSUNE GUIDE.
            </p>
          `,
          `
            <p>
              競技Overwatchプレイヤー・ファン向けの便利なサイトをまとめています。
            </p>
            <p>
              掲載しているサイトはBlizzard、コミュニティ、または第三者が運営しており、OW KITSUNE GUIDEとは提携・運営関係はありません。
            </p>
          `
        )}
      </div>

      <div class="card">
        <h3>🏆 Official</h3>
      </div>
      
      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://esports.overwatch.com/en-us/schedule" target="_blank" rel="noopener">
              🗓️ OWCS Schedule
            </a>
          </div>

          ${siteText_(
            `<p>Official annual OWCS schedule. The EMEA and NA schedules are useful for estimating upcoming Asia events.</p>`,
            `<p>OWCSの年間スケジュールです。EMEA・NAの日程から、Asia大会のおおよその開催時期も予想できます。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <strong>📺 OWCS Official Links</strong>
          </div>

          <p><strong>Twitch</strong></p>
          <p><a href="https://www.twitch.tv/ow_esports" target="_blank" rel="noopener">Overwatch Esports (OWCS EMEA/NA)</a></p>
          <p><a href="https://www.twitch.tv/ow_esports_jp" target="_blank" rel="noopener">Overwatch Esports Japan (OWCS JP/KR)</a></p>
          <p><a href="https://www.twitch.tv/ow_esports_th" target="_blank" rel="noopener">Overwatch Esports Thai (OWCS Pacific)</a></p>

          <p><strong>YouTube</strong></p>
          <p><a href="https://www.youtube.com/c/ow_esports" target="_blank" rel="noopener">Overwatch Esports (OWCS EMEA/NA)</a></p>
          <p><a href="https://youtube.com/@ow_esports_jp" target="_blank" rel="noopener">Overwatch Esports Japan (OWCS JP/KR)</a></p>
          <p><a href="https://youtube.com/@roofesports" target="_blank" rel="noopener">Overwatch Esports Thai (OWCS Pacific)</a></p>

          <p><strong>SOOP</strong></p>
          <p><a href="https://play.sooplive.com/owesports/295314607" target="_blank" rel="noopener">Overwatch Esports Korea (OWCS KR)</a></p>
          <p><a href="https://play.sooplive.com/owesportsen/null" target="_blank" rel="noopener">Overwatch Esports (OWCS EMEA/NA)</a></p>
          <p><a href="https://play.sooplive.com/owesportsjp/295314613" target="_blank" rel="noopener">Overwatch Esports Japan (OWCS JP/KR)</a></p>
          <p><a href="https://play.sooplive.com/owesportsth" target="_blank" rel="noopener">Overwatch Esports Thai (OWCS Pacific)</a></p>

          <p><strong>Bilibili</strong></p>
          <p><a href="https://live.bilibili.com/23612045" target="_blank" rel="noopener">Overwatch Esports China</a></p>

          <p><strong>X</strong></p>
          <p><a href="https://twitter.com/OW_Esports" target="_blank" rel="noopener">Overwatch Esports</a></p>
          <p><a href="https://twitter.com/OW_Esports_asia" target="_blank" rel="noopener">Overwatch Esports Asia</a></p>
          <p><a href="https://twitter.com/wdgjapan" target="_blank" rel="noopener">Overwatch Esports Japan</a></p>

          <p><strong>Instagram</strong></p>
          <p><a href="https://www.instagram.com/ow_esports" target="_blank" rel="noopener">Overwatch Esports</a></p>
          <p><a href="https://www.instagram.com/ow_esports_kr" target="_blank" rel="noopener">Overwatch Esports Asia</a></p>

          <p><strong>Discord</strong></p>
          <p><a href="https://discord.gg/overwatchesports" target="_blank" rel="noopener">Overwatch Esports</a></p>
          <p><a href="https://discord.gg/wdgtournament" target="_blank" rel="noopener">Overwatch Esports Asia</a></p>

          <p><strong>TikTok</strong></p>
          <p><a href="https://www.tiktok.com/@overwatchesports?lang=en" target="_blank" rel="noopener">Overwatch Esports</a></p>
        </div>
      </div>

      <div class="card">
        <h3>📚 Information</h3>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://liquipedia.net/overwatch/Main_Page" target="_blank" rel="noopener">
              📚 Liquipedia Overwatch
            </a>
          </div>

          ${siteText_(
            `<p>The largest community-maintained Overwatch esports wiki.</p>`,
            `<p>Overwatch esports最大級のコミュニティWikiです。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://discord.com/invite/liquipedia" target="_blank" rel="noopener">
              💬 Liquipedia Discord
            </a>
          </div>

          ${siteText_(
            `<p>Community Discord where roster changes and tournament information may appear before they are added to Liquipedia.</p>`,
            `<p>Liquipediaに反映される前のロスター変更や大会情報が共有されることがあります。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <h3>📊 Stats & Community</h3>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://owtv.gg/" target="_blank" rel="noopener">
              🎙️ OWTV.gg
            </a>
          </div>

          ${siteText_(
            `<p>Original player interviews, fantasy team building and fantasy rankings based on tournament results.</p>`,
            `<p>独自取材による選手インタビューや、理想のチームを組んで大会結果に応じたランキングに参加できるファンタジー機能があります。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://owtics.gg/ja-JP/" target="_blank" rel="noopener">
              📊 OWTICS.gg
            </a>
          </div>

          ${siteText_(
            `<p>Unofficial fan-made statistics website where you can check data such as mode win rates.</p>`,
            `<p>モード別の勝率などを確認できる非公式ファンサイトです。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <h3>🎮 Replay Codes</h3>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vRy-b0Vo5LecKRY21-pBfw40TRlqukyjyMqSOTmlo0oe4hWlFDTmnmnuuRecgAWODfPUiM5o3FJ92Xf/pubhtml#gid=1098723955" target="_blank" rel="noopener">
              🎮 OWCS Replay Codes
            </a>
          </div>

          ${siteText_(
            `<p>Replay codes from official OWCS matches.</p>`,
            `<p>OWCS公式大会のリプレイコード集です。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSk5k4PDJ2w3L7vv2fzOyKYMUtvhPYtfUtuWx4Q1rLzobax4V9Q7oieKCPeo3pGPnQC9xLK8atHQmvL/pubhtml" target="_blank" rel="noopener">
              🎮 Saudi eLeague Replay Codes
            </a>
          </div>

          ${siteText_(
            `<p>Replay codes from the Saudi eLeague.</p>`,
            `<p>Saudi eLeagueのリプレイコード集です。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRVPN50UI1-8mmCW0CMu7lV99er8ZI5l0M5eE12HD8vUhhSpC4wO8Idj51wfMY9agKofuPcJddqK41r/pubhtml" target="_blank" rel="noopener">
              🎮 OWWC Replay Codes
            </a>
          </div>

          ${siteText_(
            `<p>Replay codes from the Overwatch World Cup.</p>`,
            `<p>Overwatch World Cupのリプレイコード集です。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://www.youtube.com/@ObsSojourn" target="_blank" rel="noopener">
              🎥 ObsSojourn
            </a>
          </div>

          ${siteText_(
            `<p>POV channel featuring recordings by OWCS observers. Useful after replay codes expire.</p>`,
            `<p>OWCSのオブザーバーによるPOV投稿チャンネルです。リプレイコードの期限切れ後にも役立ちます。</p>`
          )}
        </div>
      </div>

      <div class="card">
        <h3>📰 News</h3>
      </div>

      <div class="card">
        <div class="tool-item">
          <div>
            <a href="https://x.com/OWCEsports" target="_blank" rel="noopener">
              📰 Cavalry Esports X
            </a>
          </div>

          ${siteText_(
            `<p>Fast updates for match results, POTM announcements and tournament news.</p>`,
            `<p>試合結果、POTM、大会情報などを素早く確認できます。</p>`
          )}
        </div>
      </div>

    </div>
  `;
}