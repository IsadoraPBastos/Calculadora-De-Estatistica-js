import {
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
} from "../../state.js";

const formDistBinomial = document.getElementById("formDistBinomial");
const inputVTotal = document.getElementById("inputVTotal");
const inputProbabSucesso = document.getElementById("inputProbabSucesso");
const inputProbabInsucesso = document.getElementById("inputProbabInsucesso");
const inputValorA = document.getElementById("inputValorABino");
const inputValorB = document.getElementById("inputDuasVariaveisBin");
const mostrarConta = document.getElementById("mostrarContaBino");

/** fatorial para precisão com n grande*/
function fatorial(n){
  if (n <= 1) return 1n;
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
} 

/**combinação C(n, k) */
function combinacao(n, k){
  if (k < 0 || k > n) return 0;
  return Number(fatorial(n) / (fatorial(k) * fatorial(n - k)));
}

/** P(X = k) na distribuição binomial */
function probBinomial(n, k, p){
  const q = 1 - p;
  return combinacao(n, k) * Math.pow(p, k) * Math.pow(q, n - k);
}

/** formatacao com ate 'dec' casa, removendo zeros a direita */
function fmt(v, dec = 6){
  if(v === null || isNaN(v)) return "-";
  return parseFloat(v.toFixed(dec)).toString();
}

// ----- Intervalos -----------
/** calcula P conforme o tipo de intervalo selecionado 
 * retorna {label, valor} onde label é a expressão exibida e valor é o número
*/
function calcularIntervalo(n, p, valorA, valorB, tipoIntervalo){
  const q = 1 - p;
  let label = "";
  let valor = 0;
  // soma acumulada auxiliar
  function acumAte(k){
    let soma = 0;
    for (let i = 0; i <= k; i++) soma += probBinomial(n, i, p);
    return soma;
  }
  switch (tipoIntervalo){
    // intervalo simples com valorA
    case "maiorQueBin": //P(X > a)  =  1 − P(X ≤ a)
    label = `P(X > ${valorA})`;
    valor = 1 - acumAte(valorA);
    break;

    case "maiorIgualBin": //P(X ≥ a)  =  1 − P(X ≤ a−1)
    label = `P(X >= ${valorA})`;
    valor = 1 - acumAte(valorA - 1);
    break;

    case "menorQueBin": //P(X < a)  =  P(X ≤ a−1)
    label = `P(X < ${valorA})`;
    valor = acumAte(valorA - 1);
    break;

    case "menorIgualBin": //P(X ≤ a)
    label = `P(X <= ${valorA})`;
    valor = acumAte(valorA);
    break;

    case "intervaloIgualBin": //P(X = a)
    label = `P(X = ${valorA})`;
    valor = probBinomial(n, valorA, p);
    break;
    // intervalos duplos valorA e valorB
    case "menorQueMenorQueBin": //P(a < X < b)
    label = `P(${valorA} < X < ${valorB})`;
    valor = acumAte(valorB - 1) - acumAte(valorA);
    break;

    case "menorIgualMenorQueBin": //P(a ≤ X < b)
    label = `P(${valorA} <= X < ${valorB})`;
    valor = acumAte(valorB - 1) - acumAte(valorA - 1);
    break;

    case "menorQueMenorIgualBin": //P(a < X ≤ b)
    label = `P(${valorA} < X <= ${valorB})`;
    valor = acumAte(valorB) - acumAte(valorA);
    break;

    case "menorIgualMenorIgualBin": //P(a ≤ X ≤ b)
      label = `P(${valorA} <= X <= ${valorB})`;
      valor = acumAte(valorB) - acumAte(valorA - 1);
      break;

    default:
      label = "";
      valor = null;
  }

  return { label, valor };
}

