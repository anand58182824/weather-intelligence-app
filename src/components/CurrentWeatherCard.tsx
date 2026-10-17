import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Sun,
  ArrowUp,
  ArrowDown,
  Compass,
} from 'lucide-react';
import { CurrentWeatherDisplay, TempUnit } from '../types/weather';
import { formatTemp } from '../utils/recommendations';

interface CurrentWeatherCardProps {
  weather: CurrentWeatherDisplay;
  unit: TempUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  unit,
}) => {
  // Format local observation time
  const observationDate = new Date(weather.time);
  const timeFormatted = isNaN(observationDate.getTime())
    ? 'Just now'
    : observationDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-850 to-slate-900/95 border border-slate-700/80 p-6 sm:p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Subtle decorative atmospheric background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top line: Location & Timestamps (Zero-Pill discipline: unboxed text with typographic separators) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                {weather.city}
              </h1>
              {weather.country && (
                <span className="text-slate-400 font-medium text-base sm:text-lg">
                  {weather.country}
                </span>
              )}
            </div>
            {weather.region && weather.region !== weather.city && (
              <p className="text-xs text-slate-400 mt-0.5">{weather.region}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Observed {timeFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>
              {weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°E
            </span>
          </div>
        </div>

        {/* Main temperature and weather condition display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Temperature & Condition hero */}
          <div className="lg:col-span-7 flex items-center gap-6">
            <div className="text-6xl sm:text-7xl select-none filter drop-shadow-sm">
              {weather.weatherEmoji}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                  {formatTemp(weather.temperature, unit)}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  Feels like {formatTemp(weather.apparentTemperature, unit)}
                </span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-cyan-300 mt-1">
                {weather.weatherDesc}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                <span className="flex items-center gap-0.5 text-rose-300">
                  <ArrowUp className="w-3.5 h-3.5" /> High: {formatTemp(weather.tempMaxToday, unit)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-cyan-300">
                  <ArrowDown className="w-3.5 h-3.5" /> Low: {formatTemp(weather.tempMinToday, unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Primary Telemetry Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {/* Humidity */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Humidity</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  {weather.humidity}%
                </span>
              </div>
            </div>

            {/* Wind Speed */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Wind Speed</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  {weather.windSpeed} <span className="text-xs font-normal text-slate-400">km/h</span>
                </span>
              </div>
            </div>

            {/* Precipitation */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Precipitation</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  {weather.precipitation} <span className="text-xs font-normal text-slate-400">mm</span>
                </span>
              </div>
            </div>

            {/* UV Index */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Max UV Index</span>
                <span className="text-base sm:text-lg font-bold text-white font-mono tabular-nums">
                  {weather.uvIndex}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
