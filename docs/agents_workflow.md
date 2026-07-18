# Agents Workflow & Data Schemas

DecisionPilot relies on structured communication between 6 specialized agents. Each agent receives JSON from the previous step and outputs new JSON data, building up a comprehensive "Decision Profile."

---

## 1. Context Agent
**Role**: Extracts explicit constraints, preferences, and goals from the user's conversational input.

**Input**: User's natural language query (e.g., "Should I buy a MacBook Air or Pro for AI dev? Budget is $2k.")

**Output Schema**:
```json
{
  "goal": "Laptop purchase",
  "budget": 2000,
  "currency": "USD",
  "purpose": "AI Development",
  "priorities": ["Performance", "Portability"],
  "options_to_compare": ["MacBook Air", "MacBook Pro"]
}
```

---

## 2. Research Agent
**Role**: Simulates factual lookup for each option based on the context.

**Input**: Context Agent's JSON.

**Output Schema**:
```json
{
  "options_data": {
    "MacBook Air": {
      "estimated_price": 1200,
      "specs": {"cpu": "M3", "ram": "16GB", "gpu": "Integrated (Lower core count)"},
      "battery_life": "18 hours",
      "weight": "2.7 lbs"
    },
    "MacBook Pro": {
      "estimated_price": 1999,
      "specs": {"cpu": "M3 Pro", "ram": "18GB", "gpu": "Integrated (Higher core count)"},
      "battery_life": "14 hours",
      "weight": "3.5 lbs"
    }
  }
}
```

---

## 3. Analysis Agent
**Role**: Performs qualitative reasoning (Pros/Cons/Strengths/Weaknesses).

**Input**: Context JSON + Research JSON.

**Output Schema**:
```json
{
  "analysis": {
    "MacBook Air": {
      "pros": ["Highly portable", "Excellent battery", "Cost-effective"],
      "cons": ["Thermal throttling under sustained load", "Weaker GPU for local LLM inference"],
      "opportunity_cost": "Time lost on slower model training."
    },
    "MacBook Pro": {
      "pros": ["Active cooling prevents throttling", "Superior GPU performance", "More ports"],
      "cons": ["Heavier", "Hits the absolute ceiling of the budget"],
      "opportunity_cost": "Less budget remaining for accessories/cloud compute."
    }
  }
}
```

---

## 4. Risk Agent
**Role**: Evaluates potential future failures or downsides.

**Input**: Analysis JSON.

**Output Schema**:
```json
{
  "risks": {
    "MacBook Air": {
      "primary_risk": "Cannot run 13B+ parameter models locally.",
      "risk_score_out_of_10": 7,
      "mitigation": "Use cloud compute (AWS/RunPod) for heavy lifting."
    },
    "MacBook Pro": {
      "primary_risk": "Overspending on hardware when cloud compute is cheaper.",
      "risk_score_out_of_10": 3,
      "mitigation": "Ensure full utilization of local hardware."
    }
  }
}
```

---

## 5. Decision Agent
**Role**: Quantifies the data into numerical scores based on the user's priorities.

**Input**: Context, Research, Analysis, and Risk JSONs.

**Output Schema**:
```json
{
  "scores": {
    "MacBook Air": {
      "cost_score": 9,
      "performance_score": 6,
      "risk_penalty": -3,
      "total_score": 75
    },
    "MacBook Pro": {
      "cost_score": 6,
      "performance_score": 9,
      "risk_penalty": -1,
      "total_score": 88
    }
  },
  "recommended_option": "MacBook Pro"
}
```

---

## 6. Explanation Agent
**Role**: Crafts a human-readable, empathetic summary of the entire process.

**Input**: The complete aggregated JSON from all previous agents.

**Output Schema**:
```json
{
  "final_recommendation": "MacBook Pro",
  "confidence_percentage": 92,
  "explanation": "Based on your need for AI development, the MacBook Pro is the superior choice. While it pushes your $2,000 budget, the active cooling and higher GPU core count are critical for sustained ML workloads.",
  "why_not_others": "The MacBook Air is lighter and cheaper, but carries a high risk of thermal throttling during AI training, which would hinder your primary goal.",
  "next_steps": "Consider looking for refurbished M2 Max or M3 Pro models to stay comfortably under your $2,000 budget while maintaining peak performance."
}
```
