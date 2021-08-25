let absensi = [];

const GITHUB_URL = "https://github.com/reacto11mecha/nesbaen";

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
