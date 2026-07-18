import streamlit as st
import time

# Import components (relative imports since this is in pages/)
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from components.timeline import render_timeline
from components.decision_card import render_decision_card
from components.charts import render_radar_chart, render_bar_chart
from components.agent_card import render_agent_logs

# Apply the same background color for consistency if running directly
st.markdown("""
<style>
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
</style>
""", unsafe_allow_html=True)

st.title("✨ Decision Analysis")

# Check if there's a query from the Home page
query = st.session_state.get("current_query", "")

if not query:
    st.info("No decision query found. Please go to the Home page to start.")
    st.stop()

st.markdown(f"**Your Query:** `{query}`")
st.markdown("---")

# Mock data for demonstration
mock_radar_data = {
    "MacBook Air": [9, 9, 6, 5, 4], # Cost, Portability, Performance, Future, Risk (inverted)
    "MacBook Pro": [5, 6, 9, 9, 8]
}

mock_bar_data = {
    "MacBook Air": 75,
    "MacBook Pro": 88
}

mock_logs = {
    "Context Agent": {
        "goal": "Laptop purchase",
        "budget": 2000,
        "purpose": "AI Development",
        "options_to_compare": ["MacBook Air", "MacBook Pro"]
    },
    "Risk Agent": {
        "MacBook Air": "High risk of thermal throttling during model training.",
        "MacBook Pro": "Low risk. Sufficient active cooling and unified memory."
    }
}

# Run the mock timeline if not already processed
if "decision_processed" not in st.session_state or st.session_state.get("last_query") != query:
    render_timeline()
    st.session_state["decision_processed"] = True
    st.session_state["last_query"] = query

# --- Render Results ---
render_decision_card(
    recommendation="MacBook Pro",
    confidence=92,
    explanation="Based on your need for AI development, the MacBook Pro is the superior choice. While it pushes your budget, the active cooling and higher GPU core count are critical for sustained ML workloads."
)

st.markdown("### 📊 Comparative Analysis")
col1, col2 = st.columns(2)

with col1:
    st.markdown("**Multi-factor Comparison**")
    render_radar_chart(mock_radar_data)

with col2:
    st.markdown("**Overall Decision Score**")
    render_bar_chart(mock_bar_data)

st.markdown("---")

render_agent_logs(mock_logs)

if st.button("Start New Decision", type="primary"):
    st.session_state["current_query"] = ""
    st.session_state["decision_processed"] = False
    st.switch_page("app.py")
