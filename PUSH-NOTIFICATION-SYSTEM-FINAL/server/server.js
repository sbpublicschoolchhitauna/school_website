
/* ================== SBPS FINAL PUSH + PAYMENT SYSTEM ================== */
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

/* ===== VAPID KEYS (PASTE YOURS) ===== */
const VAPID_PUBLIC_KEY  = "PASTE_PUBLIC_KEY";
const VAPID_PRIVATE_KEY = "PASTE_PRIVATE_KEY";

webpush.setVapidDetails(
  "mailto:admin@sbpublicschool.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

/* ===== DATA FILES ===== */
const DATA = path.join(__dirname,"data");
if(!fs.existsSync(DATA)) fs.mkdirSync(DATA);

const PAY_FILE = path.join(DATA,"payments.json");
const SUB_FILE = path.join(DATA,"adminSubs.json");

if(!fs.existsSync(PAY_FILE)) fs.writeFileSync(PAY_FILE,"[]");
if(!fs.existsSync(SUB_FILE)) fs.writeFileSync(SUB_FILE,"[]");

/* ===== STATIC ADMIN ===== */
app.use(express.static(__dirname + "/public"));
app.get("/",(req,res)=>res.sendFile(__dirname+"/public/admin.html"));

/* ===== LOGIN ===== */
app.post("/login",(req,res)=>{
  req.body.password===ADMIN_PASSWORD
    ? res.json({ok:true})
    : res.status(401).json({error:"wrong"});
});

/* ===== ADMIN PUSH SUBSCRIBE ===== */
app.post("/admin-subscribe",(req,res)=>{
  const subs = JSON.parse(fs.readFileSync(SUB_FILE));
  if(!subs.find(s=>s.endpoint===req.body.endpoint)){
    subs.push(req.body);
    fs.writeFileSync(SUB_FILE,JSON.stringify(subs,null,2));
  }
  res.json({ok:true});
});

/* ===== PAYMENT SAVE + ADMIN PUSH ===== */
app.post("/payment",(req,res)=>{
  const p = req.body;
  p.id = Date.now();
  p.time = new Date().toLocaleString("hi-IN");

  const all = JSON.parse(fs.readFileSync(PAY_FILE));
  all.unshift(p);
  fs.writeFileSync(PAY_FILE,JSON.stringify(all,null,2));

  // PUSH TO ADMIN
  const subs = JSON.parse(fs.readFileSync(SUB_FILE));
  subs.forEach(sub=>{
    webpush.sendNotification(sub, JSON.stringify({
      title:"💳 New Fee Payment",
      body:`${p.name} paid ₹${p.amount}`
    })).catch(()=>{});
  });

  res.json({ok:true, receiptId:p.id});
});

/* ===== LIST PAYMENTS ===== */
app.get("/payments",(req,res)=>{
  res.json(JSON.parse(fs.readFileSync(PAY_FILE)));
});

/* ===== STUDENT-WISE RECEIPTS ===== */
app.get("/student/:name",(req,res)=>{
  const all = JSON.parse(fs.readFileSync(PAY_FILE));
  res.json(all.filter(x=>x.name===req.params.name));
});

/* ===== PDF RECEIPT ===== */
app.get("/receipt/:id",(req,res)=>{
  const all = JSON.parse(fs.readFileSync(PAY_FILE));
  const p = all.find(x=>x.id==req.params.id);
  if(!p) return res.end();

  const doc = new PDFDocument();
  res.setHeader("Content-Type","application/pdf");
  doc.pipe(res);

  doc.fontSize(16).text("S.B. PUBLIC SCHOOL", {align:"center"});
  doc.moveDown();
  doc.fontSize(12).text(`Receipt No: ${p.id}`);
  doc.text(`Date: ${p.time}`);
  doc.moveDown();
  doc.text(`Student Name: ${p.name}`);
  doc.text(`Class: ${p.class}`);
  doc.text(`Amount Paid: ₹${p.amount}`);
  doc.text(`Payment Mode: ${p.mode}`);
  doc.moveDown();
  doc.text("Thank you for your payment.", {align:"center"});

  doc.end();
});

app.listen(PORT,()=>console.log("✅ SBPS FINAL SYSTEM LIVE ON",PORT));
