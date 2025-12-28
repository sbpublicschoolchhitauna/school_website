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

  subscribeAdmin();
  loadFees();
  loadNotices();
}

/* ===== PUSH SUBSCRIBE ===== */
async function subscribeAdmin(){
  const reg = await navigator.serviceWorker.register("/sw.js");
  const perm = await Notification.requestPermission();
  if(perm!=="granted") return;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly:true,
    applicationServerKey:
      "BMEMHCd0QHTYQW3vgbwf3MeVCMn7pYZsjRVQi3nn1iADpzP32DqyKSp8qlxugYN9vuo0BTcWMaEDMSR4dQJ8IO8"
  });

  await fetch("/admin-subscribe",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(sub)
  });
}

/* ===== FEES ===== */
async function loadFees(){
  const r = await fetch("/api/fees");
  const rows = await r.json();
  feeRows.innerHTML="";

  rows.forEach(row=>{
    feeRows.innerHTML+=`
      <tr>
        <td>${row.c[1]?.v||""}</td>
        <td>${row.c[2]?.v||""}</td>
        <td>${row.c[3]?.v||""}</td>
      </tr>`;
  });
}

/* ===== NOTIFICATIONS ===== */
async function loadNotices(){
  const r = await fetch("/api/notifications");
  const rows = await r.json();
  notices.innerHTML="";

  rows.forEach(row=>{
    notices.innerHTML+=`
      <div class="notice-item">
        <strong>${row.c[1]?.v||""}</strong><br>
        <small>${row.c[0]?.v||""}</small>
      </div>`;
  });
}
