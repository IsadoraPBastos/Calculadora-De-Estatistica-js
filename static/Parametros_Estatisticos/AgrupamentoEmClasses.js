import {
  dadosClasses,
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
  setDistNormalAtiva,
  distNormalAtiva,
  setDadosDistNormF,
} from "../state.js";

// ─── Elementos do DOM ───────────────────────────────────────────────────────
const btnAdicionarClasses = document.getElementById("btnAdicionarClasses");
const inputLiClasses = document.getElementById("inputLiClasses");
const inputAmplitudeClasses = document.getElementById("inputAmplitudeClasses");
const inputQtdClasses = document.getElementById("inputQtdClasses");
const tbodyClasses = document.getElementById("tbodyClasses");
const btnAlterarFI = document.getElementById("alterarFIClasses");
const btnCalcular = document.getElementById("btnCalcular");
const modalClassesEl = document.getElementById("container_modal_classes");
const btnLimparClasses = modalClassesEl.querySelector(".btn_limpar");

// ─── Estado local ────────────────────────────────────────────────────────────
let classesData = []; // [{ li, ls, fi, pmi }]
let amplitudeGlobal = 0;

// ─── Utilitários ─────────────────────────────────────────────────────────────
function fmt(num, casas = 2) {
  const v = parseFloat(num);
  if (!isFinite(v)) return "—";
  return parseFloat(v.toFixed(casas)).toString();
}

function fmtD(num, casas = 2) {
  const v = parseFloat(num);
  if (!isFinite(v)) return "—";
  return v.toFixed(casas);
}

function aplicarUnidade(valor, tipo, potencia) {
  const v = parseFloat(valor).toFixed(2);
  if (tipo === "R$") return "R$ " + v;
  if (tipo === "semMedida") return v;
  const suf = potencia === 2 ? tipo + "²" : tipo;
  return v + " " + suf;
}

const inputsForm = [inputLiClasses, inputAmplitudeClasses, inputQtdClasses];
inputsForm.forEach((input, i) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const proximo = inputsForm[i + 1];
      if (proximo) {
        proximo.focus();
      } else {
        handleDadosClasse();
      }
    }
  });
});

function handleDadosClasse() {
  const li = parseFloat(inputLiClasses.value);
  const h = parseFloat(inputAmplitudeClasses.value);
  const qtd = parseInt(inputQtdClasses.value, 10);

  if (isNaN(li) || isNaN(h) || isNaN(qtd) || qtd < 1 || h <= 0) return;

  amplitudeGlobal = h;
  classesData = [];
  tbodyClasses.innerHTML = "";

  for (const k in dadosClasses) delete dadosClasses[k];

  for (let i = 0; i < qtd; i++) {
    const liAtual = li + i * h;
    const lsAtual = liAtual + h;
    const pmi = (liAtual + lsAtual) / 2;

    classesData.push({ li: liAtual, ls: lsAtual, fi: 0, pmi });

    const tr = document.createElement("tr");

    // Li
    const tdLi = document.createElement("td");
    tdLi.textContent = fmt(liAtual);

    // Ls
    const tdLs = document.createElement("td");
    tdLs.textContent = fmt(lsAtual);

    // FI (input)
    const tdFi = document.createElement("td");
    const inputFi = document.createElement("input");
    inputFi.type = "number";
    inputFi.min = "0";
    inputFi.step = "1";
    inputFi.placeholder = "0";
    inputFi.dataset.index = i;
    inputFi.style.cssText = [
      "width:65px",
      "text-align:center",
      "border-radius:5px",
      "border:2px solid #223fa3",
      "padding:4px 6px",
      "font-size:14px",
    ].join(";");
    inputFi.addEventListener("input", () => {
      const idx = parseInt(inputFi.dataset.index, 10);
      classesData[idx].fi = parseInt(inputFi.value, 10) || 0;
    });
    // Tab/Enter navega entre FI inputs
    inputFi.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === "Tab") {
        ev.preventDefault();
        const allFI = Array.from(
          tbodyClasses.querySelectorAll("input[type='number']"),
        );
        const idx = allFI.indexOf(inputFi);
        if (idx !== -1 && idx < allFI.length - 1) {
          allFI[idx + 1].focus();
        }
      }
    });
    tdFi.appendChild(inputFi);

    // PMI
    const tdPmi = document.createElement("td");
    tdPmi.textContent = fmt(pmi);

    tr.appendChild(tdLi);
    tr.appendChild(tdLs);
    tr.appendChild(tdFi);
    tr.appendChild(tdPmi);
    tbodyClasses.appendChild(tr);
  }

  // Foco no primeiro input de FI
  const primeiro = tbodyClasses.querySelector("input[type='number']");
  if (primeiro) setTimeout(() => primeiro.focus(), 60);
}

