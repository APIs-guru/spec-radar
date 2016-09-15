'use strict';

const LINKS = {
  'swagger_1': [
    { title: 'SwaggerUI', urlTmpl: 'http://petstore.swagger.io/?url=https://crossorigin.me/{link}' },
  ],
  'swagger_2': [
    { title: 'SwaggerUI', urlTmpl: 'http://petstore.swagger.io/?url=https://crossorigin.me/{link}' },
    { title: 'SwaggerEditor', urlTmpl: 'http://editor.swagger.io/#/?import={link}' },
    { title: 'ReDoc', urlTmpl: 'http://rebilly.github.io/ReDoc/?url=https://crossorigin.me/{link}'}
  ]
}


chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.subject !== 'data') return;
  let $buttons = document.getElementById('buttons');
  let type = msg.data.type;
  let url = msg.data.url;
  let links = LINKS[type];
  if (!links) links = [];

  let $copyButton = document.createElement('a');
  $copyButton.innerHTML = 'Copy to clipboard';
  $copyButton.addEventListener('click', () => copyToClipboard(url));
  $buttons.appendChild($copyButton);

  for (let link of links) {
    let $aTag = document.createElement('a');
    $aTag.setAttribute('href', link.urlTmpl.replace('{link}', url));
    $aTag.setAttribute('target', '_blank');
    $aTag.innerHTML = link.title;
    $buttons.appendChild($aTag);
  }

  let $disableButton = document.createElement('a');
  $disableButton.innerText = 'Disable Extension';
  $disableButton.addEventListener('click', disableExt);
  $buttons.appendChild($disableButton);
});

chrome.runtime.sendMessage({from: 'popup', subject: 'getData'});

function copyToClipboard(url) {
  chrome.runtime.sendMessage({from: 'popup', subject: 'copy', data: url});
  window.close();
}
function disableExt() {
  chrome.runtime.sendMessage({from: 'popup', subject: 'disable'});
  window.close();
}
