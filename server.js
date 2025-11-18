const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const APP_ROOT = path.resolve(__dirname);
const SLIDER_DIR = path.join(APP_ROOT, 'slider_images');
if (!fs.existsSync(SLIDER_DIR)) fs.mkdirSync(SLIDER_DIR, { recursive: true });

const upload = multer({ dest: path.join(APP_ROOT, 'tmp_uploads') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_this_token';

app.use('/', express.static(path.join(APP_ROOT, 'public')));
app.use('/slider_images', express.static(SLIDER_DIR, { index: false }));

app.get('/api/images', (req, res) => {
  fs.readdir(SLIDER_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'read dir error' });
    const imgs = files.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
    res.json({ images: imgs });
  });
});

function checkAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.body.adminToken || req.query.adminToken;
  if (token && token === ADMIN_TOKEN) return next();
  res.status(401).json({ error: 'Unauthorized. Provide x-admin-token header or adminToken param.' });
}

app.post('/api/upload', checkAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const original = req.file.originalname;
  const dest = path.join(SLIDER_DIR, original);
  let target = dest;
  if (fs.existsSync(dest)) {
    const ext = path.extname(original);
    const base = path.basename(original, ext);
    target = path.join(SLIDER_DIR, `${base}_${Date.now()}${ext}`);
  }
  fs.rename(req.file.path, target, err => {
    if (err) return res.status(500).json({ error: 'move failed' });
    res.json({ ok: true, filename: path.basename(target) });
  });
});

app.delete('/api/delete', checkAuth, (req, res) => {
  const name = req.body.name || req.query.name;
  if (!name) return res.status(400).json({ error: 'Provide name' });
  const fp = path.join(SLIDER_DIR, path.basename(name));
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'File not found' });
  fs.unlink(fp, err => {
    if (err) return res.status(500).json({ error: 'delete failed' });
    res.json({ ok: true });
  });
});

app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on', PORT, 'ADMIN_TOKEN=', ADMIN_TOKEN));