// ─── Geração das linhas de classes ───────────────────────────────────────────
btnAdicionarClasses.addEventListener("click", (e) => {
  e.preventDefault();
  handleDadosClasse();
});

let errorMsg = false;
const errorMsgClasses = document.getElementById("errorMsgClasses");
// ─── Botão "Alterar FI" ──────────────────────────────────────────────────────
btnAlterarFI.addEventListener("click", (e) => {
  e.preventDefault();
  if (classesData.length === 0) return;
  lerFIsDaTabela();

  errorMsgClasses.replaceChildren();
  errorMsg = false;

  // Pulso verde nos inputs para confirmar
  const inputs = tbodyClasses.querySelectorAll("input[type='number']");
  inputs.forEach((inp) => {
    if (inp.value < 1) {
      inp.style.borderColor = "#8a1a1a";
      inp.style.backgroundColor = "#ffeaea";
      errorMsg = true;
    } else {
      inp.style.borderColor = "#1a8a2e";
      inp.style.backgroundColor = "#eaffea";
      inp.style.transition = "all 0.3s";
    }
  });

  console.log(errorMsg);
  if (errorMsg == true) {
    errorMsgClasses.innerHTML = `<p class="msg-erro">
      <i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i>
      Todas as FI devem possuir um valor acima de 0! 
    </p>`;
  } else {
    errorMsgClasses.replaceChildren();
  }
});

// ─── Botão "Limpar" do modal de classes ──────────────────────────────────────
if (btnLimparClasses) {
  btnLimparClasses.addEventListener("click", (e) => {
    e.preventDefault();
    tbodyClasses.innerHTML = "";
    classesData = [];
    amplitudeGlobal = 0;
    inputLiClasses.value = "";
    inputAmplitudeClasses.value = "";
    inputQtdClasses.value = "";
    for (const k in dadosClasses) delete dadosClasses[k];
    document.getElementById("containerTabelaDistribuicao").innerHTML = "";
    setMostrarResultados(false);
    if (errorMsg == false) {
      errorMsgClasses.replaceChildren();
    }
  });
}

function validar() {
  let vazio = "";
  const inputs = tbodyClasses.querySelectorAll("input[type='number']");
  inputs.forEach((inp) => {
    if (inp.value < 1) {
      vazio += "vazio";
    } else {
      vazio += "";
    }
  });
  let escolhasCalculo = escolhaCalculosFunc();
  if (escolhasCalculo.length == 0) {
    vazio += "semEscolhaCalc";
  }
  let escolhaTipoDado = escolhaTipoDadoFunc();
  if (escolhaTipoDado == null) {
    vazio += "semEscolhaDado";
  }
  return vazio;
}

// ─── Botão principal "Calcular" ───────────────────────────────────────────────
btnCalcular.addEventListener("click", () => {
  const modalClasses = document.getElementById("container_modal_classes");
  if (!modalClasses.classList.contains("show")) return;

  lerFIsDaTabela();

  const totalFI = classesData.reduce((acc, c) => acc + c.fi, 0);
  if (classesData.length === 0 || totalFI === 0) {
    mostrarErroDados(
      "Insira as classes e preencha as Frequências Individuais (fi)!",
    );
    return;
  }

  let verficar = validar();
  console.log(verficar);
  if (verficar == "") {
    calcularClasses();
  } else {
    setMostrarResultados(false);
    const container = document.getElementById("containerTabelaDistribuicao");
    container.innerHTML = "";
  }
});

// ─── Helpers internos ─────────────────────────────────────────────────────────
function lerFIsDaTabela() {
  const inputs = tbodyClasses.querySelectorAll("input[type='number']");
  inputs.forEach((inp) => {
    const idx = parseInt(inp.dataset.index, 10);
    if (!isNaN(idx) && idx < classesData.length) {
      classesData[idx].fi = parseInt(inp.value, 10) || 0;
    }
  });
}

