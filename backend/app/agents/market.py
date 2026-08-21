from typing import Dict, Any, Optional
from app.schemas import MarketReport, WeatherData
from app.database import MANDI_PRICES_DB

class MarketAgent:
    """
    Market Price Intelligence & 'Should I Harvest Now?' Decision Engine:
    Combines mandi prices, 7-day price forecasts, weather rain risk, and crop maturity stage
    to output a confidence score and action guidance.
    """
    def __init__(self):
        pass

    def evaluate_market_and_harvest(
        self,
        crop_type: str,
        growth_stage: str,
        weather: WeatherData
    ) -> MarketReport:
        mandi_info = MANDI_PRICES_DB.get(crop_type, MANDI_PRICES_DB["Tomato"])
        
        current_price = mandi_info["current_price"]
        projected_7d = mandi_info["projected_7d"]
        trend = mandi_info["trend"]
        nearest_mandi = mandi_info["nearest_mandi"]

        # Calculate upcoming rain impact on yield if unharvested
        upcoming_rain_mm = sum(w.rainfall_mm for w in weather.forecast_7d[:3])
        heavy_rain_predicted = upcoming_rain_mm > 15.0

        # Calculate price change expected %
        price_diff_pct = ((projected_7d - current_price) / current_price) * 100.0

        # Decision Engine Logic
        if growth_stage in ["Fruiting", "Harvesting"]:
            if heavy_rain_predicted and price_diff_pct > 0:
                # Harvest in 2-3 days before rain damages yield, capturing price rise
                rec = "Harvest in 3 Days (Pre-Rain Optimal Window)"
                confidence = 92
                yield_loss_risk = 28.0 # 28% yield loss if left in heavy rain
            elif heavy_rain_predicted:
                rec = "Harvest Immediately (Rain Damage Threat)"
                confidence = 88
                yield_loss_risk = 35.0
            elif price_diff_pct > 10.0:
                rec = "Wait 5-7 Days (Strong Price Rally Expected)"
                confidence = 85
                yield_loss_risk = 5.0
            elif trend == "Falling":
                rec = "Harvest Immediately (Price Decreasing)"
                confidence = 90
                yield_loss_risk = 8.0
            else:
                rec = "Harvest Gradually in Batches"
                confidence = 82
                yield_loss_risk = 4.0
        else:
            rec = f"Continue Growth Stage ({growth_stage}) - Not Ready for Harvest"
            confidence = 95
            yield_loss_risk = 0.0
            price_diff_pct = price_diff_pct * 0.5

        return MarketReport(
            crop=crop_type,
            nearest_mandi=nearest_mandi,
            current_price_per_quintal=current_price,
            projected_7d_price=projected_7d,
            price_trend=trend,
            harvest_recommendation=rec,
            harvest_confidence_score=confidence,
            price_change_expected_pct=round(price_diff_pct, 1),
            yield_loss_risk_if_delayed_pct=yield_loss_risk
        )
