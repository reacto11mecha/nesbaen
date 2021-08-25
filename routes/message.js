import EventEmitter from "events";

export default function initEmitter() {
  const messageHandler = new EventEmitter();

  messageHandler.on("absen", ({}) => {});

  messageHandler.on("generate", ({}) => {});

  return messageHandler;
}