// function destacarClassesEspeciais() {
//   if (classesData.length === 0) return;
//   const rows = tbodyClasses.querySelectorAll("tr");
//   const maxFi = Math.max(...classesData.map((c) => c.fi));
//   const n = classesData.reduce((acc, c) => acc + c.fi, 0);
//   let fac = 0;

//   classesData.forEach((c, i) => {
//     const row = rows[i];
//     if (!row) return;
//     row.style.backgroundColor = "";
//     row.title = "";
//     fac += c.fi;

//     const isModal = c.fi === maxFi;
//     const isMediana = fac >= n / 2 && fac - c.fi < n / 2;

//     if (isModal && isMediana) {
//       row.style.backgroundColor = "#d4edda";
//       row.title = "Classe Modal + Mediana";
//     } else if (isModal) {
//       row.style.backgroundColor = "#fff3cd";
//       row.title = "Classe Modal";
//     } else if (isMediana) {
//       row.style.backgroundColor = "#cce5ff";
//       row.title = "Classe da Mediana";
//     }
//   });
// }

function mostrarErroDados(msg) {
  let el = document.getElementById("msg-erro-classes");
  if (!el) {
    el = document.createElement("div");
    el.id = "msg-erro-classes";
    el.className = "msg-erro";
    el.style.display = "block";
    modalClassesEl.querySelector(".modal").appendChild(el);
  }
  el.innerHTML = `<i class="fa-solid fa-triangle-exclamation fa-beat-fade"></i> ${msg}`;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 3500);
}

