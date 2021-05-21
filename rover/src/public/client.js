// eslint-disable-next-line no-undef
let store = Immutable.Map({});

const root = document.getElementById('root');

/**
 * @description Represents an Image from the Mar's rover
 * @constructor
 * @param {string} image - path to image
 * @param {string} date - path to the image
 */
function RoverPhoto(image, date) {
    this.image = image;
    this.date = date;
}

/**
 * Updates the Store
 *
 * @param {object} state - current state of the store
 * @param {object} newRoverState - the new state of the store
 */
function updateStore(state, newRoverState) {
    const newState = {
        ...state,
        ...newRoverState,
    };
    store = state.merge(newState);
    // eslint-disable-next-line no-use-before-define
    render(root, store);
}

const getRoverPhotos = (state, roverName) => {
    const url = `http://localhost:3000/rovers/${roverName}/photos`;
    fetch(url)
        .then(res => res.json())
        .then(roverPhotos => updateStore(store, { ...roverPhotos }));
};

const getRoverManifest = (state, roverName) => {
    const url = `http://localhost:3000/manifest/${roverName}`;
    fetch(url)
        .then(res => res.json())
        .then(roverData => updateStore(store, { ...roverData }));
};

const createManifest = photoManifest => `<div>Rover Name: ${photoManifest.name}</div>
<div>Launch Date: ${photoManifest.launch_date}</div>
<div>Landing Date: ${photoManifest.landing_date}</div>
<div>Status: ${photoManifest.status}</div>`;

const RoverData = (roverData, roverName = 'curiosity') => {
    // for first load
    if (!roverData) {
        getRoverManifest(store, roverName);
    }
    if (roverData) {
        const manifest = roverData.get('photo_manifest').toObject();
        return `
        <div class="data_wrapper">
            ${createManifest(manifest)}
        </div>
    `;
    }
    return `<div class="data_wrapper"></div>`;
};

const constructPhotoGrid = photos => {
    // I don't need this map function.  I'm just doing it to meet requirements!
    const roverPhotos = photos.map(
        photo => new RoverPhoto(photo.get('img_src'), photo.get('earth_date'))
    );

    const photoGrid = roverPhotos.reduce(
        (grid, photo) =>
            `${grid}<div><img src="${photo.image}" /></div><div>Earth date: ${photo.date}</div>`,
        ''
    );
    return photoGrid;
};

const RoverPhotos = (roverPhotos, roverName = 'curiosity') => {
    // for first load
    if (!roverPhotos) {
        getRoverPhotos(store, roverName);
    }
    if (roverPhotos) {
        const latestPhotos = roverPhotos.get('latest_photos').toArray();
        return `
        <div class="photo_wrapper">
            ${constructPhotoGrid(latestPhotos)}
        </div>
    `;
    }
    return `<div class="photo_wrapper"></div>`;
};

// create content
const App = state => {
    const roverData = state.get('manifest');
    const roverPhotos = state.get('photos');
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
