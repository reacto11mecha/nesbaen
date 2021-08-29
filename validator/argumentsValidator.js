import { version as uuidVersion, validate as uuidValidate } from "uuid";

const isUUID4 = async ({ args, client, message }) => {
  const haveArguments = await isArgumentExist({ args, client, message });

  if (!haveArguments) return haveArguments;

  const isValidUUID4 = uuidValidate(args[0]) && uuidVersion(args[0]) === 4;

  if (!isValidUUID4) {
    await client.reply(
      message.from,
      "Id absen yang dimasukkan tidak valid !",
      message.id,
      true
    );
    return false;
  }

  return isValidUUID4;
};

const isArgumentExist = async ({ args, client, message }) => {
  if (args.length === 0) {
    await client.reply(
      message.from,
      "Argumen dibutuhkan setelah perintah !",
      message.id,
      true
    );
    return false;
  }

  return true;
};

export { isUUID4, isArgumentExist };
