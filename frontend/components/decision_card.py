import streamlit as st

def render_decision_card(recommendation, confidence, explanation):
    """
    Renders the final decision prominently.
    """
    st.markdown(f"""
    <div style="background: linear-gradient(135deg, rgba(255, 65, 108, 0.1) 0%, rgba(255, 75, 43, 0.1) 100%);
                border: 1px solid rgba(255, 65, 108, 0.3);
                border-radius: 16px;
                padding: 2rem;
                margin-bottom: 2rem;">
        <h2 style="color: #A0AEC0; margin-top: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Final Recommendation</h2>
        <h1 style="color: #FF416C; margin: 0.5rem 0; font-size: 3rem;">{recommendation}</h1>
        <div style="display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; margin-bottom: 1rem;">
            Confidence: {confidence}%
        </div>
        <p style="font-size: 1.1rem; line-height: 1.6; color: #E2E8F0;">
            {explanation}
        </p>
    </div>
    """, unsafe_allow_html=True)
