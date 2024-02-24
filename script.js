const genreContainer = document.querySelector("#genre-container");
const platformContainer = document.querySelector("#platform-container");
const cardList = document.querySelector("#card-list");
const sortOrderIcon = document.querySelector("#sort-order-icon");
const sortFilter = document.querySelector("#sort-filter")
const pageSizeFilter = document.querySelector("#page-size-filter")

const apiMainURL = "https://www.freetogame.com/api/games"
const apiFilterURL = "https://www.freetogame.com/api/filter"

const ascendingIconPath = "./icons/Ascending.png";
const descendingIconPath = "./icons/Descending.png";

let sortAscending = false
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
            if (sortAscending) data.reverse();
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
let selectedPlatform = "";

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
        ? (sortOrderIcon.src = ascendingIconPath, sortAscending = true)
        : (sortOrderIcon.src = descendingIconPath, sortAscending = false);
    getData(generateURL());
})

sortFilter.addEventListener("change", () => {
    getData(generateURL());
})

pageSizeFilter.addEventListener("change", () => {
    getData(generateURL());
})

//For science!
Array.prototype.toggleElem = function(elem) {
    this.includes(elem) ? this.splice(this.indexOf(elem), 1) : this.push(elem);
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
    // const previousCards = document.querySelectorAll(".card-container")
    // previousCards.forEach(e => e.remove());

    while (cardList.firstChild) cardList.firstChild.remove();

    data.forEach((e) => {
        const cardContainer = document.createElement("li");
        const img = document.createElement("img");
        const textContainer = document.createElement("div");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const genre = document.createElement("p");

        cardContainer.classList.add("card-container");
        img.classList.add("card-thumbnail");
        textContainer.classList.add("text-container");
        genre.classList.add("genre");
        
        img.src = e.thumbnail;
        title.textContent = e.title;
        description.textContent = e.short_description;
        genre.textContent = e.genre;

        textContainer.append(title, description, genre);
        cardContainer.append(img, textContainer);
        cardList.append(cardContainer)
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

    generatePageControls(totalPages);

    return data.slice(startIndex, endIndex);
}

function generatePageControls(totalPages) {
    const pageControlContainer = document.querySelector("#page-control-container");

    const previousBtn = document.createElement("a");
    const nextBtn = document.createElement("a");
    const jumpToStartBtn = document.createElement("a");
    const jumpToEndBtn = document.createElement("a");
    previousBtn.textContent = "\u2039";
    nextBtn.textContent = "\u203A";
    jumpToStartBtn.textContent = "\u00AB"
    jumpToEndBtn.textContent = "\u00BB"
    previousBtn.classList.add("page-control");
    nextBtn.classList.add("page-control");
    jumpToStartBtn.classList.add("page-control");
    jumpToEndBtn.classList.add("page-control");

    pageControlContainer.append(jumpToStartBtn, previousBtn)
    console.log("total pages:", totalPages)

    console.log("generating page controls")

    for (let i = 0; i < totalPages; i++) {
        const numberedButton = document.createElement("a");
        numberedButton.textContent = `${i + 1}`;
        numberedButton.classList.add("page-control");

        pageControlContainer.append(numberedButton);

        if (i > 3) {
            numberedButton.textContent = "..."
            break;
        };
    }

    pageControlContainer.append(nextBtn, jumpToEndBtn);
}
