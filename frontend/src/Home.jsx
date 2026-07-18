import { useState } from 'react';

export default function Home({ onStart }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStart(inputValue);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧠</div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          <span className="text-gradient">DecisionPilot</span>
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          The AI Multi-Agent Decision Intelligence Platform.
        </p>
      </div>

      <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', animationDelay: '0.2s' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>What decision can I help you make today?</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            className="fancy-input" 
            placeholder="e.g., Should I buy a MacBook Air or Pro for AI development?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={!inputValue.trim()}>
            Analyze 🚀
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 style={{ color: 'var(--accent-pink)', marginBottom: '1rem' }}>🎯 Deep Context</h3>
          <p style={{ color: 'var(--text-secondary)' }}>6 Specialized Agents interview you to ensure no constraints or hidden preferences are missed.</p>
        </div>
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }}>📊 Factual Research</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Gathers real data, specs, and pros/cons for all your options instantly.</p>
        </div>
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 style={{ color: 'var(--accent-green)', marginBottom: '1rem' }}>⚠️ Risk Scoring</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Predicts future pitfalls and calculates a final weighted confidence score to guide you.</p>
        </div>
      </div>
    </div>
  );
}
