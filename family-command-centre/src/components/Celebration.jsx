import { useEffect, useRef } from 'react';
import './Celebration.css';

const EMOJIS = ['🎉','⭐','🌟','✨','🎊','🏆','💫','🦋'];

export default function Celebration({ active, onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < 60; i++) {
      const span = document.createElement('span');
      span.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      span.style.cssText = `
        position:absolute;
        font-size:${24 + Math.random()*24}px;
        left:${Math.random()*100}%;
        top:-60px;
        animation: confettiFall ${1.5 + Math.random()*2}s ease-in forwards;
        animation-delay:${Math.random()*1}s;
      `;
      el.appendChild(span);
    }
    const t = setTimeout(() => { onDone?.(); }, 3500);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  return (
    <div className="celebration-overlay" ref={ref}>
      <div className="celebration-message">🎉 Amazing! All done! 🎉</div>
    </div>
  );
}
