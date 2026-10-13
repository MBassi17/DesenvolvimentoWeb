const menuToggle = document.getElementById("menu-toggle");
const menuLinks = document.getElementById("menu-links");

if (menuToggle && menuLinks) {
  menuToggle.addEventListener("click", function () {
    const aberto = menuLinks.classList.toggle("aberto");
    menuToggle.setAttribute("aria-expanded", aberto);
  });

  menuLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menuLinks.classList.remove("aberto");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}
