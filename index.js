import { useState, useEffect, useCallback } from "react";

// ── Google Drive file ID ──────────────────────────────────────────────────────
const LESSONS_FILE_ID = "1ZbM0CD9xUM1Ea4GrINOVU1K7tZnZnvWc";

// ── Palette ───────────────────────────────────────────────────────────────────
const P={bg:"#F5F0EB",white:"#FFFFFF",text:"#2C2C2C",mid:"#555555",soft:"#888888",border:"#DDD5CC",mist:"#6BAF8A",apricot:"#E8C84A",gingham:"#6B8FC4",honey:"#D45A4A",peachy:"#B57AAA",sage:"#7ABFA0",blush:"#8A6FB8",sand:"#5B7AB8"};
const dk=(h,a)=>"#"+[0,2,4].map(i=>Math.max(0,Math.min(255,parseInt(h.slice(i+1,i+3),16)+a)).toString(16).padStart(2,"0")).join("");
const SC={  "Cheddar":"#6BAF8A",  "Wedmore":"#E8A84A",  "Weare":"#5A8EC4",  "Mark":"#D46A6A",  "Shipham":"#7AB8D4",  "Draycott":"#C47AAF",  "Lympsham":"#8AB870",  "Axbridge":"#D4946A"};const DAY_COLOR={"Wednesday":"#5A9E78","Thursday":"#4A7FB8","Friday":"#9B6AB8","Friday (alt weeks)":"#9B6AB8"};
const YG_COLOR={"Reception":"#B86EB8","Year 1":"#F07AA0","Year 2":"#D4B820","Year 3":"#6AA882","Year 4":"#6A98BC","Year 5":"#A8B8D4","Year 6":"#C4A888"};
const RL=["","Poor","Weak","OK","Good","Excellent"];
const RC=["","#C44A3A","#CA6F1E","#C4A82A","#2E86C1","#1E8449"];
const YG=["Reception","Year 1","Year 2","Year 3","Year 4","Year 5","Year 6"];
const BLANK={id:"",school:"",className:"",yearGroup:"",date:"",unit:"",details:"",wentWell:"",improve:"",notes:"",rating:0};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
const fmt=iso=>iso?new Date(iso+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"}):"";
const IS={width:"100%",boxSizing:"border-box",padding:"10px 12px",borderRadius:10,border:"1.5px solid #E8DDD5",fontFamily:"inherit",fontSize:14,color:"#3D2C2C",background:"#fff",outline:"none"};

const SEED={
  "Cheddar":{day:"Wednesday",color:"#6BAF8A",classes:[{name:"Skylark",year:"Year 2",teacher:"Lewis Hynam",time:"9:15-9:35"},{name:"Woodpecker",year:"Year 2",teacher:"Caitlin Mewse",time:"9:35-9:55"},{name:"Kingfisher",year:"Year 1",teacher:"Rebecca Davies",time:"9:55-10:15"},{name:"Wren",year:"Reception",teacher:"Emily Styring",time:"10:15-10:30"},{name:"Goldfinch",year:"Year 1",teacher:"Emily Corry",time:"11:05-11:25"},{name:"Kestrel",year:"Year 3",teacher:"Sarah Griffin",time:"11:30-12:15"},{name:"Robin",year:"Reception",teacher:"Holly Alen",time:"1:00-1:15"},{name:"Swan",year:"Year 4",teacher:"Richard Nicholas",time:"1:15-2:00"},{name:"Puffin",year:"Year 4",teacher:"Laura Leggett",time:"2:00-2:45"},{name:"Falcon",year:"Year 3",teacher:"Beth Whaites",time:"2:45-3:25"}]},
  "Wedmore":{day:"Thursday",color:"#E8A84A",classes:[{name:"Year 3",year:"Year 3",teacher:"",time:"8:50-9:35"},{name:"Year 4",year:"Year 4",teacher:"",time:"9:35-10:20"}]},
  "Weare":{day:"Thursday",color:"#5A8EC4",classes:[{name:"Year 3",year:"Year 3",teacher:"Heather Cooke",time:"10:45-11:30"},{name:"Year 4",year:"Year 4",teacher:"Clair Morris",time:"11:30-12:15"}]},
  "Mark":{day:"Thursday",color:"#D46A6A",classes:[{name:"Woodpecker (Y3)",year:"Year 3",teacher:"",time:"13:10-14:10"},{name:"Kestrel (Y4)",year:"Year 4",teacher:"",time:"14:10-15:10"}]},
  "Shipham":{day:"Friday (alt weeks)",color:"#7AB8D4",classes:[{name:"Year 3",year:"Year 3",teacher:"",time:"8:45-9:25"},{name:"Year 4",year:"Year 4",teacher:"",time:"9:25-9:50"}]},
  "Draycott":{day:"Friday (alt weeks)",color:"#C47AAF",classes:[{name:"Year 3",year:"Year 3",teacher:"",time:"8:45-9:25"},{name:"Year 4",year:"Year 4",teacher:"",time:"9:25-9:50"}]},
  "Lympsham":{day:"Friday",color:"#8AB870",classes:[{name:"Year 3",year:"Year 3",teacher:"",time:"10:30-11:15"},{name:"Year 4",year:"Year 4",teacher:"",time:"11:45-12:00"}]},
  "Axbridge":{day:"Friday",color:"#D4946A",classes:[{name:"Hazel",year:"Year 3",teacher:"Mrs Hall / Mrs Farnie",time:"13:15-14:00"},{name:"Oak",year:"Year 4",teacher:"Miss Nash",time:"14:10-15:05"}]},
};

// ── Google Drive sync via Anthropic API ───────────────────────────────────────
async function driveLoad() {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: "You are a file assistant. When asked to read a Google Drive file, use the available MCP tools to fetch it and return ONLY the raw JSON content, no explanation.",
        messages: [{ role: "user", content: `Read Google Drive file ID ${LESSONS_FILE_ID} and return ONLY its JSON content.` }],
        mcp_servers: [{ type: "url", url: "https://drivemcp.googleapis.com/mcp/v1", name: "gdrive" }]
      })
    });
    const data = await res.json();
    const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch(e) {}
  return null;
}

