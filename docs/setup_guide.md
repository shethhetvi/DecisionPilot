# Setup Guide

Follow these steps to get DecisionPilot running locally on your machine.

## Prerequisites
- Python 3.10+
- PostgreSQL (or SQLite will be used by default if DB URI is omitted)
- Gemini API Key (from Google AI Studio)

---

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd DecisionPilot
```

## 2. Setup Virtual Environment
It is recommended to use a virtual environment to manage dependencies.

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

## 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Return to root, then install frontend dependencies (if separate requirements exist)
# (Currently, frontend can share the backend's venv or use its own)
```

## 4. Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./decisionpilot.db  # Or your PostgreSQL URI
```

## 5. Run the Backend (FastAPI)
Open a terminal and start the FastAPI server:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
The API documentation will be available at: `http://localhost:8000/docs`

## 6. Run the Frontend (Streamlit)
Open a **new** terminal window (keep the backend running) and start the Streamlit app:

```bash
# Make sure your virtual environment is activated
cd frontend
streamlit run app.py
```
The Streamlit interface will automatically open in your browser at `http://localhost:8501`.

---

## Troubleshooting

- **CORS Errors**: Ensure the FastAPI backend has CORS middleware configured to allow requests from `http://localhost:8501`.
- **LLM Rate Limits**: If you receive 429 errors from the Gemini API, ensure you are not sending too many concurrent requests during the Orchestrator loop.
