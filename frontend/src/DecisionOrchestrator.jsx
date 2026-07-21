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
  const [finalData, setFinalData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initiate POST request with Server-Sent Events pattern
    // The browser native EventSource only does GET. We use a POST via fetch and process the stream.
    const controller = new AbortController();

    const fetchDecision = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/decide/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error('Failed to connect to backend.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process SSE chunks
          const lines = buffer.split('\n');
          buffer = lines.pop(); // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              
              let data;
              try {
                data = JSON.parse(dataStr);
              } catch (e) {
                console.error("Error parsing chunk", e, dataStr);
                continue;
              }
              
              if (data.error) {
                setError(data.error);
                setIsComplete(false);
                break;
              }
              
              if (data.agent === 'done') {
                setFinalData(data.final_decision);
                setIsComplete(true);
                break;
              } else {
                // Find the index of the agent that just completed
                const index = AGENTS.findIndex(a => a.id === data.agent);
                if (index !== -1 && index + 1 > currentStep) {
                  setCurrentStep(index + 1);
                }
              }
            }
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      }
    };

    fetchDecision();

    return () => controller.abort();
  }, [query]);

  if (error) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: 'var(--accent-pink)', marginBottom: '1rem' }}>Backend Error</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{error}</p>
        <button className="btn-primary" onClick={onReset}>Try Again</button>
      </div>
    );
  }

  if (isComplete && finalData) {
    return <ComparisonDashboard query={query} data={finalData} onReset={onReset} />;
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
