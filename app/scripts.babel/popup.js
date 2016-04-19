$(document).ready(function () {
  function refreshLoggedInState() {
    chrome.storage.sync.get(null, function (items) {
      if (items.vymToken) {
        $('.vym-logged-out').hide();
        $('.vym-logged-in').show();
      } else {
        $('.vym-logged-out').show();
        $('.vym-logged-in').hide();
      }
    });
  }

  refreshLoggedInState();

  $(document).on('click', '.vym-log-out', function (e) {
    e.preventDefault();

    chrome.storage.sync.remove('vymToken', function () {
      refreshLoggedInState();
    });
  });

  $(document).on('click', '.vym-log-in', function (e) {
    e.preventDefault();

    chrome.tabs.create({
      url: '__VYM_HOST__/api/v1/auth/github'
    }, function () {
      window.close();
    });
  });

});
