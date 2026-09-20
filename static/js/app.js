/**
 * SkyPulse Weather Forecast - Frontend Application Logic & Aesthetic Background Engine
 * Interactive Chart.js graphs, Open-Meteo API integrations, 60fps Particle Canvas, and Dynamic Theming.
 */

// Global State
const state = {
    city: localStorage.getItem('skypulse_last_city') || 'London',
    coords: null,
    units: localStorage.getItem('skypulse_units') || 'metric',
    themeMode: localStorage.getItem('skypulse_theme_mode') || 'auto',
    weatherData: null,
    activeChartTab: 'temp',
    chartInstance: null,
    searchDebounceTimer: null,
    currentParticleMode: 'stars',
    canvasAnimationId: null
};

// Weather icon helper mapping to FontAwesome icons
const WEATHER_ICON_MAP = {
    'clear': { day: 'fa-sun text-amber', night: 'fa-moon text-cyan' },
    'mainly-clear': { day: 'fa-cloud-sun text-amber', night: 'fa-cloud-moon text-cyan' },
    'partly-cloudy': { day: 'fa-cloud-sun text-amber', night: 'fa-cloud-moon text-cyan' },
    'overcast': { day: 'fa-cloud text-blue', night: 'fa-cloud text-blue' },
    'fog': { day: 'fa-smog text-teal', night: 'fa-smog text-teal' },
    'drizzle': { day: 'fa-cloud-rain text-blue', night: 'fa-cloud-rain text-blue' },
    'rain': { day: 'fa-cloud-showers-heavy text-blue', night: 'fa-cloud-showers-heavy text-blue' },
    'heavy-rain': { day: 'fa-cloud-showers-water text-indigo', night: 'fa-cloud-showers-water text-indigo' },
    'showers': { day: 'fa-cloud-sun-rain text-cyan', night: 'fa-cloud-moon-rain text-cyan' },
    'freezing-rain': { day: 'fa-icicles text-cyan', night: 'fa-icicles text-cyan' },
    'snow': { day: 'fa-snowflake text-cyan', night: 'fa-snowflake text-cyan' },
    'heavy-snow': { day: 'fa-snowman text-cyan', night: 'fa-snowman text-cyan' },
    'thunderstorm': { day: 'fa-bolt-lightning text-amber', night: 'fa-bolt-lightning text-purple' },
    'thunder-hail': { day: 'fa-cloud-bolt text-rose', night: 'fa-cloud-bolt text-rose' },
    'cloudy': { day: 'fa-cloud text-blue', night: 'fa-cloud text-blue' }
};

