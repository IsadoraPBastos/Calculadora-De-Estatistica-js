import {
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
} from "../../state.js";

const formDistPoisson = document.getElementById("formDistPoisson");
const inputVMedia = document.getElementById("inputVMedia");
const inputValorA = document.getElementById("inputValorAPoi");
const inputValorB = document.getElementById("inputDuasVariaveisPois");
const mostrarConta = document.getElementById("mostrarContaPois");

/**P(X = k) em poisson */
function probPoisson(lambda, k){
  return(Math.pow(Math.E, -lambda) * Math.pow(lambda, k)) / fatorial(k);
}

/**fatorial simples */
function fatorial(n){
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++ ) r *= i;
  return r;
}

/** formata número com até `dec´ casas decimais */

function fmt(v, dec = 6){
  if (v === null || isNaN(v)) return "-";
  return parseFloat(v.toFixed(dec)).toString();
}

//-----intervalos-----
/**mesmo esquema do binomial*/
function calcularIntervalo(lambda, valorA, valorB, tipoIntervalo){
  let label = "";
  let valor = 0;

  function acumAte(k){
  let soma = 0;
  for (let i = 0; i <= k; i++) soma += probPoisson(lambda, i);
  return soma;
  }

  switch (tipoIntervalo){
  //intervalo simples
  case "maiorQuePoi": //P(X > a) = 1 − P(X ≤ a)
    label = `P(X > ${valorA})`;
    valor = 1 - acumAte(valorA);
   break;

  case "maiorIgualPoi"://P(X ≥ a) = 1 − P(X ≤ a−1)
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

  case "intervaloIgualPoi"://P(X = a)
    label = `P(X = ${valorA})`;
    valor = probPoisson(lambda, valorA);
    break;

  //intervalos duplos

  case "menorQueMenorQuePoi":// P(a < X < b)
    label = `P(${valorA} < X < ${valorB})`;
    valor = acumAte(valorB - 1) - acumAte (valorA);
    break;

  case "menorIgualMenorQuePoi":// P(a ≤ X < b)
    label = `P(${valorA} <= X < ${valorB})`;
    valor = acumAte(valorB - 1) - acumAte(valorA - 1);
    break;

  case "menorQueMenorIgualPoi"://P(a < X ≤ b)
    label = `P(${valorA} < X <= ${valorB})`;
    valor = acumAte(valorB) - acumAte(valorA);
    break;

  case "menorIgualMenorIgualPoi"://P(a ≤ X ≤ b)
    label = `P(${valorA} <= X <= ${valorB})`;
    valor = acumAte(valorB) - acumAte(valorA - 1);
    break;
  
  default:
    label = "";
    valor = null;
  } 
  return {label, valor};
}

//--- renderização de resultado ---
function renderizarResultados(lambda, tipoIntervalo, valorA, valorB){
  const media = lambda;
  const variancia = lambda;
  const dp = Math.sqrt(lambda);
  const cv = media !== 0 ? (100 * dp) / media : 0;
  
  //prob. de intervalo escolhido
  const{label: labelIntervalo, valor: probIntervalo} =
    calcularIntervalo(lambda, valorA, valorB, tipoIntervalo);

  const containerCalculosResultados = document.querySelector(
    ".container-calculos-resultados"
  );
  containerCalculosResultados.replaceChildren();

  //funcao auxiliar pra criar card padrão
  function criarCard(titulo, ...valores){
    const div = document.createElement("div");
    div.className = "calculos-resultados";

    const h3 = document.createElement("h3");
    h3.innerHTML = titulo;
    div.appendChild(h3);

    for (const valor of valores){
      const p = document.createElement("p");
      p.innerHTML = valor;
      div.appendChild(p);
    }

    containerCalculosResultados.appendChild(div);
  }
  //cards medidas blablabla
  criarCard("Média (μ)",         `μ = λ = ${fmt(media, 4)}`);
  criarCard("Variância (σ²)",    `σ² = λ = ${fmt(variancia, 4)}`);
  criarCard("Desvio Padrão (σ)", `σ = √λ = ${fmt(dp, 4)}`);
  criarCard("Coef. de Variação", `CV = 100 · σ/μ = ${fmt(cv, 2)}%`);

  //card intervalo calculado
  if(labelIntervalo){
    criarCard(
    "Probabilidade",
    `${labelIntervalo} = ${fmt(probIntervalo, 8)}`,
    `≈ ${fmt(probIntervalo * 100, 4)}%`
    );
  }

  //card tabela completa
  //Exibe k = 0 até o menor k onde P acumulada > 0.9999
  const divTabela = document.createElement("div");
  divTabela.className = "calculos-resultados";

  const h3Tabela = document.createElement("h3");
  h3Tabela.innerHTML = "Distribuição Completa";
  divTabela.appendChild(h3Tabela);

  const pParams = document.createElement("p");
  pParams.innerHTML = `λ = ${fmt(lambda, 6)}`;
  divTabela.appendChild(pParams);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");

  for (const titulo of ["k", "P(X = k)", "P(X <= k)", "P(X >= k)"]){
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
 while (acumInf < 0.9999){
  const pk = probPoisson(lambda, k);
  acumInf += pk;

  //acumulada superior: 1 − P(X ≤ k−1)
  const acumSup = k === 0 ? 1 : 1 - (acumInf - pk);
  const tr = document.createElement("tr");
  for(const valor of [
    k,
    fmt(pk, 8),
    fmt(Math.min(acumInf, 1), 8),
    fmt(Math.max(acumSup, 0), 8),
  ]){
  const td = document.createElement("td");
  td.innerHTML = valor;
  tr.appendChild(td); 
  }

  tbody.appendChild(tr);
  k++;
 }

 table.appendChild(tbody);
 divTabela.appendChild(table)
 containerCalculosResultados.appendChild(divTabela);

 setMostrarResultados(true);
}

const intervaloDuplo = [
  "menorQueMenorQuePoi",
  "menorIgualMenorQuePoi",
  "menorQueMenorIgualPoi",
  "menorIgualMenorIgualPoi",
]

formDistPoisson.addEventListener("submit", (e) => {
  e.preventDefault();
  setMostrarResultados(false);

  const lambda = parseFloat(inputVMedia.value.trim());
  const valorA = parseInt(inputValorA.value.trim(), 10);
  const valorB = parseInt(inputValorB.value.trim(), 10);
  const tipoIntervalo = escolhaTipoIntervaloFunc();

  //validation
  if (isNaN(lambda) || lambda <= 0){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Média / Lambda" deve ser um número positivo!
    </p>`;
    return;
  }
  if (isNaN(valorA) || valorA < 0){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Valor A" deve ser um inteiro maior ou igual a 0!
    </p>`
    return;
  }
  if (!tipoIntervalo){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Selecione um tipo de intervalo!
    </p>`;
    return;
  }
  if (intervaloDuplo.includes(tipoIntervalo)){
    if(isNaN(valorB) || valorB < 0){
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser um inteiro maior ou igual a 0!
      </p>`;
      return;
    }
    if (valorB <= valorA){
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser maior que "Valor A"!
      </p>`;
      return;
    }
  }

  renderizarResultados(lambda, tipoIntervalo, valorA, valorB);
});
