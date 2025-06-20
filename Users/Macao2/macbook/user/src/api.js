// src/api.js (Cập nhật domain API sang https://api.mocki.io/v2/i5djdorq)

const API = "https://api.mocki.io/v2/i5djdorq";

export async function userLogin(username, password) {
  const res = await fetch(`${API}/login.php`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({username, password})
  });
  return await res.json();
}
export async function fetchUserStats() {
  const res = await fetch(`${API}/stats.php`);
  return await res.json();
}
export async function fetchUserLogs() {
  const res = await fetch(`${API}/logs.php`);
  return await res.json();
}