// DOM Element References
const elements = {
    // Search & Header
    searchInput: document.getElementById('citySearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    geoBtn: document.getElementById('geoBtn'),
    suggestionsDropdown: document.getElementById('suggestionsDropdown'),
    unitMetric: document.getElementById('unitMetric'),
    unitImperial: document.getElementById('unitImperial'),
    themeSelector: document.getElementById('themeSelector'),
    refreshBtn: document.getElementById('refreshBtn'),
    popularChips: document.getElementById('popularChips'),
    recentChipsWrapper: document.getElementById('recentChipsWrapper'),
    recentChips: document.getElementById('recentChips'),
    loadingState: document.getElementById('loadingState'),
    errorToast: document.getElementById('errorToast'),
    errorMessage: document.getElementById('errorMessage'),
    closeErrorToast: document.getElementById('closeErrorToast'),
    mainDashboard: document.getElementById('mainDashboard'),

    // Background Canvas & Glows
    weatherCanvas: document.getElementById('weatherCanvas'),
    cursorGlow: document.getElementById('cursorGlow'),

    // Hero Card
    locName: document.getElementById('locName'),
    locCountry: document.getElementById('locCountry'),
    locTime: document.getElementById('locTime'),
    locTimezone: document.getElementById('locTimezone'),
    conditionBadge: document.getElementById('conditionBadge'),
    conditionLabel: document.getElementById('conditionLabel'),
    currentTemp: document.getElementById('currentTemp'),
    feelsLikeTemp: document.getElementById('feelsLikeTemp'),
    dayMinTemp: document.getElementById('dayMinTemp'),
    dayMaxTemp: document.getElementById('dayMaxTemp'),
    conditionDescription: document.getElementById('conditionDescription'),
    heroWeatherIcon: document.getElementById('heroWeatherIcon'),
    stripHumidity: document.getElementById('stripHumidity'),
    stripWind: document.getElementById('stripWind'),
    stripRain: document.getElementById('stripRain'),
    stripUV: document.getElementById('stripUV'),

    // Insight Banner
    insightText: document.getElementById('insightText'),

    // Chart & Hourly Timeline
    trendChartCanvas: document.getElementById('trendChartCanvas'),
    trendTabs: document.querySelectorAll('.trend-tab'),
    hourlySlider: document.getElementById('hourlySlider'),
    slideLeftBtn: document.getElementById('slideLeftBtn'),
    slideRightBtn: document.getElementById('slideRightBtn'),
    sumPeakTemp: document.getElementById('sumPeakTemp'),
    sumLowTemp: document.getElementById('sumLowTemp'),
    sumAvgHumidity: document.getElementById('sumAvgHumidity'),
    sumMaxRain: document.getElementById('sumMaxRain'),

    // 7-Day Forecast
    dailyForecastList: document.getElementById('dailyForecastList'),

    // Side Cards
    comfortBadge: document.getElementById('comfortBadge'),
    gaugeHumidityVal: document.getElementById('gaugeHumidityVal'),
    humidityRing: document.getElementById('humidityRing'),
    dewPointVal: document.getElementById('dewPointVal'),
    comfortLevelText: document.getElementById('comfortLevelText'),
    comfortPin: document.getElementById('comfortPin'),
    humidityAdvice: document.getElementById('humidityAdvice'),
    windLabel: document.getElementById('windLabel'),
    compassPointer: document.getElementById('compassPointer'),
    compassBearingText: document.getElementById('compassBearingText'),
    windSpeedVal: document.getElementById('windSpeedVal'),
    windGustsVal: document.getElementById('windGustsVal'),
    aqiBadge: document.getElementById('aqiBadge'),
    aqiScore: document.getElementById('aqiScore'),
    aqiStatusText: document.getElementById('aqiStatusText'),
    pm25Val: document.getElementById('pm25Val'),
    pm10Val: document.getElementById('pm10Val'),
    o3Val: document.getElementById('o3Val'),
    no2Val: document.getElementById('no2Val'),
    uvVal: document.getElementById('uvVal'),
    uvBadge: document.getElementById('uvBadge'),
    uvBarFill: document.getElementById('uvBarFill'),
    uvTip: document.getElementById('uvTip'),
    sunDot: document.getElementById('sunDot'),
    sunriseTime: document.getElementById('sunriseTime'),
    sunsetTime: document.getElementById('sunsetTime'),
    pressureVal: document.getElementById('pressureVal'),
    visibilityVal: document.getElementById('visibilityVal')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    initUnitToggle();
    initThemeSelector();
    initAestheticBackgroundEngine();
    renderRecentSearches();
    fetchWeatherData({ city: state.city });
});

/**
 * Event Listeners Setup
 */
function initEventListeners() {
    // City Search Input (Debounced)
    elements.searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        elements.clearSearchBtn.classList.toggle('hidden', val.length === 0);
        
        clearTimeout(state.searchDebounceTimer);
        if (val.length >= 2) {
            state.searchDebounceTimer = setTimeout(() => searchCities(val), 300);
        } else {
            elements.suggestionsDropdown.classList.add('hidden');
        }
    });

    // Enter Key Search
    elements.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = elements.searchInput.value.trim();
            if (val) {
                elements.suggestionsDropdown.classList.add('hidden');
                fetchWeatherData({ city: val });
            }
        }
    });

    // Clear Search Input
    elements.clearSearchBtn.addEventListener('click', () => {
        elements.searchInput.value = '';
        elements.clearSearchBtn.classList.add('hidden');
        elements.suggestionsDropdown.classList.add('hidden');
        elements.searchInput.focus();
    });

    // Auto Geolocation
    elements.geoBtn.addEventListener('click', handleGeolocation);

    // Refresh Button
    elements.refreshBtn.addEventListener('click', () => {
        elements.refreshBtn.classList.add('rotating');
        if (state.coords) {
            fetchWeatherData({ lat: state.coords.lat, lon: state.coords.lon });
        } else {
            fetchWeatherData({ city: state.city });
        }
        setTimeout(() => elements.refreshBtn.classList.remove('rotating'), 1000);
    });

    // Close error toast
    elements.closeErrorToast.addEventListener('click', () => {
        elements.errorToast.classList.add('hidden');
    });

    // Quick Popular City Chips
    elements.popularChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (chip) {
            const city = chip.getAttribute('data-city');
            state.coords = null;
            fetchWeatherData({ city });
        }
    });

    // Recent Search Chips
    elements.recentChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (chip) {
            const city = chip.getAttribute('data-city');
            state.coords = null;
            fetchWeatherData({ city });
        }
    });

    // Trend Chart Tab Switching
    elements.trendTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.trendTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.activeChartTab = tab.getAttribute('data-chart');
            renderTrendChart();
        });
    });

    // Hourly Slider Nav Buttons
    elements.slideLeftBtn.addEventListener('click', () => {
        elements.hourlySlider.scrollBy({ left: -260, behavior: 'smooth' });
    });
    elements.slideRightBtn.addEventListener('click', () => {
        elements.hourlySlider.scrollBy({ left: 260, behavior: 'smooth' });
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            elements.suggestionsDropdown.classList.add('hidden');
        }
    });
}

