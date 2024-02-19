async function getData() {
    try {
        const result = await fetch("/api/v2/facts/random");
        const data = await result.json();
        renderSite(data);
    } catch (error) {
        console.log(error)
    }
}

getData();

function renderSite(data) {
    console.log(data)
}