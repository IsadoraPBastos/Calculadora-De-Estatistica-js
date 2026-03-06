import {
  tabelaDeDados,
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
} from "../state.js";

const formEqu1Grau = document.getElementById("formEqu1Grau");
const inputValorX = document.getElementById("inputValorX");
const inputValorY = document.getElementById("inputValorY");
const tbodyEqu1Grau = document.getElementById("tbodyEqu1Grau");

formEqu1Grau.addEventListener("submit", (e) => {
  e.preventDefault();
  let valorX = +inputValorX.value.trim();
  let valorY = +inputValorY.value.trim();

  if (
    isNaN(valorX) ||
    isNaN(valorY) ||
    inputValorX.value === "" ||
    inputValorY.value === ""
  )
    return;
  if (valorX in tabelaDeDados) {
    // Fazer uma mensagem de erro
    return;
  }
  tabelaDeDados[valorX] = valorY;
  console.log(tabelaDeDados);

  inputValorX.value = "";
  inputValorY.value = "";

  // Mostrar tabela de dados inseridos pelo usuário
  const tr = document.createElement("tr");

  const tdX = document.createElement("td");
  tdX.textContent = valorX;

  const tdY = document.createElement("td");
  tdY.textContent = valorY;

  const tdBotao = document.createElement("td");
  const botao = document.createElement("button");
  botao.innerHTML = `<i class="fa-solid fa-xmark fa-2xl" style="color: black;"></i>`;
  botao.style.background = "none";
  botao.style.border = "none";
  botao.style.cursor = "pointer";
  botao.style.padding = 0;

  botao.addEventListener("click", () => {
    delete tabelaDeDados[valorX];
    tr.remove();
  });

  tdBotao.appendChild(botao);
  tr.appendChild(tdX);
  tr.appendChild(tdY);
  tr.appendChild(tdBotao);

  tbodyEqu1Grau.appendChild(tr);
});

let equacaoReta, dominio, coefiDeterminacao;

const btnCalcular = document.getElementById("btnCalcular");

btnCalcular.addEventListener("click", () => {
  if (Object.keys(tabelaDeDados).length > 0) {
    const pares = Object.entries(tabelaDeDados)
      .map(([x, y]) => [Number(x), y])
      .sort((a, b) => a[0] - b[0]);

    const x = pares.map((p) => p[0]);
    const y = pares.map((p) => p[1]);
    const n = x.length;

    // Somatórios necessários
    let somaX = 0;
    let somaY = 0;
    let somaX2 = 0;
    let somaY2 = 0;
    let somaXY = 0;

    for (let i = 0; i < n; i++) {
      somaX += x[i];
      somaY += y[i];
      somaX2 += x[i] ** 2;
      somaY2 += y[i] ** 2;
      somaXY += x[i] * y[i];
    }

    // Coeficiente Angular (b)
    let numerador = n * somaXY - somaX * somaY;
    let denominador = n * somaX2 - somaX ** 2;

    let coefAngular;
    if (denominador !== 0) {
      coefAngular = numerador / denominador;
    }

    // Coeficiente Linear (a)
    let coefLinear;
    if (coefAngular !== undefined) {
      coefLinear = (somaY - coefAngular * somaX) / n;
    }

    // Coeficiente de Correlação (r)
    let numeradorR = n * somaXY - somaX * somaY;

    let denominadorR = Math.sqrt(
      (n * somaX2 - somaX ** 2) * (n * somaY2 - somaY ** 2),
    );

    let coefCorrelacao;
    if (denominadorR !== 0) {
      coefCorrelacao = numeradorR / denominadorR;
    }

    // Coeficiente de Determinação (R²)
    if (coefCorrelacao !== undefined) {
      coefiDeterminacao = coefCorrelacao ** 2 * 100;
    }

    // Equação da reta
    equacaoReta = `y = ${coefLinear.toFixed(2)} + ${coefAngular.toFixed(2)}x`;

    // Domínio
    let xMin = Math.min(...x);
    let xMax = Math.max(...x);

    dominio = `(${xMin}, ${xMax})`;

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
      if (escolha === "equacaoReta") {
        h3.innerHTML = "Equação da Reta";
        p.innerHTML = equacaoReta;
      }
      if (escolha === "dominio") {
        h3.innerHTML = "Domínio";
        p.innerHTML = dominio;
      }
      if (escolha === "coefiDeterminacao") {
        h3.innerHTML = "Coeficiente Determinação";
        p.innerHTML = coefiDeterminacao.toFixed(2) + "%";
      }
      div.appendChild(h3);
      div.appendChild(p);
      if (escolha === "moda") {
        div.appendChild(p2);
      }
      containerCalculosResultados.appendChild(div);
    }

    setMostrarResultados(true);

    console.log("Equação:", equacaoReta);
    console.log("Domínio:", dominio);
    console.log("Coef Determinação:", coefiDeterminacao.toFixed(2) + "%");
  }
});
