const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Получение данных
app.get('/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json','utf-8'));
  res.json(data);
});

// Сохранение данных
app.post('/data', (req, res) => {
  fs.writeFileSync('data.json', JSON.stringify(req.body, null, 2));
  res.send({status:'ok'});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
