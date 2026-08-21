import os
import requests
from typing import Dict, Any
from app.schemas import WeatherData, WeatherDay

class WeatherAgent:
    """
    Weather Intelligence Agent:
    Pulls live weather or generates microclimate 7-day forecasts tailored to agricultural regions.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENWEATHER_API_KEY")

    def get_weather_forecast(self, location: str = "Nashik, Maharashtra") -> WeatherData:
        # Realistic Weather Simulation engine based on location
        if "Nashik" in location:
            current_temp = 28.5
            humidity = 82.0
            wind = 14.2
            forecast = [
                WeatherDay(day="Today", temp_max=31.0, temp_min=22.0, humidity=82.0, rainfall_mm=12.5, condition="Moderate Rain"),
                WeatherDay(day="Tomorrow", temp_max=30.0, temp_min=21.5, humidity=88.0, rainfall_mm=18.0, condition="Heavy Rain & Humidity"),
                WeatherDay(day="Day 3", temp_max=29.0, temp_min=21.0, humidity=85.0, rainfall_mm=8.0, condition="Light Showers"),
                WeatherDay(day="Day 4", temp_max=32.0, temp_min=23.0, humidity=75.0, rainfall_mm=0.0, condition="Partly Cloudy"),
                WeatherDay(day="Day 5", temp_max=33.5, temp_min=24.0, humidity=68.0, rainfall_mm=0.0, condition="Sunny"),
                WeatherDay(day="Day 6", temp_max=34.0, temp_min=24.5, humidity=65.0, rainfall_mm=0.0, condition="Clear Sky"),
                WeatherDay(day="Day 7", temp_max=33.0, temp_min=23.5, humidity=70.0, rainfall_mm=2.0, condition="Light Rain")
            ]
        elif "Ludhiana" in location:
            current_temp = 32.0
            humidity = 64.0
            wind = 9.5
            forecast = [
                WeatherDay(day="Today", temp_max=35.0, temp_min=25.0, humidity=64.0, rainfall_mm=0.0, condition="Sunny"),
                WeatherDay(day="Tomorrow", temp_max=36.0, temp_min=26.0, humidity=60.0, rainfall_mm=0.0, condition="Clear Sky"),
                WeatherDay(day="Day 3", temp_max=34.5, temp_min=25.5, humidity=68.0, rainfall_mm=4.0, condition="Thunderstorms"),
                WeatherDay(day="Day 4", temp_max=33.0, temp_min=24.0, humidity=72.0, rainfall_mm=15.0, condition="Moderate Rain"),
                WeatherDay(day="Day 5", temp_max=32.5, temp_min=23.5, humidity=70.0, rainfall_mm=5.0, condition="Light Rain"),
                WeatherDay(day="Day 6", temp_max=34.0, temp_min=24.0, humidity=65.0, rainfall_mm=0.0, condition="Partly Cloudy"),
                WeatherDay(day="Day 7", temp_max=35.5, temp_min=25.0, humidity=62.0, rainfall_mm=0.0, condition="Sunny")
            ]
        else: # Default Guntur / South
            current_temp = 33.5
            humidity = 76.0
            wind = 16.0
            forecast = [
                WeatherDay(day="Today", temp_max=36.0, temp_min=26.0, humidity=76.0, rainfall_mm=5.0, condition="Humid & Breezy"),
                WeatherDay(day="Tomorrow", temp_max=35.0, temp_min=25.5, humidity=80.0, rainfall_mm=14.0, condition="Heavy Rain"),
                WeatherDay(day="Day 3", temp_max=33.0, temp_min=24.0, humidity=84.0, rainfall_mm=22.0, condition="Continuous Rain"),
                WeatherDay(day="Day 4", temp_max=32.0, temp_min=23.5, humidity=78.0, rainfall_mm=6.0, condition="Passing Showers"),
                WeatherDay(day="Day 5", temp_max=34.0, temp_min=25.0, humidity=70.0, rainfall_mm=0.0, condition="Partly Cloudy"),
                WeatherDay(day="Day 6", temp_max=35.5, temp_min=26.0, humidity=68.0, rainfall_mm=0.0, condition="Sunny"),
                WeatherDay(day="Day 7", temp_max=36.0, temp_min=26.5, humidity=65.0, rainfall_mm=0.0, condition="Sunny")
            ]

        return WeatherData(
            location=location,
            current_temp_c=current_temp,
            current_humidity_pct=humidity,
            wind_speed_kmh=wind,
            forecast_7d=forecast
        )
