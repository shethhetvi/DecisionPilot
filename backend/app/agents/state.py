from typing import TypedDict, Dict, Any

class DecisionState(TypedDict):
    query: str
    context: str
    research_data: str
    analysis: str
    risks: str
    final_decision: Dict[str, Any]
    current_agent: str
