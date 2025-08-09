import axios from "axios"
import { useState, useEffect } from "react"

const Weather = ({ capital }) => {
    const [weatherData, setWeatherData] = useState(null)
    const api_key = import.meta.env.VITE_WEATHER_API_KEY
    const baseUrlStart = 'https://api.openweathermap.org/data/2.5/weather?q='
    const baseUrlEnd = `&APPID=${api_key}&units=metric`

    useEffect(() => {
        axios
            .get(`${baseUrlStart}${capital}${baseUrlEnd}`)
            .then(response => {
                setWeatherData(response.data)
            })
    }, [capital])

    if (weatherData) {
        return (
            <div>
                <h2>Weather in {capital}</h2>
                <p>Temperature {weatherData.main.temp} Celsius</p>
                <img 
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description} />
                <p>Wind {weatherData.wind.speed} m/s</p>
            </div>
        )
    }
}

export default Weather