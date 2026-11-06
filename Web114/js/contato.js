const formularioContato = document.getElementById("formulario-contato");

if (formularioContato) {
  const avisoSucesso =
    formularioContato.parentElement.querySelector("[data-fs-success]");
  const avisoErro =
    formularioContato.parentElement.querySelector("[data-fs-error]");
  const botaoEnviar = formularioContato.querySelector("[data-fs-submit-btn]");
  const campos = formularioContato.querySelectorAll("[data-fs-field]");

  // Regras de validação no navegador (usabilidade). A validação de verdade
  // continua no servidor (Formspree), nunca confie só no front-end.
  // Cada função devolve a mensagem de erro, ou '' quando o valor é válido.
  const regras = [
    {
      campo: document.getElementById("nomeContato"),
      dica: document.getElementById("dicaNome"),
      valido: "Nome válido!",
      validar: function (valor) {
        return valor.trim().length < 3
          ? "Nome deve ter pelo menos 3 caracteres."
          : "";
      },
    },
    {
      campo: document.getElementById("emailContato"),
      dica: document.getElementById("dicaEmail"),
      valido: "E-mail válido!",
      validar: function (valor) {
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formatoEmail.test(valor.trim())
          ? ""
          : "E-mail inválido. Digite um e-mail como nome@provedor.com.";
      },
    },
    {
      campo: document.getElementById("telefone"),
      dica: null,
      valido: "",
      validar: function (valor) {
        const digitos = valor.replace(/\D/g, "");
        return digitos.length < 10 || digitos.length > 11
          ? "Telefone inválido. Digite o DDD e o número."
          : "";
      },
    },
    {
      campo: document.getElementById("mensagemContato"),
      dica: document.getElementById("dicaMensagem"),
      valido: "Mensagem válida!",
      validar: function (valor) {
        return valor.trim().length < 10
          ? "Mensagem deve ter pelo menos 10 caracteres."
          : "";
      },
    },
  ];

  function limparDicas() {
    regras.forEach(function (regra) {
      if (regra.dica) {
        regra.dica.textContent = "";
        regra.dica.className = "campo__dica";
      }
    });
  }

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

  // Validação em tempo real: mostra a dica logo abaixo do campo enquanto a pessoa digita.
  // Usa textContent (nunca innerHTML) para não executar nada que venha do usuário.
  function validarCampo(regra) {
    const erro = regra.validar(regra.campo.value);

    if (erro) {
      regra.campo.setAttribute("aria-invalid", "true");
    } else {
      regra.campo.removeAttribute("aria-invalid");
    }

    if (regra.dica) {
      regra.dica.textContent = erro || regra.valido;
      regra.dica.className =
        "campo__dica " + (erro ? "campo__dica--erro" : "campo__dica--ok");
    }

    return erro;
  }

  regras.forEach(function (regra) {
    regra.campo.addEventListener("input", function () {
      validarCampo(regra);
    });
    regra.campo.addEventListener("blur", function () {
      // Ao sair de um campo vazio, só avisa se a pessoa já tinha começado a preencher.
      if (
        regra.campo.value !== "" ||
        regra.campo.hasAttribute("aria-invalid")
      ) {
        validarCampo(regra);
      }
    });
  });

  formularioContato.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limparAvisos();

    // Valida na ordem do formulário e para no primeiro erro, com mensagem amigável.
    for (let i = 0; i < regras.length; i++) {
      const erro = validarCampo(regras[i]);
      if (erro) {
        avisoErro.textContent = erro;
        regras[i].campo.focus();
        mostrarAviso(avisoErro);
        return;
      }
    }

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
          limparDicas();
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
