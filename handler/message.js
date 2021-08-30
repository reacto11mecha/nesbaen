import emitHandler from "../routes/message.js";
import { botInfo } from "../common/message.js";

const handler = emitHandler();

const messageHandler = (client) => async (message) => {
  const { body, from, sender, id } = message;
  const userNumber = `+${sender.id.replace("@c.us", "")}`;

  const command = body
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase();
  const args = body
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/)
    .slice(1);

  switch (command) {
    case "a":
    case "absen":
      return await handler.emit("absen", {
        args,
        client,
        message,
        userNumber,
      });
    case "buat":
    case "gen":
    case "generate":
      return await handler.emit("generate", {
        client,
        message,
        userNumber,
      });
    case "list":
    case "lists":
      return await handler.emit("lists", {
        args,
        client,
        message,
        userNumber,
      });
    case "del":
    case "delete":
    case "hapus":
      return await handler.emit("delete", {
        args,
        client,
        message,
        userNumber,
      });
    case "perintah":
    case "help":
    case "command":
    case "commands":
      return await handler.emit("help", {
        client,
        message,
      });
    case "me":
    case "saya":
      return await handler.emit("me", {
        client,
        message,
        userNumber,
      });
    default:
      await client.reply(
        from,
        command.length > 0
          ? `Tidak ada perintah yang bernama '${command}'`
          : botInfo,
        id,
        true
      );
  }

  return true;
};

export default messageHandler;
