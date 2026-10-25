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
  if (lang !== 'en') r.classList.add('i18n-wait');
  setTimeout(function () {
    r.classList.remove('i18n-wait');
    if (!r.classList.contains('ready')) r.classList.remove('js');
  }, 3000);
})();
