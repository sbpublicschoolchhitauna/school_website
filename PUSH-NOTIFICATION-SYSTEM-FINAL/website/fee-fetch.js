
fetch("https://sbps-push-server.onrender.com/fee-data")
.then(r=>r.json()).then(d=>console.log(d));
