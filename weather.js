// https://api.openweathermap.org/data/2.5/weather?q=chisinau&appid=0c032e08e7eef77b6aeabb2fecbf5146&units=metric
let city = document.forms[0].elements[0]

const loadData = (cb) => {
    let xhr = new XMLHttpRequest()

    xhr.open(
        'GET', 
        `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=0c032e08e7eef77b6aeabb2fecbf5146&units=metric`
    )

    xhr.send()

    xhr.onload = () => {
        let data = JSON.parse(xhr.responseText)
        // console.log('>>', data.main.temp)
        cb(data)
    }
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
        loadData(render)
    }
})