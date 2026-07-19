import os
import pandas as pd
import glob

RAW_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw'))
CLEAN_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'clean'))

def clean_datasets():
    print(f"Scanning for raw datasets in {RAW_DIR}...\n")
    
    os.makedirs(CLEAN_DIR, exist_ok=True)
    
    # Kaggle downloads can sometimes extract to subfolders, we want to grab all CSVs recursively
    csv_files = glob.glob(os.path.join(RAW_DIR, "**", "*.csv"), recursive=True)
    
    if not csv_files:
        print("No CSV files found. Did you run `ingest_kaggle.py` first?")
        return

    for file_path in csv_files:
        filename = os.path.basename(file_path)
        print(f"Cleaning {filename}...")
        
        try:
            # Use ISO-8859-1 to handle special characters (like euros/accents) present in some datasets
            df = pd.read_csv(file_path, encoding='ISO-8859-1')
            
            # Basic Cleaning Steps:
            # 1. Drop rows with too many NaNs
            df = df.dropna(thresh=len(df.columns) * 0.5)
            
            # 2. Forward fill remaining NaNs or fill with 0 based on data type
            for col in df.columns:
                if pd.api.types.is_numeric_dtype(df[col]):
                    df[col] = df[col].fillna(0)
                else:
                    df[col] = df[col].fillna("Unknown")
            
            # Save the cleaned dataset
            clean_path = os.path.join(CLEAN_DIR, filename)
            df.to_csv(clean_path, index=False)
            print(f"✅ Saved cleaned dataset to {clean_path} (Rows: {len(df)})\n")
            
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}\n")

if __name__ == "__main__":
    clean_datasets()
    print("Data cleaning complete. Ready for ML model training and Orchestrator use.")
