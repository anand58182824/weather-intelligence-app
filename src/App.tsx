import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  CurrentWeatherDisplay,
  DayForecastItem,
  GeocodingResult,
  RecommendationSummary,
  TempUnit,
} from './types/weather';
import { searchCities, fetchForecast, WeatherApiError } from './services/weatherApi';
import { buildRecommendations } from './utils/recommendations';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCards } from './components/ForecastCards';
import { WeatherCharts } from './components/WeatherCharts';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { Footer } from './components/Footer';

export default function App() {
  const [currentCityName, setCurrentCityName] = useState<string>('Chennai');
  const [currentLocation, setCurrentLocation] = useState<GeocodingResult | null>(null);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherDisplay | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DayForecastItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationSummary | null>(null);

  const [unit, setUnit] = useState<TempUnit>('C');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // References for section scrolling
  const overviewRef = useRef<HTMLDivElement>(null);
  const forecastRef = useRef<HTMLDivElement>(null);
  const analyticsRef = useRef<HTMLDivElement>(null);
  const planningRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    let targetRef: React.RefObject<HTMLDivElement | null> | null = null;
    if (section === 'overview') targetRef = overviewRef;
    if (section === 'forecast') targetRef = forecastRef;
    if (section === 'analytics') targetRef = analyticsRef;
    if (section === 'planning') targetRef = planningRef;

    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Core weather fetcher given a city query
  const loadWeatherData = useCallback(async (query: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Step 1: Geocoding
      const results = await searchCities(query);
      setSearchResults(results);
      const topResult = results[0];
      setCurrentLocation(topResult);
      setCurrentCityName(topResult.name);

      // Step 2: Forecast
      const { current, daily } = await fetchForecast(topResult);
      setCurrentWeather(current);
      setDailyForecast(daily);

      // Step 3: Compute Rule-Based Planning & Recommendations
      const reco = buildRecommendations(daily);
      setRecommendations(reco);
    } catch (err: any) {
      console.error('Weather load error:', err);
      if (err instanceof WeatherApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Unable to fetch weather data right now. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handler when selecting a specific location from multiple geocoding results
  const handleSelectLocation = async (loc: GeocodingResult) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentLocation(loc);
    setCurrentCityName(loc.name);

    try {
      const { current, daily } = await fetchForecast(loc);
      setCurrentWeather(current);
      setDailyForecast(daily);
      const reco = buildRecommendations(daily);
      setRecommendations(reco);
    } catch (err: any) {
      console.error('Weather fetch error for selected location:', err);
      setErrorMessage('Unable to fetch weather data right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load: Chennai
  useEffect(() => {
    loadWeatherData('Chennai');
  }, [loadWeatherData]);

  // Toggle °C / °F
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  // Refresh current city
  const handleRefresh = () => {
    if (currentLocation) {
      handleSelectLocation(currentLocation);
    } else {
      loadWeatherData(currentCityName);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Top Bar Contract Navigation */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Search & Location Bar */}
        <section aria-label="City search section">
          <SearchBar
            onSearch={loadWeatherData}
            onSelectResult={handleSelectLocation}
            isLoading={isLoading}
            errorMessage={errorMessage}
            currentCity={currentCityName}
            searchResults={searchResults}
          />
        </section>

        {/* Loading Spinner for full load if no weather loaded yet */}
        {isLoading && !currentWeather && (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
            <p className="text-sm font-medium">Fetching real-time atmospheric data from Open-Meteo...</p>
          </div>
        )}

        {/* Main Content Area */}
        {currentWeather && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* 1. Overview Section: Current Weather Card */}
            <section ref={overviewRef} id="overview" className="scroll-mt-20">
              <CurrentWeatherCard weather={currentWeather} unit={unit} />
            </section>

            {/* 2. 7-Day Forecast Section */}
            {dailyForecast.length > 0 && (
              <section ref={forecastRef} id="forecast" className="scroll-mt-20">
                <ForecastCards days={dailyForecast} unit={unit} />
              </section>
            )}

            {/* 3. Analytics & Recharts Section */}
            {dailyForecast.length > 0 && (
              <section ref={analyticsRef} id="analytics" className="scroll-mt-20">
                <WeatherCharts days={dailyForecast} unit={unit} />
              </section>
            )}

            {/* 4. Intelligent Planning & Rule-Based Recommendations */}
            {recommendations && dailyForecast.length > 0 && (
              <section ref={planningRef} id="planning" className="scroll-mt-20">
                <PlanningRecommendations
                  recommendations={recommendations}
                  days={dailyForecast}
                  unit={unit}
                />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <Footer />
    </div>
  );
}
