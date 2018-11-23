class Logger {
  constructor() {
    this.DEFAULT_TAG_NAME = 'AutoScrolling';
  }

  getMessage(tag, message) {
    if (typeof message !== 'undefined') return { tag, message };
    return { tag: this.DEFAULT_TAG_NAME, message: tag };
  }

  logging(func, argTag, argMessage) {
    func(...Object.values(this.getMessage(argTag, argMessage)));
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
export default logger;
