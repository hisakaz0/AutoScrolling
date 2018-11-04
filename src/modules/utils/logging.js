"use strict";

class Logger {
  constructor() {
    this.DEFAULT_TAG_NAME = "AutoScrolling";
  }

  getMessage(tag, message) {
    if (typeof message === typeof undefined) {
      message = tag;
      tag = this.DEFAULT_TAG_NAME;
    }
    return { tag, message };
  }

  logging(func, argTag, argMessage) {
    const { tag, message } = this.getMessage(argTag, argMessage);
    func(tag, message);
  }

  debug(tag, message) {
    if (!process.env.DEBUG) return;
    this.logging(console.debug, tag, message);
  }

  error(tag, message) {
    this.logging(console.error, tag, message);
  }
}
const logger = new Logger();

export { logger };
