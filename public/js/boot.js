/* Runs first: marks the page as JS-enabled. If main.js never runs, content that waits for a reveal is shown anyway.
   Also picks the language (saved choice, then browser language, then English) so i18n.js can translate before first paint. */
(function () {
  var r = document.documentElement;
  r.classList.add('js');
  var ok = /^(en|tr|de)$/, lang = '';
  try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
  if (!ok.test(lang)) {
    lang = 'en';
    var nl = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < nl.length; i++) {
      var c = String(nl[i]).slice(0, 2).toLowerCase();
      if (ok.test(c)) { lang = c; break; }
    }
  }
  r.lang = lang;

  // Intro loader: stays at least MIN ms so the logo animation can finish, never longer than MAX.
  var MIN = 1300, MAX = 2600, t0 = Date.now(), done = false;
  r.classList.add('loading');
  function hide() {
    if (done) return;
    done = true;
    r.classList.add('loaded');
    setTimeout(function () {
      r.classList.remove('loading');
      var el = document.getElementById('loader');
      if (el) el.parentNode.removeChild(el);
    }, 700);
  }
  window.addEventListener('load', function () { setTimeout(hide, Math.max(0, MIN - (Date.now() - t0))); });
  setTimeout(hide, MAX);
  if (lang !== 'en') r.classList.add('i18n-wait');
  setTimeout(function () {
    r.classList.remove('i18n-wait');
    if (!r.classList.contains('ready')) r.classList.remove('js');
  }, 3000);
})();
