import {
  dados,
  tabelaRecebida,
  FreqIndAbs,
  escolhaCalculosFunc,
  setMostrarResultados,
  escolhaTipoDadoFunc,
  setDistNormalAtiva,
  distNormalAtiva,
  distNormalDados,
  modoCalculo,
} from "../state.js";

// Dados Desordenados
const formDadosDesordenados = document.getElementById("formDadosDesordenados");
const dado = document.getElementById("inputAdicionarDesordenados");
const mostrarDadosInseridosDesor = document.getElementById(
  "mostrarDadosInseridosDesor",
);
const limpar_desor = document.getElementById("limpar_desor");

formDadosDesordenados.addEventListener("submit", (e) => {
  e.preventDefault();
  setMostrarResultados(false);

  for (let key in tabelaRecebida) {
    delete tabelaRecebida[key];
  }
  amostra.value = "";
  freq.value = "";
  tbodyTabela.innerHTML = "";

  const valor = +dado.value.trim();
  if (isNaN(valor) || dado.value === "") return;
  dados.push(valor);

  dado.value = "";
  mostrarDadosInseridosDesor.textContent = dados.join(" - ");
});

limpar_desor.addEventListener("click", () => {
  dados.length = 0;
  mostrarDadosInseridosDesor.textContent = dados;
});

// Dados em Tabela
const formDadosEmTabela = document.getElementById("formDadosEmTabela");
const amostra = document.getElementById("inputAmostraTabela");
const freq = document.getElementById("inputFreqTabela");
const tbodyTabela = document.getElementById("tbodyTabela");

formDadosEmTabela.addEventListener("submit", (e) => {
  e.preventDefault();
  setMostrarResultados(false);

  dados.length = 0;
  dado.value = "";
  mostrarDadosInseridosDesor.textContent = "";

  const valorAmo = +amostra.value.trim();
  const valorFreq = +freq.value.trim();
  if (
    isNaN(valorAmo) ||
    isNaN(valorFreq) ||
    amostra.value === "" ||
    freq.value === ""
  )
    return;
  if (valorAmo in tabelaRecebida) {
    // Fazer uma mensagem de erro
    return;
  }
  tabelaRecebida[valorAmo] = valorFreq;

  amostra.value = "";
  freq.value = "";

  // Mostrar tabela de dados inseridos pelo usuário
  const tr = document.createElement("tr");

  const tdAmostra = document.createElement("td");
  tdAmostra.textContent = valorAmo;

  const tdFreq = document.createElement("td");
  tdFreq.textContent = valorFreq;

  const tdBotao = document.createElement("td");
  const botao = document.createElement("button");
  botao.innerHTML = `<i class="fa-solid fa-xmark fa-2xl" style="color: black;"></i>`;
  botao.style.background = "none";
  botao.style.border = "none";
  botao.style.cursor = "pointer";

  botao.addEventListener("click", () => {
    delete tabelaRecebida[valorAmo];
    tr.remove();
  });

  tdBotao.appendChild(botao);
  tr.appendChild(tdAmostra);
  tr.appendChild(tdFreq);
  tr.appendChild(tdBotao);

  tbodyTabela.appendChild(tr);
});

// Cálculos
let media, mediana, moda, tipoModa, variancia, desvioPadrao, coeficienteVar;
let maxFreq, somaFreq;

const btnCalcular = document.getElementById("btnCalcular");

