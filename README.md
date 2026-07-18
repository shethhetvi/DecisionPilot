# DecisionPilot – Multi-Agent Decision Intelligence System

## Overview

**DecisionPilot** is a true **multi-agent AI system** designed to help users make better decisions by collecting information, analyzing multiple perspectives, comparing options, and delivering explainable recommendations. Instead of operating as a traditional chatbot, DecisionPilot leverages specialized AI agents that collaborate to evaluate options, assess risks, and produce highly contextual recommendations.

---

## 🏗 Architecture

DecisionPilot is structured to separate responsibilities clearly across a frontend interface and a robust backend powered by multiple AI agents.

```
DecisionPilot
│
├── frontend/             # Streamlit-based UI for user interaction and visualization
│   ├── pages/            # Individual pages (Home, Decision, History, Analytics)
│   ├── components/       # Reusable UI components (Cards, Charts, Timelines)
│   └── app.py            # Main entry point for the frontend
│
├── backend/              # FastAPI backend housing the multi-agent system
│   ├── app/
│   │   ├── api/          # API endpoints for frontend communication
│   │   ├── agents/       # The core reasoning engines (Intake, Analysis, Recommendation, Orchestrator)
│   │   ├── models/       # Data models for structured handling of decisions and reports
│   │   ├── schemas/      # Pydantic schemas for API validation
│   │   ├── services/     # Utility services (LLM calls, scoring, PDF reporting)
│   │   ├── database/     # DB configuration and ORM models for persistent storage
│   │   └── main.py       # FastAPI application entry point
│   └── requirements.txt  # Python dependencies
│
├── datasets/             # Directory for data used in analytics and history
├── docs/                 # Project documentation
└── README.md             # This file
```

---

## 🤖 The Three AI Agents

The core of DecisionPilot relies on a **three-agent workflow**, orchestrated seamlessly to guide the user from an initial query to a detailed recommendation.

### 1. Intake Agent
**Responsibility:** Collects comprehensive information from the user through conversational data gathering.
- **Goal:** Understands budget, constraints, preferences, and potential options.
- **Output:** Produces structured JSON data encapsulating the decision parameters.

### 2. Analysis Agent
**Responsibility:** Acts as the reasoning engine to evaluate options.
- **Capabilities:** Performs pros/cons analysis, risk assessment, cost & opportunity analysis, and identifies missing information.
- **Output:** Provides detailed scoring matrices (Cost, Performance, Risk, Future Proof, etc.) and confidence scores for every option.

### 3. Recommendation Agent
**Responsibility:** Synthesizes the analysis into a final decision.
- **Capabilities:** Selects the best choice, explains the reasoning, highlights the confidence level, and provides alternatives.
- **Output:** The final, explainable recommendation delivered to the user.

---

## 🔄 Agent Flow & Orchestration

The system uses an **Orchestrator** to control the execution order in a pipeline fashion:

1. **User Request** comes in via the Frontend to the Backend API.
2. **Intake Agent** processes the request into structured data.
3. **Analysis Agent** evaluates the structured data to produce scores and risks.
4. **Recommendation Agent** reviews the analysis to formulate the final decision.
5. **Response** is returned to the user with full transparency (pros/cons, reasoning, scores).

---

## 🛠 Tech Stack

- **Frontend:** Streamlit, Plotly (for decision score charts), AgGrid (for comparison tables).
- **Backend:** FastAPI, Pydantic, SQLAlchemy, PostgreSQL (or SQLite for development).
- **AI & Workflow:** Gemini API (LLM), LangGraph (or custom orchestrator) for multi-agent workflows.
- **Utilities:** ReportLab (PDF generation), Pandas (Analytics and history processing).

---

## 💡 Why this architecture?

* **Clear separation of responsibilities:** Each agent has a single job (collect, analyze, recommend), making the system easier to test and extend.
* **Modularity:** You can replace or improve one agent without affecting the others.
* **Explainability:** Users see not just the recommendation, but also the reasoning, trade-offs, and confidence.
* **Future-ready:** The architecture is scalable, allowing for specialized agents (financial, legal, health, career) to be added without redesigning the core workflow.
