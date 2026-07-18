import { useState, useEffect } from 'react';
import ComparisonDashboard from './ComparisonDashboard';

const AGENTS = [
  { id: 'context', name: 'Context', icon: '👤', description: 'Extracting constraints...' },
  { id: 'research', name: 'Research', icon: '🔍', description: 'Gathering facts...' },
  { id: 'analysis', name: 'Analysis', icon: '⚖️', description: 'Evaluating trade-offs...' },
  { id: 'risk', name: 'Risk', icon: '⚠️', description: 'Predicting pitfalls...' },
  { id: 'decision', name: 'Decision', icon: '🧮', description: 'Calculating scores...' },
  { id: 'explanation', name: 'Explanation', icon: '💬', description: 'Formulating response...' }
];

export default function DecisionOrchestrator({ query, onReset }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStep < AGENTS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200); // Artificial delay per agent
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsComplete(true), 500);
    }
  }, [currentStep]);

  if (isComplete) {
    return <ComparisonDashboard query={query} onReset={onReset} />;
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Orchestrator Running...</h2>
        <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={onReset}>
          Cancel
        </button>
      </div>

      <div className="glass-card">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          <strong>Query:</strong> {query}
        </p>

        <div className="stepper">
          {AGENTS.map((agent, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            let className = 'step-item';
            if (isActive) className += ' active';
            if (isCompleted) className += ' completed';

            return (
              <div key={agent.id} className={className}>
                <div className="step-circle">
                  {isCompleted ? '✓' : agent.icon}
                </div>
                <div className="step-label">{agent.name}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center', minHeight: '60px' }}>
          {currentStep < AGENTS.length && (
            <div className="animate-fade-in" key={currentStep}>
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
                {AGENTS[currentStep].name} Agent Active
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {AGENTS[currentStep].description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
