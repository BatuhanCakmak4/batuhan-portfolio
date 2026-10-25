(function () {
  "use strict";
  /* Page background: a sparse, faint network of nodes behind the content. It fades in after the hero
     and only moves while the page scrolls, with a slow depth-based parallax. Nothing animates at rest. */
  var c = document.getElementById("bg-net");
  if (!c || !c.getContext) return;
  var x = c.getContext("2d");
  var rm = matchMedia("(prefers-reduced-motion: reduce)");
  var W, H, nodes = [], LINK = 170, raf = 0;

  function seed() {
    var dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(45, Math.round(W * H / 34000));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * (H + 200), z: .3 + Math.random() * .7 });
    }
  }

  function frame() {
    raf = 0;
    var sy = scrollY, span = H + 200;
    var vis = Math.min(1, sy / (H * .6));
    c.style.opacity = vis.toFixed(3);
    if (vis <= 0) return;

    /* Screen position: scroll offset scaled by depth, wrapped vertically. */
    var shift = rm.matches ? 0 : sy * .15;
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i], y = (p.y - shift * p.z) % span;
      if (y < 0) y += span;
      p.sy = y - 100;
    }

    x.clearRect(0, 0, W, H);
    x.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.sy - b.sy, d2 = dx * dx + dy * dy;
        if (d2 > LINK * LINK) continue;
        var k = 1 - Math.sqrt(d2) / LINK;
        x.strokeStyle = "rgba(154,184,220," + (k * .07 * Math.min(a.z, b.z)).toFixed(3) + ")";
        x.beginPath(); x.moveTo(a.x, a.sy); x.lineTo(b.x, b.sy); x.stroke();
      }
    }
    for (i = 0; i < nodes.length; i++) {
      p = nodes[i];
      x.fillStyle = "rgba(154,184,220," + (.08 + p.z * .17).toFixed(3) + ")";
      x.beginPath(); x.arc(p.x, p.sy, .7 + p.z, 0, 6.2832); x.fill();
    }
  }

  function draw() { if (!raf) raf = requestAnimationFrame(frame); }

  seed();
  draw();
  addEventListener("scroll", draw, { passive: true });
  var rt;
  addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (innerWidth !== W || Math.abs(innerHeight - H) > 120) seed(); draw(); }, 150);
  });
})();
