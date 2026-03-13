import asyncio
import json
import time
import random
import math
import os
import hashlib
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import xgboost as xgb
import shap

app = FastAPI(title="AIM-OPS-1 Backend")

# --- Load Real Data ---
print("Loading real batch datasets...")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROCESS_DATA_PATH = os.path.join(BASE_DIR, '_h_batch_process_data.xlsx')
process_df = pd.read_excel(PROCESS_DATA_PATH)
batch_t001 = process_df[process_df['Batch_ID'] == 'T001'].to_dict('records')
print(f"Loaded {len(batch_t001)} rows for Batch T001 playback.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock Model Setup with XGBoost ---
print("Training mock XGBoost models...")
X_train = pd.DataFrame({
    'Temperature': [random.uniform(150, 200) for _ in range(200)],
    'Pressure': [random.uniform(2.0, 3.0) for _ in range(200)],
    'Machine_Speed': [random.uniform(100, 300) for _ in range(200)],
    'Binder_Amount': [random.uniform(10, 30) for _ in range(200)]
})
y_train = pd.DataFrame({
    'Energy_Cost': X_train['Temperature'] * 0.5 + X_train['Pressure'] * 20,
    'Quality_Score': 100 - abs(X_train['Temperature'] - 185) * 0.5 - abs(X_train['Pressure'] - 2.4) * 10,
    'Cycle_Time': 100 - X_train['Temperature'] * 0.2 - X_train['Pressure'] * 5
})

model_energy = xgb.XGBRegressor(n_estimators=15, random_state=42)
model_energy.fit(X_train, y_train['Energy_Cost'])

model_quality = xgb.XGBRegressor(n_estimators=15, random_state=42)
model_quality.fit(X_train, y_train['Quality_Score'])

model_cycle_time = xgb.XGBRegressor(n_estimators=15, random_state=42)
model_cycle_time.fit(X_train, y_train['Cycle_Time'])

# Pre-compute SHAP explainer
explainer_quality = shap.TreeExplainer(model_quality)
print("Model training complete.")

class RecipeInput(BaseModel):
    Temperature: float
    Pressure: float
    Machine_Speed: float
    Binder_Amount: float

@app.post("/api/predict")
async def predict_recipe(recipe: RecipeInput):
    df_in = pd.DataFrame([recipe.dict()])
    predicted_energy = model_energy.predict(df_in)[0]
    predicted_quality = model_quality.predict(df_in)[0]
    predicted_cycle = model_cycle_time.predict(df_in)[0]
    
    shap_values = explainer_quality.shap_values(df_in)
    feature_names = list(df_in.columns)
    
    explanations = []
    if isinstance(shap_values, list):
        vals = shap_values[0][0]
    elif len(shap_values.shape) == 2:
        vals = shap_values[0]
    elif len(shap_values.shape) == 3:
        vals = shap_values[0, :, 0]
    else:
        vals = [0] * len(feature_names)

    for i, feature in enumerate(feature_names):
        explanations.append({"feature": feature, "impact": float(vals[i])})
    
    explanations.sort(key=lambda x: abs(x["impact"]), reverse=True)
    
    return {
        "predicted_energy_cost": float(predicted_energy),
        "predicted_quality_score": float(predicted_quality),
        "predicted_cycle_time": float(predicted_cycle),
        "shap_explanations": explanations
    }

class PlanInput(BaseModel):
    Production_Units: int
    Machine_Speed: float

@app.post("/api/predict_plan")
async def predict_plan(plan: PlanInput):
    # Mock forecasting
    base_energy = plan.Production_Units * 1.2
    speed_factor = plan.Machine_Speed / 200.0
    predicted_energy = base_energy * speed_factor
    return {"predicted_total_energy_kwh": predicted_energy}

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    time_minutes = 0
    golden_curve_seed = random.uniform(30.0, 40.0)
    max_minutes = len(batch_t001)
    
    try:
        while True:
            # Playback real data, looping if necessary
            row_idx = time_minutes % max_minutes
            row = batch_t001[row_idx]
            
            vibration = row['Vibration_mm_s']
            
            cycle_time = time_minutes % 30
            if cycle_time > 20: 
                vibration += (cycle_time - 20) * 0.02
            power = row['Power_Consumption_kW']
            temp = row['Temperature_C']
            
            cycle_time_t = time_minutes % 30
            if cycle_time_t > 20: 
                temp += (cycle_time_t - 20) * 4
            
            tablet_hardness = random.uniform(80, 100) # Keep mock for UI
            friability = random.uniform(0.1, 0.4)     # Keep mock for UI
            
            if vibration > 0.12: # Threshold adjusted for real dataset scale
                 friability = random.uniform(0.6, 0.9)
                 
            carbon_footprint = time_minutes * 0.15 
            golden_power = golden_curve_seed + (time_minutes * 0.1) + math.sin(time_minutes * 0.5) * 5
            
            # AI Correction logic mock with Root Cause Analysis
            correction_prompt = None
            root_causes = None
            
            if power > golden_power * 1.05: # > 5% deviation
                correction_prompt = "Deviation detected: Power profile exceeding Golden Signature trajectory."
                root_causes = [
                    {"factor": "Cycle Time increased", "contribution": 55},
                    {"factor": "Temperature drift", "contribution": 30},
                    {"factor": "Pressure variation", "contribution": 15}
                ]
            if friability > 0.5:
                correction_prompt = "Quality Alert: Predicted Friability exceeding acceptable threshold."
                root_causes = [
                    {"factor": "Vibration Spike", "contribution": 70},
                    {"factor": "Machine Speed", "contribution": 20},
                    {"factor": "Temperature drop", "contribution": 10}
                ]
                
            data = {
                "Time_Minutes": time_minutes,
                "Power_Consumption_kW": round(power, 2),
                "Temperature_C": round(temp, 2),
                "Vibration_mm_s": round(vibration, 2),
                "Predicted_Final_Hardness": round(tablet_hardness, 1),
                "Predicted_Friability": round(friability, 2),
                "Accumulated_Carbon_kg": round(carbon_footprint, 2),
                "Golden_Power_kW": round(golden_power, 2),
                "Correction_Prompt": correction_prompt,
                "Root_Causes": root_causes
            }
            await websocket.send_json(data)
            time_minutes += 1
            await asyncio.sleep(1) # Send every 1 second
    except Exception as e:
        print("WebSocket disconnected:", e)

@app.get("/api/batches")
def get_batches():
    return ["Batch B-2024-0847", "Batch B-2024-0846", "Batch B-2024-0845"]

@app.get("/api/energy-analytics/{batch_id}")
def get_energy_analytics(batch_id: str):
    # Deterministic randomness based on the batch string
    seed_val = int(hashlib.md5(batch_id.encode()).hexdigest(), 16)
    local_rnd = random.Random(seed_val)
    
    multiplier = local_rnd.uniform(0.7, 1.3)
        
    max_idx = len(batch_t001) if len(batch_t001) > 0 else 1
    
    energy_data = []
    # Every 2 hours
    for h in range(0, 25, 2):
        row = batch_t001[(h * 10) % max_idx]
        base_power = row['Power_Consumption_kW'] * 6  # Scale 20kW -> 120+ KPI ranges
        
        actual = base_power * multiplier * local_rnd.uniform(0.9, 1.1)
        predicted = base_power * 1.05 * multiplier
        historical = base_power * 1.2 * local_rnd.uniform(0.8, 1.2)
        
        energy_data.append({
            "time": f"{h}:00",
            "actual": round(actual),
            "predicted": round(predicted),
            "historical": round(historical)
        })
        
    next_batch_data = []
    for h in range(0, 12):
        row = batch_t001[(h * 5) % max_idx]
        base_power = row['Power_Consumption_kW'] * 5.5 * multiplier
        next_batch_data.append({
            "hour": f"{h}:00",
            "energy": round(base_power * local_rnd.uniform(0.95, 1.05))
        })
        
    current_load = energy_data[-1]["actual"]
    predicted_next = round(current_load * 1.08)
    daily_savings = round(sum(d["historical"] - d["actual"] for d in energy_data if d["historical"] > d["actual"]))
    
    return {
        "energyData": energy_data,
        "nextBatchData": next_batch_data,
        "kpis": {
            "currentLoad": current_load,
            "predictedNextHour": predicted_next,
            "dailySavings": daily_savings,
            "peakUsage": "14:00"
        }
    }
