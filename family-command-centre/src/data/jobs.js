export const NOW_JOBS = {
  hall: { label:'Hall', emoji:'🚪', tasks:[
    {id:'h1',text:'Reorganise shoe cabinet — shoes only'},{id:'h2',text:'Move hats to understairs cupboard'},
    {id:'h3',text:'Clear floor'},{id:'h4',text:'Label sections'},
  ]},
  kitchen: { label:'Kitchen', emoji:'🍳', tasks:[
    {id:'k1',text:'Clean hob'},{id:'k2',text:'Tidy window shelves'},{id:'k3',text:'Sort trolley shelves'},
    {id:'k4',text:'Tidy pantry'},{id:'k5',text:'Sort tupperware — match lids'},{id:'k6',text:'Tidy spices'},
    {id:'k7',text:'Sort double door cabinet'},{id:'k8',text:'Get rid of bottles'},{id:'k9',text:'Clean under sink'},
    {id:'k10',text:'Clear spiderwebs'},{id:'k11',text:'Add cable cover'},
  ]},
  livingRoom: { label:'Living Room', emoji:'🛋️', tasks:[
    {id:'l1',text:'Sew curtains middle'},{id:'l2',text:'Remove balloons from rods'},{id:'l3',text:'Remove plant from light'},
    {id:'l4',text:'Fix IKEA doors — Allen key'},{id:'l5',text:'Organise toys — donate bag and rotation'},
    {id:'l6',text:'Sort brown cupboard'},{id:'l7',text:'Sort white cupboard'},{id:'l8',text:'Wash sofa covers'},
    {id:'l9',text:'Clear spiderwebs'},{id:'l10',text:'Add cable cover'},
  ]},
  porch: { label:'Porch', emoji:'🧥', tasks:[
    {id:'p1',text:'Sort PAX wardrobe 1 — outdoor zone: coats, hats, helmets, skates'},
    {id:'p2',text:'Sort PAX wardrobe 2 — tools & hobby zone: Cricut'},
    {id:'p3',text:'Sort Alex drawers — throw rubbish, categorise tools'},
    {id:'p4',text:'Label every Alex drawer'},{id:'p5',text:'Assign and label Kallax boxes'},
  ]},
  bathroom: { label:'Bathroom', emoji:'🛁', tasks:[
    {id:'b1',text:'Full bathroom clean'},{id:'b2',text:'Organise built-in cupboard — zone by category'},
    {id:'b3',text:'Tidy under-sink cupboard'},
  ]},
  upstairsHall: { label:'Upstairs Hall', emoji:'🪜', tasks:[
    {id:'u1',text:'Change light fitting — isolate circuit first'},{id:'u2',text:'Organise drawers outside bathroom'},
  ]},
  changingRoom: { label:'Changing Room', emoji:'👗', tasks:[
    {id:'c1',text:'Declutter clothes — donate unworn in a year'},
    {id:'c2',text:'Organise drawers — KonMari fold upright'},{id:'c3',text:'Put all clothes away'},
  ]},
  teoBedroom: { label:"Teo's Bedroom", emoji:'🦁', tasks:[
    {id:'t1',text:'General organise (1 hour)'},{id:'t2',text:'Thin out books'},
    {id:'t3',text:'Display books so Teo can reach them'},
  ]},
  roofSpaces: { label:'Roof Spaces', emoji:'📦', tasks:[
    {id:'r1',text:'Sort everything — keep, donate, bin'},{id:'r2',text:'Buy uniform clear stackable boxes with lids'},
    {id:'r3',text:'Label every box on side facing entrance'},{id:'r4',text:'Return in organised zones — heavier at bottom'},
  ]},
};
export const SUMMER_JOBS = {
  kitchen: { label:'Kitchen', emoji:'🍳', tasks:[
    {id:'sk1',text:'Degrease with sugar soap'},{id:'sk2',text:'Tile primer — Ronseal or Rustins'},
    {id:'sk3',text:'Paint tiles'},{id:'sk4',text:'Prime lights — Rustoleum'},
    {id:'sk5',text:'Spray paint lights'},{id:'sk6',text:'Paint kitchen walls (paint bought — need primer)'},
  ]},
  bathroom: { label:'Bathroom', emoji:'🛁', tasks:[
    {id:'sb1',text:'Measure floor'},{id:'sb2',text:'Buy new vinyl'},
    {id:'sb3',text:'Fit vinyl DIY'},{id:'sb4',text:'Sand, prime, repaint under-sink cupboard doors'},
  ]},
  porch: { label:'Porch', emoji:'🧥', tasks:[
    {id:'sp1',text:'Assess PAX wardrobes — repair or replace'},{id:'sp2',text:'Wall-anchor or replace PAX'},
  ]},
  girlsRooms: { label:"Girls' Rooms", emoji:'👧', tasks:[
    {id:'sg1',text:'Alma — full sort 3-hour session with Alma'},{id:'sg2',text:'Olga — full sort 2-hour session with Olga'},
  ]},
  garden: { label:'Garden', emoji:'🌱', tasks:[
    {id:'gd1',text:'Kitchen garden — full clearout, weeding, decide what to replant'},
    {id:'gd2',text:'Main garden — mow, tidy beds'},{id:'gd3',text:'Paddock — strim long grass'},
    {id:'gd4',text:'General weeding'},{id:'gd5',text:'Replanting after clearance'},
  ]},
};
export const DAILY_TASKS = {
  mum: [
    {id:'dm1',text:'Morning school run',points:5,mins:30},{id:'dm2',text:'Check family emails',points:5,mins:10},
    {id:'dm3',text:'Afternoon pickup / arrange grandparents',points:5,mins:30},{id:'dm4',text:'Evening check-in with kids',points:5,mins:15},
  ],
  justin: [
    {id:'dj1',text:'Morning routine with Teo',points:5,mins:20},{id:'dj2',text:'Check j31phillips emails',points:5,mins:10},
    {id:'dj3',text:'Evening bedtime story — Teo',points:5,mins:20},
  ],
  alma: [
    {id:'da1',text:'Make bed',points:5,mins:5},{id:'da2',text:'Tidy room',points:5,mins:10},
    {id:'da3',text:'Homework',points:10,mins:20},{id:'da4',text:'Help set table',points:5,mins:5},
    {id:'da5',text:'Pack school bag for tomorrow',points:5,mins:5},
  ],
  olga: [
    {id:'do1',text:'Make bed',points:5,mins:5},{id:'do2',text:'Tidy room',points:5,mins:10},
    {id:'do3',text:'Homework',points:10,mins:20},{id:'do4',text:'Help clear table',points:5,mins:5},
    {id:'do5',text:'Pack school bag for tomorrow',points:5,mins:5},
  ],
  teo: [
    {id:'dt1',text:'👟 Shoes tidy',points:5,mins:3},{id:'dt2',text:'🧸 Toys put away',points:5,mins:5},
    {id:'dt3',text:'📚 Read with Mummy or Daddy',points:5,mins:15},{id:'dt4',text:'🍽️ Help lay table',points:5,mins:5},
  ],
};
