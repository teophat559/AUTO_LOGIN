import React, { useState } from "react";
export default function LoginUser({ onLogin }) {
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  return (
    <form onSubmit={e=>{e.preventDefault(); onLogin(user,pw);}} style={{display:'flex',flexDirection:'column',alignItems:'center',marginTop:120}}>
      <h2>Đăng nhập User</h2>
      <input value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" style={{padding:8,margin:8}} />
      <input value={pw} type="password" onChange={e=>setPw(e.target.value)} placeholder="Password" style={{padding:8,margin:8}} />
      <button style={{padding:'8px 20px',marginTop:12,background:'#223d65',color:'#fff',border:'none',borderRadius:8}}>Login</button>
    </form>
  );
}
