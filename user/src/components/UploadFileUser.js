import React, { useState } from "react";
export default function UploadFileUser() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMsg("Chưa chọn file!");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("https://your-backend.com/php-api/upload.php", {
      method: "POST",
      body: fd
    });
    const json = await res.json();
    if (json.success) setMsg("Tải lên thành công!");
    else setMsg("Tải lên thất bại!");
  };
  return (
    <form onSubmit={handleUpload} style={{margin:'30px 0',display:'flex',gap:12,alignItems:'center'}}>
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      <span>{msg}</span>
    </form>
  );
}
