// Express aus Packages holen
const express = require('express')
const fetch = require('node-fetch')
const Datastore = require('nedb')
require('dotenv').config()

// Express starten (Dynamischer, weil der Server nicht nur bei uns funktionieren soll, sondern auch bei anderen. Bei anderen heisst der Port vielleicht anders)
const app = express()
const port = process.env.PORT || 3004 // in process wird der zukünftige environment für öffentliche server zur verfügung gestellt (dafür mussten wir dotenv requiren)

// App starten
app.listen(port, () => {
    console.log(`app is listening at http://localhost:${port}`)
})

// Statischer Ordner setzen
app.use(express.static('public'))

app.use(express.json({
    limit:'1mb'
}))
// Define and load the database
const database = new Datastore('database/database.db')
database.loadDatabase()

// Database API (POST/Insert)
app.post('/api', (req, res) => {
    // Send Information to the database
    console.log('Database post endpoint got a request')
    const data = req.body
    const timestamp = Date.now()
    data.timestamp = timestamp
    database.insert(data)
    res.json(data)
})

// Database API (GET/read)
app.get('/api', (req, res) => {
    // Semd the information from the database to the client
    database.find({}, (err, data) => {

        if(err) {
            console.error(err)
            res.end()
        }
        // Send data to client
        res.json(data)
    })

})

// Weather and AQI API Endpoint
app.get('/weather/:latlon', async (req, res) => {
    const latlon = req.params.latlon.split(',')
    const lat = latlon[0]
    const lon = latlon[1]
    // console.log(lat, lon)

    // API Key to to OWM
    const ApiKeyWeather = process.env.API_KEY_WEATHER
    const ApiKeyAqi = process.env.API_KEY_AQI

    // Request for weather app
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKeyWeather}&units=metric`
    const weatherResponse = await fetch(weatherUrl)
    const weatherJSON = await weatherResponse.json()
    // console.log(weatherJson)
    // Todo: AQI API Geschichte
    const aqiUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${ApiKeyAqi}`
    const aqiResponse = await fetch(aqiUrl)
    const aqiJson = await aqiResponse.json()
    console.log(aqiJson)

    const data = {
        weather: weatherJSON,
        aqi: aqiJson.data.aqi
    }
    console.log(data)
    // Send response to the client
    res.json(data)
})