// ----- Renderização de resultado -----
function renderizarResultados(n, p, tipoIntervalo, valorA, valorB){
  const q = 1 - p;
  const media = n * p;
  const variancia = n * p * q;
  const dp = Math.sqrt(variancia);
  const cv = media !== 0 ? (100 * dp) / media : 0;

  // probabilidade de intervalo escolhido
  const { label: labelIntervalo, valor: probIntervalo } =
  calcularIntervalo(n, p, valorA, valorB, tipoIntervalo);

  const containerCalculosResultados = document.querySelector(
    ".container-calculos-resultados"
  );
  containerCalculosResultados.replaceChildren();

  // função auxiliar para criar cada card igual ao padrão
  function criarCard(titulo, ...valores){
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

  // cards das medidas resumo
  criarCard("Média (μ)",           `μ = n · p = ${fmt(media, 4)}`);
  criarCard("Variância (σ²)",      `σ² = n · p · q = ${fmt(variancia, 4)}`);
  criarCard("Desvio Padrão (σ)",   `σ = √σ² = ${fmt(dp, 4)}`);
  criarCard("Coef. de Variação",   `CV = 100 · σ/μ = ${fmt(cv, 2)}%`);

  // card do intervalo calculado
  if (labelIntervalo){
    criarCard(
      "Probabilidade",
      `${labelIntervalo} = ${fmt(probIntervalo, 8)}`,
      `≈ ${fmt(probIntervalo * 100, 4)}%`
    );
  }

  //card da tabela completa
  const divTabela = document.createElement("div");
  divTabela.className = "calculos-resultados";

  const h3Tabela = document.createElement("h3");
  h3Tabela.innerHTML = "Distribuição Completa";
  divTabela.appendChild(h3Tabela);

  const pParams = document.createElement("p");
  pParams.innerHTML = `n = ${n} &nbsp;·&nbsp; p = ${fmt(p, 6)} &nbsp;·&nbsp; q = ${fmt(q, 6)}`;
  divTabela.appendChild(pParams);

  const probs = Array.from({length: n+1}, (_, k) => probBinomial(n, k, p));

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trhead = document.createElement("tr");

  for (const titulo of ["k", "C(n, k)", "P(X = k)", "P(X <= k)", "P(X >= k)"]){
    const th = document.createElement("th");
    th.innerHTML = titulo;
    trhead.appendChild(th);
  }
  thead.appendChild(trhead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  let acumInf = 0;

  for (let k = 0; k <= n; k++){
    const pk = probs[k];
    acumInf += pk;
    const acumSup = probs.slice(k).reduce((s,v) => s+v, 0);
    const tr = document.createElement("tr");
    
    for (const valor of [
      k,
      combinacao(n, k).toLocaleString("pt-BR"),
      fmt(pk, 8),
      fmt(Math.min(acumInf, 1), 8),
      fmt(Math.min(acumSup, 1), 8), 
    ]){
      const td = document.createElement("td");
      td.innerHTML = valor;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  divTabela.appendChild(table);
  containerCalculosResultados.appendChild(divTabela);

  setMostrarResultados(true);
}

const intervaloDuplo = [
  "menorQueMenorQueBin",
  "menorIgualMenorQueBin",
  "menorQueMenorIgualBin",
  "menorIgualMenorIgualBin",
];

formDistBinomial.addEventListener("submit", (e) => {
  e.preventDefault();
  setMostrarResultados(false);

  const n = parseInt(inputVTotal.value.trim(), 10);
  let p = parseFloat(inputProbabSucesso.value.trim());
  const qDigitado = parseFloat(inputProbabInsucesso.value.trim());
  if (isNaN(p) && !isNaN(qDigitado)) p = 1 - qDigitado;

  const valorA = parseInt(inputValorA.value.trim(), 10);
  const valorB = parseInt(inputValorB.value.trim(), 10);
  const tipoIntervalo = escolhaTipoIntervaloFunc();

  // validações
  if (isNaN(n) || !Number.isInteger(n)){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Total" deve ser um inteiro positivo!
    </p>`;
    return;
  }
  if (isNaN(p) || p<=0 || p > 1){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Informe uma probabilidade de sucesso válida (entre 0 e 1)!
    </p>`;
    return;
  }
  if (isNaN(valorA) || valorA < 0 || valorA > n){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      "Valor A" deve ser um inteiro entre 0 e ${n}!
    </p>`;
    return;
  }
  if (!tipoIntervalo){
    mostrarConta.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Selecione um tipo de intervalo!
    </p>`;
    return;
  }
  if (intervaloDuplo.includes (tipoIntervalo)){
    if(isNaN(valorB) || valorB < 0 || valorB > n){
      mostrarConta.innerHTML = `<p class="msg-erro">
        <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
        "Valor B" deve ser um inteiro entre 0 e ${n}!
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

  renderizarResultados(n, p, tipoIntervalo, valorA, valorB);
});
