import emitHandler from "../routes/message.js";

const GITHUB_URL = "https://github.com/reacto11mecha/nesbaen";

const handler = emitHandler();

const messageHandler = (client) => async (message) => {
  const { body, from, id, sender } = message;
  const { pushname: username } = sender;

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
    case "absen":
      return await handler.emit("absen", { args, client });
    case "buat":
    case "generate":
      return await handler.emit("generate", { client });
    default:
      await client.reply(
        from,
        command.length > 0
          ? `Tidak ada perintah yang bernama '${command}'`
          : `Nesbaen, saya adalah bot absen.\n\nGithub: ${GITHUB_URL}`,
        id
      );
  }

  return true;
};

export default messageHandler;
