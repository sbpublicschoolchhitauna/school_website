
async function login(){
  const r = await fetch("/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({password:pw.value})
  });
  if(!r.ok) return alert("Wrong password");

  loginBox.style.display="none";
  dash.style.display="block";
  subscribeAdmin();
  loadPayments();
}

async function subscribeAdmin(){
  const reg = await navigator.serviceWorker.register("sw.js");
  const perm = await Notification.requestPermission();
  if(perm!=="granted") return;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly:true,
    applicationServerKey:"PASTE_PUBLIC_KEY"
  });

  await fetch("/admin-subscribe",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(sub)
  });
}

async function loadPayments(){
  const r = await fetch("/payments");
  const data = await r.json();
  const tb = document.querySelector("#payTable tbody");
  tb.innerHTML="";
  data.forEach(p=>{
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${p.time}</td><td>${p.name}</td><td>${p.class}</td>
      <td>₹${p.amount}</td>
      <td><a href="/receipt/${p.id}" target="_blank">PDF</a></td>`;
    tb.appendChild(tr);
  });
}
