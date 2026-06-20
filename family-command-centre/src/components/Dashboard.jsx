import { useClock } from '../hooks/useClock';
import { FAMILY } from '../data/family';
import { DAILY_TASKS } from '../data/jobs';
import { WEEKLY_SCHEDULE, DAYS } from '../data/schedule';
import './Dashboard.css';

const DAYS_FULL=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function todayKey(){const d=new Date().getDay();return DAYS[d===0?6:d-1];}

const ALL_TASKS = FAMILY.flatMap(f =>
  (DAILY_TASKS[f.id]||[]).map(t => ({ ...t, personId: f.id, person: f }))
);

function ProgressRing({percent,color,size=110}){
  const r=(size-12)/2,circ=2*Math.PI*r,offset=circ-(percent/100)*circ;
  return(<svg width={size} height={size} style={{position:'absolute',top:0,left:0}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2C2C2E" strokeWidth="6"/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
      style={{transform:'rotate(-90deg)',transformOrigin:'center',transition:'stroke-dashoffset 0.6s ease'}}/>
  </svg>);
}

function TaskRunner({ store, setStore, now }) {
  const today = now.toDateString();
  const isNewDay = store.taskRunnerDate !== today;
  const idx = isNewDay ? 0 : (store.taskRunnerIdx || 0);
  const startedAt = isNewDay ? Date.now() : (store.taskRunnerStarted || Date.now());

  const task = ALL_TASKS[idx];

  if (!task) {
    return (
      <div className="task-runner task-runner-done">
        <span style={{fontSize:'48px'}}>🎉</span>
        <span className="tr-done-text">All tasks complete! Amazing work today!</span>
        <button className="tr-reset" onClick={() => setStore(s => ({ ...s, taskRunnerIdx: 0, taskRunnerStarted: Date.now(), taskRunnerDate: today }))}>↺ Start again</button>
      </div>
    );
  }

  const elapsed = Math.floor((now.getTime() - startedAt) / 1000);
  const totalSecs = (task.mins || 5) * 60;
  const remaining = totalSecs - elapsed;
  const over = remaining < 0;
  const absSecs = Math.abs(remaining);
  const mm = String(Math.floor(absSecs / 60)).padStart(2,'0');
  const ss = String(absSecs % 60).padStart(2,'0');
  const fillPct = Math.min(100, Math.max(0, (elapsed / totalSecs) * 100));

  function advance(markDone) {
    const updates = {
      taskRunnerIdx: idx + 1,
      taskRunnerStarted: Date.now(),
      taskRunnerDate: today,
    };
    if (markDone) {
      const key = `${task.personId}_${task.id}_${today}`;
      updates.completedTasks = { ...store.completedTasks, [key]: true };
      updates.points = { ...store.points, [task.personId]: (store.points?.[task.personId] || 0) + (task.points || 5) };
      updates.screenTime = { ...store.screenTime, [task.personId]: (store.screenTime?.[task.personId] || 0) + 15 };
    }
    setStore(s => ({ ...s, ...updates }));
  }

  return (
    <div className="task-runner" style={{ '--person-color': task.person.color }}>
      <div className="tr-progress-bar">
        <div className="tr-progress-fill" style={{ width: `${fillPct}%`, background: over ? '#FF453A' : task.person.color }} />
      </div>
      <div className="tr-body">
        <div className="tr-who">
          <span className="tr-emoji">{task.person.emoji}</span>
          <span className="tr-name" style={{ color: task.person.color }}>{task.person.name}</span>
          <span className="tr-task-text">{task.text}</span>
          <span className="tr-count">{idx + 1} / {ALL_TASKS.length}</span>
        </div>
        <div className="tr-bottom">
          <div className={`tr-timer ${over ? 'tr-over' : ''}`}>
            {over ? <span className="tr-over-label">OVER </span> : ''}{mm}:{ss}
          </div>
          <div className="tr-actions">
            <button className="tr-skip-btn" onClick={() => advance(false)}>Skip →</button>
            <button className="tr-done-btn" onClick={() => advance(true)}>✅ Done! +{task.points||5}pts</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({store, setStore, onPersonTap, onNavigate}){
  const now=useClock();
  const upcoming=(WEEKLY_SCHEDULE[todayKey()]||[]).filter(ev=>{
    const[h,m]=ev.time.split(':').map(Number);
    return h*60+m>now.getHours()*60+now.getMinutes();
  }).sort((a,b)=>a.time.localeCompare(b.time));
  const next=upcoming[0];
  function pct(id){const t=DAILY_TASKS[id]||[];if(!t.length)return 100;const s=now.toDateString();return Math.round(t.filter(x=>store.completedTasks?.[`${id}_${x.id}_${s}`]).length/t.length*100);}
  function total(){const c=FAMILY.map(f=>{const t=DAILY_TASKS[f.id]||[];const s=now.toDateString();return{d:t.filter(x=>store.completedTasks?.[`${f.id}_${x.id}_${s}`]).length,t:t.length};});const d=c.reduce((a,x)=>a+x.d,0),t=c.reduce((a,x)=>a+x.t,0);return t?Math.round(d/t*100):0;}
  const hh=String(now.getHours()).padStart(2,'0'),mm=String(now.getMinutes()).padStart(2,'0'),ss=String(now.getSeconds()).padStart(2,'0');
  return(<div className="dashboard">
    <div className="dash-header">
      <div className="dash-clock"><span className="clock-time">{hh}:{mm}<span className="clock-secs">:{ss}</span></span><span className="clock-date">{DAYS_FULL[now.getDay()]} · {now.getDate()} {MONTHS[now.getMonth()]} {now.getFullYear()}</span></div>
      <div className="dash-family-title">Molina Phillips</div>
      <div className="dash-meta"><div className="dash-streak">🔥 {store.familyStreak||0} day streak</div><div className="dash-overall">{total()}% today</div></div>
    </div>
    <TaskRunner store={store} setStore={setStore} now={now} />
    <div className="dash-avatars">
      {FAMILY.map(f=>{
        const p=pct(f.id),pts=store.points?.[f.id]||0,sc=store.screenTime?.[f.id]||0;
        return(<button key={f.id} className="avatar-btn" onClick={()=>onPersonTap(f.id)} style={{'--person-color':f.color}}>
          <div className="avatar-ring-wrap"><ProgressRing percent={p} color={f.color} size={110}/>
            <div className="avatar-circle" style={{background:`${f.color}22`,border:`3px solid ${f.color}`}}><span className="avatar-emoji">{f.emoji}</span></div>
          </div>
          <div className="avatar-name" style={{color:f.color}}>{f.name}</div>
          <div className="avatar-pct">{p}%</div>
          <div className="avatar-pts">⭐ {pts} pts</div>
          {f.role==='child'&&<div className="avatar-screen">📱 {Math.floor(sc/60)}h {sc%60}m</div>}
        </button>);
      })}
    </div>
    {next&&<div className="dash-next-event"><span className="dash-next-label">Next up</span><span className="dash-next-emoji">{next.emoji}</span><span className="dash-next-text">{next.label}</span><span className="dash-next-time">{next.time}</span></div>}
    <div className="dash-nav">
      {[{s:'morning',l:'☀️ Morning'},{s:'afterschool',l:'🎒 After School'},{s:'schedule',l:'📅 Schedule'},{s:'jobs',l:'🏠 Jobs'},{s:'girlsrooms',l:"👧 Girls' Rooms"},{s:'gamification',l:'🏆 Points'},{s:'checkin',l:'🌙 Check-in'},{s:'bedtime',l:'💤 Bedtime'}]
        .map(n=><button key={n.s} className="dash-nav-btn" onClick={()=>onNavigate(n.s)}>{n.l}</button>)}
    </div>
  </div>);
}
