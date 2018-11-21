import {
  createContextMenu,
  updateContextMenu,
  addOnMenuClickListener,
} from '../../modules/browser';
import State from '../background/state';
import EventType from '../background/event';

import appConst from '../../appConst.json';

const ID_ACTION_MENU = 'action-menu';
const TITLE_START_SCROLLING = 'Start scrolling';
const TITLE_STOP_SCROLLING = 'Stop scrolling';
const TITLE_CLOSE_MODAL = 'Close option modal';

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
    appConst.contextMenus.forEach(menu => createContextMenu(menu));
    return this;
  }

  getState() {
    return this.backgroundScript.state;
  }

  onMenuClickListener(info, tab) {
    switch (info.menuItemId) {
      case ID_ACTION_MENU:
        this.onActionMenuClick(info, tab);
        break;
      default:
        break;
    }
  }

  onStateChange(state) {
    switch (state) {
      case State.SCROLLING:
      case State.SLOW_SCROLLING:
      case State.MIDDLE_SCROLLING:
      case State.FAST_SCROLLING:
        updateContextMenu(ID_ACTION_MENU, {
          title: TITLE_STOP_SCROLLING,
        });
        break;
      case State.STOP_OR_CLOSE:
        updateContextMenu(ID_ACTION_MENU, {
          title: TITLE_START_SCROLLING,
        });
        break;
      case State.MODAL_OPENED:
        updateContextMenu(ID_ACTION_MENU, {
          title: TITLE_CLOSE_MODAL,
        });
        break;
      default:
        break;
    }
    return this;
  }

  onActionMenuClick(info, tab) {
    switch (
      this.getState() // currentState
    ) {
      case State.STOP_OR_CLOSE:
        this.backgroundScript.startScrollingAction(EventType.CONTEXT_MENU);
        break;
      case State.SCROLLING:
      case State.SLOW_SCROLLING:
      case State.MIDDLE_SCROLLING:
      case State.FAST_SCROLLING:
        this.backgroundScript.stopScrollingAction(EventType.CONTEXT_MENU);
        break;
      case State.MODAL_OPENED:
        this.backgroundScript.closeModalAction(EventType.CONTEXT_MENU);
        break;
      default:
        break;
    }
  }
}

export default ContextMenuScript;
