import { useClock } from '../hooks/useClock';
import { FAMILY } from '../data/family';
import { DAILY_TASKS } from '../data/jobs';
import { WEEKLY_SCHEDULE, DAYS } from '../data/schedule';
import './Dashboard.css';

const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function todayScheduleKey() {
  const d = new Date().getDay();
  return DAYS[d === 0 ? 6 : d - 1];
}

function ProgressRing({ percent, color, size = 110 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2C2C2E" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

export default function Dashboard({ store, onPersonTap, onNavigate }) {
  const now = useClock();
  const todayKey = todayScheduleKey();
  const upcomingEvents = (WEEKLY_SCHEDULE[todayKey] || []).filter(ev => {
    const [h, m] = ev.time.split(':').map(Number);
    const evMin = h * 60 + m;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return evMin > nowMin;
  }).sort((a, b) => a.time.localeCompare(b.time));
  const nextEvent = upcomingEvents[0];

  function getCompletion(personId) {
    const tasks = DAILY_TASKS[personId] || [];
    if (!tasks.length) return 100;
    const todayStr = now.toDateString();
    const done = tasks.filter(t => store.completedTasks?.[`${personId}_${t.id}_${todayStr}`]).length;
    return Math.round((done / tasks.length) * 100);
  }

  function totalFamily() {
    const counts = FAMILY.map(f => {
      const tasks = DAILY_TASKS[f.id] || [];
      const todayStr = now.toDateString();
      const done = tasks.filter(t => store.completedTasks?.[`${f.id}_${t.id}_${todayStr}`]).length;
      return { done, total: tasks.length };
    });
    const d = counts.reduce((a, c) => a + c.done, 0);
    const t = counts.reduce((a, c) => a + c.total, 0);
    return t ? Math.round((d / t) * 100) : 0;
  }

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="dash-clock">
          <span className="clock-time">{hh}:{mm}<span className="clock-secs">:{ss}</span></span>
          <span className="clock-date">{DAYS_FULL[now.getDay()]} · {now.getDate()} {MONTHS[now.getMonth()]} {now.getFullYear()}</span>
        </div>
        <div className="dash-family-title">Molina Phillips</div>
        <div className="dash-meta">
          <div className="dash-streak">🔥 {store.familyStreak || 0} day streak</div>
          <div className="dash-overall">{totalFamily()}% today</div>
        </div>
      </div>

      <div className="dash-avatars">
        {FAMILY.map(f => {
          const pct = getCompletion(f.id);
          const pts = store.points?.[f.id] || 0;
          const screenTime = store.screenTime?.[f.id] || 0;
          return (
            <button key={f.id} className="avatar-btn" onClick={() => onPersonTap(f.id)}
              style={{ '--person-color': f.color }}>
              <div className="avatar-ring-wrap">
                <ProgressRing percent={pct} color={f.color} size={110} />
                <div className="avatar-circle" style={{ background: `${f.color}22`, border: `3px solid ${f.color}` }}>
                  <span className="avatar-emoji">{f.emoji}</span>
                </div>
              </div>
              <div className="avatar-name" style={{ color: f.color }}>{f.name}</div>
              <div className="avatar-pct">{pct}%</div>
              <div className="avatar-pts">⭐ {pts} pts</div>
              {f.role === 'child' && <div className="avatar-screen">📱 {Math.floor(screenTime / 60)}h {screenTime % 60}m</div>}
            </button>
          );
        })}
      </div>

      {nextEvent && (
        <div className="dash-next-event">
          <span className="dash-next-label">Next up</span>
          <span className="dash-next-emoji">{nextEvent.emoji}</span>
          <span className="dash-next-text">{nextEvent.label}</span>
          <span className="dash-next-time">{nextEvent.time}</span>
        </div>
      )}

      <div className="dash-nav">
        {[
          { screen: 'morning', label: '☀️ Morning' },
          { screen: 'afterschool', label: '🎒 After School' },
          { screen: 'schedule', label: '📅 Schedule' },
          { screen: 'jobs', label: '🏠 Jobs' },
          { screen: 'girlsrooms', label: "👧 Girls' Rooms" },
          { screen: 'gamification', label: '🏆 Points' },
          { screen: 'checkin', label: '🌙 Check-in' },
          { screen: 'bedtime', label: '💤 Bedtime' },
        ].map(n => (
          <button key={n.screen} className="dash-nav-btn" onClick={() => onNavigate(n.screen)}>
            {n.label}
          </button>
        ))}
      </div>

      <div className="dash-weather">
        ☁️ Weather widget — coming soon
      </div>
    </div>
  );
}
