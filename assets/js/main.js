/* ==========================================================================
   Thin Chitsothean — site interactions
   Vanilla JS, no dependencies. Every block is defensive: a missing element
   simply skips that feature, so pages can be reused independently.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     1. Sticky header shadow on scroll
     ---------------------------------------------------------------------- */
  function initStickyHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle("is-stuck", window.scrollY > 8);
      ticking = false;
    }
    update();

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------------------
     2. Mobile navigation
     ---------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.getSelectorSelector("[data-nav-menu]");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a destination
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset when resizing up to the desktop layout
    var desktop = window.matchMedia("(min-width: 881px)");
    (desktop.addEventListener ? desktop.addEventListener.bind(desktop, "change") : desktop.addListener.bind(desktop))(
      function (event) {
        if (event.matches) setOpen(false);
      }
    );
  }

  /* ----------------------------------------------------------------------
     3. Scroll reveal
     Staggers children of a [data-reveal-group] by `--d` automatically.
     ---------------------------------------------------------------------- */
  function initReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

    document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (child, index) {
        if (child.hasAttribute("data-reveal")) return;
        child.setAttribute("data-reveal", "");
        child.style.setProperty("--d", Math.min(index * 85, 510) + "ms");
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------------------
     4. Portfolio filtering
     ---------------------------------------------------------------------- */
  function initFilter() {
    var bar = document.querySelector("[data-filter-bar]");
    if (!bar) return;

    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-category]"));
    var empty = document.querySelector("[data-filter-empty]");
    var count = document.querySelector("[data-filter-count]");

    function apply(value) {
      var shown = 0;

      cards.forEach(function (card) {
        var match = value === "all" || card.getAttribute("data-category") === value;
        card.hidden = !match;
        if (match) shown += 1;
      });

      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === value));
      });

      if (empty) empty.hidden = shown !== 0;
      if (count) {
        count.textContent = String(shown);
      }
    }

    bar.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) return;
      apply(button.getAttribute("data-filter"));
    });

    // Optional deep link: portfolio.html?filter=web
    var requested = new URLSearchParams(window.location.search).get("filter");
    var known = buttons.some(function (b) { return b.getAttribute("data-filter") === requested; });
    apply(known ? requested : "all");
  }

  /* ----------------------------------------------------------------------
     5. Pointer-tracked glow on cards
     ---------------------------------------------------------------------- */
  function initCardGlow() {
    if (reduceMotion || window.matchMedia("(hover: none)").matches) return;

    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener(
        "pointermove",
        function (event) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", event.clientX - rect.left + "px");
          card.style.setProperty("--my", event.clientY - rect.top + "px");
        },
        { passive: true }
      );
    });
  }

  /* ----------------------------------------------------------------------
     6. Contact form
     Validates inline, then hands the message to the visitor's own mail client
     with a prefilled subject and body. No backend, so nothing to configure and
     no third-party service between the visitor and their mail app.
     ---------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = document.querySelector("[data-form-status]");
    var statusText = document.querySelector("[data-form-status-text]");
    var recipient = form.getAttribute("data-mailto") || "hibossfact12@gmail.com";

    // Local part: dot-separated atoms (no leading, trailing or doubled dots).
    // Domain: labels that start and end alphanumeric, ending in an alphabetic TLD.
    var EMAIL_RE = new RegExp(
      "^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+" +
      "(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*" +
      "@" +
      "(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+" +
      "[A-Za-z]{2,}$"
    );

    var FIELDS = [
      { name: "name",    label: "Name",    message: "Please tell me your name." },
      { name: "email",   label: "Email",   message: "Please enter a valid email address." },
      { name: "message", label: "Message", message: "Please write a short message." }
    ];

    function setError(field, message) {
      var input = form.elements[field.name];
      var slot = form.querySelector('[data-error-for="' + field.name + '"]');
      if (!input) return;

      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (slot) {
          slot.textContent = message;
          slot.classList.add("is-shown");
        }
      } else {
        input.removeAttribute("aria-invalid");
        if (slot) {
          slot.textContent = "";
          slot.classList.remove("is-shown");
        }
      }
    }

    function validateOne(field) {
      var input = form.elements[field.name];
      if (!input) return true;

      var value = (input.value || "").trim();
      var error = "";

      if (!value) {
        error = field.message;
      } else if (field.name === "email" && !EMAIL_RE.test(value)) {
        error = field.message;
      } else if (field.name === "message" && value.length < 10) {
        error = "A little more detail helps — 10 characters or more.";
      }

      setError(field, error);
      return !error;
    }

    // Validate on blur; clear the error as soon as it is fixed
    FIELDS.forEach(function (field) {
      var input = form.elements[field.name];
      if (!input) return;

      input.addEventListener("blur", function () { validateOne(field); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateOne(field);
      });
    });

    function setStatus(message, tone) {
      if (!status) return;
      if (statusText) statusText.textContent = message;
      status.classList.add("is-shown");
      status.dataset.tone = tone || "info";
    }

    function resetForm() {
      form.reset();
      FIELDS.forEach(function (field) { setError(field, ""); });
    }

    // Fallback: hand the message to the visitor's own mail client
    function sendViaMailClient() {
      var data = new FormData(form);
      var subject = "Portfolio enquiry from " + data.get("name");
      var body =
        "Name: " + data.get("name") + "\n" +
        "Email: " + data.get("email") + "\n\n" +
        data.get("message");

      setStatus("Opening your email app… if nothing happens, email " + recipient + " directly.");

      window.location.href =
        "mailto:" + recipient +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      resetForm();
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var results = FIELDS.map(validateOne);
      if (results.indexOf(false) !== -1) {
        setStatus("Please fix the highlighted fields and try again.", "error");
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      sendViaMailClient();
    });
  }

  /* ----------------------------------------------------------------------
     7. Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initStickyHeader();
    initMobileNav();
    initReveal();
    initFilter();
    initCardGlow();
    initContactForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
