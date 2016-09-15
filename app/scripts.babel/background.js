'use strict';

var enabled = false;

chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('test');
  enabled = !enabled;
  if (enabled) {
    chrome.tabs.reload(tab.id);
    enableIcon(tab.id);
  } else {
    disableIcon(tab.id);
  }
});

chrome.webRequest.onHeadersReceived.addListener((details) => {
  if (!enabled) return;
  detectTypeFromUrl(details.url).then((res) => {
    if (res.type === 'not_spec') return;
    specDetected(details.url, res.type, details.tabId);
  });
}, {urls: ['<all_urls>'], types: ['xmlhttprequest']});

function makeRequest (url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(null);
  });
}

function detectTypeFromData(data) {
  function isPrefix(prefix) {
    return (prefix === data.substring(0, prefix.length));
  }

  if (isPrefix('#%RAML 0.8'))
    return {type: 'raml', version: '0.8'};
  if (isPrefix('#%RAML 1.0'))
    return {type: 'raml', version: '1.0'};

  if (isPrefix('FORMAT: '))
    return {type: 'api_blueprint', version: '1A'};

  var spec;
  var data_type;

  try {
    spec = JSON.parse(data)
    data_type = 'json';
  }
  catch (e) {
    console.log('Not a JSON');
    try {
      spec = jsyaml.safeLoad(data)
      data_type = 'yaml';
    } catch (e) {
      console.log('Not a YAML');
      try {
        var xmlParser = new DOMParser();
        spec = xmlParser.parseFromString(data, 'text/xml');
        data_type = 'xml';
      } catch (e) {
        console.log('Not a XML');
      }
    }
  }

  if (spec === undefined) {
    console.log('Can not parse');
    return {type: 'not_spec'};
  }

  var type = null;
  var version = null;
  if (typeof spec !== 'object') {
    console.log('Not an object');
    return {type: 'not_spec'};
  }

  if (typeof spec.swaggerVersion === 'string') {
    if (typeof spec.resourcePath === 'string') {
      console.log('Swagger 1.x resource file');
      return {type: 'not_spec'};
    }
    return {type: 'swagger_1', version: spec.swaggerVersion};
  }

  if (spec.swagger === '2.0' || spec.swagger === 2.0)
    return {type: 'swagger_2', version: '2.0'};

  console.log('Type not detected');
  return {type: 'not_spec'};
}

function detectTypeFromUrl(url) {
  return makeRequest(url)
    .then(detectTypeFromData);
}

function specDetected(url, type, tabId) {
  chrome.browserAction.setBadgeText({tabId, text: type.substring(0,2).toUpperCase()});
  //chrome.browserAction.enable(tabId);
}

function disableIcon(tabId) {
  chrome.browserAction.setIcon({ path: {
    '38': 'images/icon-silver-38.png',
    '128': 'images/icon-silver-128.png'
  }});

  chrome.browserAction.setBadgeText({tabId, text: '' });
}

function enableIcon(tabId) {
  chrome.browserAction.setIcon({ path: {
    '38': 'images/icon-38.png',
    '128': 'images/icon-128.png'
  }});
}
