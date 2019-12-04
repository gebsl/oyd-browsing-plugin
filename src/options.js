import { ensureBrowserCompatibility, getSyncStorage } from "./utils/compatibility";
import { DATA_VAULT_URL, APP_KEY, APP_SECRET, SUBLIST } from "./constants/storageConstants";
import { OydCommunicator } from "./utils/oyd-communicator";
import { REPO_URI } from "./constants/global";

ensureBrowserCompatibility();

const options = {};
options[DATA_VAULT_URL] = document.getElementById('txtDataVaultUrl');
options[APP_KEY] = document.getElementById('txtAppKey');
options[APP_SECRET] = document.getElementById('txtAppSecret');
options[SUBLIST] = document.getElementById('txtSublist');

const validityElement = document.getElementById('validity');

async function checkValidity(data) {
  validityElement.textContent = 'Validating your input...';
  const isValid = await new OydCommunicator(
    data[DATA_VAULT_URL],
    REPO_URI,
    data[APP_KEY],
    data[APP_SECRET],
    data[SUBLIST],
  ).isValid();

  validityElement.textContent =
    isValid ?
      'Everything ok :)' :
      'Your input seems to be invalid. No data will be tracked :(';
}

function saveOptions(e) {
  e.preventDefault();

  const storageObj = {};
  for (const prop in options) {
    storageObj[prop] = options[prop].value;
  }

  browser.storage.sync.set(storageObj);
  checkValidity(storageObj);
}

async function restoreOptions() {
  const promise = getSyncStorage(Object.keys(options));
  promise.then(res => {
    Object.keys(res).forEach(prop => {
      options[prop].value = res[prop] || '';
    });
  });

  return promise;
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await restoreOptions();
  checkValidity(data);
});
document.getElementsByTagName('form')[0].addEventListener('submit', saveOptions);