
self.addEventListener("push",e=>{
 const d=e.data.json();
 self.registration.showNotification(d.title,{body:d.body});
});
