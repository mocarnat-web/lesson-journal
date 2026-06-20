import { useState } from 'react';
import { FAMILY } from '../data/family';
import { AFTERSCHOOL_STEPS } from '../data/routines';
import Celebration from './Celebration';
import './Routine.css';
import './AfterSchool.css';

export default function AfterSchoolRoutine({ store, setStore, onBack }) {
  const [celebrate, setCelebrate] = useState(false);
  const todayStr = new Date().toDateString() + '_afterschool';

  function isDone(stepId, personId) {
    const key = personId ? `${personId}_${stepId}_${todayStr}` : `all_${stepId}_${todayStr}`;
    return !!store.routineSteps?.[key];
  }

  function toggle(step, personId) {
    const key = personId ? `${personId}_${step.id}_${todayStr}` : `all_${step.id}_${todayStr}`;
    const already = !!store.routineSteps?.[key];
    const updated = { ...(store.routineSteps || {}), [key]: !already };
    setStore(s => ({ ...s, routineSteps: updated }));
    const allKeys = AFTERSCHOOL_STEPS.flatMap(s => {
      if (s.who === 'all') return FAMILY.map(f => `all_${s.id}_${todayStr}`);
      return (s.who || []).map(pid => `${pid}_${s.id}_${todayStr}`);
    });
    if (!already && allKeys.every(k => !!updated[k])) setCelebrate(true);
  }

  const noScreen = !AFTERSCHOOL_STEPS.every(step => {
    if (step.who === 'all') return isDone(step.id);
    return (step.who || []).every(pid => isDone(step.id, pid));
  });

  const childIds = ['alma', 'olga', 'teo'];
  const children = FAMILY.filter(f => childIds.includes(f.id));

  return (
    <div className="routine-screen afterschool">
      <Celebration active={celebrate} onDone={() => setCelebrate(false)} />
      <div className="routine-header">
        <button className="routine-back" onClick={onBack}>← Home</button>
        <span style={{ fontSize: 44 }}>🎒</span>
        <span className="routine-title">After School Routine</span>
        {noScreen && <span className="as-no-screen">📵 NO SCREEN TIME YET</span>}
      </div>
      <div className="as-steps">
        {AFTERSCHOOL_STEPS.map(step => {
          const people = step.who === 'all' ? children : (step.who || []).map(id => FAMILY.find(f => f.id === id)).filter(Boolean);
          return (
            <div key={step.id} className="as-step">
              <div className="as-step-left">
                <span className="as-step-emoji">{step.emoji}</span>
                <span className="as-step-label">{step.label}</span>
              </div>
              <div className="as-step-people">
                {people.map(person => {
                  const done = isDone(step.id, step.who !== 'all' ? person.id : undefined);
                  return (
                    <button key={person.id}
                      className={`as-person-btn ${done ? 'done' : ''}`}
                      style={done ? { background: person.color, borderColor: person.color } : { borderColor: person.color }}
                      onClick={() => toggle(step, step.who !== 'all' ? person.id : null)}>
                      <span>{person.emoji}</span>
                      <span style={{ color: done ? '#fff' : person.color }}>{person.name}</span>
                      {done && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!noScreen && <div className="as-unlock">🟢 Screen time unlocked! Great work everyone!</div>}
    </div>
  );
}
