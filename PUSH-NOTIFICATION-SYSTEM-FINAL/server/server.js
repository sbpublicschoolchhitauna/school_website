const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");
const webpush = require("web-push");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const ADMIN_PASSWORD = "SBPSC@123";

/* ===== GOOGLE SHEET IDS ===== */
const FEE_SHEET_ID = "1YZqeTdfu_SyXp4gRiZS3l3pwHAizuGnR-U-dwbUIkNE";
const NOTICE_SHEET_ID = "1BtoDja9imrMyHMKt5oqSYoOzj9w2GWe13JcbRu1vWO8";

/* ===== VAPID KEYS ===== */
const VAPID_PUBLIC_KEY =
"BMEMHCd0QHTYQW3vgbwf3MeVCMn7pYZsjRVQi3nn1iADpzP32DqyKSp8qlxugYN9vuo0BTcWMaEDMSR4dQJ8IO8";

const VAPID_PRIVATE_KEY =
"yl5vrsMLGO66RGK5B4wDR01vF9SMCcnz6TSRLIB_IjM";

webpush.setVapidDetails(
  "mailto:admin@sbpublicschool.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

/* ===== ADMIN PUSH SUBS ===== */
let adminSubs = [];

/* ===== ADMIN STATIC ===== */
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req,res)=>
  res.sendFile(path.join(__dirname,"public","admin.html"))
);

/* ===== LOGIN ===== */
app.post("/login",(req,res)=>{
  req.body.password===ADMIN_PASSWORD
    ? res.json({ok:true})
    : res.status(401).json({error:"wrong"});
});

/* ===== ADMIN SUBSCRIBE ===== */
app.post("/admin-subscribe",(req,res)=>{
  adminSubs.push(req.body);
  res.json({ok:true});
});

/* ===== FEES API ===== */
app.get("/api/fees", async (req,res)=>{
  const url=`https://docs.google.com/spreadsheets/d/${FEE_SHEET_ID}/gviz/tq?tqx=out:json`;
  const r=await fetch(url);
  const t=await r.text();
  const j=t.substring(t.indexOf("{"),t.lastIndexOf("}")+1);
  res.json(JSON.parse(j).table.rows);
});

/* ===== NOTIFICATIONS API + PUSH ===== */
app.get("/api/notifications", async (req,res)=>{
  const url=`https://docs.google.com/spreadsheets/d/${NOTICE_SHEET_ID}/gviz/tq?tqx=out:json`;
  const r=await fetch(url);
  const t=await r.text();
  const j=t.substring(t.indexOf("{"),t.lastIndexOf("}")+1);
  const rows = JSON.parse(j).table.rows;

  // PUSH latest notification
  if(rows.length){
    const last = rows[rows.length-1];
    const msg = last.c[1]?.v;
    if(msg){
      adminSubs.forEach(sub=>{
        webpush.sendNotification(
          sub,
          JSON.stringify({
            title:"📢 School Notification",
            body: msg
          })
        ).catch(()=>{});
      });
    }
  }

  res.json(rows);
});

app.listen(PORT,()=>console.log("✅ SBPS FINAL SYSTEM LIVE ON",PORT));
