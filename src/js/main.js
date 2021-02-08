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
    console.log(show.name, show.image);
    if (show.name.toLowerCase().includes(inputValue)) {
      htmlCode += `<li class="serie-card">`;
      htmlCode += `<img class="img" src="${show.image}" class="serie-img-js">`;
      htmlCode += `<h3 class="serie-name-js">${show.name}</h3>`;
      htmlCode += `</li>`;
    }
  }
  listElement.innerHTML = htmlCode;
}

btnElement.addEventListener("click", handleGetToApi);
