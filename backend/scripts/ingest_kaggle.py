import os
import sys

try:
    import kaggle
except ImportError:
    print("❌ The 'kaggle' package is not installed.")
    print("Please run: pip install -r requirements.txt")
    sys.exit(1)

# Datasets to download
# Format: "kaggle_username/dataset_name"
DATASETS = {
    "laptops": "muhammetvarl/laptop-price",
    "colleges": "mohansacharya/graduate-admissions",
    "stocks": "camnugent/sandp500",
    "smartphones": "iabhishekofficial/mobile-price-classification",
    "careers": "arnabchaki/data-science-salaries-2023",
    "cities": "mvieira101/global-cost-of-living",
    "cars": "deepcontractor/car-price-prediction-challenge",
    "ai_models": "thedrcat/daigt-proper-train-dataset",
    "frameworks": "asaniczka/software-engineering-salaries-2023",
    "cloud_providers": "surajjha101/aws-certified-cloud-practitioner-questions"
}

TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw'))

def download_datasets():
    print(f"Downloading all 10 Kaggle datasets to {TARGET_DIR}...\n")
    
    # Ensure target directory exists
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    try:
        kaggle.api.authenticate()
    except Exception as e:
        print(f"❌ Kaggle authentication failed. Ensure your Kaggle API key is at ~/.kaggle/kaggle.json")
        print(f"Error: {e}")
        sys.exit(1)

    for category, dataset_id in DATASETS.items():
        print(f"--- Downloading {category} ({dataset_id}) ---")
        try:
            kaggle.api.dataset_download_files(dataset_id, path=TARGET_DIR, unzip=True)
            print(f"✅ Successfully downloaded {category}.\n")
        except Exception as e:
            print(f"❌ Failed to download {category}.\nError: {e}\n")

if __name__ == "__main__":
    download_datasets()
    print("All downloads complete. Proceed to run `clean_data.py` to prepare them for the agents.")
