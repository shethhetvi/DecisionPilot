import { useState } from 'react'
import Home from './Home'
import DecisionOrchestrator from './DecisionOrchestrator'

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [query, setQuery] = useState('');

  const handleStartDecision = (userQuery) => {
    setQuery(userQuery);
    setCurrentView('orchestrator');
  };

  const handleReset = () => {
    setQuery('');
    setCurrentView('home');
  };

  return (
    <div className="app-container">
      {currentView === 'home' && (
        <Home onStart={handleStartDecision} />
      )}
      {currentView === 'orchestrator' && (
        <DecisionOrchestrator query={query} onReset={handleReset} />
      )}
    </div>
  )
}

export default App
