import {
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
} from "../../state.js";

const formDistExponencial = document.getElementById("formDistExponencial");
const inputDesvioPadraoExpo = document.getElementById("inputDesvioPadraoExpo");
const inputValorA = document.getElementById("inputValorAExpo");
const inputValorB = document.getElementById("inputDuasVariaveisExpo");
const mostrarConta = document.getElementById("mostrarContaExpo");

/** formata número com até `dec` casas decimais */
function fmt(v, dec = 6) {
  if (v === null || isNaN(v)) return "-";
  return parseFloat(v.toFixed(dec)).toString();
}

/** P(X ≤ x) = 1 − e^(−λx) */
function cdfExpo(lambda, x) {
  if (x < 0) return 0;
  return 1 - Math.exp(-lambda * x);
}

/** P(X > x) = e^(−λx) */
function survExpo(lambda, x) {
  if (x < 0) return 1;
  return Math.exp(-lambda * x);
}

/** f(x) = λ · e^(−λx) */
function pdfExpo(lambda, x) {
  if (x < 0) return 0;
  return lambda * Math.exp(-lambda * x);
}

const intervaloDuplo = [
  "menorQueMenorQueExpo",
  "menorIgualMenorQueExpo",
  "menorQueMenorIgualExpo",
  "menorIgualMenorIgualExpo",
];

