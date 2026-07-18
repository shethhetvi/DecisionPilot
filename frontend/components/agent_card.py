import streamlit as st
import json

def render_agent_logs(mock_data):
    """
    Renders expandable sections showing the JSON output of each agent.
    """
    st.markdown("### 🔍 Transparency: Agent Logs")
    st.write("Inspect the exact reasoning and data passed between agents.")
    
    for agent_name, payload in mock_data.items():
        with st.expander(f"🤖 {agent_name} Output"):
            st.json(payload)