function calcular() {
  for (let key in FreqIndAbs) {
    delete FreqIndAbs[key];
  }

  if (dados.length != 0) {
    for (let key in tabelaRecebida) {
      delete tabelaRecebida[key];
    }
    for (const num of dados.sort((a, b) => a - b)) {
      FreqIndAbs[num] = (FreqIndAbs[num] || 0) + 1;
    }
    somaFreq = dados.length;
  }

  if (Object.keys(tabelaRecebida).length != 0) {
    dados.length = 0;
    Object.assign(FreqIndAbs, tabelaRecebida);
    somaFreq = Object.values(FreqIndAbs).reduce((acc, valor) => acc + valor, 0);
  }
  console.log(FreqIndAbs);

  let xifi = {};
  for (const [amostra, freq] of Object.entries(FreqIndAbs)) {
    xifi[amostra] = amostra * freq;
  }

  // Média
  const somaValoresXifi = Object.values(xifi).reduce(
    (acc, valor) => acc + valor,
    0,
  );
  media = (somaValoresXifi / somaFreq).toFixed(2);

  // Moda
  maxFreq = Math.max(...Object.values(FreqIndAbs));
  moda = Object.entries(FreqIndAbs)
    .filter(([num, freq]) => freq === maxFreq)
    .map(([num]) => Number(num));
  if (maxFreq == 1) {
    tipoModa = "Amodal";
  } else if (moda.length == 1) {
    tipoModa = "Unimodal";
  } else if (moda.length == 2) {
    tipoModa = "Bimodal";
  } else if (moda.length == 3) {
    tipoModa = "Trimodal";
  } else if (moda.length > 3) {
    tipoModa = "Multimodal";
  }

  // Mediana
  let conjunto = [];
  if (dados.length > 0) {
    conjunto = [...dados].sort((a, b) => a - b);
  } else {
    for (let valor in FreqIndAbs) {
      for (let i = 0; i < FreqIndAbs[valor]; i++) {
        conjunto.push(Number(valor));
      }
    }
    conjunto.sort((a, b) => a - b);
  }

  if (conjunto.length % 2 === 1) {
    mediana = conjunto[Math.floor(conjunto.length / 2)];
  } else {
    mediana =
      (conjunto[conjunto.length / 2 - 1] + conjunto[conjunto.length / 2]) / 2;
  }

  // Variância
  let somatoria = 0;
  for (const num of conjunto) {
    somatoria += Math.pow(num - media, 2);
  }
  variancia = somatoria / (somaFreq - 1);

  // Desvio Padrão
  if (variancia != 0) {
    desvioPadrao = Math.sqrt(variancia);
  } else {
    desvioPadrao = 0;
  }

  // Coeficiente de Variação
  if (desvioPadrao != 0) {
    if (media != 0) {
      coeficienteVar = (desvioPadrao * 100) / media;
    } else {
      coeficienteVar = "Inf";
    }
  } else {
    coeficienteVar = 0 + "%";
  }

  if (distNormalAtiva == false) {
    let escolhasCalculo = escolhaCalculosFunc();
    console.log("Escolhas de calculo: " + escolhasCalculo);

    let escolhaTipoDado = escolhaTipoDadoFunc();
    if (escolhaTipoDado == "outro") {
      const outroInput = document.getElementById("tipo_custom");
      escolhaTipoDado = outroInput.value.trim();
    }

    const containerCalculosResultados = document.querySelector(
      ".container-calculos-resultados",
    );

    containerCalculosResultados.replaceChildren();

    for (const escolha of escolhasCalculo) {
      if (escolha === "todos") continue;
      const div = document.createElement("div");
      div.className = "calculos-resultados";
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      const p2 = document.createElement("p");
      if (escolha === "media") {
        h3.innerHTML = "Média";
        if (escolhaTipoDado == "R$") {
          media = "R$ " + media;
        } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
          media = media + " " + escolhaTipoDado;
        }
        p.innerHTML = media;
      }
      if (escolha === "moda") {
        h3.innerHTML = "Moda";
        p.innerHTML = moda;
        p2.innerHTML = tipoModa;
      }
      if (escolha === "mediana") {
        h3.innerHTML = "Mediana";
        if (escolhaTipoDado == "R$") {
          mediana = "R$ " + mediana;
        } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
          mediana = mediana + " " + escolhaTipoDado;
        }
        p.innerHTML = mediana;
      }
      if (escolha === "variancia") {
        h3.innerHTML = "Variância";
        if (escolhaTipoDado == "R$") {
          variancia = "R$ " + variancia.toFixed(2);
        } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
          variancia = variancia.toFixed(2) + " " + escolhaTipoDado + "²";
        } else if (escolhaTipoDado == "semMedida") {
          variancia = variancia.toFixed(2);
        }
        p.innerHTML = variancia;
      }
      if (escolha === "desvioPadrao") {
        h3.innerHTML = "Desvio Padrão";
        if (escolhaTipoDado == "R$") {
          desvioPadrao = "R$ " + desvioPadrao.toFixed(2);
        } else if (escolhaTipoDado != "R$" && escolhaTipoDado != "semMedida") {
          desvioPadrao = desvioPadrao.toFixed(2) + " " + escolhaTipoDado;
        } else if (escolhaTipoDado == "semMedida") {
          desvioPadrao = desvioPadrao.toFixed(2);
        }
        p.innerHTML = desvioPadrao;
      }
      if (escolha === "coeficienteVariacao") {
        h3.innerHTML = "Coeficiente de Variação";
        p.innerHTML = coeficienteVar.toFixed(2) + "%";
      }
      div.appendChild(h3);
      div.appendChild(p);
      if (escolha === "moda") {
        div.appendChild(p2);
      }
      containerCalculosResultados.appendChild(div);
    }

    setMostrarResultados(true);
  } else {
    distNormalDados["Media"] = media;
    distNormalDados["Moda"] = moda;
    distNormalDados["Mediana"] = mediana.toFixed(2);
    distNormalDados["DesvioPadrao"] = desvioPadrao.toFixed(2);
  }
}

