import {
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
} from "../../state.js";

const formDistUniforme = document.getElementById("formDistUniforme");
const inputLimiteInferior = document.getElementById("inputLimiteInferior");
const inputLimiteSuperior = document.getElementById("inputLimiteSuperior");
const inputValorCUnif = document.getElementById("inputValorCUnif");
const inputValorDUnif = document.getElementById("inputDuasVariaveisUni");
const mostrarConta = document.getElementById("mostrarContaUni");

formDistUniforme.addEventListener("submit", (e) => {
  e.preventDefault();
  let valorCUnif = +inputValorCUnif.value.trim();
  let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();

  if (escolhaTipoIntervalo != "") {
    const p = document.createElement("p");
    if (escolhaTipoIntervalo == "maiorQueUni") {
      p.innerHTML = "X > " + valorCUnif;
    }
    // Outros intervalos aqui, estão no index.html linha 355
    mostrarConta.appendChild(p);
  }
});
