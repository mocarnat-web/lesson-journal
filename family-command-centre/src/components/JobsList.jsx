import { useState } from 'react';
import { NOW_JOBS, SUMMER_JOBS } from '../data/jobs';
import './JobsList.css';

export default function JobsList({ store, setStore, onBack }) {
  const [mode, setMode] = useState('now');
  const jobs = mode === 'now' ? NOW_JOBS : SUMMER_JOBS;

  function isDone(taskId) { return !!store.jobsDone?.[`${mode}_${taskId}`]; }
  function getCompletedBy(taskId) { return store.jobsDoneBy?.[`${mode}_${taskId}`]; }
  function toggle(taskId) {
    const key = `${mode}_${taskId}`;
    const already = isDone(taskId);
    const nowDate = new Date().toLocaleString();
    setStore(s => ({
      ...s,
      jobsDone: { ...(s.jobsDone || {}), [key]: !already },
      jobsDoneBy: { ...(s.jobsDoneBy || {}), [key]: already ? null : { who: 'Mum', when: nowDate } },
    }));
  }
  function roomPercent(room) {
    const tasks = jobs[room]?.tasks || [];
    if (!tasks.length) return 0;
    const d = tasks.filter(t => isDone(t.id)).length;
    return Math.round((d / tasks.length) * 100);
  }

  return (
    <div className="jobs-screen">
      <div className="jobs-header">
        <button className="jobs-back" onClick={onBack}>← Home</button>
        <h1>🏠 Jobs List</h1>
        <div className="jobs-toggle">
          <button className={`jt-btn ${mode === 'now' ? 'active' : ''}`} onClick={() => setMode('now')}>NOW Jobs</button>
          <button className={`jt-btn ${mode === 'summer' ? 'active' : ''}`} onClick={() => setMode('summer')}>☀️ Summer Jobs</button>
        </div>
      </div>
      <div className="jobs-rooms">
        {Object.entries(jobs).map(([roomKey, room]) => {
          const pct = roomPercent(roomKey);
          return (
            <div key={roomKey} className="jobs-room">
              <div className="room-header">
                <span className="room-emoji">{room.emoji}</span>
                <span className="room-label">{room.label}</span>
                <div className="room-bar-wrap"><div className="room-bar-fill" style={{ width: `${pct}%` }} /></div>
                <span className="room-pct">{pct}%</span>
              </div>
              <div className="room-tasks">
                {room.tasks.map(task => {
                  const done = isDone(task.id);
                  const by = getCompletedBy(task.id);
                  return (
                    <button key={task.id} className={`room-task ${done ? 'done' : ''}`} onClick={() => toggle(task.id)}>
                      <span className={`room-checkbox ${done ? 'checked' : ''}`}>{done ? '✓' : ''}</span>
                      <span className="room-task-text">{task.text}</span>
                      {done && by && <span className="room-task-by">{by.who} · {by.when}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
