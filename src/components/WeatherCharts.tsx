import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import { DayForecastItem, TempUnit } from '../types/weather';
import { formatTempRaw } from '../utils/recommendations';

interface WeatherChartsProps {
  days: DayForecastItem[];
  unit: TempUnit;
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ days, unit }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'temp' | 'precip'>('both');

  // Prepare chart data
  const chartData = days.map((day) => ({
    name: day.dayName,
    fullDate: day.shortDate,
    maxTemp: formatTempRaw(day.tempMax, unit),
    minTemp: formatTempRaw(day.tempMin, unit),
    precipSum: day.precipitationSum,
    precipProb: day.precipitationProbability,
    windSpeed: Math.round(day.windSpeedMax),
    weatherDesc: day.weatherDesc,
    weatherEmoji: day.weatherEmoji,
  }));

  // Custom Tooltip for Temperature Line Chart
  const CustomTempTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-bold text-white text-sm">
              {item.weatherEmoji} {label} · {item.fullDate}
            </span>
            <span className="text-slate-400">{item.weatherDesc}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Max Temperature:
              </span>
              <span className="font-bold tabular-nums">
                {item.maxTemp}°{unit}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-cyan-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Min Temperature:
              </span>
              <span className="font-bold tabular-nums">
                {item.minTemp}°{unit}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Precipitation Bar Chart
  const CustomPrecipTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-bold text-white text-sm">
              {item.weatherEmoji} {label} · {item.fullDate}
            </span>
            <span className="text-slate-400">{item.weatherDesc}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-blue-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-blue-500" />
                Precipitation Sum:
              </span>
              <span className="font-bold tabular-nums">{item.precipSum} mm</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-cyan-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-cyan-400" />
                Rain Probability:
              </span>
              <span className="font-bold tabular-nums">{item.precipProb}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header & Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Meteorological Trends
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            7-day comparative temperature variance and precipitation metrics
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/90 border border-slate-700 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'both'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Charts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'temp'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('precip')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'precip'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Precipitation
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        className={`grid gap-6 ${
          activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Line Chart: Max & Min Temperature */}
        {(activeTab === 'both' || activeTab === 'temp') && (
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-200">
                Daily Max / Min Temperature (°{unit})
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-rose-400 inline-block" /> Max
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Min
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    domain={['auto', 'auto']}
                    unit={`°`}
                  />
                  <Tooltip content={<CustomTempTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="maxTemp"
                    name="Max Temperature"
                    stroke="#f43f5e"
                    strokeWidth={2.5}
                    dot={{ fill: '#f43f5e', r: 4, strokeWidth: 1.5, stroke: '#0f172a' }}
                    activeDot={{ r: 6, fill: '#f43f5e', stroke: '#ffffff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minTemp"
                    name="Min Temperature"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ fill: '#06b6d4', r: 4, strokeWidth: 1.5, stroke: '#0f172a' }}
                    activeDot={{ r: 6, fill: '#06b6d4', stroke: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Bar Chart: Daily Precipitation (precipitation_sum in mm) */}
        {(activeTab === 'both' || activeTab === 'precip') && (
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-200">
                Daily Precipitation Sum (mm)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Rainfall accumulation
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    unit="mm"
                  />
                  <Tooltip content={<CustomPrecipTooltip />} />
                  <Bar
                    dataKey="precipSum"
                    name="Precipitation Sum"
                    radius={[6, 6, 0, 0]}
                    fill="#3b82f6"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.precipSum > 5
                            ? '#2563eb'
                            : entry.precipSum > 0
                            ? '#38bdf8'
                            : '#1e293b'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
