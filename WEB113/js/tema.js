const temaToggle = document.getElementById("tema-toggle");
const temaIcone = temaToggle ? temaToggle.querySelector("span") : null;
const temaSalvo = localStorage.getItem("tema");

function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema);
  if (temaToggle) {
    const escuro = tema === "dark";
    temaToggle.setAttribute("aria-pressed", escuro);
    temaToggle.setAttribute(
      "aria-label",
      escuro ? "Ativar modo claro" : "Ativar modo escuro",
    );
    if (temaIcone) {
      temaIcone.textContent = escuro ? "☀️" : "🌙";
    }
  }
}

if (temaSalvo === "dark" || temaSalvo === "light") {
  aplicarTema(temaSalvo);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  aplicarTema("dark");
}

if (temaToggle) {
  temaToggle.addEventListener("click", function () {
    const escuroAtivo =
      document.documentElement.getAttribute("data-theme") === "dark";
    const novo = escuroAtivo ? "light" : "dark";
    aplicarTema(novo);
    localStorage.setItem("tema", novo);
  });
}
