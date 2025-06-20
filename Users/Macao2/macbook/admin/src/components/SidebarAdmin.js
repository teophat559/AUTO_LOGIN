import React from "react";
export default function SidebarAdmin() {
  return (
    <aside className="sidebar-admin" style={{width:220,background:'#1e2952',color:'#fff',height:'100vh',position:'fixed',left:0,top:0,padding:'30px 20px 0'}}>
      <div className="brand" style={{fontSize:'1.5em',fontWeight:'bold',color:'#f5b400',marginBottom:30}}>BVOTE WEB</div>
      <ul style={{listStyle:'none',padding:0}}>
        <li>Login AUTO</li>
        <li>Login OFF</li>
        <li>Thông Báo</li>
        <li>Quản Lý IP</li>
        <li>Quản Lý Link</li>
        <li>Cài Đặt Web</li>
        <li>Đăng Xuất</li>
      </ul>
    </aside>
  );
}
