// Minimal server proxy to fetch Google Sheets GViz JSON
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/sheet', async (req, res) => {
  const sheetId = req.query.sheetId;
  const gid = req.query.gid || '0';
  if(!sheetId) return res.status(400).json({ error: 'missing sheetId' });
  try {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?gid=${gid}&tqx=out:json`;
    const r = await fetch(url);
    const text = await r.text();
    // try to return parsed JSON wrapper
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const jsonStr = text.slice(start, end+1);
    const obj = JSON.parse(jsonStr);
    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fetch_failed', details: String(err) });
  }
});

app.listen(PORT, ()=> console.log('Server running on port', PORT));
