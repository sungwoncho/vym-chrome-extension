chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.sync.get('vymToken', function (items) {
    if (!items.vymToken) {
      autoSignIn();
    }
  });
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.action === 'openTab') {
    chrome.tabs.create({
      url: req.url
    });
  }
});

function autoSignIn() {
  chrome.tabs.create({
    url: '__VYM_HOST__/api/v1/auth/github'
  });
}
