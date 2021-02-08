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
  const inputValue = inputElement.value.toLowerCase();
  for (const show of shows) {
    console.log(show);
    const showName = show.name.toLowerCase();

    //Creamos una variable vacía y con la condición le damos valor
    let showImage = "";
    if (show.image) {
      showImage = show.image.medium;
    } else {
      showImage = `https://via.placeholder.com/210x295/ffffff/666666/?text=${show.name}`;
    }
    if (showName.includes(inputValue)) {
      htmlCode += `<li class="previewSerie">`;
      htmlCode += `<h3 class="previewSerie__title js-serieTitle">${show.name}</h3>`;
      htmlCode += `<img class="previewSerie js-serieImg" src="${showImage}" class="">`;

      htmlCode += `</li>`;
    }
  }
  listElement.innerHTML = htmlCode;
}

btnElement.addEventListener("click", handleGetToApi);
