/* Gemeinsamer Umschalter für helles und dunkles Design.
   Drei Zustände: Automatisch (Systemeinstellung), Hell, Dunkel.
   Die Wahl bleibt nur im eigenen Browser (localStorage) gespeichert. */
(function () {
  "use strict";
  var KEY = "mtj-theme";
  var ORDER = ["auto", "light", "dark"];
  var LABEL = { auto: "Design: automatisch", light: "Design: hell", dark: "Design: dunkel" };
  var ICON = {
    auto: '<circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/><path d="M12 7a5 5 0 0 0 0 10z" fill="currentColor" stroke="none"/>',
    light: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>',
    dark: '<path d="M20 13.4A8.3 8.3 0 0 1 10.6 4a8.4 8.4 0 1 0 9.4 9.4z"/>'
  };

  function gespeichert() {
    try { var v = localStorage.getItem(KEY); return ORDER.indexOf(v) > -1 ? v : "auto"; }
    catch (e) { return "auto"; }
  }
  function anwenden(modus) {
    var el = document.documentElement;
    if (modus === "auto") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", modus);
  }

  var modus = gespeichert();
  anwenden(modus);

  function knopf() {
    if (document.getElementById("themeToggle")) return;
    var b = document.createElement("button");
    b.id = "themeToggle";
    b.type = "button";
    b.className = "theme-toggle";
    b.setAttribute("aria-live", "polite");
    document.body.appendChild(b);
    zeichnen();
    b.addEventListener("click", function () {
      modus = ORDER[(ORDER.indexOf(modus) + 1) % ORDER.length];
      try { localStorage.setItem(KEY, modus); } catch (e) {}
      anwenden(modus);
      zeichnen();
    });
    function zeichnen() {
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + ICON[modus] + "</svg>" +
        '<span class="theme-label">' + LABEL[modus].replace("Design: ", "") + "</span>";
      b.setAttribute("title", LABEL[modus] + " – klicken zum Wechseln");
      b.setAttribute("aria-label", LABEL[modus] + ", klicken zum Wechseln");
    }
  }

  var css = document.createElement("style");
  css.textContent =
    ".theme-toggle{position:fixed;top:12px;right:12px;z-index:9999;display:inline-flex;align-items:center;gap:6px;" +
    "padding:7px 11px;border-radius:999px;border:1px solid var(--line,#d6e0e3);background:var(--paper,#fff);" +
    "color:var(--ink2,#4a5e66);font:500 13px/1 inherit;font-family:inherit;cursor:pointer;" +
    "box-shadow:0 1px 2px rgba(0,0,0,.06),0 2px 10px rgba(0,0,0,.07);transition:border-color .15s,color .15s}" +
    ".theme-toggle:hover{border-color:var(--ink3,#6c8088);color:var(--ink,#13262e)}" +
    ".theme-toggle svg{width:16px;height:16px;flex:0 0 auto}" +
    "@media (max-width:760px){.theme-toggle{top:8px;right:8px;padding:7px}.theme-toggle .theme-label{display:none}}" +
    "@media print{.theme-toggle{display:none}}";
  (document.head || document.documentElement).appendChild(css);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", knopf);
  else knopf();
})();
