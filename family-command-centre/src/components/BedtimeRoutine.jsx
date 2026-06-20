import { useState } from 'react';
import { FAMILY } from '../data/family';
import { BEDTIME_STEPS } from '../data/routines';
import Celebration from './Celebration';
import './Routine.css';
import './BedtimeRoutine.css';

export default function BedtimeRoutine({ store, setStore, onBack }) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const todayStr = new Date().toDateString() + '_bedtime';

  function isDone(personId, stepId) {
    return !!store.routineSteps?.[`${personId}_${stepId}_${todayStr}`];
  }
  function toggle(personId, stepId) {
    const key = `${personId}_${stepId}_${todayStr}`;
    const already = !!store.routineSteps?.[key];
    const updated = { ...(store.routineSteps || {}), [key]: !already };
    const steps = BEDTIME_STEPS[personId] || [];
    if (!already && steps.every(s => !!updated[`${personId}_${s.id}_${todayStr}`])) {
      setCelebrate(true);
      let newPoints = { ...(store.points || {}) };
      newPoints[personId] = (newPoints[personId] || 0) + 5;
      setStore(s => ({ ...s, routineSteps: updated, points: newPoints }));
    } else {
      setStore(s => ({ ...s, routineSteps: updated }));
    }
  }
  function pct(personId) {
    const steps = BEDTIME_STEPS[personId] || [];
    if (!steps.length) return 100;
    const d = steps.filter(s => isDone(personId, s.id)).length;
    return Math.round((d / steps.length) * 100);
  }

  const people = FAMILY.filter(f => BEDTIME_STEPS[f.id]);

  if (selectedPerson) {
    const person = FAMILY.find(f => f.id === selectedPerson);
    const steps = BEDTIME_STEPS[selectedPerson] || [];
    const allDone = steps.every(s => isDone(selectedPerson, s.id));
    return (
      <div className="routine-screen" style={{ '--person-color': person.color }}>
        <Celebration active={celebrate} onDone={() => setCelebrate(false)} />
        <div className="routine-header">
          <button className="routine-back" onClick={() => setSelectedPerson(null)}>← Back</button>
          <span className="routine-emoji">{person.emoji}</span>
          <span className="routine-title" style={{ color: person.color }}>{person.name}'s Bedtime</span>
          <span className="routine-sub">🌙 Time to wind down</span>
        </div>
        <div className="routine-steps">
          {steps.map((step, i) => {
            const done = isDone(selectedPerson, step.id);
            return (
              <button key={step.id}
                className={`routine-step ${done ? 'done' : ''} ${person.isToddler ? 'toddler' : ''}`}
                style={done ? { borderColor: person.color, background: `${person.color}22` } : {}}
                onClick={() => toggle(selectedPerson, step.id)}>
                <span className="step-num" style={{ background: done ? person.color : '#2C2C2E' }}>{done ? '✓' : i+1}</span>
                <span className="step-emoji">{step.emoji}</span>
                <span className="step-label">{step.label}</span>
              </button>
            );
          })}
        </div>
        {allDone && <div className="routine-allDone" style={{ color: person.color }}>🌙 Sweet dreams, {person.name}! +5 pts</div>}
      </div>
    );
  }

  return (
    <div className="routine-select">
      <div className="routine-select-header">
        <button className="routine-back" onClick={onBack}>← Home</button>
        <h1>🌙 Bedtime Routine</h1>
        <p>Who's getting ready for bed?</p>
      </div>
      <div className="routine-people">
        {people.map(f => (
          <button key={f.id} className="routine-person-btn" style={{ '--person-color': f.color, borderColor: f.color }}
            onClick={() => setSelectedPerson(f.id)}>
            <span className="rp-emoji">{f.emoji}</span>
            <span className="rp-name" style={{ color: f.color }}>{f.name}</span>
            <div className="rp-progress-bar">
              <div className="rp-progress-fill" style={{ width: `${pct(f.id)}%`, background: f.color }} />
            </div>
            <span className="rp-pct">{pct(f.id)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}
