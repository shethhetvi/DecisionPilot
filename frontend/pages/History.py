import streamlit as st
import pandas as pd

st.markdown("""
<style>
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
</style>
""", unsafe_allow_html=True)

st.title("🕒 Decision History")
st.write("Review your past decisions and their outcomes.")

# Mock history data
data = {
    "Date": ["2024-05-20", "2024-05-22", "2024-05-24"],
    "Query": [
        "Should I invest in Stock A or B?", 
        "Which city should I move to?", 
        "MacBook Air vs Pro"
    ],
    "Recommendation": ["Stock B", "Austin, TX", "MacBook Pro"],
    "Confidence": ["85%", "78%", "92%"]
}

df = pd.DataFrame(data)

st.dataframe(df, use_container_width=True, hide_index=True)
