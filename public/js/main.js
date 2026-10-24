(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var rm = matchMedia("(prefers-reduced-motion: reduce)");
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  root.classList.add("ready");

  /* Navigation: frosted bar once the page scrolls, active section, mobile menu. */
  var nav = d.getElementById("nav"), menu = d.getElementById("menu"), menuBtn = d.getElementById("menu-btn");
  var ticking = false;
  function onScroll() {
    ticking = false;
    nav.classList.toggle("scrolled", scrollY > 8);
  }
  addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
    });
    d.addEventListener("pointerdown", function (e) {
      if (nav.classList.contains("open") && !nav.contains(e.target)) setMenu(false);
    });
    matchMedia("(min-width: 901px)").addEventListener("change", function (e) { if (e.matches) setMenu(false); });
  }

  var links = [].slice.call(d.querySelectorAll(".nav-links a"));
  if ("IntersectionObserver" in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var aliases = { stack: "about", contact: "github" };
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id === "top" ? null : (aliases[e.target.id] || e.target.id);
        links.forEach(function (a) { a.classList.toggle("active", a === byId[id]); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    d.querySelectorAll("#top, main > section[id]").forEach(function (s) { so.observe(s); });
  }

  /* Scroll reveal: once per element, siblings staggered by 60ms. */
  var reveals = d.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (es) {
      var batch = es.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (e, i) {
        e.target.style.setProperty("--d", Math.min(i, 4) * 60 + "ms");
        e.target.classList.add("in");
        ro.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Cursor-follow glow on cards (pointer devices only, writes to the hovered card alone). */
  if (fine) {
    d.querySelectorAll(".card").forEach(function (c) {
      c.setAttribute("data-glow", "");
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--gx", e.clientX - r.left + "px");
        c.style.setProperty("--gy", e.clientY - r.top + "px");
      });
    });
  }

  /* Rotating word in the hero line. */
  var W = ["computer networks", "cybersecurity", "German", "by building projects"], wi = 0, rw = d.getElementById("rw");
  if (rw) {
    rw.parentNode.setAttribute("aria-hidden", "true");
    var tag = rw.closest(".hero-tag");
    var sr = d.createElement("span");
    sr.className = "sr-only";
    sr.textContent = W.join(", ");
    tag.appendChild(sr);
    setInterval(function () {
      if (rm.matches || d.hidden) return;
      rw.className = "o";
      setTimeout(function () {
        wi = (wi + 1) % W.length;
        rw.textContent = W[wi];
        rw.className = "i";
        void rw.offsetWidth;
        rw.className = "";
      }, 320);
    }, 2800);
  }

  /* Screenshots: fade in on load, keep a labelled placeholder when a file is missing. */
  d.querySelectorAll(".shot img").forEach(function (i) {
    var fig = i.closest(".shot");
    function ok() { i.classList.add("ok"); }
    function miss() {
      fig.classList.add("missing");
      fig.querySelector(".shot-view").setAttribute("data-f", fig.getAttribute("data-f"));
      i.remove();
    }
    if (i.complete) { if (i.naturalWidth) ok(); else miss(); }
    else { i.addEventListener("load", ok); i.addEventListener("error", miss); }
  });

  /* Lightbox for every screenshot. */
  var lb = d.getElementById("lb"), lbImg = d.getElementById("lb-img"), lbCap = d.getElementById("lb-cap");
  function openLb(img, caption) {
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = caption;
    lb.classList.add("entering");
    lb.showModal();
    root.classList.add("lb-open");
    requestAnimationFrame(function () { requestAnimationFrame(function () { lb.classList.remove("entering"); }); });
  }
  function closeLb() {
    if (!lb.open || lb.classList.contains("leaving")) return;
    lb.classList.add("leaving");
    setTimeout(function () {
      lb.classList.remove("leaving");
      lb.close();
    }, rm.matches ? 0 : 150);
  }
  if (lb && typeof lb.showModal === "function") {
    d.addEventListener("click", function (e) {
      var b = e.target.closest(".shot-view");
      if (!b) return;
      var img = b.querySelector("img");
      if (!img) return;
      openLb(img, b.parentNode.querySelector(".shot-bar").textContent);
    });
    d.getElementById("lb-close").addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-fig")) closeLb(); });
    lb.addEventListener("cancel", function (e) { e.preventDefault(); closeLb(); });
    lb.addEventListener("close", function () { root.classList.remove("lb-open"); lbImg.removeAttribute("src"); });
  } else {
    d.querySelectorAll(".shot-view").forEach(function (b) { b.style.cursor = "default"; });
  }

  /* Lab packet journey: segmented control that highlights the matching part of the topology. */
  var S = [
    ["Physical layer", "Hand-terminated Ethernet runs connect the client, the Aruba switch and the Raspberry Pi servers."],
    ["VLAN", "The Windows client sits in VLAN 10. Servers are in VLAN 100 and management is in VLAN 99."],
    ["IPv4", "Servers use static addresses (192.168.100.10, .20, .30). Clients receive dynamic addresses."],
    ["Layer 3 routing", "The Aruba 2930F routes between VLANs, so a VLAN 10 client can reach VLAN 100 servers."],
    ["DHCP and DNS", "The switch relays DHCP requests to the ISC DHCP server. BIND9 resolves names in lab.home.arpa."],
    ["Application", "Nginx serves the internal dashboard, checked from real devices."]
  ];
  var sb = d.getElementById("sb"), sd = d.getElementById("sd"), topo = d.getElementById("topo");
  var groups = topo ? [].slice.call(topo.querySelectorAll("g[data-k]")) : [];
  var tabs = [];
  function show(n, focus) {
    tabs.forEach(function (b, k) {
      var on = k === n;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    sd.textContent = S[n][1];
    if (topo) {
      topo.classList.add("hl");
      groups.forEach(function (g) {
        var ks = g.getAttribute("data-k").split(" ");
        g.classList.toggle("dim", ks.indexOf(String(n)) < 0);
      });
    }
    if (focus) {
      tabs[n].focus();
      tabs[n].scrollIntoView({ block: "nearest", inline: "nearest", behavior: rm.matches ? "auto" : "smooth" });
    }
  }
  if (sb && sd) {
    sd.id = "sd";
    S.forEach(function (s, k) {
      var b = d.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "sd");
      b.textContent = s[0];
      b.addEventListener("click", function () { show(k); });
      sb.appendChild(b);
      tabs.push(b);
    });
    sb.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(d.activeElement);
      if (i < 0) return;
      var next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
      if (next === null) return;
      e.preventDefault();
      show((next + tabs.length) % tabs.length, true);
    });
    show(0);
  }

  /* Copy email address, with a short confirmation. */
  var copy = d.getElementById("copy"), status = d.getElementById("copy-status"), copyTimer;
  if (copy) {
    if (!navigator.clipboard) copy.hidden = true;
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(copy.getAttribute("data-copy")).then(function () {
        copy.classList.add("done");
        status.textContent = "Email address copied";
        clearTimeout(copyTimer);
        copyTimer = setTimeout(function () { copy.classList.remove("done"); status.textContent = ""; }, 1800);
      });
    });
  }
})();
