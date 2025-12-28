async function login(){
  const r = await fetch("/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({password:pw.value})
  });

  if(!r.ok){
    alert("Wrong password");
    return;
  }

  loginBox.style.display="none";
  dash.style.display="block";

  loadPayments();
  loadNotices();
}

/* =====================
   STUDENT / PAYMENT DATA
===================== */
async function loadPayments(){
  const r = await fetch("/payments");
  const data = await r.json();

  rows.innerHTML = "";

  if(data.length === 0){
    rows.innerHTML = `<tr><td colspan="5">No records found</td></tr>`;
    return;
  }

  data.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.time || ""}</td>
      <td>${p.name || ""}</td>
      <td>${p.class || ""}</td>
      <td>₹${p.amount || ""}</td>
      <td>
        <a href="/receipt/${p.id}" target="_blank">PDF</a>
      </td>
    `;
    rows.appendChild(tr);
  });
}

/* =====================
   GOOGLE SHEET NOTIFICATIONS
===================== */
async function loadNotices(){
  const r = await fetch("/api/Notification");
  const rows = await r.json();

  notices.innerHTML = "";

  if(!Array.isArray(rows) || rows.length === 0){
    notices.innerHTML = "❌ No notifications found";
    return;
  }

  rows.forEach(row=>{
    const colA = row.c[0]?.v || "";   // Column A
    const colB = row.c[1]?.v || "";   // Column B (MAIN MESSAGE)

    if(colA || colB){
      const div = document.createElement("div");
      div.className = "notice-item";
      div.innerHTML = `
        <strong>${colA}</strong><br>
        ${colB}
      `;
      notices.appendChild(div);
    }
  });
}
