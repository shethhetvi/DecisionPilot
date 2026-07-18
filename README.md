# DecisionPilot – AI Multi-Agent Decision Intelligence Platform

## Overview

People make important decisions every day—from choosing a college or career path to investing in stocks or buying electronics. Most AI chatbots simply give a single opinion without asking enough questions, evaluating all factors, comparing options systematically, or explaining their reasoning and trade-offs.

**DecisionPilot** solves this by using a **6-agent collaborative AI architecture**. Instead of operating as a traditional chatbot, these specialized AI agents collaborate, evaluate options, assess risks, and produce highly contextual, explainable recommendations.

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
│   │   ├── agents/       # The core reasoning engines (Context, Research, Analysis, Risk, Decision, Explanation, Orchestrator)
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

## 🤖 The Six-Agent Workflow

The core of DecisionPilot relies on a **6-agent workflow**, managed by an Orchestrator. Every agent communicates using structured JSON instead of plain text, ensuring a reliable data flow.

### 1. Context Agent
**Responsibility:** Understands the user's situation by interviewing them.
- **Goal:** Ensures no important information is missing (budget, purpose, constraints).
- **Output:** Structured JSON encapsulating the decision parameters.

### 2. Research Agent
**Responsibility:** Gathers factual information for each option.
- **Goal:** Compiles data like price, specs, salary, growth, risk, and market trends.
- **Output:** Structured ratings and factual data points for every option.

### 3. Analysis Agent
**Responsibility:** The core reasoning engine.
- **Goal:** Analyzes pros, cons, strengths, weaknesses, opportunity costs, and future impacts.
- **Output:** A detailed comparative analysis matrix.

### 4. Risk Agent
**Responsibility:** Predicts possible future problems (the crucial missing piece in most AIs).
- **Goal:** Identifies risks like "Cannot train large models", "High competition", or "Market volatility".
- **Output:** Risk scores and probability estimations for each option.

### 5. Decision Agent
**Responsibility:** Performs weighted scoring based on the previous agents' findings.
- **Goal:** Calculates a final numerical score for each option based on weighted factors (Cost, Performance, Future, etc.).
- **Output:** The recommended option backed by empirical scores.

### 6. Explanation Agent
**Responsibility:** Translates the decision into human-readable insights.
- **Goal:** Explains *WHY* the recommendation was made, its confidence level, and *WHY NOT* the other options.
- **Output:** A comprehensive, empathetic, and logical final response.

---

## 🔄 Orchestrator Agent & Internal Data Flow

The **Orchestrator** is the brain of the system. It doesn't make decisions itself; it manages the pipeline:

`User Query ➔ Context JSON ➔ Research JSON ➔ Analysis JSON ➔ Risk JSON ➔ Decision JSON ➔ Explanation JSON ➔ Frontend`

---

## 🛠 Tech Stack

- **Frontend:** Streamlit, Plotly (for decision score charts), AgGrid (for comparison tables).
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL (or SQLite for development).
- **AI & Workflow:** Gemini API (LLM), LangGraph (or custom orchestrator), Pydantic (for structured outputs).
- **Utilities:** ReportLab (PDF generation), Pandas (Analytics and history processing).

---

## 🚀 Future Expansion

Once the core system is working, specialized agents can be added without changing the base architecture:
* **Finance Agent:** For investments and budgeting.
* **Career Agent:** For education and job decisions.
* **Health Agent:** For lifestyle choices.
* **Travel Agent:** For itinerary comparisons.
* **Negotiation Agent:** To simulate stakeholder viewpoints.

This modular design is what makes DecisionPilot a true **agentic AI** project, making recommendations transparent, explainable, and highly trustworthy.
