# API Reference

The DecisionPilot backend exposes a set of RESTful APIs built with FastAPI. These endpoints allow the frontend (or any external client) to interact with the multi-agent Orchestrator and retrieve historical data.

## Base URL
Local Development: `http://localhost:8000/api/v1`

---

## 1. POST `/decision/analyze`

**Description:** Triggers the full 6-agent Orchestrator pipeline to analyze a decision and provide a recommendation. This is a long-polling request or can be adapted for WebSockets/Server-Sent Events (SSE) for streaming updates.

### Request Body (JSON)
```json
{
  "user_query": "Should I learn Rust or Go for backend development? I want high performance but easy concurrency.",
  "additional_context": {
    "experience_level": "Intermediate",
    "timeline": "3 months"
  }
}
```

### Response (JSON)
Returns the final output from the Explanation Agent, optionally including the intermediate payloads from other agents if requested.

```json
{
  "status": "success",
  "data": {
    "recommendation": "Go",
    "confidence": 88,
    "explanation": "Given your requirement for 'easy concurrency', Go's goroutines provide a much gentler learning curve than Rust's borrow checker for async tasks...",
    "why_not_others": "Rust offers slightly better raw performance and memory safety, but takes significantly longer to master...",
    "scores": {
      "Go": 85,
      "Rust": 78
    },
    "risks": {
      "Go": "Lower ceiling for extreme systems-level optimization.",
      "Rust": "High risk of abandoning the learning process due to steep difficulty curve."
    }
  }
}
```

---

## 2. GET `/decision/history`

**Description:** Retrieves a list of previously analyzed decisions for the current user session.

### Query Parameters
- `limit` (int, default: 10): Number of records to return.
- `offset` (int, default: 0): Pagination offset.

### Response (JSON)
```json
{
  "status": "success",
  "data": [
    {
      "decision_id": "dec_12345",
      "query": "MacBook Air vs Pro",
      "recommendation": "MacBook Pro",
      "created_at": "2024-05-24T10:30:00Z"
    }
  ]
}
```

---

## 3. GET `/decision/{decision_id}`

**Description:** Retrieves the full, detailed breakdown of a specific decision, including the raw JSON outputs of all 6 agents for transparency/auditing.

### Path Parameters
- `decision_id` (string): The unique identifier of the decision.

### Response (JSON)
```json
{
  "status": "success",
  "data": {
    "decision_id": "dec_12345",
    "agents_payloads": {
      "context": {...},
      "research": {...},
      "analysis": {...},
      "risk": {...},
      "decision": {...},
      "explanation": {...}
    }
  }
}
```
