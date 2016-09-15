'use strict';

const LINKS = {
  'swagger_1': [
    { title: 'SwaggerUI', urlTmpl: 'http://petstore.swagger.io/?url=https://crossorigin.me/{link}' },
  ],
  'swagger_2': [
    { title: 'SwaggerUI', urlTmpl: 'http://petstore.swagger.io/?url={link}' },
  ]
}


chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.subject !== 'data') return;
  let $buttons = document.getElementById('buttons');
  let type = msg.data.type;
  let url = msg.data.url;
  let links = LINKS[type];
  if (!links) links = [];



  for (let link of links) {
    let $aTag = document.createElement('a');
    $aTag.setAttribute('href', link.urlTmpl.replace('{link}', url));
    $aTag.setAttribute('target', '_blank');
    $aTag.innerHTML = link.title;
    $buttons.appendChild($aTag);
  }
});

chrome.runtime.sendMessage({from: 'popup', subject: 'getData'});

var $disableButton = document.getElementById('disable_button');
$disableButton.addEventListener('click', function() {
  chrome.runtime.sendMessage({from: 'popup', subject: 'disable'});
  window.close();
});
