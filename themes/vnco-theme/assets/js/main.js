// ===== VNCO · interacciones (independiente del HTML de Locofy) =====

(function () {
  "use strict";

  // --- Scroll suave para anclas internas (misma página) ---
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // --- Menú móvil ---
  var menuBtn = document.getElementById("menuBtn");
  var menuClose = document.getElementById("menuClose");
  var backdrop = document.getElementById("menuBackdrop");
  var menu = document.getElementById("mobileMenu");

  function openMenu() {
    document.body.classList.add("menu-open");
    menu.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    menu.setAttribute("aria-hidden", "true");
  }

  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // --- Navbar flotante con degradado al hacer scroll ---
  var header = document.querySelector(".header");
  if (header) {
    function onHeaderScroll() {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  // --- Resaltar enlace activo según scroll (solo anclas de la página) ---
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (navLinks.length) {
    function updateActive() {
      var pos = window.scrollY + 140;
      var current = "";
      sections.forEach(function (s) {
        if (pos >= s.offsetTop) current = s.id;
      });
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("href") === "#" + current);
      });
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
  }

  // --- Reveal al hacer scroll ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // --- Formulario de contacto ---
  var formPanel = document.querySelector(".form-panel");
  if (formPanel) {
    var sendBtn = formPanel.querySelector(".btn-send");
    if (sendBtn) {
      sendBtn.addEventListener("click", function () {
        var inputs = formPanel.querySelectorAll("input, textarea");
        var empty = false;
        inputs.forEach(function (i) {
          if (!i.value.trim()) empty = true;
        });
        if (empty) {
          var origLabel = sendBtn.getAttribute("data-label-default") || "Send message";
          sendBtn.textContent = sendBtn.getAttribute("data-label-empty") || "Please fill out all fields";
          setTimeout(function () {
            sendBtn.textContent = origLabel;
          }, 2500);
          return;
        }
        var origLabel = sendBtn.getAttribute("data-label-default") || "Send message";
        sendBtn.textContent = sendBtn.getAttribute("data-label-sent") || "Message sent!";
        setTimeout(function () {
          sendBtn.textContent = origLabel;
        }, 2500);
        inputs.forEach(function (i) {
          i.value = "";
        });
      });
    }
  }
})();
