
fetch("https://sbps-push-server.onrender.com/notifications")
.then(r=>r.json()).then(d=>console.log(d));
