import { useState } from 'react';
import { FAMILY } from '../data/family';
import { AFTERSCHOOL_STEPS } from '../data/routines';
import Celebration from './Celebration';
import './Routine.css';
import './AfterSchool.css';
export default function AfterSchoolRoutine({store,setStore,onBack}){
  const[cel,setCel]=useState(false);
  const key=new Date().toDateString()+'_afterschool';
  const kids=FAMILY.filter(f=>['alma','olga','teo'].includes(f.id));
  function isDone(sid,pid){return!!store.routineSteps?.[pid?`${pid}_${sid}_${key}`:`all_${sid}_${key}`];}
  function toggle(step,pid){
    const k=pid?`${pid}_${step.id}_${key}`:`all_${step.id}_${key}`;
    const already=!!store.routineSteps?.[k],u={...(store.routineSteps||{}),[k]:!already};
    setStore(s=>({...s,routineSteps:u}));
    const allK=AFTERSCHOOL_STEPS.flatMap(s=>s.who==='all'?FAMILY.map(f=>`all_${s.id}_${key}`):(s.who||[]).map(p=>`${p}_${s.id}_${key}`));
    if(!already&&allK.every(k=>!!u[k]))setCel(true);
  }
  const noScreen=!AFTERSCHOOL_STEPS.every(s=>s.who==='all'?isDone(s.id):(s.who||[]).every(p=>isDone(s.id,p)));
  return(<div className="routine-screen afterschool">
    <Celebration active={cel} onDone={()=>setCel(false)}/>
    <div className="routine-header"><button className="routine-back" onClick={onBack}>← Home</button><span style={{fontSize:44}}>🎒</span><span className="routine-title">After School Routine</span>{noScreen&&<span className="as-no-screen">📵 NO SCREEN TIME YET</span>}</div>
    <div className="as-steps">{AFTERSCHOOL_STEPS.map(step=>{
      const people=step.who==='all'?kids:(step.who||[]).map(id=>FAMILY.find(f=>f.id===id)).filter(Boolean);
      return(<div key={step.id} className="as-step"><div className="as-step-left"><span className="as-step-emoji">{step.emoji}</span><span className="as-step-label">{step.label}</span></div>
        <div className="as-step-people">{people.map(p=>{const d=isDone(step.id,step.who!=='all'?p.id:undefined);return(<button key={p.id} className={`as-person-btn ${d?'done':''}`} style={d?{background:p.color,borderColor:p.color}:{borderColor:p.color}} onClick={()=>toggle(step,step.who!=='all'?p.id:null)}><span>{p.emoji}</span><span style={{color:d?'#fff':p.color}}>{p.name}</span>{d&&<span>✓</span>}</button>);})}</div>
      </div>);
    })}</div>
    {!noScreen&&<div className="as-unlock">🟢 Screen time unlocked! Great work everyone!</div>}
  </div>);
}
