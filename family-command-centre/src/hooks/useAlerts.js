import { useState, useEffect, useRef } from 'react';
import { WEEKLY_SCHEDULE, DAYS } from '../data/schedule';

function todayKey() {
  return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

export function useAlerts() {
  const [activeAlert, setActiveAlert] = useState(null);
  const firedRef = useRef(new Set());

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const day = todayKey();
      const events = WEEKLY_SCHEDULE[day] || [];
      events.forEach(ev => {
        const alertTime = subtractMins(ev.time, 30);
        if (hhmm === alertTime && !firedRef.current.has(ev.id + hhmm)) {
          firedRef.current.add(ev.id + hhmm);
          setActiveAlert(ev);
          setTimeout(() => setActiveAlert(null), 30000);
        }
      });
    };
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, []);

  return { activeAlert, dismissAlert: () => setActiveAlert(null) };
}

function subtractMins(timeStr, mins) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m - mins;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
}
