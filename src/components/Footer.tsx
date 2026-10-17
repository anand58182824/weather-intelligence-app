import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Weather Intelligence</span>
          <span aria-hidden="true">·</span>
          <span>Client-side Open-Meteo Integration</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition-colors"
          >
            Open-Meteo Data Source (CC-BY 4.0)
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://wmo.int/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition-colors"
          >
            WMO Standard Codes
          </a>
        </div>
      </div>
    </footer>
  );
};
