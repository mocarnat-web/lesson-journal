import { useState } from 'react';
import { FAMILY } from '../data/family';
import { MORNING_STEPS } from '../data/routines';
import Celebration from './Celebration';
import './Routine.css';
export default function MorningRoutine({store,setStore,onBack}){
  const[sel,setSel]=useState(null),[cel,setCel]=useState(false);
  const key=new Date().toDateString()+'_morning';
  function done(pid,sid){return!!store.routineSteps?.[`${pid}_${sid}_${key}`];}
  function toggle(pid,sid){
    const k=`${pid}_${sid}_${key}`,already=!!store.routineSteps?.[k];
    const u={...(store.routineSteps||{}),[k]:!already};
    setStore(s=>({...s,routineSteps:u}));
    if(!already&&(MORNING_STEPS[pid]||[]).every(st=>!!u[`${pid}_${st.id}_${key}`])){
      setCel(true);setStore(s=>({...s,routineSteps:u,points:{...(s.points||{}),[pid]:(s.points?.[pid]||0)+5}}));
    }
  }
  function pct(pid){const s=MORNING_STEPS[pid]||[];if(!s.length)return 100;return Math.round(s.filter(x=>done(pid,x.id)).length/s.length*100);}
  const people=FAMILY.filter(f=>MORNING_STEPS[f.id]);
  if(sel){
    const p=FAMILY.find(f=>f.id===sel),steps=MORNING_STEPS[sel]||[],allDone=steps.every(s=>done(sel,s.id));
    return(<div className="routine-screen" style={{'--person-color':p.color}}>
      <Celebration active={cel} onDone={()=>setCel(false)}/>
      <div className="routine-header"><button className="routine-back" onClick={()=>setSel(null)}>← Back</button><span className="routine-emoji">{p.emoji}</span><span className="routine-title" style={{color:p.color}}>{p.name}'s Morning Routine</span><span className="routine-sub">☀️ Let's get ready!</span></div>
      <div className="routine-steps">{steps.map((s,i)=>{const d=done(sel,s.id);return(<button key={s.id} className={`routine-step ${d?'done':''} ${p.isToddler?'toddler':''}`} style={d?{borderColor:p.color,background:`${p.color}22`}:{}} onClick={()=>toggle(sel,s.id)}><span className="step-num" style={{background:d?p.color:'#2C2C2E'}}>{d?'✓':i+1}</span><span className="step-emoji">{s.emoji}</span><span className="step-label">{s.label}</span></button>);})}</div>
      {allDone&&<div className="routine-allDone" style={{color:p.color}}>🎉 Morning routine complete! +5 pts</div>}
    </div>);
  }
  return(<div className="routine-select">
    <div className="routine-select-header"><button className="routine-back" onClick={onBack}>← Home</button><h1>☀️ Morning Routine</h1><p>Who's getting ready?</p></div>
    <div className="routine-people">{people.map(f=>(<button key={f.id} className="routine-person-btn" style={{'--person-color':f.color,borderColor:f.color}} onClick={()=>setSel(f.id)}><span className="rp-emoji">{f.emoji}</span><span className="rp-name" style={{color:f.color}}>{f.name}</span><div className="rp-progress-bar"><div className="rp-progress-fill" style={{width:`${pct(f.id)}%`,background:f.color}}/></div><span className="rp-pct">{pct(f.id)}%</span></button>))}</div>
  </div>);
}
