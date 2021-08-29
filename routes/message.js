import EventEmitter from "events";

import Absen from "../models/absen.js";
import { isStudent, isManager } from "../validator/authorization.js";
import { isUUID4 } from "../validator/argumentsValidator.js";
import { generateDateString } from "../utils/date.js";

const GITHUB_URL = "https://github.com/reacto11mecha/nesbaen";

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

export default function initEmitter() {
  const messageHandler = new EventEmitter();

  messageHandler.on("absen", async ({ args, client, message, userNumber }) => {
    const permitted = await isStudent({ client, message, userNumber });

    if (permitted.isPermitted) {
      const valid = await isUUID4({ args, client, message });

      if (valid) {
        const absensi = await Absen.findOne({ absen_id: args[0] });

        if (!absensi)
          return await client.reply(
            message.from,
            "Absensi tidak ada !",
            message.id,
            true
          );

        const alreadyPresence = absensi.userList.some(({ user_id }) =>
          user_id.equals(permitted.user._id)
        );

        if (alreadyPresence)
          return await client.reply(
            message.from,
            "Anda sudah absen sebelumnya.",
            message.id,
            true
          );

        await client.simulateTyping(message.from, true);
        absensi.userList.push({ user_id: permitted.user._id });

        await absensi.save();
        await client.simulateTyping(message.from, false);

        return await client.reply(
          message.from,
          "Berhasil terabsen 👍",
          message.id,
          true
        );
      }
    }
  });

  messageHandler.on("generate", async ({ client, message, userNumber }) => {
    const permitted = await isManager({ client, message, userNumber });

    if (permitted.isPermitted) {
      await client.simulateTyping(message.from, true);
      const absensi = new Absen({ assignator: permitted.user._id });

      await absensi.save();
      await client.simulateTyping(message.from, false);

      await client.reply(
        message.from,
        "Salin perintah absen di bawah ini, kirimkan ke teman anda.",
        message.id,
        true
      );

      return await client.sendText(
        message.from,
        `${process.env.PREFIX} absen ${absensi.absen_id}`
      );
    }
  });

  messageHandler.on("lists", async ({ args, client, message, userNumber }) => {
    const permitted = await isManager({ client, message, userNumber });

    if (permitted.isPermitted) {
      const valid = await isUUID4({ args, client, message });

      if (valid) {
        await client.simulateTyping(message.from, true);
        const absensi = await Absen.findOne({ absen_id: args[0] })
          .populate("userList.user_id")
          .populate("assignator")
          .lean();

        if (!absensi) {
          await client.simulateTyping(message.from, false);
          return await client.reply(
            message.from,
            "Absensi tidak ada !",
            message.id,
            true
          );
        }

        await client.simulateTyping(message.from, false);
        return await client.reply(
          message.from,
          `LIST ABSENSI\n\nAbsen dibuat oleh: ${
            absensi.assignator.name
          }\nTanggal dibuat: ${generateDateString(absensi.created_at)}

${
  absensi.userList.length > 0
    ? `Daftar Yang Hadir:${absensi.userList.map(
        (user, idx) => `\n${idx + 1}. ${user.user_id.name}`
      )}`
    : "Belum ada yang absen."
}`.trim(),
          message.id,
          true
        );
      }
    }
  });

  messageHandler.on("delete", async ({ args, client, message, userNumber }) => {
    const permitted = await isManager({ client, message, userNumber });

    if (permitted.isPermitted) {
      const valid = await isUUID4({ args, client, message });

      if (valid) {
        await client.simulateTyping(message.from, true);
        const absensi = await Absen.findOne({ absen_id: args[0] })
          .populate("assignator")
          .lean();

        if (!absensi) {
          await client.simulateTyping(message.from, false);
          return await client.reply(
            message.from,
            "Absensi tidak ada !",
            message.id,
            true
          );
        }

        if (!absensi.assignator._id.equals(permitted.user._id)) {
          await client.simulateTyping(message.from, false);
          return await client.reply(
            message.from,
            "Anda bukan pembuat absen aslinya !",
            message.id,
            true
          );
        }

        await Absen.deleteOne({
          absen_id: absensi.absen_id,
          assignator: absensi.assignator._id,
        });

        await client.simulateTyping(message.from, false);
        return await client.reply(
          message.from,
          `Berhasil menghapus absen 👍\nID: ${absensi.absen_id}`,
          message.id,
          true
        );
      }
    }
  });

  messageHandler.on(
    "help",
    async ({ client, message }) =>
      await client.reply(message.from, helpReply, message.id, true)
  );

  messageHandler.on("me", async ({ client, message, userNumber }) => {
    const permitted = await isStudent({ client, message, userNumber });

    if (permitted.isPermitted)
      return await client.reply(
        message.from,
        `Profil anda

Nama: ${permitted.user.name}
${
  permitted.user.className ? `Kelas: ${permitted.user.className}\n` : "\n"
}Roles: ${permitted.user.roles.join(", ")}
Tanggal didaftarkan: ${generateDateString(permitted.user.created_at)}`,
        message.id,
        true
      );
  });

  return messageHandler;
}
