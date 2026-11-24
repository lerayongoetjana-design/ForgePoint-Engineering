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
    var siteHeader = document.querySelector(".site-header");
    if (siteHeader) siteHeader.classList.toggle("is-menu-open", open);
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

  /* Header: transparent over the hero, solid navy once the page scrolls
     ------------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
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

  /* Contact page: enquiry form validation (no back end — nothing is sent)
     ------------------------------------------------------------------------ */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.noValidate = true; // use the custom messages below instead of browser pop-ups

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;
    var MESSAGE_MIN = 20;

    var rules = {
      fullName: function (v) {
        if (!v) return "Enter your full name.";
        if (v.length < 2) return "Full name must be at least 2 characters.";
        return "";
      },
      company: function (v) {
        return v ? "" : "Enter your company name.";
      },
      email: function (v) {
        if (!v) return "Enter your email address.";
        if (!EMAIL_PATTERN.test(v)) return "Enter an email address in the correct format, like name@company.co.uk.";
        return "";
      },
      phone: function (v) {
        if (!v) return "";
        if (!PHONE_PATTERN.test(v) || v.replace(/\D/g, "").length < 7) {
          return "Enter a valid phone number, like 07700 900000 or +44 20 7946 0000, or leave this blank.";
        }
        return "";
      },
      service: function (v) {
        return v ? "" : "Select the service you are interested in.";
      },
      message: function (v) {
        if (!v) return "Enter a message describing your enquiry.";
        if (v.length < MESSAGE_MIN) {
          return "Your message must be at least " + MESSAGE_MIN + " characters (currently " + v.length + ").";
        }
        return "";
      },
      consent: function (checked) {
        return checked ? "" : "Tick the box to confirm we can use your details to respond.";
      }
    };

    var alertBox = document.getElementById("form-alert");
    var success = document.getElementById("form-success");
    var successTitle = document.getElementById("form-success-title");
    var successName = document.querySelector("[data-success-name]");
    var resetBtn = document.getElementById("form-reset");

    var valueOf = function (field) {
      return field.type === "checkbox" ? field.checked : field.value.trim();
    };

    var validateField = function (field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var message = rule(valueOf(field));
      var errorEl = document.getElementById(field.id + "-error");
      if (errorEl) errorEl.textContent = message;
      if (message) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
      return !message;
    };

    var fields = Object.keys(rules)
      .map(function (name) { return form.elements[name]; })
      .filter(Boolean);

    fields.forEach(function (field) {
      // Check a field once the user leaves it, then re-check as they correct it
      field.addEventListener("blur", function () {
        if (field.type !== "checkbox" && valueOf(field) === "" && !field.dataset.touched) return;
        field.dataset.touched = "true";
        validateField(field);
      });
      field.addEventListener(field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input", function () {
        if (field.getAttribute("aria-invalid") === "true" || field.type === "checkbox" || field.tagName === "SELECT") {
          field.dataset.touched = "true";
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var firstInvalid = null;
      var errorCount = 0;

      fields.forEach(function (field) {
        field.dataset.touched = "true";
        if (!validateField(field)) {
          errorCount += 1;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (firstInvalid) {
        alertBox.textContent =
          errorCount === 1
            ? "There is 1 problem with the form. Please check the highlighted field."
            : "There are " + errorCount + " problems with the form. Please check the highlighted fields.";
        alertBox.hidden = false;
        firstInvalid.focus();
        return;
      }

      // Valid: show the on-page confirmation. Nothing is sent or stored.
      alertBox.hidden = true;
      var firstName = valueOf(form.elements.fullName).split(/\s+/)[0];
      successName.textContent = firstName ? ", " + firstName : "";
      form.hidden = true;
      success.hidden = false;
      form.parentElement.classList.add("is-complete");
      successTitle.focus();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        fields.forEach(function (field) {
          delete field.dataset.touched;
          field.removeAttribute("aria-invalid");
          var errorEl = document.getElementById(field.id + "-error");
          if (errorEl) errorEl.textContent = "";
        });
        alertBox.hidden = true;
        success.hidden = true;
        form.hidden = false;
        form.parentElement.classList.remove("is-complete");
        form.elements.fullName.focus();
      });
    }
  }

  /* Fade-up entrance as sections scroll into view
     ------------------------------------------------------------------------ */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    var REVEAL_SELECTOR = [
      ".section-header",
      ".card",
      ".project-card",
      ".value-card",
      ".process__step",
      ".philosophy > *",
      ".expertise > *",
      ".industry__header",
      ".industry__body > *",
      ".service__intro",
      ".service__detail",
      ".case",
      ".cta-band__inner",
      ".form-card",
      ".contact-aside > *",
      ".sectors__list > li"
    ].join(",");

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-visible");
          revealObserver.unobserve(el);
          // Hand transitions back to the element (e.g. card hover) once finished
          var delay = parseInt(el.style.getPropertyValue("--reveal-delay"), 10) || 0;
          window.setTimeout(function () {
            el.classList.remove("reveal", "is-visible");
            el.style.removeProperty("--reveal-delay");
          }, 900 + delay);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      // Leave anything already on screen alone so it never flickers
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      // Stagger items that sit side by side in the same list or grid
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.matches(REVEAL_SELECTOR);
      });
      var index = siblings.indexOf(el);
      if (siblings.length > 1 && index > 0) {
        el.style.setProperty("--reveal-delay", Math.min(index, 4) * 90 + "ms");
      }
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* Copyright year
     ------------------------------------------------------------------------ */
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = year;
  });
})();
