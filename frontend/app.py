import streamlit as st

st.set_page_config(
    page_title="DecisionPilot | Home",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for a premium dark mode feel
st.markdown("""
<style>
    .main {
        background-color: #0E1117;
        color: #FAFAFA;
    }
    h1 {
        background: -webkit-linear-gradient(45deg, #FF4B2B, #FF416C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        font-size: 3.5rem;
        margin-bottom: 0px;
    }
    .hero-subtitle {
        font-size: 1.5rem;
        color: #A0AEC0;
        margin-bottom: 2rem;
    }
    .stButton>button {
        background: linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(255, 65, 108, 0.4);
    }
    .feature-box {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        height: 100%;
    }
    .feature-box h3 {
        color: #FF4B2B;
        margin-top: 0;
    }
</style>
""", unsafe_allow_html=True)

# Hero Section
st.title("DecisionPilot")
st.markdown('<p class="hero-subtitle">The AI Multi-Agent Decision Intelligence Platform</p>', unsafe_allow_html=True)

st.write("Stop relying on a single AI opinion. DecisionPilot orchestrates 6 specialized agents to evaluate your choices, assess risks, and provide data-backed recommendations.")

st.markdown("---")

# Quick Start Action
st.subheader("What decision can I help you make today?")

col1, col2 = st.columns([4, 1])
with col1:
    user_query = st.text_input("e.g., Should I buy a MacBook Air or Pro for AI development?", placeholder="Enter your dilemma here...", label_visibility="collapsed")
with col2:
    if st.button("Analyze Decision 🚀", use_container_width=True):
        if user_query:
            # Store in session state and redirect to Decision page
            st.session_state["current_query"] = user_query
            st.switch_page("pages/Decision.py")
        else:
            st.warning("Please enter a decision first!")

st.markdown("<br><br>", unsafe_allow_html=True)

# Features Grid
st.subheader("How it works")
col_a, col_b, col_c = st.columns(3)

with col_a:
    st.markdown("""
    <div class="feature-box">
        <h3>1. Deep Context</h3>
        <p>The Context Agent interviews you to ensure no constraints or hidden preferences are missed.</p>
    </div>
    """, unsafe_allow_html=True)

with col_b:
    st.markdown("""
    <div class="feature-box">
        <h3>2. Factual Research</h3>
        <p>The Research & Analysis agents gather real data, specs, and pros/cons for all your options.</p>
    </div>
    """, unsafe_allow_html=True)

with col_c:
    st.markdown("""
    <div class="feature-box">
        <h3>3. Risk & Scoring</h3>
        <p>The Risk & Decision agents predict future pitfalls and calculate a final weighted confidence score.</p>
    </div>
    """, unsafe_allow_html=True)
