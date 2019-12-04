import { OydCommunicator } from "./utils/oyd-communicator";
import { ensureBrowserCompatibility, getSyncStorage } from "./utils/compatibility";
import { REPO_URI } from "./constants/global";
import { DATA_VAULT_URL, APP_KEY, APP_SECRET, SUBLIST } from "./constants/storageConstants";
import { NAVIGATION } from "./constants/dataConstants";

ensureBrowserCompatibility();

let communicator = null;
async function tryInitializeCommunicator() {
  const data = await getSyncStorage([DATA_VAULT_URL, APP_KEY, APP_SECRET, SUBLIST]);
  communicator = new OydCommunicator(data[DATA_VAULT_URL], REPO_URI, data[APP_KEY], data[APP_SECRET], data[SUBLIST]);

  if (!(await communicator.isValid()))
    communicator = null;
}

// use onCompleted to avoid interference with page load time
browser.webNavigation.onCompleted.addListener((details) => {
  if (!communicator || details.frameId !== 0)
    return;

  communicator.sendData({
    url: details.url,
    timeStamp: details.timeStamp,
    userAgent: navigator.userAgent,
    type: NAVIGATION,
  });
});

tryInitializeCommunicator();
browser.storage.onChanged.addListener(() => tryInitializeCommunicator());

function openOptions() {
  browser.runtime.openOptionsPage();
}

browser.browserAction.onClicked.addListener(openOptions);
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === browser.runtime.OnInstalledReason.INSTALL)
    openOptions();
})