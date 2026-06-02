console.log("SERVER FILE INI KEJALAN 🔥");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ===== DATABASE SEMENTARA =====
const users = [];
const reviews = []; // review global (sementara, hilang kalau server restart)

// ===== TEST =====
app.get("/", (req, res) => {
  res.send("INI BACKEND GUA 🔥");
});

// ===== SIGNUP =====
app.post("/signup", (req, res) => {
  const { nama, password } = req.body;

  const existingUser = users.find((u) => u.nama === nama);

  if (existingUser) {
    return res.status(400).json({ message: "User sudah ada" });
  }

  users.push({
    id: Date.now(),
    nama,
    password
  });

  res.json({ message: "Signup berhasil" });
});

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { nama, password } = req.body;

  const user = users.find((u) => u.nama === nama);

  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Password salah" });
  }

  res.json({
    message: "Login berhasil",
    user,
  });
});

// ===== EDIT PROFILE =====
app.put("/profile", (req, res) => {
  const { nama, newNama, domisili, bio } = req.body;

  const user = users.find((u) => u.nama === nama);
  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  if (newNama) user.nama = newNama;
  if (domisili !== undefined) user.domisili = domisili;
  if (bio !== undefined) user.bio = bio;

  res.json({
    message: "Profile updated",
    user,
  });
});

// ===== TAMBAH KOMENTAR (JADI REVIEW) =====
app.post("/comment", (req, res) => {
  const { userId, nama, rating, judul, komentar } = req.body;

  if (!nama || !rating || !judul || !komentar) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const newReview = {
    id: Date.now(),
    nama,
    rating,
    judul,
    komentar,
    tanggal: new Date(),
  };

  reviews.push(newReview);

  res.json({ message: "Komentar berhasil", review: newReview });
});

// ===== AMBIL SEMUA REVIEW =====
app.get("/reviews", (req, res) => {
  res.json(reviews);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.delete("/comment/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = reviews.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Komentar tidak ditemukan" });
  }

  reviews.splice(index, 1);

  res.json({ message: "Komentar dihapus" });
});

app.put("/comment/:id", (req, res) => {
  const id = Number(req.params.id);
  const { rating, judul, komentar } = req.body;

  const review = reviews.find(r => r.id === id);

  if (!review) {
    return res.status(404).json({ message: "Komentar tidak ditemukan" });
  }

  review.rating = rating;
  review.judul = judul;
  review.komentar = komentar;
  review.edited = true;

  res.json({
    message: "Komentar diupdate",
    review
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Server jalan di port ${PORT}`);
});