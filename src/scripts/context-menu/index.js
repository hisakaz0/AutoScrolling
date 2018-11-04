import {
  createContextMenu,
  updateContextMenu,
  addOnMenuClickListener
} from "../../modules/browser";
import { State } from "../background/state";

import appConst from "../../appConst.json";

const ID_SWITCH_SCROLLING = "switch-scrolling";
const TITLE_START_SCROLLING = "Start scrolling";
const TITLE_STOP_SCROLLING = "Stop scrolling";

class ContextMenuScript {
  constructor(backgroundScript) {
    this.backgroundScript = backgroundScript;
    this.onMenuClickListener = this.onMenuClickListener.bind(this);
  }

  init() {
    this.createMenus();
    addOnMenuClickListener(this.onMenuClickListener);
  }

  createMenus() {
    appConst.contextMenus.map(menu => {
      createContextMenu(menu);
    });
  }

  getState() {
    return this.backgroundScript.state;
  }

  onMenuClickListener(info, tab) {
    switch (info.menuItemId) {
      case ID_SWITCH_SCROLLING:
        this.onSwitchScrollingMenuClickListener(info, tab);
        break;
      default:
        break;
    }
  }

  onSwitchScrollingMenuClickListener(info, tab) {
    switch (
      this.getState() // currentState
    ) {
      case State.STOP_OR_CLOSE:
        this.backgroundScript.onSingleClickEvent(); // start scrolling
        updateContextMenu(ID_SWITCH_SCROLLING, {
          title: TITLE_STOP_SCROLLING
        });
        break;
      case State.SCROLLING:
        this.backgroundScript.onSingleClickEvent(); // stop scrolling
        updateContextMenu(ID_SWITCH_SCROLLING, {
          title: TITLE_START_SCROLLING
        });
        break;
      default:
        break;
    }
  }
}

export { ContextMenuScript };
