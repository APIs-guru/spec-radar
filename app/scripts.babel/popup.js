'use strict';

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  let $buttons = document.getElementById('buttons');
  $buttons.innerText = JSON.stringify(msg.data);
});

chrome.runtime.sendMessage({from: 'popup', subject: 'getData'});

var $disableButton = document.getElementById('disable_button');
$disableButton.addEventListener('click', function() {
  chrome.runtime.sendMessage({from: 'popup', subject: 'disable'});
  window.close();
});
