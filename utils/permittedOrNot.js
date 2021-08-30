import User from "../models/user.js";

const permittedOrNot = (...permittedRole) => async ({
  client,
  message,
  userNumber,
}) => {
  const user = await checkUser({ userNumber });

  if (!user) return false;

  const isPermitted = permittedRole.some((role) => user.roles.includes(role));

  if (!isPermitted) {
    await client.reply(
      message.from,
      "Anda tidak diizinkan menggunakan perintah tersebut !",
      message.id,
      true
    );
    return false;
  }

  return { isPermitted, user };
};

const checkUser = async ({ userNumber, client, message }) => {
  const user = await getUser(userNumber);

  if (!user) {
    await client.reply(
      message.from,
      "Anda belum terdaftar !",
      message.id,
      true
    );
    return false;
  }

  return user;
};

const getUser = async (phoneNumber) =>
  await User.findOne({ phoneNumber }).lean();

export default permittedOrNot;
export { checkUser, getUser };