/**
 * Units System Toggle (°C / °F)
 */
function initUnitToggle() {
    if (state.units === 'imperial') {
        elements.unitImperial.classList.add('active');
        elements.unitMetric.classList.remove('active');
    } else {
        elements.unitMetric.classList.add('active');
        elements.unitImperial.classList.remove('active');
    }

    elements.unitMetric.addEventListener('click', () => {
        if (state.units !== 'metric') {
            setUnits('metric');
        }
    });

    elements.unitImperial.addEventListener('click', () => {
        if (state.units !== 'imperial') {
            setUnits('imperial');
        }
    });
}

function setUnits(newUnit) {
    state.units = newUnit;
    localStorage.setItem('skypulse_units', newUnit);
    elements.unitMetric.classList.toggle('active', newUnit === 'metric');
    elements.unitImperial.classList.toggle('active', newUnit === 'imperial');

    if (state.coords) {
        fetchWeatherData({ lat: state.coords.lat, lon: state.coords.lon });
    } else {
        fetchWeatherData({ city: state.city });
    }
}

/**
 * Theme Selector Dropdown
 */
function initThemeSelector() {
    if (elements.themeSelector) {
        elements.themeSelector.value = state.themeMode;
        elements.themeSelector.addEventListener('change', (e) => {
            state.themeMode = e.target.value;
            localStorage.setItem('skypulse_theme_mode', state.themeMode);
            applyThemeAtmosphere();
        });
    }
}

function applyThemeAtmosphere() {
    if (state.themeMode !== 'auto') {
        switch (state.themeMode) {
            case 'night':
                setThemeMode('theme-clear-night', 'stars');
                break;
            case 'day':
                setThemeMode('theme-clear-day', 'sun');
                break;
            case 'rain':
                setThemeMode('theme-rainy', 'rain');
                break;
            case 'thunder':
                setThemeMode('theme-thunder', 'thunder');
                break;
            case 'snow':
                setThemeMode('theme-snowy', 'snow');
                break;
        }
    } else if (state.weatherData) {
        updateWeatherTheme(state.weatherData.current.weather_code, state.weatherData.current.is_day);
    }
}

function setThemeMode(themeClass, particleMode) {
    document.body.className = themeClass;
    setParticleMode(particleMode);
}

/**
 * HTML5 Geolocation Detection
 */
function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    elements.geoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Locating...</span>';
    navigator.geolocation.getCurrentPosition(
        (position) => {
            elements.geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> <span>Auto Locate</span>';
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            state.coords = { lat, lon };
            fetchWeatherData({ lat, lon });
        },
        (err) => {
            elements.geoBtn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> <span>Auto Locate</span>';
            showError(`Unable to retrieve GPS location (${err.message}).`);
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

/**
 * City Search Geocoding Autocomplete
 */
async function searchCities(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) return;
        const results = await response.json();

        if (!results || results.length === 0) {
            elements.suggestionsDropdown.innerHTML = '<div class="suggestion-item"><span>No matching cities found</span></div>';
            elements.suggestionsDropdown.classList.remove('hidden');
            return;
        }

        elements.suggestionsDropdown.innerHTML = results.map(item => `
            <div class="suggestion-item" data-lat="${item.latitude}" data-lon="${item.longitude}" data-name="${item.name}" data-country="${item.country_code}">
                <div>
                    <span class="suggestion-city">${item.name}</span>
                    <span class="suggestion-sub"> ${item.admin1 ? item.admin1 + ', ' : ''}${item.country}</span>
                </div>
                <span class="country-tag">${item.country_code}</span>
            </div>
        `).join('');

        elements.suggestionsDropdown.classList.remove('hidden');

        // Add click events on suggestions
        elements.suggestionsDropdown.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = item.getAttribute('data-lat');
                const lon = item.getAttribute('data-lon');
                const name = item.getAttribute('data-name');
                const country = item.getAttribute('data-country');

                elements.searchInput.value = `${name}, ${country}`;
                elements.suggestionsDropdown.classList.add('hidden');
                
                state.coords = { lat, lon };
                state.city = name;
                fetchWeatherData({ lat, lon, name, country });
            });
        });

    } catch (err) {
        console.error('Search error:', err);
    }
}

/**
 * Fetch Weather Data from Flask Backend API
 */
