const genreContainer = document.querySelector("#genre-container");
const platformContainer = document.querySelector("#platform-container");
const cardList = document.querySelector("#card-list");
const sortOrderIcon = document.querySelector("#sort-order-icon");
const sortFilter = document.querySelector("#sort-filter")
const sortWrapper = document.querySelector("#sort-wrapper")
const pageSizeFilter = document.querySelector("#page-size-filter")
const pagnationAboveContainer = document.querySelector("#pagnation-above-container");
const pagnationBelowContainer = document.querySelector("#pagnation-below-container");

const apiMainURL = "https://www.freetogame.com/api/games"
const apiFilterURL = "https://www.freetogame.com/api/filter"

const ascendingIconPath = "./icons/Ascending.png";
const descendingIconPath = "./icons/Descending.png";

let sortAscending = false;
let currentPage = 1;
let totalPages = 0;

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
            renderSite(data);
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

pagnationAboveContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    handlePageSwitch(e.submitter.value);
    getData(generateURL());
})

pagnationBelowContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    handlePageSwitch(e.submitter.value);
    getData(generateURL());
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
})

//For science!
Array.prototype.toggleElem = function(elem) {
    this.includes(elem) ? this.splice(this.indexOf(elem), 1) : this.push(elem);
}

function renderSite(data) {
    while (cardList.firstChild) cardList.firstChild.remove();
    while (pagnationAboveContainer.firstChild) pagnationAboveContainer.firstChild.remove();
    while (pagnationBelowContainer.firstChild) pagnationBelowContainer.firstChild.remove();
    
    if (data.length) {
        if (sortAscending) data.reverse();
        data = paginate(data);
        generateCard(data)
        sortWrapper.style.display = "flex"
    }
    else {
        const emptyListError = document.createElement("p");
        emptyListError.textContent = "No matches were found :(";
        emptyListError.id = "empty-list-error"
        cardList.append(emptyListError);
        sortWrapper.style.display = "none"
    };
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
    totalPages = Math.ceil(data.length / itemsPerPage);

    if (data.length > itemsPerPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        data = data.slice(startIndex, endIndex);
    }

    generatePageControls(pagnationAboveContainer);
    generatePageControls(pagnationBelowContainer);

    return data;
}

function generatePageControls(parent) {

    // Create direction buttons
    const previousBtn = document.createElement("button");
    const nextBtn = document.createElement("button");
    const jumpToStartBtn = document.createElement("button");
    const jumpToEndBtn = document.createElement("button");

    previousBtn.type = "submit";
    nextBtn.type = "submit";
    jumpToStartBtn.type = "submit";
    jumpToEndBtn.type = "submit";

    previousBtn.textContent = "\u2039";
    nextBtn.textContent = "\u203A";
    jumpToStartBtn.textContent = "\u00AB";
    jumpToEndBtn.textContent = "\u00BB";

    previousBtn.value = "prev";
    nextBtn.value = "next";
    jumpToStartBtn.value = "start";
    jumpToEndBtn.value = "end";

    previousBtn.classList.add("pagnation-btn");
    nextBtn.classList.add("pagnation-btn");
    jumpToStartBtn.classList.add("pagnation-btn");
    jumpToEndBtn.classList.add("pagnation-btn");

    parent.append(jumpToStartBtn, previousBtn);

    // Create numbered buttons
    const numButtonsToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(numButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + numButtonsToShow - 1);

    if (endPage - startPage + 1 < numButtonsToShow) {
        startPage = Math.max(1, endPage - numButtonsToShow + 1);
    };

    for (let i = startPage; i <= endPage; i++) {
        const numberedButton = document.createElement("button");
        numButtonsToShow.type = "submit";
        numberedButton.textContent = `${i}`;
        numberedButton.classList.add("pagnation-btn");
        numberedButton.value = i;

        if (i === currentPage) {
            numberedButton.classList.add("pagnation-btn-current");
        };

        parent.append(numberedButton);
    };

    currentPage === startPage 
        ? previousBtn.disabled = true
        : previousBtn.disabled = false;

    currentPage === endPage
        ? nextBtn.disabled = true
        : nextBtn.disabled = false;

    currentPage < (startPage + 2)
        ? jumpToStartBtn.disabled = true
        : jumpToStartBtn.disabled = false;
    
    currentPage > (endPage - 2)
        ? jumpToEndBtn.disabled = true
        : jumpToEndBtn.disabled = false;


    parent.append(nextBtn, jumpToEndBtn);
}

function handlePageSwitch(selected) {
    switch (selected) {
        case "start":
            currentPage = 1;
            break;
        case "end":
            currentPage = totalPages;
            break;
        case "next":
            currentPage++;
            break;
        case "prev":
            currentPage--;
            break;
        default:
            currentPage = parseInt(selected);
    };
}