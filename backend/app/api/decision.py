from fastapi import APIRouter
from app.schemas.decision import DecisionRequest, DecisionResponse

router = APIRouter(
    prefix="/api/decisions",
    tags=["Decisions"]
)

@router.post("/", response_model=DecisionResponse)
async def process_decision(request: DecisionRequest):
    """
    Submit a decision scenario to the DecisionPilot orchestrator.
    Currently returns a mocked response while agents are being implemented.
    """
    # TODO: Connect this to the Orchestrator Agent
    
    return DecisionResponse(
        decision="This is a placeholder decision until the Orchestrator is fully connected.",
        explanation="The multi-agent system is currently being built. Your query was: " + request.query,
        risk_score=50.0,
        metadata={"status": "mock"}
    )
