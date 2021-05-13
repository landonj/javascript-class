const Immutable = require('immutable');

let store = Immutable.Map({
    rover_data: '',
    rover_photos: '',
});

const root = document.getElementById('root');

/**
 * Updates the Store
 *
 * @param {object} state - current state of the store
 * @param {object} newState - the new state of the store
 */
function updateStore(state, newState) {
    store = state.merge(newState);
    // eslint-disable-next-line no-use-before-define
    render(root, store);
}

const getRoverPhotos = (state, roverName) => {
    const url = `http://localhost:3000/rovers/${roverName}/photos`;
    fetch(url)
        .then(res => res.json())
        .then(roverPhotos => updateStore(store, { roverPhotos }));
};

const getRoverManifest = (state, roverName) => {
    const url = `http://localhost:3000/manifest/${roverName}`;
    fetch(url)
        .then(res => res.json())
        .then(roverData => updateStore(store, { roverData }));
};

const createManifest = photoManifest => `<div>Rover Name: ${photoManifest.name}</div>
<div>Launch Date: ${photoManifest.launch_date}</div>
<div>Landing Date: ${photoManifest.landing_date}</div>
<div>Status: ${photoManifest.status}</div>`;

const RoverData = (roverData, roverName) => {
    // for first load
    if (!roverData) {
        getRoverManifest(store, roverName);
    }
    const { manifest } = roverData;
    return `
        <div class="wrapper">
            ${createManifest(manifest.photo_manifest)}
        </div>
    `;
};

const constructPhotoGrid = photos => {
    const photoGrid = photos.reduce(
        (grid, photo) =>
            `${grid}<div><div><img src="${photo.img_src}" /></div><div>${photo.earth_date}</div></div>`,
        ''
    );
    return photoGrid;
};

const RoverPhotos = (roverPhotos, roverName) => {
    // for first load
    if (!roverPhotos) {
        getRoverPhotos(store, roverName);
    }
    const { photos } = roverPhotos;
    return `
        <div class="wrapper">
            ${constructPhotoGrid(photos.latest_photos)}
        </div>
    `;
};

// create content
const App = state => {
    const { roverData, roverPhotos } = state;

    return `
        <header>
            <button type="button" id="curiosity">Curiosity</button>
            <button type="button" id="opportunity">Opportunity</button>
            <button type="button" id="spirit">Spirit</button>
        </header>
        <main>
            <section>
                ${RoverData(roverData, 'curiosity')}
                ${RoverPhotos(roverPhotos, 'curiosity')}
            </section>
        </main>
        <footer></footer>
    `;
};

// eslint-disable-next-line no-shadow
const render = async (root, state) => {
    root.innerHTML = App(state);
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store);
    document.getElementById('body').addEventListener('click', event => {
        getRoverManifest(store, event.target.id);
        getRoverPhotos(store, event.target.id);
        render(root, store);
    });
});
