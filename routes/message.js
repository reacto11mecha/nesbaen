import EventEmitter from "events";

import { helpReply } from "../common/message.js";
import controller from "../controller/message.js";

export default function initEmitter() {
  const messageHandler = new EventEmitter();

  messageHandler.on("absen", controller.absen);

  messageHandler.on("generate", controller.generate);

  messageHandler.on("lists", controller.lists);

  messageHandler.on("delete", controller.delete);

  messageHandler.on("me", controller.me);

  messageHandler.on(
    "help",
    async ({ client, message }) =>
      await client.reply(message.from, helpReply, message.id, true)
  );

  return messageHandler;
}
