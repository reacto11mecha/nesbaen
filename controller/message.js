import Absen from "../models/absen.js";
import Class from "../models/class.js";

import { isStudent, isManager } from "../validator/authorization.js";
import { isUUID4 } from "../validator/argumentsValidator.js";
import { generateDateString } from "../utils/date.js";
import { checkUser } from "../utils/permittedOrNot.js";

export default {
  absen: async ({ args, client, message, userNumber }) => {
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
  },

  generate: async ({ client, message, userNumber }) => {
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
  },

  lists: async ({ args, client, message, userNumber }) => {
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
  },

  delete: async ({ args, client, message, userNumber }) => {
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
  },

  me: async ({ client, message, userNumber }) => {
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

      return await client.reply(
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
    }
  },
};
