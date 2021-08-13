const absensi = [{ id: "123456", lists: [] }];

const GITHUB_URL = "https://github.com/reacto11mecha/nesbaen-wa-bot";

const messageHandler = (client) => async (message) => {
  const { body, from, id, sender, chat } = message;
  const { pushname: username } = sender;
  const { id: phoneNumber } = chat;

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
      if (args.length < 1)
        return client.reply(from, "Masukkan id absen terlebih dahulu!", id);

      const absensiID = absensi.findIndex((x) => x.id === args[0]);

      if (absensiID < 0)
        return client.reply(
          from,
          `Tidak ada absensi dengan id "${args[0]}"`,
          id
        );

      const sudahAbsen =
        absensi[absensiID].lists.findIndex(
          (list) => list.phoneNumber === phoneNumber
        ) !== -1;

      if (sudahAbsen)
        return client.reply(from, "Kamu sudah absen sebelumnya, tenang.", id);

      absensi[absensiID].lists.push({ username, phoneNumber });

      await client.reply(from, "Berhasil diabsenkan!", id);
      console.log(
        `[Absensi] Berhasil diabsenkan dengan username : ${username}`
      );
      break;
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
