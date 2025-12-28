
/* ===== SBPS ALL-IN-ONE FINAL SYSTEM ===== */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const webpush = require("web-push");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = "SBPSC@123";

/* ===== GOOGLE SHEETS ===== */
const FEE_SHEET_ID = "1YZqeTdfu_SyXp4gRiZS3l3pwHAizuGnR-U-dwbUIkNE";
const NOTICE_SHEET_ID = "1BtoDja9imrMyHMKt5oqSYoOzj9w2GWe13JcbRu1vWO8";

/* ===== VAPID KEYS (PASTE) ===== */
const VAPID_PUBLIC_KEY = "BMEMHCd0QHTYQW3vgbwf3MeVCMn7pYZsjRVQi3nn1iADpzP32DqyKSp8qlxugYN9vuo0BTcWMaEDMSR4dQJ8IO8";
const VAPID_PRIVATE_KEY = "yl5vrsMLGO66RGK5B4wDR01vF9SMCcnz6TSRLIB_IjM";

webpush.setVapidDetails(
  "mailto:admin@sbpublicschool.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

/* ===== DATA ===== */
const DATA = path.join(__dirname,"data");
if(!fs.existsSync(DATA)) fs.mkdirSync(DATA);

const PAY_FILE = path.join(DATA,"payments.json");
const ADMIN_SUBS = path.join(DATA,"adminSubs.json");

if(!fs.existsSync(PAY_FILE)) fs.writeFileSync(PAY_FILE,"[]");
if(!fs.existsSync(ADMIN_SUBS)) fs.writeFileSync(ADMIN_SUBS,"[]");

/* ===== STATIC ===== */
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
 const subs = JSON.parse(fs.readFileSync(ADMIN_SUBS));
 if(!subs.find(s=>s.endpoint===req.body.endpoint)){
  subs.push(req.body);
  fs.writeFileSync(ADMIN_SUBS,JSON.stringify(subs,null,2));
 }
 res.json({ok:true});
});

/* ===== FEE DATA (SHEET) ===== */
app.get("/fee-data", async (req,res)=>{
 const url=`https://docs.google.com/spreadsheets/d/${FEE_SHEET_ID}/gviz/tq?tqx=out:json`;
 const r=await fetch(url);
 const t=await r.text();
 const j=t.substring(t.indexOf("{"),t.lastIndexOf("}")+1);
 res.json(JSON.parse(j));
});

/* ===== NOTIFICATIONS (SHEET) ===== */
app.get("/notifications", async (req,res)=>{
 const url=`https://docs.google.com/spreadsheets/d/${NOTICE_SHEET_ID}/gviz/tq?tqx=out:json`;
 const r=await fetch(url);
 const t=await r.text();
 const j=t.substring(t.indexOf("{"),t.lastIndexOf("}")+1);
 res.json(JSON.parse(j));
});

/* ===== PAYMENT + PUSH ===== */
app.post("/payment",(req,res)=>{
 const p=req.body;
 p.id=Date.now();
 p.time=new Date().toLocaleString("hi-IN");

 const all=JSON.parse(fs.readFileSync(PAY_FILE));
 all.unshift(p);
 fs.writeFileSync(PAY_FILE,JSON.stringify(all,null,2));

 const subs=JSON.parse(fs.readFileSync(ADMIN_SUBS));
 subs.forEach(sub=>{
  webpush.sendNotification(sub,JSON.stringify({
   title:"💳 New Fee Payment",
   body:`${p.name} paid ₹${p.amount}`
  })).catch(()=>{});
 });

 res.json({ok:true,receiptId:p.id});
});

/* ===== PAYMENTS LIST ===== */
app.get("/payments",(req,res)=>{
 res.json(JSON.parse(fs.readFileSync(PAY_FILE)));
});

/* ===== PDF RECEIPT ===== */
app.get("/receipt/:id",(req,res)=>{
 const all=JSON.parse(fs.readFileSync(PAY_FILE));
 const p=all.find(x=>x.id==req.params.id);
 if(!p) return res.end();

 const doc=new PDFDocument();
 res.setHeader("Content-Type","application/pdf");
 doc.pipe(res);

 doc.fontSize(16).text("S.B. PUBLIC SCHOOL",{align:"center"});
 doc.moveDown();
 doc.text(`Receipt No: ${p.id}`);
 doc.text(`Date: ${p.time}`);
 doc.moveDown();
 doc.text(`Student: ${p.name}`);
 doc.text(`Class: ${p.class}`);
 doc.text(`Amount: ₹${p.amount}`);
 doc.text(`Mode: ${p.mode}`);
 doc.end();
});

app.listen(PORT,()=>console.log("SBPS ALL-IN-ONE SYSTEM LIVE",PORT));
