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

  // --- Formulario de contacto (Web3Forms AJAX) ---
  var formPanel = document.querySelector(".form-panel");
  if (formPanel) {
    var form = formPanel.querySelector("form");
    var sendBtn = formPanel.querySelector(".btn-send");
    if (form && sendBtn) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var origLabel = sendBtn.getAttribute("data-label-default") || "Send message";
        var formData = new FormData(form);
  
        // Safeguard: ensure hidden access_key is never empty
        if (!formData.get("access_key")) {
          var keyInput = form.querySelector('input[name="access_key"]');
          if (keyInput) formData.set("access_key", keyInput.getAttribute("value") || "");
        }
  
        sendBtn.disabled = true;
  
        fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            return res.json().then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (result.ok && result.data.success) {
              sendBtn.textContent = sendBtn.getAttribute("data-label-sent") || "Message sent!";
              form.reset();
            } else {
              sendBtn.textContent = "Error sending message";
            }
          })
          .catch(function () {
            sendBtn.textContent = "Error sending message";
          })
          .finally(function () {
            sendBtn.disabled = false;
            setTimeout(function () {
              sendBtn.textContent = origLabel;
            }, 3000);
          });
      });
    }
  }
})();
