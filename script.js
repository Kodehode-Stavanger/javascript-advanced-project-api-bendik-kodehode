const getInfo =  "https://v2.jokeapi.dev/info";
const getJoke = " https://v2.jokeapi.dev/joke/";

const optionsForm = document.getElementById("options-form");



async function getData(link) {
    try {
        const result = await fetch(`${link}`);
        const data = await result.json();
        renderSite(data);
    } catch (error) {
        console.log(error);
    }
}

getData(getInfo);

function renderSite(data) {
    generateCheckboxOptions(data)
    console.log(data)
}

function generateCheckboxOptions(data) {
    const categoryList = data.jokes.categories;
    const flagList = data.jokes.flags;
    const typeList = data.jokes.types;

    const fieldset = document.createElement("fieldset");
    const title = document.createElement("legend");

    fieldset.classList.add(`${title.toLowerCase}`)
}