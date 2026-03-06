import {
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
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

formDistBinomial.addEventListener("submit", (e) => {
  e.preventDefault();
  let valorA = +inputValorA.value.trim();
  let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();

  if (escolhaTipoIntervalo != "") {
    const p = document.createElement("p");
    if (escolhaTipoIntervalo == "maiorQueBin") {
      p.innerHTML = "X > " + valorA;
    }
    // Outros intervalos aqui, estão no index.html linha 800
    mostrarConta.appendChild(p);
  }
});
