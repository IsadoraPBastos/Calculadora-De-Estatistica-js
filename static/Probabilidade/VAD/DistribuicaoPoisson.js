import {
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
} from "../../state.js";

const formDistPoisson = document.getElementById("formDistPoisson");
const inputVMedia = document.getElementById("inputVMedia");
const inputValorA = document.getElementById("inputValorAPoi");
const inputValorB = document.getElementById("inputDuasVariaveisPois");
const mostrarConta = document.getElementById("mostrarContaPois");

formDistPoisson.addEventListener("submit", (e) => {
  e.preventDefault();
  let valorA = +inputValorA.value.trim();
  let escolhaTipoIntervalo = escolhaTipoIntervaloFunc();

  if (escolhaTipoIntervalo != "") {
    const p = document.createElement("p");
    if (escolhaTipoIntervalo == "maiorQuePoi") {
      p.innerHTML = "X > " + valorA;
    }
    // Outros intervalos aqui, estão no index.html linha 899
    mostrarConta.appendChild(p);
  }
});
