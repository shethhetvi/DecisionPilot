import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import streamlit as st

def render_radar_chart(options_data):
    """
    Renders a Plotly Radar chart comparing multiple options across categories.
    options_data format: 
    {
        "MacBook Air": [8, 9, 6, 7, 8],
        "MacBook Pro": [6, 7, 9, 8, 9]
    }
    """
    categories = ['Cost Efficiency', 'Portability', 'Performance', 'Future Proof', 'Low Risk']
    
    fig = go.Figure()
    
    colors = ['#FF416C', '#3b82f6', '#10b981', '#f59e0b']
    
    for i, (option, scores) in enumerate(options_data.items()):
        # Close the polygon by appending the first value
        plot_scores = scores + [scores[0]]
        plot_categories = categories + [categories[0]]
        
        fig.add_trace(go.Scatterpolar(
            r=plot_scores,
            theta=plot_categories,
            fill='toself',
            name=option,
            line=dict(color=colors[i % len(colors)]),
            opacity=0.7
        ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10],
                gridcolor="rgba(255,255,255,0.1)",
                linecolor="rgba(255,255,255,0.1)"
            ),
            bgcolor="rgba(0,0,0,0)",
        ),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#FAFAFA"),
        showlegend=True,
        margin=dict(l=40, r=40, t=40, b=40)
    )
    
    st.plotly_chart(fig, use_container_width=True)

def render_bar_chart(scores):
    """
    Renders a bar chart for overall scores.
    """
    df = pd.DataFrame(list(scores.items()), columns=['Option', 'Score'])
    
    fig = px.bar(
        df, 
        x='Option', 
        y='Score',
        color='Option',
        color_discrete_sequence=['#FF416C', '#3b82f6', '#10b981', '#f59e0b'],
        text='Score'
    )
    
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#FAFAFA"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.1)", range=[0, 100]),
        showlegend=False
    )
    fig.update_traces(textposition='outside')
    
    st.plotly_chart(fig, use_container_width=True)
