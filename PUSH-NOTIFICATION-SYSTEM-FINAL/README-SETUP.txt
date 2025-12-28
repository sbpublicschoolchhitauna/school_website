
================ SBPS FINAL SETUP =================

1) DELETE OLD SYSTEM COMPLETELY

2) Upload this folder to GitHub

3) Render Settings:
   Build: npm install web-push pdfkit
   Start: node server/server.js

4) Generate VAPID Keys:
   node
   const webpush=require("web-push");
   webpush.generateVAPIDKeys();

5) Paste keys in:
   - server/server.js
   - server/public/admin.js

6) Admin Panel:
   https://sbps-push-server.onrender.com
   Password: SBPSC@123

7) Website Payment:
   Include website/payment-send.js
   sendPayment({name,class,amount,mode})

==================================================
