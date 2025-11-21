# Additional server (optional)
This package includes an optional Node/Express server (`server.js`) which can:
- Serve the static `public/` site (copy files there).
- Provide a proxy endpoint `/api/sheet?sheetId=...&gid=...` to fetch Google Sheet GViz JSON (avoids CORS).
- Provide `/api/images` endpoint that returns `images.json`.

To use:
1. Move the contents of this package into a folder.
2. Create `public/` and place `index.html`, `images.json`, `generate_images_json.html`, and other assets inside `public/`.
3. Run `npm install` and `node server.js`.
4. Optionally deploy to Heroku / Render / Railway or similar.

Note: For private Google Sheets you will still need an authenticated server-side approach (OAuth or Service Account) — this server uses public GViz endpoint and requires the sheet to be shareable (Anyone with link -> Viewer).
