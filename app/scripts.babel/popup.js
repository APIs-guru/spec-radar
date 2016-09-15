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

const LANGS = [
  "akka-scala",
  "android",
  "async-scala",
  "clojure",
  "cpprest",
  "csharp",
  "CsharpDotNet2",
  "cwiki",
  "dart",
  "dynamic-html",
  "flash",
  "go",
  "groovy",
  "html",
  "html2",
  "java",
  "javascript",
  "javascript-closure-angular",
  "jmeter",
  "objc",
  "perl",
  "php",
  "python",
  "qt5cpp",
  "ruby",
  "scala",
  "swagger",
  "swagger-yaml",
  "swift",
  "tizen",
  "typescript-angular",
  "typescript-angular2",
  "typescript-fetch",
  "typescript-node"
]


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

  if (type.startsWith('swagger')) {
    let $sdkGenButton = document.createElement('a');
    let $select =  document.createElement('select');
    for (let lang of LANGS) {
      let $option =  document.createElement('option');
      $option.setAttribute('value', lang);
      $option.innerText = lang;
      $select.appendChild($option);
    }
    $sdkGenButton.innerHTML = 'Generate SDK:<br>';
    $sdkGenButton.appendChild($select);
    $buttons.appendChild($sdkGenButton);

    $select.addEventListener('change', () => {
      let lang = $select.value || $select.options[$select.selectedIndex].value;
      downloadSDK(lang, url);
    });
  }

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

function downloadSDK(lang, url) {
  chrome.runtime.sendMessage({from: 'popup', subject: 'sdk', data: {lang, url}});
  window.close();
}
