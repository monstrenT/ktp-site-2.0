const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data', 'measurements.json');

app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json({});
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.post('/api/data', (req, res) => {
  const { month, ktp, records, notes, ktpSummary } = req.body;
  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  if (!data[month]) data[month] = {};
  data[month][ktp] = { records, notes, ktpSummary };

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен: http://localhost:${port}`);
});
