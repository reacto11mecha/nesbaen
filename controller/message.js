import Absen from "../models/absen.js";
import Class from "../models/class.js";

import { isUUID4 } from "../validator/argumentsValidator.js";
import { generateDateString } from "../utils/date.js";
import { checkUser } from "../utils/permittedOrNot.js";

export default {
  absen: async ({ args, client, message, user }) => {
    await client.simulateTyping(message.from, true);
    const valid = await isUUID4({ args, client, message });

    if (valid) {
      const absensi = await Absen.findOne({ absen_id: args[0] });

      if (!absensi) {
        await client.simulateTyping(message.from, false);
        return await client.reply(
          message.from,
          "Absensi tidak ada !",
          message.id,
          true
        );
      }

      const alreadyPresence = absensi.userList.some(({ user_id }) =>
        user_id.equals(user._id)
      );

      if (alreadyPresence) {
        await client.simulateTyping(message.from, false);
        return await client.reply(
          message.from,
          "Anda sudah absen sebelumnya.",
          message.id,
          true
        );
      }
      absensi.userList.push({ user_id: user._id });

      await absensi.save();

      await client.reply(
        message.from,
        "Berhasil terabsen 👍",
        message.id,
        true
      );
      return await client.simulateTyping(message.from, false);
    }
  },

  generate: async ({ client, message, user }) => {
    await client.simulateTyping(message.from, true);
    const absensi = new Absen({ assignator: user._id });

    await absensi.save();

    await client.reply(
      message.from,
      "Salin perintah absen di bawah ini, kirimkan ke teman anda.",
      message.id,
      true
    );

    await client.sendText(
      message.from,
      `${process.env.PREFIX} absen ${absensi.absen_id}`
    );
    return await client.simulateTyping(message.from, false);
  },

  listCreated: async ({ client, message, user }) => {
    await client.simulateTyping(message.from, true);

    const absensi = await Absen.find({ assignator: user._id }).lean();

    if (absensi.length === 0) {
      await client.simulateTyping(message.from, false);
      return await client.reply(
        message.from,
        "Anda belum pernah membuat daftar absensi.",
        message.id,
        true
      );
    }

    await client.reply(
      message.from,
      `Daftar absen yang dibuat oleh anda, ${user.name}`,
      message.id,
      true
    );

    for (const absen of absensi) {
      await client.sendText(
        message.from,
        `${absen.absen_id}  |  ${generateDateString(absen.created_at)}`
      );
    }

    return await client.simulateTyping(message.from, false);
  },

  lists: async ({ args, client, message }) => {
    await client.simulateTyping(message.from, true);

    const valid = await isUUID4({ args, client, message });

    if (valid) {
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
  },

  delete: async ({ args, client, message, user }) => {
    await client.simulateTyping(message.from, true);
    const valid = await isUUID4({ args, client, message });

    if (valid) {
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

      if (!absensi.assignator._id.equals(user._id)) {
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

      await client.reply(
        message.from,
        `Berhasil menghapus absen 👍\nID: ${absensi.absen_id}`,
        message.id,
        true
      );
      return await client.simulateTyping(message.from, false);
    }
  },

  me: async ({ client, message, userNumber }) => {
    await client.simulateTyping(message.from, true);
    const user = await checkUser({ client, message, userNumber });

    if (user) {
      const gradeClassName = user.className
        ? await Class.findOne({ _id: user.className.grade }).lean()
        : null;

      const className = gradeClassName
        ? gradeClassName.classNames.find((classes) =>
            classes._id.equals(user.className.gradeName)
          )
        : null;

      await client.reply(
        message.from,
        `Profil anda

Nama: ${user.name}
${
  gradeClassName
    ? `Kelas: ${gradeClassName.gradeName} ${className.name}\n`
    : "\n"
}Roles: ${user.roles.join(", ")}
Tanggal didaftarkan: ${generateDateString(user.created_at)}`,
        message.id,
        true
      );
      return await client.simulateTyping(message.from, false);
    }
  },
};
