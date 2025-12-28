
================= SBPS ALL-IN-ONE FINAL =================

1) DELETE OLD SYSTEM COMPLETELY

2) Upload this full folder to GitHub

3) Render Settings:
   Build: npm install node-fetch web-push pdfkit
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

7) Website:
   Include website/payment-send.js for payment
   Include website/fee-fetch.js for fee
   Include website/notifications-fetch.js for notices

=======================================================
