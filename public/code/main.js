// const { default: fetch } = require("node-fetch")

function setup () {
    // Remove Canvas
    noCanvas()
    // Capture Video from Webcam
    const video = createCapture(VIDEO)
    video.parent('main-container')
    video.size(320, 240)

    let lat, lon, city, weather, description, aqi
    // Geo-locate
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            try {
                // console.log(position)
                // We have location from user
                lat = position.coords.latitude
                lon = position.coords.longitude
        
                const apiUrl = `weather/${lat},${lon}`

                // Gather response from server
                const response = await fetch(apiUrl)
                const json = await response.json()
                console.log(json)
        
                city = json.weather.name
                weather = json.weather.main.temp
                description = json.weather.weather[0].description
                aqi = json.aqi

                const template = `
                    <div class="more_info">
                    <div class="weatherDiv">
                        <div>
                            <div class="temp">${weather}</div>
                            <div class="temp">${data.aqi}</div>
                            <div class="summary">${description}</div>
                        </div>
                    </div>
                    <div class="location">
                        <p class="location" title="${lat},${lon}">${city}</p>
                    </div>
                    <div class="airDis">
                        <div class="aqi>${aqi}</div>
                    </div>
                    </div>
                `
    
                const weatherDiv = document.createElement('div')
                weatherDiv.innerHTML = template
                document.querySelector('main').append(weatherDiv)
            } catch (error) {
                console.error(error)
            }
        })
    } else {
        console.error("Geolocation is not available in this browser")
    }

    // What happens after user clicks send
    document.querySelector('form button').addEventListener( 'click' , async e => {
        e.preventDefault()

        // Get User Input
        const mood = document.querySelector('form input').value
        // Get current Image
        video.loadPixels()
        const image64 = video.canvas.toDataURL()

        const data = {
            mood,
            city,
            weather,
            description,
            aqi,
            image64
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        // Send Data to API Endpoint
        const response = await fetch('/api', options)
        const json = await response.json()

        console.log(json) // HIer fehlt async neumeds
    })
}