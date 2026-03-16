import {
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  modoCalculo,
} from "../../state.js";

const formDistUniforme = document.getElementById("formDistUniforme");
const inputLimiteInferior = document.getElementById("inputLimiteInferior");
const inputLimiteSuperior = document.getElementById("inputLimiteSuperior");
const inputValorCUnif = document.getElementById("inputValorCUnif");
const inputValorDUnif = document.getElementById("inputDuasVariaveisUni");
const mostrarConta = document.getElementById("mostrarContaUni");

//formatação blablabla
function fmt(v, dec = 6) {
  if (v === null || isNaN(v)) return "-";
  return parseFloat(v.toFixed(dec)).toString();
}

function calcularIntervalo(a, b, valorC, valorD, tipoIntervalo) {
  let label = "";
  let valor = 0;
  const amplitude = b - a;

  console.log(tipoIntervalo);

  switch (tipoIntervalo) {
    //intervalo simplse
    //Intervalos simples com valorC
    case "maiorQueUni": //P(X > c)
      label = `P(X > ${valorC})`;
      valor = (b - valorC) / amplitude;
      console.log(tipoIntervalo);
      break;

    case "maiorIgualUni": //P(X ≥ c) = P(X > c) na contínua
      label = `P(X >= ${valorC})`;
      valor = (b - valorC) / amplitude;
      break;

    case "menorQueUni": //P(X < c)
      label = `P(X < ${valorC})`;
      valor = (valorC - a) / amplitude;
      break;

    case "menorIgualUni": //P(X ≤ c) = P(X < c) na contínua
      label = `P(X <= ${valorC})`;
      valor = (valorC - a) / amplitude;
      break;

    case "intervaloIgualUni": //P(X = c) = 0 na contínua
      label = `P(X = ${valorC})`;
      valor = 0;
      break;

    //intervalos duplos
    case "menorQueMenorQueUni": // P(c < X < d)
      label = `P(${valorC} < X < ${valorD})`;
      valor = (valorD - valorC) / amplitude;
      break;

    case "menorIgualMenorQueUni": //P(c ≤ X < d) = P(c < X < d) na contínua
      label = `P(${valorC} <= X < ${valorD})`;
      valor = (valorD - valorC) / amplitude;
      break;

    case "menorQueMenorIgualUni": //P(c < X ≤ d) = P(c < X < d) na contínua
      label = `P(${valorC} < X <= ${valorD})`;
      valor = (valorD - valorC) / amplitude;
      break;

    case "menorIgualMenorIgualUni": //P(c ≤ X ≤ d) = P(c < X < d) na contínua
      label = `P(${valorC} <= X <= ${valorD})`;
      valor = (valorD - valorC) / amplitude;
      break;

    default:
      label = "";
      valor = null;
  }

  //garante que o valor seja entere 0 e 1
  if (valor !== null) valor = Math.min(1, Math.max(0, valor));

  return { label, valor };
}

function validar() {
  const a = parseFloat(inputLimiteInferior.value.trim());
  const b = parseFloat(inputLimiteSuperior.value.trim());
  const valorC = parseFloat(inputValorCUnif.value.trim());
  const valorD = parseFloat(inputValorDUnif.value.trim());
  const tipoIntervalo = escolhaTipoIntervaloFunc();

  // validation
  if (isNaN(a) || isNaN(b)) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Informe os limites inferior e superior!
    </p>`;
    return false;
  } else if (b <= a) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      O limite superior deve ser maior que o limite inferior!
    </p>`;
    return false;
  } else if (isNaN(valorC)) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Informe o Valor 1!
    </p>`;
    return false;
  } else if (valorC < a || valorC > b) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      O Valor 1 deve estar entre ${fmt(a, 4)} e ${fmt(b, 4)}!
    </p>`;
    return;
  } else if (!tipoIntervalo) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Selecione um tipo de intervalo!
    </p>`;
    return false;
  } else if (intervaloDuplo.includes(tipoIntervalo)) {
    if (isNaN(valorD)) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        Informe o Valor 2!
      </p>`;
      return false;
    } else if (valorD < a || valorD > b) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        O Valor 2 deve estar entre ${fmt(a, 4)} e ${fmt(b, 4)}!
      </p>`;
      return false;
    } else if (valorD <= valorC) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        O Valor 2 deve ser maior que o Valor 1!
      </p>`;
      return false;
    } else {
      let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();
      const p = document.createElement("p");
      mostrarConta.replaceChildren();
      if (escolhaTipoIntervalo == "menorQueMenorQueUni") {
        p.innerHTML = valorC + " < X < " + valorD;
      } else if (escolhaTipoIntervalo == "menorIgualMenorQueUni") {
        p.innerHTML = valorC + " ≤ X < " + valorD;
      } else if (escolhaTipoIntervalo == "menorQueMenorIgualUni") {
        p.innerHTML = valorC + " < X ≤ " + valorD;
      } else if (escolhaTipoIntervalo == "menorIgualMenorIgualUni") {
        p.innerHTML = valorC + " ≤ X ≤ " + valorD;
      } else {
        p.innerHTML = "";
      }
      mostrarConta.style.border = "2px dashed black";
      mostrarConta.appendChild(p);
      return true;
    }
  } else {
    let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();
    const p = document.createElement("p");
    mostrarConta.replaceChildren();
    if (escolhaTipoIntervalo == "maiorQueUni") {
      p.innerHTML = "X > " + valorC;
    } else if (escolhaTipoIntervalo == "maiorIgualUni") {
      p.innerHTML = "X ≥ " + valorC;
    } else if (escolhaTipoIntervalo == "menorQueUni") {
      p.innerHTML = "X < " + valorC;
    } else if (escolhaTipoIntervalo == "menorIgualUni") {
      p.innerHTML = "X ≤ " + valorC;
    } else if (escolhaTipoIntervalo == "intervaloIgualUni") {
      p.innerHTML = "X = " + valorC;
    } else {
      p.innerHTML = "";
    }
    mostrarConta.style.border = "2px dashed black";
    mostrarConta.appendChild(p);
    return true;
  }
}

