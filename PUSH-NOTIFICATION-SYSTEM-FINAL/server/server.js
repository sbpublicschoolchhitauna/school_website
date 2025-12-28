
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const webpush = require("web-push");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = "SBPSC@123";

// ===== VAPID (PASTE YOUR KEYS) =====
const VAPID_PUBLIC_KEY = "PASTE_PUBLIC_KEY";
const VAPID_PRIVATE_KEY = "PASTE_PRIVATE_KEY";

webpush.setVapidDetails(
  "mailto:admin@sbpublicschool.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// ===== DATA =====
const DATA = path.join(__dirname,"data");
if(!fs.existsSync(DATA)) fs.mkdirSync(DATA);

const PAY_FILE = path.join(DATA,"payments.json");
const SUB_FILE = path.join(DATA,"adminSubs.json");
if(!fs.existsSync(PAY_FILE)) fs.writeFileSync(PAY_FILE,"[]");
if(!fs.existsSync(SUB_FILE)) fs.writeFileSync(SUB_FILE,"[]");

app.use(express.static(__dirname+"/public"));
app.get("/",(r,s)=>s.sendFile(__dirname+"/public/admin.html"));

// ===== LOGIN =====
app.post("/login",(r,s)=>{
 r.body.password===ADMIN_PASSWORD ? s.json({ok:true}) : s.status(401).end();
});

// ===== ADMIN SUBSCRIBE =====
app.post("/admin-subscribe",(r,s)=>{
 const all = JSON.parse(fs.readFileSync(SUB_FILE));
 if(!all.find(x=>x.endpoint===r.body.endpoint)){
  all.push(r.body);
  fs.writeFileSync(SUB_FILE,JSON.stringify(all,null,2));
 }
 s.json({ok:true});
});

// ===== PAYMENT + PUSH =====
app.post("/payment",(r,s)=>{
 const p = r.body;
 p.id = Date.now();
 p.time = new Date().toLocaleString("hi-IN");
 const all = JSON.parse(fs.readFileSync(PAY_FILE));
 all.unshift(p);
 fs.writeFileSync(PAY_FILE,JSON.stringify(all,null,2));

 // PUSH TO ADMIN
 const subs = JSON.parse(fs.readFileSync(SUB_FILE));
 subs.forEach(sub=>{
  webpush.sendNotification(sub,JSON.stringify({
   title:"New Fee Payment",
   body:`${p.name} paid ₹${p.amount}`
  })).catch(()=>{});
 });

 s.json({ok:true,receiptId:p.id});
});

// ===== LIST =====
app.get("/payments",(r,s)=>s.json(JSON.parse(fs.readFileSync(PAY_FILE))));

// ===== STUDENT RECEIPTS =====
app.get("/student/:name",(r,s)=>{
 const all = JSON.parse(fs.readFileSync(PAY_FILE));
 s.json(all.filter(x=>x.name===r.params.name));
});

// ===== SINGLE RECEIPT PDF =====
app.get("/receipt/:id",(r,s)=>{
 const all = JSON.parse(fs.readFileSync(PAY_FILE));
 const p = all.find(x=>x.id==r.params.id);
 if(!p) return s.end();

 const doc = new PDFDocument();
 s.setHeader("Content-Type","application/pdf");
 doc.pipe(s);

 doc.fontSize(16).text("S.B. PUBLIC SCHOOL", {align:"center"});
 doc.moveDown();
 doc.fontSize(12).text(`Receipt No: ${p.id}`);
 doc.text(`Date: ${p.time}`);
 doc.moveDown();
 doc.text(`Student: ${p.name}`);
 doc.text(`Class: ${p.class}`);
 doc.text(`Amount: ₹${p.amount}`);
 doc.text(`Mode: ${p.mode}`);
 doc.end();
});

app.listen(PORT,()=>console.log("FINAL SYSTEM LIVE",PORT));
