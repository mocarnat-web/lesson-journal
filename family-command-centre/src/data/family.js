export const FAMILY = [
  { id: 'mum',    name: 'Mum',    emoji: '👩‍🏫', color: '#D4537E', role: 'organiser' },
  { id: 'justin', name: 'Justin', emoji: '👨‍💼', color: '#378ADD', role: 'dad' },
  { id: 'alma',   name: 'Alma',   emoji: '🌟', color: '#7F77DD', role: 'child', age: 11 },
  { id: 'olga',   name: 'Olga',   emoji: '🌿', color: '#1D9E75', role: 'child', age: 9 },
  { id: 'teo',    name: 'Teo',    emoji: '🦁', color: '#EF9F27', role: 'child', age: 4, isToddler: true },
];

export const FAMILY_MAP = Object.fromEntries(FAMILY.map(f => [f.id, f]));
