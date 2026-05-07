import * as THREE from "https://cdn.skypack.dev/three@0.136.0"
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls"

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// scene, camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);

// renderer
const renderer = new THREE.WebGLRenderer({
  // setting the canvas
  canvas: document.querySelector('#canvas'),
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);

// full screen
renderer.setSize(window.innerWidth, window.innerHeight);

// orbit controls & grid

// Fungsi membuka modal
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

// Fungsi menutup modal
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Pasang event listener ke tombol-tombol pemicu
document.querySelectorAll('[data-modal-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-modal-target');
    const user = JSON.parse(localStorage.getItem("user"));

    if ((targetId === "commentModal" || targetId === "reviewModal") && !user) {
      alert("Daftar / login dulu bro");
      return;
    }

    openModal(targetId);
  });
});

// Tambahkan tombol X pada tiap modal
document.querySelectorAll('.modal .close').forEach(span => {
  span.addEventListener('click', () => {
    const modal = span.closest('.modal');
    if (modal) modal.classList.remove('active');
  });
});

// Tutup modal saat klik di luar konten
window.addEventListener('click', (event) => {
  document.querySelectorAll('.modal').forEach(modal => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  });
});

const planetOverlay = document.querySelector("[data-planet-overlay]");
const planetCloseButton = document.querySelector("[data-planet-close]");
const planetTitle = document.querySelector("[data-planet-title]");
const planetSubtitle = document.querySelector("[data-planet-subtitle]");
const planetContent = document.querySelector("[data-planet-content]");
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(400, 500, 0xff0000, 0x7ea689);
controls.maxDistance = 2000;
controls.panSpeed = 1.1;
controls.rotateSpeed = 0.9;
controls.autoRotateSpeed = 0.75;

camera.position.set(0, 40, 85);
controls.target.set(0, 0, 0);

document.querySelector('[data-auto-rotate]').addEventListener('change', function () {
  if (this.checked) {
      controls.autoRotate = true;
      controls.enablePan = false;
      controls.target.set(0, 0, 0);
  } else {
      controls.enablePan = true;
      controls.autoRotate = false;
  }
});

controls.enableDamping = true;
document.querySelector('[data-camera-damping]').addEventListener('change', function () {
  if (this.checked) {
      controls.enableDamping = true;
  } else {
      controls.enableDamping = false;
  }
});

document.querySelector('[data-camera-reset]').addEventListener('click', function () {
  camera.position.set(0, 40, 85);
  controls.target.set(0, 0, 0);
});

controls.addEventListener('end', function () {
  sessionStorage.setItem('camPosX', camera.position.x);
  sessionStorage.setItem('camPosY', camera.position.y);
  sessionStorage.setItem('camPosZ', camera.position.z);
});

function changeSkybox(name) {
  scene.background = new THREE.CubeTextureLoader().setPath(`./skyboxes/${name}/`).load(['ft.png', 'bk.png', 'up.png', 'dn.png', 'rt.png', 'lf.png']);
}
changeSkybox('nebula');

document.querySelector('[data-skybox]').onchange = (e) => {
  if (e.target.value === 'none') return (scene.background = null);
  changeSkybox(e.target.value);
};

const ambientLight = new THREE.AmbientLight(0xffffff, 0.185);
ambientLight.position.set(0, 0, 0);

const mainPointLight = new THREE.PointLight(0xffffff, 2.1, 0, 2);
mainPointLight.position.set(0, 0, 0);

const arrowDir = new THREE.Vector3(1, 0, 0).normalize();
const arrowOrigin = new THREE.Vector3(0, 0, 0);

const mercuryAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0xff0000); //red
const venusAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0xff8c00); //orange
const earthAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0xffff00); //yellow
const moonAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0xffffff); //moon white
const marsAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0x00ff00); //green
const jupiterAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0x0000ff); //light blue
const saturnAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0x1100ff); //dark blue
const uranusAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0xf700ff); //pink
const neptuneAnker = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1, 0x9000ff); //purple

const mercuryTorusGeometry = new THREE.TorusGeometry(24, 0.1, 10, 150);
window.mercuryTorusMaterial = new THREE.MeshBasicMaterial();
const mercuryTorus = new THREE.Mesh(mercuryTorusGeometry, window.mercuryTorusMaterial);
mercuryTorus.rotation.x = Math.PI / 2;

const venusTorusGeometry = new THREE.TorusGeometry(40, 0.1, 10, 150);
window.venusTorusMaterial = new THREE.MeshBasicMaterial();
const venusTorus = new THREE.Mesh(venusTorusGeometry, window.venusTorusMaterial);
venusTorus.rotation.x = Math.PI / 2;

