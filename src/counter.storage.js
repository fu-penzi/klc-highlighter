export const counterStorage = {
  get: (cb) => {
    chrome.storage.sync.get(['count'], (result) => {
      cb(result.count);
    });
  },
  set: (value, cb) => {
    chrome.storage.sync.set(
      {
        count: value,
      },
      () => {
        cb();
      }
    );
  },
};
