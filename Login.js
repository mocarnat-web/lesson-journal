import { useState } from "react";
export default function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const handle = () => {
    if (pw === process.env.NEXT_PUBLIC_PASSWORD) {
      sessionStorage.setItem("lj_auth", "1");
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };
  return (
    <div style={{ minHeight:"100vh", background:"#FAF6F0", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"48px 40px", maxWidth:380, width:"100%", boxShadow:"0 8px 40px rgba(0,0,0,0.08)", textAlign:"center" }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:28, fontWeight:700, color:"#3D2C2C", marginBottom:8 }}>Lesson Journal</div>
        <div style={{ fontSize:14, color:"#9C7E7E", marginBottom:32 }}>Enter your password to continue</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}
          placeholder="Password"
          style={{ width:"100%", boxSizing:"border-box", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${error?"#ef4444":"#E8DDD5"}`, fontFamily:"inherit", fontSize:16, outline:"none", marginBottom:12, textAlign:"center", letterSpacing:4 }}
          autoFocus/>
        {error && <div style={{ color:"#ef4444", fontSize:13, marginBottom:8 }}>Incorrect password</div>}
        <button onClick={handle} style={{ width:"100%", padding:"12px", borderRadius:10, border:"none", background:"#6BAF8A", color:"#fff", fontFamily:"inherit", fontWeight:800, fontSize:16, cursor:"pointer" }}>
          Enter
        </button>
      </div>
    </div>
  );
}
