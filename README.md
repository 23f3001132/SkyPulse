# 🌤️ SkyPulse — Real-Time Weather & Atmospheric Trend Forecasting Platform

🌟 Key Features

# 1. 📊 Interactive Temperature & Humidity Trend Analysis (Core Feature)
- **Multi-Mode 24-Hour Graph (Powered by Chart.js 4.x)**:
  - 🌡️ **Temperature Curve**: Visualizes real-time hourly temperature increases and drops with gradient fills.
  - 💧 **Humidity Curve**: Tracks relative moisture saturation levels throughout the day.
  - 📈 **Temp vs. Humidity (Dual-Axis Correlation View)**: Simultaneous dual Y-axis graph demonstrating how relative humidity drops as temperature rises during peak daylight and rises during night cooling.
  - 🌧️ **Precipitation Probability**: Hourly rain and shower likelihood.
  - 💨 **Wind Speed & Gusts**: Hourly wind variations.
- **Hour-by-Hour Timeline Slider**: Horizontal card slider displaying 24-hour mini-icons, temps, and humidity badges.

# 2. 🔍 Global Search & Geolocation
- **Worldwide Geocoding Auto-complete**: Fast, debounced search suggestions for cities, regions, and countries.
- **GPS "Auto Locate"**: One-click instant location detection via the HTML5 Geolocation API.
- **Popular Location Chips**: Instant access to London, New York, Tokyo, Paris, Dubai, Mumbai, Patna, Sydney, and Singapore.
- **Recent Search History**: Persisted in browser `localStorage`.

# 3. 🔬 Complete Meteorological & Environmental Suite
- 💧 **Humidity Gauge & Dew Point**: Circular SVG progress gauge, mathematical Dew Point computation, and a 4-tier Comfort Level indicator (*Dry, Optimal, Humid, Muggy*).
- 🧭 **Atmospheric Wind & Compass**: Real-time wind speed, gusts, and an interactive 360° rotating compass needle.
- 🫁 **Air Quality Index (AQI)**: US AQI score, health status rating, and breakdown of key pollutants ($PM_{2.5}$, $PM_{10}$, $O_3$, $NO_2$).
- ☀️ **UV Radiation Index**: Real-time UV rating scale (*Low, Moderate, High, Very High, Extreme*) with protective sun advice.
- 🌅 **Solar Horizon Cycle**: Sunrise/sunset times with an astronomical solar arc tracking current sun position.
- ⏱️ **Barometric Pressure & Visibility**: Atmospheric pressure in $hPa$ and visibility distance in $km$/$mi$.

# 4. 🌌 Aesthetic Dynamic Background & 60fps Particle Engine
- **Atmospheric Particle Canvas**:
  - 🌌 **Starry Night**: Twinkling stars with pulsing alphas and periodic **shooting meteors** with gradient light trails.
  - ☀️ **Golden Daylight**: Floating warm sun-dust bokeh particles.
  - 🌧️ **Rain & Thunderstorm**: Smooth falling rain streaks + ambient **lightning flashes**.
  - ❄️ **Arctic Snow**: Floating, gently swaying 3D-depth snowflakes.
- **Multi-Layer Aurora Mesh**: Fluid floating glowing ambient spheres.
- **Interactive Cursor Spotlight**: Smooth glowing aura tracking mouse movements across frosted glass cards.
- **Theme Selector Pill**: Manual toggle between *Auto (Weather)*, *Starry Night*, *Azure Daylight*, *Rainy Mood*, *Storm Violet*, and *Arctic Frost*.

---

# 🛠️ Tech Stack
┌──────────────────────────────────────────────────────────┐ │ FRONTEND / UI LAYER │ │ HTML5 • Vanilla CSS3 (Glassmorphism) • JavaScript │ ├──────────────────────────────────────────────────────────┤ │ DATA VISUALIZATION & GRAPHICS ENGINE │ │ Chart.js 4.x (Dual-Axis Trends) • HTML5 Canvas 2D │ ├──────────────────────────────────────────────────────────┤ │ BACKEND LAYER │ │ Python 3.12 • Flask 3.x REST API Server │ ├──────────────────────────────────────────────────────────┤ │ METEOROLOGICAL DATA & APIS │ │ Open-Meteo Weather API • Geocoding API • AQI API │ └──────────────────────────────────────────────────────────┘


