import { FAMILY } from '../data/family';
import './Gamification.css';
const BADGES=[{pts:50,label:'Bronze',emoji:'🥉'},{pts:100,label:'Silver',emoji:'🥈'},{pts:200,label:'Gold',emoji:'🥇'},{pts:500,label:'Platinum',emoji:'💎'}];
const getBadge=pts=>[...BADGES].reverse().find(b=>pts>=b.pts)||null;
const getNext=pts=>BADGES.find(b=>pts<b.pts)||null;
export default function Gamification({store,onBack}){
  const sorted=[...FAMILY].sort((a,b)=>(store.points?.[b.id]||0)-(store.points?.[a.id]||0));
  return(<div className="gami-screen">
    <div className="gami-header"><button className="gami-back" onClick={onBack}>← Home</button><h1>🏆 Points & Badges</h1><div className="gami-resets">Resets Monday</div></div>
    <div className="gami-leaderboard">{sorted.map((f,i)=>{
      const pts=store.points?.[f.id]||0,sc=store.screenTime?.[f.id]||0,badge=getBadge(pts),next=getNext(pts),streak=store.streaks?.[f.id]||0;
      return(<div key={f.id} className={`gami-row rank-${i+1}`} style={{'--person-color':f.color,borderColor:i===0?f.color:'transparent'}}>
        <div className="gami-rank">{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</div>
        <div className="gami-avatar" style={{background:`${f.color}22`,border:`3px solid ${f.color}`}}>{f.emoji}</div>
        <div className="gami-info"><div className="gami-name" style={{color:f.color}}>{f.name}</div><div className="gami-streak">🔥 {streak} day streak</div></div>
        <div className="gami-pts-block"><div className="gami-pts">{pts}</div><div className="gami-pts-label">points</div></div>
        <div className="gami-badge-block">{badge?<div className="gami-badge">{badge.emoji} {badge.label}</div>:<div className="gami-no-badge">No badge yet</div>}{next&&<div className="gami-next-badge">{next.pts-pts} pts to {next.emoji}</div>}</div>
        {f.role==='child'&&<div className="gami-screen-block"><div className="gami-screen-time">📱 {Math.floor(sc/60)}h {sc%60}m</div><div className="gami-screen-label">screen earned</div></div>}
      </div>);
    })}</div>
    <div className="gami-rules"><h2>Points Guide</h2><div className="gami-rule-grid">
      {[{l:'Routine task',p:5,e:'☀️'},{l:'Small job',p:10,e:'✅'},{l:'Big job',p:25,e:'🏠'},{l:'Full day complete',p:15,e:'⭐'},{l:'3-day streak',p:20,e:'🔥'},{l:'7-day streak',p:50,e:'💫'},{l:'10 pts → 15min screen',p:null,e:'📱'}]
        .map((r,i)=><div key={i} className="gami-rule"><span>{r.e}</span><span className="gr-label">{r.l}</span>{r.p&&<span className="gr-pts">+{r.p}</span>}</div>)}
    </div></div>
  </div>);
}
