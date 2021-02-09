"use strict";
const inputElement = document.querySelector(".js-input");
const btnElement = document.querySelector(".js-searchBtn");
const listElement = document.querySelector(".js-list");
const favElement = document.querySelector(".js-favContainer");

let shows = [];
let favorites = [];

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
  const inputValue = inputElement.value.toLowerCase();

  for (const show of shows) {
    const showName = show.name.toLowerCase();

    //Creamos una variable vacía y la igualamos a la función que llama la imagen
    let showImage = GetImagesDefault(show);

    if (showName.includes(inputValue)) {
      htmlCode += `<li class="previewSerie js-series" id="${show.id}">`;
      htmlCode += `<h3 class="previewSerie__title js-serieTitle">${show.name}</h3>`;
      htmlCode += `<img class="previewSerie__img js-serieImg" src="${showImage}" class="">`;
      htmlCode += `</li>`;
    }
  }
  listElement.innerHTML = htmlCode;
  listenSeriesEvent();
  // paintFavorites();
}

//Función que nos permite llamar a la imagen
function GetImagesDefault(show) {
  if (show.image) {
    return show.image.medium;
  } else {
    return `https://via.placeholder.com/210x295/ffffff/666666/?text=${show.name}`;
  }
}
function GetImagesFav(favorite) {
  if (favorite.image) {
    return favorite.image.medium;
  } else {
    return `https://via.placeholder.com/210x295/ffffff/666666/?text=${favorite.name}`;
  }
}

//Selección de favoritos

function listenSeriesEvent() {
  const serieElements = document.querySelectorAll(".js-series");
  for (const serieElement of serieElements) {
    serieElement.addEventListener("click", handleFavorite);
  }
}

//Función que añade lo seleccionado al array Favorites

function handleFavorite(ev) {
  const click = parseInt(ev.currentTarget.id);
  const indexFav = favorites.findIndex(function listenSeriesEvent(show) {
    return show.id === click;
  });
  const isFavorite = indexFav !== -1;
  if (isFavorite === true) {
    favorites.splice(indexFav, 1);
  } else {
    for (let i = 0; i < shows.length; i++) {
      if (shows[i].id === click) {
        favorites.push(shows[i]);
      }
    }
  }
  paintFavorites();
}

//Pintar favoritos

function paintFavorites() {
  let htmlCode = "";
  htmlCode += `<ul class = "favSerie">`;
  for (const favorite of favorites) {
    let favoriteImage = GetImagesFav(favorite);
    console.log("me están pintando");
    htmlCode += `<li class="favSerie-list js-favSeries" id="${favorite.id}">`;
    htmlCode += `<h3 class="favSerie-list__title js-favSerieTitle">${favorite.name}</h3>`;
    htmlCode += `<img class="favSerie-list__img js-favSerieImg" src="${favoriteImage}" class="">`;
    htmlCode += `</li>`;
  }
  htmlCode += `</ul>`;
  favElement.innerHTML = htmlCode;
}

btnElement.addEventListener("click", handleGetToApi);
