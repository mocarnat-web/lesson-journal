import { FAMILY_MAP } from '../data/family';
import './Alert.css';
export default function Alert({ alert, onDismiss }) {
  if (!alert) return null;
  const people = (alert.who||[]).map(id=>FAMILY_MAP[id]).filter(Boolean);
  return (
    <div className="alert-overlay" onClick={onDismiss}>
      <div className="alert-card">
        <div className="alert-emoji">{alert.emoji}</div>
        <div className="alert-label">{alert.label}</div>
        <div className="alert-time">In 30 minutes — {alert.time}</div>
        <div className="alert-who">{people.map(p=><span key={p.id} style={{color:p.color}}>{p.emoji} {p.name}</span>)}</div>
        <button className="alert-dismiss" onClick={onDismiss}>Got it ✓</button>
      </div>
    </div>
  );
}
