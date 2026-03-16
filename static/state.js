export let dados = [];
export let tabelaRecebida = {};
export let FreqIndAbs = {};
export let tabelaDeDados = {};
export let dadosClasses = {};
export let distNormalAtiva = false;
export let distNormalDados = {};
export let mostrarResultados = false;
export let modoCalculo = null;

export function escolhaCalculosFunc() {
  return [
    ...document.querySelectorAll('input[name="escolha-calculo"]:checked'),
  ].map((el) => el.value);
}

export function escolhaTipoDadoFunc() {
  const selecionado = document.querySelector('input[name="tipo"]:checked');
  return selecionado ? selecionado.value : null;
}

export function setMostrarResultados(valor) {
  mostrarResultados = valor;

  const containerResultados = document.querySelector(
    ".container-estatisticas-dos-dados",
  );
  if (mostrarResultados == true) {
    containerResultados.style.display = "block";
    containerResultados.scrollIntoView({ behavior: "smooth" });
  } else {
    containerResultados.style.display = "none";
  }
}

export function escolhaTipoIntervaloFunc() {
  let selecionado = "";
  if (modoCalculo == "Uniforme") {
    selecionado = document.querySelector('input[name="intervaloUni"]:checked');
  } else if (modoCalculo == "Exponencial") {
    selecionado = document.querySelector('input[name="intervaloExpo"]:checked');
  } else if (modoCalculo == "Binomial") {
    selecionado = document.querySelector('input[name="intervaloBin"]:checked');
  } else if (modoCalculo == "Poisson") {
    selecionado = document.querySelector('input[name="intervaloPoi"]:checked');
  }
  // else if (modoCalculo == "Normal") {
  //   selecionado = document.querySelector('input[name="intervaloNorm"]:checked');
  // }

  return selecionado ? selecionado.value : null;
}

export function setDistNormalAtiva(valor) {
  distNormalAtiva = valor;
}

export function setModoCalculo(valor) {
  modoCalculo = valor;
  console.log(modoCalculo);
}

if (distNormalAtiva == false) {
  document.getElementById("formDesordenadoPNormal").style.display = "none";
}
