from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class DecisionRequest(BaseModel):
    query: str = Field(..., description="The main question or decision scenario")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Additional context or preferences")

class DecisionResponse(BaseModel):
    decision: str = Field(..., description="The final recommendation or decision")
    explanation: str = Field(..., description="Detailed explanation of the reasoning")
    risk_score: Optional[float] = Field(default=None, description="Risk assessment score between 0 and 100")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional output from agents")
