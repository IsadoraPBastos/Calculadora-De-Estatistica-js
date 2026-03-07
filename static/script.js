// Botões de opções de calculos
const calculosPorModal = {
  discreto: [
    "media",
    "moda",
    "mediana",
    "variancia",
    "desvioPadrao",
    "coeficienteVariacao",
  ],
  classes: [
    "media",
    "modaBruta",
    "modaCzuber",
    "mediana",
    "variancia",
    "desvioPadrao",
    "coeficienteVariacao",
  ],
  probabilidade: [
    "media",
    "variancia",
    "desvioPadrao",
    "coeficienteVariacao",
    "probabilidade",
  ],
  equacao1: ["equacaoReta", "dominio", "coefiDeterminacao"],
};

const nomesCalculos = {
  media: "Média",
  mediana: "Mediana",
  moda: "Moda",
  modaBruta: "Moda Bruta",
  modaCzuber: "Moda de Czuber",
  variancia: "Variância",
  desvioPadrao: "Desvio Padrão",
  coeficienteVariacao: "Coeficiente de Variação",
  probabilidade: "Probabilidade",
  equacaoReta: "Equação da Reta",
  dominio: "Domínio",
  coefiDeterminacao: "Coeficiente Determinação",
};

function configurarCheckboxTodos() {
  const todos = document.getElementById("todos");
  const checkboxes = document.querySelectorAll(
    'input[name="escolha-calculo"]:not(#todos)',
  );

  function verificarTodosCheckboxes() {
    const todosMarcados =
      checkboxes.length > 0 && [...checkboxes].every((cb) => cb.checked);

    todos.checked = todosMarcados;
  }

  todos.addEventListener("change", () => {
    checkboxes.forEach((cb) => {
      cb.checked = todos.checked;
    });
  });

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", verificarTodosCheckboxes);
  });
}

function gerarBotoesCalculo(tipoModal) {
  const container = document.getElementById("botoes-escolha-calculo");

  container.innerHTML = "";

  const inputTodos = document.createElement("input");
  inputTodos.type = "checkbox";
  inputTodos.name = "escolha-calculo";
  inputTodos.id = "todos";
  inputTodos.value = "todos";
  inputTodos.className = "escolha-checkbox";

  const labelTodos = document.createElement("label");
  labelTodos.htmlFor = "todos";
  labelTodos.className = "escolha-calculo";
  labelTodos.textContent = "Todos";

  container.appendChild(inputTodos);
  container.appendChild(labelTodos);

  const calculos = calculosPorModal[tipoModal];

  for (const calc of calculos) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "escolha-calculo";
    input.value = calc;
    input.id = calc;
    input.className = "escolha-checkbox";

    const label = document.createElement("label");
    label.htmlFor = calc;
    label.className = "escolha-calculo";
    label.textContent = nomesCalculos[calc];

    container.appendChild(input);
    container.appendChild(label);
  }

  configurarCheckboxTodos();
}

gerarBotoesCalculo("discreto");

// Funções para abrir e fechar modais
function abrirModalDiscreto(normal) {
  document.getElementById("container_modal_discreto").classList.add("show");
  document.querySelector(".botoes-calcular-limpar").classList.add("descer");
  document.querySelector(".container-opcoes-tipo-dado").classList.add("descer");
  document.getElementById("container_modal_vac").classList.remove("show");

  gerarBotoesCalculo("discreto");

  if (normal == true) {
    mostrarDadosDesordenados();
  }
}

function fecharModalDiscreto() {
  document.getElementById("container_modal_discreto").classList.remove("show");
  document.querySelector(".botoes-calcular-limpar").classList.remove("descer");
  document
    .querySelector(".container-opcoes-tipo-dado")
    .classList.remove("descer");
}

function abrirModalClasses() {
  document.getElementById("container_modal_classes").classList.add("show");
  document.querySelector(".botoes-calcular-limpar").classList.add("descer");
  document.querySelector(".container-opcoes-tipo-dado").classList.add("descer");

  gerarBotoesCalculo("classes");
}

function fecharModalClasses() {
  document.getElementById("container_modal_classes").classList.remove("show");
  document.querySelector(".botoes-calcular-limpar").classList.remove("descer");
  document
    .querySelector(".container-opcoes-tipo-dado")
    .classList.remove("descer");
}

function abrirModalVAC() {
  document.getElementById("container_modal_vac").classList.add("show");
  document.querySelector(".botoes-calcular-limpar").classList.add("descer");
  document.querySelector(".container-opcoes-tipo-dado").classList.add("descer");

  gerarBotoesCalculo("probabilidade");
}

function fecharModalVAC() {
  document.getElementById("container_modal_vac").classList.remove("show");
  document.querySelector(".botoes-calcular-limpar").classList.remove("descer");
  document
    .querySelector(".container-opcoes-tipo-dado")
    .classList.remove("descer");
}

