import { OptionModal } from "../../modules/modal";
import { AutoScroller } from "../../modules/scrolling";
import { addOnMessageListener } from "../../modules/browser";
import {
  KEY_ACTION,
  ACTION_OPEN_MODAL,
  ACTION_CLOSE_MODAL,
  ACTION_START_SCROLLING,
  ACTION_STOP_SCROLLING
} from "../../modules/messaging";

class ContentScript {
  constructor() {
    this.optionModal = new OptionModal();
    this.autoScoller = new AutoScroller();
  }

  init() {
    this.autoScoller.init();
    this.autoScoller.setOnStopListener(this.onStopListener);
    this.optionModal.init();
    this.optionModal.setOnUpdateCommandListener(this.onUpdateCommandListener);
    addOnMessageListener(this.onMessageListener);
  }

  onStopListener() {
    sendMessageToBackground(MESSAGE_STOP_SCROLLING);
  }

  onUpdateCommandListener(cmd) {
    const message = Object.assign(MESSAGE_UPDATE_COMMAND, {
      [KEY_COMMAND]: cmd
    });
    sendMessageToBackground(message);
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
        this.autoScoller.start();
        break;
      case ACTION_STOP_SCROLLING:
        this.autoScoller.stop();
        break;
    }
  }
}

const contentScript = new ContentScript();
contentScript.init();
