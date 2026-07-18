import streamlit as st
import plotly.express as px
import pandas as pd

st.markdown("""
<style>
    .stApp {
        background-color: #0E1117;
        color: #FAFAFA;
    }
</style>
""", unsafe_allow_html=True)

st.title("📊 Platform Analytics")
st.write("Understand your decision-making patterns.")

col1, col2, col3 = st.columns(3)
col1.metric("Total Decisions", "14")
col2.metric("Avg. Confidence", "87%")
col3.metric("Highest Risk Avoided", "9/10")

st.markdown("---")

st.subheader("Decision Categories")
data = pd.DataFrame({
    "Category": ["Finance", "Career", "Tech", "Travel"],
    "Count": [5, 2, 4, 3]
})

fig = px.pie(data, values="Count", names="Category", hole=0.4, 
             color_discrete_sequence=['#FF416C', '#3b82f6', '#10b981', '#f59e0b'])
fig.update_layout(paper_bgcolor="rgba(0,0,0,0)", font=dict(color="#FAFAFA"))

st.plotly_chart(fig, use_container_width=True)
