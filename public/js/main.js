(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var fine = matchMedia("(pointer:fine)").matches;

  /* Preloader: roughly one second from navigation start, then the curtain lifts and the hero text reveals. */
  var pre = d.getElementById("pre");
  function finish() {
    root.classList.remove("ld");
    root.classList.add("go");
    if (pre) {
      pre.classList.add("out");
      setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 950);
    }
  }
  setTimeout(finish, Math.max(rm ? 150 : 400, (rm ? 200 : 1000) - performance.now()));

  /* Hero name: split into letters so each one reacts to the pointer. */
  var h1 = d.getElementById("h1");
  if (h1) {
    h1.setAttribute("aria-label", "Batuhan Çakmak");
    h1.querySelectorAll(".mk>span").forEach(function (s) {
      var t = s.textContent;
      s.textContent = "";
      s.setAttribute("aria-hidden", "true");
      t.split("").forEach(function (c) {
        var l = d.createElement("span");
        l.className = "lt";
        l.textContent = c;
        s.appendChild(l);
      });
    });
  }

  /* Project images: show them when present, keep the labelled placeholder when a file is missing. */
  d.querySelectorAll(".slot img").forEach(function (i) {
    i.addEventListener("load", function () { i.parentNode.classList.add("ok"); });
    i.addEventListener("error", function () { i.remove(); });
    if (i.complete && i.naturalWidth) i.parentNode.classList.add("ok");
  });

  /* Frames: gentle parallax inside each image and a soft tilt toward the pointer. */
  var frames = [].slice.call(d.querySelectorAll(".slot")).filter(function (s) { return !s.closest(".zoom"); });
  function parallax() {
    var vh = innerHeight;
    frames.forEach(function (s) {
      var img = s.querySelector("img");
      if (!img || img.classList.contains("ct")) return;
      var r = s.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var p = ((r.top + r.height / 2) - vh / 2) / vh;
      s.style.setProperty("--py", (Math.max(-1, Math.min(1, p)) * -16) + "px");
    });
  }
  if (fine && !rm) {
    frames.forEach(function (s) {
      s.addEventListener("pointermove", function (e) {
        var r = s.getBoundingClientRect();
        s.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - 0.5) * 5) + "deg");
        s.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 6) + "deg");
      });
      s.addEventListener("pointerleave", function () {
        s.style.setProperty("--rx", "0deg");
        s.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* Scroll progress packet on the left edge. */
  var prog = d.createElement("div");
  prog.className = "prog";
  prog.setAttribute("aria-hidden", "true");
  prog.appendChild(d.createElement("i"));
  d.body.appendChild(prog);

  var nt = d.getElementById("nt"), ticking = false;
  function onScroll() {
    ticking = false;
    var p = scrollY / Math.max(1, d.body.scrollHeight - innerHeight);
    prog.style.setProperty("--p", Math.max(0, Math.min(1, p)));
    if (nt) nt.style.opacity = Math.max(0, 1 - scrollY / 700);
    if (!rm) parallax();
  }
  addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* Headings briefly scramble like a decrypting terminal when they first appear. */
  var CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#<>/";
  function scramble(el) {
    var w = d.createTreeWalker(el, NodeFilter.SHOW_TEXT), n = [], t;
    while ((t = w.nextNode())) n.push([t, t.nodeValue]);
    var start = performance.now(), dur = 900;
    (function step(now) {
      var k = Math.min(1, (now - start) / dur);
      n.forEach(function (p) {
        var s = p[1], o = "";
        for (var i = 0; i < s.length; i++) {
          var c = s[i];
          o += (/\s/.test(c) || i < k * s.length * 1.15) ? c : CH[Math.floor(Math.random() * CH.length)];
        }
        p[0].nodeValue = o;
      });
      if (k < 1) requestAnimationFrame(step);
      else n.forEach(function (p) { p[0].nodeValue = p[1]; });
    })(start);
  }
  if (!rm && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { so.unobserve(e.target); scramble(e.target); } });
    }, { threshold: 0.6 });
    d.querySelectorAll(".big").forEach(function (e) { so.observe(e); });
  }

  /* Lab packet journey tabs. */
  var S = [
    ["Physical layer", "Hand-terminated Ethernet runs connect the client, the Aruba switch and the Raspberry Pi servers."],
    ["VLAN", "The Windows client sits in VLAN 10. Servers are in VLAN 100 and management is in VLAN 99."],
    ["IPv4", "Servers use static addresses (192.168.100.10, .20, .30). Clients receive dynamic addresses."],
    ["Layer 3 routing", "The Aruba 2930F routes between VLANs, so a VLAN 10 client can reach VLAN 100 servers."],
    ["DHCP and DNS", "The switch relays DHCP requests to the ISC DHCP server. BIND9 resolves names in lab.home.arpa."],
    ["Application", "Nginx serves the internal dashboard, checked from real devices."]
  ];
  var sb = d.getElementById("sb"), sd = d.getElementById("sd"), idx = 0, timer, btns = [];
  function show(n) {
    idx = n;
    btns.forEach(function (b, k) { b.classList.toggle("on", k === n); });
    sd.textContent = S[n][1];
  }
  if (sb && sd) {
    S.forEach(function (s, k) {
      var b = d.createElement("button");
      b.type = "button";
      b.textContent = s[0];
      function pick() { clearInterval(timer); show(k); }
      b.addEventListener("click", pick);
      b.addEventListener("mouseenter", pick);
      b.addEventListener("focus", pick);
      sb.appendChild(b);
      btns.push(b);
    });
    show(0);
    if (!rm) timer = setInterval(function () { show((idx + 1) % S.length); }, 4500);
  }

  /* Rotating word in the hero line. */
  var W = ["computer networks", "cybersecurity", "German", "by building projects"], wi = 0, rw = d.getElementById("rw");
  if (rw && !rm) {
    setInterval(function () {
      rw.className = "o";
      setTimeout(function () {
        wi = (wi + 1) % W.length;
        rw.textContent = W[wi];
        rw.className = "i";
        void rw.offsetWidth;
        rw.className = "";
      }, 450);
    }, 2600);
  }

  /* Hero response to the pointer. */
  var por = d.getElementById("por"), hero = d.getElementById("top");
  if (!rm && fine && por && nt && hero) {
    addEventListener("pointermove", function (e) {
      var x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      por.style.transform = "rotateY(" + x * 7 + "deg) rotateX(" + (-y * 6) + "deg)";
      nt.style.transform = "translate(" + x * 18 + "px," + y * 12 + "px)";
      hero.style.setProperty("--mx", e.clientX + "px");
      hero.style.setProperty("--my", e.clientY + "px");
    });
  }

  /* Topology zoom follows the pointer. */
  var z = d.getElementById("zm"), zi = z && z.querySelector("img");
  if (z && zi) {
    z.addEventListener("pointermove", function (e) {
      var r = z.getBoundingClientRect();
      zi.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
    });
  }

  if (fine && !rm) {
    /* Cursor ring that trails the pointer and grows over links and frames. */
    var ring = d.createElement("div"), rx = 0, ry = 0, tx = 0, ty = 0;
    ring.className = "ring";
    ring.setAttribute("aria-hidden", "true");
    d.body.appendChild(ring);
    addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      ring.classList.add("v");
      ring.classList.toggle("h", !!(e.target.closest && e.target.closest("a,button,.slot")));
    });
    d.addEventListener("pointerleave", function () { ring.classList.remove("v"); });
    (function loop() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(loop);
    })();

    /* Magnetic links. */
    d.querySelectorAll("nav a,.end .lk a,.back").forEach(function (a) {
      a.addEventListener("pointermove", function (e) {
        var r = a.getBoundingClientRect();
        a.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.3) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3) + "px)";
      });
      a.addEventListener("pointerleave", function () { a.style.transform = ""; });
    });
  }

  /* A click sends a small "ping" ripple. */
  if (!rm) {
    addEventListener("pointerdown", function (e) {
      var p = d.createElement("span");
      p.className = "ping";
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      d.body.appendChild(p);
      setTimeout(function () { p.remove(); }, 800);
    });
  }

  /* Liquid contact button: a gooey blob that reaches for the pointer, sticks to it and drips. */
  var vz = d.getElementById("venom");
  if (vz && fine && !rm) {
    var vb = vz.querySelector(".vbtn"), cv = d.createElement("canvas"), cx = cv.getContext("2d");
    cv.setAttribute("aria-hidden", "true");
    vz.insertBefore(cv, vz.firstChild);
    vz.classList.add("vn");
    var VW = 0, VH = 0, dpr = Math.min(2, devicePixelRatio || 1);
    var sizeV = function () {
      var r = vz.getBoundingClientRect();
      VW = r.width; VH = r.height;
      cv.width = VW * dpr; cv.height = VH * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeV();
    addEventListener("resize", sizeV);
    var mx = 0, my = 0, inside = false, over = false, act = 0, vt = 0, run = false, lastDrip = 0, burst = 0, ready = false;
    var drips = [], parts = [], chains = [], M = 4, N = 28;
    for (var k = 0; k < M; k++) {
      var nodes = [];
      for (var q = 0; q < N; q++) nodes.push({ x: 0, y: 0 });
      chains.push({ nodes: nodes, ph: Math.random() * 6.28, sp: 0.8 + Math.random() * 0.8 });
    }
    var rr = function (x, y, w, h, r) {
      cx.beginPath();
      cx.moveTo(x + r, y);
      cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r);
      cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r);
      cx.closePath();
    };
    var geo = {};
    var measure = function () {
      var b = vb.getBoundingClientRect(), v = vz.getBoundingClientRect();
      geo.x = b.left - v.left; geo.y = b.top - v.top; geo.w = b.width; geo.h = b.height;
      geo.cx = geo.x + geo.w / 2; geo.cy = geo.y + geo.h / 2;
    };
    vz.addEventListener("pointermove", function (e) {
      var r = vz.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      inside = true;
      over = mx > geo.x && mx < geo.x + geo.w && my > geo.y && my < geo.y + geo.h;
      root.classList.add("vnm");
    });
    vz.addEventListener("pointerleave", function () { inside = false; over = false; root.classList.remove("vnm"); });
    vb.addEventListener("pointerdown", function () {
      burst = 1;
      for (var i = 0; i < 20; i++) {
        var a = Math.random() * 6.283, s = 2 + Math.random() * 5;
        parts.push({ x: geo.cx + (Math.random() - 0.5) * geo.w * 0.6, y: geo.cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 6 + Math.random() * 8 });
      }
    });
    var frame = function () {
      if (!run) return;
      requestAnimationFrame(frame);
      vt += 0.016;
      measure();
      if (!ready) {
        chains.forEach(function (c) { c.nodes.forEach(function (n) { n.x = geo.cx; n.y = geo.cy; }); });
        ready = true;
      }
      act += ((inside ? 1 : 0) - act) * 0.14;
      burst *= 0.92;
      cx.clearRect(0, 0, VW, VH);
      var g = cx.createLinearGradient(0, 0, 0, VH);
      g.addColorStop(0, "#f4f4f0"); g.addColorStop(1, "#aebccb");
      cx.fillStyle = g;
      var grow = burst * 14 + (over ? 14 : 0) * act;
      rr(geo.x - grow, geo.y - grow / 2, geo.w + grow * 2, geo.h + grow, (geo.h + grow) / 2);
      cx.fill();

      var tx = inside ? mx : geo.cx, ty = inside ? my : geo.cy;
      var dx = tx - geo.cx, dy = ty - geo.cy, dist = Math.hypot(dx, dy), reach = 520;
      if (dist > reach) { tx = geo.cx + dx / dist * reach; ty = geo.cy + dy / dist * reach; }
      var spread = over ? 120 : 26;
      chains.forEach(function (c, k) {
        var a = c.ph + vt * c.sp * 1.6 + k * 1.57, wob = k ? 1 : 0.15;
        var hx = geo.cx + (tx - geo.cx) * act + Math.cos(a) * spread * act * wob;
        var hy = geo.cy + (ty - geo.cy) * act + Math.sin(a) * spread * act * wob;
        var nx = -(hy - geo.cy), ny = hx - geo.cx, nl = Math.hypot(nx, ny) || 1;
        nx /= nl; ny /= nl;
        for (var i = 0; i < N; i++) {
          var f = i / (N - 1);
          var w = Math.sin(f * Math.PI) * Math.sin(vt * 2.2 * c.sp + f * 5 + k) * 18 * act;
          var px = geo.cx + (hx - geo.cx) * f + nx * w, py = geo.cy + (hy - geo.cy) * f + ny * w;
          var n = c.nodes[i], ease = 0.5 - 0.28 * f;
          n.x += (px - n.x) * ease; n.y += (py - n.y) * ease;
          var r = (30 - 14 * f) * (0.2 + 0.8 * act) * (k ? 0.8 : 1);
          cx.beginPath(); cx.arc(n.x, n.y, Math.max(r, 0.1), 0, 6.283); cx.fill();
        }
        var tip = c.nodes[N - 1];
        cx.beginPath(); cx.arc(tip.x, tip.y, (k ? 12 : 24) * act, 0, 6.283); cx.fill();
      });

      if (act > 0.05 && dist < 340) {
        var ex = Math.max(geo.x, Math.min(geo.x + geo.w, tx)), ey = Math.max(geo.y, Math.min(geo.y + geo.h, ty));
        cx.beginPath(); cx.arc(ex, ey, 34 * act, 0, 6.283); cx.fill();
      }
      if (over) {
        for (var s2 = 0; s2 < 5; s2++) {
          var sa = vt * (1.6 + s2 * 0.3) + s2 * 1.256;
          cx.beginPath(); cx.arc(mx + Math.cos(sa) * 44, my + Math.sin(sa) * 44, 8 + (s2 % 2) * 3, 0, 6.283); cx.fill();
        }
      }
      if (over && vt - lastDrip > 0.3) {
        lastDrip = vt;
        drips.push({ x: geo.x + geo.w * 0.12 + Math.random() * geo.w * 0.76, y: geo.y + geo.h - 6, vy: 0.3, r: 6 + Math.random() * 5 });
      }
      drips = drips.filter(function (p) {
        p.vy += 0.28; p.y += p.vy; p.r -= 0.015;
        cx.beginPath(); cx.arc(p.x, p.y, Math.max(p.r, 0.1), 0, 6.283); cx.fill();
        return p.y < VH + 20 && p.r > 2;
      });
      parts = parts.filter(function (p) {
        p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy = p.vy * 0.96 + 0.05; p.r *= 0.985;
        cx.beginPath(); cx.arc(p.x, p.y, Math.max(p.r, 0.1), 0, 6.283); cx.fill();
        return p.r > 2;
      });
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting;
        if (on && !run) { run = true; requestAnimationFrame(frame); }
        if (!on) run = false;
      }).observe(vz);
    } else { run = true; requestAnimationFrame(frame); }
  }
})();