const earthTorusGeometry = new THREE.TorusGeometry(56, 0.1, 10, 200);
window.earthTorusMaterial = new THREE.MeshBasicMaterial();
const earthTorus = new THREE.Mesh(earthTorusGeometry, window.earthTorusMaterial);
earthTorus.rotation.x = Math.PI / 2;
const moonTorusGeometry = new THREE.TorusGeometry(9, 0.1, 10, 100);
window.moonTorusMaterial = new THREE.MeshBasicMaterial();
const moonTorus = new THREE.Mesh(moonTorusGeometry, window.moonTorusMaterial);
moonTorus.rotation.x = Math.PI / 2;

const marsTorusGeometry = new THREE.TorusGeometry(72, 0.1, 10, 200);
window.marsTorusMaterial = new THREE.MeshBasicMaterial();
const marsTorus = new THREE.Mesh(marsTorusGeometry, window.marsTorusMaterial);
marsTorus.rotation.x = Math.PI / 2;

const jupiterTorusGeometry = new THREE.TorusGeometry(88, 0.1, 10, 200);
window.jupiterTorusMaterial = new THREE.MeshBasicMaterial();
const jupiterTorus = new THREE.Mesh(jupiterTorusGeometry, window.jupiterTorusMaterial);
jupiterTorus.rotation.x = Math.PI / 2;

const saturnTorusGeometry = new THREE.TorusGeometry(104, 0.1, 10, 200);
window.saturnTorusMaterial = new THREE.MeshBasicMaterial();
const saturnTorus = new THREE.Mesh(saturnTorusGeometry, window.saturnTorusMaterial);
saturnTorus.rotation.x = Math.PI / 2;

const uranusTorusGeometry = new THREE.TorusGeometry(120, 0.1, 10, 250);
window.uranusTorusMaterial = new THREE.MeshBasicMaterial();
const uranusTorus = new THREE.Mesh(uranusTorusGeometry, window.uranusTorusMaterial);
uranusTorus.rotation.x = Math.PI / 2;

const neptuneTorusGeometry = new THREE.TorusGeometry(136, 0.1, 10, 250);
window.neptuneTorusMaterial = new THREE.MeshBasicMaterial();
const neptuneTorus = new THREE.Mesh(neptuneTorusGeometry, window.neptuneTorusMaterial);
neptuneTorus.rotation.x = Math.PI / 2;

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 70000;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const r = 20000 + Math.random() * 30000; // OORT JAUH BANGET
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos((Math.random() * 2) - 1);

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  posArray[i * 3] = x;
  posArray[i * 3 + 1] = y;
  posArray[i * 3 + 2] = z;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    transparent: true,
    map: new THREE.TextureLoader().load('./textures/star.png'),
    blending: THREE.AdditiveBlending,
    size: 0.005
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

const geometry = new THREE.SphereGeometry(2, 4, 4);
const material = new THREE.MeshNormalMaterial(); // pretty colours

const addStar = () => {
  let star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(10000));

  star.position.set(x, y, z);
  scene.add(star);
};
Array(7500).fill().forEach(addStar);

// Sun
const sunTexture = new THREE.TextureLoader().load('./textures/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(8, 64, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);

// Mercury
const mercuryTexture = new THREE.TextureLoader().load('./textures/mercury.jpg');
const mercuryGeometry = new THREE.SphereGeometry(2.5, 128, 128);
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
mercury.position.set(0, 24, 0);
mercury.rotateZ(Math.PI / 2);

// Venus
const venusTexture = new THREE.TextureLoader().load('./textures/venus.jpg');
const venusGeometry = new THREE.SphereGeometry(3, 128, 128);
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
venus.position.set(0, 40, 0);
venus.rotateZ(Math.PI / 2);

// Earth
const earthTexture = new THREE.TextureLoader().load('./textures/earth.jpg');
const earthBump = new THREE.TextureLoader().load('./textures/earth-normalmap.jpg');
const earthGeometry = new THREE.SphereGeometry(4, 128, 128);
const earthMaterial = new THREE.MeshPhongMaterial({
  specular: 0x333333,
  shininess: 5,
  map: earthTexture,
  specularMap: new THREE.TextureLoader().load('./textures/earth-specular.jpg'),
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, 56, 0);
earth.rotateZ(Math.PI / 2);

// Moon
const moonTexture = new THREE.TextureLoader().load('./textures/moon.jpg');
const moonGeometry = new THREE.SphereGeometry(1.5, 128, 128);
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(0, 9, 0);
moon.rotateZ(Math.PI / 2);

// Mars
const marsTexture = new THREE.TextureLoader().load('./textures/mars.jpg');
const marsGeometry = new THREE.SphereGeometry(3, 128, 128);
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(0, 72, 0);
mars.rotateZ(Math.PI / 2);

// Jupiter
const jupiterTexture = new THREE.TextureLoader().load('./textures/jupiter.jpg');
const jupiterGeometry = new THREE.SphereGeometry(6, 128, 128);
const jupiterMaterial = new THREE.MeshStandardMaterial({
  map: jupiterTexture,
});
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
jupiter.position.set(0, 88, 0);
jupiter.rotateZ(Math.PI / 2);

// Saturn
const saturnTexture = new THREE.TextureLoader().load('./textures/saturn.jpg');
const saturnGeometry = new THREE.SphereGeometry(5, 128, 128);
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture
});
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
saturn.position.set(0, 104, 0);
saturn.rotateZ(Math.PI / 2 + 0.3);
saturn.rotateX(0.1);

