import React from 'react';
import {
  Sparkles,
  Umbrella,
  Sun,
  ShieldAlert,
  Wind,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Shirt,
} from 'lucide-react';
import { DayForecastItem, RecommendationSummary, TempUnit } from '../types/weather';
import { formatTemp } from '../utils/recommendations';

interface PlanningRecommendationsProps {
  recommendations: RecommendationSummary;
  days: DayForecastItem[];
  unit: TempUnit;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
  days,
  unit,
}) => {
  const { bestDay, todayTips, alerts, weekOverview } = recommendations;

  // Icon mapping for tips
  const renderTipIcon = (tip: string) => {
    if (tip.includes('umbrella')) {
      return <Umbrella className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />;
    }
    if (tip.includes('hydrated') || tip.includes('sun')) {
      return <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
    }
    if (tip.includes('jacket')) {
      return <Shirt className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
    }
    if (tip.includes('wind')) {
      return <Wind className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          Intelligent Planning & Activity Advisory
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Algorithmic rules and conditions-based recommendations for outdoor and travel scheduling
        </p>
      </div>

      {/* Grid: Best Day Crown + Today's Rule Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Best Day for Outdoor Activities Hero Card */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-slate-800/90 via-slate-800 to-slate-900 border border-amber-500/30 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Header label (Zero-pill: clean typography with separator) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TOP OUTDOOR RECOMMENDATION</span>
              <span aria-hidden="true">·</span>
              <span>INDEX: {bestDay.score}/100</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {bestDay.dayName}, {bestDay.shortDate}
                </h3>
                <p className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-2">
                  <span className="text-xl select-none">{bestDay.weatherEmoji}</span>
                  <span>{bestDay.weatherDesc}</span>
                </p>
              </div>

              {/* Day stats badge */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">TEMP RANGE</span>
                  <span className="font-bold text-white tabular-nums">
                    {formatTemp(bestDay.tempMax, unit)} / {formatTemp(bestDay.tempMin, unit)}
                  </span>
                </div>
                <div className="border-l border-slate-700 pl-4">
                  <span className="text-slate-400 block text-[10px]">RAIN CHANCE</span>
                  <span className="font-bold text-cyan-300 tabular-nums">
                    {bestDay.precipitationProbability}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
              {weekOverview}
            </p>
          </div>

          {/* Activities suggested */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center flex-wrap gap-2 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Recommended for:</span>
            <span>Jogging & Running</span>
            <span aria-hidden="true">·</span>
            <span>Cycling & Commuting</span>
            <span aria-hidden="true">·</span>
            <span>Outdoor Dining & Parks</span>
            <span aria-hidden="true">·</span>
            <span>Photography</span>
          </div>
        </div>

        {/* Today's Actionable Rule Guidance */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 font-mono tracking-wider mb-3">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>TODAY'S RULE GUIDANCE</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              Daily Action Checklist
            </h3>

            <div className="space-y-2.5">
              {todayTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                >
                  {renderTipIcon(tip)}
                  <span className="font-medium leading-tight">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-400 font-mono">
            Evaluated against WMO criteria & Open-Meteo thresholds
          </div>
        </div>
      </div>

      {/* Week Overview Alerts Strip */}
      {alerts.length > 0 && (
        <div className="rounded-2xl bg-slate-800/70 border border-slate-700/70 p-5 shadow-lg space-y-3">
          <span className="text-xs font-semibold tracking-wider text-slate-400 font-mono block">
            WEEKLY CONDITIONS ADVISORIES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert, idx) => {
              const borderClass =
                alert.severity === 'alert'
                  ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
                  : alert.severity === 'warning'
                  ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200'
                  : alert.severity === 'success'
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                  : 'border-blue-500/40 bg-blue-950/20 text-blue-200';

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${borderClass} flex items-start gap-3`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
                      {alert.title}
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90">
                      {alert.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7-Day Rule Decision Matrix */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-lg overflow-x-auto">
        <span className="text-xs font-semibold tracking-wider text-slate-400 font-mono block mb-3">
          7-DAY ACTIVITY MATRIX & ADVISORY DETAILS
        </span>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700/80 text-slate-400 font-mono">
              <th className="pb-2 font-medium">Day</th>
              <th className="pb-2 font-medium">Condition</th>
              <th className="pb-2 font-medium">Temp Range</th>
              <th className="pb-2 font-medium">Rain Prob</th>
              <th className="pb-2 font-medium">Wind</th>
              <th className="pb-2 font-medium">Outdoor Index</th>
              <th className="pb-2 font-medium">Rule Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {days.map((day) => (
              <tr
                key={day.date}
                className={`transition-colors ${
                  day.isBestDay ? 'bg-amber-500/10' : 'hover:bg-slate-700/40'
                }`}
              >
                <td className="py-2.5 font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    {day.dayName}
                    {day.isBestDay && (
                      <span className="text-[10px] text-amber-400 font-sans font-semibold">
                        (Best)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 text-slate-300 font-sans">
                  <span className="mr-1.5">{day.weatherEmoji}</span>
                  {day.weatherDesc}
                </td>
                <td className="py-2.5 tabular-nums text-slate-300">
                  {formatTemp(day.tempMax, unit)} / {formatTemp(day.tempMin, unit)}
                </td>
                <td className="py-2.5 tabular-nums text-cyan-300">
                  {day.precipitationProbability}%
                </td>
                <td className="py-2.5 tabular-nums text-slate-300">
                  {Math.round(day.windSpeedMax)} km/h
                </td>
                <td className="py-2.5 tabular-nums">
                  <span
                    className={`font-bold ${
                      day.score >= 80
                        ? 'text-emerald-400'
                        : day.score >= 60
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {day.score}/100
                  </span>
                </td>
                <td className="py-2.5 text-slate-300 font-sans text-xs">
                  {day.tips.join(' · ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
