/* Runs first: marks the page as JS-enabled and guards against a stuck preloader. */
(function () {
  var r = document.documentElement;
  r.classList.add('js', 'ld');
  setTimeout(function () {
    var p = document.getElementById('pre');
    if (p && p.parentNode) p.parentNode.removeChild(p);
    r.classList.remove('ld');
    r.classList.add('go');
  }, 5000);
})();
