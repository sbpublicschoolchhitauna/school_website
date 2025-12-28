SETUP GUIDE (SHORT)

1. Server:
- Go to push folder
- npm install
- node push-server.js

2. Replace VAPID keys in:
- push/push-server.js
- website/push-client.js

3. Website:
- Upload website folder files
- Add this line in index.html before </body>
  <script src="push-client.js"></script>

4. Admin Panel:
- Open: http://YOUR-SERVER:4000/admin.html
- Password: SBPSC@123

DONE ✅
