const isChrome = !!globalThis.chrome;

export function ensureBrowserCompatibility() {
  // compatibiliy between firefox and chrome
  globalThis.browser = globalThis.browser || globalThis.chrome;
}

// Chrome does not return a promise, but takes a callback function
// Therefore we "promisify" chromes function here
export async function getSyncStorage(data) {
  if (isChrome) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(data, (result) => resolve(result));
    });
  }

  return browser.storage.sync.get(data);
}