//renderizar resultado
function renderizarResultado(a, b, valorC, valorD, tipoIntervalo) {
  const media = (a + b) / 2;
  const variancia = Math.pow(b - a, 2) / 12;
  const dp = Math.sqrt(variancia);
  const cv = media !== 0 ? (100 * dp) / media : 0;

  //prob. intervalo escolhido
  const { label: labelIntervalo, valor: probIntervalo } = calcularIntervalo(
    a,
    b,
    valorC,
    valorD,
    tipoIntervalo,
  );

  const containerCalculosResultados = document.querySelector(
    ".container-calculos-resultados",
  );
  containerCalculosResultados.replaceChildren();

  let escolhasCalculo = escolhaCalculosFunc();
  let escolhaTipoDado = escolhaTipoDadoFunc();
  if (escolhaTipoDado == "outro") {
    const outroInput = document.getElementById("tipo_custom");
    escolhaTipoDado = outroInput.value.trim();
  }

  function criarCard(titulo, ...valores) {
    const div = document.createElement("div");
    div.className = "calculos-resultados";

    const h3 = document.createElement("h3");
    h3.innerHTML = titulo;
    div.appendChild(h3);

    for (const valor of valores) {
      const p = document.createElement("p");
      p.innerHTML = valor;
      div.appendChild(p);
    }

    containerCalculosResultados.appendChild(div);
  }
  for (const escolha of escolhasCalculo) {
    if (escolha === "todos") continue;
    if (escolha === "media") {
      if (escolhaTipoDado == "R$") {
        criarCard("Média (μ)", `μ = (A + B) / 2 = R$ ${fmt(media, 4)}`);
      } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
        criarCard(
          "Média (μ)",
          `μ = (A + B) / 2 = ${fmt(media, 4)} ${escolhaTipoDado}`,
        );
      } else {
        criarCard("Média (μ)", `μ = (A + B) / 2 = ${fmt(media, 4)}`);
      }
    }
    if (escolha === "variancia") {
      if (escolhaTipoDado == "R$") {
        criarCard(
          "Variância (σ²)",
          `σ² = (B - A)² / 12 = R$ ${fmt(variancia, 4)}`,
        );
      } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
        criarCard(
          "Variância (σ²)",
          `σ² = (B - A)² / 12 = ${fmt(variancia, 4)} ${escolhaTipoDado}²`,
        );
      } else {
        criarCard(
          "Variância (σ²)",
          `σ² = (B - A)² / 12 = ${fmt(variancia, 4)}`,
        );
      }
    }
    if (escolha === "desvioPadrao") {
      if (escolhaTipoDado == "R$") {
        criarCard("Desvio Padrão (σ)", `σ = √σ² = R$ ${fmt(dp, 4)}`);
      } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
        criarCard(
          "Desvio Padrão (σ)",
          `σ = √σ² = ${fmt(dp, 4)} ${escolhaTipoDado}`,
        );
      } else {
        criarCard("Desvio Padrão (σ)", `σ = √σ² = ${fmt(dp, 4)}`);
      }
    }
    if (escolha === "coeficienteVariacao") {
      criarCard("Coef. de Variação", `CV = 100 · σ/μ = ${fmt(cv, 2)}%`);
    }
    if (escolha === "probabilidade") {
      // Card do intervalo calculado
      if (labelIntervalo) {
        criarCard(
          "Probabilidade",
          `${labelIntervalo} = ${fmt(probIntervalo, 4)}`,
          `≈ ${fmt(probIntervalo * 100, 2)}%`,
        );
      }
    }
  }

  setMostrarResultados(true);
}

const intervaloDuplo = [
  "menorQueMenorQueUni",
  "menorIgualMenorQueUni",
  "menorQueMenorIgualUni",
  "menorIgualMenorIgualUni",
];

formDistUniforme.addEventListener("submit", (e) => {
  e.preventDefault();
  setMostrarResultados(false);
  if (modoCalculo == "Uniforme") {
    validar();
  }
});

const btnCalcular = document.getElementById("btnCalcular");
btnCalcular.addEventListener("click", (e) => {
  e.preventDefault();

  if (modoCalculo == "Uniforme") {
    const a = parseFloat(inputLimiteInferior.value.trim());
    const b = parseFloat(inputLimiteSuperior.value.trim());
    const valorC = parseFloat(inputValorCUnif.value.trim());
    const valorD = parseFloat(inputValorDUnif.value.trim());
    const tipoIntervalo = escolhaTipoIntervaloFunc();
    console.log(tipoIntervalo);

    if (
      !Number.isNaN(a) &&
      !Number.isNaN(b) &&
      !Number.isNaN(valorC) &&
      tipoIntervalo != ""
    ) {
      let verficar = validar();
      console.log(verficar);
      if (verficar == true) {
        setMostrarResultados(false);
        renderizarResultado(a, b, valorC, valorD, tipoIntervalo);
      }
    }
  }
});
