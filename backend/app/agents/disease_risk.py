from typing import List, Optional
from app.schemas import DiseaseRiskReport, WeatherData, CropVisionReport

class DiseaseRiskAgent:
    """
    Disease & Pest Risk Predictor Agent:
    Correlates weather conditions (humidity, temp, rainfall) with crop stage & existing plant infection
    to calculate a 7-day disease spread risk probability %.
    """
    def __init__(self):
        pass

    def evaluate_risk(
        self,
        crop_type: str,
        weather: WeatherData,
        vision_report: Optional[CropVisionReport] = None
    ) -> DiseaseRiskReport:
        # Calculate environmental risk score
        high_humidity_days = sum(1 for w in weather.forecast_7d if w.humidity > 80.0)
        rainy_days = sum(1 for w in weather.forecast_7d if w.rainfall_mm > 5.0)
        avg_temp = sum(w.temp_max for w in weather.forecast_7d) / len(weather.forecast_7d)

        triggers = []
        base_probability = 30

        if high_humidity_days >= 2:
            triggers.append(f"High Relative Humidity (>80%) forecast on {high_humidity_days} out of 7 days")
            base_probability += 25

        if rainy_days >= 2:
            triggers.append(f"Frequent Rain ({rainy_days} wet days) creating leaf wetness duration >10 hours")
            base_probability += 25

        if 20.0 <= avg_temp <= 28.0:
            triggers.append(f"Optimal Fungal Incubation Temperature range ({avg_temp:.1f}°C)")
            base_probability += 15

        if vision_report and vision_report.severity_level in ["Medium", "High", "Severe"]:
            triggers.append(f"Active Spore Presence: Detected {vision_report.disease_name} ({vision_report.affected_area_pct}% coverage)")
            base_probability += 20

        probability = int(min(98, base_probability))

        if probability >= 75:
            risk_level = "Critical"
            advice = [
                "Apply prophylactic systemic fungicide (Mancozeb/Copper) before tomorrow's rain",
                "Do NOT carry out weeding or canopy handling while plants are wet",
                "Inspect adjacent blocks for early concentric spot lesions"
            ]
        elif probability >= 50:
            risk_level = "High"
            advice = [
                "Spray bio-fungicide (Trichoderma viride) within 36 hours",
                "Ensure drip lines are free of leaks to prevent root zone waterlogging",
                "Monitor relative humidity closely after rain showers"
            ]
        elif probability >= 30:
            risk_level = "Medium"
            advice = [
                "Maintain good air circulation through selective branch prunings",
                "Keep preventive Neem Oil spray ready",
                "Scout lower leaves every 3 days"
            ]
        else:
            risk_level = "Low"
            advice = [
                "Low environmental fungal pressure",
                "Standard crop monitoring is sufficient"
            ]

        return DiseaseRiskReport(
            risk_level=risk_level,
            probability_percent=probability,
            key_weather_triggers=triggers if triggers else ["Stable dry weather pattern"],
            prevention_advice=advice
        )
