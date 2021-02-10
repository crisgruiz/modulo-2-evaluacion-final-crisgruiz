"use strict";
const inputElement = document.querySelector(".js-input");
const btnSearch = document.querySelector(".js-searchBtn");
const listElement = document.querySelector(".js-list");
const favElement = document.querySelector(".js-favContainer");
const btnReset = document.querySelector(".js-resetBtn");
const btnClean = document.querySelector(".js-favClean");

const searchPrevent = document.querySelector(".js-form");
function handleForm(ev) {
  ev.preventDefault();
}
searchPrevent.addEventListener("submit", handleForm);

let shows = [];
let favorites = [];

//Llamada al API
function handleGetToApi() {
  const inputValue = inputElement.value.toLowerCase();
  fetch(`https://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      shows = data.map((data) => data.show);
      paintSeries();
    });
}
//Botón buscar

btnSearch.addEventListener("click", handleGetToApi);

//Función que muestra las series cuando le damos a buscar
function paintSeries() {
  let htmlCode = "";
  for (const show of shows) {
    //Creamos una variable vacía y la igualamos a la función que llama la imagen
    let showImage = getImageShow(show);
    if (isValidSerie(show)) {
      let isFavoriteClass;
      if (findIdInArrayOfObjets(show.id, favorites)) {
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

//Función que comprueba que lo introducido existe en los valores dados por el API
function isValidSerie(show) {
  const inputValue = inputElement.value.toLowerCase();
  return show.name.toLowerCase().includes(inputValue);
}

//Busca un id dentro del objeto de un array (Para ver si show.id se encuentra en favorites)
function findIdInArrayOfObjets(id, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return true;
    }
  }
}
//Función que nos permite llamar a la imagen
function getImageShow(series) {
  if (series.image === null) {
    return `https://via.placeholder.com/210x295/ffffff/666666/?text=${series.name}`;
  } else {
    return series.image.medium;
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
  } else {
    favorites.push(shows[indexShow]);
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
    let favoriteImage = getImageShow(favorite);
    htmlCodeFav += `<li class="favSerie-list js-favSeries" id="${favorite.id}">`;
    htmlCodeFav += `<img class="favSerie-list__clean js-favClean" src="./assets/images/clean.png" alt="Clean selection"/>`;
    htmlCodeFav += `<h3 class="favSerie-list__title js-favSerieTitle">${favorite.name}</h3>`;
    htmlCodeFav += `<img class="favSerie-list__img js-favSerieImg" src="${favoriteImage}" class="">`;
    htmlCodeFav += `</li>`;
  }
  htmlCodeFav += `</ul>`;
  favElement.innerHTML = htmlCodeFav;
}

//LocalStorage

function setInLocalStorage() {
  const stringFavorites = JSON.stringify(favorites);
  localStorage.setItem("favorites", stringFavorites);
}
function getFromLocalStorage() {
  const localStorageFavorites = localStorage.getItem("favorites");
  if (localStorageFavorites !== null) {
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favorites = arrayFavorites;
    paintFavorites();
  }
}
getFromLocalStorage();

//Botón reset - eliminar toda la lista de favoritos

function resetAllFavoriteList() {
  favorites = [];

  paintSeries();
  paintFavorites();
  setInLocalStorage();
}

btnReset.addEventListener("click", resetAllFavoriteList);

//Botón reset - eliminar individualmente los favoritos de la lista

function resetEachFavorite() {}

btnClean.addEventListener("click", resetEachFavorite);
