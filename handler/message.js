let absensi = [];

const GITHUB_URL = "https://github.com/reacto11mecha/nesbaen-wa-bot";

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

  async function absen() {
    if (args.length < 1)
      return client.reply(from, "Masukkan id absen terlebih dahulu!", id);

    const absensiID = absensi.findIndex((x) => x.id === args[0]);

    if (absensiID < 0)
      return client.reply(from, `Tidak ada absensi dengan id "${args[0]}"`, id);

    const sudahAbsen =
      absensi[absensiID].lists.findIndex(
        (list) => list.username === username
      ) !== -1;

    if (sudahAbsen)
      return client.reply(from, "Kamu sudah absen sebelumnya, tenang.", id);

    absensi = absensi.map((absen) => {
      if (absen.id === args[0]) {
        return {
          ...absen,
          lists: [...absen.lists, { username, phoneNumber: from }],
        };
      }

      return absen;
    });

    await client.reply(from, "Berhasil diabsenkan!", id);
    console.log(`[Absensi] Berhasil diabsenkan dengan username : ${username}`);
  }

  async function buatAbsen() {
    if (args.length < 1)
      return client.reply(from, "Masukkan id absen terlebih dahulu!", id);

    const absensiID = absensi.findIndex((x) => x.id === args[0]);

    if (absensiID > 0)
      return client.reply(
        from,
        `Absensi dengan id "${args[0]}" sudah ada!`,
        id
      );

    absensi = [...absensi, { id: args[0], lists: [] }];

    await client.reply(from, "ID absensi baru berhasil ditambahkan!", id);
    console.log(
      `[Absensi] ID absensi baru berhasil ditambahkan! ID : ${args[0]}`
    );
  }

  async function reporting() {
    if (args.length < 1)
      return client.reply(from, "Masukkan id absen terlebih dahulu!", id);

    const absensiID = absensi.findIndex((x) => x.id === args[0]);

    if (absensiID < 0)
      return client.reply(from, `Tidak ada absensi dengan id "${args[0]}"`, id);

    const replyMessage = `Absen id : ${args[0]}\n${
      absensi[absensiID].lists.length > 0
        ? `Nama-nama yang absen\n\n${absensi[absensiID].lists.map(
            (data, idx) => `${idx + 1}.${data.username} ${data.phoneNumber}`
          )}`
        : "Belum ada yang absen."
    }`;
    await client.reply(from, replyMessage, id);
  }

  switch (command) {
    case "absen":
      return await absen();

    case "buat":
    case "buat-absen":
      return await buatAbsen();

    case "report":
    case "reporting":
      return await reporting();

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
