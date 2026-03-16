import { setModoCalculo } from "./state.js";

document
  .querySelector(".container-card-discreto")
  .addEventListener("click", () => {
    setModoCalculo("Discreto");
  });

document
  .querySelector(".container-card-classes")
  .addEventListener("click", () => {
    setModoCalculo("Classes");
  });

document
  .getElementById("btn-escolha-uniforme")
  .addEventListener("click", () => {
    setModoCalculo("Uniforme");
  });

document
  .getElementById("btn-escolha-exponencial")
  .addEventListener("click", () => {
    setModoCalculo("Exponencial");
  });

document.getElementById("btn-escolha-normal").addEventListener("click", () => {
  setModoCalculo("Normal");
});

document.getElementById("btn-escolha-poisson").addEventListener("click", () => {
  setModoCalculo("Poisson");
});

document
  .getElementById("btn-escolha-binomial")
  .addEventListener("click", () => {
    setModoCalculo("Binomial");
  });

document.querySelector(".container-card-eq1").addEventListener("click", () => {
  setModoCalculo("Equacao1Grau");
});
