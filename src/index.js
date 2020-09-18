import { ensureBrowserCompatibility, getSyncStorage } from "./utils/compatibility";
import { REPO_URI } from "./constants/global";
import { DATA_VAULT_URL, APP_KEY, APP_SECRET, SUBLIST } from "./constants/storageConstants";
import { NAVIGATION } from "./constants/dataConstants";

import { Vaultifier } from "vaultifier";

ensureBrowserCompatibility();

let vault = null;
async function tryInitializeCommunicator() {
  const data = await getSyncStorage([DATA_VAULT_URL, APP_KEY, APP_SECRET, SUBLIST]);
  const _vault = new Vaultifier(
    data[DATA_VAULT_URL],
    Vaultifier.getRepositoryPath(REPO_URI, data[SUBLIST]),
    {
      appKey: data[APP_KEY],
      appSecret: data[APP_SECRET],
    },
  );
  await _vault.initialize();
  await _vault.setEnd2EndEncryption(true);

  vault = (await _vault.isValid()) ? _vault : undefined;
}

// use onCompleted to avoid interference with page load time
browser.webNavigation.onCompleted.addListener((details) => {
  if (!vault || details.frameId !== 0)
    return;

  vault.postValue({
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