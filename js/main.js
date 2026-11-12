/* Shared behaviour: mobile nav, footer year, reveal-on-scroll,
   skill bars and animated counters. */
document.addEventListener("DOMContentLoaded", function () {
  // ----- Mobile navigation -----
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // ----- Footer year -----
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ----- Counters -----
  function animateCount(el) {
    var target = Number(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.round(progress * target) + (progress === 1 ? suffix : "");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ----- Reveal / skill bars / counters on scroll -----
  var revealEls = document.querySelectorAll(".reveal");
  var bars = document.querySelectorAll(".bar > i[data-level]");
  var counters = document.querySelectorAll("[data-count]");

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    bars.forEach(function (b) { b.style.width = b.dataset.level + "%"; });
    counters.forEach(function (c) { c.textContent = c.dataset.count + (c.dataset.suffix || ""); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (el.classList.contains("reveal")) el.classList.add("in");
      if (el.dataset.level) el.style.width = el.dataset.level + "%";
      if (el.dataset.count) animateCount(el);
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) { observer.observe(el); });
  bars.forEach(function (el) { observer.observe(el); });
  counters.forEach(function (el) { observer.observe(el); });
});
