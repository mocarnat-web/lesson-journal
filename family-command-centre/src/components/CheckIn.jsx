import { FAMILY } from '../data/family';
import { DAILY_TASKS } from '../data/jobs';
import './CheckIn.css';
export default function CheckIn({store,setStore,onBack}){
  const today=new Date().toDateString();
  const isAll=id=>{const t=DAILY_TASKS[id]||[];return t.length>0&&t.every(x=>!!store.completedTasks?.[`${id}_${x.id}_${today}`]);};
  const missed=id=>(DAILY_TASKS[id]||[]).filter(x=>!store.completedTasks?.[`${id}_${x.id}_${today}`]);
  function mark(id){
    const t=DAILY_TASKS[id]||[],u={};
    t.forEach(x=>{u[`${id}_${x.id}_${today}`]=true;});
    let np={...(store.points||{})},ns={...(store.streaks||{})};
    np[id]=(np[id]||0)+15;ns[id]=(ns[id]||0)+1;
    if(ns[id]===3)np[id]+=20;if(ns[id]===7)np[id]+=50;
    setStore(s=>({...s,completedTasks:{...s.completedTasks,...u},points:np,streaks:ns}));
  }
  return(<div className="checkin-screen">
    <div className="ci-header"><button className="ci-back" onClick={onBack}>← Home</button><h1>🌙 Evening Check-in</h1><p className="ci-sub">Did everyone complete their jobs today?</p></div>
    <div className="ci-people">{FAMILY.map(f=>{
      const d=isAll(f.id),m=missed(f.id);
      return(<div key={f.id} className={`ci-card ${d?'done':'pending'}`} style={{borderColor:d?f.color:'#3A3A3C'}}>
        <div className="ci-avatar" style={{background:`${f.color}22`,border:`3px solid ${f.color}`}}>{f.emoji}</div>
        <div className="ci-name" style={{color:f.color}}>{f.name}</div>
        {d?<div className="ci-yes">✅ All done! +15 pts · 🔥 streak!</div>:
          <><div className="ci-no">❌ {m.length} task{m.length!==1?'s':''} missed</div>
            <div className="ci-missed-list">{m.map(t=><div key={t.id} className="ci-missed-task">· {t.text}</div>)}</div>
            <button className="ci-mark-btn" style={{background:f.color}} onClick={()=>mark(f.id)}>Mark all complete</button>
          </>
        }
      </div>);
    })}</div>
  </div>);
}
