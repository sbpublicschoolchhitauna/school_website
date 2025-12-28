if("serviceWorker"in navigator){
 navigator.serviceWorker.register("/school_website/sw.js")
 .then(()=>Notification.requestPermission())
 .then(p=>{if(p!=="granted")throw 0;return navigator.serviceWorker.ready;})
 .then(r=>r.pushManager.subscribe({
 userVisibleOnly:true,applicationServerKey:"PASTE_PUBLIC_KEY"
 }))
 .then(sub=>fetch("https://YOUR-SERVER:4000/subscribe",{
 method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({site:location.hostname,subscription:sub})
 }));
}
