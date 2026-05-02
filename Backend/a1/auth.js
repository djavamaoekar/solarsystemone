const express = require('express');
const router = express.Router();
const fs = require('fs');

const USERS_FILE = './data/users.json';

// helper baca file
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// helper tulis file
function saveUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// SIGN UP
router.post('/signup', (req, res) => {
  const { nama, password } = req.body;

  const users = readUsers();

  if (users.find(u => u.nama === nama)) {
    return res.json({ message: 'User sudah ada' });
  }

  users.push({ nama, password });
  saveUsers(users);

  res.json({ message: 'Signup berhasil' });
});

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();

  const user = users.find(
    u => u.nama === username && u.password === password
  );

  if (!user) {
    return res.json({ message: 'Login gagal' });
  }

  res.json({ message: 'Login berhasil', user });
});

module.exports = router;