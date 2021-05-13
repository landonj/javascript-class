require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
// API call for rover images
app.get('/rovers/:name/photos', async (req, res) => {
    try {
        const { name } = req.params;
        const photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ photos })
    } catch (err) {
        console.log('error:', err);
    }
})

// API call for photo manifest
app.get('/manifest/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${name}?&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ manifest })
    } catch (err) {
        console.log('error:', err);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))