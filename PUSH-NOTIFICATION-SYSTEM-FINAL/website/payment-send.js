
async function sendPayment(data){
 const r = await fetch("https://sbps-push-server.onrender.com/payment",{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify(data)
 });
 const res = await r.json();
 alert("Payment Successful. Receipt ID: "+res.receiptId);
}
