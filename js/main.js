/* ==========================================================================
   ForgePoint Engineering — shared script
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var DESKTOP_QUERY = window.matchMedia("(min-width: 68em)");

  /* Mobile navigation
     ------------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close when a link inside the menu is chosen
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNavOpen(false);
    });

    // Close on Escape and return focus to the toggle
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNavOpen(false);
        toggle.focus();
      }
    });

    // Reset when resizing up to the desktop layout
    var onBreakpoint = function (event) {
      if (event.matches) setNavOpen(false);
    };
    if (DESKTOP_QUERY.addEventListener) {
      DESKTOP_QUERY.addEventListener("change", onBreakpoint);
    } else if (DESKTOP_QUERY.addListener) {
      DESKTOP_QUERY.addListener(onBreakpoint);
    }
  }

  /* Header shadow once the page has scrolled
     ------------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Services sub-navigation: highlight the section in view
     ------------------------------------------------------------------------ */
  var subnavLinks = document.querySelectorAll(".subnav__link");
  if (subnavLinks.length && "IntersectionObserver" in window) {
    var linkFor = {};
    subnavLinks.forEach(function (link) {
      linkFor[link.getAttribute("href").slice(1)] = link;
    });

    var setActive = function (id) {
      subnavLinks.forEach(function (link) {
        if (link === linkFor[id]) {
          link.setAttribute("aria-current", "true");
          // Keep the active link visible when the sub-nav scrolls sideways
          var list = link.closest(".subnav__list");
          if (list && list.scrollWidth > list.clientWidth) {
            list.scrollTo({ left: Math.max(0, link.parentElement.offsetLeft - 16), behavior: "smooth" });
          }
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // Treat a band just below the sticky bars as "in view"
      { rootMargin: "-30% 0px -60% 0px" }
    );

    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* Projects page: filter case studies by type
     ------------------------------------------------------------------------ */
  var filterButtons = document.querySelectorAll(".filter__btn");
  var cases = document.querySelectorAll(".case[data-category]");
  var filterStatus = document.querySelector(".filter__status");

  function applyFilter(filter) {
    var shown = 0;
    filterButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-filter") === filter));
    });
    cases.forEach(function (item) {
      var categories = item.getAttribute("data-category").split(" ");
      var match = filter === "all" || categories.indexOf(filter) !== -1;
      var wasHidden = item.hidden;
      item.hidden = !match;
      if (match) {
        shown += 1;
        if (wasHidden) {
          item.classList.remove("is-entering");
          void item.offsetWidth; // restart the animation
          item.classList.add("is-entering");
        }
      }
    });
    if (filterStatus) {
      filterStatus.textContent =
        "Showing " + shown + " of " + cases.length + " case stud" + (cases.length === 1 ? "y" : "ies");
    }
  }

  if (filterButtons.length && cases.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  /* Copyright year
     ------------------------------------------------------------------------ */
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = year;
  });
})();
