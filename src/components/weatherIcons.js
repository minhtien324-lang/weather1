import React from "react";
import {
    WiDaySunny, WiCloudy, WiCloudyGusts, WiFog, WiRain, WiShowers,
    WiThunderstorm, WiSnow, WiSleet, WiDust, WiSmoke, WiTornado, WiStrongWind,
    WiHumidity, WiDirectionUp
} from "weather-icons-react";

export const getWeatherIcon = (iconCode, className = "text-5xl") => {
    switch (iconCode) {
        case '01d':
            return <WiDaySunny className={`${className} text-yellow-500`} />;
        case '01n':
            return <WiDaySunny className={`${className} text-indigo-500`} />;
        case '02d':
            return <WiCloudy className={`${className} text-gray-400`}/>;
        case '02n':
            return <WiCloudy className={`${className} text-gray-500`} />;
        case '03d':
        case '03n':
            return <WiCloudy className={`${className} text-gray-400`} />;
        case '04d':
        case '04n':
            return <WiCloudyGusts className={`${className} text-gray-600`} />;
        case '09d':
        case '09n':
            return <WiShowers className={`${className} text-blue-500`} />;
        case '10d':
            return <WiRain className={`${className} text-blue-500`} />;
        case '10n':
            return <WiRain className={`${className} text-gray-600`} />;
        case '11d':
        case '11n':
            return <WiThunderstorm className={`${className} text-purple-600`} />;
        case '13d':
        case '13n':
            return <WiSnow className={`${className} text-cyan-400`} />;
        case '50d':
        case '50n':
            return <WiFog className={`${className} text-gray-400`} />;
        default:
            return <WiDaySunny className={`${className} text-gray-400`} />;
    }
};
export const HumidityIcon = ({className = "text-3xl"}) => <WiHumidity className={`${className} text-blue-500`} />;
export const WindIcon = ({className = "text-3xl"}) => <WiStrongWind className={`${className} text-blue-500`} />;
export const PresureIcon = ({className = "text-3xl"}) => <WiDirectionUp className={`${className} text-blue-500`} />;
export const VisibilityIcon = ({className = "text-3xl"}) => <WiSmoke className={`${className} text-blue-500`} />;