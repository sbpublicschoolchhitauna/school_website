<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>SBPS Admin Dashboard</title>
<style>
body{font-family:Arial;padding:20px;background:#f4f7fb}
h2,h3{margin-top:20px;}
table{width:100%;border-collapse:collapse;margin-bottom:20px}
th,td{border:1px solid #ddd;padding:8px}
th{background:#0b5fa8;color:#fff}
.notice{background:#fff;padding:10px;margin-bottom:6px;border-left:4px solid #0b5fa8}
</style>
</head>
<body>

<h2>🔐 Admin Login</h2>
<div id="loginBox">
  <input id="pw" type="password" placeholder="Password">
  <button onclick="login()">Login</button>
</div>

<div id="dash" style="display:none">

  <h3>💳 Student Fee Records</h3>
  <table>
    <thead>
      <tr><th>Name</th><th>Class</th><th>Fee</th></tr>
    </thead>
    <tbody id="feeRows"></tbody>
  </table>

  <h3>📢 Notifications (Google Sheet)</h3>
  <div id="notices"></div>

</div>

<script src="admin.js"></script>

async function login(){
  const r = await fetch("/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({password:pw.value})
  });

  if(!r.ok){
    alert("Wrong password");
    return;
  }

  loginBox.style.display="none";
  dash.style.display="block";
  loadFees();
  loadNotices();
}

/* ===== Google Sheet ↔ Admin Fetch ===== */
async function loadFees(){
  const r = await fetch("/api/fees");
  const rows = await r.json();
  
  const feeRows = document.getElementById("feeRows");
  feeRows.innerHTML = "";

  if(!Array.isArray(rows) || rows.length === 0){
    feeRows.innerHTML = "<tr><td colspan='3'>No fee data found</td></tr>";
    return;
  }

  rows.forEach(row => {
    // Adjust columns based on your sheet structure
    const name = row.c[1]?.v || "";
    const cls  = row.c[2]?.v || "";
    const fee  = row.c[3]?.v || "";
    feeRows.innerHTML += `<tr><td>${name}</td><td>${cls}</td><td>${fee}</td></tr>`;
  });
}

async function loadNotices(){
  const r = await fetch("/api/notifications");
  const rows = await r.json();

  const notices = document.getElementById("notices");
  notices.innerHTML = "";

  if(!Array.isArray(rows) || rows.length === 0){
    notices.innerHTML = "No notifications found in sheet";
    return;
  }

  rows.forEach(row => {
    const msg = row.c[0]?.v;
    if(msg){
      const div = document.createElement("div");
      div.className = "notice";
      div.innerText = msg;
      notices.appendChild(div);
    }
  });
}

</body>
</html>
