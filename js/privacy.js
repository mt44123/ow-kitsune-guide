function loadPrivacyView() {
  currentView = "privacy";
  history.replaceState({}, "", "?view=privacy");

  resetSeo_();

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove("youtube-view", "clip-view", "mediagoats-view", "archive-view");

  pageTitle.textContent = "PRIVACY";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode";

  app.innerHTML = `
    <div class="tools-page">

      <div class="card">
        <h3>Privacy Policy</h3>

        ${siteText_(
          `<p>
            OW KITSUNE GUIDE respects your privacy. This page explains what information
            may be stored or used when you visit this website.
          </p>`,
          `<p>
            OW KITSUNE GUIDE は、利用者のプライバシーを尊重します。
            このページでは、本サイトの利用時に保存・使用される可能性のある情報について説明します。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Local Storage</h3>

        ${siteText_(
          `<p>
            This website uses your browser's local storage to save settings such as
            theme, language preferences, favorites, muted players and notification mode.
          </p>
          <p>
            These settings are stored only on your device and are not sent to the website owner.
          </p>`,
          `<p>
            本サイトでは、テーマ、言語設定、お気に入り、ミュートしたプレイヤー、
            通知設定などを保存するために、ブラウザのローカルストレージを使用します。
          </p>
          <p>
            これらの設定は利用者の端末内に保存され、サイト運営者へ送信されることはありません。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>External Services</h3>

        ${siteText_(
          `<p>
            This website may link to external services such as Twitch, YouTube, CHZZK,
            SOOP, Bilibili, Discord, X and Liquipedia.
          </p>
          <p>
            When you visit external websites, their own privacy policies and terms apply.
          </p>`,
          `<p>
            本サイトでは、Twitch、YouTube、CHZZK、SOOP、Bilibili、
            Discord、X、Liquipedia などの外部サービスへのリンクを掲載する場合があります。
          </p>
          <p>
            外部サイトを利用する場合は、それぞれのプライバシーポリシーや利用規約が適用されます。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Cookies, Analytics and Advertising</h3>

        ${siteText_(
          `<p>
            This website uses Google Analytics to understand website traffic and improve
            the user experience.
          </p>
          <p>
            Cookies or similar technologies may be used to analyze website traffic.
          </p>
          <p>
            If advertising services such as Google AdSense are introduced, cookies or
            similar technologies may also be used to display and measure ads.
          </p>`,
          `<p>
            本サイトでは、利用状況の把握と利便性向上のために Google Analytics を使用しています。
          </p>
          <p>
            アクセス解析のために、Cookie または類似技術が使用される場合があります。
          </p>
          <p>
            Google AdSense などの広告サービスを導入した場合、広告の表示や測定のためにも
            Cookie または類似技術が使用されることがあります。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Personal Information</h3>

        ${siteText_(
          `<p>
            This website does not require account registration and does not intentionally
            collect personal information such as your name, address or phone number.
          </p>`,
          `<p>
            本サイトではアカウント登録を必要とせず、氏名、住所、電話番号などの
            個人情報を意図的に収集することはありません。
          </p>`
        )}
      </div>

      <div class="card">
        <h3>Contact</h3>

        ${siteText_(
          `<p>
            For questions, bug reports or player requests, please use the feedback form
            linked at the bottom of the site.
          </p>`,
          `<p>
            ご質問、不具合報告、プレイヤー追加要望は、サイト下部のフォームから送信してください。
          </p>`
        )}
      </div>

    </div>
  `;
}