btnCalcular.addEventListener("click", () => {
  if (modoCalculo == "Discreto") {
    if (dados.length > 1 || Object.keys(tabelaRecebida).length > 1) {
      document.getElementById("msg-erro-zero-division").style.display = "none";
      calcular();
    } else {
      document.getElementById("msg-erro-zero-division").style.display = "block";
    }
  }
});

// Agrupamento Discreto pela Distribuição Normal
let btnNormalDiscreto = document.getElementById("btnNormalDiscreto");
btnNormalDiscreto.addEventListener("click", (e) => {
  e.preventDefault();
  setDistNormalAtiva(true);
  document.getElementById("formDesordenadoPNormal").style.display = "contents";
});

let formDesordenadoPNormal = document.getElementById("formDesordenadoPNormal");
formDesordenadoPNormal.addEventListener("submit", (e) => {
  e.preventDefault();
  if (distNormalAtiva == true) {
    calcular();
    console.log(distNormalDados);
  }

  setDistNormalAtiva(false);
  document.getElementById("formDesordenadoPNormal").style.display = "none";
  dados.length = 0;
  mostrarDadosInseridosDesor.textContent = dados.join(" - ");

  document.getElementById("container_modal_discreto").classList.remove("show");
  document.getElementById("container_modal_vac").classList.add("show");
  document.getElementById("secaoDNormal").style.display = "flex";
  document.getElementById("secaoDNormal_Final").style.display = "flex";

  if (Object.keys(distNormalDados).length > 0) {
    dadosCalculadosNormal.replaceChildren();

    const h3 = document.createElement("h3");
    h3.textContent = "📊 Dados Calculados";
    dadosCalculadosNormal.appendChild(h3);

    for (const [key, value] of Object.entries(distNormalDados)) {
      const div = document.createElement("div");

      let text;
      const strong = document.createElement("strong");
      if (key == "Media") {
        text = "Média";
      } else if (key == "DesvioPadrao") {
        text = "Desvio Padrão";
      } else {
        text = key;
      }
      strong.textContent = text + ": ";

      div.appendChild(strong);
      div.append(value);

      dadosCalculadosNormal.appendChild(div);
    }
  }
});

const fecharModalDiscreto = document.querySelector(".botao-fechar-modal");
fecharModalDiscreto.addEventListener("click", (e) => {
  e.preventDefault();
  setDistNormalAtiva(false);
  console.log("Entrou 2");
  document.getElementById("formDesordenadoPNormal").style.display = "none";
});
// const titleStatisticsTable = document.getElementById("titleStatisticsTable");
// const titleClassesOuAmostra = document.getElementById("titleClassesOuAmostra")

// titleStatisticsTable.value = "Tabela das Frequências";
// titleClassesOuAmostra.value = "Amostra"
