import { ensureBrowserCompatibility, getSyncStorage } from "./utils/compatibility";
import { DATA_VAULT_URL, APP_KEY, APP_SECRET, SUBLIST } from "./constants/storageConstants";
import { REPO_URI } from "./constants/global";

import { Vaultifier } from "vaultifier";

ensureBrowserCompatibility();


const options = {};
options[DATA_VAULT_URL] = document.getElementById('txtDataVaultUrl');
options[APP_KEY] = document.getElementById('txtAppKey');
options[APP_SECRET] = document.getElementById('txtAppSecret');
options[SUBLIST] = document.getElementById('txtSublist');

const installCodeElement = document.getElementById('txtInstallCode');
const formInstallElement = document.getElementById('formInstall');

const statusElement = document.getElementById('status');
function setStatus(status) {
  statusElement.textContent = status;
}

// this variable only lets us access the browser storage synchronously and more conveniently :)
let storage = {};
async function checkValidity() {
  setStatus('Validating your input...');

  const dataVaultUrl = storage[DATA_VAULT_URL];
  const isValid = await new Vaultifier(
    dataVaultUrl,
    Vaultifier.getRepositoryPath(REPO_URI, storage[SUBLIST]),
    REPO_URI,
    storage[APP_KEY],
    storage[APP_SECRET],
  ).isValid();

  setStatus(
    isValid ?
      `Your browsing data is sent to "${dataVaultUrl}". Everything is ok :)` :
      'Your input seems to be invalid. No data will be tracked :('
  );
}

function getDefaultStorageObject() {
  const storageObj = {};

  storageObj[DATA_VAULT_URL] = 'https://data-vault.eu';
  storageObj[APP_KEY] = '';
  storageObj[APP_SECRET] = '';
  storageObj[SUBLIST] = '';

  return storageObj;
}

async function doInstall() {
  if (!installCodeElement.validity.valid)
    return;

  setStatus('Configuring the plugin...');

  // save options, so user can input data vault url without saving the form before doing the installation
  await saveUI({
    checkValidity: false,
  });

  const installCode = installCodeElement.value;
  const dataVaultUrl = storage[DATA_VAULT_URL];
  const credentials = await new Vaultifier(dataVaultUrl).resolveInstallCode(installCode);

  const { appKey, appSecret } = credentials;

  if (appKey && appSecret) {
    await setStorageEntry(APP_KEY, appKey);
    await setStorageEntry(APP_SECRET, appSecret);

    await restoreUI();
    checkValidity();

    formInstallElement.reset();
  }
  else
    setStatus(`"${dataVaultUrl}" says the installation code is invalid. Sorry about that :(`);
}

async function refreshUI() {
  await saveUI();
  await restoreUI();
}

async function saveUI(props = {}) {
  const storageObj = getDefaultStorageObject();
  for (const prop in options) {
    storageObj[prop] = options[prop].value || storageObj[prop];
  }

  await setStorageObj(storageObj);
  storage = storageObj;

  if (props.checkValidity !== false)
    checkValidity();
}

async function restoreUI() {
  const promise = getSyncStorage(Object.keys(options));
  promise.then(res => {
    storage = res;
    Object.keys(res).forEach(prop => {
      options[prop].value = res[prop] || '';
    });
  });

  return promise;
}

function setStorageEntry(key, value) {
  const storageObj = {};
  storageObj[key] = value;

  return setStorageObj(storageObj);
}

function setStorageObj(obj) {
  return browser.storage.sync.set(obj);
}

function preventDefault(event, func) {
  event.preventDefault();
  func();
}

// TODO: Macht es Sinn eine deviceGUID zu erstellen, damit man das Datentracking auseinanderziehen kann?
document.addEventListener('DOMContentLoaded', async () => {
  await restoreUI();
  checkValidity();
});
const advancedSettingsPanel = document.getElementById('advancedSettingsPanel');
const advancedSettings = document.getElementById('advancedSettings');

advancedSettings.addEventListener('submit', (e) => preventDefault(e, refreshUI));
formInstallElement.addEventListener('submit', (e) => preventDefault(e, doInstall));

document.getElementById('btnAdvancedSettings').addEventListener('click', () => {
  advancedSettingsPanel.hidden = !advancedSettingsPanel.hidden;
});