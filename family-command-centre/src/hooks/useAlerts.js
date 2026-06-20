import { useState, useEffect, useRef } from 'react';
import { WEEKLY_SCHEDULE, DAYS } from '../data/schedule';
function todayKey() { return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; }
export function useAlerts() {
  const [activeAlert, setActiveAlert] = useState(null);
  const fired = useRef(new Set());
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      (WEEKLY_SCHEDULE[todayKey()] || []).forEach(ev => {
        const [h,m] = ev.time.split(':').map(Number);
        const total = h*60+m-30; const nh=Math.floor(total/60); const nm=total%60;
        const at = `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
        if (hhmm===at && !fired.current.has(ev.id+hhmm)) {
          fired.current.add(ev.id+hhmm); setActiveAlert(ev);
          setTimeout(()=>setActiveAlert(null),30000);
        }
      });
    };
    const id = setInterval(check,10000); return ()=>clearInterval(id);
  }, []);
  return { activeAlert, dismissAlert: ()=>setActiveAlert(null) };
}
