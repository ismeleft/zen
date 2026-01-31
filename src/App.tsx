
import { useState } from 'react';
import { Lotus } from './components/Lotus';
import { BreathingExercise } from './components/BreathingExercise';
import { RescueFab } from './components/RescueFab';
import { EmotionalRescue } from './components/EmotionalRescue';
import './App.css';

function App() {
  const [isRescueOpen, setIsRescueOpen] = useState(false);

  return (
    <div className="app-container">
      <header className="zen-header">
        <h1>ZEN</h1>
      </header>

      <section className="hero-section">
        <Lotus />
        <div className="scroll-hint">Scroll to Breathe</div>
      </section>

      <section className="breathing-section">
        <BreathingExercise />
      </section>

      <RescueFab onClick={() => setIsRescueOpen(true)} />

      {isRescueOpen && (
        <EmotionalRescue onClose={() => setIsRescueOpen(false)} />
      )}
    </div>
  )
}

export default App
