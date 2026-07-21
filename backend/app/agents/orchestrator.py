from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from .state import DecisionState
import json
import time

# Initialize Gemini Model
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2, max_retries=3)

def context_node(state: DecisionState):
    time.sleep(2)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Context Agent. Your job is to extract constraints, preferences, and core requirements from the user's decision query. Output only the context constraints."),
        ("user", "{query}")
    ])
    chain = prompt | llm
    response = chain.invoke({"query": state["query"]})
    return {"context": response.content, "current_agent": "context"}

def research_node(state: DecisionState):
    time.sleep(2)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Research Agent. Gather factual information, potential options, and data based on the following query and context. Output only the research facts."),
        ("user", "Query: {query}\nContext: {context}")
    ])
    chain = prompt | llm
    response = chain.invoke({"query": state["query"], "context": state["context"]})
    return {"research_data": response.content, "current_agent": "research"}

def analysis_node(state: DecisionState):
    time.sleep(2)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Analysis Agent. Evaluate the research data against the constraints. Compare the top options. Output the pros and cons."),
        ("user", "Query: {query}\nContext: {context}\nResearch: {research_data}")
    ])
    chain = prompt | llm
    response = chain.invoke({"query": state["query"], "context": state["context"], "research_data": state["research_data"]})
    return {"analysis": response.content, "current_agent": "analysis"}

def risk_node(state: DecisionState):
    time.sleep(2)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Risk Agent. Identify potential pitfalls, hidden costs, or long-term risks for the top options identified in the analysis. Output only the risks."),
        ("user", "Query: {query}\nAnalysis: {analysis}")
    ])
    chain = prompt | llm
    response = chain.invoke({"query": state["query"], "analysis": state["analysis"]})
    return {"risks": response.content, "current_agent": "risk"}

def decision_node(state: DecisionState):
    time.sleep(2)
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are the Decision Agent. Based on all previous steps, make a final recommendation. 
You MUST output your response as a raw JSON object (do not wrap in markdown ```json blocks) with the following exact schema:
{
  "recommendation": "The primary recommended option name",
  "confidence": 95,
  "explanation": "A short paragraph explaining why.",
  "options": [
    {
      "name": "Option 1 Name",
      "score": 85,
      "primary_risk": "The biggest risk for this option"
    },
    {
      "name": "Option 2 Name",
      "score": 95,
      "primary_risk": "The biggest risk for this option"
    }
  ]
}"""),
        ("user", "Query: {query}\nContext: {context}\nResearch: {research_data}\nAnalysis: {analysis}\nRisks: {risks}")
    ])
    chain = prompt | llm
    response = chain.invoke({
        "query": state["query"],
        "context": state["context"],
        "research_data": state["research_data"],
        "analysis": state["analysis"],
        "risks": state["risks"]
    })
    
    # Attempt to parse JSON. If it fails, fallback gracefully
    content = response.content.replace("```json", "").replace("```", "").strip()
    try:
        final_decision = json.loads(content)
    except Exception:
        final_decision = {
            "recommendation": "Parsing Error",
            "confidence": 0,
            "explanation": f"Failed to parse LLM output as JSON: {content}",
            "options": []
        }
        
    # The final step is Explanation, which we can combine here or we can just finish
    # Since UI expects 6 steps, let's just make the final agent "explanation" conceptually or add a dummy node
    return {"final_decision": final_decision, "current_agent": "decision"}

def explanation_node(state: DecisionState):
    # Just a pass-through node to trigger the 6th UI step
    return {"current_agent": "explanation", "final_decision": state.get("final_decision", {})}

# Build Graph
graph_builder = StateGraph(DecisionState)

graph_builder.add_node("context", context_node)
graph_builder.add_node("research", research_node)
graph_builder.add_node("analysis", analysis_node)
graph_builder.add_node("risk", risk_node)
graph_builder.add_node("decision", decision_node)
graph_builder.add_node("explanation", explanation_node)

graph_builder.add_edge("context", "research")
graph_builder.add_edge("research", "analysis")
graph_builder.add_edge("analysis", "risk")
graph_builder.add_edge("risk", "decision")
graph_builder.add_edge("decision", "explanation")
graph_builder.add_edge("explanation", END)

graph_builder.set_entry_point("context")

orchestrator_app = graph_builder.compile()
