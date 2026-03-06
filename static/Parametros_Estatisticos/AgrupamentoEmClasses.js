import {
  dadosClasses,
  escolhaCalculosFunc,
  escolhaTipoDadoFunc,
  setMostrarResultados,
} from "../state.js";

const formDadosClasses = document.getElementById("formDadosClasses");
const inputLiClasses = document.getElementById("inputLiClasses");
const inputAmplitudeClasses = document.getElementById("inputAmplitudeClasses");
const inputQtdClasses = document.getElementById("inputQtdClasses");

const btnAlterarFIClasses = document.getElementById("alterarFIClasses");

formDadosClasses.addEventListener("submit", (e) => {
  e.preventDefault();
});

const tbodyClasses = document.getElementById("tbodyClasses");
