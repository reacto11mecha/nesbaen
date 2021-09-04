import EventEmitter from "events";

import { isStudent, isManager } from "../validator/authorization.js";

import { helpReply } from "../common/message.js";
import controller from "../controller/message.js";

export default function initEmitter() {
  const messageHandler = new EventEmitter();

  messageHandler.on("me", controller.me);

  messageHandler.on("absen", isStudent(controller.absen));
  messageHandler.on("generate", isManager(controller.generate));
  messageHandler.on("list-created", isManager(controller.listCreated));
  messageHandler.on("lists", isManager(controller.lists));
  messageHandler.on("delete", isManager(controller.delete));

  messageHandler.on(
    "help",
    async ({ client, message }) =>
      await client.reply(message.from, helpReply, message.id, true)
  );

  return messageHandler;
}
