// https://api.openweathermap.org/data/2.5/weather?q=chisinau&appid=0c032e08e7eef77b6aeabb2fecbf5146&units=metric
const loadDataFromAPI = (cb) => {
    let xhr = new XMLHttpRequest()

    xhr.open(
        'GET', 
        `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=0c032e08e7eef77b6aeabb2fecbf5146&units=metric`
    )

    xhr.send()

    xhr.onload = () => {
        let data = JSON.parse(xhr.responseText)
        
        console.log('>>', 'use data from API')
        cb(data)
    }
}


// manages data
const load = (cb) => {
    //1. check the cache
    let data = null

    // Method B: create prefix for data
    let d = new Date()
    d = d.toISOString().split('T')[0] + '-' + d.getHours()
    let keyData = `data--${d}--${city.value.toLowerCase()}`

    if(checkDataCache(keyData)) {
        // 2. take from cach 
        data = loadDataFromCache(keyData)

        console.log('>>>', 'used data from Cache')
        cb(data)
    } else {
        // 3. take from API
        loadDataFromAPI((data) => {
            saveDataToCache(keyData, data)
            cb(data)
        })
    }
}

const saveDataToCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

const loadDataFromCache = (key) => {
    return JSON.parse(localStorage.getItem(key))
}

const checkDataCache = (key) => {
    return localStorage.getItem(key)
}


const render = (data) => {
    let temperature = document.getElementById('temp_input')
    let windSpeed = document.getElementById('wind_input')
    let humid = document.getElementById('humidityAir')

    temperature.innerHTML = `${data.main.temp} &#176;C`
    windSpeed.textContent = `${data.wind.speed} m/s`
    humid.textContent = `${data.main.humidity} %`
}

document.getElementById('btn-submit').addEventListener('click', (e) => {
    e.preventDefault()
    if(city.value) {
        load(render)
    }
})

//PRO: This method use less resourses consumtion from API and subscription will run out faster .

//CONS: This method use more space in Cache memory(LocalStorage) because save more object in localStorage.
