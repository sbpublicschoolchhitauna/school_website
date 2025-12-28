self.addEventListener("push",e=>{
 const d=e.data.json();
 self.registration.showNotification(d.title,{
 body:d.body,image:d.image,icon:"/school_website/logo.jpg",
 data:{url:d.url}
 });
});
self.addEventListener("notificationclick",e=>{
 e.notification.close();
 e.waitUntil(clients.openWindow(e.notification.data.url));
});
