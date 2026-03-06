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

formDistExponencial.addEventListener("submit", (e) => {
  e.preventDefault();
  let valorA = +inputValorA.value.trim();
  let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();

  if (escolhaTipoIntervalo != "") {
    const p = document.createElement("p");
    if (escolhaTipoIntervalo == "maiorQueExpo") {
      p.innerHTML = "X > " + valorA;
    }
    // Outros intervalos aqui, estão no index.html linha 453
    mostrarConta.appendChild(p);
  }
});
