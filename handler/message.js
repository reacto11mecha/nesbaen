import emitHandler from "../routes/message.js";

const GITHUB_URL = "https://github.com/reacto11mecha/nesbaen";

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
    default:
      await client.reply(
        from,
        command.length > 0
          ? `Tidak ada perintah yang bernama '${command}'`
          : `Nesbaen, saya adalah bot absen.\n\nGithub: ${GITHUB_URL}`,
        id,
        true
      );
  }

  return true;
};

export default messageHandler;
