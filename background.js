
let brower_action_icon = {
  click_cnt: 0,
  clicked_tab_id: -1
};

browser.browserAction.onClicked.addListener((tab) => {
  brower_action_icon.clicked_tab_id = tab.id;
  brower_action_icon.click_cnt += 1;
  browser.tabs.sendMessage(tab.id, 0);
});

browser.tabs.onActivated.addListener(
    function (tabId, windowId) {
      if (brower_action_icon.click_cnt%2 == 1) {
        browser.tabs.sendMessage(
          brower_action_icon.clicked_tab_id, 0);
      }
      brower_action_icon.click_cnt = 0;
    });
