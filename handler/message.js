const messageHandler = (client) => async (message) => {
  const { body, from, id } = message;

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

  await client.reply(
    from,
    `Command: ${command}\nARGUMENTS: ${JSON.stringify(args)}`,
    id
  );

  return true;
};

export default messageHandler;
