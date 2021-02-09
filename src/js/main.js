"use strict";
const inputElement = document.querySelector(".js-input");
const btnElement = document.querySelector(".js-searchBtn");
const listElement = document.querySelector(".js-list");

let shows = [];

function handleGetToApi() {
  const inputValue = inputElement.value.toLowerCase();
  fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      shows = data.map((data) => data.show);
      paintSeries();
    });
}
function paintSeries() {
  let htmlCode = "";
  // const inputValue = inputElement.value.toLowerCase();

  for (const show of shows) {
    const showName = show.name.toLowerCase();

    //Creamos una variable vacía y la igualamos a la función que llama la imagen
    let showImage = GetImagesDefault(show);

    // if (showName.includes(inputValue)) {
    htmlCode += `<li class="previewSerie js-series">`;
    htmlCode += `<h3 class="previewSerie__title js-serieTitle">${show.name}</h3>`;
    htmlCode += `<img class="previewSerie__img js-serieImg" src="${showImage}" class="">`;
    htmlCode += `</li>`;
    // }
  }
  listElement.innerHTML = htmlCode;
  listenSeriesEvent();
}

//Función que nos permite llamar a la imagen
function GetImagesDefault(show) {
  if (show.image) {
    return show.image.medium;
  } else {
    return `https://via.placeholder.com/210x295/ffffff/666666/?text=${show.name}`;
  }
}

//Selección de favoritos

function listenSeriesEvent() {
  const serieElements = document.querySelectorAll(".js-series");
  for (const serieElement of serieElements) {
    serieElement.addEventListener("click", handleFavorite);
  }
}

function handleFavorite() {
  console.log("Me han seleccionado");
}

btnElement.addEventListener("click", handleGetToApi);
