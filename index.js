import { create, Client } from "@open-wa/wa-automate";
import PQueue from "p-queue";
import dotenv from "dotenv";

dotenv.config();

import "./handler/database.js";

import handlerProc from "./handler/message.js";

let proc;

const queue = new PQueue({
  concurrency: 4,
  autoStart: false,
});

const checkValidMessage = (message) =>
  message.type === "chat" && message.body.startsWith(process.env.PREFIX);

const processMessage = (message) => {
  if (checkValidMessage(message)) {
    console.log(`[Pesan] Ada pesan dari : ${message.sender.pushname}`);
    queue.add(() => proc(message));
  }
};

async function start(client) {
  try {
    proc = handlerProc(client);

    const unreadMessages = await client.getAllUnreadMessages();
    unreadMessages?.filter(checkValidMessage).forEach(processMessage);

    client.onStateChanged((state) => {
      console.log(`[State] Current State: ${state}`);
      if (state === "CONFLICT") client.forceRefocus();
    });

    await client.onMessage(processMessage);
    queue.start();
  } catch (error) {
    console.error(error);
  }
}

create({
  sessionId: "NESBAEN_BOT",
  cacheEnabled: false,
  authTimeout: 0,
  killProcessOnBrowserClose: true,
  qrTimeout: 0,
}).then((client) => start(client));
