# Weather Intelligence App

A high-performance, real-time meteorological forecasting and activity planning application built with React, TypeScript, Vite, and Tailwind CSS. The app interfaces directly with the Open-Meteo Public API without requiring API keys, server backends, or secrets.

---

## Features

- **Global City Search**: Search any global city by name with geocoding powered by Open-Meteo, with Enter key support, instant quick-pick city buttons, and matching location disambiguation.
- **Current Weather Card**: Displays city, country, temperature (°C/°F), feels-like temperature, relative humidity, wind speed, precipitation, today's high/low, and WMO weather interpretation codes mapped to descriptions and emojis.
- **7-Day Meteorological Forecast**: Day-by-day forecast cards detailing maximum and minimum temperatures, weather emojis/descriptions, rain probability percentages, and peak wind speeds.
- **Interactive Meteorological Charts (Recharts)**:
  - **Temperature Spectrum (Line Chart)**: Dual trends visualizing daily maximum and minimum temperatures across the 7-day forecast.
  - **Precipitation Accumulation (Bar Chart)**: Daily precipitation sums (mm) and rain probability.
- **Intelligent Planning & Activity Advisory**:
  - Rule-based decision engine evaluating rain probability (≥ 50% → carry an umbrella), heat/UV index (≥ 35°C or UV ≥ 8 → stay hydrated / avoid midday sun), low temperature (≤ 10°C → carry a jacket), high wind (≥ 40 km/h → strong wind caution), or "Good day for outdoor plans".
  - **Best Day for Outdoor Activities**: Algorithmic scoring that calculates the optimal day of the week for outdoor activities, sports, and recreation.
- **Unit Conversion**: Seamless client-side toggling between Celsius (°C) and Fahrenheit (°F).
- **Resilient Error States**: Clear contextual error handling for city not found, network timeouts, and empty inputs with responsive loading feedback.

---

## Data Source

All weather data is fetched client-side from the free Open-Meteo API (CC-BY 4.0):
- **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json`
- **Forecast API**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=7`

---

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the app.

### 3. Build for Production
```bash
npm run build
```
The compiled, optimized production bundle will be generated in the `dist` folder.

### 4. Preview Production Build
```bash
npm run preview
```

---

## Deployment Steps

Deploying via **Google AI Studio → GitHub → Cloudflare Pages**:

1. **Connect to GitHub**:
   - In Google AI Studio, push or export the project repository directly to your connected GitHub account.
2. **Set Up Cloudflare Pages**:
   - Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select the GitHub repository you created.
3. **Configure Build Settings**:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (default)
4. **Deploy**:
   - Click **Save and Deploy**.
   - Cloudflare Pages will build the application and deploy it to a global edge CDN with single-page application routing handled by `public/_redirects` (`/* /index.html 200`).
