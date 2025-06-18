import React from "react";
export default function StatCardUser({ stats }) {
  return (
    <div className="stat-card-user" style={{background:'#fff',borderRadius:12,padding:20,marginBottom:25,boxShadow:'0 2px 8px #0001',display:'flex',gap:30}}>
      <div>
        <b>Thống Kê Cá Nhân</b>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          <li>Lượt Vote: <b style={{color:'#18e3a2'}}>{stats.votes || 0}</b></li>
          <li>Đã Thành Công: <b style={{color:'#18e3a2'}}>{stats.success || 0}</b></li>
          <li>Lỗi: <b style={{color:'#e34c43'}}>{stats.errors || 0}</b></li>
        </ul>
      </div>
    </div>
  );
}
