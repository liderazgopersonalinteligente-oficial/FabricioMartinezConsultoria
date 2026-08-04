(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector("[data-site-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.querySelector("[data-nav-menu]");
  var year = document.querySelector("[data-year]");

  if (year) year.textContent = String(new Date().getFullYear());

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  function updateHeader() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11, rootMargin: "0px 0px -35px" });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  var form = document.querySelector("[data-contact-form]");
  var formStatus = document.querySelector("[data-form-status]");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        if (formStatus) formStatus.textContent = "Completá los campos obligatorios para continuar.";
        return;
      }

      var data = new FormData(form);
      var lines = [
        "Hola Fabricio, quiero iniciar una conversación.",
        "",
        "Nombre: " + (data.get("nombre") || ""),
        "Organización: " + (data.get("organizacion") || "No indicada"),
        "Correo: " + (data.get("email") || ""),
        "Teléfono: " + (data.get("telefono") || "No indicado"),
        "",
        "Lo que está pasando:",
        String(data.get("desafio") || "")
      ];

      if (formStatus) formStatus.textContent = "Abriendo WhatsApp. Podés revisar el mensaje antes de enviarlo.";
      window.open("https://wa.me/5493434164699?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
    });
  }
})();
