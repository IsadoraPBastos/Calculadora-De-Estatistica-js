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
const btnNormalAmostral = document.getElementById("btnNormalAmostral");
const btnNormalFinal = document.getElementById("btnNormalFinal");
const dadosCalculadosNormal = document.getElementById("dadosCalculadosNormal");


// btnNormalDiscreto.addEventListener("click", (e) => {
//   e.preventDefault();
//   setDistNormalAtiva(true);
// });
