import browser from './api';

const updateCommand = cmd => browser.commands.update(cmd);

const addOnCommandListener = listener => browser.commands.onCommand.addListener(listener);

const KEY_COMMAND_NAME = 'name';
const KEY_COMMAND_SHORTCUT = 'shortcut';
const KEY_COMMAND_DESCRIPTION = 'description';

const createCommandObject = (name, shortcut, description) => {
  if (typeof name !== typeof '') {
    throw new Error(`1st arg must be String, but ${typeof name}`);
  }
  const cmdObj = { [KEY_COMMAND_NAME]: name };
  if (typeof shortcut === typeof '') {
    cmdObj[KEY_COMMAND_SHORTCUT] = shortcut;
  }
  if (typeof description === typeof '') {
    cmdObj[KEY_COMMAND_DESCRIPTION] = description;
  }
  return cmdObj;
};

export { updateCommand, addOnCommandListener, createCommandObject };