// ─── Motor de cálculos estatísticos ──────────────────────────────────────────
function calcularClasses() {
  const h = amplitudeGlobal || classesData[0].ls - classesData[0].li;
  const n = classesData.reduce((acc, c) => acc + c.fi, 0);

  // Σ(fi · PMi)
  const somaFiPmi = classesData.reduce((acc, c) => acc + c.fi * c.pmi, 0);
  // Média
  const media = somaFiPmi / n;

  // Classe modal
  const maxFi = Math.max(...classesData.map((c) => c.fi));
  const modalIdx = classesData.findIndex((c) => c.fi === maxFi);
  const cModal = classesData[modalIdx];

  // Moda Bruta
  const modaBruta = cModal.pmi;

  // Moda de Czuber
  const d1 =
    modalIdx > 0 ? cModal.fi - classesData[modalIdx - 1].fi : cModal.fi;
  const d2 =
    modalIdx < classesData.length - 1
      ? cModal.fi - classesData[modalIdx + 1].fi
      : cModal.fi;
  const modaCzuber =
    d1 + d2 !== 0 ? cModal.li + h * (d1 / (d1 + d2)) : cModal.pmi;

  // Classe da mediana e mediana interpolada
  let mediana = null;
  let medianaIdx = -1;
  let facAnt = 0;
  let facAcum = 0;
  for (let i = 0; i < classesData.length; i++) {
    facAnt = facAcum;
    facAcum += classesData[i].fi;
    if (facAcum >= n / 2 && medianaIdx === -1) {
      medianaIdx = i;
      mediana = classesData[i].li + h * ((n / 2 - facAnt) / classesData[i].fi);
    }
  }

  // Σ fi(PMi − x̄)²
  const somaFiDevQ = classesData.reduce(
    (acc, c) => acc + c.fi * Math.pow(c.pmi - media, 2),
    0,
  );

  // Variância amostral
  const variancia = n > 1 ? somaFiDevQ / (n - 1) : 0;
  const desvioPadrao = Math.sqrt(variancia);
  const cvPct = media !== 0 ? (desvioPadrao / media) * 100 : Infinity;

  // Guardar em dadosClasses (para Distribuição Normal)
  for (let key in dadosClasses) {
    delete dadosClasses[key];
  }
  dadosClasses["Media"] = fmtD(media);
  dadosClasses["ModaBruta"] = fmtD(modaBruta);
  dadosClasses["ModaCzuber"] = fmtD(modaCzuber);
  dadosClasses["Mediana"] = fmtD(mediana);
  dadosClasses["DesvioPadrao"] = fmtD(desvioPadrao);
  dadosClasses["TamAmostra"] = fmtD(n);
  dadosClasses["Variancia"] = fmtD(variancia);
  dadosClasses["CoefVariacao"] = fmtD(cvPct);

  // ─── Exibir cards de resultado ─────────────────────────────────────────────
  const escolhasCalculo = escolhaCalculosFunc();
  let tipoDado = escolhaTipoDadoFunc();
  if (tipoDado === "outro") {
    tipoDado =
      document.getElementById("tipo_custom").value.trim() || "semMedida";
  }

  const containerRes = document.querySelector(".container-calculos-resultados");
  containerRes.replaceChildren();

  // FAC anterior à classe da mediana (para tooltip)
  let facAntM = 0;
  for (let i = 0; i < medianaIdx; i++) facAntM += classesData[i].fi;

  const resultMap = {
    media: {
      label: "Média",
      valor: media,
      tipo: tipoDado,
      pot: 1,
      detail: `x̄ = Σ(fi·PMi)/n = ${fmtD(somaFiPmi)}/${n}`,
    },
    modaBruta: {
      label: "Moda Bruta",
      valor: modaBruta,
      tipo: tipoDado,
      pot: 1,
      detail: `PMi da classe [${fmt(cModal.li)} ⊢ ${fmt(cModal.ls)}[`,
    },
    modaCzuber: {
      label: "Moda de Czuber",
      valor: modaCzuber,
      tipo: tipoDado,
      pot: 1,
      detail: `Lmo + h·d₁/(d₁+d₂) | d₁=${d1} | d₂=${d2}`,
    },
    mediana: {
      label: "Mediana",
      valor: mediana,
      tipo: tipoDado,
      pot: 1,
      detail: `L_Me + h·(n/2−FAC_ant)/fi_Me | L_Me=${fmt(classesData[medianaIdx]?.li)} | FAC_ant=${facAntM}`,
    },
    variancia: {
      label: "Variância",
      valor: variancia,
      tipo: tipoDado,
      pot: 2,
      detail: `s² = Σfi(PMi−x̄)²/(n−1) = ${fmtD(somaFiDevQ)}/${n - 1}`,
    },
    desvioPadrao: {
      label: "Desvio Padrão",
      valor: desvioPadrao,
      tipo: tipoDado,
      pot: 1,
      detail: `s = √s² = √${fmtD(variancia)}`,
    },
    coeficienteVariacao: {
      label: "Coeficiente de Variação",
      valor: null, // tratamento especial
      tipo: tipoDado,
      pot: 1,
      detail: `CV = (s/x̄)·100 = (${fmtD(desvioPadrao)}/${fmtD(media)})·100`,
    },
  };

  const ordemExibicao = [
    "media",
    "modaBruta",
    "modaCzuber",
    "mediana",
    "variancia",
    "desvioPadrao",
    "coeficienteVariacao",
  ];
  const selecionadas = ordemExibicao.filter((r) => escolhasCalculo.includes(r));

  selecionadas.forEach((escolha) => {
    const def = resultMap[escolha];
    if (!def) return;

    const div = document.createElement("div");
    div.className = "calculos-resultados";

    const h3 = document.createElement("h3");
    h3.textContent = def.label;

    const p = document.createElement("p");
    if (escolha === "coeficienteVariacao") {
      p.textContent = isFinite(cvPct)
        ? cvPct.toFixed(2) + "%"
        : "∞ (média = 0)";
    } else {
      p.textContent = aplicarUnidade(def.valor, def.tipo, def.pot);
    }
    p.title = def.detail;

    div.appendChild(h3);
    div.appendChild(p);
    containerRes.appendChild(div);
  });

  // ─── Tabela de distribuição completa ──────────────────────────────────────
  gerarTabelaDistribuicao(
    n,
    media,
    h,
    modalIdx,
    medianaIdx,
    somaFiPmi,
    somaFiDevQ,
    variancia,
    desvioPadrao,
    cvPct,
    modaBruta,
    modaCzuber,
    mediana,
    d1,
    d2,
    cModal,
    facAntM,
  );

  // destacarClassesEspeciais();
  if (distNormalAtiva == true) {
    setMostrarResultados(false);
  } else {
    setDadosDistNormF(false);
    setMostrarResultados(true);
  }
}

