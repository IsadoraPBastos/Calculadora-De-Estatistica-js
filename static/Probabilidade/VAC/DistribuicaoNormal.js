import {
  distNormalDados,
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
  escolhaTipoIntervaloFunc,
  setDistNormalAtiva,
} from "../../state.js";

const btnNormalDiscreto = document.getElementById("btnNormalDiscreto");
const btnNormalClasses = document.getElementById("btnNormalClasses");
const btnNormalFinal = document.getElementById("btnNormalFinal");
const dadosCalculadosNormal = document.getElementById("dadosCalculadosNormal");
const formDistNormalAmostral = document.getElementById("formDistNormal");
const formDistNormalFinal = document.getElementById("formDistNormalFinal");

const inputValorANorm = document.getElementById("inputValorANorm");
const inputDuasVariaveisNorm = document.getElementById(
  "inputDuasVariaveisNorm",
);
const mediaNorm = document.getElementById("mediaNorm");
const desvioPadraoNorm = document.getElementById("desvioPadraoNorm");
const tamanhoAmostraNorm = document.getElementById("tamanhoAmostraNorm");

btnNormalDiscreto.addEventListener("click", (e) => {
  e.preventDefault();
  setDistNormalAtiva(true);
});

btnNormalClasses.addEventListener("click", (e) => {
  e.preventDefault();
  setDistNormalAtiva(true);
});

// Linha 522 do index.html
formDistNormalAmostral.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipoIntervalo = escolhaTipoIntervaloFunc();
  let valorA = inputValorANorm.value.trim();
  console.log(tipoIntervalo);
});

const inputValorANormFinal = document.getElementById("inputValorANormFinal");

formDistNormalFinal.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipoIntervalo = escolhaTipoIntervaloFunc();
  console.log(tipoIntervalo);
  console.log(inputValorANormFinal.value);
});
