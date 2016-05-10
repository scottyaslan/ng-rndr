function updateWebviews() {
  var webview = document.querySelector("#embeddedExplorer");
  webview.style.height = document.documentElement.clientHeight + "px";
  webview.style.width = document.documentElement.clientWidth + "px";
  webview.addEventListener('permissionrequest', function(e) {
    if (e.permission === 'download') {
      e.request.allow();
    }
  });
  webview.addEventListener('newwindow', function(e) {
    e.preventDefault();
    // e.targetUrl contains the target URL of the original link click
    // or window.open() call: use it to open your own window to it.
    // Something to keep in mind: window.open() called from the
    // app's event page is currently (Nov 2013) handicapped and buggy
    // (e.g. it doesn't have access to local storage, including cookie
    // store). You can try to use it here and below, but be prepare that
    // it may sometimes produce bad results.
    window.open(e.targetUrl);
  });
}

onload = updateWebviews;
window.onresize = updateWebviews;