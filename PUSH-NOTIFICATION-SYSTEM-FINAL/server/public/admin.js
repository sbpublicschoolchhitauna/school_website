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
  const r = await fetch("/notifications");
  const data = await r.json();

  notices.innerHTML = "";

  if(!data.table || data.table.rows.length === 0){
    notices.innerHTML = "❌ No notifications found";
    return;
  }

  data.table.rows.forEach(row=>{
    const msg = row.c[0]?.v;
    if(msg){
      const div = document.createElement("div");
      div.className = "notice-item";
      div.innerText = msg;
      notices.appendChild(div);
    }
  });
}
