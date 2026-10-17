import {
  CurrentWeatherDisplay,
  DayForecastItem,
  ForecastApiResponse,
  GeocodingApiResponse,
  GeocodingResult,
} from '../types/weather';
import { calculateDayScore, generateDayTips } from '../utils/recommendations';
import { getWmoInfo } from '../utils/wmoCodes';

export class WeatherApiError extends Error {
  code: 'CITY_NOT_FOUND' | 'NETWORK_ERROR' | 'EMPTY_INPUT';

  constructor(message: string, code: 'CITY_NOT_FOUND' | 'NETWORK_ERROR' | 'EMPTY_INPUT') {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
  }
}

export async function searchCities(cityName: string): Promise<GeocodingResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw new WeatherApiError('Please enter a city name.', 'EMPTY_INPUT');
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=5&language=en&format=json`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    console.error('Geocoding network error:', err);
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  if (!response.ok) {
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  let data: GeocodingApiResponse;
  try {
    data = await response.json();
  } catch (err) {
    console.error('Geocoding JSON parse error:', err);
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  if (!data.results || data.results.length === 0) {
    throw new WeatherApiError(
      'City not found. Please check the spelling and try again.',
      'CITY_NOT_FOUND'
    );
  }

  return data.results;
}

export async function fetchForecast(
  location: GeocodingResult
): Promise<{
  current: CurrentWeatherDisplay;
  daily: DayForecastItem[];
}> {
  const { latitude, longitude, name, country, admin1 } = location;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=7`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    console.error('Forecast network error:', err);
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  if (!response.ok) {
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  let data: ForecastApiResponse;
  try {
    data = await response.json();
  } catch (err) {
    console.error('Forecast JSON parse error:', err);
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  if (!data.current || !data.daily || !data.daily.time) {
    throw new WeatherApiError(
      'Unable to fetch weather data right now. Please try again.',
      'NETWORK_ERROR'
    );
  }

  // Parse current weather
  const currentWmo = getWmoInfo(data.current.weather_code);
  const currentDisplay: CurrentWeatherDisplay = {
    city: name,
    country: country || '',
    region: admin1,
    latitude,
    longitude,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    weatherDesc: currentWmo.description,
    weatherEmoji: currentWmo.emoji,
    windSpeed: data.current.wind_speed_10m,
    time: data.current.time,
    uvIndex: data.daily.uv_index_max?.[0] ?? 0,
    tempMaxToday: data.daily.temperature_2m_max?.[0] ?? data.current.temperature_2m,
    tempMinToday: data.daily.temperature_2m_min?.[0] ?? data.current.temperature_2m,
  };

  // Parse 7-day forecast items
  const dailyItems: DayForecastItem[] = data.daily.time.map((timeStr, idx) => {
    const dateObj = new Date(timeStr + 'T12:00:00');
    const isToday = idx === 0;

    const dayName = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    const shortDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const wCode = data.daily.weather_code[idx] ?? 0;
    const wInfo = getWmoInfo(wCode);
    const maxT = data.daily.temperature_2m_max[idx] ?? 0;
    const minT = data.daily.temperature_2m_min[idx] ?? 0;
    const rainSum = data.daily.precipitation_sum[idx] ?? 0;
    const rainProb = data.daily.precipitation_probability_max[idx] ?? 0;
    const wind = data.daily.wind_speed_10m_max[idx] ?? 0;
    const uv = data.daily.uv_index_max[idx] ?? 0;

    const score = calculateDayScore(maxT, minT, rainProb, rainSum, wind, uv, wCode);
    const tips = generateDayTips(maxT, minT, rainProb, wind, uv);

    return {
      date: timeStr,
      dayName,
      shortDate,
      weatherCode: wCode,
      weatherDesc: wInfo.description,
      weatherEmoji: wInfo.emoji,
      tempMax: maxT,
      tempMin: minT,
      precipitationSum: rainSum,
      precipitationProbability: rainProb,
      windSpeedMax: wind,
      uvIndexMax: uv,
      score,
      tips,
    };
  });

  return {
    current: currentDisplay,
    daily: dailyItems,
  };
}
