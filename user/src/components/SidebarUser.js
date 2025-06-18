import React from "react";
export default function SidebarUser() {
  return (
    <aside className="sidebar-user" style={{width:220,background:'#223d65',color:'#fff',height:'100vh',position:'fixed',left:0,top:0,padding:'30px 20px 0'}}>
      <div className="brand" style={{fontSize:'1.5em',fontWeight:'bold',color:'#18e3a2',marginBottom:30}}>USER WEB</div>
      <ul style={{listStyle:'none',padding:0}}>
        <li>Trang chủ</li>
        <li>Vote</li>
        <li>Lịch sử</li>
        <li>Đăng Xuất</li>
      </ul>
    </aside>
  );
}
