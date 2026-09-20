import os
import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# WMO Weather interpretation codes (WW)
WEATHER_CODES = {
    0: {"label": "Clear sky", "icon": "clear", "description": "Sunny and clear skies"},
    1: {"label": "Mainly clear", "icon": "mainly-clear", "description": "Mostly clear with slight clouds"},
    2: {"label": "Partly cloudy", "icon": "partly-cloudy", "description": "Scattered clouds across the sky"},
    3: {"label": "Overcast", "icon": "overcast", "description": "Dense cloud cover overhead"},
    45: {"label": "Fog", "icon": "fog", "description": "Low visibility with dense fog"},
    48: {"label": "Depositing rime fog", "icon": "fog", "description": "Freezing rime fog conditions"},
    51: {"label": "Light drizzle", "icon": "drizzle", "description": "Light, misty precipitation"},
    53: {"label": "Moderate drizzle", "icon": "drizzle", "description": "Steady misty drizzle"},
    55: {"label": "Dense drizzle", "icon": "drizzle", "description": "Frequent and heavy drizzle"},
    56: {"label": "Light freezing drizzle", "icon": "freezing-rain", "description": "Icy light drizzle"},
    57: {"label": "Dense freezing drizzle", "icon": "freezing-rain", "description": "Icy heavy drizzle"},
    61: {"label": "Slight rain", "icon": "rain", "description": "Occasional gentle raindrops"},
    63: {"label": "Moderate rain", "icon": "rain", "description": "Steady and consistent rainfall"},
    65: {"label": "Heavy rain", "icon": "heavy-rain", "description": "Intense torrential downpours"},
    66: {"label": "Light freezing rain", "icon": "freezing-rain", "description": "Freezing raindrops"},
    67: {"label": "Heavy freezing rain", "icon": "freezing-rain", "description": "Severe freezing rain"},
    71: {"label": "Slight snow fall", "icon": "snow", "description": "Gentle falling snowflakes"},
    73: {"label": "Moderate snow fall", "icon": "snow", "description": "Steady blanket of snowfall"},
    75: {"label": "Heavy snow fall", "icon": "heavy-snow", "description": "Heavy winter snow blizzard"},
    77: {"label": "Snow grains", "icon": "snow", "description": "Small icy snow grains"},
    80: {"label": "Slight rain showers", "icon": "showers", "description": "Brief passing rain showers"},
    81: {"label": "Moderate rain showers", "icon": "showers", "description": "Periodic heavy rain bursts"},
    82: {"label": "Violent rain showers", "icon": "heavy-rain", "description": "Severe torrential rain bursts"},
    85: {"label": "Slight snow showers", "icon": "snow", "description": "Scattered brief snow flurries"},
    86: {"label": "Heavy snow showers", "icon": "heavy-snow", "description": "Intense drifting snow showers"},
    95: {"label": "Thunderstorm", "icon": "thunderstorm", "description": "Active thunder and lightning"},
    96: {"label": "Thunderstorm with slight hail", "icon": "thunder-hail", "description": "Thunderstorm with small hailstones"},
    99: {"label": "Thunderstorm with heavy hail", "icon": "thunder-hail", "description": "Severe storm with damaging hail"},
}

def get_weather_info(code):
    return WEATHER_CODES.get(code, {"label": "Unknown", "icon": "cloudy", "description": "Variable weather conditions"})

def calculate_humidity_comfort(temp_c, humidity):
    """Determine comfort level based on temperature and relative humidity."""
    if humidity < 30:
        return {"level": "Dry", "color": "#60a5fa", "advice": "Air is dry. Consider using a moisturizer or humidifier."}
    elif 30 <= humidity <= 60:
        return {"level": "Optimal", "color": "#10b981", "advice": "Pleasant humidity levels. Comfortable for outdoor activities."}
    elif 60 < humidity <= 75:
        return {"level": "Humid", "color": "#f59e0b", "advice": "Noticeably humid. Stay hydrated and dress lightly."}
    else:
        return {"level": "Very Muggy", "color": "#ef4444", "advice": "High moisture in air. Perspiration evaporates slowly, feels muggy."}

def calculate_dew_point(temp_c, humidity):
    """Approximation of dew point using Magnus-Tetens formula."""
    import math
    a = 17.27
    b = 237.7
    try:
        alpha = ((a * temp_c) / (b + temp_c)) + math.log(max(humidity, 1) / 100.0)
        dew_point = (b * alpha) / (a - alpha)
        return round(dew_point, 1)
    except Exception:
        return round(temp_c - ((100 - humidity) / 5), 1)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/search")
