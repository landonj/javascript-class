let store = {
    user: { name: "Student" },
    apod: '',
    curiosity: '',
    opportunity: '',
    spirit: '',
    rover_photos: '',
    // rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let { rover_photos } = state

    return `
        <header>
            <button type="button" id="curiosity">Curiosity</button>
            <button type="button" id="opportunity">Opportunity</button>
            <button type="button" id="spirit">Spirit</button>
        </header>
        <main>
            <section>
                ${RoverPhotos(rover_photos,'curiosity')}
            </section>
        </main>
        <footer></footer>
    `
}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
    document.getElementById("body").addEventListener("click", function(event) {
        getRoverPhotos(store, event.target.id);
        render(root, store);
    });
})

// ------------------------------------------------------  COMPONENTS

/*
Launch Date
Landing Date
Status
Most recently available photos
Date the most recent photos were taken
 */


const constructPhotoGrid = (photos) => {
    const photoGrid = photos.reduce((grid, photo) => {
        return grid + `<div><div><img src="${photo.img_src}" /></div><div>${photo.earth_data}</div></div>`;
    }, "");
    return photoGrid;
}

const RoverPhotos = (rover_photos, roverName) => {
    // for first load
    if (!rover_photos) {
        getRoverPhotos(store, roverName);
    }
    const { photos } = rover_photos;
    return (`
        <div class="wrapper">
            ${constructPhotoGrid(photos.photos)}
        </div>
    `)
}

// ------------------------------------------------------  API CALLS

// Example API call
const getRoverPhotos = (state, roverName) => {
    let { rover_photos } = state;
    const url = `http://localhost:3000/rovers/${roverName}/photos`;
    fetch(url)
        .then(res => res.json())
        .then(rover_photos => updateStore(store, { rover_photos }))
}