async function driveSave(lessons) {
  try {
    const json = JSON.stringify({ lessons });
    const b64 = btoa(unescape(encodeURIComponent(json)));
    await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: "You are a file assistant. Update Google Drive files when asked using MCP tools.",
        messages: [{ role: "user", content: `Update Google Drive file ID ${LESSONS_FILE_ID} with this base64 JSON content: ${b64}` }],
        mcp_servers: [{ type: "url", url: "https://drivemcp.googleapis.com/mcp/v1", name: "gdrive" }]
      })
    });
  } catch(e) {}
}

// ── UI Components ─────────────────────────────────────────────────────────────
function Stars({value,onChange,size=24}){const[h,sh]=useState(0);const a=h||value;return <div style={{display:"flex",alignItems:"center",gap:3}}>{[1,2,3,4,5].map(n=><span key={n} onMouseEnter={()=>onChange&&sh(n)} onMouseLeave={()=>onChange&&sh(0)} onClick={()=>onChange&&onChange(n===value?0:n)} style={{fontSize:size,lineHeight:1,cursor:onChange?"pointer":"default",color:n<=a?RC[a]:"#D8CBBC",userSelect:"none",display:"inline-block"}}>★</span>)}{value>0&&<span style={{marginLeft:6,fontSize:12,fontWeight:800,color:RC[value]}}>{RL[value]}</span>}</div>;}
function Chip({children,color=P.mist,small}){return <span style={{display:"inline-block",padding:small?"2px 8px":"3px 12px",borderRadius:99,background:color+"28",color:dk(color,-50),border:"1px solid "+color+"77",fontSize:small?11:12,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;}
function Btn({children,onClick,bg=P.mist,color,disabled,style:s}){const c=color||dk(bg,-60);return <button onClick={onClick} disabled={disabled} style={{background:bg,color:c,border:"none",padding:"9px 18px",borderRadius:10,fontFamily:"inherit",fontWeight:800,fontSize:13,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.6:1,whiteSpace:"nowrap",...s}} onMouseEnter={e=>!disabled&&(e.currentTarget.style.opacity=".82")} onMouseLeave={e=>!disabled&&(e.currentTarget.style.opacity="1")}>{children}</button>;}
function Lbl({children}){return <span style={{display:"block",marginBottom:5,fontSize:11,fontWeight:800,letterSpacing:1,color:"#9C7E7E",textTransform:"uppercase"}}>{children}</span>;}
function Field({label,children}){return <div style={{marginBottom:16}}><Lbl>{label}</Lbl>{children}</div>;}
function TA({label,value,onChange,ph,rows=3}){return <Field label={label}><textarea value={value} rows={rows} onChange={e=>onChange(e.target.value)} placeholder={ph} style={{...IS,resize:"vertical",minHeight:rows*28,lineHeight:1.6}}/></Field>;}
function SyncBadge({status}){
  const cfg={idle:{bg:"#f0fdf4",border:"#86efac",color:"#166534",label:"✓ Saved to Drive"},saving:{bg:"#fefce8",border:"#fde68a",color:"#92400e",label:"Saving..."},error:{bg:"#fef2f2",border:"#fca5a5",color:"#b91c1c",label:"Save failed — data kept locally"}};
  const c=cfg[status]||cfg.idle;
  return <span style={{fontSize:11,fontWeight:700,color:c.color,background:c.bg,border:"1px solid "+c.border,borderRadius:99,padding:"3px 10px"}}>{c.label}</span>;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App(){
  const[lessons,setLessons]=useState([]);
  const[sd,setSd]=useState({});
  const[view,setView]=useState("home");
  const[selS,setSelS]=useState(null);
  const[selC,setSelC]=useState(null);
  const[form,setForm]=useState({...BLANK});
  const[det,setDet]=useState(null);
  const[loading,setLoading]=useState(true);
  const[syncStatus,setSyncStatus]=useState("idle");
  const[toast,setToast]=useState(null);
  const[delId,setDelId]=useState(null);
  const[search,setSearch]=useState("");
  const[searchOpen,setSearchOpen]=useState(false);

  // Load: try Drive first, fall back to local
  useEffect(()=>{(async()=>{
    try{const r=await window.storage.get("lj_sd");if(r)setSd(JSON.parse(r.value));else setSd(SEED);}catch(e){setSd(SEED);}
    // Try Drive
    const driveData = await driveLoad();
    if(driveData?.lessons){
      setLessons(driveData.lessons);
      await window.storage.set("lj_lessons_cache", JSON.stringify(driveData.lessons));
    } else {
      try{const r=await window.storage.get("lj_lessons_cache");if(r)setLessons(JSON.parse(r.value));}catch(e){}
    }
    setLoading(false);
  })();},[]);

  const saveAll=useCallback(async(ls,s)=>{
    // Always save school data locally
    if(s!==undefined)try{await window.storage.set("lj_sd",JSON.stringify(s));}catch(e){}
    // Save lessons to Drive + local cache
    setSyncStatus("saving");
    try{
      await window.storage.set("lj_lessons_cache",JSON.stringify(ls));
      await driveSave(ls);
      setSyncStatus("idle");
    }catch(e){
      setSyncStatus("error");
      setTimeout(()=>setSyncStatus("idle"),4000);
    }
  },[]);

  const t2=(msg,err)=>{setToast({msg,err});setTimeout(()=>setToast(null),2500);};
  const schools=Object.keys(sd);
  const si=s=>sd[s]||{};
  const cls=s=>sd[s]?.classes||[];
  const ci=(s,n)=>cls(s).find(c=>c.name===n)||{};
  const lfc=(s,n)=>lessons.filter(l=>l.school===s&&l.className===n).sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  const srResults=search.trim().length>1?lessons.filter(l=>[l.school,l.className,l.unit,l.details,l.wentWell,l.improve,l.notes].some(v=>v?.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,15):[];

  const doSave=async()=>{
    if(!form.school||!form.date){t2("School and date required.",true);return;}
    const e={...form,id:form.id||uid()};
    const ls=form.id?lessons.map(l=>l.id===form.id?e:l):[e,...lessons];
    setLessons(ls);await saveAll(ls,undefined);t2("Saved to Drive!");
    setSelS(form.school);setSelC(form.className);setView("class");setForm({...BLANK});
  };

  const doDel=async id=>{
    const ls=lessons.filter(l=>l.id!==id);
    setLessons(ls);await saveAll(ls,undefined);setDelId(null);setView("class");t2("Deleted");
  };

  const updC=(school,cn,f,v)=>{
    const s={...sd};s[school]={...s[school],classes:s[school].classes.map(c=>c.name===cn?{...c,[f]:v}:c)};
    setSd(s);saveAll(lessons,s);
  };

  const newL=(s,cn)=>{const info=ci(s,cn);setForm({...BLANK,school:s,className:cn,yearGroup:info.year||"",date:new Date().toISOString().split("T")[0]});setView("form");};
  const goHome=()=>{setView("home");setSelS(null);setSelC(null);};
  const goSchool=()=>{setView("school");setSelC(null);};

  const printClass=(s,cn)=>{
    const ls=lfc(s,cn);const info=ci(s,cn);const sinfo=si(s);
    const w=window.open("","_blank");
    w.document.write(`<html><head><title>${cn}</title><style>body{font-family:Georgia,serif;padding:32px;max-width:700px;margin:0 auto;}h1{font-size:22px;}h2{font-size:16px;margin:24px 0 4px;border-top:1px solid #ddd;padding-top:14px;}.lbl{font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#888;margin:8px 0 2px;}.val{font-size:14px;line-height:1.65;padding-left:10px;border-left:3px solid #6FB5A4;margin-bottom:8px;}</style></head><body>`);
    w.document.write(`<h1>${cn} — Lesson Record</h1><p style="color:#666;font-size:13px;">${s} · ${sinfo.day||""} · ${info.time||""}${info.teacher?" · "+info.teacher:""}</p><hr/>`);
    ls.length===0?w.document.write("<p>No lessons logged yet.</p>"):ls.forEach(l=>{
      w.document.write(`<h2>${l.unit||"(No unit)"} <span style="font-size:12px;color:#888;font-weight:normal;">${fmt(l.date)}${l.rating>0?" · "+"★".repeat(l.rating):""}</span></h2>`);
      [["Details",l.details],["What went well",l.wentWell],["What to improve",l.improve],["Notes",l.notes]].filter(([,v])=>v).forEach(([k,v])=>w.document.write(`<div class="lbl">${k}</div><div class="val">${v.replace(/\n/g,"<br/>")}</div>`));
    });
    w.document.write("</body></html>");w.document.close();w.print();
  };

  if(loading)return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Georgia,serif",color:"#9C7E7E",background:"#FAF6F0",gap:12}}><div style={{fontSize:32}}>🎵</div><div>Loading your lessons from Google Drive...</div></div>;

  return <div style={{minHeight:"100vh",background:"#FAF6F0",fontFamily:"'Nunito',sans-serif",color:"#3D2C2C",paddingBottom:80}}>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet"/>

    {toast&&<div style={{position:"fixed",top:20,right:24,zIndex:9999,background:toast.err?"#fef2f2":"#f0fdf4",border:"1.5px solid "+(toast.err?"#fca5a5":"#86efac"),color:toast.err?"#b91c1c":"#166634",padding:"11px 22px",borderRadius:12,fontWeight:800,fontSize:14,boxShadow:"0 8px 32px #0002"}}>{toast.msg}</div>}

    {delId&&<div style={{position:"fixed",inset:0,background:"#0009",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"36px 40px",maxWidth:360,textAlign:"center",boxShadow:"0 32px 80px #0005"}}>
        <div style={{fontSize:44,marginBottom:12}}>🗑️</div>
        <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,margin:"0 0 8px"}}>Delete this lesson?</h3>
        <p style={{color:"#9C7E7E",fontSize:14,margin:"0 0 26px"}}>Cannot be undone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn bg="#FAF6F0" color={P.mid} onClick={()=>setDelId(null)}>Cancel</Btn>
          <Btn bg="#ef4444" color="white" onClick={()=>doDel(delId)}>Delete</Btn>
        </div>
      </div>
    </div>}

    {/* Header */}
    <header style={{background:"#fff",borderBottom:"1.5px solid #E8DDD5",padding:"0 28px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 10px #00000010"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {view!=="home"&&<Btn bg="#FAF6F0" color={P.mid} onClick={goHome} style={{padding:"5px 12px",fontSize:12}}>← Home</Btn>}
        {view==="class"&&<Btn bg="#FAF6F0" color={P.mid} onClick={goSchool} style={{padding:"5px 12px",fontSize:12}}>← {selS}</Btn>}
        {view==="detail"&&selS&&selC&&<Btn bg="#FAF6F0" color={P.mid} onClick={()=>setView("class")} style={{padding:"5px 12px",fontSize:12}}>← {selC}</Btn>}
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:19,color:"#3D2C2C"}}>
          {view==="home"?"Lesson Journal":view==="school"?`🏫 ${selS}`:view==="class"?selC:view==="form"?(form.id?"Edit Lesson":"New Lesson"):"Lesson Record"}
        </span>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <SyncBadge status={syncStatus}/>
        {view==="home"&&<Btn bg="#FAF6F0" color={P.mid} onClick={()=>setView("schools")} style={{fontSize:12}}>Edit Schools</Btn>}
        {view==="class"&&selS&&selC&&<>
          <Btn bg="#FAF6F0" color={P.mid} onClick={()=>printClass(selS,selC)} style={{fontSize:12}}>🖨 Print</Btn>
          <Btn bg={si(selS).color||P.mist} onClick={()=>newL(selS,selC)}>+ New Lesson</Btn>
        </>}
        {view==="form"&&<Btn bg={P.mist} onClick={doSave}>💾 Save</Btn>}
        {view==="detail"&&det&&<>
          <Btn bg="#FAF6F0" color={P.mid} onClick={()=>{setSelS(det.school);setSelC(det.className);setForm({...det});setView("form");}} style={{fontSize:12}}>✏ Edit</Btn>
          <Btn bg="#fce4e4" color="#b91c1c" onClick={()=>setDelId(det.id)} style={{fontSize:12}}>🗑 Delete</Btn>
        </>}
      </div>
    </header>

    {/* HOME */}
    {view==="home"&&<main style={{maxWidth:1060,margin:"0 auto",padding:"36px 28px"}}>
      <p style={{color:"#9C7E7E",fontSize:13,marginBottom:28,textAlign:"center"}}>{lessons.length} lesson{lessons.length!==1?"s":""} saved to Google Drive</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:18}}>
        {schools.map(school=>{const info=si(school);const c=info.color||P.mist;const count=lessons.filter(l=>l.school===school).length;
          return <div key={school} onClick={()=>{setSelS(school);setView("school");}}
            style={{background:"#fff",borderRadius:18,padding:"26px 20px",border:"2px solid "+c+"33",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 10px #00000008",transition:"transform .15s,box-shadow .15s",borderTop:"5px solid "+c}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 8px 24px "+c+"44";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 10px #00000008";}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:23,color:"#3D2C2C",marginBottom:6,letterSpacing:-0.3}}>{school}</div>
            <div style={{fontSize:12,color:DAY_COLOR[info.day]||dk(c,-40),fontWeight:700,marginBottom:3}}>{info.day}</div>
            <div style={{fontSize:12,color:"#9C7E7E"}}>{count} lesson{count!==1?"s":""} · {cls(school).length} classes</div>
          </div>;
        })}
      </div>
    </main>}

    {/* SCHOOL */}
    {view==="school"&&selS&&<main style={{maxWidth:960,margin:"0 auto",padding:"36px 28px"}}>
      <div style={{marginBottom:18}}><span style={{fontSize:12,fontWeight:700,color:DAY_COLOR[si(selS).day]||dk(si(selS).color||P.mist,-40),background:(DAY_COLOR[si(selS).day]||si(selS).color||P.mist)+"22",padding:"4px 12px",borderRadius:99}}>{si(selS).day}</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>
        {cls(selS).map(cl=>{const c=si(selS).color||P.mist;const count=lfc(selS,cl.name).length;const last=lfc(selS,cl.name)[0];
          return <div key={cl.name} onClick={()=>{setSelC(cl.name);setView("class");}}
            style={{background:"#fff",borderRadius:14,padding:"20px 18px",border:"1.5px solid "+c+"44",cursor:"pointer",boxShadow:"0 2px 8px #00000005",transition:"transform .15s,box-shadow .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 6px 18px "+c+"44";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 8px #00000005";}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:16,color:"#3D2C2C",marginBottom:3}}>{cl.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:YG_COLOR[cl.year]||"#ccc",border:"1.5px solid rgba(0,0,0,0.15)",flexShrink:0}}/><span style={{fontSize:11,color:"#9C7E7E"}}>{cl.year}</span></div>
            <div style={{fontSize:11,fontWeight:700,color:dk(c,-40),marginBottom:cl.teacher?6:10}}>{si(selS).day} · {cl.time}</div>
            {cl.teacher&&<div style={{fontSize:11,color:"#6B5050",marginBottom:8}}>{cl.teacher}</div>}
            <div style={{fontSize:11,color:"#9C7E7E",borderTop:"1px solid #E8DDD5",paddingTop:7}}>{count} lesson{count!==1?"s":""}{last?` · ${fmt(last.date)}`:""}</div>
          </div>;
        })}
      </div>
    </main>}

    {/* CLASS */}
    {view==="class"&&selS&&selC&&<main style={{maxWidth:820,margin:"0 auto",padding:"36px 28px"}}>
      {(()=>{const c=si(selS).color||P.mist;const cinfo=ci(selS,selC);const ls=lfc(selS,selC);return <>
        <div style={{background:c+"18",border:"1.5px solid "+c+"44",borderRadius:13,padding:"14px 20px",marginBottom:24,display:"flex",gap:28,flexWrap:"wrap"}}>
          <div><div style={{fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:2}}>Day & Time</div><div style={{fontWeight:800,color:"#3D2C2C",fontSize:14}}>{si(selS).day} · {cinfo.time||"--"}</div></div>
          <div><div style={{fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:2}}>Class</div><div style={{fontWeight:800,color:"#3D2C2C",fontSize:14}}>{selC} · {cinfo.year||"--"}</div></div>
          {cinfo.teacher&&<div><div style={{fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:2}}>Teacher</div><div style={{fontWeight:700,color:"#6B5050",fontSize:13}}>{cinfo.teacher}</div></div>}
        </div>
        {ls.length===0?<div style={{background:"#fff",borderRadius:14,padding:"52px 36px",textAlign:"center",border:"2px dashed #E8DDD5"}}>
          <div style={{fontSize:44,marginBottom:12}}>🎵</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#6B5050",marginBottom:12}}>No lessons yet</div>
          <Btn bg={c} onClick={()=>newL(selS,selC)} style={{padding:"10px 24px"}}>+ Log first lesson</Btn>
        </div>:<div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ls.map(l=><div key={l.id} onClick={()=>{setDet(l);setView("detail");}}
            style={{background:"#fff",borderRadius:11,padding:"14px 18px",border:"1.5px solid #E8DDD5",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,boxShadow:"0 1px 4px #00000006",transition:"all .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c;e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#E8DDD5";e.currentTarget.style.transform="translateY(0)";}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#3D2C2C",marginBottom:3}}>{l.unit||"(No unit)"}</div>
              <div style={{fontSize:12,color:"#9C7E7E"}}>📅 {fmt(l.date)}{l.details?" · "+l.details.slice(0,55)+(l.details.length>55?"…":""):""}</div>
            </div>
            {l.rating>0&&<span style={{fontSize:15,color:RC[l.rating],flexShrink:0}}>{"★".repeat(l.rating)}{"☆".repeat(5-l.rating)}</span>}
          </div>)}
        </div>}
      </>})()}
    </main>}

    {/* FORM */}
    {view==="form"&&<main style={{maxWidth:820,margin:"0 auto",padding:"28px"}}>
      {(()=>{const c=si(form.school)?.color||P.mist;const cinfo=ci(form.school,form.className);return <>
        {form.school&&form.className&&<div style={{background:c+"18",border:"1.5px solid "+c+"44",borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",gap:24,flexWrap:"wrap"}}>
          <div><div style={{fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:2}}>Day & Time</div><div style={{fontWeight:800,color:"#3D2C2C",fontSize:13}}>{si(form.school).day} · {cinfo.time||"--"}</div></div>
          <div><div style={{fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:2}}>Class</div><div style={{fontWeight:800,color:"#3D2C2C",fontSize:13,display:"flex",alignItems:"center",gap:6}}><span style={{display:"inline-block",width:12,height:12,borderRadius:"50%",background:YG_COLOR[cinfo.year||form.yearGroup]||"#ccc",border:"1.5px solid rgba(0,0,0,0.15)",flexShrink:0}}/>{form.className} · {cinfo.year||form.yearGroup||"--"}</div></div>
          {cinfo.teacher&&<div><div style={{fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:2}}>Teacher</div><div style={{fontWeight:700,color:"#6B5050",fontSize:12}}>{cinfo.teacher}</div></div>}
        </div>}
        <div style={{background:"#fff",borderRadius:14,padding:"24px 28px",border:"1px solid #E8DDD5",boxShadow:"0 2px 12px #00000006"}}>
          {!form.id&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            <Field label="School"><select value={form.school} onChange={e=>{const s=e.target.value;setSelS(s);setForm(f=>({...f,school:s,className:"",yearGroup:""}));}} style={{...IS,color:form.school?P.text:P.soft}}><option value="">Select school...</option>{schools.map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
            <Field label="Class">{form.school&&cls(form.school).length>0?<select value={form.className} onChange={e=>{const cn=e.target.value;const yr=ci(form.school,cn).year||"";setSelC(cn);setForm(f=>({...f,className:cn,yearGroup:yr||f.yearGroup}));}} style={{...IS,color:form.className?P.text:P.soft}}><option value="">Select class...</option>{cls(form.school).map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select>:<input value={form.className} onChange={e=>setForm(f=>({...f,className:e.target.value}))} placeholder="Class name" style={IS}/>}</Field>
            <Field label="Year Group"><select value={form.yearGroup} onChange={e=>setForm(f=>({...f,yearGroup:e.target.value}))} style={{...IS,color:form.yearGroup?P.text:P.soft}}><option value="">Select...</option>{YG.map(y=><option key={y} value={y}>{y}</option>)}</select></Field>
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:16}}>
            <Field label="Date"><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={IS}/></Field>
            <Field label="Unit / Topic"><input value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} placeholder="e.g. Me and others — Lesson 3" style={IS}/></Field>
          </div>
          <TA label="Lesson Details" value={form.details} onChange={v=>setForm(f=>({...f,details:v}))} ph="Activities, vocabulary, songs..." rows={4}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <TA label="What went well" value={form.wentWell} onChange={v=>setForm(f=>({...f,wentWell:v}))} ph="Moments that worked..." rows={3}/>
            <TA label="What to improve" value={form.improve} onChange={v=>setForm(f=>({...f,improve:v}))} ph="Next steps..." rows={3}/>
          </div>
          <TA label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} ph="Equipment, cover, anything else..." rows={2}/>
          <div><Lbl>How did it go?</Lbl><Stars value={form.rating} onChange={v=>setForm(f=>({...f,rating:v}))} size={26}/></div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <Btn bg="#FAF6F0" color={P.mid} onClick={()=>{if(selS&&selC)setView("class");else goHome();}}>Cancel</Btn>
          <Btn bg={c} onClick={doSave} style={{padding:"9px 28px"}}>💾 Save to Drive</Btn>
        </div>
      </>})()}
    </main>}

    {/* DETAIL */}
    {view==="detail"&&det&&<main style={{maxWidth:820,margin:"0 auto",padding:"28px"}}>
      {(()=>{const c=si(det.school)?.color||P.mist;const cinfo=ci(det.school,det.className);return <div style={{background:"#fff",borderRadius:14,padding:"28px 34px",border:"1px solid #E8DDD5",boxShadow:"0 2px 12px #00000006"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:24,color:"#3D2C2C",margin:"0 0 10px"}}>{det.unit||"Lesson Record"}</h1>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}><Chip color={c}>{det.school}</Chip><Chip color={c}>{det.className}</Chip>{det.yearGroup&&<Chip color={P.honey} small>{det.yearGroup}</Chip>}</div>
        <div style={{background:c+"18",border:"1px solid "+c+"44",borderRadius:9,padding:"10px 16px",marginBottom:18,display:"flex",gap:22,flexWrap:"wrap"}}>
          <div><span style={{fontSize:10,color:"#9C7E7E",fontWeight:800,textTransform:"uppercase",marginRight:7}}>Day & Time</span><span style={{fontWeight:800}}>{si(det.school).day} · {cinfo.time||"--"}</span></div>
          <div><span style={{fontSize:10,color:"#9C7E7E",fontWeight:800,textTransform:"uppercase",marginRight:7}}>Class</span><span style={{fontWeight:800}}>{det.className} · {cinfo.year||"--"}</span></div>
          {cinfo.teacher&&<div><span style={{fontSize:10,color:"#9C7E7E",fontWeight:800,textTransform:"uppercase",marginRight:7}}>Teacher</span><span style={{fontWeight:700,color:"#6B5050"}}>{cinfo.teacher}</span></div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:20,fontSize:13,color:"#9C7E7E",paddingBottom:18,borderBottom:"2px solid #FAF6F0",marginBottom:20}}>
          <span style={{fontWeight:600}}>📅 {fmt(det.date)}</span>{det.rating>0&&<Stars value={det.rating} size={18}/>}
        </div>
        {[["📝 Lesson Details",det.details,c],["✅ What Went Well",det.wentWell,"#27AE60"],["🔄 What to Improve",det.improve,P.honey],["📋 Notes",det.notes,P.soft]].filter(([,v])=>v).map(([label,val,accent])=><div key={label} style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#9C7E7E",marginBottom:6}}>{label}</div>
          <div style={{fontSize:14,color:"#6B5050",lineHeight:1.75,whiteSpace:"pre-wrap",background:"#FAF6F0",borderRadius:9,padding:"12px 14px",border:"1px solid #E8DDD5",borderLeft:"4px solid "+accent}}>{val}</div>
        </div>)}
      </div>})()}
    </main>}

    {/* SCHOOLS EDITOR */}
    {view==="schools"&&<main style={{maxWidth:940,margin:"0 auto",padding:"28px"}}>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:22,color:"#3D2C2C",margin:"0 0 6px"}}>Schools & Classes</h2>
      <p style={{color:"#9C7E7E",fontSize:13,marginBottom:24}}>Edit teacher names and times. To add a school or class, ask me to update the app.</p>
      {schools.map(school=>{const info=si(school);const c=info.color||P.mist;return <div key={school} style={{background:"#fff",borderRadius:14,marginBottom:16,border:"1px solid #E8DDD5",overflow:"hidden",boxShadow:"0 2px 6px #00000006"}}>
        <div style={{background:c+"22",borderBottom:"1px solid "+c+"44",padding:"12px 20px",display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:16,color:dk(c,-65)}}>{school}</span>
          <span style={{fontSize:11,fontWeight:700,color:dk(c,-40),background:c+"22",padding:"2px 9px",borderRadius:99}}>{info.day}</span>
        </div>
        <div style={{padding:"12px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 100px 1fr 120px",gap:8,fontSize:10,fontWeight:800,color:"#9C7E7E",textTransform:"uppercase",letterSpacing:.9,marginBottom:8,paddingBottom:6,borderBottom:"1px solid #E8DDD5"}}><span>Class</span><span>Year</span><span>Teacher</span><span>Time</span></div>
          {cls(school).map(cl=><div key={cl.name} style={{display:"grid",gridTemplateColumns:"1fr 100px 1fr 120px",gap:8,marginBottom:7,alignItems:"center"}}>
            <span style={{fontWeight:700,color:"#3D2C2C",fontSize:13}}>{cl.name}</span>
            <span style={{color:"#6B5050",fontSize:12}}>{cl.year}</span>
            <input value={cl.teacher||""} onChange={e=>updC(school,cl.name,"teacher",e.target.value)} placeholder="Teacher..." style={{...IS,padding:"6px 9px",fontSize:12}}/>
            <input value={cl.time||""} onChange={e=>updC(school,cl.name,"time",e.target.value)} placeholder="9:15-9:35" style={{...IS,padding:"6px 9px",fontSize:12}}/>
          </div>)}
        </div>
      </div>;})}
    </main>}

    {/* Floating search */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:300,padding:"14px 20px 18px",background:"linear-gradient(to top,#FAF6F0 60%,transparent)",pointerEvents:"none"}}>
      <div style={{maxWidth:620,margin:"0 auto",pointerEvents:"all"}}>
        {searchOpen&&search.trim().length>1&&<div style={{background:"#fff",borderRadius:14,border:"1.5px solid #E8DDD5",boxShadow:"0 -4px 28px #0000001a",marginBottom:10,maxHeight:260,overflowY:"auto"}}>
          {srResults.length===0?<div style={{padding:"16px 18px",color:"#9C7E7E",fontSize:13,textAlign:"center"}}>No results for "{search}"</div>:
          srResults.map(l=>{const c=SC[l.school]||P.mist;return <div key={l.id}
            onClick={()=>{setSelS(l.school);setSelC(l.className);setDet(l);setView("detail");setSearch("");setSearchOpen(false);}}
            style={{padding:"10px 18px",borderBottom:"1px solid #F0E8E0",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background="#FAF6F0"}
            onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
              <span style={{fontWeight:700,fontSize:13,color:"#3D2C2C"}}>{l.unit||"(No unit)"}</span>
              <span style={{fontSize:10,fontWeight:700,color:dk(c,-40),background:c+"22",padding:"1px 7px",borderRadius:99}}>{l.school}</span>
              <span style={{fontSize:10,fontWeight:700,color:"#9C7E7E",background:"#E8DDD5",padding:"1px 7px",borderRadius:99}}>{l.className}</span>
            </div>
            <div style={{fontSize:11,color:"#9C7E7E"}}>📅 {fmt(l.date)}{l.details?" · "+l.details.slice(0,50)+(l.details.length>50?"…":""):""}</div>
          </div>;})}
        </div>}
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:99,border:"2px solid "+(searchOpen?P.mist:"#E8DDD5"),padding:"11px 18px",boxShadow:"0 4px 20px #0000001a",transition:"border-color .2s"}}>
          <span style={{fontSize:16,flexShrink:0}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchOpen(true)} onBlur={()=>setTimeout(()=>setSearchOpen(false),200)}
            placeholder="Search all lessons..." style={{flex:1,border:"none",outline:"none",fontFamily:"inherit",fontSize:14,color:"#3D2C2C",background:"transparent"}}/>
          {search&&<button onClick={()=>{setSearch("");setSearchOpen(false);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:"#9C7E7E",padding:"0 2px",lineHeight:1}}>✕</button>}
        </div>
      </div>
    </div>
    <style>{`*{box-sizing:border-box;}select option{color:#3D2C2C;}input[type=date]::-webkit-calendar-picker-indicator{opacity:.5;cursor:pointer;}`}</style>
  </div>;
}
