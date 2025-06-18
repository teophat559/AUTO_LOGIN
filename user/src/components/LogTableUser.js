import React from "react";
export default function LogTableUser({ logs }) {
  return (
    <table style={{width:'100%',background:'#fff',borderCollapse:'collapse',boxShadow:'0 2px 8px #0001'}}>
      <thead>
        <tr>
          <th>#</th>
          <th>Thời gian</th>
          <th>Vote</th>
          <th>Kết Quả</th>
        </tr>
      </thead>
      <tbody>
        {(logs||[]).map((log,i)=>(
          <tr key={i}>
            <td>{i+1}</td>
            <td>{log.time}</td>
            <td>{log.vote}</td>
            <td>{log.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
