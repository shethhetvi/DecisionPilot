import { useState, useEffect } from 'react';

export default function ComparisonDashboard({ query, data, onReset }) {
  const [showBars, setShowBars] = useState(false);

  useEffect(() => {
    // Trigger animation for progress bars after component mounts
    setTimeout(() => setShowBars(true), 100);
  }, []);

  if (!data || !data.options) {
    return (
      <div className="container">
        <h2>Decision Complete</h2>
        <p>No valid data returned from the agent.</p>
        <button className="btn-primary" onClick={onReset}>New Decision</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Decision Complete</h2>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={onReset}>
          New Decision
        </button>
      </div>

      <div className="glass-card" style={{ 
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        borderColor: 'rgba(236, 72, 153, 0.3)',
        marginBottom: '2rem'
      }}>
        <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Final Recommendation</h4>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>
          <span className="text-gradient">{data.recommendation}</span>
        </h1>
        
        <div style={{ 
          display: 'inline-block', 
          background: 'rgba(16, 185, 129, 0.2)', 
          color: '#10b981', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}>
          Confidence: {data.confidence}%
        </div>
        
        <p style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
          {data.explanation}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {data.options.map((option, idx) => (
          <div key={idx} className="glass-card" style={idx === 0 ? {} : { borderColor: 'rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>{option.name}</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: idx === 0 ? 'var(--accent-pink)' : 'var(--accent-blue)' }}>
                {option.score}
              </span>
            </div>
            
            <div className="score-bar-container">
              <div className="score-bar-fill" style={{ 
                width: showBars ? `${option.score}%` : '0%', 
                background: idx === 0 ? 'var(--accent-pink)' : 'var(--accent-blue)' 
              }}></div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h5 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Primary Risk</h5>
              <p style={{ 
                background: idx === 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                color: idx === 0 ? 'var(--accent-orange)' : 'var(--accent-green)', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                fontSize: '0.9rem' 
              }}>
                {idx === 0 ? '⚠️' : '✓'} {option.primary_risk}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
