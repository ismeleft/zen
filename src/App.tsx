
import { Lotus } from './components/Lotus';
import { BreathingExercise } from './components/BreathingExercise';
import './App.css';

function App() {
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
    </div>
  )
}

export default App
