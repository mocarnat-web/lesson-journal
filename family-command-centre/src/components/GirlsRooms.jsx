import { FAMILY_MAP } from '../data/family';
import './GirlsRooms.css';
const T1=[{id:'gt1',text:'Clear floor — everything on bed to sort'},{id:'gt2',text:'Sort into: Keep / Donate / Bin piles'},{id:'gt3',text:'Fill one donate bag each'}];
const TA=[{id:'at1',text:'Sort clothes — fold away'},{id:'at2',text:'Organise art & craft into one box'},{id:'at3',text:'Home for every toy — nothing on floor'},{id:'at4',text:'Clear surfaces'},{id:'at5',text:'Hoover and wipe'}];
const TO=[{id:'ot1',text:'Sort clothes — fold away'},{id:'ot2',text:'Organise books — keep favourites, donate rest'},{id:'ot3',text:'Home for every item — label boxes'},{id:'ot4',text:'Clear surfaces'},{id:'ot5',text:'Hoover and wipe'}];
const TE=[{id:'ge1',text:"Agree rule: if it's on the floor, it goes in a box"},{id:'ge2',text:'10-min Sunday maintenance check — set it up!'}];
export default function GirlsRooms({store,setStore,onBack}){
  const isDone=id=>!!store.girlsDone?.[id];
  const toggle=id=>setStore(s=>({...s,girlsDone:{...(s.girlsDone||{}),[id]:!s.girlsDone?.[id]}}));
  const pct=tasks=>Math.round(tasks.filter(t=>isDone(t.id)).length/tasks.length*100);
  const alma=FAMILY_MAP['alma'],olga=FAMILY_MAP['olga'];
  function Sec({title,tasks,color,emoji}){
    const p=pct(tasks);
    return(<div className="gr-section" style={{borderColor:color}}>
      <div className="gr-section-header"><span className="gr-section-emoji">{emoji}</span><span className="gr-section-title" style={{color}}>{title}</span><div className="gr-bar-wrap"><div className="gr-bar-fill" style={{width:`${p}%`,background:color}}/></div><span style={{color,fontSize:20,fontWeight:700}}>{p}%</span></div>
      {tasks.map(t=>{const d=isDone(t.id);return(<button key={t.id} className={`gr-task ${d?'done':''}`} style={d?{borderColor:color,background:`${color}15`}:{}} onClick={()=>toggle(t.id)}><span className={`gr-cb ${d?'checked':''}`} style={d?{background:color}:{borderColor:color}}>{d&&'✓'}</span><span className="gr-task-text">{t.text}</span></button>);})}
    </div>);
  }
  return(<div className="gr-screen">
    <div className="gr-header"><button className="gr-back" onClick={onBack}>← Home</button><h1>👧 Girls' Room Sort</h1><div className="gr-progress-pills"><span style={{color:alma.color}}>Alma {pct(TA)}%</span><span style={{color:olga.color}}>Olga {pct(TO)}%</span></div></div>
    <div className="gr-body"><Sec title="Together First" tasks={T1} color="#F5F5F7" emoji="🤝"/><Sec title="Alma's Jobs" tasks={TA} color={alma.color} emoji={alma.emoji}/><Sec title="Olga's Jobs" tasks={TO} color={olga.color} emoji={olga.emoji}/><Sec title="Together at the End" tasks={TE} color="#FF9F0A" emoji="🌟"/></div>
  </div>);
}
