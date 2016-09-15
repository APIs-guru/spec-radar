'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'Allo'});

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
  var spec = undefined;
  try {
    spec = JSON.parse(data)
  }
  catch (e) {
    console.log('Not a JSON');
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

  if (typeof spec.swaggerVersion === 'string')
    return {type: 'swagger_1', version: spec.swaggerVersion};

  if (spec.swagger === '2.0' || spec.swagger === 2.0)
    return {type: 'swagger_2', version: '2.0'};

  console.log('Type not detected');
  return {type: 'not_spec'};
}

function detectTypeFromUrl(url) {
  return makeRequest(url)
    .then(detectTypeFromData);
}

detectTypeFromUrl('http://petstore.swagger.io/v2/swagger.json')
  .then(result => console.log(result.type));


console.log('\'Allo \'Allo! Event Page for Browser Action');