// ─── Tabela de Distribuição de Frequências ────────────────────────────────────
function gerarTabelaDistribuicao(
  n,
  media,
  h,
  modalIdx,
  medianaIdx,
  somaFiPmi,
  somaFiDevQ,
  variancia,
  desvioPadrao,
  cvPct,
  modaBruta,
  modaCzuber,
  mediana,
  d1,
  d2,
  cModal,
  facAntM,
) {
  const container = document.getElementById("containerTabelaDistribuicao");
  container.innerHTML = "";

  // ── Cabeçalho
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  const h3 = document.createElement("h3");
  h3.textContent = "Tabela de Distribuição";
  const div = document.createElement("div");
  div.className = "calculos-resultados";

  // - Descrição Tabela
  const div2 = document.createElement("div");
  div2.style =
    "margin-top: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: flex-end;";

  const divModa = document.createElement("div");
  divModa.style = "width: 20px; height: 20px; background-color: #fff3cd;";
  const pMo = document.createElement("p");
  pMo.style = "margin: 8px 15px 8px 8px;";
  pMo.innerHTML = "Moda";
  div2.appendChild(divModa);
  div2.appendChild(pMo);

  const divMediana = document.createElement("div");
  divMediana.style = "width: 20px; height: 20px; background-color: #cce5ff;";
  const pMe = document.createElement("p");
  pMe.style = "margin: 8px 15px 8px 8px;";
  pMe.innerHTML = "Mediana";
  div2.appendChild(divMediana);
  div2.appendChild(pMe);

  const divModaMediana = document.createElement("div");
  divModaMediana.style =
    "width: 20px; height: 20px; background-color: #d4edda;";
  const pMM = document.createElement("p");
  pMM.style = "margin: 8px 15px 8px 8px;";
  pMM.innerHTML = "Moda e Mediana";
  div2.appendChild(divModaMediana);
  div2.appendChild(pMM);

  // - Criação da Tabela
  trHead.style.cssText = "background:white;color:black;";
  const colunas = [
    { label: "Classes", title: "Intervalo de classe [Li - Ls]" },
    { label: "FI", title: "Frequência Individual Absoluta" },
    { label: "FAC", title: "Frequência Acumulada Absoluta" },
    { label: "FRI (%)", title: "Frequência Relativa Individual" },
    { label: "FRAC (%)", title: "Frequência Relativa Acumulada" },
    { label: "PMi", title: "Ponto Médio do Intervalo" },
    { label: "FI · PMi", title: "Produto usado na média" },
    { label: "FI · (PMi − x̄)²", title: "Produto usado na variância" },
  ];
  colunas.forEach(({ label, title }) => {
    const th = document.createElement("th");
    th.textContent = label;
    th.title = title;
    th.style.cssText = "padding:12px 14px;white-space:nowrap;font-weight:700;";
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  // ── Corpo
  const tbody = document.createElement("tbody");
  let facAcum = 0;
  let fracAcum = 0;

  classesData.forEach((c, i) => {
    facAcum += c.fi;
    const fri = n > 0 ? (c.fi / n) * 100 : 0;
    fracAcum += fri;
    const fiPmi = c.fi * c.pmi;
    const fiDevQ = c.fi * Math.pow(c.pmi - media, 2);

    const tr = document.createElement("tr");

    const isModal = i === modalIdx;
    const isMediana = i === medianaIdx;

    if (isModal && isMediana) tr.style.backgroundColor = "#d4edda";
    else if (isModal) tr.style.backgroundColor = "#fff3cd";
    else if (isMediana) tr.style.backgroundColor = "#cce5ff";
    else tr.style.backgroundColor = i % 2 === 0 ? "#f8f9fa" : "#fff";

    if (isModal || isMediana) tr.style.fontWeight = "600";

    [
      `[${fmt(c.li)} - ${fmt(c.ls)}]`,
      c.fi,
      facAcum,
      fri.toFixed(2) + "%",
      fracAcum.toFixed(2) + "%",
      fmt(c.pmi),
      fmtD(fiPmi),
      fmtD(fiDevQ),
    ].forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      td.style.padding = "9px 12px";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  // Linha de totais
  const trTot = document.createElement("tr");
  trTot.style.cssText = "background:white;color:black;font-weight:bold;";
  [
    "Σ Total",
    n,
    "—",
    "100,00%",
    "100,00%",
    "—",
    fmtD(somaFiPmi),
    fmtD(somaFiDevQ),
  ].forEach((v) => {
    const td = document.createElement("td");
    td.textContent = v;
    td.style.padding = "10px 12px";
    trTot.appendChild(td);
  });
  tbody.appendChild(trTot);

  table.appendChild(tbody);
  div.appendChild(h3);
  div.appendChild(table);
  div.appendChild(div2);
  container.appendChild(div);
}

// Agrupamento em Classes pela Distribuição Normal
let btnNormalClasses = document.getElementById("btnNormalClasses");
btnNormalClasses.addEventListener("click", (e) => {
  e.preventDefault();
  setDistNormalAtiva(true);
  document.getElementById("container_modal_vac").classList.remove("show");
  document.getElementById("formClassesPNormal").style.display = "contents";
});

let formClassesPNormal = document.getElementById("formClassesPNormal");
formClassesPNormal.addEventListener("submit", (e) => {
  e.preventDefault();
  setMostrarResultados(false);
  if (distNormalAtiva == true) {
    calcularClasses();
    console.log(dadosClasses);
  }

  if (Object.keys(dadosClasses).length == 0) {
    setDadosDistNormF(false);
  } else {
    setDadosDistNormF(true);

    const container = document.getElementById("containerTabelaDistribuicao");
    container.innerHTML = "";

    setDistNormalAtiva(false);
    document.getElementById("formClassesPNormal").style.display = "none";
    document.getElementById("container_modal_classes").classList.remove("show");
    document.getElementById("container_modal_vac").classList.add("show");
    document.getElementById("secaoDNormal").style.display = "flex";
    document.getElementById("secaoDNormal_Final").style.display = "flex";

    function btnValueAClick(value) {
      const inputValorANormFinal = document.getElementById(
        "inputValorANormFinal",
      );
      inputValorANormFinal.value = value;
    }

    function btnValueBClick(value) {
      const inputDuasVariaveisNormF = document.getElementById(
        "inputDuasVariaveisNormF",
      );
      inputDuasVariaveisNormF.value = value;
    }

    if (Object.keys(dadosClasses).length > 0) {
      dadosCalculadosNormal.replaceChildren();

      const div2 = document.createElement("div");
      div2.style =
        "display: grid; grid-template-columns: repeat(1, 1fr); gap: 10px; justify-items: end;";

      const h3 = document.createElement("h3");
      h3.textContent = "📊 Dados Calculados";
      dadosCalculadosNormal.appendChild(h3);

      const p = document.createElement("p");
      p.textContent = "Usar como valor de: ";
      p.style = "margin: 0";
      div2.appendChild(p);

      for (const [key, value] of Object.entries(dadosClasses)) {
        if (
          key != "TamAmostra" &&
          key != "Variancia" &&
          key != "CoefVariacao"
        ) {
          const div = document.createElement("div");

          let text;
          const strong = document.createElement("strong");
          if (key == "Media") {
            text = "Média";
          } else if (key == "ModaBruta") {
            text = "Moda Bruta";
          } else if (key == "ModaCzuber") {
            text = "Moda Czuber";
          } else if (key == "DesvioPadrao") {
            text = "Desvio Padrão";
          } else {
            text = key;
          }
          strong.textContent = text + ": ";

          div.appendChild(strong);
          div.append(value);

          const buttonA = document.createElement("button");
          buttonA.className = "btnValueDistNorm";
          buttonA.innerHTML = "A";

          buttonA.addEventListener("click", () => {
            btnValueAClick(value);
          });

          const buttonB = document.createElement("button");
          buttonB.className = "btnValueBDistNorm";
          buttonB.innerHTML = "B";

          buttonB.addEventListener("click", () => {
            btnValueBClick(value);
          });

          div.appendChild(buttonA);
          div.appendChild(buttonB);

          div2.appendChild(div);

          dadosCalculadosNormal.appendChild(div2);
        }
      }
    }
  }
});

const fecharModalClasses = document.querySelector(
  ".botao-fechar-modal-classes",
);
fecharModalClasses.addEventListener("click", (e) => {
  e.preventDefault();
  setDistNormalAtiva(false);
  console.log("Entrou");
  document.getElementById("formClassesPNormal").style.display = "none";
});
