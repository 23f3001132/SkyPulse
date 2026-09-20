# 🌤️ SkyPulse — Real-Time Weather & Atmospheric Trend Forecasting Platform

<<<<<<< HEAD
<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <strong>An ultra-aesthetic, responsive, full-stack meteorological web application delivering real-time weather forecasts, dual-axis temperature-humidity trend analytics, 60fps dynamic atmospheric canvas particles, and comprehensive air quality metrics.</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture--data-flow">Architecture</a> •
  <a href="#-mathematical-models--formulas">Mathematical Models</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a>
</p>

---

## 🌟 Key Features

### 1. 📊 Interactive Temperature & Humidity Trend Analysis (Core Feature)
=======
🌟 Key Features

# 1. 📊 Interactive Temperature & Humidity Trend Analysis (Core Feature)
>>>>>>> 0472e3ae8a805d132d0aab6e8ec533dde7071a59
- **Multi-Mode 24-Hour Graph (Powered by Chart.js 4.x)**:
  - 🌡️ **Temperature Curve**: Visualizes real-time hourly temperature increases and drops with gradient fills.
  - 💧 **Humidity Curve**: Tracks relative moisture saturation levels throughout the day.
  - 📈 **Temp vs. Humidity (Dual-Axis Correlation View)**: Simultaneous dual Y-axis graph demonstrating how relative humidity drops as temperature rises during peak daylight and rises during night cooling.
  - 🌧️ **Precipitation Probability**: Hourly rain and shower likelihood.
  - 💨 **Wind Speed & Gusts**: Hourly wind variations.
- **Hour-by-Hour Timeline Slider**: Horizontal card slider displaying 24-hour mini-icons, temps, and humidity badges.

<<<<<<< HEAD
### 2. 🔍 Global Search & Geolocation
=======
# 2. 🔍 Global Search & Geolocation
>>>>>>> 0472e3ae8a805d132d0aab6e8ec533dde7071a59
- **Worldwide Geocoding Auto-complete**: Fast, debounced search suggestions for cities, regions, and countries.
- **GPS "Auto Locate"**: One-click instant location detection via the HTML5 Geolocation API.
- **Popular Location Chips**: Instant access to London, New York, Tokyo, Paris, Dubai, Mumbai, Patna, Sydney, and Singapore.
- **Recent Search History**: Persisted in browser `localStorage`.

<<<<<<< HEAD
### 3. 🔬 Complete Meteorological & Environmental Suite
=======
# 3. 🔬 Complete Meteorological & Environmental Suite
>>>>>>> 0472e3ae8a805d132d0aab6e8ec533dde7071a59
- 💧 **Humidity Gauge & Dew Point**: Circular SVG progress gauge, mathematical Dew Point computation, and a 4-tier Comfort Level indicator (*Dry, Optimal, Humid, Muggy*).
- 🧭 **Atmospheric Wind & Compass**: Real-time wind speed, gusts, and an interactive 360° rotating compass needle.
- 🫁 **Air Quality Index (AQI)**: US AQI score, health status rating, and breakdown of key pollutants ($PM_{2.5}$, $PM_{10}$, $O_3$, $NO_2$).
- ☀️ **UV Radiation Index**: Real-time UV rating scale (*Low, Moderate, High, Very High, Extreme*) with protective sun advice.
- 🌅 **Solar Horizon Cycle**: Sunrise/sunset times with an astronomical solar arc tracking current sun position.
- ⏱️ **Barometric Pressure & Visibility**: Atmospheric pressure in $hPa$ and visibility distance in $km$/$mi$.

