const express = require('express');
const router = express.Router();
const fs = require('fs');

const FILE = './data/reviews.json';

function read() {
  return JSON.parse(fs.readFileSync(FILE));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// POST review
router.post('/', (req, res) => {
  const { nama, rating, judul, komentar } = req.body;

  const data = read();

  data.push({
    nama,
    rating,
    judul,
    komentar,
    tanggal: new Date()
  });

  save(data);

  res.json({ message: 'Review ditambah' });
});

// GET semua review
router.get('/', (req, res) => {
  res.json(read());
});

module.exports = router;