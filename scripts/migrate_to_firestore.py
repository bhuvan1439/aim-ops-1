import pandas as pd
import requests
import json
import os

PROJECT_ID = "aim-ops-1"
BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"

def to_firestore_value(val):
    if isinstance(val, str):
        return {"stringValue": val}
    elif isinstance(val, (int, float)):
        # Firestore handles doubles and integers differently
        if isinstance(val, int):
            return {"integerValue": str(val)}
        else:
            return {"doubleValue": val}
    elif pd.isna(val):
        return {"nullValue": None}
    else:
        return {"stringValue": str(val)}

def upload_dataframe(df, collection_name):
    print(f"Uploading {len(df)} rows to {collection_name}...")
    for i, row in df.iterrows():
        fields = {col: to_firestore_value(row[col]) for col in df.columns}
        payload = {"fields": fields}
        
        # Use a POST to let Firestore generate the ID, or a specific ID if wanted
        # For simplicity, we'll let Firestore generate IDs
        res = requests.post(f"{BASE_URL}/{collection_name}", json=payload)
        if res.status_code not in [200, 201]:
            print(f"Error uploading row {i}: {res.status_code} - {res.text}")
            break
        if i % 50 == 0:
            print(f"Uploaded {i} rows...")

if __name__ == "__main__":
    process_file = "_h_batch_process_data.xlsx"
    production_file = "_h_batch_production_data.xlsx"
    
    if os.path.exists(process_file):
        df_process = pd.read_excel(process_file)
        upload_dataframe(df_process, "process_data")
    
    if os.path.exists(production_file):
        df_production = pd.read_excel(production_file)
        upload_dataframe(df_production, "production_data")

    print("Migration complete!")
