/* ==========================================================================
   ForgePoint Engineering — shared script
   Fictional company created for portfolio demonstration.
   --------------------------------------------------------------------------
   1. Setup
   2. Mobile navigation
   3. Header state (transparent over hero, solid on scroll)
   4. Services sub-navigation
   5. Project filters
   6. Enquiry form (demonstration only — nothing is sent or stored)
   7. Scroll reveal + methodology progress
   8. Copyright year
   ========================================================================== */
(function () {
  "use strict";

  /* 1. Setup
     ------------------------------------------------------------------------ */
  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DESKTOP_QUERY = window.matchMedia("(min-width: 68em)");
  var header = document.querySelector(".site-header");

  /* 2. Mobile navigation
     ------------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNavOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (header) header.classList.toggle("is-menu-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNavOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setNavOpen(false);
        toggle.focus();
      }
    });

    var onBreakpoint = function (event) {
      if (event.matches) setNavOpen(false);
    };
    if (DESKTOP_QUERY.addEventListener) {
      DESKTOP_QUERY.addEventListener("change", onBreakpoint);
    } else if (DESKTOP_QUERY.addListener) {
      DESKTOP_QUERY.addListener(onBreakpoint);
    }
  }

  /* 3. Header state
     ------------------------------------------------------------------------ */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* 4. Services sub-navigation: highlight the section in view
     ------------------------------------------------------------------------ */
  var subnavLinks = Array.prototype.slice.call(document.querySelectorAll(".subnav__link"));

  function setActiveSubnav(id) {
    subnavLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + id;
      if (active) {
        link.setAttribute("aria-current", "true");
        var list = link.closest(".subnav__list");
        if (list && list.scrollWidth > list.clientWidth) {
          list.scrollTo({
            left: Math.max(0, link.parentElement.offsetLeft - 16),
            behavior: reduceMotion ? "auto" : "smooth"
          });
        }
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (subnavLinks.length) {
    subnavLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setActiveSubnav(link.getAttribute("href").slice(1));
      });
    });

    if ("IntersectionObserver" in window) {
      var sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActiveSubnav(entry.target.id);
          });
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      subnavLinks.forEach(function (link) {
        var section = document.getElementById(link.getAttribute("href").slice(1));
        if (section) sectionObserver.observe(section);
      });
    }
  }

  /* 5. Project filters
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
        if (wasHidden && !reduceMotion) {
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

  /* 6. Enquiry form
     Demonstration only. The fields have no name attributes and there is no
     action URL, so the browser has nothing to send; values are only read here
     to validate them, then cleared.
     ------------------------------------------------------------------------ */
  var form = document.getElementById("enquiry-form");

  if (form) {
    form.noValidate = true;

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_PATTERN = /^\+?[0-9\s()-]{7,20}$/;
    var MESSAGE_MIN = 20;

    var rules = {
      "full-name": function (v) {
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
    var card = form.closest(".form-card");

    // The submit button stays disabled without JavaScript, so nothing can be submitted
    form.querySelectorAll("[data-requires-js]").forEach(function (el) {
      el.disabled = false;
    });

    var fields = Object.keys(rules)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var valueOf = function (field) {
      return field.type === "checkbox" ? field.checked : field.value.trim();
    };

    var labelText = function (field) {
      if (field.type === "checkbox") return "Consent";
      var label = form.querySelector('label[for="' + field.id + '"]');
      return label ? label.textContent.replace("*", "").replace("(optional)", "").trim() : field.id;
    };

    var validateField = function (field) {
      var message = rules[field.id](valueOf(field));
      var errorEl = document.getElementById(field.id + "-error");
      if (errorEl) errorEl.textContent = message;
      if (message) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
      return message;
    };

    fields.forEach(function (field) {
      var isChoice = field.tagName === "SELECT" || field.type === "checkbox";

      // Check a field once the user leaves it (not on an untouched empty field)
      field.addEventListener("blur", function () {
        if (!isChoice && valueOf(field) === "" && !field.dataset.touched) return;
        field.dataset.touched = "true";
        validateField(field);
      });

      // Re-check as they correct it, so errors clear straight away
      field.addEventListener(isChoice ? "change" : "input", function () {
        if (isChoice || field.getAttribute("aria-invalid") === "true") {
          field.dataset.touched = "true";
          validateField(field);
        }
      });
    });

    var showSummary = function (problems) {
      alertBox.innerHTML = "";
      var heading = document.createElement("p");
      heading.className = "form-alert__title";
      heading.textContent =
        problems.length === 1
          ? "There is 1 problem with your enquiry"
          : "There are " + problems.length + " problems with your enquiry";
      var list = document.createElement("ul");
      list.className = "form-alert__list";
      problems.forEach(function (problem) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + problem.field.id;
        link.textContent = labelText(problem.field) + ": " + problem.message;
        link.addEventListener("click", function (event) {
          event.preventDefault();
          problem.field.focus();
          problem.field.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
        });
        item.appendChild(link);
        list.appendChild(item);
      });
      alertBox.appendChild(heading);
      alertBox.appendChild(list);
      alertBox.hidden = false;
      alertBox.focus();
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var problems = [];

      fields.forEach(function (field) {
        field.dataset.touched = "true";
        var message = validateField(field);
        if (message) problems.push({ field: field, message: message });
      });

      if (problems.length) {
        showSummary(problems);
        return;
      }

      // Valid: confirm on the page, then clear every value. Nothing is sent or stored.
      var firstName = valueOf(document.getElementById("full-name")).split(/\s+/)[0];
      successName.textContent = firstName ? ", " + firstName : "";
      form.reset();
      fields.forEach(function (field) {
        delete field.dataset.touched;
      });
      alertBox.hidden = true;
      form.hidden = true;
      success.hidden = false;
      if (card) card.classList.add("is-complete");
      successTitle.focus();
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        fields.forEach(function (field) {
          field.removeAttribute("aria-invalid");
          var errorEl = document.getElementById(field.id + "-error");
          if (errorEl) errorEl.textContent = "";
        });
        successName.textContent = "";
        success.hidden = true;
        form.hidden = false;
        if (card) card.classList.remove("is-complete");
        document.getElementById("full-name").focus();
      });
    }
  }

  /* 7. Scroll reveal + methodology progress
     ------------------------------------------------------------------------ */
  var methods = document.querySelectorAll("[data-method]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    methods.forEach(function (m) { m.classList.add("is-active"); });
  } else {
    // Methodology: draw the progress line once, when the steps come into view
    var methodObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            methodObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    methods.forEach(function (m) { methodObserver.observe(m); });

    var REVEAL_SELECTOR = [
      ".section-header",
      ".card",
      ".project-card",
      ".value-card",
      ".method__step",
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

  /* 8. Copyright year
     ------------------------------------------------------------------------ */
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = year;
  });
})();
