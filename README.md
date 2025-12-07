# SB Public School — Final Website bundle (index + admin)

This ZIP contains:
1. `index_with_admin.html` — your website (the latest index.html you uploaded). Referenced file: fileciteturn1file0
2. `admin-auth-and-actions.js` — Google Apps Script (login + actions).
3. `README.md` — deployment instructions.

## Steps to finish and deploy

### 1) Update AUTH_URL in index
- Open `index_with_admin.html` and search for `AUTH_URL`.
- Replace its value with your deployed Apps Script Web App URL (after deploying step 2).

### 2) Deploy Apps Script (server)
- Go to https://script.google.com and create a new project.
- Paste the contents of `admin-auth-and-actions.js` into `Code.gs`.
- In Apps Script Editor -> Project Settings -> Script properties, add a new property:
  - Key: `ADMIN_PASSWORD`
  - Value: `SBPSC@9044` (or a stronger password)
- Deploy:
  - Click Deploy -> New deployment -> Select "Web app".
  - For "Execute as": select **Me (your account)**.
  - For "Who has access": choose **Anyone** or **Anyone with link**.
  - Click Deploy and authorize required scopes.
- Copy the Web App URL and update the `AUTH_URL` variable in your `index_with_admin.html`.

### 3) Host the website
- Upload `index_with_admin.html` to your web hosting (or GitHub Pages / Firebase Hosting / Netlify).
- Make sure the `AUTH_URL` in the HTML points to your deployed Apps Script URL.

### 4) Usage
- Teachers click **Admin Login** button on the site, enter password, receive a session token (stored in sessionStorage).
- They can use the Admin Panel (Mark Present, Open sheet, Logout).
- When calling markPresent or other actions, the client posts to the Apps Script endpoint with the token.

### 5) Security suggestions
- Do **not** hard-code the admin password in the frontend.
- Prefer storing password inside Script Properties and use Apps Script authentication as implemented.
- Consider using Google Sign-In or domain-restricted Apps Script access for stricter security.
