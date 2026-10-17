import React from 'react';
import { CloudSun, RotateCw } from 'lucide-react';
import { TempUnit } from '../types/weather';

interface HeaderProps {
  unit: TempUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isLoading,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
            <CloudSun className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Weather Intelligence
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('overview')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'overview'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('forecast')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'forecast'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            7-Day Forecast
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'analytics'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Analytics & Charts
          </button>
          <button
            onClick={() => onNavigate('planning')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeSection === 'planning'
                ? 'text-cyan-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Planning & Tips
          </button>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white text-slate-500 transition-colors whitespace-nowrap shrink-0 text-xs"
          >
            Open-Meteo API ↗
          </a>
        </nav>

        {/* Zone 3: Primary Action and Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Unit Toggle Button */}
          <button
            type="button"
            onClick={onToggleUnit}
            title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
            className="flex items-center rounded-lg border border-slate-700 bg-slate-800/80 p-1 text-xs font-medium text-slate-300 hover:border-slate-600 transition-colors whitespace-nowrap shrink-0"
          >
            <span
              className={`px-2 py-1 rounded transition-colors ${
                unit === 'C' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              °C
            </span>
            <span
              className={`px-2 py-1 rounded transition-colors ${
                unit === 'F' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              °F
            </span>
          </button>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh weather data"
            className="p-2 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
