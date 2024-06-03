const blockedSites = [
  "x.com",
  "www.facebook.com",
  "www.youtube.com"
]; // ここにブロックするドメインを追加
const BLOCK_DURATION = 60 * 60 * 1000; // 60分

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "toggleBlock") {
    const blockStartTime = Date.now();
    chrome.storage.local.set({ blockStartTime, blocked: true }, () => {
      sendResponse({status: true});
    });
  }
  return true; // 非同期でsendResponseを使用するため
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(changeInfo.url)
  if (changeInfo.url) {
    chrome.storage.local.get(["blockStartTime", "blocked"], (data) => {
      if (data.blocked) {
        const elapsedTime = Date.now() - data.blockStartTime;
        if (elapsedTime < BLOCK_DURATION) {
          const url = new URL(changeInfo.url);
          if (blockedSites.includes(url.hostname)) {
            chrome.tabs.remove(tabId);
          }
        } else {
          chrome.storage.local.set({ blocked: false });
        }
      }
    });
  }
});
