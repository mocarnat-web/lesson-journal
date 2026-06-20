import { useState, useEffect } from 'react';
import { FAMILY_MAP } from '../data/family';
import { DAILY_TASKS } from '../data/jobs';
import Celebration from './Celebration';
import './PersonView.css';

function formatMins(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

export default function PersonView({ personId, store, setStore, onBack }) {
  const person = FAMILY_MAP[personId];
  const tasks = DAILY_TASKS[personId] || [];
  const todayStr = new Date().toDateString();
  const [timer, setTimer] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [nowTime, setNowTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNowTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => {
      setTimer(t => t ? { ...t, secs: t.secs - 1 } : null);
    }, 1000);
    return () => clearInterval(id);
  }, [timer?.taskId]);

  function isComplete(taskId) {
    return !!store.completedTasks?.[`${personId}_${taskId}_${todayStr}`];
  }

  function toggle(task) {
    const key = `${personId}_${task.id}_${todayStr}`;
    const already = !!store.completedTasks?.[key];
    const newCompleted = { ...(store.completedTasks || {}), [key]: !already };
    let newPoints = { ...(store.points || {}) };
    let newScreen = { ...(store.screenTime || {}) };
    if (!already) {
      newPoints[personId] = (newPoints[personId] || 0) + (task.points || 5);
      newScreen[personId] = (newScreen[personId] || 0) + 15;
    } else {
      newPoints[personId] = Math.max(0, (newPoints[personId] || 0) - (task.points || 5));
    }
    const allDone = tasks.every(t => !!newCompleted[`${personId}_${t.id}_${todayStr}`]);
    if (allDone && !already) {
      newPoints[personId] = (newPoints[personId] || 0) + 15;
      setCelebrate(true);
    }
    setStore(s => ({ ...s, completedTasks: newCompleted, points: newPoints, screenTime: newScreen }));
    setTimer(null);
  }

  function startTimer(task) {
    setTimer({ taskId: task.id, secs: (task.mins || 5) * 60 });
  }

  const done = tasks.filter(t => isComplete(t.id)).length;
  const allDone = done === tasks.length && tasks.length > 0;
  const past5 = nowTime.getHours() >= 17;

  if (!person) return null;

  return (
    <div className="person-view" style={{ '--person-color': person.color }}>
      <Celebration active={celebrate} onDone={() => setCelebrate(false)} />
      <div className="pv-header">
        <button className="pv-back" onClick={onBack}>← Back</button>
        <div className="pv-avatar" style={{ background: `${person.color}22`, border: `3px solid ${person.color}` }}>
          <span>{person.emoji}</span>
        </div>
        <div className="pv-name" style={{ color: person.color }}>{person.name}</div>
        <div className="pv-progress">{done}/{tasks.length} done</div>
        <div className="pv-pts">�� {store.points?.[personId] || 0} pts</div>
      </div>

      {!allDone && past5 && (
        <div className="pv-warning">🚫 NO TV UNTIL ALL JOBS ARE DONE! 🚫</div>
      )}

      {allDone && (
        <div className="pv-all-done" style={{ color: person.color }}>🎉 All done! Amazing work today! 🎉</div>
      )}

      <div className="pv-tasks">
        {tasks.map(task => {
          const done = isComplete(task.id);
          const isTimerActive = timer?.taskId === task.id;
          return (
            <div key={task.id} className={`pv-task ${done ? 'done' : ''} ${person.isToddler ? 'toddler' : ''}`}
              style={done ? { borderColor: person.color, background: `${person.color}15` } : {}}>
              <button className="pv-checkbox"
                style={done ? { background: person.color, borderColor: person.color } : { borderColor: person.color }}
                onClick={() => toggle(task)}>
                {done && <span className="pv-check">✓</span>}
              </button>
              <div className="pv-task-body">
                <div className="pv-task-text">{task.text}</div>
                <div className="pv-task-meta">
                  <span className="pv-task-mins">⏱ {task.mins} min</span>
                  <span className="pv-task-pts">+{task.points} pts</span>
                </div>
              </div>
              {!done && (
                isTimerActive ? (
                  <div className="pv-timer" style={{ color: timer.secs < 60 ? '#FF453A' : person.color }}>
                    {formatMins(Math.max(0, timer.secs))}
                    <button className="pv-timer-stop" onClick={() => setTimer(null)}>✕</button>
                  </div>
                ) : (
                  <button className="pv-start" style={{ background: person.color }} onClick={() => startTimer(task)}>▶ Start</button>
                )
              )}
              {done && <div className="pv-done-check" style={{ color: person.color }}>✓</div>}
            </div>
          );
        })}
      </div>

      {store.screenTime?.[personId] > 0 && (
        <div className="pv-screen-bank">
          📱 Screen time earned: <strong>{Math.floor((store.screenTime[personId] || 0) / 60)}h {(store.screenTime[personId] || 0) % 60}m</strong>
        </div>
      )}
    </div>
  );
}
