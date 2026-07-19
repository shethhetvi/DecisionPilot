from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import asyncio
from sse_starlette.sse import EventSourceResponse
import dotenv

# Load environment variables (e.g. GEMINI_API_KEY)
dotenv.load_dotenv()

from app.agents.orchestrator import orchestrator_app

app = FastAPI(title="DecisionPilot API")

# Configure CORS for Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/api/decide/stream")
async def decide_stream(request: Request, payload: QueryRequest):
    async def event_generator():
        query = payload.query
        state = {"query": query}
        
        try:
            for output in orchestrator_app.stream(state):
                # If client disconnects, stop processing
                if await request.is_disconnected():
                    break
                    
                # output is a dict with node_name: updated_state
                node_name = list(output.keys())[0]
                node_state = output[node_name]
                
                # We yield the agent that just finished
                data = json.dumps({
                    "agent": node_state.get("current_agent", node_name),
                    "status": "completed"
                })
                yield {"data": data}
                
                # Slight artificial delay for UI UX
                await asyncio.sleep(0.5)
                
                if node_name == "explanation":
                    # We are at the end, yield final decision
                    final_decision = node_state.get("final_decision", {})
                    yield {"data": json.dumps({
                        "agent": "done",
                        "final_decision": final_decision
                    })}
                    break
        except Exception as e:
            yield {"data": json.dumps({"error": str(e)})}
            
    return EventSourceResponse(event_generator())
