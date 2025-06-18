import React, { useState, useEffect } from "react";
import SidebarUser from "./components/SidebarUser";
import LoginUser from "./components/LoginUser";
import StatCardUser from "./components/StatCardUser";
import LogTableUser from "./components/LogTableUser";
import UploadFileUser from "./components/UploadFileUser";
import { userLogin, fetchUserStats, fetchUserLogs } from "./api";

export default function App() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    if (token) {
      fetchUserStats().then(setStats);
      fetchUserLogs().then(setLogs);
    }
  }, [token]);
  if (!token) return <LoginUser onLogin={async (u,p) => {
    const res = await userLogin(u,p);
    if(res.token) setToken(res.token);
    else alert("Đăng nhập thất bại!");
  }} />;
  return (
    <div className="user-app" style={{display:'flex'}}>
      <SidebarUser />
      <main style={{flex:1,marginLeft:220,padding:32,minHeight:'100vh',background:'#f7f7fa'}}>
        <StatCardUser stats={stats} />
        <UploadFileUser />
        <LogTableUser logs={logs} />
      </main>
    </div>
  );
}
