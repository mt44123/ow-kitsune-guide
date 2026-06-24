function loadToolsView() {
  currentView = "toolstips";
  history.replaceState({}, "", "?view=toolstips");

  requestId++;

  updateNavState(currentView);
  stopFakeProgress();

  document.body.classList.remove("youtube-view", "clip-view");

  pageTitle.textContent = "TOOLS";
  setRandomVoiceLine();

  updated.textContent = "";
  viewNote.textContent = "";

  app.className = "tools-mode";

  app.innerHTML = `
<div class="tools-page">

  <div class="card">
  <h3>📚 Translation Tools</h3>

<p>
  If captions or translations are unavailable, try the tools below. For most users, the free versions are more than enough.
</p>

<p>
  字幕や翻訳機能が利用できない場合は、下記のツールをお試しください。一般的な用途であれば、無料版でも十分活用できます。
</p>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://support.google.com/chrome/answer/10538231?hl=en-GB&sjid=4036900480667797437-NC">
    💻 Manage captions and translations in Chrome (EN)</a>
  </div>

  <div>
    <a href="https://support.google.com/chrome/answer/10538231?hl=ja">
    Chromeで字幕と翻訳を管理する (JP)</a>
  </div>

  <p>Generate captions in Chrome and translate videos and live streams in real time.</p>
  <p>Chromeブラウザで、動画やライブ配信の字幕を生成して、リアルタイムで翻訳できます</p>
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://support.google.com/accessibility/android/answer/9350862?hl=en&sjid=4036900480667797437-NC">
    📱 Manage captions and translations on Android (EN)</a>
  </div>

  <div>
    <a href="https://support.google.com/accessibility/android/answer/9350862?hl=ja_ALL">
    Androidで字幕と翻訳を管理する (JP)</a>
  </div>

  <p>Generate captions on Android and translate videos and live streams in real time.</p>
  <p>※I use an iPhone, so Android instructions are based on official documentation.</p>
  <p>Androidで、動画やライブ配信の字幕を生成して、リアルタイムで翻訳できます</p>
  <p>※筆者はiPhoneユーザーのため、Android関連の内容は公式ドキュメントを参考にしています</p>
  
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://chatgpt.com/">
      💻📱 ChatGPT
    </a>
  </div>

<p>
  ・My personal recommendation. ChatGPT usually provides the most natural translations, especially for gaming terms, esports slang, and stream conversations.
</p>

<p>
  ・For YouTube videos, open the transcript ("Show transcript"), copy the text, and paste it into ChatGPT. It can translate long interviews, stream clips, and match discussions with better context than most translation tools.
</p>

<p>
  ・Chrome Live Caption subtitles cannot be directly selected or copied. If needed, you can use an OCR tool to extract text from the screen and then paste it into ChatGPT or another AI assistant. This allows you to use your preferred AI instead of relying only on Google Translate.
</p>

<p>
  Below are some OCR tools that I personally use.
</p>

<p>
  ・個人的に一番おすすめです。ゲーム用語やeスポーツ用語、配信中の会話なども自然に翻訳してくれます。
</p>

<p>
  ・YouTube動画の場合は、「文字起こし（文字起こしを表示）」を開いて内容をコピーし、ChatGPTに貼り付けるだけです。長いインタビューや配信内容、試合の振り返りなども文脈を考慮して翻訳してくれます。
</p>

<p>
  ・Chromeの自動字幕起こしは直接選択やコピーができません。その場合はOCRソフトで画面内の文字を読み取り、テキスト化してからChatGPTなどのAIに貼り付ける方法もおすすめです。Google翻訳だけでなく、自分の好きなAIで翻訳できるようになります。
</p>

<p>
  下記に私が実際に使用しているOCRソフトを紹介します
</p>
  
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://chromewebstore.google.com/detail/eenjdnjldapjajjofmldgmkjaienebbj?utm_source=item-share-cb">
      💻 Copyfish 🐟 Free OCR Software
    </a>
  </div>

<p>
  A Chrome extension that lets you extract text directly from images and videos using OCR.
</p>

<p>
  It was the first OCR tool I found through a web search, and I have been using it ever since. While there may be other alternatives, it has worked well for my needs.
</p>
<p>
  画像や動画内の文字をOCRで読み取り、テキスト化できるChrome拡張機能です。
</p>

<p>
  検索で最初に見つけたOCRソフトだったため、ずっと使用しています。他にも選択肢はあると思いますが、私の用途では特に問題なく利用できています。
</p>
   
</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://chromewebstore.google.com/detail/debflmkfmkejgppfabgfcbemelmnpnho?utm_source=item-share-cb">
      💻 ViiTor Real-Time Translation
    </a>
  </div>

<p>
  Another Chrome extension that I recommend. Chrome's built-in Live Caption and translation features can sometimes use more system resources, while ViiTor is generally much lighter.
</p>
<p>
  The translations can be less accurate, but the generated subtitles can be selected and copied. This makes it easy to paste them into ChatGPT or another AI assistant for higher-quality translations.
</p>
<p>
  The free version has been more than sufficient for my personal use.
</p>
<p>
  こちらもおすすめのChrome拡張機能です。Chromeの自動字幕起こし・翻訳機能はブラウザが少し重くなる場合がありますが、ViiTorは比較的軽快に動作します。
</p>

<p>
  翻訳精度はやや粗めですが、生成された字幕を選択してコピーできるのが大きな特徴です。そのままChatGPTなどのAIに貼り付けることで、より自然な翻訳にすることができます。
</p>

<p>
  私の使用用途では、無料版でも特に問題なく利用できています。
</p>
</div>
</div>

<div class="card">
<div class="tool-item">

  <div>
    <strong>💻📱 Discord (Browser Version)</strong>
  </div>

  <p>
   If you use Discord in a web browser, you can translate messages using your browser's built-in translation feature.
   This can be useful when reading Discord servers run by overseas players.
  </p>

  <p>
    Discordをブラウザ版で利用すると、ブラウザの翻訳機能でメッセージを翻訳できます。海外プレイヤーのDiscordサーバーを読む際に便利です。
  </p>

</div>
</div>

<div class="card">
<div class="tool-item">
  <div>
    <a href="https://www.duolingo.com/learn">
      💻📱 Duolingo
    </a>
  </div>

  <p>Great for learning English, Korean, Chinese, Japanese, chess, and many other topics through short daily lessons.</p>
  <p>Helpful if you want to understand streams without relying entirely on translation tools.</p>
  <p>英語・韓国語・中国語・日本語・チェスなどを少しずつ学べる語学学習アプリです</p>
  <p>翻訳ツールだけに頼らず、海外配信をもっと理解したい方におすすめです</p>
   
</div>
</div>

</div>
`;
}

