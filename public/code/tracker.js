fetchData ()
async function fetchData () {
    // get data from api
  const response = await fetch('/api')
  const data = await response.json()

  let aqText
  let aqClass

  // AQ Index
  // < 51 = 'Good
  // > 50 && < 101 = 'Moderate'
  // > 100 && < 151 = 'Unhealthy for sensitive groups'
  // > 150 && < 201 = 'Unhealthy'
  // > 200 && < 301 = 'Very unhealthy'
  // > 300 = 'Hazardous'

    console.log(data)
    let counter = 0
    data.forEach(item => {
        counter++
        // Create container for entry

        // define aq Text
        if(item.aqi < 51) {
            aqText = 'Good'
        } else if (item.aqi < 50 && item.aqi < 101) {
            aqText = 'Moderate'
        } else if (item.aqi < 100 && item.aqi < 151) {
            aqText = 'Unhealthy for sensitive groups'
        } else if (item.aqi < 150 && item.aqi < 201) {
            aqText = 'Unhealthy'
        } else if (item.aqi < 200 && item.aqi < 301) {
            aqText = 'Very unhealthy'
        } else if (item.aqi > 300) {
            aqText = 'Hazardous'
        }

        const container = document.createElement('div')
        container.innerHTML = `
        <section class="mood_container">
            <p class="counter">${counter}</p>
            <p class="date">${new Date(item.timestamp).toLocaleString()}</p>
            <p class="mood">${item.mood}</p>
            <div class="face_container"><img src="${item.image64}" alt=""></div>
            <div class="more_info">
            <div class="weatherDiv">
                <div>
                    <div class="temp">${item.weather}°C</div>
                    <div class="summary">${item.description}</div>
                </div>
            </div>
            <div class="locationDis">
                <p class="location">${item.city}</p>
            </div>
            <div class="airDis">
                <div class="aqi>${item.aqi}</div>
            </div>
            </div>
        </section> 
        `
        document.querySelector('main').append(container)
    });
}