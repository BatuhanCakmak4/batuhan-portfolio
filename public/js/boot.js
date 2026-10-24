/* Runs first: marks the page as JS-enabled. If main.js never runs, content that waits for a reveal is shown anyway. */
(function () {
  var r = document.documentElement;
  r.classList.add('js');
  setTimeout(function () {
    if (!r.classList.contains('ready')) r.classList.remove('js');
  }, 3000);
})();
