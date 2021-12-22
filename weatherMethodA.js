// https://api.openweathermap.org/data/2.5/weather?q=chisinau&appid=0c032e08e7eef77b6aeabb2fecbf5146&units=metric
let city = document.forms[0].elements[0]

const loadDataFromAPI = (cb) => {
    let xhr = new XMLHttpRequest()

    xhr.open(
        'GET', 
        `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=0c032e08e7eef77b6aeabb2fecbf5146&units=metric`
    )

    xhr.send()

    xhr.onload = () => {
        let data = JSON.parse(xhr.responseText)

        // Method A: add new properties at the beginning in data Object
        data = {'location': city.value.toLowerCase(), 'timestamp': new Date(), ...data}

        console.log('>>', 'use data from API')
        cb(data)
    }
}

// manages data
const load = (cb) => {
    //1. check the cache
    let data = null
    if(checkDataCache('data')) {
        // 2. take from cach 
        data = loadDataFromCache('data')

        // get hour from cache timestamp and save in timeFromCache
        let timeFromCache = new Date(data.timestamp).getHours()

        // get hour from present data time and save in presentTime
        let presentTime = new Date().getHours()
        
        // check if user enter the same location and give the data a one-hour refresh
        if(data.location == city.value.toLowerCase() && presentTime <= timeFromCache) {
            console.log('>>>', 'used data from Cache')
            cb(data)
        } else {
            loadDataFromAPI((data) => {
                saveDataToCache('data', data)
                cb(data)
            })
        }
        
    } else {
        // 3. take from API
        loadDataFromAPI((data) => {
            saveDataToCache('data', data)
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

document.getElementById('btn-submit').addEventListener('click', () => {
    if(city.value) {
        load(render)
    }
})

//PRO: This method use less space in cache memory because always storage only one property (key: value ) in LocalStorage

/*CONS: This method use more resources consumtion from API and subscription will run out faster 
    (because if the user wants to know the weather for Chisinau for the first time the data will be requested from the API 
    and for one hour whenever the user wants to know the weather about the same city the data will be taken from LocalStorage.
    But if in a minute the user wants to know the weather about another city besides Chisinau, the data will be requested from the API 
    and saved in LocalStorage instead of the data about Chisinau and the data about Chisinau will be deleted. If the user wants to know 
    the weather again for Chisinau after that in the same hour, data will be requested from the API  again and saved it in LocalStorage.)
*/    