const saturnRingTexture = new THREE.TextureLoader().load('./textures/saturn-ring.jpg');
const saturnRingGeometry = new THREE.RingGeometry(9.5, 6.5, 32);
const saturnRingMaterial = new THREE.MeshStandardMaterial({
  map: saturnRingTexture,
  transparent: true,
  alphaMap: new THREE.TextureLoader().load('./textures/saturn-ring-alpha.gif'),
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturn.add(saturnRing);
saturnRing.rotateX(Math.PI / 2);

// Uranus
const uranusTexture = new THREE.TextureLoader().load('./textures/uranus.jpg');
const uranusGeometry = new THREE.SphereGeometry(3.5, 128, 128);
const uranusMaterial = new THREE.MeshStandardMaterial({
  map: uranusTexture,
});
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
uranus.position.set(0, 120, 0);
uranus.rotateZ(Math.PI / 2);

// Neptune
const neptuneTexture = new THREE.TextureLoader().load('./textures/neptune.jpg');
const neptuneGeometry = new THREE.SphereGeometry(3.5, 128, 128);
const neptuneMaterial = new THREE.MeshStandardMaterial({
  map: neptuneTexture,
});
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
neptune.position.set(0, 136, 0);
neptune.rotateZ(Math.PI / 2);

const planetData = {

  welcome: {
  title: "Selamat datang di Tata surya",
  subtitle: "Klik X untuk mulai, baca deskripsi untuk pengetahuan lebih",
  html: `
    <p>Tata surya adalah sistem kosmik yang terikat gravitasi Matahari sebagai pusat massa dan energi, yang terdiri dari empat planet berbatu di bagian dalam serta raksasa gas dan es di wilayah luar setelah Sabuk Asteroid. Di luar orbit Neptunus, terdapat Sabuk Kuiper yang berisi objek es purba, sementara gravitasi Matahari membentang hingga Awan Oort yang menjadi batas akhir sistem sebelum memasuki ruang antarbintang. Seluruh struktur megah ini menunjukkan skala semesta yang luas, di mana planet-planet hanyalah titik kecil di bawah perlindungan satu bintang tunggal. info dari nasa.gov dan esa.int.
</p>
  `,
},

  mercury: {
    title: "Merkurius",
    subtitle: "Planet terdekat dari Matahari",
    html: `
      <img class="planet-image" src="./SpacePictures/Mercury.jpg" alt="Merkurius" />
      <p>Merkurius adalah planet terkecil di tata surya kita dan yang paling dekat dengan Matahari. Karena jaraknya yang sangat dekat, planet ini menjadi dunia ekstrem dengan perbedaan suhu yang sangat mencolok.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Planet batuan subferria panas tanpa udara.</li>
        <li>Kehidupan: Tidak ada.</li>
        <li>Diameter: 4880,00 km (0,38 De).</li>
        <li>Massa: 0,055 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,596.</li>
        <li>Sumbu semimajor: 0,39 AU.</li>
        <li>Periode orbit: 87,97 hari.</li>
        <li>Periode rotasi: 58,65 hari.</li>
        <li>Hari surya: 175,94 hari.</li>
        <li>Kemiringan sumbu: 0,034 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 0,38 g.</li>
        <li>Komposisi permukaan: Silikat dan logam.</li>
        <li>Komposisi atmosfer: Eksosfer tipis (Oksigen, Natrium, Hidrogen).</li>
        <li>Tekanan atmosfer: 0 atm (Hampir vakum).</li>
        <li>Efek rumah kaca: 0 derajat C.</li>
        <li>Jumlah bulan: 0.</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Permukaan Merkurius sangat mirip dengan Bulan, dipenuhi oleh kawah-kawah akibat hantaman asteroid. Planet ini tidak memiliki atmosfer yang tebal untuk menahan panas, sehingga suhunya bisa melonjak drastis saat siang dan membeku saat malam.</p>

      <h3>Keunikan</h3>
      <p>Meskipun paling dekat dengan Matahari, Merkurius bukanlah planet terpanas (gelar itu milik Venus). Keunikan lainnya adalah rotasinya yang sangat lambat, di mana satu hari surya di sana jauh lebih lama daripada waktu yang ia butuhkan untuk mengelilingi Matahari.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  venus: {
    title: "Venus",
    subtitle: "Planet terpanas di tata surya",
    html: `
      <img class="planet-image" src="./SpacePictures/Venus.jpg" alt="Venus" />
      <p>Venus sering disebut sebagai planet kembaran Bumi karena ukuran dan massanya yang serupa, namun kondisi permukaannya sangat kontras dan mematikan akibat efek rumah kaca yang ekstrem.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Planet terestrial panas dengan atmosfer sangat tebal.</li>
        <li>Kehidupan: Tidak ada.</li>
        <li>Diameter: 12103,60 km (0,95 De).</li>
        <li>Massa: 0,815 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,444.</li>
        <li>Sumbu semimajor: 0,72 AU.</li>
        <li>Periode orbit: 224,70 hari.</li>
        <li>Periode rotasi: 243,02 hari (Retrograde).</li>
        <li>Hari surya: 116,75 hari.</li>
        <li>Kemiringan sumbu: 177,36 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 0,90 g.</li>
        <li>Komposisi permukaan: Batuan basaltik dan dataran vulkanik.</li>
        <li>Komposisi atmosfer: Karbondioksida (CO2), Nitrogen (N2).</li>
        <li>Tekanan atmosfer: 92 atm.</li>
        <li>Efek rumah kaca: 462 derajat C.</li>
        <li>Jumlah bulan: 0.</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Venus memiliki atmosfer yang sangat padat dan beracun, didominasi oleh karbon dioksida dengan awan asam sulfat. Tekanan di permukaannya setara dengan tekanan di bawah laut sedalam 900 meter di Bumi.</p>

      <h3>Keunikan</h3>
      <p>Venus adalah planet terpanas di tata surya meskipun bukan yang terdekat dengan Matahari. Selain itu, Venus berputar pada porosnya dengan arah yang berlawanan (retrograde) dari kebanyakan planet lain, sehingga Matahari terbit dari barat di sana.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  earth: {
    title: "Bumi",
    subtitle: "Planet kehidupan",
    html: `
      <img class="planet-image" src="./SpacePictures/Earth.jpg" alt="Bumi" />
      <p>Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan. Kombinasi atmosfer, air, dan suhu membuatnya unik.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Planet daratan laut beriklim sedang dengan kehidupan.</li>
        <li>Kehidupan: Organik multiseluler (laut, darat).</li>
        <li>Diameter: 12742,02 km (1 De).</li>
        <li>Massa: 1 Me.</li>
        <li>Indeks Kemiripan Bumi: 1.000.</li>
        <li>Sumbu semimajor: 1.00 AU.</li>
        <li>Periode orbit: 1.000 tahun.</li>
        <li>Periode rotasi: 23 jam 56 menit 04 detik.</li>
        <li>Hari surya: 23 jam 59 menit 59 detik.</li>
        <li>Kemiringan sumbu: 23 derajat 26 menit 30 detik.</li>
        <li>Usia: 4,540 miliar tahun.</li>
        <li>Gravitasi: 1 g.</li>
        <li>Komposisi laut: H2O, NaCl.</li>
        <li>Komposisi atmosfer: N2, O2, Ar.</li>
        <li>Tekanan atmosfer: 1 atm (0,995 atm).</li>
        <li>Efek rumah kaca: 33 derajat C.</li>
        <li>Jumlah bulan: 1.</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Sekitar 70% permukaan Bumi tertutup oleh air. Atmosfernya yang kaya nitrogen dan oksigen berfungsi melindungi permukaan dari radiasi berbahaya serta menjaga stabilitas suhu planet.</p>

      <h3>Keunikan</h3>
      <p>Bumi memiliki keberadaan air dalam bentuk cair di permukaan secara permanen dan medan magnet kuat yang melindungi atmosfer dari sapuan angin matahari.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  moon: {
    title: "Bulan",
    subtitle: "Satelit alami Bumi",
    html: `
      <img class="planet-image" src="./SpacePictures/Moon.jpg" alt="Bulan" />
      <p>Bulan adalah satu-satunya satelit alami Bumi dan merupakan benda langit paling terang kedua di langit setelah Matahari. Kehadirannya sangat stabil dan mempengaruhi pasang surut air laut di Bumi.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Satelit berbatu (Selena).</li>
        <li>Kehidupan: Tidak ada.</li>
        <li>Diameter: 3474,80 km (0,27 De).</li>
        <li>Massa: 0,012 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,338.</li>
        <li>Sumbu semimajor: 384.400 km (jarak dari Bumi).</li>
        <li>Periode orbit: 27,32 hari.</li>
        <li>Periode rotasi: 27,32 hari (Rotasi sinkron).</li>
        <li>Hari surya: 29,53 hari.</li>
        <li>Kemiringan sumbu: 6,68 derajat.</li>
        <li>Usia: 4,510 miliar tahun.</li>
        <li>Gravitasi: 0,16 g.</li>
        <li>Komposisi permukaan: Regolit (debu batuan), Basalt.</li>
        <li>Komposisi atmosfer: Eksosfer sangat tipis (Helium, Neon).</li>
        <li>Tekanan atmosfer: 0 atm (Hampir vakum).</li>
        <li>Efek rumah kaca: 0 derajat C.</li>
        <li>Jumlah bulan: 0 (Bulan adalah satelit itu sendiri).</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Permukaan Bulan ditandai oleh dataran gelap luas yang disebut 'Maria' dan dataran tinggi yang penuh kawah. Karena hampir tidak memiliki atmosfer, suhu di Bulan bisa mencapai 127 derajat C saat siang dan turun drastis hingga -173 derajat C saat malam.</p>

      <h3>Keunikan</h3>
      <p>Bulan mengalami penguncian gravitasi (tidal locking) dengan Bumi, sehingga sisi yang sama selalu menghadap ke arah kita. Bulan juga merupakan satu-satunya benda langit selain Bumi yang pernah dikunjungi dan diinjak langsung oleh manusia.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  mars: {
    title: "Mars",
    subtitle: "Planet merah",
    html: `
      <img class="planet-image" src="./SpacePictures/Mars.jpg" alt="Mars" />
      <p>Mars adalah planet keempat dari Matahari dan sering menjadi target utama eksplorasi ruang angkasa karena kemiripannya dengan kondisi awal Bumi. Lingkungannya kering, dingin, dan dipenuhi debu besi oksida yang memberikan warna merah khas.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Planet terestrial dingin (Desert world).</li>
        <li>Kehidupan: Sedang dalam penelitian (kemungkinan mikroba masa lalu).</li>
        <li>Diameter: 6779,00 km (0,53 De).</li>
        <li>Massa: 0,107 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,700.</li>
        <li>Sumbu semimajor: 1,52 AU.</li>
        <li>Periode orbit: 1,881 tahun.</li>
        <li>Periode rotasi: 24 jam 37 menit 22 detik.</li>
        <li>Hari surya: 24 jam 39 menit 35 detik.</li>
        <li>Kemiringan sumbu: 25,19 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 0,38 g.</li>
        <li>Komposisi permukaan: Besi oksida, silikat, basal.</li>
        <li>Komposisi atmosfer: Karbondioksida (CO2), Nitrogen (N2), Argon (Ar).</li>
        <li>Tekanan atmosfer: 0,006 atm (Sangat tipis).</li>
        <li>Efek rumah kaca: 5 derajat C.</li>
        <li>Jumlah bulan: 2 (Phobos dan Deimos).</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Mars memiliki bentang alam yang ekstrem, mulai dari gunung berapi terbesar hingga lembah terdalam di tata surya. Atmosfernya sangat tipis, sehingga tidak mampu menahan panas matahari dengan baik, menyebabkan suhu rata-rata yang sangat dingin.</p>

      <h3>Keunikan</h3>
      <p>Mars memiliki Gunung Olympus (Olympus Mons), gunung berapi tertinggi di tata surya yang tingginya tiga kali lipat Gunung Everest. Selain itu, Mars adalah satu-satunya planet yang seluruhnya dihuni oleh robot (rover dan lander) kiriman manusia.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  jupiter: {
    title: "Jupiter",
    subtitle: "Planet terbesar",
    html: `
      <img class="planet-image" src="./SpacePictures/Jupiter.jpg" alt="Jupiter" />
      <p>Jupiter adalah planet terbesar di tata surya dengan massa dua kali lipat dari gabungan seluruh planet lainnya. Sebagai raksasa gas, Jupiter tidak memiliki permukaan padat yang jelas dan didominasi oleh badai raksasa.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Raksasa gas (Gas Giant).</li>
        <li>Kehidupan: Tidak ada (kondisi ekstrem dan tekanan tinggi).</li>
        <li>Diameter: 139.820,00 km (10,97 De).</li>
        <li>Massa: 317,8 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,112.</li>
        <li>Sumbu semimajor: 5,20 AU.</li>
        <li>Periode orbit: 11,86 tahun.</li>
        <li>Periode rotasi: 9 jam 55 menit 30 detik.</li>
        <li>Hari surya: 9 jam 55 menit 33 detik.</li>
        <li>Kemiringan sumbu: 3,13 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 2,52 g.</li>
        <li>Komposisi utama: Hidrogen (H2), Helium (He).</li>
        <li>Komposisi atmosfer: Hidrogen, Helium, Metana, Amonia.</li>
        <li>Tekanan atmosfer: Sangat tinggi (mencapai jutaan atm di bagian dalam).</li>
        <li>Efek rumah kaca: Tidak terukur (dominasi panas internal).</li>
        <li>Jumlah bulan: 95 (termasuk Io, Europa, Ganymede, Callisto).</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Jupiter memiliki atmosfer yang sangat dinamis dengan pita-pita awan berwarna-warni. Planet ini memancarkan lebih banyak panas daripada yang diterimanya dari Matahari karena kontraksi gravitasi di intinya.</p>

      <h3>Keunikan</h3>
      <p>Jupiter memiliki "Bintik Merah Raksasa" (Great Red Spot), sebuah badai antisiklon raksasa yang telah mengamuk selama berabad-abad dan ukurannya lebih besar dari Bumi. Selain itu, Jupiter memiliki medan magnet yang sangat kuat, 14 kali lebih kuat dari Bumi.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  saturn: {
    title: "Saturnus",
    subtitle: "Planet cincin",
    html: `
      <img class="planet-image" src="./SpacePictures/Saturn.jpg" alt="Saturnus" />
      <p>Saturnus adalah raksasa gas terbesar kedua di tata surya setelah Jupiter. Dikenal sebagai perhiasan tata surya, planet ini memiliki sistem cincin yang paling luas dan kompleks dibandingkan planet lainnya.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Raksasa gas (Gas Giant).</li>
        <li>Kehidupan: Tidak ada.</li>
        <li>Diameter: 116.460,00 km (9,14 De).</li>
        <li>Massa: 95,16 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,111.</li>
        <li>Sumbu semimajor: 9,58 AU.</li>
        <li>Periode orbit: 29,45 tahun.</li>
        <li>Periode rotasi: 10 jam 33 menit 38 detik.</li>
        <li>Hari surya: 10 jam 33 menit 40 detik.</li>
        <li>Kemiringan sumbu: 26,73 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 1,06 g.</li>
        <li>Komposisi utama: Hidrogen (H2), Helium (He).</li>
        <li>Komposisi atmosfer: Hidrogen, Helium, Metana.</li>
        <li>Tekanan atmosfer: Sangat tinggi (meningkat seiring kedalaman).</li>
        <li>Efek rumah kaca: Tidak terukur secara standar permukaan.</li>
        <li>Jumlah bulan: 146 (termasuk Titan dan Enceladus).</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Meskipun ukurannya sangat besar, Saturnus adalah planet dengan massa jenis terendah di tata surya; ia bahkan lebih ringan daripada air. Atmosfernya menunjukkan pita-pita awan yang mirip dengan Jupiter, namun terlihat lebih samar karena tertutup lapisan kabut atas.</p>

      <h3>Keunikan</h3>
      <p>Keunikan utamanya adalah sistem cincin yang terbuat dari miliaran bongkahan es dan batu yang dilapisi debu. Selain itu, Saturnus memiliki badai berbentuk heksagon yang misterius di kutub utaranya yang tetap stabil selama bertahun-tahun.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  uranus: {
    title: "Uranus",
    subtitle: "Planet miring",
    html: `
      <img class="planet-image" src="./SpacePictures/Uranus.jpg" alt="Uranus" />
      <p>Uranus adalah raksasa es yang terletak di pinggiran tata surya. Planet ini memiliki warna biru kehijauan yang khas akibat kandungan metana di atmosfernya dan merupakan planet pertama yang ditemukan dengan bantuan teleskop.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Raksasa es (Ice Giant).</li>
        <li>Kehidupan: Tidak ada.</li>
        <li>Diameter: 50.724,00 km (3,98 De).</li>
        <li>Massa: 14,54 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,113.</li>
        <li>Sumbu semimajor: 19,22 AU.</li>
        <li>Periode orbit: 84,01 tahun.</li>
        <li>Periode rotasi: 17 jam 14 menit 24 detik (Retrograde).</li>
        <li>Hari surya: 17 jam 14 menit 23 detik.</li>
        <li>Kemiringan sumbu: 97,77 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 0,89 g.</li>
        <li>Komposisi utama: Es air, amonia, metana, dan batuan.</li>
        <li>Komposisi atmosfer: Hidrogen (H2), Helium (He), Metana (CH4).</li>
        <li>Tekanan atmosfer: Sangat tinggi di bagian dalam.</li>
        <li>Efek rumah kaca: Tidak terukur secara standar permukaan.</li>
        <li>Jumlah bulan: 28 (termasuk Titania, Oberon, dan Miranda).</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Sebagai raksasa es, Uranus tidak memiliki permukaan padat. Sebagian besar massanya terdiri dari cairan panas dan padat dari bahan-bahan "es" seperti air, metana, dan amonia di atas inti berbatu yang kecil. Atmosfernya adalah yang terdingin di tata surya.</p>

      <h3>Keunikan</h3>
      <p>Uranus adalah satu-satunya planet yang sumbu rotasinya miring ke samping, hampir sejajar dengan bidang orbitnya. Hal ini membuat Uranus tampak "menggelinding" saat mengelilingi Matahari. Selain itu, seperti Venus, Uranus berotasi dengan arah retrograde (berlawanan arah).</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },

  neptune: {
    title: "Neptunus",
    subtitle: "Planet terjauh",
    html: `
      <img class="planet-image" src="./SpacePictures/Neptune.jpg" alt="Neptunus" />
      <p>Neptunus adalah raksasa es berwarna biru pekat yang terletak di wilayah paling jauh dari Matahari. Planet ini dikenal karena anginnya yang sangat kencang dan merupakan planet pertama yang keberadaannya diprediksi melalui perhitungan matematika sebelum akhirnya diamati.</p>

      <h3>Data Utama</h3>
      <ul>
        <li>Kelas: Raksasa es (Ice Giant).</li>
        <li>Kehidupan: Tidak ada.</li>
        <li>Diameter: 49.244,00 km (3,86 De).</li>
        <li>Massa: 17,15 Me.</li>
        <li>Indeks Kemiripan Bumi: 0,113.</li>
        <li>Sumbu semimajor: 30,05 AU.</li>
        <li>Periode orbit: 164,79 tahun.</li>
        <li>Periode rotasi: 16 jam 06 menit 36 detik.</li>
        <li>Hari surya: 16 jam 06 menit 37 detik.</li>
        <li>Kemiringan sumbu: 28,32 derajat.</li>
        <li>Usia: 4,503 miliar tahun.</li>
        <li>Gravitasi: 1,14 g.</li>
        <li>Komposisi utama: Es air, amonia, metana, dan batuan.</li>
        <li>Komposisi atmosfer: Hidrogen (H2), Helium (He), Metana (CH4).</li>
        <li>Tekanan atmosfer: Sangat tinggi (meningkat tajam di bawah lapisan awan).</li>
        <li>Efek rumah kaca: Tidak terukur secara standar permukaan.</li>
        <li>Jumlah bulan: 16 (termasuk Triton).</li>
      </ul>

      <h3>Karakteristik</h3>
      <p>Neptunus memiliki komposisi yang sangat mirip dengan Uranus, namun ia tampak lebih biru karena fenomena atmosfer yang belum sepenuhnya dipahami. Atmosfernya sangat aktif dan memiliki pola cuaca yang dinamis, termasuk badai raksasa yang bergerak sangat cepat.</p>

      <h3>Keunikan</h3>
      <p>Neptunus adalah planet paling berangin di tata surya, dengan kecepatan angin yang bisa mencapai lebih dari 2.000 km/jam—lebih cepat dari kecepatan suara di Bumi. Selain itu, bulannya yang paling besar, Triton, mengorbit planet ini dengan arah berlawanan (retrograde), menunjukkan bahwa ia adalah objek yang ditangkap oleh gravitasi Neptunus.</p>

      <h3>Referensi</h3>
      <p>nasa.gov dan esa.int</p>
    `,
  },
};

function openPlanetPanel(name) {
  const data = planetData[name];
  if (!data || !planetOverlay) return;

  planetTitle.textContent = data.title;
  planetSubtitle.textContent = data.subtitle;
  planetContent.innerHTML = data.html;

  planetOverlay.hidden = false;
  document.body.classList.add("planet-lock");
}

function closePlanetPanel() {
  planetOverlay.hidden = true;
  document.body.classList.remove("planet-lock");
}

planetCloseButton?.addEventListener("click", closePlanetPanel);

planetOverlay?.addEventListener("click", (e) => {
  if (e.target === planetOverlay) closePlanetPanel();
});

openPlanetPanel("welcome");

const planetNames = ["mercury","venus","earth","moon","mars","jupiter","saturn","uranus","neptune"];

planetNames.forEach((name) => {
  const el = document.querySelector(`[data-${name}]`);
  if (!el) return;

  el.addEventListener("click", () => {
    openPlanetPanel(name);
  });
});

mercuryAnker.add(mercury);

venusAnker.add(venus);

earthAnker.add(earth);
earth.add(moonTorus, moonAnker);
moonAnker.add(moon);

marsAnker.add(mars);

jupiterAnker.add(jupiter);

saturnAnker.add(saturn);

uranusAnker.add(uranus);

neptuneAnker.add(neptune);

scene.add(
  // sun & lighting
  sun,
  ambientLight,
  mainPointLight,

  // main ankers in the sun
  mercuryAnker,
  venusAnker,
  earthAnker,
  marsAnker,
  jupiterAnker,
  saturnAnker,
  uranusAnker,
  neptuneAnker,

  // all the toruses
  earthTorus,
  mercuryTorus,
  venusTorus,
  marsTorus,
  jupiterTorus,
  saturnTorus,
  uranusTorus,
  neptuneTorus
);

const ambientLightCheckbox = document.querySelector('[data-ambient-light]');
const pointLightCheckbox = document.querySelector('[data-point-light]');
const gridLightCheckbox = document.querySelector('[data-grid-plane]');

function sceneObjControl(controller, obj) {
  controller.addEventListener('change', function () {
      if (this.checked) {
          scene.add(obj);
      } else {
          scene.remove(obj);
      }
  });
}

sceneObjControl(ambientLightCheckbox, ambientLight);
sceneObjControl(pointLightCheckbox, mainPointLight);
sceneObjControl(gridLightCheckbox, gridHelper);

var test1 = 1;
for (const planet of ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']) {
  const material = window[`${planet}TorusMaterial`];
  const element = document.querySelector(`[data-${planet}]`);

  element.onmouseover = () => material.color.setHex(0x99ff00);
  element.onmouseout = () => material.color.setHex(0xffffff);
}

let orbitalSpeed = 8000;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  const checkbox = document.querySelector('[data-animate]');
  if (!checkbox.checked) return;
  mercuryAnker.rotation.y += 47.9 / orbitalSpeed;
  venusAnker.rotation.y += 35 / orbitalSpeed;
  earthAnker.rotation.y += 29.8 / orbitalSpeed;
  moonAnker.rotation.y += 61.3833 / orbitalSpeed;
  marsAnker.rotation.y += 24.1 / orbitalSpeed;
  jupiterAnker.rotation.y += 13.1 / orbitalSpeed;
  saturnAnker.rotation.y += 9.7 / orbitalSpeed;
  uranusAnker.rotation.y += 6.8 / orbitalSpeed;
  neptuneAnker.rotation.y += 5.4 / orbitalSpeed;
  sun.rotation.y += 0.001;
  mercury.rotation.x += -0.00000017 * orbitalSpeed; // 58 hari
  venus.rotation.x   -= 0.00000004 * orbitalSpeed; // 243 hari (Venus putar balik/minus)
  earth.rotation.x   += -0.00001   * orbitalSpeed; // 1 hari
  mars.rotation.x    += -0.0000097  * orbitalSpeed; // 1.03 hari
  jupiter.rotation.x += -0.0000243  * orbitalSpeed; // 9.9 jam (Sangat cepat!)
  saturn.rotation.x  += -0.0000001  * orbitalSpeed; // 10.7 jam
  uranus.rotation.x  -= -0.0000138  * orbitalSpeed; // 17 jam (Uranus juga putar balik/minus)
  neptune.rotation.x += -0.0000149  * orbitalSpeed; // 16 jam
}

animate();

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  document.querySelector("#profileModal p:nth-child(2)").innerHTML =
    "<b>Nama:</b> " + user.nama;
}

if (user) {
  console.log("User sudah login:", user.nama);
}

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  fetch("https://solarsystemprime-production.up.railway.app/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nama: formData.get("nama"),
      password: formData.get("password"),
    }),
  })
    .then(res => res.json())
    .then(data => console.log(data));
});