<<<<<<< HEAD
### 4. 🌌 Aesthetic Dynamic Background & 60fps Particle Engine
=======
# 4. 🌌 Aesthetic Dynamic Background & 60fps Particle Engine
>>>>>>> 0472e3ae8a805d132d0aab6e8ec533dde7071a59
- **Atmospheric Particle Canvas**:
  - 🌌 **Starry Night**: Twinkling stars with pulsing alphas and periodic **shooting meteors** with gradient light trails.
  - ☀️ **Golden Daylight**: Floating warm sun-dust bokeh particles.
  - 🌧️ **Rain & Thunderstorm**: Smooth falling rain streaks + ambient **lightning flashes**.
  - ❄️ **Arctic Snow**: Floating, gently swaying 3D-depth snowflakes.
- **Multi-Layer Aurora Mesh**: Fluid floating glowing ambient spheres.
- **Interactive Cursor Spotlight**: Smooth glowing aura tracking mouse movements across frosted glass cards.
- **Theme Selector Pill**: Manual toggle between *Auto (Weather)*, *Starry Night*, *Azure Daylight*, *Rainy Mood*, *Storm Violet*, and *Arctic Frost*.

---

<<<<<<< HEAD
## 🛠️ Tech Stack

```
┌──────────────────────────────────────────────────────────┐
│                   FRONTEND / UI LAYER                    │
│   HTML5  •  Vanilla CSS3 (Glassmorphism)  •  JavaScript   │
├──────────────────────────────────────────────────────────┤
│           DATA VISUALIZATION & GRAPHICS ENGINE           │
│     Chart.js 4.x (Dual-Axis Trends)  •  HTML5 Canvas 2D   │
├──────────────────────────────────────────────────────────┤
│                     BACKEND LAYER                        │
│          Python 3.12  •  Flask 3.x REST API Server       │
├──────────────────────────────────────────────────────────┤
│             METEOROLOGICAL DATA & APIS                   │
│    Open-Meteo Weather API  •  Geocoding API  •  AQI API  │
└──────────────────────────────────────────────────────────┘
```

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Python 3.12, Flask 3.x | RESTful API routing, data normalization, and mathematical formulas |
| **Frontend UI** | HTML5, Vanilla CSS3 | Custom Frosted Glassmorphism, CSS Grid & Flexbox, responsive layouts |
| **Data Viz** | JavaScript (ES6+), Chart.js 4.x | Interactive dual-axis line charts and smooth hourly curves |
| **Graphics** | HTML5 Canvas API | Lightweight 60fps particle engine (meteors, rain, snow, sun-dust) |
| **APIs** | Open-Meteo REST APIs | Global weather forecasts, geocoding autocomplete, air quality indices |

---

## 📐 Mathematical Models & Formulas

### 1. Dew Point Calculation (Magnus-Tetens Formula)
The temperature at which water vapor in air condenses into liquid dew is computed using the **Magnus-Tetens approximation**:

$$\alpha(T, RH) = \frac{a \cdot T}{b + T} + \ln\left(\frac{RH}{100}\right)$$

$$T_{\text{dew}} = \frac{b \cdot \alpha(T, RH)}{a - \alpha(T, RH)}$$

*Where:*
- $T$ = Ambient temperature in Celsius ($^\circ\text{C}$)
- $RH$ = Relative Humidity ($0 - 100\%$)
- Empirical constants: $a = 17.27$, $b = 237.7^\circ\text{C}$

### 2. Relative Humidity Comfort Index
Atmospheric moisture comfort is categorized based on ambient temperature and relative humidity:
- **Dry**: $RH < 30\%$ (Low moisture; hydration & moisturizing suggested)
- **Optimal**: $30\% \le RH \le 60\%$ (Pleasant atmospheric comfort for outdoor activities)
- **Humid**: $60\% < RH \le 80\%$ (Noticeable moisture; dress lightly)
- **Very Muggy**: $RH > 80\%$ (High perspiration retention; feels warmer than actual temperature)