formDistExponencial.addEventListener("submit", (e) => {
  e.preventDefault();
  let valorA = +inputValorA.value.trim();
  let valorB = +inputValorB.value.trim();
  let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();

  mostrarConta.style.border = "";
  mostrarConta.replaceChildren();

  let sigma = +inputDesvioPadraoExpo.value.trim();
  if (isNaN(sigma) || sigma <= 0) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Desvio Padrão" deve ser um número positivo!
    </p>`;
    return;
  }
  if (isNaN(valorA) || valorA < 0) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Valor A" deve ser um número maior ou igual a 0!
    </p>`;
    return;
  }
  if (!escolhaTipoIntervalo) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Selecione um tipo de intervalo!
    </p>`;
    return;
  }
  if (intervaloDuplo.includes(escolhaTipoIntervalo)) {
    if (isNaN(valorB) || valorB < 0) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser um número maior ou igual a 0!
      </p>`;
      return;
    }
    if (valorB <= valorA) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser maior que "Valor A"!
      </p>`;
      return;
    }
  }

  if (escolhaTipoIntervalo != "") {
    const p = document.createElement("p");
    if (escolhaTipoIntervalo == "maiorQueExpo") {
      p.innerHTML = "X > " + valorA;
    } else if (escolhaTipoIntervalo == "maiorIgualExpo") {
      p.innerHTML = "X ≥ " + valorA;
    } else if (escolhaTipoIntervalo == "menorQueExpo") {
      p.innerHTML = "X < " + valorA;
    } else if (escolhaTipoIntervalo == "menorIgualExpo") {
      p.innerHTML = "X ≤ " + valorA;
    } else if (escolhaTipoIntervalo == "intervaloIgualExpo") {
      p.innerHTML = "X = " + valorA;
    } else if (escolhaTipoIntervalo == "menorQueMenorQueExpo") {
      p.innerHTML = valorA + " < X < " + valorB;
    } else if (escolhaTipoIntervalo == "menorIgualMenorQueExpo") {
      p.innerHTML = valorA + " ≤ X < " + valorB;
    } else if (escolhaTipoIntervalo == "menorQueMenorIgualExpo") {
      p.innerHTML = valorA + " < X ≤ " + valorB;
    } else if (escolhaTipoIntervalo == "menorIgualMenorIgualExpo") {
      p.innerHTML = valorA + " ≤ X ≤ " + valorB;
    }
    mostrarConta.style.border = "2px dashed black";
    mostrarConta.appendChild(p);
  }
});

const btnCalcular = document.getElementById("btnCalcular");
btnCalcular.addEventListener("click", () => {
  let sigma = +inputDesvioPadraoExpo.value.trim();
  let valorA = +inputValorA.value.trim();
  let valorB = +inputValorB.value.trim();
  let tipoIntervalo = escolhaTipoIntervaloFunc();

  if (!isNaN(sigma) && sigma > 0 && !isNaN(valorA) && tipoIntervalo) {
    setMostrarResultados(false);

    let lambda = 1 / sigma;
    let media = sigma;
    let variancia = sigma * sigma;
    let dp = sigma;
    let cv = 100;

    let labelIntervalo = "";
    let probIntervalo = null;

    if (tipoIntervalo == "maiorQueExpo") {
      labelIntervalo = `P(X > ${valorA})`;
      probIntervalo = survExpo(lambda, valorA);
    } else if (tipoIntervalo == "maiorIgualExpo") {
      labelIntervalo = `P(X >= ${valorA})`;
      probIntervalo = survExpo(lambda, valorA);
    } else if (tipoIntervalo == "menorQueExpo") {
      labelIntervalo = `P(X < ${valorA})`;
      probIntervalo = cdfExpo(lambda, valorA);
    } else if (tipoIntervalo == "menorIgualExpo") {
      labelIntervalo = `P(X <= ${valorA})`;
      probIntervalo = cdfExpo(lambda, valorA);
    } else if (tipoIntervalo == "intervaloIgualExpo") {
      labelIntervalo = `P(X = ${valorA})`;
      probIntervalo = 0;
    } else if (tipoIntervalo == "menorQueMenorQueExpo") {
      labelIntervalo = `P(${valorA} < X < ${valorB})`;
      probIntervalo = survExpo(lambda, valorA) - survExpo(lambda, valorB);
    } else if (tipoIntervalo == "menorIgualMenorQueExpo") {
      labelIntervalo = `P(${valorA} <= X < ${valorB})`;
      probIntervalo = survExpo(lambda, valorA) - survExpo(lambda, valorB);
    } else if (tipoIntervalo == "menorQueMenorIgualExpo") {
      labelIntervalo = `P(${valorA} < X <= ${valorB})`;
      probIntervalo = survExpo(lambda, valorA) - survExpo(lambda, valorB);
    } else if (tipoIntervalo == "menorIgualMenorIgualExpo") {
      labelIntervalo = `P(${valorA} <= X <= ${valorB})`;
      probIntervalo = survExpo(lambda, valorA) - survExpo(lambda, valorB);
    }

    if (probIntervalo !== null)
      probIntervalo = Math.min(1, Math.max(0, probIntervalo));

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
          criarCard("Média (μ)", `μ = 1/λ = R$ ${fmt(media, 4)}`);
        } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
          criarCard(
            "Média (μ)",
            `μ = 1/λ = ${fmt(media, 4)} ${escolhaTipoDado}`,
          );
        } else {
          criarCard("Média (μ)", `μ = 1/λ = ${fmt(media, 4)}`);
        }
      }
      if (escolha === "variancia") {
        if (escolhaTipoDado == "R$") {
          criarCard("Variância (σ²)", `σ² = 1/λ² = R$ ${fmt(variancia, 4)}`);
        } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
          criarCard(
            "Variância (σ²)",
            `σ² = 1/λ² = ${fmt(variancia, 4)} ${escolhaTipoDado}²`,
          );
        } else {
          criarCard("Variância (σ²)", `σ² = 1/λ² = ${fmt(variancia, 4)}`);
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
        criarCard("Coeficiente de Variação", `CV = 100 · σ/μ = ${fmt(cv, 2)}%`);
      }
      if (escolha === "probabilidade") {
        if (labelIntervalo) {
          criarCard(
            "Probabilidade",
            `${labelIntervalo} = ${fmt(probIntervalo, 4)}`,
            `≈ ${fmt(probIntervalo * 100, 2)}%`,
          );
        }
      }
    }

    if (escolhasCalculo.length > 0 && escolhaTipoDado) {
      setMostrarResultados(true);

      const containerTabelaDistribuicao = document.getElementById(
        "containerTabelaDistribuicao",
      );
      containerTabelaDistribuicao.replaceChildren();

      const divTabela = document.createElement("div");
      divTabela.className = "calculos-resultados";
      divTabela.style.padding = "0 50px 30px";

      const h3Tabela = document.createElement("h3");
      h3Tabela.innerHTML = "Distribuição Completa";
      divTabela.appendChild(h3Tabela);

      const pParams = document.createElement("p");
      pParams.innerHTML = `λ = ${fmt(lambda, 6)}`;
      divTabela.appendChild(pParams);

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const trHead = document.createElement("tr");

      for (const titulo of ["x", "f(x)", "P(X ≤ x)", "P(X > x)"]) {
        const th = document.createElement("th");
        th.innerHTML = titulo;
        trHead.appendChild(th);
      }
      thead.appendChild(trHead);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      let passo = sigma / 2;

      for (let i = 0; i <= 10; i++) {
        let x = passo * i;
        let fx = pdfExpo(lambda, x);
        let acumInf = cdfExpo(lambda, x);
        let acumSup = survExpo(lambda, x);

        const tr = document.createElement("tr");
        for (const valor of [
          fmt(x, 4),
          fmt(fx, 8),
          fmt(acumInf, 8),
          fmt(acumSup, 8),
        ]) {
          const td = document.createElement("td");
          td.innerHTML = valor;
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }

      table.appendChild(tbody);
      divTabela.appendChild(table);
      containerTabelaDistribuicao.appendChild(divTabela);
    } else {
      const containerTabelaDistribuicao = document.getElementById(
        "containerTabelaDistribuicao",
      );
      containerTabelaDistribuicao.replaceChildren();
      setMostrarResultados(false);
    }
  }
});
