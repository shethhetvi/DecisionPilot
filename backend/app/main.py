from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import decision

app = FastAPI(
    title="DecisionPilot API",
    description="Backend API for the DecisionPilot Multi-Agent System",
    version="0.1.0"
)

# Configure CORS for Streamlit Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/health", tags=["Health"])
async def health_check():
    """Check if the API is running."""
    return {"status": "healthy", "service": "DecisionPilot Backend"}

# Include routers
app.include_router(decision.router)
