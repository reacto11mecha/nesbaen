import EventEmitter from "events";

import Absen from "../models/absen.js";
import { isStudent, isManager } from "../utils/authorization.js";

export default function initEmitter() {
  const messageHandler = new EventEmitter();

  messageHandler.on("absen", async ({ args, client, message, userNumber }) => {
    const permitted = await isStudent({ client, message, userNumber });

    if (permitted.isPermitted) {
      return await client.reply(message.from, "Test ABSEN !", message.id, true);
    }
  });

  messageHandler.on("generate", async ({ client, message, userNumber }) => {
    const permitted = await isManager({ client, message, userNumber });

    if (permitted.isPermitted) {
      await client.simulateTyping(message.from, true);
      const absensi = new Absen({ asignnator: permitted.user._id });

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

  return messageHandler;
}
