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
      setInLocalStorage();
    });
}
function paintSeries() {
  let htmlCode = "";
  for (const show of shows) {
    //Creamos una variable vacía y la igualamos a la función que llama la imagen
    let showImage = GetImagesDefault(show);
    if (isValidSerie(show)) {
      let isFavoriteClass;
      if (show.favorite) {
        isFavoriteClass = "fav";
      } else {
        isFavoriteClass = " ";
      }
      htmlCode += `<li class="previewSerie js-series ${isFavoriteClass}" id="${show.id}">`;
      htmlCode += `<h3 class="previewSerie__title js-serieTitle">${show.name}</h3>`;
      htmlCode += `<img class="previewSerie__img js-serieImg" src="${showImage}" class="">`;
      htmlCode += `</li>`;
    }
  }
  listElement.innerHTML = htmlCode;
  listenSeriesEvent();
}

function isValidSerie(show) {
  const inputValue = inputElement.value.toLowerCase();
  return show.name.toLowerCase().includes(inputValue);
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

// listen fav series events

function listenSeriesEvent() {
  const serieElements = document.querySelectorAll(".js-series");
  for (const serieElement of serieElements) {
    serieElement.addEventListener("click", handleFavorite);
  }
}

//Función que añade lo seleccionado al array Favorites
function handleFavorite(ev) {
  const showClickedId = parseInt(ev.currentTarget.id);
  const indexFav = favorites.findIndex((show) => {
    return show.id === showClickedId;
  });
  const indexShow = shows.findIndex((show) => {
    return show.id === showClickedId;
  });

  if (indexFav !== -1) {
    favorites.splice(indexFav, 1);
    shows[indexShow].favorite = false;
  } else {
    favorites.push(shows[indexShow]);
    shows[indexShow].favorite = true;
  }
  paintFavorites();
  paintSeries();
  setInLocalStorage();
}

// Pintar favoritos

function paintFavorites() {
  let htmlCodeFav = "";
  htmlCodeFav += `<ul class = "favSerie">`;
  for (const favorite of favorites) {
    let favoriteImage = GetImagesFav(favorite);
    htmlCodeFav += `<li class="favSerie-list js-favSeries" id="${favorite.id}">`;
    htmlCodeFav += `<h3 class="favSerie-list__title js-favSerieTitle">${favorite.name}</h3>`;
    htmlCodeFav += `<img class="favSerie-list__img js-favSerieImg" src="${favoriteImage}" class="">`;
    htmlCodeFav += `</li>`;
  }
  htmlCodeFav += `</ul>`;
  favElement.innerHTML = htmlCodeFav;
}
btnElement.addEventListener("click", handleGetToApi);

//LocalStorage

function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem("favorites", stringFavorites);
}
function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem("favorites");
  if (localStorageFavorites === null) {
    handleGetToApi();
  } else {
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    paintFavorites();
  }
}
getFromLocalStorage();
