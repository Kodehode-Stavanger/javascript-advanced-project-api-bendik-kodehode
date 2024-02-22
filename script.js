const genreContainer = document.querySelector("#genre-container");
const platformContainer = document.querySelector("#platform-container");
const mainContent = document.querySelector("#main-content");

apiMainURL = "https://www.freetogame.com/api/games"
apiFilterURL = "https://www.freetogame.com/api/filter"

const gameGenres = [
    "MMORPG", "Shooter", "Strategy", "MOBA", "Racing", "Sports", "Social", "Sandbox",
    "Open-world", "Survival", "PvP", "PvE", "Pixel", "Voxel", "Zombie", "Turn-based",
    "First-person", "Third-person", "Top-down", "Tank", "Space", "Sailing", "Side-scroller",
    "Superhero", "Permadeath", "Card", "Battle-royale", "MMO", "MMOFPS", "MMOTPS", "3D", "2D",
    "Anime", "Fantasy", "Sci-fi", "Fighting", "Action-RPG", "Action", "Military", "Martial-arts",
    "Flight", "Low-spec", "Tower-defense", "Horror", "MMORTS"
  ];

const platforms = ["All", "PC", "Browser"];
  
let selectedGenres = [];
let selectedPlatform = "";

genreContainer.addEventListener("change", (e) => {
    selectedGenres.toggleElem(e.target.value);
    console.log(selectedGenres)
})

platformContainer.addEventListener("change", (e) => {
    selectedPlatform = e.target.value;
    console.log("selected: ", selectedPlatform)
})

//For science!
Array.prototype.toggleElem = function(input) {
    this.includes(input) ? this.splice(this.indexOf(input), 1) : this.push(input);
}

async function getData(url) {
    try {
        const result = await fetch("https://www.freetogame.com/api/games");
        const data = await result.json();
        console.log("Fetched");
        renderContent(data);
    } catch (error) {
        console.log(error);
    }
}

getData();

function renderContent(data) {
    generateCard(data);
    console.log(data);
    console.log(typeof(data))
}


function generateOptions(arr, parent, type) {
    arr.forEach((e) => {
            const itemInput = document.createElement("input");
            const itemLabel = document.createElement("label");
            const itemLowerCase = e.toLowerCase();

            itemInput.type = type;
            itemInput.id = itemLowerCase;
            itemInput.value = itemLowerCase;

            if (type === "radio") {
                itemInput.name = type
            }

            itemLabel.setAttribute("for", itemLowerCase);
            itemLabel.textContent = e;

            parent.append(itemInput, itemLabel);
    });
}
generateOptions(gameGenres, genreContainer, "checkbox");
generateOptions(platforms, platformContainer, "radio");

function generateCard(data) {
    data.forEach((e, i) => {
        console.log("Started generating card")
        const cardContainer = document.createElement("div");
        const card = document.createElement("div");
        const img = document.createElement("img");
        const textContainer = document.createElement("div");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const genre = document.createElement("p");

        cardContainer.classList.add("card-container");
        card.classList.add("card");
        img.classList.add("card-thumbnail");
        textContainer.classList.add("text-container");
        genre.classList.add("genre");
        
        img.src = e.thumbnail;
        title.textContent = e.title;
        description.textContent = e.short_description;
        genre.textContent = e.genre;

        textContainer.append(title, description, genre);
        card.append(img, textContainer);
        cardContainer.append(card);
        mainContent.append(cardContainer)
    });
}

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
