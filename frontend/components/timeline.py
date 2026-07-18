import streamlit as st
import time

def render_timeline():
    """Renders a dynamic timeline showing the 6-agent process in mock mode."""
    st.markdown("### 🤖 Orchestrator Running...")
    
    agents = [
        ("Context Agent", "Extracting constraints and goals..."),
        ("Research Agent", "Gathering facts and specs..."),
        ("Analysis Agent", "Evaluating pros, cons, and trade-offs..."),
        ("Risk Agent", "Predicting future pitfalls..."),
        ("Decision Agent", "Calculating weighted scores..."),
        ("Explanation Agent", "Formulating final recommendation...")
    ]
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    # Mock the loading process
    for i, (agent_name, status) in enumerate(agents):
        # Update text and progress
        progress_val = int(((i + 1) / len(agents)) * 100)
        status_text.markdown(f"**{agent_name}**: {status}")
        progress_bar.progress(progress_val)
        time.sleep(0.8) # Artificial delay for effect
        
    status_text.success("Decision Complete!")
    time.sleep(0.5)
    progress_bar.empty()
    status_text.empty()
