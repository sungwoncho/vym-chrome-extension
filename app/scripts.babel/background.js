'use strict';

chrome.runtime.onInstalled.addListener(details => {
  chrome.tabs.create({
    url: '__VYM_HOST__/api/v1/auth/github'
  });
});
