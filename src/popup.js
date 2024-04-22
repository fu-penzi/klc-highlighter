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
      const value = Number(document.getElementById('counterInput').value);

      if (!value && value !== 0) {
        return;
      }

      updateCounter(value);
    });
  }

  function updateCounter(newValue) {
    counterStorage.set(newValue, () => {
      setCountHtmlValue(newValue);
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
