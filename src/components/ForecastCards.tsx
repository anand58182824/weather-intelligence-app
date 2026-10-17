import React from 'react';
import { CloudRain, Sparkles, Wind, Sun } from 'lucide-react';
import { DayForecastItem, TempUnit } from '../types/weather';
import { formatTemp } from '../utils/recommendations';

interface ForecastCardsProps {
  days: DayForecastItem[];
  unit: TempUnit;
  selectedDate?: string;
  onSelectDay?: (date: string) => void;
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({
  days,
  unit,
  selectedDate,
  onSelectDay,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            7-Day Meteorological Outlook
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily temperature spectrum, expected precipitation probability, and outdoor index
          </p>
        </div>
      </div>

      {/* 7-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {days.map((day) => {
          const isSelected = selectedDate === day.date;
          const isBest = day.isBestDay;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDay && onSelectDay(day.date)}
              className={`text-left rounded-xl p-3.5 transition-all flex flex-col justify-between relative overflow-hidden group border ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/30'
                  : isBest
                  ? 'bg-slate-800/90 border-amber-500/60 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              {/* Best day indicator */}
              {isBest && (
                <div className="absolute top-2 right-2 text-amber-400 flex items-center gap-1 text-[10px] font-semibold tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>BEST</span>
                </div>
              )}

              <div>
                {/* Day name & date */}
                <div className="mb-2">
                  <span className="block text-sm font-bold text-white tracking-tight">
                    {day.dayName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {day.shortDate}
                  </span>
                </div>

                {/* Weather emoji & description */}
                <div className="my-2 flex flex-col items-start gap-1">
                  <span className="text-3xl select-none filter drop-shadow-sm">
                    {day.weatherEmoji}
                  </span>
                  <span className="text-xs text-slate-300 font-medium line-clamp-1" title={day.weatherDesc}>
                    {day.weatherDesc}
                  </span>
                </div>
              </div>

              <div className="mt-2 pt-2.5 border-t border-slate-700/50 space-y-1.5 w-full">
                {/* High / Low temps */}
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="font-bold text-rose-300">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {formatTemp(day.tempMin, unit)}
                  </span>
                </div>

                {/* Rain Probability */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-sky-400">
                    <CloudRain className="w-3 h-3" />
                    <span>Rain</span>
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      day.precipitationProbability >= 50
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {day.precipitationProbability}%
                  </span>
                </div>

                {/* Extra metrics snippet */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span className="flex items-center gap-0.5">
                    <Wind className="w-2.5 h-2.5" />
                    <span>{Math.round(day.windSpeedMax)}k</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Sun className="w-2.5 h-2.5 text-amber-500/70" />
                    <span>UV {Math.round(day.uvIndexMax)}</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
