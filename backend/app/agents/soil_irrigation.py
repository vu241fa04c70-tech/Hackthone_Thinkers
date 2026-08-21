from typing import Dict, Any, List
from app.schemas import SoilData, SoilIrrigationReport, WeatherData

class SoilIrrigationAgent:
    """
    Soil & Irrigation Agent:
    Analyzes NPK, moisture %, soil type, growth stage, and upcoming rainfall to generate
    precise fertilizer applications (kg/acre) and irrigation volume (L/acre/day).
    """
    def __init__(self):
        pass

    def calculate_requirements(
        self,
        soil: SoilData,
        crop_type: str,
        growth_stage: str,
        acreage: float,
        weather: WeatherData
    ) -> SoilIrrigationReport:
        # Check rain forecast in next 48 hours
        upcoming_rain_mm = sum(w.rainfall_mm for w in weather.forecast_7d[:2])

        # Base water requirement by crop and stage (liters/acre/day)
        base_water_map = {
            "Tomato": {"Seedling": 4000, "Vegetative": 8000, "Flowering": 12000, "Fruiting": 14000, "Harvesting": 9000},
            "Wheat": {"Seedling": 3000, "Vegetative": 6000, "Flowering": 9000, "Fruiting": 10000, "Harvesting": 4000},
            "Cotton": {"Seedling": 3500, "Vegetative": 7000, "Flowering": 11000, "Fruiting": 13000, "Harvesting": 5000},
            "Potato": {"Seedling": 3200, "Vegetative": 6500, "Flowering": 10500, "Fruiting": 12000, "Harvesting": 6000}
        }

        crop_stage_map = base_water_map.get(crop_type, base_water_map["Tomato"])
        base_water = crop_stage_map.get(growth_stage, 10000)

        # Moisture & Rain adjustments
        if soil.moisture_percent > 45.0 or upcoming_rain_mm > 20.0:
            rec_water = 0.0
            schedule = f"PAUSE Irrigation! High soil moisture ({soil.moisture_percent}%) and incoming rain ({upcoming_rain_mm}mm)."
        elif soil.moisture_percent > 35.0:
            rec_water = base_water * 0.5
            schedule = f"Light Drip Cycle: Run for 45 mins early morning ({rec_water:.0f} L/acre)."
        elif upcoming_rain_mm > 10.0:
            rec_water = base_water * 0.4
            schedule = f"Reduce Cycle: Run 40 mins due to 48hr rain forecast ({upcoming_rain_mm}mm)."
        else:
            rec_water = base_water
            schedule = f"Normal Drip Schedule: 2 cycles of 60 mins daily ({rec_water:.0f} L/acre/day)."

        # Fertilizer logic based on NPK deficits
        fertilizer_recs = []
        
        # Target N, P, K per stage
        target_n = 180.0 if growth_stage in ["Vegetative", "Flowering"] else 120.0
        target_p = 35.0 if growth_stage in ["Flowering", "Fruiting"] else 25.0
        target_k = 200.0 if growth_stage == "Fruiting" else 140.0

        if soil.nitrogen_n < target_n:
            n_deficit = target_n - soil.nitrogen_n
            urea_kg = (n_deficit * 2.17) * acreage / 2.5 # approx conversion
            fertilizer_recs.append({
                "nutrient": "Nitrogen (N)",
                "status": f"Deficit ({soil.nitrogen_n:.0f} vs {target_n:.0f} kg/ha target)",
                "action": f"Apply {urea_kg:.1f} kg Urea per acre via fertigation",
                "timing": "Split into 2 applications over 7 days",
                "priority": "High"
            })

        if soil.phosphorus_p < target_p:
            p_deficit = target_p - soil.phosphorus_p
            ssp_kg = (p_deficit * 6.25) * acreage / 2.5
            fertilizer_recs.append({
                "nutrient": "Phosphorus (P)",
                "status": f"Deficit ({soil.phosphorus_p:.0f} vs {target_p:.0f} kg/ha target)",
                "action": f"Apply {ssp_kg:.1f} kg Single Super Phosphate (SSP)",
                "timing": "Band placement near root zone",
                "priority": "Medium"
            })

        if soil.potassium_k < target_k:
            k_deficit = target_k - soil.potassium_k
            mop_kg = (k_deficit * 1.66) * acreage / 2.5
            fertilizer_recs.append({
                "nutrient": "Potassium (K)",
                "status": f"Deficit ({soil.potassium_k:.0f} vs {target_k:.0f} kg/ha target)",
                "action": f"Apply {mop_kg:.1f} kg Muriate of Potash (MOP) or SOP",
                "timing": "Fruiting stage boost for fruit weight & shine",
                "priority": "High"
            })

        if not fertilizer_recs:
            fertilizer_recs.append({
                "nutrient": "Optimal Balance",
                "status": "Soil N-P-K levels are within optimal range",
                "action": "Maintain organic humic acid drench (2L/acre)",
                "timing": "Next week",
                "priority": "Low"
            })

        # Calculate soil health score
        health_score = int(min(100, max(40, 100 - (abs(soil.ph - 6.5) * 15) - (abs(35 - soil.moisture_percent) * 0.5))))

        return SoilIrrigationReport(
            water_requirement_l_per_day=rec_water,
            irrigation_schedule=schedule,
            fertilizer_recommendations=fertilizer_recs,
            soil_health_score=health_score
        )
