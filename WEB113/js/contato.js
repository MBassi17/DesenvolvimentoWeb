const formularioContato = document.getElementById("formulario-contato");

if (formularioContato) {
  const avisoSucesso =
    formularioContato.parentElement.querySelector("[data-fs-success]");
  const avisoErro =
    formularioContato.parentElement.querySelector("[data-fs-error]");
  const botaoEnviar = formularioContato.querySelector("[data-fs-submit-btn]");
  const campos = formularioContato.querySelectorAll("[data-fs-field]");

  function limparAvisos() {
    avisoSucesso.textContent = "";
    avisoErro.textContent = "";
    campos.forEach(function (campo) {
      campo.removeAttribute("aria-invalid");
    });
  }

  // O aviso fica acima do formulário; no celular, rola até ele para a pessoa ver o resultado.
  function mostrarAviso(aviso) {
    aviso.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  formularioContato.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparAvisos();

    if (botaoEnviar) {
      botaoEnviar.disabled = true;
      botaoEnviar.textContent = "Enviando...";
    }

    const dados = new FormData(formularioContato);

    fetch(formularioContato.action, {
      method: "POST",
      body: dados,
      headers: { Accept: "application/json" },
    })
      .then(function (resposta) {
        if (resposta.ok) {
          avisoSucesso.textContent =
            "Mensagem enviada com sucesso! Obrigado pelo contato, retornarei em breve.";
          formularioContato.reset();
          mostrarAviso(avisoSucesso);
          return;
        }

        return resposta.json().then(function (dadosResposta) {
          if (dadosResposta && Array.isArray(dadosResposta.errors)) {
            dadosResposta.errors.forEach(function (erro) {
              const campo = formularioContato.querySelector(
                '[name="' + erro.field + '"]',
              );
              if (campo) {
                campo.setAttribute("aria-invalid", "true");
              }
            });
          }
          avisoErro.textContent =
            "Não foi possível enviar sua mensagem. Verifique os campos destacados e tente novamente.";
          mostrarAviso(avisoErro);
        });
      })
      .catch(function () {
        avisoErro.textContent =
          "Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.";
        mostrarAviso(avisoErro);
      })
      .finally(function () {
        if (botaoEnviar) {
          botaoEnviar.disabled = false;
          botaoEnviar.textContent = "Enviar mensagem";
        }
      });
  });
}
