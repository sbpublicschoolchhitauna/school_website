// Simple Express server to serve static site and provide optional API proxy endpoints.
// To run:
// 1) npm install
// 2) node server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Basic endpoint proxy for Google Sheets (avoid CORS and allow private sheets using server credentials if desired)
app.get('/api/sheet', async (req, res) => {
  const sheetId = req.query.sheetId;
  const gid = req.query.gid || '0';
  if(!sheetId) return res.status(400).json({ error: 'missing sheetId' });
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${gid}&tqx=out:json`;
    const r = await fetch(url);
    const text = await r.text();
    // return raw gviz response
    res.setHeader('content-type', 'application/json');
    res.send(text.replace(/^[^{]*/,'').replace(/\);\s*$/,''));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fetch_failed', details: String(err) });
  }
});

// optional images list endpoint (reads images.json from public)
app.get('/api/images', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'images.json'));
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
