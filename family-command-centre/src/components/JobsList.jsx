import { useState } from 'react';
import { NOW_JOBS, SUMMER_JOBS } from '../data/jobs';
import './JobsList.css';
export default function JobsList({store,setStore,onBack}){
  const[mode,setMode]=useState('now');
  const jobs=mode==='now'?NOW_JOBS:SUMMER_JOBS;
  function isDone(id){return!!store.jobsDone?.[`${mode}_${id}`];}
  function getBy(id){return store.jobsDoneBy?.[`${mode}_${id}`];}
  function toggle(id){
    const k=`${mode}_${id}`,already=isDone(id),now=new Date().toLocaleString();
    setStore(s=>({...s,jobsDone:{...(s.jobsDone||{}),[k]:!already},jobsDoneBy:{...(s.jobsDoneBy||{}),[k]:already?null:{who:'Mum',when:now}}}));
  }
  function pct(r){const t=jobs[r]?.tasks||[];if(!t.length)return 0;return Math.round(t.filter(x=>isDone(x.id)).length/t.length*100);}
  return(<div className="jobs-screen">
    <div className="jobs-header"><button className="jobs-back" onClick={onBack}>← Home</button><h1>🏠 Jobs List</h1>
      <div className="jobs-toggle"><button className={`jt-btn ${mode==='now'?'active':''}`} onClick={()=>setMode('now')}>NOW Jobs</button><button className={`jt-btn ${mode==='summer'?'active':''}`} onClick={()=>setMode('summer')}>☀️ Summer Jobs</button></div>
    </div>
    <div className="jobs-rooms">{Object.entries(jobs).map(([rk,room])=>{const p=pct(rk);return(<div key={rk} className="jobs-room">
      <div className="room-header"><span className="room-emoji">{room.emoji}</span><span className="room-label">{room.label}</span><div className="room-bar-wrap"><div className="room-bar-fill" style={{width:`${p}%`}}/></div><span className="room-pct">{p}%</span></div>
      <div className="room-tasks">{room.tasks.map(t=>{const d=isDone(t.id),by=getBy(t.id);return(<button key={t.id} className={`room-task ${d?'done':''}`} onClick={()=>toggle(t.id)}><span className={`room-checkbox ${d?'checked':''}`}>{d?'✓':''}</span><span className="room-task-text">{t.text}</span>{d&&by&&<span className="room-task-by">{by.who} · {by.when}</span>}</button>);})}</div>
    </div>);})}</div>
  </div>);
}