function abrirModalVAD() {
  document.getElementById("container_modal_vad").classList.add("show");
  document.querySelector(".botoes-calcular-limpar").classList.add("descer");
  document.querySelector(".container-opcoes-tipo-dado").classList.add("descer");

  gerarBotoesCalculo("probabilidade");
}

function fecharModalVAD() {
  document.getElementById("container_modal_vad").classList.remove("show");
  document.querySelector(".botoes-calcular-limpar").classList.remove("descer");
  document
    .querySelector(".container-opcoes-tipo-dado")
    .classList.remove("descer");
}

function abrirModalEq1() {
  document.getElementById("container_modal_equ_1").classList.add("show");
  document.querySelector(".botoes-calcular-limpar").classList.add("descer");
  document.querySelector(".container-opcoes-tipo-dado").classList.add("descer");

  gerarBotoesCalculo("equacao1");
}

function fecharModalEq1() {
  document.getElementById("container_modal_equ_1").classList.remove("show");
  document.querySelector(".botoes-calcular-limpar").classList.remove("descer");
  document
    .querySelector(".container-opcoes-tipo-dado")
    .classList.remove("descer");
}

// Seleção dos botões dentro dos modais

const secaoDadosDesordenado = document.getElementById("secaoDadosDesordenados");
const secaoDadosEmTabela = document.getElementById("secaoDadosEmTabela");

function mostrarDadosDesordenados() {
  secaoDadosDesordenado.style.display = "flex";
  secaoDadosEmTabela.style.display = "none";

  document.getElementById("btn-escolha-desordenado").classList.add("ativo");
  document.getElementById("btn-escolha-tabela").classList.remove("ativo");

  setTimeout(() => {
    const input = document.getElementById("inputAdicionarDesordenados");
    if (input) {
      input.focus();
    }
  }, 100);
}

function mostrarDadosEmTabela() {
  secaoDadosEmTabela.style.display = "flex";
  secaoDadosDesordenado.style.display = "none";

  document.getElementById("btn-escolha-desordenado").classList.remove("ativo");
  document.getElementById("btn-escolha-tabela").classList.add("ativo");

  setTimeout(() => {
    const input = document.querySelector('input[name="amostra"]');
    if (input) {
      input.focus();
    }
  }, 100);
}

const secaoDUnifor = document.getElementById("secaoDUnifor");
const secaoDExpo = document.getElementById("secaoDExpo");
const secaoDNormal = document.getElementById("secaoDNormal");

function mostrarDUnifor() {
  secaoDUnifor.style.display = "flex";
  secaoDExpo.style.display = "none";
  secaoDNormal.style.display = "none";

  document.getElementById("btn-escolha-uniforme").classList.add("ativo");
  document.getElementById("btn-escolha-exponecial").classList.remove("ativo");
  document.getElementById("btn-escolha-normal").classList.remove("ativo");
}

function mostrarDExpo() {
  secaoDExpo.style.display = "flex";
  secaoDUnifor.style.display = "none";
  secaoDNormal.style.display = "none";

  document.getElementById("btn-escolha-exponecial").classList.add("ativo");
  document.getElementById("btn-escolha-uniforme").classList.remove("ativo");
  document.getElementById("btn-escolha-normal").classList.remove("ativo");
}

function mostrarDNormal() {
  secaoDExpo.style.display = "none";
  secaoDUnifor.style.display = "none";
  secaoDNormal.style.display = "flex";

  document.getElementById("btn-escolha-exponecial").classList.remove("ativo");
  document.getElementById("btn-escolha-uniforme").classList.remove("ativo");
  document.getElementById("btn-escolha-normal").classList.add("ativo");
}

const secaoDBino = document.getElementById("secaoDBino");
const secaoDPois = document.getElementById("secaoDPois");

function mostrarDBino() {
  secaoDBino.style.display = "flex";
  secaoDPois.style.display = "none";

  document.getElementById("btn-escolha-binomial").classList.add("ativo");
  document.getElementById("btn-escolha-poisson").classList.remove("ativo");
}

function mostrarDPois() {
  secaoDPois.style.display = "flex";
  secaoDBino.style.display = "none";

  document.getElementById("btn-escolha-poisson").classList.add("ativo");
  document.getElementById("btn-escolha-binomial").classList.remove("ativo");
}

const secaoDNormal_Amostral = document.getElementById("secaoDNormal_Amostral");
const secaoDNormal_Final = document.getElementById("secaoDNormal_Final");

function mostrarDNormal_Amostral() {
  secaoDNormal_Final.style.display = "none";
  if (secaoDNormal_Amostral.style.display == "flex") {
    secaoDNormal_Amostral.style.display = "none";
  } else {
    secaoDNormal_Amostral.style.display = "flex";
  }
}

function mostrarDNormal_Final() {
  secaoDNormal_Amostral.style.display = "none";
  secaoDNormal_Final.style.display = "flex";
}

