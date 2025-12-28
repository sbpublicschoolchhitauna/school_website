// Push Server (Standalone)
const express = require("express");
const webpush = require("web-push");
const cors = require("cors");
const fs = require("fs");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const PORT = 4000;
const ADMIN_PASSWORD = "SBPSC@123";

const VAPID_PUBLIC_KEY  = "PASTE_PUBLIC_KEY";
const VAPID_PRIVATE_KEY = "PASTE_PRIVATE_KEY";

webpush.setVapidDetails("mailto:admin@sbpublicschool.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const SUB_FILE = __dirname + "/subscriptions.json";
const SCH_FILE = __dirname + "/schedule.json";

let SUBS = fs.existsSync(SUB_FILE) ? JSON.parse(fs.readFileSync(SUB_FILE)) : [];
let SCHEDULE = fs.existsSync(SCH_FILE) ? JSON.parse(fs.readFileSync(SCH_FILE)) : [];

app.post("/login",(req,res)=>{
  req.body.password===ADMIN_PASSWORD ? res.json({ok:true}) : res.status(401).end();
});

app.post("/subscribe",(req,res)=>{
  const {subscription,site}=req.body;
  if(subscription && subscription.endpoint){
    if(!SUBS.find(s=>s.subscription.endpoint===subscription.endpoint)){
      SUBS.push({subscription,site});
      fs.writeFileSync(SUB_FILE,JSON.stringify(SUBS,null,2));
    }
  }
  res.json({ok:true});
});

app.post("/schedule",(req,res)=>{
  req.body.id=Date.now(); req.body.sent=false;
  SCHEDULE.push(req.body);
  fs.writeFileSync(SCH_FILE,JSON.stringify(SCHEDULE,null,2));
  res.json({ok:true});
});

async function sendPush(d){
  const payload=JSON.stringify(d);
  for(const s of SUBS){
    if(d.site==="ALL"||s.site===d.site){
      try{await webpush.sendNotification(s.subscription,payload);}catch{}
    }
  }
}

cron.schedule("* * * * *",()=>{
  const now=Date.now();
  SCHEDULE.forEach(d=>{if(!d.sent&&d.time<=now){sendPush(d);d.sent=true;}});
  fs.writeFileSync(SCH_FILE,JSON.stringify(SCHEDULE,null,2));
});

app.listen(PORT,()=>console.log("Push Server running on 4000"));
