# OYD Browsing Plugin

This webbrowser plugin enables collecting data from your browser, saving it in your OwnYourData data vault.

## Instructions

* Register a OYD plugin in your OYD data vault, using the mainfest file `oyd-plugin-manifest.json`
* Clone or download this repository
* Execute `npm install` to install all dependencies
* Execute `npm build` to build a production version
* Install the browser extension according to one of these tutorials
  * Firefox: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing
  * Chrome: https://developer.chrome.com/extensions/getstarted#manifest (without the need of creating a manifest.json file, as it already exists in this repo)
* Configure the data vault url, app key, app secret and sublist (optional) within the extension options/preferences

npm-version used: 6.10.13 \
node-version used: 8.10.0

## Preferences/Options

### Data Vault URL
The url to your data vault (e.g. https://data-vault.eu)

### App Key and App Secret

In your data vault, click on your username, then on "Plugins". Find the Browsing-Plugin and click on "edit".

The field "Identifier" contains your app key.

The field "Secret" contains your app secret.

Both are necessary to successfully authenticate against your data vault.

### Sublist (optional)

This key can optionally be used to create a separate (named) data list within your data vault.