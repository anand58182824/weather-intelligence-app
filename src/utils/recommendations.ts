import { DayForecastItem, RecommendationSummary } from '../types/weather';

export function calculateDayScore(
  tempMax: number,
  tempMin: number,
  rainProb: number,
  rainSum: number,
  windSpeed: number,
  uvIndex: number,
  weatherCode: number
): number {
  let score = 75;

  // Temperature suitability (ideal: 20°C - 26°C)
  if (tempMax >= 20 && tempMax <= 26) {
    score += 15;
  } else if (tempMax > 26 && tempMax <= 30) {
    score += 5;
  } else if (tempMax > 30 && tempMax < 35) {
    score -= 10;
  } else if (tempMax >= 35) {
    score -= 25;
  } else if (tempMax < 15 && tempMax >= 10) {
    score -= 10;
  } else if (tempMax < 10) {
    score -= 25;
  }

  // Minimum temperature impact
  if (tempMin < 5) {
    score -= 15;
  } else if (tempMin <= 10) {
    score -= 5;
  }

  // Rain probability & sum impact
  if (rainProb >= 70) {
    score -= 35;
  } else if (rainProb >= 50) {
    score -= 25;
  } else if (rainProb >= 30) {
    score -= 12;
  } else if (rainProb <= 10) {
    score += 10;
  }

  if (rainSum > 10) {
    score -= 25;
  } else if (rainSum > 2) {
    score -= 10;
  }

  // Wind speed impact
  if (windSpeed >= 45) {
    score -= 30;
  } else if (windSpeed >= 35) {
    score -= 15;
  } else if (windSpeed <= 18) {
    score += 5;
  }

  // UV impact
  if (uvIndex >= 10) {
    score -= 15;
  } else if (uvIndex >= 8) {
    score -= 8;
  }

  // Weather condition bonuses/penalties
  if (weatherCode === 0 || weatherCode === 1) {
    score += 10;
  } else if (weatherCode >= 61 && weatherCode <= 67) {
    score -= 20;
  } else if (weatherCode >= 95) {
    score -= 35;
  }

  return Math.max(10, Math.min(100, Math.round(score)));
}

export function generateDayTips(
  tempMax: number,
  tempMin: number,
  rainProb: number,
  windSpeed: number,
  uvIndex: number
): string[] {
  const tips: string[] = [];

  if (rainProb >= 50) {
    tips.push('Carry an umbrella (rain probability ≥ 50%)');
  }

  if (tempMax >= 35 || uvIndex >= 8) {
    tips.push('Stay hydrated & avoid midday sun (high heat / UV)');
  }

  if (tempMin <= 10) {
    tips.push('Carry a jacket (low temperature ≤ 10°C)');
  }

  if (windSpeed >= 40) {
    tips.push('Caution for strong wind (speed ≥ 40 km/h)');
  }

  if (tips.length === 0) {
    tips.push('Good day for outdoor plans');
  }

  return tips;
}

export function buildRecommendations(days: DayForecastItem[]): RecommendationSummary {
  if (days.length === 0) {
    throw new Error('No forecast data available');
  }

  // Determine best day based on score and low rain/wind
  const sortedDays = [...days].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.precipitationProbability !== b.precipitationProbability) {
      return a.precipitationProbability - b.precipitationProbability;
    }
    return a.windSpeedMax - b.windSpeedMax;
  });

  const bestDay = sortedDays[0];

  // Mark best day on item
  days.forEach((day) => {
    day.isBestDay = day.date === bestDay.date;
  });

  const today = days[0];
  const todayTips = today.tips;

  const alerts: RecommendationSummary['alerts'] = [];

  // Check for any alerts across the week
  const rainyDays = days.filter((d) => d.precipitationProbability >= 50);
  if (rainyDays.length > 0) {
    alerts.push({
      type: 'rain',
      severity: 'warning',
      title: 'Rain Expected',
      description: `${rainyDays.map((d) => d.dayName).join(', ')}: rain probability reaches 50% or higher. Keep umbrellas ready.`,
    });
  }

  const hotDays = days.filter((d) => d.tempMax >= 35 || d.uvIndexMax >= 8);
  if (hotDays.length > 0) {
    alerts.push({
      type: 'heat',
      severity: 'alert',
      title: 'High Heat / UV Caution',
      description: `${hotDays.map((d) => d.dayName).join(', ')}: temperatures exceed 35°C or UV index exceeds 8. Hydrate and use sun protection.`,
    });
  }

  const coldDays = days.filter((d) => d.tempMin <= 10);
  if (coldDays.length > 0) {
    alerts.push({
      type: 'cold',
      severity: 'info',
      title: 'Chilly Mornings/Nights',
      description: `${coldDays.map((d) => d.dayName).join(', ')}: minimum temperatures dip below 10°C. Pack warm layers.`,
    });
  }

  const windyDays = days.filter((d) => d.windSpeedMax >= 40);
  if (windyDays.length > 0) {
    alerts.push({
      type: 'wind',
      severity: 'warning',
      title: 'High Winds Alert',
      description: `${windyDays.map((d) => d.dayName).join(', ')}: gusts reach or exceed 40 km/h. Secure loose outdoor objects.`,
    });
  }

  // If no adverse conditions all week
  if (alerts.length === 0) {
    alerts.push({
      type: 'optimal',
      severity: 'success',
      title: 'Favorable Week Ahead',
      description: 'Mild temperatures and stable atmospheric conditions predicted across the 7-day forecast.',
    });
  }

  const weekOverview = `Best condition for outdoor activities is ${bestDay.dayName} (${bestDay.shortDate}) with a high of ${Math.round(bestDay.tempMax)}°C, ${bestDay.precipitationProbability}% chance of rain, and ${bestDay.weatherDesc.toLowerCase()}.`;

  return {
    bestDay,
    todayTips,
    weekOverview,
    alerts,
  };
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempRaw(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}