### 3. Solar Arc Daylight Trajectory
Sun elevation along the horizon is calculated dynamically:
$$\text{Progress} = \frac{T_{\text{current}} - T_{\text{sunrise}}}{T_{\text{sunset}} - T_{\text{sunrise}}} \quad (\text{for } T_{\text{sunrise}} \le T_{\text{current}} \le T_{\text{sunset}})$$
$$\text{Arc Position: } (X, Y) = \left( 10 + \text{Progress} \times 80,\; 40 - \sin(\text{Progress} \cdot \pi) \times 35 \right)$$

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher installed on your system.
- Git (optional).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SkyPulse-Weather.git
cd SkyPulse-Weather
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch the Application
```bash
python app.py
```

### 4. Open in Browser
Visit **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in any modern web browser.

---

## 🔌 API Reference

### 1. Fetch Weather Data
`GET /api/weather`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `city` | `string` | Optional | `London` | Name of the city to query |
| `lat` | `float` | Optional | — | Latitude coordinate |
| `lon` | `float` | Optional | — | Longitude coordinate |
| `units` | `string` | Optional | `metric` | Unit system: `metric` (°C, km/h) or `imperial` (°F, mph) |

**Sample Response:**
```json
{
  "location": {
    "name": "Patna",
    "country": "India",
    "lat": 25.60,
    "lon": 85.12,
    "timezone": "Asia/Kolkata"
  },
  "units": { "system": "metric", "temp": "°C", "wind": "km/h" },
  "current": {
    "temp": 28.4,
    "feels_like": 35.2,
    "humidity": 86,
    "dew_point": 25.8,
    "comfort": { "level": "Very Muggy", "color": "#ef4444" },
    "weather_label": "Clear sky",
    "wind_speed": 3.2,
    "uv_index": 0.0,
    "aqi": { "value": 38, "status": "Good" }
  },
  "hourly_timeline": [...],
  "chart_data": { "labels": [...], "temperatures": [...], "humidity": [...] },
  "daily_forecast": [...]
}
```

### 2. Geocoding City Search
`GET /api/search?q={query}`

**Sample Response:**
```json
[
  {
    "id": 1260086,
    "name": "Patna",
    "display_name": "Patna, Bihar, India",
    "country": "India",
    "country_code": "IN",
    "latitude": 25.6022,
    "longitude": 85.1194
  }
]
```

---

## 📁 Project Structure

```
SkyPulse-Weather/
├── app.py                  # Flask backend REST API & meteorological calculations
├── requirements.txt        # Python package dependencies (Flask, requests)
├── README.md               # Project documentation & reference guide
├── templates/
│   └── index.html          # Semantic HTML5 UI layout & canvas backdrop
└── static/
    ├── css/
    │   └── style.css       # Custom Glassmorphism styles, themes, responsive grid
    └── js/
        └── app.js          # Chart.js graphs, 60fps particle engine, search autocomplete
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/SkyPulse-Weather/issues).

---

## 📜 License
This project is open-source and available under the **[MIT License](LICENSE)**.

---

<p align="center">
  Developed with ❤️ using <strong>Python Flask</strong> and <strong>Modern Vanilla JavaScript</strong>.
</p>
=======
# 🛠️ Tech Stack
┌──────────────────────────────────────────────────────────┐ │ FRONTEND / UI LAYER │ │ HTML5 • Vanilla CSS3 (Glassmorphism) • JavaScript │ ├──────────────────────────────────────────────────────────┤ │ DATA VISUALIZATION & GRAPHICS ENGINE │ │ Chart.js 4.x (Dual-Axis Trends) • HTML5 Canvas 2D │ ├──────────────────────────────────────────────────────────┤ │ BACKEND LAYER │ │ Python 3.12 • Flask 3.x REST API Server │ ├──────────────────────────────────────────────────────────┤ │ METEOROLOGICAL DATA & APIS │ │ Open-Meteo Weather API • Geocoding API • AQI API │ └──────────────────────────────────────────────────────────┘


>>>>>>> 0472e3ae8a805d132d0aab6e8ec533dde7071a59
