
async function login(){
 const r=await fetch("/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pw.value})});
 if(!r.ok) return alert("Wrong password");
 document.getElementById("dash").style.display="block";
 subscribeAdmin();
 load();
}

async function subscribeAdmin(){
 const reg = await navigator.serviceWorker.register("sw.js");
 const perm = await Notification.requestPermission();
 if(perm!=="granted") return;
 const sub = await reg.pushManager.subscribe({
  userVisibleOnly:true,
  applicationServerKey:"PASTE_PUBLIC_KEY"
 });
 await fetch("/admin-subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(sub)});
}

async function load(){
 const r=await fetch("/payments");
 const data=await r.json();
 const tb=document.getElementById("rows");
 tb.innerHTML="";
 data.forEach(p=>{
  tb.innerHTML+=`<tr>
  <td>${p.time}</td><td>${p.name}</td><td>${p.class}</td>
  <td>₹${p.amount}</td>
  <td><a href="/receipt/${p.id}" target="_blank">PDF</a></td></tr>`;
 });
}
