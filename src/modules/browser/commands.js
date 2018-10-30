/**
 *
 * @param {Object} cmd which has property,
 * `name`, `shortcut`, `description`.
 *
 * @returns {Promise}
 */
const updateCommand = cmd => {
  return browser.commands.update(cmd);
};

/**
 *
 * @param {Function} l listener
 *
 * @returns {Promise}
 */
const addOnCommandListener = listener => {
  return browser.commands.onCommand.addListener(listener);
};

const KEY_COMMAND_NAME = "name";
const KEY_COMMAND_SHORTCUT = "shortcut";
const KEY_COMMAND_DESCRIPTION = "description";

/**
 *
 * @param {String} name Command name
 * @param {String} [shortcut] Keybind to fire the command
 * @param {String} [description] Command description
 *
 * @returns {Object} command object
 */
const createCommandObject = (name, shortcut, description) => {
  if (typeof name !== typeof "") {
    throw new Error(`1st arg must be String, but ${typeof name}`);
  }
  const cmdObj = { [KEY_COMMAND_NAME]: name };
  if (typeof shortcut === typeof "") {
    cmdObj[KEY_COMMAND_SHORTCUT] = shortcut;
  }
  if (typeof description === typeof "") {
    cmdObj[KEY_COMMAND_DESCRIPTION] = description;
  }
  return cmdObj;
};

export { updateCommand, addOnCommandListener, createCommandObject };
