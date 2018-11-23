import OptionModal from '../../modules/modal';
import { AutoScroller } from '../../modules/scrolling';
import {
  addOnMessageListener,
  sendMessageToBackground,
} from '../../modules/browser';
import { logger } from '../../modules/utils';
import {
  KEY_ACTION,
  KEY_COMMAND,
  KEY_DATA,
  ACTION_OPEN_MODAL,
  ACTION_CLOSE_MODAL,
  ACTION_START_SCROLLING,
  ACTION_STOP_SCROLLING,
  ACTION_CHANGE_SPEED,
  MESSAGE_STOP_SCROLLING,
  MESSAGE_CLOSE_MODAL,
  MESSAGE_INIT_CONTENT_SCRIPT,
  MESSAGE_UPDATE_COMMAND,
} from '../../modules/messaging';

class ContentScript {
  constructor() {
    this.optionModal = new OptionModal();
    this.autoScoller = new AutoScroller();

    this.onStopListener = this.onStopListener.bind(this);
    this.onCloseListener = this.onCloseListener.bind(this);
    this.onUpdateCommandListener = this.onUpdateCommandListener.bind(this);
    this.onMessageListener = this.onMessageListener.bind(this);
  }

  init() {
    this.autoScoller.init();
    this.autoScoller.setOnStopListener(this.onStopListener);
    this.optionModal.init();
    this.optionModal.setOnUpdateCommandListener(this.onUpdateCommandListener);
    this.optionModal.setOnCloseListener(this.onCloseListener);

    addOnMessageListener(this.onMessageListener);

    sendMessageToBackground(MESSAGE_INIT_CONTENT_SCRIPT);
  }

  // eslint-disable-next-line class-methods-use-this
  onStopListener() {
    return sendMessageToBackground(MESSAGE_STOP_SCROLLING);
  }

  // eslint-disable-next-line class-methods-use-this
  onCloseListener() {
    return sendMessageToBackground(MESSAGE_CLOSE_MODAL);
  }

  // eslint-disable-next-line class-methods-use-this
  onUpdateCommandListener(cmd) {
    return sendMessageToBackground({
      ...MESSAGE_UPDATE_COMMAND,
      [KEY_COMMAND]: cmd,
    });
  }

  onMessageListener(msg) {
    switch (msg[KEY_ACTION]) {
      case ACTION_OPEN_MODAL:
        this.optionModal.open();
        break;
      case ACTION_CLOSE_MODAL:
        this.optionModal.close();
        break;
      case ACTION_START_SCROLLING:
        this.autoScoller.start(msg[KEY_DATA].scrollingSpeed);
        break;
      case ACTION_CHANGE_SPEED:
        this.autoScoller.stop().start(msg[KEY_DATA].scrollingSpeed);
        break;
      case ACTION_STOP_SCROLLING:
        this.autoScoller.stop();
        break;
      default:
        logger.error(`Invalid action: ${msg[KEY_ACTION]}`);
        break;
    }
  }
}

const script = new ContentScript();
script.init();
