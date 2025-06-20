import React from "react";
export default function StatCardAdmin({ stats }) {
  return (
    <div className="stat-card-admin" style={{background:'#fff',borderRadius:12,padding:20,marginBottom:25,boxShadow:'0 2px 8px #0001',display:'flex',gap:30}}>
      <div>
        <b>Kết Quả 24h</b>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          <li>Phê Duyệt: <b style={{color:'#16a34a'}}>{stats.pheduyet || 0}</b></li>
          <li>Duyệt Code: <b style={{color:'#16a34a'}}>{stats.duyetcode || 0}</b></li>
          <li>Lỗi Captcha: <b style={{color:'#16a34a'}}>{stats.captcha || 0}</b></li>
          <li>Sai Mật Khẩu: <b style={{color:'#16a34a'}}>{stats.saimk || 0}</b></li>
          <li>Thành Công: <b style={{color:'#16a34a'}}>{stats.thanhcong || 0}</b></li>
        </ul>
      </div>
    </div>
  );
}
