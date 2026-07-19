import os
import subprocess

# Datasets to download
# Format: "kaggle_username/dataset_name"
DATASETS = {
    "laptops": "muhammetvarl/laptop-price",
    "colleges": "yashbhalgat/college-admissions-dataset",
    "stocks": "camnugent/sandp500",
    "smartphones": "vijaik2/smartphone-specifications-pricing-eda-ready"
}

TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw'))

def download_datasets():
    print(f"Downloading Kaggle datasets to {TARGET_DIR}...\n")
    
    # Ensure target directory exists
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    for category, dataset_id in DATASETS.items():
        print(f"--- Downloading {category} ({dataset_id}) ---")
        try:
            # Use the Kaggle CLI to download and unzip directly to the target directory
            # Equivalent to: kaggle datasets download -d <dataset_id> -p <path> --unzip
            subprocess.run([
                "kaggle", "datasets", "download", 
                "-d", dataset_id, 
                "-p", TARGET_DIR, 
                "--unzip"
            ], check=True)
            print(f"✅ Successfully downloaded {category}.\n")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to download {category}. Ensure your Kaggle API key is configured properly (e.g., ~/.kaggle/kaggle.json).\n")
            print(f"Error: {e}\n")

if __name__ == "__main__":
    download_datasets()
    print("All downloads complete. Proceed to run `clean_data.py` to prepare them for the agents.")