async function fetchWeatherData(params = {}) {
    showLoading(true);
    elements.errorToast.classList.add('hidden');

    let url = `/api/weather?units=${state.units}`;
    if (params.lat && params.lon) {
        url += `&lat=${params.lat}&lon=${params.lon}`;
        if (params.name) url += `&name=${encodeURIComponent(params.name)}`;
        if (params.country) url += `&country=${encodeURIComponent(params.country)}`;
    } else if (params.city) {
        url += `&city=${encodeURIComponent(params.city)}`;
    } else {
        url += `&city=${encodeURIComponent(state.city)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to fetch weather data.');
        }

        state.weatherData = data;
        state.city = data.location.name;
        state.coords = { lat: data.location.lat, lon: data.location.lon };

        // Save to Recent Searches
        saveRecentSearch(data.location.name, data.location.country);

        // Update All UI Views
        renderDashboard(data);
        showLoading(false);

    } catch (err) {
        showLoading(false);
        showError(err.message || 'Network error occurred while fetching weather data.');
    }
}

/**
 * Render Complete Weather Dashboard
 */
function renderDashboard(data) {
    const { location, current, units, hourly_timeline, chart_data, daily_forecast, insights } = data;

    // 1. Update Dynamic Body Background Theme (if auto mode)
    if (state.themeMode === 'auto') {
        updateWeatherTheme(current.weather_code, current.is_day);
    }

    // 2. Location & Date/Time
    elements.locName.textContent = location.name;
    elements.locCountry.textContent = location.country || 'GLOBAL';
    elements.locTimezone.textContent = location.timezone;
    
    // Format local time from ISO string
    try {
        const dateObj = new Date(current.time);
        const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
        elements.locTime.textContent = dateObj.toLocaleDateString(undefined, options);
    } catch {
        elements.locTime.textContent = current.time.replace('T', ' ');
    }

    // 3. Current Weather Hero
    elements.conditionLabel.textContent = current.weather_label;
    elements.currentTemp.innerHTML = `${Math.round(current.temp)}<span class="unit-symbol">${units.temp}</span>`;
    elements.feelsLikeTemp.textContent = `${Math.round(current.feels_like)}${units.temp}`;
    elements.conditionDescription.textContent = current.description;

    // Min / Max range from daily[0]
    if (daily_forecast && daily_forecast.length > 0) {
        elements.dayMinTemp.textContent = `${Math.round(daily_forecast[0].temp_min)}${units.temp}`;
        elements.dayMaxTemp.textContent = `${Math.round(daily_forecast[0].temp_max)}${units.temp}`;
    }

    // Hero Weather Icon
    updateWeatherIcon(elements.heroWeatherIcon, current.icon, current.is_day);

    // Hero Metric Strip
    elements.stripHumidity.textContent = `${current.humidity}%`;
    elements.stripWind.textContent = `${current.wind_speed} ${units.wind}`;
    elements.stripRain.textContent = `${hourly_timeline.length > 0 ? hourly_timeline[0].rain_prob : 0}%`;
    elements.stripUV.textContent = `${current.uv_index} (${getUVLevel(current.uv_index)})`;

    // 4. Smart Insight Banner
    if (insights && insights.length > 0) {
        elements.insightText.textContent = insights[0].text;
    }

    // 5. Render Trend Chart (Chart.js)
    renderTrendChart();

    // 6. Trend Summary Stats
    if (chart_data) {
        const maxT = Math.max(...chart_data.temperatures);
        const minT = Math.min(...chart_data.temperatures);
        const avgH = Math.round(chart_data.humidity.reduce((a, b) => a + b, 0) / (chart_data.humidity.length || 1));
        const maxR = Math.max(...chart_data.rain_prob);

        elements.sumPeakTemp.textContent = `${maxT}${units.temp}`;
        elements.sumLowTemp.textContent = `${minT}${units.temp}`;
        elements.sumAvgHumidity.textContent = `${avgH}%`;
        elements.sumMaxRain.textContent = `${maxR}%`;
    }

    // 7. Render Hourly Timeline Horizontal Cards
    renderHourlyTimeline(hourly_timeline, units);

    // 8. Render 7-Day Forecast
    renderDailyForecast(daily_forecast, units);

    // 9. Render Deep Side Metric Cards
    renderSideMetrics(current, daily_forecast, units);
}

/**
 * Render Interactive Chart.js Graph (Temperature, Humidity, Combined, Rain, Wind)
 */
function renderTrendChart() {
    if (!state.weatherData || !state.weatherData.chart_data) return;

    const chartData = state.weatherData.chart_data;
    const units = state.weatherData.units;
    const ctx = elements.trendChartCanvas.getContext('2d');

    // Destroy previous chart instance if exists
    if (state.chartInstance) {
        state.chartInstance.destroy();
    }

    // Gradients
    const tempGradient = ctx.createLinearGradient(0, 0, 0, 260);
    tempGradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    tempGradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    const humGradient = ctx.createLinearGradient(0, 0, 0, 260);
    humGradient.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
    humGradient.addColorStop(1, 'rgba(34, 211, 238, 0.0)');

    const rainGradient = ctx.createLinearGradient(0, 0, 0, 260);
    rainGradient.addColorStop(0, 'rgba(129, 140, 248, 0.5)');
    rainGradient.addColorStop(1, 'rgba(129, 140, 248, 0.0)');

    const windGradient = ctx.createLinearGradient(0, 0, 0, 260);
    windGradient.addColorStop(0, 'rgba(45, 212, 191, 0.4)');
    windGradient.addColorStop(1, 'rgba(45, 212, 191, 0.0)');

    let datasets = [];
    let scales = {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
        }
    };

    if (state.activeChartTab === 'temp') {
        datasets.push({
            label: `Temperature (${units.temp})`,
            data: chartData.temperatures,
            borderColor: '#38bdf8',
            backgroundColor: tempGradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#38bdf8',
            pointBorderColor: '#0f172a',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6
        });
    } else if (state.activeChartTab === 'humidity') {
        datasets.push({
            label: 'Relative Humidity (%)',
            data: chartData.humidity,
            borderColor: '#22d3ee',
            backgroundColor: humGradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#22d3ee',
            pointBorderColor: '#0f172a',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6
        });
        scales.y.min = 0;
        scales.y.max = 100;
    } else if (state.activeChartTab === 'combined') {
        // Temperature vs Humidity Correlation View
        datasets.push({
            label: `Temperature (${units.temp})`,
            data: chartData.temperatures,
            borderColor: '#fbbf24',
            backgroundColor: 'transparent',
            borderWidth: 3,
            yAxisID: 'yTemp',
            tension: 0.4,
            pointRadius: 2
        });
        datasets.push({
            label: 'Humidity (%)',
            data: chartData.humidity,
            borderColor: '#38bdf8',
            backgroundColor: humGradient,
            borderWidth: 2,
            fill: true,
            yAxisID: 'yHum',
            tension: 0.4,
            pointRadius: 2
        });

        scales = {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
            },
            yTemp: {
                type: 'linear',
                position: 'left',
                grid: { color: 'rgba(255, 255, 255, 0.06)' },
                ticks: { color: '#fbbf24', font: { family: 'Outfit', size: 11 } },
                title: { display: true, text: `Temp (${units.temp})`, color: '#fbbf24' }
            },
            yHum: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 100,
                grid: { drawOnChartArea: false },
                ticks: { color: '#38bdf8', font: { family: 'Outfit', size: 11 } },
                title: { display: true, text: 'Humidity (%)', color: '#38bdf8' }
            }
        };
    } else if (state.activeChartTab === 'rain') {
        datasets.push({
            label: 'Precipitation Probability (%)',
            data: chartData.rain_prob,
            borderColor: '#818cf8',
            backgroundColor: rainGradient,
            borderWidth: 3,
            fill: true,
            tension: 0.3,
            pointBackgroundColor: '#818cf8',
            pointRadius: 3
        });
        scales.y.min = 0;
        scales.y.max = 100;
    } else if (state.activeChartTab === 'wind') {
        datasets.push({
            label: `Wind Speed (${units.wind})`,
            data: chartData.wind,
            borderColor: '#2dd4bf',
            backgroundColor: windGradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2dd4bf',
            pointRadius: 3
        });
    }

    state.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#f8fafc', font: { family: 'Outfit', size: 12, weight: 600 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    titleColor: '#ffffff',
                    bodyColor: '#e2e8f0',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 4,
                    usePointStyle: true,
                    titleFont: { family: 'Outfit', size: 13, weight: 700 },
                    bodyFont: { family: 'Outfit', size: 12 }
                }
            },
            scales: scales
        }
    });
}

/**
 * Render Hourly Horizontal Timeline Slider
 */
function renderHourlyTimeline(hourlyList, units) {
    if (!hourlyList || hourlyList.length === 0) return;

    elements.hourlySlider.innerHTML = hourlyList.map((hour, idx) => {
        const iconClass = getWeatherIconClass(hour.icon, hour.is_day);
        const isActive = idx === 0 ? 'active-hour' : '';

        return `
            <div class="hourly-card ${isActive}">
                <span class="hour-time">${hour.time_display}</span>
                <i class="fa-solid ${iconClass} hour-icon"></i>
                <span class="hour-temp">${Math.round(hour.temp)}${units.temp}</span>
                <div class="hour-badge-wrap">
                    <span class="hour-humidity-badge" title="Humidity"><i class="fa-solid fa-droplet"></i> ${hour.humidity}%</span>
                    ${hour.rain_prob > 0 ? `<span class="hour-rain-badge"><i class="fa-solid fa-cloud-rain"></i> ${hour.rain_prob}%</span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render 7-Day Extended Forecast
 */
function renderDailyForecast(dailyList, units) {
    if (!dailyList || dailyList.length === 0) return;

    const allMin = Math.min(...dailyList.map(d => d.temp_min));
    const allMax = Math.max(...dailyList.map(d => d.temp_max));
    const rangeSpan = Math.max(allMax - allMin, 1);

    elements.dailyForecastList.innerHTML = dailyList.map((day, idx) => {
        const dateObj = new Date(day.date);
        let dayName = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
        if (idx === 0) dayName = 'Today';
        if (idx === 1) dayName = 'Tomorrow';

        const monthDay = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const iconClass = getWeatherIconClass(day.icon, 1);

        const leftPercent = Math.max(0, ((day.temp_min - allMin) / rangeSpan) * 100);
        const widthPercent = Math.max(12, ((day.temp_max - day.temp_min) / rangeSpan) * 100);

        return `
            <div class="daily-row">
                <div class="daily-day-meta">
                    <span class="day-title">${dayName}</span>
                    <span class="day-subdate">${monthDay}</span>
                </div>
                
                <div class="daily-condition">
                    <i class="fa-solid ${iconClass} daily-cond-icon"></i>
                    <span class="daily-cond-label">${day.weather_label}</span>
                </div>

                <div class="daily-temp-bar-wrap">
                    <span class="bar-min-label">${Math.round(day.temp_min)}°</span>
                    <div class="temp-gradient-bar-bg">
                        <div class="temp-gradient-bar-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
                    </div>
                    <span class="bar-max-label">${Math.round(day.temp_max)}°</span>
                </div>

                <div class="daily-extra-stats">
                    <span class="daily-rain-stat" title="Rain probability">
                        <i class="fa-solid fa-droplet"></i> ${day.rain_prob_max}%
                    </span>
                    <span class="daily-uv-stat" title="Max UV Index">
                        <i class="fa-solid fa-sun"></i> UV ${Math.round(day.uv_max)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Side Column Detailed Meteorological Metrics
 */
function renderSideMetrics(current, dailyList, units) {
    // 1. Humidity & Dew Point
    const humVal = current.humidity;
    elements.gaugeHumidityVal.textContent = `${humVal}%`;
    elements.dewPointVal.textContent = `${current.dew_point}${units.temp}`;
    elements.comfortBadge.textContent = current.comfort.level;
    elements.comfortBadge.style.color = current.comfort.color;
    elements.comfortLevelText.textContent = current.comfort.level;
    elements.comfortLevelText.style.color = current.comfort.color;
    elements.humidityAdvice.textContent = current.comfort.advice;

    elements.comfortPin.style.left = `${Math.min(Math.max(humVal, 5), 95)}%`;

    // SVG Circular Gauge Animation
    const offset = 301.59 - (301.59 * humVal) / 100;
    elements.humidityRing.style.strokeDashoffset = offset;
    elements.humidityRing.style.stroke = current.comfort.color;

    // 2. Wind Speed & Compass
    elements.windSpeedVal.innerHTML = `${current.wind_speed} <span class="unit-sub">${units.wind}</span>`;
    elements.windGustsVal.innerHTML = `${current.wind_gusts} <span class="unit-sub">${units.wind}</span>`;
    
    const deg = current.wind_direction;
    elements.compassPointer.style.transform = `rotate(${deg}deg)`;
    elements.compassBearingText.textContent = `${deg}° ${getCompassDirection(deg)}`;

    if (current.wind_speed < 10) elements.windLabel.textContent = 'Light';
    else if (current.wind_speed < 25) elements.windLabel.textContent = 'Moderate';
    else if (current.wind_speed < 45) elements.windLabel.textContent = 'Breezy';
    else elements.windLabel.textContent = 'Strong Gale';

    // 3. Air Quality
    const aqi = current.aqi;
    elements.aqiScore.textContent = aqi.value;
    elements.aqiScore.style.color = aqi.color;
    elements.aqiBadge.textContent = aqi.status;
    elements.aqiBadge.style.color = aqi.color;
    elements.aqiStatusText.textContent = aqi.status;

    elements.pm25Val.textContent = aqi.pm2_5 !== '--' ? `${aqi.pm2_5} µg/m³` : '--';
    elements.pm10Val.textContent = aqi.pm10 !== '--' ? `${aqi.pm10} µg/m³` : '--';
    elements.o3Val.textContent = aqi.o3 !== '--' ? `${aqi.o3} µg/m³` : '--';
    elements.no2Val.textContent = aqi.no2 !== '--' ? `${aqi.no2} µg/m³` : '--';

    // 4. UV Radiation
    const uv = current.uv_index;
    elements.uvVal.textContent = uv;
    elements.uvBadge.textContent = getUVLevel(uv);
    const uvPercent = Math.min((uv / 12) * 100, 100);
    elements.uvBarFill.style.width = `${uvPercent}%`;

    if (uv < 3) elements.uvTip.textContent = 'Low UV exposure. No special protection required.';
    else if (uv < 6) elements.uvTip.textContent = 'Moderate UV radiation. Consider sunglasses and SPF 15+ outdoors.';
    else if (uv < 8) elements.uvTip.textContent = 'High UV risk. Seek shade, wear a hat and apply SPF 30+ sunscreen.';
    else elements.uvTip.textContent = 'Very High / Extreme UV! Avoid prolonged sun exposure during peak hours.';

    // 5. Sun & Daylight Horizon Cycle
    if (dailyList && dailyList.length > 0) {
        const todayForecast = dailyList[0];
        elements.sunriseTime.textContent = todayForecast.sunrise || '--:--';
        elements.sunsetTime.textContent = todayForecast.sunset || '--:--';

        if (todayForecast.sunrise && todayForecast.sunset) {
            const now = new Date();
            const [srH, srM] = todayForecast.sunrise.split(':').map(Number);
            const [ssH, ssM] = todayForecast.sunset.split(':').map(Number);
            
            const srMins = srH * 60 + srM;
            const ssMins = ssH * 60 + ssM;
            const curMins = now.getHours() * 60 + now.getMinutes();

            if (curMins >= srMins && curMins <= ssMins) {
                const progress = (curMins - srMins) / (ssMins - srMins);
                const leftPos = 10 + progress * 80;
                const topPos = 40 - Math.sin(progress * Math.PI) * 35;
                elements.sunDot.style.left = `${leftPos}%`;
                elements.sunDot.style.top = `${topPos}px`;
                elements.sunDot.style.display = 'flex';
            } else {
                elements.sunDot.style.display = 'none';
            }
        }
    }

    // 6. Pressure & Visibility
    elements.pressureVal.innerHTML = `${current.pressure} <span class="unit-sub">hPa</span>`;
    elements.visibilityVal.innerHTML = `${current.visibility} <span class="unit-sub">${units.vis}</span>`;
}

/**
 * Dynamic Atmospheric Theme Switcher (Auto Weather Driven)
 */
function updateWeatherTheme(weatherCode, isDay) {
    if (state.themeMode !== 'auto') return;

    if (!isDay) {
        setThemeMode('theme-clear-night', 'stars');
        return;
    }

    if (weatherCode === 0 || weatherCode === 1) {
        setThemeMode('theme-clear-day', 'sun');
    } else if (weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
        setThemeMode('theme-cloudy', 'fog');
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        setThemeMode('theme-rainy', 'rain');
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        setThemeMode('theme-snowy', 'snow');
    } else if ([95, 96, 99].includes(weatherCode)) {
        setThemeMode('theme-thunder', 'thunder');
    } else {
        setThemeMode('theme-clear-day', 'sun');
    }
}

/**
 * --------------------------------------------------------------------------
 * Aesthetic 60fps Dynamic Particle Background Canvas Engine
 * --------------------------------------------------------------------------
 */
let particles = [];
let meteors = [];
let lightningFlash = 0;

function initAestheticBackgroundEngine() {
    const canvas = elements.weatherCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles(state.currentParticleMode);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Cursor Spotlight Tracking
    if (elements.cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            elements.cursorGlow.style.left = `${e.clientX}px`;
            elements.cursorGlow.style.top = `${e.clientY}px`;
            elements.cursorGlow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            elements.cursorGlow.style.opacity = '0';
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Render Lightning Flash in Storm Mode
        if (state.currentParticleMode === 'thunder') {
            if (Math.random() < 0.008) {
                lightningFlash = 0.25;
            }
            if (lightningFlash > 0) {
                ctx.fillStyle = `rgba(168, 85, 247, ${lightningFlash})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                lightningFlash -= 0.015;
            }
        }

        // Render Particle Sets
        particles.forEach(p => {
            p.update(canvas.width, canvas.height);
            p.draw(ctx);
        });

        // Render Shooting Meteors in Night Mode
        if (state.currentParticleMode === 'stars') {
            if (Math.random() < 0.012 && meteors.length < 3) {
                meteors.push(new Meteor(canvas.width, canvas.height));
            }
            meteors = meteors.filter(m => m.alive);
            meteors.forEach(m => {
                m.update();
                m.draw(ctx);
            });
        }

        state.canvasAnimationId = requestAnimationFrame(animate);
    }

    animate();
}

function setParticleMode(mode) {
    state.currentParticleMode = mode;
    const canvas = elements.weatherCanvas;
    if (canvas) {
        createParticles(mode);
    }
}

function createParticles(mode) {
    particles = [];
    meteors = [];
    const canvas = elements.weatherCanvas;
    if (!canvas) return;

    const count = mode === 'stars' ? 75 : (mode === 'rain' || mode === 'thunder' ? 100 : (mode === 'snow' ? 55 : 35));

    for (let i = 0; i < count; i++) {
        if (mode === 'stars') {
            particles.push(new StarParticle(canvas.width, canvas.height));
        } else if (mode === 'rain' || mode === 'thunder') {
            particles.push(new RainParticle(canvas.width, canvas.height));
        } else if (mode === 'snow') {
            particles.push(new SnowParticle(canvas.width, canvas.height));
        } else if (mode === 'sun') {
            particles.push(new SunDustParticle(canvas.width, canvas.height));
        } else {
            particles.push(new FogParticle(canvas.width, canvas.height));
        }
    }
}

// Particle Classes

class StarParticle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 1.5 + 0.4;
        this.alpha = Math.random();
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.growing = Math.random() > 0.5;
        this.color = Math.random() > 0.3 ? '#ffffff' : (Math.random() > 0.5 ? '#93c5fd' : '#c084fc');
    }
    update(w, h) {
        if (this.growing) {
            this.alpha += this.pulseSpeed;
            if (this.alpha >= 1) this.growing = false;
        } else {
            this.alpha -= this.pulseSpeed;
            if (this.alpha <= 0.15) this.growing = true;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 4;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Meteor {
    constructor(w, h) {
        this.x = Math.random() * (w * 0.8) + w * 0.1;
        this.y = Math.random() * (h * 0.4);
        this.length = Math.random() * 80 + 50;
        this.speed = Math.random() * 8 + 10;
        this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.alive = true;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.02;
        if (this.alpha <= 0) this.alive = false;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;
        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#38bdf8');
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.restore();
    }
}

class RainParticle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.length = Math.random() * 18 + 12;
        this.speed = Math.random() * 9 + 14;
        this.alpha = Math.random() * 0.45 + 0.2;
        this.wind = -1.2;
    }
    update(w, h) {
        this.y += this.speed;
        this.x += this.wind;
        if (this.y > h) {
            this.y = -20;
            this.x = Math.random() * (w + 100) - 50;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.wind * 2, this.y + this.length);
        ctx.stroke();
        ctx.restore();
    }
}

class SnowParticle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 2.8 + 1;
        this.speed = Math.random() * 1.2 + 0.6;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.6 + 0.3;
    }
    update(w, h) {
        this.angle += 0.02;
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.8;
        if (this.y > h + 10) {
            this.y = -10;
            this.x = Math.random() * w;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#bae6fd';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#bae6fd';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class SunDustParticle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 2.5 + 0.8;
        this.speed = Math.random() * 0.4 + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update(w, h) {
        this.angle += 0.015;
        this.y -= this.speed;
        this.x += Math.cos(this.angle) * 0.4;
        if (this.y < -10) {
            this.y = h + 10;
            this.x = Math.random() * w;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f59e0b';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class FogParticle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 60 + 40;
        this.speed = Math.random() * 0.3 + 0.1;
        this.alpha = Math.random() * 0.06 + 0.03;
    }
    update(w, h) {
        this.x += this.speed;
        if (this.x - this.radius > w) {
            this.x = -this.radius;
            this.y = Math.random() * h;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, '#94a3b8');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * Helpers
 */
function getWeatherIconClass(iconKey, isDay = 1) {
    const iconObj = WEATHER_ICON_MAP[iconKey] || WEATHER_ICON_MAP['cloudy'];
    return isDay ? iconObj.day : iconObj.night;
}

function updateWeatherIcon(el, iconKey, isDay = 1) {
    const iconClass = getWeatherIconClass(iconKey, isDay);
    el.className = `fa-solid ${iconClass} weather-hero-icon`;
}

function getUVLevel(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

function getCompassDirection(degrees) {
    const sectors = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return sectors[index];
}

function saveRecentSearch(name, country) {
    if (!name) return;
    let recents = JSON.parse(localStorage.getItem('skypulse_recents') || '[]');
    recents = recents.filter(item => item.name.toLowerCase() !== name.toLowerCase());
    recents.unshift({ name, country });
    if (recents.length > 5) recents.pop();
    localStorage.setItem('skypulse_recents', JSON.stringify(recents));
    localStorage.setItem('skypulse_last_city', name);
    renderRecentSearches();
}

function renderRecentSearches() {
    const recents = JSON.parse(localStorage.getItem('skypulse_recents') || '[]');
    if (recents.length === 0) {
        elements.recentChipsWrapper.classList.add('hidden');
        return;
    }

    elements.recentChipsWrapper.classList.remove('hidden');
    elements.recentChips.innerHTML = recents.map(item => `
        <button class="chip" data-city="${item.name}">
            <i class="fa-regular fa-clock"></i> ${item.name}
        </button>
    `).join('');
}

function showLoading(isLoading) {
    elements.loadingState.classList.toggle('hidden', !isLoading);
    elements.mainDashboard.style.opacity = isLoading ? '0.35' : '1';
    elements.mainDashboard.style.pointerEvents = isLoading ? 'none' : 'auto';
}

function showError(msg) {
    elements.errorMessage.textContent = msg;
    elements.errorToast.classList.remove('hidden');
}
