const genreContainer = document.querySelector("#genre-container");
const platformContainer = document.querySelector("#platform-container");
let selectedGenres = [];

const gameGenres = [
    "MMORPG", "Shooter", "Strategy", "MOBA", "Racing", "Sports", "Social", "Sandbox",
    "Open-world", "Survival", "PvP", "PvE", "Pixel", "Voxel", "Zombie", "Turn-based",
    "First-person", "Third-person", "Top-down", "Tank", "Space", "Sailing", "Side-scroller",
    "Superhero", "Permadeath", "Card", "Battle-royale", "MMO", "MMOFPS", "MMOTPS", "3D", "2D",
    "Anime", "Fantasy", "Sci-fi", "Fighting", "Action-RPG", "Action", "Military", "Martial-arts",
    "Flight", "Low-spec", "Tower-defense", "Horror", "MMORTS"
  ];

const platforms = ["All", "PC", "Browser"];
  

genreContainer.addEventListener("change", (e) => {
    selectedGenres.toggleElem(e.target.value);
    console.log(selectedGenres)
})


//For science!
Array.prototype.toggleElem = function(input) {
    this.includes(input) ? this.splice(this.indexOf(input), 1) : this.push(input);
}

function renderSite(data) {
    generateOptions(gameGenres, genreContainer);
    generateOptions(platforms, platformContainer);
    // generateCard(data);
    console.log(data);
}


function generateOptions(arr, parent) {
    arr.forEach(e => {
        const itemInput = document.createElement("input");
        const itemLabel = document.createElement("label");
        const itemLowerCase = e.toLowerCase();

        itemInput.type = "checkbox";
        itemInput.id = itemLowerCase;
        itemInput.value = itemLowerCase;

        itemLabel.setAttribute("for", itemLowerCase);
        itemLabel.textContent = e;

        parent.append(itemInput, itemLabel);
    });
}

// function generateCard(data) {
//     const cardContainer = document.createElement("div");


// }

const cardContainer = document.querySelector(".card-container")
cardContainer.addEventListener("click", function() {
    this.classList.toggle("active");
    const content = document.querySelector(".card-expand-content")
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
})





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
