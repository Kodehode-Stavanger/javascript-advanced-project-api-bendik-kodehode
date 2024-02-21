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
}

renderSite();

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






async function getData() {
    try {
        const result = await fetch("https://www.freetogame.com/api/games");
        const data = await result.json();
        renderSite(data);
    } catch (error) {
        console.log(error);
    }
}

// getData();
