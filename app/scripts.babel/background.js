'use strict';

chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.sync.get('vymToken', function (items) {
    if (!items.vymToken) {
      autoSignIn();
    }
  });
});

function autoSignIn() {
  chrome.tabs.create({
    url: '__VYM_HOST__/api/v1/auth/github'
  });
}
