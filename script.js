const categoriesContainer = document.querySelector("#categories-container");
let selectedCategories = [];

categoriesContainer.addEventListener("change", (e) => {
    selectedCategories.toggleElem(e.target.value);
})


Array.prototype.toggleElem = function(input) {
    this.includes(input) ? this.splice(this.indexOf(input), 1) : this.push(input);
}



async function getData() {
    try {
        const result = await fetch("https://www.freetogame.com/api/games");
        const data = await result.json();
        renderSite(data);
    } catch (error) {
        console.log(error);
    }
}

getData();

function renderSite(data) {
    console.log(data)
}

function renderCards() {
    const itemContainer = document.createElement("div");

}

function generateCheckboxOptions(data) {

}