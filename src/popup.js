'use strict';

import './popup.css';
import { counterStorage } from './counter.storage';

(function () {
  // We will make use of Storage API to get and store `count` value
  // More information on Storage API can we found at
  // https://developer.chrome.com/extensions/storage

  // To get storage access, we have to mention it in `permissions` property of manifest.json file
  // More information on Permissions can we found at
  // https://developer.chrome.com/extensions/declare_permissions

  function setCountHtmlValue(value = 0) {
    document.getElementById('counter').innerHTML = value;
  }

  function setupCounter(initialValue = 0) {
    setCountHtmlValue(initialValue);

    document.getElementById('form').addEventListener('submit', (event) => {
      event.preventDefault();
      let value = Number(document.getElementById('counterInput').value);

      if (!value && value !== 0) {
        return;
      }

      updateCounter(value);
    });
  }

  function updateCounter(newValue) {
    counterStorage.set(newValue, () => {
      setCountHtmlValue(newValue);

      // Communicate with content script of
      // active tab by sending a message
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        chrome.tabs.sendMessage(
          tab.id,
          {
            type: 'COUNT',
            payload: {
              count: newValue,
            },
          },
          (response) => {}
        );
      });
    });
  }

  function restoreCounter() {
    counterStorage.get((count) => {
      if (typeof count === 'undefined') {
        counterStorage.set(0, () => {
          setupCounter(0);
        });
      } else {
        setupCounter(count);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', restoreCounter);
})();
