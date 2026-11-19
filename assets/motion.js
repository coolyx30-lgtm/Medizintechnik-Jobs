/* Bewegung und Tiefe für alle Seiten von Medizintechnik-Jobs.
   Drei Bausteine, alle rein dekorativ und ohne weitere Abhängigkeit:
     1. Seitenwechsel blenden weich ineinander (View Transitions).
     2. Abschnitte und Karten blenden beim Scrollen ein (CSS Scroll-driven Animations).
     3. Karten bekommen unter dem Mauszeiger einen Lichtschein und heben sich leicht an,
        das Bild im Kopfbereich der Übersicht folgt dem Zeiger mit Tiefenversatz.
   Alles schaltet sich ab bei „Bewegung reduzieren“, auf Touchgeräten und beim Drucken.
   Ohne Unterstützung im Browser bleibt die Seite unverändert sichtbar. */
(function () {
  "use strict";

  var LIT = ".feature,.item,.card,.box,.key,.kpi,.stat,.vcard,.entry,.steps>li";
  var REVEAL = ".feature,.phase,.card,.box,.key,.stat,.vcard,.entry,.tblwrap,.tablewrap,.steps>li,.wrap>h2,.wrap>p,.wrap>.toc";

  var css = document.createElement("style");
  css.id = "mtj-motion";
  css.textContent = [
    /* 1. Seitenwechsel */
    "@view-transition{navigation:auto}",
    "::view-transition-old(root),::view-transition-new(root){animation-duration:.3s}",

    /* 2. Einblenden beim Scrollen */
    "@supports (animation-timeline: view()){@media (prefers-reduced-motion: no-preference){",
    ".mtj-reveal{animation:mtj-in linear both;animation-timeline:view();animation-range:entry 0% entry 60%}",
    "@keyframes mtj-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}",
    "}}",

    /* 3. Lichtschein und Anheben unter dem Zeiger */
    "@media (hover:hover) and (pointer:fine) and (prefers-reduced-motion: no-preference){",
    ".mtj-lit{position:relative;transition:transform .35s var(--ease,cubic-bezier(.16,1,.3,1)),box-shadow .35s var(--ease,cubic-bezier(.16,1,.3,1)),border-color .25s ease}",
    ".mtj-lit::after{content:\"\";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;opacity:0;transition:opacity .3s ease;",
    "background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),color-mix(in srgb,var(--accent,#0B6E79) 14%,transparent),transparent 70%)}",
    ".mtj-lit:hover::after{opacity:1}",
    ".mtj-lit:hover{transform:translateY(-2px);box-shadow:var(--shadow,0 2px 6px rgba(19,38,46,.08),0 12px 32px rgba(19,38,46,.12))}",
    ".mtj-lit>*{position:relative;z-index:1}",
    ".item.mtj-lit{border-radius:14px}",

    /* Kopfbereich der Übersicht mit Tiefe */
    ".feature .art{perspective:900px}",
    ".feature .art svg{transition:transform .45s var(--ease,cubic-bezier(.16,1,.3,1));will-change:transform}",
    ".feature:hover .art svg{transform:scale(1.05) translate3d(calc(var(--hx,0)*-10px),calc(var(--hy,0)*-10px),0)}",
    ".feature .art [data-depth]{transition:transform .45s var(--ease,cubic-bezier(.16,1,.3,1))}",
    ".feature:hover .art [data-depth='1']{transform:translate(calc(var(--hx,0)*-7px),calc(var(--hy,0)*-6px))}",
    ".feature:hover .art [data-depth='2']{transform:translate(calc(var(--hx,0)*-14px),calc(var(--hy,0)*-12px))}",
    "}",

    "@media print{.mtj-lit::after{display:none}}"
  ].join("");
  (document.head || document.documentElement).appendChild(css);

  function start() {
    var fein = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      document.querySelectorAll(REVEAL).forEach(function (el) {
        if (!el.closest(".leaflet-container,.theme-toggle")) el.classList.add("mtj-reveal");
      });
    } catch (e) {}

    if (!fein || ruhig) return;

    try {
      document.querySelectorAll(LIT).forEach(function (el) { el.classList.add("mtj-lit"); });
    } catch (e) {}

    var warte = false;
    document.addEventListener("pointermove", function (ev) {
      if (warte) return;
      warte = true;
      requestAnimationFrame(function () {
        warte = false;
        var karte = ev.target && ev.target.closest ? ev.target.closest(".mtj-lit") : null;
        if (karte) {
          var r = karte.getBoundingClientRect();
          karte.style.setProperty("--mx", ((ev.clientX - r.left) / r.width * 100).toFixed(1) + "%");
          karte.style.setProperty("--my", ((ev.clientY - r.top) / r.height * 100).toFixed(1) + "%");
        }
        var held = ev.target && ev.target.closest ? ev.target.closest(".feature") : null;
        if (held) {
          var f = held.getBoundingClientRect();
          held.style.setProperty("--hx", (((ev.clientX - f.left) / f.width - .5) * 2).toFixed(3));
          held.style.setProperty("--hy", (((ev.clientY - f.top) / f.height - .5) * 2).toFixed(3));
        }
      });
    }, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
