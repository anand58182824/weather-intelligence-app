export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  country: string;
  country_id?: number;
  population?: number;
}

export interface GeocodingApiResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherRaw {
  time: string;
  interval?: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyWeatherRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: CurrentWeatherRaw;
  daily_units: Record<string, string>;
  daily: DailyWeatherRaw;
}

export interface DayForecastItem {
  date: string;
  dayName: string;
  shortDate: string;
  weatherCode: number;
  weatherDesc: string;
  weatherEmoji: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  score: number;
  tips: string[];
  isBestDay?: boolean;
}

export interface CurrentWeatherDisplay {
  city: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  weatherCode: number;
  weatherDesc: string;
  weatherEmoji: string;
  windSpeed: number;
  time: string;
  uvIndex: number;
  tempMaxToday: number;
  tempMinToday: number;
}

export interface RecommendationSummary {
  bestDay: DayForecastItem;
  todayTips: string[];
  weekOverview: string;
  alerts: Array<{
    type: 'rain' | 'heat' | 'cold' | 'wind' | 'optimal';
    severity: 'warning' | 'alert' | 'success' | 'info';
    title: string;
    description: string;
  }>;
}

export type TempUnit = 'C' | 'F';
