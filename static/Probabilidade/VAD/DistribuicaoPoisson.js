import {
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  modoCalculo,
} from "../../state.js";

const formDistPoisson = document.getElementById("formDistPoisson");
const inputVMedia = document.getElementById("inputVMedia");
const inputValorA = document.getElementById("inputValorAPoi");
const inputValorB = document.getElementById("inputDuasVariaveisPois");
const mostrarConta = document.getElementById("mostrarContaPois");

/**P(X = k) em poisson */
function probPoisson(lambda, k) {
  return (Math.pow(Math.E, -lambda) * Math.pow(lambda, k)) / fatorial(k);
}

/**fatorial simples */
function fatorial(n) {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** formata número com até `dec´ casas decimais */

function fmt(v, dec = 6) {
  if (v === null || isNaN(v)) return "-";
  return parseFloat(v.toFixed(dec)).toString();
}

//-----intervalos-----
/**mesmo esquema do binomial*/
function calcularIntervalo(lambda, valorA, valorB, tipoIntervalo) {
  let label = "";
  let valor = 0;

  function acumAte(k) {
    let soma = 0;
    for (let i = 0; i <= k; i++) soma += probPoisson(lambda, i);
    return soma;
  }

  switch (tipoIntervalo) {
    //intervalo simples
    case "maiorQuePoi": //P(X > a) = 1 − P(X ≤ a)
      label = `P(X > ${valorA})`;
      valor = 1 - acumAte(valorA);
      break;

    case "maiorIgualPoi": //P(X ≥ a) = 1 − P(X ≤ a−1)
      label = `P(X >= ${valorA})`;
      valor = 1 - acumAte(valorA - 1);
      break;

    case "menorQuePoi": //P(X < a) = P(X ≤ a−1)
      label = `P(X < ${valorA})`;
      valor = acumAte(valorA - 1);
      break;

    case "menorIgualPoi": //P(X ≤ a)
      label = `P(X <= ${valorA})`;
      valor = acumAte(valorA);
      break;

    case "intervaloIgualPoi": //P(X = a)
      label = `P(X = ${valorA})`;
      valor = probPoisson(lambda, valorA);
      break;

    //intervalos duplos

    case "menorQueMenorQuePoi": // P(a < X < b)
      label = `P(${valorA} < X < ${valorB})`;
      valor = acumAte(valorB - 1) - acumAte(valorA);
      break;

    case "menorIgualMenorQuePoi": // P(a ≤ X < b)
      label = `P(${valorA} <= X < ${valorB})`;
      valor = acumAte(valorB - 1) - acumAte(valorA - 1);
      break;

    case "menorQueMenorIgualPoi": //P(a < X ≤ b)
      label = `P(${valorA} < X <= ${valorB})`;
      valor = acumAte(valorB) - acumAte(valorA);
      break;

    case "menorIgualMenorIgualPoi": //P(a ≤ X ≤ b)
      label = `P(${valorA} <= X <= ${valorB})`;
      valor = acumAte(valorB) - acumAte(valorA - 1);
      break;

    default:
      label = "";
      valor = null;
  }
  return { label, valor };
}

//--- renderização de resultado ---
function renderizarResultados(lambda, tipoIntervalo, valorA, valorB) {
  const media = lambda;
  const variancia = lambda;
  const dp = Math.sqrt(lambda);
  const cv = media !== 0 ? (100 * dp) / media : 0;

  //prob. de intervalo escolhido
  const { label: labelIntervalo, valor: probIntervalo } = calcularIntervalo(
    lambda,
    valorA,
    valorB,
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

  //funcao auxiliar pra criar card padrão
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

  //cards medidas blablabla
  for (const escolha of escolhasCalculo) {
    if (escolha === "todos") continue;
    if (escolha === "media") {
      // cards das medidas resumo
      if (escolhaTipoDado == "R$") {
        criarCard("Média (μ)", `μ = n · p = R$ ${fmt(media, 4)}`);
      } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
        criarCard(
          "Média (μ)",
          `μ = n · p = ${fmt(media, 4)} ${escolhaTipoDado}`,
        );
      } else {
        criarCard("Média (μ)", `μ = n · p = ${fmt(media, 4)}`);
      }
    }
    if (escolha === "variancia") {
      if (escolhaTipoDado == "R$") {
        criarCard("Variância (σ²)", `σ² = n · p · q = R$ ${fmt(variancia, 4)}`);
      } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
        criarCard(
          "Variância (σ²)",
          `σ² = n · p · q = ${fmt(variancia, 4)} ${escolhaTipoDado}²`,
        );
      } else {
        criarCard("Variância (σ²)", `σ² = n · p · q = ${fmt(variancia, 4)}`);
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
      // card do intervalo calculado
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

    //card tabela completa
    //Exibe k = 0 até o menor k onde P acumulada > 0.9999
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

    for (const titulo of ["k", "P(X = k)", "P(X <= k)", "P(X >= k)"]) {
      const th = document.createElement("th");
      th.innerHTML = titulo;
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    let acumInf = 0;
    let k = 0;

    //gera linhas até a probabilidade acumulada cobrir 99.99%
    while (acumInf < 0.9999) {
      const pk = probPoisson(lambda, k);
      acumInf += pk;

      //acumulada superior: 1 − P(X ≤ k−1)
      const acumSup = k === 0 ? 1 : 1 - (acumInf - pk);
      const tr = document.createElement("tr");
      for (const valor of [
        k,
        fmt(pk, 8),
        fmt(Math.min(acumInf, 1), 8),
        fmt(Math.max(acumSup, 0), 8),
      ]) {
        const td = document.createElement("td");
        td.innerHTML = valor;
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
      k++;
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

const intervaloDuplo = [
  "menorQueMenorQuePoi",
  "menorIgualMenorQuePoi",
  "menorQueMenorIgualPoi",
  "menorIgualMenorIgualPoi",
];

function validar() {
  const lambda = parseFloat(inputVMedia.value.trim());
  const valorA = parseInt(inputValorA.value.trim(), 10);
  const valorB = parseInt(inputValorB.value.trim(), 10);
  const tipoIntervalo = escolhaTipoIntervaloFunc();

  mostrarConta.style.border = "";
  //validation
  if (isNaN(lambda) || lambda <= 0) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Média / Lambda" deve ser um número positivo!
    </p>`;
    return false;
  } else if (isNaN(valorA) || valorA < 0) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Valor A" deve ser um inteiro maior ou igual a 0!
    </p>`;
    return false;
  } else if (!tipoIntervalo) {
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Selecione um tipo de intervalo!
    </p>`;
    return false;
  } else if (intervaloDuplo.includes(tipoIntervalo)) {
    if (isNaN(valorB) || valorB < 0) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser um inteiro maior ou igual a 0!
      </p>`;
      return false;
    } else if (valorB <= valorA) {
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser maior que "Valor A"!
      </p>`;
      return false;
    } else {
      let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();
      const p = document.createElement("p");
      mostrarConta.replaceChildren();
      if (escolhaTipoIntervalo == "menorQueMenorQuePoi") {
        p.innerHTML = valorA + " < X < " + valorB;
      } else if (escolhaTipoIntervalo == "menorIgualMenorQuePoi") {
        p.innerHTML = valorA + " ≤ X < " + valorB;
      } else if (escolhaTipoIntervalo == "menorQueMenorIgualPoi") {
        p.innerHTML = valorA + " < X ≤ " + valorB;
      } else if (escolhaTipoIntervalo == "menorIgualMenorIgualPoi") {
        p.innerHTML = valorA + " ≤ X ≤ " + valorB;
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
    console.log(escolhaTipoIntervalo);
    mostrarConta.replaceChildren();
    if (escolhaTipoIntervalo == "maiorQuePoi") {
      p.innerHTML = "X > " + valorA;
    } else if (escolhaTipoIntervalo == "maiorIgualPoi") {
      p.innerHTML = "X ≥ " + valorA;
    } else if (escolhaTipoIntervalo == "menorQuePoi") {
      p.innerHTML = "X < " + valorA;
    } else if (escolhaTipoIntervalo == "menorIgualPoi") {
      p.innerHTML = "X ≤ " + valorA;
    } else if (escolhaTipoIntervalo == "intervaloIgualPoi") {
      p.innerHTML = "X = " + valorA;
    } else {
      p.innerHTML = "";
    }
    mostrarConta.style.border = "2px dashed black";
    mostrarConta.appendChild(p);
    return true;
  }
}

formDistPoisson.addEventListener("submit", (e) => {
  e.preventDefault();
  containerTabelaDistribuicao.replaceChildren();
  if (modoCalculo == "Poisson") {
    console.log("Poisson 1");
    validar();
  }
});

const btnCalcular = document.getElementById("btnCalcular");
btnCalcular.addEventListener("click", (e) => {
  e.preventDefault();
  if (modoCalculo == "Poisson") {
    console.log("Poisson 2");
    const lambda = parseFloat(inputVMedia.value.trim());
    const valorA = parseInt(inputValorA.value.trim(), 10);
    const valorB = parseInt(inputValorB.value.trim(), 10);
    const tipoIntervalo = escolhaTipoIntervaloFunc();
    if (!isNaN(lambda) && !isNaN(valorA) && tipoIntervalo != "") {
      setMostrarResultados(false);
      let verificar = validar();
      if (verificar == true) {
        renderizarResultados(lambda, tipoIntervalo, valorA, valorB);
      }
    }
  }
});
