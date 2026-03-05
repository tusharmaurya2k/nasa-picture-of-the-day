const API_KEY = "frK0yE2jVnIx08Y1hHj75nLKY8mJgNPwGdHT2FYH";

const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const imageContainer = document.getElementById("current-image-container");
const historyList = document.getElementById("search-history");

document.addEventListener("DOMContentLoaded", () => {
    getCurrentImageOfTheDay();
    addSearchToHistory();
});

form.addEventListener("submit", function(e){
    e.preventDefault();

    const selectedDate = searchInput.value;

    if(!selectedDate) return;

    getImageOfTheDay(selectedDate);
});

async function getCurrentImageOfTheDay(){

    const currentDate = new Date().toISOString().split("T")[0];

    try{

        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`);

        const data = await response.json();

        displayImage(data);

    }
    catch(error){

        showError();

    }

}

async function getImageOfTheDay(date){

    try{

        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`);

        const data = await response.json();

        displayImage(data);

        saveSearch(date);

        addSearchToHistory();

    }
    catch(error){

        showError();

    }

}

function displayImage(data){

    const mediaElement =
        data.media_type === "image"
        ? `<img src="${data.url}" alt="${data.title}">`
        : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;

    imageContainer.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.date}</p>
        ${mediaElement}
        <p>${data.explanation}</p>
    `;

}

function saveSearch(date){

    let searches = JSON.parse(localStorage.getItem("searches")) || [];

    if(!searches.includes(date)){
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }

}

function addSearchToHistory(){

    historyList.innerHTML = "";

    const searches = JSON.parse(localStorage.getItem("searches")) || [];

    searches.forEach((date) => {

        const li = document.createElement("li");

        li.textContent = date;

        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            getImageOfTheDay(date);
        });

        historyList.appendChild(li);

    });

}

function showError(){

    imageContainer.innerHTML = `<p>Failed to load NASA image. Please try again.</p>`;

}