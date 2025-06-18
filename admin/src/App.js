import React, { useState, useEffect } from "react";
import SidebarAdmin from "./components/SidebarAdmin";
import LoginAdmin from "./components/LoginAdmin";
import LogTableAdmin from "./components/LogTableAdmin";
import StatCardAdmin from "./components/StatCardAdmin";
import { adminLogin, fetchAdminStats, fetchAdminLogs } from "./api";

export default function App() {
  const [token, setToken] = useState("");
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    if (token) {
      fetchAdminStats().then(setStats);
      fetchAdminLogs().then(setLogs);
    }
  }, [token]);
  if (!token) return <LoginAdmin onLogin={async (u,p) => {
    const res = await adminLogin(u,p);
    if(res.token) setToken(res.token);
    else alert("Đăng nhập thất bại!");
  }} />;
  return (
    <div className="admin-app" style={{display:'flex'}}>
      <SidebarAdmin />
      <main style={{flex:1,marginLeft:220,padding:32,minHeight:'100vh',background:'#f7f7fa'}}>
        <StatCardAdmin stats={stats} />
        <LogTableAdmin logs={logs} />
      </main>
    </div>
  );
}
