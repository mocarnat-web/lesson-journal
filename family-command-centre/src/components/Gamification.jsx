import { FAMILY } from '../data/family';
import './Gamification.css';

const BADGES = [
  { pts: 50,   label: 'Bronze',   emoji: '🥉' },
  { pts: 100,  label: 'Silver',   emoji: '🥈' },
  { pts: 200,  label: 'Gold',     emoji: '🥇' },
  { pts: 500,  label: 'Platinum', emoji: '💎' },
];

function getBadge(pts) {
  return [...BADGES].reverse().find(b => pts >= b.pts) || null;
}
function getNextBadge(pts) {
  return BADGES.find(b => pts < b.pts) || null;
}

export default function Gamification({ store, onBack }) {
  const sorted = [...FAMILY].sort((a, b) => (store.points?.[b.id] || 0) - (store.points?.[a.id] || 0));

  return (
    <div className="gami-screen">
      <div className="gami-header">
        <button className="gami-back" onClick={onBack}>← Home</button>
        <h1>🏆 Points & Badges</h1>
        <div className="gami-resets">Leaderboard resets Monday</div>
      </div>
      <div className="gami-leaderboard">
        {sorted.map((f, i) => {
          const pts = store.points?.[f.id] || 0;
          const screenMins = store.screenTime?.[f.id] || 0;
          const badge = getBadge(pts);
          const next = getNextBadge(pts);
          const streak = store.streaks?.[f.id] || 0;
          return (
            <div key={f.id} className={`gami-row rank-${i + 1}`}
              style={{ '--person-color': f.color, borderColor: i === 0 ? f.color : 'transparent' }}>
              <div className="gami-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</div>
              <div className="gami-avatar" style={{ background: `${f.color}22`, border: `3px solid ${f.color}` }}>{f.emoji}</div>
              <div className="gami-info">
                <div className="gami-name" style={{ color: f.color }}>{f.name}</div>
                <div className="gami-streak">🔥 {streak} day streak</div>
              </div>
              <div className="gami-pts-block">
                <div className="gami-pts">{pts}</div>
                <div className="gami-pts-label">points</div>
              </div>
              <div className="gami-badge-block">
                {badge ? <div className="gami-badge">{badge.emoji} {badge.label}</div> : <div className="gami-no-badge">No badge yet</div>}
                {next && <div className="gami-next-badge">{next.pts - pts} pts to {next.emoji}</div>}
              </div>
              {f.role === 'child' && (
                <div className="gami-screen-block">
                  <div className="gami-screen-time">📱 {Math.floor(screenMins/60)}h {screenMins%60}m</div>
                  <div className="gami-screen-label">screen earned</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="gami-rules">
        <h2>Points Guide</h2>
        <div className="gami-rule-grid">
          {[
            { label: 'Routine task', pts: 5, emoji: '☀️' },
            { label: 'Small job', pts: 10, emoji: '✅' },
            { label: 'Big job', pts: 25, emoji: '🏠' },
            { label: 'Full day complete', pts: 15, emoji: '⭐' },
            { label: '3-day streak bonus', pts: 20, emoji: '🔥' },
            { label: '7-day streak bonus', pts: 50, emoji: '💫' },
            { label: '10 pts → 15 min screen time', pts: null, emoji: '📱' },
          ].map((r, i) => (
            <div key={i} className="gami-rule">
              <span className="gr-emoji">{r.emoji}</span>
              <span className="gr-label">{r.label}</span>
              {r.pts && <span className="gr-pts">+{r.pts} pts</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
