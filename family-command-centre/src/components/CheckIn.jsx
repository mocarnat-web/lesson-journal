import { FAMILY } from '../data/family';
import { DAILY_TASKS } from '../data/jobs';
import './CheckIn.css';

export default function CheckIn({ store, setStore, onBack }) {
  const todayStr = new Date().toDateString();

  function isAllDone(personId) {
    const tasks = DAILY_TASKS[personId] || [];
    return tasks.length > 0 && tasks.every(t => !!store.completedTasks?.[`${personId}_${t.id}_${todayStr}`]);
  }

  function getMissed(personId) {
    const tasks = DAILY_TASKS[personId] || [];
    return tasks.filter(t => !store.completedTasks?.[`${personId}_${t.id}_${todayStr}`]);
  }

  function markComplete(personId) {
    const tasks = DAILY_TASKS[personId] || [];
    const updates = {};
    tasks.forEach(t => { updates[`${personId}_${t.id}_${todayStr}`] = true; });
    let newPoints = { ...(store.points || {}) };
    let newStreaks = { ...(store.streaks || {}) };
    newPoints[personId] = (newPoints[personId] || 0) + 15;
    newStreaks[personId] = (newStreaks[personId] || 0) + 1;
    if (newStreaks[personId] === 3) newPoints[personId] += 20;
    if (newStreaks[personId] === 7) newPoints[personId] += 50;
    setStore(s => ({ ...s, completedTasks: { ...s.completedTasks, ...updates }, points: newPoints, streaks: newStreaks }));
  }

  return (
    <div className="checkin-screen">
      <div className="ci-header">
        <button className="ci-back" onClick={onBack}>← Home</button>
        <h1>🌙 Evening Check-in</h1>
        <p className="ci-sub">Did everyone complete their jobs today?</p>
      </div>
      <div className="ci-people">
        {FAMILY.map(f => {
          const done = isAllDone(f.id);
          const missed = getMissed(f.id);
          return (
            <div key={f.id} className={`ci-card ${done ? 'done' : 'pending'}`}
              style={{ borderColor: done ? f.color : '#3A3A3C' }}>
              <div className="ci-avatar" style={{ background: `${f.color}22`, border: `3px solid ${f.color}` }}>{f.emoji}</div>
              <div className="ci-name" style={{ color: f.color }}>{f.name}</div>
              {done ? (
                <div className="ci-yes">✅ All done! +15 pts · 🔥 streak continues</div>
              ) : (
                <>
                  <div className="ci-no">❌ {missed.length} task{missed.length !== 1 ? 's' : ''} missed</div>
                  <div className="ci-missed-list">
                    {missed.map(t => <div key={t.id} className="ci-missed-task">· {t.text}</div>)}
                  </div>
                  <button className="ci-mark-btn" style={{ background: f.color }} onClick={() => markComplete(f.id)}>Mark all complete</button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
