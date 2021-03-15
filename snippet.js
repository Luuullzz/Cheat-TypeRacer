

console.log('Hello world this is snippet');

chrome.runtime.onMessage.addListener(function (req, sender, res) {
  if (!sender.tab) {
    console.log('got message from extension', req);
    res('ok got your message');
  }
});