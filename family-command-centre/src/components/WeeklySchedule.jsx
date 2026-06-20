import { WEEKLY_SCHEDULE, DAYS, DAY_LABELS } from '../data/schedule';
import { FAMILY_MAP } from '../data/family';
import './WeeklySchedule.css';
function todayIdx(){const d=new Date().getDay();return d===0?6:d-1;}
export default function WeeklySchedule({onBack}){
  const today=todayIdx();
  return(<div className="schedule-screen">
    <div className="schedule-header"><button className="sch-back" onClick={onBack}>← Home</button><h1>📅 Weekly Schedule</h1></div>
    <div className="schedule-grid">
      {DAYS.map((day,i)=>(<div key={day} className={`sch-day ${i===today?'today':''}`}>
        <div className="sch-day-label">{DAY_LABELS[i]}{i===today&&<span className="sch-today-dot"/>}</div>
        <div className="sch-events">
          {!(WEEKLY_SCHEDULE[day]||[]).length&&<div className="sch-free">Free day 🏡</div>}
          {(WEEKLY_SCHEDULE[day]||[]).map(ev=>(<div key={ev.id} className="sch-event"><span className="sch-event-emoji">{ev.emoji}</span><div className="sch-event-body"><div className="sch-event-time">{ev.time}</div><div className="sch-event-label">{ev.label}</div><div className="sch-event-who">{(ev.who==='all'?[]:ev.who||[]).map(id=>{const p=FAMILY_MAP[id];return p?<span key={id} style={{color:p.color}}>{p.emoji}</span>:null;})}</div></div></div>))}
        </div>
      </div>))}
    </div>
  </div>);
}
