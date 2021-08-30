import { readFileSync } from "fs";

const packageInfo = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url))
);

const GITHUB_URL = packageInfo.repository.url
  .replace("git+", "")
  .replace(".git", "");

// Daftar perintah kalau help dipanggil
const helpReply = `Nesbaen, saya adalah bot absen.
Prefix: ${process.env.PREFIX}

Bot ini bisa digunakan di chat pribadi atau di grup.

Catatan: Anda harus terdaftar terlebih dahulu. Hubungi host dari bot ini untuk didaftarkan.

Daftar Perintah:
- saya: Perintah ini digunakan untuk mengecek profil diri sendiri.

Contoh: ${process.env.PREFIX} saya

- absen: Perintah ini adalah untuk absen, diperlukan argumen "id" yang unik. Anda harus memiliki role siswa.

Contoh: ${process.env.PREFIX} absen <id>

- buat: Perintah ini digunakan untuk membuat absen, gunakan secara bijak. Anda harus memiliki role pengurus/guru/admin.

Jika sudah diberikan id uniknya, berikan ke orang/kelas yang dituju.

Contoh: ${process.env.PREFIX} buat

- list: Perintah ini digunakan untuk menampilkan siapa saja yang sudah absen, diperlukan argumen "id" yang unik. Anda harus memiliki role pengurus/guru/admin.

Contoh: ${process.env.PREFIX} list <id>

- hapus: Perintah ini digunakan untuk *menghapus* absen, diperlukan argumen "id" yang unik. Anda harus memiliki role pengurus/guru/admin. Yang bisa menghapus absen adalah orang yang membuatnya.

Catatan: *Hati-hati* dalam menggunakan perintah ini. Sekali terhapus sudah terhapus untuk selamanya.

Contoh: ${process.env.PREFIX} hapus <id>


Sumber Kode: ${GITHUB_URL}

Dibuat oleh Ezra Khairan Permana di bawah lisensi MIT.`;

// Informasi Bot
const botInfo = `Nesbaen, saya adalah bot absen.

Untuk perintah lengkap ketik:
"${process.env.PREFIX} help" (tanpa tanda ").

Sumber Kode: ${GITHUB_URL}

Dibuat oleh Ezra Khairan Permana di bawah lisensi MIT.`;

export { GITHUB_URL, helpReply, botInfo };
