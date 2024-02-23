const genreContainer = document.querySelector("#genre-container");
const platformContainer = document.querySelector("#platform-container");
const mainContent = document.querySelector("#main-content");
const sortOrderIcon = document.querySelector("#sort-order-icon");
const sortFilter = document.querySelector("#sort-filter")
const pageSizeFilter = document.querySelector("#page-size-filter")

const apiMainURL = "https://www.freetogame.com/api/games"
const apiFilterURL = "https://www.freetogame.com/api/filter"

let isAscending = false
let currentPage = 1;

const gameGenres = [
    "MMORPG", "Shooter", "Strategy", "MOBA", "Racing", "Sports", "Social", "Sandbox",
    "Open-world", "Survival", "PvP", "PvE", "Pixel", "Voxel", "Zombie", "Turn-based",
    "First-person", "Third-person", "Top-down", "Tank", "Space", "Sailing", "Side-scroller",
    "Superhero", "Permadeath", "Card", "Battle-royale", "MMO", "MMOFPS", "MMOTPS", "3D", "2D",
    "Anime", "Fantasy", "Sci-fi", "Fighting", "Action-RPG", "Action", "Military", "Martial-arts",
    "Flight", "Low-spec", "Tower-defense", "Horror", "MMORTS"
  ];

const platforms = ["All", "PC", "Browser"];
  
async function getData(url) {
        try {
            const result = await fetch(url);
            let data = await result.json();
            if (isAscending) data.reverse();
            data = paginate(data);
            generateCard(data);
        } catch (error) {
            console.log(error);
        }
    }

// Initialize
getData(apiMainURL);
generateOptions(gameGenres, genreContainer, "checkbox");
generateOptions(platforms, platformContainer, "radio");

const selectedGenres = [];
const selectedPlatform = "";

genreContainer.addEventListener("change", (e) => {
    selectedGenres.toggleElem(e.target.value);
    getData(generateURL());
})

platformContainer.addEventListener("change", (e) => {
    selectedPlatform = e.target.value;
    getData(generateURL());
})

sortOrderIcon.addEventListener("click", () => {
    sortOrderIcon.src.includes("Descending") 
        ? (sortOrderIcon.src = "./icons/Ascending.png", isAscending = true)
        : (sortOrderIcon.src = "./icons/Descending.png", isAscending = false);
    getData(generateURL())
})

sortFilter.addEventListener("change", () => {
    getData(generateURL());
})

pageSizeFilter.addEventListener("change", () => {
    getData(generateURL());
    console.log(typeof(pageSizeFilter.value))
})

//For science!
Array.prototype.toggleElem = function(input) {
    this.includes(input) ? this.splice(this.indexOf(input), 1) : this.push(input);
}

function generateOptions(arr, parent, type) {
    arr.forEach((e) => {
            const itemInput = document.createElement("input");
            const itemLabel = document.createElement("label");
            const itemLowerCase = e.toLowerCase();

            itemInput.type = type;
            itemInput.id = itemLowerCase;
            itemInput.value = itemLowerCase;

            // Same name if radio, so they're linked
            if (type === "radio") {
                itemInput.name = type
            }

            itemLabel.setAttribute("for", itemLowerCase);
            itemLabel.textContent = e;

            parent.append(itemInput, itemLabel);
    });
}

function generateCard(data) {
    const previousCards = document.querySelectorAll(".card-container")
    previousCards.forEach(e => e.remove());

    data.forEach((e) => {
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

function generateURL() {
    const parameters = [];

    const paramPlatform = () => {
        parameters.push(`platform=${selectedPlatform}`);
    }
    const paramSort = () => {
        parameters.push(`sort-by=${sortFilter.value}`);
    }

    // If none selected
    if (!(selectedPlatform || selectedGenres.length || sortFilter.value)) return apiMainURL;

    // NOTE: The "Filter" endpoint only works when genre(tag) is included.
    if (!selectedGenres.length) {
        if (selectedPlatform) paramPlatform();
        if (sortFilter.value) paramSort();
    }
    else {
        if (selectedPlatform) paramPlatform();
        if (selectedGenres.length) parameters.push(`tag=${selectedGenres.join(".")}`)
        if (sortFilter.value) paramSort();
        return `${apiFilterURL}?${parameters.join("&")}`
    }

    return `${apiMainURL}?${parameters.join("&")}`
}

function paginate(data) {
    const itemsPerPage = parseInt(pageSizeFilter.value);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return data.slice(startIndex, endIndex);
}

// const cardContainer = document.querySelector(".card-container")
// cardContainer.addEventListener("click", function() {
//     this.classList.toggle("active");
//     const content = document.querySelector(".card-expand-content")
//     if (content.style.maxHeight) {
//         content.style.maxHeight = null;
//     } else {
//         content.style.maxHeight = content.scrollHeight + "px";
//     }
// })