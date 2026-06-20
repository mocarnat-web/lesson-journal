import { FAMILY_MAP } from '../data/family';
import './GirlsRooms.css';

const TOGETHER_TASKS = [
  { id: 'gt1', text: 'Clear floor — everything on bed to sort' },
  { id: 'gt2', text: 'Sort into: Keep / Donate / Bin piles' },
  { id: 'gt3', text: 'Fill one donate bag each' },
];
const ALMA_TASKS = [
  { id: 'at1', text: 'Sort clothes — fold away' },
  { id: 'at2', text: 'Organise art & craft into one box' },
  { id: 'at3', text: 'Find a home for every toy — nothing on floor' },
  { id: 'at4', text: 'Clear surfaces' },
  { id: 'at5', text: 'Hoover and wipe' },
];
const OLGA_TASKS = [
  { id: 'ot1', text: 'Sort clothes — fold away' },
  { id: 'ot2', text: 'Organise books — keep favourites, donate rest' },
  { id: 'ot3', text: 'Find a home for every item — label boxes' },
  { id: 'ot4', text: 'Clear surfaces' },
  { id: 'ot5', text: 'Hoover and wipe' },
];
const TOGETHER_END = [
  { id: 'ge1', text: "Agree rule: if it's on the floor, it goes in a box" },
  { id: 'ge2', text: '10-min Sunday maintenance check — set it up!' },
];

export default function GirlsRooms({ store, setStore, onBack }) {
  function isDone(id) { return !!store.girlsDone?.[id]; }
  function toggle(id) {
    setStore(s => ({ ...s, girlsDone: { ...(s.girlsDone || {}), [id]: !s.girlsDone?.[id] } }));
  }
  function pct(tasks) {
    const d = tasks.filter(t => isDone(t.id)).length;
    return Math.round((d / tasks.length) * 100);
  }
  const alma = FAMILY_MAP['alma'];
  const olga = FAMILY_MAP['olga'];

  function Section({ title, tasks, color, emoji }) {
    const p = pct(tasks);
    return (
      <div className="gr-section" style={{ borderColor: color }}>
        <div className="gr-section-header">
          <span className="gr-section-emoji">{emoji}</span>
          <span className="gr-section-title" style={{ color }}>{title}</span>
          <div className="gr-bar-wrap"><div className="gr-bar-fill" style={{ width: `${p}%`, background: color }} /></div>
          <span style={{ color, fontSize: 20, fontWeight: 700 }}>{p}%</span>
        </div>
        {tasks.map(task => {
          const done = isDone(task.id);
          return (
            <button key={task.id} className={`gr-task ${done ? 'done' : ''}`}
              style={done ? { borderColor: color, background: `${color}15` } : {}}
              onClick={() => toggle(task.id)}>
              <span className={`gr-cb ${done ? 'checked' : ''}`} style={done ? { background: color } : { borderColor: color }}>
                {done && '✓'}
              </span>
              <span className="gr-task-text">{task.text}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="gr-screen">
      <div className="gr-header">
        <button className="gr-back" onClick={onBack}>← Home</button>
        <h1>👧 Girls' Room Sort</h1>
        <div className="gr-progress-pills">
          <span style={{ color: alma.color }}>Alma {pct(ALMA_TASKS)}%</span>
          <span style={{ color: olga.color }}>Olga {pct(OLGA_TASKS)}%</span>
        </div>
      </div>
      <div className="gr-body">
        <Section title="Together First" tasks={TOGETHER_TASKS} color="#F5F5F7" emoji="🤝" />
        <Section title="Alma's Jobs" tasks={ALMA_TASKS} color={alma.color} emoji={alma.emoji} />
        <Section title="Olga's Jobs" tasks={OLGA_TASKS} color={olga.color} emoji={olga.emoji} />
        <Section title="Together at the End" tasks={TOGETHER_END} color="#FF9F0A" emoji="🌟" />
      </div>
    </div>
  );
}
