export interface WmoInfo {
  code: number;
  description: string;
  emoji: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export const WMO_CODE_MAP: Record<number, WmoInfo> = {
  0: { code: 0, description: 'Clear sky', emoji: '☀️', category: 'clear' },
  1: { code: 1, description: 'Mainly clear', emoji: '🌤️', category: 'clear' },
  2: { code: 2, description: 'Partly cloudy', emoji: '⛅', category: 'cloudy' },
  3: { code: 3, description: 'Overcast', emoji: '☁️', category: 'cloudy' },
  45: { code: 45, description: 'Foggy', emoji: '🌫️', category: 'fog' },
  48: { code: 48, description: 'Depositing rime fog', emoji: '🌫️', category: 'fog' },
  51: { code: 51, description: 'Light drizzle', emoji: '🌦️', category: 'drizzle' },
  53: { code: 53, description: 'Moderate drizzle', emoji: '🌦️', category: 'drizzle' },
  55: { code: 55, description: 'Dense drizzle', emoji: '🌧️', category: 'drizzle' },
  56: { code: 56, description: 'Light freezing drizzle', emoji: '🌧️', category: 'drizzle' },
  57: { code: 57, description: 'Dense freezing drizzle', emoji: '🌧️', category: 'drizzle' },
  61: { code: 61, description: 'Slight rain', emoji: '🌦️', category: 'rain' },
  63: { code: 63, description: 'Moderate rain', emoji: '🌧️', category: 'rain' },
  65: { code: 65, description: 'Heavy rain', emoji: '🌧️', category: 'rain' },
  66: { code: 66, description: 'Light freezing rain', emoji: '🌧️', category: 'rain' },
  67: { code: 67, description: 'Heavy freezing rain', emoji: '🌧️', category: 'rain' },
  71: { code: 71, description: 'Slight snow fall', emoji: '🌨️', category: 'snow' },
  73: { code: 73, description: 'Moderate snow fall', emoji: '🌨️', category: 'snow' },
  75: { code: 75, description: 'Heavy snow fall', emoji: '❄️', category: 'snow' },
  77: { code: 77, description: 'Snow grains', emoji: '🌨️', category: 'snow' },
  80: { code: 80, description: 'Slight rain showers', emoji: '🌦️', category: 'rain' },
  81: { code: 81, description: 'Moderate rain showers', emoji: '🌧️', category: 'rain' },
  82: { code: 82, description: 'Violent rain showers', emoji: '⛈️', category: 'rain' },
  85: { code: 85, description: 'Slight snow showers', emoji: '🌨️', category: 'snow' },
  86: { code: 86, description: 'Heavy snow showers', emoji: '❄️', category: 'snow' },
  95: { code: 95, description: 'Thunderstorm', emoji: '⛈️', category: 'thunderstorm' },
  96: { code: 96, description: 'Thunderstorm with slight hail', emoji: '⛈️', category: 'thunderstorm' },
  99: { code: 99, description: 'Thunderstorm with heavy hail', emoji: '⛈️', category: 'thunderstorm' },
};

export function getWmoInfo(code: number): WmoInfo {
  if (code in WMO_CODE_MAP) {
    return WMO_CODE_MAP[code];
  }
  // Fallbacks for unlisted codes
  if (code > 0 && code < 4) {
    return { code, description: 'Cloudy periods', emoji: '⛅', category: 'cloudy' };
  }
  if (code >= 50 && code < 60) {
    return { code, description: 'Drizzle', emoji: '🌦️', category: 'drizzle' };
  }
  if (code >= 60 && code < 70) {
    return { code, description: 'Rain', emoji: '🌧️', category: 'rain' };
  }
  if (code >= 70 && code < 80) {
    return { code, description: 'Snow', emoji: '🌨️', category: 'snow' };
  }
  if (code >= 80 && code < 90) {
    return { code, description: 'Showers', emoji: '🌦️', category: 'rain' };
  }
  if (code >= 90) {
    return { code, description: 'Severe weather', emoji: '⛈️', category: 'thunderstorm' };
  }
  return { code, description: 'Fair', emoji: '☀️', category: 'clear' };
}