def search_city():
    query = request.args.get("q", "").strip()
    if not query or len(query) < 2:
        return jsonify([])

    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count=6&language=en&format=json"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            results = []
            for item in data.get("results", []):
                admin1 = item.get("admin1", "")
                country = item.get("country", "")
                name = item.get("name", "")
                
                parts = [name]
                if admin1 and admin1 != name:
                    parts.append(admin1)
                if country:
                    parts.append(country)
                
                display_name = ", ".join(parts)
                country_code = item.get("country_code", "").upper()

                results.append({
                    "id": item.get("id"),
                    "name": name,
                    "display_name": display_name,
                    "latitude": item.get("latitude"),
                    "longitude": item.get("longitude"),
                    "country": country,
                    "country_code": country_code,
                    "admin1": admin1,
                    "timezone": item.get("timezone", "UTC")
                })
            return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify([])

@app.route("/api/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    city = request.args.get("city")
    units = request.args.get("units", "metric")  # 'metric' (C, km/h) or 'imperial' (F, mph)

    # If city is provided instead of lat/lon, resolve first
    location_name = city
    location_country = ""
    location_region = ""

    if not lat or not lon:
        if not city:
            # Default to London if nothing specified
            city = "London"
        try:
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
            geo_res = requests.get(geo_url, timeout=5)
            if geo_res.status_code == 200:
                geo_data = geo_res.json()
                if geo_data.get("results"):
                    res0 = geo_data["results"][0]
                    lat = res0["latitude"]
                    lon = res0["longitude"]
                    location_name = res0.get("name", city)
                    location_country = res0.get("country", "")
                    location_region = res0.get("admin1", "")
                else:
                    return jsonify({"error": f"City '{city}' not found."}), 404
            else:
                return jsonify({"error": "Failed to resolve city location."}), 500
        except Exception as e:
            return jsonify({"error": f"Geocoding error: {str(e)}"}), 500
    else:
        # Reverse/Custom name if provided in query
        if not location_name:
            location_name = request.args.get("name", f"Location ({float(lat):.2f}, {float(lon):.2f})")
        location_country = request.args.get("country", "")
        location_region = request.args.get("region", "")

    # Open-Meteo Weather Forecast API Query
    temp_unit = "fahrenheit" if units == "imperial" else "celsius"
    wind_unit = "mph" if units == "imperial" else "kmh"
    precip_unit = "inch" if units == "imperial" else "mm"

    forecast_url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m"
        f"&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max"
        f"&temperature_unit={temp_unit}&wind_speed_unit={wind_unit}&precipitation_unit={precip_unit}"
        f"&timezone=auto"
    )

    # Open-Meteo Air Quality API Query
    air_quality_url = (
        f"https://air-quality-api.open-meteo.com/v1/air-quality?"
        f"latitude={lat}&longitude={lon}"
        f"&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone"
        f"&timezone=auto"
    )

    try:
        w_res = requests.get(forecast_url, timeout=7)
        if w_res.status_code != 200:
            return jsonify({"error": "Failed to fetch weather data from provider."}), 500
        weather_data = w_res.json()

        # Air Quality (optional, fail gracefully if unavailable)
        aq_data = {}
        try:
            aq_res = requests.get(air_quality_url, timeout=4)
            if aq_res.status_code == 200:
                aq_data = aq_res.json().get("current", {})
        except Exception:
            aq_data = {}

        current = weather_data.get("current", {})
        hourly = weather_data.get("hourly", {})
        daily = weather_data.get("daily", {})

        current_code = current.get("weather_code", 0)
        current_weather_info = get_weather_info(current_code)
        
        curr_temp = current.get("temperature_2m", 0)
        curr_humidity = current.get("relative_humidity_2m", 0)
        
        # Temp in Celsius for comfort calculation
        temp_c = curr_temp if units != "imperial" else ((curr_temp - 32) * 5 / 9)
        comfort = calculate_humidity_comfort(temp_c, curr_humidity)
        dew_point = calculate_dew_point(temp_c, curr_humidity)
        if units == "imperial":
            dew_point = round((dew_point * 9 / 5) + 32, 1)

        # Process Hourly Data (Next 24 - 48 Hours)
        # Find current hour index in hourly timestamps
        hourly_times = hourly.get("time", [])
        curr_iso_time = current.get("time", "")
        start_idx = 0
        if curr_iso_time and curr_iso_time in hourly_times:
            start_idx = hourly_times.index(curr_iso_time)
        
        # Extract next 24 hours
        next_24_hours = []
        chart_labels = []
        chart_temps = []
        chart_humidity = []
        chart_rain_prob = []
        chart_wind = []
        chart_dew = []

        total_hours = min(len(hourly_times), start_idx + 24)
        for i in range(start_idx, total_hours):
            t_str = hourly_times[i]
            code = hourly.get("weather_code", [])[i] if i < len(hourly.get("weather_code", [])) else 0
            w_info = get_weather_info(code)
            is_day = hourly.get("is_day", [])[i] if i < len(hourly.get("is_day", [])) else 1
            
            temp_val = hourly.get("temperature_2m", [])[i] if i < len(hourly.get("temperature_2m", [])) else 0
            hum_val = hourly.get("relative_humidity_2m", [])[i] if i < len(hourly.get("relative_humidity_2m", [])) else 0
            precip_prob = hourly.get("precipitation_probability", [])[i] if i < len(hourly.get("precipitation_probability", [])) else 0
            wind_val = hourly.get("wind_speed_10m", [])[i] if i < len(hourly.get("wind_speed_10m", [])) else 0
            dew_val = hourly.get("dew_point_2m", [])[i] if i < len(hourly.get("dew_point_2m", [])) else 0

            # Time label format (e.g. 14:00 or 2 PM)
            time_part = t_str.split("T")[1] if "T" in t_str else t_str
            hour_display = time_part[:5]

            item = {
                "time": t_str,
                "time_display": "Now" if i == start_idx else hour_display,
                "temp": round(temp_val, 1),
                "humidity": hum_val,
                "dew_point": round(dew_val, 1),
                "rain_prob": precip_prob,
                "wind_speed": round(wind_val, 1),
                "weather_code": code,
                "weather_label": w_info["label"],
                "icon": w_info["icon"],
                "is_day": is_day
            }
            next_24_hours.append(item)
            chart_labels.append(item["time_display"])
            chart_temps.append(item["temp"])
            chart_humidity.append(item["humidity"])
            chart_rain_prob.append(item["rain_prob"])
            chart_wind.append(item["wind_speed"])
            chart_dew.append(item["dew_point"])

        # Process 7-Day Forecast
        daily_forecast = []
        daily_times = daily.get("time", [])
        for i in range(len(daily_times)):
            d_time = daily_times[i]
            code = daily.get("weather_code", [])[i] if i < len(daily.get("weather_code", [])) else 0
            w_info = get_weather_info(code)
            
            t_max = daily.get("temperature_2m_max", [])[i] if i < len(daily.get("temperature_2m_max", [])) else 0
            t_min = daily.get("temperature_2m_min", [])[i] if i < len(daily.get("temperature_2m_min", [])) else 0
            sunrise = daily.get("sunrise", [])[i] if i < len(daily.get("sunrise", [])) else ""
            sunset = daily.get("sunset", [])[i] if i < len(daily.get("sunset", [])) else ""
            uv_max = daily.get("uv_index_max", [])[i] if i < len(daily.get("uv_index_max", [])) else 0
            rain_prob_max = daily.get("precipitation_probability_max", [])[i] if i < len(daily.get("precipitation_probability_max", [])) else 0
            rain_sum = daily.get("precipitation_sum", [])[i] if i < len(daily.get("precipitation_sum", [])) else 0
            wind_max = daily.get("wind_speed_10m_max", [])[i] if i < len(daily.get("wind_speed_10m_max", [])) else 0

            daily_forecast.append({
                "date": d_time,
                "temp_max": round(t_max, 1),
                "temp_min": round(t_min, 1),
                "weather_code": code,
                "weather_label": w_info["label"],
                "icon": w_info["icon"],
                "sunrise": sunrise.split("T")[1][:5] if "T" in sunrise else sunrise,
                "sunset": sunset.split("T")[1][:5] if "T" in sunset else sunset,
                "uv_max": round(uv_max, 1),
                "rain_prob_max": rain_prob_max,
                "rain_sum": round(rain_sum, 1),
                "wind_max": round(wind_max, 1)
            })

        # Calculate AQI Rating
        us_aqi = aq_data.get("us_aqi")
        aqi_status = "Good"
        aqi_color = "#10b981"
        if us_aqi is not None:
            if us_aqi <= 50:
                aqi_status = "Good"
                aqi_color = "#10b981"
            elif us_aqi <= 100:
                aqi_status = "Moderate"
                aqi_color = "#f59e0b"
            elif us_aqi <= 150:
                aqi_status = "Unhealthy for Sensitive Groups"
                aqi_color = "#f97316"
            elif us_aqi <= 200:
                aqi_status = "Unhealthy"
                aqi_color = "#ef4444"
            else:
                aqi_status = "Very Unhealthy"
                aqi_color = "#7c3aed"
        else:
            us_aqi = "--"

        # Calculate current UV Index from hourly or default
        current_uv = 0
        if hourly.get("uv_index") and start_idx < len(hourly["uv_index"]):
            current_uv = hourly["uv_index"][start_idx]

        # Current Visibility in km / mi
        current_visibility = 10000
        if hourly.get("visibility") and start_idx < len(hourly["visibility"]):
            current_visibility = hourly["visibility"][start_idx]
        vis_val = current_visibility / 1000 if units != "imperial" else (current_visibility / 1609.34)

        # Smart weather recommendation
        insights = []
        if current.get("precipitation", 0) > 0 or (next_24_hours and max([h["rain_prob"] for h in next_24_hours[:6]], default=0) > 40):
            insights.append({"type": "rain", "icon": "fa-umbrella", "text": "Rain is likely today. Don't forget your umbrella!"})
        
        if current_uv >= 6:
            insights.append({"type": "uv", "icon": "fa-sun", "text": f"High UV Index ({current_uv:.1f}). Sunscreen & sunglasses recommended."})
            
        if curr_humidity > 70 and temp_c > 25:
            insights.append({"type": "humidity", "icon": "fa-tint", "text": f"High humidity ({curr_humidity}%) combined with warmth makes it feel hotter."})
        elif curr_humidity < 25:
            insights.append({"type": "humidity", "icon": "fa-water", "text": f"Low humidity ({curr_humidity}%). Keep yourself well-hydrated."})

        if current.get("wind_speed_10m", 0) > (35 if units == "imperial" else 50):
            insights.append({"type": "wind", "icon": "fa-wind", "text": "Strong wind conditions today. Secure loose outdoor objects."})

        if not insights:
            insights.append({"type": "general", "icon": "fa-smile", "text": "Ideal weather conditions for outdoor walks and activities!"})

        response_payload = {
            "location": {
                "name": location_name,
                "country": location_country,
                "region": location_region,
                "lat": float(lat),
                "lon": float(lon),
                "timezone": weather_data.get("timezone", "UTC"),
                "elevation": weather_data.get("elevation", 0)
            },
            "units": {
                "system": units,
                "temp": "°F" if units == "imperial" else "°C",
                "wind": "mph" if units == "imperial" else "km/h",
                "precip": "in" if units == "imperial" else "mm",
                "vis": "mi" if units == "imperial" else "km"
            },
            "current": {
                "time": current.get("time", ""),
                "temp": round(curr_temp, 1),
                "feels_like": round(current.get("apparent_temperature", curr_temp), 1),
                "humidity": curr_humidity,
                "dew_point": dew_point,
                "comfort": comfort,
                "weather_code": current_code,
                "weather_label": current_weather_info["label"],
                "description": current_weather_info["description"],
                "icon": current_weather_info["icon"],
                "is_day": current.get("is_day", 1),
                "wind_speed": round(current.get("wind_speed_10m", 0), 1),
                "wind_direction": current.get("wind_direction_10m", 0),
                "wind_gusts": round(current.get("wind_gusts_10m", 0), 1),
                "pressure": round(current.get("surface_pressure", 1013), 1),
                "cloud_cover": current.get("cloud_cover", 0),
                "precipitation": current.get("precipitation", 0),
                "uv_index": round(current_uv, 1),
                "visibility": round(vis_val, 1),
                "aqi": {
                    "value": us_aqi,
                    "status": aqi_status,
                    "color": aqi_color,
                    "pm2_5": aq_data.get("pm2_5", "--"),
                    "pm10": aq_data.get("pm10", "--"),
                    "co": aq_data.get("carbon_monoxide", "--"),
                    "no2": aq_data.get("nitrogen_dioxide", "--"),
                    "o3": aq_data.get("ozone", "--")
                }
            },
            "hourly_timeline": next_24_hours,
            "chart_data": {
                "labels": chart_labels,
                "temperatures": chart_temps,
                "humidity": chart_humidity,
                "rain_prob": chart_rain_prob,
                "wind": chart_wind,
                "dew_point": chart_dew
            },
            "daily_forecast": daily_forecast,
            "insights": insights
        }

        return jsonify(response_payload)

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