console.log("FORM KEKIRIM");

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  fetch("https://solarsystemprime-production.up.railway.app/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login berhasil");
      }
    });
});

// ================= USER =================

if (user) {
  document.getElementById("profileNama").textContent = user.nama;
  console.log("User login:", user.nama);
}

// ================= SIGNUP =================
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("https://solarsystemprime-production.up.railway.app/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama: formData.get("nama"),
      password: formData.get("password"),
    }),
  });

  const data = await res.json();
  console.log(data);
  alert(data.message);
});

// ================= LOGIN =================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const res = await fetch("https://solarsystemprime-production.up.railway.app/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
  });

  const data = await res.json();
  console.log(data);

  if (data.user) {
    alert("Login berhasil");
    location.reload();
  } else {
    alert(data.message);
  }
});

// ================= COMMENT =================
document.getElementById("commentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return alert("Login dulu!");

  const rating = document.querySelector('input[name="rating"]:checked')?.value;
  const judul = e.target.judul.value;
  const komentar = e.target.komentar.value;

  const res = await fetch("https://solarsystemprime-production.up.railway.app/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nama: user.nama,
      rating,
      judul,
      komentar
    })
  });

  const data = await res.json();
  console.log(data);

  alert("Komentar terkirim 🔥");
  e.target.reset();
});

// ================= 🔥 TAMPILKAN REVIEW =================
async function loadReviews() {
  const res = await fetch("https://solarsystemprime-production.up.railway.app/reviews");
  const data = await res.json();

  const container = document.querySelector("#reviewModal .modal-content");

  container.innerHTML = `
    <h2>Ulasan Pengguna</h2>
  `;

  if (data.length === 0) {
    container.innerHTML += "<p>Belum ada review</p>";
    return;
  }

  data.reverse().forEach(r => {
    container.innerHTML += `
      <div style="margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem;">
        <b>${r.nama}</b> ⭐ ${"⭐".repeat(r.rating)}<br>
        <b>${r.judul}</b>
        <p>${r.komentar}</p>
      </div>
    `;
  });
}

// buka modal review = load data
document.querySelector('[data-modal-target="reviewModal"]').addEventListener("click", loadReviews);