// Cards
let cardDiscreto = document.querySelector(".container-card-discreto");
let cardClasses = document.querySelector(".container-card-classes");
let cardVAC = document.querySelector(".container-card-vac");
let cardVAD = document.querySelector(".container-card-vad");
let cardEQ1 = document.querySelector(".container-card-eq1");

function paramEsta() {
  document.getElementById("btn-par-estatisticos").classList.add("ativo");
  document.getElementById("btn-probabilidade").classList.remove("ativo");
  document.getElementById("btn-reg-linear").classList.remove("ativo");

  cardVAC.style.display = "none";
  cardVAC.style.opacity = 0;
  cardVAD.style.display = "none";
  cardVAD.style.opacity = 0;
  cardEQ1.style.display = "none";
  cardEQ1.style.opacity = 0;

  cardDiscreto.style.display = "block";
  requestAnimationFrame(() => {
    cardDiscreto.style.opacity = 1;
  });

  cardClasses.style.display = "block";
  requestAnimationFrame(() => {
    cardClasses.style.opacity = 1;
  });
}

function probabilidade() {
  document.getElementById("btn-par-estatisticos").classList.remove("ativo");
  document.getElementById("btn-probabilidade").classList.add("ativo");
  document.getElementById("btn-reg-linear").classList.remove("ativo");

  cardDiscreto.style.display = "none";
  cardDiscreto.style.opacity = 0;
  cardClasses.style.display = "none";
  cardClasses.style.opacity = 0;
  cardEQ1.style.display = "none";
  cardEQ1.style.opacity = 0;

  cardVAC.style.display = "block";
  requestAnimationFrame(() => {
    cardVAC.style.opacity = 1;
  });

  cardVAD.style.display = "block";
  requestAnimationFrame(() => {
    cardVAD.style.opacity = 1;
  });
}

function regreLinear() {
  document.getElementById("btn-par-estatisticos").classList.remove("ativo");
  document.getElementById("btn-probabilidade").classList.remove("ativo");
  document.getElementById("btn-reg-linear").classList.add("ativo");

  cardDiscreto.style.display = "none";
  cardDiscreto.style.opacity = 0;
  cardClasses.style.display = "none";
  cardClasses.style.opacity = 0;
  cardVAC.style.display = "none";
  cardVAC.style.opacity = 0;
  cardVAD.style.display = "none";
  cardVAD.style.opacity = 0;

  cardEQ1.style.display = "block";
  requestAnimationFrame(() => {
    cardEQ1.style.opacity = 1;
  });
}

// Btn B
document.addEventListener("DOMContentLoaded", () => {
  // Valores de intervalo que precisam do segundo input (valorB)
  const intervalosComB = [
    "menorQueMenorQueBin",
    "menorIgualMenorQueBin",
    "menorQueMenorIgualBin",
    "menorIgualMenorIgualBin",
    "menorQueMenorQuePoi",
    "menorIgualMenorQuePoi",
    "menorQueMenorIgualPoi",
    "menorIgualMenorIgualPoi",
    "menorQueMenorQueUni",
    "menorIgualMenorQueUni",
    "menorQueMenorIgualUni",
    "menorIgualMenorIgualUni",
    "menorQueMenorQueExpo",
    "menorIgualMenorQueExpo",
    "menorQueMenorIgualExpo",
    "menorIgualMenorIgualExpo",
    "menorQueMenorQueNorm1",
    "menorIgualMenorQueNorm1",
    "menorQueMenorIgualNorm1",
    "menorIgualMenorIgualNorm1",
    "menorQueMenorQueNormF",
    "menorIgualMenorQueNormF",
    "menorQueMenorIgualNormF",
    "menorIgualMenorIgualNormF",
  ];

  // Função genérica pra ativar/desativar o input B
  function configurarIntervalo(containerId, inputBId) {
    const container = document.getElementById(containerId);
    const inputB = document.getElementById(inputBId);
    if (!container || !inputB) return;

    const radios = container.querySelectorAll(
      'input[type="radio"][name="intervalo"]',
    );

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (intervalosComB.includes(radio.value)) {
          inputB.classList.remove("hidden");
          inputB.style.display = "inline-block";
        } else {
          inputB.classList.add("hidden");
          inputB.style.display = "none";
        }
      });
    });
  }

  // Configura cada distribuição
  configurarIntervalo("secaoDBino", "inputDuasVariaveisBin");
  configurarIntervalo("secaoDPois", "inputDuasVariaveisPois");
  configurarIntervalo("secaoDUnifor", "inputDuasVariaveisUni");
  configurarIntervalo("secaoDExpo", "inputDuasVariaveisExpo");
  configurarIntervalo("secaoDNormal_Amostral", "inputDuasVariaveisNorm");
  configurarIntervalo("secaoDNormal_Final", "inputDuasVariaveisNormF");
});
